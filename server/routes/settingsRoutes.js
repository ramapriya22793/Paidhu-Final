const express = require("express");
const router = express.Router();
const { getSettings, updateSettings, getHabitatVideos } = require("../controllers/settingsController");

router.get("/", getSettings);
router.put("/", updateSettings);
router.get("/habitat-videos", getHabitatVideos);

module.exports = router;
