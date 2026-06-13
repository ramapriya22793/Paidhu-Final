const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Family Combos data...');
  
  // 1. Upsert Banner
  const bannerData = {
    pageSlug: 'family-combos',
    webImage: 'https://images.unsplash.com/photo-1490818387583-1b0570f550ce?q=80&w=2070&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1490818387583-1b0570f550ce?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    size: 'medium'
  };

  const existingBanner = await prisma.banner.findFirst({
    where: { pageSlug: 'family-combos' }
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

  // 2. Update Settings
  const familyTitle = 'Paidhu Supergrains';
  const familyTabs = ['Protein Powder', 'High Fibre Oats', 'Millet Pancakes', 'Luxury Teas'];

  const settings = await prisma.siteSettings.findFirst();
  if (settings) {
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: { familyTitle, familyTabs }
    });
  } else {
    await prisma.siteSettings.create({
      data: { familyTitle, familyTabs }
    });
  }
  
  // 3. Tag some existing products with these tabs
  const products = await prisma.product.findMany({ take: 4 });
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const tabToAssign = familyTabs[i]; // assign one tab to each of the first 4 products
    
    let tags = p.tags || '';
    if (!tags.includes(tabToAssign)) {
      tags = tags ? tags + ', ' + tabToAssign : tabToAssign;
      await prisma.product.update({
        where: { id: p.id },
        data: { tags }
      });
      console.log(`Tagged product ID ${p.id} with ${tabToAssign}`);
    }
  }

  console.log('Seeding complete! Banner added, title and tabs set, and products tagged.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
