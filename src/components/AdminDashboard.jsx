import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { BRANDS, TYPES, PRODUCTS as FACTORY_PRODUCTS } from '../data/products';
import { compressImageFile } from '../lib/imageCompress';
import { setAdminPin } from '../lib/catalogApi';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  LayoutDashboard,
  Package,
  Wrench,
  Tag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Save,
  RotateCcw,
  Search,
  Lock,
  Unlock,
  Phone,
  MessageCircle,
  DollarSign,
  TrendingUp,
  Percent,
  Sparkles,
  Eye,
  ArrowRight,
  ShieldCheck,
  Zap,
  Flame,
  Check,
  Upload,
  Camera,
  Layers,
  ChevronRight,
  AlertCircle,
  ShoppingBag,
  User,
  MapPin
} from 'lucide-react';

const PRESET_AC_IMAGES = FACTORY_PRODUCTS.flatMap((product) => {
  const urls = product.images?.length ? product.images : [product.image];
  return urls.filter(Boolean).slice(0, 1).map((url) => ({
    label: `${product.brandName.split(' - ')[0]} ${product.hpText}`,
    url,
  }));
}).slice(0, 12);

const AVAILABLE_TAGS = [
  'توفير كهرباء 60% (إنفرتر)',
  'فلتر بلازما منقي للبكتيريا',
  'تبريد نفاث فائق السرعة Turbo',
  'شاشة ديجيتال LED مخفية',
  'ضمان 5 سنوات شامل من الوكيل',
  'توزيع هواء 4 اتجاهات 3D',
  'خاصية التتبع Follow Me',
  'فريون R410A فائق النقاء',
  'تشغيل هادئ بدون صوت Sleep Mode',
  'حماية ضد الصدأ والتآكل Golden Fin'
];

