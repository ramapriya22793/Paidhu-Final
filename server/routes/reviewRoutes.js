const express = require("express");
const router = express.Router();
const { getReviewsForProduct, getAllReviews, createReview, updateReviewStatus, deleteReview } = require("../controllers/reviewController");

router.get("/product/:id", getReviewsForProduct);
router.get("/", getAllReviews);
router.post("/", createReview);
router.put("/:id/status", updateReviewStatus);
router.delete("/:id", deleteReview);

module.exports = router;
