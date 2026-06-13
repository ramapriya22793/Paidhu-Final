const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

// Admin routes
router.get("/analytics", paymentController.getAnalytics);
router.get("/", paymentController.getPayments);
router.get("/:id", paymentController.getPaymentById);
router.post("/:id/refund", paymentController.createRefund);
router.put("/refund/:id", paymentController.updateRefundStatus);

module.exports = router;
