const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Banner = require('../models/Banner');
const auth = require('../middleware/auth');

// Get home page data (products, categories, banners)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    
    // Build query for products
    let productQuery = { status: 'active' };
    
    if (category && category !== 'all' && category !== 'null') {
      productQuery.category = category;
    }
    
    if (search) {
      productQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get products
    const products = await Product.find(productQuery)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    // Get categories
    const categories = await Category.find({ status: 'active' });

    // Get banners
    const banners = await Banner.find({ status: 'active' });

    // Get featured products (you can customize this logic)
    const featuredProducts = await Product.find({ 
      status: 'active',
      is_featured: true 
    }).limit(8);

    res.json({
      success: true,
      data: {
        products,
        categories,
        banners,
        featuredProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(await Product.countDocuments(productQuery) / limit),
          totalProducts: await Product.countDocuments(productQuery)
        }
      }
    });
  } catch (error) {
    console.error('Home data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading home data',
      error: error.message
    });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q: searchQuery, category, page = 1, limit = 20 } = req.query;
    
    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    let query = { 
      status: 'active',
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { seller: { $regex: searchQuery, $options: 'i' } }
      ]
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
});

// Get products by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const products = await Product.find({ 
      category: categoryId,
      status: 'active'
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ 
      category: categoryId,
      status: 'active'
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Category products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading category products',
      error: error.message
    });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ 
      status: 'active',
      is_featured: true 
    }).limit(12);

    res.json({
      success: true,
      data: {
        featuredProducts
      }
    });
  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading featured products',
      error: error.message
    });
  }
});

module.exports = router;