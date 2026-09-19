const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const dbUrl = 'postgresql://postgres.xittsoabiuzuzrzdjktb:PaidhuEthicalFoods%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

async function cleanAndUnify() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  console.log('====================================================');
  console.log('UNIFYING TO SINGLE CANONICAL BUCKET: "products"');
  console.log('====================================================\n');

  // Step 1: Update Database Tables
  console.log('Step 1: Unifying all database image URLs to /products/...');
  
  // Product table
  await client.query(`
    UPDATE "Product"
    SET image = REPLACE(image, '/storage/v1/object/public/Products/', '/storage/v1/object/public/products/')
    WHERE image LIKE '%/storage/v1/object/public/Products/%';
  `);
  await client.query(`
    UPDATE "Product"
    SET image = REPLACE(image, '/storage/v1/object/public/product/', '/storage/v1/object/public/products/')
    WHERE image LIKE '%/storage/v1/object/public/product/%';
  `);

  // ProductImage table
  try {
    await client.query(`
      UPDATE "ProductImage"
      SET "imageUrl" = REPLACE("imageUrl", '/storage/v1/object/public/Products/', '/storage/v1/object/public/products/')
      WHERE "imageUrl" LIKE '%/storage/v1/object/public/Products/%';
    `);
    await client.query(`
      UPDATE "ProductImage"
      SET "imageUrl" = REPLACE("imageUrl", '/storage/v1/object/public/product/', '/storage/v1/object/public/products/')
      WHERE "imageUrl" LIKE '%/storage/v1/object/public/product/%';
    `);
  } catch (e) {}

  // Banner table
  await client.query(`
    UPDATE "Banner"
    SET "webImage" = REPLACE("webImage", '/storage/v1/object/public/Products/', '/storage/v1/object/public/products/')
    WHERE "webImage" LIKE '%/storage/v1/object/public/Products/%';
  `);
  await client.query(`
    UPDATE "Banner"
    SET "webImage" = REPLACE("webImage", '/storage/v1/object/public/product/', '/storage/v1/object/public/products/')
    WHERE "webImage" LIKE '%/storage/v1/object/public/product/%';
  `);

  // SiteSettings table
  try {
    await client.query(`
      UPDATE "SiteSettings"
      SET "heroImage" = REPLACE("heroImage", '/storage/v1/object/public/Products/', '/storage/v1/object/public/products/'),
          "communityImage" = REPLACE("communityImage", '/storage/v1/object/public/Products/', '/storage/v1/object/public/products/'),
          "videoUrl" = REPLACE("videoUrl", '/storage/v1/object/public/Products/', '/storage/v1/object/public/products/'),
          "videoThumbnail" = REPLACE("videoThumbnail", '/storage/v1/object/public/Products/', '/storage/v1/object/public/products/');
    `);
  } catch (e) {}

  console.log('✓ All database image references unified to "/products/".');

  // Step 2: Delete duplicate/redundant buckets and objects
  console.log('\nStep 2: Deleting redundant buckets: "Products", "product", "landing-videos"...');
  const redundantBuckets = ['Products', 'product', 'landing-videos'];

  for (const b of redundantBuckets) {
    // Delete all objects in the bucket
    await client.query(`DELETE FROM storage.objects WHERE bucket_id = $1;`, [b]);
    // Delete bucket from storage.buckets
    await client.query(`DELETE FROM storage.buckets WHERE id = $1;`, [b]);
    console.log(`  ✓ Deleted redundant bucket "${b}" and its objects.`);
  }

  // Step 3: Clean up and recreate the 4 standard policies for "products"
  console.log('\nStep 3: Setting up the clean 4 policies on "products" bucket...');
  
  // Drop all old storage policies on objects
  const polRes = await client.query(`
    SELECT policyname FROM pg_policies WHERE tablename = 'objects';
  `);
  for (const row of polRes.rows) {
    try {
      await client.query(`DROP POLICY "${row.policyname}" ON storage.objects;`);
    } catch (err) {}
  }

  // Re-create the 4 clean policies for products
  await client.query(`
    CREATE POLICY "Allow Public Select products" ON storage.objects
    FOR SELECT USING (bucket_id = 'products');
  `);
  await client.query(`
    CREATE POLICY "Allow Public Insert products" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'products');
  `);
  await client.query(`
    CREATE POLICY "Allow Public Update products" ON storage.objects
    FOR UPDATE USING (bucket_id = 'products') WITH CHECK (bucket_id = 'products');
  `);
  await client.query(`
    CREATE POLICY "Allow Public Delete products" ON storage.objects
    FOR DELETE USING (bucket_id = 'products');
  `);

  console.log('✓ 4 clean CRUD policies established for "products".');

  // Verify remaining bucket and policies
  const remainingBuckets = await client.query(`SELECT id, name, public FROM storage.buckets;`);
  console.log('\nRemaining active buckets:', remainingBuckets.rows);

  const activePolicies = await client.query(`
    SELECT policyname, cmd, qual, with_check 
    FROM pg_policies 
    WHERE tablename = 'objects';
  `);
  console.log('\nActive policies on storage.objects:');
  for (const r of activePolicies.rows) {
    console.log(` - [${r.cmd}] ${r.policyname}`);
  }

  const countRes = await client.query(`SELECT count(*) FROM storage.objects WHERE bucket_id = 'products';`);
  console.log(`\n✓ Total media files in "products" bucket: ${countRes.rows[0].count}`);

  await client.end();

  // Step 4: Update Frontend and Admin Codebases to use 'products' (lowercase)
  console.log('\nStep 4: Updating frontend & admin code references to "products"...');
  
  const replaceInDir = (dir) => {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      const full = path.join(dir, f);
      if (['node_modules', '.git', 'dist', 'build', '.vercel'].includes(f)) continue;
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        replaceInDir(full);
      } else if (['.js', '.jsx', '.ts', '.tsx', '.json', '.html'].includes(path.extname(f))) {
        let content = fs.readFileSync(full, 'utf8');
        let modified = false;
        if (content.includes('/storage/v1/object/public/Products/')) {
          content = content.replace(/\/storage\/v1\/object\/public\/Products\//g, '/storage/v1/object/public/products/');
          modified = true;
        }
        if (content.includes('/storage/v1/object/public/product/')) {
          content = content.replace(/\/storage\/v1\/object\/public\/product\//g, '/storage/v1/object/public/products/');
          modified = true;
        }
        if (modified) {
          fs.writeFileSync(full, content, 'utf8');
          console.log(`    Updated ${path.relative(path.join(__dirname, '..', '..'), full)}`);
        }
      }
    }
  };

  replaceInDir(path.join(__dirname, '..', '..', 'frontend'));
  replaceInDir(path.join(__dirname, '..', '..', 'admin'));

  console.log('\n====================================================');
  console.log('✓ STORAGE BUCKETS CLEANED & UNIFIED TO ONLY "products"');
  console.log('====================================================');
}

cleanAndUnify().catch(console.error);
