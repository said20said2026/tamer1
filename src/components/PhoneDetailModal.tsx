import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Truck, 
  Star, 
  Bell, 
  Heart, 
  Scale, 
  CheckCircle, 
  XCircle, 
  TrendingDown, 
  Sparkles,
  Smartphone,
  Cpu,
  Camera,
  Battery,
  Wifi,
  Share2,
  ChevronRight,
  MessageSquare,
  RotateCcw,
  BarChart3,
  Coins,
  Globe,
  Plane,
  Info
} from 'lucide-react';
import { Phone, CurrencyCode, StorageVariant } from '../types/phone';
import { formatPrice } from '../utils/currency';
import { PriceHistoryChart } from './PriceHistoryChart';
import { RechartsPriceHistory } from './RechartsPriceHistory';
import { PhoneReviews } from './PhoneReviews';
import { UserReviews } from './UserReviews';
import { TechTooltip } from './TechTooltip';
import { SharePhoneModal } from './SharePhoneModal';
import { TradeInCalculator } from './TradeInCalculator';
import { GlobalStoresModal } from './GlobalStoresModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface PhoneDetailModalProps {
  phone: Phone | null;
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onOpenAlertModal: (phone: Phone) => void;
  onToggleCompare: (phone: Phone) => void;
  isInComparison: boolean;
  onOpenAuth?: () => void;
}

