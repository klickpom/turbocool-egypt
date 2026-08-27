import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'كيف أعرف قدرة التكييف المناسبة لمساحة غرفتي؟',
      a: 'تعتمد القدرة على المساحة الإجمالية وطبيعة الدور: غرفة حتى 12-14 م² تحتاج 1.5 حصان، من 15 إلى 20 م² تحتاج 2.25 حصان، ومن 20 إلى 28 م² تحتاج 3 حصان. وإذا كانت الغرفة في الدور الأخير أو معرضة لشمس قوية ينصح باختيار القدرة الأعلى، ويمكنك استخدام حاسبة الأحمال التكييفية الذكية في موقعنا لحسابها بدقة.'
    },
    {
      q: 'ما هو الفرق بين التكييف العادي والتكييف الإنفرتر (Inverter)؟',
      a: 'التكييف الإنفرتر يحتوي على كمبروسر ذكي متغير السرعة يعمل باستمرار بسرعة منخفضة بعد تبريد الغرفة بدلاً من الفصل والتشغيل المتكرر، مما يوفر حتى 50% - 60% من فاتورة الكهرباء الشهرية ويمنحك هدوءاً فائقاً وعمراً أطول للجهاز.'
    },
    {
      q: 'هل التوريد والتركيب مجاني وكيف يتم تحديد الموعد؟',
      a: 'نعم، نوفر عروض التوريد والتركيب المجاني في معظم مناطق الجيزة والقاهرة الكبرى. بعد إتمام طلبك عبر الموقع أو الواتساب، يتواصل معك مهندس التنسيق لتأكيد موعد المعاينة والتركيب خلال 24 إلى 48 ساعة كحد أقصى.'
    },
    {
      q: 'ما هي مدة الضمان وهل الأجهزة أصلية بضمان الوكيل؟',
      a: 'جميع أجهزتنا جديدة تماماً وبالكرتونة الأصلية ومختومة بضمان الوكيل المعتمد في مصر (5 سنوات شاملة على تكييفات شارب وكاريير وفريش وميديا وجري، و10 سنوات على ضاغط إل جي Dual Inverter).'
    },
    {
      q: 'كيف أحجز خدمة صيانة أو شحن فريون لتكييفي الحالي؟',
      a: 'يمكنك الضغط على زر "خدمات الصيانة" واختيار الخدمة المناسبة (تنظيف عميق، كشف تسريب وشحن، فك وتركيب) وملء بياناتك وسيتواصل معك الفني فوراً لتحديد موعد الزيارة المنزلية.'
    }
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-800 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-brand-200 shadow-sm">
            <HelpCircle className="w-4 h-4 text-brand-600" />
            <span>الأسئلة الشائعة والإجابات</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            كل ما تود معرفته عن شراء وصيانة التكييف 💡
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-right p-5 flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-slate-900 hover:text-brand-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-brand-600" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
