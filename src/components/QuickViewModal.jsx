import React, { useState, useEffect } from 'react';
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
  Heart
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

  useEffect(() => {
    setActiveImage(0);
  }, [quickViewProduct?.id]);

  if (!quickViewProduct) return null;

  const gallery = quickViewProduct.images?.length ? quickViewProduct.images : [quickViewProduct.image];
  const isFavorited = isInWishlist(quickViewProduct.id);
  const isCompared = isInCompare(quickViewProduct.id);
  const savings = quickViewProduct.oldPrice - quickViewProduct.price;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('تم نسخ رابط المنتج بنجاح! 📋');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"
      />

      <div className="relative bg-white rounded-[32px] max-w-5xl w-full shadow-2xl overflow-hidden z-10 border border-slate-200">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 bg-[radial-gradient(circle_at_top,#dbeafe_0%,#ffffff_62%)] flex flex-col items-center justify-center border-b md:border-b-0 md:border-l border-slate-100">
            {quickViewProduct.discount > 0 && (
              <span className="absolute top-4 right-4 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                خصم {quickViewProduct.discount}%
              </span>
            )}

            <div className="w-full h-64 sm:h-80 flex items-center justify-center">
              <img
                src={gallery[activeImage] || quickViewProduct.image}
                alt={quickViewProduct.name}
                className="max-h-full max-w-full object-contain drop-shadow-2xl"
              />
            </div>

            {gallery.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {gallery.slice(0, 4).map((src, index) => (
                  <button
                    key={`qv-${index}`}
                    onClick={() => setActiveImage(index)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden bg-white border ${
                      activeImage === index ? 'border-sky-500 ring-2 ring-sky-200' : 'border-slate-200'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
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

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {quickViewProduct.name}
              </h3>
              <div className="text-xs text-slate-400 font-mono">كود الموديل: {quickViewProduct.modelCode}</div>
              <div className="text-3xl font-black text-[#009CDE]">
                {quickViewProduct.price.toLocaleString('ar-EG')}
                <span className="text-sm font-bold text-slate-500 mr-1">ج.م</span>
              </div>
              {savings > 0 && (
                <div className="text-xs text-slate-400">
                  <span className="line-through">{quickViewProduct.oldPrice.toLocaleString('ar-EG')} ج.م</span>
                  <span className="text-rose-600 font-bold mr-2">وفر {savings.toLocaleString('ar-EG')} ج.م</span>
                </div>
              )}

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-600" />
                  <span>توريد خلال 5 أيام عمل</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>ضمان 5 سنوات معتمد من ميراكو</span>
                </div>
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

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  addToCart(quickViewProduct, 1);
                  setQuickViewProduct(null);
                }}
                className="py-3.5 bg-gradient-to-l from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white font-black text-sm rounded-2xl shadow flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>أضف للسلة</span>
              </button>
              <button
                onClick={() => handleInstantProductOrder(quickViewProduct)}
                className="py-3.5 bg-white hover:bg-sky-50 text-sky-700 font-black text-sm rounded-2xl border border-sky-300 flex items-center justify-center gap-1.5"
              >
                <span>طلب واتساب</span>
              </button>
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
      </div>
    </div>
  );
};
