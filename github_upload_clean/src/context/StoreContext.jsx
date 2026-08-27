import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import confetti from 'canvas-confetti';

const StoreContext = createContext();

export const COMPANY_PHONE = '+201140087799'; // Turbo Cool Sales & Support Phone (placeholder or configurable)
export const COMPANY_WHATSAPP = '201000000000'; // Egypt format without +

export const StoreProvider = ({ children }) => {
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
  const [activeTab, setActiveTab] = useState('home'); // home, catalog, calculator, services, about, contact

  // Catalog Filters
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedHp, setSelectedHp] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // popular, price-asc, price-desc, discount

  // Toast notification
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('turbocool_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('turbocool_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('turbocool_compare', JSON.stringify(comparisonList));
  }, [comparisonList]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
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
    } catch (e) {
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
      `${idx + 1}. *${item.name}*\n   - الموديل: ${item.modelCode}\n   - القدرة: ${item.hpText}\n   - الكمية: ${item.quantity}\n   - السعر: ${item.price.toLocaleString('ar-EG')} ج.م`
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
    window.open(`https://wa.me/${COMPANY_WHATSAPP}?text=${encoded}`, '_blank');
  };

  const handleInstantProductOrder = (product) => {
    const message = `❄️ *استفسار وطلب شراء فوري - تربو كوول* ❄️\n` +
      `----------------------------------------\n` +
      `الجهاز: *${product.name}*\n` +
      `الموديل: ${product.modelCode}\n` +
      `القدرة: ${product.hpText} (${product.typeName})\n` +
      `السعر: *${product.price.toLocaleString('ar-EG')} ج.م* (خصم ${product.discount}% بدلاً من ${product.oldPrice.toLocaleString('ar-EG')} ج.م)\n` +
      `الضمان: ${product.warranty}\n` +
      `----------------------------------------\n` +
      `أرغب في الاستفسار وتأكيد إمكانية التوريد والتركيب في أقرب وقت.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${COMPANY_WHATSAPP}?text=${encoded}`, '_blank');
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
    window.open(`https://wa.me/${COMPANY_WHATSAPP}?text=${encoded}`, '_blank');
    setBookingService(null);
    showToast('تم إرسال طلب الحجز بنجاح! سيتواصل معك الفني فوراً 🚀');
  };

  // Filtered Products
  const filteredProducts = PRODUCTS.filter(product => {
    // Brand filter
    if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false;
    // HP filter
    if (selectedHp !== 'all' && product.hp.toString() !== selectedHp.toString()) return false;
    // Type filter
    if (selectedType !== 'all' && product.type !== selectedType) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brandName.toLowerCase().includes(q);
      const matchCode = product.modelCode.toLowerCase().includes(q);
      const matchHp = product.hpText.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCode && !matchHp) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'discount') return b.discount - a.discount;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
  });

  return (
    <StoreContext.Provider
      value={{
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
