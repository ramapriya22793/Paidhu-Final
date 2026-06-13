const { Jimp } = require('jimp');

async function processImage() {
  console.log("Reading image...");
  const image = await Jimp.read('../../src/assets/flower_frame.png');
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  
  // Find bounding box of the non-white pixels
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const hex = image.getPixelColor(x, y);
      const r = (hex >> 24) & 255;
      const g = (hex >> 16) & 255;
      const b = (hex >> 8) & 255;
      
      if (r < 150 && g < 150 && b < 150) { // Dark pixel
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  
  // Add 10px padding safely
  minX = Math.max(0, minX - 10);
  minY = Math.max(0, minY - 10);
  maxX = Math.min(width - 1, maxX + 10);
  maxY = Math.min(height - 1, maxY + 10);
  
  const cropW = maxX - minX;
  const cropH = maxY - minY;
  
  console.log(`Cropping from ${width}x${height} to ${cropW}x${cropH}...`);
  
  // Crop original image for the overlay
  image.crop({ x: minX, y: minY, w: cropW, h: cropH });
  await image.write('../../src/assets/flower_frame_cropped.png');
  
  // Create mask of the cropped size
  const mask = new Jimp({ width: cropW, height: cropH, color: 0xFFFFFFFF });
  
  console.log("Running flood fill on mask...");
  const queue = [{x: 0, y: 0}];
  const visited = new Set(['0,0']);
  
  while(queue.length > 0) {
    const {x, y} = queue.shift();
    
    // Check pixel color in the CROPPED image
    const hex = image.getPixelColor(x, y);
    const r = (hex >> 24) & 255;
    const g = (hex >> 16) & 255;
    const b = (hex >> 8) & 255;
    
    // Light colored (not the black outline)
    if (r > 150 && g > 150 && b > 150) {
      // Mark as outside (transparent) in the mask
      mask.setPixelColor(0x00000000, x, y);
      
      const neighbors = [
        {x: x+1, y: y}, {x: x-1, y: y},
        {x: x, y: y+1}, {x: x, y: y-1}
      ];
      
      for (const n of neighbors) {
        if (n.x >= 0 && n.x < cropW && n.y >= 0 && n.y < cropH) {
          const key = `${n.x},${n.y}`;
          if (!visited.has(key)) {
            visited.add(key);
            queue.push(n);
          }
        }
      }
    }
  }
  
  console.log("Writing cropped mask image...");
  await mask.write('../../src/assets/flower_mask_generated.png');
  console.log("Done!");
}

processImage().catch(console.error);
