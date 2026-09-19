const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const dbUrl = 'postgresql://postgres.xittsoabiuzuzrzdjktb:PaidhuEthicalFoods%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

async function scanAndUnify() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  console.log('=== CHECKING DATABASE IMAGE URLS ===');

  // Check Product table
  const products = await client.query('SELECT id, name, image FROM "Product" WHERE image IS NOT NULL');
  let pCounts = { products: 0, Products: 0, product: 0, other: 0 };
  for (const r of products.rows) {
    if (r.image.includes('/storage/v1/object/public/products/')) pCounts.products++;
    else if (r.image.includes('/storage/v1/object/public/Products/')) pCounts.Products++;
    else if (r.image.includes('/storage/v1/object/public/product/')) pCounts.product++;
    else pCounts.other++;
  }
  console.log('Product.image counts:', pCounts);

  // Check Banner table
  const banners = await client.query('SELECT id, "webImage" FROM "Banner"');
  let bCounts = { products: 0, Products: 0, product: 0, other: 0 };
  for (const r of banners.rows) {
    if (r.webImage && r.webImage.includes('/storage/v1/object/public/products/')) bCounts.products++;
    else if (r.webImage && r.webImage.includes('/storage/v1/object/public/Products/')) bCounts.Products++;
    else if (r.webImage && r.webImage.includes('/storage/v1/object/public/product/')) bCounts.product++;
    else bCounts.other++;
  }
  console.log('Banner.webImage counts:', bCounts);

  // Check Blog table
  const blogs = await client.query('SELECT id, image FROM "Blog" WHERE image IS NOT NULL');
  let blCounts = { products: 0, Products: 0, product: 0, other: 0 };
  for (const r of blogs.rows) {
    if (r.image.includes('/storage/v1/object/public/products/')) blCounts.products++;
    else if (r.image.includes('/storage/v1/object/public/Products/')) blCounts.Products++;
    else if (r.image.includes('/storage/v1/object/public/product/')) blCounts.product++;
    else blCounts.other++;
  }
  console.log('Blog.image counts:', blCounts);

  // Check storage buckets
  const bRes = await client.query('SELECT id, name, public FROM storage.buckets;');
  console.log('\nCurrent buckets in storage.buckets:', bRes.rows);

  // Check objects per bucket
  const objRes = await client.query('SELECT bucket_id, count(*) FROM storage.objects GROUP BY bucket_id;');
  console.log('\nObjects count per bucket:', objRes.rows);

  await client.end();
}

scanAndUnify().catch(console.error);
