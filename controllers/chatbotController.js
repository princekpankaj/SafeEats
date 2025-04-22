const fetch = require("node-fetch");
const model = "gemini-2.0-flash";

const generateFromGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) return "❌ API key not loaded. Check your .env file.";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const result = await response.json();

    const text =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Unexpected API response structure.";

    // Clean triple backticks and whitespace
    return text
      .replace(/^```html/, "")
      .replace(/```$/, "")
      .trim();
  } catch (err) {
    console.error("❌ API error:", err);
    return "Error communicating with Gemini API.";
  }
};

const generateRecipe = async (req, res) => {
  const query = req.body.query?.trim();

  if (!query) {
    return res.status(400).json({ error: "No query provided" });
  }

  const prompt = `
Generate a recipe for: "${query}"

Only return the recipe using clean HTML formatting with the following structure:

<h2>Recipe: (Title)</h2>

<h3>Ingredients:</h3>
<ul>
  <li>(Each ingredient)</li>
</ul>

<h3>Equipment:</h3>
<ul>
  <li>(Each item)</li>
</ul>

<h3>Instructions:</h3>
<ol>
  <li>(Each step)</li>
</ol>

Include any notes in a <p> tag at the end. Avoid unrelated suggestions or summaries.
  `;

  const result = await generateFromGemini(prompt);
  res.json({ recipe: result });
};

module.exports = { generateRecipe };
