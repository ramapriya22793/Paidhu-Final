const express = require("express");
const router = express.Router();
const { 
  getProductSeo, 
  upsertProductSeo, 
  deleteProductSeo, 
  checkSlugAvailability,
  getGlobalSeo, 
  getSeoBySlug, 
  updateSeoBySlug 
} = require("../controllers/seoController");

// Product SEO Endpoints
router.get("/products/check-slug", checkSlugAvailability);
router.get("/products/:productId", getProductSeo);
router.post("/products/:productId", upsertProductSeo);
router.put("/products/:productId", upsertProductSeo);
router.delete("/products/:productId", deleteProductSeo);

// Global Page SEO Endpoints (legacy pages)
router.get("/", getGlobalSeo);
router.get("/:slug", getSeoBySlug);
router.put("/:slug", updateSeoBySlug);

module.exports = router;
