import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { initMetaPixel, trackMeta, trackMetaProduct } from '../lib/metaPixel';

export const MetaPixel = () => {
  const { storeSettings, currentView, quickViewProduct, searchQuery } = useStore();
  const pixelId = storeSettings?.metaPixelId;

  useEffect(() => {
    initMetaPixel(pixelId);
  }, [pixelId]);

  useEffect(() => {
    if (!pixelId) return;
    trackMeta('PageView');
  }, [currentView, pixelId]);

  useEffect(() => {
    if (!pixelId || !quickViewProduct) return;
    trackMetaProduct('ViewContent', quickViewProduct);
  }, [pixelId, quickViewProduct?.id]);

  useEffect(() => {
    const q = String(searchQuery || '').trim();
    if (!pixelId || q.length < 2) return;
    const timer = setTimeout(() => trackMeta('Search', { search_string: q }), 600);
    return () => clearTimeout(timer);
  }, [pixelId, searchQuery]);

  return null;
};
