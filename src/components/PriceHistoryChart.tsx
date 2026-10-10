import React, { useState, useMemo } from 'react';
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
import { PriceHistoryPoint, CurrencyCode, Phone } from '../types/phone';
import { formatPrice, convertSAR, CURRENCIES } from '../utils/currency';
import { generate30DayPriceHistory, MarketTrendAnalysis } from '../utils/priceTrends';
import {
  TrendingDown,
  TrendingUp,
  Minus,
  ArrowDownRight,
  Store,
  Calendar,
  BarChart3,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ShoppingBag,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface PriceHistoryChartProps {
  history: PriceHistoryPoint[];
  currency: CurrencyCode;
  phoneName: string;
  originalPriceSAR?: number;
  phone?: Phone;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  history,
  currency,
  phoneName,
  originalPriceSAR,
  phone,
}) => {
  const { isArabic } = useLanguage();
  const [timeRange, setTimeRange] = useState<'30d' | '3m' | '6m'>('30d'); // 30 days is the default as requested
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [showRecentLog, setShowRecentLog] = useState(false);

  // Compute 30-day realistic trend analysis for this phone
  const trendAnalysis: MarketTrendAnalysis | null = useMemo(() => {
    if (phone) {
      return generate30DayPriceHistory(phone);
    }
    // If phone object not provided, synthesize mock phone for analysis
    if (history && history.length > 0) {
      const syntheticPhone: Partial<Phone> = {
        id: phoneName.toLowerCase().replace(/\s+/g, '-'),
        lowestPriceSAR: history[history.length - 1].priceSAR,
        originalPriceSAR: originalPriceSAR || history[0].priceSAR,
        offers: history.map((h, i) => ({
          id: `offer-${i}`,
          storeName: h.storeName,
          storeLogoText: h.storeName.slice(0, 2),
          storeColor: '#10b981',
          priceSAR: h.priceSAR,
          originalPriceSAR: originalPriceSAR || h.priceSAR,
          url: '#',
          inStock: true,
          shipping: 'شحن سريع',
          warranty: 'ضمان سنتين',
          rating: 4.8,
          reviewsCount: 120,
          deliveryDays: '1-2 أيام',
        })),
        priceHistory: history,
      };
      return generate30DayPriceHistory(syntheticPhone as Phone);
    }
    return null;
  }, [phone, history, originalPriceSAR, phoneName]);

  if ((!history || history.length === 0) && !trendAnalysis) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center text-xs text-slate-400">
        {isArabic
          ? 'لا توجد بيانات تاريخية كافية لتتبع سعر هذا الهاتف حالياً.'
          : 'No historical price data available for this device yet.'}
      </div>
    );
  }

  // Prepare chart dataset according to selected time range
  const chartData = useMemo(() => {
    if (timeRange === '30d' && trendAnalysis) {
      return trendAnalysis.dailyPoints.map((item) => {
        const converted = Math.round(convertSAR(item.priceSAR, currency));
        return {
          displayLabel: item.date,
          fullDate: item.fullDate,
          relativeText: item.relativeDaysText,
          price: converted,
          rawPriceSAR: item.priceSAR,
          store: item.storeName,
          isLowest: item.isLowest,
          isHighest: item.isHighest,
          isWeekendDeal: item.isWeekendDeal,
          changeSAR: item.changeSAR,
        };
      });
    }

    // Fallback to monthly history for 3m / 6m
    const sourceHistory = timeRange === '3m' ? history.slice(-3) : history;
    const rawPrices = sourceHistory.map((h) => h.priceSAR);
    const minRaw = Math.min(...rawPrices);
    const maxRaw = Math.max(...rawPrices);

    return sourceHistory.map((item) => {
      const converted = Math.round(convertSAR(item.priceSAR, currency));
      return {
        displayLabel: item.date,
        fullDate: item.date,
        relativeText: '',
        price: converted,
        rawPriceSAR: item.priceSAR,
        store: item.storeName,
        isLowest: item.priceSAR === minRaw,
        isHighest: item.priceSAR === maxRaw,
        isWeekendDeal: false,
        changeSAR: 0,
      };
    });
  }, [timeRange, trendAnalysis, history, currency]);

  // Derived metrics for display
  const rawPrices = chartData.map((d) => d.rawPriceSAR);
  const minRawPrice = Math.min(...rawPrices);
  const maxRawPrice = Math.max(...rawPrices);
  const currentRawPrice = chartData[chartData.length - 1]?.rawPriceSAR || 0;
  const convertedMinPrice = Math.round(convertSAR(minRawPrice, currency));
  const convertedMaxPrice = Math.round(convertSAR(maxRawPrice, currency));
  const convertedCurrentPrice = Math.round(convertSAR(currentRawPrice, currency));
  
  // Calculate average for reference line
  const sumPrice = chartData.reduce((acc, curr) => acc + curr.price, 0);
  const avgPrice = Math.round(sumPrice / (chartData.length || 1));

  // Determine domain range with padding
  const yMin = Math.floor(convertedMinPrice * 0.95);
  const yMax = Math.ceil(convertedMaxPrice * 1.05);
  const currencySymbol = CURRENCIES[currency]?.symbol || 'ر.س';

  // Custom Rich Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const diffFromAvg = data.price - avgPrice;
      const diffFromAvgSAR = data.rawPriceSAR - (trendAnalysis?.avgPrice30dSAR || data.rawPriceSAR);

      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white text-xs p-3.5 rounded-xl shadow-2xl border border-slate-700/80 space-y-2 min-w-[210px] text-right font-sans z-50">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5 font-bold">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{data.fullDate || data.displayLabel}</span>
            </span>
            <span className="font-extrabold text-amber-300 flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-md">
              <Store className="w-3 h-3" />
              <span>{data.store}</span>
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-0.5">
            <span className="text-[11px] text-slate-400">
              {isArabic ? 'السعر المسجل:' : 'Recorded Price:'}
            </span>
            <span className="text-base font-black text-emerald-400 tracking-tight">
              {formatPrice(data.rawPriceSAR, currency)}
            </span>
          </div>

          {/* Difference vs average */}
          {diffFromAvgSAR !== 0 && (
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">
                {isArabic ? 'مقارنة بمتوسط الفترة:' : 'Vs Period Average:'}
              </span>
              <span
                className={`font-bold ${
                  diffFromAvgSAR < 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {diffFromAvgSAR < 0 ? '-' : '+'}
                {formatPrice(Math.abs(diffFromAvgSAR), currency)}
              </span>
            </div>
          )}

          {data.isLowest && (
            <div className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-1 rounded-md text-center flex items-center justify-center gap-1 mt-1">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {isArabic ? '⭐ أدنى سعر خلال الـ 30 يوماً الماضية!' : '⭐ 30-Day Period Record Low!'}
              </span>
            </div>
          )}

          {data.isWeekendDeal && (
            <div className="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded text-center mt-1">
              🔥 عرض خاص في عطلة نهاية الأسبوع
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5 transition-colors">
      {/* Top Header & Range Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-700/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shadow-2xs">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {isArabic
                ? `مخطط تغيرات الأسعار واتجاهات السوق - ${phoneName}`
                : `Price History & Market Trends - ${phoneName}`}
            </h4>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300/40 dark:border-emerald-700/40">
              Recharts
            </span>

            {/* Trend Direction Badge */}
            {trendAnalysis && (
              <span
                className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${trendAnalysis.directionBadge.bgClass} ${trendAnalysis.directionBadge.textClass} ${trendAnalysis.directionBadge.borderClass}`}
              >
                {trendAnalysis.direction === 'falling' && <TrendingDown className="w-3.5 h-3.5" />}
                {trendAnalysis.direction === 'rising' && <TrendingUp className="w-3.5 h-3.5" />}
                {trendAnalysis.direction === 'stable' && <Minus className="w-3.5 h-3.5" />}
                <span>
                  {isArabic ? trendAnalysis.directionBadge.text : trendAnalysis.directionBadge.textEn}
                </span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {timeRange === '30d'
              ? (isArabic
                  ? 'رسم بياني تفاعلي يومي لتغيرات السعر خلال الـ 30 يوماً الماضية لرصد القاع السعري وأفضل وقت للشراء'
                  : 'Daily interactive price fluctuations over the last 30 days to pinpoint best buying timing')
              : timeRange === '3m'
              ? (isArabic ? 'تدرج الأسعار خلال آخر 3 أشهر عبر المتاجر الكبرى' : 'Price progression across the last 3 months')
              : (isArabic ? 'السجل الشامل لحركة السعر منذ الإطلاق (آخر 6 أشهر)' : '6-month comprehensive historical movement')}
          </p>
        </div>

        {/* View Controls: Time Range Buttons & Chart Type Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="bg-white dark:bg-slate-800 p-1 rounded-xl flex items-center text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-2xs">
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                timeRange === '30d'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>{isArabic ? 'الـ 30 يوماً (يومي)' : 'Last 30 Days'}</span>
            </button>
            <button
              onClick={() => setTimeRange('3m')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === '3m'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{isArabic ? 'آخر 3 أشهر' : '3 Months'}</span>
            </button>
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === '6m'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{isArabic ? 'آخر 6 أشهر' : '6 Months'}</span>
            </button>
          </div>

          <button
            onClick={() => setChartType(chartType === 'area' ? 'line' : 'area')}
            title={chartType === 'area' ? 'التحويل إلى خط بياني' : 'التحويل إلى رسم مساحي مظلل'}
            className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1 font-bold shadow-2xs"
          >
            <BarChart3 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span className="hidden sm:inline">
              {chartType === 'area' ? (isArabic ? 'مساحي' : 'Area') : (isArabic ? 'خطي' : 'Line')}
            </span>
          </button>
        </div>
      </div>

      {/* Smart Market Recommendation Box */}
      {trendAnalysis && timeRange === '30d' && (
        <div
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            trendAnalysis.recommendation === 'strong_buy'
              ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
              : trendAnalysis.recommendation === 'good_buy'
              ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
              : 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                trendAnalysis.recommendation === 'strong_buy'
                  ? 'bg-emerald-600 text-white'
                  : trendAnalysis.recommendation === 'good_buy'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-600 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black">
                  {isArabic ? trendAnalysis.recommendationTitle : 'Smart Market Advice'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/70 border border-current/20">
                  {isArabic ? `تذبذب: ${trendAnalysis.volatility}` : `Volatility: ${trendAnalysis.volatility}`}
                </span>
              </div>
              <p className="text-xs opacity-90 mt-0.5">
                {isArabic ? trendAnalysis.recommendationText : 'Current price is close to the 30-day low.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {isArabic ? 'المتجر الأفضل سعراً:' : 'Best Store:'}
            </span>
            <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs text-amber-600 dark:text-amber-400">
              {trendAnalysis.bestStore}
            </span>
          </div>
        </div>
      )}

      {/* 30-Day Market Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
            {isArabic ? 'السعر الحالي الأرخص' : 'Current Lowest'}
          </span>
          <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white block">
            {formatPrice(currentRawPrice, currency)}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold truncate block">
            {chartData[chartData.length - 1]?.store || 'أمازون'}
          </span>
        </div>

        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/50 shadow-2xs">
          <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block mb-0.5 font-extrabold flex items-center justify-between">
            <span>{isArabic ? 'أدنى سعر في 30 يوماً' : '30-Day Low'}</span>
            <span className="text-[9px] bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-1.5 rounded">قاع</span>
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400 block">
            {formatPrice(minRawPrice, currency)}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            {trendAnalysis?.lowestDate ? `في ${trendAnalysis.lowestDate}` : (isArabic ? 'أفضل توقيت' : 'Peak deal')}
          </span>
        </div>

        <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
            {isArabic ? 'متوسط السعر بالفترة' : 'Period Average'}
          </span>
          <span className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-200 block">
            {new Intl.NumberFormat('en-US').format(avgPrice)} {currencySymbol}
          </span>
          <span className="text-[10px] text-slate-400">
            {isArabic ? `أعلى سعر: ${formatPrice(maxRawPrice, currency)}` : `High: ${formatPrice(maxRawPrice, currency)}`}
          </span>
        </div>

        <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-200/80 dark:border-amber-800/50 shadow-2xs">
          <span className="text-[11px] text-amber-800 dark:text-amber-300 block mb-0.5 font-extrabold">
            {isArabic ? 'تغير السعر (30 يوماً)' : '30-Day Net Change'}
          </span>
          <div className="flex items-center gap-1.5">
            {trendAnalysis ? (
              <>
                <span
                  className={`text-base sm:text-lg font-black ${
                    trendAnalysis.change30dSAR <= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {trendAnalysis.change30dSAR <= 0 ? '' : '+'}
                  {formatPrice(trendAnalysis.change30dSAR, currency)}
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-amber-300/60 dark:border-amber-700/60 text-amber-800 dark:text-amber-300">
                  {trendAnalysis.change30dPercent}%
                </span>
              </>
            ) : (
              <span className="text-base font-black text-emerald-600">
                -{Math.round(((originalPriceSAR || minRawPrice) - currentRawPrice) / (originalPriceSAR || minRawPrice) * 100)}%
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400">
            {trendAnalysis?.change30dSAR && trendAnalysis.change30dSAR < 0
              ? (isArabic ? 'تراجع لصالح المشتري' : 'Buyer favored drop')
              : (isArabic ? 'مستقر عموماً' : 'Generally stable')}
          </span>
        </div>
      </div>

      {/* Main Interactive Recharts Canvas */}
      <div className="w-full h-64 sm:h-72 pt-2" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart
              data={chartData}
              margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorRechartsEmerald" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#cbd5e1"
                strokeOpacity={0.4}
              />

              <XAxis
                dataKey="displayLabel"
                tickLine={false}
                axisLine={{ stroke: '#94a3b8' }}
                tick={{ fill: '#64748b', fontSize: timeRange === '30d' ? 10 : 11, fontWeight: 500 }}
                interval={timeRange === '30d' ? 4 : 0} // Show every 5th day label on 30-day view for pristine clarity
                dy={8}
              />

              <YAxis
                domain={[yMin, yMax]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickFormatter={(val) => `${new Intl.NumberFormat('en-US').format(val)}`}
                dx={-6}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Reference Line for Lowest Price */}
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

              {/* Reference Line for Average Price */}
              <ReferenceLine
                y={avgPrice}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                strokeWidth={1}
                label={{
                  value: `المتوسط: ${new Intl.NumberFormat('en-US').format(avgPrice)}`,
                  fill: '#d97706',
                  fontSize: 9,
                  fontWeight: 600,
                  position: 'insideTopLeft',
                }}
              />

              <Area
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRechartsEmerald)"
                activeDot={{
                  r: 7,
                  stroke: '#047857',
                  strokeWidth: 3,
                  fill: '#ffffff',
                }}
                dot={timeRange === '30d' ? false : { r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
              />
            </AreaChart>
          ) : (
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#cbd5e1"
                strokeOpacity={0.4}
              />

              <XAxis
                dataKey="displayLabel"
                tickLine={false}
                axisLine={{ stroke: '#94a3b8' }}
                tick={{ fill: '#64748b', fontSize: timeRange === '30d' ? 10 : 11, fontWeight: 500 }}
                interval={timeRange === '30d' ? 4 : 0}
                dy={8}
              />

              <YAxis
                domain={[yMin, yMax]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickFormatter={(val) => `${new Intl.NumberFormat('en-US').format(val)}`}
                dx={-6}
              />

              <Tooltip content={<CustomTooltip />} />

              <ReferenceLine
                y={convertedMinPrice}
                stroke="#059669"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />

              <ReferenceLine
                y={avgPrice}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                strokeWidth={1}
              />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                strokeWidth={3}
                activeDot={{
                  r: 7,
                  stroke: '#047857',
                  strokeWidth: 3,
                  fill: '#ffffff',
                }}
                dot={timeRange === '30d' ? false : { r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Legends and Guide */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-2xs" />
            <span>{isArabic ? 'مسار السعر الفعلي' : 'Actual Price Trend'}</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-0.5 bg-emerald-600 border border-emerald-600 border-dashed inline-block" />
            <span>{isArabic ? 'أدنى قاع مسجل' : 'Lowest Record Line'}</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-0.5 bg-amber-500 border border-amber-500 border-dashed inline-block" />
            <span>{isArabic ? 'متوسط سعر الفترة' : 'Average Price Line'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {timeRange === '30d' && (
            <button
              onClick={() => setShowRecentLog(!showRecentLog)}
              className="text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1"
            >
              <span>{showRecentLog ? (isArabic ? 'إخفاء جدول الأيام' : 'Hide Daily Log') : (isArabic ? 'عرض سجل آخر 7 أيام' : 'Show 7-Day Log')}</span>
            </button>
          )}
          <span className="text-slate-400 text-[10px]">
            {isArabic ? '• مرر المؤشر لمعاينة المتجر والتاريخ' : '• Hover to inspect store & date'}
          </span>
        </div>
      </div>

      {/* Collapsible 7-Day Recent Movements Table */}
      {showRecentLog && timeRange === '30d' && trendAnalysis && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
          <h5 className="text-xs font-black text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
            <span>{isArabic ? 'حركة الأسعار خلال آخر 7 أيام بين المتاجر:' : 'Last 7 Days Retail Movements:'}</span>
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
            {trendAnalysis.dailyPoints.slice(-7).reverse().map((day, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] text-slate-400 block">{day.relativeDaysText} ({day.date})</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{day.storeName}</span>
                </div>
                <div className="text-left font-sans">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                    {formatPrice(day.priceSAR, currency)}
                  </span>
                  {day.isLowest && (
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 rounded">
                      قاع شهري
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
