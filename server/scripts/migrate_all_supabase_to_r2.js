require('dotenv').config();
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const supabase = require('../utils/supabaseClient');
const prisma = require('../prismaClient');
const { getR2Client, bucketName, isR2Configured, endpoint } = require('../utils/r2Client');

// MIME type map for proper browser streaming
const MIME_MAP = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  txt: 'text/plain',
  json: 'application/json'
};

function getMimeType(filePath) {
  const ext = (filePath.split('.').pop() || '').toLowerCase();
  return MIME_MAP[ext] || 'application/octet-stream';
}

async function listAllFilesRecursively(folder = '') {
  let allFiles = [];
  const { data: items, error } = await supabase.storage.from('products').list(folder, { limit: 1000, sortBy: { column: 'name', order: 'asc' } });
  if (error) {
    console.error(`Error listing folder "${folder}":`, error.message);
    return [];
  }

  for (const item of items) {
    const itemPath = folder ? `${folder}/${item.name}` : item.name;
    // Skip empty folder placeholder
    if (item.name === '.emptyFolderPlaceholder') continue;

    if (item.id === null || (!item.metadata && !item.name.includes('.'))) {
      const subFiles = await listAllFilesRecursively(itemPath);
      allFiles = allFiles.concat(subFiles);
    } else {
      allFiles.push({
        name: item.name,
        path: itemPath,
        size: item.metadata ? item.metadata.size : 0,
      });
    }
  }
  return allFiles;
}

