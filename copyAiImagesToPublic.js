const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\d8a910a7-7bfe-43ff-aaad-346a6f6af175';
const destDir = path.join(__dirname, 'frontend', 'public', 'blogs');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);

const mappings = {
  'aavaram_herbal_tea': 'aavaram_herbal_tea.png',
  'hibiscus_gourmet_drink': 'hibiscus_gourmet_drink.png',
  'blue_pea_floral_tea': 'blue_pea_floral_tea.png',
  'rose_petal_delicacy': 'rose_petal_delicacy.png',
  'gourmet_floral_salad': 'gourmet_floral_salad.png'
};

Object.entries(mappings).forEach(([key, filename]) => {
  const matchingFile = files.find(f => f.startsWith(key) && f.endsWith('.png'));
  if (matchingFile) {
    const srcPath = path.join(srcDir, matchingFile);
    const destPath = path.join(destDir, filename);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${matchingFile} -> /blogs/${filename}`);
  }
});
