import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wind, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';

export const IntroSplash = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsReady(true);
          return 100;
        }
        return prev + 2;
      });
    }, 25);

    return () => clearInterval(timer);
  }, []);

  const handleEnter = () => {
    setIsReady(true);
    onFinish();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-brand-950 via-slate-950 to-brand-900 text-white overflow-hidden select-none"
      >
        {/* Ambient Glowing Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[500px] h-[500px] rounded-full bg-brand-500/20 blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[400px] h-[400px] rounded-full bg-ice-400/20 blur-[90px] pointer-events-none"
        />

        {/* Ice Snowflake & Wind Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: -50,
                opacity: 0,
                scale: Math.random() * 0.7 + 0.3,
              }}
              animate={{
                y: typeof window !== 'undefined' ? window.innerHeight + 50 : 900,
                opacity: [0, 0.7, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'linear',
              }}
              className="absolute text-ice-300/40 text-lg"
            >
              ❄
            </motion.div>
          ))}
        </div>

        {/* Main Center Content Box */}
        <div className="relative z-10 max-w-lg w-full px-6 text-center space-y-6">
          
          {/* Logo with Glow Ring */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-white p-3 shadow-2xl shadow-brand-500/30 border-2 border-brand-400/50 flex items-center justify-center group"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-[28px] border border-ice-400/30 border-dashed pointer-events-none"
            />
            <img
              src="/logo.jpg"
              alt="تربو كوول للتكييف والتبريد Turbo Cool"
              className="w-full h-full object-contain drop-shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/200x200?text=Turbo+Cool';
              }}
            />
          </motion.div>

          {/* Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-800/80 border border-brand-500/40 text-ice-300 text-xs font-bold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>موزع معتمد لأكبر ماركات التكييف في مصر</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              تربو كوول للتكييف والتبريد
            </h1>

            <p className="text-sm sm:text-base text-ice-200 font-semibold max-w-sm mx-auto">
              عيش في نقاء وانتعاش مع أقوى أجهزة التكييف وخدمات الصيانة والتركيب المعتمدة ❄️
            </p>
          </motion.div>

          {/* Progress Bar & Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 pt-2"
          >
            {/* Progress bar */}
            <div className="w-full max-w-xs mx-auto bg-slate-800/90 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-ice-400 via-sky-400 to-brand-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1 text-ice-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> توفير طاقة 60%
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" /> ضمان معتمد 100%
              </span>
            </div>

            {/* Enter Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleEnter}
              className="w-full max-w-xs mx-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-ice-400 via-brand-500 to-sky-500 text-slate-950 font-black text-sm shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <span>دخول المتجر وتصفح العروض</span>
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
