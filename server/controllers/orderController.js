const resequenceOrders = async () => {
  try {
    const allOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, orderNumber: true }
    });

    for (let i = 0; i < allOrders.length; i++) {
      const seqNum = `P${(i + 1).toString().padStart(4, '0')}`;
      if (allOrders[i].orderNumber !== seqNum) {
        await prisma.order.update({
          where: { id: allOrders[i].id },
          data: { orderNumber: seqNum }
        });
      }
    }
  } catch (err) {
    console.error("Resequence orders error:", err);
  }
};

const getOrders = async (req, res) => {
  try {
    await resequenceOrders();
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

const deleteOrder = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    // Delete related records first if any exist
    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.payment.deleteMany({ where: { orderId: id } });
    await prisma.refund.deleteMany({ where: { orderId: id } });

    await prisma.order.delete({ where: { id } });
    await resequenceOrders();
    res.json({ success: true, message: "Order deleted and order numbers re-sequenced successfully" });

  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ message: error.message || "Failed to delete order" });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderDetails,
  getMyOrders,
  deleteOrder
};

