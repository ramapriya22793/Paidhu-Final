const prisma = require('./prismaClient');

async function main() {
  const banners = await prisma.banner.findMany({
    orderBy: { id: 'desc' }
  });
  console.log("ALL BANNERS IN DATABASE:");
  console.log(JSON.stringify(banners, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
