const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const dbUrl = 'postgresql://postgres.xittsoabiuzuzrzdjktb:PaidhuEthicalFoods%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';
const supabaseUrl = 'https://xittsoabiuzuzrzdjktb.supabase.co';
const supabaseAnonKey = 'sb_publishable_SuDUNZP6gbn0BuyMcTbrNA_k75HNFAj';

async function verify() {
  console.log('=== VERIFYING DATABASE ===');
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const tables = ['User', 'Product', 'Order', 'OrderItem', 'Category', 'Blog', 'Coupon', 'Banner', 'SiteSettings', 'CartItem', 'SaffronGuidance', 'DeliveryCharge'];
  for (const t of tables) {
    const res = await client.query(`SELECT COUNT(*) FROM "${t}";`);
    console.log(`✓ Table ${t}: ${res.rows[0].count} rows`);
  }
  await client.end();

  console.log('\n=== VERIFYING STORAGE REST API ===');
  const sb = createClient(supabaseUrl, supabaseAnonKey);
  const { data: buckets, error: bErr } = await sb.storage.listBuckets();
  console.log('Buckets:', buckets ? buckets.map(b => b.name) : bErr);

  for (const b of ['products', 'Products', 'product']) {
    const { data: files, error: fErr } = await sb.storage.from(b).list('Banner', { limit: 5 });
    console.log(`Bucket ${b} (/Banner):`, files ? files.map(f => f.name) : fErr);
  }

  // Test public URL download of an image
  const testUrl = `${supabaseUrl}/storage/v1/object/public/products/Banner/hero_family_banner.png`;
  const resp = await fetch(testUrl);
  console.log('\nPublic image fetch test URL:', testUrl);
  console.log('HTTP Status:', resp.status, resp.statusText, '| Content-Type:', resp.headers.get('content-type'));
}

verify().catch(console.error);
