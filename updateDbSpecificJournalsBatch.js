const prisma = require('./server/prismaClient');

async function main() {
  console.log('Fetching all blogs to update images strictly based on title...');
  const blogs = await prisma.blog.findMany({ select: { id: true, title: true } });

  let updated = 0;
  for (const b of blogs) {
    const text = (b.title || '').toLowerCase();
    let img = null;

    if (text.includes('lavender')) {
      img = '/blogs/lavender_dip_tea.png';
    } else if (text.includes('saffron')) {
      img = '/blogs/saffron_herbal_tea.png';
    } else if (text.includes('fruit salad') || text.includes('rainbow flower')) {
      img = '/blogs/rainbow_flower_salad.png';
    } else if (text.includes('panna cotta')) {
      img = '/blogs/bluepea_panna_cotta.png';
    } else if (text.includes('halwa') || text.includes('marigold')) {
      img = '/blogs/marigold_halwa.png';
    } else if (text.includes('aavaram') || text.includes('cassia') || text.includes('kondrai') || text.includes('golden bloom') || text.includes('yellow bloom')) {
      img = '/blogs/aavaram_dip_tea.png';
    } else if (text.includes('hibiscus') || text.includes('sembaruthi')) {
      img = '/blogs/hibiscus_dip_tea.png';
    } else if (text.includes('blue pea') || text.includes('butterfly pea') || text.includes('bluepea') || text.includes('blue bloom')) {
      img = '/blogs/blue_pea_dip_tea.png';
    } else if (text.includes('rose') || text.includes('gulkand') || text.includes('damask')) {
      img = '/blogs/rose_petal_delicacy.png';
    }

    if (img) {
      await prisma.blog.update({
        where: { id: b.id },
        data: { image: img, featuredImage: img }
      });
      updated++;
    }
  }

  console.log(`Successfully updated ${updated} blog records in DB individually!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
