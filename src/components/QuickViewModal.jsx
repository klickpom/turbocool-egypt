import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  ShoppingCart, 
  ShieldCheck, 
  Zap, 
  Maximize2, 
  CheckCircle, 
  Flame, 
  Share2, 
  PhoneCall,
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

  if (!quickViewProduct) return null;

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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setQuickViewProduct(null)} 
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image & Badges */}
          <div className="p-6 bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-l border-slate-200">
            {quickViewProduct.discount > 0 && (
              <span className="absolute top-4 right-4 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                خصم {quickViewProduct.discount}%
              </span>
            )}

            <div className="w-full h-56 sm:h-64 flex items-center justify-center py-4">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="max-h-full max-w-full object-contain drop-shadow-xl"
              />
            </div>

            <div className="w-full grid grid-cols-2 gap-2 text-center text-xs font-bold pt-2">
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm text-slate-700">
                <span className="text-[10px] text-slate-400 block">نوع الغاز</span>
                {quickViewProduct.specs.gas}
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm text-slate-700">
                <span className="text-[10px] text-slate-400 block">مستوى الصوت</span>
                {quickViewProduct.specs.soundLevel}
              </div>
            </div>
          </div>

          {/* Right Column: Full Specs & Actions */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-brand-100 text-brand-800 px-2.5 py-0.5 rounded-md">
                  {quickViewProduct.brandName}
                </span>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                  {quickViewProduct.hpText}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  متوفر للتوريد الفوري ✓
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900 leading-snug">
                {quickViewProduct.name}
              </h3>
              
              <div className="text-xs text-slate-400 font-mono">
                كود الموديل: {quickViewProduct.modelCode}
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="font-extrabold text-slate-900 block mb-1">أبرز المواصفات الفنية:</span>
              {quickViewProduct.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Price Block */}
            <div className="bg-brand-50/70 p-3.5 rounded-2xl border border-brand-100 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-brand-900">
                    {quickViewProduct.price.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-xs font-bold text-slate-600">جنيه مصري</span>
                </div>
                {savings > 0 && (
                  <div className="text-xs text-slate-400">
                    <span className="line-through">{quickViewProduct.oldPrice.toLocaleString('ar-EG')} ج.م</span>
                    <span className="text-rose-600 font-bold mr-2">وفر {savings.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                )}
              </div>
              
              <div className="text-left text-xs font-bold text-brand-800">
                <span>{quickViewProduct.warranty}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct, 1);
                    setQuickViewProduct(null);
                  }}
                  className="py-3 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>إضافة إلى السلة</span>
                </button>

                <button
                  onClick={() => handleInstantProductOrder(quickViewProduct)}
                  className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
                >
                  <span>طلب فوري واتساب</span>
                </button>
              </div>

              {/* Share, Compare & Wishlist buttons */}
              <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                <button
                  onClick={() => toggleCompare(quickViewProduct)}
                  className={`flex items-center gap-1 hover:text-brand-600 font-bold ${
                    isCompared ? 'text-amber-600' : ''
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isCompared ? 'مضاف للمقارنة' : 'مقارنة الجهاز'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`flex items-center gap-1 hover:text-rose-600 font-bold ${
                    isFavorited ? 'text-rose-600' : ''
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-600' : ''}`} />
                  <span>المفضلة</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 hover:text-brand-600 font-bold"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>مشاركة</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
