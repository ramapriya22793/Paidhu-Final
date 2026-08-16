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

    // Helper: check if email is a real customer email (not temporary guest token)
    const isRealEmail = (email) => {
      if (!email) return false;
      const lower = email.toLowerCase().trim();
      return !lower.endsWith('@paidhu.local') && !lower.startsWith('guest_');
    };

    // Fetch registered users
    const users = await prisma.user.findMany({
      where: {
        isAdmin: false,
        ...whereClause
      },
      orderBy: { createdAt: 'desc' }
    });

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const customersMap = {};

    // First populate from registered users with real emails
    users.forEach(user => {
      if (isRealEmail(user.email)) {
        customersMap[user.email.toLowerCase().trim()] = {
          id: user.id,
          name: user.name && !user.name.startsWith('Guest') ? user.name : 'Registered User',
          email: user.email,
          phone: user.phone || null,
          totalOrders: 0,
          totalSpent: 0,
          cancelledOrders: 0,
          lastOrderDate: user.createdAt,
          isRegistered: true
        };
      }
    });

    // Then process orders
    orders.forEach(order => {
      const orderEmail = order.customerEmail ? order.customerEmail.toLowerCase().trim() : '';
      if (!orderEmail) return;

      const isRegisteredAccount = isRealEmail(orderEmail);

      if (!customersMap[orderEmail]) {
        let phone = null;
        if (order.shippingAddress) {
          const match = order.shippingAddress.match(/Phone:\s*([+\d\s-]+)/i);
          if (match && match[1]) phone = match[1].trim();
        }

        customersMap[orderEmail] = {
          id: null,
          name: order.customerName || 'Customer',
          email: order.customerEmail,
          phone,
          totalOrders: 0,
          totalSpent: 0,
          cancelledOrders: 0,
          lastOrderDate: order.createdAt,
          isRegistered: isRegisteredAccount
        };
      }

      const customer = customersMap[orderEmail];
      customer.totalOrders += 1;
      
      if (order.customerName && (customer.name === 'Customer' || customer.name === 'Registered User')) {
        customer.name = order.customerName;
      }

      if (!customer.phone && order.shippingAddress) {
        const match = order.shippingAddress.match(/Phone:\s*([+\d\s-]+)/i);
        if (match && match[1]) customer.phone = match[1].trim();
      }

      if (order.orderStatus === 'CANCELLED') {
        customer.cancelledOrders += 1;
      } else {
        customer.totalSpent += order.totalPrice;
      }

      if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
        customer.lastOrderDate = order.createdAt;
      }
    });

    // Filter out 0-order temporary guest tokens
    let customers = Object.values(customersMap).filter(c => {
      return isRealEmail(c.email) || c.totalOrders > 0;
    });

    if (Object.keys(dateFilter).length > 0) {
      const gteDate = dateFilter.gte;
      customers = customers.filter(c => new Date(c.lastOrderDate) >= gteDate);
    }

    // Sort by most recent activity
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
