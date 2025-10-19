const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get liked products
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('likedProducts');
    res.json(user.likedProducts || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle like
router.post('/toggle', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    
    const isLiked = user.likedProducts.includes(productId);
    
    if (isLiked) {
      user.likedProducts = user.likedProducts.filter(id => id.toString() !== productId);
    } else {
      user.likedProducts.push(productId);
    }
    
    await user.save();
    await user.populate('likedProducts');
    
    res.json({ 
      liked: !isLiked,
      likedProducts: user.likedProducts 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;