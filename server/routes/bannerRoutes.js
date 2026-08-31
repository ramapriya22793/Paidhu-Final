const express = require("express");
const router = express.Router();
const { getAllBanners, getActiveBannerByPage, createBanner, updateBanner, deleteBanner } = require("../controllers/bannerController");

const { verifyToken, verifyAdmin, checkPermission } = require('../middleware/authMiddleware');

router.get("/", getAllBanners);
router.get("/active/:pageSlug", getActiveBannerByPage);
router.post("/", verifyToken, verifyAdmin, checkPermission('banners'), createBanner);
router.put("/:id", verifyToken, verifyAdmin, checkPermission('banners'), updateBanner);
router.delete("/:id", verifyToken, verifyAdmin, checkPermission('banners'), deleteBanner);

module.exports = router;
