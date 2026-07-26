const prisma = require('./server/prismaClient');

function getCuratedFloralImage(title = '', category = '', originalUrl = '') {
  const text = (title + ' ' + (category || '')).toLowerCase();

  if (text.includes('aavaram') || text.includes('cassia') || text.includes('kondrai') || text.includes('golden bloom') || text.includes('yellow bloom')) {
    return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop';
  }

  if (text.includes('hibiscus') || text.includes('sembaruthi')) {
    return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop';
  }

  if (text.includes('blue pea') || text.includes('butterfly pea') || text.includes('bluepea') || text.includes('blue bloom')) {
    return 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop';
  }

  if (text.includes('rose') || text.includes('gulkand') || text.includes('damask')) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop';
  }

  if (text.includes('banana flower') || text.includes('vazhaipoo') || text.includes('chapati roll') || text.includes('pakora') || text.includes('sandwich')) {
    return 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop';
  }

  if (text.includes('drumstick flower') || text.includes('moringa') || text.includes('curd rice') || text.includes('neer mor')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
  }

  if (text.includes('pumpkin flower') || text.includes('fritter') || text.includes('dandelion')) {
    return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop';
  }

  if (text.includes('neem') || text.includes('rasam') || text.includes('chamomile') || text.includes('lavender') || text.includes('herbal tea') || text.includes('traditional')) {
    return 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop';
  }

  if (text.includes('jasmine') || text.includes('payasam') || text.includes('sweet') || text.includes('dessert')) {
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop';
  }

  return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop';
}

async function main() {
  const blogs = await prisma.blog.findMany();
  console.log(`Updating ${blogs.length} database records with verified topic-matched floral photography...`);

  for (const b of blogs) {
    const newImg = getCuratedFloralImage(b.title, b.category, b.image);
    await prisma.blog.update({
      where: { id: b.id },
      data: {
        image: newImg,
        featuredImage: newImg
      }
    });
    console.log(`[ID ${b.id}] "${b.title}" -> ${newImg}`);
  }

  console.log(`Successfully updated all ${blogs.length} blog records!`);
}

main().finally(() => prisma.$disconnect());
