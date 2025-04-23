const express = require('express');
const router = express.Router();
const axios = require('axios');
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route  POST /api/scan
// @desc   Scan product barcode and check allergens
// @access Protected
router.post('/', protect, async (req, res) => {
  const { barcode } = req.body;

  if (!barcode) {
    return res.status(400).json({ message: 'Barcode is required' });
  }

  try {
    // 1. Fetch product info from Open Food Facts
    const { data } = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);

    if (!data || data.status === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = data.product;

    // Prefer English ingredients, fallback to other fields
    const ingredients =
      product.ingredients_text_en ||
      product.ingredients_text ||
      (product.ingredients?.map(i => i.text).join(', ') || '');

    const nutriments = product.nutriments || {};

    // 2. Get user's allergens
    const user = await User.findById(req.user._id);
    const userAllergens = user.allergens.map(a => a.toLowerCase());

    // 3. Check if any allergens are mentioned in the ingredient list
    const matchedAllergens = userAllergens.filter(allergen =>
      ingredients.toLowerCase().includes(allergen)
    );

    // 4. Build response
    const isSafe = matchedAllergens.length === 0;

    res.status(200).json({
      product_name: product.product_name || 'N/A',
      isSafe,
      matchedAllergens,
      message: isSafe
        ? '✅ This product is safe to consume.'
        : '❌ Warning! This product contains allergens.',
      nutrition: {
        calories: nutriments['energy-kcal'] || 'N/A',
        fat: nutriments.fat || 'N/A',
        sugar: nutriments.sugars || 'N/A',
        proteins: nutriments.proteins || 'N/A',
      },
      ingredients,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error scanning product', error: err.message });
  }
});

module.exports = router;
