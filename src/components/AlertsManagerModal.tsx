import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Trash2, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  TrendingDown,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { PriceAlert, CurrencyCode } from '../types/phone';
import { formatPrice } from '../utils/currency';

interface AlertsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onSelectPhone: (phoneId: string) => void;
}

export const AlertsManagerModal: React.FC<AlertsManagerModalProps> = ({
  isOpen,
  onClose,
  currency,
  onSelectPhone,
}) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('qarenly_price_alerts');
        if (saved) {
          setAlerts(JSON.parse(saved));
        } else {
          // Preload default demo alert if empty
          const sample: PriceAlert[] = [
            {
              id: 'sample_alert_1',
              phoneId: 'samsung-galaxy-s25-ultra',
              phoneName: 'سامسونج جالاكسي S25 ألترا',
              phoneImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=700&q=80',
              targetPriceSAR: 4400,
              currentPriceSAR: 4699,
              email: 'shopper@example.com',
              createdAt: 'اليوم',
            },
          ];
          setAlerts(sample);
          localStorage.setItem('qarenly_price_alerts', JSON.stringify(sample));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  const deleteAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    try {
      localStorage.setItem('qarenly_price_alerts', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const simulateAlertTrigger = (alert: PriceAlert) => {
    setSimulationToast(`🎉 تجربة التنبيه: مبروك! انخفض سعر "${alert.phoneName}" إلى ${formatPrice(alert.targetPriceSAR, currency)} على متجر أمازون!`);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">تنبيهات الأسعار المجدولة ({alerts.length})</h2>
              <p className="text-[11px] text-slate-500">مراقبة تلقائية لأي انخفاض في أسعار الهواتف المفضلة لديك</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulation Banner */}
        {simulationToast && (
          <div className="p-3 bg-emerald-500 text-white text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span>{simulationToast}</span>
            <button onClick={() => setSimulationToast(null)} className="opacity-80 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-10">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">لا توجد تنبيهات أسعار نشطة حالياً</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                اضغط على أيقونة الجرس في بطاقة أي هاتف لتحديد سعرك المستهدف واستلام إشعار عند نزوله.
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={alert.phoneImage}
                    alt={alert.phoneName}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
                  />
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                      {alert.phoneName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>الهدف: <strong className="text-amber-700 font-extrabold">{formatPrice(alert.targetPriceSAR, currency)}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>الحالي: <strong className="text-slate-700 font-bold">{formatPrice(alert.currentPriceSAR, currency)}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => simulateAlertTrigger(alert)}
                    title="تجربة إشعار التنبيه الآن"
                    className="px-2.5 py-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>تجربة تنبيه</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectPhone(alert.phoneId);
                    }}
                    className="px-2.5 py-1.5 text-[11px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    عرض الهاتف
                  </button>

                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="حذف التنبيه"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
