const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const robotsText = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /checkout/\n\nSitemap: https://paidhu.com/sitemap.xml\n`;
  res.header("Content-Type", "text/plain");
  res.status(200).send(robotsText);
});

module.exports = router;
