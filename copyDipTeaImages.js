const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\d8a910a7-7bfe-43ff-aaad-346a6f6af175';
const destDir = path.join(__dirname, 'frontend', 'public', 'blogs');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);

const mappings = {
  'aavaram_dip_tea': 'aavaram_dip_tea.png',
  'hibiscus_dip_tea': 'hibiscus_dip_tea.png',
  'blue_pea_dip_tea': 'blue_pea_dip_tea.png'
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
