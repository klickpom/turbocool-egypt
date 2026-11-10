# Cloudflare Pages (branch `cloudflare`)

Hostinger served the repository root as-is (Apache + PHP). This branch serves the same files on Cloudflare Pages and replaces the PHP with one Pages Function.

## Pages settings
- Production branch: `cloudflare`
- Build command: none
- Build output directory: `/`

## Bindings (Pages > Settings > Bindings / Variables)
- `DB` — D1 database. The Function creates table `store(key, value)` on first use; the catalog lives in key `catalog`.
- `ADMIN_PIN` — comma-separated admin PINs (case-insensitive). Without it every admin save returns 401.

## What replaced what
| Hostinger | Cloudflare |
|---|---|
| `index.php` (per-route title/description/canonical/og/twitter from `seo-routes.json`) | `functions/[[path]].js` → `renderIndex` |
| `api/catalog.php` (GET / add-order / save-catalog, JSON file store) | `functions/[[path]].js` → `catalogApi`, D1 store |
| `.htaccess` (www→apex, trailing slash, SPA fallback, headers) | `functions/[[path]].js` + `_headers` + `_routes.json` |

## Data import (once, at cutover)
POST the live payload to the new site with an admin PIN:
`{"pin":"<PIN>","payload":<payload from GET https://turbocool-egypt.shop/api/catalog.php>}`

## Sync from Hostinger (migration only)
Set env var `SEED_SOURCE=https://turbocool-egypt.shop/api/catalog.php` (while the domain still points to Hostinger), then
`POST /api/catalog.php {"action":"sync-from-source"}` copies products/services/settings/coupons and merges orders by id.
Delete `SEED_SOURCE` right after cutover; without it the action returns 403.
