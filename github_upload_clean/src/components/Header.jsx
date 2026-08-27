import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  PhoneCall, 
  ShoppingCart, 
  Heart, 
  Scale, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  Calculator, 
  Wrench, 
  ShieldCheck, 
  MessageSquare,
  ChevronDown
} from 'lucide-react';

export const Header = () => {
  const {
    cartCount,
    cartTotal,
    wishlist,
    comparisonList,
    setIsCartOpen,
    setIsCompareOpen,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    setSelectedBrand
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBrandsDropdownOpen, setIsBrandsDropdownOpen] = useState(false);

  const navigateToSection = (id, tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectBrandAndScroll = (brandId) => {
    setSelectedBrand(brandId);
    setIsBrandsDropdownOpen(false);
    navigateToSection('catalog-section', 'catalog');
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-800 to-brand-900 text-white text-[11px] sm:text-xs md:text-sm py-1.5 md:py-2 px-3 sm:px-4 border-b border-brand-700/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2 text-center sm:text-right">
            <span className="inline-flex items-center gap-1 bg-ice-500/20 text-ice-300 font-bold px-2 py-0.5 rounded-full text-[10px] sm:text-xs border border-ice-400/30 shrink-0">
              <Sparkles className="w-3 h-3" /> عروض 2026
            </span>
            <span className="text-slate-200 font-medium truncate">
              🚚 توريد وتركيب فوري 24 ساعة + معاينة مجانية بالجيزة والقاهرة!
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            <a 
              href="tel:01140087799" 
              className="flex items-center gap-1 hover:text-ice-300 transition-colors font-bold"
            >
              <PhoneCall className="w-3.5 h-3.5 text-ice-400" />
              <span>01140087799</span>
            </a>
            <span className="hidden md:inline text-brand-400">|</span>
            <span className="hidden lg:inline text-slate-300">موزع معتمد (شارب - كاريير - LG - فريش)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="glass border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 md:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Logo & Brand */}
            <div 
              onClick={() => navigateToSection('hero-section', 'home')} 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl bg-white p-1 shadow-md border border-slate-100 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-glow">
                <img 
                  src="/logo.jpg" 
                  alt="تربو كوول للتكييف والتبريد Turbo Cool" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/100x100?text=Turbo+Cool';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base sm:text-xl md:text-2xl text-brand-900 tracking-tight leading-tight">
                    تربو كوول
                  </span>
                  <span className="text-[10px] sm:text-xs bg-brand-100 text-brand-700 font-bold px-1.5 py-0.5 rounded-md border border-brand-200 hidden sm:inline-block">
                    موزع معتمد
                  </span>
                </div>
                <span className="text-[9px] sm:text-[11px] md:text-xs font-semibold text-slate-500 tracking-wide uppercase leading-tight">
                  TURBO COOL CONDITIONING
                </span>
              </div>
            </div>

            {/* Search Bar - Tablet & Desktop */}
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-2 lg:mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="ابحث عن موديل (شارب 1.5، كاريير انفرتر...)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim() && activeTab !== 'catalog') {
                      navigateToSection('catalog-section', 'catalog');
                    }
                  }}
                  className="w-full bg-slate-100/90 text-slate-800 text-xs sm:text-sm rounded-2xl pr-9 pl-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs bg-slate-200 text-slate-600 rounded-full w-4 h-4 flex items-center justify-center hover:bg-slate-300"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              
              {/* Compare Button */}
              <button
                onClick={() => setIsCompareOpen(true)}
                title="مقارنة الأجهزة"
                className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
                {comparisonList.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {comparisonList.length}
                  </span>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => navigateToSection('catalog-section', 'catalog')}
                title="المفضلة"
                className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors hidden sm:flex"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white px-2.5 sm:px-3.5 md:px-4 py-2 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-glow transition-all duration-200 group"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 font-extrabold text-[10px] sm:text-[11px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border border-brand-700 shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-[9px] text-brand-100 font-medium leading-none">السلة</span>
                  <span className="text-xs font-black leading-tight">
                    {cartTotal > 0 ? `${cartTotal.toLocaleString('ar-EG')} ج` : '0 ج'}
                  </span>
                </div>
              </button>

              {/* Mobile / Tablet Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 lg:hidden"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (< md breakpoint) */}
          <div className="mt-2.5 md:hidden">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن موديل (شارب، كاريير، انفرتر...)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim() && activeTab !== 'catalog') {
                    navigateToSection('catalog-section', 'catalog');
                  }
                }}
                className="w-full bg-slate-100 text-slate-800 text-xs rounded-xl pr-8 pl-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links (>= lg) */}
        <div className="hidden lg:block bg-white/90 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2">
              <nav className="flex items-center gap-1 font-semibold text-xs xl:text-sm">
                <button
                  onClick={() => navigateToSection('hero-section', 'home')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeTab === 'home' 
                      ? 'bg-brand-50 text-brand-700 font-bold shadow-sm' 
                      : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  الرئيسية
                </button>

                {/* Brands Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsBrandsDropdownOpen(!isBrandsDropdownOpen)}
                    onMouseEnter={() => setIsBrandsDropdownOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-all"
                  >
                    <span>الماركات المعتمدة</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isBrandsDropdownOpen && (
                    <div 
                      onMouseLeave={() => setIsBrandsDropdownOpen(false)}
                      className="absolute right-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    >
                      <button
                        onClick={() => selectBrandAndScroll('all')}
                        className="w-full text-right px-4 py-2 text-xs xl:text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-bold flex items-center justify-between"
                      >
                        <span>جميع الماركات</span>
                        <span className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">الكل</span>
                      </button>
                      <hr className="my-1 border-slate-100" />
                      {[
                        { id: 'sharp', name: 'شارب Sharp' },
                        { id: 'carrier', name: 'كاريير Carrier' },
                        { id: 'lg', name: 'إل جي LG' },
                        { id: 'fresh', name: 'فريش Fresh' },
                        { id: 'midea', name: 'ميديا Midea' },
                        { id: 'gree', name: 'جري Gree' },
                        { id: 'tornado', name: 'تورنيدو Tornado' },
                      ].map(brand => (
                        <button
                          key={brand.id}
                          onClick={() => selectBrandAndScroll(brand.id)}
                          className="w-full text-right px-4 py-2 text-xs xl:text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between"
                        >
                          <span>تكييفات {brand.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigateToSection('catalog-section', 'catalog')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeTab === 'catalog' 
                      ? 'bg-brand-50 text-brand-700 font-bold shadow-sm' 
                      : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  كتالوج التكييفات والأسعار
                </button>

                <button
                  onClick={() => navigateToSection('calculator-section', 'calculator')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-brand-700 bg-ice-100/80 hover:bg-ice-200 font-bold transition-all border border-ice-300/40"
                >
                  <Calculator className="w-3.5 h-3.5 text-brand-600" />
                  <span>حاسبة الأحمال</span>
                </button>

                <button
                  onClick={() => navigateToSection('services-section', 'services')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-all"
                >
                  <Wrench className="w-3.5 h-3.5 text-slate-400" />
                  <span>خدمات الصيانة والتركيب</span>
                </button>

                <button
                  onClick={() => navigateToSection('why-us-section', 'why-us')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>الضمان المعتمد</span>
                </button>

                <button
                  onClick={() => navigateToSection('reviews-section', 'reviews')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>آراء العملاء</span>
                </button>
              </nav>

              <div className="flex items-center gap-2">
                <a
                  href="https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%AA%D8%B1%D8%A8%D9%88%20%D9%83%D9%88%D9%88%D9%84%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B9%D8%B1%D9%88%D8%B6%20%D8%A7%D9%84%D8%AA%D9%83%D9%8A%D9%8A%D9%81%D8%A7%D8%AA"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-colors"
                >
                  <span>💬 استشارة مجانية واتساب</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => navigateToSection('hero-section', 'home')}
              className="w-full text-right py-2.5 px-3 rounded-xl text-slate-800 font-bold hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between"
            >
              <span>الرئيسية</span>
            </button>
            <button
              onClick={() => navigateToSection('catalog-section', 'catalog')}
              className="w-full text-right py-2.5 px-3 rounded-xl text-slate-800 font-bold hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between"
            >
              <span>كتالوج الأجهزة والأسعار</span>
              <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">كل الموديلات</span>
            </button>
            <button
              onClick={() => navigateToSection('calculator-section', 'calculator')}
              className="w-full text-right py-2.5 px-3 rounded-xl bg-ice-100/80 text-brand-800 font-bold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-brand-600" />
                <span>حاسبة قدرة التكييف للغرفة</span>
              </div>
              <span className="text-xs bg-brand-600 text-white px-2 py-0.5 rounded-full">أداة ذكية</span>
            </button>
            <button
              onClick={() => navigateToSection('services-section', 'services')}
              className="w-full text-right py-2.5 px-3 rounded-xl text-slate-800 font-bold hover:bg-brand-50 hover:text-brand-700 flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 text-slate-400" />
              <span>خدمات الصيانة والتركيب</span>
            </button>
            <button
              onClick={() => navigateToSection('why-us-section', 'why-us')}
              className="w-full text-right py-2.5 px-3 rounded-xl text-slate-800 font-bold hover:bg-brand-50 hover:text-brand-700 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>مميزات تربو كوول والضمان</span>
            </button>
            <button
              onClick={() => navigateToSection('reviews-section', 'reviews')}
              className="w-full text-right py-2.5 px-3 rounded-xl text-slate-800 font-bold hover:bg-brand-50 hover:text-brand-700 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span>آراء وتقييمات العملاء</span>
            </button>
            
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%AA%D8%B1%D8%A8%D9%88%20%D9%83%D9%88%D9%88%D9%84%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%B7%D9%84%D8%A8%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 text-center bg-emerald-600 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md"
              >
                💬 تواصل واتساب فوري مع المبيعات
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
