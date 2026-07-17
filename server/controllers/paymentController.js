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
            orderStatus: true
          }
        },
        refunds: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(payments);
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
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { refunds: true }
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalRevenue = 0;
    let todayRevenue = 0;
    let monthRevenue = 0;
    let successfulCount = 0;
    let pendingCount = 0;
    let failedCount = 0;
    let refundRequests = 0;
    let refundedAmount = 0;

    payments.forEach(p => {
      const pDate = new Date(p.createdAt);
      if (p.status === 'SUCCESS' || p.status === 'PAID') {
        successfulCount++;
        totalRevenue += p.amount;
        if (pDate >= today) todayRevenue += p.amount;
        if (pDate >= firstDayOfMonth) monthRevenue += p.amount;
      } else if (p.status === 'PENDING') {
        pendingCount++;
      } else if (p.status === 'FAILED') {
        failedCount++;
      }

      if (p.refunds && p.refunds.length > 0) {
        refundRequests += p.refunds.length;
        p.refunds.forEach(r => {
          if (r.status === 'PROCESSED' || r.status === 'APPROVED') {
            refundedAmount += r.refundAmount;
          }
        });
      }
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
