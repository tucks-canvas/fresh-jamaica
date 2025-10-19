const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all products (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    
    console.log('📦 Products query received:', { category, search, page, limit });
    
    let query = { status: 'active' };
    
    if (category && category !== 'all' && category !== 'null') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { seller: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('📦 MongoDB query:', query);

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    console.log(`📦 Found ${products.length} products`);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('❌ Products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get my products (PROTECTED - for farmers/sellers) - ADD THIS ROUTE
router.get('/my-products', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    console.log('👨‍🌾 My products request from user:', req.user.id);
    
    const products = await Product.find({ sellerId: req.user.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ sellerId: req.user.id });

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('❌ My products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product (PUBLIC)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (PROTECTED - for farmers/sellers)
router.post('/', auth, async (req, res) => {
  try {
    // Only farmers can create products
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can create products' });
    }

    const productData = {
      ...req.body,
      sellerId: req.user.id,
      seller: req.user.fullName
    };
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({ product });
  } catch (error) {
    console.error('❌ Create product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product (PROTECTED - owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, sellerId: req.user.id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ product: updatedProduct });
  } catch (error) {
    console.error('❌ Update product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product (PROTECTED - owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, sellerId: req.user.id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Delete product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;