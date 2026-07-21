const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixProductNames() {
  // Fix all product names with ??? corruption
  const products = await prisma.product.findMany({
    where: { name: { contains: '?' } }
  });

  console.log(`Found ${products.length} products with corrupted names:`);
  
  for (const p of products) {
    const fixedName = p.name.replace(/\s*\?+\s*/g, ' - ').trim();
    console.log(`  ID ${p.id}: "${p.name}" -> "${fixedName}"`);
    await prisma.product.update({
      where: { id: p.id },
      data: { name: fixedName }
    });
  }

  console.log('Done!');
  await prisma.$disconnect();
}

fixProductNames().catch(e => {
  console.error(e);
  process.exit(1);
});
