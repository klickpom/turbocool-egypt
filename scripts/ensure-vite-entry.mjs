import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const indexPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
let html = readFileSync(indexPath, 'utf8');

html = html.replace(/<link rel="modulepreload"[^>]*>\s*/g, '');
html = html.replace(/<link rel="stylesheet" crossorigin href="\.\/assets\/[^"]+">\s*/g, '');
html = html.replace(/<script type="module" crossorigin src="\.\/assets\/[^"]+"><\/script>\s*/g, '');
html = html.replace(/<link rel="icon"[^>]*>/, '<link rel="icon" type="image/jpeg" href="./logo.jpg" />');

if (!html.includes('src="/src/main.jsx"')) {
  html = html.replace('</head>', '    <script type="module" src="/src/main.jsx"></script>\n  </head>');
}

writeFileSync(indexPath, html, 'utf8');
console.log('Restored Vite entry /src/main.jsx');
