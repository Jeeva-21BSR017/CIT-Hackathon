const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/users
// @desc    Get all student users
// @access  Public
router.get('/', async (req, res) => {
    try {
        const users = await User.find({ role: 'student' }).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
