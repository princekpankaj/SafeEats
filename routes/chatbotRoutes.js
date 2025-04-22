const express = require("express");
const router = express.Router();
const { generateRecipe } = require("../controllers/chatbotController");

router.post("/generate-recipe", generateRecipe);

module.exports = router;
