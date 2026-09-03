import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShoppingCart,
  ShieldCheck,
  Truck,
  CheckCircle,
  Flame,
  Share2,
  Scale,
  Heart,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const QuickViewModal = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    handleInstantProductOrder,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    showToast
  } = useStore();

  const [activeImage, setActiveImage] = useState(0);
  const [entered, setEntered] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    setActiveImage(0);
    if (!quickViewProduct) {
      setEntered(false);
      return undefined;
    }
    const frame = requestAnimationFrame(() => setEntered(true));
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = prev;
    };
  }, [quickViewProduct?.id]);

  if (!quickViewProduct) return null;

  const gallery = quickViewProduct.images?.length ? quickViewProduct.images : [quickViewProduct.image];
  const isFavorited = isInWishlist(quickViewProduct.id);
  const isCompared = isInCompare(quickViewProduct.id);
  const savings = (quickViewProduct.oldPrice || 0) - quickViewProduct.price;

  const goImage = (dir) => {
    setActiveImage((current) => {
      const next = current + dir;
      if (next < 0) return gallery.length - 1;
      if (next >= gallery.length) return 0;
      return next;
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: quickViewProduct.name, url });
        return;
      }
    } catch {
      // fall through to clipboard
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('تم نسخ رابط المنتج');
    }
  };

  const close = () => {
    setEntered(false);
    window.setTimeout(() => setQuickViewProduct(null), 220);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center">
      <button
        type="button"
        aria-label="إغلاق"
        onClick={close}
        className={`absolute inset-0 bg-slate-950/55 backdrop-blur-[6px] transition-opacity duration-300 ${
          entered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`relative z-10 w-full md:max-w-5xl md:mx-4 bg-white md:rounded-[32px] rounded-t-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[94vh] md:max-h-[88vh] transition-transform duration-300 ease-out ${
          entered ? 'translate-y-0' : 'translate-y-full md:translate-y-8'
        }`}
      >
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <span className="w-12 h-1.5 rounded-full bg-slate-300" />
        </div>

        <button
          onClick={close}
          className="absolute top-3 left-3 z-20 w-10 h-10 rounded-full bg-white/90 shadow text-slate-700 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
          <div
            className="relative bg-[radial-gradient(circle_at_top,#dbeafe_0%,#ffffff_70%)] min-h-[280px] sm:min-h-[340px] flex flex-col items-center justify-center px-4 pt-8 pb-4"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (dx > 40) goImage(-1);
              if (dx < -40) goImage(1);
            }}
          >
            {quickViewProduct.discount > 0 && (
              <span className="absolute top-4 right-4 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                خصم {quickViewProduct.discount}%
              </span>
            )}

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goImage(-1)}
                  className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow items-center justify-center text-slate-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => goImage(1)}
                  className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow items-center justify-center text-slate-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            )}

            <img
              src={gallery[activeImage] || quickViewProduct.image}
              alt={quickViewProduct.name}
              className="max-h-[46vh] md:max-h-[420px] max-w-full object-contain drop-shadow-2xl"
            />

            {gallery.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {gallery.map((src, index) => (
                  <button
                    key={`qv-${index}`}
                    onClick={() => setActiveImage(index)}
                    className={`w-14 h-14 rounded-2xl overflow-hidden bg-white border ${
                      activeImage === index ? 'border-sky-500 ring-2 ring-sky-200' : 'border-slate-200'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-contain p-1" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 sm:p-8 flex flex-col gap-4 pb-28 md:pb-8">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black text-white bg-[#009CDE] px-3 py-1 rounded-full">
                {quickViewProduct.brandName.split(' - ')[0]}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`w-10 h-10 rounded-xl ${isFavorited ? 'bg-rose-100 text-rose-600' : 'bg-rose-50 text-rose-400'}`}
                >
                  <Heart className={`w-4 h-4 mx-auto ${isFavorited ? 'fill-rose-600' : ''}`} />
                </button>
                <button onClick={handleShare} className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600">
                  <Share2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {quickViewProduct.name}
              </h3>
              <div className="text-xs text-slate-400 font-mono mt-1">كود الموديل: {quickViewProduct.modelCode}</div>
            </div>

            <div>
              <div className="text-3xl font-black text-[#009CDE]">
                {quickViewProduct.price.toLocaleString('ar-EG')}
                <span className="text-sm font-bold text-slate-500 mr-1">ج.م</span>
              </div>
              {savings > 0 && (
                <div className="text-xs text-slate-400 mt-1">
                  <span className="line-through">{quickViewProduct.oldPrice.toLocaleString('ar-EG')} ج.م</span>
                  <span className="text-rose-600 font-bold mr-2">وفر {savings.toLocaleString('ar-EG')} ج.م</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-600" />
                <span>توريد خلال 5 أيام عمل</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>{quickViewProduct.warranty || 'ضمان 5 سنوات معتمد من ميراكو'}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-700 bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <span className="font-black text-slate-900 block mb-1">مميزات الجهاز</span>
              {quickViewProduct.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => toggleCompare(quickViewProduct)}
              className={`w-full py-3 rounded-2xl font-bold text-sm border flex items-center justify-center gap-2 ${
                isCompared ? 'bg-sky-50 text-sky-800 border-sky-300' : 'bg-white text-sky-700 border-sky-200'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{isCompared ? 'مضاف للمقارنة' : 'أضف للمقارنة'}</span>
            </button>
          </div>
        </div>

        <div className="sticky bottom-0 grid grid-cols-2 gap-2 p-3 bg-white/95 backdrop-blur-md border-t border-slate-100"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={() => handleInstantProductOrder(quickViewProduct)}
            className="py-3.5 bg-white text-sky-700 font-black text-sm rounded-2xl border border-sky-300"
          >
            طلب واتساب
          </button>
          <button
            onClick={() => {
              addToCart(quickViewProduct, 1);
              close();
            }}
            className="py-3.5 bg-[#009CDE] text-white font-black text-sm rounded-2xl shadow flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="w-4 h-4" />
            أضف للسلة
          </button>
        </div>
      </div>
    </div>
  );
};
