const { Client } = require('pg');
const dbUrl = 'postgresql://postgres.xittsoabiuzuzrzdjktb:PaidhuEthicalFoods%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

async function checkFinalPolicies() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  // Drop all old policies
  const polRes = await client.query("SELECT policyname FROM pg_policies WHERE tablename = 'objects'");
  for (const r of polRes.rows) {
    try {
      await client.query(`DROP POLICY "${r.policyname}" ON storage.objects;`);
    } catch (e) {}
  }

  // Create clean 4 policies for products
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

  const remainingPolicies = await client.query("SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects'");
  console.log('Final Policies on storage.objects:');
  for (const p of remainingPolicies.rows) {
    console.log(` - [${p.cmd}] ${p.policyname}`);
  }

  await client.end();
}

checkFinalPolicies().catch(console.error);
