require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function restore() {
  const dbUrl = process.env.TARGET_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is missing.');
  }

  console.log('Connecting to target PostgreSQL database...');
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  console.log('✓ Successfully connected to PostgreSQL.');

  const dumpFile = path.join(__dirname, '..', 'backup_data', 'LIVE_DATABASE_DUMP_SEPT2026.json');
  if (!fs.existsSync(dumpFile)) {
    throw new Error('Dump file not found at: ' + dumpFile);
  }

  const dump = JSON.parse(fs.readFileSync(dumpFile, 'utf8'));
  console.log('✓ Loaded dump file successfully.');

  const tables = [
    { key: 'user', name: 'User', idCol: 'id', hasSeq: true },
    { key: 'category', name: 'Category', idCol: 'id', hasSeq: true },
    { key: 'siteSettings', name: 'SiteSettings', idCol: 'id', hasSeq: true },
    { key: 'coupon', name: 'Coupon', idCol: 'id', hasSeq: true },
    { key: 'deliveryCharge', name: 'DeliveryCharge', idCol: 'id', hasSeq: true },
    { key: 'banner', name: 'Banner', idCol: 'id', hasSeq: true },
    { key: 'newsletterSubscriber', name: 'NewsletterSubscriber', idCol: 'id', hasSeq: true },
    { key: 'careerApplication', name: 'CareerApplication', idCol: 'id', hasSeq: false },
    { key: 'tiffinRegistration', name: 'TiffinRegistration', idCol: 'id', hasSeq: true },
    { key: 'saffronGuidance', name: 'SaffronGuidance', idCol: 'id', hasSeq: true },
    { key: 'bulkOrderInquiry', name: 'BulkOrderInquiry', idCol: 'id', hasSeq: false },
    { key: 'blog', name: 'Blog', idCol: 'id', hasSeq: true },
    { key: 'address', name: 'Address', idCol: 'id', hasSeq: true },
    { key: 'product', name: 'Product', idCol: 'id', hasSeq: true },
    { key: 'cartItem', name: 'CartItem', idCol: 'id', hasSeq: true },
    { key: 'wishlistItem', name: 'WishlistItem', idCol: 'id', hasSeq: true },
    { key: 'order', name: 'Order', idCol: 'id', hasSeq: true },
    { key: 'orderItem', name: 'OrderItem', idCol: 'id', hasSeq: true },
    { key: 'payment', name: 'Payment', idCol: 'id', hasSeq: true },
    { key: 'loginHistory', name: 'LoginHistory', idCol: 'id', hasSeq: true }
  ];

  let grandTotal = 0;

  for (const t of tables) {
    let items = dump[t.key] || [];
    if (!Array.isArray(items)) {
      items = items ? [items] : [];
    }

    if (items.length === 0) {
      console.log(`- ${t.name}: 0 records to insert.`);
      continue;
    }

    console.log(`- Restoring ${t.name} (${items.length} records)...`);
    let inserted = 0;
    const chunkSize = 100;

    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      const cols = Object.keys(chunk[0]);
      const colList = cols.map(k => `"${k}"`).join(', ');

      let paramIdx = 1;
      const rowPlaceholders = [];
      const values = [];

      for (const row of chunk) {
        const ph = [];
        for (const col of cols) {
          ph.push(`$${paramIdx++}`);
          const val = row[col];
          if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
            values.push(JSON.stringify(val));
          } else {
            values.push(val);
          }
        }
        rowPlaceholders.push(`(${ph.join(', ')})`);
      }

      const insertQuery = `
        INSERT INTO "${t.name}" (${colList})
        VALUES ${rowPlaceholders.join(',\n')}
        ON CONFLICT ("${t.idCol}") DO NOTHING;
      `;

      try {
        await client.query(insertQuery, values);
        inserted += chunk.length;
      } catch (err) {
        // Fallback to row-by-row if any chunk has specific error
        for (const row of chunk) {
          const ph = cols.map((_, idx) => `$${idx + 1}`).join(', ');
          const rowVals = cols.map(c => {
            const val = row[c];
            return (val !== null && typeof val === 'object' && !(val instanceof Date)) ? JSON.stringify(val) : val;
          });
          try {
            await client.query(`INSERT INTO "${t.name}" (${colList}) VALUES (${ph}) ON CONFLICT ("${t.idCol}") DO NOTHING;`, rowVals);
            inserted++;
          } catch (rowErr) {
            if (!rowErr.message.includes('duplicate key') && !rowErr.message.includes('Unique constraint')) {
              console.warn(`  Warning on ${t.name} id ${row[t.idCol]}:`, rowErr.message);
            }
          }
        }
      }
    }

    if (t.hasSeq) {
      try {
        await client.query(`
          SELECT setval(pg_get_serial_sequence('"${t.name}"', '${t.idCol}'), COALESCE((SELECT MAX("${t.idCol}") FROM "${t.name}"), 1));
        `);
      } catch (seqErr) {}
    }

    const countRes = await client.query(`SELECT COUNT(*) as count FROM "${t.name}"`);
    const liveCount = parseInt(countRes.rows[0].count, 10);
    console.log(`  ✓ ${t.name}: ${liveCount} records active in DB (source: ${items.length})`);
    grandTotal += liveCount;
  }

  console.log('\n====================================================');
  console.log(`ALL LIVE DATA RESTORED! Total records in target database: ${grandTotal}`);
  console.log('====================================================\n');

  await client.end();
}

restore().then(() => process.exit(0)).catch(err => {
  console.error('Fatal restore error:', err);
  process.exit(1);
});
