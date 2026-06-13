const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      searchDir(filePath);
    } else if (stat.isFile() && (file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.jsx'))) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('nav') || content.includes('header') || content.includes('sticky')) {
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('absolute') || line.includes('fixed') || line.includes('margin-top') || line.includes('mt-') || line.includes('transparent')) {
            if (line.includes('nav') || line.includes('header') || line.includes('sticky') || line.includes('Hero') || line.includes('banner')) {
              console.log(`${filePath}:${idx + 1} -> ${line.trim()}`);
            }
          }
        });
      }
    }
  }
}

searchDir('C:/Users/admin/Desktop/Paidhu Backend/frontend/src');
