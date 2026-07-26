const prisma = require('./server/prismaClient');

function getCuratedFloralImage(title = '', category = '', originalUrl = '') {
  const text = (title + ' ' + (category || '')).toLowerCase();

  const isWpUpload = !originalUrl || 
    originalUrl.includes('wp.paidhu.com/wp-content') ||
    originalUrl.includes('placeholder') || 
    originalUrl.includes('default') || 
    originalUrl.includes('child') || 
    originalUrl.includes('camera') || 
    originalUrl.includes('toy') ||
    originalUrl.includes('516627145497') ||
    originalUrl.includes('kms');

  if (originalUrl && !isWpUpload && originalUrl.startsWith('http') && !originalUrl.includes('wp.paidhu.com')) {
    return originalUrl;
  }

  // Hibiscus & Hibiscus Recipes
  if (text.includes('hibiscus') || text.includes('sembaruthi')) {
    if (text.includes('tea') || text.includes('drink') || text.includes('infusion') || text.includes('syrup')) {
      return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop';
    }
    if (text.includes('jelly') || text.includes('chutney') || text.includes('rasam') || text.includes('rice')) {
      return 'https://images.unsplash.com/photo-1546852199-2d7e912e98c6?q=80&w=800&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop';
  }

  // Rose, Gulkand & Damask Rose
  if (text.includes('rose') || text.includes('gulkand') || text.includes('damask')) {
    if (text.includes('milk') || text.includes('popsicle') || text.includes('pancake') || text.includes('cookie') || text.includes('idli')) {
      return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop';
  }

  // Blue Pea / Butterfly Pea
  if (text.includes('blue pea') || text.includes('butterfly pea') || text.includes('bluepea') || text.includes('blue bloom')) {
    if (text.includes('pasta') || text.includes('panna cotta') || text.includes('lemonade') || text.includes('butter') || text.includes('idli')) {
      return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop';
  }

  // Saffron & Kesar
  if (text.includes('saffron') || text.includes('kesar')) {
    return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop';
  }

  // Chamomile
  if (text.includes('chamomile')) {
    return 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800&auto=format&fit=crop';
  }

  // Neem / Aavaram Poo / Kondrai Poo / Cassia Fistula / Dandelion / Marigold / Pumpkin / Banana Flower
  if (text.includes('neem') || text.includes('aavaram') || text.includes('kondrai') || text.includes('cassia') || text.includes('dandelion') || text.includes('marigold') || text.includes('pumpkin') || text.includes('banana flower') || text.includes('vazhaipoo') || text.includes('drumstick')) {
    if (text.includes('rasam') || text.includes('curd') || text.includes('pakora') || text.includes('vadai') || text.includes('sambar') || text.includes('fritter') || text.includes('upma') || text.includes('buttermilk')) {
      return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1546852199-2d7e912e98c6?q=80&w=800&auto=format&fit=crop';
  }

  // Lavender
  if (text.includes('lavender')) {
    return 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?q=80&w=800&auto=format&fit=crop';
  }

  // Jasmine
  if (text.includes('jasmine')) {
    return 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=800&auto=format&fit=crop';
  }

  // Herbal Tea & Brew Flora
  if (text.includes('tea') || text.includes('brew') || text.includes('drink') || text.includes('herbal')) {
    return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop';
  }

  // Salad / Food / Meals
  if (text.includes('salad') || text.includes('fruit') || text.includes('dish') || text.includes('recipe')) {
    return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop';
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
