import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Calculator, 
  ShieldCheck, 
  Wrench, 
  Zap,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SeoContentHub = () => {
  const { setActiveTab } = useStore();
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const faqs = [
    {
      q: 'ما هي أسعار التكييفات في مصر لعام 2026 وما هو أفضل تكييف للشراء؟',
      a: 'تتراوح أسعار التكييفات في مصر لعام 2026 بين 19,000 ج.م للفئة الاقتصادية (تورنيدو وفريش 1.5 حصان بارد) وتصل إلى 32,000 ج.م للفئات الموفرة للكهرباء (شارب وكاريير وإل جي إنفرتر). وتعتبر ماركة شارب (Sharp) وكاريير (Carrier) الأفضل من حيث الاعتمادية وتوفر قطع الغيار الأصلية وسرعة التبريد في الأجواء الحارة.'
    },
    {
      q: 'هل تكييفات الإنفرتر (Inverter) توفر في فاتورة الكهرباء فعلياً؟',
      a: 'نعم، تكنولوجيا الإنفرتر تنظم سرعة دوران الضاغط (الكمبروسر) بدقة وفقاً لدرجة حرارة الغرفة دون فصل وتشغيل متكرر، مما يوفر بين 40% إلى 60% من الاستهلاك الشهري للكهرباء مقارنة بالتكييفات العادية.'
    },
    {
      q: 'كيف أحسب قدرة التكييف بالحصان (HP) المناسبة لمساحة الغرفة؟',
      a: 'المعادلة الهندسية المعتمدة في مصر: مساحة حتى 12-14 م² تحتاج تكييف 1.5 حصان (12,000 BTU)، ومساحة 15-20 م² تحتاج 2.25 حصان (18,000 BTU)، ومساحة 21-28 م² تحتاج 3 حصان (24,000 BTU)، وللمساحات المفتوحة فوق 40 م² يفضل تكييف 5 حصان أو كونسيلد مخفي.'
    },
    {
      q: 'ما هي مدة وتكلفة التوريد والتركيب والمعاينة في الجيزة والقاهرة؟',
      a: 'توفر تربو كوول توريداً وتركيباً فورياً خلال 24 ساعة لجميع مناطق الجيزة والقاهرة الكبرى و6 أكتوبر والشيخ زايد والتجمع الخامس، مع معاينة هندسية مجانية وضمان معتمد من الوكيل الرسمي.'
    },
    {
      q: 'ما هو الفرق بين فريون R410A والفريونات القديمة وكيف يتم الشحن؟',
      a: 'غاز الفريون R410A صديق للبيئة، ذو كفاءة تبريد أعلى وتحمل للحرارة الشديدة. يتم شحن التكييف بعد عمل فاكيوم (تفريغ هواء) واختبار ضغط النيتروجين بالكامل لضمان عدم وجود أي تسريب.'
    }
  ];

  const articles = [
    {
      id: 1,
      title: 'دليل أسعار التكييفات 2026: مقارنة شارب وكاريير وإل جي',
      tag: 'دليل الشراء 2026',
      readTime: '3 دقائق قراءة',
      summary: 'مقارنة هندسية واقتصادية شاملة بين أشهر ماركات التكييف في مصر من حيث استهلاك الكهرباء، أسعار قطع الغيار، ومستوى الضمان.',
      content: `تعتبر تكييفات شارب (ضمان العربي جروب 5 سنوات) الخيار الأول في نقاء الهواء بفضل تكنولوجيا البلازما كلاستر والتبريد فائق السرعة Super Jet. بينما تتفوق تكييفات كاريير (ميراكو كاريير) في قوة تحمل الأجواء الشاقة والريسبشن والمساحات الواسعة. وتتميز تكييفات إل جي بالضاغط المزدوج Dual Inverter مع تحكم ذكي بالكامل عبر تطبيق LG ThinQ.`
    },
    {
      id: 2,
      title: 'تأسيس شبكات النحاس الجنوب أفريقي للمباني والفيلات',
      tag: 'تأسيس هندسي',
      readTime: '4 دقائق قراءة',
      summary: 'أهمية استخدام النحاس الجنوب أفريقي الأصلي بالأقطار المعتمدة وعزل الأرموفليكس لمنع تكثف المياه وتسريب الفريون.',
      content: `التأسيس السليم لمواسير التكييف تحت التشطيب يوفر آلاف الجنيهات مستقبلاً. تستخدم تربو كوول مواسير نحاس جنوب أفريقي أصلية بقطر وسمك معتمد من كاريير وشارب، مع كابلات سويدي أصلية وضغط النيتروجين للتأكد من سلامة المسارات قبل غلق أعمال المحارة والدهانات.`
    },
    {
      id: 3,
      title: 'علامات تدل على أن تكييفك يحتاج لصيانة وغسيل كيميائي',
      tag: 'نصائح صيانة',
      readTime: '2 دقيقة قراءة',
      summary: 'ضعف اندفاع الهواء، خروج روائح كريهة، أو ارتفاع صوت الوحدة الخارجية.. كيف تحافظ على كفاءة التبريد كأنه جديد.',
      content: `تراكم الأتربة على كويل الوحدة الداخلية يقلل كفاءة التبريد بنسبة 30% ويزيد استهلاك الكهرباء. الصيانة الدورية بالغسيل الكيميائي وماكينة ضغط المياه تزيل الفطريات والرواسب وتستعيد التبريد الثلجي الفوري للجهاز.`
    }
  ];

  return (
    <section id="seo-knowledge-section" className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-900 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-sky-300 shadow-sm">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>مركز المعرفة والأسئلة الشائعة 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            دليلك الشامل لشراء وصيانة التكييف في مصر ❄️
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600">
            إجابات مهندسي وخبراء تربو كوول المعتمدة لمساعدتك في اختيار التكييف الأنسب والأوفر لمنزلك أو مكتبك.
          </p>
        </div>

        {/* 2-Column Grid: FAQ Accordion + Knowledge Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FAQ Column (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 mb-2 font-bold text-sm text-slate-800">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              <span>الأسئلة الأكثر تداولاً من العملاء (FAQ):</span>
            </div>

            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-right p-4 sm:p-5 flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-slate-900 hover:text-sky-600 transition-colors cursor-pointer"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <div className="p-1 rounded-lg bg-slate-100 text-slate-500 shrink-0">
                    {openFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Knowledge Cards Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 mb-2 font-bold text-sm text-slate-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>أدلة ومقالات تهمك قبل الشراء:</span>
            </div>

            {articles.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-sky-300 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-xs font-black text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                    {art.tag}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{art.readTime}</span>
                </div>

                <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {art.summary}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">بواسطة فريق مهندسي تربو كوول</span>
                  <button 
                    onClick={() => setSelectedGuide(art)}
                    className="font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                  >
                    قراءة التفاصيل ←
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* GEO Local Coverage Strip */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <h3 className="font-black text-sm sm:text-base text-white">
                  مناطق التغطية والمعاينة الهندسية المجانية (الجيزة والقاهرة الكبرى)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  فريق فني متخصص مجهز بسيارات خدمة متنقلة للتوريد والتركيب الفوري خلال 24 ساعة
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-400/20 w-fit shrink-0">
              ● متاحون الآن للخدمة
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs text-slate-300 font-semibold">
            {[
              'الشيخ زايد و6 أكتوبر',
              'التجمع الخامس والقاهرة الجديدة',
              'الدقي والمهندسين والعجوزة',
              'الهرم وفيصل وحدائق الأهرام',
              'المعادي والمقطم وزهراء المعادي',
              'مدينة نصر ومصر الجديدة',
              'الشروق ومدينتي وبدر',
              'شبرا والزمالك وجاردن سيتي',
              'العاصمة الإدارية الجديدة',
              'طريق مصر إسكندرية الصحراوي'
            ].map((loc, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">{loc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Guide Details Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                {selectedGuide.tag}
              </span>
              <button 
                onClick={() => setSelectedGuide(null)}
                className="text-slate-400 hover:text-slate-600 font-black text-sm"
              >
                ✕
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {selectedGuide.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {selectedGuide.content}
            </p>

            <button
              onClick={() => setSelectedGuide(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              إغلاق
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
};
