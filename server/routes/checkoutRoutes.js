const express = require('express');
const router = express.Router();
const { calculateSummary, initiateCheckout, verifyPayment, razorpayWebhook, getOrderByNumber } = require('../controllers/checkoutController');

router.post('/calculate', calculateSummary);
router.post('/initiate', initiateCheckout);
router.post('/verify', verifyPayment);
router.post('/webhook', razorpayWebhook);
router.get('/order/:orderNumber', getOrderByNumber);

module.exports = router;
