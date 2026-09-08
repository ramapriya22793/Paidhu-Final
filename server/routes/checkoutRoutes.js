const express = require('express');
const router = express.Router();
const { 
  calculateSummary, 
  initiateCheckout, 
  verifyPayment, 
  razorpayWebhook, 
  getOrderByNumber,
  checkRazorpayStatus,
  updateRazorpayConfig
} = require('../controllers/checkoutController');

router.post('/calculate', calculateSummary);
router.post('/initiate', initiateCheckout);
router.post('/verify', verifyPayment);
router.post('/webhook', razorpayWebhook);
router.get('/order/:orderNumber', getOrderByNumber);
router.get('/razorpay-status', checkRazorpayStatus);
router.post('/razorpay-config', updateRazorpayConfig);

module.exports = router;
