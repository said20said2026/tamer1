import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  TrendingDown, 
  Sparkles, 
  Eye, 
  Users, 
  Target, 
  Award, 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Smartphone, 
  Volume2, 
  CheckCircle2, 
  RotateCcw,
  Store,
  DollarSign,
  HeartHandshake,
  Cpu
} from 'lucide-react';

interface AboutUsPageProps {
  onExplore: () => void;
  onOpenCompare: () => void;
  onOpenVoiceChat: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onExplore,
  onOpenCompare,
  onOpenVoiceChat,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'ما هو موقع قارن تك وما هي طبيعة عمله؟',
      a: 'قارن تك هو محرك بحث وتقييم ومقارنة أسعار ذكي ومستقل للهواتف الذكية في الشرق الأوسط. نقوم بمسح وفحص الأسعار وتوافر الأجهزة في كبرى المتاجر الرسمية المعتمدة (مثل أمازون، نون، جرير، إكسترا وغيرها) ونقدمها لك في شاشة واحدة مع سجل تاريخي لتقلبات الأسعار لمساعدتك في اتخاذ أفضل قرار شراء دون أي تحيز.'
    },
    {
      q: 'هل الشراء يتم من خلال قارن تك مباشرة؟',
      a: 'لا، موقع قارن تك لا يبيع الهواتف بنفسه ولا يستلم أي مدفوعات نقدية منك. عند اختيارك العرض الأنسب، يقوم الموقع بتوجيهك مباشرة إلى المتجر الرسمي صاحب العرض لإتمام عملية الشراء الآمنة وفق سياسات وضمانات المتجر المعتمد.'
    },
    {
      q: 'هل استخدام خدمات المقارنة والتنبيهات مجاني؟',
      a: 'نعم بالكامل! جميع ميزات قارن تك — بما فيها مقارنة المواصفات التفصيلية، فحص تاريخ الأسعار خلال 6 أشهر، إنشاء تنبيهات نزول السعر عبر البريد، واستشارة الذكاء الاصطناعي الصوتي — مجانية 100% لجميع المستخدمين.'
    },
    {
      q: 'كيف تضمنون دقة وتحديث الأسعار المعروضة؟',
      a: 'يعتمد محرك قارن تك على خوارزميات ربط وتحديث دورية ترصد تغييرات أسعار المتاجر، العروض الترويجية، وكوبونات الخصم، مع مراعاة احتساب ضريبة القيمة المضافة ومصاريف الشحن المتوقعة لإظهار التكلفة الفعلية الحقيقية.'
    },
    {
      q: 'ما هو قسم الأجهزة المجددة والمستعملة في قارن تك؟',
      a: 'هو قسم مخصص يرصد عروض الهواتف المجددة المعتمدة (Certified Refurbished) والأجهزة المستعملة بحالة ممتازة من المتاجر الرسمية، مع توضيح درجات الحالة (Grade A)، نسبة صحة البطارية، الضمان المعتمد، ونسبة التوفير المالي التي تصل إلى 35% مقارنة بسعر الجديد.'
    },
  ];

  const milestones = [
    { number: '+50K', label: 'مستخدم نشط شهرياً', desc: 'يعتمدون على المنصة لاختيار هواتفهم الذكية' },
    { number: '+12', label: 'متجراً معتمداً', desc: 'نربط عروضها الحية في السعودية والخليج' },
    { number: '35%', label: 'أقصى نسبة توفير', desc: 'متوسط وفر مالي يحققه المتسوقون الأذكياء' },
    { number: '100%', label: 'حيادية واستقلالية', desc: 'عرض شفاف لا يقبل التحيز لأي تاجر' },
  ];

  const values = [
    {
      icon: <Eye className="w-5 h-5 text-amber-500" />,
      title: 'الشفافية المطلقة والنزاهة',
      desc: 'نعرض الأسعار كما هي في الواقع بدون تضخيم أو إخفاء أي تكاليف شحن أو ضرائب، مع كشف سجل الأسعار الحقيقي للأشهر السابقة.'
    },
    {
      icon: <Scale className="w-5 h-5 text-emerald-500" />,
      title: 'الحيادية والاستقلالية التامة',
      desc: 'لا ننحاز لأي متجر أو علامة تجارية. ترتيب العروض يخضع لمعيار وحيد هو الأرخص والأفضل فائدة للمستهلك العربي.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-sky-500" />,
      title: 'الابتكار والذكاء التقني',
      desc: 'نوفر تقنيات متطورة مثل البحث الصوتي باللغة العربية، رسوم Recharts البيانية للتسعير ورضا المستخدمين، والمستشار الصوتي الذكي.'
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-rose-500" />,
      title: 'حماية المستهلك والاقتصاد المستدام',
      desc: 'ندعم خيارات الشراء المستدام عبر تسليط الضوء على الأجهزة المجددة الموثوقة، وتنبيه المشترين قبل فوات العروض الترويجية.'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors pb-16">
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4 sm:space-y-6">
          {/* Breadcrumb / Category text */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>منصة قارن تك</span>
            <span aria-hidden="true">·</span>
            <span>عن المنصة ورسالتها</span>
            <span aria-hidden="true">·</span>
            <span>الشفافية في عالم الهواتف</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            من نحن — نبني بوصلة الشراء الذكي للهواتف الذكية في العالم العربي
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            انطلقت منصة <strong className="text-slate-900 dark:text-white font-extrabold">قارن تك</strong> بهدف واحد واضح: تمكين المستهلك العربي من معرفة الحقيقة الكاملة وراء أسعار ومواصفات الهواتف الذكية، وحمايته من التخفيضات الوهمية والفروقات السعرية بين المتاجر الكبرى.
          </p>

          {/* Quick Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onExplore}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>استعراض ومقارنة الأسعار</span>
            </button>

            <button
              onClick={onOpenCompare}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2"
            >
              <Scale className="w-4 h-4 stroke-[2.5]" />
              <span>المقارنة المباشرة بين الأجهزة</span>
            </button>

            <button
              onClick={onOpenVoiceChat}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-amber-500" />
              <span>استشر المساعد الصوتي</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS & MILESTONES BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-1 transition-colors"
            >
              <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono block">
                {m.number}
              </span>
              <strong className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white block">
                {m.label}
              </strong>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. OUR STORY & THE PROBLEM WE SOLVE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Target className="w-4 h-4" />
              <span>لماذا بدأنا قارن تك؟</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              سوق الهواتف الذكية معقد... ونحن هنا لتبسيطه تماماً
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              عند شراء هاتف ذكي جديد، يضطر المشتري لفتح 7 أو 8 صفحات متاجر مختلفة، مقارنة السعات وحجم الرام، البحث عن أكواد الخصم، والتساؤل عما إذا كان الخصم المعلن حقيقياً أم تم رفع السعر الأصلي بالأمس فقط!
            </p>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              قمنا ببناء <strong className="text-slate-900 dark:text-white">قارن تك</strong> ليختصر كل هذا العناء في بضع ثوانٍ: نجمع لك كل المتاجر في مكان واحد، ونكشف لك منحنى الأسعار عبر 6 أشهر برسم بياني شفاف، ونمكنك من مقارنة المواصفات والتقييمات الحقيقية بموضوعية كاملة.
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>رصد تلقائي لأكثر من 10 متاجر إلكترونية رسمية ومعتمدة</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>حساب دقيق لأسعار النسخ والتخزينات (128GB، 256GB، 512GB، 1TB)</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>سوق مخصص للأجهزة المجددة والمستعملة مع معايير الفحص والضمان</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">معايير محرك قارن تك</h3>
                  <span className="text-[10px] text-slate-400">الدقة والحيادية التقنية</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                100% مستقل
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">دقة مطابقة المواصفات</span>
                <span className="font-mono font-bold text-emerald-400">99.8%</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">تحديث الأسعار اليومي</span>
                <span className="font-mono font-bold text-amber-400">كل 4 ساعات</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">العملات المدعومة</span>
                <span className="font-mono font-bold text-sky-400">SAR · AED · KWD · EUR · USD</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">تقنيات الرسوم البيانية</span>
                <span className="font-mono font-bold text-purple-400">Recharts Interactive</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-4">
              "هدفنا هو ألا يدفع أي شخص ريالاً واحداً زيادة في ثمن هاتفه القادم، مع ضمان حصوله على الجهاز الأنسب لاحتياجاته الفعلية."
            </p>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES GRID */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              قيم ومبادئ منصة قارن تك
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              المعايير الصارمة التي نلتزم بها أمام كل زائر وباحث عن هاتف ذكي
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-slate-50 dark:bg-slate-800/50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 shadow-2xs flex items-center justify-center shrink-0">
                  {v.icon}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {v.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              <HelpCircle className="w-4 h-4" />
              <span>الأسئلة الأكثر تداولاً</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              كل ما تود معرفته عن منصة قارن تك
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-right p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA BOX */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-amber-500 via-amber-400 to-amber-500 rounded-3xl p-6 sm:p-10 text-slate-950 shadow-lg text-center space-y-4">
          <h3 className="text-xl sm:text-3xl font-black tracking-tight">
            هل تبحث عن هاتفك القادم بأفضل سعر متاح؟
          </h3>
          <p className="text-xs sm:text-sm text-slate-900 font-medium max-w-xl mx-auto leading-relaxed">
            استعرض مئات الهواتف الآن، قارن العروض بين المتاجر الكبرى، واكتشف خيارات الهواتف المجددة والمستعملة المعتمدة.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onExplore}
              className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95"
            >
              استعراض الهواتف والأسعار
            </button>
            <button
              onClick={onOpenCompare}
              className="px-6 py-3 bg-white/90 hover:bg-white text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs active:scale-95"
            >
              بدء مقارنة المواصفات
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
