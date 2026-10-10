import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, 
  Smartphone, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  TrendingDown, 
  ShieldCheck, 
  Store, 
  HelpCircle, 
  ExternalLink, 
  Zap, 
  Coins,
  ChevronDown
} from 'lucide-react';
import { Phone, CurrencyCode } from '../types/phone';
import { formatPrice } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';

interface TradeInCalculatorProps {
  targetPhone: Phone;
  currency: CurrencyCode;
}

interface OldPhoneModel {
  id: string;
  brand: 'Apple' | 'Samsung' | 'Xiaomi' | 'Google' | 'Huawei';
  name: string;
  nameAr: string;
  baseTradeInValueSAR: number;
  availableStorages: string[];
}

const OLD_MODELS_DATA: OldPhoneModel[] = [
  // Apple
  { id: 'ip-15-pm', brand: 'Apple', name: 'iPhone 15 Pro Max', nameAr: 'آيفون 15 برو ماكس', baseTradeInValueSAR: 3200, availableStorages: ['256GB', '512GB', '1TB'] },
  { id: 'ip-15-p', brand: 'Apple', name: 'iPhone 15 Pro', nameAr: 'آيفون 15 برو', baseTradeInValueSAR: 2700, availableStorages: ['128GB', '256GB', '512GB', '1TB'] },
  { id: 'ip-15', brand: 'Apple', name: 'iPhone 15', nameAr: 'آيفون 15', baseTradeInValueSAR: 2100, availableStorages: ['128GB', '256GB', '512GB'] },
  { id: 'ip-14-pm', brand: 'Apple', name: 'iPhone 14 Pro Max', nameAr: 'آيفون 14 برو ماكس', baseTradeInValueSAR: 2500, availableStorages: ['128GB', '256GB', '512GB', '1TB'] },
  { id: 'ip-14-p', brand: 'Apple', name: 'iPhone 14 Pro', nameAr: 'آيفون 14 برو', baseTradeInValueSAR: 2100, availableStorages: ['128GB', '256GB', '512GB'] },
  { id: 'ip-14', brand: 'Apple', name: 'iPhone 14', nameAr: 'آيفون 14', baseTradeInValueSAR: 1650, availableStorages: ['128GB', '256GB', '512GB'] },
  { id: 'ip-13-pm', brand: 'Apple', name: 'iPhone 13 Pro Max', nameAr: 'آيفون 13 برو ماكس', baseTradeInValueSAR: 1950, availableStorages: ['128GB', '256GB', '512GB', '1TB'] },
  { id: 'ip-13-p', brand: 'Apple', name: 'iPhone 13 Pro', nameAr: 'آيفون 13 برو', baseTradeInValueSAR: 1600, availableStorages: ['128GB', '256GB', '512GB'] },
  { id: 'ip-13', brand: 'Apple', name: 'iPhone 13', nameAr: 'آيفون 13', baseTradeInValueSAR: 1350, availableStorages: ['128GB', '256GB', '512GB'] },
  { id: 'ip-12-pm', brand: 'Apple', name: 'iPhone 12 Pro Max', nameAr: 'آيفون 12 برو ماكس', baseTradeInValueSAR: 1400, availableStorages: ['128GB', '256GB', '512GB'] },
  { id: 'ip-12', brand: 'Apple', name: 'iPhone 12', nameAr: 'آيفون 12', baseTradeInValueSAR: 950, availableStorages: ['64GB', '128GB', '256GB'] },
  { id: 'ip-11-pm', brand: 'Apple', name: 'iPhone 11 Pro Max', nameAr: 'آيفون 11 برو ماكس', baseTradeInValueSAR: 980, availableStorages: ['64GB', '256GB', '512GB'] },
  { id: 'ip-11', brand: 'Apple', name: 'iPhone 11', nameAr: 'آيفون 11', baseTradeInValueSAR: 700, availableStorages: ['64GB', '128GB'] },

  // Samsung
  { id: 'sam-s24-u', brand: 'Samsung', name: 'Galaxy S24 Ultra', nameAr: 'سامسونج S24 ألترا', baseTradeInValueSAR: 2950, availableStorages: ['256GB', '512GB', '1TB'] },
  { id: 'sam-s24-p', brand: 'Samsung', name: 'Galaxy S24+', nameAr: 'سامسونج S24 بلس', baseTradeInValueSAR: 2150, availableStorages: ['256GB', '512GB'] },
  { id: 'sam-s24', brand: 'Samsung', name: 'Galaxy S24', nameAr: 'سامسونج S24', baseTradeInValueSAR: 1750, availableStorages: ['128GB', '256GB'] },
  { id: 'sam-s23-u', brand: 'Samsung', name: 'Galaxy S23 Ultra', nameAr: 'سامسونج S23 ألترا', baseTradeInValueSAR: 2150, availableStorages: ['256GB', '512GB', '1TB'] },
  { id: 'sam-s23-p', brand: 'Samsung', name: 'Galaxy S23+', nameAr: 'سامسونج S23 بلس', baseTradeInValueSAR: 1550, availableStorages: ['256GB', '512GB'] },
  { id: 'sam-s23', brand: 'Samsung', name: 'Galaxy S23', nameAr: 'سامسونج S23', baseTradeInValueSAR: 1300, availableStorages: ['128GB', '256GB'] },
  { id: 'sam-s22-u', brand: 'Samsung', name: 'Galaxy S22 Ultra', nameAr: 'سامسونج S22 ألترا', baseTradeInValueSAR: 1450, availableStorages: ['128GB', '256GB', '512GB'] },
  { id: 'sam-s22', brand: 'Samsung', name: 'Galaxy S22', nameAr: 'سامسونج S22', baseTradeInValueSAR: 950, availableStorages: ['128GB', '256GB'] },
  { id: 'sam-zfold5', brand: 'Samsung', name: 'Galaxy Z Fold 5', nameAr: 'سامسونج Z فولد 5', baseTradeInValueSAR: 2600, availableStorages: ['256GB', '512GB', '1TB'] },
  { id: 'sam-zflip5', brand: 'Samsung', name: 'Galaxy Z Flip 5', nameAr: 'سامسونج Z فليب 5', baseTradeInValueSAR: 1400, availableStorages: ['256GB', '512GB'] },
  { id: 'sam-a54', brand: 'Samsung', name: 'Galaxy A54 5G', nameAr: 'سامسونج A54 5G', baseTradeInValueSAR: 620, availableStorages: ['128GB', '256GB'] },

  // Xiaomi
  { id: 'mi-14-u', brand: 'Xiaomi', name: 'Xiaomi 14 Ultra', nameAr: 'شاومي 14 ألترا', baseTradeInValueSAR: 2300, availableStorages: ['512GB'] },
  { id: 'mi-13-p', brand: 'Xiaomi', name: 'Xiaomi 13 Pro', nameAr: 'شاومي 13 برو', baseTradeInValueSAR: 1400, availableStorages: ['256GB', '512GB'] },
  { id: 'mi-13t-p', brand: 'Xiaomi', name: 'Xiaomi 13T Pro', nameAr: 'شاومي 13T برو', baseTradeInValueSAR: 1100, availableStorages: ['256GB', '512GB'] },
  { id: 'poco-f5-p', brand: 'Xiaomi', name: 'POCO F5 Pro', nameAr: 'بوكو F5 برو', baseTradeInValueSAR: 850, availableStorages: ['256GB', '512GB'] },

  // Google
  { id: 'pix-8-p', brand: 'Google', name: 'Pixel 8 Pro', nameAr: 'جوجل بكسل 8 برو', baseTradeInValueSAR: 1850, availableStorages: ['128GB', '256GB', '512GB'] },
  { id: 'pix-8', brand: 'Google', name: 'Pixel 8', nameAr: 'جوجل بكسل 8', baseTradeInValueSAR: 1300, availableStorages: ['128GB', '256GB'] },
  { id: 'pix-7-p', brand: 'Google', name: 'Pixel 7 Pro', nameAr: 'جوجل بكسل 7 برو', baseTradeInValueSAR: 1150, availableStorages: ['128GB', '256GB'] },

  // Huawei
  { id: 'hw-mate50-p', brand: 'Huawei', name: 'Mate 50 Pro', nameAr: 'هواوي ميت 50 برو', baseTradeInValueSAR: 1350, availableStorages: ['256GB', '512GB'] },
  { id: 'hw-p60-p', brand: 'Huawei', name: 'P60 Pro', nameAr: 'هواوي P60 برو', baseTradeInValueSAR: 1450, availableStorages: ['256GB', '512GB'] }
];

