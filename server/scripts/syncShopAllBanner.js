const prisma = require('../prismaClient');

async function syncShopAllBanner() {
  console.log('Deactivating obsolete shop banners...');
  await prisma.banner.updateMany({
    where: {
      id: { in: [8, 10, 11, 12] }
    },
    data: {
      isActive: false
    }
  });

  console.log('Ensuring updated shop-all banner is active...');
  // Check if banner with shopallbanner001 exists
  const existing = await prisma.banner.findFirst({
    where: {
      OR: [
        { id: 20 },
        { webImagePath: { contains: 'shopallbanner001' } },
        { webImage: { contains: 'shopallbanner001' } }
      ]
    }
  });

  if (existing) {
    await prisma.banner.update({
      where: { id: existing.id },
      data: {
        pageSlug: 'shop-all',
        webImagePath: 'banners/1789880166235-shopallbanner001webp.webp',
        webImage: '/banners/shopallbanner001.webp',
        isActive: true,
        size: 'medium'
      }
    });
    console.log(`Updated banner ID ${existing.id} to active shop-all banner.`);
  } else {
    const created = await prisma.banner.create({
      data: {
        pageSlug: 'shop-all',
        webImagePath: 'banners/1789880166235-shopallbanner001webp.webp',
        webImage: '/banners/shopallbanner001.webp',
        isActive: true,
        size: 'medium'
      }
    });
    console.log(`Created new banner ID ${created.id} as active shop-all banner.`);
  }

  const activeShopBanners = await prisma.banner.findMany({
    where: {
      pageSlug: { in: ['shop-all', 'shop'] },
      isActive: true
    }
  });
  console.log('Current active shop banners:', activeShopBanners.map(b => ({ id: b.id, pageSlug: b.pageSlug, path: b.webImagePath, img: b.webImage })));
  
  await prisma.$disconnect();
}

syncShopAllBanner().catch(e => {
  console.error(e);
  process.exit(1);
});
