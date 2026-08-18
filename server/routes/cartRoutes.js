const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin, checkPermission } = require('../middleware/authMiddleware');

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
router.get('/', verifyToken, getCart);
router.post('/add', verifyToken, addToCart);
router.put('/update', verifyToken, updateCartItem);
router.post('/remove', verifyToken, removeFromCart);
router.delete('/remove', verifyToken, removeFromCart); // Catch-all for older frontend clients
router.delete('/remove/:productId', verifyToken, removeFromCart); // Catch-all for older frontend clients
router.delete('/clear', verifyToken, clearCart);
router.post('/sync', verifyToken, syncCart);

// Admin route
router.get('/admin/all', verifyToken, verifyAdmin, checkPermission('active_carts'), getAllActiveCarts);

module.exports = router;
