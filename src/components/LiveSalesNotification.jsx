import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CheckCircle2, X } from 'lucide-react';

const RECENT_ACTIVITIES = [
  { customer: 'م. هاني السعدني', area: 'الشيخ زايد - الجيزة', item: 'تكييف كاريير 1.5 حصان إكس كول', time: 'منذ 3 دقائق' },
  { customer: 'د. سارة عثمان', area: 'الدقي - الجيزة', item: 'تكييف ميديا 1.5 حصان إكستريم برو', time: 'منذ 7 دقائق' },
  { customer: 'أ. محمود فؤاد', area: 'التجمع الخامس - القاهرة', item: 'تكييف كاريير 2.25 حصان إكس كول إنفرتر', time: 'منذ 12 دقيقة' },
  { customer: 'م. أحمد الشناوي', area: 'الهرم - الجيزة', item: 'خدمة صيانة دورية وغسيل كيميائي', time: 'منذ 18 دقيقة' },
  { customer: 'أ. كريم إبراهيم', area: 'المعادي - القاهرة', item: 'تكييف ميديا AI ECOMASTER إنفرتر', time: 'منذ 24 دقيقة' },
];

export const LiveSalesNotification = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show first after 5 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4500);

    // Loop interval
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % RECENT_ACTIVITIES.length);
        setIsVisible(true);
      }, 800);
    }, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed) return null;
  const current = RECENT_ACTIVITIES[currentIdx];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="hidden md:flex fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 max-w-sm bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-3.5 items-center gap-3 select-none"
          dir="rtl"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <span>{current.customer}</span>
              <span className="text-[10px] text-slate-400">({current.area})</span>
            </div>
            <p className="text-[11px] font-bold text-brand-700 truncate">
              طلب: {current.item}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> تم تأكيد الطلب
              </span>
              <span>•</span>
              <span>{current.time}</span>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-600 p-1 self-start"
            title="إغلاق"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
