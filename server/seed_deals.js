const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding deals data...');
  
  // 1. Upsert Banner
  const bannerData = {
    pageSlug: 'deals',
    webImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    size: 'medium'
  };

  const existingBanner = await prisma.banner.findFirst({
    where: { pageSlug: 'deals' }
  });

  if (existingBanner) {
    await prisma.banner.update({
      where: { id: existingBanner.id },
      data: bannerData
    });
  } else {
    await prisma.banner.create({
      data: bannerData
    });
  }

  // 2. Update Categories in SiteSettings
  const dealCategories = [
    {
      name: 'Best Sellers',
      link: '/shop?tag=bestseller',
      image: 'https://images.unsplash.com/photo-1559564114-561b36585141?q=80&w=500&auto=format&fit=crop'
    },
    {
      name: 'New Arrivals',
      link: '/shop?tag=new',
      image: 'https://images.unsplash.com/photo-1582216514547-1110a30b42f2?q=80&w=500&auto=format&fit=crop'
    },
    {
      name: 'Limited Edition',
      link: '/shop?tag=limited',
      image: 'https://images.unsplash.com/photo-1523688881989-ce7618f3a389?q=80&w=500&auto=format&fit=crop'
    },
    {
      name: 'Combo Offers',
      link: '/family-combos',
      image: 'https://images.unsplash.com/photo-1542272454-e0b686307399?q=80&w=500&auto=format&fit=crop'
    }
  ];

  const settings = await prisma.siteSettings.findFirst();
  if (settings) {
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: { dealCategories }
    });
  } else {
    await prisma.siteSettings.create({
      data: { dealCategories }
    });
  }
  
  // 3. Tag some existing products with deal_of_the_day
  const products = await prisma.product.findMany({ take: 4 });
  for (const p of products) {
    let tags = p.tags || '';
    if (!tags.includes('deal_of_the_day')) {
      tags = tags ? tags + ', deal_of_the_day' : 'deal_of_the_day';
      await prisma.product.update({
        where: { id: p.id },
        data: { tags }
      });
    }
  }

  console.log('Seeding complete! 4 products tagged, banners added, categories added.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
