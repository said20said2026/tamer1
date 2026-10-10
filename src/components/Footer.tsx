import React from 'react';
import { Scale, Heart, ShieldCheck, Sparkles, Volume2, Bell, Info, Lock, Mail, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenVoiceChat: () => void;
  onOpenAlerts: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  onOpenGlobalStores?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenVoiceChat, 
  onOpenAlerts, 
  onOpenPrivacy,
  onOpenTerms,
  onOpenAbout,
  onOpenContact,
  onOpenGlobalStores
}) => {
  const { isArabic, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <Scale className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-base font-black text-white">
                {t.brandName}<span className="text-amber-500">{t.brandTag}</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {isArabic
                ? 'منصة مقارنة أسعار ومواصفات الهواتف الذكية الأقوى في الشرق الأوسط. نجمع لك الأسعار الحية من المتاجر المحلية والعالمية (Amazon, AliExpress, B&H) لضمان حصولك على أفضل صفقة.'
                : 'The leading smartphone price and spec comparison platform in the region. We aggregate live prices across local and global stores (Amazon, AliExpress, B&H) to ensure you get the best deal.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
              <span>{isArabic ? 'المتاجر المحلية والعالمية' : 'Local & Global Stores'}</span>
              <span className="text-[9px] bg-sky-950 text-sky-400 border border-sky-800 px-1 rounded">🌐 DDP</span>
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>{isArabic ? 'أمازون السعودية والإمارات' : 'Amazon (SA & UAE)'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <button onClick={onOpenGlobalStores} className="hover:text-white transition-colors text-right">
                  {isArabic ? 'أمازون العالمي (Amazon Global 🌐)' : 'Amazon Global (US & UK 🌐)'}
                </button>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <button onClick={onOpenGlobalStores} className="hover:text-white transition-colors text-right">
                  {isArabic ? 'علي إكسبريس العالمي (AliExpress Choice 🌐)' : 'AliExpress Global (Choice 🌐)'}
                </button>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <button onClick={onOpenGlobalStores} className="hover:text-white transition-colors text-right">
                  {isArabic ? 'بي آند إتش نيويورك (B&H Photo NY 🌐)' : 'B&H Photo Video (New York 🌐)'}
                </button>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                <span>{isArabic ? 'نون (Noon Express)' : 'Noon Express'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>{isArabic ? 'مكتبة جرير وإكسترا' : 'Jarir & eXtra'}</span>
              </li>
            </ul>
          </div>

          {/* Smart Features */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs">
              {isArabic ? 'ميزات الموقع الذكية' : 'Smart Platform Features'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={onOpenVoiceChat}
                  className="hover:text-amber-400 flex items-center gap-1.5 text-start transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isArabic ? 'مستشار Gemini الصوتي للشراء' : 'Gemini AI Voice Advisor'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAlerts}
                  className="hover:text-amber-400 flex items-center gap-1.5 text-start transition-colors"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isArabic ? 'إدارة تنبيهات نزول الأسعار' : 'Manage Price Drop Alerts'}</span>
                </button>
              </li>
              <li>
                {onOpenAbout && (
                  <button
                    onClick={onOpenAbout}
                    className="hover:text-amber-400 flex items-center gap-1.5 text-start transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isArabic ? 'من نحن (عن منصة قارن تك)' : 'About Us (Our Story & Mission)'}</span>
                  </button>
                )}
              </li>
              <li>
                {onOpenContact && (
                  <button
                    onClick={onOpenContact}
                    className="hover:text-amber-400 flex items-center gap-1.5 text-start transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isArabic ? 'اتصل بنا وفريق الدعم' : 'Contact Us & Support Team'}</span>
                  </button>
                )}
              </li>
              <li>
                {onOpenPrivacy && (
                  <button
                    onClick={onOpenPrivacy}
                    className="hover:text-amber-400 flex items-center gap-1.5 text-start transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isArabic ? 'سياسة الخصوصية وسرية المعلومات' : 'Privacy Policy & Data Protection'}</span>
                  </button>
                )}
              </li>
              {onOpenTerms && (
                <li>
                  <button
                    onClick={onOpenTerms}
                    className="hover:text-amber-400 flex items-center gap-1.5 text-start transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isArabic ? 'شروط وأحكام الاستخدام' : 'Terms of Service & Usage'}</span>
                  </button>
                </li>
              )}
              <li>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isArabic ? 'تحديث دوري ومطابقة الضمانات المحلية' : 'Official Local Warranty Matching'}</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs">
              {isArabic ? 'إخلاء مسؤولية وأمان' : 'Transparency & Accuracy'}
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              {isArabic
                ? 'الأسعار المعروضة يتم تحديثها دورياً من واجهات المتاجر المعلنة. قد تتغير الأسعار وتوافر المخزون في المتجر في أي لحظة وفقاً لسياسات البائع. نلتزم بأعلى معايير حماية البيانات والخصوصية.'
                : 'Displayed prices are refreshed regularly from public store listings. Availability and prices may change according to seller terms. We adhere to high data privacy and security standards.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            {isArabic
              ? `جميع الحقوق محفوظة © ${new Date().getFullYear()} قارن تك - مقارنة أسعار الهواتف الذكية.`
              : `All rights reserved © ${new Date().getFullYear()} QarenTech - Smartphone Price Comparison.`}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {onOpenAbout && (
              <button
                onClick={onOpenAbout}
                className="hover:text-amber-400 underline transition-colors"
              >
                {t.about}
              </button>
            )}
            <span aria-hidden="true">·</span>
            {onOpenContact && (
              <button
                onClick={onOpenContact}
                className="hover:text-amber-400 underline transition-colors"
              >
                {t.contactUs}
              </button>
            )}
            <span aria-hidden="true">·</span>
            {onOpenPrivacy && (
              <button
                onClick={onOpenPrivacy}
                className="hover:text-amber-400 underline transition-colors"
              >
                {t.privacy}
              </button>
            )}
            <span aria-hidden="true">·</span>
            {onOpenTerms && (
              <>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-amber-400 underline transition-colors"
                >
                  {t.terms}
                </button>
                <span aria-hidden="true">·</span>
              </>
            )}
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 underline transition-colors"
            >
              {isArabic ? 'خريطة الموقع (sitemap.xml)' : 'Sitemap (XML)'}
            </a>
            <span aria-hidden="true">·</span>
            <span>{isArabic ? 'دقة وتحديث مستمر بمحرك مقارنة الأسعار' : 'Continuous Live Engine Updates'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
