const prisma = require('./server/prismaClient');

async function main() {
  console.log('Auditing and updating all blog records for 100% brand-matched floral & vegetarian food photography...');

  const blogs = await prisma.blog.findMany({
    select: { id: true, title: true, category: true, image: true, featuredImage: true }
  });

  let updatedCount = 0;

  for (const b of blogs) {
    const text = (b.title + ' ' + (b.category || '')).toLowerCase();
    let img = null;

    // 1. Jasmine Omelette & Jasmine Dishes (Fluffy vegetarian floral omelette with edible petals)
    if (text.includes('jasmine') && (text.includes('omelette') || text.includes('egg') || text.includes('breakfast'))) {
      img = 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop';
    }
    // 2. Jasmine Payasam & Sweets
    else if (text.includes('jasmine')) {
      img = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop';
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
    // 14. Drumstick / Moringa Flower (Rice, Mor & Curd Rice)
    else if (text.includes('drumstick flower') || text.includes('moringa') || text.includes('curd rice') || text.includes('neer mor') || text.includes('lemon rice') || text.includes('aval')) {
      img = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
    }
    // 15. Pumpkin Flower & Fritters & Dandelion
    else if (text.includes('pumpkin flower') || text.includes('fritter') || text.includes('dandelion')) {
      img = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop';
    }
    // 16. Neem Flower / Rasam / Herbal Remedy
    else if (text.includes('neem') || text.includes('rasam') || text.includes('herbal tea') || text.includes('traditional')) {
      img = '/blogs/aavaram_dip_tea.png';
    }
    // 17. Fallback
    else {
      img = '/blogs/aavaram_dip_tea.png';
    }

    if (img && (b.image !== img || b.featuredImage !== img)) {
      await prisma.blog.update({
        where: { id: b.id },
        data: { image: img, featuredImage: img }
      });
      console.log(`[ID ${b.id}] "${b.title}" -> ${img}`);
      updatedCount++;
    }
  }

  console.log(`\nSuccessfully updated ${updatedCount} blog records to 100% brand-matched floral photography!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
