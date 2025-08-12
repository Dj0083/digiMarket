const express = require('express');

const Joi = require('joi');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get product reviews
router.get('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    let orderBy = 'pr.created_at DESC';
    if (sort === 'oldest') orderBy = 'pr.created_at ASC';
    else if (sort === 'highest_rating') orderBy = 'pr.rating DESC, pr.created_at DESC';
    else if (sort === 'lowest_rating') orderBy = 'pr.rating ASC, pr.created_at DESC';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [reviews] = await db.execute(`
      SELECT 
        pr.*,
        u.first_name,
        u.last_name,
        pr.is_verified_purchase
      FROM product_reviews pr
      LEFT JOIN users u ON pr.user_id = u.id
      WHERE pr.product_id = ?
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `, [productId, parseInt(limit), offset]);

    // Get review statistics
    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM product_reviews 
      WHERE product_id = ?
    `, [productId]);

    const reviewStats = stats[0];
    reviewStats.average_rating = parseFloat(reviewStats.average_rating || 0).toFixed(2);

    res.json({
      success: true,
      data: {  
        reviews,
        stats: reviewStats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(reviewStats.total_reviews),
          pages: Math.ceil(reviewStats.total_reviews / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Add product review
router.post('/products/:productId', authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const schema = Joi.object({
      rating: Joi.number().integer().min(1).max(5).required(),
      title: Joi.string().max(255).optional(),
      comment: Joi.string().max(1000).optional(),
      order_id: Joi.number().integer().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }

    const { productId } = req.params;
    const { rating, title, comment, order_id } = req.body;

    // Check if user already reviewed this product
    const [existingReview] = await connection.execute(
      'SELECT id FROM product_reviews WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );

    if (existingReview.length > 0) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this product' 
      });
    }

    // Verify product exists
    const [productRows] = await connection.execute(
      'SELECT id FROM products WHERE id = ?',
      [productId]
    );

    if (productRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check if this is a verified purchase
    let isVerifiedPurchase = false;
    if (order_id) {
      const [orderCheck] = await connection.execute(`
        SELECT oi.id 
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.user_id = ? AND oi.product_id = ? AND o.id = ? AND o.status = 'delivered'
      `, [req.user.id, productId, order_id]);
      
      isVerifiedPurchase = orderCheck.length > 0;
    }

    // Insert review
    await connection.execute(`
      INSERT INTO product_reviews (product_id, user_id, order_id, rating, title, comment, is_verified_purchase)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [productId, req.user.id, order_id, rating, title, comment, isVerifiedPurchase]);

    // Update product rating
    const [ratingStats] = await connection.execute(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
      FROM product_reviews
      WHERE product_id = ?
    `, [productId]);

    await connection.execute(
      'UPDATE products SET rating = ?, total_reviews = ? WHERE id = ?',
      [parseFloat(ratingStats[0].avg_rating).toFixed(2), ratingStats[0].review_count, productId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Add review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  } finally {
    connection.release();
  }
});

// Update product review
router.put('/products/:productId/:reviewId', authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const schema = Joi.object({
      rating: Joi.number().integer().min(1).max(5).required(),
      title: Joi.string().max(255).optional(),
      comment: Joi.string().max(1000).optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }

    const { productId, reviewId } = req.params;
    const { rating, title, comment } = req.body;

    // Verify review belongs to user
    const [reviewCheck] = await connection.execute(
      'SELECT id FROM product_reviews WHERE id = ? AND user_id = ? AND product_id = ?',
      [reviewId, req.user.id, productId]
    );

    if (reviewCheck.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    // Update review
    await connection.execute(
      'UPDATE product_reviews SET rating = ?, title = ?, comment = ?, updated_at = NOW() WHERE id = ?',
      [rating, title, comment, reviewId]
    );

    // Update product rating
    const [ratingStats] = await connection.execute(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
      FROM product_reviews
      WHERE product_id = ?
    `, [productId]);

    await connection.execute(
      'UPDATE products SET rating = ? WHERE id = ?',
      [parseFloat(ratingStats[0].avg_rating).toFixed(2), productId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Review updated successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Update review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  } finally {
    connection.release();
  }
});

// Delete product review
router.delete('/products/:productId/:reviewId', authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { productId, reviewId } = req.params;

    // Verify review belongs to user
    const [result] = await connection.execute(
      'DELETE FROM product_reviews WHERE id = ? AND user_id = ? AND product_id = ?',
      [reviewId, req.user.id, productId]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    // Update product rating
    const [ratingStats] = await connection.execute(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
      FROM product_reviews
      WHERE product_id = ?
    `, [productId]);

    const avgRating = ratingStats[0].avg_rating ? parseFloat(ratingStats[0].avg_rating).toFixed(2) : 0;
    
    await connection.execute(
      'UPDATE products SET rating = ?, total_reviews = ? WHERE id = ?',
      [avgRating, ratingStats[0].review_count, productId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Delete review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  } finally {
    connection.release();
  }
});

// Get vendor reviews
router.get('/vendors/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [reviews] = await db.execute(`
      SELECT 
        vr.*,
        u.first_name,
        u.last_name
      FROM vendor_reviews vr
      LEFT JOIN users u ON vr.user_id = u.id
      WHERE vr.vendor_id = ?
      ORDER BY vr.created_at DESC
      LIMIT ? OFFSET ?
    `, [vendorId, parseInt(limit), offset]);

    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating
      FROM vendor_reviews 
      WHERE vendor_id = ?
    `, [vendorId]);

    res.json({
      success: true,
      data: {
        reviews,
        stats: {
          total_reviews: stats[0].total_reviews,
          average_rating: parseFloat(stats[0].average_rating || 0).toFixed(2)
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(stats[0].total_reviews),
          pages: Math.ceil(stats[0].total_reviews / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get vendor reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Add vendor review
router.post('/vendors/:vendorId', authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const schema = Joi.object({
      rating: Joi.number().integer().min(1).max(5).required(),
      comment: Joi.string().max(1000).optional(),
      order_id: Joi.number().integer().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }

    const { vendorId } = req.params;
    const { rating, comment, order_id } = req.body;

    // Check if user already reviewed this vendor
    const [existingReview] = await connection.execute(
      'SELECT id FROM vendor_reviews WHERE user_id = ? AND vendor_id = ?',
      [req.user.id, vendorId]
    );

    if (existingReview.length > 0) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this vendor' 
      });
    }

    // Insert vendor review
    await connection.execute(
      'INSERT INTO vendor_reviews (vendor_id, user_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [vendorId, req.user.id, order_id, rating, comment]
    );

    // Update vendor rating
    const [ratingStats] = await connection.execute(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
      FROM vendor_reviews
      WHERE vendor_id = ?
    `, [vendorId]);

    await connection.execute(
      'UPDATE vendors SET rating = ?, total_reviews = ? WHERE id = ?',
      [parseFloat(ratingStats[0].avg_rating).toFixed(2), ratingStats[0].review_count, vendorId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Vendor review added successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Add vendor review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  } finally {
    connection.release();
  }
});

module.exports = router;