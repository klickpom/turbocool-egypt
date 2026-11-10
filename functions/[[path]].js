// Cloudflare Pages Function — replaces Hostinger's index.php, api/catalog.php and .htaccess.
//
// Bindings (Pages > Settings):
//   DB         D1 database. Holds the catalog JSON in table `store`, key "catalog".
//   ADMIN_PIN  Comma-separated admin PINs (case-insensitive), e.g. "turbo2026".
//
// Static files listed in _routes.json "exclude" never reach this Function.

const CANONICAL_HOST = 'turbocool-egypt.shop';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
};

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // www → apex (.htaccess rule 1)
  if (url.hostname.toLowerCase() === 'www.' + CANONICAL_HOST) {
    return Response.redirect('https://' + CANONICAL_HOST + url.pathname + url.search, 301);
  }

  // Trailing slash → no slash, except homepage (.htaccess rule 2)
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    const target = url.pathname.replace(/\/+$/, '') || '/';
    return new Response(null, {
      status: 301,
      headers: { Location: target + url.search, ...SECURITY_HEADERS },
    });
  }

  // Never expose dotfiles (.htaccess, .github, ...) — Apache answered 403
  if (url.pathname.split('/').some((seg) => seg.startsWith('.') && seg.length > 1)) {
    return new Response('Forbidden', { status: 403, headers: SECURITY_HEADERS });
  }

  if (url.pathname.startsWith('/api/')) {
    if (url.pathname === '/api/catalog.php') return catalogApi(request, env);
    return json({ ok: false, error: 'not_found' }, 404);
  }

  // Real non-PHP files (zip, md, etc.) → static asset server
  const last = url.pathname.split('/').pop() || '';
  if (last.includes('.') && !/\.php$/i.test(last)) {
    return env.ASSETS.fetch(request);
  }

  // SPA soft routes, "/" and any *.php → index.php behaviour
  return renderIndex(request, env, url);
}

/* ------------------------------------------------------------------ */
/* index.php: per-route <title>, description, canonical, og, twitter   */
/* ------------------------------------------------------------------ */

let routesCache = null;

async function renderIndex(request, env, url) {
  const origin = url.origin;
  const indexRes = await env.ASSETS.fetch(new Request(origin + '/', { method: 'GET' }));
  if (!indexRes.ok) {
    return new Response('Missing index.html', { status: 500 });
  }
  let html = await indexRes.text();

  let path = url.pathname || '/';
  path = path.replace(/\/+/g, '/');
  if (path !== '/') path = path.replace(/\/+$/, '') || '/';

  if (!routesCache) {
    try {
      const r = await env.ASSETS.fetch(new Request(origin + '/seo-routes.json'));
      routesCache = r.ok ? await r.json() : {};
    } catch {
      routesCache = {};
    }
  }
  const route = routesCache && typeof routesCache[path] === 'object' ? routesCache[path] : null;

  if (route && route.title && route.canonical) {
    const title = esc(route.title);
    const desc = esc(route.description ?? '');
    const canonical = esc(route.canonical);
    const rep = (re, value) => {
      html = html.replace(re, () => value);
    };
    rep(/<title>[\s\S]*?<\/title>/, '<title>' + title + '</title>');
    rep(/<meta name="description" content="[^"]*"\s*\/?>/, '<meta name="description" content="' + desc + '" />');
    rep(/<link rel="canonical" href="[^"]*"\s*\/?>/, '<link rel="canonical" href="' + canonical + '" />');
    rep(/<meta property="og:title" content="[^"]*"\s*\/?>/, '<meta property="og:title" content="' + title + '" />');
    rep(/<meta property="og:description" content="[^"]*"\s*\/?>/, '<meta property="og:description" content="' + desc + '" />');
    rep(/<meta property="og:url" content="[^"]*"\s*\/?>/, '<meta property="og:url" content="' + canonical + '" />');
    rep(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, '<meta name="twitter:title" content="' + title + '" />');
    rep(/<meta name="twitter:description" content="[^"]*"\s*\/?>/, '<meta name="twitter:description" content="' + desc + '" />');
  }

  return new Response(request.method === 'HEAD' ? null : html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      ...SECURITY_HEADERS,
    },
  });
}

// PHP htmlspecialchars(ENT_QUOTES)
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ------------------------------------------------------------------ */
/* api/catalog.php                                                     */
/* ------------------------------------------------------------------ */

const API_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Pin',
  ...SECURITY_HEADERS,
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: API_HEADERS });
}

// PHP is_array(): JSON arrays and objects both count
const isArr = (v) => v !== null && typeof v === 'object';
const toList = (v) => (Array.isArray(v) ? v : Object.values(v));

let tableReady = false;
async function ensureTable(db) {
  if (tableReady) return;
  await db.prepare('CREATE TABLE IF NOT EXISTS store (key TEXT PRIMARY KEY, value TEXT NOT NULL)').run();
  tableReady = true;
}

async function readStore(db) {
  await ensureTable(db);
  const row = await db.prepare('SELECT value FROM store WHERE key = ?').bind('catalog').first();
  if (!row) return { ok: true, payload: null };
  try {
    const data = JSON.parse(row.value);
    return isArr(data) ? data : { ok: true, payload: null };
  } catch {
    return { ok: true, payload: null };
  }
}

