import React from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Calculator, 
  ArrowLeft, 
  PhoneCall, 
  CheckCircle2, 
  Flame, 
  Wind,
  Award,
  Zap
} from 'lucide-react';

export const Hero = () => {
  const { setActiveTab } = useStore();

  const scrollToSection = (id, tabName) => {
    setActiveTab(tabName);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero-section" className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-950 to-slate-900 text-white pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Background Animated Gradient Orbs */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-3xl pointer-events-none -z-0"
      />
      <motion.div 
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-ice-400/15 rounded-full blur-3xl pointer-events-none -z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Right Column: Main Text & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-right"
          >
            
            {/* Authorized Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-800/90 to-brand-700/70 border border-brand-400/40 px-4 py-1.5 rounded-full shadow-inner backdrop-blur-md"
            >
              <Award className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs md:text-sm font-extrabold text-ice-200">
                موزع معتمد رسمي: شارب • كاريير • LG • فريش • ميديا • جري • تورنيدو
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.25] text-white"
            >
              عيش في <span className="bg-gradient-to-r from-ice-300 via-sky-200 to-white bg-clip-text text-transparent">نقاء وانتعاش</span> مع{' '}
              <span className="text-ice-400 relative inline-block underline decoration-brand-400 decoration-wavy decoration-2">
                تربو كوول
              </span>
            </motion.h1>

            {/* Slogan & Description */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl"
            >
              نوفر لك أقوى تشكيلة تكييفات أصلية بالضمان المعتمد في مصر، مع خدمات التوريد والتركيب الفوري خلال 24 ساعة، وصيانة دورية وفريون أصلي بأفضل الأسعار المعتمدة.
            </motion.p>

            {/* Key Value Points */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs md:text-sm font-semibold text-slate-200"
            >
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ضمان معتمد 5-10 سنوات</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>توريد وتركيب فوري</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm hover:bg-white/10 transition-colors col-span-2 sm:col-span-1">
                <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                <span>صيانة وتأسيس هندسي</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-3.5 pt-4"
            >
              <button
                onClick={() => scrollToSection('catalog-section', 'catalog')}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-sky-500 hover:from-brand-600 hover:to-sky-600 text-white font-extrabold text-sm md:text-base px-6 py-3.5 rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>تصفح أحدث عروض التكييفات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('calculator-section', 'calculator')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm md:text-base px-5 py-3.5 rounded-2xl backdrop-blur-md transition-all duration-200"
              >
                <Calculator className="w-4 h-4 text-ice-300" />
                <span>احسب قدرة غرفتك 📐</span>
              </button>

              <a
                href="https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%AA%D8%B1%D8%A8%D9%88%20%D9%83%D9%88%D9%88%D9%84%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B9%D8%B1%D9%88%D8%B6%20%D8%A7%D9%84%D8%AA%D9%83%D9%8A%D9%8A%D9%81%D8%A7%D8%AA"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm md:text-base px-4 py-3.5 rounded-2xl shadow-md transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>معاينة فنية فورية</span>
              </a>
            </motion.div>

            {/* Quick Stats Counter */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-800/80"
            >
              <div>
                <div className="text-2xl md:text-3xl font-black text-white">+15,000</div>
                <div className="text-xs text-slate-400 font-medium">عميل سعيد في مصر</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-ice-300">+10</div>
                <div className="text-xs text-slate-400 font-medium">سنوات خبرة معتمدة</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-amber-400">100%</div>
                <div className="text-xs text-slate-400 font-medium">ضمان وأجهزة أصلية</div>
              </div>
            </motion.div>

          </motion.div>

          {/* Left Column: Visual Showcase Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative Frame */}
              <div className="relative rounded-3xl bg-gradient-to-tr from-brand-900/90 via-slate-800/80 to-brand-800/60 p-5 border border-white/15 shadow-2xl backdrop-blur-xl">
                
                {/* Floating Top Badge */}
                <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
                  <Flame className="w-3.5 h-3.5" />
                  <span>خصم الصيف الحصري حتى 30%</span>
                </div>

                {/* Product/Logo Banner Showcase */}
                <div className="rounded-2xl overflow-hidden bg-slate-950/60 border border-white/10 p-5 text-center space-y-4">
                  <div className="w-28 h-28 mx-auto rounded-3xl bg-white p-2 shadow-glow flex items-center justify-center">
                    <img 
                      src="/logo.jpg" 
                      alt="Turbo Cool Logo" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/150x150?text=Turbo+Cool';
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">تربو كوول للتكييف والتبريد</h3>
                    <p className="text-xs text-ice-300 font-semibold mt-0.5">
                      تجهيز وصيانة وتوريد كافة أنظمة التكييف والتبريد
                    </p>
                  </div>

                  {/* Feature Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-right text-xs pt-1">
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                      <span className="text-slate-400 block text-[10px]">تكنولوجيا الإنفرتر</span>
                      <span className="text-ice-200 font-bold">توفير حتى 60% كهرباء</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                      <span className="text-slate-400 block text-[10px]">سرعة التنفيذ</span>
                      <span className="text-emerald-300 font-bold">تركيب خلال 24 ساعة</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                      <span className="text-slate-400 block text-[10px]">فريون التبريد</span>
                      <span className="text-sky-300 font-bold">غاز R410A فائق النقاء</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                      <span className="text-slate-400 block text-[10px]">التغطية الجغرافية</span>
                      <span className="text-amber-300 font-bold">الجيزة والقاهرة الكبرى</span>
                    </div>
                  </div>

                  {/* Fast Action button */}
                  <button 
                    onClick={() => scrollToSection('services-section', 'services')}
                    className="w-full py-3.5 bg-gradient-to-r from-ice-400 to-brand-500 hover:from-ice-500 hover:to-brand-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-4 h-4 text-slate-900" />
                    <span>احجز صيانة أو تركيب فوري</span>
                  </button>
                </div>

                {/* Floating Cool Breeze Tag */}
                <div className="absolute -bottom-4 -right-3 bg-brand-800 text-ice-200 border border-brand-400/40 text-xs font-bold px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 backdrop-blur-md">
                  <Wind className="w-4 h-4 text-ice-300 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>هواء نقي وتبريد استوائي 100%</span>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
