process.env.DATABASE_URL = "postgresql://postgres.szgqtggokqqaoomryljr:Paidhu%4022793@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function generateKeywords() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { seoKeywords: null },
        { seoKeywords: '' }
      ]
    },
    include: { category: true }
  });

  console.log(`Found ${products.length} products needing keywords...`);

  for (const p of products) {
    // Generate some smart keywords based on name
    const words = p.name.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 2);
    
    let keywordsArray = [...words];
    
    // Add generic premium keywords
    keywordsArray.push('premium', 'buy online', 'healthy', 'paidhu');

    if (p.category && p.category.name) {
      keywordsArray.push(p.category.name.toLowerCase());
    }

    if (p.name.toLowerCase().includes('saffron') || p.name.toLowerCase().includes('mongra')) {
      keywordsArray.push('pure kesar', 'luxury saffron', 'authentic');
    }
    
    if (p.name.toLowerCase().includes('tea') || p.name.toLowerCase().includes('flora')) {
      keywordsArray.push('herbal tea', 'natural', 'wellness');
    }

    if (p.name.toLowerCase().includes('jam')) {
      keywordsArray.push('natural jam', 'healthy spread');
    }

    if (p.name.toLowerCase().includes('cookies')) {
      keywordsArray.push('healthy snacks', 'gourmet cookies');
    }

    // Deduplicate
    const uniqueKeywords = [...new Set(keywordsArray)];
    const finalKeywords = uniqueKeywords.join(', ');

    await prisma.product.update({
      where: { id: p.id },
      data: { seoKeywords: finalKeywords }
    });

    console.log(`Updated keywords for: ${p.name}`);
  }

  console.log("All missing keywords have been automatically generated!");
}

generateKeywords().finally(() => prisma.$disconnect());
