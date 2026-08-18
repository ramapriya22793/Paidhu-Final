const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { verifyToken, verifyAdmin, checkPermission } = require("../middleware/authMiddleware");

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET SINGLE PRODUCT
router.get("/:id", getProductById);

// ADD PRODUCT
router.post("/", verifyToken, verifyAdmin, checkPermission('products'), createProduct);

// UPDATE PRODUCT
router.put("/:id", verifyToken, verifyAdmin, (req, res, next) => {
  if (req.user.role === 'ACCOUNTS_ADMIN') {
    const keys = Object.keys(req.body);
    const nonStockKeys = keys.filter(k => k !== 'stock');
    if (nonStockKeys.length > 0) {
      return res.status(403).json({ message: "Access denied. Accounts Admin can only update product stock." });
    }
    return next();
  }
  return checkPermission('products')(req, res, next);
}, updateProduct);

const { getProductSeo, upsertProductSeo, deleteProductSeo } = require("../controllers/seoController");

// GET PRODUCT SEO
router.get("/:productId/seo", getProductSeo);
router.post("/:productId/seo", verifyToken, verifyAdmin, checkPermission('products'), upsertProductSeo);
router.put("/:productId/seo", verifyToken, verifyAdmin, checkPermission('products'), upsertProductSeo);
router.delete("/:productId/seo", verifyToken, verifyAdmin, checkPermission('products'), deleteProductSeo);

module.exports = router;

