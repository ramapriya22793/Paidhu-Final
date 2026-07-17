const express = require("express");
const router = express.Router();
const { getCoupons, createCoupon, updateCouponStatus, deleteCoupon, validateCoupon } = require("../controllers/couponController");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, verifyAdmin, getCoupons);
router.post("/validate", validateCoupon); // Public route for customers to validate coupons
router.post("/", verifyToken, verifyAdmin, createCoupon);
router.put("/:id/status", verifyToken, verifyAdmin, updateCouponStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteCoupon);

module.exports = router;
