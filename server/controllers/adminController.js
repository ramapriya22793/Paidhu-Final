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

    const token = jwt.sign(
      { userId: user.id, isAdmin: true },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
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

    // Real-time weekly comparison stats
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Users this week vs last week
    const usersThisWeek = await prisma.user.count({
      where: { createdAt: { gte: oneWeekAgo } }
    });
    const usersLastWeek = await prisma.user.count({
      where: { createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo } }
    });

    // Orders this week vs last week
    const ordersThisWeek = await prisma.order.count({
      where: { createdAt: { gte: oneWeekAgo } }
    });
    const ordersLastWeek = await prisma.order.count({
      where: { createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo } }
    });

    // Revenue this week vs last week
    const revThisWeek = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        orderStatus: { not: 'CANCELLED' },
        paymentStatus: { in: ['PAID', 'SUCCESS'] },
        createdAt: { gte: oneWeekAgo }
      }
    });
    const revLastWeek = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        orderStatus: { not: 'CANCELLED' },
        paymentStatus: { in: ['PAID', 'SUCCESS'] },
        createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo }
      }
    });
    const revenueThisWeek = revThisWeek._sum.totalPrice || 0;
    const revenueLastWeek = revLastWeek._sum.totalPrice || 0;

    // Pending orders this week vs last week
    const pendingThisWeek = await prisma.order.count({
      where: { orderStatus: 'PENDING', createdAt: { gte: oneWeekAgo } }
    });
    const pendingLastWeek = await prisma.order.count({
      where: { orderStatus: 'PENDING', createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo } }
    });

    const calculateTrend = (curr, prev) => {
      if (prev === 0) {
        return curr > 0 ? '+100%' : '+0%';
      }
      const pct = ((curr - prev) / prev) * 100;
      return pct >= 0 ? `+${pct.toFixed(1)}%` : `${pct.toFixed(1)}%`;
    };

    const trends = {
      revenueTrend: calculateTrend(revenueThisWeek, revenueLastWeek),
      ordersTrend: calculateTrend(ordersThisWeek, ordersLastWeek),
      usersTrend: calculateTrend(usersThisWeek, usersLastWeek),
      pendingTrend: calculateTrend(pendingThisWeek, pendingLastWeek)
    };

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

    cachedStats = {
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrdersCount,
      recentOrders,
      totalRevenue,
      chartData,
      trends
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

