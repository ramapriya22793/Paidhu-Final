const http = require('https');

const urls = [
  "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/banners/1781325698005-banner1jpeg.jpeg",
  "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/banners/1781325711601-banner2jpeg.jpeg",
  "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/banners/1781325719789-banner3jpeg.jpeg"
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = http.request(url, { method: 'HEAD' }, (res) => {
      console.log(`${url} -> Status Code: ${res.statusCode}`);
      resolve(res.statusCode);
    });
    req.on('error', (e) => {
      console.error(`Error checking ${url}: ${e.message}`);
      resolve(null);
    });
    req.end();
  });
}

async function main() {
  for (const url of urls) {
    await checkUrl(url);
  }
}

main().catch(console.error);
