const prisma = require('./server/prismaClient');

async function main() {
  console.log('Batch updating blog images...');

  const r1 = await prisma.blog.updateMany({
    where: {
      OR: [
        { title: { contains: 'hibiscus', mode: 'insensitive' } },
        { title: { contains: 'sembaruthi', mode: 'insensitive' } },
        { category: { contains: 'hibiscus', mode: 'insensitive' } }
      ]
    },
    data: {
      image: '/blogs/hibiscus_gourmet_drink.png',
      featuredImage: '/blogs/hibiscus_gourmet_drink.png'
    }
  });

  const r2 = await prisma.blog.updateMany({
    where: {
      OR: [
        { title: { contains: 'rose', mode: 'insensitive' } },
        { title: { contains: 'gulkand', mode: 'insensitive' } },
        { title: { contains: 'damask', mode: 'insensitive' } },
        { category: { contains: 'rose', mode: 'insensitive' } }
      ]
    },
    data: {
      image: '/blogs/rose_petal_delicacy.png',
      featuredImage: '/blogs/rose_petal_delicacy.png'
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
      image: '/blogs/blue_pea_floral_tea.png',
      featuredImage: '/blogs/blue_pea_floral_tea.png'
    }
  });

  const r4 = await prisma.blog.updateMany({
    where: {
      OR: [
        { title: { contains: 'aavaram', mode: 'insensitive' } },
        { title: { contains: 'neem', mode: 'insensitive' } },
        { title: { contains: 'kondrai', mode: 'insensitive' } },
        { title: { contains: 'cassia', mode: 'insensitive' } },
        { title: { contains: 'chamomile', mode: 'insensitive' } },
        { title: { contains: 'lavender', mode: 'insensitive' } },
        { title: { contains: 'traditional', mode: 'insensitive' } },
        { category: { contains: 'herbal', mode: 'insensitive' } },
        { category: { contains: 'brew flora', mode: 'insensitive' } }
      ]
    },
    data: {
      image: '/blogs/aavaram_herbal_tea.png',
      featuredImage: '/blogs/aavaram_herbal_tea.png'
    }
  });

  const r5 = await prisma.blog.updateMany({
    where: {
      AND: [
        { image: { not: '/blogs/hibiscus_gourmet_drink.png' } },
        { image: { not: '/blogs/rose_petal_delicacy.png' } },
        { image: { not: '/blogs/blue_pea_floral_tea.png' } },
        { image: { not: '/blogs/aavaram_herbal_tea.png' } }
      ]
    },
    data: {
      image: '/blogs/gourmet_floral_salad.png',
      featuredImage: '/blogs/gourmet_floral_salad.png'
    }
  });

  console.log(`Updated Hibiscus: ${r1.count}, Rose: ${r2.count}, Blue Pea: ${r3.count}, Aavaram/Herbal: ${r4.count}, Other Salads: ${r5.count}`);
}

main().finally(() => prisma.$disconnect());
