const express = require("express");
const router = express.Router();
const { getGlobalSeo, getSeoBySlug, updateSeoBySlug } = require("../controllers/seoController");

router.get("/", getGlobalSeo);
router.get("/:slug", getSeoBySlug);
router.put("/:slug", updateSeoBySlug);

module.exports = router;
