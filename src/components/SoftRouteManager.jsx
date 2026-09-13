import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { applyRouteHead } from '../seo/head.js';
import { matchRoute } from '../seo/routes.js';

export const SoftRouteManager = () => {
  const { setActiveTab, setSelectedBrand, currentView } = useStore();

  useEffect(() => {
    if (currentView === 'admin') return undefined;

    const applyFromLocation = (shouldScroll) => {
      const path = window.location.pathname;
      if (path.includes('/admin')) return;
      const route = matchRoute(path);
      applyRouteHead(path);
      setActiveTab(route.tab);
      const brand = new URLSearchParams(window.location.search).get('brand');
      if (brand) setSelectedBrand(brand);
      if (!shouldScroll) return;
      const go = () => {
        if (route.path === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        document.getElementById(route.sectionId)?.scrollIntoView({ behavior: 'smooth' });
      };
      requestAnimationFrame(go);
      window.setTimeout(go, 400);
    };

    applyFromLocation(true);

    const onPop = () => applyFromLocation(true);
    const onSoft = (event) => {
      if (event.detail?.tab) setActiveTab(event.detail.tab);
      if (event.detail?.brand) setSelectedBrand(event.detail.brand);
    };

    window.addEventListener('popstate', onPop);
    window.addEventListener('tc:soft-route', onSoft);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('tc:soft-route', onSoft);
    };
  }, [currentView, setActiveTab, setSelectedBrand]);

  return null;
};
