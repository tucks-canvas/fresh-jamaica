const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ status: 'active' }).sort({ order: 1 });

    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading categories',
      error: error.message
    });
  }
});

module.exports = router;