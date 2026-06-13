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
      if (content.includes('Paidhu Experience') || content.includes('Paidhu It Up') || content.includes('Exquisite Recipes')) {
        console.log(`Found section in file: ${filePath}`);
      }
    }
  }
}

searchDir('C:/Users/admin/Desktop/Paidhu Backend/frontend/src/components/home');
