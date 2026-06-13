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

// DELETE PRODUCT
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

module.exports = router;
