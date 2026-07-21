const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const banners = await prisma.banner.findMany({
      where: { pageSlug: 'our-own-community' }
    });
    console.log('Banners for our-own-community:', banners);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
