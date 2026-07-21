const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, slug: true, updatedAt: true }
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const staticUrls = [
      { loc: "https://paidhu.com/", priority: "1.0", changefreq: "daily" },
      { loc: "https://paidhu.com/shop", priority: "0.8", changefreq: "daily" },
      { loc: "https://paidhu.com/shop/about-us", priority: "0.7", changefreq: "weekly" },
      { loc: "https://paidhu.com/saffron-guidance", priority: "0.8", changefreq: "weekly" },
      { loc: "https://paidhu.com/shop/byoc", priority: "0.7", changefreq: "weekly" },
      { loc: "https://paidhu.com/legal/terms-conditions", priority: "0.3", changefreq: "monthly" },
      { loc: "https://paidhu.com/legal/privacy-policy", priority: "0.3", changefreq: "monthly" },
      { loc: "https://paidhu.com/legal/shipping-policy", priority: "0.3", changefreq: "monthly" },
    ];

    staticUrls.forEach(url => {
      xml += `  <url>\n    <loc>${url.loc}</loc>\n    <priority>${url.priority}</priority>\n    <changefreq>${url.changefreq}</changefreq>\n  </url>\n`;
    });

    // Dynamic products
    products.forEach(p => {
      const productSlug = p.slug || p.id;
      const lastMod = p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n    <loc>https://paidhu.com/product/${productSlug}</loc>\n    <priority>0.6</priority>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;
