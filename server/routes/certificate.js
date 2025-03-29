const express = require('express');
const multer = require('multer');
const router = express.Router();
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
router.post('/certificates', auth, upload.single('certificateFile'), async (req, res) => {
    try {
        // Convert completionDate to Date object
        const certificateData = {
            ...req.body,
            completionDate: new Date(req.body.completionDate),
            user: req.userId, // Get user ID from middleware
            certificateUrl: req.file?.path
        };

        const newCertificate = new Certificate(certificateData);
        await newCertificate.save();
        res.status(201).json(newCertificate);
    } catch (error) {
        console.error('Error saving certificate:', error);
        res.status(400).json({ 
            message: 'Validation failed',
            error: error.message 
        });
    }
});

router.get('/certificates', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.userId });
    res.json(certificates); // Ensure this is returning valid JSON
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});
  // routes/certificates.js
router.get('/certificates/stats', auth, async (req, res) => {
    try {
      const userId = req.userId;
  
      // Fetch all certificates for the user
      const certificates = await Certificate.find({ user: userId });
  
      // Calculate total certificates
      const totalCertificates = certificates.length;
  
      // Calculate total points
      const totalPoints = certificates.reduce((sum, cert) => sum + (cert.points || 0), 0);
  
      // Calculate recent activities (certificates added in the last 30 days)
      const recentActivities = certificates.filter(cert => {
        const certDate = new Date(cert.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return certDate >= thirtyDaysAgo;
      }).length;
  
      // Return the stats
      res.json({
        totalCertificates,
        totalPoints,
        recentActivities,
        rank: 7 // You can calculate rank based on your logic
      });
    } catch (error) {
      console.error('Error fetching certificate stats:', error);
      res.status(500).json({ 
        message: 'Server error',
        error: error.message 
      });
    }
  });
module.exports = router;

