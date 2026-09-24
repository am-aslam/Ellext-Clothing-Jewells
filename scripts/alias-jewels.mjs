import fs from 'fs';
import path from 'path';

const jewelsDir = path.join(process.cwd(), 'public', 'assets', 'products', 'jewels');
const files = fs.readdirSync(jewelsDir).filter(f => !f.startsWith('jewel-') && !f.startsWith('.'));

files.forEach((file, idx) => {
  const ext = path.extname(file);
  const cleanName = `jewel-${String(idx + 1).padStart(2, '0')}${ext}`;
  const src = path.join(jewelsDir, file);
  const dest = path.join(jewelsDir, cleanName);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
  }
});

console.log(`Mapped ${files.length} jewel images to clean alias names!`);
