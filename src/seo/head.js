import { SITE_ORIGIN, SITE_NAME_AR } from './config.js';
import { canonicalFor, matchRoute } from './routes.js';

const setMeta = (selector, attr, value) => {
  const el = document.querySelector(selector);
  if (el && value) el.setAttribute(attr, value);
};

export function applyRouteHead(pathname = window.location.pathname) {
  if (typeof document === 'undefined') return;
  const route = matchRoute(pathname);
  const canonical = canonicalFor(pathname);
  document.title = route.title;
  setMeta('meta[name="description"]', 'content', route.description);
  setMeta('link[rel="canonical"]', 'href', canonical);
  setMeta('meta[property="og:title"]', 'content', route.title);
  setMeta('meta[property="og:description"]', 'content', route.description);
  setMeta('meta[property="og:url"]', 'content', canonical);
  setMeta('meta[property="og:site_name"]', 'content', SITE_NAME_AR);
  setMeta('meta[name="twitter:title"]', 'content', route.title);
  setMeta('meta[name="twitter:description"]', 'content', route.description);
  const ogImage = `${SITE_ORIGIN}/logo.jpg`;
  setMeta('meta[property="og:image"]', 'content', ogImage);
  setMeta('meta[name="twitter:image"]', 'content', ogImage);
}
