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

// PATCH /api/user/allergens
// update user's allergens
router.patch('/allergens', protect, async (req, res) => {
    const userId = req.user.id;
    const { allergens } = req.body;
  
    if (!Array.isArray(allergens)) {
      return res.status(400).json({ message: "Allergens must be an array" });
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { allergens },
        { new: true }
      );
  
      res.json({
        message: "Allergens updated successfully",
        allergens: updatedUser.allergens,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error while updating allergens" });
    }
  });



  // DELETE /api/user/allergens
  // To Perform Deletion operation of allergic item
router.delete('/allergens', protect, async (req, res) => {
  const userId = req.user.id;
  const { allergens } = req.body;

  if (!Array.isArray(allergens)) {
    return res.status(400).json({ message: "Allergens must be an array" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Filter out the allergens to be removed.
    user.allergens = user.allergens.filter(
      (item) => !allergens.includes(item.toLowerCase())
    );

    await user.save();

    res.json({
      message: "Selected allergens removed successfully",
      allergens: user.allergens,
    });
  } catch (error) {
    res.status(500).json({ message: "Error removing allergens" });
  }
});

  

module.exports = router;
