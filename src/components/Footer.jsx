import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  PhoneCall, 
  MapPin, 
  Clock, 
  ArrowUp,
  Lock
} from 'lucide-react';

export const Footer = () => {
  const { setActiveTab, setSelectedBrand, storeSettings, navigateToView } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSection = (id, tabName) => {
    setActiveTab(tabName);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-14 pb-24 md:pb-12 border-t border-brand-900/60 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 text-right">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="Turbo Cool Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/100x100?text=Turbo+Cool';
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{storeSettings.companyName || 'تربو كوول للتكييف والتبريد'}</h3>
                <p className="text-xs text-ice-300 font-bold uppercase tracking-wider">
                  TURBO COOL CONDITIONING & SERVICE
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              الوجهة الأولى لتوريد وتركيب وصيانة أجهزة التكييف والتبريد في مصر. موزع معتمد لأكبر العلامات التجارية (شارب، كاريير، إل جي، فريش، ميديا، جري، تورنيدو) مع ضمان أصلي وتجهيز هندسي معتمد.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={storeSettings.facebookUrl || "https://www.facebook.com/share/1HKQUrdqZT/"}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm"
                title="صفحتنا الرسمية على فيسبوك"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={`https://wa.me/${storeSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-sm text-sm font-bold"
                title="واتساب مباشر"
              >
                💬
              </a>
              <a
                href={`tel:${storeSettings.phone}`}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-sm"
                title="اتصال هاتفي"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-sm text-ice-200">أقسام المتجر</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => navigateToSection('hero-section', 'home')}
                  className="hover:text-white transition-colors"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateToSection('catalog-section', 'catalog')}
                  className="hover:text-white transition-colors"
                >
                  عروض وتخفيضات التكييفات
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateToSection('calculator-section', 'calculator')}
                  className="hover:text-white transition-colors"
                >
                  حاسبة أحمال الغرفة (الحصان)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateToSection('services-section', 'services')}
                  className="hover:text-white transition-colors"
                >
                  حجز صيانة وتنظيف وتأسيس
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateToSection('why-us-section', 'why-us')}
                  className="hover:text-white transition-colors"
                >
                  الضمان والمميزات
                </button>
              </li>
            </ul>
          </div>

          {/* Brands Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-sm text-ice-200">الماركات المعتمدة</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {['sharp', 'carrier', 'lg', 'fresh', 'midea', 'gree'].map(bId => (
                <li key={bId}>
                  <button 
                    onClick={() => {
                      setSelectedBrand(bId);
                      navigateToSection('catalog-section', 'catalog');
                    }}
                    className="hover:text-white transition-colors capitalize"
                  >
                    تكييفات {bId === 'sharp' ? 'شارب Sharp' : bId === 'carrier' ? 'كاريير Carrier' : bId === 'lg' ? 'إل جي LG' : bId === 'fresh' ? 'فريش Fresh' : bId === 'midea' ? 'ميديا Midea' : 'جري Gree'}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-sm text-ice-200">بيانات التواصل والخدمة</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-bold">المبيعات والواتساب:</span>
                  <a href={`tel:${storeSettings.salesPhone || storeSettings.whatsapp || '01097640898'}`} className="text-white hover:text-ice-300 font-mono">
                    {storeSettings.salesPhone || storeSettings.whatsapp || '01097640898'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-bold">رقم الاتصال المباشر:</span>
                  <a href={`tel:${storeSettings.phone || '01006836537'}`} className="text-white hover:text-ice-300 font-mono">
                    {storeSettings.phone || '01006836537'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-bold">خط الطوارئ 24/7:</span>
                  <a href={`tel:${storeSettings.emergencyPhone || '01023499515'}`} className="text-rose-300 hover:text-white font-mono font-bold">
                    {storeSettings.emergencyPhone || '01023499515'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-bold">نطاق التغطية:</span>
                  <span>{storeSettings.coverageAreas}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-bold">مواعيد العمل:</span>
                  <span>{storeSettings.workingHours}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright row & Admin Link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} - <strong>{storeSettings.companyName || 'تربو كوول للتكييف والتبريد (Turbo Cool)'}</strong>
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateToView('admin')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-sky-400 transition-colors px-2 py-1 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>لوحة تحكم الإدارة</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <span>العودة للأعلى</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
