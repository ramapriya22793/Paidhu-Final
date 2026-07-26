const prisma = require('./server/prismaClient');

async function main() {
  console.log('Updating DB records for specific journal titles...');

  // Lavender
  const r1 = await prisma.blog.updateMany({
    where: { title: { contains: 'lavender', mode: 'insensitive' } },
    data: { image: '/blogs/lavender_dip_tea.png', featuredImage: '/blogs/lavender_dip_tea.png' }
  });

  // Saffron
  const r2 = await prisma.blog.updateMany({
    where: { title: { contains: 'saffron', mode: 'insensitive' } },
    data: { image: '/blogs/saffron_herbal_tea.png', featuredImage: '/blogs/saffron_herbal_tea.png' }
  });

  // Fruit Salad
  const r3 = await prisma.blog.updateMany({
    where: {
      OR: [
        { title: { contains: 'fruit salad', mode: 'insensitive' } },
        { title: { contains: 'rainbow flower', mode: 'insensitive' } }
      ]
    },
    data: { image: '/blogs/rainbow_flower_salad.png', featuredImage: '/blogs/rainbow_flower_salad.png' }
  });

  // Panna Cotta
  const r4 = await prisma.blog.updateMany({
    where: { title: { contains: 'panna cotta', mode: 'insensitive' } },
    data: { image: '/blogs/bluepea_panna_cotta.png', featuredImage: '/blogs/bluepea_panna_cotta.png' }
  });

  // Marigold & Halwa
  const r5 = await prisma.blog.updateMany({
    where: {
      OR: [
        { title: { contains: 'halwa', mode: 'insensitive' } },
        { title: { contains: 'marigold', mode: 'insensitive' } }
      ]
    },
    data: { image: '/blogs/marigold_halwa.png', featuredImage: '/blogs/marigold_halwa.png' }
  });

  console.log(`Updated - Lavender: ${r1.count}, Saffron: ${r2.count}, Fruit Salad: ${r3.count}, Panna Cotta: ${r4.count}, Marigold: ${r5.count}`);
}

main().finally(() => prisma.$disconnect());
