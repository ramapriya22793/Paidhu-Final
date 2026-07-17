const express = require("express");
const cors = require("cors");
require("dotenv").config();
const prisma = require("./prismaClient");
const bcrypt = require("bcryptjs");

const app = express();

const path = require("path");

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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


const initializeAdmin = async () => {
  try {
    const adminEmail = "ecompaidhu@gmail.com";
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Paidhu2026", 10);
      await prisma.user.create({
        data: {
          name: "Admin",
          email: adminEmail,
          password: hashedPassword,
          isAdmin: true
        }
      });
      console.log("Static Admin user created successfully.");
    }
  } catch (error) {
    console.error("Failed to initialize admin user:", error);
  }
};

// initializeAdmin();

app.get("/", (req, res) => {
  res.send("Paidhu API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
