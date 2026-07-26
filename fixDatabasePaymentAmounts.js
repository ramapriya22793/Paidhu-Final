const prisma = require('./server/prismaClient');

async function fixPaymentAmounts() {
  console.log('Fixing payment amounts in database...');
  const payments = await prisma.payment.findMany({
    include: { order: true }
  });

  console.log(`Found ${payments.length} total payments in DB.`);

  for (const p of payments) {
    if ((!p.amount || p.amount === 0) && p.order && p.order.totalPrice > 0) {
      await prisma.payment.update({
        where: { id: p.id },
        data: { amount: p.order.totalPrice }
      });
      console.log(`Updated payment ID ${p.id} amount from 0 to ₹${p.order.totalPrice}`);
    }
  }

  // Check if there are any confirmed/paid orders without a Payment record
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { orderStatus: { in: ['CONFIRMED', 'DELIVERED', 'SHIPPED', 'PACKED'] } },
        { paymentStatus: 'PAID' }
      ]
    },
    include: { payments: true }
  });

  for (const o of orders) {
    if (o.payments.length === 0) {
      await prisma.payment.create({
        data: {
          orderId: o.id,
          userId: o.userId,
          amount: o.totalPrice,
          method: o.paymentMethod || 'Online',
          status: 'SUCCESS'
        }
      });
      console.log(`Created payment record for order ID ${o.id} (${o.orderNumber}) amount ₹${o.totalPrice}`);
    }
  }

  console.log('Payment amounts repair complete!');
}

fixPaymentAmounts()
  .catch(err => console.error('Error repairing payment amounts:', err))
  .finally(() => prisma.$disconnect());
