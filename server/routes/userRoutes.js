const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// User Routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/guest-login', userController.guestLogin);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/preferences', authMiddleware, userController.updatePreferences);
router.post('/tiffin-register', userController.registerTiffin);

// Admin Routes
const { verifyAdmin, verifyToken } = require('../middleware/authMiddleware');

router.post('/admin-login', userController.adminLogin); // Legacy

// Admin User Management
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);
router.put('/:id', verifyToken, verifyAdmin, userController.adminUpdateUser);
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);
router.put('/:id/block', verifyToken, verifyAdmin, userController.blockUser);

module.exports = router;
