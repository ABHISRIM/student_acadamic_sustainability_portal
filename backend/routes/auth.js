const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, phone, institution } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "Student",
            phone,
            institution
        });

        const savedUser = await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Verify role if provided
        if (role && user.role !== role) {
            return res.status(400).json({ error: `Unauthorized: This account is registered as a ${user.role}, not a ${role}.` });
        }

        // Create token
        const payload = {
            id: user._id,
            role: user.role,
            name: user.name
        };
        const secret = process.env.JWT_SECRET || "your_jwt_secret_key";
        const token = jwt.encode(payload, secret);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
