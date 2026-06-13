const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
  getAllActiveCarts
} = require('../controllers/cartController');

// All regular cart routes require authentication (for DB storage)
router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.put('/update', authMiddleware, updateCartItem);
router.delete('/remove/:productId', authMiddleware, removeFromCart);
router.delete('/clear', authMiddleware, clearCart);
router.post('/sync', authMiddleware, syncCart);

// Admin route
router.get('/admin/all', authMiddleware, getAllActiveCarts);

module.exports = router;
