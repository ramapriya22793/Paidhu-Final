const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/src/components/home/fallbacks.json');

try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  let updatedCount = 0;

  function processProductList(list) {
    if (!Array.isArray(list)) return;
    for (const item of list) {
      if (item.raw && item.raw.name && item.raw.name.toLowerCase().includes('jam')) {
        const raw = item.raw;
        if (Array.isArray(raw.variants) && raw.variants.length > 1) {
          const has250g = raw.variants.some(v => v.size === '250g');
          const has30g = raw.variants.some(v => v.size === '30g');

          if (has250g && has30g) {
            const reordered = [];
            const v250 = raw.variants.find(v => v.size === '250g');
            const v30 = raw.variants.find(v => v.size === '30g');
            const rest = raw.variants.filter(v => v.size !== '250g' && v.size !== '30g');

            reordered.push(v250);
            reordered.push(v30);
            reordered.push(...rest);

            raw.variants = reordered;
            updatedCount++;
            console.log(`Reordered variants in fallbacks for "${raw.name}"`);
          }
        }
      }
    }
  }

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      processProductList(data[key]);
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully updated ${updatedCount} entries in fallbacks.json`);
  } else {
    console.log('No matching entries found/updated in fallbacks.json');
  }

} catch (err) {
  console.error('Error updating fallbacks.json:', err);
}
