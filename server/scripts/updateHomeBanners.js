const prisma = require('../prismaClient');

async function updateHomeBanners() {
  console.log('--- UPDATING HOME BANNERS TO NAVARATHRI COMBOS ---');

  // Deactivate old cookie and jam banners
  await prisma.banner.updateMany({
    where: { pageSlug: 'home' },
    data: { isActive: false }
  });
  console.log('Deactivated existing home banners.');

  // Check if Navarathri banners already exist
  const existingNav = await prisma.banner.findMany({
    where: {
      pageSlug: 'home',
      webImage: { contains: 'newnavarathricombo' }
    }
  });

  if (existingNav.length > 0) {
    await prisma.banner.updateMany({
      where: {
        pageSlug: 'home',
        OR: [
          { webImage: { contains: 'newnavarathricombo' } },
          { webImage: { contains: 'PREMIUMSEGMENTS' } },
          { webImage: { contains: 'ECONOMYCOMBO' } }
        ]
      },
      data: { isActive: true }
    });
    console.log('Re-activated existing Navarathri banners.');
  } else {
    // Create the updated banners
    const bannersToCreate = [
      {
        pageSlug: 'home',
        webImage: '/api/storage/banners/1790590940099-newnavarathricombowebp.webp',
        webImagePath: 'banners/1790590940099-newnavarathricombowebp.webp',
        mobileImage: null,
        mobileImagePath: null,
        size: 'large',
        isActive: true,
        category: null,
        link: '/product/navratri-best-combo'
      },
      {
        pageSlug: 'home',
        webImage: '/api/storage/banners/1790404943695-PREMIUMSEGMENTSSwebp.webp',
        webImagePath: 'banners/1790404943695-PREMIUMSEGMENTSSwebp.webp',
        mobileImage: null,
        mobileImagePath: null,
        size: 'large',
        isActive: true,
        category: null,
        link: '/product/navratri-best-combo'
      },
      {
        pageSlug: 'home',
        webImage: '/api/storage/banners/1790404979298-ECONOMYCOMBOwebp.webp',
        webImagePath: 'banners/1790404979298-ECONOMYCOMBOwebp.webp',
        mobileImage: null,
        mobileImagePath: null,
        size: 'large',
        isActive: true,
        category: null,
        link: '/product/navratri-best-combo'
      }
    ];

    // Sync sequence first
    const res = await prisma.$queryRawUnsafe('SELECT COALESCE(MAX(id), 0) as max_id FROM "Banner"');
    const maxId = Number(res[0]?.max_id) || 0;
    await prisma.$executeRawUnsafe(`SELECT setval('"Banner_id_seq"', ${maxId + 1}, false)`);

    for (const b of bannersToCreate) {
      const created = await prisma.banner.create({ data: b });
      console.log(`Created Banner ID ${created.id}: ${b.webImage}`);
    }
  }

  const activeHome = await prisma.banner.findMany({
    where: { pageSlug: 'home', isActive: true }
  });
  console.log('\nActive Home Banners now:');
  console.table(activeHome.map(b => ({ id: b.id, webImage: b.webImage, link: b.link })));

  await prisma.$disconnect();
}

updateHomeBanners().catch(err => {
  console.error(err);
  process.exit(1);
});
