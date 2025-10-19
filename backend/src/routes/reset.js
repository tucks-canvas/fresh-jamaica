// routes/passwordReset.js
const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../services/auth/emailService');
const router = express.Router();

// Store reset codes temporarily (in production, use Redis)
const resetCodes = new Map();

router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    resetCodes.set(email, { code, expiresAt, userId: user._id });

    // Send email
    await emailService.sendVerificationCode(email, code);

    res.json({ 
      message: 'Verification code sent to your email',
      userId: user._id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-code', async (req, res) => {
  try {
    const { userId, code } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const storedData = resetCodes.get(user.email);
    
    if (!storedData || storedData.code !== code) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    if (Date.now() > storedData.expiresAt) {
      resetCodes.delete(user.email);
      return res.status(400).json({ message: 'Code has expired' });
    }

    // Code is valid
    resetCodes.set(user.email, { ...storedData, verified: true });

    res.json({ message: 'Code verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const { userId, code, newPassword } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const storedData = resetCodes.get(user.email);
    
    if (!storedData || storedData.code !== code || !storedData.verified) {
      return res.status(400).json({ message: 'Invalid or unverified code' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Clean up
    resetCodes.delete(user.email);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;