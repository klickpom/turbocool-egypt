import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';
import { 
  BadgePercent, 
  TrendingDown, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  PhoneCall, 
  Check, 
  Filter,
  Flame,
  Zap
} from 'lucide-react';

export const AirConditionerPriceTable2026 = () => {
  const { products, handleInstantProductOrder, storeSettings } = useStore();
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [selectedHpFilter, setSelectedHpFilter] = useState('all');

  const filteredItems = products.filter(item => {
    const matchBrand = selectedBrandFilter === 'all' || item.brand === selectedBrandFilter;
    const matchHp = selectedHpFilter === 'all' || item.hp.toString() === selectedHpFilter;
    return matchBrand && matchHp;
  });

  return (
    <section id="prices-2026-section" className="py-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header with Exact Target Keyword */}
        <div className="text-center max-w-4xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-brand-500/20 text-amber-300 font-extrabold text-xs px-4 py-1.5 rounded-full border border-amber-400/30 shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>تحديث رسمي مباشر لأسعار السوق المصري 2026</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            أفضل أسعار التكييفات في مصر 2026 ❄️
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            دليلك الرسمي المحدث لحظياً لأفضل أسعار تكييفات شارب، كاريير، إل جي، فريش، ميديا، جري، وتورنيدو مع توريد وتركيب فوري خلال 24 ساعة وضمان معتمد من الوكيل.
          </p>
        </div>

        {/* Live Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
          
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 shrink-0 ml-1">الماركة:</span>
            {[
              { id: 'all', name: 'الكل' },
              { id: 'carrier', name: 'كاريير' },
              { id: 'midea', name: 'ميديا' },
            ].map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBrandFilter(b.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedBrandFilter === b.id
                    ? 'bg-sky-500 text-slate-950 font-black shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>

          {/* Horsepower Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 shrink-0 ml-1">القدرة:</span>
            {[
              { id: 'all', name: 'جميع القدرات' },
              { id: '1.5', name: '1.5 حصان' },
              { id: '2.25', name: '2.25 حصان' },
              { id: '3', name: '3 حصان' },
              { id: '5', name: '5 حصان' }
            ].map(h => (
              <button
                key={h.id}
                onClick={() => setSelectedHpFilter(h.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedHpFilter === h.id
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {h.name}
              </button>
            ))}
          </div>

        </div>

        {/* Comprehensive Comparison Price Table */}
        <div className="overflow-x-auto rounded-3xl border border-white/15 bg-slate-950/80 shadow-2xl backdrop-blur-xl">
          <table className="w-full text-right text-xs sm:text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-900/90 text-slate-300 font-bold border-b border-white/10 text-xs">
                <th className="py-4 px-4">الموديل والمواصفات</th>
                <th className="py-4 px-3 text-center">القدرة والنوع</th>
                <th className="py-4 px-3 text-center">السعر الرسمي 2026</th>
                <th className="py-4 px-3 text-center">نسبة الخصم والتوفير</th>
                <th className="py-4 px-3 text-center">الضمان المعتمد</th>
                <th className="py-4 px-4 text-center">طلب فوري سريع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredItems.map((item) => {
                const savings = item.oldPrice - item.price;
                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    
                    {/* Model Name & Code */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center shadow-sm">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/80x80?text=AC';
                            }}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs sm:text-sm group-hover:text-sky-300 transition-colors line-clamp-1 block">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            كود الموديل: {item.modelCode}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* HP & Type */}
                    <td className="py-4 px-3 text-center">
                      <span className="inline-block bg-brand-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-0.5 rounded-lg font-bold text-xs">
                        {item.hpText}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1">
                        {item.typeName}
                      </span>
                    </td>

                    {/* Live 2026 Price */}
                    <td className="py-4 px-3 text-center">
                      <div className="font-black text-base sm:text-lg text-emerald-400">
                        {item.price.toLocaleString('ar-EG')} ج.م
                      </div>
                      {item.oldPrice > item.price && (
                        <div className="text-[10px] text-slate-500 line-through">
                          {item.oldPrice.toLocaleString('ar-EG')} ج.م
                        </div>
                      )}
                    </td>

                    {/* Discount & Savings */}
                    <td className="py-4 px-3 text-center">
                      {item.discount > 0 ? (
                        <div className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full text-xs font-black">
                          <Flame className="w-3 h-3 text-rose-400" />
                          <span>خصم {item.discount}% (وفر {savings.toLocaleString('ar-EG')} ج)</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs font-bold">سعر الموزع الرسمي</span>
                      )}
                    </td>

                    {/* Warranty */}
                    <td className="py-4 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-sky-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                        <span className="truncate max-w-[120px]">{item.warranty}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                        تركيب فوري 24 ساعة 🚚
                      </span>
                    </td>

                    {/* WhatsApp Fast Order */}
                    <td className="py-4 px-4 text-center">
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={() => handleInstantProductOrder(item)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1 mx-auto cursor-pointer"
                      >
                        <span>طلب كاش / واتساب 💬</span>
                      </motion.button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Guarantee Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-bold text-slate-300 text-center">
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>أجهزة أصلية 100% مختومة من المصانع الرسمية</span>
          </div>
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>توصيل وتركيب مجاني في الجيزة والقاهرة الكبرى</span>
          </div>
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center justify-center gap-2">
            <BadgePercent className="w-4 h-4 text-amber-400" />
            <span>ضمان أفضل سعر وأعلى قيمة مقابل تكلفة</span>
          </div>
        </div>

      </div>
    </section>
  );
};