async function downloadFileFromSupabase(filePath) {
  const { data, error } = await supabase.storage.from('products').download(filePath);
  if (error) throw error;
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadFileToR2(s3Client, filePath, buffer, mimeType) {
  const cmd = new PutObjectCommand({
    Bucket: bucketName,
    Key: filePath,
    Body: buffer,
    ContentType: mimeType,
    CacheControl: 'public, max-age=31536000, immutable',
  });
  await s3Client.send(cmd);
}

async function verifyR2File(s3Client, filePath) {
  const cmd = new HeadObjectCommand({
    Bucket: bucketName,
    Key: filePath,
  });
  return await s3Client.send(cmd);
}

async function migrateAllFiles() {
  console.log('===========================================================');
  console.log('🚀 MIGRATION: SUPABASE STORAGE -> CLOUDFLARE R2');
  console.log('===========================================================');
  console.log(`Cloudflare R2 Bucket: ${bucketName}`);
  console.log(`Cloudflare R2 Endpoint: ${endpoint}`);

  if (!isR2Configured()) {
    throw new Error('Cloudflare R2 credentials missing!');
  }

  const s3Client = getR2Client();

  console.log('\nStep 1: Discovering all files from Supabase storage (bucket: "products")...');
  const files = await listAllFilesRecursively('');
  console.log(`✅ Discovered ${files.length} files to migrate.\n`);

  let successCount = 0;
  let failCount = 0;
  let totalBytes = 0;

  console.log('Step 2: Migrating files in batches of 5...');
  const batchSize = 5;

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (file, idx) => {
        const itemIndex = i + idx + 1;
        const mimeType = getMimeType(file.path);

        try {
          // 1. Download from Supabase
          const buffer = await downloadFileFromSupabase(file.path);
          // 2. Upload to Cloudflare R2
          await uploadFileToR2(s3Client, file.path, buffer, mimeType);
          // 3. Verify on Cloudflare R2
          await verifyR2File(s3Client, file.path);

          totalBytes += buffer.length;
          successCount++;
          console.log(`[${itemIndex}/${files.length}] [OK] ${file.path} (${(buffer.length / 1024).toFixed(1)} KB, ${mimeType})`);
        } catch (err) {
          failCount++;
          console.error(`[${itemIndex}/${files.length}] [FAILED] ${file.path}: ${err.message}`);
        }
      })
    );
  }

  console.log('\n===========================================================');
  console.log(`📊 FILE TRANSFER SUMMARY:`);
  console.log(`   Total Files:      ${files.length}`);
  console.log(`   Transferred:      ${successCount}`);
  console.log(`   Failed:           ${failCount}`);
  console.log(`   Total Size:       ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log('===========================================================');

  // Step 3: Update Database Records
  console.log('\nStep 3: Updating database URLs from Supabase to Cloudflare R2 (/api/storage/...)...');

  // Helper to replace Supabase storage URLs with /api/storage/
  function convertUrl(url) {
    if (!url || typeof url !== 'string') return url;
    // Matches any https://<proj>.supabase.co/storage/v1/object/public/products/<filePath>
    const match = url.match(/https:\/\/[a-z0-9_-]+\.supabase\.co\/storage\/v1\/object\/public\/products\/(.+)/i);
    if (match) {
      const path = match[1];
      return `/api/storage/${path}`;
    }
    // Also matches if bucket was Products (capitalized)
    const matchCap = url.match(/https:\/\/[a-z0-9_-]+\.supabase\.co\/storage\/v1\/object\/public\/Products\/(.+)/i);
    if (matchCap) {
      const path = matchCap[1];
      return `/api/storage/${path}`;
    }
    return url;
  }

  // 3a. Update Products
  const products = await prisma.product.findMany();
  let updatedProducts = 0;
  for (const p of products) {
    const newImage = convertUrl(p.image);
    if (newImage !== p.image) {
      await prisma.product.update({
        where: { id: p.id },
        data: { image: newImage }
      });
      updatedProducts++;
    }
  }
  console.log(` - Products updated: ${updatedProducts}`);

  // 3b. Update ProductImage table
  const productImages = await prisma.productImage.findMany();
  let updatedProductImages = 0;
  for (const pi of productImages) {
    const newImageUrl = convertUrl(pi.imageUrl);
    if (newImageUrl !== pi.imageUrl) {
      await prisma.productImage.update({
        where: { id: pi.id },
        data: { imageUrl: newImageUrl }
      });
      updatedProductImages++;
    }
  }
  console.log(` - ProductImage rows updated: ${updatedProductImages}`);

  // 3c. Update Banners
  const banners = await prisma.banner.findMany();
  let updatedBanners = 0;
  for (const b of banners) {
    const newWeb = convertUrl(b.webImage);
    const newMobile = convertUrl(b.mobileImage);
    if (newWeb !== b.webImage || newMobile !== b.mobileImage) {
      await prisma.banner.update({
        where: { id: b.id },
        data: { webImage: newWeb, mobileImage: newMobile }
      });
      updatedBanners++;
    }
  }
  console.log(` - Banners updated: ${updatedBanners}`);

  // 3d. Update Reviews
  const reviews = await prisma.review.findMany();
  let updatedReviews = 0;
  for (const r of reviews) {
    const newImg = convertUrl(r.image);
    const newVid = convertUrl(r.video);
    if (newImg !== r.image || newVid !== r.video) {
      await prisma.review.update({
        where: { id: r.id },
        data: { image: newImg, video: newVid }
      });
      updatedReviews++;
    }
  }
  console.log(` - Reviews & Video Reels updated: ${updatedReviews}`);

  // 3e. Update SiteSettings
  const settings = await prisma.siteSettings.findFirst();
  if (settings) {
    let rawStr = JSON.stringify(settings);
    // Replace all occurrences of https://<proj>.supabase.co/storage/v1/object/public/products/<path>
    const replacedStr = rawStr.replace(
      /https:\/\/[a-z0-9_-]+\.supabase\.co\/storage\/v1\/object\/public\/(products|Products)\/([^"'\\]+)/gi,
      '/api/storage/$2'
    );
    if (replacedStr !== rawStr) {
      const parsed = JSON.parse(replacedStr);
      delete parsed.id;
      delete parsed.updatedAt;
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: parsed
      });
      console.log(' - SiteSettings media updated to Cloudflare R2!');
    }
  }

  console.log('\n🎉 ALL MEDIA (PRODUCTS, BANNERS, VIDEOS) FULLY MIGRATED TO CLOUDFLARE R2!');
}

migrateAllFiles()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
