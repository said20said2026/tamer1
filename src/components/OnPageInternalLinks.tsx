import React from 'react';
import { 
  Link2, 
  ChevronRight, 
  ArrowLeft, 
  Scale, 
  Smartphone, 
  Tag, 
  TrendingUp, 
  Sparkles,
  ExternalLink,
  BookOpen,
  Compass
} from 'lucide-react';
import { Phone, CurrencyCode } from '../types/phone';
import { formatPrice } from '../utils/currency';
import { getInternalLinkingForPhone, InternalLinkItem } from '../utils/internalLinking';

interface OnPageInternalLinksProps {
  phone: Phone;
  currency: CurrencyCode;
  onSelectPhone?: (phoneId: string) => void;
  onOpenCompareWith?: (rivalId: string) => void;
  onFilterByBrand?: (brand: string) => void;
  onNavigateTab?: (tab: 'explore' | 'compare' | 'deals') => void;
}

export const OnPageInternalLinks: React.FC<OnPageInternalLinksProps> = ({
  phone,
  currency,
  onSelectPhone,
  onOpenCompareWith,
  onFilterByBrand,
  onNavigateTab,
}) => {
  const linkingData = getInternalLinkingForPhone(phone);

  return (
    <section 
      aria-label="الروابط الداخلية ذات الصلة والمقارنات المقترحة"
      className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6"
    >
      {/* 1. SEO Breadcrumb Navigation (مسار التنقل الداخلي) */}
      <nav 
        aria-label="مسار التصفح" 
        className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs flex flex-wrap items-center gap-1.5 text-slate-600 dark:text-slate-300"
      >
        <span className="font-bold text-slate-400 dark:text-slate-500 text-[11px] flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-amber-500" />
          <span>مسار المقال:</span>
        </span>

        {linkingData.breadcrumbTrail.map((crumb, idx) => {
          const isLast = idx === linkingData.breadcrumbTrail.length - 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-180 shrink-0" />
              )}
              {isLast ? (
                <span className="font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/60">
                  {crumb.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (crumb.label.includes('هواتف') && onFilterByBrand) {
                      onFilterByBrand(phone.brand);
                    } else if (onNavigateTab) {
                      onNavigateTab('explore');
                    }
                  }}
                  className="hover:text-amber-600 dark:hover:text-amber-400 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                  title={`انتقل إلى ${crumb.label}`}
                >
                  {crumb.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* 2. Direct Head-to-Head Comparison Links (روابط المقارنات المباشرة ذات الصلة) */}
      <div className="bg-gradient-to-br from-amber-50/70 via-slate-50 to-white dark:from-slate-800/80 dark:to-slate-900 p-4 sm:p-5 rounded-2xl border border-amber-200/80 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center">
              <Scale className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                روابط مقارنات مباشرة مع منافسي {phone.nameAr}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                مقارنات وجهاً لوجه تحظى بأعلى معدل بحث من المشترين قبل اتخاذ قرار الشراء
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full">
            Internal Linking SEO
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {linkingData.topComparisonLinks.map((comp) => (
            <div
              key={comp.rivalPhoneId}
              className="bg-white dark:bg-slate-800/90 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-1.5">
                  <Scale className="w-3.5 h-3.5" />
                  <span>مقارنة مباشرة</span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mb-1 leading-snug">
                  {comp.comparisonAnchor}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {comp.keyDifference}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onOpenCompareWith && onOpenCompareWith(comp.rivalPhoneId)}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 underline underline-offset-2 transition-colors cursor-pointer"
                  title={`افتح مقارنة ${phone.nameAr} ضد ${comp.rivalNameAr}`}
                >
                  <span>فتح جدول المقارنة</span>
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectPhone && onSelectPhone(comp.rivalPhoneId)}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  مراجعة {comp.rivalName}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Related Smart Devices Hub (أجهزة وبدائل مرتبطة بالفئة السعرية) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              هواتف بديلة ومقترحة من نفس الفئة السعرية
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            روابط ترابط موضوعي (Semantic Topic Cluster)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {linkingData.relatedPhones.map((related) => (
            <div
              key={related.targetPhoneId}
              onClick={() => onSelectPhone && onSelectPhone(related.targetPhoneId)}
              className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {related.relationBadge}
                  </span>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                    {formatPrice(related.targetLowestPriceSAR, currency)}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 my-2">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-900 p-1 shrink-0 border border-slate-200 dark:border-slate-700">
                    <img 
                      src={related.targetImage} 
                      alt={related.targetPhoneNameAr} 
                      className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform" 
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                      {related.targetPhoneNameAr}
                    </h4>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {related.targetPhoneName}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1">
                  {related.contextNote}
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                <span className="underline underline-offset-2">تصفح الأسعار والمواصفات</span>
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Category & Pillar Articles Internal Links (الروابط الدائرية للمقالات المركزية) */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2.5">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs font-black text-slate-900 dark:text-white">
            مقالات وأدلة تسوق ذات صلة للمستخدم
          </h4>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
          {linkingData.categoryArticleLinks.map((art, idx) => (
            <li key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  if (art.filterBrand && onFilterByBrand) {
                    onFilterByBrand(art.filterBrand);
                  } else if (onNavigateTab) {
                    onNavigateTab(art.targetTab as any);
                  }
                }}
                className="text-right w-full group cursor-pointer"
              >
                <span className="font-extrabold text-slate-900 dark:text-white block group-hover:text-amber-600 transition-colors">
                  {art.title}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1 line-clamp-2">
                  {art.description}
                </span>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-2 underline">
                  <Link2 className="w-3 h-3" />
                  <span>{art.anchorText}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
