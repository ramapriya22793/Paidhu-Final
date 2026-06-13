const http = require('https');

const url = "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Landing%20-%20Videos/Videos.mp4";

const req = http.request(url, { method: 'HEAD' }, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  process.exit(0);
});

req.on('error', (e) => {
  console.error(`Error checking URL: ${e.message}`);
  process.exit(1);
});

req.end();
