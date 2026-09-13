import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(root, 'public', '.htaccess');
const to = join(root, 'dist', '.htaccess');
if (existsSync(from)) {
  mkdirSync(join(root, 'dist'), { recursive: true });
  copyFileSync(from, to);
  console.log('Copied .htaccess to dist');
}
