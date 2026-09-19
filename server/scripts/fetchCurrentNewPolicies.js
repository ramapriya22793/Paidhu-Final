const { Client } = require('pg');

const dbUrl = 'postgresql://postgres.xittsoabiuzuzrzdjktb:PaidhuEthicalFoods%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

async function checkCurrentNewPolicies() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const res = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
    FROM pg_policies 
    ORDER BY schemaname, tablename, policyname;
  `);

  console.log(`Total active policies in target Supabase: ${res.rows.length}`);
  for (const r of res.rows) {
    console.log(`[${r.schemaname}.${r.tablename}] (${r.cmd}) -> ${r.policyname} | roles: ${r.roles} | qual: ${r.qual} | with_check: ${r.with_check}`);
  }

  await client.end();
}

checkCurrentNewPolicies().catch(console.error);
