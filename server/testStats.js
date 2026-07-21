const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testStats() {
  try {
    const start = Date.now();
    const count = await prisma.order.count();
    console.log("Total orders:", count);
    
    // Time the slow queries
    const start2 = Date.now();
    const allPaidOrders = await prisma.order.findMany({
      select: { id: true }
    });
    console.log("Fetched all orders in", Date.now() - start2, "ms");
    
  } catch (error) {
    console.error(error.message);
  } finally {
    prisma.$disconnect();
  }
}

testStats();
