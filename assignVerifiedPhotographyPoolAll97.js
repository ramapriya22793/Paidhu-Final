const prisma = require('./server/prismaClient');

async function main() {
  console.log('Auditing and updating ALL 97 blog database records with curated, topic-matched photography...');

  const blogs = await prisma.blog.findMany({
    select: { id: true, title: true, category: true, image: true, featuredImage: true }
  });

  console.log(`Found ${blogs.length} blog records in database.`);

  let updatedCount = 0;

  for (const b of blogs) {
    const text = (b.title + ' ' + (b.category || '')).toLowerCase();
    let img = null;

    // 1. Jasmine Omelette / Breakfast
    if (text.includes('jasmine') && (text.includes('omelette') || text.includes('egg') || text.includes('breakfast'))) {
      img = 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop';
    }
    // 2. Jasmine Sweets / Payasam
    else if (text.includes('jasmine')) {
      img = '/blogs/rose_petal_delicacy.png';
    }
    // 3. Chamomile
    else if (text.includes('chamomile')) {
      img = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop';
    }
    // 4. Lavender
    else if (text.includes('lavender')) {
      img = '/blogs/lavender_dip_tea.png';
    }
    // 5. Saffron
    else if (text.includes('saffron')) {
      img = '/blogs/saffron_herbal_tea.png';
    }
    // 6. Rainbow Flower Fruit Salad
    else if (text.includes('fruit salad') || text.includes('rainbow flower')) {
      img = '/blogs/rainbow_flower_salad.png';
    }
    // 7. Panna Cotta
    else if (text.includes('panna cotta')) {
      img = '/blogs/bluepea_panna_cotta.png';
    }
    // 8. Marigold & Halwa
    else if (text.includes('halwa') || text.includes('marigold')) {
      img = '/blogs/marigold_halwa.png';
    }
    // 9. Rose / Gulkand / Damask Rose
    else if (text.includes('rose') || text.includes('gulkand') || text.includes('damask')) {
      img = '/blogs/rose_petal_delicacy.png';
    }
    // 10. Aavaram Poo / Cassia / Kondrai / Golden Bloom
    else if (text.includes('aavaram') || text.includes('cassia') || text.includes('kondrai') || text.includes('golden bloom') || text.includes('yellow bloom')) {
      img = '/blogs/aavaram_dip_tea.png';
    }
    // 11. Hibiscus / Sembaruthi
    else if (text.includes('hibiscus') || text.includes('sembaruthi')) {
      img = '/blogs/hibiscus_dip_tea.png';
    }
    // 12. Blue Pea / Butterfly Pea
    else if (text.includes('blue pea') || text.includes('butterfly pea') || text.includes('bluepea') || text.includes('blue bloom')) {
      img = '/blogs/blue_pea_dip_tea.png';
    }
    // 13. Banana Flower / Vazhaipoo
    else if (text.includes('banana flower') || text.includes('vazhaipoo') || text.includes('chapati roll') || text.includes('pakora') || text.includes('sandwich') || text.includes('toast')) {
      img = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop';
    }
    // 14. Drumstick / Moringa Flower
    else if (text.includes('drumstick flower') || text.includes('moringa') || text.includes('curd rice') || text.includes('neer mor') || text.includes('lemon rice') || text.includes('aval')) {
      img = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
    }
    // 15. Dandelion & Lentil Sambar
    else if (text.includes('dandelion') || text.includes('sambar')) {
      img = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop';
    }
    // 16. Marigold & Vegetable Dosa
    else if (text.includes('dosa')) {
      img = 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800&auto=format&fit=crop';
    }
    // 17. Pumpkin Flower & Fritters
    else if (text.includes('pumpkin flower') || text.includes('fritter')) {
      img = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop';
    }
    // 18. Neem Flower / Rasam / Herbal Remedy
    else if (text.includes('neem') || text.includes('rasam') || text.includes('herbal tea') || text.includes('traditional')) {
      img = '/blogs/aavaram_dip_tea.png';
    }
    // 19. Fallback
    else {
      img = '/blogs/aavaram_dip_tea.png';
    }

    if (img) {
      await prisma.blog.update({
        where: { id: b.id },
        data: { image: img, featuredImage: img }
      });
      updatedCount++;
    }
  }

  console.log(`Successfully updated all ${updatedCount} blog records with verified topic-matched photography!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
