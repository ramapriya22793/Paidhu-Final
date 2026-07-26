const prisma = require('./server/prismaClient');

function getCuratedFloralImage(title = '', category = '', originalUrl = '') {
  const text = (title + ' ' + (category || '')).toLowerCase();

  const isGeneric = !originalUrl || 
    originalUrl.includes('placeholder') || 
    originalUrl.includes('default') || 
    originalUrl.includes('child') || 
    originalUrl.includes('camera') || 
    originalUrl.includes('toy') ||
    originalUrl.includes('516627145497') ||
    originalUrl.includes('kms');

  if (originalUrl && !isGeneric && originalUrl.startsWith('http')) {
    return originalUrl;
  }

  if (text.includes('hibiscus')) {
    return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('rose') || text.includes('gulkand') || text.includes('damask')) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('saffron') || text.includes('kesar')) {
    return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('blue pea') || text.includes('butterfly pea') || text.includes('bluepea')) {
    return 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('chamomile')) {
    return 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('neem') || text.includes('aavaram') || text.includes('kondrai') || text.includes('cassia')) {
    return 'https://images.unsplash.com/photo-1546852199-2d7e912e98c6?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('lavender')) {
    return 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('jasmine')) {
    return 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('salad') || text.includes('fruit')) {
    return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('rasam') || text.includes('tea') || text.includes('drink') || text.includes('syrup') || text.includes('lemonade')) {
    return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('idli') || text.includes('rice') || text.includes('pancake') || text.includes('cookie') || text.includes('halwa') || text.includes('panna cotta')) {
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop';
  }

  return 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop';
}

async function fixImages() {
  const blogs = await prisma.blog.findMany();
  console.log(`Found ${blogs.length} blogs in database.`);

  let updatedCount = 0;
  for (const b of blogs) {
    const newImage = getCuratedFloralImage(b.title, b.category, b.image || b.featuredImage);
    
    if (newImage !== b.image || newImage !== b.featuredImage) {
      await prisma.blog.update({
        where: { id: b.id },
        data: {
          image: newImage,
          featuredImage: newImage
        }
      });
      updatedCount++;
      console.log(`Updated blog ID #${b.id} ("${b.title}") -> ${newImage}`);
    }
  }

  console.log(`Completed updating ${updatedCount} blog photos!`);
}

fixImages()
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());
