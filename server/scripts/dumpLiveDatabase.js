require('dotenv').config();
const fs = require('fs');
const path = require('path');
const prisma = require('../prismaClient');

async function dumpAllData() {
  console.log('Starting full fresh live data dump...');
  const models = [
    'user', 'address', 'wishlistItem', 'category', 'product', 
    'order', 'orderItem', 'siteSettings', 'bulkOrderInquiry', 
    'coupon', 'review', 'blog', 'seoData', 'productSeo', 
    'banner', 'cartItem', 'payment', 'refund', 'deliveryCharge', 
    'trackingScript', 'tiffinRegistration', 'saffronGuidance', 
    'loginHistory', 'passwordResetToken', 'newsletterSubscriber', 
    'careerApplication'
  ];

  const dump = {};
  let totalRecords = 0;

  for (const m of models) {
    try {
      const records = await prisma[m].findMany();
      dump[m] = records;
      totalRecords += records.length;
      console.log(`  - ${m}: ${records.length} records`);
    } catch (e) {
      console.warn(`  - ${m}: Error (${e.message})`);
      dump[m] = [];
    }
  }

  const dumpDir = path.join(__dirname, '..', 'backup_data');
  if (!fs.existsSync(dumpDir)) fs.mkdirSync(dumpDir, { recursive: true });

  const dumpPath = path.join(dumpDir, 'LIVE_DATABASE_DUMP_SEPT2026.json');
  fs.writeFileSync(dumpPath, JSON.stringify(dump, null, 2), 'utf8');

  console.log(`\nDone! Total records dumped: ${totalRecords}`);
  console.log(`Dump file saved to: ${dumpPath} (Size: ${(fs.statSync(dumpPath).size / (1024 * 1024)).toFixed(2)} MB)`);
}

dumpAllData().then(() => process.exit(0)).catch(err => {
  console.error('Fatal dump error:', err);
  process.exit(1);
});
