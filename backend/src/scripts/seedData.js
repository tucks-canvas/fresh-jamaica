const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freshja');
    console.log('MongoDB connected for seeding');
  } 
  catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        fullName: 'John Brown',
        email: 'farmer@freshja.com',
        phone: '876-555-0001',
        password: 'password123',
        role: 'farmer',
        status: 'active',
        address: {
          street: '123 Farm Road',
          city: 'Kingston',
          parish: 'St. Andrew'
        }
      },
      {
        fullName: 'Sarah Reid',
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
      }
    ]);

    // Create sample products with proper data structure
    const products = await Product.create([
      {
        name: 'Fresh Tomatoes',
        title: 'Organic Red Tomatoes',
        seller: 'R & B Farms Ltd',
        description: 'Freshly picked organic tomatoes from local farm, perfect for salads and cooking',
        about: 'Family-owned farm serving the community for over 20 years',
        nutrition: 'Rich in Vitamin C and antioxidants',
        fact: 'Versatile for cooking and fresh consumption',
        category: 'vegetables',
        grading: 'A+',
        topic: 'Fresh Vegetables',
        price: 300, // Original price
        discountPrice: 250, // Discounted price (lower than original)
        percentage: '17%',
        calories: 18,
        carbs: 3.9,
        protein: 0.9,
        fat: 0.2,
        fiber: 1.2,
        vitamin: 14,
        potassium: 237,
        images: ['tomato.jpg'],
        is_organic: true,
        rating: 4.5,
        stock: 50,
        unit: 'kg',
        sellerId: users[0]._id
      },
      {
        name: 'Sweet Bananas',
        title: 'Jamaican Sweet Bananas',
        seller: 'Tropical Fruits Ltd',
        description: 'Sweet ripe bananas from St. Mary, perfect for smoothies and snacks',
        about: 'Known for delivering high-quality tropical fruits across Jamaica',
        nutrition: 'Excellent source of potassium and Vitamin B6',
        fact: 'Naturally sweet and energy-boosting',
        category: 'fruits',
        grading: 'A',
        topic: 'Tropical Fruits',
        price: 180,
        discountPrice: 150,
        percentage: '17%',
        calories: 89,
        carbs: 22.8,
        protein: 1.1,
        fat: 0.3,
        fiber: 2.6,
        vitamin: 8.7,
        potassium: 358,
        images: ['banana.jpg'],
        is_organic: true,
        rating: 4.8,
        stock: 30,
        unit: 'bunch',
        sellerId: users[0]._id
      },
      {
        name: 'Callaloo',
        title: 'Fresh Jamaican Callaloo',
        seller: 'Green Acres Farm',
        description: 'Nutritious leafy greens perfect for traditional Jamaican soups and steam',
        about: 'Harvested daily for maximum freshness and nutritional value',
        nutrition: 'Packed with iron and vitamins',
        fact: 'Staple in Caribbean cuisine',
        category: 'vegetables',
        grading: 'A',
        topic: 'Leafy Greens',
        price: 120,
        discountPrice: 100,
        percentage: '17%',
        calories: 32,
        carbs: 5.6,
        protein: 3.2,
        fat: 0.4,
        fiber: 2.1,
        vitamin: 105,
        potassium: 285,
        images: ['callaloo.jpg'],
        is_organic: false,
        rating: 4.3,
        stock: 25,
        unit: 'bunch',
        sellerId: users[0]._id
      },
      {
        name: 'Scotch Bonnet Pepper',
        title: 'Hot Scotch Bonnet Peppers',
        seller: 'Spice Masters Ltd',
        description: 'Authentic Jamaican scotch bonnet peppers with perfect heat level',
        about: 'Specializing in authentic Jamaican spices and peppers',
        nutrition: 'High in capsaicin and Vitamin C',
        fact: 'Essential for Jamaican jerk seasoning',
        category: 'vegetables',
        grading: 'A+',
        topic: 'Spices & Peppers',
        price: 350,
        discountPrice: 300,
        percentage: '14%',
        calories: 40,
        carbs: 8.8,
        protein: 1.9,
        fat: 0.4,
        fiber: 1.5,
        vitamin: 144,
        potassium: 322,
        images: ['pepper.jpg'],
        is_organic: true,
        rating: 4.7,
        stock: 15,
        unit: 'lb',
        sellerId: users[0]._id
      },
      {
        name: 'Ackee',
        title: 'Fresh Jamaican Ackee',
        seller: 'Island Pride Farms',
        description: 'National fruit of Jamaica, perfect for ackee and saltfish breakfast',
        about: 'Premium quality ackee carefully harvested and prepared',
        nutrition: 'Good source of healthy fats and fiber',
        fact: 'Jamaicas national fruit',
        category: 'fruits',
        grading: 'A+',
        topic: 'Traditional Fruits',
        price: 450,
        discountPrice: 400,
        percentage: '11%',
        calories: 151,
        carbs: 0.8,
        protein: 2.9,
        fat: 15.2,
        fiber: 2.7,
        vitamin: 38,
        potassium: 270,
        images: ['ackee.jpg'],
        is_organic: true,
        rating: 4.9,
        stock: 20,
        unit: 'dozen',
        sellerId: users[0]._id
      },
      {
        name: 'Sweet Potatoes',
        title: 'Jamaican Sweet Potatoes',
        seller: 'R & B Farms Ltd',
        description: 'Naturally sweet and nutritious root vegetable',
        about: 'Grown in rich Jamaican soil for optimal flavor',
        nutrition: 'High in Vitamin A and fiber',
        fact: 'Versatile for both sweet and savory dishes',
        category: 'vegetables',
        grading: 'A',
        topic: 'Root Vegetables',
        price: 200,
        discountPrice: 180,
        percentage: '10%',
        calories: 86,
        carbs: 20.1,
        protein: 1.6,
        fat: 0.1,
        fiber: 3.0,
        vitamin: 14187,
        potassium: 337,
        images: ['potato.jpg'],
        is_organic: true,
        rating: 4.4,
        stock: 40,
        unit: 'kg',
        sellerId: users[0]._id
      },
      {
        name: 'Fresh Ginger',
        title: 'Organic Fresh Ginger Root',
        seller: 'Spice Masters Ltd',
        description: 'Aromatic ginger root perfect for teas, cooking, and natural remedies',
        about: 'Specializing in organic herbs and spices',
        nutrition: 'Rich in antioxidants and anti-inflammatory compounds',
        fact: 'Natural remedy for nausea and inflammation',
        category: 'vegetables',
        grading: 'A',
        topic: 'Herbs & Spices',
        price: 280,
        discountPrice: 250,
        percentage: '11%',
        calories: 80,
        carbs: 17.8,
        protein: 1.8,
        fat: 0.8,
        fiber: 2.0,
        vitamin: 5,
        potassium: 415,
        images: ['ginger.jpg'],
        is_organic: true,
        rating: 4.6,
        stock: 18,
        unit: 'lb',
        sellerId: users[0]._id
      },
      {
        name: 'Green Plantains',
        title: 'Fresh Green Plantains',
        seller: 'Tropical Fruits Ltd',
        description: 'Versatile plantains perfect for frying, boiling, or making chips',
        about: 'Sourced from local Jamaican farms',
        nutrition: 'Good source of complex carbohydrates',
        fact: 'Staple in Caribbean and African cuisines',
        category: 'fruits',
        grading: 'A',
        topic: 'Traditional Staples',
        price: 220,
        discountPrice: 200,
        percentage: '9%',
        calories: 122,
        carbs: 31.9,
        protein: 1.3,
        fat: 0.4,
        fiber: 2.3,
        vitamin: 56,
        potassium: 499,
        images: ['plantain.jpg'],
        is_organic: false,
        rating: 4.5,
        stock: 35,
        unit: 'bunch',
        sellerId: users[0]._id
      }
    ]);

    console.log('Seed data created successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${products.length} products`);
    
    console.log('\n=== TEST CREDENTIALS ===');
    console.log('Farmer: farmer@freshja.com / password123');
    console.log('Customer: customer@freshja.com / password123');
    console.log('Delivery: delivery@freshja.com / password123');
    
    console.log('\n=== PRODUCTS CREATED ===');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - JMD ${product.discountPrice || product.price} (${product.grading})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();