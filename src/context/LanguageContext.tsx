import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

export interface Translations {
  // Brand & Header
  brandName: string;
  brandTag: string;
  brandSub: string;
  topBanner: string;
  askGeminiVoice: string;
  
  // Navigation Tabs
  explore: string;
  deals: string;
  compare: string;
  favorites: string;
  about: string;
  privacy: string;
  terms: string;
  contactUs: string;
  signIn: string;
  signOut: string;
  myAccount: string;

  // Search Bar
  searchPlaceholder: string;
  clearSearch: string;
  voiceSearch: string;
  voiceSearching: string;
  stopVoiceSearch: string;
  scanBarcode: string;
  scanBarcodeTooltip: string;

  // Controls
  currency: string;
  themeDark: string;
  themeLight: string;
  languageToggle: string;

  // Common Phone & Filter terms
  allBrands: string;
  filterTitle: string;
  filterReset: string;
  priceRange: string;
  storage: string;
  ram: string;
  viewDetails: string;
  addToCompare: string;
  inCompare: string;
  quickCompare: string;
  lowestPriceToday: string;
  availableInStores: string;
  inStock: string;
  outOfStock: string;
  specs: string;
  pros: string;
  cons: string;
  reviews: string;
  priceHistory: string;
  setAlert: string;
  share: string;
  ratingDistribution: string;
  
  // Barcode Modal
  barcodeModalTitle: string;
  barcodeModalSub: string;
  liveCamera: string;
  uploadImage: string;
  demoBoxes: string;
  barcodeSuccess: string;
  barcodeDetected: string;
  barcodeOpenDetails: string;
  barcodeCompareThis: string;
  barcodeScanAnother: string;
}

const AR_TRANSLATIONS: Translations = {
  brandName: 'قارن',
  brandTag: 'تك',
  brandSub: 'مقارنة أسعار الهواتف الذكية',
  topBanner: 'تحديث مباشر لأسعار الهواتف في المتاجر الكبرى (أمازون، نون، جرير، إكسترا) اليوم',
  askGeminiVoice: 'اسأل مستشار Gemini الصوتي مجاناً',

  explore: 'استعراض الهواتف',
  deals: 'أكبر الخصومات',
  compare: 'المقارنة المباشرة',
  favorites: 'المفضلة',
  about: 'من نحن',
  privacy: 'سياسة الخصوصية',
  terms: 'شروط الاستخدام',
  contactUs: 'اتصل بنا',
  signIn: 'تسجيل الدخول',
  signOut: 'تسجيل الخروج',
  myAccount: 'حسابي',

  searchPlaceholder: 'ابحث بالاسم، المعالج، أو الموديل (مثل: iPhone 16، S25 Ultra، بوكو)...',
  clearSearch: 'مسح البحث',
  voiceSearch: 'البحث الصوتي (تحدث باللغة العربية)',
  voiceSearching: 'جاري الاستماع... قل اسم الهاتف',
  stopVoiceSearch: 'إيقاف البحث الصوتي',
  scanBarcode: 'مسح باركود الغلاف',
  scanBarcodeTooltip: 'مسح باركود غلاف الهاتف بالكاميرا مباشرة',

  currency: 'العملة',
  themeDark: 'الوضع الليلي',
  themeLight: 'الوضع النهاري',
  languageToggle: 'English',

  allBrands: 'جميع الشركات',
  filterTitle: 'تصفية النتائج',
  filterReset: 'إعادة ضبط',
  priceRange: 'نطاق السعر',
  storage: 'السعة',
  ram: 'الرام',
  viewDetails: 'تفاصيل ومقارنة الأسعار',
  addToCompare: 'أضف للمقارنة',
  inCompare: 'في المقارنة',
  quickCompare: 'خيارات المقارنة المباشرة',
  lowestPriceToday: 'أقل سعر اليوم:',
  availableInStores: 'متوفر في المتاجر',
  inStock: 'متوفر',
  outOfStock: 'غير متوفر',
  specs: 'المواصفات التقنية',
  pros: 'المميزات',
  cons: 'العيوب',
  reviews: 'التقييمات والآراء',
  priceHistory: 'سجل الأسعار',
  setAlert: 'تنبيه هبوط السعر',
  share: 'مشاركة',
  ratingDistribution: 'توزيع التقييمات',

  barcodeModalTitle: 'مسح باركود غلاف الهاتف',
  barcodeModalSub: 'امسح كود العلبة للوصول المباشر لتفاصيل الهاتف ومقارنة أسعاره في المتاجر',
  liveCamera: 'الكاميرا المباشرة',
  uploadImage: 'رفع صورة الغلاف',
  demoBoxes: 'علب للتجربة الفورية',
  barcodeSuccess: 'تم التعرف على غلاف الهاتف بنجاح!',
  barcodeDetected: 'رمز الباركود المفحوص:',
  barcodeOpenDetails: 'فتح تفاصيل ومقارنة الأسعار الشاملة',
  barcodeCompareThis: 'إضافة لجدول المقارنة',
  barcodeScanAnother: 'مسح غلاف آخر',
};

