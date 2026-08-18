const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

const { verifyToken, verifyAdmin, checkPermission } = require('../middleware/authMiddleware');

router.get('/', verifyToken, verifyAdmin, checkPermission('customers'), customerController.getCustomers);
router.get('/:id', verifyToken, verifyAdmin, checkPermission('customers'), customerController.getCustomerById);

module.exports = router;
