const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const robotsText = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /checkout/
Disallow: /api/

Sitemap: https://www.paidhuethicalfoods.com/sitemap.xml
`;
  res.header("Content-Type", "text/plain");
  res.status(200).send(robotsText);
});

module.exports = router;
