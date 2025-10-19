const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const router = express.Router();

// ONLY FOR DEVELOPMENT - REMOVE IN PRODUCTION
router.post('/', async (req, res) => {
  try {
    console.log('Starting seed data creation...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        fullName: 'John Farmer',
        email: 'farmer@freshja.com',
        phone: '876-555-0001',
        password: 'password123',
        role: 'farmer',
        status: 'active',
        address: {
          street: '123 Farm Road',
          city: 'Kingston',
          parish: 'St. Andrew'
        },
        documents: {
          license: 'farm_license_001',
          trn: '123-456-789',
          permit: 'farm_permit_001'
        }
      },
      {
        fullName: 'Sarah Customer',
        email: 'customer@freshja.com',
        phone: '876-555-0002',
        password: 'password123',
        role: 'customer',
        status: 'active',
        address: {
          street: '456 Customer Ave',
          city: 'Montego Bay',
          parish: 'St. James'
        }
      },
      {
        fullName: 'Mike Delivery',
        email: 'delivery@freshja.com',
        phone: '876-555-0003',
        password: 'password123',
        role: 'delivery',
        status: 'active'
      },
      {
        fullName: 'Admin User',
        email: 'admin@freshja.com',
        phone: '876-555-0004',
        password: 'password123',
        role: 'admin',
        status: 'active'
      }
    ]);

    // Create sample products
    const products = await Product.create([
      {
        name: 'Fresh Tomatoes',
        title: 'Organic Red Tomatoes',
        seller: 'John Farmer',
        description: 'Freshly picked organic tomatoes from local farm',
        about: 'Grown using sustainable farming practices in the hills of St. Andrew',
        nutrition: 'Rich in Vitamin C and antioxidants',
        fact: 'Harvested daily at peak ripeness',
        category: 'vegetables',
        grading: 'A',
        topic: 'Organic Farming',
        price: 250,
        discountPrice: 200,
        percentage: '20%',
        calories: 18,
        carbs: 4,
        protein: 1,
        fat: 0,
        fiber: 1,
        vitamin: 28,
        potassium: 292,
        images: ['tomato.jpg'],
        is_organic: true,
        rating: 4.5,
        status: 'active',
        stock: 50,
        unit: 'kg',
        sellerId: users[0]._id
      },
      {
        name: 'Sweet Bananas',
        title: 'Jamaican Sweet Bananas',
        seller: 'John Farmer',
        description: 'Sweet ripe bananas from St. Mary',
        about: 'Naturally grown without pesticides in fertile Jamaican soil',
        nutrition: 'High in potassium and natural sugars',
        fact: 'Each bunch is hand-selected for quality',
        category: 'fruits',
        grading: 'A',
        topic: 'Tropical Fruits',
        price: 150,
        calories: 89,
        carbs: 23,
        protein: 1,
        fat: 0,
        fiber: 3,
        vitamin: 14,
        potassium: 358,
        images: ['banana.jpg'],
        is_organic: true,
        rating: 4.8,
        status: 'active',
        stock: 30,
        unit: 'bunch',
        sellerId: users[0]._id
      },
      {
        name: 'Callaloo',
        title: 'Fresh Jamaican Callaloo',
        seller: 'John Farmer',
        description: 'Nutritious leafy greens perfect for soups and steam',
        about: 'Harvested daily for maximum freshness and nutritional value',
        nutrition: 'Packed with iron and vitamins',
        fact: 'Traditional Jamaican staple food',
        category: 'vegetables',
        grading: 'A',
        topic: 'Leafy Greens',
        price: 100,
        calories: 25,
        carbs: 4,
        protein: 3,
        fat: 0,
        fiber: 2,
        vitamin: 80,
        potassium: 400,
        images: ['callaloo.jpg'],
        is_organic: false,
        rating: 4.3,
        status: 'active',
        stock: 25,
        unit: 'bunch',
        sellerId: users[0]._id
      },
      {
        name: 'Scotch Bonnet Pepper',
        title: 'Hot Scotch Bonnet Peppers',
        seller: 'John Farmer',
        description: 'Authentic Jamaican scotch bonnet peppers with perfect heat',
        about: 'Grown in sunny fields with natural irrigation',
        nutrition: 'Rich in capsaicin and Vitamin C',
        fact: 'One of the hottest peppers in the Caribbean',
        category: 'vegetables',
        grading: 'A',
        topic: 'Spices & Peppers',
        price: 300,
        calories: 40,
        carbs: 9,
        protein: 2,
        fat: 0,
        fiber: 1,
        vitamin: 240,
        potassium: 340,
        images: ['pepper.jpg'],
        is_organic: true,
        rating: 4.7,
        status: 'active',
        stock: 15,
        unit: 'lb',
        sellerId: users[0]._id
      },
      {
        name: 'Ackee',
        title: 'Fresh Jamaican Ackee',
        seller: 'John Farmer',
        description: 'National fruit of Jamaica, perfect for ackee and saltfish',
        about: 'Carefully harvested and prepared following traditional methods',
        nutrition: 'Good source of healthy fats and fiber',
        fact: 'Jamaica\'s national fruit',
        category: 'fruits',
        grading: 'A',
        topic: 'Jamaican Staples',
        price: 400,
        calories: 151,
        carbs: 1,
        protein: 3,
        fat: 15,
        fiber: 3,
        vitamin: 43,
        potassium: 270,
        images: ['ackee.jpg'],
        is_organic: true,
        rating: 4.9,
        status: 'active',
        stock: 20,
        unit: 'dozen',
        sellerId: users[0]._id
      },
      {
        name: 'Sweet Potatoes',
        title: 'Jamaican Sweet Potatoes',
        seller: 'John Farmer',
        description: 'Naturally sweet and nutritious root vegetable',
        about: 'Grown in rich Jamaican soil with natural fertilizers',
        nutrition: 'High in fiber and complex carbohydrates',
        fact: 'Rich in beta-carotene and antioxidants',
        category: 'vegetables',
        grading: 'A',
        topic: 'Root Vegetables',
        price: 180,
        discountPrice: 150,
        percentage: '17%',
        calories: 86,
        carbs: 20,
        protein: 2,
        fat: 0,
        fiber: 3,
        vitamin: 283,
        potassium: 337,
        images: ['sweet_potato.jpg'],
        is_organic: true,
        rating: 4.6,
        status: 'active',
        stock: 40,
        unit: 'kg',
        sellerId: users[0]._id
      }
    ]);

    console.log('Seed data created successfully!');
    
    res.json({ 
      message: 'Seed data created successfully',
      users: users.length,
      products: products.length,
      testCredentials: {
        farmer: { email: 'farmer@freshja.com', password: 'password123' },
        customer: { email: 'customer@freshja.com', password: 'password123' },
        delivery: { email: 'delivery@freshja.com', password: 'password123' },
        admin: { email: 'admin@freshja.com', password: 'password123' }
      }
    });
    
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({ 
      message: 'Error seeding data',
      error: error.message 
    });
  }
});

// Get seed status
router.get('/', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    
    res.json({
      users: userCount,
      products: productCount,
      hasData: userCount > 0 && productCount > 0
    });
  } catch (error) {
    console.error('Error checking seed status:', error);
    res.status(500).json({ message: 'Error checking seed status' });
  }
});

module.exports = router;