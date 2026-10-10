import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  TrendingDown, 
  Mail, 
  Smartphone, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Phone, CurrencyCode, PriceAlert } from '../types/phone';
import { formatPrice, convertSAR } from '../utils/currency';
import { useAuth } from '../context/AuthContext';

interface PriceAlertModalProps {
  phone: Phone | null;
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onAlertCreated: (alert: PriceAlert) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  phone,
  isOpen,
  onClose,
  currency,
  onAlertCreated,
}) => {
  const { user } = useAuth();
  const [targetPrice, setTargetPrice] = useState<number>(() => {
    if (!phone) return 0;
    // Default target: 10% below current price
    return Math.round(phone.lowestPriceSAR * 0.9);
  });
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phoneSMS, setPhoneSMS] = useState<string>(user?.phone || '');
  const [notifyBySMS, setNotifyBySMS] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !phone) return null;

  const currentPriceConverted = convertSAR(phone.lowestPriceSAR, currency);
  const discountOptions = [
    { label: 'خصم 5%', factor: 0.95 },
    { label: 'خصم 10%', factor: 0.9 },
    { label: 'خصم 15%', factor: 0.85 },
    { label: 'خصم 20%', factor: 0.8 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صحيح لاستلام التنبيه');
      return;
    }

    if (targetPrice >= phone.lowestPriceSAR) {
      setError('السعر المستهدف يجب أن يكون أقل من السعر الحالي للهاتف');
      return;
    }

    const newAlert: PriceAlert = {
      id: 'alert_' + Date.now(),
      phoneId: phone.id,
      phoneName: phone.nameAr,
      phoneImage: phone.image,
      targetPriceSAR: targetPrice,
      currentPriceSAR: phone.lowestPriceSAR,
      email: email,
      createdAt: new Date().toLocaleDateString('ar-SA'),
    };

    // Save in localStorage alerts list
    try {
      const saved = localStorage.getItem('qarenly_price_alerts');
      const list: PriceAlert[] = saved ? JSON.parse(saved) : [];
      list.push(newAlert);
      localStorage.setItem('qarenly_price_alerts', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    onAlertCreated(newAlert);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950/10 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-950">إنشاء تنبيه انخفاض السعر</h2>
              <p className="text-[11px] font-semibold text-slate-800">سنرسل لك إشعاراً فور وصول السعر لهدفك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-800 hover:text-slate-950 hover:bg-black/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">تم تفعيل التنبيه بنجاح!</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                سنراقب المتاجر (أمازون، نون، جرير، إكسترا) على مدار الساعة ونبلغك فور نزول السعر إلى {formatPrice(targetPrice, currency)}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Snippet */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <img
                  src={phone.image}
                  alt={phone.name}
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-amber-700">{phone.brand}</span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{phone.nameAr}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-slate-500">أقل سعر حالياً:</span>
                    <span className="font-extrabold text-slate-900">
                      {formatPrice(phone.lowestPriceSAR, currency)}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {/* Target Price Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  اختر نسبة الخصم المستهدفة
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {discountOptions.map((opt, i) => {
                    const price = Math.round(phone.lowestPriceSAR * opt.factor);
                    const isSelected = targetPrice === price;
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setTargetPrice(price)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-colors ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block">{opt.label}</span>
                        <span className="block text-[10px] font-semibold opacity-80 mt-0.5">
                          {formatPrice(price, currency)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Target Price Input */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  أو حدد السعر المستهدف يدوياً (بالريال السعودي)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={100}
                    max={phone.lowestPriceSAR - 1}
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 rounded-xl py-2.5 px-3.5 text-sm font-bold text-slate-900 transition-colors focus:outline-none"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-slate-500 pointer-events-none">
                    ر.س (توفير {formatPrice(phone.lowestPriceSAR - targetPrice, currency)})
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  بريدك الإلكتروني لاستلام التنبيه
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 rounded-xl py-2.5 pr-10 pl-3.5 text-xs text-slate-900 transition-colors focus:outline-none text-left"
                  />
                </div>
              </div>

              {/* SMS toggle */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={notifyBySMS}
                  onChange={(e) => setNotifyBySMS(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <span className="text-xs text-slate-600 font-medium">إرسال إشعار رسالة SMS مجاناً عند توفر الصفقة</span>
              </label>

              {notifyBySMS && (
                <div>
                  <input
                    type="tel"
                    value={phoneSMS}
                    onChange={(e) => setPhoneSMS(e.target.value)}
                    placeholder="رقم الجوال: 05XXXXXXXX"
                    dir="ltr"
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 text-left focus:outline-none"
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-[0.99] mt-2 flex items-center justify-center gap-1.5"
              >
                <Bell className="w-4 h-4" />
                تفعيل التنبيه الآن
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
