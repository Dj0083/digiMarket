const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.execute(`
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    // Organize categories hierarchically
    const categoryMap = {};
    const rootCategories = [];

    // First pass: create category objects
    categories.forEach(cat => {
      categoryMap[cat.id] = {
        ...cat,
        children: []
      };
    });

    // Second pass: organize hierarchy
    categories.forEach(cat => {
      if (cat.parent_id) {
        if (categoryMap[cat.parent_id]) {
          categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
        }
      } else {
        rootCategories.push(categoryMap[cat.id]);
      }
    });

    res.json({
      success: true,
      data: { 
        categories: rootCategories,
        flat_categories: categories 
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get category by ID with products
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { page = 1, limit = 20 } = req.query;

    // Get category details
    const [categoryRows] = await db.execute(
      'SELECT * FROM categories WHERE id = ?',
      [categoryId]
    );

    if (categoryRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    const category = categoryRows[0];

    // Get products in this category
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [products] = await db.execute(`
      SELECT 
        p.*, 
        v.business_name as vendor_name,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN vendors v ON p.vendor_id = v.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE p.category_id = ? AND p.status = 'active'
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [categoryId, parseInt(limit), offset]);

    // Get total count
    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM products WHERE category_id = ? AND status = "active"',
      [categoryId]
    );

    res.json({
      success: true,
      data: {
        category,
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get category details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;