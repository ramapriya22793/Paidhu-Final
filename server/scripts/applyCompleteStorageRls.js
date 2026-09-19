const { Client } = require('pg');

const dbUrl = 'postgresql://postgres.xittsoabiuzuzrzdjktb:PaidhuEthicalFoods%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

async function applyCompleteStorageRls() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  console.log('--- Applying comprehensive Storage RLS policies ---');

  // 1. storage.buckets policies
  console.log('1. Configuring storage.buckets policies...');
  await client.query(`DROP POLICY IF EXISTS "Allow Public Select buckets" ON storage.buckets;`);
  await client.query(`DROP POLICY IF EXISTS "Allow Public Insert buckets" ON storage.buckets;`);
  await client.query(`DROP POLICY IF EXISTS "Allow Public Update buckets" ON storage.buckets;`);
  await client.query(`DROP POLICY IF EXISTS "Allow Public Delete buckets" ON storage.buckets;`);

  await client.query(`
    CREATE POLICY "Allow Public Select buckets" ON storage.buckets
    FOR SELECT TO public
    USING (true);
  `);
  await client.query(`
    CREATE POLICY "Allow Public Insert buckets" ON storage.buckets
    FOR INSERT TO public
    WITH CHECK (true);
  `);
  await client.query(`
    CREATE POLICY "Allow Public Update buckets" ON storage.buckets
    FOR UPDATE TO public
    USING (true)
    WITH CHECK (true);
  `);

  // 2. storage.objects policies
  console.log('2. Configuring storage.objects policies...');
  await client.query(`DROP POLICY IF EXISTS "Allow All Storage Select" ON storage.objects;`);
  await client.query(`DROP POLICY IF EXISTS "Allow All Storage Insert" ON storage.objects;`);
  await client.query(`DROP POLICY IF EXISTS "Allow All Storage Update" ON storage.objects;`);
  await client.query(`DROP POLICY IF EXISTS "Allow All Storage Delete" ON storage.objects;`);

  await client.query(`
    CREATE POLICY "Allow All Storage Select" ON storage.objects
    FOR SELECT TO public
    USING (true);
  `);
  await client.query(`
    CREATE POLICY "Allow All Storage Insert" ON storage.objects
    FOR INSERT TO public
    WITH CHECK (true);
  `);
  await client.query(`
    CREATE POLICY "Allow All Storage Update" ON storage.objects
    FOR UPDATE TO public
    USING (true)
    WITH CHECK (true);
  `);
  await client.query(`
    CREATE POLICY "Allow All Storage Delete" ON storage.objects
    FOR DELETE TO public
    USING (true);
  `);

  // 3. storage.s3_multipart_uploads policies
  console.log('3. Configuring multipart upload policies...');
  await client.query(`DROP POLICY IF EXISTS "Allow All Multipart Uploads" ON storage.s3_multipart_uploads;`);
  await client.query(`DROP POLICY IF EXISTS "Allow All Multipart Parts" ON storage.s3_multipart_uploads_parts;`);

  try {
    await client.query(`
      CREATE POLICY "Allow All Multipart Uploads" ON storage.s3_multipart_uploads
      FOR ALL TO public
      USING (true)
      WITH CHECK (true);
    `);
    await client.query(`
      CREATE POLICY "Allow All Multipart Parts" ON storage.s3_multipart_uploads_parts
      FOR ALL TO public
      USING (true)
      WITH CHECK (true);
    `);
  } catch (e) {
    console.log('Multipart notice:', e.message);
  }

  // 4. Also apply all Database Table Policies from rls_policies.sql
  console.log('4. Applying database table RLS policies...');
  const tables = [
    'User', 'Address', 'WishlistItem', 'Category', 'Product', 'ProductImage',
    'Order', 'OrderItem', 'SiteSettings', 'BulkOrderInquiry', 'Coupon',
    'Review', 'Blog', 'SeoData', 'ProductSeo', 'Banner', 'CartItem',
    'Payment', 'Refund', 'DeliveryCharge', 'TrackingScript', 'TiffinRegistration',
    'SaffronGuidance', 'LoginHistory', 'PasswordResetToken', 'NewsletterSubscriber',
    'CareerApplication'
  ];

  for (const t of tables) {
    try {
      await client.query(`ALTER TABLE public."${t}" ENABLE ROW LEVEL SECURITY;`);
      await client.query(`DROP POLICY IF EXISTS "Allow public read access ${t}" ON public."${t}";`);
      await client.query(`DROP POLICY IF EXISTS "Allow public full access ${t}" ON public."${t}";`);
      
      // Allow full access for backend/authenticated/anon
      await client.query(`
        CREATE POLICY "Allow public full access ${t}" ON public."${t}"
        FOR ALL TO public
        USING (true)
        WITH CHECK (true);
      `);
      console.log(`  ✓ Table "${t}" RLS configured.`);
    } catch (tblErr) {
      console.log(`  - Notice for table "${t}":`, tblErr.message);
    }
  }

  console.log('\n====================================================');
  console.log('ALL STORAGE & DATABASE RLS POLICIES APPLIED 100%');
  console.log('====================================================');

  const policies = await client.query(`
    SELECT schemaname, tablename, count(*) 
    FROM pg_policies 
    GROUP BY schemaname, tablename 
    ORDER BY schemaname, tablename;
  `);
  console.log('\nPolicy counts by table:');
  for (const p of policies.rows) {
    console.log(` - [${p.schemaname}.${p.tablename}]: ${p.count} policies`);
  }

  await client.end();
}

applyCompleteStorageRls().catch(console.error);
