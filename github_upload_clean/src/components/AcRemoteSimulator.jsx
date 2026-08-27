import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wind, 
  Sparkles, 
  Flame, 
  Leaf, 
  Moon, 
  Plus, 
  Minus, 
  Power, 
  Zap, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AcRemoteSimulator = () => {
  const { setActiveTab } = useStore();
  const [isOn, setIsOn] = useState(true);
  const [temp, setTemp] = useState(20);
  const [mode, setMode] = useState('turbo');

  const handleTempChange = (delta) => {
    if (!isOn) return;
    setTemp(prev => Math.min(30, Math.max(16, prev + delta)));
  };

  const getModeInfo = () => {
    switch (mode) {
      case 'turbo':
        return {
          title: 'وضع التبريد النفاث Turbo Cool 🥶',
          desc: 'تبريد فائق السرعة يخفض حرارة الغرفة إلى 20° في 7 دقائق فقط مع تدفق هواء قوي.',
          color: 'from-cyan-500 to-blue-600',
          speed: 'أقصى سرعة للمروحة',
          power: 'استجابة فائقة'
        };
      case 'eco':
        return {
          title: 'وضع الإنفرتر الموفر للطاقة Eco Inverter 🌱',
          desc: 'توفير حتى 60% من استهلاك الكهرباء بتثبيت درجة الحرارة وسرعة كمبروسر متزنة.',
          color: 'from-emerald-500 to-teal-600',
          speed: 'سرعة ذكية متغيرة',
          power: 'توفير 60% كهرباء'
        };
      case 'plasma':
        return {
          title: 'وضع تنقية البلازما Plasma Purifier ✨',
          desc: 'تعقيم الهواء والقضاء على 99% من البكتيريا والأتربة الدقيقة والروائح الكريهة.',
          color: 'from-indigo-500 to-purple-600',
          speed: 'فلترة نقية متواصلة',
          power: 'هواء نقي وصحي'
        };
      case 'sleep':
        return {
          title: 'وضع النوم الهادئ Sleep Mode 🌙',
          desc: 'تشغيل شبه صامت (19 ديسيبل فقط) مع ضبط الحرارة تلقائياً لنوم صحي ومريح.',
          color: 'from-slate-700 to-slate-900',
          speed: 'صامت فائق الهدوء',
          power: 'راحة قصوى'
        };
      default:
        return { title: '', desc: '', color: '' };
    }
  };

  const modeInfo = getModeInfo();

  const scrollToCatalog = () => {
    setActiveTab('catalog');
    const elem = document.getElementById('catalog-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 relative overflow-hidden border-t border-slate-200/80">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-900 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-brand-200 shadow-sm">
            <Wind className="w-4 h-4 text-brand-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>محاكي تجربة الانتعاش التفاعلي</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            جرّب إحساس التبريد الذكي مع تربو كوول ❄️
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            تحكم في الريموت التفاعلي واكتشف كيف تعمل تقنيات الإنفرتر والتبريد النفاث على راحتك وتوفير أموالك.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center max-w-5xl mx-auto">
          
          {/* Visual AC Unit Display (7 Cols desktop, full tablet/mobile) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* Split Indoor Unit Simulation Box */}
            <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-slate-800 text-white overflow-hidden">
              
              {/* Top Unit Shell */}
              <div className="relative bg-gradient-to-r from-slate-100 via-white to-slate-200 text-slate-900 rounded-2xl p-3.5 sm:p-5 shadow-lg border border-slate-300 flex items-center justify-between">
                
                {/* Brand on AC */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-xs">
                    TC
                  </div>
                  <div>
                    <span className="font-extrabold text-[11px] sm:text-xs text-brand-900 block leading-none">TURBO COOL</span>
                    <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase">DUAL INVERTER</span>
                  </div>
                </div>

                {/* Digital LED Display */}
                <div className="bg-slate-950 text-sky-400 font-mono font-black text-xl sm:text-2xl px-3 sm:px-4 py-1 rounded-xl shadow-inner border border-slate-800 flex items-center gap-1.5 sm:gap-2">
                  {isOn ? (
                    <>
                      <span>{temp}°C</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    </>
                  ) : (
                    <span className="text-slate-600 text-xs sm:text-sm">OFF</span>
                  )}
                </div>
              </div>

              {/* Air Stream Waves Animation when ON */}
              {isOn ? (
                <div className="pt-5 pb-2 space-y-2">
                  <div className="flex justify-around items-center opacity-80">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, 12, 0],
                          opacity: [0.3, 0.9, 0.3],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: 'easeInOut',
                        }}
                        className="text-ice-300 text-xl sm:text-2xl"
                      >
                        ༄
                      </motion.div>
                    ))}
                  </div>

                  {/* Mode Card Info */}
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/10 space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-xs sm:text-sm text-ice-300">
                        {modeInfo.title}
                      </h4>
                      <span className="text-[10px] font-bold bg-brand-500/30 text-ice-200 px-2 py-0.5 rounded-md border border-brand-400/30">
                        {modeInfo.power}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                      {modeInfo.desc}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-6 sm:py-8 text-center text-slate-500 text-xs font-bold">
                  الجهاز في وضع الاستعداد.. اضغط على زر التشغيل ⚡
                </div>
              )}

              {/* Specs badges under unit */}
              <div className="grid grid-cols-3 gap-2 pt-3 sm:pt-4 text-center text-[11px] sm:text-xs">
                <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700">
                  <span className="text-[9px] sm:text-[10px] text-slate-400 block">كفاءة التبريد</span>
                  <span className="font-bold text-emerald-400">{isOn ? '100% نشط' : 'متوقف'}</span>
                </div>
                <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700">
                  <span className="text-[9px] sm:text-[10px] text-slate-400 block">مستوى الصوت</span>
                  <span className="font-bold text-sky-400">{isOn ? '21 ديسيبل' : '0'}</span>
                </div>
                <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700">
                  <span className="text-[9px] sm:text-[10px] text-slate-400 block">استهلاك الطاقة</span>
                  <span className="font-bold text-amber-400">{isOn ? 'A+++ انفرتر' : '0 W'}</span>
                </div>
              </div>

            </div>

            {/* Direct CTA */}
            <button
              onClick={scrollToCatalog}
              className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>تسوق أجهزة التكييف المزودة بهذه التكنولوجيا</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>

          </div>

          {/* Interactive Remote Control Widget (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-xs bg-slate-900 rounded-[32px] sm:rounded-[36px] p-4 sm:p-6 shadow-2xl border-4 border-slate-700 space-y-4 sm:space-y-5 text-white select-none">
              
              {/* Remote Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <div className="text-[10px] sm:text-[11px] font-black tracking-widest text-slate-400">
                  TURBO COOL REMOTE
                </div>
                <button
                  onClick={() => setIsOn(!isOn)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold transition-all shadow-md cursor-pointer ${
                    isOn 
                      ? 'bg-rose-600 text-white shadow-rose-600/40' 
                      : 'bg-emerald-600 text-white shadow-emerald-600/40'
                  }`}
                  title={isOn ? 'إيقاف التشغيل' : 'تشغيل الجهاز'}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              {/* LCD Screen on Remote */}
              <div className="bg-slate-800/90 rounded-2xl p-3.5 sm:p-4 border border-slate-700 shadow-inner text-center space-y-1">
                <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  SET TEMPERATURE
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-ice-300">
                  {isOn ? `${temp}°C` : '--'}
                </div>
                <div className="text-[9px] sm:text-[10px] text-emerald-400 font-bold">
                  {isOn ? modeInfo.speed : 'SYSTEM STANDBY'}
                </div>
              </div>

              {/* Temperature Adjust Buttons */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  onClick={() => handleTempChange(1)}
                  disabled={!isOn || temp >= 30}
                  className="py-2.5 sm:py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-rose-400" />
                  <span>حرارة أعلى</span>
                </button>

                <button
                  onClick={() => handleTempChange(-1)}
                  disabled={!isOn || temp <= 16}
                  className="py-2.5 sm:py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Minus className="w-4 h-4 text-sky-400" />
                  <span>تبريد أقوى</span>
                </button>
              </div>

              {/* Modes Selector Buttons */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-400 text-right">
                  أوضاع التشغيل الذكية:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'turbo', label: 'تربو نفاث', icon: Wind },
                    { id: 'eco', label: 'إنفرتر موفر', icon: Leaf },
                    { id: 'plasma', label: 'تنقية بلازما', icon: Sparkles },
                    { id: 'sleep', label: 'وضع النوم', icon: Moon },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = mode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          if (!isOn) setIsOn(true);
                          setMode(m.id);
                        }}
                        className={`p-2 sm:p-2.5 rounded-xl border text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-brand-600 border-brand-400 text-white shadow-md'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
