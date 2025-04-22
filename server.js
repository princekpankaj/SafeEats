const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const scanRoutes = require('./routes/scanRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const chatbotRoutes = require("./routes/chatbotRoutes");


// Load env vars
dotenv.config();
// console.log("🔐 GEMINI_API_KEY loaded as:", process.env.GEMINI_API_KEY);

// Connect to MongoDB
connectDB();

// Init app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/scan', scanRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use(notFound);
app.use(errorHandler);

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Server listen to 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
