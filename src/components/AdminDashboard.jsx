import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
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
  Image as ImageIcon,
  Camera,
  Star,
  Layers,
  Award,
  Sliders,
  Maximize2
} from 'lucide-react';

const PRESET_AC_IMAGES = [
  { label: 'كاريير أوبتيماكس أبيض', url: 'https://images.unsplash.com/photo-1614633833026-6204481b4c93?w=600&auto=format&fit=crop&q=80' },
  { label: 'شارب بلازما كلاستر', url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80' },
  { label: 'إل جي دوال إنفرتر أسود', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80' },
  { label: 'فريش سمارت سيلفر', url: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=600&auto=format&fit=crop&q=80' },
  { label: 'ميديا ميشن إنفرتر', url: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=600&auto=format&fit=crop&q=80' },
  { label: 'تكييف كونسيلد مخفي', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' }
];

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
    navigateToView,
    showToast,
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

  // Handle PIN Login
  const handlePinSubmit = (e) => {
    e?.preventDefault();
    if (pinInput === '1234' || pinInput.toLowerCase() === 'turbo2026' || pinInput.toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('turbocool_admin_auth', 'true');
      setPinError(false);
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch {}
      showToast('أهلاً بك في لوحة تحكم تربو كوول 👑❄️');
    } else {
      setPinError(true);
      showToast('رمز الدخول غير صحيح! الرمز الافتراضي: 1234', 'warning');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('turbocool_admin_auth');
    showToast('تم تسجيل الخروج من لوحة الإدارة', 'info');
  };

  // Handle Direct Image File Upload (From Phone/Computer)
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      if (base64Url) {
        setImagePreview(base64Url);
        setProductForm(prev => ({ ...prev, image: base64Url }));
        showToast('تم رفع الصورة بنجاح! 📸');
      }
    };
    reader.readAsDataURL(file);
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
      const defaultImg = PRESET_AC_IMAGES[0].url;
      setProductForm({
        name: '',
        brand: 'carrier',
        brandName: 'كاريير',
        modelCode: `TC-${Math.floor(1000 + Math.random() * 9000)}`,
        hp: 1.5,
        hpText: '1.5 حصان',
        type: 'cool-inverter',
        typeName: 'بارد / إنفرتر موفر للطاقة',
        price: 23500,
        oldPrice: 26000,
        discount: 10,
        warranty: 'ضمان 5 سنوات شامل من الوكيل',
        image: defaultImg,
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
      carrier: 'كاريير',
      sharp: 'شارب',
      lg: 'إل جي LG',
      fresh: 'فريش',
      midea: 'ميديا',
      gree: 'جري Gree',
      tornado: 'تورنيدو'
    };

    const calculatedDiscount = productForm.oldPrice > productForm.price 
      ? Math.round(((productForm.oldPrice - productForm.price) / productForm.oldPrice) * 100)
      : 0;

    const updatedData = {
      ...productForm,
      brandName: brandNamesMap[productForm.brand] || productForm.brand,
      price: Number(productForm.price),
      oldPrice: Number(productForm.oldPrice || productForm.price),
      discount: calculatedDiscount,
      image: imagePreview || productForm.image
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
        <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-500/20 blur-[130px] pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-sky-500/15 blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative max-w-md w-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 via-sky-500 to-teal-400 p-0.5 shadow-xl shadow-brand-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Lock className="w-9 h-9 text-sky-400 animate-pulse" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">لوحة تحكم تربو كوول</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">إدارة أسعار التكييفات، الخدمات، ورفع الصور مباشرة</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={10}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="أدخل رمز الدخول (الافتراضي: 1234)"
                autoFocus
                className={`w-full text-center tracking-widest text-lg font-bold py-3.5 px-4 rounded-2xl bg-slate-800/90 border text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner ${
                  pinError ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/20' : 'border-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                }`}
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-1.5 font-semibold">رمز المرور غير صحيح! جرب: 1234</p>
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
            <span className="text-slate-500 font-mono">الرمز الافتراضي: 1234</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- MAIN ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-cairo flex flex-col selection:bg-brand-500 selection:text-white" dir="rtl">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800/90 backdrop-blur-xl px-4 sm:px-8 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-500 to-sky-400 p-0.5 flex items-center justify-center shadow-md shadow-brand-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-sky-400 text-lg">
              TC
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white leading-none">لوحة تحكم تربو كوول</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                تزامن فوري ⚡
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">أي تعديل تحفظه يظهر مباشرة على متجر turbocool-egypt.shop</p>
          </div>
        </div>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigateToView('store')}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-sky-500 to-teal-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-glow hover:shadow-glow-lg transition-all cursor-pointer active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span>معاينة المتجر المباشر</span>
          </button>

          <button
            onClick={handleLogout}
            title="تسجيل الخروج"
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout (Sidebar + Content) */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-b md:border-b-0 md:border-l border-slate-800/80 p-3 sm:p-4 shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-glow'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>إدارة تكييفات المتجر</span>
              <span className="mr-auto text-[11px] px-2 py-0.5 rounded-md bg-slate-800/90 text-sky-300 font-mono font-bold">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-glow'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>خدمات الصيانة والتركيب</span>
              <span className="mr-auto text-[11px] px-2 py-0.5 rounded-md bg-slate-800/90 text-sky-300 font-mono font-bold">
                {services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'coupons'
                  ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-glow'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>كوبونات وعروض الخصم</span>
              <span className="mr-auto text-[11px] px-2 py-0.5 rounded-md bg-slate-800/90 text-sky-300 font-mono font-bold">
                {coupons.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-glow'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>أرقام واتساب وبيانات المتجر</span>
            </button>
          </div>

          {/* Preset Helper & Reset */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 hidden md:block space-y-2">
            <button
              onClick={resetToDefaults}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-amber-400 hover:border-amber-400/40 text-xs font-semibold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة البيانات الافتراضية</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-x-hidden">
          
          {/* Quick Analytics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-4 flex items-center gap-3 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">إجمالي التكييفات</p>
                <p className="text-xl font-black text-white">{totalProductsCount} <span className="text-xs text-slate-400 font-normal">موديل</span></p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-4 flex items-center gap-3 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">جاهز للتوريد الفوري</p>
                <p className="text-xl font-black text-emerald-400">{inStockCount} <span className="text-xs text-slate-400 font-normal">متوفر</span></p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-4 flex items-center gap-3 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">الأكثر طلباً (Hot)</p>
                <p className="text-xl font-black text-amber-400">{bestsellersCount} <span className="text-xs text-slate-400 font-normal">تكييف</span></p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-4 flex items-center gap-3 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">خدمات الصيانة والتركيب</p>
                <p className="text-xl font-black text-white">{totalServicesCount} <span className="text-xs text-slate-400 font-normal">خدمة</span></p>
              </div>
            </div>
          </div>

          {/* ================= TAB 1: PRODUCTS MANAGEMENT ================= */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              {/* Filter & Add New Bar */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
                
                {/* Search & Brand selector */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <div className="relative min-w-[240px] flex-1 md:flex-initial">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ابحث باسم الموديل أو الماركة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <select
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    <option value="all">جميع الماركات ({products.length})</option>
                    <option value="carrier">كاريير</option>
                    <option value="sharp">شارب</option>
                    <option value="lg">إل جي LG</option>
                    <option value="fresh">فريش</option>
                    <option value="midea">ميديا</option>
                    <option value="gree">جري</option>
                    <option value="tornado">تورنيدو</option>
                  </select>
                </div>

                {/* Add Product Button */}
                <button
                  onClick={() => handleOpenProductModal()}
                  className="w-full md:w-auto py-2.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة تكييف جديد + رفع صورة</span>
                </button>
              </div>

              {/* Products Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminFilteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 flex flex-col justify-between hover:border-slate-700 hover:shadow-xl transition-all relative overflow-hidden group"
                  >
                    {/* Bestseller ribbon */}
                    {product.bestseller && (
                      <div className="absolute top-3 left-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span>الأكثر طلباً</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* Product Image & Badges */}
                      <div className="relative w-full h-40 bg-slate-950/60 rounded-2xl p-2 flex items-center justify-center border border-slate-800 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1614633833026-6204481b4c93?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-slate-900/90 text-slate-300 text-[10px] font-mono border border-slate-700">
                          #{product.modelCode || product.id}
                        </span>
                      </div>

                      {/* Brand & HP */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-lg bg-brand-900/60 text-sky-300 border border-brand-700/40 text-xs font-bold">
                          {product.brandName} • {product.hpText}
                        </span>
                        
                        <button
                          onClick={() => updateProduct(product.id, { inStock: !product.inStock })}
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                            product.inStock
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-red-500/15 text-red-400 border-red-500/30'
                          }`}
                        >
                          {product.inStock ? 'متوفر للتوريد ✓' : 'غير متوفر ✕'}
                        </button>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug">
                        {product.name}
                      </h3>

                      {/* Prices */}
                      <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">السعر للعميل:</span>
                          <span className="text-base font-black text-sky-400 font-mono">
                            {product.price?.toLocaleString('ar-EG')} ج.م
                          </span>
                        </div>
                        {product.oldPrice > product.price && (
                          <div className="text-left">
                            <span className="text-[10px] text-red-400 block line-through font-mono">
                              {product.oldPrice.toLocaleString('ar-EG')} ج.م
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                              خصم {product.discount}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenProductModal(product)}
                        className="flex-1 py-2 px-3 rounded-xl bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>تعديل السعر والصورة</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`هل أنت متأكد من حذف ${product.name} من المتجر؟`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 transition-all cursor-pointer"
                        title="حذف الجهاز"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {adminFilteredProducts.length === 0 && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
                  <Package className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-base font-bold text-white">لا توجد منتجات تطابق البحث</p>
                  <button
                    onClick={() => { setSearchQuery(''); setFilterBrand('all'); }}
                    className="py-2 px-4 rounded-xl bg-brand-600 text-white text-xs font-bold"
                  >
                    عرض كافة التكييفات
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: SERVICES & PRICING ================= */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">إدارة أسعار وخدمات الصيانة والتركيب</h2>
                  <p className="text-xs text-slate-400">تعديل تكلفة التركيبات، شحن الفريون، والتنظيف الكيميائي والتأسيس</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-11 h-11 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-sky-400">
                          <Wrench className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-semibold">
                          {service.badge || 'خدمة'}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-white text-sm">{service.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{service.description}</p>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                        <span className="text-[11px] text-slate-400">السعر المعروض للعميل:</span>
                        <p className="text-base font-black text-sky-400 font-mono">{service.price}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
                      <button
                        onClick={() => handleOpenServiceModal(service)}
                        className="py-2 px-4 rounded-xl bg-brand-600/30 hover:bg-brand-600 text-sky-300 hover:text-white border border-brand-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>تعديل السعر والبيانات</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: COUPONS & OFFERS ================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-5">
              {/* Add Coupon Box */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg">
                <h2 className="text-base font-bold text-white mb-1">إضافة كوبون خصم جديد</h2>
                <p className="text-xs text-slate-400 mb-4">إنشاء أكواد ترويجية مثل TURBO500 لخصم مبالغ للعملاء في السلة</p>

                <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">كود الكوبون</label>
                    <input
                      type="text"
                      placeholder="مثال: SUMMER2026"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">قيمة الخصم (ج.م)</label>
                    <input
                      type="number"
                      placeholder="500"
                      value={couponForm.discount}
                      onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">وصف العرض</label>
                    <input
                      type="text"
                      placeholder="خصم 500 ج.م على التكييفات"
                      value={couponForm.label}
                      onChange={(e) => setCouponForm({ ...couponForm, label: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>تفعيل الكوبون</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Coupons List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-mono font-black text-sm border border-sky-500/30">
                          {coupon.code}
                        </span>
                        <span className="text-emerald-400 font-bold text-xs font-mono">
                          -{coupon.discount} {coupon.type === 'percent' ? '%' : 'ج.م'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{coupon.label}</p>
                    </div>

                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                      title="حذف الكوبون"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: STORE SETTINGS & CONTACT ================= */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 max-w-2xl shadow-xl">
              <h2 className="text-base font-bold text-white mb-1">إعدادات المتجر وبيانات التواصل</h2>
              <p className="text-xs text-slate-400 mb-5">تغيير أرقام واتساب المبيعات وشريط الإعلانات العلوي</p>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>رقم واتساب المبيعات (الذي يستقبل الطلبات المباشرة)</span>
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    placeholder="مثال: 201140087799"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-sky-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">يكتب بالصيغة الدولية لمصر بدون علامة + (مثال: 201140087799)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-sky-400" />
                      <span>رقم الهاتف المباشر</span>
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      placeholder="01140087799"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>خط طوارئ الصيانة 24/7</span>
                    </label>
                    <input
                      type="text"
                      value={settingsForm.emergencyPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, emergencyPhone: e.target.value })}
                      placeholder="01140087799"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>نص شريط الإعلانات والعروض العلوي</span>
                  </label>
                  <input
                    type="text"
                    value={settingsForm.topBanner}
                    onChange={(e) => setSettingsForm({ ...settingsForm, topBanner: e.target.value })}
                    placeholder="توريد وتركيب فوري 24 ساعة..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">مناطق التغطية والمعاينة</label>
                  <input
                    type="text"
                    value={settingsForm.coverageAreas}
                    onChange={(e) => setSettingsForm({ ...settingsForm, coverageAreas: e.target.value })}
                    placeholder="الجيزة، القاهرة، 6 أكتوبر، زايد..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-sky-500 to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-glow hover:shadow-glow-lg transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ جميع الإعدادات فوراً</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL: LUXURY PRODUCT CREATOR STUDIO ================= */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto text-right"
              dir="rtl"
            >
              {/* Modal Top Header */}
              <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      {editingProduct ? 'تعديل بيانات وسعر التكييف' : 'إضافة تكييف جديد للمتجر'}
                    </h3>
                    <p className="text-[11px] text-slate-400">ارفع صورة التكييف من جهازك وحدد السعر والمواصفات</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-700/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Form (Right) + Live Preview Card (Left) */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
                
                {/* Form Fields (7 cols) */}
                <form onSubmit={handleSaveProduct} className="lg:col-span-7 space-y-4 text-xs">
                  
                  {/* Name Input */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">اسم جهاز التكييف بالكامل *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="مثال: تكييف كاريير أوبتيماكس برو 1.5 حصان بارد إنفرتر"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white font-medium focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  {/* Brand & HP */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5">الماركة التجارية</label>
                      <select
                        value={productForm.brand}
                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white focus:border-sky-400 focus:outline-none cursor-pointer"
                      >
                        <option value="carrier">كاريير (Carrier)</option>
                        <option value="sharp">شارب (Sharp)</option>
                        <option value="lg">إل جي (LG)</option>
                        <option value="fresh">فريش (Fresh)</option>
                        <option value="midea">ميديا (Midea)</option>
                        <option value="gree">جري (Gree)</option>
                        <option value="tornado">تورنيدو (Tornado)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5">القدرة بالحصان</label>
                      <select
                        value={productForm.hp}
                        onChange={(e) => setProductForm({
                          ...productForm,
                          hp: Number(e.target.value),
                          hpText: `${e.target.value} حصان`
                        })}
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white focus:border-sky-400 focus:outline-none cursor-pointer"
                      >
                        <option value={1.5}>1.5 حصان (حتى 14 م²)</option>
                        <option value={2.25}>2.25 حصان (حتى 20 م²)</option>
                        <option value={3}>3 حصان (حتى 28 م²)</option>
                        <option value={4}>4 حصان (حتى 36 م²)</option>
                        <option value={5}>5 حصان (حتى 45 م²)</option>
                      </select>
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5">السعر للعميل (ج.م) *</label>
                      <input
                        type="number"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-sky-400 font-mono font-bold text-sm focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5">السعر قبل الخصم (ج.م)</label>
                      <input
                        type="number"
                        value={productForm.oldPrice}
                        onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-slate-300 font-mono focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Image Upload Box */}
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                    <label className="block text-slate-200 font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-sky-400" />
                        <span>صورة التكييف (رفع من جهازك أو اختيار جاهزة)</span>
                      </span>
                    </label>

                    {/* Upload Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
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
                        className="py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>رفع صورة من الموبايل / الكمبيوتر</span>
                      </button>
                    </div>

                    {/* Presets Gallery */}
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5">أو اختر صورة جاهزة عالية الجودة:</span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {PRESET_AC_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setImagePreview(preset.url);
                              setProductForm(prev => ({ ...prev, image: preset.url }));
                            }}
                            className={`p-1 rounded-xl border shrink-0 transition-all cursor-pointer ${
                              imagePreview === preset.url
                                ? 'border-sky-400 bg-sky-500/20 ring-2 ring-sky-400/30'
                                : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} className="w-12 h-10 object-contain rounded-lg" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Feature Tags Selector */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-2">مميزات ومواصفات الجهاز (اضغط للتحديد):</label>
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_TAGS.map((tag) => {
                        const isSelected = productForm.features?.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleFeatureTag(tag)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                              isSelected
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm'
                                : 'bg-slate-800 text-slate-400 border border-slate-700/60 hover:text-slate-200'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-sky-400" />}
                            <span>{tag}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-6 pt-3 border-t border-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                      <input
                        type="checkbox"
                        checked={productForm.inStock}
                        onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                        className="w-4 h-4 rounded text-brand-600 bg-slate-800 border-slate-700"
                      />
                      <span>متوفر للتوريد والتركيب الفوري</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-amber-400">
                      <input
                        type="checkbox"
                        checked={productForm.bestseller}
                        onChange={(e) => setProductForm({ ...productForm, bestseller: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-600 bg-slate-800 border-slate-700"
                      />
                      <span>تمييز كـ (الأكثر طلباً 🔥)</span>
                    </label>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="pt-4 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="py-2.5 px-5 rounded-2xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white font-black shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all cursor-pointer active:scale-95"
                    >
                      حفظ ونشر على المتجر 🚀
                    </button>
                  </div>

                </form>

                {/* Live Card Preview (5 cols) */}
                <div className="lg:col-span-5 flex flex-col items-center justify-start space-y-3">
                  <div className="w-full text-center">
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                      معاينة حية فورية لما سيراه العميل 👁️
                    </span>
                  </div>

                  {/* Mini Rendered Product Card */}
                  <div className="w-full max-w-sm bg-white rounded-3xl p-4 border border-slate-200 shadow-2xl text-slate-900 text-right space-y-3">
                    
                    {/* Top badges */}
                    <div className="flex items-center justify-between">
                      {productForm.oldPrice > productForm.price ? (
                        <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                          خصم {Math.round(((productForm.oldPrice - productForm.price) / productForm.oldPrice) * 100)}%
                        </span>
                      ) : (
                        <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          أصلي بالضمان
                        </span>
                      )}

                      {productForm.bestseller && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-600" /> الأكثر طلباً
                        </span>
                      )}
                    </div>

                    {/* Card Image */}
                    <div className="w-full h-44 bg-slate-50 rounded-2xl p-2 flex items-center justify-center border border-slate-100 overflow-hidden">
                      <img
                        src={imagePreview || productForm.image}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1614633833026-6204481b4c93?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    {/* Brand & HP */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                        {productForm.brandName || productForm.brand} • {productForm.hpText}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {productForm.modelCode}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-black text-slate-900 text-sm line-clamp-2 leading-tight">
                      {productForm.name || 'اسم التكييف سيظهر هنا'}
                    </h4>

                    {/* Features Snippet */}
                    <div className="space-y-1 pt-1 border-t border-slate-100 text-[11px] text-slate-600">
                      {productForm.features?.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price & Buy Button */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-black text-brand-700 font-mono">
                          {Number(productForm.price || 0).toLocaleString('ar-EG')} ج.م
                        </span>
                        {productForm.oldPrice > productForm.price && (
                          <span className="text-xs text-slate-400 line-through block font-mono">
                            {Number(productForm.oldPrice).toLocaleString('ar-EG')} ج.م
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        className="py-2 px-3.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                      >
                        <span>طلب فوري</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: EDIT SERVICE ================= */}
      <AnimatePresence>
        {isServiceModalOpen && editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-right"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-base font-bold text-white">تعديل سعر وبيانات الخدمة</h3>
                <button
                  onClick={() => setIsServiceModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-3.5 text-xs">
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
                  <label className="block text-slate-300 font-bold mb-1">السعر المعروض للعميل</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="مثال: يبدأ من 500 ج.م"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sky-400 font-mono font-bold focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">وصف تفاصيل الخدمة</label>
                  <textarea
                    rows={3}
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsServiceModalOpen(false)}
                    className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold cursor-pointer"
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
