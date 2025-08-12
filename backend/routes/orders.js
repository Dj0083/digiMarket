const express = require('express');
const Joi = require('joi');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate unique order number
const generateOrderNumber = () => {
  return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Create order from cart
router.post('/', authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const schema = Joi.object({
      shipping_address: Joi.string().required(),
      billing_address: Joi.string().optional(),
      payment_method: Joi.string().valid('card', 'cash_on_delivery', 'bank_transfer').required(),
      promotion_code: Joi.string().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }

    const { shipping_address, billing_address, payment_method, promotion_code } = req.body;

    // Get cart items
    const [cartItems] = await connection.execute(`
      SELECT 
        sc.product_id,
        sc.quantity,
        p.price,
        p.discount_price,
        p.stock_quantity,
        p.vendor_id,
        p.name as product_name
      FROM shopping_cart sc
      JOIN products p ON sc.product_id = p.id
      WHERE sc.user_id = ? AND p.status = 'active'
    `, [req.user.id]);

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Cart is empty' 
      });
    }

    // Validate stock and calculate totals
    let subtotal = 0;
    for (const item of cartItems) {
      if (item.stock_quantity < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${item.product_name}` 
        });
      }
      
      const price = item.discount_price || item.price;
      subtotal += price * item.quantity;
    }

    // Apply promotions (simplified)
    let discount_amount = 0;
    if (promotion_code) {
      // In real implementation, validate promotion code
      discount_amount = subtotal * 0.1; // 10% discount example
    }

    const tax_amount = subtotal * 0.08; // 8% tax
    const shipping_amount = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total_amount = subtotal + tax_amount + shipping_amount - discount_amount;

    // Create order
    const orderNumber = generateOrderNumber();
    const [orderResult] = await connection.execute(`
      INSERT INTO orders (
        user_id, order_number, subtotal, tax_amount, shipping_amount, 
        discount_amount, total_amount, payment_method, shipping_address, 
        billing_address, estimated_delivery_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
    `, [
      req.user.id, orderNumber, subtotal, tax_amount, shipping_amount,
      discount_amount, total_amount, payment_method, shipping_address,
      billing_address || shipping_address
    ]);

    const orderId = orderResult.insertId;

    // Create order items and update stock
    for (const item of cartItems) {
      const price = item.discount_price || item.price;
      const totalPrice = price * item.quantity;

      // Insert order item
      await connection.execute(`
        INSERT INTO order_items (order_id, product_id, vendor_id, quantity, unit_price, total_price)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [orderId, item.product_id, item.vendor_id, item.quantity, price, totalPrice]);

      // Update product stock
      await connection.execute(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await connection.execute(
      'DELETE FROM shopping_cart WHERE user_id = ?',
      [req.user.id]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order_id: orderId,
        order_number: orderNumber,
        total_amount,
        estimated_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  } finally {
    connection.release();
  }
});

// Get user orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
    `;
    const queryParams = [req.user.id];

    if (status) {
      query += ` AND o.status = ?`;
      queryParams.push(status);
    }

    query += ` GROUP BY o.id ORDER BY o.created_at DESC`;

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), offset);

    const [orders] = await db.execute(query, queryParams);

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get order details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;

    // Get order details
    const [orderRows] = await db.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, req.user.id]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    const order = orderRows[0];

    // Get order items
    const [items] = await db.execute(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.sku,
        v.business_name as vendor_name,
        pi.image_url as product_image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN vendors v ON oi.vendor_id = v.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE oi.order_id = ?
    `, [orderId]);

    res.json({
      success: true,
      data: {
        order: {
          ...order,
          items
        }
      }
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update order status (for admin/vendor)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const schema = Joi.object({
      status: Joi.string().valid('confirmed', 'processing', 'shipped', 'delivered', 'cancelled').required(),
      tracking_number: Joi.string().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }

    const orderId = req.params.id;
    const { status, tracking_number } = req.body;

    // In a real app, you'd check if user has permission to update this order
    const updateFields = ['status = ?'];
    const updateValues = [status];

    if (tracking_number) {
      updateFields.push('tracking_number = ?');
      updateValues.push(tracking_number);
    }

    updateValues.push(orderId);

    await db.execute(
      `UPDATE orders SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Cancel order
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const orderId = req.params.id;

    // Get order details
    const [orderRows] = await connection.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ? AND status IN ("pending", "confirmed")',
      [orderId, req.user.id]
    );

    if (orderRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found or cannot be cancelled' 
      });
    }

    // Get order items to restore stock
    const [items] = await connection.execute(
      'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
      [orderId]
    );

    // Restore stock for each item
    for (const item of items) {
      await connection.execute(
        'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Update order status
    await connection.execute(
      'UPDATE orders SET status = "cancelled", updated_at = NOW() WHERE id = ?',
      [orderId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  } finally {
    connection.release();
  }
});

module.exports = router;