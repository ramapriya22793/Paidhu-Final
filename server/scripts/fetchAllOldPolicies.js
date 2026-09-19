const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const oldDbUrl = 'postgresql://postgres.ljrwcciuacjbwocsxiqc:Paidhu%4022793@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres';

async function fetchOldPolicies() {
  const client = new Client({ connectionString: oldDbUrl, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Connected to OLD Supabase DB!');
    
    const res = await client.query(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
      FROM pg_policies 
      ORDER BY schemaname, tablename, policyname;
    `);
    
    console.log(`Fetched ${res.rows.length} policies from old Supabase!`);
    
    const outPath = path.join(__dirname, '..', 'backup_data', 'OLD_SUPABASE_POLICIES.json');
    fs.writeFileSync(outPath, JSON.stringify(res.rows, null, 2), 'utf8');
    console.log('Saved to:', outPath);
    
    // Group by table
    const grouped = {};
    for (const p of res.rows) {
      const key = `${p.schemaname}.${p.tablename}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(p);
    }
    
    console.log('\nPolicies per table in old Supabase:');
    for (const k of Object.keys(grouped)) {
      console.log(` - ${k}: ${grouped[k].length} policies`);
    }

    await client.end();
  } catch (e) {
    console.error('Error fetching old policies:', e.message);
  }
}

fetchOldPolicies().catch(console.error);
