const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");

// Public route for storefront to fetch active scripts
router.get("/active", trackingController.getActiveScripts);

// Admin routes
router.get("/", trackingController.getScripts);
router.post("/", trackingController.createScript);
router.put("/:id", trackingController.updateScript);
router.delete("/:id", trackingController.deleteScript);
router.patch("/:id/toggle", trackingController.toggleScript);

module.exports = router;
