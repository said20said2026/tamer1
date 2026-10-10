import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { PriceHistoryPoint, CurrencyCode } from '../types/phone';
import { formatPrice, convertSAR, CURRENCIES } from '../utils/currency';
import { 
  TrendingDown, 
  ArrowDownRight, 
  Store, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Layers, 
  Sparkles 
} from 'lucide-react';

interface RechartsPriceHistoryProps {
  history: PriceHistoryPoint[];
  currency: CurrencyCode;
  phoneName: string;
  originalPriceSAR: number;
}

export const RechartsPriceHistory: React.FC<RechartsPriceHistoryProps> = ({
  history,
  currency,
  phoneName,
  originalPriceSAR,
}) => {
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [timeRange, setTimeRange] = useState<'6m' | '3m'>('6m');

  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-400">
        لا توجد بيانات تاريخية كافية لهذا الهاتف خلال الأشهر الماضية.
      </div>
    );
  }

  // Filter based on selected time range
  const displayedHistory = timeRange === '3m' ? history.slice(-3) : history;

  // Format data for Recharts with converted currency prices
  const chartData = displayedHistory.map((item, index) => {
    const convertedPrice = Math.round(convertSAR(item.priceSAR, currency));
    const convertedOriginal = Math.round(convertSAR(originalPriceSAR, currency));
    const savings = Math.max(0, convertedOriginal - convertedPrice);
    const dropPercentage = originalPriceSAR > 0 ? Math.round(((originalPriceSAR - item.priceSAR) / originalPriceSAR) * 100) : 0;

    return {
      month: item.date,
      price: convertedPrice,
      rawPriceSAR: item.priceSAR,
      store: item.storeName,
      savings,
      dropPercentage,
      isLowest: false, // determined below
      index,
    };
  });

  const rawPrices = displayedHistory.map((h) => h.priceSAR);
  const minRawPrice = Math.min(...rawPrices);
  const maxRawPrice = Math.max(...rawPrices);
  const currentRawPrice = displayedHistory[displayedHistory.length - 1].priceSAR;
  const launchRawPrice = history[0].priceSAR;
  const totalDropSAR = launchRawPrice - currentRawPrice;
  const totalDropPercent = Math.round((totalDropSAR / launchRawPrice) * 100);

  // Mark lowest point
  chartData.forEach((d) => {
    if (d.rawPriceSAR === minRawPrice) {
      d.isLowest = true;
    }
  });

  const convertedMinPrice = Math.round(convertSAR(minRawPrice, currency));
  const convertedMaxPrice = Math.round(convertSAR(maxRawPrice, currency));
  const convertedCurrentPrice = Math.round(convertSAR(currentRawPrice, currency));

  // Determine min & max for Y-axis domain padding
  const yMin = Math.floor(convertedMinPrice * 0.95);
  const yMax = Math.ceil(convertedMaxPrice * 1.05);

  const currencySymbol = CURRENCIES[currency]?.symbol || 'ر.س';

  // Custom Recharts Tooltip Component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs p-3.5 rounded-xl shadow-xl border border-slate-700 space-y-1.5 min-w-[190px] text-right font-sans">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] text-slate-300">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {data.month}
            </span>
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Store className="w-3 h-3" />
              {data.store}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-0.5">
            <span className="text-[11px] text-slate-400">السعر المسجل:</span>
            <span className="text-sm font-black text-emerald-400">
              {formatPrice(data.rawPriceSAR, currency)}
            </span>
          </div>

          {data.dropPercentage > 0 && (
            <div className="flex items-center justify-between text-[11px] text-emerald-300 pt-1 border-t border-slate-800/80">
              <span>نسبة النزول عن الإطلاق:</span>
              <span className="font-extrabold bg-emerald-500/20 px-1.5 py-0.2 rounded">
                -{data.dropPercentage}%
              </span>
            </div>
          )}

          {data.isLowest && (
            <div className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded text-center mt-1">
              ⭐ أدنى سعر تاريخي مسجل
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
      {/* Top Header & Stat Metric Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
              تاريخ تغير أسعار {phoneName} (مكتبة Recharts)
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            رسم بياني تفاعلي يوضح تدرج نزول السعر بين المتاجر خلال الأشهر الستة الماضية
          </p>
        </div>

        {/* Chart View Toggle Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Time range selector */}
          <div className="bg-slate-100 p-0.5 rounded-xl flex items-center text-xs font-bold border border-slate-200/80">
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                timeRange === '6m'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              آخر 6 أشهر
            </button>
            <button
              onClick={() => setTimeRange('3m')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                timeRange === '3m'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              آخر 3 أشهر
            </button>
          </div>

          {/* Area vs Line toggle */}
          <button
            onClick={() => setChartType(chartType === 'area' ? 'line' : 'area')}
            title={chartType === 'area' ? 'التحويل إلى خط بياني' : 'التحويل إلى رسم مساحي'}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200/80 text-xs flex items-center gap-1 font-semibold"
          >
            <BarChart3 className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">{chartType === 'area' ? 'مساحي' : 'خطي'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
          <span className="text-[11px] text-slate-500 block mb-0.5">السعر الحالي الأرخص</span>
          <span className="text-base font-black text-slate-900 block">
            {formatPrice(currentRawPrice, currency)}
          </span>
          <span className="text-[10px] text-slate-400">في {displayedHistory[displayedHistory.length - 1].storeName}</span>
        </div>

        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
          <span className="text-[11px] text-emerald-800 block mb-0.5 font-bold">أدنى سعر مسجل</span>
          <span className="text-base font-black text-emerald-700 block">
            {formatPrice(minRawPrice, currency)}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">أفضل وقت للشراء</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
          <span className="text-[11px] text-slate-500 block mb-0.5">السعر عند الإطلاق</span>
          <span className="text-base font-bold text-slate-700 block">
            {formatPrice(launchRawPrice, currency)}
          </span>
          <span className="text-[10px] text-slate-400">السعر الرسمي المبدئي</span>
        </div>

        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80">
          <span className="text-[11px] text-amber-800 block mb-0.5 font-bold">قيمة الانخفاض الكلي</span>
          <div className="flex items-center gap-1">
            <span className="text-base font-black text-amber-900">
              {formatPrice(totalDropSAR, currency)}
            </span>
          </div>
          {totalDropPercent > 0 && (
            <span className="text-[10px] text-amber-700 font-extrabold flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" />
              تراجع {totalDropPercent}% منذ البداية
            </span>
          )}
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="h-64 sm:h-72 w-full pt-2" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 15, right: 20, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorRechartsPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={chartType === 'area' ? 0.35 : 0.05} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              dy={8}
            />

            <YAxis
              domain={[yMin, yMax]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(val) => `${new Intl.NumberFormat('en-US').format(val)}`}
              dx={-5}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Threshold Reference Line for lowest price */}
            <ReferenceLine
              y={convertedMinPrice}
              stroke="#059669"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `الأدنى: ${new Intl.NumberFormat('en-US').format(convertedMinPrice)} ${currencySymbol}`,
                fill: '#059669',
                fontSize: 10,
                fontWeight: 700,
                position: 'insideBottomRight',
              }}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRechartsPrice)"
              activeDot={{
                r: 7,
                stroke: '#047857',
                strokeWidth: 3,
                fill: '#ffffff',
              }}
              dot={{
                r: 4,
                stroke: '#10b981',
                strokeWidth: 2,
                fill: '#ffffff',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Information */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>مسار السعر الفعلي</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-600 border border-emerald-600 border-dashed inline-block"></span>
            <span>خط القاع السعري التاريخي</span>
          </span>
        </div>

        <span className="text-slate-400">
          مرر المؤشر فوق أي نقطة لعرض اسم المتجر وقيمة التوفير
        </span>
      </div>
    </div>
  );
};
