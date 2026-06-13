const fs = require('fs');

const cx = 0.5;
const cy = 0.5;
const numPoints = 300;
let path = '';

for (let i = 0; i <= numPoints; i++) {
  const theta = (i / numPoints) * Math.PI * 2;
  
  let angle = (theta % (Math.PI * 2 / 5)) / (Math.PI * 2 / 5); 
  
  // Plump base shape
  let baseR = 0.22 + 0.24 * Math.pow(Math.sin(angle * Math.PI), 0.7);
  
  // 3 distinct bumps on the outer edge
  let bumps = 0.015 * Math.sin(angle * Math.PI * 3);
  
  let r = baseR + Math.abs(bumps);
  
  // Scale down slightly to ensure it stays within [0,1]
  r = r * 0.98;
  
  const x = cx + r * Math.sin(theta);
  const y = cy - r * Math.cos(theta); 

  if (i === 0) {
    path += `M ${x.toFixed(4)} ${y.toFixed(4)} `;
  } else {
    path += `L ${x.toFixed(4)} ${y.toFixed(4)} `;
  }
}
path += 'Z';

fs.writeFileSync('flower_path2.txt', path);
