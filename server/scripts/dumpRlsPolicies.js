require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function getRlsPolicies() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  console.log('Connected to current database.');

  // 1. Get all tables in public schema and their RLS status
  const tablesRes = await client.query(`
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `);
  console.log('--- TABLES IN PUBLIC SCHEMA ---');
  console.log(`Found ${tablesRes.rows.length} tables in public schema.`);

  // 2. Get all policies in pg_policies
  const policiesRes = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname IN ('public', 'storage')
    ORDER BY schemaname, tablename, policyname;
  `);
  console.log('--- RLS POLICIES ---');
  console.log('Total policies found:', policiesRes.rows.length);

  // 3. Generate SQL statements to recreate all RLS enables and policies
  let sql = '-- ==========================================\n';
  sql += '-- ROW LEVEL SECURITY (RLS) & POLICIES EXPORT\n';
  sql += '-- ==========================================\n\n';

  tablesRes.rows.forEach(t => {
    if (t.rowsecurity) {
      sql += `ALTER TABLE public."${t.tablename}" ENABLE ROW LEVEL SECURITY;\n`;
    }
  });

  sql += '\n-- ==========================================\n';
  sql += '-- POLICIES DEFINITIONS\n';
  sql += '-- ==========================================\n\n';

  policiesRes.rows.forEach(p => {
    const roles = Array.isArray(p.roles) ? p.roles.join(', ') : 'public';
    sql += `CREATE POLICY "${p.policyname}" ON ${p.schemaname}."${p.tablename}"\n`;
    sql += `  AS ${p.permissive}\n`;
    sql += `  FOR ${p.cmd}\n`;
    sql += `  TO ${roles}\n`;
    if (p.qual) {
      sql += `  USING (${p.qual})\n`;
    }
    if (p.with_check) {
      sql += `  WITH CHECK (${p.with_check})\n`;
    }
    sql += ';\n\n';
  });

  const outJson = path.join(__dirname, '..', 'backup_data', 'RLS_POLICIES_BACKUP.json');
  fs.writeFileSync(outJson, JSON.stringify({ tables: tablesRes.rows, policies: policiesRes.rows }, null, 2), 'utf8');

  const outSql = path.join(__dirname, '..', 'backup_data', 'RLS_POLICIES.sql');
  fs.writeFileSync(outSql, sql, 'utf8');

  console.log('Saved RLS JSON backup to:', outJson);
  console.log('Saved RLS SQL recreate script to:', outSql);

  await client.end();
}

getRlsPolicies().then(() => process.exit(0)).catch(err => {
  console.error('Error fetching RLS:', err.message);
  process.exit(1);
});
