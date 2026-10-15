const prisma = require('../prismaClient');

async function seedComboProducts() {
  console.log('--- SEEDING COMBO PRODUCTS (MEDLEY LUXE & FLORA POTLI) ---');

  // Sync sequence to avoid collision
  const res = await prisma.$queryRawUnsafe('SELECT COALESCE(MAX(id), 0) as max_id FROM "Product"');
  const maxId = Number(res[0]?.max_id) || 0;
  if (maxId < 55) {
    await prisma.$executeRawUnsafe(`SELECT setval('"Product_id_seq"', 56, false)`);
  }

  const p53 = await prisma.product.upsert({
    where: { slug: 'medley-teas-combo' },
    update: {
      name: 'Medley Luxe Combo',
      price: 3076,
      discountPrice: 2999,
      tags: 'new_launch, deal_of_the_day, bestseller, home_page',
      image: '/api/storage/products/1790683717897-medleyteasgoluwebp.webp',
      imagePath: 'products/1790683717897-medleyteasgoluwebp.webp',
      status: 'ACTIVE'
    },
    create: {
      id: 53,
      name: 'Medley Luxe Combo',
      slug: 'medley-teas-combo',
      description: 'A premium floral tea collection featuring Hibiscus, Blue Pea, Lavender, and Saffron Medley Teas by Paidhu – The Edible Flower Co.',
      shortDescription: 'A premium floral tea collection featuring Hibiscus, Blue Pea, Lavender, and Saffron Medley Teas by Paidhu – The Edible Flower Co.',
      categoryId: 14,
      price: 3076,
      discountPrice: 2999,
      stock: 100,
      image: '/api/storage/products/1790683717897-medleyteasgoluwebp.webp',
      imagePath: 'products/1790683717897-medleyteasgoluwebp.webp',
      status: 'ACTIVE',
      tags: 'new_launch, deal_of_the_day, bestseller, home_page',
      variants: []
    }
  });

  const p55 = await prisma.product.upsert({
    where: { slug: 'navratri-best-combo' },
    update: {
      name: 'The Flora Potli Combo',
      price: 210,
      discountPrice: 199,
      tags: 'new_launch, home_page, bestseller, deal_of_the_day, shop_all, family_combos',
      image: '/api/storage/products/1790683341007-goluproductwebp.webp',
      imagePath: 'products/1790683341007-goluproductwebp.webp',
      status: 'ACTIVE'
    },
    create: {
      id: 55,
      name: 'The Flora Potli Combo',
      slug: 'navratri-best-combo',
      description: 'Festive Gift Combo – Sinensis Syrup, Rose Gulkhand & Premium Saffron beautifully packed for gifting.',
      shortDescription: 'Festive Gift Combo – Sinensis Syrup, Rose Gulkhand & Premium Saffron beautifully packed for gifting.',
      categoryId: 14,
      price: 210,
      discountPrice: 199,
      stock: 100,
      image: '/api/storage/products/1790683341007-goluproductwebp.webp',
      imagePath: 'products/1790683341007-goluproductwebp.webp',
      status: 'ACTIVE',
      tags: 'new_launch, home_page, bestseller, deal_of_the_day, shop_all, family_combos',
      variants: []
    }
  });

  console.log('Successfully upserted:');
  console.log(`- Product ID ${p53.id}: ${p53.name} (₹${p53.discountPrice || p53.price})`);
  console.log(`- Product ID ${p55.id}: ${p55.name} (₹${p55.discountPrice || p55.price})`);

  await prisma.$disconnect();
}

seedComboProducts().catch(err => {
  console.error(err);
  process.exit(1);
});
