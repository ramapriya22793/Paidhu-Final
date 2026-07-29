const express = require('express');
const router = express.Router();
const { syncProducts, syncOrders, syncCustomers, syncAll, getSyncStatus } = require('../controllers/woocommerceSyncController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// WooCommerce Manual & Automated Sync Endpoints
router.get('/status', getSyncStatus);
router.post('/products', verifyToken, verifyAdmin, syncProducts);
router.post('/orders', verifyToken, verifyAdmin, syncOrders);
router.post('/customers', verifyToken, verifyAdmin, syncCustomers);
router.post('/all', verifyToken, verifyAdmin, syncAll);

module.exports = router;
