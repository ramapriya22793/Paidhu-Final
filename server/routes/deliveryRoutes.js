const express = require('express');
const router = express.Router();
const { 
  getDeliveryCharges, 
  createDeliveryCharge, 
  updateDeliveryCharge, 
  deleteDeliveryCharge,
  checkPincode
} = require('../controllers/deliveryController');

// In a real app, these should be protected by an admin middleware
router.get('/', getDeliveryCharges);
router.get('/check/:pincode', checkPincode);
router.post('/', createDeliveryCharge);
router.put('/:id', updateDeliveryCharge);
router.delete('/:id', deleteDeliveryCharge);

module.exports = router;