export const AdminDashboard = () => {
  const {
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
    orders = [],
    updateOrderStatus,
    deleteOrder,
    clearOrders,
    navigateToView,
    showToast,
    syncStatus = 'local',
    publishNow,
  } = useStore();

  const fileInputRef = useRef(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('turbocool_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'services', 'coupons', 'settings'

  // Product Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');

  // Product Edit / Add Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [productForm, setProductForm] = useState({
    name: '',
    brand: 'carrier',
    brandName: 'كاريير',
    modelCode: '',
    hp: 1.5,
    hpText: '1.5 حصان',
    type: 'cool-inverter',
    typeName: 'بارد / إنفرتر موفر للطاقة',
    price: 24500,
    oldPrice: 27000,
    discount: 9,
    warranty: 'ضمان 5 سنوات شامل من الوكيل',
    image: PRESET_AC_IMAGES[0].url,
    features: ['توفير كهرباء 60% (إنفرتر)', 'تبريد نفاث فائق السرعة Turbo', 'فلتر بلازما منقي للبكتيريا'],
    bestseller: true,
    inStock: true,
    energyRating: 'A+++'
  });

  // Service Edit Modal
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    price: '',
    description: '',
    badge: 'خدمة معتمدة',
    features: []
  });

  // Coupon Form
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount: 500,
    type: 'fixed',
    minOrder: 10000,
    label: ''
  });

  // Settings Local Form
  const [settingsForm, setSettingsForm] = useState(storeSettings);

  useEffect(() => {
    setSettingsForm(storeSettings);
  }, [storeSettings]);

  // Handle PIN Login
  const handlePinSubmit = (e) => {
    e?.preventDefault();
    if (pinInput === '1234' || pinInput.toLowerCase() === 'turbo2026' || pinInput.toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('turbocool_admin_auth', 'true');
      setAdminPin(pinInput);
      setPinError(false);
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch {}
      showToast('أهلاً بك في لوحة تحكم تربو كوول. التعديلات تظهر على المتجر فوراً');
      publishNow?.();
    } else {
      setPinError(true);
      showToast('رمز الدخول غير صحيح', 'warning');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('turbocool_admin_auth');
    showToast('تم تسجيل الخروج من لوحة الإدارة', 'info');
  };

  // Handle Direct Image File Upload
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('حجم الصورة كبير جداً، اختار صورة أقل من 8 ميجا', 'warning');
      return;
    }

    try {
      const compressed = await compressImageFile(file);
      setImagePreview(compressed);
      setProductForm((prev) => ({ ...prev, image: compressed }));
      showToast('تم تجهيز الصورة وهتظهر على كارت المتجر فوراً بعد الحفظ');
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result;
        if (base64Url) {
          setImagePreview(base64Url);
          setProductForm((prev) => ({ ...prev, image: base64Url }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle Feature Tag
  const toggleFeatureTag = (tag) => {
    setProductForm(prev => {
      const exists = prev.features?.includes(tag);
      const updated = exists
        ? prev.features.filter(t => t !== tag)
        : [...(prev.features || []), tag];
      return { ...prev, features: updated };
    });
  };

  // Open Product Modal
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({ ...product });
      setImagePreview(product.image || '');
    } else {
      setEditingProduct(null);
      const defaultImg = FACTORY_PRODUCTS[0]?.image || '';
      setProductForm({
        name: '',
        brand: 'carrier',
        brandName: 'كاريير',
        modelCode: `TC-${Math.floor(1000 + Math.random() * 9000)}`,
        hp: 1.5,
        hpText: '1.5 حصان',
        type: 'cool-only',
        typeName: 'بارد فقط عادي',
        price: 23500,
        oldPrice: 26000,
        discount: 10,
        warranty: 'ضمان 5 سنوات معتمد من ميراكو',
        image: FACTORY_PRODUCTS[0]?.image || '',
        features: ['توفير كهرباء 60% (إنفرتر)', 'تبريد نفاث فائق السرعة Turbo', 'فلتر بلازما منقي للبكتيريا'],
        bestseller: false,
        inStock: true,
        energyRating: 'A+++'
      });
      setImagePreview(defaultImg);
    }
    setIsProductModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast('يرجى كتابة اسم التكييف والسعر', 'warning');
      return;
    }

    const brandNamesMap = {
      carrier: 'كاريير - Carrier',
      sharp: 'شارب - Sharp',
      lg: 'إل جي - LG',
      fresh: 'فريش - Fresh',
      midea: 'ميديا - Midea',
      gree: 'جري - Gree',
      tornado: 'تورنيدو - Tornado'
    };

    const typeMeta = TYPES.find((item) => item.id === productForm.type);

    const calculatedDiscount = productForm.oldPrice > productForm.price 
      ? Math.round(((productForm.oldPrice - productForm.price) / productForm.oldPrice) * 100)
      : 0;

    const nextImage = imagePreview || productForm.image;
    const updatedData = {
      ...productForm,
      brandName: brandNamesMap[productForm.brand] || productForm.brand,
      typeName: typeMeta?.name || productForm.typeName,
      price: Number(productForm.price),
      oldPrice: Number(productForm.oldPrice || productForm.price),
      discount: calculatedDiscount,
      image: nextImage,
      images: [nextImage, ...(productForm.images || []).filter((url) => url && url !== nextImage)].slice(0, 4),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, updatedData);
    } else {
      addProduct(updatedData);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      } catch {}
    }
    setIsProductModalOpen(false);
    publishNow?.();
  };

  // Open Service Modal
  const handleOpenServiceModal = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      price: service.price,
      description: service.description,
      badge: service.badge || 'خدمة معتمدة',
      features: service.features ? [...service.features] : []
    });
    setIsServiceModalOpen(true);
  };

  // Save Service
  const handleSaveService = (e) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.price) {
      showToast('يرجى ملء اسم الخدمة والسعر', 'warning');
      return;
    }

    updateService(editingService.id, serviceForm);
    setIsServiceModalOpen(false);
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  // Add Coupon
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discount) {
      showToast('يرجى كتابة كود الكوبون وقيمة الخصم', 'warning');
      return;
    }
    addCoupon({
      ...couponForm,
      code: couponForm.code.toUpperCase().trim(),
      discount: Number(couponForm.discount),
      minOrder: Number(couponForm.minOrder || 0),
      label: couponForm.label || `خصم ${couponForm.discount} ج.م`
    });
    setCouponForm({ code: '', discount: 500, type: 'fixed', minOrder: 10000, label: '' });
  };

  // Filtered products in Admin
  const adminFilteredProducts = products.filter(p => {
    if (filterBrand !== 'all' && p.brand !== filterBrand) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.brandName || '').toLowerCase().includes(q) ||
        (p.modelCode || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate KPIs
  const totalProductsCount = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
  const bestsellersCount = products.filter(p => p.bestseller).length;
  const totalServicesCount = services.length;

  // --- PIN LOCK VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-cairo" dir="rtl">
        <div className="absolute w-72 sm:w-[500px] h-72 sm:h-[500px] rounded-full bg-brand-500/20 blur-[100px] pointer-events-none" />
        <div className="absolute w-60 sm:w-[400px] h-60 sm:h-[400px] rounded-full bg-sky-500/15 blur-[90px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative max-w-sm sm:max-w-md w-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-5"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 via-sky-500 to-teal-400 p-0.5 shadow-xl shadow-brand-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Lock className="w-8 h-8 sm:w-9 sm:h-9 text-sky-400" />
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">لوحة تحكم تربو كوول</h2>
            <p className="text-xs text-slate-400 mt-1">تعديل الأسعار والمنتجات وإدارتها من الموبايل</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={10}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="رمز الدخول"
                autoFocus
                className={`w-full text-center tracking-widest text-lg font-bold py-3 px-4 rounded-2xl bg-slate-800/90 border text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner ${
                  pinError ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/20' : 'border-slate-700 focus:border-sky-400'
                }`}
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-1.5 font-semibold">رمز المرور غير صحيح</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-sky-500 to-teal-500 text-white font-bold text-sm shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Unlock className="w-4 h-4" />
              <span>دخول للوحة الإدارة</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => navigateToView('store')}
              className="hover:text-sky-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للمتجر</span>
            </button>
            <span className="text-slate-500">تربو كوول</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- MAIN ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-cairo flex flex-col selection:bg-brand-500 selection:text-white" dir="rtl">
      
      {/* Top Admin Header (Mobile & Desktop Optimized) */}
      <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800/90 backdrop-blur-xl px-3 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-brand-500 to-sky-400 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-slate-900 rounded-[10px] sm:rounded-[14px] flex items-center justify-center font-black text-sky-400 text-sm sm:text-lg">
              TC
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-base font-black text-white leading-none">لوحة تحكم تربو كوول</h1>
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full border text-[9px] sm:text-[10px] font-bold ${
                syncStatus === 'live'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : syncStatus === 'saving'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
              }`}>
                {syncStatus === 'live' ? 'منشور للزوار' : syncStatus === 'saving' ? 'جاري النشر' : 'متصل محلياً'}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 hidden sm:block">أي تعديل بيتسجل على واجهة المتجر في نفس اللحظة</p>
          </div>
        </div>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => navigateToView('store')}
            className="py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-brand-600 via-sky-500 to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-glow hover:shadow-glow-lg transition-all cursor-pointer active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>معاينة المتجر</span>
          </button>

          <button
            onClick={handleLogout}
            title="تسجيل الخروج"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar / Mobile Scrollable Tab Bar */}
        <aside className="w-full md:w-64 bg-slate-900/80 border-b md:border-b-0 md:border-l border-slate-800/80 p-2 sm:p-4 shrink-0">
          <div className="flex items-center md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-glow'
                  : 'text-slate-300 bg-slate-800/60 md:bg-transparent hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">التكييفات</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900/80 text-sky-300 font-mono font-bold mr-auto hidden md:inline">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-glow'
                  : 'text-slate-300 bg-slate-800/60 md:bg-transparent hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="whitespace-nowrap">الطلبات الواردة</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold mr-auto">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-glow'
                  : 'text-slate-300 bg-slate-800/60 md:bg-transparent hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">خدمات الصيانة</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${
                activeTab === 'coupons'
                  ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-glow'
                  : 'text-slate-300 bg-slate-800/60 md:bg-transparent hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">الكوبونات</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-glow'
                  : 'text-slate-300 bg-slate-800/60 md:bg-transparent hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">الإعدادات والأرقام</span>
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 hidden md:block">
            <button
              onClick={resetToDefaults}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-amber-400 text-xs font-semibold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة الافتراضي</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl overflow-x-hidden">
          
          {/* ================= TAB 1: PRODUCTS MANAGEMENT ================= */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-xs text-sky-100">
                السعر والصورة والتوفر بيتحدثوا على كتالوج المتجر فوراً. بعد الحفظ بيتنشروا لكل الزوار على الموقع الحي.
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
                  <div className="text-[10px] text-slate-400">الأجهزة المعروضة</div>
                  <div className="text-lg font-black text-white">{totalProductsCount}</div>
                </div>
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
                  <div className="text-[10px] text-slate-400">متوفر للتوريد</div>
                  <div className="text-lg font-black text-emerald-400">{inStockCount}</div>
                </div>
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
                  <div className="text-[10px] text-slate-400">الأكثر طلباً</div>
                  <div className="text-lg font-black text-amber-400">{bestsellersCount}</div>
                </div>
              </div>
              
              {/* Add Button & Search Row */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 shadow-lg">
                
                {/* Big Primary Add Button */}
                <button
                  onClick={() => handleOpenProductModal()}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all cursor-pointer active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة جهاز تكييف جديد + رفع صورة</span>
                </button>

                {/* Filter & Search */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ابحث باسم الموديل أو الماركة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <select
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    <option value="all">جميع الماركات ({products.length})</option>
                    {BRANDS.filter((brand) => brand.id !== 'all').map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mobile-Friendly Product Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {adminFilteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md relative"
                  >
                    <div className="space-y-3">
                      
                      {/* Card Header: Image + Details Row (Mobile Optimized) */}
                      <div className="flex items-start gap-3">
                        {/* Thumbnail */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-950 rounded-xl p-1.5 border border-slate-800 shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FACTORY_PRODUCTS[0]?.image || '';
                            }}
                          />
                        </div>

                        {/* Title, Brand, Code */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-brand-900/80 text-sky-300 border border-brand-700/50 text-[10px] font-bold">
                              {product.brandName} • {product.hpText}
                            </span>
                            {product.bestseller && (
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-bold flex items-center gap-0.5">
                                🔥 الأكثر طلباً
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-2 leading-snug">
                            {product.name}
                          </h3>

                          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                            #{product.modelCode || product.id}
                          </span>
                        </div>
                      </div>

                      {/* Pricing & Stock Status Strip */}
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block leading-none mb-1">السعر المعروض:</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-black text-sky-400 font-mono">
                              {product.price?.toLocaleString('ar-EG')} ج.م
                            </span>
                            {product.oldPrice > product.price && (
                              <span className="text-[10px] text-slate-400 line-through font-mono">
                                {product.oldPrice.toLocaleString('ar-EG')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stock Toggle Button */}
                        <button
                          onClick={() => updateProduct(product.id, { inStock: !product.inStock })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            product.inStock
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-red-500/20 text-red-300 border-red-500/40'
                          }`}
                        >
                          {product.inStock ? 'متوفر للتوريد ✓' : 'غير متوفر ✕'}
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenProductModal(product)}
                        className="flex-1 py-2 px-3 rounded-xl bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>تعديل السعر والصورة</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`هل أنت متأكد من حذف ${product.name}؟`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 transition-all cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {adminFilteredProducts.length === 0 && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                  <Package className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-sm font-bold text-white">لا توجد منتجات مطابقة للبحث</p>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: SERVICES & PRICING ================= */}
          {activeTab === 'services' && (
            <div className="space-y-3">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
                <h2 className="text-sm font-bold text-white">أسعار خدمات الصيانة والتركيب</h2>
                <p className="text-[11px] text-slate-400">تعديل تكلفة التركيبات وشحن الفريون والتنظيف</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{service.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-sky-400">
                          {service.badge}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block">السعر للعميل:</span>
                        <p className="text-sm font-black text-sky-400 font-mono">{service.price}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenServiceModal(service)}
                      className="mt-3 py-1.5 px-3 rounded-xl bg-brand-600/30 hover:bg-brand-600 text-sky-300 hover:text-white border border-brand-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>تعديل السعر</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: COUPONS ================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
                <h2 className="text-sm font-bold text-white mb-2">إضافة كوبون خصم جديد</h2>

                <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    placeholder="كود الكوبون (مثال: TURBO500)"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:border-sky-400 focus:outline-none"
                  />

                  <input
                    type="number"
                    placeholder="قيمة الخصم (500 ج.م)"
                    value={couponForm.discount}
                    onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-sky-400 focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>تفعيل الكوبون</span>
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between"
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 font-mono font-bold text-xs">
                        {coupon.code} (-{coupon.discount} ج.م)
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">{coupon.label}</p>
                    </div>

                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: STORE SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 max-w-xl shadow-xl space-y-4">
              <div>
                <h2 className="text-base font-bold text-white">بيانات التواصل والواتساب المعتمدة</h2>
                <p className="text-xs text-slate-400 mt-0.5">تم ضبط وتثبيت أرقامك الرسمية بنجاح</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    🟢 رقم السيلز والواتساب (يستقبل الطلبات فوراً)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value, salesPhone: e.target.value })}
                    placeholder="201097640898"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-emerald-400 mt-0.5 block font-mono">الرقم المعتمد: 01097640898</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      📞 رقم الاتصال المباشر
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      placeholder="01006836537"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-400 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">الرقم المعتمد: 01006836537</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      🚨 خط الطوارئ 24/7
                    </label>
                    <input
                      type="text"
                      value={settingsForm.emergencyPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, emergencyPhone: e.target.value })}
                      placeholder="01023499515"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-400 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">الرقم المعتمد: 01023499515</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">نص شريط العروض العلوي</label>
                  <input
                    type="text"
                    value={settingsForm.topBanner}
                    onChange={(e) => setSettingsForm({ ...settingsForm, topBanner: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-glow cursor-pointer active:scale-98 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ وتثبيت الأرقام فوراً</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= TAB 5: ORDERS MANAGEMENT ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>سجل الطلبات الواردة من المتجر ({orders.length})</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    جميع الطلبات التي تمت عبر سلة المشتريات والطلب السريع من المتجر
                  </p>
                </div>

                {orders.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من مسح سجل الطلبات؟')) {
                        clearOrders();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all cursor-pointer w-fit"
                  >
                    مسح السجل
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-2">
                  <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">لا توجد طلبات جديدة حالياً</p>
                  <p className="text-xs text-slate-500">أي عميل يقوم بطلب أوردر أو استفسار سيظهر هنا فوراً</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-md space-y-3 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black text-sky-300 bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-800">
                            {ord.id}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{ord.date}</span>
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-800">
                            {ord.type || 'طلب شراء'}
                          </span>
                        </div>

                        {/* Status switcher */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {['جديد 🟢', 'قيد التنفيذ ⏳', 'تم التوريد والتركيب ✅', 'ملغي ❌'].map((st) => (
                            <button
                              key={st}
                              onClick={() => updateOrderStatus(ord.id, st)}
                              className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                                ord.status === st
                                  ? 'bg-sky-500 text-slate-950 font-black shadow-sm'
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {st}
                            </button>
                          ))}

                          <button
                            onClick={() => deleteOrder(ord.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors mr-1 cursor-pointer"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-slate-400 text-[11px] block">اسم العميل:</span>
                          <span className="font-bold text-white">{ord.customerName || 'عميل محترم'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">رقم الهاتف:</span>
                          <a
                            href={`tel:${ord.customerPhone}`}
                            className="font-bold font-mono text-emerald-400 hover:underline"
                          >
                            {ord.customerPhone}
                          </a>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">العنوان / المنطقة:</span>
                          <span className="text-slate-300">{ord.customerAddress || 'القاهرة / الجيزة'}</span>
                        </div>
                      </div>

                      {/* Ordered Items */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-slate-400 font-bold block text-[11px]">الأجهزة والخدمات المطلوبة:</span>
                        {ord.items && ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-slate-300 bg-slate-950/40 px-3 py-1.5 rounded-lg">
                            <span className="font-medium truncate max-w-[70%]">
                              {it.quantity || 1}x {it.name} {it.hpText ? `(${it.hpText})` : ''}
                            </span>
                            <span className="font-bold text-white font-mono">
                              {((it.price || 0) * (it.quantity || 1)).toLocaleString('ar-EG')} ج.م
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total and Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs text-slate-400">الإجمالي:</span>
                          <span className="text-base font-black text-emerald-400 font-mono">
                            {ord.total?.toLocaleString('ar-EG')} ج.م
                          </span>
                        </div>

                        {ord.customerPhone && ord.customerPhone !== 'غير محدد' && ord.customerPhone !== 'واتساب مباشر' && (
                          <a
                            href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                          >
                            <span>مراسلة العميل واتساب 💬</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL: EDIT/ADD PRODUCT (Mobile & Desktop Responsive) ================= */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-auto text-right"
              dir="rtl"
            >
              {/* Modal Top Header */}
              <div className="bg-slate-800/90 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black text-white">
                  {editingProduct ? 'تعديل بيانات وسعر التكييف' : 'إضافة تكييف جديد للمتجر'}
                </h3>

                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveProduct} className="p-4 sm:p-5 space-y-3.5 text-xs max-h-[78vh] overflow-y-auto">
                
                {/* Name */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">اسم جهاز التكييف بالكامل *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="مثال: تكييف كاريير 1.5 حصان بارد إنفرتر"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                {/* Brand & HP */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">الماركة</label>
                    <select
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:border-sky-400 focus:outline-none"
                    >
                      {BRANDS.filter((brand) => brand.id !== 'all').map((brand) => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">القدرة</label>
                    <select
                      value={productForm.hp}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        hp: Number(e.target.value),
                        hpText: `${e.target.value} حصان`
                      })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:border-sky-400 focus:outline-none"
                    >
                      <option value={1.5}>1.5 حصان</option>
                      <option value={2.25}>2.25 حصان</option>
                      <option value={3}>3 حصان</option>
                      <option value={4}>4 حصان</option>
                      <option value={5}>5 حصان</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">نوع التكييف</label>
                  <select
                    value={productForm.type}
                    onChange={(e) => {
                      const typeMeta = TYPES.find((item) => item.id === e.target.value);
                      setProductForm({
                        ...productForm,
                        type: e.target.value,
                        typeName: typeMeta?.name || productForm.typeName,
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:border-sky-400 focus:outline-none"
                  >
                    {TYPES.filter((item) => item.id !== 'all').map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">السعر للعميل (ج.م) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sky-400 font-mono font-bold focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">السعر قبل الخصم (ج.م)</label>
                    <input
                      type="number"
                      value={productForm.oldPrice}
                      onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image Upload Box */}
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-sky-400" />
                      <span>صورة التكييف</span>
                    </span>
                    {imagePreview && (
                      <span className="text-[10px] text-emerald-400 font-bold">تم اختيار صورة ✓</span>
                    )}
                  </div>

                  {/* Upload button & Preview Thumbnail */}
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-2 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center gap-1.5 text-xs transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>اختيار صورة من الموبايل / الجهاز</span>
                    </button>

                    {imagePreview && (
                      <div className="w-20 h-20 rounded-xl bg-white border border-slate-700 p-1 overflow-hidden shrink-0">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>

                  {/* Quick Presets */}
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">أو صورة أصلية من كتالوج ميراكو:</span>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {PRESET_AC_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setImagePreview(preset.url);
                            setProductForm(prev => ({ ...prev, image: preset.url }));
                          }}
                          className={`p-0.5 rounded-lg border shrink-0 transition-all ${
                            imagePreview === preset.url
                              ? 'border-sky-400 bg-sky-500/20'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-9 h-7 object-contain rounded" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Features Selector */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">المواصفات (اضغط للتحديد):</label>
                  <div className="flex flex-wrap gap-1">
                    {AVAILABLE_TAGS.slice(0, 6).map((tag) => {
                      const isSelected = productForm.features?.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleFeatureTag(tag)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-4 pt-2 border-t border-slate-800">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-200 text-xs">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      className="w-3.5 h-3.5 rounded text-brand-600 bg-slate-800"
                    />
                    <span>متوفر للتوريد</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-amber-400 text-xs">
                    <input
                      type="checkbox"
                      checked={productForm.bestseller}
                      onChange={(e) => setProductForm({ ...productForm, bestseller: e.target.checked })}
                      className="w-3.5 h-3.5 rounded text-amber-600 bg-slate-800"
                    />
                    <span>الأكثر طلباً 🔥</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold shadow-md hover:brightness-110"
                  >
                    حفظ وظهور فوري على المتجر
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: EDIT SERVICE ================= */}
      <AnimatePresence>
        {isServiceModalOpen && editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl text-right"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                <h3 className="text-xs sm:text-sm font-bold text-white">تعديل سعر الخدمة</h3>
                <button
                  onClick={() => setIsServiceModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">اسم الخدمة</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">السعر المعروض (مثال: يبدأ من 500 ج.م)</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sky-400 font-mono font-bold focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsServiceModalOpen(false)}
                    className="py-2 px-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold"
                  >
                    حفظ التعديل
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
