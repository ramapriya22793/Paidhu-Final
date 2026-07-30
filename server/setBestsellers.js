process.env.DATABASE_URL = "postgresql://postgres.szgqtggokqqaoomryljr:Paidhu%4022793@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setBestsellers() {
  // Products to mark as bestseller (first 4 in order):
  // 1. Kashmiri Mongra (ID 20)
  // 2. White Lotus Bloom Cookies (ID 8) - already has it
  // 3. Neem petal jams (ID 3)
  // 4. Cassia Fistula Medley Tea (ID 31)

  const updates = [
    { id: 20, name: 'Kashmiri Mongra', tags: 'shop_all, bestseller' },
    { id: 3, name: 'Neem petal jams', tags: 'preorder, bestseller' },
    { id: 31, name: 'Cassia Fistula Medley Tea', tags: 'shop_all, bestseller' },
  ];

  for (const p of updates) {
    const result = await prisma.product.update({
      where: { id: p.id },
      data: { tags: p.tags },
    });
    console.log(`Updated "${result.name}" (ID ${result.id}) → tags: ${result.tags}`);
  }

  await prisma.$disconnect();
  console.log('Done!');
}

setBestsellers().catch(e => { console.error(e); process.exit(1); });
