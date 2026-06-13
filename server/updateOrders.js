const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany();
  let count = 0;
  for (const order of orders) {
    // Only update if it looks like a UUID (length > 10) or isn't formatted yet
    if (!order.orderNumber || order.orderNumber.length > 10) {
      const formattedId = String(order.id).padStart(4, '0');
      const orderNumber = `P${formattedId}`;
      await prisma.order.update({
        where: { id: order.id },
        data: { orderNumber }
      });
      count++;
    }
  }
  console.log(`Updated ${count} orders successfully.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
