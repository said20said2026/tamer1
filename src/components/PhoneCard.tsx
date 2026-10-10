import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Scale, 
  Heart, 
  Bell, 
  Star, 
  ExternalLink, 
  Check, 
  Sparkles, 
  Cpu, 
  Camera, 
  Battery, 
  Smartphone,
  Eye,
  ArrowDownRight,
  RotateCcw,
  ChevronDown,
  Plus,
  X,
  ArrowLeft,
  Trash2,
  Zap,
  Globe
} from 'lucide-react';
import { Phone, CurrencyCode } from '../types/phone';
import { formatPrice } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PHONES_DATA } from '../data/phonesData';

interface PhoneCardProps {
  phone: Phone;
  currency: CurrencyCode;
  isInComparison: boolean;
  onToggleCompare: (phone: Phone) => void;
  onOpenDetails: (phoneId: string) => void;
  onOpenAlertModal: (phone: Phone) => void;
  compareCount?: number;
  onNavigateToCompare?: () => void;
  onSetComparisonIds?: (ids: string[]) => void;
}

export const PhoneCard: React.FC<PhoneCardProps> = ({
  phone,
  currency,
  isInComparison,
  onToggleCompare,
  onOpenDetails,
  onOpenAlertModal,
  compareCount = 0,
  onNavigateToCompare,
  onSetComparisonIds,
}) => {
  const { isFavorite, toggleFavorite } = useAuth();
  const { isArabic, t } = useLanguage();
  const favorited = isFavorite(phone.id);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Direct rivals in similar price bracket for quick 1-on-1 comparison
  const rivals = useMemo(() => {
    return PHONES_DATA
      .filter((p) => p.id !== phone.id)
      .sort(
        (a, b) =>
          Math.abs(a.lowestPriceSAR - phone.lowestPriceSAR) -
          Math.abs(b.lowestPriceSAR - phone.lowestPriceSAR)
      )
      .slice(0, 2);
  }, [phone.id, phone.lowestPriceSAR]);

  const bestOffer = phone.offers.reduce(
    (min, curr) => (curr.priceSAR < min.priceSAR ? curr : min),
    phone.offers[0]
  );

  const priceDrop = phone.originalPriceSAR - phone.lowestPriceSAR;
  const dropPercent = Math.round((priceDrop / phone.originalPriceSAR) * 100);

  // Dropdown action handlers
  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare(phone);
  };

  const handleAddAndNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInComparison) {
      onToggleCompare(phone);
    }
    setIsDropdownOpen(false);
    onNavigateToCompare?.();
  };

  const handleQuickCompareWithRival = (rivalId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSetComparisonIds?.([phone.id, rivalId]);
    setIsDropdownOpen(false);
    onNavigateToCompare?.();
  };

  const handleResetWithThisPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSetComparisonIds?.([phone.id]);
    setIsDropdownOpen(false);
  };

  const handleViewCurrentCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    onNavigateToCompare?.();
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative ${
        isDropdownOpen ? 'overflow-visible z-30' : 'overflow-hidden'
      }`}
    >
      {/* Top Banner / Image area */}
      <div className="p-4 sm:p-5 pb-3">
        {/* Top Kicker and Actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-extrabold text-amber-700 dark:text-amber-500 uppercase tracking-wider">
              {phone.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span>{phone.releaseDateText}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Price Alert button */}
            <button
              onClick={() => onOpenAlertModal(phone)}
              title="تنبيه عند انخفاض السعر"
              className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(phone.id)}
              title={favorited ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
              className={`p-1.5 rounded-lg transition-colors ${
                favorited
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/60'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Image & Badges */}
        <div 
          onClick={() => onOpenDetails(phone.id)}
          className="relative w-full aspect-square max-h-52 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 flex items-center justify-center overflow-hidden cursor-pointer mb-3 border border-slate-100 dark:border-slate-800 group-hover:bg-slate-100/60 dark:group-hover:bg-slate-800 transition-colors"
        >
          <img
            src={phone.image}
            alt={phone.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          />

          {dropPercent > 0 && (
            <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" />
              خصم {dropPercent}%
            </div>
          )}

          {/* Global Store availability badge */}
          {phone.offers.some((o) => o.isGlobal) && (
            <div className="absolute top-2.5 left-2.5 bg-sky-600/95 text-white font-bold text-[9px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 backdrop-blur-xs">
              <Globe className="w-2.5 h-2.5" />
              <span>{isArabic ? 'متجر عالمي 🌐' : 'Global Deal'}</span>
            </div>
          )}

          {phone.tags?.includes('best_seller') && (
            <div className="absolute bottom-2.5 right-2.5 bg-slate-900/90 dark:bg-slate-950/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              الأكثر طلباً
            </div>
          )}
        </div>

        {/* Phone Name and Rating */}
        <div>
          <h3
            onClick={() => onOpenDetails(phone.id)}
            className="text-base font-extrabold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer line-clamp-1 transition-colors"
          >
            {isArabic ? phone.nameAr : phone.name}
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 line-clamp-1">
            {isArabic ? phone.name : phone.nameAr}
          </p>

          <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{phone.rating}</span>
            <span className="text-slate-400">({phone.ratingCount} {isArabic ? 'تقييم' : 'reviews'})</span>
          </div>
        </div>

        {/* Key Specs Row */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
          <div className="flex items-center gap-1.5 truncate" title={phone.specs.screen.size}>
            <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{phone.specs.screen.size} · {phone.specs.screen.refreshRate}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate" title={phone.specs.performance.chipset}>
            <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{phone.specs.performance.chipset.split(' ')[0]}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate" title={phone.specs.camera.main}>
            <Camera className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{phone.specs.camera.main.split(' ')[0]}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate" title={phone.specs.battery.capacity}>
            <Battery className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{phone.specs.battery.capacity} · {phone.specs.battery.wiredCharging.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* Bottom Store Offer & Actions */}
      <div className="p-4 sm:p-5 pt-3 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
        {/* Lowest store badge */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold">
              {isArabic ? 'أفضل سعر في:' : 'Best price at:'}
            </span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: bestOffer.storeColor }} />
              <span>{bestOffer.storeName}</span>
              {bestOffer.isGlobal && (
                <span className="text-[9px] font-black text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 px-1 py-0.2 rounded border border-sky-200 dark:border-sky-800">
                  DDP 🌐
                </span>
              )}
            </span>
          </div>

          <div className="text-left">
            <span className="text-base sm:text-lg font-black text-slate-950 dark:text-white block">
              {formatPrice(phone.lowestPriceSAR, currency)}
            </span>
            {priceDrop > 0 && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through">
                {formatPrice(phone.originalPriceSAR, currency)}
              </span>
            )}
          </div>
        </div>

        {/* Refurbished / Used availability indicator */}
        {phone.hasRefurbished && phone.lowestRefurbishedPriceSAR && (
          <div className="mb-2.5 py-1 px-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 rounded-lg text-[11px] font-bold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>مجدد معتمد متوفر</span>
            </span>
            <span className="font-extrabold text-emerald-900 dark:text-emerald-200">من {formatPrice(phone.lowestRefurbishedPriceSAR, currency)}</span>
          </div>
        )}
        {!phone.hasRefurbished && phone.hasUsed && phone.lowestUsedPriceSAR && (
          <div className="mb-2.5 py-1 px-2.5 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60 rounded-lg text-[11px] font-bold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span>مستعمل ممتاز متوفر</span>
            </span>
            <span className="font-extrabold text-sky-900 dark:text-sky-200">من {formatPrice(phone.lowestUsedPriceSAR, currency)}</span>
          </div>
        )}

        {/* Action buttons with dropdown menu */}
        <div className="grid grid-cols-2 gap-2">
          {/* Comparison Split / Dropdown button */}
          <div className="relative" ref={dropdownRef}>
            <div
              className={`flex items-stretch rounded-xl border transition-all shadow-xs overflow-hidden ${
                isInComparison
                  ? 'bg-amber-500 border-amber-600 text-slate-950 font-black'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              {/* Primary Direct Toggle Compare Button */}
              <button
                type="button"
                onClick={handleToggleCompare}
                className={`flex-1 py-2 px-2 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  isInComparison
                    ? 'hover:bg-amber-400'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/80'
                }`}
                title={isInComparison ? 'إزالة الهاتف من المقارنة' : 'إضافة الهاتف للمقارنة مباشرة'}
              >
                {isInComparison ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Scale className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                )}
                <span className="truncate">
                  {isInComparison 
                    ? (isArabic ? 'في المقارنة' : 'In Compare') 
                    : (isArabic ? 'أضف للمقارنة' : 'Compare')}
                </span>
              </button>

              {/* Dropdown Menu Trigger Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen((prev) => !prev);
                }}
                className={`px-2 transition-colors border-r flex items-center justify-center ${
                  isInComparison
                    ? 'border-amber-600/60 hover:bg-amber-400 text-slate-950'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300'
                }`}
                title="قائمة خيارات المقارنة المنسدلة"
                aria-label="قائمة خيارات المقارنة المنسدلة"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Dropdown Menu Popover */}
            {isDropdownOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-full mb-2 right-0 left-0 sm:left-auto sm:w-80 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 space-y-2.5 text-right animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Dropdown Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      خيارات المقارنة المباشرة
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        compareCount >= 4
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {compareCount}/4 هواتف
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                      aria-label="إغلاق القائمة"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Option 1: Direct Add or Remove */}
                <button
                  type="button"
                  onClick={(e) => {
                    handleToggleCompare(e);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2.5 ${
                    isInComparison
                      ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/60'
                      : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isInComparison
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-500 text-slate-950 font-black'
                      }`}
                    >
                      {isInComparison ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">
                        {isInComparison
                          ? 'إزالة هذا الهاتف من المقارنة'
                          : 'إضافة مباشرة لقائمة المقارنة'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        {isInComparison
                          ? 'الهاتف مضاف حالياً إلى المقارنة'
                          : 'أضف الهاتف فوراً دون الحاجة لفتح التفاصيل'}
                      </span>
                    </div>
                  </div>
                  {isInComparison && (
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">حذف</span>
                  )}
                </button>

                {/* Option 2: Add and navigate to comparison view immediately */}
                <button
                  type="button"
                  onClick={handleAddAndNavigate}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-right transition-colors flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">
                        إضافة والانتقال الفوري للمقارنة
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        فتح جدول المقارنة الشامل للمواصفات والأسعار
                      </span>
                    </div>
                  </div>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {/* Option 3: Quick compare with top competitors */}
                {rivals.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 block mb-1.5">
                      مقارنة سريعة مع أبرز المنافسين:
                    </span>
                    <div className="space-y-1.5">
                      {rivals.map((rival) => (
                        <button
                          key={rival.id}
                          type="button"
                          onClick={(e) => handleQuickCompareWithRival(rival.id, e)}
                          className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-amber-50 dark:hover:bg-amber-950/50 border border-slate-200/80 dark:border-slate-700/60 text-right transition-colors flex items-center justify-between gap-2 group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={rival.image}
                              alt={rival.name}
                              className="w-7 h-7 rounded-md object-cover bg-white shrink-0 border border-slate-200 dark:border-slate-700"
                            />
                            <div className="min-w-0 text-right">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate block">
                                vs {rival.nameAr}
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                {formatPrice(rival.lowestPriceSAR, currency)}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-900/40 px-2 py-0.5 rounded-md shrink-0">
                            قارن الآن
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Option 4: Start fresh comparison */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleResetWithThisPhone}
                    className="text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-400" />
                    <span>بدء مقارنة جديدة بهذا الجهاز</span>
                  </button>

                  {compareCount > 0 && onNavigateToCompare && (
                    <button
                      type="button"
                      onClick={handleViewCurrentCompare}
                      className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>عرض المقارنة ({compareCount})</span>
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Details & Prices Modal Button */}
          <button
            onClick={() => onOpenDetails(phone.id)}
            className="py-2 px-2.5 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isArabic ? 'عرض الأسعار' : 'View Prices'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
