import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
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
  BarChart3, 
  Sparkles,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PriceHistoryChartProps {
  history: PriceHistoryPoint[];
  currency: CurrencyCode;
  phoneName: string;
  originalPriceSAR?: number;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  history,
  currency,
  phoneName,
  originalPriceSAR,
}) => {
  const { isArabic } = useLanguage();
  const [timeRange, setTimeRange] = useState<'3m' | '6m'>('3m'); // Defaults to last 3 months
  const [chartType, setChartType] = useState<'area' | 'line'>('area');

  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center text-xs text-slate-400">
        {isArabic
          ? 'لا توجد بيانات تاريخية كافية لتتبع سعر هذا الهاتف حالياً.'
          : 'No historical price data available for this device yet.'}
      </div>
    );
  }

  // Filter based on selected time range (3 months vs full/6 months)
  const displayedHistory = timeRange === '3m' ? history.slice(-3) : history;

  const rawPrices = displayedHistory.map((h) => h.priceSAR);
  const minRawPrice = Math.min(...rawPrices);
  const maxRawPrice = Math.max(...rawPrices);
  const currentRawPrice = displayedHistory[displayedHistory.length - 1].priceSAR;
  const launchRawPrice = originalPriceSAR || history[0].priceSAR;
  const priceDiff = launchRawPrice - currentRawPrice;
  const dropPercentage = launchRawPrice > 0 ? Math.round((priceDiff / launchRawPrice) * 100) : 0;

  // Format data for Recharts
  const chartData = displayedHistory.map((item, index) => {
    const convertedPrice = Math.round(convertSAR(item.priceSAR, currency));
    const isLowest = item.priceSAR === minRawPrice;
    return {
      month: item.date,
      price: convertedPrice,
      rawPriceSAR: item.priceSAR,
      store: item.storeName,
      isLowest,
      index,
    };
  });

  const convertedMinPrice = Math.round(convertSAR(minRawPrice, currency));
  const convertedMaxPrice = Math.round(convertSAR(maxRawPrice, currency));
  const yMin = Math.floor(convertedMinPrice * 0.96);
  const yMax = Math.ceil(convertedMaxPrice * 1.04);
  const currencySymbol = CURRENCIES[currency]?.symbol || 'ر.س';

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white text-xs p-3.5 rounded-xl shadow-xl border border-slate-700 space-y-1.5 min-w-[190px] text-right font-sans">
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
            <span className="text-[11px] text-slate-400">
              {isArabic ? 'السعر المسجل:' : 'Recorded Price:'}
            </span>
            <span className="text-sm font-black text-emerald-400">
              {formatPrice(data.rawPriceSAR, currency)}
            </span>
          </div>

          {data.isLowest && (
            <div className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded text-center mt-1">
              ⭐ {isArabic ? 'أدنى سعر في هذه الفترة' : 'Lowest Price in Period'}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header Stat row & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-700/70">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              {isArabic
                ? `مسار تغير الأسعار - ${phoneName}`
                : `Price History Tracker - ${phoneName}`}
            </h4>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-black px-2 py-0.5 rounded-full">
              Recharts
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {timeRange === '3m'
              ? (isArabic ? 'عرض تغيرات السعر خلال آخر 3 أشهر' : 'Displaying price changes over the last 3 months')
              : (isArabic ? 'عرض تغيرات السعر الشاملة (6 أشهر)' : 'Displaying price changes over 6 months')}
          </p>
        </div>

        {/* View Switchers: 3M vs 6M and Area vs Line */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Time Filter buttons */}
          <div className="bg-white dark:bg-slate-800 p-0.5 rounded-xl flex items-center text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-2xs">
            <button
              onClick={() => setTimeRange('3m')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                timeRange === '3m'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isArabic ? 'آخر 3 أشهر' : 'Last 3 Months'}
            </button>
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                timeRange === '6m'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isArabic ? 'آخر 6 أشهر' : 'Last 6 Months'}
            </button>
          </div>

          {/* Area vs Line chart toggle */}
          <button
            onClick={() => setChartType(chartType === 'area' ? 'line' : 'area')}
            title={chartType === 'area' ? 'تبديل إلى خطي' : 'تبديل إلى مساحي'}
            className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1 font-semibold"
          >
            <BarChart3 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">
              {chartType === 'area' ? (isArabic ? 'مساحي' : 'Area') : (isArabic ? 'خطي' : 'Line')}
            </span>
          </button>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
            {isArabic ? 'السعر الحالي الأرخص' : 'Current Lowest'}
          </span>
          <span className="text-base font-black text-slate-900 dark:text-white block">
            {formatPrice(currentRawPrice, currency)}
          </span>
          <span className="text-[10px] text-slate-400">
            {isArabic ? 'لدى' : 'at'} {displayedHistory[displayedHistory.length - 1].storeName}
          </span>
        </div>

        <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/50 shadow-2xs">
          <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block mb-0.5 font-bold">
            {isArabic ? 'أقل سعر مسجل' : 'Lowest Recorded'}
          </span>
          <span className="text-base font-black text-emerald-700 dark:text-emerald-400 block">
            {formatPrice(minRawPrice, currency)}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {isArabic ? 'أفضل توقيت للشراء' : 'Best Buying Price'}
          </span>
        </div>

        <div className="p-2.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
            {isArabic ? 'أعلى سعر بالفترة' : 'Highest in Period'}
          </span>
          <span className="text-base font-bold text-slate-700 dark:text-slate-300 block">
            {formatPrice(maxRawPrice, currency)}
          </span>
          <span className="text-[10px] text-slate-400">
            {isArabic ? 'أعلى نقطة سعر' : 'Peak Price'}
          </span>
        </div>

        <div className="p-2.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
            {isArabic ? 'نسبة الهبوط الكلي' : 'Total Discount'}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
              {dropPercentage > 0 ? `-${dropPercentage}%` : '0%'}
            </span>
            {dropPercentage > 0 && (
              <span className="text-[10px] text-slate-400 font-medium">
                ({formatPrice(priceDiff, currency)})
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400">
            {isArabic ? 'عن السعر الرسمي' : 'from launch MSRP'}
          </span>
        </div>
      </div>

      {/* Recharts Chart Canvas */}
      <div className="w-full h-56 sm:h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradientDetail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                domain={[yMin, yMax]}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={convertedMinPrice}
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#priceGradientDetail)"
                activeDot={{ r: 6, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
                dot={{ r: 4, fill: '#10b981', stroke: '#ffffff', strokeWidth: 1.5 }}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                domain={[yMin, yMax]}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={convertedMinPrice}
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                strokeWidth={3}
                activeDot={{ r: 6, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
                dot={{ r: 4, fill: '#10b981', stroke: '#ffffff', strokeWidth: 1.5 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          {isArabic ? 'الخط الأخضر المنقط يحدد أدنى سعر تم رصده' : 'Dashed line marks the lowest recorded price'}
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {isArabic ? 'تحديث الأسعار يومي وتلقائي' : 'Updated daily across verified retailers'}
        </span>
      </div>
    </div>
  );
};
