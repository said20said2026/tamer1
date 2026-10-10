import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { FilterSidebar } from './components/FilterSidebar';
import { PhoneCard } from './components/PhoneCard';
import { ComparisonView } from './components/ComparisonView';
import { PhoneDetailModal } from './components/PhoneDetailModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { AlertsManagerModal } from './components/AlertsManagerModal';
import { GeminiVoiceChat } from './components/GeminiVoiceChat';
import { DealsBanner } from './components/DealsBanner';
import { LoginPage } from './components/LoginPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { GlobalStoresModal } from './components/GlobalStoresModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { Footer } from './components/Footer';
import { PHONES_DATA } from './data/phonesData';
import { Phone, FilterState, CurrencyCode, PriceAlert } from './types/phone';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { 
  Scale, 
  Sparkles, 
  ArrowUpDown, 
  SlidersHorizontal, 
  Heart, 
  Trash2, 
  ChevronRight,
  TrendingDown,
  Volume2,
  Bell
} from 'lucide-react';
import { formatPrice } from './utils/currency';

function MainApp() {
  const { user } = useAuth();
  const { isArabic, direction, t } = useLanguage();

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'explore' | 'compare' | 'deals' | 'favorites' | 'privacy'>('explore');
  const [isAuthPageOpen, setIsAuthPageOpen] = useState(false);
  const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);
  const [isAlertsManagerOpen, setIsAlertsManagerOpen] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [isGlobalStoresModalOpen, setIsGlobalStoresModalOpen] = useState(false);

  // Selected phone for details modal
  const [selectedPhoneId, setSelectedPhoneId] = useState<string | null>(null);

  // Selected phone for setting a price alert
  const [phoneForAlert, setPhoneForAlert] = useState<Phone | null>(null);

  // Comparison list (up to 4 devices)
  const [comparisonPhoneIds, setComparisonPhoneIds] = useState<string[]>([
    'iphone-16-pro-max',
    'samsung-galaxy-s25-ultra',
  ]);

  // Currency
  const [currency, setCurrency] = useState<CurrencyCode>(user?.preferredCurrency || 'SAR');

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    brand: 'الكل',
    priceMin: 0,
    priceMax: 6000,
    storage: [],
    ram: [],
    has5G: null,
    minScreenHz: null,
    minBattery: null,
    minCameraMP: null,
    minChargingWatt: null,
    waterResistantOnly: false,
    condition: 'all',
    storeOriginFilter: 'all',
    sortBy: 'discount_desc',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filtered & Sorted phones
  const filteredPhones = useMemo(() => {
    return PHONES_DATA.filter((phone) => {
      // Favorites tab check
      if (activeTab === 'favorites') {
        const favs = user ? user.favorites : ['iphone-16-pro-max'];
        if (!favs.includes(phone.id)) return false;
      }

      // Search query (Arabic & English name, brand, processor, stores)
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesName = phone.name.toLowerCase().includes(q) || phone.nameAr.includes(q);
        const matchesBrand = phone.brand.toLowerCase().includes(q);
        const matchesCpu = phone.specs.performance.chipset.toLowerCase().includes(q);
        const matchesRefurb = (q.includes('مجدد') || q.includes('refurb')) && !!phone.hasRefurbished;
        const matchesUsed = (q.includes('مستعمل') || q.includes('used')) && !!phone.hasUsed;
        const matchesStore = phone.offers.some((o) =>
          o.storeName.toLowerCase().includes(q) ||
          (o.storeNameEn && o.storeNameEn.toLowerCase().includes(q)) ||
          (o.countryOrigin && o.countryOrigin.toLowerCase().includes(q))
        );
        const matchesGlobal = (q.includes('عالمي') || q.includes('global') || q.includes('دولي')) && phone.offers.some((o) => o.isGlobal);

        if (!matchesName && !matchesBrand && !matchesCpu && !matchesRefurb && !matchesUsed && !matchesStore && !matchesGlobal) {
          return false;
        }
      }

      // Device Condition filter (all, new_only, refurbished, used)
      if (filters.condition === 'refurbished') {
        if (!phone.hasRefurbished) return false;
      } else if (filters.condition === 'used') {
        if (!phone.hasUsed) return false;
      }

      // Store Origin filter (all, local_only, global_only)
      if (filters.storeOriginFilter === 'global_only') {
        if (!phone.offers.some((o) => o.isGlobal)) return false;
      } else if (filters.storeOriginFilter === 'local_only') {
        if (!phone.offers.some((o) => !o.isGlobal)) return false;
      }

      // Brand
      if (filters.brand && filters.brand !== 'الكل') {
        if (phone.brand !== filters.brand) return false;
      }

      // Price range
      if (phone.lowestPriceSAR < filters.priceMin || phone.lowestPriceSAR > filters.priceMax) {
        return false;
      }

      // Storage
      if (filters.storage.length > 0) {
        const hasMatchingStorage = phone.variants.some((v) =>
          filters.storage.includes(v.storage)
        );
        if (!hasMatchingStorage) return false;
      }

      // RAM
      if (filters.ram.length > 0) {
        const hasMatchingRam = phone.variants.some((v) => filters.ram.includes(v.ram));
        if (!hasMatchingRam) return false;
      }

      // 5G
      if (filters.has5G !== null) {
        if (phone.specs.connectivity.has5G !== filters.has5G) return false;
      }

      // Screen refresh rate
      if (filters.minScreenHz !== null) {
        const hzNum = parseInt(phone.specs.screen.refreshRate) || 60;
        if (hzNum < filters.minScreenHz) return false;
      }

      // Battery
      if (filters.minBattery !== null) {
        const batNum = parseInt(phone.specs.battery.capacity) || 0;
        if (batNum < filters.minBattery) return false;
      }

      // Charging speed
      if (filters.minChargingWatt !== null) {
        const wattNum = parseInt(phone.specs.battery.wiredCharging) || 0;
        if (wattNum < filters.minChargingWatt) return false;
      }

      // Water resistance IP68
      if (filters.waterResistantOnly) {
        if (!phone.specs.body.waterResistance.includes('IP68') && !phone.specs.body.waterResistance.includes('IP69')) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.lowestPriceSAR - b.lowestPriceSAR;
      if (filters.sortBy === 'price_desc') return b.lowestPriceSAR - a.lowestPriceSAR;
      if (filters.sortBy === 'discount_desc') {
        const dropA = a.originalPriceSAR - a.lowestPriceSAR;
        const dropB = b.originalPriceSAR - b.lowestPriceSAR;
        return dropB - dropA;
      }
      if (filters.sortBy === 'rating_desc') return b.rating - a.rating;
      if (filters.sortBy === 'release_desc') return b.releaseYear - a.releaseYear;
      return 0;
    });
  }, [filters, activeTab, user]);

  const selectedPhoneForModal = useMemo(() => {
    return PHONES_DATA.find((p) => p.id === selectedPhoneId) || null;
  }, [selectedPhoneId]);

  const selectedComparisonPhones = useMemo(() => {
    return comparisonPhoneIds
      .map((id) => PHONES_DATA.find((p) => p.id === id))
      .filter((p): p is Phone => !!p);
  }, [comparisonPhoneIds]);

  const toggleCompare = (phone: Phone) => {
    if (comparisonPhoneIds.includes(phone.id)) {
      setComparisonPhoneIds(comparisonPhoneIds.filter((id) => id !== phone.id));
    } else {
      if (comparisonPhoneIds.length >= 4) {
        alert('يمكنك مقارنة 4 هواتف كحد أقصى في المرة الواحدة.');
        return;
      }
      setComparisonPhoneIds([...comparisonPhoneIds, phone.id]);
    }
  };

  const removeComparePhone = (id: string) => {
    setComparisonPhoneIds(comparisonPhoneIds.filter((cid) => cid !== id));
  };

  const addComparePhone = (phone: Phone) => {
    if (comparisonPhoneIds.length < 4 && !comparisonPhoneIds.includes(phone.id)) {
      setComparisonPhoneIds([...comparisonPhoneIds, phone.id]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors" dir={direction}>
      {/* Navbar */}
      <Navbar
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        searchQuery={filters.search}
        onSearchChange={(q) => setFilters((f) => ({ ...f, search: q }))}
        compareCount={comparisonPhoneIds.length}
        onOpenCompare={() => {
          setIsAuthPageOpen(false);
          setActiveTab('compare');
        }}
        onOpenVoiceChat={() => setIsVoiceChatOpen(true)}
        onOpenAuth={() => setIsAuthPageOpen(true)}
        onOpenBarcodeScanner={() => setIsBarcodeScannerOpen(true)}
        onOpenGlobalStores={() => setIsGlobalStoresModalOpen(true)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setIsAuthPageOpen(false);
          setActiveTab(tab);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: AUTHENTICATION / LOGIN PAGE */}
        {isAuthPageOpen ? (
          <LoginPage
            onClose={() => setIsAuthPageOpen(false)}
            onNavigateHome={() => {
              setIsAuthPageOpen(false);
              setActiveTab('explore');
            }}
            onSelectPhone={(phoneId) => {
              setIsAuthPageOpen(false);
              setSelectedPhoneId(phoneId);
            }}
          />
        ) : activeTab === 'compare' ? (
          /* VIEW 2: SIDE-BY-SIDE SPEC COMPARISON */
          <ComparisonView
            selectedPhones={selectedComparisonPhones}
            onRemovePhone={removeComparePhone}
            onAddPhone={addComparePhone}
            onSelectPhoneForDetails={(id) => setSelectedPhoneId(id)}
            currency={currency}
            onBackToExplore={() => setActiveTab('explore')}
          />
        ) : activeTab === 'privacy' ? (
          /* VIEW 4: PRIVACY POLICY (سياسة الخصوصية) */
          <PrivacyPolicyPage
            onExplore={() => {
              setActiveTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCompare={() => {
              setActiveTab('compare');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenVoiceChat={() => setIsVoiceChatOpen(true)}
          />
        ) : (
          /* VIEW 3: EXPLORE MARKETPLACE & GALLERY */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Top Deals Highlights Banner */}
            {activeTab !== 'favorites' && (
              <DealsBanner
                phones={PHONES_DATA}
                currency={currency}
                onSelectPhone={(id) => setSelectedPhoneId(id)}
                onFilterDeals={() => {
                  setFilters((f) => ({ ...f, sortBy: 'discount_desc' }));
                  setActiveTab('deals');
                }}
              />
            )}

            {/* Header Title for Current View */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  {activeTab === 'favorites' ? (
                    <>
                      <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                      <span>{isArabic ? 'قائمتي المفضلة من الهواتف' : 'My Favorite Phones'}</span>
                    </>
                  ) : activeTab === 'deals' ? (
                    <>
                      <TrendingDown className="w-6 h-6 text-rose-600" />
                      <span>{isArabic ? 'صفقات وعروض الهواتف بأكبر انخفاض للسعر' : 'Top Phone Deals & Price Drops'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isArabic ? 'معرض ومقارنة أسعار الهواتف الذكية' : 'Smartphone Price Comparison & Gallery'}</span>
                      <span className="text-xs font-bold text-slate-400">
                        ({filteredPhones.length} {isArabic ? 'هاتف' : 'phones'})
                      </span>
                    </>
                  )}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isArabic
                    ? 'مقارنة حية لأسعار المتاجر: أمازون السعودية، نون، مكتبة جرير، إكسترا'
                    : 'Live price comparison across major stores: Amazon, Noon, Jarir Bookstore, eXtra'}
                </p>
              </div>

              {/* Sort selector & Mobile filter button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-xs"
                >
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  <span>{isArabic ? 'تصفية المواصفات' : 'Filter Specs'}</span>
                </button>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold hidden sm:inline">
                    {isArabic ? 'الترتيب:' : 'Sort by:'}
                  </span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                    className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="discount_desc">{isArabic ? 'أكبر قيمة خصم' : 'Highest Discount'}</option>
                    <option value="price_asc">{isArabic ? 'الأقل سعراً أولاً' : 'Price: Low to High'}</option>
                    <option value="price_desc">{isArabic ? 'الأعلى سعراً أولاً' : 'Price: High to Low'}</option>
                    <option value="rating_desc">{isArabic ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
                    <option value="release_desc">{isArabic ? 'الأحدث نزولاً' : 'Newest First'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Layout Grid: Sidebar Filters + Phones Gallery */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Desktop Filter Sidebar */}
              <div className="hidden lg:block lg:col-span-1 sticky top-24">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  currency={currency}
                  totalResults={filteredPhones.length}
                />
              </div>

              {/* Mobile Filter Drawer */}
              {mobileFilterOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 p-4 flex justify-end">
                  <div className="bg-white w-full max-w-sm rounded-2xl p-4 overflow-y-auto max-h-[90vh]">
                    <div className="flex items-center justify-between pb-3 border-b mb-3">
                      <span className="font-bold text-sm">تصفية الهواتف</span>
                      <button onClick={() => setMobileFilterOpen(false)} className="text-slate-500">إغلاق</button>
                    </div>
                    <FilterSidebar
                      filters={filters}
                      onFilterChange={(f) => {
                        setFilters(f);
                        setMobileFilterOpen(false);
                      }}
                      currency={currency}
                      totalResults={filteredPhones.length}
                    />
                  </div>
                </div>
              )}

              {/* Phones Gallery Cards Grid */}
              <div className="lg:col-span-3">
                {filteredPhones.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <p className="text-sm font-bold text-slate-800 mb-1">لم يتم العثور على أي هواتف تطابق اختياراتك</p>
                    <p className="text-xs text-slate-500 mb-4">جرب توسيع نطاق السعر أو إزالة بعض شروط التصفية.</p>
                    <button
                      onClick={() =>
                        setFilters({
                          search: '',
                          brand: 'الكل',
                          priceMin: 0,
                          priceMax: 6000,
                          storage: [],
                          ram: [],
                          has5G: null,
                          minScreenHz: null,
                          minBattery: null,
                          minCameraMP: null,
                          minChargingWatt: null,
                          waterResistantOnly: false,
                          condition: 'all',
                          sortBy: 'discount_desc',
                        })
                      }
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                      إعادة ضبط جميع الفلاتر
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredPhones.map((phone) => (
                      <PhoneCard
                        key={phone.id}
                        phone={phone}
                        currency={currency}
                        isInComparison={comparisonPhoneIds.includes(phone.id)}
                        compareCount={comparisonPhoneIds.length}
                        onToggleCompare={toggleCompare}
                        onOpenDetails={(id) => setSelectedPhoneId(id)}
                        onOpenAlertModal={(p) => setPhoneForAlert(p)}
                        onNavigateToCompare={() => {
                          setIsAuthPageOpen(false);
                          setActiveTab('compare');
                        }}
                        onSetComparisonIds={(ids) => setComparisonPhoneIds(ids.slice(0, 4))}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Comparison Tray (When 1+ phones are selected) */}
      {comparisonPhoneIds.length > 0 && activeTab !== 'compare' && !isAuthPageOpen && (
        <div className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-2xl border border-slate-800 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
              {selectedComparisonPhones.map((p) => (
                <img
                  key={p.id}
                  src={p.image}
                  alt={p.name}
                  className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover bg-slate-800"
                />
              ))}
            </div>

            <div>
              <span className="block text-xs font-bold text-white">
                مقارنة ({comparisonPhoneIds.length}/4) هواتف
              </span>
              <span className="text-[10px] text-slate-400">مواصفات وجهاً لوجه وأسعار المتاجر</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setComparisonPhoneIds([])}
              className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
              title="إفراغ قائمة المقارنة"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Scale className="w-4 h-4" />
              <span>قارن الآن</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {/* 1. Phone Details Modal */}
      <PhoneDetailModal
        phone={selectedPhoneForModal}
        isOpen={!!selectedPhoneId}
        onClose={() => setSelectedPhoneId(null)}
        currency={currency}
        onOpenAlertModal={(p) => setPhoneForAlert(p)}
        onToggleCompare={toggleCompare}
        isInComparison={selectedPhoneId ? comparisonPhoneIds.includes(selectedPhoneId) : false}
        onOpenAuth={() => setIsAuthPageOpen(true)}
      />

      {/* 2. Set Low Price Alert Modal */}
      <PriceAlertModal
        phone={phoneForAlert}
        isOpen={!!phoneForAlert}
        onClose={() => setPhoneForAlert(null)}
        currency={currency}
        onAlertCreated={() => {
          // Toast or sync
        }}
      />

      {/* 3. Alerts Manager Modal */}
      <AlertsManagerModal
        isOpen={isAlertsManagerOpen}
        onClose={() => setIsAlertsManagerOpen(false)}
        currency={currency}
        onSelectPhone={(phoneId) => setSelectedPhoneId(phoneId)}
      />

      {/* 4. Gemini Voice Chat Modal */}
      <GeminiVoiceChat
        userCurrency={currency}
        isOpen={isVoiceChatOpen}
        onClose={() => setIsVoiceChatOpen(false)}
        onSelectPhone={(phoneId) => setSelectedPhoneId(phoneId)}
      />

      {/* 5. Barcode Packaging Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        currency={currency}
        onSelectPhone={(phoneId) => setSelectedPhoneId(phoneId)}
        onAddToCompare={(phone) => addComparePhone(phone)}
        onSearchPhone={(code) => {
          setFilters((f) => ({ ...f, search: code }));
          setActiveTab('explore');
        }}
      />

      {/* 6. Global Stores & International Import Directory Modal */}
      <GlobalStoresModal
        isOpen={isGlobalStoresModalOpen}
        onClose={() => setIsGlobalStoresModalOpen(false)}
        currency={currency}
        onSelectPhone={(phoneId) => setSelectedPhoneId(phoneId)}
        onFilterGlobalOnly={() => {
          setFilters((f) => ({ ...f, storeOriginFilter: 'global_only' }));
          setActiveTab('explore');
        }}
      />

      {/* Footer */}
      <Footer
        onOpenVoiceChat={() => setIsVoiceChatOpen(true)}
        onOpenAlerts={() => setIsAlertsManagerOpen(true)}
        onOpenPrivacy={() => {
          setIsAuthPageOpen(false);
          setActiveTab('privacy');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGlobalStores={() => setIsGlobalStoresModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
