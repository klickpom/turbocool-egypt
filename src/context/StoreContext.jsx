import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import { SERVICES as DEFAULT_SERVICES } from '../data/services';
import confetti from 'canvas-confetti';
import {
  fetchRemoteCatalog,
  publishRemoteCatalog,
  publishRemoteOrder,
  openCatalogChannel,
} from '../lib/catalogApi';

const StoreContext = createContext();

export const CATALOG_VERSION = 6;

const DUMMY_CATALOG_IDS = new Set([
  'sharp-1.5-inv-ch',
  'carrier-1.5-optimax-cool',
  'carrier-2.25-inv-ch',
  'lg-1.5-dual-inv-ch',
  'fresh-1.5-smart-cool',
  'fresh-2.25-inv-ch',
  'sharp-3.0-inv-ch',
  'midea-1.5-mission-pro',
  'gree-2.25-pular-ch',
  'tornado-1.5-cool',
  'carrier-3.0-optimax-ch',
  'carrier-5.0-concealed',
]);

const hasPlaceholderImage = (product) => {
  const urls = [product?.image, ...(product?.images || [])].filter(Boolean).join(' ');
  return /unsplash\.com|picsum\.photos|placehold/i.test(urls);
};

const isRemovedCatalogItem = (product) => {
  if (!product?.id) return true;
  return DUMMY_CATALOG_IDS.has(product.id) || hasPlaceholderImage(product);
};

const OLD_CONTACT_DIGITS = new Set([
  '01140087799',
  '1140087799',
  '201140087799',
  '201000000000',
  '10000000000',
]);

const isStaleContact = (value) => {
  const digits = String(value || '').replace(/[^0-9]/g, '');
  return !digits || OLD_CONTACT_DIGITS.has(digits);
};

const PRODUCT_PATCHES = {
  'midea-xtreme-pro-inv-1.5-heat': {
    modelCode: 'M1SEFT-12HRDN8F-Q8',
    name: 'تكييف ميديا 1.5 حصان إنفرتر ذكي AI ECOMASTER بارد ساخن Miraco Midea',
    type: 'inverter-cool-heat',
    typeName: 'إنفرتر بارد / ساخن',
    energyClass: 'S4 إنفرتر ذكي بارد ساخن',
  },
  'carrier-xcool-2.25-cool': {
    modelCode: '53KHEFT18N8-708F',
  },
};

const pickCommercialFields = (edited, official) => {
  if (!edited) return official;
  const patch = PRODUCT_PATCHES[official.id] || {};
  const useCustomPhoto = edited.image && !hasPlaceholderImage(edited);
  return {
    ...official,
    ...patch,
    name: edited.name || official.name,
    price: Number(edited.price) || official.price,
    oldPrice: Number(edited.oldPrice) || official.oldPrice,
    discount: edited.discount ?? official.discount,
    inStock: edited.inStock !== false,
    bestseller: edited.bestseller ?? official.bestseller,
    featured: edited.featured ?? official.featured,
    warranty: edited.warranty || official.warranty,
    features: Array.isArray(edited.features) && edited.features.length ? edited.features : official.features,
    image: useCustomPhoto ? edited.image : official.image,
    images: useCustomPhoto && Array.isArray(edited.images) && edited.images.length
      ? edited.images
      : official.images,
  };
};

const hydrateProducts = (saved) => {
  if (!Array.isArray(saved) || saved.length === 0) return DEFAULT_PRODUCTS;

  const savedById = new Map(
    saved.filter((product) => product?.id).map((product) => [product.id, product])
  );

  const official = DEFAULT_PRODUCTS.map((product) =>
    pickCommercialFields(savedById.get(product.id), product)
  );

  const custom = saved.filter((product) => {
    if (isRemovedCatalogItem(product)) return false;
    if (DEFAULT_PRODUCTS.some((item) => item.id === product.id)) return false;
    return true;
  });

  return custom.length > 0 ? [...custom, ...official] : official;
};

const hydrateSettings = (saved) => {
  const merged = { ...DEFAULT_SETTINGS, ...(saved || {}) };
  if (isStaleContact(merged.phone) || isStaleContact(merged.whatsapp) || isStaleContact(merged.emergencyPhone) || !merged.salesPhone) {
    return {
      ...merged,
      phone: DEFAULT_SETTINGS.phone,
      whatsapp: DEFAULT_SETTINGS.whatsapp,
      salesPhone: DEFAULT_SETTINGS.salesPhone,
      emergencyPhone: DEFAULT_SETTINGS.emergencyPhone,
    };
  }
  return merged;
};

