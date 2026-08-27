import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Ticket, 
  MessageSquare,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    handleWhatsAppCheckout,
    showToast
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'TURBO500' || code === 'TURBO' || code === 'صيف2026') {
      const discountVal = 500;
      setAppliedDiscount(discountVal);
      setCouponSuccess(true);
      showToast('🎉 تم تطبيق كوبون الخصم بقيمة 500 ج.م بنجاح!');
    } else if (code === 'SUMMER10') {
      const discountVal = Math.round(cartTotal * 0.05);
      setAppliedDiscount(discountVal);
      setCouponSuccess(true);
      showToast(`🎉 تم تطبيق كوبون خصم إضافي بقيمة ${discountVal.toLocaleString('ar-EG')} ج.م!`);
    } else {
      showToast('كوبون غير صالح أو منتهي الصلاحية', 'warning');
    }
  };

  const finalTotal = Math.max(0, cartTotal - appliedDiscount);

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!customerPhone.trim()) {
      showToast('يرجى كتابة رقم الهاتف للتواصل لتأكيد التوصيل', 'warning');
      return;
    }

    handleWhatsAppCheckout({
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      notes: orderNotes,
      couponCode: couponSuccess ? couponCode : null,
      discount: appliedDiscount
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 md:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-brand-900 to-brand-800 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-ice-300" />
              <div>
                <h3 className="font-extrabold text-base">سلة المشتريات</h3>
                <span className="text-xs text-slate-300">
                  {cartCount} {cartCount === 1 ? 'جهاز تكييف' : 'أجهزة'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-3xl">
                  🛒
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  سلة المشتريات فارغة حالياً
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  تصفح كتالوج التكييفات واختر الأنسب لمساحة غرفتك واستمتع بعروض الصيف والتركيب الفوري.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  العودة لتصفح التكييفات
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex gap-3 items-center justify-between"
                    >
                      <div className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0 pr-2">
                        <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                          {item.name}
                        </h5>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-bold text-brand-700">{item.hpText}</span>
                          <span>•</span>
                          <span>{item.typeName}</span>
                        </div>
                        <div className="text-xs font-black text-brand-900 mt-1">
                          {item.price.toLocaleString('ar-EG')} ج.م
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="حذف من السلة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black text-slate-800 px-1.5">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <form onSubmit={handleApplyCoupon} className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="كوبون الخصم (جرب: TURBO500)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
                    >
                      تطبيق
                    </button>
                  </div>
                  {couponSuccess && (
                    <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                      ✓ تم تفعيل الخصم ({appliedDiscount.toLocaleString('ar-EG')} ج.م)
                    </span>
                  )}
                </form>

                {/* Customer Checkout Form */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span>بيانات التوصيل والتأكيد:</span>
                  </div>

                  <input
                    type="text"
                    placeholder="الاسم الكريم *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-brand-500"
                    required
                  />

                  <input
                    type="tel"
                    placeholder="رقم الموبايل / الواتساب *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-brand-500 text-right"
                    required
                  />

                  <input
                    type="text"
                    placeholder="العنوان والمنطقة (مثال: الهرم، الدقي، الشيخ زايد...) *"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-brand-500"
                  />

                  <textarea
                    placeholder="ملاحظات التركيب أو موعد مفضل (اختياري)..."
                    rows="2"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2 focus:ring-2 focus:ring-brand-500"
                  ></textarea>
                </div>

                {/* Free Installation Guarantee Banner */}
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold">
                  <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>توصيل ومعاينة وتركيب فوري بواسطة مهندسين معتمدين!</span>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-3 shadow-lg">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>إجمالي الأجهزة:</span>
                  <span>{cartTotal.toLocaleString('ar-EG')} ج.م</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>خصم الكوبون:</span>
                    <span>-{appliedDiscount.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>الشحن والتوريد:</span>
                  <span>مجاني (عرض حصري)</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>المبلغ الإجمالي المطلوب:</span>
                  <span className="text-brand-900 text-lg">
                    {finalTotal.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                onClick={handleSubmitOrder}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>إرسال الطلب وتأكيد الحجز عبر واتساب</span>
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
