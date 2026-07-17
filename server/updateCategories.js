const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categoryMapping = {
  'Floral Cookies': 'Bloom Cookies',
  'Petal Jams': 'Petal Jam',
  'Dry Flower Teas': 'Medley Teas',
  'Saffron Collection': 'Saffron',
  'Tea Pairings': 'Brew Flora',
  'Family Combos': 'Combos',
  'Luxury Hampers': 'Bloom Powder'
};

async function updateCategories() {
  console.log("Starting category migration...");
  
  for (const [oldCategory, newCategory] of Object.entries(categoryMapping)) {
    const result = await prisma.product.updateMany({
      where: { category: oldCategory },
      data: { category: newCategory }
    });
    console.log(`Updated ${result.count} products from "${oldCategory}" to "${newCategory}"`);
  }
  
  console.log("Migration complete!");
}

updateCategories()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
