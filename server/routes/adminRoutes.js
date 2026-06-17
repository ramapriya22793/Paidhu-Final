const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/login', adminController.login);
router.get('/profile', verifyToken, verifyAdmin, adminController.getProfile);
router.get('/stats', verifyToken, verifyAdmin, adminController.getDashboardStats);
router.get('/tiffin-registrations', verifyToken, verifyAdmin, adminController.getTiffinRegistrations);

module.exports = router;
