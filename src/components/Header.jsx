import React, { useEffect, useState } from 'react';
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
  ChevronDown,
  Lock
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
    setSelectedBrand,
    storeSettings,
    navigateToView
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBrandsDropdownOpen, setIsBrandsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const glass = scrolled || isMobileMenuOpen;

  return (
    <header className={`fixed lg:sticky top-0 z-50 w-full transition-all duration-300 ${
      glass
        ? 'bg-white/78 lg:bg-white/90 backdrop-blur-xl border-b border-white/50 shadow-[0_8px_30px_rgba(15,23,42,0.08)]'
        : 'bg-white/12 lg:bg-white/85 backdrop-blur-md lg:backdrop-blur-xl border-b border-white/15 lg:border-slate-200'
    }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className={`hidden lg:block text-[11px] sm:text-xs md:text-sm py-1.5 md:py-2 px-3 sm:px-4 ${
        glass ? 'bg-slate-950 text-white' : 'bg-slate-950/80 text-white'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2 text-center sm:text-right">
            <span className="inline-flex items-center gap-1 bg-brand-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px] sm:text-xs shrink-0">
              <Sparkles className="w-3 h-3" /> عروض 2026
            </span>
            <span className="text-slate-200 font-medium truncate text-xs">
              🚚 {storeSettings?.topBanner || 'توريد وتركيب فوري خلال 24 ساعة + معاينة مجانية بالجيزة والقاهرة!'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <a
              href={`tel:${storeSettings?.phone || '01006836537'}`}
              className="flex items-center gap-1.5 hover:text-sky-300 transition-colors font-bold font-mono text-emerald-400"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{storeSettings?.phone || '01006836537'}</span>
            </a>
            <span className="hidden lg:inline text-slate-400 text-xs">موزع معتمد (كاريير - ميديا)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4 py-2 md:py-3">
          <div
            onClick={() => navigateToSection('hero-section', 'home')}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
          >
            <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-2xl p-0.5 flex items-center justify-center overflow-hidden ${
              glass ? 'bg-white shadow-sm border border-white/80' : 'bg-white/20 border border-white/30 lg:bg-white lg:border-slate-200'
            }`}>
              <img
                src="/logo.jpg"
                alt="تربو كوول للتكييف والتبريد Turbo Cool"
                className="w-full h-full object-contain"
                width="48"
                height="48"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`font-black text-[15px] sm:text-xl md:text-2xl tracking-tight leading-tight ${
                glass ? 'text-slate-900' : 'text-white lg:text-slate-900'
              }`}>
                تربو كوول
              </span>
              <span className={`text-[8px] sm:text-[11px] font-bold tracking-wide uppercase leading-tight ${
                glass ? 'text-slate-500' : 'text-white/70 lg:text-slate-500'
              }`}>
                TURBO COOL
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="relative">
              <input
                type="search"
                placeholder="ابحث عن موديل..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim() && activeTab !== 'catalog') {
                    navigateToSection('catalog-section', 'catalog');
                  }
                }}
                className={`w-full text-xs sm:text-sm rounded-full pr-9 pl-3 py-2.5 border focus:outline-none focus:ring-2 focus:ring-sky-400/70 transition-all ${
                  glass
                    ? 'bg-white/70 text-slate-800 border-white/70 placeholder:text-slate-400'
                    : 'bg-white/18 text-white lg:text-slate-800 border-white/25 lg:bg-slate-100 lg:border-slate-200 placeholder:text-white/70 lg:placeholder:text-slate-400'
                }`}
              />
              <Search className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 ${
                glass ? 'text-slate-400' : 'text-white/80 lg:text-slate-400'
              }`} />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setIsCompareOpen(true)}
              title="مقارنة الأجهزة"
              className={`relative p-2 rounded-full transition-colors hidden sm:flex ${
                glass ? 'bg-white/80 text-slate-700' : 'bg-white/15 text-white lg:bg-slate-100 lg:text-slate-700'
              }`}
            >
              <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
              {comparisonList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {comparisonList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateToSection('catalog-section', 'catalog')}
              title="المفضلة"
              className={`relative p-2 rounded-full transition-colors hidden md:flex ${
                glass ? 'bg-white/80 text-slate-700' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 rounded-full bg-[#009CDE] text-white flex items-center justify-center shadow-lg shadow-sky-500/30"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-amber-400 text-slate-900 font-black text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-full lg:hidden ${
                glass ? 'bg-white/80 text-slate-800' : 'bg-white/15 text-white'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block bg-slate-50/80 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <nav className="flex items-center gap-1 font-bold text-xs xl:text-sm">
              <button
                onClick={() => navigateToSection('hero-section', 'home')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'home' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-700 hover:text-brand-600 hover:bg-white'
                }`}
              >
                الرئيسية
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsBrandsDropdownOpen(!isBrandsDropdownOpen)}
                  onMouseEnter={() => setIsBrandsDropdownOpen(true)}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-white transition-all cursor-pointer"
                >
                  <span>الماركات المعتمدة</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                {isBrandsDropdownOpen && (
                  <div
                    onMouseLeave={() => setIsBrandsDropdownOpen(false)}
                    className="absolute right-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50"
                  >
                    <button
                      onClick={() => selectBrandAndScroll('all')}
                      className="w-full text-right px-4 py-2 text-xs xl:text-sm text-slate-800 hover:bg-brand-50 hover:text-brand-700 font-black flex items-center justify-between"
                    >
                      <span>جميع الماركات</span>
                    </button>
                    <hr className="my-1 border-slate-100" />
                    {[
                      { id: 'carrier', name: 'كاريير Carrier' },
                      { id: 'midea', name: 'ميديا Midea' },
                    ].map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => selectBrandAndScroll(brand.id)}
                        className="w-full text-right px-4 py-2 text-xs xl:text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-700 font-bold"
                      >
                        تكييفات {brand.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => navigateToSection('catalog-section', 'catalog')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'catalog' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-700 hover:text-brand-600 hover:bg-white'
                }`}
              >
                كتالوج التكييفات والأسعار
              </button>
              <button
                onClick={() => navigateToSection('calculator-section', 'calculator')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-brand-800 bg-sky-100/80 hover:bg-sky-200 font-extrabold transition-all border border-sky-300/60 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-brand-600" />
                <span>حاسبة الأحمال</span>
              </button>
              <button
                onClick={() => navigateToSection('services-section', 'services')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-white transition-all cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5 text-slate-400" />
                <span>خدمات الصيانة والتركيب</span>
              </button>
              <button
                onClick={() => navigateToSection('why-us-section', 'why-us')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-white transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>الضمان المعتمد</span>
              </button>
              <button
                onClick={() => navigateToSection('reviews-section', 'reviews')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-white transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>آراء العملاء</span>
              </button>
            </nav>
            <a
              href={`https://wa.me/${(storeSettings?.whatsapp || '201097640898').replace(/[^0-9]/g, '')}?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%AA%D8%B1%D8%A8%D9%88%20%D9%83%D9%88%D9%88%D9%84`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-sm"
            >
              💬 استشارة مجانية واتساب
            </a>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-white/40 px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
          <a
            href={`tel:${storeSettings?.phone || '01006836537'}`}
            className="w-full py-2.5 px-3 rounded-2xl bg-emerald-50 text-emerald-700 font-bold flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            {storeSettings?.phone || '01006836537'}
          </a>
          {[
            ['hero-section', 'home', 'الرئيسية'],
            ['catalog-section', 'catalog', 'كتالوج الأجهزة والأسعار'],
            ['calculator-section', 'calculator', 'حاسبة قدرة التكييف'],
            ['services-section', 'services', 'خدمات الصيانة والتركيب'],
            ['why-us-section', 'why-us', 'الضمان المعتمد'],
            ['reviews-section', 'reviews', 'آراء العملاء'],
          ].map(([id, tab, label]) => (
            <button
              key={id}
              onClick={() => navigateToSection(id, tab)}
              className="w-full text-right py-2.5 px-3 rounded-xl text-slate-800 font-bold hover:bg-sky-50"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { setIsMobileMenuOpen(false); setIsCompareOpen(true); }}
            className="w-full text-right py-2.5 px-3 rounded-xl text-slate-800 font-bold hover:bg-sky-50"
          >
            مقارنة الأجهزة
          </button>
          <button
            onClick={() => { setIsMobileMenuOpen(false); navigateToView('admin'); }}
            className="w-full py-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1"
          >
            <Lock className="w-3.5 h-3.5" />
            لوحة تحكم الإدارة
          </button>
        </div>
      )}
    </header>
  );
};