async function writeStore(db, payload) {
  payload.updatedAt = Date.now();
  const out = JSON.stringify({ ok: true, payload });
  await ensureTable(db);
  await db
    .prepare('INSERT INTO store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .bind('catalog', out)
    .run();
  return true;
}

function validPin(pin, env) {
  const allowed = String(env.ADMIN_PIN || '')
    .split(',')
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) return false;
  return allowed.includes(String(pin ?? '').trim().toLowerCase());
}

// Pull products/services/settings/coupons from SEED_SOURCE and merge orders
// (union by id, newest first, max 200) so no order placed on either side is lost.
async function syncFromSource(env) {
  const source = String(env.SEED_SOURCE || '').trim();
  if (!/^https:\/\//.test(source)) {
    return json({ ok: false, error: 'disabled' }, 403);
  }
  let remote;
  try {
    const r = await fetch(source, { headers: { Accept: 'application/json' }, cf: { cacheTtl: 0 } });
    remote = await r.json();
  } catch {
    return json({ ok: false, error: 'source' }, 502);
  }
  const src = remote && isArr(remote.payload) ? remote.payload : null;
  if (!src) {
    return json({ ok: false, error: 'source' }, 502);
  }

  const store = await readStore(env.DB);
  const local = isArr(store.payload) ? store.payload : {};
  const localOrders = isArr(local.orders) ? toList(local.orders) : [];
  const srcOrders = isArr(src.orders) ? toList(src.orders) : [];

  const seen = new Set();
  const merged = [];
  for (const o of [...localOrders, ...srcOrders]) {
    const id = isArr(o) ? o.id : undefined;
    if (id === undefined || seen.has(id)) continue;
    seen.add(id);
    merged.push(o);
  }
  const ts = (o) => {
    const v = o.timestamp ?? o.createdAt ?? o.time ?? 0;
    const n = typeof v === 'number' ? v : Date.parse(v);
    return Number.isFinite(n) ? n : 0;
  };
  merged.sort((a, b) => ts(b) - ts(a));

  const next = {
    products: isArr(src.products) ? src.products : [],
    services: isArr(src.services) ? src.services : [],
    settings: isArr(src.settings) ? src.settings : {},
    coupons: isArr(src.coupons) ? src.coupons : [],
    orders: merged.slice(0, 200),
  };
  for (const [k, v] of Object.entries(src)) {
    if (!(k in next) && k !== 'updatedAt') next[k] = v;
  }
  await writeStore(env.DB, next);
  return json({
    ok: true,
    products: toList(next.products).length,
    orders: next.orders.length,
    updatedAt: next.updatedAt,
  });
}

async function catalogApi(request, env) {
  const method = request.method;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: API_HEADERS });
  }

  if (!env.DB) {
    return json({ ok: false, error: 'write' }, 500);
  }

  if (method === 'GET') {
    const store = await readStore(env.DB);
    return json(store);
  }

  if (method !== 'POST') {
    return json({ ok: false, error: 'method' }, 405);
  }

  let data;
  try {
    data = JSON.parse(await request.text());
  } catch {
    data = null;
  }
  if (!isArr(data)) {
    return json({ ok: false, error: 'json' }, 400);
  }

  const action = data.action ?? 'save-catalog';

  // Migration only: copy the catalog from the old Hostinger API.
  // Active only while env.SEED_SOURCE is set; remove the variable after cutover.
  if (action === 'sync-from-source') {
    return syncFromSource(env);
  }

  const store = await readStore(env.DB);
  const current = isArr(store.payload)
    ? store.payload
    : { products: [], services: [], settings: {}, coupons: [], orders: [] };

  if (action === 'add-order') {
    const order = data.order ?? null;
    if (!isArr(order) || !order.id) {
      return json({ ok: false, error: 'order' }, 400);
    }
    let orders = isArr(current.orders) ? toList(current.orders) : [];
    orders = orders.filter((item) => (isArr(item) ? item.id ?? '' : '') !== (order.id ?? ''));
    orders.unshift(order);
    current.orders = orders.slice(0, 200);
    try {
      await writeStore(env.DB, current);
    } catch {
      return json({ ok: false, error: 'write' }, 500);
    }
    return json({ ok: true, updatedAt: current.updatedAt });
  }

  const pin = data.pin ?? request.headers.get('X-Admin-Pin') ?? '';
  if (!validPin(pin, env)) {
    return json({ ok: false, error: 'pin' }, 401);
  }

  const payload = data.payload ?? null;
  if (!isArr(payload)) {
    return json({ ok: false, error: 'payload' }, 400);
  }

  const next = {
    products: isArr(payload.products) ? payload.products : current.products ?? [],
    services: isArr(payload.services) ? payload.services : current.services ?? [],
    settings: isArr(payload.settings) ? payload.settings : current.settings ?? {},
    coupons: isArr(payload.coupons) ? payload.coupons : current.coupons ?? [],
    orders: isArr(payload.orders) ? payload.orders : current.orders ?? [],
  };

  try {
    await writeStore(env.DB, next);
  } catch {
    return json({ ok: false, error: 'write' }, 500);
  }
  return json({ ok: true, updatedAt: next.updatedAt });
}
