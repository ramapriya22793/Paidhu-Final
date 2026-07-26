const prisma = require('./server/prismaClient');

function getCuratedFloralImage(title = '', category = '', originalUrl = '') {
  const text = (title + ' ' + (category || '')).toLowerCase();

  const isGeneric = !originalUrl || 
    originalUrl.includes('wp.paidhu.com/wp-content') ||
    originalUrl.includes('placeholder') || 
    originalUrl.includes('default') || 
    originalUrl.includes('child') || 
    originalUrl.includes('camera') || 
    originalUrl.includes('toy') ||
    originalUrl.includes('teacora') ||
    originalUrl.includes('516627145497') ||
    originalUrl.includes('kms') ||
    originalUrl.includes('broccoli') ||
    originalUrl.includes('galaxy') ||
    originalUrl.includes('space') ||
    originalUrl.includes('unsplash');

  if (originalUrl && !isGeneric && originalUrl.startsWith('/blogs/')) {
    return originalUrl;
  }

  if (text.includes('hibiscus') || text.includes('sembaruthi')) {
    return '/blogs/hibiscus_gourmet_drink.png';
  }
  if (text.includes('rose') || text.includes('gulkand') || text.includes('damask')) {
    return '/blogs/rose_petal_delicacy.png';
  }
  if (text.includes('blue pea') || text.includes('butterfly pea') || text.includes('bluepea') || text.includes('blue bloom')) {
    return '/blogs/blue_pea_floral_tea.png';
  }
  if (text.includes('aavaram') || text.includes('neem') || text.includes('kondrai') || text.includes('cassia') || text.includes('chamomile') || text.includes('lavender') || text.includes('herbal tea') || text.includes('traditional') || text.includes('brew flora')) {
    return '/blogs/aavaram_herbal_tea.png';
  }

  return '/blogs/gourmet_floral_salad.png';
}

async function main() {
  const blogs = await prisma.blog.findMany();
  console.log(`Updating ${blogs.length} database records with AI food images...`);

  let count = 0;
  for (const b of blogs) {
    const newImg = getCuratedFloralImage(b.title, b.category, b.image);
    await prisma.blog.update({
      where: { id: b.id },
      data: {
        image: newImg,
        featuredImage: newImg
      }
    });
    count++;
  }

  console.log(`Successfully updated all ${count} blog database records with AI gourmet images!`);
}

main().finally(() => prisma.$disconnect());
