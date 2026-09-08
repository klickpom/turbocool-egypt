export const META_PIXEL_ID = '2607098443095837';

export const normalizePixelId = (value) => String(value || '').replace(/\D/g, '');

const productPayload = (product, extra = {}) => ({
  content_name: product?.name,
  content_ids: [String(product?.id || product?.modelCode || '')],
  content_type: 'product',
  value: Number(product?.price) || 0,
  currency: 'EGP',
  ...extra,
});

export function initMetaPixel(pixelId) {
  const id = normalizePixelId(pixelId);
  if (!id || typeof window === 'undefined') return false;

  if (window.fbq) {
    if (window.__tcPixelId && window.__tcPixelId !== id) window.fbq('init', id);
    window.__tcPixelId = id;
    return true;
  }

  const fbq = function () {
    fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  window.fbq('init', id);
  window.__tcPixelId = id;
  return true;
}

export function trackMeta(event, params) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', event, params);
}

export function trackMetaProduct(event, product, extra) {
  if (!product) return;
  trackMeta(event, productPayload(product, extra));
}
