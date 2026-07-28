const prisma = require("../prismaClient");

const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true,
            customerEmail: true,
            orderStatus: true,
            totalPrice: true
          }
        },
        refunds: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const paymentOrderIds = new Set(payments.map(p => p.orderId));
    const ordersWithoutPayment = await prisma.order.findMany({
      where: {
        id: { notIn: Array.from(paymentOrderIds) }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedOrders = ordersWithoutPayment.map(o => ({
      id: `order_${o.id}`,
      orderId: o.id,
      userId: o.userId,
      gateway: o.paymentMethod || 'COD',
      razorpayOrderId: null,
      razorpayPaymentId: o.orderNumber || `P${String(o.id).padStart(4, '0')}`,
      razorpaySignature: null,
      amount: o.totalPrice || 0,
      method: o.paymentMethod || 'COD',
      status: (o.paymentStatus === 'PAID' || o.paymentStatus === 'SUCCESS') ? 'PAID' : (o.orderStatus === 'CANCELLED' ? 'FAILED' : 'PENDING'),
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      order: {
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        orderStatus: o.orderStatus,
        totalPrice: o.totalPrice
      },
      refunds: []
    }));

    const sanitizedPayments = payments.map(p => ({
      ...p,
      amount: (p.amount && p.amount > 0) ? p.amount : (p.order ? p.order.totalPrice : 0)
    }));

    const combined = [...sanitizedPayments, ...formattedOrders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(combined);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        order: {
          include: {
            items: {
              include: { product: true }
            },
            coupon: true
          }
        },
        user: true,
        refunds: true
      }
    });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (!payment.amount || payment.amount === 0) {
      if (payment.order && payment.order.totalPrice) {
        payment.amount = payment.order.totalPrice;
      }
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { payments: true }
    });

    const refunds = await prisma.refund.findMany();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalRevenue = 0;
    let todayRevenue = 0;
    let monthRevenue = 0;
    let successfulCount = 0;
    let pendingCount = 0;
    let failedCount = 0;
    let refundRequests = refunds.length;
    let refundedAmount = 0;

    refunds.forEach(r => {
      if (r.status === 'PROCESSED' || r.status === 'APPROVED') {
        refundedAmount += r.refundAmount;
      }
    });

    orders.forEach(order => {
      if (order.orderStatus === 'CANCELLED') {
        failedCount++;
        return;
      }

      const oDate = new Date(order.createdAt);
      const amt = order.totalPrice || 0;

      const isPaid = order.paymentStatus === 'PAID' || order.paymentStatus === 'SUCCESS' || 
                     order.payments.some(p => p.status === 'SUCCESS' || p.status === 'PAID');

      if (isPaid) {
        successfulCount++;
      } else {
        pendingCount++;
      }

      totalRevenue += amt;
      if (oDate >= today) todayRevenue += amt;
      if (oDate >= firstDayOfMonth) monthRevenue += amt;
    });

    res.json({
      totalRevenue,
      todayRevenue,
      monthRevenue,
      successfulCount,
      pendingCount,
      failedCount,
      refundRequests,
      refundedAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRefund = async (req, res) => {
  try {
    const { refundAmount, reason } = req.body;
    const paymentId = Number(req.params.id);
    
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const refund = await prisma.refund.create({
      data: {
        paymentId,
        orderId: payment.orderId,
        refundAmount: Number(refundAmount),
        reason
      }
    });
    
    res.json(refund);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRefundStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const refundId = Number(req.params.id);

    const refund = await prisma.refund.update({
      where: { id: refundId },
      data: { status }
    });

    // If processed, update payment status to REFUNDED
    if (status === 'PROCESSED') {
      await prisma.payment.update({
        where: { id: refund.paymentId },
        data: { status: 'REFUNDED' }
      });
      await prisma.order.update({
        where: { id: refund.orderId },
        data: { paymentStatus: 'REFUNDED' }
      });
    }

    res.json(refund);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  getAnalytics,
  createRefund,
  updateRefundStatus
};
