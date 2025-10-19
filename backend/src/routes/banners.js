const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');

// Get all active banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ status: 'active' }).sort({ order: 1 });

    res.json({
      success: true,
      data: {
        banners
      }
    });
  } catch (error) {
    console.error('Banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading banners',
      error: error.message
    });
  }
});

module.exports = router;