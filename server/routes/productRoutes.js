const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET SINGLE PRODUCT
router.get("/:id", getProductById);

// ADD PRODUCT
router.post("/", verifyToken, verifyAdmin, createProduct);

// UPDATE PRODUCT
router.put("/:id", verifyToken, verifyAdmin, updateProduct);

const { getProductSeo, upsertProductSeo, deleteProductSeo } = require("../controllers/seoController");

// GET PRODUCT SEO
router.get("/:productId/seo", getProductSeo);
router.post("/:productId/seo", verifyToken, verifyAdmin, upsertProductSeo);
router.put("/:productId/seo", verifyToken, verifyAdmin, upsertProductSeo);
router.delete("/:productId/seo", verifyToken, verifyAdmin, deleteProductSeo);

module.exports = router;

