const { Client } = require('pg');
const dbUrl = 'postgresql://postgres.xittsoabiuzuzrzdjktb:PaidhuEthicalFoods%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

async function deleteEmptyBuckets() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  console.log('Enabling storage deletion query setting...');
  await client.query("SET storage.allow_delete_query = 'true'");

  const redundant = ['Products', 'product', 'landing-videos'];
  for (const b of redundant) {
    try {
      const res = await client.query('DELETE FROM storage.buckets WHERE id = $1', [b]);
      console.log(`✓ Successfully deleted bucket "${b}":`, res.rowCount, 'row removed.');
    } catch (e) {
      console.log(`Error deleting ${b}:`, e.message);
    }
  }

  // Drop any obsolete policies for deleted buckets
  const policies = await client.query("SELECT policyname FROM pg_policies WHERE tablename = 'objects'");
  for (const p of policies.rows) {
    if (!p.policyname.includes('products') && !p.policyname.includes('Public')) {
      await client.query(`DROP POLICY IF EXISTS "${p.policyname}" ON storage.objects;`);
      console.log(`  Dropped obsolete policy: ${p.policyname}`);
    }
  }

  const res = await client.query('SELECT id, name, public FROM storage.buckets');
  console.log('\n====================================================');
  console.log('CURRENT ACTIVE BUCKETS IN STORAGE:');
  console.log('====================================================');
  console.log(res.rows);

  const objRes = await client.query('SELECT bucket_id, count(*) FROM storage.objects GROUP BY bucket_id');
  console.log('\nObjects count:');
  console.log(objRes.rows);

  await client.end();
}

deleteEmptyBuckets().catch(console.error);
