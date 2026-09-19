const { Client } = require('pg');
const dbUrl = 'postgresql://postgres.xittsoabiuzuzrzdjktb:PaidhuEthicalFoods%40123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

async function inspectTrigger() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const trigs = await client.query(`
    SELECT tgname, pg_get_triggerdef(oid) 
    FROM pg_trigger 
    WHERE tgrelid = 'storage.buckets'::regclass;
  `);
  console.log('Triggers on storage.buckets:');
  for (const r of trigs.rows) {
    console.log(r);
  }

  const func = await client.query(`
    SELECT prosrc FROM pg_proc WHERE proname = 'protect_delete';
  `);
  console.log('Function storage.protect_delete source:');
  for (const r of func.rows) {
    console.log(r.prosrc);
  }

  await client.end();
}

inspectTrigger().catch(console.error);