export const PhoneDetailModal: React.FC<PhoneDetailModalProps> = ({
  phone,
  isOpen,
  onClose,
  currency,
  onOpenAlertModal,
  onToggleCompare,
  isInComparison,
  onOpenAuth,
}) => {
  const { isFavorite, toggleFavorite } = useAuth();
  const { isArabic, direction, t } = useLanguage();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'prices' | 'trade_in' | 'specs' | 'pros_cons' | 'reviews' | 'refurbished'>('prices');
  const [refurbFilter, setRefurbFilter] = useState<'all' | 'refurbished' | 'used'>('all');
  const [storeFilterTab, setStoreFilterTab] = useState<'all' | 'local' | 'global'>('all');
  const [redirectToast, setRedirectToast] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGlobalStoresModalOpen, setIsGlobalStoresModalOpen] = useState(false);

  if (!isOpen || !phone) return null;

  const favorited = isFavorite(phone.id);
  const currentVariant = phone.variants[selectedVariantIndex] || phone.variants[0];
  const variantPriceDelta = currentVariant?.priceModifierSAR || 0;

  const handleStoreRedirect = (storeName: string, url: string) => {
    setRedirectToast(`جاري توجيهك إلى صفحة الهاتف في متجر ${storeName}...`);
    setTimeout(() => {
      setRedirectToast(null);
      window.open(url, '_blank');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col my-auto transition-colors" dir={direction}>
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="text-amber-700 dark:text-amber-400 font-bold uppercase">{phone.brand}</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 dark:text-white font-bold">{isArabic ? phone.nameAr : phone.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Compare */}
            <button
              onClick={() => onToggleCompare(phone)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border ${
                isInComparison
                  ? 'bg-amber-500 text-slate-950 border-amber-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>
                {isInComparison 
                  ? (isArabic ? 'في المقارنة' : 'In Compare') 
                  : (isArabic ? 'أضف للمقارنة' : 'Compare')}
              </span>
            </button>

            {/* Price alert */}
            <button
              onClick={() => onOpenAlertModal(phone)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>{isArabic ? 'تنبيه السعر' : 'Price Alert'}</span>
            </button>

            {/* Share */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              title="مشاركة الهاتف عبر فيسبوك، ماسنجر، تيك توك، واتساب، وتليجرام أو نسخ الرابط"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 border border-slate-200"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">مشاركة</span>
            </button>

            {/* Favorite */}
            <button
              onClick={() => toggleFavorite(phone.id)}
              className={`p-2 rounded-xl transition-colors border ${
                favorited
                  ? 'text-rose-500 bg-rose-50 border-rose-200'
                  : 'text-slate-500 hover:text-rose-500 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Redirecting feedback banner */}
        {redirectToast && (
          <div className="bg-amber-500 text-slate-950 py-2 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-inner">
            <ExternalLink className="w-4 h-4" />
            <span>{redirectToast}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Image & Color preview */}
            <div className="md:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col items-center justify-center text-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 relative mb-4">
                <img
                  src={phone.image}
                  alt={phone.name}
                  className="w-full h-full object-cover rounded-xl shadow-xs"
                />
              </div>

              {/* Color swatches */}
              <div className="w-full pt-3 border-t border-slate-200/70">
                <span className="block text-[11px] font-bold text-slate-500 mb-2">
                  اللون: {phone.colors[selectedColorIndex]?.name}
                </span>
                <div className="flex items-center justify-center gap-2">
                  {phone.colors.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColorIndex(idx)}
                      title={c.name}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        selectedColorIndex === idx
                          ? 'border-slate-900 scale-110 shadow-xs'
                          : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Details & Variant Selector */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                  <span>إصدار {phone.releaseYear}</span>
                  <span aria-hidden="true">·</span>
                  <span>{phone.specs.os}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {phone.nameAr}
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{phone.name}</p>

                <div className="flex items-center gap-2 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="font-extrabold text-slate-900">{phone.rating}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-slate-500 hover:text-amber-700 underline font-semibold transition-colors"
                  >
                    ({phone.ratingCount} مراجعة موثقة - اقرأ الآراء)
                  </button>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">يبدأ من</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-950">
                      {formatPrice(phone.lowestPriceSAR + variantPriceDelta, currency)}
                    </span>
                  </div>

                  {phone.originalPriceSAR > phone.lowestPriceSAR && (
                    <div className="text-left">
                      <span className="text-xs text-slate-400 line-through block">
                        {formatPrice(phone.originalPriceSAR + variantPriceDelta, currency)}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        وفر {formatPrice(phone.originalPriceSAR - phone.lowestPriceSAR, currency)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Storage Variant Selector */}
                <div className="mt-3 pt-3 border-t border-slate-200/60">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اختر سعة التخزين والرام:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {phone.variants.map((v, idx) => {
                      const isSelected = selectedVariantIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedVariantIndex(idx)}
                          className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-colors ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="block font-black">{v.storage}</span>
                          <span className="block text-[10px] opacity-75 font-medium">{v.ram} RAM</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-800">
            <nav className="flex gap-2 sm:gap-4 overflow-x-auto pb-0.5">
              <button
                onClick={() => setActiveTab('prices')}
                className={`py-2.5 px-2 text-xs sm:text-sm font-extrabold border-b-2 transition-colors shrink-0 ${
                  activeTab === 'prices'
                    ? 'border-amber-500 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isArabic ? `مقارنة أسعار المتاجر (${phone.offers.length} عروض)` : `Store Prices (${phone.offers.length} offers)`}
              </button>

              <button
                onClick={() => setActiveTab('trade_in')}
                className={`py-2.5 px-2 text-xs sm:text-sm font-extrabold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'trade_in'
                    ? 'border-emerald-600 text-emerald-950 dark:text-emerald-300 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isArabic ? 'استبدال هاتفك القديم (Trade-in)' : 'Trade-in Valuation'}</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-1.5 py-0.2 rounded-md">
                  {isArabic ? 'خصم فوري' : 'Instant Save'}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('refurbished')}
                className={`py-2.5 px-2 text-xs sm:text-sm font-extrabold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'refurbished'
                    ? 'border-emerald-600 text-emerald-950 dark:text-emerald-300 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isArabic ? `المستعمل والمجدد (${phone.usedOffers?.length || 0})` : `Used & Refurbished (${phone.usedOffers?.length || 0})`}</span>
              </button>

              <button
                onClick={() => setActiveTab('specs')}
                className={`py-2.5 px-2 text-xs sm:text-sm font-extrabold border-b-2 transition-colors ${
                  activeTab === 'specs'
                    ? 'border-amber-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                المواصفات التقنية التفصيلية
              </button>

              <button
                onClick={() => setActiveTab('pros_cons')}
                className={`py-2.5 px-2 text-xs sm:text-sm font-extrabold border-b-2 transition-colors ${
                  activeTab === 'pros_cons'
                    ? 'border-amber-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                المميزات والعيوب
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2.5 px-2 text-xs sm:text-sm font-extrabold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-amber-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span>تقييمات وتجارب المشترين</span>
              </button>
            </nav>
          </div>

          {/* TAB 1: RETAILER OFFERS & PRICE HISTORY */}
          {activeTab === 'prices' && (
            <div className="space-y-6">
              {/* Trade-in Quick Promotion Banner */}
              <div className="p-3.5 bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-slate-50 dark:from-emerald-950/40 dark:via-slate-800/60 dark:to-slate-900 border border-emerald-300/40 dark:border-emerald-700/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        {isArabic ? 'هل تملك هاتفاً قديماً؟ استبدله وادفع الفرق فقط' : 'Own an old phone? Trade it in and pay only the difference'}
                      </h4>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                        Trade-in
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      {isArabic 
                        ? 'احسب قيمة هاتفك الحالي التبادلية الآن عند الشراء من أحد المتاجر المتاحة (أمازون، جرير، إكسترا، نون).'
                        : 'Estimate your current phone trade-in value when buying from available stores (Amazon, Jarir, eXtra, Noon).'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('trade_in')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
                >
                  <span>{isArabic ? 'احسب قيمة هاتفك القديم' : 'Calculate Trade-in'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {/* Quick link banner to refurbished / used market */}
              {(phone.hasRefurbished || phone.hasUsed) && (
                <div className="p-3.5 bg-linear-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-emerald-950">
                          توفير أكبر؟ يتوفر هذا الهاتف مجدداً أو مستعملاً معتمداً
                        </h4>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                          فحص وضمان رسمي
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        الأسعار تبدأ من{' '}
                        <strong>
                          {formatPrice(phone.lowestRefurbishedPriceSAR || phone.lowestUsedPriceSAR || 0, currency)}
                        </strong>{' '}
                        مع فحص فني شامل وضمان معتمد.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('refurbished')}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
                  >
                    <span>استعراض عروض المستعمل والمجدد ({phone.usedOffers?.length || 0})</span>
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              )}

              {/* Store Category Filter Tabs & Global Guide Button */}
              {(() => {
                const localOffers = phone.offers.filter((o) => !o.isGlobal);
                const globalOffers = phone.offers.filter((o) => !!o.isGlobal);
                const displayedOffers =
                  storeFilterTab === 'local'
                    ? localOffers
                    : storeFilterTab === 'global'
                    ? globalOffers
                    : phone.offers;

                return (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                      <div className="flex items-center gap-1.5 overflow-x-auto">
                        <button
                          onClick={() => setStoreFilterTab('all')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors shrink-0 ${
                            storeFilterTab === 'all'
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {isArabic ? `جميع المتاجر (${phone.offers.length})` : `All Stores (${phone.offers.length})`}
                        </button>

                        <button
                          onClick={() => setStoreFilterTab('local')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors shrink-0 flex items-center gap-1 ${
                            storeFilterTab === 'local'
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <span>🇸🇦</span>
                          <span>{isArabic ? `متاجر محلية (${localOffers.length})` : `Local Stores (${localOffers.length})`}</span>
                        </button>

                        <button
                          onClick={() => setStoreFilterTab('global')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors shrink-0 flex items-center gap-1.5 ${
                            storeFilterTab === 'global'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5 text-sky-500" />
                          <span>{isArabic ? `متاجر عالمية (${globalOffers.length})` : `Global Stores (${globalOffers.length})`}</span>
                          {globalOffers.length > 0 && (
                            <span className="text-[10px] bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-1 rounded-sm">
                              DDP
                            </span>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={() => setIsGlobalStoresModalOpen(true)}
                        className="text-xs font-bold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 flex items-center gap-1 self-start sm:self-auto py-1 px-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'دليل الشراء والجمارك للمتاجر العالمية' : 'Global Customs & Buying Guide'}</span>
                      </button>
                    </div>

                    {/* Offers List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>{isArabic ? 'المتجر والتفاصيل والضمان' : 'Store, Warranty & Details'}</span>
                        <span>{isArabic ? 'السعر والشراء المباشر' : 'Price & Buy Direct'}</span>
                      </div>

                      {displayedOffers.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl text-center text-xs text-slate-400 border border-slate-200/70 dark:border-slate-700">
                          {isArabic
                            ? 'لا توجد عروض متطابقة مع التصفية المختارة لهذا الهاتف حالياً.'
                            : 'No offers match the selected store filter for this device.'}
                        </div>
                      ) : (
                        displayedOffers.map((offer, idx) => {
                          const offerPrice = offer.priceSAR + variantPriceDelta;
                          const isLowest = idx === 0 && storeFilterTab === 'all';
                          const isGlobalStore = !!offer.isGlobal;

                          return (
                            <div
                              key={offer.id}
                              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                                isLowest
                                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700 shadow-xs'
                                  : isGlobalStore
                                  ? 'bg-sky-50/30 dark:bg-sky-950/20 border-sky-300/80 dark:border-sky-800/70 hover:border-sky-400 shadow-xs'
                                  : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                              }`}
                            >
                              {/* Store info */}
                              <div className="space-y-1.5 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: offer.storeColor }}
                                  />
                                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                    {offer.storeName}
                                  </h4>

                                  {isLowest && (
                                    <span className="text-[10px] font-extrabold text-amber-900 dark:text-amber-200 bg-amber-200/80 dark:bg-amber-900/60 px-2 py-0.5 rounded">
                                      {isArabic ? 'أرخص سعر حالياً' : 'Best Price'}
                                    </span>
                                  )}

                                  {isGlobalStore && (
                                    <>
                                      <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded flex items-center gap-1 border border-sky-200 dark:border-sky-800">
                                        <Globe className="w-3 h-3" />
                                        <span>{isArabic ? 'متجر عالمي' : 'Global Store'}</span>
                                      </span>

                                      {offer.countryOrigin && (
                                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                          {offer.countryOrigin}
                                        </span>
                                      )}

                                      {offer.customsDutyIncluded && (
                                        <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                          {isArabic ? '✅ شامل الجمارك والضريبة DDP' : '✅ Customs & VAT Included'}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                                  <span className="flex items-center gap-1">
                                    {isGlobalStore ? (
                                      <Plane className="w-3.5 h-3.5 text-sky-600" />
                                    ) : (
                                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                                    )}
                                    <span>
                                      {offer.shipping} ({offer.deliveryDays})
                                    </span>
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span className="flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>{offer.warranty}</span>
                                  </span>
                                </div>

                                {offer.versionNote && (
                                  <p className="text-[11px] text-sky-700 dark:text-sky-300 font-bold flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-sky-500" />
                                    <span>{offer.versionNote}</span>
                                  </p>
                                )}

                                {offer.stockNote && (
                                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                                    {offer.stockNote}
                                  </p>
                                )}
                              </div>

                              {/* Price & Go to Store */}
                              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                                <div className="text-right sm:text-left">
                                  <span className="text-lg font-black text-slate-900 dark:text-white block">
                                    {formatPrice(offerPrice, currency)}
                                  </span>
                                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">
                                    {isGlobalStore
                                      ? (isArabic ? 'شامل الشحن والرسوم' : 'Total landed price')
                                      : (isArabic ? 'شامل ضريبة القيمة المضافة' : 'VAT included')}
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleStoreRedirect(offer.storeName, offer.url)}
                                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
                                    isLowest
                                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                                      : isGlobalStore
                                      ? 'bg-sky-600 hover:bg-sky-700 text-white'
                                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white'
                                  }`}
                                >
                                  <span>{isArabic ? 'توجه للمتجر' : 'Go to Store'}</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Price History Chart powered by Recharts (Last 3 Months / 6 Months) */}
              <div>
                <PriceHistoryChart
                  history={phone.priceHistory}
                  currency={currency}
                  phoneName={isArabic ? phone.nameAr : phone.name}
                  originalPriceSAR={phone.originalPriceSAR}
                />
              </div>
            </div>
          )}

          {/* TAB: DEDICATED REFURBISHED & USED PHONE MARKET */}
          {activeTab === 'refurbished' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Introduction / Guarantees Header */}
              <div className="p-4 sm:p-5 bg-linear-to-r from-emerald-50/90 via-teal-50/70 to-slate-50 border border-emerald-200/90 rounded-2xl shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <span>سوق الأجهزة المجددة والمستعملة المعتمدة</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 font-black px-2 py-0.5 rounded-full">
                          Refurbished & Pre-Owned
                        </span>
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        أجهزة أصلية تم فحصها تقنياً لتعمل كالجديدة تماماً، مع ضمان رسمي وسياسة إرجاع وتوفير مالي كبير.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Stat Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-emerald-200/70 text-xs">
                  <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 text-center shadow-2xs">
                    <span className="block text-[11px] text-slate-500 font-medium">أرخص سعر مجدد</span>
                    <strong className="text-sm font-black text-emerald-700">
                      {phone.lowestRefurbishedPriceSAR
                        ? formatPrice(phone.lowestRefurbishedPriceSAR, currency)
                        : 'غير متوفر'}
                    </strong>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 text-center shadow-2xs">
                    <span className="block text-[11px] text-slate-500 font-medium">أرخص سعر مستعمل</span>
                    <strong className="text-sm font-black text-sky-700">
                      {phone.lowestUsedPriceSAR
                        ? formatPrice(phone.lowestUsedPriceSAR, currency)
                        : 'غير متوفر'}
                    </strong>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 text-center shadow-2xs">
                    <span className="block text-[11px] text-slate-500 font-medium">الضمان المعتمد</span>
                    <strong className="text-sm font-black text-slate-900">حتى 12 شهراً</strong>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 text-center shadow-2xs">
                    <span className="block text-[11px] text-slate-500 font-medium">الفحص الفني</span>
                    <strong className="text-sm font-black text-slate-900">حتى 55 نقطة فحص</strong>
                  </div>
                </div>
              </div>

              {/* Sub-filter tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setRefurbFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      refurbFilter === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    جميع العروض ({phone.usedOffers?.length || 0})
                  </button>
                  <button
                    onClick={() => setRefurbFilter('refurbished')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      refurbFilter === 'refurbished'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    مجدد معتمد ({(phone.usedOffers || []).filter((o) => o.condition === 'refurbished').length})
                  </button>
                  <button
                    onClick={() => setRefurbFilter('used')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      refurbFilter === 'used'
                        ? 'bg-sky-600 text-white'
                        : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                    }`}
                  >
                    مستعمل ممتاز ({(phone.usedOffers || []).filter((o) => o.condition === 'used').length})
                  </button>
                </div>

                <span className="text-xs text-slate-500 font-medium">
                  سعر الجديد يبدأ من: <strong className="text-slate-900">{formatPrice(phone.lowestPriceSAR, currency)}</strong>
                </span>
              </div>

              {/* Offers List */}
              <div className="space-y-3.5">
                {(phone.usedOffers || [])
                  .filter((o) => refurbFilter === 'all' || o.condition === refurbFilter)
                  .map((offer) => {
                    const isRefurb = offer.condition === 'refurbished';
                    return (
                      <div
                        key={offer.id}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs"
                      >
                        {/* Offer Info */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: offer.storeColor }}
                            />
                            <h4 className="text-sm font-black text-slate-900">{offer.storeName}</h4>

                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                isRefurb
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : 'bg-sky-100 text-sky-900'
                              }`}
                            >
                              {offer.conditionLabelAr}
                            </span>

                            <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                              وفر {offer.savingsPercent}% مقارنة بالجديد
                            </span>
                          </div>

                          {/* Features Badges Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 pt-1">
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{offer.warrantyText}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>فحص {offer.inspectionPoints} نقطة</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Battery className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>البطارية: {offer.batteryHealth}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{offer.returnPolicy}</span>
                            </div>
                          </div>

                          {offer.includesAccessories && (
                            <p className="text-[11px] text-slate-500 pt-0.5">
                              <strong className="text-slate-700">الملحقات:</strong> {offer.includesAccessories}
                            </p>
                          )}
                        </div>

                        {/* Price & Call to Action */}
                        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                          <div className="text-right md:text-left">
                            <span className="text-base sm:text-lg font-black text-slate-900 block">
                              {formatPrice(offer.priceSAR, currency)}
                            </span>
                            <span className="text-[11px] text-slate-400 line-through">
                              الجديد: {formatPrice(offer.originalNewPriceSAR, currency)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleStoreRedirect(offer.storeName, offer.url)}
                            className={`px-4 py-2.5 text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 ${
                              isRefurb
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : 'bg-sky-600 hover:bg-sky-700'
                            }`}
                          >
                            <span>عرض وشراء الجهاز</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                {(!phone.usedOffers || phone.usedOffers.length === 0) && (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                    <RotateCcw className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800">لا تتوفر عروض مستعملة أو مجددة لهذا الهاتف حالياً</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      يمكنك تفعيل تنبيه هبوط السعر ليتم إشعارك فور توفر أجهزة مجددة بخصومات ممتازة.
                    </p>
                    <button
                      onClick={() => onOpenAlertModal(phone)}
                      className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>تفعيل تنبيه عند توفر أجهزة مستعملة</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: TRADE-IN VALUATION CALCULATOR */}
          {activeTab === 'trade_in' && (
            <TradeInCalculator
              targetPhone={phone}
              currency={currency}
            />
          )}

          {/* TAB 2: SPECS TABLE */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              {/* Tooltip guide helper banner */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>دليل المصطلحات التقنية:</strong> مرر المؤشر أو انقر فوق أيقونة ⓘ بجانب أي مواصفة لعرض شرح مبسط يوضح معناها العملي وفائدتها لك كمستخدم.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Screen Card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-extrabold text-slate-900 mb-3 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    الشاشة وتجربة العرض
                  </h4>
                  <ul className="text-xs space-y-2.5 text-slate-700">
                    <li className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">الحجم والأبعاد:</span>
                      <span>{phone.specs.screen.size}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="screen_panel">
                        <strong className="text-slate-900">نوع اللوحة والتقنية:</strong>
                      </TechTooltip>
                      <span className="text-left font-medium">{phone.specs.screen.panel}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">الدقة والكثافة:</span>
                      <span className="text-left font-medium">{phone.specs.screen.resolution}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="refresh_rate">
                        <strong className="text-slate-900">معدل التحديث:</strong>
                      </TechTooltip>
                      <span className="text-left font-bold text-amber-700">{phone.specs.screen.refreshRate}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="peak_brightness">
                        <strong className="text-slate-900">السطوع الأقصى:</strong>
                      </TechTooltip>
                      <span className="text-left font-medium">{phone.specs.screen.peakBrightness}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="protection_glass">
                        <strong className="text-slate-900">زجاج الحماية:</strong>
                      </TechTooltip>
                      <span className="text-left font-medium">{phone.specs.screen.protection}</span>
                    </li>
                  </ul>
                </div>

                {/* Performance Card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-extrabold text-slate-900 mb-3 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-sky-600" />
                    الأداء والمعالجة
                  </h4>
                  <ul className="text-xs space-y-2.5 text-slate-700">
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="chipset">
                        <strong className="text-slate-900">شريحة المعالج:</strong>
                      </TechTooltip>
                      <span className="text-left font-bold text-slate-900">{phone.specs.performance.chipset}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">معمارية الأنوية:</span>
                      <span className="text-left font-medium">{phone.specs.performance.cpu}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="gpu">
                        <strong className="text-slate-900">المعالج الرسومي:</strong>
                      </TechTooltip>
                      <span className="text-left font-medium">{phone.specs.performance.gpu}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="ram">
                        <strong className="text-slate-900">الذاكرة العشوائية:</strong>
                      </TechTooltip>
                      <span className="text-left font-bold text-slate-900">{phone.baseRam}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="antutu">
                        <strong className="text-slate-900">اختبار AnTuTu:</strong>
                      </TechTooltip>
                      <span className="text-left font-mono font-bold text-emerald-700">{phone.specs.performance.antutuScore}</span>
                    </li>
                  </ul>
                </div>

                {/* Camera Card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-extrabold text-slate-900 mb-3 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-rose-600" />
                    الكاميرات والتصوير
                  </h4>
                  <ul className="text-xs space-y-2.5 text-slate-700">
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="main_camera">
                        <strong className="text-slate-900">الكاميرا الرئيسية:</strong>
                      </TechTooltip>
                      <span className="text-left font-medium">{phone.specs.camera.main}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="ultrawide_camera">
                        <strong className="text-slate-900">الزاوية العريضة:</strong>
                      </TechTooltip>
                      <span className="text-left font-medium">{phone.specs.camera.ultrawide}</span>
                    </li>
                    {phone.specs.camera.telephoto && (
                      <li className="flex items-center justify-between">
                        <TechTooltip termKey="telephoto_camera">
                          <strong className="text-slate-900">عدسة التقريب:</strong>
                        </TechTooltip>
                        <span className="text-left font-medium">{phone.specs.camera.telephoto}</span>
                      </li>
                    )}
                    <li className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">كاميرا السيلفي:</span>
                      <span className="text-left font-medium">{phone.specs.camera.selfie}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="video_recording">
                        <strong className="text-slate-900">تصوير الفيديو:</strong>
                      </TechTooltip>
                      <span className="text-left font-medium">{phone.specs.camera.video}</span>
                    </li>
                  </ul>
                </div>

                {/* Battery & Body Card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-extrabold text-slate-900 mb-3 flex items-center gap-1.5">
                    <Battery className="w-4 h-4 text-emerald-600" />
                    البطارية والمتانة والاتصال
                  </h4>
                  <ul className="text-xs space-y-2.5 text-slate-700">
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="battery_capacity">
                        <strong className="text-slate-900">سعة البطارية:</strong>
                      </TechTooltip>
                      <span className="text-left font-bold text-emerald-800">{phone.specs.battery.capacity}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="fast_charging">
                        <strong className="text-slate-900">الشحن السلكي:</strong>
                      </TechTooltip>
                      <span className="text-left font-bold text-amber-700">{phone.specs.battery.wiredCharging}</span>
                    </li>
                    {phone.specs.battery.wirelessCharging && (
                      <li className="flex items-center justify-between">
                        <TechTooltip termKey="wireless_charging">
                          <strong className="text-slate-900">الشحن اللاسلكي:</strong>
                        </TechTooltip>
                        <span className="text-left font-medium">{phone.specs.battery.wirelessCharging}</span>
                      </li>
                    )}
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="water_resistance">
                        <strong className="text-slate-900">مقاومة الماء:</strong>
                      </TechTooltip>
                      <span className="text-left font-medium">{phone.specs.body.waterResistance}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="connectivity_5g">
                        <strong className="text-slate-900">شبكات الجيل الخامس:</strong>
                      </TechTooltip>
                      <span className="text-left font-bold text-sky-700">{phone.specs.connectivity.has5G ? 'مدعوم بالكامل' : 'غير مدعوم'}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <TechTooltip termKey="nfc">
                        <strong className="text-slate-900">الدفع الإلكتروني (NFC):</strong>
                      </TechTooltip>
                      <span className="text-left font-medium">{phone.specs.connectivity.nfc ? 'مدعوم (Apple/mada Pay)' : 'غير مدعوم'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROS AND CONS */}
          {activeTab === 'pros_cons' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pros */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                <h4 className="text-sm font-extrabold text-emerald-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  أبرز المميزات ونقاط القوة
                </h4>
                <ul className="space-y-2">
                  {phone.pros.map((pro, i) => (
                    <li key={i} className="text-xs text-slate-800 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200">
                <h4 className="text-sm font-extrabold text-rose-900 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  أبرز العيوب ونقاط الضعف
                </h4>
                <ul className="space-y-2">
                  {phone.cons.map((con, i) => (
                    <li key={i} className="text-xs text-slate-800 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="pt-2">
              <UserReviews phoneId={phone.id} phoneName={phone.nameAr} onOpenAuth={onOpenAuth} />
            </div>
          )}

          {/* User Reviews Section at the bottom of the phone details page */}
          {activeTab !== 'reviews' && (
            <div className="pt-8 border-t border-slate-200 mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    تقييمات وتجارب المستخدمين لـ {phone.nameAr}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 underline"
                >
                  الانتقال لتبويب التقييمات
                </button>
              </div>
              <UserReviews phoneId={phone.id} phoneName={phone.nameAr} onOpenAuth={onOpenAuth} />
            </div>
          )}
        </div>
      </div>

      {/* Share Phone Modal */}
      <SharePhoneModal
        phone={phone}
        currency={currency}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Global Stores Modal */}
      <GlobalStoresModal
        isOpen={isGlobalStoresModalOpen}
        onClose={() => setIsGlobalStoresModalOpen(false)}
        currency={currency}
      />
    </div>
  );
};
