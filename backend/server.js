// server.js - FIXED ROUTES
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freshja', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Routes - CORRECTED PATHS
app.use('/api/auth', require('./src/routes/auth')); // Fixed path
app.use('/api/reset', require('./src/routes/reset')); // Fixed path
app.use('/api/user', require('./src/routes/user')); // Fixed path

// Other routes...
app.use('/api/banners', require('./src/routes/banners'));
app.use('/api/cart', require('./src/routes/cart'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/likes', require('./src/routes/likes'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/products', require('./src/routes/products'));

// Development routes
if (process.env.NODE_ENV === 'development') {
  app.use('/api/seed', require('./src/routes/seed'));
}

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'FreshJA API is running!' });
});

// Debug endpoint
app.get('/api/debug/auth', (req, res) => {
  res.json({ 
    message: 'Auth endpoint working',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Auth endpoint: http://localhost:${PORT}/api/auth`);
});