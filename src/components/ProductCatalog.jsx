import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { BRANDS, HORSEPOWERS, TYPES } from '../data/products';
import { 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Search,
  Zap,
  ShoppingBag
} from 'lucide-react';

export const ProductCatalog = () => {
  const {
    filteredProducts,
    selectedBrand,
    setSelectedBrand,
    selectedHp,
    setSelectedHp,
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
  } = useStore();

  const resetAllFilters = () => {
    setSelectedBrand('all');
    setSelectedHp('all');
    setSelectedType('all');
    setSearchQuery('');
    setSortBy('popular');
  };

  const hasActiveFilters = selectedBrand !== 'all' || selectedHp !== 'all' || selectedType !== 'all' || searchQuery !== '';

  return (
    <section id="catalog-section" className="py-12 md:py-16 bg-slate-50 border-t border-slate-200/80 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-800 font-extrabold text-xs px-3 py-1 rounded-full border border-brand-200 mb-2">
              <ShoppingBag className="w-3.5 h-3.5 text-brand-600" />
              <span>كتالوج تكييفات 2026 بأسعار المصنع</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              اختر التكييف الأنسب لاحتياجاتك ❄️
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              جميع الأجهزة أصلية بالضمان المعتمد شاملة التوصيل والتركيب والمعاينة الفنية
            </p>
          </div>

          {/* Quick Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm self-start md:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 mr-2" />
            <span className="text-xs font-bold text-slate-600">ترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-2"
            >
              <option value="popular">الأكثر طلباً وشعبية 🔥</option>
              <option value="price-asc">السعر: من الأقل للأعلى 📈</option>
              <option value="price-desc">السعر: من الأعلى للأقل 📉</option>
              <option value="discount">أعلى نسبة خصم 🎁</option>
              <option value="rating">أعلى تقييمات العملاء ⭐</option>
            </select>
          </div>
        </div>

        {/* Filter Toolbar Box */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-md mb-8 space-y-4">
          
          {/* Top Filter Category: Brand selector chips */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                الماركة المعتمدة:
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>إعادة ضبط الفلاتر</span>
                </button>
              )}
            </div>
            
            {/* Scrollable on small mobile, flex wrap on tablet/laptop */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
              {BRANDS.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
                    selectedBrand === brand.id
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{brand.logo}</span>
                  <span>{brand.name}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Horsepower & Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Horsepower Selector */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">
                القدرة بالحصان:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
                {HORSEPOWERS.map(hp => (
                  <button
                    key={hp.id}
                    onClick={() => setSelectedHp(hp.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      selectedHp === hp.id
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {hp.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Selector */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">
                نوع التكييف والتكنولوجيا:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
                {TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      selectedType === type.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Search feedback indicator */}
          {searchQuery && (
            <div className="bg-brand-50 p-2.5 rounded-xl border border-brand-200 flex items-center justify-between text-xs">
              <span className="text-brand-900 font-semibold">
                نتائج البحث عن: <strong className="text-brand-700">"{searchQuery}"</strong>
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-rose-600 font-bold hover:underline"
              >
                إلغاء البحث
              </button>
            </div>
          )}

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs sm:text-sm font-bold text-slate-700">
            تم العثور على <span className="text-brand-600 font-black">{filteredProducts.length}</span> تكييف متاح للتوريد الفوري
          </span>
        </div>

        {/* Products Grid: 1 col on XS, 2 col on SM/MD, 3 col on LG, 4 col on XL */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto my-8">
            <div className="text-5xl">🔍</div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              لم يتم العثور على أجهزة مطابقة لهذه الفلاتر
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              جرب اختيار ماركة أخرى أو تغيير القدرة بالحصان لعرض الأجهزة المتاحة.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-brand-700 transition-colors"
            >
              عرض كافة أجهزة المتجر
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
