const fs = require('fs');

const cx = 0.5;
const cy = 0.5;
const numPoints = 200;
let path = '';

for (let i = 0; i <= numPoints; i++) {
  const theta = (i / numPoints) * Math.PI * 2;
  
  // Base radius
  let r = 0.35;
  
  // 5 main petals
  // To make petals separated, we can use a power function or absolute value
  const petalShape = Math.cos(5 * theta / 2);
  // We want 5 lobes
  r += 0.12 * Math.cos(5 * theta);
  
  // Ruffles: 3 ruffles per petal
  // To make it look exactly like the image, we want 3 distinct bumps on the outer edge of each petal.
  // The image shows the petals having wavy edges.
  // We can add a high frequency sine wave that is modulated so it's strongest at the outer edge of the petal.
  const ruffle = 0.03 * Math.cos(15 * theta);
  r += ruffle;

  // Wait, the image petals have deep cuts between them.
  // Let's use: r = 0.25 + 0.2 * Math.abs(Math.sin(2.5 * theta)) + 0.02 * Math.cos(15 * theta)
  // No, let's use:
  let angle = (theta % (Math.PI * 2 / 5)) / (Math.PI * 2 / 5); // 0 to 1 across one petal
  // angle goes from 0 to 1
  
  // r(angle)
  // deep cut at angle 0 and 1, max at 0.5
  let baseR = 0.15 + 0.3 * Math.sin(angle * Math.PI);
  
  // 3 bumps per petal:
  // sin(angle * Math.PI * 3) gives 3 bumps
  let bumps = 0.02 * Math.sin(angle * Math.PI * 3);
  
  r = baseR + Math.abs(bumps);
  
  const x = cx + r * Math.sin(theta);
  const y = cy - r * Math.cos(theta); // -cos to start at top

  if (i === 0) {
    path += `M ${x.toFixed(4)} ${y.toFixed(4)} `;
  } else {
    path += `L ${x.toFixed(4)} ${y.toFixed(4)} `;
  }
}
path += 'Z';

console.log(path);
fs.writeFileSync('flower_path.txt', path);
