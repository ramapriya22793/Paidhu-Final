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

exports.getDashboardStats = async (req, res) => {
  try {
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

    const orders = await prisma.order.findMany({
      where: { 
        OR: [
          { paymentStatus: 'SUCCESS' },
          { paymentStatus: 'PAID' }
        ]
      },
      select: { totalPrice: true }
    });
    
    // In our schema, it's totalPrice, not totalAmount
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // Calculate real monthly revenue from orders
    const currentYear = new Date().getFullYear();
    const monthlySales = {
      Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
      Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };

    const allPaidOrders = await prisma.order.findMany({
      where: { 
        OR: [
          { paymentStatus: 'SUCCESS' },
          { paymentStatus: 'PAID' }
        ],
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
        }
      },
      select: { totalPrice: true, createdAt: true }
    });

    allPaidOrders.forEach(order => {
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

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrdersCount,
      recentOrders,
      totalRevenue,
      chartData
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};
