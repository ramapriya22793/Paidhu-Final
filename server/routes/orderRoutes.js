const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const { verifyToken, verifyAdmin, checkPermission } = require("../middleware/authMiddleware");

// Admin routes
router.get("/", verifyToken, verifyAdmin, checkPermission('orders'), orderController.getOrders);
router.get("/:id", verifyToken, verifyAdmin, checkPermission('orders'), orderController.getOrderById);
router.put("/:id/status", verifyToken, verifyAdmin, checkPermission('orders'), orderController.updateOrderStatus);
router.put("/:id/details", verifyToken, verifyAdmin, checkPermission('orders'), orderController.updateOrderDetails);
router.delete("/:id", verifyToken, verifyAdmin, checkPermission('orders'), orderController.deleteOrder);


// Customer routes
router.get("/user/my-orders", authMiddleware, orderController.getMyOrders);

module.exports = router;
