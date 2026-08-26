import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Wrench, 
  CreditCard, 
  Clock, 
  CheckCircle,
  Award,
  Sparkles,
  Headphones
} from 'lucide-react';

export const WhyChooseUs = () => {
  const features = [
    {
      icon: Award,
      title: 'موزع معتمد رسمي 100%',
      desc: 'شهادات ضمان معتمدة من الوكيل مباشرة (العربي جروب، ميراكو كاريير، LG، فريش، جري).',
      color: 'from-blue-500 to-brand-600'
    },
    {
      icon: Truck,
      title: 'توريد وتركيب فوري 24 ساعة',
      desc: 'أسطول سيارات وفنيين مجهز لخدمتك في جميع مناطق الجيزة والقاهرة الكبرى دون تأخير.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Wrench,
      title: 'فنيون ومهندسون خبراء',
      desc: 'تركيب بموازين ليزر وفاكيوم للدائرة واستخدام خامات أصلية (نحاس جنوب أفريقي أصلي).',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: ShieldCheck,
      title: 'ضمان شامل ومتابعة دورية',
      desc: 'ضمان كامل على التركيب وقطع الغيار وخدمة تذكير بمواعيد الصيانة الدورية الموسمية.',
      color: 'from-sky-500 to-blue-600'
    },
    {
      icon: CreditCard,
      title: 'أفضل أسعار ودفع عند الاستلام',
      desc: 'أسعار جملة وتخفيضات مستمرة، مع إمكانية الدفع عند الاستلام والمعاينة بعد تشغيل الجهاز.',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Headphones,
      title: 'دعم فني واستشارات مجانية',
      desc: 'فريق هندسي جاهز لمساعدتك في حساب الأحمال التكييفية وتحديد أفضل مكان للتركيب مجاناً.',
      color: 'from-rose-500 to-pink-600'
    }
  ];

  return (
    <section id="why-us-section" className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-800 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-brand-200 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>لماذا يفضل العملاء تربو كوول؟</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">
            خدمة بمعايير هندسية تضمن لك راحة البال 🌟
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            نحن لا نبيع التكييف فحسب، بل نقدم منظومة راحة متكاملة من الاختيار الصحيح وحتى التركيب والصيانة الدائمة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
