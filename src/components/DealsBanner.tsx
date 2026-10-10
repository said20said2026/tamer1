import React from 'react';
import { Percent, TrendingDown, ArrowDownRight, Sparkles, ChevronLeft } from 'lucide-react';
import { Phone, CurrencyCode } from '../types/phone';
import { formatPrice } from '../utils/currency';

interface DealsBannerProps {
  phones: Phone[];
  currency: CurrencyCode;
  onSelectPhone: (phoneId: string) => void;
  onFilterDeals: () => void;
}

export const DealsBanner: React.FC<DealsBannerProps> = ({
  phones,
  currency,
  onSelectPhone,
  onFilterDeals,
}) => {
  // Get top 3 biggest drops
  const topDrops = [...phones]
    .sort((a, b) => {
      const dropA = (a.originalPriceSAR - a.lowestPriceSAR) / a.originalPriceSAR;
      const dropB = (b.originalPriceSAR - b.lowestPriceSAR) / b.originalPriceSAR;
      return dropB - dropA;
    })
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-lg border border-slate-800 my-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Banner Top Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-400 flex items-center justify-center font-bold">
              <Percent className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">أكبر انخفاضات الأسعار اليوم</h2>
                <span className="text-[10px] bg-rose-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                  صفقات محدثة
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                هواتف رائدة وصلت لأدنى سعر مسجل لها منذ إطلاقها في المتاجر
              </p>
            </div>
          </div>

          <button
            onClick={onFilterDeals}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>استعراض كافة الهواتف المخفضة</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Top 3 Deals Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topDrops.map((phone) => {
            const savings = phone.originalPriceSAR - phone.lowestPriceSAR;
            const dropPct = Math.round((savings / phone.originalPriceSAR) * 100);

            return (
              <div
                key={phone.id}
                onClick={() => onSelectPhone(phone.id)}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/60 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 p-1.5 shrink-0 overflow-hidden border border-slate-700">
                    <img
                      src={phone.image}
                      alt={phone.name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">{phone.brand}</span>
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                      {phone.nameAr}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[11px] font-black text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <ArrowDownRight className="w-3 h-3" />
                        خصم {dropPct}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block line-through">
                      {formatPrice(phone.originalPriceSAR, currency)}
                    </span>
                    <span className="font-black text-sm text-emerald-400">
                      {formatPrice(phone.lowestPriceSAR, currency)}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2 py-1 rounded-lg">
                    وفر {formatPrice(savings, currency)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
