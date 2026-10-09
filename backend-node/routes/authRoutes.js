const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // The blueprint we made earlier!

// 1. REGISTER a new user (Admin or Student)
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        // Scramble the password before saving it to MongoDB
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(400).json({ error: "Error registering.", details: err.message });
    }
});

// 2. LOGIN an existing user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found!" });

        // Check if the typed password matches the scrambled database password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid password!" });

        // Generate a secure VIP Token that expires in 1 hour
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        res.json({ token, role: user.role, username: user.username });
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

module.exports = router;