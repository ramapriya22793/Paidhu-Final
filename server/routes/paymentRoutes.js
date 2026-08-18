const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

const { verifyToken, verifyAdmin, checkPermission } = require('../middleware/authMiddleware');

// Admin routes
router.get("/analytics", verifyToken, verifyAdmin, checkPermission('payments'), paymentController.getAnalytics);
router.get("/", verifyToken, verifyAdmin, checkPermission('payments'), paymentController.getPayments);
router.get("/:id", verifyToken, verifyAdmin, checkPermission('payments'), paymentController.getPaymentById);
router.post("/:id/refund", verifyToken, verifyAdmin, checkPermission('payments'), paymentController.createRefund);
router.put("/refund/:id", verifyToken, verifyAdmin, checkPermission('payments'), paymentController.updateRefundStatus);

module.exports = router;
