import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowLeft,
  Mail,
  Lock,
  RefreshCw,
  ShoppingBag,
  Cpu,
  Ban,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TermsOfServicePageProps {
  onExplore: () => void;
  onOpenCompare: () => void;
  onOpenPrivacy?: () => void;
  onOpenContact?: () => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({
  onExplore,
  onOpenCompare,
  onOpenPrivacy,
  onOpenContact,
}) => {
  const { isArabic } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const sections = [
    { id: 'intro', titleAr: 'مقدمة والموافقة على الشروط', titleEn: 'Acceptance & Overview', icon: FileText },
    { id: 'nature', titleAr: 'طبيعة المنصة وحيادية المقارنة', titleEn: 'Service Nature & Impartiality', icon: Scale },
    { id: 'prices', titleAr: 'دقة الأسعار وإخلاء المسؤولية', titleEn: 'Pricing Accuracy & Disclaimer', icon: AlertTriangle },
    { id: 'stores', titleAr: 'المتاجر الشريكة وروابط الشراء', titleEn: 'Partner Stores & External Links', icon: ExternalLink },
    { id: 'acceptable-use', titleAr: 'قواعد الاستخدام المشروع والحظر', titleEn: 'Acceptable Use & Anti-Scraping', icon: Ban },
    { id: 'intellectual-property', titleAr: 'الملكية الفكرية والعلامات التجارية', titleEn: 'Intellectual Property', icon: Award },
    { id: 'user-alerts', titleAr: 'خدمات التنبيهات وحسابات المستخدمين', titleEn: 'Alerts & User Responsibilities', icon: ShieldCheck },
    { id: 'updates', titleAr: 'تعديل الشروط وإنهاء الخدمة', titleEn: 'Terms Amendments', icon: RefreshCw },
    { id: 'contact', titleAr: 'التواصل والاستفسارات القانونية', titleEn: 'Legal Inquiries & Support', icon: Mail },
  ];

  const termsFaqs = [
    {
      qAr: 'هل يبيع موقع "قارن تك" الهواتف الذكية أو يستلم مدفوعات مباشرة؟',
      qEn: 'Does QarenTech sell smartphones directly or process user payments?',
      aAr: 'لا، "قارن تك" منصة مقارنة أسعار وبحث ومواصفات تقنية ذكية مستقلة تماماً. جميع عمليات الشراء، إتمام الطلبات، الشحن، وتحصيل المدفوعات تتم مباشرة على المواقع المعتمدة للمتاجر الشريكة (مثل أمازون، نون، جرير، إكسترا، وعلي إكسبريس).',
      aEn: 'No, QarenTech is an independent search and price comparison engine. All purchase transactions, payment processing, fulfillment, and shipping take place directly on authorized merchant websites (Amazon, Noon, Jarir, Extra, AliExpress).'
    },
    {
      qAr: 'ماذا يحدث إذا كان السعر في المتجر مختلفاً عن السعر المعروض في قارن تك؟',
      qEn: 'What if a store price differs from the price shown on QarenTech?',
      aAr: 'نقوم بتحديث الأسعار والمخزون بشكل آلي ومتكرر يومياً. ومع ذلك، قد تتبدل الأسعار لحظياً في المتجر بسبب عروض البرق (Flash Sales) أو نفاد الكميات. السعر النهائي المعتمد والملزم قانونياً هو السعر النهائي الموضح في صفحة الدفع الخاصة بالمتجر البائع.',
      aEn: 'We update prices and availability continually throughout the day. However, flash deals or sudden stock variations may alter prices momentarily. The authoritative, legally binding price is the final price displayed at the store checkout page.'
    },
    {
      qAr: 'هل استخدام منصة قارن تك ومقارنة الهواتف مجاني بالكامل؟',
      qEn: 'Is using QarenTech to compare phones completely free?',
      aAr: 'نعم، 100% مجاناً للمستهلكين. يمكنك استعراض جميع الهواتف، استخدام محرك المقارنة جنباً إلى جنب، وتفعيل تنبيهات هبوط الأسعار دون أي رسوم أو اشتراكات مخفية.',
      aEn: 'Yes, 100% free for consumers. You can browse phones, run side-by-side spec comparisons, and configure price drop alerts without any fees or hidden subscriptions.'
    },
    {
      qAr: 'من المسؤول عن الضمان وخدمات ما بعد البيع والاسترجاع؟',
      qEn: 'Who handles warranty, after-sales service, and returns?',
      aAr: 'المتجر الذي أتممت الشراء من خلاله والوكيل المعتمد للهاتف (مثل آبل أو سامسونج) هما المسؤولان عن الضمان وسياسات الاسترجاع والاستبدال. ننصح دائماً بالاحتفاظ بالفاتورة الضريبية الصادرة من المتجر.',
      aEn: 'The merchant through whom you completed your order and the authorized brand distributor (e.g. Apple or Samsung) are solely responsible for warranty, returns, and repairs. Always retain the official tax invoice provided by the merchant.'
    },
    {
      qAr: 'هل يُسمح بنسخ محتوى قارن تك أو كشط البيانات آلياً (Web Scraping)؟',
      qEn: 'Is web scraping or automated content harvesting permitted?',
      aAr: 'يُحظر تماماً استخدام برامج الزحف الآلي، الكاشطات (Scrapers)، أو أدوات الذكاء الاصطناعي لنسخ قاعدة بياناتنا أو إرهاق السيرفرات دون إذن كتابي مسبق، وفقاً لما هو منصوص عليه في ملف robots.txt وشروط الخدمة.',
      aEn: 'Automated crawlers, scraping tools, and bot harvesters are strictly prohibited from copying our proprietary database or overwhelming our infrastructure without explicit written permission, as outlined in robots.txt and our Terms.'
    }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700 hover:border-amber-500/50"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{isArabic ? 'العودة واستعراض الهواتف' : 'Back to Explore Phones'}</span>
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-3 py-1 rounded-full font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isArabic ? 'وثيقة سارية ومعتمدة' : 'Official Legal Terms'}
              </span>
              <span>{isArabic ? 'آخر تحديث: أكتوبر 2026' : 'Last Updated: October 2026'}</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/10 shrink-0">
              <Scale className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
                {isArabic ? 'شروط وأحكام الاستخدام' : 'Terms of Service & Usage'}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                {isArabic
                  ? 'يرجى قراءة هذه الشروط بعناية قبل استخدام منصة قارن تك (QarenTech). باستخدامك للموقع، فإنك توافق على الالتزام الكامل بهذه الأحكام والسياسات التي تحكم تجربة تصفحك ومقارنة الأسعار.'
                  : 'Please review these Terms carefully before using QarenTech. By accessing or using our platform, you agree to be bound by these legal terms governing your browsing and price-comparison experience.'}
              </p>
            </div>
          </div>

          {/* Quick Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-8 border-t border-slate-800 text-xs">
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/80 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">{isArabic ? 'خدمة مجانية 100%' : '100% Free Service'}</span>
                <span className="text-slate-400 text-[11px]">{isArabic ? 'لا توجد أي رسوم أو عمولات على المتصفحين' : 'No hidden fees or charges for consumers'}</span>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/80 flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">{isArabic ? 'حيادية وموضوعية تامة' : 'Strict Impartiality'}</span>
                <span className="text-slate-400 text-[11px]">{isArabic ? 'المقارنة مبنية على المواصفات الرسمية وأسعار المتاجر' : 'Objective specs and verified merchant pricing'}</span>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/80 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">{isArabic ? 'أمان وسرية البيانات' : 'Privacy & Safety'}</span>
                <span className="text-slate-400 text-[11px]">{isArabic ? 'متوافق مع أفضل ممارسات حماية بيانات المستهلك' : 'Strict consumer data privacy standards'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Navigation Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="sticky top-24 bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                <FileText className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {isArabic ? 'أقسام شروط الاستخدام' : 'Table of Contents'}
                </h3>
              </div>

              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-start transition-colors ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-500'}`} />
                      <span className="truncate">{isArabic ? section.titleAr : section.titleEn}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Action Navigation */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                <button
                  onClick={onOpenCompare}
                  className="w-full flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span>{isArabic ? 'فتح أداة المقارنة المباشرة' : 'Launch Comparison Tool'}</span>
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400">⚡</span>
                </button>

                {onOpenPrivacy && (
                  <button
                    onClick={onOpenPrivacy}
                    className="w-full flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-sky-500" />
                      <span>{isArabic ? 'سياسة الخصوصية وسرية البيانات' : 'Privacy Policy'}</span>
                    </span>
                    <span className="text-slate-400 text-[10px]">🔒</span>
                  </button>
                )}

                {onOpenContact && (
                  <button
                    onClick={onOpenContact}
                    className="w-full flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{isArabic ? 'تواصل مع الدعم القانوني' : 'Contact Support'}</span>
                    </span>
                    <span className="text-slate-400 text-[10px]">✉️</span>
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Legal Clauses & Content */}
          <main className="lg:col-span-8 space-y-8">
            {/* 1. Intro */}
            <section id="intro" className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? '1. مقدمة والموافقة على الشروط' : '1. Acceptance & Overview'}
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  {isArabic
                    ? 'أهلاً بك في منصة "قارن تك" (QarenTech). تنظم شروط الاستخدام هذه وصولك إلى موقعنا الإلكتروني واستخدامك لجميع الخدمات والأدوات البرمجية، بما في ذلك محرك مقارنة الهواتف، تنبيهات الأسعار، ومسح الباركود.'
                    : 'Welcome to QarenTech. These Terms of Service govern your access and use of our website, features, and tools, including our smartphone comparison engine, price alert notifications, and barcode scanner.'}
                </p>
                <p>
                  {isArabic
                    ? 'بمجرد استخدامك للمنصة أو تصفح أي صفحة فيها، فإنك تقر بأنك قرأت هذه الشروط وفهمتها ووافقت على الالتزام بها كاملاً. إذا كنت لا توافق على أي بند من هذه الشروط، يرجى التوقف عن استخدام المنصة.'
                    : 'By browsing or using QarenTech, you acknowledge that you have read, understood, and agreed to be legally bound by these terms. If you do not agree, please discontinue using the service.'}
                </p>
              </div>
            </section>

            {/* 2. Nature of Service */}
            <section id="nature" className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
                  <Scale className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? '2. طبيعة المنصة وحيادية المقارنة' : '2. Service Nature & Impartiality'}
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  {isArabic
                    ? '"قارن تك" محرك بحث ومقارنة مستقل يهدف لتمكين المستخدم من اتخاذ قرار شراء ذكي مستند إلى بيانات دقيقة وموثوقة. نحن لا نمتلك مستودعات للهواتف، ولا نقوم بعمليات البيع المباشر أو الشحن أو التوزيع.'
                    : 'QarenTech is an independent price search and comparison platform. We do not stock devices, manage warehouses, or process retail fulfillment and customer payments.'}
                </p>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{isArabic ? 'مبادئنا في المقارنة:' : 'Our Core Comparison Principles:'}</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs">
                    <li>{isArabic ? 'الحيادية التامة وعدم تفضيل أي شركة مصنعة على أخرى دون سند تقني.' : 'Strict impartiality without favoring any manufacturer.'}</li>
                    <li>{isArabic ? 'اعتماد المواصفات التقنية الرسمية الصادرة من الشركات المصنعة (المعالج، الكاميرا، البطارية، الشاشة).' : 'Relying strictly on official factory specifications.'}</li>
                    <li>{isArabic ? 'عرض أسعار المتاجر المعتمدة بشفافية لمساعدة المستهلك في توفير أمواله.' : 'Displaying authorized retailer prices with full consumer transparency.'}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. Pricing Accuracy & Disclaimer */}
            <section id="prices" className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? '3. دقة الأسعار وتوافر المخزون وإخلاء المسؤولية' : '3. Pricing Accuracy & Disclaimer'}
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  {isArabic
                    ? 'يتم تحديث أسعار الهواتف وتوافر المخزون دورياً عبر مصادر المتاجر المعلنة. ورغم جهودنا المستمرة لضمان دقة وتطابق كل رقم معروض، قد تحدث فروق لحظية ناجمة عن:'
                    : 'Smartphone prices and in-stock statuses are updated systematically. Although we endeavor to provide the most exact figures, temporary discrepancies may arise from:'}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <li className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60">
                    ⚡ {isArabic ? 'انتهاء عروض البرق المفاجئة لدى المتجر البائع.' : 'Instant flash sale expirations on merchant pages.'}
                  </li>
                  <li className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60">
                    📦 {isArabic ? 'نفاد مخزون السعة التخزينية أو اللون المختار.' : 'Sudden inventory depletion for specific colors/capacities.'}
                  </li>
                  <li className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60">
                    💱 {isArabic ? 'فروق طفيفة في أسعار الصرف أو ضرائب الشحن الدولي DDP.' : 'Currency conversion shifts or localized customs/DDP taxes.'}
                  </li>
                  <li className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60">
                    🏷️ {isArabic ? 'كوبونات الخصم الحصرية المطبقة داخل عربة التسوق.' : 'Exclusive coupon codes applied directly inside the cart.'}
                  </li>
                </ul>
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900 text-xs font-semibold">
                  {isArabic
                    ? '⚠️ إخلاء مسؤولية قانوني: السعر النهائي المعتمد والملزم لك وللمتجر هو السعر الظاهر على شاشة إنهاء الطلب (Checkout) لدى المتجر البائع لحظة الشراء.'
                    : '⚠️ Legal Disclaimer: The authoritative and legally binding price is the final price shown on the checkout screen of the merchant at the time of purchase.'}
                </div>
              </div>
            </section>

            {/* 4. Partner Stores & Affiliate Links */}
            <section id="stores" className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? '4. المتاجر الشريكة والروابط التسويقية (Affiliate Disclosure)' : '4. Partner Stores & Affiliate Disclosure'}
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  {isArabic
                    ? 'يحتوي موقع "قارن تك" على روابط توجهك إلى منصات ومتاجر خارجية معتمدة (مثل أمازون السعودية، نون، جرير، إكسترا، بي آند إتش، وعلي إكسبريس). عندما تنقر على رابط للشراء، قد نتلقى عمولة تسويقية صغيرة من المتجر دون أن يترتب على ذلك أي تكلفة إضافية عليك إطلاقاً.'
                    : 'QarenTech includes outbound links to authorized retailers (such as Amazon SA, Noon, Jarir, Extra, B&H, AliExpress). When you click to buy, we may earn a small affiliate commission at absolutely zero additional cost to you.'}
                </p>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    {isArabic
                      ? 'هذه العمولات التسويقية تساعدنا على تشغيل خوادم الموقع، وتطوير خوارزميات المقارنة الذكية، وإبقاء كافة الأدوات مجانية بالكامل للمستخدمين، دون أي تأثير على ترتيب أو موضوعية المقارنات.'
                      : 'These commissions sustain our server costs and engineering development, ensuring our platform remains free for all users without biasing comparison results.'}
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Acceptable Use */}
            <section id="acceptable-use" className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
                  <Ban className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? '5. قواعد الاستخدام المشروع والمحظورات' : '5. Acceptable Use & Prohibited Conduct'}
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  {isArabic
                    ? 'أنت توافق على استخدام المنصة للأغراض الشخصية والقانونية فقط، وتتعهد بالامتناع عن الأفعال التالية:'
                    : 'You agree to use QarenTech solely for lawful personal purposes and agree not to:'}
                </p>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{isArabic ? 'كشط البيانات آلياً (Web Scraping / Crawling) أو استخراج قاعدة بيانات الأسعار والمواصفات لأغراض تجارية منافسة دون إذن مسبق.' : 'Scraping or harvesting catalog specifications or price databases without express written permission.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{isArabic ? 'محاولة تعطيل أو التحميل الزائد على خوادم المنصة (DDoS) أو استغلال الثغرات الأمنية.' : 'Attempting to disrupt or overload servers (DoS/DDoS) or reverse-engineering platform logic.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{isArabic ? 'نشر مراجعات أو تقييمات مزيفة أو مسيئة أو مضللة في قسم آراء المستخدمين.' : 'Submitting fraudulent, defamatory, or abusive reviews and ratings.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{isArabic ? 'انتهاك حقوق الملكية الفكرية أو انتحال شخصية موقع أو علامة تجارية أخرى.' : 'Infringing intellectual property or misrepresenting affiliation.'}</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 6. Intellectual Property */}
            <section id="intellectual-property" className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? '6. الملكية الفكرية وحقوق العلامات التجارية' : '6. Intellectual Property & Trademarks'}
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  {isArabic
                    ? 'جميع التصاميم، الشعارات، الكود المصدري، وتنسيقات المقارنة الخاصة بمنصة "قارن تك" محمية بموجب قوانين الملكية الفكرية وحقوق النشر.'
                    : 'All interface designs, branding, source code, and comparison layouts created by QarenTech are protected by copyright and intellectual property laws.'}
                </p>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    {isArabic ? 'العلامات التجارية للشركات المصنعة:' : 'Manufacturer Trademarks:'}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">
                    {isArabic
                      ? 'أسماء الهواتف، شعارات الشركات (Apple, Samsung, Xiaomi, Google, Honor, OnePlus)، وصور المنتجات هي علامات تجارية مسجلة مملوكة لشركاتها الأم، وتُستخدم هنا لأغراض التعريف والمقارنة والتوثيق للمستهلك فقط (Fair Use / Nominative Use).'
                      : 'Product names, trademarks, and logos (Apple, Samsung, Xiaomi, Google, etc.) remain property of their respective owners, displayed strictly for nominative reference and identification.'}
                  </p>
                </div>
              </div>
            </section>

            {/* 7. User Alerts */}
            <section id="user-alerts" className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? '7. خدمات التنبيهات ومسؤوليات المستخدم' : '7. Alerts & User Responsibilities'}
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  {isArabic
                    ? 'عند تفعيل تنبيه لهبوط سعر هاتف معين، يوافق المستخدم على استقبال رسالة تنبيهية بريدية عند تحقق الشرط. نحن نسعى لتقديم التنبيهات بالسرعة القصوى، لكننا لا نضمن وصول الرسائل فوراً نظراً لاحتمال تأخر مزودات البريد الإلكتروني أو تصفيتها في مجلد الرسائل غير المرغوب فيها.'
                    : 'When subscribing to a price drop alert, you agree to receive notification emails upon threshold fulfillment. While we aim for real-time alerts, we cannot guarantee zero email latency due to third-party mail filtering.'}
                </p>
                <p>
                  {isArabic
                    ? 'يمكنك في أي وقت إلغاء أي تنبيه أو إدارة تفضيلاتك بنقرة واحدة من لوحة التنبيهات دون أي قيود.'
                    : 'You may cancel alerts or update alert preferences anytime via the Alerts Manager.'}
                </p>
              </div>
            </section>

            {/* 8. Modifications */}
            <section id="updates" className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? '8. تعديل الشروط وسريانها' : '8. Terms Amendments'}
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  {isArabic
                    ? 'نحتفظ بالحق في تحديث أو تعديل شروط الاستخدام هذه في أي وقت لتعكس أي تغييرات في خدماتنا أو المتطلبات القانونية والتنظيمية. تسري أي تعديلات فور نشرها على هذه الصفحة مع تحديث تاريخ المراجعة في الأعلى.'
                    : 'We reserve the right to revise these Terms of Service periodically to reflect operational changes or statutory requirements. Updates are effective upon publication on this page.'}
                </p>
              </div>
            </section>

            {/* 9. Contact */}
            <section id="contact" className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? '9. التواصل والاستفسارات القانونية' : '9. Legal Inquiries & Support'}
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  {isArabic
                    ? 'إذا كانت لديك أي استفسارات أو ملاحظات أو بلاغات حول شروط الاستخدام أو حقوق الملكية الفكرية، يسعدنا تواصلك مع فريقنا القانوني والدعم الفني:'
                    : 'If you have any questions or feedback regarding these terms or IP inquiries, please reach out to our legal and support team:'}
                </p>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-slate-400 text-xs block">{isArabic ? 'البريد الإلكتروني الرسمي:' : 'Official Contact Email:'}</span>
                    <a href="mailto:support@games-children.com" className="text-amber-500 font-bold hover:underline text-sm">
                      support@games-children.com
                    </a>
                  </div>

                  {onOpenContact && (
                    <button
                      onClick={onOpenContact}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'نموذج التواصل السريع' : 'Quick Contact Form'}</span>
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Interactive FAQs Accordion */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? 'الأسئلة الشائعة حول شروط الاستخدام' : 'Terms FAQ'}
                </h2>
              </div>

              <div className="space-y-3">
                {termsFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-start bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                      >
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white pe-3">
                          {isArabic ? faq.qAr : faq.qEn}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 leading-relaxed">
                          {isArabic ? faq.aAr : faq.aEn}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Navigation CTA */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-base sm:text-lg mb-1">
                  {isArabic ? 'جاهز للعثور على أفضل سعر لهاتفك القادم؟' : 'Ready to discover the lowest phone prices?'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isArabic ? 'قارن المواصفات التقنية وجهاً لوجه واقتنص أقوى الصفقات اليوم.' : 'Compare full device specs and lock in the best deals across verified stores.'}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={onExplore}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition-colors shadow-xs"
                >
                  {isArabic ? 'استعراض الهواتف' : 'Explore Phones'}
                </button>
                <button
                  onClick={onOpenCompare}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-600 transition-colors"
                >
                  {isArabic ? 'المقارنة المباشرة' : 'Compare Now'}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
