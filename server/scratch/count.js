const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pCount = await prisma.product.count();
  const cCount = await prisma.category.count();
  console.log('Product count:', pCount);
  console.log('Category count:', cCount);
  await prisma.$disconnect();
}

main();
