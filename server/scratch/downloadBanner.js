const https = require('https');
const fs = require('fs');

const url = "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/banners/1781325698005-banner1jpeg.jpeg";
const dest = "C:/Users/admin/.gemini/antigravity/brain/94eb0701-7a62-4165-b96c-69b36059415a/downloaded_banner.jpeg";

const file = fs.createWriteStream(dest);
https.get(url, (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log("Download completed successfully.");
    process.exit(0);
  });
}).on('error', (e) => {
  console.error("Error downloading file:", e.message);
  process.exit(1);
});
