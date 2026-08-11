const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

const DOMAIN = "https://www.paidhuethicalfoods.com";

router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, slug: true, updatedAt: true }
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const staticUrls = [
      { loc: `${DOMAIN}/`, lastmod: new Date().toISOString().split('T')[0] },
      { loc: `${DOMAIN}/shop`, lastmod: new Date().toISOString().split('T')[0] },
      { loc: `${DOMAIN}/shop/about-us`, lastmod: new Date().toISOString().split('T')[0] },
      { loc: `${DOMAIN}/shop/bulk-orders`, lastmod: new Date().toISOString().split('T')[0] },
      { loc: `${DOMAIN}/shop/byoc`, lastmod: new Date().toISOString().split('T')[0] },
      { loc: `${DOMAIN}/saffron-guidance`, lastmod: new Date().toISOString().split('T')[0] },
      { loc: `${DOMAIN}/careers`, lastmod: new Date().toISOString().split('T')[0] },
      { loc: `${DOMAIN}/blogs`, lastmod: new Date().toISOString().split('T')[0] },
      { loc: `${DOMAIN}/legal/terms-conditions`, lastmod: new Date().toISOString().split('T')[0] },
      { loc: `${DOMAIN}/legal/privacy-policy`, lastmod: new Date().toISOString().split('T')[0] },
      { loc: `${DOMAIN}/legal/shipping-policy`, lastmod: new Date().toISOString().split('T')[0] },
      { loc: `${DOMAIN}/legal/refund-policy`, lastmod: new Date().toISOString().split('T')[0] },
      { loc: `${DOMAIN}/legal/contact-us`, lastmod: new Date().toISOString().split('T')[0] },
    ];

    staticUrls.forEach(url => {
      xml += `  <url>\n    <loc>${url.loc}</loc>\n    <lastmod>${url.lastmod}</lastmod>\n  </url>\n`;
    });

    // Dynamic products
    products.forEach(p => {
      const productSlug = p.slug || p.id;
      const lastMod = p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n    <loc>${DOMAIN}/product/${productSlug}</loc>\n    <lastmod>${lastMod}</lastmod>\n  </url>\n`;
    });

    // Dynamic blogs
    const blogs = await prisma.blog.findMany({
      select: { id: true, slug: true, updatedAt: true }
    });

    blogs.forEach(b => {
      const blogSlug = b.slug || b.id;
      const lastMod = b.updatedAt ? new Date(b.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n    <loc>${DOMAIN}/blogs/${blogSlug}</loc>\n    <lastmod>${lastMod}</lastmod>\n  </url>\n`;
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