export const DEFAULT_SETTINGS = {
  salesPhone: '01097640898', // رقم السيلز المباشر
  whatsapp: '201097640898',   // رقم السيلز والواتساب
  phone: '01006836537',      // رقم الاتصال المباشر
  emergencyPhone: '01023499515', // رقم الطوارئ 24/7
  topBanner: 'تستحق الانتعاش! توريد وتركيب فوري خلال 24 ساعة + معاينة مجانية بالجيزة والقاهرة!',
  companyName: 'تربو كوول للتكييف والتبريد',
  slogan: 'عيش في نقاء وانتعاش مع تربو كوول',
  facebookUrl: 'https://www.facebook.com/share/1HKQUrdqZT/',
  workingHours: 'يومياً من 9:00 ص حتى 11:00 م (خدمة الطوارئ 24/7)',
  coverageAreas: 'الجيزة، القاهرة الكبرى، 6 أكتوبر، زايد، التجمع',
};

export const DEFAULT_COUPONS = [
  { code: 'TURBO500', discount: 500, type: 'fixed', minOrder: 15000, label: 'خصم 500 ج.م بمناسبة الصيف' },
  { code: 'VIP1000', discount: 1000, type: 'fixed', minOrder: 30000, label: 'خصم VIP بقيمة 1000 ج.م' },
  { code: 'SUMMER5', discount: 5, type: 'percent', minOrder: 10000, label: 'خصم 5% على التكييفات المختارة' },
];

