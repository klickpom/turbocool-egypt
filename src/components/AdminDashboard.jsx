import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sliders,
  DollarSign,
  TrendingUp,
  Percent,
  Sparkles,
  Eye,
  ArrowRight,
  ShieldCheck,
  Zap,
  Flame,
  Check
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('products'); // 'overview', 'products', 'services', 'coupons', 'settings'

  // Product Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');

  // Product Edit / Add Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
    image: 'https://images.unsplash.com/photo-1614633833026-6204481b4c93?w=600&auto=format&fit=crop&q=80',
    features: ['توفير كهرباء 60%', 'تبريد نفاث Turbo', 'فلتر بلازما منقي'],
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
    // Default PIN: 1234 or turbo2026 or admin
    if (pinInput === '1234' || pinInput.toLowerCase() === 'turbo2026' || pinInput.toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('turbocool_admin_auth', 'true');
      setPinError(false);
      showToast('تم تسجيل الدخول إلى لوحة التحكم بنجاح! 👑');
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

  // Open Product Modal
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({ ...product });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        brand: 'carrier',
        brandName: 'كاريير',
        modelCode: `TC-${Math.floor(1000 + Math.random() * 9000)}`,
        hp: 1.5,
        hpText: '1.5 حصان',
        type: 'cool-inverter',
        typeName: 'بارد / إنفرتر موفر للطاقة',
        price: 22000,
        oldPrice: 25000,
        discount: 12,
        warranty: 'ضمان 5 سنوات شامل من الوكيل',
        image: 'https://images.unsplash.com/photo-1614633833026-6204481b4c93?w=600&auto=format&fit=crop&q=80',
        features: ['تبريد فائق السرعة', 'موفر للكهرباء', 'ضمان معتمد'],
        bestseller: false,
        inStock: true,
        energyRating: 'A+++'
      });
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

    const updatedData = {
      ...productForm,
      brandName: brandNamesMap[productForm.brand] || productForm.brand,
      price: Number(productForm.price),
      oldPrice: Number(productForm.oldPrice || productForm.price),
      discount: productForm.oldPrice > productForm.price 
        ? Math.round(((productForm.oldPrice - productForm.price) / productForm.oldPrice) * 100)
        : 0
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, updatedData);
    } else {
      addProduct(updatedData);
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
        <div className="absolute w-[450px] h-[450px] rounded-full bg-brand-500/15 blur-[120px] pointer-events-none" />
        <div className="absolute w-[350px] h-[350px] rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-500 p-0.5 shadow-lg shadow-brand-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Lock className="w-9 h-9 text-sky-400" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">لوحة تحكم تربو كوول</h2>
            <p className="text-sm text-slate-400 mt-1">أدخل رمز المرور السري لإدارة الأسعار والمنتجات</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={10}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="أدخل رمز الدخول (الافتراضي: 1234)"
                autoFocus
                className={`w-full text-center tracking-widest text-lg font-bold py-3.5 px-4 rounded-xl bg-slate-800/90 border text-white placeholder-slate-500 focus:outline-none transition-all ${
                  pinError ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-sky-400'
                }`}
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-1.5 font-semibold">رمز المرور غير صحيح! جرب 1234</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 text-white font-bold shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>دخول للوحة التحكم</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => navigateToView('store')}
              className="hover:text-sky-400 flex items-center gap-1 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للمتجر الرئيسي</span>
            </button>
            <span className="text-slate-500">رمز الدخول: 1234</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- MAIN ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-cairo flex flex-col" dir="rtl">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-sky-400 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-sky-400 text-base">
              TC
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white leading-none">لوحة تحكم تربو كوول</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                متصل مباشر ⚡
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">تعديل الأسعار والمنتجات والخدمات مباشرة على المتجر</p>
          </div>
        </div>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigateToView('store')}
            className="py-2 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-glow hover:shadow-glow-lg transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">معاينة المتجر المباشر</span>
            <span className="sm:hidden">المتجر</span>
          </button>

          <button
            onClick={handleLogout}
            title="تسجيل الخروج"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout (Sidebar + Content) */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-b md:border-b-0 md:border-l border-slate-800 p-3 sm:p-4 shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-brand-600 text-white shadow-glow'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>إدارة تكييفات المتجر</span>
              <span className="mr-auto text-[11px] px-1.5 py-0.5 rounded-md bg-slate-800 text-sky-300 font-mono">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-brand-600 text-white shadow-glow'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>خدمات الصيانة والتركيب</span>
              <span className="mr-auto text-[11px] px-1.5 py-0.5 rounded-md bg-slate-800 text-sky-300 font-mono">
                {services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'coupons'
                  ? 'bg-brand-600 text-white shadow-glow'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>كوبونات وعروض الخصم</span>
              <span className="mr-auto text-[11px] px-1.5 py-0.5 rounded-md bg-slate-800 text-sky-300 font-mono">
                {coupons.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-brand-600 text-white shadow-glow'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>أرقام واتساب وبيانات المتجر</span>
            </button>
          </div>

          {/* Backup & Reset Bar */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 hidden md:block">
            <button
              onClick={resetToDefaults}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-amber-400 hover:border-amber-400/40 text-xs font-semibold transition-all cursor-pointer"
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
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">إجمالي الأجهزة المعروضة</p>
                <p className="text-xl font-black text-white">{totalProductsCount} <span className="text-xs text-slate-400 font-normal">تكييف</span></p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">الأجهزة المتوفرة للتوريد</p>
                <p className="text-xl font-black text-emerald-400">{inStockCount} <span className="text-xs text-slate-400 font-normal">جاهز</span></p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">الأجهزة الأكثر طلباً (Hot)</p>
                <p className="text-xl font-black text-amber-400">{bestsellersCount} <span className="text-xs text-slate-400 font-normal">موديل</span></p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">خدمات الصيانة والتركيب</p>
                <p className="text-xl font-black text-white">{totalServicesCount} <span className="text-xs text-slate-400 font-normal">خدمة</span></p>
              </div>
            </div>
          </div>

          {/* ================= TAB 1: PRODUCTS MANAGEMENT ================= */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              {/* Filter & Add New Bar */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
                
                {/* Search & Brand selector */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <div className="relative min-w-[220px] flex-1 md:flex-initial">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ابحث باسم الموديل أو الماركة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <select
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
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
                  className="w-full md:w-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة جهاز تكييف جديد</span>
                </button>
              </div>

              {/* Products Table / Cards */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-800/80 border-b border-slate-700/80 text-slate-300 font-bold">
                      <tr>
                        <th className="p-3.5">الجهاز والموديل</th>
                        <th className="p-3.5">الماركة والقدرة</th>
                        <th className="p-3.5">السعر الحالي</th>
                        <th className="p-3.5">السعر الأصلي</th>
                        <th className="p-3.5">حالة التوفر</th>
                        <th className="p-3.5 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200 font-semibold">
                      {adminFilteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 rounded-xl object-contain bg-slate-800 p-1 border border-slate-700 shrink-0"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://placehold.co/100x100?text=AC';
                                }}
                              />
                              <div>
                                <p className="font-bold text-white max-w-[200px] truncate">{product.name}</p>
                                <span className="font-mono text-[11px] text-slate-400">#{product.modelCode || product.id}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md bg-brand-900/80 text-sky-300 border border-brand-700/50 text-[11px] font-bold">
                              {product.brandName} • {product.hpText}
                            </span>
                          </td>

                          <td className="p-3.5 font-bold text-sky-400 font-mono text-sm">
                            {product.price.toLocaleString('ar-EG')} ج.م
                          </td>

                          <td className="p-3.5 text-slate-400 font-mono line-through">
                            {product.oldPrice ? `${product.oldPrice.toLocaleString('ar-EG')} ج.م` : '-'}
                          </td>

                          <td className="p-3.5">
                            <button
                              onClick={() => updateProduct(product.id, { inStock: !product.inStock })}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                                product.inStock
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-red-500/20 text-red-300 border-red-500/40'
                              }`}
                            >
                              {product.inStock ? 'متوفر للتوريد ✓' : 'غير متوفر ✕'}
                            </button>
                          </td>

                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenProductModal(product)}
                                className="p-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 transition-all cursor-pointer"
                                title="تعديل السعر والبيانات"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`هل أنت متأكد من حذف ${product.name}؟`)) {
                                    deleteProduct(product.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 transition-all cursor-pointer"
                                title="حذف الجهاز"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {adminFilteredProducts.length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                    لا توجد منتجات تطابق البحث.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 2: SERVICES & PRICING ================= */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">إدارة أسعار وخدمات الصيانة والتركيب</h2>
                  <p className="text-xs text-slate-400">تعديل تكلفة التركيبات، شحن الفريون، والتنظيف الكيميائي</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-sky-400">
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

                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                        <span className="text-[11px] text-slate-400">السعر المعروض:</span>
                        <p className="text-base font-black text-sky-400 font-mono">{service.price}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
                      <button
                        onClick={() => handleOpenServiceModal(service)}
                        className="py-1.5 px-3 rounded-lg bg-brand-600/30 hover:bg-brand-600 text-sky-300 hover:text-white border border-brand-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
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
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
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
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between"
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
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 max-w-2xl">
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
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 text-white text-xs font-bold flex items-center gap-2 shadow-glow hover:shadow-glow-lg transition-all cursor-pointer"
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

      {/* ================= MODAL: EDIT/ADD PRODUCT ================= */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl my-8 text-right"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-base font-bold text-white">
                  {editingProduct ? 'تعديل بيانات وسعر التكييف' : 'إضافة تكييف جديد للمتجر'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">اسم الجهاز بالكامل</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="مثال: تكييف كاريير أوبتيماكس برو 1.5 حصان بارد إنفرتر"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">الماركة التجارية</label>
                    <select
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
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
                    <label className="block text-slate-400 mb-1">القدرة (الحصان)</label>
                    <select
                      value={productForm.hp}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        hp: Number(e.target.value),
                        hpText: `${e.target.value} حصان`
                      })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                    >
                      <option value={1.5}>1.5 حصان</option>
                      <option value={2.25}>2.25 حصان</option>
                      <option value={3}>3 حصان</option>
                      <option value={4}>4 حصان</option>
                      <option value={5}>5 حصان</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">السعر الحالي (ج.م) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-sky-400 focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">السعر الأصلي قبل الخصم (ج.م)</label>
                    <input
                      type="number"
                      value={productForm.oldPrice}
                      onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">رابط صورة الجهاز (URL)</label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">مدة الضمان</label>
                    <input
                      type="text"
                      value={productForm.warranty}
                      onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}
                      placeholder="ضمان 5 سنوات شامل"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">كود الموديل</label>
                    <input
                      type="text"
                      value={productForm.modelCode}
                      onChange={(e) => setProductForm({ ...productForm, modelCode: e.target.value })}
                      placeholder="53QHCT12N"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-2 border-t border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
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

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold shadow-md hover:brightness-110"
                  >
                    حفظ ونشر على المتجر
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

              <form onSubmit={handleSaveService} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">اسم الخدمة</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">السعر المعروض (مثال: يبدأ من 500 ج.م)</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="يبدأ من 500 ج.م"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sky-400 font-bold focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">وصف الخدمة</label>
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
                    className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold"
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
