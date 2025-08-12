const express = require('express');
const Joi = require('joi');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [cartItems] = await db.execute(`
      SELECT 
        sc.id as cart_id,
        sc.quantity,
        sc.created_at as added_at,
        p.id as product_id,
        p.name,
        p.price,
        p.discount_price,
        p.stock_quantity,
        p.status,
        v.business_name as vendor_name,
        pi.image_url as primary_image
      FROM shopping_cart sc
      JOIN products p ON sc.product_id = p.id
      LEFT JOIN vendors v ON p.vendor_id = v.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE sc.user_id = ? AND p.status = 'active'
      ORDER BY sc.created_at DESC
    `, [req.user.id]);

    // Calculate totals
    let subtotal = 0;
    const validItems = cartItems.filter(item => {
      const price = item.discount_price || item.price;
      subtotal += price * item.quantity;
      return item.stock_quantity > 0;
    });

    res.json({
      success: true,
      data: {
        items: validItems,
        summary: {
          item_count: validItems.length,
          total_quantity: validItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: subtotal.toFixed(2)
        }
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Add item to cart
router.post('/items', authenticateToken, async (req, res) => {
  try {
    const schema = Joi.object({
      product_id: Joi.number().integer().positive().required(),
      quantity: Joi.number().integer().min(1).max(100).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }

    const { product_id, quantity } = req.body;

    // Check if product exists and is available
    const [productRows] = await db.execute(
      'SELECT id, stock_quantity, status FROM products WHERE id = ?',
      [product_id]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    const product = productRows[0];

    if (product.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        message: 'Product is not available' 
      });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${product.stock_quantity} items available in stock` 
      });
    }

    // Check if item already exists in cart
    const [existingItem] = await db.execute(
      'SELECT id, quantity FROM shopping_cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existingItem.length > 0) {
      // Update existing item
      const newQuantity = existingItem[0].quantity + quantity;
      
      if (newQuantity > product.stock_quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Cannot add more items. Maximum available: ${product.stock_quantity}` 
        });
      }

      await db.execute(
        'UPDATE shopping_cart SET quantity = ?, updated_at = NOW() WHERE id = ?',
        [newQuantity, existingItem[0].id]
      );
    } else {
      // Add new item
      await db.execute(
        'INSERT INTO shopping_cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, product_id, quantity]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update cart item quantity
router.put('/items/:cartId', authenticateToken, async (req, res) => {
  try {
    const schema = Joi.object({
      quantity: Joi.number().integer().min(1).max(100).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }

    const { cartId } = req.params;
    const { quantity } = req.body;

    // Check if cart item exists and belongs to user
    const [cartRows] = await db.execute(`
      SELECT sc.id, sc.product_id, p.stock_quantity 
      FROM shopping_cart sc
      JOIN products p ON sc.product_id = p.id
      WHERE sc.id = ? AND sc.user_id = ?
    `, [cartId, req.user.id]);

    if (cartRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart item not found' 
      });
    }

    const cartItem = cartRows[0];

    if (quantity > cartItem.stock_quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${cartItem.stock_quantity} items available in stock` 
      });
    }

    await db.execute(
      'UPDATE shopping_cart SET quantity = ?, updated_at = NOW() WHERE id = ?',
      [quantity, cartId]
    );

    res.json({
      success: true,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Remove item from cart
router.delete('/items/:cartId', authenticateToken, async (req, res) => {
  try {
    const { cartId } = req.params;

    const [result] = await db.execute(
      'DELETE FROM shopping_cart WHERE id = ? AND user_id = ?',
      [cartId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart item not found' 
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Clear cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await db.execute(
      'DELETE FROM shopping_cart WHERE user_id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Apply promotion/discount
router.post('/apply-promotion', authenticateToken, async (req, res) => {
  try {
    const schema = Joi.object({
      promotion_code: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }

    // This is a placeholder for promotion logic
    // In a real implementation, you would validate the promotion code
    // and calculate the discount based on cart contents

    res.json({
      success: true,
      message: 'Promotion applied successfully',
      data: {
        discount_amount: 10.00,
        promotion_code: req.body.promotion_code
      }
    });
  } catch (error) {
    console.error('Apply promotion error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;