const express = require('express');
const router = express.Router();
const { calculateSummary, initiateCheckout, verifyPayment } = require('../controllers/checkoutController');

router.post('/calculate', calculateSummary);
router.post('/initiate', initiateCheckout);
router.post('/verify', verifyPayment);

module.exports = router;
