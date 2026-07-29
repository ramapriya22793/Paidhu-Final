const express = require('express');
const router = express.Router();
const { handleOrderWebhook, handleProductWebhook, handleCustomerWebhook } = require('../controllers/webhookController');

// WooCommerce Webhook Listener Endpoints
router.post('/orders', handleOrderWebhook);
router.post('/products', handleProductWebhook);
router.post('/customers', handleCustomerWebhook);

module.exports = router;
