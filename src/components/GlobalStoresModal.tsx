import React, { useState } from 'react';
import {
  X,
  Globe,
  ExternalLink,
  ShieldCheck,
  Plane,
  Truck,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Smartphone,
  Star,
  RefreshCw,
  Info
} from 'lucide-react';
import { GLOBAL_STORES_DIRECTORY, GlobalStoreInfo, PHONES_DATA } from '../data/phonesData';
import { useLanguage } from '../context/LanguageContext';
import { CurrencyCode, Phone } from '../types/phone';
import { formatPrice } from '../utils/currency';

interface GlobalStoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onSelectPhone?: (phoneId: string) => void;
  onFilterGlobalOnly?: () => void;
}

export const GlobalStoresModal: React.FC<GlobalStoresModalProps> = ({
  isOpen,
  onClose,
  currency,
  onSelectPhone,
  onFilterGlobalOnly,
}) => {
  const { isArabic, direction } = useLanguage();
  const [selectedStoreId, setSelectedStoreId] = useState<string>(GLOBAL_STORES_DIRECTORY[0].id);
  const [activeTab, setActiveTab] = useState<'stores' | 'guide' | 'savings'>('stores');

  if (!isOpen) return null;

  const currentStore = GLOBAL_STORES_DIRECTORY.find((s) => s.id === selectedStoreId) || GLOBAL_STORES_DIRECTORY[0];

  // Phones with offers in this global store
  const storePhones = PHONES_DATA.filter((phone) =>
    phone.offers.some((offer) =>
      offer.isGlobal &&
      (offer.storeName.includes(currentStore.name.split(' ')[0]) ||
       offer.storeLogoText?.toLowerCase().includes(currentStore.logoText.toLowerCase().split(' ')[0]))
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col my-auto transition-colors"
        dir={direction}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-linear-to-r from-sky-500/10 via-teal-500/5 to-slate-50 dark:from-sky-950/40 dark:via-slate-800 dark:to-slate-900 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isArabic ? 'المتاجر العالمية المعتمدة وشحن الاستيراد' : 'Verified Global & International Stores'}
                </h3>
                <span className="text-[10px] font-black bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                  Global Shipping 🌐
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isArabic
                  ? 'قارن أسعار الهواتف مباشرة مع أشهر المتاجر العالمية: أمازون العالمي، علي إكسبريس، وبي آند إتش نيويورك.'
                  : 'Compare smartphone prices directly with top international stores: Amazon Global, AliExpress, & B&H NY.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center gap-2 sm:gap-4 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('stores')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'stores'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-black'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{isArabic ? 'المتاجر العالمية المعتمدة' : 'Verified Stores Directory'}</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'guide'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-black'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isArabic ? 'دليل الشراء الآمن والجمارك' : 'Customs & Safe Buying Guide'}</span>
          </button>

          <button
            onClick={() => setActiveTab('savings')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'savings'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-black'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{isArabic ? 'جدوى التوفير: المحلي مقابل العالمي' : 'Savings: Local vs Global'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'stores' && (
            <div className="space-y-6">
              {/* Store Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {GLOBAL_STORES_DIRECTORY.map((store) => {
                  const isSelected = selectedStoreId === store.id;
                  return (
                    <button
                      key={store.id}
                      onClick={() => setSelectedStoreId(store.id)}
                      className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-400 dark:border-sky-600 shadow-xs ring-2 ring-sky-300/40'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-xs font-black px-2 py-0.5 rounded-md text-white shadow-2xs"
                            style={{ backgroundColor: store.color }}
                          >
                            {store.logoText}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {store.country}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {isArabic ? store.name : store.nameEn}
                        </h4>
                      </div>

                      <div className="text-[11px] text-sky-800 dark:text-sky-300 font-bold bg-sky-100/60 dark:bg-sky-900/40 px-2 py-1 rounded-lg">
                        {store.badge}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Store Detailed Card */}
              <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md"
                      style={{ backgroundColor: currentStore.color }}
                    >
                      {currentStore.logoText}
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{isArabic ? currentStore.name : currentStore.nameEn}</span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          ({currentStore.country})
                        </span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                        {currentStore.description}
                      </p>
                    </div>
                  </div>

                  <a
                    href={currentStore.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-xs"
                  >
                    <span>{isArabic ? 'زيارة المتجر الرسمي' : 'Visit Official Store'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Store Policies & Carrier Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 text-sky-600" />
                      {isArabic ? 'مدة الشحن الدولي' : 'Shipping Time'}
                    </span>
                    <strong className="text-slate-900 dark:text-white block font-black">
                      {currentStore.shippingTime}
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      عبر {currentStore.supportedCarriers.join(' · ')}
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {isArabic ? 'الجمارك والضريبة' : 'Customs & VAT'}
                    </span>
                    <strong className="text-emerald-700 dark:text-emerald-400 block font-black">
                      {currentStore.customsPolicy}
                    </strong>
                    <span className="text-[10px] text-slate-400">بدون مفاجآت عند الاستلام</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                      {isArabic ? 'الاسترجاع وحماية المشتري' : 'Returns & Warranty'}
                    </span>
                    <strong className="text-slate-900 dark:text-white block font-black">
                      {currentStore.returnPolicy}
                    </strong>
                    <span className="text-[10px] text-slate-400">حماية دولية معتمدة</span>
                  </div>
                </div>

                {/* Verified Highlights */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {isArabic ? 'ضمانات المتجر:' : 'Store Guarantees:'}
                  </span>
                  {currentStore.verifiedFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>

                {/* Devices with deals in this store */}
                {storePhones.length > 0 && (
                  <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700">
                    <h5 className="text-xs font-black text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-sky-600" />
                      <span>
                        {isArabic
                          ? `هواتف متوفرة للشراء المباشر من ${currentStore.name.split(' ')[0]}:`
                          : `Phones available directly on ${currentStore.name.split(' ')[0]}:`}
                      </span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {storePhones.map((phone) => {
                        const globalOffer = phone.offers.find((o) => o.isGlobal);
                        return (
                          <div
                            key={phone.id}
                            onClick={() => {
                              if (onSelectPhone) {
                                onSelectPhone(phone.id);
                                onClose();
                              }
                            }}
                            className="p-2.5 bg-white dark:bg-slate-800 hover:bg-sky-50/50 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={phone.image}
                                alt={phone.name}
                                className="w-9 h-9 rounded-lg object-cover bg-slate-100"
                              />
                              <div>
                                <h6 className="text-xs font-bold text-slate-900 dark:text-white">
                                  {isArabic ? phone.nameAr : phone.name}
                                </h6>
                                <span className="text-[10px] text-slate-400">
                                  {globalOffer?.versionNote || 'النسخة العالمية'}
                                </span>
                              </div>
                            </div>

                            <div className="text-left">
                              <span className="text-xs font-black text-sky-700 dark:text-sky-400 block">
                                {globalOffer ? formatPrice(globalOffer.priceSAR, currency) : ''}
                              </span>
                              <span className="text-[9px] text-emerald-600 font-bold">شامل الجمارك</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-sm text-sky-950 dark:text-sky-200 mb-1">
                    {isArabic ? 'لماذا تشتري من المتاجر العالمية عبر منصتنا؟' : 'Why purchase from global stores via our platform?'}
                  </h4>
                  <p className="text-xs text-sky-900/80 dark:text-sky-300/80">
                    {isArabic
                      ? 'نوفر لك مقارنة دقيقة تعتمد نظام DDP (Delivered Duty Paid)، بحيث تكون الأسعار المعروضة شاملة الشحن السريع والرسوم الجمركية وضريبة القيمة المضافة بالكامل دون أي رسوم إضافية مخفية عند الاستلام.'
                      : 'We calculate prices under the DDP system (Delivered Duty Paid) so prices include shipping, customs, and VAT with no surprise fees on delivery.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      1
                    </span>
                    <span>النسخ العالمية المفتوحة (Global Unlocked)</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    الهواتف المعروضة من أمازون العالمي وB&H وعلي إكسبريس هي نسخ Unlocked تدعم جميع شبكات الاتصال والجيل الخامس 5G في السعودية والخليج، وتدعم اللغة العربية وخدمات Google الرسمية.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                    <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                      2
                    </span>
                    <span>الرسوم الجمركية والضريبة (Import Fees Deposit)</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    يتم احتساب الرسوم الجمركية وضريبة القيمة المضافة 15% مسبقاً عند الدفع، وإذا كانت الرسوم الفعلية أقل من المحسوبة، يقوم المتجر بإرجاع الفارق لحسابك البنكي تلقائياً.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">
                      3
                    </span>
                    <span>الشحن الجوي السريع والتتبع المباشر</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    يتم شحن الطرود عبر كبرى شركات الشحن العالمية (DHL Express, FedEx, Aramex, UPS) وتصل خلال 3 إلى 7 أيام عمل مع إشعار بالرسائل النصية للتوصيل حتى باب المنزل.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                      4
                    </span>
                    <span>الضمان الدولي وحماية المشتري</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    تخضع المشتريات لحماية المشتري الصارمة (Amazon A-to-z / AliExpress Buyer Protection) بالإضافة إلى ضمان آبل وجوجل وسامسونج الدولي المعتمد.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'savings' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-emerald-950 dark:text-emerald-200">
                      {isArabic ? 'متى يكون الشراء من متجر عالمي أوفر لك؟' : 'When is buying globally more economical?'}
                    </h4>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      {isArabic
                        ? 'في هواتف الفئة الرائدة والمتوسطة الصينية (شاومي، ون بلس، بوكو)، يصل فارق التوفير إلى 200 - 900 ريال مقارنة بالأسعار المحلية.'
                        : 'For flagship and Chinese upper-midrange phones (Xiaomi, OnePlus, Poco), savings can reach 200 - 900 SAR.'}
                    </p>
                  </div>
                </div>

                {onFilterGlobalOnly && (
                  <button
                    onClick={() => {
                      onFilterGlobalOnly();
                      onClose();
                    }}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl transition-colors shrink-0 shadow-xs"
                  >
                    {isArabic ? 'تصفية العروض العالمية' : 'Filter Global Deals'}
                  </button>
                )}
              </div>

              {/* Quick Comparison Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-right">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-black text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="p-3">الهاتف</th>
                      <th className="p-3">أفضل سعر محلي</th>
                      <th className="p-3">أفضل سعر عالمي 🌐</th>
                      <th className="p-3">مقدار التوفير</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {PHONES_DATA.filter((p) => p.offers.some((o) => o.isGlobal)).slice(0, 5).map((phone) => {
                      const localOffer = phone.offers.find((o) => !o.isGlobal);
                      const globalOffer = phone.offers.find((o) => o.isGlobal);
                      if (!localOffer || !globalOffer) return null;

                      const diff = localOffer.priceSAR - globalOffer.priceSAR;
                      return (
                        <tr key={phone.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <img src={phone.image} alt={phone.name} className="w-7 h-7 rounded-md object-cover" />
                            <span>{isArabic ? phone.nameAr : phone.name}</span>
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">
                            {formatPrice(localOffer.priceSAR, currency)} ({localOffer.storeName})
                          </td>
                          <td className="p-3 font-bold text-sky-700 dark:text-sky-400">
                            {formatPrice(globalOffer.priceSAR, currency)} ({globalOffer.storeName.split(' ')[0]})
                          </td>
                          <td className="p-3">
                            {diff > 0 ? (
                              <span className="font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                                وفر {formatPrice(diff, currency)}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-semibold">متقارب</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isArabic ? 'جميع المتاجر العالمية تخضع للمطابقة والفحص الأمني' : 'All global stores verified for security and buyer safety'}</span>
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-black transition-colors"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
