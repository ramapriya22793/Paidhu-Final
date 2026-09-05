const net = require('net');

const regions = [
  'ap-south-1', 'ap-southeast-1', 'ap-southeast-2',
  'ap-northeast-1', 'ap-northeast-2',
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ca-central-1',
  'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1',
  'sa-east-1', 'me-central-1', 'af-south-1'
];

async function scan() {
  const promises = [];

  for (const r of regions) {
    for (const prefix of ['aws-0', 'aws-1']) {
      const host = prefix + '-' + r + '.pooler.supabase.com';
      const p = new Promise((resolve) => {
        const socket = net.createConnection(5432, host);
        socket.setTimeout(4000);

        socket.on('connect', () => {
          const sslReq = Buffer.from([0, 0, 0, 8, 4, 210, 22, 47]);
          socket.write(sslReq);
        });

        socket.on('data', (data) => {
          if (data.toString() === 'S') {
            const userStr = 'postgres.ljrwcciuacjbwocsxiqc';
            const dbStr = 'postgres';
            const userBuf = Buffer.from('user\0' + userStr + '\0database\0' + dbStr + '\0\0');
            const len = userBuf.length + 8;
            const startup = Buffer.alloc(len);
            startup.writeInt32BE(len, 0);
            startup.writeInt32BE(196608, 4);
            userBuf.copy(startup, 8);
            socket.write(startup);
          } else {
            const resp = data.toString('utf8');
            if (resp.includes('tenant') && resp.includes('not found')) {
              // Not this region
            } else {
              console.log('>>> MATCH FOUND on', host, '-> Response:', JSON.stringify(resp));
            }
            socket.destroy();
            resolve();
          }
        });

        socket.on('error', () => { resolve(); });
        socket.on('timeout', () => { socket.destroy(); resolve(); });
        socket.on('close', () => { resolve(); });
      });
      promises.push(p);
    }
  }

  await Promise.all(promises);
  console.log('Scan complete.');
}

scan();
