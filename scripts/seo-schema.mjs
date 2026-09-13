import { writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildJsonLd } from '../src/seo/schema.js';
import { buildAiTxt, buildLlmsFullTxt, buildLlmsTxt, buildSitemapXml } from '../src/seo/geoFiles.js';
import { SEO_ROUTES, canonicalFor } from '../src/seo/routes.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');

const schema = buildJsonLd();
writeFileSync(join(publicDir, 'schema.jsonld'), `${JSON.stringify(schema, null, 2)}\n`, 'utf8');
writeFileSync(join(publicDir, 'llms.txt'), buildLlmsTxt(), 'utf8');
writeFileSync(join(publicDir, 'llms-full.txt'), buildLlmsFullTxt(), 'utf8');
writeFileSync(join(publicDir, 'ai.txt'), buildAiTxt(), 'utf8');
writeFileSync(join(publicDir, 'sitemap.xml'), buildSitemapXml(), 'utf8');

const seoRoutes = Object.fromEntries(
  SEO_ROUTES.map((route) => [
    route.path,
    {
      title: route.title,
      description: route.description,
      canonical: canonicalFor(route.path),
    },
  ])
);
writeFileSync(join(publicDir, 'seo-routes.json'), `${JSON.stringify(seoRoutes, null, 2)}\n`, 'utf8');

for (const name of ['schema.jsonld', 'llms.txt', 'llms-full.txt', 'ai.txt', 'sitemap.xml', 'robots.txt', 'seo-routes.json']) {
  writeFileSync(join(root, name), readFileSync(join(publicDir, name), 'utf8'), 'utf8');
}

console.log('Wrote schema.jsonld, llms.txt, llms-full.txt, ai.txt, sitemap.xml');
