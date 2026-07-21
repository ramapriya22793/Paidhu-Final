const prisma = require('./prismaClient');

async function run() {
  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: 'jam',
          mode: 'insensitive'
        }
      }
    });

    console.log(`Found ${products.length} jam products.`);

    for (const product of products) {
      if (Array.isArray(product.variants) && product.variants.length > 1) {
        // Find if they contain 250g and 30g
        const has250g = product.variants.some(v => v.size === '250g');
        const has30g = product.variants.some(v => v.size === '30g');

        if (has250g && has30g) {
          // Reorder so 250g comes first
          const reordered = [];
          const v250 = product.variants.find(v => v.size === '250g');
          const v30 = product.variants.find(v => v.size === '30g');
          const rest = product.variants.filter(v => v.size !== '250g' && v.size !== '30g');

          reordered.push(v250);
          reordered.push(v30);
          reordered.push(...rest);

          await prisma.product.update({
            where: { id: product.id },
            data: { variants: reordered }
          });
          console.log(`Updated variants for "${product.name}" (ID: ${product.id})`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
