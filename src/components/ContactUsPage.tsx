import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  Copy, 
  Check, 
  Building2, 
  Store, 
  ShieldCheck, 
  Smartphone, 
  Scale, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Paperclip,
  FileText,
  User,
  Tag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PHONES_DATA } from '../data/phonesData';

interface ContactUsPageProps {
  onExplore: () => void;
  onOpenCompare: () => void;
  onOpenVoiceChat: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  category: string;
  relatedPhoneId: string;
  relatedStore: string;
  subject: string;
  message: string;
  urgency: 'normal' | 'urgent';
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({
  onExplore,
  onOpenCompare,
  onOpenVoiceChat,
}) => {
  const { isArabic, direction, t } = useLanguage();

  const [formState, setFormState] = useState<FormState>({
    fullName: '',
    email: '',
    phoneCountryCode: '+966',
    phoneNumber: '',
    category: 'price_inquiry',
    relatedPhoneId: '',
    relatedStore: '',
    subject: '',
    message: '',
    urgency: 'normal',
  });

  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.fullName.trim() || !formState.email.trim() || !formState.message.trim()) {
      return;
    }

    setIsSubmitting(true);
    // Simulate API dispatch
    setTimeout(() => {
      const generatedTicket = `QT-${Math.floor(10000 + Math.random() * 90000)}`;
      setTicketId(generatedTicket);
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }, 900);
  };

  const handleResetForm = () => {
    setFormState({
      fullName: '',
      email: '',
      phoneCountryCode: '+966',
      phoneNumber: '',
      category: 'price_inquiry',
      relatedPhoneId: '',
      relatedStore: '',
      subject: '',
      message: '',
      urgency: 'normal',
    });
    setAttachedFileName(null);
    setIsSubmitted(false);
  };

  const contactFaqs = [
    {
      q: isArabic 
        ? 'كم يستغرق فريق قارن تك للرد على استفساري؟' 
        : 'How long does the QarenTech team take to respond?',
      a: isArabic
        ? 'متوسط وقت الرد خلال ساعات العمل الرسمية (الأحد - الخميس من 9 ص حتى 6 م بتوقيت الرياض) هو أقل من ساعتين. للاستفسارات خارج أوقات العمل أو في العطلات الرسمية يتم الرد في غضون 12 إلى 24 ساعة كحد أقصى.'
        : 'Average response time during business hours (Sunday - Thursday, 9 AM to 6 PM AST) is under 2 hours. Outside business hours or holidays, responses are sent within 12 to 24 hours.'
    },
    {
      q: isArabic
        ? 'كيف يمكنني الإبلاغ عن سعر غير دقيق أو نفاد كمية في أحد المتاجر؟'
        : 'How do I report an inaccurate price or out-of-stock item at a store?',
      a: isArabic
        ? 'يمكنك اختيار قسم "الإبلاغ عن سعر غير دقيق في متجر" في النموذج أعلاه مع ذكر اسم الهاتف والمتجر (مثل جرير، نون، أمازون). يقوم فريق الرصد بالتحقق الفوري وتحديث واجهات الأسعار خلال دقائق لضمان دقة المعلومات لجميع الزوار.'
        : 'Choose "Report inaccurate store price" in the form above and specify the phone and store. Our monitoring team verifies and syncs data within minutes to maintain 100% accuracy.'
    },
    {
      q: isArabic
        ? 'أنا صاحب متجر إلكتروني، كيف يمكنني إدراج أسعار هواتفي في قارن تك؟'
        : 'I own an e-commerce store. How can I list my phone prices on QarenTech?',
      a: isArabic
        ? 'نرحب دائماً بالانضمام لمنظومة المتاجر الموثوقة! اختر قسم "طلب شراكة وإدراج متجر جديد" أو تواصل مباشرة عبر البريد المخصص partners@qarentech.com مع بيانات متجرك ورابط المتجر، وسيقوم فريق الشراكات بالتواصل لتفعيل الربط البرمجي (API / Feed).'
        : 'We welcome trusted stores! Select "Store partnership & listing request" or email partners@qarentech.com with your store details. Our partnerships team will connect to set up live catalog feeds.'
    },
    {
      q: isArabic
        ? 'هل يقدم قارن تك استشارات شراء مخصصة وفق ميزانيتي؟'
        : 'Do you provide personalized smartphone buying recommendations based on my budget?',
      a: isArabic
        ? 'نعم! يمكنك استخدام مستشار Gemini الذكي الصوتي المتوفر مجاناً في أعلى الموقع للحصول على اقتراح فوري مخصص حسب استخدامك (ألعاب، تصوير، بطارية)، أو كتابة استفسارك بالتفصيل وسيقوم أحد خبرائنا بالرد عليك بأفضل الخيارات المتاحة.'
        : 'Yes! You can use our free Gemini Voice Advisor located at the top of the app for real-time recommendations, or submit your budget and criteria in the form to receive personalized recommendations from our tech specialists.'
    },
    {
      q: isArabic
        ? 'كيف أطلب إضافة هاتف ذكي جديد غير مدرج بعد في الموقع؟'
        : 'How can I request adding a new smartphone model not yet listed?',
      a: isArabic
        ? 'اختر خيار "طلب إضافة هاتف ذكي جديد" واذكر اسم الموديل والشركة المصنعة. نحن نضيف الأجهزة الجديدة فور الإعلان عنها وتوافر أسعارها الرسمية في المنطقة.'
        : 'Select "Request adding a new phone model" and specify the model name and manufacturer. We add newly announced devices as soon as retail prices and specs are confirmed in the region.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors" dir={direction}>
      {/* Breadcrumb & Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <button
              onClick={onExplore}
              className="hover:text-amber-600 dark:hover:text-amber-400 font-bold transition-colors"
            >
              {isArabic ? 'الرئيسية' : 'Home'}
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-extrabold">
              {isArabic ? 'اتصل بنا' : 'Contact Us'}
            </span>
          </div>

          <button
            onClick={onExplore}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isArabic ? 'العودة لمعرض الهواتف' : 'Back to Phones Gallery'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-slate-50 to-slate-50 dark:from-amber-500/10 dark:via-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-extrabold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isArabic ? 'فريق الدعم والشراكات في خدمتك' : 'Customer Support & Partnerships'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {isArabic ? 'نحن هنا لمساعدتك والإجابة على استفساراتك' : "We're Here to Help & Answer Your Inquiries"}
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {isArabic
              ? 'سواء كان لديك استفسار حول مقارنة أسعار هاتف، إبلاغ عن سعر غير دقيق في متجر، رغبة في ربط متجرك بأسعارنا الحية، أو اقتراح ميزة جديدة — يسعدنا التواصل معك دائماً.'
              : 'Whether you have a phone pricing query, want to report an inaccurate deal, integrate your e-commerce store, or suggest a new feature — we are always thrilled to hear from you.'}
          </p>

          {/* Live Status indicator */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 py-2 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>{isArabic ? 'فريق الدعم متصل ومتاح' : 'Support Team Online'}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {isArabic ? 'متوسط الرد: أقل من ساعتين خلال أوقات العمل' : 'Avg. response: < 2 hours during business hours'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* 1. General Support */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-amber-400/50 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                {isArabic ? 'خدمة العملاء والمستخدمين' : 'Customer Support'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                {isArabic ? 'لأي استفسار تقني، مقارنات الهواتف، أو مساعدة في استخدام الموقع.' : 'For technical queries, phone comparisons, or platform guidance.'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <a
                href="mailto:support@qarentech.com"
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline truncate"
              >
                support@qarentech.com
              </a>
              <button
                onClick={() => copyToClipboard('support@qarentech.com', 'support_mail')}
                title={isArabic ? 'نسخ البريد' : 'Copy Email'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {copiedKey === 'support_mail' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* 2. WhatsApp Support */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-400/50 dark:hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                {isArabic ? 'محادثة فورية (واتساب)' : 'Instant WhatsApp Support'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                {isArabic ? 'دعم سريع ومباشر على مدار ساعات العمل للإجابة الفورية.' : 'Quick and direct messaging during business hours.'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <a
                href="https://wa.me/966508924571"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>+966 50 892 4571</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => copyToClipboard('+966508924571', 'whatsapp')}
                title={isArabic ? 'نسخ الرقم' : 'Copy Number'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {copiedKey === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* 3. Merchant & Store Partnerships */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-400/50 dark:hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                {isArabic ? 'شراكات المتاجر والربط' : 'Store Partnerships'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                {isArabic ? 'للمتاجر الإلكترونية الراغبة في إدراج منتجاتها وعروضها في المنصة.' : 'For retailers wishing to integrate product catalogs & live feeds.'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <a
                href="mailto:partners@qarentech.com"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline truncate"
              >
                partners@qarentech.com
              </a>
              <button
                onClick={() => copyToClipboard('partners@qarentech.com', 'partners_mail')}
                title={isArabic ? 'نسخ البريد' : 'Copy Email'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {copiedKey === 'partners_mail' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* 4. Headquarters Location */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-purple-400/50 dark:hover:border-purple-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                {isArabic ? 'المقر وساعات العمل' : 'Headquarters & Hours'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                {isArabic
                  ? 'طريق الملك فهد، حي الصحافة، الرياض، المملكة العربية السعودية.'
                  : 'King Fahd Road, Al-Sahafa, Riyadh, Saudi Arabia.'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <span>{isArabic ? 'الأحد - الخميس: 9:00 ص - 6:00 م' : 'Sun - Thu: 9:00 AM - 6:00 PM AST'}</span>
            </div>
          </div>
        </div>

        {/* Main Content: Form + Sidebar Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Section (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xs">
            {isSubmitted ? (
              /* Success Screen */
              <div className="py-8 text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    {isArabic ? 'تم استلام رسالتك بنجاح' : 'Message Received Successfully'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {isArabic ? 'شكراً لتواصلك مع قارن تك!' : 'Thank you for reaching out to QarenTech!'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    {isArabic
                      ? `تم تسجيل طلبك برقم التذكرة أدناه، وتم إرسال تأكيد إلى بريدك الإلكتروني (${formState.email}). سنقوم بالرد عليك في أقرب وقت.`
                      : `Your request has been logged with the ticket ID below, and a confirmation email has been dispatched to (${formState.email}).`}
                  </p>
                </div>

                {/* Ticket Reference Badge */}
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                    {isArabic ? 'رقم التذكرة المرجعي:' : 'Ticket Reference ID:'}
                  </span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400 tracking-wider">
                    {ticketId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(ticketId, 'ticket')}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title={isArabic ? 'نسخ رقم التذكرة' : 'Copy Ticket ID'}
                  >
                    {copiedKey === 'ticket' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleResetForm}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {isArabic ? 'إرسال رسالة أو استفسار آخر' : 'Send Another Message'}
                  </button>
                  <button
                    onClick={onExplore}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-colors shadow-xs"
                  >
                    {isArabic ? 'العودة لتصفح الهواتف' : 'Back to Phones Gallery'}
                  </button>
                </div>
              </div>
            ) : (
              /* Actual Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-500" />
                    <span>{isArabic ? 'أرسل لنا رسالة مباشرة' : 'Send Us a Direct Message'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {isArabic ? 'يرجى تعبئة الحقول وسيتواصل معك المختص المعني بأسرع وقت.' : 'Fill out the fields below and our specialist will respond promptly.'}
                  </p>
                </div>

                {/* Priority / Urgency selector */}
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2">
                    {isArabic ? 'درجة الأولوية:' : 'Priority Level:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormState(f => ({ ...f, urgency: 'normal' }))}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-colors ${
                      formState.urgency === 'normal'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs border border-slate-200 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isArabic ? 'عادية (استفسار عام)' : 'Normal (General)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormState(f => ({ ...f, urgency: 'urgent' }))}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                      formState.urgency === 'urgent'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 shadow-2xs border border-rose-200 dark:border-rose-800'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span>{isArabic ? 'عاجلة (شراء فوري أو خطأ سعر)' : 'Urgent (Price error / buying now)'}</span>
                  </button>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isArabic ? 'الاسم الكامل' : 'Full Name'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
                      <input
                        type="text"
                        required
                        value={formState.fullName}
                        onChange={(e) => setFormState(f => ({ ...f, fullName: e.target.value }))}
                        placeholder={isArabic ? 'مثال: فيصل العتيبي' : 'e.g. Alex Johnson'}
                        className="w-full ps-9 pe-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isArabic ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState(f => ({ ...f, email: e.target.value }))}
                        placeholder="name@example.com"
                        className="w-full ps-9 pe-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Number & Country Code (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isArabic ? 'رمز الدولة' : 'Code'}
                    </label>
                    <select
                      value={formState.phoneCountryCode}
                      onChange={(e) => setFormState(f => ({ ...f, phoneCountryCode: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="+966">🇸🇦 +966 (السعودية)</option>
                      <option value="+971">🇦🇪 +971 (الإمارات)</option>
                      <option value="+965">🇰🇼 +965 (الكويت)</option>
                      <option value="+973">🇧🇭 +973 (البحرين)</option>
                      <option value="+968">🇴🇲 +968 (عمان)</option>
                      <option value="+974">🇶🇦 +974 (قطر)</option>
                      <option value="+20">🇪🇬 +20 (مصر)</option>
                      <option value="+1">🇺🇸 +1 (USA)</option>
                      <option value="+44">🇬🇧 +44 (UK)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isArabic ? 'رقم الجوال (اختياري للرد السريع عبر واتساب)' : 'Phone Number (Optional for WhatsApp)'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
                      <input
                        type="tel"
                        value={formState.phoneNumber}
                        onChange={(e) => setFormState(f => ({ ...f, phoneNumber: e.target.value }))}
                        placeholder={isArabic ? '50 123 4567' : '50 123 4567'}
                        className="w-full ps-9 pe-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Category & Specific Phone Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isArabic ? 'نوع الاستفسار / القسم' : 'Inquiry Category'} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formState.category}
                      onChange={(e) => setFormState(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="price_inquiry">
                        {isArabic ? '🔍 استفسار عن مقارنة أسعار هاتف معين' : '🔍 Phone price comparison query'}
                      </option>
                      <option value="report_price_error">
                        {isArabic ? '⚠️ الإبلاغ عن سعر غير دقيق أو كوبون منتهي' : '⚠️ Report inaccurate price or expired promo'}
                      </option>
                      <option value="request_phone">
                        {isArabic ? '📱 طلب إضافة هاتف ذكي جديد غير متوفر' : '📱 Request adding a new phone model'}
                      </option>
                      <option value="partnership">
                        {isArabic ? '🤝 شراكة وإدراج متجر في مقارنة الأسعار' : '🤝 Store partnership / listing request'}
                      </option>
                      <option value="feature_request">
                        {isArabic ? '💡 اقتراح ميزة جديدة أو ملاحظات للموقع' : '💡 Feature suggestion or platform feedback'}
                      </option>
                      <option value="trade_in">
                        {isArabic ? '🔄 استفسار عن تقييم استبدال الهاتف القديم' : '🔄 Trade-in valuation question'}
                      </option>
                      <option value="other">
                        {isArabic ? '📝 استفسار آخر' : '📝 Other general inquiry'}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isArabic ? 'الهاتف ذو الصلة (اختياري)' : 'Related Phone (Optional)'}
                    </label>
                    <select
                      value={formState.relatedPhoneId}
                      onChange={(e) => setFormState(f => ({ ...f, relatedPhoneId: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">{isArabic ? '-- اختر هاتفاً إن وجد --' : '-- Select phone if applicable --'}</option>
                      {PHONES_DATA.map((phone) => (
                        <option key={phone.id} value={phone.id}>
                          {isArabic ? phone.nameAr : phone.name} ({phone.brand})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* If reporting a price error, show store selector */}
                {formState.category === 'report_price_error' && (
                  <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs">
                    <label className="block font-bold text-amber-900 dark:text-amber-200 mb-1.5">
                      {isArabic ? 'المتجر الذي يحتوي على السعر غير الدقيق:' : 'Store with the price discrepancy:'}
                    </label>
                    <select
                      value={formState.relatedStore}
                      onChange={(e) => setFormState(f => ({ ...f, relatedStore: e.target.value }))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="">{isArabic ? '-- اختر المتجر --' : '-- Choose store --'}</option>
                      <option value="amazon">أمازون (Amazon SA / UAE)</option>
                      <option value="noon">نون (Noon Express)</option>
                      <option value="jarir">مكتبة جرير (Jarir Bookstore)</option>
                      <option value="extra">إكسترا (eXtra Stores)</option>
                      <option value="other">متجر آخر</option>
                    </select>
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isArabic ? 'موضوع الرسالة' : 'Subject'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.subject}
                    onChange={(e) => setFormState(f => ({ ...f, subject: e.target.value }))}
                    placeholder={isArabic ? 'اكتب عنواناً مختصراً لاستفسارك...' : 'Brief summary of your inquiry...'}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isArabic ? 'تفاصيل الرسالة والاستفسار' : 'Message Details'} <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {formState.message.length} {isArabic ? 'حرف' : 'chars'}
                    </span>
                  </div>
                  <textarea
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState(f => ({ ...f, message: e.target.value }))}
                    placeholder={
                      isArabic
                        ? 'يرجى كتابة كافة التفاصيل التي تساعدنا في خدمتك بدقة (الروابط، الموديل، السعر الملاحظ، إلخ)...'
                        : 'Please provide all helpful context (links, model numbers, observed price, etc.)...'
                    }
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
                  ></textarea>
                </div>

                {/* File Attachment (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isArabic ? 'إرفاق لقطة شاشة أو ملف (اختياري)' : 'Attach Screenshot or File (Optional)'}
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'اختيار ملف / صورة' : 'Choose File / Photo'}</span>
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {attachedFileName ? (
                      <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-semibold">
                        <FileText className="w-3.5 h-3.5" />
                        {attachedFileName}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        {isArabic ? 'صورة لقطة السعر أو الشاشة (JPG, PNG, PDF حتى 10MB)' : 'Screenshot or document (JPG, PNG, PDF up to 10MB)'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                        <span>{isArabic ? 'جاري الإرسال وتوليد التذكرة...' : 'Sending & generating ticket...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 stroke-[2.5]" />
                        <span>{isArabic ? 'إرسال الرسالة الآن' : 'Send Message Now'}</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                    {isArabic
                      ? '🔒 بياناتك محمية ومشفرة وتستخدم فقط للتواصل بخصوص استفسارك.'
                      : '🔒 Your data is confidential and used solely to address your inquiry.'}
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar Info & Trust Badges (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Gemini Advisor Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/15 dark:via-slate-800 dark:to-slate-800 rounded-3xl p-6 border border-amber-300 dark:border-amber-700/60 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Volume2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {isArabic ? 'هل تحتاج نصيحة شراء فورية؟' : 'Need Instant Buying Advice?'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isArabic ? 'تحدث مع مستشار Gemini الذكي بالصوت' : 'Talk with our AI Voice Advisor in Arabic or English'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {isArabic
                  ? 'إذا كنت متردداً بين هاتفين وتريد مقارنة فورية بناءً على ميزانيتك أو استخدامك للكاميرا والألعاب، جرب مستشارنا الصوتي المدعوم بالذكاء الاصطناعي دون انتظار!'
                  : 'Undecided between two phones? Need immediate advice based on your budget, camera needs, or battery life? Chat live with our AI voice consultant right now!'}
              </p>
              <button
                onClick={onOpenVoiceChat}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isArabic ? 'تشغيل مستشار Gemini الصوتي' : 'Launch Gemini Voice Chat'}</span>
              </button>
            </div>

            {/* Guarantees Box */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{isArabic ? 'التزام قارن تك للمستخدمين والمتاجر' : 'Our Commitment to Transparency'}</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="block text-slate-800 dark:text-slate-200 font-bold mb-0.5">
                      {isArabic ? 'حيادية ومصداقية تامة 100%' : '100% Impartial & Independent'}
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed block">
                      {isArabic ? 'لا نتقاضى أي مقابل لتفضيل متجر على آخر. السعر الأقل يعرض أولاً دائماً.' : 'No biased rankings. The lowest genuine price is always displayed first.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="block text-slate-800 dark:text-slate-200 font-bold mb-0.5">
                      {isArabic ? 'ربط آلي مع واجهات المتاجر' : 'Direct Verified Store API Feeds'}
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed block">
                      {isArabic ? 'تحديث دوري لأسعار أمازون، نون، جرير، وإكسترا مع الضمان المعتمد.' : 'Regular catalog synchronization with official local warranties included.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="block text-slate-800 dark:text-slate-200 font-bold mb-0.5">
                      {isArabic ? 'سرعة تصحيح الملاحظات' : 'Rapid Feedback Rectification'}
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed block">
                      {isArabic ? 'أي إبلاغ عن سعر منتهي أو خطأ يتم معالجته وفحصه فورياً.' : 'Price discrepancies reported by community members are audited promptly.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Explore Action */}
            <div className="bg-slate-100 dark:bg-slate-800/60 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  {isArabic ? 'هل تريد مقارنة هاتفين الآن؟' : 'Compare Two Phones Now?'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isArabic ? 'جدول مقارنة تفصيلي للمعالج والكاميرا والبطارية' : 'Side-by-side technical spec differences table'}
                </p>
              </div>
              <button
                onClick={onOpenCompare}
                className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black shrink-0 hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5 text-amber-500" />
                <span>{isArabic ? 'جدول المقارنة' : 'Compare'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contact FAQ Section */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>{isArabic ? 'الأسئلة الشائعة حول التواصل' : 'Contact FAQ'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isArabic ? 'إجابات على أكثر الاستفسارات تكراراً' : 'Frequently Asked Contact Inquiries'}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {contactFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-start p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <div className="shrink-0 p-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-500">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
