const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
    try {
        const { fullName, email, username, password, department, college, yearOfStudy, aoi, bio, profileImage } = req.body;

        // Check if user already exists
        let existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: existingUser.email.toLowerCase() === email.toLowerCase()
                    ? "Email already in use"
                    : "Username already taken"
            });
        }

        // Hash the password
        // Hash the password (trim it first)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password.trim(), salt); // Trim the password


        // Create new user
        const user = new User({
            fullName,
            email: email.toLowerCase(),
            username,
            password: hashedPassword,
            department,
            college,
            yearOfStudy,
            aoi,
            bio,
            profileImage
        });

        await user.save();
        console.log("User saved successfully!");

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// User Login
router.post("/login", async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        console.log("Received Login Request:", req.body);

        if (!emailOrUsername || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the user by email or username (case-insensitive)
        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp("^" + emailOrUsername + "$", "i") } },
                { username: { $regex: new RegExp("^" + emailOrUsername + "$", "i") } },
            ],
        });

        if (!user) {

            return res.status(400).json({ message: "Invalid credentials" });
        }


        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password.trim(), user.password);

        if (!isMatch) {
            console.log("Password comparison failed.");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/me", async (req, res) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure interests and recentCertificates are defined
        user.aoi = user.aoi || [];
        user.recentCertificates = user.recentCertificates || [];

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
router.put("/update-profile", async (req, res) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update all fields if provided in the request body
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.department = req.body.department || user.department;
        user.location = req.body.location || user.location;
        user.bio = req.body.bio || user.bio;
        user.aoi = req.body.aoi || user.aoi;

        // Save the updated user
        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Server error during profile update" });
    }
});
module.exports = router;