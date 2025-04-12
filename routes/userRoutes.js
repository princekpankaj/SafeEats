const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');

// Add allergens
router.post('/allergens', protect, async (req, res) => {
  const { allergens } = req.body;

  try {
    const user = await User.findById(req.user._id);
    user.allergens = [...new Set([...user.allergens, ...allergens])]; // merge unique
    await user.save();

    res.status(200).json({ message: 'Allergens updated', allergens: user.allergens });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user's allergens
router.get('/allergens', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ allergens: user.allergens });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
