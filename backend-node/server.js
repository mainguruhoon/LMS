const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas Successfully Connected!'))
  .catch((err) => console.log('❌ Database Connection Error: ', err));

// Test Route
app.get('/api/status', (req, res) => {
    res.json({ message: "LuminaLearn Node Server is active and ready!" });
});

// Add these two lines right above your "Start Server" section!
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes'); // Add this

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes); // Add this

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});