const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const dbUrl = 'postgresql://postgres.xittsoabiuzuzrzdjktb:PaidhuEthicalFoods%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';
const supabaseUrl = 'https://xittsoabiuzuzrzdjktb.supabase.co';
const supabaseAnonKey = 'sb_publishable_SuDUNZP6gbn0BuyMcTbrNA_k75HNFAj';

async function inspect() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const trigs = await client.query(`
    SELECT tgname, pg_get_triggerdef(oid) 
    FROM pg_trigger 
    WHERE tgrelid = 'storage.objects'::regclass;
  `);
  console.log('Triggers on storage.objects:');
  for (const r of trigs.rows) {
    console.log(r);
  }

  const pol = await client.query(`
    SELECT * FROM pg_policies WHERE tablename = 'objects';
  `);
  console.log('\nPolicies on storage.objects:');
  for (const r of pol.rows) {
    console.log(`[${r.cmd}] ${r.policyname} | roles: ${r.roles} | qual: ${r.qual} | with_check: ${r.with_check}`);
  }

  await client.end();
}

inspect().catch(console.error);
