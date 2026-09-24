import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const archive = process.argv[2] || process.env.JEWELS_ZIP || path.join(process.cwd(), 'Jewels.zip');
const target = path.join(process.cwd(), 'public', 'assets', 'products', 'jewels');
const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

if (!fs.existsSync(archive)) {
  console.error(`Jewels archive not found: ${archive}`);
  console.error('Pass the archive path: npm run assets:import -- C:/path/to/Jewels.zip');
  process.exit(1);
}
fs.mkdirSync(target, { recursive: true });
const result = spawnSync('tar', ['-xf', archive, '-C', target], { stdio: 'inherit', shell: process.platform === 'win32' });
if (result.status !== 0) throw new Error('Could not extract the ZIP archive. Install tar/bsdtar and retry.');

function flatten(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) flatten(source);
    else if (allowed.has(path.extname(entry.name).toLowerCase())) {
      const safeName = entry.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const destination = path.join(target, safeName);
      if (source !== destination) fs.copyFileSync(source, destination);
    }
  }
}
flatten(target);
console.log(`Imported image assets from ${archive}. Product metadata remains editable through the admin API.`);
