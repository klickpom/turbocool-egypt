import React from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';
import { CoolBreezeParticles } from './CoolBreezeParticles';
import { 
  Sparkles, 
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
  const { setActiveTab, storeSettings } = useStore();

  const cleanWhatsapp = (storeSettings?.whatsapp || '201097640898').replace(/[^0-9]/g, '');

  const scrollToSection = (id, tabName) => {
    setActiveTab(tabName);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section id="hero-section" className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-10 pb-16 md:pt-16 md:pb-24">
      {/* Interactive Cool Mist / Frost Particle Engine */}
      <CoolBreezeParticles />

      {/* Background Animated Gradient Orbs */}
      <motion.div 
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.35, 0.2],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-3xl pointer-events-none -z-0"
      />
      <motion.div 
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.3, 0.15],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-sky-400/20 rounded-full blur-3xl pointer-events-none -z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Right Column: Main Text & Animated CTA */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 text-right"
          >
            
            {/* Authorized Badge with Glowing Border */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800/95 to-brand-950/90 border border-sky-400/40 px-4 py-1.5 rounded-full shadow-lg shadow-sky-500/10 backdrop-blur-md cursor-default"
            >
              <Award className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs md:text-sm font-extrabold text-sky-200">
                موزع معتمد رسمي: شارب • كاريير • LG • فريش • ميديا • جري • تورنيدو
              </span>
            </motion.div>

            {/* Main Headline with Animated Gradient Shimmer */}
            <motion.h1 
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.25] text-white"
            >
              عيش في <span className="bg-gradient-to-r from-sky-300 via-teal-200 to-white bg-clip-text text-transparent animate-pulse">نقاء وانتعاش</span> مع{' '}
              <span className="text-sky-400 relative inline-block underline decoration-brand-400 decoration-wavy decoration-2">
                تربو كوول
              </span>
            </motion.h1>

            {/* Slogan & Description */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl"
            >
              نوفر لك أقوى تشكيلة تكييفات أصلية بالضمان المعتمد في مصر، مع خدمات التوريد والتركيب الفوري خلال 24 ساعة، وصيانة دورية وفريون أصلي بأفضل الأسعار المعتمدة.
            </motion.p>

            {/* Key Value Points with Micro-Interactions */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs md:text-sm font-semibold text-slate-200"
            >
              <motion.div 
                whileHover={{ scale: 1.04, y: -2 }}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm hover:border-emerald-400/40 hover:bg-emerald-500/10 transition-all shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
                <span>ضمان معتمد 5-10 سنوات</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.04, y: -2 }}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm hover:border-sky-400/40 hover:bg-sky-500/10 transition-all shadow-sm"
              >
                <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>توريد وتركيب فوري</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.04, y: -2 }}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm hover:border-amber-400/40 hover:bg-amber-500/10 transition-all col-span-2 sm:col-span-1 shadow-sm"
              >
                <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                <span>صيانة وتأسيس هندسي</span>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3.5 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollToSection('catalog-section', 'catalog')}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-600 via-sky-500 to-teal-400 hover:from-brand-500 hover:to-sky-400 text-white font-extrabold text-sm md:text-base px-6 py-3.5 rounded-2xl shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all duration-300 cursor-pointer"
              >
                <span>تصفح أحدث عروض التكييفات</span>
                <ArrowLeft className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollToSection('calculator-section', 'calculator')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm md:text-base px-5 py-3.5 rounded-2xl backdrop-blur-md transition-all duration-200 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-sky-300" />
                <span>احسب قدرة غرفتك 📐</span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                href={`https://wa.me/${cleanWhatsapp}?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%AA%D8%B1%D8%A8%D9%88%20%D9%83%D9%88%D9%88%D9%84%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B9%D8%B1%D9%88%D8%B6%20%D8%A7%D9%84%D8%AA%D9%83%D9%8A%D9%8A%D9%81%D8%A7%D8%AA`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm md:text-base px-4 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>معاينة فنية فورية</span>
              </motion.a>
            </motion.div>

            {/* Quick Stats Counter with Floating Badges */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800"
            >
              <div className="space-y-0.5">
                <div className="text-2xl md:text-3xl font-black text-white">+15,000</div>
                <div className="text-xs text-slate-400 font-medium">عميل سعيد في مصر</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl md:text-3xl font-black text-sky-300">+10</div>
                <div className="text-xs text-slate-400 font-medium">سنوات خبرة معتمدة</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl md:text-3xl font-black text-amber-400">100%</div>
                <div className="text-xs text-slate-400 font-medium">ضمان وأجهزة أصلية</div>
              </div>
            </motion.div>

          </motion.div>

          {/* Left Column: Visual Showcase Card with 3D Float Animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 relative"
          >
            <motion.div 
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              
              {/* Decorative Frame */}
              <div className="relative rounded-3xl bg-gradient-to-tr from-slate-900/95 via-slate-800/90 to-brand-950/80 p-5 border border-sky-400/20 shadow-2xl backdrop-blur-xl">
                
                {/* Floating Top Badge */}
                <motion.div 
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -top-3.5 left-6 bg-gradient-to-r from-rose-600 via-amber-500 to-orange-500 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>خصم الصيف الحصري حتى 30%</span>
                </motion.div>

                {/* Product/Logo Banner Showcase */}
                <div className="rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-800 p-5 text-center space-y-4">
                  <motion.div 
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.08 }}
                    className="w-28 h-28 mx-auto rounded-3xl bg-white p-2 shadow-lg shadow-sky-500/20 flex items-center justify-center cursor-pointer"
                  >
                    <img 
                      src="/logo.jpg" 
                      alt="Turbo Cool Logo" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/150x150?text=Turbo+Cool';
                      }}
                    />
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-black text-white">{storeSettings?.companyName || 'تربو كوول للتكييف والتبريد'}</h3>
                    <p className="text-xs text-sky-300 font-semibold mt-0.5">
                      تجهيز وصيانة وتوريد كافة أنظمة التكييف والتبريد
                    </p>
                  </div>

                  {/* Feature Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-right text-xs pt-1">
                    <motion.div whileHover={{ scale: 1.03 }} className="bg-white/5 rounded-2xl p-3 border border-white/10 hover:border-sky-400/30 transition-all">
                      <span className="text-slate-400 block text-[10px]">تكنولوجيا الإنفرتر</span>
                      <span className="text-sky-200 font-bold">توفير حتى 60% كهرباء</span>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} className="bg-white/5 rounded-2xl p-3 border border-white/10 hover:border-emerald-400/30 transition-all">
                      <span className="text-slate-400 block text-[10px]">سرعة التنفيذ</span>
                      <span className="text-emerald-300 font-bold">تركيب خلال 24 ساعة</span>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} className="bg-white/5 rounded-2xl p-3 border border-white/10 hover:border-sky-400/30 transition-all">
                      <span className="text-slate-400 block text-[10px]">فريون التبريد</span>
                      <span className="text-sky-300 font-bold">غاز R410A فائق النقاء</span>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} className="bg-white/5 rounded-2xl p-3 border border-white/10 hover:border-amber-400/30 transition-all">
                      <span className="text-slate-400 block text-[10px]">التغطية الجغرافية</span>
                      <span className="text-amber-300 font-bold">{storeSettings?.coverageAreas || 'الجيزة والقاهرة الكبرى'}</span>
                    </motion.div>
                  </div>

                  {/* Fast Action button */}
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => scrollToSection('services-section', 'services')}
                    className="w-full py-3.5 bg-gradient-to-r from-sky-400 to-brand-500 hover:from-sky-500 hover:to-brand-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Wrench className="w-4 h-4 text-slate-950" />
                    <span>احجز صيانة أو تركيب فوري</span>
                  </motion.button>
                </div>

                {/* Floating Cool Breeze Tag with Spin Animation */}
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -right-3 bg-slate-900 text-sky-200 border border-sky-400/30 text-xs font-bold px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 backdrop-blur-md"
                >
                  <Wind className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>هواء نقي وتبريد استوائي 100%</span>
                </motion.div>

              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
