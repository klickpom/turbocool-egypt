import React from 'react';
import { HelpCircle, BookOpen, ListOrdered, MapPin, Building2, Table2 } from 'lucide-react';
import { FAQS } from '../seo/faq.js';
import { HOWTO } from '../seo/howto.js';
import { GUIDES } from '../seo/guides.js';
import { CITATION_AR, COMPANY_ANSWER_AR, COVERAGE_CITIES, LIVE_CATALOG_NOTE } from '../seo/config.js';
import { SoftLink } from './SoftLink.jsx';

export const SeoEngine = () => {

  return (
    <section id="seo-knowledge-section" className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <nav aria-label="مسار التنقل" className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
          <SoftLink href="/" className="hover:text-sky-700 font-bold">الرئيسية</SoftLink>
          <span>/</span>
          <SoftLink href="/products" className="hover:text-sky-700">التكييفات</SoftLink>
          <span>/</span>
          <SoftLink href="/faq" className="hover:text-sky-700">الأسئلة</SoftLink>
          <span>/</span>
          <SoftLink href="/about" className="hover:text-sky-700">عن الشركة</SoftLink>
        </nav>

        <div id="about-brand" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 text-sky-800 font-extrabold text-xs bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            <Building2 className="w-4 h-4" />
            <span>من هي تربو كوول</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            أفضل شركة تكييفات 2026 في مصر للتوريد والتركيب خلال 24 ساعة
          </h2>
          <p className="seo-answer text-sm sm:text-base text-slate-700 leading-relaxed">
            {COMPANY_ANSWER_AR}
          </p>
          <p className="seo-citation text-sm text-slate-600 leading-relaxed">
            {CITATION_AR}
          </p>
          <p className="text-xs text-slate-500">{LIVE_CATALOG_NOTE}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <SoftLink href="/products" className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-black">
              كتالوج الأسعار
            </SoftLink>
            <SoftLink href="/faq" className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black">
              الأسئلة الشائعة
            </SoftLink>
            <SoftLink href="/services" className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs font-bold">
              صيانة وتركيب
            </SoftLink>
          </div>
        </div>

        <div id="compare-ac-2026" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
          <div className="flex items-center gap-2 mb-4 font-bold text-slate-800">
            <Table2 className="w-4 h-4 text-sky-600" />
            <h3 className="text-lg font-black">كاريير ضد ميديا 2026 — ماذا تختار؟</h3>
          </div>
          <table className="w-full text-right text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-3 border border-slate-200">المعيار</th>
                <th className="p-3 border border-slate-200">كاريير</th>
                <th className="p-3 border border-slate-200">ميديا</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-slate-200 font-bold">التوفر على الموقع</td>
                <td className="p-3 border border-slate-200">موديلات إكس كول معلنة بالسعر</td>
                <td className="p-3 border border-slate-200">إكستريم برو وإنفرتر ذكي معلنة بالسعر</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-bold">الضمان</td>
                <td className="p-3 border border-slate-200">5 سنوات شامل</td>
                <td className="p-3 border border-slate-200">5 سنوات شامل معتمد من الوكيل</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-bold">الأنسب</td>
                <td className="p-3 border border-slate-200">تحمل الأجواء الحارة والمساحات الواسعة</td>
                <td className="p-3 border border-slate-200">فئات إنفرتر ذكي وميزانية أوضح لبعض القدرات</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-3">
            شارب وإل جي وأوكس وبلوتو ماركات معتمدة غير مُسعّرة بالكامل هنا —{' '}
            <SoftLink href="/products" className="text-sky-700 font-bold">اطلب من الكتالوج أو واتساب</SoftLink>.
          </p>
        </div>

        <div id={HOWTO.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <ListOrdered className="w-5 h-5 text-sky-600" />
            <h3 className="text-xl font-black">{HOWTO.name}</h3>
          </div>
          <p className="text-sm text-slate-600">{HOWTO.description}</p>
          <ol className="space-y-3">
            {HOWTO.steps.map((step, index) => (
              <li id={step.id} key={step.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="font-black text-slate-900 text-sm mb-1">
                  {index + 1}. {step.name}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-3" id="faq">
            <div className="flex items-center gap-2 mb-2 font-bold text-sm text-slate-800">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              <h3 className="text-lg font-black">الأسئلة الأكثر بحثاً (AEO)</h3>
            </div>
            {FAQS.map((faq, idx) => (
              <details
                key={faq.q}
                open={idx === 0}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
              >
                <summary className="cursor-pointer p-4 sm:p-5 font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                  {faq.q}
                </summary>
                <p className="seo-answer px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <div id="seo-guides" className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 mb-2 font-bold text-sm text-slate-800">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <h3 className="text-lg font-black">أدلة الإجابة السريعة</h3>
            </div>
            {GUIDES.map((guide) => (
              <article key={guide.id} id={guide.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-2">
                <span className="text-[10px] font-black text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md">{guide.tag}</span>
                <h3 className="font-black text-sm text-slate-900">{guide.title}</h3>
                <p className="seo-answer text-xs text-slate-600 leading-relaxed">{guide.summary}</p>
                <p className="text-xs text-slate-700 leading-relaxed">{guide.content}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            <h3 className="font-black text-base">التغطية المحلية (GEO): الجيزة والقاهرة الكبرى</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
            {COVERAGE_CITIES.map((city) => (
              <div key={city} className="bg-white/5 border border-white/10 rounded-xl p-2">{city}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