const EN_TRANSLATIONS: Translations = {
  brandName: 'Qaren',
  brandTag: 'Tech',
  brandSub: 'Smart Phone Price Comparison',
  topBanner: 'Live price updates across top stores (Amazon, Noon, Jarir, Extra) today',
  askGeminiVoice: 'Ask Gemini Voice Advisor for Free',

  explore: 'Explore Phones',
  deals: 'Top Deals',
  compare: 'Compare',
  favorites: 'Favorites',
  about: 'About Us',
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
  contactUs: 'Contact Us',
  signIn: 'Sign In',
  signOut: 'Sign Out',
  myAccount: 'My Account',

  searchPlaceholder: 'Search by model, chip, or brand (e.g. iPhone 16, S25 Ultra, POCO)...',
  clearSearch: 'Clear search',
  voiceSearch: 'Voice Search',
  voiceSearching: 'Listening... Speak the phone name',
  stopVoiceSearch: 'Stop voice search',
  scanBarcode: 'Scan Box Barcode',
  scanBarcodeTooltip: 'Scan phone retail box barcode with camera',

  currency: 'Currency',
  themeDark: 'Dark Mode',
  themeLight: 'Light Mode',
  languageToggle: 'العربية',

  allBrands: 'All Brands',
  filterTitle: 'Filter Results',
  filterReset: 'Reset',
  priceRange: 'Price Range',
  storage: 'Storage',
  ram: 'RAM',
  viewDetails: 'Details & Store Prices',
  addToCompare: 'Add to Compare',
  inCompare: 'In Comparison',
  quickCompare: 'Quick Compare Options',
  lowestPriceToday: 'Lowest Price Today:',
  availableInStores: 'Available in stores',
  inStock: 'In Stock',
  outOfStock: 'Out of Stock',
  specs: 'Specifications',
  pros: 'Pros',
  cons: 'Cons',
  reviews: 'Reviews & Ratings',
  priceHistory: 'Price History',
  setAlert: 'Price Drop Alert',
  share: 'Share',
  ratingDistribution: 'Rating Distribution',

  barcodeModalTitle: 'Scan Phone Box Barcode',
  barcodeModalSub: 'Scan the packaging barcode to view specs and compare store prices instantly',
  liveCamera: 'Live Camera',
  uploadImage: 'Upload Box Photo',
  demoBoxes: 'Demo Boxes for Testing',
  barcodeSuccess: 'Phone Box Recognized Successfully!',
  barcodeDetected: 'Scanned Barcode:',
  barcodeOpenDetails: 'View Full Specs & Compare Store Prices',
  barcodeCompareThis: 'Add to Comparison Matrix',
  barcodeScanAnother: 'Scan Another Box',
};

interface LanguageContextType {
  language: Language;
  direction: 'rtl' | 'ltr';
  isArabic: boolean;
  isEnglish: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('qaren_lang');
      if (saved === 'ar' || saved === 'en') return saved;
    } catch {
      // LocalStorage unavailable
    }
    return 'ar'; // Arabic default
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('qaren_lang', lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const direction: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  const value: LanguageContextType = {
    language,
    direction,
    isArabic: language === 'ar',
    isEnglish: language === 'en',
    toggleLanguage,
    setLanguage,
    t: language === 'ar' ? AR_TRANSLATIONS : EN_TRANSLATIONS,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
