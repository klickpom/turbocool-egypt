import React from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { 
  X, 
  Trash2, 
  ShoppingCart, 
  Check, 
  Scale, 
  Zap, 
  ShieldCheck, 
  Maximize2,
  PhoneCall
} from 'lucide-react';

export const ComparisonModal = () => {
  const { 
    isCompareOpen, 
    setIsCompareOpen, 
    comparisonList, 
    toggleCompare, 
    clearCompare, 
    addToCart,
    handleInstantProductOrder 
  } = useStore();

  if (!isCompareOpen) return null;

  const comparedProducts = PRODUCTS.filter(p => comparisonList.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCompareOpen(false)} 
        className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-base">مقارنة موديلات التكييف</h3>
              <p className="text-xs text-slate-300">
                مقارنة تفصيلية للمواصفات والأسعار ومعدل استهلاك الكهرباء
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparedProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>إفراغ المقارنة</span>
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-auto p-6">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-3xl">
                ⚖️
              </div>
              <h4 className="text-base font-bold text-slate-800">
                لم تقم بإضافة أجهزة للمقارنة بعد
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                يمكنك الضغط على أيقونة الميزان ⚖️ بجوار أي تكييف في المتجر لمقارنة حتى 4 أجهزة جنباً إلى جنب.
              </p>
            </div>
          ) : (
            <div className="min-w-[650px] overflow-x-auto">
              <div className="grid grid-cols-5 gap-4 items-stretch">
                
                {/* Labels Column */}
                <div className="space-y-4 text-xs font-bold text-slate-500 pt-36">
                  <div className="h-10 flex items-center border-b border-slate-100">الماركة</div>
                  <div className="h-10 flex items-center border-b border-slate-100">القدرة بالحصان</div>
                  <div className="h-10 flex items-center border-b border-slate-100">تكنولوجيا التوفير</div>
                  <div className="h-10 flex items-center border-b border-slate-100">مساحة التغطية</div>
                  <div className="h-10 flex items-center border-b border-slate-100">فترة الضمان</div>
                  <div className="h-10 flex items-center border-b border-slate-100">نوع الفريون</div>
                  <div className="h-10 flex items-center border-b border-slate-100">مستوى الضجيج</div>
                  <div className="h-10 flex items-center border-b border-slate-100">التحكم الذكي / WiFi</div>
                  <div className="h-14 flex items-center border-b border-slate-100">السعر النهائي</div>
                  <div className="h-12 flex items-center">إجراء الطلب</div>
                </div>

                {/* Compared Items Columns */}
                {comparedProducts.map(prod => (
                  <div 
                    key={prod.id} 
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-4 relative flex flex-col justify-between"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => toggleCompare(prod)}
                      className="absolute top-2 left-2 text-slate-400 hover:text-rose-600 p-1"
                      title="حذف من المقارنة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Image & Title */}
                    <div className="space-y-2 text-center h-32 flex flex-col justify-end">
                      <div className="h-20 flex items-center justify-center">
                        <img src={prod.image} alt={prod.name} className="max-h-full object-contain" />
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-2">
                        {prod.name}
                      </h4>
                    </div>

                    {/* Specs values matching labels */}
                    <div className="space-y-4 text-xs font-semibold text-slate-800">
                      <div className="h-10 flex items-center justify-center border-b border-slate-200/60 text-brand-700 font-bold">
                        {prod.brandName}
                      </div>
                      <div className="h-10 flex items-center justify-center border-b border-slate-200/60 font-black">
                        {prod.hpText}
                      </div>
                      <div className="h-10 flex items-center justify-center border-b border-slate-200/60 text-[11px] text-center">
                        {prod.energyClass}
                      </div>
                      <div className="h-10 flex items-center justify-center border-b border-slate-200/60 text-[11px] text-center">
                        {prod.areaCoverage}
                      </div>
                      <div className="h-10 flex items-center justify-center border-b border-slate-200/60 text-[11px] text-emerald-700 text-center">
                        {prod.warranty}
                      </div>
                      <div className="h-10 flex items-center justify-center border-b border-slate-200/60 text-[11px]">
                        {prod.specs.gas}
                      </div>
                      <div className="h-10 flex items-center justify-center border-b border-slate-200/60 text-[11px]">
                        {prod.specs.soundLevel}
                      </div>
                      <div className="h-10 flex items-center justify-center border-b border-slate-200/60 text-[11px]">
                        {prod.specs.wifi}
                      </div>
                      <div className="h-14 flex flex-col items-center justify-center border-b border-slate-200/60 font-black text-brand-900 text-sm">
                        <span>{prod.price.toLocaleString('ar-EG')} ج.م</span>
                        {prod.discount > 0 && (
                          <span className="text-[10px] text-rose-600 font-bold">خصم {prod.discount}%</span>
                        )}
                      </div>
                      <div className="h-12 flex items-center justify-center gap-1 pt-1">
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow text-xs font-bold flex items-center gap-1 w-full justify-center"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>شراء</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
