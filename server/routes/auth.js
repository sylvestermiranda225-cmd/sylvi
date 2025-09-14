import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, age, profession, relationship } = req.body;

      
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

    
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            age,
            profession,
            relationship,
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully! Please log in." });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error during signup." });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Create and sign a JWT
        const payload = {
            user: {
                id: user.id,
            },
        };

        // Note: In a real app, use a strong, secret key from environment variables
        jwt.sign(payload, "supersecretjwtkey", { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
});

export default router;
