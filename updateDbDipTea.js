const prisma = require('./server/prismaClient');

async function main() {
  console.log('Updating DB with Herbal Dip Tea AI images...');

  const r1 = await prisma.blog.updateMany({
    where: {
      OR: [
        { title: { contains: 'aavaram', mode: 'insensitive' } },
        { title: { contains: 'cassia', mode: 'insensitive' } },
        { title: { contains: 'kondrai', mode: 'insensitive' } },
        { title: { contains: 'golden bloom', mode: 'insensitive' } },
        { title: { contains: 'yellow bloom', mode: 'insensitive' } },
        { title: { contains: 'traditional', mode: 'insensitive' } },
        { category: { contains: 'aavaram', mode: 'insensitive' } },
        { category: { contains: 'herbal', mode: 'insensitive' } }
      ]
    },
    data: {
      image: '/blogs/aavaram_dip_tea.png',
      featuredImage: '/blogs/aavaram_dip_tea.png'
    }
  });

  const r2 = await prisma.blog.updateMany({
    where: {
      OR: [
        { title: { contains: 'hibiscus', mode: 'insensitive' } },
        { title: { contains: 'sembaruthi', mode: 'insensitive' } },
        { category: { contains: 'hibiscus', mode: 'insensitive' } }
      ]
    },
    data: {
      image: '/blogs/hibiscus_dip_tea.png',
      featuredImage: '/blogs/hibiscus_dip_tea.png'
    }
  });

  const r3 = await prisma.blog.updateMany({
    where: {
      OR: [
        { title: { contains: 'blue pea', mode: 'insensitive' } },
        { title: { contains: 'butterfly pea', mode: 'insensitive' } },
        { title: { contains: 'bluepea', mode: 'insensitive' } },
        { category: { contains: 'blue pea', mode: 'insensitive' } }
      ]
    },
    data: {
      image: '/blogs/blue_pea_dip_tea.png',
      featuredImage: '/blogs/blue_pea_dip_tea.png'
    }
  });

  console.log(`Updated Aavaram Dip Tea: ${r1.count}, Hibiscus Dip Tea: ${r2.count}, Blue Pea Dip Tea: ${r3.count}`);
}

main().finally(() => prisma.$disconnect());