export const StoreProvider = ({ children }) => {
  // Current view: 'store' or 'admin'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('/admin') || hash === '#admin' || hash === '#/admin') {
        return 'admin';
      }
    }
    return 'store';
  });

  // Dynamic Products state (synced with localStorage & auto-merging new models)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('turbocool_products');
      if (saved) {
        const merged = hydrateProducts(JSON.parse(saved));
        localStorage.setItem('turbocool_products', JSON.stringify(merged));
        localStorage.setItem('turbocool_catalog_version', String(CATALOG_VERSION));
        return merged;
      }
      return DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // Dynamic Services state (synced with localStorage)
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('turbocool_services');
      return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  });

  // Store Settings (phone, whatsapp, texts - auto-migrated to new official numbers)
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('turbocool_settings');
      if (saved) {
        const updated = hydrateSettings(JSON.parse(saved));
        localStorage.setItem('turbocool_settings', JSON.stringify(updated));
        return updated;
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Coupons
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('turbocool_coupons');
      return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
    } catch {
      return DEFAULT_COUPONS;
    }
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('turbocool_cart');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((item) => !isRemovedCatalogItem(item)) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('turbocool_wishlist');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((item) => !isRemovedCatalogItem(item)) : [];
    } catch {
      return [];
    }
  });

  // Comparison state (IDs)
  const [comparisonList, setComparisonList] = useState(() => {
    try {
      const saved = localStorage.getItem('turbocool_compare');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed)
        ? parsed.filter((id) => id && !DUMMY_CATALOG_IDS.has(id))
        : [];
    } catch {
      return [];
    }
  });

  // Orders state (received orders tracked in Admin panel)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('turbocool_orders');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((order) => order?.id && order.id !== 'ORD-708101') : [];
    } catch {
      return [];
    }
  });

  // UI Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [bookingService, setBookingService] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  // Catalog Filters
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedHp, setSelectedHp] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Toast notification
  const [toast, setToast] = useState(null);
  const [syncStatus, setSyncStatus] = useState('local');

  const catalogReadyRef = useRef(false);
  const applyingRemoteRef = useRef(false);
  const publishTimerRef = useRef(null);
  const channelRef = useRef(null);
  const latestCatalogRef = useRef({ products: [], services: [], settings: {}, coupons: [], orders: [] });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('turbocool_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('turbocool_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('turbocool_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem('turbocool_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('turbocool_orders', JSON.stringify(orders));
  }, [orders]);

  // Real-time Cross-tab Live Synchronization Listener
  useEffect(() => {
    const handleStorage = (e) => {
      try {
        if (e.key === 'turbocool_products' && e.newValue) {
          setProducts(hydrateProducts(JSON.parse(e.newValue)));
        }
        if (e.key === 'turbocool_services' && e.newValue) {
          setServices(JSON.parse(e.newValue));
        }
        if (e.key === 'turbocool_settings' && e.newValue) {
          setStoreSettings(JSON.parse(e.newValue));
        }
        if (e.key === 'turbocool_coupons' && e.newValue) {
          setCoupons(JSON.parse(e.newValue));
        }
        if (e.key === 'turbocool_orders' && e.newValue) {
          setOrders(JSON.parse(e.newValue));
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    latestCatalogRef.current = {
      products,
      services,
      settings: storeSettings,
      coupons,
      orders,
      catalogVersion: CATALOG_VERSION,
    };
  }, [products, services, storeSettings, coupons, orders]);

  const isAdminSession = () => {
    try {
      return localStorage.getItem('turbocool_admin_auth') === 'true';
    } catch {
      return false;
    }
  };

  const applyRemotePayload = (payload) => {
    if (!payload) return;
    applyingRemoteRef.current = true;
    if (Array.isArray(payload.products) && payload.products.length) {
      setProducts(hydrateProducts(payload.products));
    }
    if (Array.isArray(payload.services) && payload.services.length) {
      setServices(payload.services);
    }
    if (payload.settings) {
      setStoreSettings(hydrateSettings(payload.settings));
    }
    if (Array.isArray(payload.coupons) && payload.coupons.length) {
      setCoupons(payload.coupons);
    }
    if (Array.isArray(payload.orders)) {
      setOrders((prev) => {
        const map = new Map();
        [...payload.orders, ...prev].forEach((order) => {
          if (order?.id && !map.has(order.id)) map.set(order.id, order);
        });
        return Array.from(map.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      });
    }
    window.setTimeout(() => {
      applyingRemoteRef.current = false;
    }, 50);
  };

  useEffect(() => {
    const channel = openCatalogChannel((message) => {
      if (message?.type === 'catalog' && message.payload) {
        applyRemotePayload(message.payload);
      }
      if (message?.type === 'order' && message.order) {
        setOrders((prev) => (prev.some((item) => item.id === message.order.id) ? prev : [message.order, ...prev]));
      }
    });
    channelRef.current = channel;

    let cancelled = false;
    fetchRemoteCatalog().then((payload) => {
      if (cancelled) return;
      if (payload) {
        applyRemotePayload(payload);
        setSyncStatus('live');
      } else {
        setSyncStatus('local');
      }
      catalogReadyRef.current = true;
    });

    const refreshIfVisible = () => {
      if (document.visibilityState !== 'visible') return;
      fetchRemoteCatalog().then((payload) => {
        if (payload) applyRemotePayload(payload);
      });
    };
    document.addEventListener('visibilitychange', refreshIfVisible);

    return () => {
      cancelled = true;
      channel.close();
      document.removeEventListener('visibilitychange', refreshIfVisible);
    };
  }, []);

  useEffect(() => {
    if (!catalogReadyRef.current || applyingRemoteRef.current || !isAdminSession()) return;
    if (publishTimerRef.current) window.clearTimeout(publishTimerRef.current);
    setSyncStatus('saving');
    publishTimerRef.current = window.setTimeout(async () => {
      const payload = latestCatalogRef.current;
      channelRef.current?.post({ type: 'catalog', payload });
      try {
        await publishRemoteCatalog(payload);
        setSyncStatus('live');
      } catch {
        setSyncStatus('local');
      }
    }, 400);
    return () => {
      if (publishTimerRef.current) window.clearTimeout(publishTimerRef.current);
    };
  }, [products, services, storeSettings, coupons, orders]);

  const publishNow = async () => {
    const payload = latestCatalogRef.current;
    setSyncStatus('saving');
    channelRef.current?.post({ type: 'catalog', payload });
    try {
      await publishRemoteCatalog(payload);
      setSyncStatus('live');
      return true;
    } catch {
      setSyncStatus('local');
      return false;
    }
  };

  useEffect(() => {
    localStorage.setItem('turbocool_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('turbocool_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('turbocool_compare', JSON.stringify(comparisonList));
  }, [comparisonList]);

  // URL Hash Listener for view changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === '#admin' || hash === '#/admin' || path.includes('/admin')) {
        setCurrentView('admin');
      } else if (hash === '' || hash === '#store' || hash === '#home') {
        setCurrentView('store');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const navigateToView = (view) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = '#admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '#store';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // --- ADMIN PRODUCT ACTIONS ---
  const addProduct = (newProductData) => {
    const id = `ac-${Date.now()}`;
    const product = {
      id,
      ...newProductData,
      rating: newProductData.rating || 5.0,
      reviewsCount: newProductData.reviewsCount || 1,
      inStock: newProductData.inStock !== false,
      bestseller: !!newProductData.bestseller,
      energyRating: newProductData.energyRating || 'A+++',
      image: newProductData.image,
      images: newProductData.images?.length
        ? newProductData.images
        : [newProductData.image].filter(Boolean),
    };
    setProducts(prev => [product, ...prev]);
    showToast('ظهر على المتجر فوراً. جاري نشره لكل الزوار...');
    return product;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const next = { ...p, ...updatedFields };
        if (updatedFields.image && !updatedFields.images) {
          next.images = [updatedFields.image, ...(p.images || []).filter((url) => url !== updatedFields.image)].slice(0, 4);
        }
        return next;
      })
    );
    showToast('تم حفظ التعديل وهو ظاهر على المتجر الآن');
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('تم حذف المنتج من المتجر فوراً', 'info');
  };

  // --- ADMIN SERVICE ACTIONS ---
  const addService = (newServiceData) => {
    const id = `srv-${Date.now()}`;
    const service = {
      id,
      ...newServiceData,
      features: newServiceData.features || [],
    };
    setServices(prev => [...prev, service]);
    showToast(`تمت إضافة خدمة "${service.title}" بنجاح! 🔧`);
  };

  const updateService = (id, updatedFields) => {
    setServices(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updatedFields } : s))
    );
    showToast('تم تحديث بيانات الخدمة بنجاح! 💾');
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    showToast('تم حذف الخدمة بنجاح', 'info');
  };

  // --- ADMIN STORE SETTINGS ---
  const updateSettings = (newSettings) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));
    showToast('تم حفظ إعدادات المتجر وبيانات التواصل بنجاح! 🌟');
  };

  // --- ADMIN COUPON ACTIONS ---
  const addCoupon = (coupon) => {
    setCoupons(prev => [coupon, ...prev]);
    showToast(`تم تفعيل كوبون الخصم "${coupon.code}" بنجاح! 🎟️`);
  };

  const deleteCoupon = (code) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    showToast('تم إيقاف وحذف كوبون الخصم', 'info');
  };

  // Reset to initial defaults
  const resetToDefaults = () => {
    setProducts(DEFAULT_PRODUCTS);
    setServices(DEFAULT_SERVICES);
    setStoreSettings(DEFAULT_SETTINGS);
    setCoupons(DEFAULT_COUPONS);
    localStorage.removeItem('turbocool_products');
    localStorage.removeItem('turbocool_services');
    localStorage.removeItem('turbocool_settings');
    localStorage.removeItem('turbocool_coupons');
    showToast('تم استعادة البيانات الافتراضية للكتالوج بنجاح! 🔄');
  };

  // Cart operations
  const addToCart = (product, quantity = 1, openDrawer = true) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    try {
      if (window.matchMedia('(min-width: 768px)').matches) {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#006bc9', '#00A3FF', '#38bdf8']
        });
      }
    } catch {
      // ignore
    }

    showToast(`تمت إضافة "${product.name.slice(0, 30)}..." إلى السلة بنجاح! 🛒`);
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast('تم حذف المنتج من السلة', 'info');
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(`تم إزالة المنتج من المفضلة`, 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(`تم إضافة "${product.name.slice(0, 25)}..." إلى المفضلة ❤️`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Comparison operations
  const toggleCompare = (product) => {
    setComparisonList(prev => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast('تمت الإزالة من المقارنة', 'info');
        return prev.filter(id => id !== product.id);
      } else {
        if (prev.length >= 4) {
          showToast('يمكنك مقارنة 4 أجهزة كحد أقصى', 'warning');
          return prev;
        }
        showToast(`تمت إضافة الجهاز لقائمة المقارنة ⚖️`);
        return [...prev, product.id];
      }
    });
  };

  const isInCompare = (productId) => {
    return comparisonList.includes(productId);
  };

  const clearCompare = () => {
    setComparisonList([]);
  };

  // Direct WhatsApp Checkout
  const handleWhatsAppCheckout = (orderDetails = {}) => {
    if (cart.length === 0) {
      showToast('السلة فارغة حالياً!', 'warning');
      return;
    }

    const customerName = orderDetails.name || 'عميل محترم';
    const customerPhone = orderDetails.phone || 'غير محدد';
    const customerAddress = orderDetails.address || 'القاهرة / الجيزة';
    const notes = orderDetails.notes || 'لا يوجد';
    const coupon = orderDetails.couponCode || 'بدون كوبون';
    const discountAmount = orderDetails.discount || 0;
    const finalTotal = cartTotal - discountAmount;

    // Save order locally for Admin Dashboard tracking
    const orderRecord = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      customerName,
      customerPhone,
      customerAddress,
      notes,
      coupon,
      discountAmount,
      items: [...cart],
      total: finalTotal,
      type: 'سلة مشتريات',
      status: 'جديد 🟢'
    };
    setOrders(prev => [orderRecord, ...prev]);
    channelRef.current?.post({ type: 'order', order: orderRecord });
    publishRemoteOrder(orderRecord).catch(() => {});

    let itemsList = cart.map((item, idx) => 
      `${idx + 1}. *${item.name}*\n   - الموديل: ${item.modelCode || item.id}\n   - القدرة: ${item.hpText}\n   - الكمية: ${item.quantity}\n   - السعر: ${item.price.toLocaleString('ar-EG')} ج.م`
    ).join('\n\n');

    const message = `❄️ *طلب شراء جديد من متجر تربو كوول للتكييف والتبريد* ❄️\n` +
      `----------------------------------------\n` +
      `👤 *بيانات العميل:*\n` +
      `• الاسم: ${customerName}\n` +
      `• الهاتف: ${customerPhone}\n` +
      `• العنوان / المنطقة: ${customerAddress}\n\n` +
      `📦 *المنتجات المطلوبة:*\n` +
      `${itemsList}\n\n` +
      `----------------------------------------\n` +
      `💰 *إجمالي المنتجات:* ${cartTotal.toLocaleString('ar-EG')} ج.م\n` +
      (discountAmount > 0 ? `🎟️ *الخصم (${coupon}):* -${discountAmount.toLocaleString('ar-EG')} ج.م\n` : '') +
      `💵 *المبلغ النهائي المطلوب:* ${finalTotal.toLocaleString('ar-EG')} ج.م\n` +
      `🚚 *الشحن والتركيب:* مجاني / فوري\n` +
      `📝 *ملاحظات:* ${notes}\n` +
      `----------------------------------------\n` +
      `يرجى تأكيد موعد التوصيل والمعاينة الفنية. شكراً لكم!`;

    const encoded = encodeURIComponent(message);
    const targetWhatsapp = storeSettings.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${targetWhatsapp}?text=${encoded}`, '_blank');
  };

  const handleInstantProductOrder = (product) => {
    // Save instant order to state for Admin Dashboard tracking
    const orderRecord = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      customerName: 'طلب شراء فوري',
      customerPhone: 'واتساب مباشر',
      customerAddress: 'القاهرة / الجيزة',
      items: [{ name: product.name, modelCode: product.modelCode, hpText: product.hpText, quantity: 1, price: product.price }],
      total: product.price,
      type: 'طلب فوري',
      status: 'جديد 🟢'
    };
    setOrders(prev => [orderRecord, ...prev]);
    channelRef.current?.post({ type: 'order', order: orderRecord });
    publishRemoteOrder(orderRecord).catch(() => {});

    const message = `❄️ *استفسار وطلب شراء فوري - تربو كوول* ❄️\n` +
      `----------------------------------------\n` +
      `الجهاز: *${product.name}*\n` +
      `الموديل: ${product.modelCode || product.id}\n` +
      `القدرة: ${product.hpText} (${product.typeName || ''})\n` +
      `السعر: *${product.price.toLocaleString('ar-EG')} ج.م*` + (product.oldPrice ? ` (خصم بدلاً من ${product.oldPrice.toLocaleString('ar-EG')} ج.م)` : '') + `\n` +
      `الضمان: ${product.warranty || 'ضمان معتمد'}\n` +
      `----------------------------------------\n` +
      `أرغب في الاستفسار وتأكيد إمكانية التوريد والتركيب في أقرب وقت.`;

    const encoded = encodeURIComponent(message);
    const targetWhatsapp = storeSettings.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${targetWhatsapp}?text=${encoded}`, '_blank');
  };

  const handleServiceBookingSubmit = (service, formDetails) => {
    // Save service booking to orders
    const orderRecord = {
      id: 'SRV-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      customerName: formDetails.name || 'طلب صيانة',
      customerPhone: formDetails.phone || 'غير محدد',
      customerAddress: formDetails.address || 'القاهرة / الجيزة',
      notes: formDetails.notes,
      items: [{ name: `خدمة: ${service.title}`, quantity: 1, price: service.price }],
      total: service.price,
      type: 'حجز صيانة',
      status: 'جديد 🟢'
    };
    setOrders(prev => [orderRecord, ...prev]);
    channelRef.current?.post({ type: 'order', order: orderRecord });
    publishRemoteOrder(orderRecord).catch(() => {});

    const message = `🔧 *حجز خدمة فنية / صيانة - تربو كوول* 🔧\n` +
      `----------------------------------------\n` +
      `الخدمة المطلوبة: *${service.title}*\n` +
      `الاسم: ${formDetails.name}\n` +
      `الهاتف: ${formDetails.phone}\n` +
      `العنوان: ${formDetails.address}\n` +
      `الموعد المفضل: ${formDetails.preferredTime || 'في أقرب وقت'}\n` +
      `عدد الأجهزة / نوع التكييف: ${formDetails.acDetails || 'تكييف سبليت'}\n` +
      `تفاصيل المشكلة / الملاحظات: ${formDetails.notes || 'لا يوجد'}\n` +
      `----------------------------------------\n` +
      `يرجى التواصل لتأكيد حجز الفني وموعد الزيارة.`;

    const encoded = encodeURIComponent(message);
    const targetWhatsapp = storeSettings.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${targetWhatsapp}?text=${encoded}`, '_blank');
    setBookingService(null);
    showToast('تم إرسال طلب الحجز بنجاح! سيتواصل معك الفني فوراً 🚀');
  };

  // Order Management Functions for Admin
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`تم تحديث حالة الطلب (${orderId}) إلى "${newStatus}" بنجاح! 📋`);
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast('تم حذف الطلب بنجاح', 'info');
  };

  const clearOrders = () => {
    setOrders([]);
    showToast('تم مسح سجل الطلبات بالكامل', 'info');
  };

  // Filtered Products
  const filteredProducts = products.filter(product => {
    if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false;
    if (selectedHp !== 'all' && product.hp.toString() !== selectedHp.toString()) return false;
    if (selectedType !== 'all' && product.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (product.name || '').toLowerCase().includes(q);
      const matchBrand = (product.brandName || '').toLowerCase().includes(q);
      const matchCode = (product.modelCode || '').toLowerCase().includes(q);
      const matchHp = (product.hpText || '').toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCode && !matchHp) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
    if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
    return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
  });

  return (
    <StoreContext.Provider
      value={{
        currentView,
        navigateToView,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        services,
        addService,
        updateService,
        deleteService,
        storeSettings,
        updateSettings,
        coupons,
        addCoupon,
        deleteCoupon,
        resetToDefaults,
        publishNow,
        syncStatus,
        orders,
        updateOrderStatus,
        deleteOrder,
        clearOrders,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        comparisonList,
        toggleCompare,
        isInCompare,
        clearCompare,
        isCartOpen,
        setIsCartOpen,
        isCompareOpen,
        setIsCompareOpen,
        quickViewProduct,
        setQuickViewProduct,
        bookingService,
        setBookingService,
        activeTab,
        setActiveTab,
        selectedBrand,
        setSelectedBrand,
        selectedHp,
        setSelectedHp,
        selectedType,
        setSelectedType,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        filteredProducts,
        handleWhatsAppCheckout,
        handleInstantProductOrder,
        handleServiceBookingSubmit,
        showToast,
      }}
    >
      {children}

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 z-50 transition-all duration-300 transform scale-100 max-w-md w-[90%] md:w-auto">
          <div className={`px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border text-sm font-semibold text-white ${
            toast.type === 'warning' ? 'bg-amber-600/95 border-amber-400/30' :
            toast.type === 'info' ? 'bg-slate-800/95 border-slate-700' :
            'bg-brand-700/95 border-brand-400/30 shadow-glow'
          }`}>
            <span className="text-xl">
              {toast.type === 'warning' ? '⚠️' : toast.type === 'info' ? 'ℹ️' : '❄️'}
            </span>
            <p className="leading-snug">{toast.message}</p>
          </div>
        </div>
      )}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
