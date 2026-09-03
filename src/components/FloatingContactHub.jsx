import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneCall, X, Headphones } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FloatingContactHub = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { storeSettings } = useStore();

  const cleanWhatsapp = (storeSettings?.whatsapp || '201097640898').replace(/[^0-9]/g, '');
  const cleanPhone = storeSettings?.phone || '01006836537';
  const cleanEmergency = storeSettings?.emergencyPhone || '01023499515';

  return (
    <div className="hidden lg:block fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40" dir="rtl">
      
      {/* Expanded Quick Options Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-3 bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-slate-200/90 w-72 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">خدمة عملاء تربو كوول</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">● متواجدون الآن للرد فوراً</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%AA%D8%B1%D8%A8%D9%88%20%D9%83%D9%88%D9%88%D9%84%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A3%D8%B3%D8%B9%D8%A7%D8%B1%20%D9%88%D8%B9%D8%B1%D9%88%D8%B6%20%D8%A7%D9%84%D8%AA%D9%83%D9%8A%D9%8A%D9%81%D8%A7%D8%AA`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 p-2.5 rounded-2xl font-bold border border-emerald-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs">
                  💬
                </div>
                <div>
                  <span className="block font-black">واتساب المبيعات (01097640898)</span>
                  <span className="text-[10px] text-emerald-600">استفسارات وحجوزات كاش وتقسيط</span>
                </div>
              </a>

              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-2.5 bg-brand-50 hover:bg-brand-100 text-brand-800 p-2.5 rounded-2xl font-bold border border-brand-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-xl bg-brand-600 text-white flex items-center justify-center text-xs">
                  <PhoneCall className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block font-black">اتصال مباشر (01006836537)</span>
                  <span className="text-[10px] text-brand-600 font-mono">الخط الساخن للمبيعات</span>
                </div>
              </a>

              <a
                href={`tel:${cleanEmergency}`}
                className="flex items-center gap-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 p-2 rounded-2xl font-bold border border-rose-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xs">
                  🚨
                </div>
                <div>
                  <span className="block font-black text-[11px]">طوارئ وصيانة 24/7 (01023499515)</span>
                  <span className="text-[9px] text-rose-600 font-mono">خدمة فنية عاجلة</span>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button with Pulse */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-3.5 rounded-full shadow-2xl shadow-emerald-600/40 border-2 border-white cursor-pointer group"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white animate-ping"></span>
        <span className="text-xl group-hover:rotate-12 transition-transform">💬</span>
        <span className="hidden sm:inline font-black text-xs">تواصل مع المبيعات</span>
      </motion.button>

    </div>
  );
};
