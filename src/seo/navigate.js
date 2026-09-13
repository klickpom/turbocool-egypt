import { applyRouteHead } from './head.js';
import { matchRoute, SECTION_TO_PATH } from './routes.js';

export function pathForSection(sectionId) {
  return SECTION_TO_PATH[sectionId] || '/';
}

export function navigateSoft(path, { tab, sectionId, brand } = {}) {
  if (typeof window === 'undefined') return;
  const route = matchRoute(path);
  const targetPath = route.path;
  const url = new URL(window.location.origin + targetPath);
  if (brand && brand !== 'all') url.searchParams.set('brand', brand);
  const next = `${url.pathname}${url.search}`;
  const current = `${window.location.pathname}${window.location.search}`;
  if (current !== next) {
    window.history.pushState({ seoPath: next }, '', next);
  }
  applyRouteHead(url.pathname);
  window.dispatchEvent(
    new CustomEvent('tc:soft-route', {
      detail: {
        path: targetPath,
        tab: tab || route.tab,
        sectionId: sectionId || route.sectionId,
        brand,
      },
    })
  );
  const id = sectionId || route.sectionId;
  const scroll = () => {
    if (!id || targetPath === '/') {
      if (targetPath === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  requestAnimationFrame(scroll);
  window.setTimeout(scroll, 350);
}
