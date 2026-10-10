import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Scale, 
  Heart, 
  User, 
  Sparkles, 
  Percent, 
  Smartphone, 
  Volume2, 
  ChevronDown, 
  Menu, 
  X, 
  Mic, 
  MicOff, 
  Sun, 
  Moon, 
  Info, 
  ShieldCheck,
  ScanBarcode,
  Globe,
  Headphones
} from 'lucide-react';
import { CurrencyCode } from '../types/phone';
import { CURRENCIES } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenVoiceChat: () => void;
  onOpenAuth: () => void;
  onOpenBarcodeScanner?: () => void;
  onOpenGlobalStores?: () => void;
  activeTab: 'explore' | 'compare' | 'deals' | 'favorites' | 'about' | 'privacy' | 'contact';
  onTabChange: (tab: 'explore' | 'compare' | 'deals' | 'favorites' | 'about' | 'privacy' | 'contact') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCurrency,
  onCurrencyChange,
  searchQuery,
  onSearchChange,
  compareCount,
  onOpenCompare,
  onOpenVoiceChat,
  onOpenAuth,
  onOpenBarcodeScanner,
  onOpenGlobalStores,
  activeTab,
  onTabChange,
}) => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isArabic, toggleLanguage, t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [voiceSearchFeedback, setVoiceSearchFeedback] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isArabic
          ? 'متصفحك لا يدعم ميزة البحث الصوتي. يرجى تجربة Google Chrome أو Microsoft Edge.'
          : 'Your browser does not support voice search. Please try Google Chrome or Microsoft Edge.'
      );
      return;
    }

    if (isVoiceSearching && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsVoiceSearching(false);
      setVoiceSearchFeedback(null);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsVoiceSearching(true);
        setVoiceSearchFeedback(
          isArabic ? 'جاري الاستماع... قل اسم الهاتف الآن' : 'Listening... Speak the phone name now'
        );
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');

        if (transcript) {
          onSearchChange(transcript);
          setVoiceSearchFeedback(
            isArabic ? `تم التقاط: "${transcript}"` : `Heard: "${transcript}"`
          );
          if (activeTab !== 'explore') {
            onTabChange('explore');
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Voice recognition error:', event.error);
        setIsVoiceSearching(false);
        setVoiceSearchFeedback(null);
      };

      recognition.onend = () => {
        setIsVoiceSearching(false);
        setTimeout(() => setVoiceSearchFeedback(null), 2500);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start voice search:', err);
      setIsVoiceSearching(false);
      setVoiceSearchFeedback(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 text-center flex items-center justify-center gap-2 font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>{t.topBanner}</span>
        <span aria-hidden="true" className="text-slate-600 hidden sm:inline">|</span>
        <button
          onClick={onOpenVoiceChat}
          className="text-amber-400 hover:text-amber-300 font-bold hidden sm:inline-flex items-center gap-1 transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          {t.askGeminiVoice}
        </button>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-5 sm:gap-6">
            <button
              onClick={() => onTabChange('explore')}
              className="flex items-center gap-2.5 text-start group text-decoration-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-sm group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
                  {t.brandName}<span className="text-amber-500 dark:text-amber-400">{t.brandTag}</span>
                </span>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  {t.brandSub}
                </span>
              </div>
            </button>

            {/* Desktop Navigation links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => onTabChange('explore')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'explore'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Smartphone className="w-4 h-4 text-slate-500" />
                {t.explore}
              </button>

              <button
                onClick={() => onTabChange('deals')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'deals'
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Percent className="w-4 h-4 text-rose-600" />
                {t.deals}
              </button>

              <button
                onClick={onOpenCompare}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'compare'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Scale className="w-4 h-4 text-amber-500" />
                {t.compare}
                {compareCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black rounded-full bg-amber-500 text-slate-950">
                    {compareCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onTabChange('favorites')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'favorites'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Heart className="w-4 h-4 text-rose-500" />
                {t.favorites}
              </button>

              <button
                onClick={() => onTabChange('about')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'about'
                    ? 'bg-amber-100/80 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 shadow-2xs font-extrabold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Info className="w-4 h-4 text-amber-500" />
                {t.about}
              </button>

              <button
                onClick={() => onTabChange('contact')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'contact'
                    ? 'bg-amber-100/80 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 shadow-2xs font-extrabold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Headphones className="w-4 h-4 text-emerald-500" />
                <span>{isArabic ? 'اتصل بنا' : 'Contact'}</span>
              </button>

              {onOpenGlobalStores && (
                <button
                  onClick={onOpenGlobalStores}
                  className="px-3.5 py-2 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/80 dark:border-sky-800 shadow-2xs"
                  title={isArabic ? 'المتاجر العالمية المعتمدة وشحن DDP' : 'Global Stores & DDP Shipping'}
                >
                  <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{isArabic ? 'المتاجر العالمية' : 'Global Stores'}</span>
                  <span className="text-[10px] bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100 px-1.5 py-0.2 rounded font-black">
                    🌐
                  </span>
                </button>
              )}
            </nav>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full bg-slate-100/80 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border rounded-xl py-2 ps-10 pe-24 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors focus:outline-none ${
                  isVoiceSearching
                    ? 'border-rose-400 ring-2 ring-rose-200'
                    : 'border-slate-200/80 dark:border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50'
                }`}
              />

              {/* Action buttons on end side: Clear, Mic, and Barcode Scanner */}
              <div className="absolute inset-y-0 end-0 pe-2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                    title={t.clearSearch}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Voice Search Mic */}
                <button
                  type="button"
                  onClick={toggleVoiceSearch}
                  className={`p-1.5 rounded-lg transition-all ${
                    isVoiceSearching
                      ? 'bg-rose-600 text-white animate-pulse shadow-xs ring-2 ring-rose-200'
                      : 'text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100/80 dark:hover:bg-amber-950/80'
                  }`}
                  title={isVoiceSearching ? t.stopVoiceSearch : t.voiceSearch}
                >
                  {isVoiceSearching ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>

                {/* Barcode Camera Scanner Trigger */}
                {onOpenBarcodeScanner && (
                  <button
                    type="button"
                    onClick={onOpenBarcodeScanner}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100/80 dark:hover:bg-amber-950/80 transition-all"
                    title={t.scanBarcodeTooltip}
                  >
                    <ScanBarcode className="w-4 h-4 stroke-[2.2]" />
                  </button>
                )}
              </div>

              {/* Voice recognition live floating feedback */}
              {(isVoiceSearching || voiceSearchFeedback) && (
                <div className={`absolute top-full mt-1.5 end-0 z-30 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg border flex items-center gap-2 animate-in fade-in ${
                  isVoiceSearching
                    ? 'bg-rose-950 text-white border-rose-800'
                    : 'bg-slate-900 text-amber-300 border-slate-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isVoiceSearching ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                  <span>{voiceSearchFeedback || t.voiceSearching}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Controls: Voice Chat, Language, Currency, Auth */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Gemini Voice Chat Button */}
            <button
              onClick={onOpenVoiceChat}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95"
              title={t.askGeminiVoice}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isArabic ? 'مستشار صوتي' : 'Voice Advisor'}</span>
              <span className="text-[10px] bg-slate-950 text-amber-300 px-1 py-0.2 rounded font-black">AI</span>
            </button>

            {/* Language Switcher (AR / EN) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-extrabold border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors shadow-2xs"
              title={isArabic ? 'Switch language to English' : 'التحويل إلى اللغة العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>{isArabic ? 'EN' : 'عربي'}</span>
            </button>

            {/* Currency Switcher */}
            <div className="relative hidden sm:block">
              <select
                value={currentCurrency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="appearance-none bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border border-slate-200 dark:border-slate-700 rounded-xl py-2 ps-2.5 pe-7 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                title={t.currency}
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 end-0 pe-2 flex items-center pointer-events-none text-slate-500">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? t.themeLight : t.themeDark}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile / Login */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
            >
              {user ? (
                <>
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">{t.signIn}</span>
                </>
              )}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="block md:hidden pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full bg-slate-100 dark:bg-slate-800 border rounded-xl py-2 ps-10 pe-24 text-xs font-medium text-slate-900 dark:text-white focus:outline-none ${
                isVoiceSearching
                  ? 'border-rose-400 ring-2 ring-rose-200'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500'
              }`}
            />

            <div className="absolute inset-y-0 end-0 pe-2 flex items-center gap-1">
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`p-1.5 rounded-lg transition-all ${
                  isVoiceSearching
                    ? 'bg-rose-600 text-white animate-pulse shadow-xs ring-2 ring-rose-200'
                    : 'text-slate-400 hover:text-amber-700 hover:bg-amber-100/80'
                }`}
                title={isVoiceSearching ? t.stopVoiceSearch : t.voiceSearch}
              >
                {isVoiceSearching ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              {onOpenBarcodeScanner && (
                <button
                  type="button"
                  onClick={onOpenBarcodeScanner}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100/80 dark:hover:bg-amber-950/80 transition-all"
                  title={t.scanBarcodeTooltip}
                >
                  <ScanBarcode className="w-4 h-4 stroke-[2.2]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <button
              onClick={() => {
                onTabChange('explore');
                setMobileMenuOpen(false);
              }}
              className="w-full text-start px-3 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>{t.explore}</span>
              <Smartphone className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                onTabChange('deals');
                setMobileMenuOpen(false);
              }}
              className="w-full text-start px-3 py-2 rounded-lg text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-between"
            >
              <span>{t.deals}</span>
              <Percent className="w-4 h-4 text-rose-600" />
            </button>

            <button
              onClick={() => {
                onOpenCompare();
                setMobileMenuOpen(false);
              }}
              className="w-full text-start px-3 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>{t.compare}</span>
                {compareCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                    {compareCount}
                  </span>
                )}
              </div>
              <Scale className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                onTabChange('favorites');
                setMobileMenuOpen(false);
              }}
              className="w-full text-start px-3 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>{t.favorites}</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </button>

            <button
              onClick={() => {
                onTabChange('about');
                setMobileMenuOpen(false);
              }}
              className="w-full text-start px-3 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>{t.about}</span>
              <Info className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={() => {
                onTabChange('privacy');
                setMobileMenuOpen(false);
              }}
              className="w-full text-start px-3 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>{t.privacy}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </button>

            <button
              onClick={() => {
                onTabChange('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full text-start px-3 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>{isArabic ? 'اتصل بنا' : 'Contact Us'}</span>
              <Headphones className="w-4 h-4 text-emerald-500" />
            </button>

            {onOpenGlobalStores && (
              <button
                onClick={() => {
                  onOpenGlobalStores();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-start px-3 py-2 rounded-lg text-xs font-bold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{isArabic ? 'المتاجر العالمية والشحن الدولي' : 'Global Stores & Shipping'}</span>
                </div>
                <span className="text-[10px] bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100 px-1.5 py-0.5 rounded font-black">
                  DDP 🌐
                </span>
              </button>
            )}

            {/* Mobile Barcode Scanner Option */}
            {onOpenBarcodeScanner && (
              <button
                onClick={() => {
                  onOpenBarcodeScanner();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-start px-3 py-2 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <ScanBarcode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{t.scanBarcode}</span>
                </div>
                <span className="text-[10px] bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-1.5 py-0.5 rounded font-bold">
                  {isArabic ? 'كاميرا' : 'Camera'}
                </span>
              </button>
            )}

            {/* Mobile Language Switcher */}
            <button
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="w-full text-start px-3 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>{isArabic ? 'اللغة: English' : 'Language: العربية'}</span>
              <Globe className="w-4 h-4 text-amber-500" />
            </button>

            {/* Mobile Currency Selection */}
            <div className="pt-2 px-3 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>{t.currency}:</span>
              <select
                value={currentCurrency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
