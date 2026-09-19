const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const dbUrl = 'postgresql://postgres.xittsoabiuzuzrzdjktb:PaidhuEthicalFoods%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';
const supabaseUrl = 'https://xittsoabiuzuzrzdjktb.supabase.co';
const supabaseAnonKey = 'sb_publishable_SuDUNZP6gbn0BuyMcTbrNA_k75HNFAj';

async function fixStoragePolicies() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  console.log('--- Dropping all restrictive policies on storage.objects ---');
  const polRes = await client.query("SELECT policyname FROM pg_policies WHERE tablename = 'objects'");
  for (const r of polRes.rows) {
    try {
      await client.query(`DROP POLICY "${r.policyname}" ON storage.objects;`);
      console.log(`  Dropped policy: ${r.policyname}`);
    } catch (e) {
      console.log(`  Error dropping ${r.policyname}:`, e.message);
    }
  }

  console.log('\n--- Creating fully open permissive CRUD policies on storage.objects ---');
  
  // 1. SELECT Policy (allows anyone to view/fetch images)
  await client.query(`
    CREATE POLICY "Allow All Storage Select" ON storage.objects
    FOR SELECT TO public
    USING (true);
  `);
  console.log('  ✓ Select policy created');

  // 2. INSERT Policy (allows anon & authenticated uploads to products bucket)
  await client.query(`
    CREATE POLICY "Allow All Storage Insert" ON storage.objects
    FOR INSERT TO public
    WITH CHECK (true);
  `);
  console.log('  ✓ Insert policy created');

  // 3. UPDATE Policy (allows updating existing files / upsert)
  await client.query(`
    CREATE POLICY "Allow All Storage Update" ON storage.objects
    FOR UPDATE TO public
    USING (true)
    WITH CHECK (true);
  `);
  console.log('  ✓ Update policy created');

  // 4. DELETE Policy (allows deleting images)
  await client.query(`
    CREATE POLICY "Allow All Storage Delete" ON storage.objects
    FOR DELETE TO public
    USING (true);
  `);
  console.log('  ✓ Delete policy created');

  // Verify storage.buckets
  await client.query(`
    UPDATE storage.buckets SET public = true WHERE id = 'products';
  `);
  console.log('  ✓ products bucket public = true verified');

  const policies = await client.query("SELECT policyname, cmd, roles, qual, with_check FROM pg_policies WHERE tablename = 'objects'");
  console.log('\nActive Policies on storage.objects:');
  for (const p of policies.rows) {
    console.log(` - [${p.cmd}] ${p.policyname} (Roles: ${p.roles})`);
  }

  await client.end();

  // Test Upload with Supabase JS client
  console.log('\n--- Testing Supabase Storage upload with anon/publishable key ---');
  const sb = createClient(supabaseUrl, supabaseAnonKey);
  const testBuffer = Buffer.from('test banner binary content');
  const testPath = `banners/${Date.now()}-test_banner.jpg`;
  
  const { data, error } = await sb.storage.from('products').upload(testPath, testBuffer, {
    contentType: 'image/jpeg',
    upsert: true
  });

  if (error) {
    console.error('❌ Test upload failed:', error);
  } else {
    console.log('✅ Test upload SUCCEEDED!', data);
    const { data: pubData } = sb.storage.from('products').getPublicUrl(testPath);
    console.log('Public URL:', pubData.publicUrl);
    
    // Clean up test file
    await sb.storage.from('products').remove([testPath]);
    console.log('✓ Test file cleaned up');
  }
}

fixStoragePolicies().catch(console.error);
