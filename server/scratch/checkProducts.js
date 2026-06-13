const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { id: { in: [23, 24, 25, 26, 27] } },
    select: { id: true, name: true, image: true, imagePath: true }
  });
  console.log("Products 23-27 in DB:", JSON.stringify(products, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
