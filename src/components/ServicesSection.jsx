import React from 'react';
import { useStore } from '../context/StoreContext';
import { SERVICES } from '../data/services';
import { 
  Wrench, 
  RefreshCw, 
  Sparkles, 
  Gauge, 
  Layers, 
  Zap, 
  CheckCircle2, 
  ArrowLeft,
  PhoneCall,
  Clock,
  ShieldCheck
} from 'lucide-react';

const iconMap = {
  Wrench: Wrench,
  RefreshCw: RefreshCw,
  Sparkles: Sparkles,
  Gauge: Gauge,
  Layers: Layers,
  Zap: Zap
};

export const ServicesSection = () => {
  const { setBookingService } = useStore();

  return (
    <section id="services-section" className="py-16 bg-white border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-ice-100 text-brand-900 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-ice-300 shadow-sm">
            <Wrench className="w-4 h-4 text-brand-600" />
            <span>خدمات فنية وهندسية متكاملة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">
            خدمات الصيانة والتركيب والتأسيس بأيدي خبراء 🛠️
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            فريق فني متخصص ومعتمد من كبرى شركات التكييف، معدات ليزر وأجهزة كشف إلكترونية، مع ضمان معتمد على جميع قطع الغيار والخدمات.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const IconComponent = iconMap[service.icon] || Wrench;
            return (
              <div
                key={service.id}
                className="bg-slate-50 hover:bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-brand-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors shadow-sm">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold text-brand-800 bg-brand-100/80 px-3 py-1 rounded-full border border-brand-200">
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-600 transition-colors">
                      {service.title}
                    </h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                      {service.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xs text-slate-700">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                </div>

                {/* Booking Button */}
                <div className="pt-6 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => setBookingService(service)}
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-black rounded-xl shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all"
                  >
                    <span>طلب حجز الخدمة فوراً</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Emergency Maintenance Callout Banner */}
        <div className="mt-12 bg-gradient-to-r from-brand-900 via-brand-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-right">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Clock className="w-4 h-4" />
              <span>خدمة طوارئ وصيانة سريعة</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black">
              هل تواجه عطلاً مفاجئاً أو تسريب مياه أو توقف التبريد؟
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              فريق طوارئ تربو كوول جاهز لمعاينة وإصلاح جهازك في نفس اليوم داخل جميع مناطق الجيزة والقاهرة الكبرى.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="tel:01140087799"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>اتصل بالطوارئ: 01140087799</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
