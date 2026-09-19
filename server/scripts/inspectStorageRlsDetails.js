const { Client } = require('pg');

const dbUrl = 'postgresql://postgres.xittsoabiuzuzrzdjktb:PaidhuEthicalFoods%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

async function checkBucketsRls() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const rlsCheck = await client.query(`
    SELECT relname, relrowsecurity, relforcerowsecurity 
    FROM pg_class 
    JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace 
    WHERE pg_namespace.nspname = 'storage';
  `);
  console.log('RLS on storage tables:', rlsCheck.rows);

  const bucketPolicies = await client.query(`
    SELECT * FROM pg_policies WHERE schemaname = 'storage';
  `);
  console.log('\nStorage policies:');
  for (const p of bucketPolicies.rows) {
    console.log(`[${p.tablename}] (${p.cmd}) ${p.policyname} | roles: ${p.roles} | qual: ${p.qual} | with_check: ${p.with_check}`);
  }

  await client.end();
}

checkBucketsRls().catch(console.error);
