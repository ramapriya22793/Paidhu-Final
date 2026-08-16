const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

const { verifyAdmin, verifyToken } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', wishlistController.getWishlist);
router.post('/toggle', wishlistController.toggleWishlistItem);
router.delete('/:productId', wishlistController.removeWishlistItem);
router.post('/sync', wishlistController.syncWishlist);
router.get('/admin/insights', wishlistController.getWishlistInsights);
router.delete('/admin/product/:productId', verifyToken, verifyAdmin, wishlistController.adminDeleteWishlistItem);

module.exports = router;

