# 🥗 Dietary Plan Backend

This is a Node.js backend project that allows users to register, save their allergens, and scan food product barcodes to check if the product contains any unsafe ingredients based on their personal allergy profile. It uses the **Open Food Facts API** to fetch ingredient and nutrition data from barcodes.

---

## 📊 Flow Diagram (Short Description)

1. **User Registers/Login**
   - Receives a JWT token for authentication.

2. **User Adds Allergens**
   - Like “milk”, “almond”, “peanut”, etc. (either during or after registration).

3. **User Scans a Barcode**
   - Frontend sends the barcode to our backend.
   - Backend fetches product info using **Open Food Facts API**.
   - Compares product ingredients with saved allergens.
   - Returns whether the product is safe or not along with nutrition facts.

4. **User Uses ChatBot**
   - Sends a dietary or recipe-related question.
   - Backend sends it to Gemini API and returns the HTML-formatted answer.

---

## 🚀 Tech Stack

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Open Food Facts API**
- **Gemini API (Google Generative Language)**

---

## 🔌 API Endpoints

> ⚠️ All protected routes require:
```http
Authorization: Bearer <JWT_TOKEN>
```

---

### 📍 Auth Routes

#### 📝 Register  
`POST /api/auth/register`

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

#### 🔐 Login  
`POST /api/auth/login`

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

---

### 👤 User Routes

#### ➕ Add Allergens  
`POST /api/user/allergens`

```json
{
  "allergens": ["milk", "almond"]
}
```

#### 📄 Get Allergens  
`GET /api/user/allergens`

#### ✏️ Update Allergens  
`PATCH /api/user/allergens`

```json
{
  "allergens": ["peanut", "soy"]
}
```

#### ❌ Delete Allergens  
`DELETE /api/user/allergens`

```json
{
  "allergens": ["soy"]
}
```
Removes one or more specified allergens from the user’s list.

---

### 🔍 Scan Route

#### 🛆 Scan a Barcode  
`POST /api/scan`

```json
{
  "barcode": "3017620429484"
}
```

✅ Sample Response:

```json
{
  "product_name": "Nutella",
  "isSafe": false,
  "matchedAllergens": ["milk"],
  "message": "❌ Warning! This product contains allergens.",
  "nutrition": {
    "calories": 539,
    "fat": 30.9,
    "sugar": 56.3,
    "proteins": 6.3
  },
  "ingredients": "sugar, palm oil, hazelnuts, cocoa, skimmed milk powder..."
}
```

---

### 🤖 ChatBot Route

#### 💬 Ask a Dietary Question  
`POST /api/chatbot/ask`

```json
{
  "query": "Can you suggest a healthy breakfast recipe with oats and banana?"
}
```

✅ Sample Response:

```json
{
  "recipe": "<h2>Recipe: Banana Oatmeal</h2><h3>Ingredients:</h3><ul><li>1 cup oats</li><li>1 banana</li><li>1 cup milk</li></ul><h3>Equipment:</h3><ul><li>Pot</li><li>Spoon</li></ul><h3>Instructions:</h3><ol><li>Boil milk in a pot.</li><li>Add oats and cook for 5 minutes.</li><li>Mash banana and stir it in.</li></ol><p>Tip: Add cinnamon or honey for taste.</p>"
}
```

---

## ⚙️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/princekpankaj/SafeEats.git

# Go into project folder
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

`.env` file format:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key_here
```

```bash
# Run the server
npm start
```

---

## 📦 Example Barcodes to Test

| Product     | Barcode         |
|-------------|------------------|
| Nutella     | 3017620429484    |
| Coca-Cola   | 5449000000996    |
| Oreo        | 7622300449283    |

---

## 📌 Project Roadmap

- ✅ Setup backend with Express and MongoDB
- ✅ User registration & login with JWT
- ✅ Store and manage allergens
- ✅ Scan barcode and fetch product data using Open Food Facts
- ✅ Compare allergens with product ingredients
- ✅ Display nutrition information
- ✅ Add allergen update and delete APIs
- ✅ Add chatbot integration using Gemini API

---

## 🛠️ Future Scope

- 🔜 Rate limiting or abuse protection
- 🔜 Admin dashboard for product scan logs
