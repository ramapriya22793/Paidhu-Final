const { Client } = require('pg');

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ca-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
  'eu-central-1', 'eu-central-2', 'eu-north-1',
  'ap-south-1', 'ap-southeast-1', 'ap-southeast-2',
  'ap-northeast-1', 'ap-northeast-2', 'sa-east-1', 'me-central-1'
];

async function main() {
  for (const r of regions) {
    for (const prefix of ['aws-0', 'aws-1']) {
      const host = `${prefix}-${r}.pooler.supabase.com`;
      const client = new Client({
        user: 'postgres.ljrwcciuacjbwocsxiqc',
        password: 'Paidhu@22793',
        host: host,
        port: 5432,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 3000
      });
      try {
        await client.connect();
        console.log(`>>> SUCCESS CONNECTED TO ${host}!`);
        const res = await client.query('SELECT current_user, version()');
        console.log('Query result:', res.rows[0]);
        await client.end();
        process.exit(0);
      } catch (err) {
        if (!err.message.includes('tenant') && !err.message.includes('not found') && !err.message.includes('ENOTFOUND') && !err.message.includes('timeout')) {
          console.log(`Response from ${host}:`, err.message);
        }
        try { await client.end(); } catch (e) {}
      }
    }
  }
  console.log('Checked all regions.');
}
main();
