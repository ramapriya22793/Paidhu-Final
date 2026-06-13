const https = require('https');
const fs = require('fs');

const urls = [
  { url: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/banners/1781325711601-banner2jpeg.jpeg", dest: "C:/Users/admin/.gemini/antigravity/brain/94eb0701-7a62-4165-b96c-69b36059415a/downloaded_banner2.jpeg" },
  { url: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/banners/1781325719789-banner3jpeg.jpeg", dest: "C:/Users/admin/.gemini/antigravity/brain/94eb0701-7a62-4165-b96c-69b36059415a/downloaded_banner3.jpeg" }
];

function download(item) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(item.dest);
    https.get(item.url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${item.dest} successfully.`);
        resolve(true);
      });
    }).on('error', (e) => {
      console.error(`Error downloading ${item.url}:`, e.message);
      resolve(false);
    });
  });
}

async function main() {
  for (const item of urls) {
    await download(item);
  }
}

main().catch(console.error);
