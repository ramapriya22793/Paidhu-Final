const { Client } = require('pg');

const dbUrl = 'postgresql://postgres.xittsoabiuzuzrzdjktb:PaidhuEthicalFoods%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

async function setupBucketPolicies() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const buckets = ['products', 'product'];

  for (const b of buckets) {
    console.log(`Setting up explicit policies for bucket: ${b}...`);
    
    // Select policy
    try {
      await client.query(`
        CREATE POLICY "Allow Public Select ${b}" ON storage.objects
        FOR SELECT USING (bucket_id = '${b}');
      `);
      console.log(`  ✓ Select policy created for ${b}`);
    } catch (e) {
      console.log(`  - Select notice: ${e.message}`);
    }

    // Insert policy
    try {
      await client.query(`
        CREATE POLICY "Allow Public Insert ${b}" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = '${b}');
      `);
      console.log(`  ✓ Insert policy created for ${b}`);
    } catch (e) {
      console.log(`  - Insert notice: ${e.message}`);
    }

    // Update policy
    try {
      await client.query(`
        CREATE POLICY "Allow Public Update ${b}" ON storage.objects
        FOR UPDATE USING (bucket_id = '${b}') WITH CHECK (bucket_id = '${b}');
      `);
      console.log(`  ✓ Update policy created for ${b}`);
    } catch (e) {
      console.log(`  - Update notice: ${e.message}`);
    }

    // Delete policy
    try {
      await client.query(`
        CREATE POLICY "Allow Public Delete ${b}" ON storage.objects
        FOR DELETE USING (bucket_id = '${b}');
      `);
      console.log(`  ✓ Delete policy created for ${b}`);
    } catch (e) {
      console.log(`  - Delete notice: ${e.message}`);
    }
  }

  const res = await client.query(`
    SELECT policyname, cmd, qual, with_check 
    FROM pg_policies 
    WHERE tablename = 'objects';
  `);
  console.log('\nTotal storage policies active:', res.rows.length);
  for (const r of res.rows) {
    console.log(` - [${r.cmd}] ${r.policyname}`);
  }

  await client.end();
}

setupBucketPolicies().catch(console.error);
