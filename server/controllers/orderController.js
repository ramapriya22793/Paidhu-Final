const prisma = require("../prismaClient");

const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true,
        coupon: true,
        payments: true
      }
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await prisma.order.findUnique({ where: { id: Number(req.params.id) } });
    
    let updatedTimeline = order.timeline ? (Array.isArray(order.timeline) ? [...order.timeline] : []) : [];
    updatedTimeline.push({
      status: orderStatus,
      date: new Date().toISOString(),
      note: 'Status updated by admin'
    });

    const updatedOrder = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { orderStatus, timeline: updatedTimeline }
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderDetails = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber, courierPartner, estimatedDeliveryDate } = req.body;
    
    const order = await prisma.order.findUnique({ where: { id: Number(req.params.id) } });
    
    let updatedTimeline = order.timeline ? (Array.isArray(order.timeline) ? [...order.timeline] : []) : [];
    
    // Add timeline events if status changed
    if (orderStatus && orderStatus !== order.orderStatus) {
      updatedTimeline.push({
        status: orderStatus,
        date: new Date().toISOString(),
        note: `Order status updated to ${orderStatus}`
      });
    }

    if (paymentStatus && paymentStatus !== order.paymentStatus) {
      updatedTimeline.push({
        status: 'PAYMENT_UPDATE',
        date: new Date().toISOString(),
        note: `Payment status updated to ${paymentStatus}`
      });
    }

    const dataToUpdate = {};
    if (orderStatus !== undefined) dataToUpdate.orderStatus = orderStatus;
    if (paymentStatus !== undefined) dataToUpdate.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) dataToUpdate.trackingNumber = trackingNumber;
    if (courierPartner !== undefined) dataToUpdate.courierPartner = courierPartner;
    if (estimatedDeliveryDate !== undefined) dataToUpdate.estimatedDeliveryDate = estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : null;
    
    dataToUpdate.timeline = updatedTimeline;

    const updatedOrder = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: dataToUpdate
    });
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderDetails,
  getMyOrders
};
