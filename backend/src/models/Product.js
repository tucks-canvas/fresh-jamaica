const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  seller: {
    type: String,
    required: true
  },
  description: String,
  about: String,
  nutrition: String,
  fact: String,
  category: {
    type: String,
    required: true
  },
  grading: {
    type: String,
    default: 'A'
  },
  topic: String,
  price: {
    type: Number,
    required: true
  },
  discountPrice: Number,
  percentage: String,
  calories: Number,
  carbs: Number,
  protein: Number,
  fat: Number,
  fiber: Number,
  vitamin: Number,
  potassium: Number,
  images: [String],
  is_organic: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'active'
  },
  stock: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'kg'
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
module.exports = Product;