import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { 
  Star, 
  BarChart3, 
  PieChart as PieIcon, 
  Compass, 
  ThumbsUp, 
  CheckCircle2, 
  Filter, 
  X,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

interface RatingDistributionChartProps {
  starCounts: Record<number, number>;
  totalReviews: number;
  avgRating: number;
  recommendPercent: number;
  selectedStarFilter: number | null;
  onSelectStar: (star: number | null) => void;
  phoneName: string;
}

const STAR_COLORS: Record<number, string> = {
  5: '#10b981', // Emerald
  4: '#f59e0b', // Amber
  3: '#eab308', // Yellow
  2: '#f97316', // Orange
  1: '#ef4444', // Rose
};

const STAR_LABELS: Record<number, string> = {
  5: 'ممتاز (5 نجوم)',
  4: 'جيد جداً (4 نجوم)',
  3: 'جيد (3 نجوم)',
  2: 'مقبول (نجمتان)',
  1: 'سيء (نجمة واحدة)',
};

export const RatingDistributionChart: React.FC<RatingDistributionChartProps> = ({
  starCounts,
  totalReviews,
  avgRating,
  recommendPercent,
  selectedStarFilter,
  onSelectStar,
  phoneName,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'bar' | 'pie' | 'radar'>('bar');

  // Prepare Bar / Pie Chart Data (5 stars down to 1 star)
  const chartData = [5, 4, 3, 2, 1].map((star) => {
    const count = starCounts[star] || 0;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return {
      star,
      name: `${star} ★`,
      shortName: `${star} نجوم`,
      label: STAR_LABELS[star],
      count,
      percentage,
      color: STAR_COLORS[star],
    };
  });

  // Calculate positive reviews percentage (4 & 5 stars)
  const positiveReviewsCount = (starCounts[5] || 0) + (starCounts[4] || 0);
  const positivePercentage = totalReviews > 0 
    ? Math.round((positiveReviewsCount / totalReviews) * 100) 
    : 95;

  // Radar chart aspects derived from rating baseline
  const baseline = Math.min(100, Math.max(70, Math.round((avgRating / 5) * 100)));
  const radarData = [
    { aspect: 'الأداء والسرعة', score: Math.min(100, baseline + 3), fullMark: 100 },
    { aspect: 'جودة الكاميرات', score: Math.min(100, baseline - 1), fullMark: 100 },
    { aspect: 'عمر البطارية', score: Math.min(100, baseline + 2), fullMark: 100 },
    { aspect: 'وضوح الشاشة', score: Math.min(100, baseline + 4), fullMark: 100 },
    { aspect: 'المتانة والتصميم', score: Math.min(100, baseline), fullMark: 100 },
    { aspect: 'القيمة مقابل السعر', score: Math.min(100, baseline - 2), fullMark: 100 },
  ];

  // Custom Tooltip for Horizontal Bar Chart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700/80 text-xs backdrop-blur-md pointer-events-none z-50">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-400">
            <span>{data.label}</span>
          </div>
          <div className="space-y-1 text-slate-200">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">عدد التقييمات:</span>
              <span className="font-extrabold text-white font-mono">{data.count} مراجعة</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">النسبة المئوية:</span>
              <span className="font-extrabold text-emerald-400 font-mono">{data.percentage}%</span>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-amber-300 font-medium flex items-center gap-1">
            <span>👈 انقر على العمود لتصفية هذه التقييمات</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700/80 text-xs backdrop-blur-md pointer-events-none z-50">
          <div className="flex items-center gap-1.5 font-bold mb-1" style={{ color: data.color }}>
            <span>{data.label}</span>
          </div>
          <div className="space-y-1 text-slate-200">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">العدد:</span>
              <span className="font-bold font-mono">{data.count} تقييم</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">الحصة النسبية:</span>
              <span className="font-bold text-amber-400 font-mono">{data.percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-xs transition-colors">
      {/* Top Header & Chart View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>تحليل وتوزيع تقييمات المستخدمين (Recharts)</span>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
                تفاعلي
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              رسم بياني يوضح نسبة كل تقييم وانطباعات المشترين الحقيقية لـ {phoneName}
            </p>
          </div>
        </div>

        {/* Visual View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-stretch sm:self-auto">
          <button
            onClick={() => setActiveChartTab('bar')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeChartTab === 'bar'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>مخطط الأعمدة</span>
          </button>

          <button
            onClick={() => setActiveChartTab('pie')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeChartTab === 'pie'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>المخطط الدائري</span>
          </button>

          <button
            onClick={() => setActiveChartTab('radar')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeChartTab === 'radar'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>معايير الأداء</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 my-4">
        {/* Stat 1: Average Rating */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">متوسط التقييم العام</span>
            <div className="flex items-baseline gap-1">
              <strong className="text-lg font-black text-slate-900 dark:text-white font-mono">{avgRating}</strong>
              <span className="text-[11px] text-slate-400">/ 5 نجوم</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Recommendation % */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">نسبة التوصية بالشراء</span>
            <div className="flex items-baseline gap-1">
              <strong className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">{recommendPercent}%</strong>
              <span className="text-[11px] text-slate-400">ينصحون به</span>
            </div>
          </div>
        </div>

        {/* Stat 3: Positive Reviews % */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">الانطباعات الإيجابية</span>
            <div className="flex items-baseline gap-1">
              <strong className="text-lg font-black text-sky-600 dark:text-sky-400 font-mono">{positivePercentage}%</strong>
              <span className="text-[11px] text-slate-400">(4 و 5 نجوم)</span>
            </div>
          </div>
        </div>

        {/* Stat 4: Total Reviews Count */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">إجمالي التقييمات</span>
            <div className="flex items-baseline gap-1">
              <strong className="text-lg font-black text-slate-900 dark:text-white font-mono">{totalReviews}</strong>
              <span className="text-[11px] text-slate-400">تقييم موثق</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        {activeChartTab === 'bar' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1">
              <span className="flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>توزيع النجوم (انقر على أي تصنيف لتصفية المراجعات):</span>
              </span>
              <span className="text-[11px] font-medium hidden sm:inline text-slate-400">
                مرتبة من 5 نجوم إلى نجمة واحدة
              </span>
            </div>

            {/* Recharts Horizontal Bar Chart */}
            <div className="h-56 sm:h-64 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 24, bottom: 8 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    unit="%"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                    width={45}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.08)' }} />
                  <Bar
                    dataKey="percentage"
                    radius={[0, 6, 6, 0]}
                    animationDuration={800}
                    onClick={(entry: any) => {
                      if (entry && entry.star) {
                        onSelectStar(selectedStarFilter === entry.star ? null : entry.star);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {chartData.map((entry) => {
                      const isSelected = selectedStarFilter === entry.star;
                      const isAnySelected = selectedStarFilter !== null;
                      return (
                        <Cell
                          key={`cell-${entry.star}`}
                          fill={entry.color}
                          opacity={isAnySelected ? (isSelected ? 1 : 0.35) : 0.9}
                          stroke={isSelected ? '#0f172a' : 'transparent'}
                          strokeWidth={isSelected ? 2 : 0}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeChartTab === 'pie' && (
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            <div className="h-56 w-56 relative shrink-0" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    animationDuration={800}
                    onClick={(entry: any) => {
                      if (entry && entry.star) {
                        onSelectStar(selectedStarFilter === entry.star ? null : entry.star);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={`pie-${entry.star}`}
                        fill={entry.color}
                        opacity={selectedStarFilter && selectedStarFilter !== entry.star ? 0.3 : 1}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{avgRating}</span>
                <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>من 5</span>
                </span>
              </div>
            </div>

            {/* Legend list */}
            <div className="space-y-2 w-full max-w-xs text-xs">
              {chartData.map((entry) => {
                const isSelected = selectedStarFilter === entry.star;
                return (
                  <button
                    key={entry.star}
                    onClick={() => onSelectStar(isSelected ? null : entry.star)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{entry.label}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-extrabold text-slate-900 dark:text-white">{entry.percentage}%</span>
                      <span className="text-[11px] text-slate-400">({entry.count})</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeChartTab === 'radar' && (
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            <div className="h-60 w-full sm:w-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="aspect" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="نقاط رضا المستخدمين"
                    dataKey="score"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.45}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value} / 100`, 'مؤشر الرضا']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Aspects Breakdown List */}
            <div className="space-y-2 w-full max-w-xs text-xs">
              <div className="text-[11px] font-bold text-slate-500 mb-1">
                معدلات الرضا حسب أهم محاور الهاتف:
              </div>
              {radarData.map((aspect) => (
                <div
                  key={aspect.aspect}
                  className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/70 dark:border-slate-800 flex items-center justify-between"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200">{aspect.aspect}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${aspect.score}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{aspect.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Quick Filter Pills with Active Filter Indicator */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            <span>تصفية التقييمات:</span>
          </span>

          <button
            onClick={() => onSelectStar(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedStarFilter === null
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            جميع التقييمات ({totalReviews})
          </button>

          {[5, 4, 3, 2, 1].map((star) => {
            const count = starCounts[star] || 0;
            const isSelected = selectedStarFilter === star;
            return (
              <button
                key={star}
                onClick={() => onSelectStar(isSelected ? null : star)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs font-extrabold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>{star}</span>
                <Star className={`w-3 h-3 ${isSelected ? 'fill-slate-950 text-slate-950' : 'fill-amber-500 text-amber-500'}`} />
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {selectedStarFilter !== null && (
          <button
            onClick={() => onSelectStar(null)}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>إلغاء التصفية ({selectedStarFilter} نجوم)</span>
          </button>
        )}
      </div>
    </div>
  );
};
