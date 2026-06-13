const fs = require('fs');
const path = require('path');

function searchDir(dir, pattern) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      searchDir(filePath, pattern);
    } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css'))) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(pattern)) {
        console.log(`Found pattern "${pattern}" in: ${filePath}`);
      }
    }
  }
}

searchDir('C:/Users/admin/Desktop/Paidhu Backend/frontend/src', '/api/settings');
searchDir('C:/Users/admin/Desktop/Paidhu Backend/frontend/src', 'settings');
