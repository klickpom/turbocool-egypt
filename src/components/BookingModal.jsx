import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Wrench, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle, 
  MessageSquare,
  Clock
} from 'lucide-react';

export const BookingModal = () => {
  const { bookingService, setBookingService, handleServiceBookingSubmit } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [preferredTime, setPreferredTime] = useState('صباحاً (10 ص - 2 ظ)');
  const [acDetails, setAcDetails] = useState('تكييف 1.5 حصان شارب');
  const [notes, setNotes] = useState('');

  if (!bookingService) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleServiceBookingSubmit(bookingService, {
      name,
      phone,
      address,
      preferredTime,
      acDetails,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setBookingService(null)} 
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-brand-900 to-brand-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-ice-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">حجز خدمة فنية</h3>
              <p className="text-xs text-slate-300 font-semibold">{bookingService.title}</p>
            </div>
          </div>

          <button
            onClick={() => setBookingService(null)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="bg-brand-50/70 p-3 rounded-xl border border-brand-100 text-xs text-brand-900 font-medium">
            💡 سيصلك فني معتمد مجهز بأحدث أجهزة الفحص والتنظيف، مع ضمان رسمي على الصيانة.
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">الاسم الكريم *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: م. أحمد عبد العزيز"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 focus:ring-2 focus:ring-brand-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">رقم الهاتف / الواتساب للتواصل *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="010XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 focus:ring-2 focus:ring-brand-500 text-right"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">العنوان بالتفصيل والمنطقة *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: الدقي - شارع مصدق - الدور الثالث"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 focus:ring-2 focus:ring-brand-500"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">الموعد المفضل للزيارة</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-500 text-xs"
                >
                  <option value="صباحاً (10 ص - 2 ظ)">الفترة الصباحية (10 ص - 2 ظ)</option>
                  <option value="عصراً (2 ظ - 6 م)">فترة العصر (2 ظ - 6 م)</option>
                  <option value="مساءً (6 م - 10 م)">الفترة المسائية (6 م - 10 م)</option>
                  <option value="عاجل اليوم / طوارئ">عاجل اليوم / طوارئ 🚨</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">نوع التكييف / القدرة</label>
                <input
                  type="text"
                  placeholder="مثال: 2 تكييف 2.25 حصان"
                  value={acDetails}
                  onChange={(e) => setAcDetails(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">وصف العطل أو أي ملاحظات إضافية</label>
              <textarea
                rows="2"
                placeholder="مثال: التكييف لا يبرد ويصدر صوت مروحة خافت..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-500 text-xs"
              ></textarea>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>إرسال وتأكيد الحجز الفوري عبر واتساب</span>
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
