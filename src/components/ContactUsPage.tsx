import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building,
  Volume2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactUsPageProps {
  onExplore: () => void;
  onOpenVoiceChat?: () => void;
  onOpenAbout?: () => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({
  onExplore,
  onOpenVoiceChat,
  onOpenAbout,
}) => {
  const { isArabic } = useLanguage();
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage(
        isArabic
          ? 'يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، والرسالة).'
          : 'Please fill in all required fields (Name, Email, and Message).'
      );
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage(
        isArabic ? 'يرجى إدخال عنوان بريد إلكتروني صالح.' : 'Please enter a valid email address.'
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: '',
      });
    }, 800);
  };

  const contactChannels = [
    {
      icon: Mail,
      titleAr: 'البريد الإلكتروني للدعم العام',
      titleEn: 'General Support Email',
      detail: 'support@qarentech.com',
      subAr: 'رد خلال أقل من 24 ساعة عمل',
      subEn: 'Response within 24 hours',
      actionHref: 'mailto:support@qarentech.com',
    },
    {
      icon: Building,
      titleAr: 'قسم الشراكات والإعلانات',
      titleEn: 'Partnerships & Commercial',
      detail: 'partners@qarentech.com',
      subAr: 'للمتاجر والعلامات التجارية',
      subEn: 'For retailers & brands',
      actionHref: 'mailto:partners@qarentech.com',
    },
    {
      icon: Clock,
      titleAr: 'ساعات العمل الرسمية',
      titleEn: 'Working Hours',
      detail: isArabic ? 'الأحد - الخميس (9:00 ص - 6:00 م)' : 'Sun - Thu (9:00 AM - 6:00 PM)',
      subAr: 'توقيت الرياض والقاهرة (+3 GMT)',
      subEn: 'Riyadh & Cairo Time (+3 GMT)',
    },
    {
      icon: MapPin,
      titleAr: 'المقر الرئيسي والتغطية',
      titleEn: 'Regional Headquarters',
      detail: isArabic ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia',
      subAr: 'تغطية للمملكة، الإمارات، مصر ودول الخليج',
      subEn: 'Serving KSA, UAE, Egypt & Gulf region',
    },
  ];

  const quickFaqs = [
    {
      qAr: 'كيف تضمنون صحة الأسعار المعروضة؟',
      qEn: 'How do you guarantee displayed price accuracy?',
      aAr: 'نقوم بتحديث الأسعار دورياً وبصورة آلية مباشرة من المتاجر الرسمية المعتمدة (أمازون، نون، جرير، إكسترا)، مع مراعاة كوبونات الخصم والعروض الترويجية الحالية.',
      aEn: 'We refresh prices continuously from official verified retailers (Amazon, Noon, Jarir, Extra), taking current promotions and discount codes into account.',
    },
    {
      qAr: 'أنا صاحب متجر إلكتروني، كيف يمكنني إدراج أسعاري في قارن تك؟',
      qEn: 'I own an e-commerce store, how can I list my products?',
      aAr: 'يسعدنا التعاون معك! اختر موضوع "اقتراح متجر أو شراكة تجارية" في النموذج أدناه وسيقوم فريق إدراج البيانات بالتواصل معك لمراجعة الربط الفني.',
      aEn: 'We welcome merchant integrations! Select "Store Suggestion or Business Partnership" in the form below and our team will get in touch.',
    },
    {
      qAr: 'هل يمكنني الإبلاغ عن سعر غير مطابق؟',
      qEn: 'Can I report an outdated or mismatched price?',
      aAr: 'نعم بالتأكيد! نرحب جداً بملاحظاتكم. يمكنك إرسال رابط الهاتف واسم المتجر وسنقوم بتحديث السعر فوراً عبر محرك التدقيق.',
      aEn: 'Absolutely! Send us the phone link and store name, and our verification team will immediately update it in our indexing engine.',
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Navigation Breadcrumb / Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <BackArrow className="w-4 h-4" />
            <span>{isArabic ? 'العودة إلى استعراض الهواتف' : 'Back to Phones Gallery'}</span>
          </button>

          <span className="text-xs font-semibold text-slate-400">
            {isArabic ? 'قارن تك · اتصل بنا' : 'QarenTech · Contact Us'}
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isArabic ? 'نحن هنا للمساعدة والاستماع إليك' : 'We are here to help and listen'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {isArabic ? 'تواصل مع فريق قارن تك' : 'Get in Touch with QarenTech'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isArabic
              ? 'سواء كان لديك استفسار تقني حول مقارنة الأسعار، اقتراح لهاتف جديد أو متجر، أو رغبة في شراكة تجارية، يسعدنا تواصلك معنا وسنرد في أقرب وقت.'
              : 'Whether you have a question about price comparison, want to suggest a new phone or store, or discuss a business partnership, we look forward to hearing from you.'}
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactChannels.map((channel, idx) => {
            const Icon = channel.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {isArabic ? channel.titleAr : channel.titleEn}
                  </h3>
                  {channel.actionHref ? (
                    <a
                      href={channel.actionHref}
                      className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 hover:underline block break-all"
                    >
                      {channel.detail}
                    </a>
                  ) : (
                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {channel.detail}
                    </p>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                  {isArabic ? channel.subAr : channel.subEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Section: Contact Form + FAQ & AI Assistant Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {isArabic ? 'أرسل لنا رسالة مباشرة' : 'Send Us a Direct Message'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isArabic
                  ? 'املأ البيانات وسيقوم ممثل خدمة العملاء أو الفريق الفني بالرد عليك.'
                  : 'Fill in your details and our team will get back to you promptly.'}
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">
                      {isArabic ? 'تم استلام رسالتك بنجاح!' : 'Your message has been received!'}
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                      {isArabic
                        ? 'شكراً لتواصلك مع قارن تك. سنقوم بمراجعة طلبك والرد على بريدك الإلكتروني خلال 24 ساعة.'
                        : 'Thank you for reaching out. We will review your message and reply within 24 hours.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  {isArabic ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isArabic ? 'الاسم الكامل' : 'Full Name'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isArabic ? 'مثال: محمد السعيد' : 'e.g. John Doe'}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isArabic ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={isArabic ? 'name@example.com' : 'name@example.com'}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isArabic ? 'رقم الهاتف / الواتساب (اختياري)' : 'Phone / WhatsApp (Optional)'}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={isArabic ? '+966 5x xxx xxxx' : '+966 5x xxx xxxx'}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Subject category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isArabic ? 'موضوع الرسالة' : 'Subject / Topic'}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors cursor-pointer"
                    >
                      <option value="general">{isArabic ? 'استفسار عام حول المنصة' : 'General Inquiry'}</option>
                      <option value="price_discrepancy">{isArabic ? 'الإبلاغ عن سعر غير مطابق أو متجر' : 'Report Price Discrepancy'}</option>
                      <option value="suggest_phone">{isArabic ? 'اقتراح إضافة هاتف أو علامة تجارية' : 'Suggest New Phone or Brand'}</option>
                      <option value="store_partnership">{isArabic ? 'شراكة تجارية وإدراج متجر' : 'Store Partnership & Listing'}</option>
                      <option value="technical_bug">{isArabic ? 'الإبلاغ عن مشكلة فنية في الموقع' : 'Technical Bug Report'}</option>
                    </select>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'نص الرسالة أو الملاحظة' : 'Message Details'} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      isArabic
                        ? 'اكتب استفسارك بالتفصيل وسنكون سعداء بمساعدتك...'
                        : 'Write your message in detail and we will gladly assist you...'
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isArabic ? 'جاري الإرسال...' : 'Sending...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isArabic ? 'إرسال الرسالة الآن' : 'Send Message Now'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: AI Assistant Card & FAQ */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Instant AI Voice Advisor Box */}
            {onOpenVoiceChat && (
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black">
                      {isArabic ? 'مستشار Gemini الصوتي للشراء' : 'Gemini AI Voice Advisor'}
                    </h3>
                    <p className="text-[11px] text-slate-900/80">
                      {isArabic ? 'هل تحتاج لمساعدة فورية في اختيار الهاتف؟' : 'Need instant help choosing your phone?'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-900/90 leading-relaxed">
                  {isArabic
                    ? 'بدلاً من الانتظار، يمكنك التحدث مباشرة مع المستشار الصوتي الذكي للحصول على مقارنة شفوية وترشيحات فورية تناسب ميزانيتك.'
                    : 'Talk directly with our live voice assistant for verbal specs breakdown and tailored advice for your budget.'}
                </p>

                <button
                  onClick={onOpenVoiceChat}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isArabic ? 'بدء محادثة صوتية فورية' : 'Start Instant Voice Chat'}</span>
                </button>
              </div>
            )}

            {/* Quick FAQs */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>{isArabic ? 'أسئلة شائعة وسريعة' : 'Frequently Asked Questions'}</span>
              </div>

              <div className="space-y-3">
                {quickFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5"
                  >
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {isArabic ? faq.qAr : faq.qEn}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isArabic ? faq.aAr : faq.aEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Link to About Us */}
            {onOpenAbout && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {isArabic ? 'تريد معرفة المزيد عن مشروعنا؟' : 'Want to know more about our story?'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isArabic ? 'تعرف على قصة تأسيس قارن تك وفريق العمل' : 'Learn about our founders, vision and values'}
                  </p>
                </div>
                <button
                  onClick={onOpenAbout}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded-lg transition-colors shrink-0"
                >
                  {isArabic ? 'صفحة من نحن' : 'About Us'}
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
