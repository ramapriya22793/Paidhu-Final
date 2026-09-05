require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const https = require('https');

async function syncMediaAndUrls() {
  const dbUrl = process.env.DATABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const projectRef = 'ljrwcciuacjbwocsxiqc';

  console.log('Step 1: Updating storage URLs in PostgreSQL database...');
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  const updates = [
    `UPDATE "Product" SET "image" = REPLACE("image", 'fvtgukindzmoiwqqkwcl.supabase.co', '${projectRef}.supabase.co') WHERE "image" LIKE '%fvtgukindzmoiwqqkwcl%'`,
    `UPDATE "ProductImage" SET "imageUrl" = REPLACE("imageUrl", 'fvtgukindzmoiwqqkwcl.supabase.co', '${projectRef}.supabase.co') WHERE "imageUrl" LIKE '%fvtgukindzmoiwqqkwcl%'`,
    `UPDATE "Banner" SET "webImage" = REPLACE("webImage", 'fvtgukindzmoiwqqkwcl.supabase.co', '${projectRef}.supabase.co') WHERE "webImage" LIKE '%fvtgukindzmoiwqqkwcl%'`,
    `UPDATE "Banner" SET "mobileImage" = REPLACE("mobileImage", 'fvtgukindzmoiwqqkwcl.supabase.co', '${projectRef}.supabase.co') WHERE "mobileImage" LIKE '%fvtgukindzmoiwqqkwcl%'`,
    `UPDATE "Blog" SET "featuredImage" = REPLACE("featuredImage", 'fvtgukindzmoiwqqkwcl.supabase.co', '${projectRef}.supabase.co') WHERE "featuredImage" LIKE '%fvtgukindzmoiwqqkwcl%'`,
    `UPDATE "Blog" SET "image" = REPLACE("image", 'fvtgukindzmoiwqqkwcl.supabase.co', '${projectRef}.supabase.co') WHERE "image" LIKE '%fvtgukindzmoiwqqkwcl%'`,
    `UPDATE "Category" SET "image" = REPLACE("image", 'fvtgukindzmoiwqqkwcl.supabase.co', '${projectRef}.supabase.co') WHERE "image" LIKE '%fvtgukindzmoiwqqkwcl%'`
  ];

  for (const sql of updates) {
    try {
      const res = await client.query(sql);
      console.log(`✓ Executed: ${sql.split('SET')[0].trim()} -> updated ${res.rowCount} rows.`);
    } catch (e) {
      console.warn('Update note:', e.message);
    }
  }

  await client.end();

  console.log('\nStep 2: Uploading media files to new Supabase storage...');
  if (!serviceKey) {
    console.log('No service role key provided, skipping storage upload.');
    return;
  }

  // Upload helper
  function uploadFile(bucket, remotePath, filePath) {
    return new Promise((resolve) => {
      const fileBuffer = fs.readFileSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.mp4': 'video/mp4'
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      const encodedPath = remotePath.split('/').map(encodeURIComponent).join('/');
      const req = https.request({
        hostname: `${projectRef}.supabase.co`,
        port: 443,
        path: `/storage/v1/object/${bucket}/${encodedPath}`,
        method: 'POST',
        headers: {
          'apikey': serviceKey,
          'Authorization': 'Bearer ' + serviceKey,
          'Content-Type': contentType,
          'x-upsert': 'true',
          'Content-Length': fileBuffer.length
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({ status: res.statusCode, path: remotePath });
        });
      });

      req.on('error', (err) => resolve({ error: err.message, path: remotePath }));
      req.write(fileBuffer);
      req.end();
    });
  }

  // Find images in frontend/public to upload
  const publicDir = path.join(__dirname, '..', '..', 'frontend', 'public');
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    let count = 0;
    for (const f of files) {
      const fullPath = path.join(publicDir, f);
      if (fs.statSync(fullPath).isFile() && /\.(jpg|jpeg|png|webp|svg)$/i.test(f)) {
        // Upload to Products and products bucket
        await uploadFile('Products', `products/${f}`, fullPath);
        await uploadFile('products', `products/${f}`, fullPath);
        await uploadFile('Products', f, fullPath);
        await uploadFile('products', f, fullPath);
        count++;
      }
    }
    console.log(`✓ Uploaded ${count} media files to Supabase buckets 'Products' and 'products'.`);
  }

  console.log('\n====================================================');
  console.log('STORAGE & URL SYNCHRONIZATION COMPLETE!');
  console.log('====================================================');
}

syncMediaAndUrls().catch(console.error);

module.exports = { syncMediaAndUrls };
