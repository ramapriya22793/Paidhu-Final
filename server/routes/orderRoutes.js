const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Admin routes
router.get("/", verifyToken, verifyAdmin, orderController.getOrders);
router.get("/:id", verifyToken, verifyAdmin, orderController.getOrderById);
router.put("/:id/status", verifyToken, verifyAdmin, orderController.updateOrderStatus);
router.put("/:id/details", verifyToken, verifyAdmin, orderController.updateOrderDetails);

// Customer routes
router.get("/user/my-orders", authMiddleware, orderController.getMyOrders);

module.exports = router;
