const https = require('https');

const url = "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/banners/1781325698005-banner1jpeg.jpeg";

https.get(url, (res) => {
  const chunks = [];
  res.on('data', (chunk) => {
    chunks.push(chunk);
  });
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    console.log("Buffer length:", buffer.length);
    
    // Simple parser for JPEG dimensions
    // JPEG starts with FF D8
    let i = 0;
    if (buffer[i] === 0xFF && buffer[i+1] === 0xD8) {
      i += 2;
      while (i < buffer.length) {
        if (buffer[i] === 0xFF) {
          const marker = buffer[i+1];
          if (marker === 0xC0 || marker === 0xC2) { // SOF0 or SOF2
            const height = buffer.readUInt16BE(i + 5);
            const width = buffer.readUInt16BE(i + 7);
            console.log(`JPEG Dimensions: ${width}x${height} (Aspect Ratio: ${(width / height).toFixed(2)})`);
            process.exit(0);
          }
          // Move to next segment
          const length = buffer.readUInt16BE(i + 2);
          i += 2 + length;
        } else {
          i++;
        }
      }
    }
    console.log("Could not parse JPEG header or not a JPEG.");
    process.exit(0);
  });
}).on('error', (e) => {
  console.error("Error fetching image:", e.message);
  process.exit(1);
});
