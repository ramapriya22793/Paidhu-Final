const express = require("express");
const cors = require("cors");
require("dotenv").config();
const prisma = require("./prismaClient");
const bcrypt = require("bcryptjs");

const app = express();

const path = require("path");
const compression = require("compression");
const securityHeaders = require("./middleware/securityHeaders");

const ALLOWED_ORIGINS = [
  'https://www.paidhuethicalfoods.com',
  'https://paidhuethicalfoods.com',
  'https://admin.paidhuethicalfoods.com',
  'https://accounts.paidhuethicalfoods.com',
  'https://ecommerce.paidhuethicalfoods.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.paidhuethicalfoods.com');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(compression());
// NOTE: cors() package is intentionally removed — the manual CORS middleware above handles all origins correctly.
app.use(securityHeaders);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Cache control headers for static uploads
app.use("/uploads", (req, res, next) => {
  const isVercel = process.env.VERCEL || process.env.NOW_BUILDER;
  if (isVercel) {
    const fs = require('fs');
    const os = require('os');
    const tmpPath = path.join(os.tmpdir(), 'uploads', req.path);
    if (fs.existsSync(tmpPath)) {
      return res.sendFile(tmpPath);
    }
  }
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

// SEO XML Sitemap and Robots endpoints
app.use("/sitemap.xml", require("./routes/sitemapRoute"));
app.use("/robots.txt", require("./routes/robotsRoute"));

// 301 Redirect Middleware
app.use((req, res, next) => {
  const cleanPath = req.path;
  if (cleanPath.endsWith('.html')) {
    const rawPath = cleanPath.slice(0, -5);
    if (rawPath === '/index') return res.redirect(301, '/');
    if (rawPath === '/about') return res.redirect(301, '/shop/about-us');
    if (rawPath === '/shop') return res.redirect(301, '/shop');
    return res.redirect(301, rawPath);
  }
  next();
});

// API ROUTES
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/seo", require("./routes/seoRoutes"));
app.use("/api/banners", require("./routes/bannerRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/addresses", require("./routes/addressRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/bulk-orders", require("./routes/bulkOrdersRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/checkout", require("./routes/checkoutRoutes"));
app.use("/api/delivery-charges", require("./routes/deliveryRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/tracking", require("./routes/trackingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/saffron-guidance", require("./routes/saffronGuidanceRoutes"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));
app.get("/api/temp-db-url-helper", (req, res) => res.send(process.env.DATABASE_URL));
app.use("/api/careers", require("./routes/careerRoutes"));
app.use("/api/sync", require("./routes/woocommerceSyncRoutes"));
app.use("/api/webhooks", require("./routes/webhookRoutes"));


const initializeAdmin = async () => {
  try {
    // Safely add any missing columns to the User table using raw SQL.
    // This ensures the schema is always up-to-date on the live database,
    // since running 'prisma db push' in a Vercel serverless environment is unreliable.
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "User"
        ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
        ADD COLUMN IF NOT EXISTS "mustChangePassword" BOOLEAN NOT NULL DEFAULT false
      `);
      console.log("Startup: Database columns verified/added successfully.");
    } catch (schemaErr) {
      // Columns may already exist — that is fine, the login will still work.
      console.log("Startup: Schema check note:", schemaErr.message);
    }

    const adminEmail = "ecompaidhu@gmail.com";
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Paidhu2026", 10);
      await prisma.user.create({
        data: {
          name: "Admin",
          email: adminEmail,
          password: hashedPassword,
          isAdmin: true,
          role: "SUPER_ADMIN"
        }
      });
      console.log("Static Admin user created successfully.");
    } else if (!existingAdmin.role || existingAdmin.role === 'CUSTOMER') {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: "SUPER_ADMIN" }
      });
      console.log("Admin user role updated to SUPER_ADMIN.");
    }

    // Seed E-Commerce Admin
    const ecomEmail = "ecommerce.admin@yourdomain.com";
    const existingEcom = await prisma.user.findUnique({ where: { email: ecomEmail } });
    if (!existingEcom) {
      const hashedPassword = await bcrypt.hash("Ecom@2026#Admin", 10);
      await prisma.user.create({
        data: {
          name: "E-Commerce Admin",
          email: ecomEmail,
          password: hashedPassword,
          isAdmin: true,
          role: "ECOMMERCE_ADMIN",
          mustChangePassword: true
        }
      });
      console.log("E-Commerce Admin user created successfully.");
    }

    // Seed Accounts Admin
    const accountsEmail = "accounts.admin@yourdomain.com";
    const existingAccounts = await prisma.user.findUnique({ where: { email: accountsEmail } });
    if (!existingAccounts) {
      const hashedPassword = await bcrypt.hash("Accounts@2026#Admin", 10);
      await prisma.user.create({
        data: {
          name: "Accounts Admin",
          email: accountsEmail,
          password: hashedPassword,
          isAdmin: true,
          role: "ACCOUNTS_ADMIN",
          mustChangePassword: true
        }
      });
      console.log("Accounts Admin user created successfully.");
    }
  } catch (error) {
    console.error("Failed to initialize admin users:", error);
  }
};

initializeAdmin();

app.get("/", (req, res) => {
  res.send("Paidhu API Running");
});

// Custom 404 API Handler
app.use((req, res) => {
  res.status(404).json({ message: "API Endpoint not found" });
});

if (!process.env.VERCEL) {
  try {
    const { initBlogCron } = require('./cron/syncBlogs');
    initBlogCron();
  } catch (err) {
    console.error("Failed to initialize cron on local server:", err);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
