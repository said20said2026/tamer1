import React from 'react';
import {
  Scale,
  Sparkles,
  ShieldCheck,
  Target,
  Users,
  TrendingUp,
  Award,
  Zap,
  Globe2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Heart,
  BarChart3,
  Cpu,
  ShoppingBag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AboutUsPageProps {
  onExplore: () => void;
  onOpenCompare: () => void;
  onOpenContact: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onExplore,
  onOpenCompare,
  onOpenContact,
}) => {
  const { isArabic, direction } = useLanguage();
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

  const stats = [
    {
      value: '+150',
      labelAr: 'هاتف ذكي مُحدث دورياً',
      labelEn: 'Smartphones tracked live',
      icon: Cpu,
    },
    {
      value: '+12',
      labelAr: 'متجر محلي وعالمي معتمد',
      labelEn: 'Verified local & global stores',
      icon: ShoppingBag,
    },
    {
      value: '25%+',
      labelAr: 'متوسط توفير المستهلك',
      labelEn: 'Average user savings',
      icon: TrendingUp,
    },
    {
      value: '+500,000',
      labelAr: 'عملية مقارنة شهرياً',
      labelEn: 'Monthly comparison queries',
      icon: BarChart3,
    },
  ];

  const values = [
    {
      titleAr: 'الحيادية والنزاهة المطلقة',
      titleEn: '100% Unbiased & Neutral',
      descAr: 'لا نفضل أي متجر أو علامة تجارية على أخرى. الترتيب والأسعار تظهر بشفافية تامة لتمنحك الصفقة الحقيقية الأوفر دون أي تحيز تجاري.',
      descEn: 'We do not favor any retailer or manufacturer. Listings and prices are displayed with total transparency so you always find the genuine best deal.',
      icon: Scale,
      color: 'amber',
    },
    {
      titleAr: 'تحديث الأسعار المباشر',
      titleEn: 'Real-Time Price Updates',
      descAr: 'محركنا الذكي يتتبع فروق الأسعار والعروض الترويجية في أمازون، نون، جرير، إكسترا، والمتاجر العالمية على مدار الساعة.',
      descEn: 'Our smart engine tracks price changes and promotions across Amazon, Noon, Jarir, Extra, and global stores 24/7.',
      icon: Zap,
      color: 'sky',
    },
    {
      titleAr: 'المواصفات التقنية الدقيقة',
      titleEn: 'In-Depth Verified Specs',
      descAr: 'نقارن المعالجات، الكاميرات، الشاشات، وعمر البطارية بجداول مفصلة ودرجات تقييم فنية مستندة إلى اختبارات معيارية عالمية.',
      descEn: 'We compare processors, cameras, displays, and battery life with detailed benchmark scores and verified technical data.',
      icon: Award,
      color: 'emerald',
    },
    {
      titleAr: 'حماية بيانات المستهلك',
      titleEn: 'Consumer Privacy & Security',
      descAr: 'نلتزم بأعلى معايير حماية البيانات وسرية المعلومات. لا نبيع بياناتك الشخصية لأي طرف ثالث ولا نشارك سجلات تصفحك مع معلنين.',
      descEn: 'We respect your data privacy with strict safeguards. We never sell your personal information or browsing habits to third parties.',
      icon: ShieldCheck,
      color: 'indigo',
    },
  ];

  const features = [
    {
      titleAr: 'مستشار الذكاء الاصطناعي الصوتي (Gemini)',
      titleEn: 'Gemini AI Voice Buying Advisor',
      descAr: 'تحدث بصوتك مباشرة مع مساعدنا الذكي ليقترح عليك الهاتف الأنسب لميزانيتك واحتياجاتك الشخصية (التصوير، الألعاب، العمل).',
      descEn: 'Talk directly to our AI voice advisor to get instant tailored recommendations matching your budget and usage.',
    },
    {
      titleAr: 'تنبيهات هبوط الأسعار التلقائية',
      titleEn: 'Instant Price Drop Notifications',
      descAr: 'حدد سعرك المستهدف لأي هاتف، وسنرسل لك إشعاراً فور وصول الهاتف إلى السعر المطلوب لتوفير نقودك.',
      descEn: 'Set a target price for any phone and receive instant alerts the moment it reaches your budget threshold.',
    },
    {
      titleAr: 'مقارنة الشحن والجمارك DDP للمتاجر العالمية',
      titleEn: 'Global DDP Customs & Shipping Transparency',
      descAr: 'نعرض أسعار المتاجر العالمية (Amazon US, AliExpress, B&H) مع حساب تكلفة الجمارك وضريبة القيمة المضافة لضمان التكلفة الصافية.',
      descEn: 'Compare global stores with prepaid customs and VAT (DDP) so there are no surprise fees upon arrival.',
    },
    {
      titleAr: 'تقييمات المستخدمين الحقيقية',
      titleEn: 'Genuine Community User Reviews',
      descAr: 'قراءة تجارب حقيقية من مشترين استخدموا الهاتف لأسابيع وشهور مع نظام تقييم نقاط القوة والضعف.',
      descEn: 'Read real verified feedback from users who tested the phones, covering battery longevity and day-to-day speed.',
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Navigation Breadcrumb / Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <BackArrow className="w-4 h-4" />
            <span>{isArabic ? 'العودة إلى معرض الهواتف' : 'Back to Phones Gallery'}</span>
          </button>

          <span className="text-xs font-semibold text-slate-400">
            {isArabic ? 'قارن تك · من نحن' : 'QarenTech · About Us'}
          </span>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="absolute top-0 end-0 -mt-8 -me-8 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 -mb-8 -ms-8 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isArabic ? 'المنصة الرائدة في مقارنة الهواتف الذكية' : 'The Leading Smartphone Comparison Platform'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {isArabic ? (
                <>
                  نبسّط قرار الشراء، ونضمن لك <span className="text-amber-400">أفضل سعر</span> و <span className="text-amber-400">أعلى قيمة</span>
                </>
              ) : (
                <>
                  Simplifying your purchase to ensure the <span className="text-amber-400">Best Price</span> and <span className="text-amber-400">Highest Value</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {isArabic
                ? 'انطلقت منصة "قارن تك" بهدف سد الفجوة بين المستهلك العربي والخيارات المتعددة في سوق الهواتف الذكية. نجمع أسعار المتاجر الكبرى محلياً وعالمياً في مكان واحد لتمكينك من اتخاذ قرار شرائي مدروس وموفر للمال.'
                : 'QarenTech was built to empower consumers with clarity in an overcrowded smartphone market. We aggregate live prices across top local and international retailers in one intuitive hub.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onExplore}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                <span>{isArabic ? 'استعراض الهواتف والأسعار' : 'Explore Phones & Prices'}</span>
              </button>

              <button
                onClick={onOpenCompare}
                className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all active:scale-95 flex items-center gap-2"
              >
                <Scale className="w-4 h-4 text-amber-400" />
                <span>{isArabic ? 'قارن بين هاتفين الآن' : 'Compare Phones Head-to-Head'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center shadow-xs flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {isArabic ? stat.labelAr : stat.labelEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {isArabic ? 'رسالتنا' : 'Our Mission'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isArabic
                ? 'توفير محرك بحث تقني متكامل وموثوق يضع الشفافية في المقام الأول، ويمنح المشتري الأدوات الذكية لاكتشاف فروق الأسعار، ومقارنة المواصفات وجهاً لوجه، واقتناص التخفيضات الحقيقية دون إضاعة الوقت بين المواقع المختلفة.'
                : 'To deliver a comprehensive, trusted shopping engine prioritizing transparency, giving consumers the tools to uncover genuine price drops, compare specs side-by-side, and save time and money.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {isArabic ? 'رؤيتنا' : 'Our Vision'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isArabic
                ? 'أن نكون المرجع الرقمي الأول والمفضل للمستهلكين في الشرق الأوسط وشمال أفريقيا قبل اتخاذ أي قرار باقتناء جهاز إلكتروني أو هاتف ذكي، بالاعتماد على أدوات الذكاء الاصطناعي والتحليل الفوري للسوق.'
                : 'To be the definitive digital benchmark for consumers across MENA before purchasing any tech device, driven by advanced AI intelligence and real-time market tracking.'}
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isArabic ? 'قيمنا ومبادئنا الراسخة' : 'Our Core Principles'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isArabic
                ? 'المعايير التي توجه كل قرار نتخذه وكل ميزة نطورها داخل المنصة'
                : 'The standards that guide every feature we build and every algorithm we deploy'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-amber-500 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isArabic ? val.titleAr : val.titleEn}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isArabic ? val.descAr : val.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why QarenTech Features Showcase */}
        <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 tracking-wider uppercase">
              {isArabic ? 'أحدث الابتكارات التقنية' : 'Next-Gen Innovations'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isArabic ? 'ما الذي يميز منصة قارن تك؟' : 'What Sets QarenTech Apart?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 shadow-xs flex items-start gap-3.5"
              >
                <div className="mt-1 w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {isArabic ? feat.titleAr : feat.titleEn}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isArabic ? feat.descAr : feat.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action & Contact Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-start">
            <h3 className="text-xl sm:text-2xl font-black">
              {isArabic ? 'هل لديك استفسار أو اقتراح لمتجر جديد؟' : 'Have a question or store suggestion?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-900/80 max-w-xl">
              {isArabic
                ? 'فريق الدعم الفني وتحديث البيانات جاهز لاستقبال رسائلكم واقتراحاتكم لتطوير التجربة باستمرار.'
                : 'Our support team is always ready to receive your feedback and suggestions to improve the platform.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenContact}
              className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>{isArabic ? 'تواصل معنا الآن' : 'Contact Us Today'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
