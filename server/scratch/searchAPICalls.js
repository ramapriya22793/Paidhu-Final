const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      searchDir(filePath);
    } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.jsx'))) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('API_BASE') || line.includes('localhost:') || line.includes('/api/')) {
          console.log(`${filePath}:${idx + 1} -> ${line.trim()}`);
        }
      });
    }
  }
}

searchDir('C:/Users/admin/Desktop/Paidhu Backend/frontend/src');
