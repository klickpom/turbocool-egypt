import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingCart, 
  Heart, 
  Scale, 
  Eye, 
  ShieldCheck, 
  Zap, 
  Maximize2, 
  Sparkles,
  Check,
  Flame,
  PhoneCall
} from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    addToCart, 
    cart, 
    toggleWishlist, 
    isInWishlist, 
    toggleCompare, 
    isInCompare, 
    setQuickViewProduct,
    handleInstantProductOrder 
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const cartItem = cart.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const savings = product.oldPrice - product.price;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative">
      
      {/* Top Badges Bar */}
      <div className="absolute top-2.5 right-2.5 left-2.5 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex flex-wrap gap-1">
          {product.discount > 0 && (
            <span className="bg-rose-600 text-white font-black text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md flex items-center gap-1">
              <Flame className="w-3 h-3" />
              خصم {product.discount}%
            </span>
          )}
          {product.bestseller && (
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md">
              🔥 الأكثر طلباً
            </span>
          )}
        </div>

        {/* Quick Action Floating Buttons (Wishlist & Compare) */}
        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            onClick={() => toggleCompare(product)}
            title={isCompared ? 'إزالة من المقارنة' : 'إضافة للمقارنة'}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
              isCompared
                ? 'bg-amber-500 text-white font-bold'
                : 'bg-white/90 text-slate-600 hover:text-amber-600 hover:bg-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => toggleWishlist(product)}
            title={isFavorited ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
              isFavorited
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorited ? 'fill-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Image & Quick View Trigger */}
      <div className="relative pt-10 sm:pt-12 pb-3 px-3 sm:px-4 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-40 sm:h-44 md:h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain drop-shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1614633833026-0620ba57a263?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>

        {/* Quick View Button on Hover */}
        <button
          onClick={() => setQuickViewProduct(product)}
          className="absolute inset-x-6 bottom-2 bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] sm:text-xs font-bold py-1.5 sm:py-2 rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-1 shadow-lg transform translate-y-2 group-hover:translate-y-0"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>معاينة المواصفات</span>
        </button>
      </div>

      {/* Product Details Content */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        
        {/* Brand & HP Row */}
        <div>
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <span className="text-[10px] sm:text-xs font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-100 truncate">
              {product.brandName}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg shrink-0">
              {product.hpText}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="font-bold text-slate-900 text-xs sm:text-sm md:text-base line-clamp-2 hover:text-brand-600 cursor-pointer transition-colors leading-snug"
          >
            {product.name}
          </h3>

          <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-0.5 truncate">
            كود: {product.modelCode}
          </div>
        </div>

        {/* Specs highlights */}
        <div className="space-y-1 text-[11px] sm:text-xs text-slate-600 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-500 shrink-0" />
            <span className="truncate">{product.areaCoverage}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium truncate">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{product.energyClass}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-emerald-700 truncate">
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{product.warranty}</span>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="pt-1.5 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl md:text-2xl font-black text-brand-900">
                {product.price.toLocaleString('ar-EG')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-600">ج.م</span>
            </div>
            {product.oldPrice > product.price && (
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
                <span className="text-slate-400 line-through">
                  {product.oldPrice.toLocaleString('ar-EG')} ج
                </span>
                <span className="text-rose-600 font-bold">
                  وفر {savings.toLocaleString('ar-EG')} ج
                </span>
              </div>
            )}
          </div>

          <span className="text-[9px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-md shrink-0">
            تركيب مجاني 🚚
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 pt-1">
          <button
            onClick={() => addToCart(product, 1)}
            className={`w-full py-2 sm:py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all duration-200 ${
              quantityInCart > 0
                ? 'bg-brand-100 text-brand-800 border border-brand-300 hover:bg-brand-200'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow'
            }`}
          >
            {quantityInCart > 0 ? (
              <>
                <Check className="w-3.5 h-3.5 text-brand-700" />
                <span>في السلة ({quantityInCart})</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>أضف للسلة</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleInstantProductOrder(product)}
            className="w-full py-2 sm:py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1 transition-all shadow-sm"
          >
            <span>طلب فوري 💬</span>
          </button>
        </div>

      </div>

    </div>
  );
};
