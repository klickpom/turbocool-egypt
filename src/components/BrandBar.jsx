import React from 'react';
import { useStore } from '../context/StoreContext';
import { BRANDS } from '../data/products';
import { Award, CheckCircle } from 'lucide-react';

export const BrandBar = () => {
  const { selectedBrand, setSelectedBrand, setActiveTab } = useStore();

  const handleBrandClick = (brandId) => {
    setSelectedBrand(brandId);
    const catalogElem = document.getElementById('catalog-section');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white border-b border-slate-200/80 py-8 relative shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-right">
            <Award className="w-5 h-5 text-brand-600" />
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                موزع معتمد لأقوى الماركات العالمية في مصر
              </h2>
              <p className="text-xs text-slate-500">
                اختر الماركة لتصفح جميع الموديلات والقدرات والأسعار المعتمدة بضمان الوكيل
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>توريد مباشر من المصنع والمستورد</span>
          </div>
        </div>

        {/* Brands Badges Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
          {BRANDS.map((b) => {
            const isSelected = selectedBrand === b.id;
            return (
              <button
                key={b.id}
                onClick={() => handleBrandClick(b.id)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center group ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-glow font-bold scale-105'
                    : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200 hover:border-brand-400 hover:shadow-md'
                }`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {b.logo}
                </span>
                <span className="text-xs font-extrabold line-clamp-1">
                  {b.name}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
