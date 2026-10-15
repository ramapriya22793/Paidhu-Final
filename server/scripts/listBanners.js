const prisma = require('../prismaClient');

async function listBanners() {
  const banners = await prisma.banner.findMany({ orderBy: { id: 'asc' } });
  console.log(JSON.stringify(banners.map(b => ({
    id: b.id,
    pageSlug: b.pageSlug,
    isActive: b.isActive,
    webImagePath: b.webImagePath,
    webImage: b.webImage
  })), null, 2));
  await prisma.$disconnect();
}

listBanners().catch(console.error);
