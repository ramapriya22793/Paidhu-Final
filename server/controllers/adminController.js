const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Using the original ecompaidhu@gmail.com admin.
// Seeded via server.js.

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: 'Invalid credentials or unauthorized' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Force password change on temporary passwords
    if (user.mustChangePassword) {
      const tempToken = jwt.sign(
        { userId: user.id, isAdmin: true, role: user.role, mustChangePassword: true },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '15m' }
      );
      return res.json({
        mustChangePassword: true,
        token: tempToken,
        email: user.email,
        admin: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role || 'SUPER_ADMIN'
        }
      });
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: true, role: user.role || 'SUPER_ADMIN' },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role || 'SUPER_ADMIN'
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, avatar: true, isAdmin: true }
    });
    
    if (!user || !user.isAdmin) return res.status(401).json({ message: 'Unauthorized' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
let cachedStats = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 120000; // 2 minutes cache

exports.getDashboardStats = async (req, res) => {
  try {
    const now = Date.now();
    if (cachedStats && (now - cacheTimestamp < CACHE_DURATION)) {
      return res.json(cachedStats);
    }

    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    
    const pendingOrdersCount = await prisma.order.count({
      where: { orderStatus: 'PENDING' }
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        totalPrice: true,
        orderStatus: true,
        items: true
      }
    });

    const revenueAggregate = await prisma.order.aggregate({
      _sum: {
        totalPrice: true
      },
      where: {
        orderStatus: { not: 'CANCELLED' },
        paymentStatus: { in: ['PAID', 'SUCCESS'] }
      }
    });
    
    const totalRevenue = revenueAggregate._sum.totalPrice || 0;

    // Calculate weekly trends
    const dateNow = new Date();
    const oneWeekAgo = new Date(dateNow.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(dateNow.getTime() - 14 * 24 * 60 * 60 * 1000);

    const usersThisWeek = await prisma.user.count({
      where: { createdAt: { gte: oneWeekAgo } }
    });
    const usersLastWeek = await prisma.user.count({
      where: { createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo } }
    });

    const ordersThisWeek = await prisma.order.count({
      where: { createdAt: { gte: oneWeekAgo } }
    });
    const ordersLastWeek = await prisma.order.count({
      where: { createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo } }
    });

    const revenueThisWeekAggregate = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        orderStatus: { not: 'CANCELLED' },
        paymentStatus: { in: ['PAID', 'SUCCESS'] },
        createdAt: { gte: oneWeekAgo }
      }
    });
    const revenueLastWeekAggregate = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        orderStatus: { not: 'CANCELLED' },
        paymentStatus: { in: ['PAID', 'SUCCESS'] },
        createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo }
      }
    });
    const revenueThisWeek = revenueThisWeekAggregate._sum.totalPrice || 0;
    const revenueLastWeek = revenueLastWeekAggregate._sum.totalPrice || 0;

    const pendingThisWeek = await prisma.order.count({
      where: { orderStatus: 'PENDING', createdAt: { gte: oneWeekAgo } }
    });
    const pendingLastWeek = await prisma.order.count({
      where: { orderStatus: 'PENDING', createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo } }
    });

    const calculateTrend = (current, previous) => {
      if (previous === 0) {
        return current > 0 ? `+100.0%` : `+0.0%`;
      }
      const change = ((current - previous) / previous) * 100;
      return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    };

    const revenueTrend = calculateTrend(revenueThisWeek, revenueLastWeek);
    const ordersTrend = calculateTrend(ordersThisWeek, ordersLastWeek);
    const usersTrend = calculateTrend(usersThisWeek, usersLastWeek);
    const pendingTrend = calculateTrend(pendingThisWeek, pendingLastWeek);

    // Calculate real monthly revenue from orders
    const currentYear = new Date().getFullYear();
    const monthlySales = {
      Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
      Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };

    const allValidOrders = await prisma.order.findMany({
      where: { 
        orderStatus: { not: 'CANCELLED' },
        paymentStatus: { in: ['PAID', 'SUCCESS'] },
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
        }
      },
      select: { totalPrice: true, createdAt: true }
    });

    allValidOrders.forEach(order => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIndex = new Date(order.createdAt).getMonth();
      const monthName = monthNames[monthIndex];
      monthlySales[monthName] += (order.totalPrice || 0);
    });

    // Create array up to the current month to avoid empty future months looking weird, or just show all
    const currentMonthIndex = new Date().getMonth();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = monthNames.slice(0, currentMonthIndex + 1).map(name => ({
      name,
      sales: monthlySales[name]
    }));

    // Product-wise revenue: aggregate revenue by product from OrderItem joins
    const productRevenueRaw = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { price: true },
      _count: { id: true },
      orderBy: { _sum: { price: 'desc' } },
      take: 8
    });

    // Fetch product names for those IDs
    const productIds = productRevenueRaw.map(r => r.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true }
    });
    const productMap = Object.fromEntries(products.map(p => [p.id, p.name]));

    const productRevenueData = productRevenueRaw.map(r => ({
      name: (productMap[r.productId] || `Product #${r.productId}`).substring(0, 20),
      value: Math.round(r._sum.price || 0),
      orders: r._count.id
    }));

    cachedStats = {
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrdersCount,
      recentOrders,
      totalRevenue,
      chartData,
      productRevenueData,
      trends: {
        revenueTrend,
        ordersTrend,
        usersTrend,
        pendingTrend
      }
    };
    cacheTimestamp = now;

    res.json(cachedStats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

exports.getTiffinRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.tiffinRegistration.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(registrations);
  } catch (error) {
    console.error("Error fetching tiffin registrations:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLoginHistory = async (req, res) => {
  try {
    const history = await prisma.loginHistory.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, isAdmin: true } }
      },
      orderBy: { loginTime: 'desc' },
      take: 500
    });
    res.json(history);
  } catch (error) {
    console.error("Error fetching login history:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.clearLoginHistory = async (req, res) => {
  try {
    await prisma.loginHistory.deleteMany();
    res.json({ success: true, message: "Login history cleared successfully" });
  } catch (error) {
    console.error("Error clearing login history:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.clearTestData = async (req, res) => {
  try {
    // Check if the user is an admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized. Admin privileges required." });
    }

    // Delete transaction tables
    const deletedRefunds = await prisma.refund.deleteMany();
    const deletedPayments = await prisma.payment.deleteMany();
    const deletedOrders = await prisma.order.deleteMany();

    // Reset stats cache
    cachedStats = null;
    cacheTimestamp = 0;

    res.json({
      success: true,
      message: "Test transaction data cleared successfully",
      details: {
        refundsDeletedCount: deletedRefunds.count,
        paymentsDeletedCount: deletedPayments.count,
        ordersDeletedCount: deletedOrders.count
      }
    });
  } catch (error) {
    console.error("Error clearing test data:", error);
    res.status(500).json({ message: error.message || "Server error clearing test data" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.trim().length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedPassword,
        mustChangePassword: false
      }
    });

    res.json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error updating password" });
  }
};

