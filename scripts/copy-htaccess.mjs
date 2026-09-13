import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
mkdirSync(dist, { recursive: true });

for (const name of ['.htaccess', 'index.php']) {
  const from = join(root, 'public', name);
  const to = join(dist, name);
  if (existsSync(from)) {
    copyFileSync(from, to);
    copyFileSync(from, join(root, name));
    console.log(`Copied ${name} to dist and repo root`);
  }
}
