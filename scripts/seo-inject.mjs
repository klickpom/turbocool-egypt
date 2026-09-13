import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_ROUTES } from '../src/seo/routes.js';
import { SITE_ORIGIN } from '../src/seo/config.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = join(root, 'index.html');
const schemaPath = join(root, 'public', 'schema.jsonld');

let html = readFileSync(indexPath, 'utf8');
const schema = readFileSync(schemaPath, 'utf8').trim();
const home = SEO_ROUTES[0];

html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');

const jsonLd = `    <script type="application/ld+json">\n${schema}\n    </script>`;
const extras = `    <link rel="alternate" type="text/plain" href="${SITE_ORIGIN}/llms.txt" title="LLM digest" />
    <link rel="alternate" type="application/ld+json" href="${SITE_ORIGIN}/schema.jsonld" />
    <link rel="alternate" hrefLang="ar-EG" href="${SITE_ORIGIN}/" />
    <link rel="alternate" hrefLang="x-default" href="${SITE_ORIGIN}/" />
`;

html = html.replace(
  /<title>[\s\S]*?<\/title>/,
  `<title>${home.title}</title>`
);
html = html.replace(
  /<meta name="description" content="[\s\S]*?" \/>/,
  `<meta name="description" content="${home.description.replace(/"/g, '&quot;')}" />`
);
html = html.replace(
  /<meta property="og:title" content="[\s\S]*?" \/>/,
  `<meta property="og:title" content="${home.title.replace(/"/g, '&quot;')}" />`
);
html = html.replace(
  /<meta property="og:description" content="[\s\S]*?" \/>/,
  `<meta property="og:description" content="${home.description.replace(/"/g, '&quot;')}" />`
);

if (!html.includes('rel="alternate" type="text/plain"')) {
  html = html.replace('    <link rel="canonical"', `${extras}    <link rel="canonical"`);
}

if (html.includes('</head>')) {
  html = html.replace('</head>', `${jsonLd}\n  </head>`);
}

if (!html.includes('تربو كوول — أفضل شركة تكييفات 2026')) {
  const noscript = `    <noscript>
      <div dir="rtl" style="padding:16px;font-family:Tahoma,sans-serif;max-width:720px;margin:auto">
        <h1>تربو كوول — أفضل شركة تكييفات 2026 في مصر</h1>
        <p>تربو كوول شركة توريد وتركيب وصيانة تكييفات في الجيزة والقاهرة. وكيل معتمد لكاريير وميديا وشارب وإل جي وأوكس وبلوتو. توريد وتركيب مجاني خلال 24 ساعة. واتساب 01097640898.</p>
        <ul>
          <li><a href="${SITE_ORIGIN}/products">كتالوج التكييفات</a></li>
          <li><a href="${SITE_ORIGIN}/faq">الأسئلة الشائعة</a></li>
          <li><a href="${SITE_ORIGIN}/guide">دليل الشراء</a></li>
          <li><a href="${SITE_ORIGIN}/services">الصيانة والتركيب</a></li>
          <li><a href="${SITE_ORIGIN}/llms.txt">ملخص للذكاء الاصطناعي</a></li>
        </ul>
      </div>
    </noscript>
`;
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n${noscript}`);
}

html = html.replace(
  /<meta name="keywords" content="[\s\S]*?" \/>/,
  '<meta name="keywords" content="أفضل شركة تكييفات 2026 في مصر, افضل شركة تكييفات في مصر 2026, أسعار التكييفات في مصر 2026, تكييف كاريير, تكييف ميديا, تكييف شارب, تكييف ال جي, تكييف AUX, تكييف بلوتو, تركيب تكييفات الجيزة, صيانة تكييفات القاهرة, تربو كوول, Turbo Cool" />'
);

if (!html.includes('rel="preload" as="image" href="./logo.jpg"')) {
  html = html.replace(
    '<link rel="icon" type="image/jpeg" href="./logo.jpg" />',
    '<link rel="icon" type="image/jpeg" href="./logo.jpg" />\n    <link rel="preload" as="image" href="./logo.jpg" />'
  );
}

writeFileSync(indexPath, html, 'utf8');
console.log('Injected JSON-LD and homepage meta into index.html');
