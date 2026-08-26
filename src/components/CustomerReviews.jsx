import React from 'react';
import { Star, MessageSquare, CheckCircle, ThumbsUp } from 'lucide-react';

export const CustomerReviews = () => {
  const reviews = [
    {
      name: 'د. طارق المنشاوي',
      location: 'الشيخ زايد - بيفرلي هيلز',
      date: 'منذ يومين',
      rating: 5,
      comment: 'تجربة ممتازة جداً مع تربو كوول.. تم طلب 3 تكييفات شارب إنفرتر وتم التوريد والتركيب في اليوم التالي مباشرة. الفنيين في قمة الاحترام والدقة ونظافة الشغل بالليزر.',
      product: 'شارب 2.25 حصان انفرتر'
    },
    {
      name: 'م. ياسمين الشاذلي',
      location: 'الدقي - الجيزة',
      date: 'منذ 5 أيام',
      rating: 5,
      comment: 'حاسبة القدرة التكييفية في الموقع دقيقة جداً! رشحت لي جهاز 1.5 حصان لغرفة المعيشة وبالفعل تبريده ممتاز ودرجة الحرارة بتوصل للدرجة المطلوبة بسرعة وفاتورة الكهرباء موفرة.',
      product: 'كاريير 1.5 حصان اوبتي ماكس'
    },
    {
      name: 'أ. محمود فؤاد',
      location: 'الهرم - فيصل',
      date: 'منذ أسبوع',
      rating: 5,
      comment: 'خدمة الصيانة الدورية وتنظيف الكويل والشحن عندهم على أعلى مستوى، التكييف رجع كأنه جديد تماماً وبدون أي روائح، وسعرهم أرخص بكتير من مراكز غير معتمدة.',
      product: 'خدمة صيانة وغسيل كيميائي'
    },
    {
      name: 'د. حسام عبد الرازق',
      location: 'التجمع الخامس - القاهرة الجديدة',
      date: 'منذ أسبوعين',
      rating: 5,
      comment: 'قمت بتأسيس شبكة تكييف كونسيلد لفيلا كاملة مع فريق تربو كوول، التزام تام بالمواعيد ونحاس جنوب أفريقي أصلي مع ضغط واختبار النيتروجين. شغل هندسي محترم جداً.',
      product: 'تكييف كونسيلد مخفي كاريير'
    }
  ];

  return (
    <section id="reviews-section" className="py-16 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-amber-300 shadow-sm">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>تقييمات وتجارب العملاء</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">
            ثقة أكثر من 15,000 عميل في خدماتنا ⭐
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            نفخر بتقييم 4.9/5 من عملائنا الكرام في كافة محافظات القاهرة والجيزة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-3xl p-6 border border-slate-200/90 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/70 space-y-1">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>{rev.name}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-brand-600" />
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>{rev.location}</span>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                <div className="text-[10px] text-brand-700 font-semibold bg-brand-50 px-2 py-0.5 rounded-md inline-block mt-1">
                  {rev.product}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
