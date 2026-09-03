import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Scale,
  ShieldCheck,
  Truck,
  Check,
  Flame
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

  const gallery = product.images?.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const cartItem = cart.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const savings = product.oldPrice - product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="bg-white rounded-[28px] border border-slate-200/80 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)] hover:shadow-[0_28px_70px_-30px_rgba(2,132,199,0.55)] hover:border-sky-300 transition-all duration-300 flex flex-col overflow-hidden group"
    >
      <div className="relative bg-[radial-gradient(circle_at_top,#dbeafe_0%,#ffffff_58%)] px-4 pt-4 pb-3">
        <div className="absolute top-3 right-3 left-3 z-20 flex items-start justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1">
            {product.discount > 0 && (
              <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                <Flame className="w-3 h-3" />
                خصم {product.discount}%
              </span>
            )}
            {product.bestseller && (
              <span className="bg-sky-600 text-white font-black text-[10px] px-2 py-1 rounded-full shadow-md">
                الأكثر طلباً
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${
                isFavorited ? 'bg-rose-100 text-rose-600' : 'bg-white/90 text-slate-500 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
            </button>
            <button
              onClick={() => toggleCompare(product)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${
                isCompared ? 'bg-sky-600 text-white' : 'bg-white/90 text-slate-500 hover:text-sky-600'
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => setQuickViewProduct(product)}
          className="w-full h-48 sm:h-52 flex items-center justify-center cursor-pointer"
        >
          <img
            src={gallery[activeImage] || product.image}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain drop-shadow-[0_18px_28px_rgba(15,23,42,0.18)] group-hover:scale-[1.04] transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = product.image;
            }}
          />
        </button>

        {gallery.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-2">
            {gallery.slice(0, 3).map((src, index) => (
              <button
                key={`${product.id}-thumb-${index}`}
                onClick={() => setActiveImage(index)}
                className={`w-12 h-12 rounded-xl overflow-hidden bg-white border ${
                  activeImage === index ? 'border-sky-500 ring-2 ring-sky-200' : 'border-slate-200'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-black text-white bg-[#009CDE] px-3 py-1 rounded-full">
              {product.brandName.split(' - ')[0]}
            </span>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              {product.hpText}
            </span>
          </div>
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="font-black text-slate-900 text-sm sm:text-[15px] leading-snug line-clamp-2 cursor-pointer hover:text-sky-700"
          >
            {product.name}
          </h3>
          <div className="text-[11px] text-slate-400 font-mono mt-1">{product.modelCode}</div>
        </div>

        <div className="space-y-1.5 text-[12px] text-slate-600">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-sky-600 shrink-0" />
            <span>توريد خلال 5 أيام عمل</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{product.warranty || 'ضمان 5 سنوات معتمد من ميراكو'}</span>
          </div>
        </div>

        <div className="pt-1 mt-auto">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-2xl font-black text-[#009CDE] leading-none">
                {product.price.toLocaleString('ar-EG')}
                <span className="text-xs font-bold text-slate-500 mr-1">ج.م</span>
              </div>
              {product.oldPrice > product.price && (
                <div className="text-[11px] text-slate-400 line-through mt-1">
                  {product.oldPrice.toLocaleString('ar-EG')} ج.م
                </div>
              )}
            </div>
            {savings > 0 && (
              <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                وفر {savings.toLocaleString('ar-EG')}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => addToCart(product, 1)}
            className={`py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1 ${
              quantityInCart > 0
                ? 'bg-sky-100 text-sky-900 border border-sky-300'
                : 'bg-gradient-to-l from-sky-600 to-sky-500 text-white shadow-md'
            }`}
          >
            {quantityInCart > 0 ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            <span>{quantityInCart > 0 ? `في السلة (${quantityInCart})` : 'أضف للسلة'}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleInstantProductOrder(product)}
            className="py-2.5 rounded-2xl font-black text-xs bg-white text-sky-700 border border-sky-300 hover:bg-sky-50"
          >
            طلب واتساب
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
