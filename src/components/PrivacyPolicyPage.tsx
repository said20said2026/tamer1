import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Bell,
  Scale,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Volume2,
  Database,
  ExternalLink,
  Mail,
  RefreshCw,
  Cookie,
  Server
} from 'lucide-react';

interface PrivacyPolicyPageProps {
  onExplore: () => void;
  onOpenCompare: () => void;
  onOpenVoiceChat: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onExplore,
  onOpenCompare,
  onOpenVoiceChat,
}) => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [contactMessage, setContactMessage] = useState<string>('');

  const sections = [
    { id: 'intro', title: 'مقدمة والتزامنا', icon: ShieldCheck },
    { id: 'collected-data', title: 'البيانات التي نجمعها', icon: Database },
    { id: 'cookies', title: 'ملفات تعريف الارتباط', icon: Cookie },
    { id: 'usage', title: 'كيف نستخدم معلوماتك', icon: Server },
    { id: 'external-stores', title: 'الشفافية والمتاجر الشريكة', icon: ExternalLink },
    { id: 'security', title: 'أمان البيانات والتشفير', icon: Lock },
    { id: 'user-rights', title: 'حقوقك والتحكم في بياناتك', icon: UserCheck },
    { id: 'contact', title: 'التواصل والاستفسارات', icon: Mail },
  ];

  const privacyFaqs = [
    {
      q: 'هل يقوم موقع "قارن تك" ببيع أو مشاركة بياناتي الشخصية مع معلنين خارجيين؟',
      a: 'قطعاً لا. سياستنا الصارمة تمنع بيع، تأجير، أو تداول أي بيانات شخصية تخص مستخدمينا (كالبريد الإلكتروني أو قوائم التفضيلات) لأي طرف خارجي لأغراض تسويقية أو دعائية.'
    },
    {
      q: 'كيف تعمل تنبيهات انخفاض الأسعار؟ وماذا يحدث لبريدي الإلكتروني؟',
      a: 'عند تسجيل تنبيه لسعر هاتف معين، نستخدم بريدك الإلكتروني حصراً لإرسال إشعار لحظي فور انخفاض سعر الهاتف للقيمة المحددة. يمكنك حذف أي تنبيه في أي وقت بنقرة واحدة من صفحة إدارة التنبيهات.'
    },
    {
      q: 'هل يتم تسجيل استفساراتي الصوتية مع مستشار الشراء الذكي (Gemini)؟',
      a: 'تُعالج استفساراتك الصوتية أثناء الجلسة الحية فقط لتقديم التوصية الفورية للهاتف الأنسب لك. لا نقوم بتسجيل أو تخزين تسجيلاتك الصوتية الدائمة أو ربطها بهويتك الشخصية خارج نطاق الجلسة.'
    },
    {
      q: 'ما هو دور الروابط الخارجية للمتاجر مثل أمازون، نون، جرير، وإكسترا؟',
      a: 'قارن تك هو محرك مستقل لمقارنة الأسعار والمواصفات. عندما تضغط على "عرض في المتجر"، يتم توجيهك إلى المتجر الرسمي لإتمام الشراء. تخضع عمليات الدفع والطلب لسياسة الخصوصية الخاصة بالمتجر البائع.'
    },
    {
      q: 'كيف يمكنني حذف بياناتي أو إلغاء حسابي بالكامل؟',
      a: 'لك كامل الحرية في حذف أي بيانات مخزنة مثل قائمة المفضلة، وسجل المقارنات، وتنبيهات الأسعار عبر إعدادات حسابك، أو عبر مراسلتنا على privacy@qarentech.com لحذف جميع السجلات المرتبطة بك فوراً.'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactMessage.trim()) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactMessage('');
      }, 3000);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>العودة لمعرض الهواتف</span>
          </button>

          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            وثيقة حماية البيانات والخصوصية
          </span>
        </div>

        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>الشفافية وحماية البيانات الشخصية</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              سياسة الخصوصية وسرية المعلومات في <span className="text-amber-400">قارن تك</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              نلتزم في منصة "قارن تك" بأعلى معايير الأمان والشفافية لحماية بياناتك الشخصية وتجربتك الرقمية. توضح هذه الوثيقة بوضوح وبدون تعقيد كيفية جمع واستخدام وحماية معلوماتك عند مقارنة أسعار ومواصفات الهواتف الذكية.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>تحديث: أكتوبر 2026</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>متوافق مع نظام حماية البيانات الشخصية (PDPL)</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>تشفير SSL عالي الأمان 256-Bit</span>
              </div>
            </div>
          </div>

          {/* Decorative ambient lights */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* QUICK NAVIGATION BAR & JUMP LINKS */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs sticky top-20 z-20 backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isCurrent = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    const el = document.getElementById(sec.id);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sec.title}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4 CORE PRINCIPLES HIGHLIGHT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">لا بيع للبيانات مطلقاً</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              لا نتاجر ببياناتك ولا نشارك بريدك أو معلوماتك مع جهات تسويقية خارجية بأي شكل.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">تشفير وحماية مشددة</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              جميع الاتصالات والبيانات مشفرة ببروتوكولات HTTPS وTLS المتقدمة لحماية خصوصيتك.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">التحكم الكامل بيدك</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              يمكنك تعديل أو حذف تنبيهات الأسعار، وقوائم المقارنة، وسجل المفضلة في أي لحظة.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">شفافية الروابط الخارجية</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              نوضح صراحة طبيعة الشراكة مع المتاجر الرسمية الكبرى دون أي تكلفة إضافية عليك.
            </p>
          </div>
        </div>

        {/* DETAILED PRIVACY SECTIONS */}
        <div className="space-y-8">
          {/* 1. INTRO */}
          <section id="intro" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  1. مقدمة والتزامنا الراسخ بالخصوصية
                </h2>
                <span className="text-xs text-slate-400">إطار عمل السياسة ومسؤوليتنا الأخلاقية</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              أهلاً بك في منصة <strong>قارن تك</strong> (المشار إليها بـ "المنصة" أو "نحن"). تم بناء هذه المنصة لمساعدة المستخدمين في الوطن العربي على مقارنة مواصفات وأسعار الهواتف الذكية وتتبع انخفاض الأسعار بحيادية كاملة. نحن نؤمن بأن حماية خصوصية بياناتك حق أساسي، ولذا فإننا نلتزم بأن تكون جميع ممارساتنا واضحة وشفافة ومتوافقة مع نظام حماية البيانات الشخصية المعمول به في المملكة العربية السعودية ودول مجلس التعاون الخليجي.
            </p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              باستخدامك لموقع قارن تك أو تفاعلك مع خدماتنا (مثل استعراض الأسعار، إعداد تنبيهات التخفيضات، مقارنة الأجهزة، أو استشارة المساعد الصوتي)، فإنك توافق على الممارسات الموضحة في هذه الوثيقة.
            </p>
          </section>

          {/* 2. DATA COLLECTED */}
          <section id="collected-data" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  2. البيانات التي نقوم بجمعها
                </h2>
                <span className="text-xs text-slate-400">نجمع فقط الحد الأدنى اللازم لتقديم الخدمة بكفاءة</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-500" />
                  <span>بيانات الحساب وتفضيلاتك:</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  عند تسجيل الدخول أو تخصيص الموقع، نحتفظ باسمك، وبريدك الإلكتروني، والعملة المفضلة (SAR، AED، KWD، USD، EUR)، ووضع المظهر المفضل (فاتح/داكن).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-rose-500" />
                  <span>بيانات تنبيهات انخفاض الأسعار:</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  عند تعيين تنبيه لهاتف معين، نسجل بريدك الإلكتروني، والسعر المستهدف الذي ترغب بالتنبيه عنده، وموديل الهاتف المحدد، لإشعارك فور وصول العرض لسعرك المطلوب.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-500" />
                  <span>قوائم المقارنة والمفضلة:</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  الهواتف التي تضيفها لقائمة المقارنة المباشرة (حتى 4 أجهزة) أو لقائمة المفضلة تُحفظ لتيسير متابعتك لها عند العودة للمنصة في أي وقت.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  <span>استشارات Gemini الصوتية والذكية:</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  النصوص والأوامر الصوتية التي تطلبها من المستشار الصوتي تُحلل مؤقتاً لتقديم أنسب ترشيح هاتف لميزانيتك واحتياجاتك، دون حفظ تسجيلاتك الصوتية الدائمة.
                </p>
              </div>
            </div>
          </section>

          {/* 3. COOKIES & LOCAL STORAGE */}
          <section id="cookies" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  3. ملفات تعريف الارتباط والذاكرة المحلية (Cookies & LocalStorage)
                </h2>
                <span className="text-xs text-slate-400">كيف نتذكر تفضيلاتك دون تعقب غير مبرر</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              نستخدم تقنيات التخزين المحلي في المتصفح (LocalStorage) وملفات تعريف الارتباط الضرورية وظيفياً للأغراض التالية:
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pr-4 list-disc">
              <li><strong>حفظ تفضيلات العرض:</strong> تذكر خيار العملة المختارة (مثل الريال السعودي أو الدرهم أو الدولار) والوضع الداكن/الفاتح.</li>
              <li><strong>سلة المقارنة المؤقتة:</strong> حفظ الهواتف المحددة للمقارنة المباشرة حتى لا تفقدها أثناء تصفح الموديلات المختلفة.</li>
              <li><strong>جلسة تسجيل الدخول:</strong> إبقاء تسجيل دخولك نشطاً وآمناً دون الحاجة لإدخال بياناتك في كل زيارة.</li>
              <li><strong>تحسين الأداء:</strong> تخزين مؤقت خفيف للبيانات لتسريع تحميل صفحات الهواتف والمخططات البيانية.</li>
            </ul>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>يمكنك في أي وقت مسح ملفات تعريف الارتباط وذاكرة التخزين المؤقت من إعدادات متصفحك بكل سهولة.</span>
            </div>
          </section>

          {/* 4. HOW WE USE YOUR INFORMATION */}
          <section id="usage" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  4. كيف نستخدم معلوماتك
                </h2>
                <span className="text-xs text-slate-400">استخدام محدود ومنضبط للارتقاء بتجربة الشراء</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              تُستخدم المعلومات التي نحصل عليها للأغراض المحددة التالية فقط:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">تقديم مقارنات حية دقيقة</span>
                <span className="text-slate-500 dark:text-slate-400">عرض الأسعار بالعملة المحلية ومقارنة أدق تفاصيل المواصفات الفنية ومتاجر البيع.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">تنبيهك بالصفقات الحقيقية</span>
                <span className="text-slate-500 dark:text-slate-400">مراسلتك فور رصد نزول حقيقي في سعر الجهاز المستهدف في المتجر المعلن.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">تحسين خوارزميات التوصية</span>
                <span className="text-slate-500 dark:text-slate-400">فهم الهواتف الأكثر طلباً لتوسيع تغطية المتاجر وتحديث عروض الهواتف المجددة والمستعملة.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">منع الاحتيال وضمان الأمان</span>
                <span className="text-slate-500 dark:text-slate-400">رصد أي محاولات تلاعب أو استخدام مسيء للموقع لحماية مجتمع المشترين.</span>
              </div>
            </div>
          </section>

          {/* 5. EXTERNAL STORES & AFFILIATE TRANSPARENCY */}
          <section id="external-stores" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  5. الشفافية والمتاجر الشريكة (أمازون، نون، جرير، إكسترا)
                </h2>
                <span className="text-xs text-slate-400">روابط الشراء والسياسات المعتمدة</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              يحتوي موقع قارن تك على روابط تحويل إلى مواقع المتاجر الرسمية المعتمدة (مثل أمازون السعودية، نون، مكتبة جرير، إكسترا). يرجى ملاحظة الآتي:
            </p>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span><strong>لا مدفوعات داخل قارن تك:</strong> موقعنا لا يستقبل بيانات بطاقاتك الائتمانية أو حساباتك البنكية؛ عملية الشراء والدفع والضمان تتم بالكامل على خوادم المتجر المعتمد صاحب العرض.</span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span><strong>سياسات خصوصية مستقلة:</strong> بمجرد انتقالك لمتجر خارجي، يخضع تعاملك لسياسة الخصوصية وشروط الاستخدام الخاصة بذلك المتجر.</span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span><strong>شفافية الروابط التابعة:</strong> قد نحصل على عمولة تسويقية رمزية من بعض المتاجر عند إتمام عملية الشراء عبر الروابط المحولة من موقعنا، وذلك لمساعدتنا في تغطية تكاليف الخوادم وتحديثات الأسعار دون أن تدفع أي هللة إضافية.</span>
              </div>
            </div>
          </section>

          {/* 6. SECURITY & ENCRYPTION */}
          <section id="security" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  6. أمان البيانات وتقنيات التشفير
                </h2>
                <span className="text-xs text-slate-400">بنية تحتية مشفرة لحماية اتصالاتك</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              نطبق إجراءات تقنية وإدارية متقدمة لمنع أي وصول غير مصرح به أو تسريب للبيانات:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">تشفير SSL/TLS كامل</span>
                <span className="text-slate-500 dark:text-slate-400">جميع البيانات المرسلة والمستقبلة مشفرة بمعيار 256-bit عبر بروتوكول HTTPS.</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">حماية جدران الحماية (WAF)</span>
                <span className="text-slate-500 dark:text-slate-400">حماية ضد هجمات حجب الخدمة (DDoS) ومحاولات الاختراق المؤتمتة.</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">فحص دوري للثغرات</span>
                <span className="text-slate-500 dark:text-slate-400">مراجعة أمنية مستمرة للكود البرمجي وقواعد البيانات لضمان الامتثال الصارم.</span>
              </div>
            </div>
          </section>

          {/* 7. USER RIGHTS */}
          <section id="user-rights" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  7. حقوقك الكاملة كـ مستخدم
                </h2>
                <span className="text-xs text-slate-400">التحكم، التعديل، والحذف بنقرة زر واحدة</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              بموجب أنظمة حماية البيانات وحرية المستهلك، يحق لك ممارسة الحقوق التالية في أي وقت وبدون أي رسوم:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">حق الاطلاع والوصول:</span>
                <span className="text-slate-500 dark:text-slate-400">معرفة كافة البيانات المسجلة عنك (تنبيهات الأسعار، المفضلة، تفضيلات الحساب).</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">حق التعديل والتصحيح:</span>
                <span className="text-slate-500 dark:text-slate-400">تحديث بريدك الإلكتروني، تغيير العملة، أو تعديل السعر المستهدف لتنبيهك.</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">حق الإلغاء والحذف الكامل:</span>
                <span className="text-slate-500 dark:text-slate-400">حذف تنبيهات الأسعار فوراً، أو طلب محو حسابك وسجلاتك نهائياً من خوادمنا.</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">حق إيقاف المراسلات:</span>
                <span className="text-slate-500 dark:text-slate-400">إلغاء الاشتراك في أي رسائل بريدية إشعارية بضغطة زر واحدة في أسفل أي إيميل.</span>
              </div>
            </div>
          </section>

          {/* 8. PRIVACY FAQ */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  الأسئلة الشائعة حول الخصوصية وأمان الشراء
                </h2>
                <span className="text-xs text-slate-400">إجابات مباشرة على أكثر استفسارات المستخدمين شيوعاً</span>
              </div>
            </div>

            <div className="space-y-3">
              {privacyFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-right p-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 9. CONTACT & PRIVACY OFFICER */}
          <section id="contact" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  8. التواصل مع مسؤول حماية البيانات
                </h2>
                <span className="text-xs text-slate-400">يسعدنا دائماً استقبال استفساراتك واقتراحاتك</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <p className="leading-relaxed">
                  إذا كان لديك أي سؤال حول سياسة الخصوصية، أو رغبت في ممارسة أي من حقوقك (مثل طلب حذف حسابك أو الاستفسار عن التنبيهات المسجلة)، يمكنك التواصل مباشرة مع فريق حماية البيانات:
                </p>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                    <Mail className="w-4 h-4 text-amber-500" />
                    <span>البريد الإلكتروني للخصوصية:</span>
                  </div>
                  <a
                    href="mailto:privacy@qarentech.com"
                    className="text-amber-600 dark:text-amber-400 font-mono font-bold hover:underline block text-sm"
                  >
                    privacy@qarentech.com
                  </a>
                  <span className="text-[11px] text-slate-400 block">
                    يتم الرد على كافة طلبات الخصوصية خلال 24 - 48 ساعة كحد أقصى.
                  </span>
                </div>
              </div>

              {/* Quick in-page feedback form */}
              <form onSubmit={handleContactSubmit} className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  إرسال استفسار سريع لفريق الخصوصية:
                </span>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="اكتب استفسارك أو طلبك المتعلق بالخصوصية هنا..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  required
                />

                {contactSubmitted ? (
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>تم استلام رسالتك بنجاح! سيتواصل معك فريق الخصوصية قريباً.</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>إرسال الاستفسار الآن</span>
                  </button>
                )}
              </form>
            </div>
          </section>
        </div>

        {/* BOTTOM CALL TO ACTION BAR */}
        <section className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-right">
            <h3 className="text-lg font-black tracking-tight">
              جاهز لاكتشاف ومقارنة أفضل أسعار الهواتف بأمان وشفافية؟
            </h3>
            <p className="text-xs text-amber-950/80 font-medium">
              تصفح أكثر من 12 هاتف رائد، قارن المواصفات وجهاً لوجه، واستمتع بأقوى الصفقات الحية.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <button
              onClick={onExplore}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>معرض الهواتف</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenCompare}
              className="px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>المقارنة المباشرة</span>
            </button>

            <button
              onClick={onOpenVoiceChat}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs border border-amber-600/30"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>مستشار Gemini</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