type DeviceCondition = 'flawless' | 'good' | 'fair' | 'broken';

export const TradeInCalculator: React.FC<TradeInCalculatorProps> = ({
  targetPhone,
  currency,
}) => {
  const { isArabic, direction } = useLanguage();

  const [selectedBrand, setSelectedBrand] = useState<string>('Apple');
  const [selectedModelId, setSelectedModelId] = useState<string>('ip-14-pm');
  const [selectedStorage, setSelectedStorage] = useState<string>('256GB');
  const [deviceCondition, setDeviceCondition] = useState<DeviceCondition>('good');
  const [hasWorkingScreen, setHasWorkingScreen] = useState(true);
  const [hasWorkingBattery, setHasWorkingBattery] = useState(true);

  // Filter models by brand
  const filteredModels = useMemo(() => {
    return OLD_MODELS_DATA.filter((m) => m.brand === selectedBrand);
  }, [selectedBrand]);

  const currentModel = useMemo(() => {
    return OLD_MODELS_DATA.find((m) => m.id === selectedModelId) || filteredModels[0] || OLD_MODELS_DATA[0];
  }, [selectedModelId, filteredModels]);

  // Trade-in Valuation Calculation
  const valuation = useMemo(() => {
    if (!currentModel) {
      return { 
        estimatedValueSAR: 0, 
        bonusSAR: 0, 
        totalDiscountSAR: 0, 
        netPaySAR: targetPhone.lowestPriceSAR, 
        savingsPercent: 0 
      };
    }

    let base = currentModel.baseTradeInValueSAR;

    // Storage modifier
    if (selectedStorage === '512GB') base += 200;
    else if (selectedStorage === '1TB') base += 450;
    else if (selectedStorage === '128GB' && currentModel.availableStorages.includes('256GB')) base -= 120;
    else if (selectedStorage === '64GB') base -= 180;

    // Condition multiplier
    let conditionMultiplier = 0.85; // Good
    if (deviceCondition === 'flawless') conditionMultiplier = 1.0;
    else if (deviceCondition === 'good') conditionMultiplier = 0.85;
    else if (deviceCondition === 'fair') conditionMultiplier = 0.65;
    else if (deviceCondition === 'broken') conditionMultiplier = 0.40;

    if (!hasWorkingScreen) conditionMultiplier *= 0.65;
    if (!hasWorkingBattery) conditionMultiplier *= 0.85;

    const estimatedValueSAR = Math.max(150, Math.round(base * conditionMultiplier));
    const bonusSAR = 150; // Trade-in promotional bonus from retailers
    const totalDiscountSAR = estimatedValueSAR + bonusSAR;
    const netPaySAR = Math.max(0, targetPhone.lowestPriceSAR - totalDiscountSAR);
    const savingsPercent = Math.min(95, Math.round((totalDiscountSAR / targetPhone.lowestPriceSAR) * 100));

    return {
      estimatedValueSAR,
      bonusSAR,
      totalDiscountSAR,
      netPaySAR,
      savingsPercent
    };
  }, [currentModel, selectedStorage, deviceCondition, hasWorkingScreen, hasWorkingBattery, targetPhone.lowestPriceSAR]);

  return (
    <div className="space-y-6" dir={direction}>
      {/* Intro Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/40 dark:via-slate-800/60 dark:to-slate-900 border border-emerald-300/40 dark:border-emerald-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <RotateCcw className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{isArabic ? 'حاسبة تقييم استبدال الهاتف القديم (Trade-in)' : 'Old Phone Trade-in Valuation'}</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                {isArabic ? 'خصم فوري' : 'Instant Savings'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isArabic
                ? 'قيّم هاتفك الحالي واحصل على خصم فوري ومباشر يقلل من تكلفة شراء ' + targetPhone.nameAr
                : 'Estimate your old phone value to significantly discount the purchase of ' + targetPhone.name}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-emerald-300/40 dark:border-emerald-700/40 text-center shrink-0 shadow-2xs">
          <span className="text-[10px] text-slate-400 block font-bold">
            {isArabic ? 'قيمة الاستبدال تصل إلى' : 'Trade-in value up to'}
          </span>
          <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
            {formatPrice(3500, currency)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Step 1 & 2: Calculator Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5 shadow-xs">
          {/* Brand Selector */}
          <div>
            <label className="block text-xs font-black text-slate-900 dark:text-white mb-2">
              {isArabic ? '1. اختر ماركة هاتفك الحالي:' : '1. Select Your Current Phone Brand:'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(['Apple', 'Samsung', 'Xiaomi', 'Google', 'Huawei'] as const).map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => {
                    setSelectedBrand(brand);
                    const firstOfBrand = OLD_MODELS_DATA.find((m) => m.brand === brand);
                    if (firstOfBrand) {
                      setSelectedModelId(firstOfBrand.id);
                      setSelectedStorage(firstOfBrand.availableStorages[0] || '128GB');
                    }
                  }}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all text-center ${
                    selectedBrand === brand
                      ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 border-slate-900 dark:border-amber-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-black text-slate-900 dark:text-white mb-2">
              {isArabic ? '2. اختر موديل الهاتف:' : '2. Select Model:'}
            </label>
            <div className="relative">
              <select
                value={selectedModelId}
                onChange={(e) => {
                  setSelectedModelId(e.target.value);
                  const m = OLD_MODELS_DATA.find((x) => x.id === e.target.value);
                  if (m && !m.availableStorages.includes(selectedStorage)) {
                    setSelectedStorage(m.availableStorages[0] || '128GB');
                  }
                }}
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 ps-3 pe-8 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {filteredModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {isArabic ? m.nameAr : m.name} (قيمة تقديرية تصل إلى {formatPrice(m.baseTradeInValueSAR, currency)})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 end-0 pe-2.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Storage Capacity */}
          <div>
            <label className="block text-xs font-black text-slate-900 dark:text-white mb-2">
              {isArabic ? '3. سعة الذاكرة التخزينية لجهازك القديم:' : '3. Storage Capacity:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {['64GB', '128GB', '256GB', '512GB', '1TB'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStorage(st)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedStorage === st
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs font-black'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Device Condition */}
          <div>
            <label className="block text-xs font-black text-slate-900 dark:text-white mb-2">
              {isArabic ? '4. الحالة الفيزيائية العامة للهاتف:' : '4. Physical Device Condition:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  id: 'flawless',
                  titleAr: 'ممتاز كأنه جديد (Flawless)',
                  titleEn: 'Flawless / Like New',
                  descAr: 'لا توجد أي خدوش، شاشة وجسم خاليان من العيوب تماماً (100% من القيمة)',
                  descEn: 'No scratches, pristine screen & body (100% value)'
                },
                {
                  id: 'good',
                  titleAr: 'جيد جداً (Good)',
                  titleEn: 'Very Good',
                  descAr: 'خدوش سطحية طفيفة جداً، الشاشة والكاميرات تعمل بكفاءة (85% من القيمة)',
                  descEn: 'Minor normal signs of use, fully functional (85% value)'
                },
                {
                  id: 'fair',
                  titleAr: 'مقبول / علامات استخدام واضحة',
                  titleEn: 'Fair / Normal Wear',
                  descAr: 'خدوش واضحة في الإطار أو الظهر، الشاشة تعمل دون كسر (65% من القيمة)',
                  descEn: 'Noticeable scuffs, screen intact and functional (65% value)'
                },
                {
                  id: 'broken',
                  titleAr: 'به كسر أو عطل جزئي',
                  titleEn: 'Damaged / Broken',
                  descAr: 'شروخ في الشاشة أو الظهر مع استمرار الجهاز بالعمل (40% من القيمة)',
                  descEn: 'Cracked glass or minor defects (40% value)'
                }
              ].map((cond) => (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => setDeviceCondition(cond.id as DeviceCondition)}
                  className={`p-3 rounded-xl border text-start transition-all ${
                    deviceCondition === cond.id
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs ring-1 ring-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {isArabic ? cond.titleAr : cond.titleEn}
                    </span>
                    {deviceCondition === cond.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {isArabic ? cond.descAr : cond.descEn}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Quick checks */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={hasWorkingScreen}
                onChange={(e) => setHasWorkingScreen(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span>{isArabic ? 'الشاشة تعمل باللمس بدون بقع سوداء' : 'Touchscreen works with no dead pixels'}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={hasWorkingBattery}
                onChange={(e) => setHasWorkingBattery(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span>{isArabic ? 'البطارية تشحن وتعمل بكفاءة' : 'Battery holds charge properly'}</span>
            </label>
          </div>
        </div>

        {/* Valuation Summary & Net Price (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Net Price Card */}
          <div className="p-5 rounded-3xl bg-linear-to-b from-slate-900 to-slate-950 text-white shadow-xl border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 end-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                {isArabic ? 'نتيجة التقييم التقديرية' : 'Estimated Trade-in Result'}
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3" />
                <span>{isArabic ? `توفير ${valuation.savingsPercent}%` : `Save ${valuation.savingsPercent}%`}</span>
              </span>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>{isArabic ? 'سعر الهاتف الجديد اليوم:' : 'New Phone Price:'}</span>
                <span className="font-bold">{formatPrice(targetPhone.lowestPriceSAR, currency)}</span>
              </div>

              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <div className="flex items-center gap-1">
                  <span>{isArabic ? 'تقدير قيمة هاتفك القديم:' : 'Old Phone Trade Value:'}</span>
                </div>
                <span>- {formatPrice(valuation.estimatedValueSAR, currency)}</span>
              </div>

              <div className="flex items-center justify-between text-amber-400 font-bold">
                <div className="flex items-center gap-1">
                  <span>{isArabic ? 'بونص استبدال ترويجي إضافي:' : 'Promotional Bonus Coupon:'}</span>
                </div>
                <span>- {formatPrice(valuation.bonusSAR, currency)}</span>
              </div>
            </div>

            {/* Total Net Payment */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1 text-center">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                {isArabic ? 'المبلغ الصافي المطلوب دفعه فقط' : 'Net Amount You Pay'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 block">
                {formatPrice(valuation.netPaySAR, currency)}
              </span>
              <span className="text-[10px] text-emerald-400 block font-bold">
                {isArabic 
                  ? `أنت توفر إجمالي ${formatPrice(valuation.totalDiscountSAR, currency)} من السعر الأصلي!`
                  : `You save a total of ${formatPrice(valuation.totalDiscountSAR, currency)}!`}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed text-center">
              {isArabic
                ? '* التقدير تقريبي بناءً على أسعار السوق وبرامج استبدال المتاجر الكبرى المعتمدة (أمازون، جرير، إكسترا، نون).'
                : '* Valuation is an estimate based on official store trade-in programs (Amazon, Jarir, eXtra, Noon).'}
            </p>
          </div>

          {/* Trade-in Offers by Available Retailer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
            <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-500" />
              <span>{isArabic ? 'خيارات الاستبدال في المتاجر المعتمدة:' : 'Retailer Trade-In Options:'}</span>
            </h4>

            <div className="space-y-2">
              {[
                {
                  store: isArabic ? 'مكتبة جرير (برنامج استبدال الأجهزة)' : 'Jarir Trade-in Program',
                  valueSAR: valuation.estimatedValueSAR + 200,
                  badge: isArabic ? 'أعلى تقييم نقدي' : 'Top Trade Value',
                  color: 'border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20'
                },
                {
                  store: isArabic ? 'أمازون السعودية (Amazon Trade-In)' : 'Amazon SA Trade-in',
                  valueSAR: valuation.estimatedValueSAR + 150,
                  badge: isArabic ? 'قسيمة شراء فورية' : 'Instant Gift Card',
                  color: 'border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20'
                },
                {
                  store: isArabic ? 'إكسترا (eXtra Trade-in)' : 'eXtra Trade-in',
                  valueSAR: valuation.estimatedValueSAR + 100,
                  badge: isArabic ? 'استبدال في المعرض' : 'In-store swap',
                  color: 'border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20'
                }
              ].map((st, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${st.color}`}
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{st.store}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{st.badge}</span>
                  </div>
                  <div className="text-end">
                    <span className="font-black text-emerald-700 dark:text-emerald-400 block text-sm">
                      {formatPrice(st.valueSAR, currency)}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {isArabic ? 'قيمة الخصم' : 'Discount value'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How Trade-in Works Guide */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isArabic ? 'كيف تتم عملية الاستبدال؟' : 'How Does Trade-in Work?'}</span>
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              <li>{isArabic ? 'انسخ بيانات هاتفك واعمل إعادة ضبط المصنع.' : 'Backup your phone and perform a factory reset.'}</li>
              <li>{isArabic ? 'اختر المتجر المناسب عند إتمام طلب الشراء.' : 'Select the trade-in option during checkout at the store.'}</li>
              <li>{isArabic ? 'يسلّمك مندوب التوصيل الهاتف الجديد ويستلم القديم بعد فحصه.' : 'The delivery agent inspects the old device and hands over your new phone.'}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
