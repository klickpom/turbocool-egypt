const CATALOG_URL = './api/catalog.php';
const CHANNEL_NAME = 'turbocool-live-catalog';
const PIN_KEY = 'turbocool_admin_pin';

export const getAdminPin = () => {
  try {
    return localStorage.getItem(PIN_KEY) || '';
  } catch {
    return '';
  }
};

export const setAdminPin = (pin) => {
  try {
    if (pin) localStorage.setItem(PIN_KEY, String(pin).trim());
  } catch {
    // ignore
  }
};

const parseJson = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export async function fetchRemoteCatalog() {
  try {
    const res = await fetch(`${CATALOG_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await parseJson(res);
    return data?.payload || null;
  } catch {
    return null;
  }
}

export async function publishRemoteCatalog(payload) {
  const pin = getAdminPin() || 'turbo2026';
  const res = await fetch(CATALOG_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pin,
      action: 'save-catalog',
      payload,
    }),
  });
  const data = await parseJson(res);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || 'publish-failed');
  }
  return data;
}

export async function publishRemoteOrder(order) {
  const res = await fetch(CATALOG_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'add-order',
      order,
    }),
  });
  const data = await parseJson(res);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || 'order-failed');
  }
  return data;
}

export function openCatalogChannel(onMessage) {
  if (typeof BroadcastChannel === 'undefined') {
    return { post() {}, close() {} };
  }
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.onmessage = (event) => {
    if (event?.data) onMessage(event.data);
  };
  return {
    post: (data) => channel.postMessage(data),
    close: () => channel.close(),
  };
}
