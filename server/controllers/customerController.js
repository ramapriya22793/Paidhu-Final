const prisma = require("../prismaClient");

const getCustomers = async (req, res) => {
  try {
    const { timeframe } = req.query; // 'today', 'week', 'month', 'year', 'all'
    
    let dateFilter = {};
    const now = new Date();
    
    if (timeframe === 'today') {
      const startOfDay = new Date(now.setHours(0,0,0,0));
      dateFilter = { gte: startOfDay };
    } else if (timeframe === 'week') {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startOfWeek.setHours(0,0,0,0);
      dateFilter = { gte: startOfWeek };
    } else if (timeframe === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { gte: startOfMonth };
    } else if (timeframe === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      dateFilter = { gte: startOfYear };
    }

    const whereClause = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    // Fetch registered users
    const users = await prisma.user.findMany({
      where: {
        isAdmin: false,
        ...whereClause
      },
      orderBy: { createdAt: 'desc' }
    });

    // Fetch orders matching the timeframe (or all time to get accurate lifetime values)
    const orders = await prisma.order.findMany();

    const customersMap = {};

    // First populate from registered users
    users.forEach(user => {
      customersMap[user.email] = {
        id: user.id,
        name: user.name,
        email: user.email,
        totalOrders: 0,
        totalSpent: 0,
        cancelledOrders: 0,
        lastOrderDate: user.createdAt, // Fallback to join date
        isRegistered: true
      };
    });

    // Then process orders
    orders.forEach(order => {
      if (!customersMap[order.customerEmail]) {
        customersMap[order.customerEmail] = {
          name: order.customerName,
          email: order.customerEmail,
          totalOrders: 0,
          totalSpent: 0,
          cancelledOrders: 0,
          lastOrderDate: order.createdAt,
          isRegistered: false
        };
      }
      
      const customer = customersMap[order.customerEmail];
      
      // If timeframe filter applies, should we only count orders in timeframe?
      // For now, if a user is returned, we show lifetime stats. 
      // Wait, the timeframe filter was originally applied to orders.
      // Let's just calculate lifetime stats for these customers.
      customer.totalOrders += 1;
      
      if (order.orderStatus === 'CANCELLED') {
        customer.cancelledOrders += 1;
      } else {
        customer.totalSpent += order.totalPrice;
      }

      if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
        customer.lastOrderDate = order.createdAt;
      }
    });

    // Filter by timeframe if applied
    let customers = Object.values(customersMap);
    
    if (Object.keys(dateFilter).length > 0) {
      const gteDate = dateFilter.gte;
      customers = customers.filter(c => new Date(c.lastOrderDate) >= gteDate);
    }

    // Sort by most recent
    customers.sort((a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate));

    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        addresses: true,
        orders: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        wishlist: {
          include: {
            product: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Remove password hash from response
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error("Get customer error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCustomers,
  getCustomerById
};
