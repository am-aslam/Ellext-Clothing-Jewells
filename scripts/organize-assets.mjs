import fs from 'fs';
import path from 'path';

const sourceBase = 'C:\\Users\\91811\\Downloads\\jewels_temp\\Jewels';
const destJewels = path.join(process.cwd(), 'public', 'assets', 'products', 'jewels');
const destClothing = path.join(process.cwd(), 'public', 'assets', 'products', 'clothing');
const destEditorial = path.join(process.cwd(), 'public', 'assets', 'editorial');

fs.mkdirSync(destJewels, { recursive: true });
fs.mkdirSync(destClothing, { recursive: true });
fs.mkdirSync(destEditorial, { recursive: true });

if (fs.existsSync(sourceBase)) {
  const items = fs.readdirSync(sourceBase);
  for (const item of items) {
    const fullPath = path.join(sourceBase, item);
    const stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      fs.copyFileSync(fullPath, path.join(destJewels, item));
    }
  }

  const clothingSource = path.join(sourceBase, 'Clothing');
  if (fs.existsSync(clothingSource)) {
    const clothingItems = fs.readdirSync(clothingSource);
    for (const item of clothingItems) {
      const fullPath = path.join(clothingSource, item);
      if (fs.statSync(fullPath).isFile()) {
        fs.copyFileSync(fullPath, path.join(destClothing, item));
      }
    }
  }
}

console.log('Successfully organized assets into public/assets/');
