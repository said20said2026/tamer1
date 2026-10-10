import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Info
} from 'lucide-react';
import { Phone, CurrencyCode } from '../types/phone';
import { formatPrice } from '../utils/currency';

interface SharePhoneModalProps {
  phone: Phone | null;
  currency: CurrencyCode;
  isOpen: boolean;
  onClose: () => void;
}

export const SharePhoneModal: React.FC<SharePhoneModalProps> = ({
  phone,
  currency,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!isOpen || !phone) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const priceFormatted = formatPrice(phone.lowestPriceSAR, currency);
  const bestOffer = phone.offers[0];

  const shareText = `📱 قارن أسعار ${phone.nameAr} (${phone.name}):\n💰 يبدأ من ${priceFormatted} في ${bestOffer?.storeName || 'المتاجر'}\n🔗 تصفح كافة العروض والمواصفات عبر منصة قارن تك:\n${currentUrl}`;

  const triggerToast = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => {
      setActionNotice(null);
    }, 4500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    triggerToast('تم نسخ الرابط المباشر إلى الحافظة بنجاح!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(`📱 قارن أسعار ${phone.nameAr} - يبدأ من ${priceFormatted}`)}`;
    window.open(fbUrl, '_blank', 'width=620,height=580,noopener,noreferrer');
  };

  const handleMessengerShare = () => {
    navigator.clipboard.writeText(shareText);
    triggerToast('تم نسخ رابط وتفاصيل الهاتف! جارٍ فتح ماسنجر...');
    const messengerUrl = `https://www.messenger.com/t/`;
    window.open(messengerUrl, '_blank');
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(shareText);
    triggerToast('تم نسخ رابط وتفاصيل الهاتف! جارٍ فتح إنستغرام لمشاركتها في الستوري أو الرسائل الخاصة (Direct)...');
    setTimeout(() => {
      window.open('https://www.instagram.com/', '_blank');
    }, 600);
  };

  const handleSnapchatShare = () => {
    navigator.clipboard.writeText(shareText);
    triggerToast('تم نسخ الرابط! جارٍ فتح سناب شات لمشاركة الهاتف مع أصدقائك...');
    const snapchatUrl = `https://www.snapchat.com/share?link=${encodeURIComponent(currentUrl)}`;
    setTimeout(() => {
      window.open(snapchatUrl, '_blank');
    }, 500);
  };

  const handleTikTokShare = () => {
    navigator.clipboard.writeText(shareText);
    triggerToast('تم نسخ رابط وتفاصيل الهاتف بنجاح! يمكنك الآن لصقها في رسائل تيك توك، التعليقات أو في البايو.');
    setTimeout(() => {
      window.open('https://www.tiktok.com/', '_blank');
    }, 600);
  };

  const handlePinterestShare = () => {
    const pinDescription = `📱 ${phone.nameAr} (${phone.name}) - أفضل الأسعار والمواصفات تبدأ من ${priceFormatted} عبر منصة قارن تك`;
    const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(phone.image)}&description=${encodeURIComponent(pinDescription)}`;
    window.open(pinUrl, '_blank', 'width=750,height=600,noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(`📱 ${phone.nameAr} بأفضل سعر: ${priceFormatted}`)}`;
    window.open(telegramUrl, '_blank');
  };

  const handleXShare = () => {
    const tweetText = `قارن أسعار ${phone.nameAr} (${phone.name}) في كبرى المتاجر العربية، يبدأ من ${priceFormatted} عبر منصة قارن تك:`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(xUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `قارن أسعار ${phone.nameAr} - قارن تك`,
          text: `أفضل أسعار ومواصفات ${phone.nameAr} تبدأ من ${priceFormatted}`,
          url: currentUrl,
        });
        onClose();
      } catch (err) {
        // cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 sm:space-y-5 transition-colors max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center">
              <Share2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">مشاركة الهاتف</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">شارك مواصفات وأسعار الهاتف مباشرة عبر شبكات التواصل</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phone Preview Card */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
          <img
            src={phone.image}
            alt={phone.name}
            className="w-14 h-14 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-800"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">{phone.brand}</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{phone.nameAr}</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>يبدأ من:</span>
              <strong className="text-slate-900 dark:text-white font-extrabold">{priceFormatted}</strong>
            </div>
          </div>
        </div>

        {/* Temporary Feedback Notification Banner */}
        {actionNotice && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs animate-in fade-in slide-in-from-top-1">
            <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold leading-relaxed">{actionNotice}</span>
          </div>
        )}

        {/* Social Share Buttons 3x3 Grid */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              المشاركة عبر تطبيقات التواصل الاجتماعي
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">9 منصات متاحة</span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {/* 1. WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 font-bold text-xs transition-all group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
                </svg>
              </div>
              <span className="text-[11px]">واتساب</span>
            </button>

            {/* 2. Facebook */}
            <button
              onClick={handleFacebookShare}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-900 dark:text-blue-200 font-bold text-xs transition-all group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="text-[11px]">فيسبوك</span>
            </button>

            {/* 3. Messenger */}
            <button
              onClick={handleMessengerShare}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/60 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-900 dark:text-sky-200 font-bold text-xs transition-all group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-tr from-[#00B2FF] to-[#006AFF] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.909 1.455 5.518 3.736 7.19V22l3.418-1.875c.915.254 1.884.391 2.846.391 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm1.045 12.441l-2.673-2.85-5.217 2.85 5.736-6.091 2.746 2.85 5.144-2.85-5.736 6.091z" />
                </svg>
              </div>
              <span className="text-[11px]">ماسنجر</span>
            </button>

            {/* 4. Instagram */}
            <button
              onClick={handleInstagramShare}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/60 dark:bg-pink-950/30 hover:bg-pink-100 dark:hover:bg-pink-900/50 text-pink-950 dark:text-pink-200 font-bold text-xs transition-all group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <span className="text-[11px]">إنستغرام</span>
            </button>

            {/* 5. Snapchat */}
            <button
              onClick={handleSnapchatShare}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-xl border border-yellow-200 dark:border-yellow-900/60 bg-yellow-50/60 dark:bg-yellow-950/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 text-yellow-950 dark:text-yellow-200 font-bold text-xs transition-all group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFFC00] text-black flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.203 1.996c-4.043 0-6.115 2.795-6.115 5.485 0 .916.326 2.05.518 2.67.078.25.04.428-.13.565-.245.197-.837.604-1.37.935-.494.306-.88.665-.79 1.25.093.607.72.934 1.246 1.05.352.077.587.265.65.52.128.528-.43 2.12-.907 2.793-.32.45-.632.748-1.28.87-.512.095-.79.525-.79.883 0 .426.37.768 1.11.83 1.253.104 2.89.516 3.65 1.045.548.38 1.177.896 2.164.896.792 0 1.447-.28 2.043-.68.61.396 1.27.68 2.06.68.98 0 1.615-.515 2.16-.895.76-.53 2.395-.94 3.65-1.045.74-.062 1.11-.404 1.11-.83 0-.358-.278-.788-.79-.883-.648-.122-.96-.42-1.28-.87-.477-.673-1.035-2.265-.907-2.793.063-.255.298-.443.65-.52.526-.116 1.153-.443 1.246-1.05.09-.585-.296-.944-.79-1.25-.533-.33-1.125-.738-1.37-.935-.17-.137-.208-.315-.13-.565.192-.62.518-1.754.518-2.67 0-2.69-2.072-5.485-6.115-5.485z" />
                </svg>
              </div>
              <span className="text-[11px]">سناب شات</span>
            </button>

            {/* 6. TikTok */}
            <button
              onClick={handleTikTokShare}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-slate-900 dark:text-slate-100 font-bold text-xs transition-all group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950 dark:bg-black text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-[#25F4EE]/30 to-[#FE2C55]/30 pointer-events-none" />
                <svg className="w-4.5 h-4.5 fill-current relative z-10" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.04.87.12V9.38a6.33 6.33 0 0 0-.87-.06A6.34 6.34 0 0 0 3.1 15.66a6.34 6.34 0 0 0 9.07 5.75c.44-.23.85-.51 1.22-.84.66-.59 1.15-1.34 1.41-2.18.15-.49.23-1.01.23-1.55V8.65a8.27 8.27 0 0 0 4.56 1.41V6.69z" />
                </svg>
              </div>
              <span className="text-[11px]">تيك توك</span>
            </button>

            {/* 7. Pinterest */}
            <button
              onClick={handlePinterestShare}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-950 dark:text-red-200 font-bold text-xs transition-all group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#BD081C] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                </svg>
              </div>
              <span className="text-[11px]">بينتريست</span>
            </button>

            {/* 8. Telegram */}
            <button
              onClick={handleTelegramShare}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/60 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-900 dark:text-sky-200 font-bold text-xs transition-all group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2AABEE] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
              </div>
              <span className="text-[11px]">تليجرام</span>
            </button>

            {/* 9. X / Twitter */}
            <button
              onClick={handleXShare}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs transition-all group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950 dark:bg-slate-800 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="text-[11px]">منصة X</span>
            </button>
          </div>
        </div>

        {/* Copy Link Input Bar */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            أو انسخ الرابط المباشر
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-600 dark:text-slate-300 focus:outline-none select-all font-mono"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Native Web Share option */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>المشاركة عبر خيارات النظام الأخرى</span>
          </button>
        )}
      </div>
    </div>
  );
};
