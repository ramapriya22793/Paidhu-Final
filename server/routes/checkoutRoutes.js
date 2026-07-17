const express = require('express');
const router = express.Router();
const { calculateSummary, initiateCheckout, verifyPayment, razorpayWebhook } = require('../controllers/checkoutController');

router.post('/calculate', calculateSummary);
router.post('/initiate', initiateCheckout);
router.post('/verify', verifyPayment);
router.post('/webhook', razorpayWebhook);

module.exports = router;
