const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if(file.endsWith('.jsx') || file.endsWith('.js')) results.push(file);
    }
  });
  return results;
}

const files = walk('./frontend/src');
let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('import.meta.env.VITE_API_URL')) {
    content = content.replace(/const API_BASE = import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000';/g, "const API_BASE = 'https://paidhu-final-anm2.vercel.app';");
    fs.writeFileSync(file, content);
    count++;
  }
});
console.log('Modified ' + count + ' files.');
