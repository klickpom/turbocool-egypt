import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Calculator, 
  Sparkles, 
  Sun, 
  Home, 
  Maximize2, 
  ArrowLeft, 
  CheckCircle, 
  HelpCircle,
  Flame,
  ShieldAlert,
  Zap
} from 'lucide-react';

export const CapacityCalculator = () => {
  const { setSelectedHp, setActiveTab } = useStore();

  const [calcMode, setCalcMode] = useState('dimensions'); // 'dimensions' or 'directArea'
  const [length, setLength] = useState(4);
  const [width, setWidth] = useState(3.5);
  const [directArea, setDirectArea] = useState(14);
  const [ceilingHeight, setCeilingHeight] = useState(2.8);
  const [floorType, setFloorType] = useState('middle'); // 'middle', 'top', 'ground'
  const [sunExposure, setSunExposure] = useState('normal'); // 'normal', 'heavy'
  const [roomType, setRoomType] = useState('bedroom'); // 'bedroom', 'reception', 'office'

  // Calculate actual area
  const area = calcMode === 'dimensions' ? +(length * width).toFixed(1) : +directArea;

  // Calculation Logic
  let factor = 250;
  if (floorType === 'top') factor = 300;
  if (sunExposure === 'heavy') factor += 30;
  if (roomType === 'reception') factor += 20;
  if (roomType === 'office') factor += 40;

  const volume = +(area * ceilingHeight).toFixed(1);
  const calculatedBTU = Math.round(volume * factor);

  // HP Estimation mapping
  let recommendedHp = 1.5;
  let hpText = '1.5 حصان';
  let btuRange = '12,000 وحدة';

  if (calculatedBTU <= 13000) {
    recommendedHp = 1.5;
    hpText = '1.5 حصان';
    btuRange = '12,000 BTU';
  } else if (calculatedBTU <= 19500) {
    recommendedHp = 2.25;
    hpText = '2.25 حصان';
    btuRange = '18,000 BTU';
  } else if (calculatedBTU <= 26500) {
    recommendedHp = 3.0;
    hpText = '3 حصان';
    btuRange = '24,000 BTU';
  } else if (calculatedBTU <= 34000) {
    recommendedHp = 4.0;
    hpText = '4 حصان';
    btuRange = '30,000 - 32,000 BTU';
  } else {
    recommendedHp = 5.0;
    hpText = '5 حصان';
    btuRange = '36,000 - 48,000 BTU';
  }

  const handleApplyFilter = () => {
    setSelectedHp(recommendedHp.toString());
    setActiveTab('catalog');
    const catalogElem = document.getElementById('catalog-section');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="calculator-section" className="py-12 md:py-16 bg-gradient-to-b from-slate-50 to-blue-50/50 relative overflow-hidden">
      {/* Background Subtle Shapes */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-ice-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-800 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-brand-200 shadow-sm">
            <Calculator className="w-4 h-4 text-brand-600" />
            <span>حاسبة الأحمال التكييفية الذكية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            احسب قدرة التكييف المناسبة لغرفتك بدقة 📐
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            لا تشتري تكييف بقدرة غير مناسبة! ادخل أبعاد غرفتك لتعرف الحصان والـ BTU المطلوب لغرفتك بضغطة زر.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Controls Form (7 Cols on desktop/laptop, full on tablet/mobile) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-slate-200/80 space-y-5 sm:space-y-6">
            
            {/* Toggle Input Mode */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <span className="text-xs sm:text-sm font-bold text-slate-800">طريقة إدخال مساحة الغرفة:</span>
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setCalcMode('dimensions')}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all text-center ${
                    calcMode === 'dimensions' 
                      ? 'bg-brand-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  الطول × العرض
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode('directArea')}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all text-center ${
                    calcMode === 'directArea' 
                      ? 'bg-brand-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  المساحة الإجمالية (م²)
                </button>
              </div>
            </div>

            {/* Dimensions Inputs */}
            {calcMode === 'dimensions' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>طول الغرفة:</span>
                    <span className="text-brand-600 font-black text-sm bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-200">{length} م</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={length}
                    onChange={(e) => setLength(+e.target.value)}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>2 م</span>
                    <span>6 م</span>
                    <span>10 م</span>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>عرض الغرفة:</span>
                    <span className="text-brand-600 font-black text-sm bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-200">{width} م</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={width}
                    onChange={(e) => setWidth(+e.target.value)}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>2 م</span>
                    <span>6 م</span>
                    <span>10 م</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>مساحة الغرفة الإجمالية:</span>
                  <span className="text-brand-600 font-black text-base bg-white px-2.5 py-1 rounded-lg shadow-sm border border-slate-200">{directArea} متر مربع</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="60"
                  step="1"
                  value={directArea}
                  onChange={(e) => setDirectArea(+e.target.value)}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>8 م²</span>
                  <span>30 م²</span>
                  <span>60 م²</span>
                </div>
              </div>
            )}

            {/* Room Factors Options */}
            <div className="space-y-4 pt-1">
              
              {/* Floor Level */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  طبيعة الدور / موقع الغرفة في المبنى:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'middle', label: 'دور متكرر', icon: '🏢' },
                    { id: 'top', label: 'دور أخير شمس', icon: '☀️' },
                    { id: 'ground', label: 'أرضي / بدروم', icon: '🏡' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFloorType(opt.id)}
                      className={`p-2.5 sm:p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                        floorType === opt.id
                          ? 'bg-brand-50 border-brand-500 text-brand-800 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span className="text-[11px] sm:text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sun & Usage Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Sun Exposure */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    الواجهة والشمس:
                  </label>
                  <select
                    value={sunExposure}
                    onChange={(e) => setSunExposure(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="normal">واجهة عادية / شمس متوسطة</option>
                    <option value="heavy">واجهة مشمسة وزجاج واسع (+10%)</option>
                  </select>
                </div>

                {/* Room Usage */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    طبيعة الاستخدام:
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="bedroom">غرفة نوم (حمل خفيف)</option>
                    <option value="reception">صالة / ريسبشن (حمل متوسط)</option>
                    <option value="office">مكتب تجاري / شركات (حمل عالي)</option>
                  </select>
                </div>

              </div>

            </div>

          </div>

          {/* Results Summary Box (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-brand-900 via-brand-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl border border-brand-700/50 space-y-5 sm:space-y-6 relative overflow-hidden">
            
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between pb-3 border-b border-brand-800">
              <span className="text-xs font-bold text-ice-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-ice-400" />
                النتيجة التقديرية الموصى بها
              </span>
              <span className="text-xs bg-brand-800 text-brand-200 px-2.5 py-1 rounded-full font-bold">
                مساحة {area} م²
              </span>
            </div>

            {/* Big Recommended Result */}
            <div className="text-center py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md space-y-2">
              <span className="text-xs text-slate-300 font-medium block">
                القدرة التكييفية المثالية لغرفتك:
              </span>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-ice-300 via-sky-200 to-white">
                {hpText}
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-400/20">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                الحمل المقدر: {calculatedBTU.toLocaleString('ar-EG')} BTU ({btuRange})
              </div>
            </div>

            {/* Important Guidance Note */}
            <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed bg-brand-800/40 p-3.5 rounded-xl border border-brand-700/40">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>نصيحة خبراء تربو كوول:</span>
              </div>
              <p>
                جهاز <strong className="text-ice-300 font-bold">{hpText}</strong> يضمن تبريداً سريعاً وتوفيراً فائقاً في الكهرباء مع عمر افتراضي أطول للكمبروسر.
              </p>
            </div>

            {/* Filter Action Button */}
            <button
              onClick={handleApplyFilter}
              className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-sky-400 to-brand-500 hover:from-sky-500 hover:to-brand-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition-all shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>عرض تكييفات {hpText} المتوافقة الآن</span>
              <ArrowLeft className="w-4 h-4 text-slate-950" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
