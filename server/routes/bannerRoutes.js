const express = require("express");
const router = express.Router();
const { getAllBanners, getActiveBannerByPage, createBanner, updateBanner, deleteBanner } = require("../controllers/bannerController");

router.get("/", getAllBanners);
router.get("/active/:pageSlug", getActiveBannerByPage);
router.post("/", createBanner);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);

module.exports = router;
