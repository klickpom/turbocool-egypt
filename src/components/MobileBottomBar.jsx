import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Home, 
  ShoppingBag, 
  Calculator, 
  Wrench, 
  ShoppingCart
} from 'lucide-react';

export const MobileBottomBar = () => {
  const { 
    cartCount, 
    setIsCartOpen, 
    activeTab, 
    setActiveTab,
    storeSettings
  } = useStore();
  const cleanWhatsapp = (storeSettings?.whatsapp || '201097640898').replace(/[^0-9]/g, '');

  const handleNav = (id, tab) => {
    setActiveTab(tab);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl border-t border-white/60 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] py-1.5 px-2 lg:hidden"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => handleNav('hero-section', 'home')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
            activeTab === 'home' ? 'text-brand-600' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>الرئيسية</span>
        </button>

        {/* Catalog */}
        <button
          onClick={() => handleNav('catalog-section', 'catalog')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
            activeTab === 'catalog' ? 'text-brand-600' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>التكييفات</span>
        </button>

        {/* Calculator */}
        <button
          onClick={() => handleNav('calculator-section', 'calculator')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
            activeTab === 'calculator' ? 'text-brand-600 font-black' : 'text-slate-500'
          }`}
        >
            <Calculator className="w-5 h-5 text-brand-600" />
          <span>الحاسبة</span>
        </button>

        {/* Services */}
        <button
          onClick={() => handleNav('services-section', 'services')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
            activeTab === 'services' ? 'text-brand-600' : 'text-slate-500'
          }`}
        >
          <Wrench className="w-5 h-5" />
          <span>الصيانة</span>
        </button>

        {/* Cart Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-brand-600"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-brand-600 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </div>
          <span>السلة</span>
        </button>

        {/* WhatsApp Fast Call */}
        <a
          href={`https://wa.me/${cleanWhatsapp}?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%AA%D8%B1%D8%A8%D9%88%20%D9%83%D9%88%D9%88%D9%84`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 text-[11px] font-bold text-emerald-600"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            💬
          </div>
          <span>واتساب</span>
        </a>

      </div>
    </div>
  );
};
