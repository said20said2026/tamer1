import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Check, 
  SlidersHorizontal, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Wifi, 
  Camera, 
  Battery, 
  Cpu, 
  Smartphone,
  Globe
} from 'lucide-react';
import { FilterState, CurrencyCode } from '../types/phone';
import { POPULAR_BRANDS } from '../data/phonesData';
import { formatPrice } from '../utils/currency';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  currency: CurrencyCode;
  totalResults: number;
}

const STORAGE_OPTIONS = ['128GB', '256GB', '512GB', '1TB'];
const RAM_OPTIONS = ['8GB', '12GB', '16GB'];
const REFRESH_OPTIONS = [
  { label: 'الكل', value: null },
  { label: '120Hz فأعلى', value: 120 },
  { label: '144Hz فائق للألعاب', value: 144 },
];
const BATTERY_OPTIONS = [
  { label: 'الكل', value: null },
  { label: '5000 mAh فأكثر', value: 5000 },
  { label: '6000 mAh ضخمة', value: 6000 },
];
const CHARGING_OPTIONS = [
  { label: 'الكل', value: null },
  { label: '45W+ سريع', value: 45 },
  { label: '90W+ فائق', value: 90 },
  { label: '120W+ صاروخي', value: 120 },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  currency,
  totalResults,
}) => {
  const activeFiltersCount = [
    filters.brand && filters.brand !== 'الكل' ? 1 : 0,
    filters.condition && filters.condition !== 'all' ? 1 : 0,
    filters.storeOriginFilter && filters.storeOriginFilter !== 'all' ? 1 : 0,
    filters.storage.length > 0 ? 1 : 0,
    filters.ram.length > 0 ? 1 : 0,
    filters.has5G !== null ? 1 : 0,
    filters.minScreenHz !== null ? 1 : 0,
    filters.minBattery !== null ? 1 : 0,
    filters.minChargingWatt !== null ? 1 : 0,
    filters.waterResistantOnly ? 1 : 0,
    filters.priceMin > 0 || filters.priceMax < 6000 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const resetFilters = () => {
    onFilterChange({
      search: filters.search,
      brand: 'الكل',
      priceMin: 0,
      priceMax: 6000,
      storage: [],
      ram: [],
      has5G: null,
      minScreenHz: null,
      minBattery: null,
      minCameraMP: null,
      minChargingWatt: null,
      waterResistantOnly: false,
      condition: 'all',
      storeOriginFilter: 'all',
      sortBy: filters.sortBy,
    });
  };

  const handleBrandSelect = (brand: string) => {
    onFilterChange({ ...filters, brand });
  };

  const toggleStorage = (st: string) => {
    const exists = filters.storage.includes(st);
    const updated = exists ? filters.storage.filter((s) => s !== st) : [...filters.storage, st];
    onFilterChange({ ...filters, storage: updated });
  };

  const toggleRam = (r: string) => {
    const exists = filters.ram.includes(r);
    const updated = exists ? filters.ram.filter((item) => item !== r) : [...filters.ram, r];
    onFilterChange({ ...filters, ram: updated });
  };

  return (
    <aside className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm font-extrabold text-slate-900">تصفية الهواتف</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.2 rounded-md">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            إعادة الضبط
          </button>
        )}
      </div>

      {/* 1. Brands Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-900 mb-2.5">
          العلامة التجارية (الشركة المصنعة)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_BRANDS.map((b) => {
            const isSelected = filters.brand === b;
            return (
              <button
                key={b}
                onClick={() => handleBrandSelect(b)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Condition Filter (جديد / مجدد / مستعمل) */}
      <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200/70 dark:border-amber-800/40">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>حالة الهاتف (جديد / مجدد / مستعمل)</span>
          </label>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">وفر حتى 35%</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, condition: 'all' })}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center border ${
              filters.condition === 'all'
                ? 'bg-slate-900 text-white border-transparent shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            الكل (جميع الحالات)
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, condition: 'new_only' })}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center border ${
              filters.condition === 'new_only'
                ? 'bg-slate-900 text-white border-transparent shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            جديد فقط (New)
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, condition: 'refurbished' })}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center border ${
              filters.condition === 'refurbished'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50/50'
            }`}
          >
            🔄 مجدد معتمد
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, condition: 'used' })}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center border ${
              filters.condition === 'used'
                ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                : 'bg-white text-sky-800 border-sky-200 hover:bg-sky-50/50'
            }`}
          >
            🏷️ مستعمل ممتاز
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
          تصفية الهواتف التي يتوفر لها عروض أجهزة مجددة بضمان معتمد أو مستعملة بحالة ممتازة.
        </p>
      </div>

      {/* 3. Store Origin Filter (متاجر محلية / متاجر عالمية وشحن دولي) */}
      <div className="p-3 bg-sky-50/50 dark:bg-sky-950/20 rounded-xl border border-sky-200/70 dark:border-sky-800/40">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>نوع المتجر والشحن</span>
          </label>
          <span className="text-[10px] text-sky-700 dark:text-sky-300 font-bold">شحن DDP شامل</span>
        </div>

        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, storeOriginFilter: 'all' })}
            className={`w-full py-2 px-2.5 rounded-lg text-xs font-bold transition-all text-right flex items-center justify-between border ${
              !filters.storeOriginFilter || filters.storeOriginFilter === 'all'
                ? 'bg-slate-900 text-white border-transparent shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>جميع المتاجر (محلية وعالمية)</span>
            {(!filters.storeOriginFilter || filters.storeOriginFilter === 'all') && (
              <Check className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, storeOriginFilter: 'local_only' })}
            className={`w-full py-2 px-2.5 rounded-lg text-xs font-bold transition-all text-right flex items-center justify-between border ${
              filters.storeOriginFilter === 'local_only'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>🇸🇦</span>
              <span>متاجر محلية فقط (أمازون SA، جرير، نون، إكسترا)</span>
            </span>
            {filters.storeOriginFilter === 'local_only' && (
              <Check className="w-3.5 h-3.5 text-slate-950" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, storeOriginFilter: 'global_only' })}
            className={`w-full py-2 px-2.5 rounded-lg text-xs font-bold transition-all text-right flex items-center justify-between border ${
              filters.storeOriginFilter === 'global_only'
                ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50/50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              <span>تتوفر في متاجر عالمية 🌐 (Amazon Global, AliExpress, B&H)</span>
            </span>
            {filters.storeOriginFilter === 'global_only' && (
              <Check className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-900">نطاق السعر</label>
          <span className="text-xs font-extrabold text-amber-700">
            {formatPrice(filters.priceMin, currency)} - {formatPrice(filters.priceMax, currency)}
          </span>
        </div>

        <input
          type="range"
          min={500}
          max={6000}
          step={100}
          value={filters.priceMax}
          onChange={(e) => onFilterChange({ ...filters, priceMax: Number(e.target.value) })}
          className="w-full accent-amber-500 bg-slate-200 rounded-lg h-2 cursor-pointer"
        />

        {/* Quick price presets */}
        <div className="grid grid-cols-2 gap-1.5 mt-2.5">
          <button
            onClick={() => onFilterChange({ ...filters, priceMin: 0, priceMax: 1500 })}
            className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-colors ${
              filters.priceMax <= 1500
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            اقتصادي (&lt; 1500 ر.س)
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, priceMin: 1500, priceMax: 3000 })}
            className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-colors ${
              filters.priceMin === 1500 && filters.priceMax === 3000
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            فئة متوسطة (1500-3000)
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, priceMin: 3000, priceMax: 4500 })}
            className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-colors ${
              filters.priceMin === 3000 && filters.priceMax === 4500
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            فئة رائدة (3000-4500)
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, priceMin: 4500, priceMax: 6000 })}
            className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-colors ${
              filters.priceMin >= 4500
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            فائقة التميز (&gt; 4500)
          </button>
        </div>
      </div>

      {/* 3. Storage Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-900 mb-2">سعة التخزين الداخلية</label>
        <div className="grid grid-cols-4 gap-1.5">
          {STORAGE_OPTIONS.map((st) => {
            const isSelected = filters.storage.includes(st);
            return (
              <button
                key={st}
                onClick={() => toggleStorage(st)}
                className={`py-1.5 text-xs font-bold rounded-xl border text-center transition-colors ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-600 font-extrabold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. RAM Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-900 mb-2">الذاكرة العشوائية (RAM)</label>
        <div className="grid grid-cols-3 gap-1.5">
          {RAM_OPTIONS.map((r) => {
            const isSelected = filters.ram.includes(r);
            return (
              <button
                key={r}
                onClick={() => toggleRam(r)}
                className={`py-1.5 text-xs font-bold rounded-xl border text-center transition-colors ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-600 font-extrabold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Screen Refresh Rate */}
      <div>
        <label className="block text-xs font-bold text-slate-900 mb-2">معدل تحديث الشاشة</label>
        <div className="space-y-1.5">
          {REFRESH_OPTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onFilterChange({ ...filters, minScreenHz: item.value })}
              className={`w-full text-right px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                filters.minScreenHz === item.value
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span>{item.label}</span>
              {filters.minScreenHz === item.value && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Battery Capacity */}
      <div>
        <label className="block text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
          <Battery className="w-3.5 h-3.5 text-emerald-600" />
          سعة البطارية
        </label>
        <div className="space-y-1.5">
          {BATTERY_OPTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onFilterChange({ ...filters, minBattery: item.value })}
              className={`w-full text-right px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                filters.minBattery === item.value
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span>{item.label}</span>
              {filters.minBattery === item.value && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Fast Charging */}
      <div>
        <label className="block text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          سرعة الشحن السلكي
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {CHARGING_OPTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onFilterChange({ ...filters, minChargingWatt: item.value })}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center border transition-colors ${
                filters.minChargingWatt === item.value
                  ? 'bg-amber-500 text-slate-950 border-amber-600'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 8. Toggles: 5G & Water resistance */}
      <div className="pt-2 border-t border-slate-100 space-y-2.5">
        <label className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer transition-colors border border-slate-200/60">
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-bold text-slate-800">شبكات الجيل الخامس 5G فقط</span>
          </div>
          <input
            type="checkbox"
            checked={filters.has5G === true}
            onChange={(e) => onFilterChange({ ...filters, has5G: e.target.checked ? true : null })}
            className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
          />
        </label>

        <label className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer transition-colors border border-slate-200/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">مقاوم للماء IP68/IP69</span>
          </div>
          <input
            type="checkbox"
            checked={filters.waterResistantOnly}
            onChange={(e) => onFilterChange({ ...filters, waterResistantOnly: e.target.checked })}
            className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
          />
        </label>
      </div>

      <div className="text-[11px] text-slate-400 text-center pt-2">
        المتاح وفق التصفية: <span className="font-extrabold text-slate-900">{totalResults}</span> هاتف
      </div>
    </aside>
  );
};
