import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import { SERVICES as DEFAULT_SERVICES } from '../data/services';
import confetti from 'canvas-confetti';

const StoreContext = createContext();

export const DEFAULT_SETTINGS = {
  phone: '01140087799',
  whatsapp: '201140087799',
  emergencyPhone: '01140087799',
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

  // Dynamic Products state (synced with localStorage)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('turbocool_products');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
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

  // Store Settings (phone, whatsapp, texts)
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('turbocool_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
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
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('turbocool_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Comparison state (IDs)
  const [comparisonList, setComparisonList] = useState(() => {
    try {
      const saved = localStorage.getItem('turbocool_compare');
      return saved ? JSON.parse(saved) : [];
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
    };
    setProducts(prev => [product, ...prev]);
    showToast(`تمت إضافة منتج "${product.name}" بنجاح إلى المتجر! 🎉`);
    return product;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    showToast('تم حفظ التعديلات على المنتج بنجاح! 💾');
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('تم حذف المنتج بنجاح من المتجر', 'info');
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
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#006bc9', '#00A3FF', '#38bdf8']
      });
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
