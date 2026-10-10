import React, { useState, useMemo } from 'react';
import { 
  X, 
  Plus, 
  Check, 
  ArrowRight, 
  ExternalLink, 
  Share2, 
  Sparkles, 
  Trophy,
  Eye, 
  SlidersHorizontal, 
  Trash2, 
  Cpu, 
  Camera, 
  Battery, 
  Zap, 
  Smartphone, 
  ShieldCheck, 
  Gauge, 
  Flame, 
  CheckCircle2,
  TrendingDown,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Phone, CurrencyCode } from '../types/phone';
import { formatPrice } from '../utils/currency';
import { PHONES_DATA } from '../data/phonesData';
import { useLanguage } from '../context/LanguageContext';

interface ComparisonViewProps {
  selectedPhones: Phone[];
  onRemovePhone: (phoneId: string) => void;
  onAddPhone: (phone: Phone) => void;
  onSelectPhoneForDetails: (phoneId: string) => void;
  currency: CurrencyCode;
  onBackToExplore: () => void;
}

type SpecCategory = 'all' | 'performance' | 'camera' | 'battery' | 'screen' | 'body' | 'price';

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  selectedPhones,
  onRemovePhone,
  onAddPhone,
  onSelectPhoneForDetails,
  currency,
  onBackToExplore,
}) => {
  const { isArabic, direction, t } = useLanguage();
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [highlightBestOnly, setHighlightBestOnly] = useState(true);
  const [activeCategory, setActiveCategory] = useState<SpecCategory>('all');
  const [devicePickerOpen, setDevicePickerOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Available devices that are not already in comparison
  const availablePhones = PHONES_DATA.filter(
    (p) => !selectedPhones.some((sp) => sp.id === p.id)
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Helper to extract numeric values for comparisons
  const extractNumber = (str: string | undefined): number => {
    if (!str) return 0;
    const cleaned = str.replace(/,/g, '');
    const match = cleaned.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Helper to test if a row differs between devices
  const isRowDifferent = (getter: (p: Phone) => string | number | boolean) => {
    if (selectedPhones.length <= 1) return false;
    const firstVal = String(getter(selectedPhones[0])).toLowerCase().trim();
    return selectedPhones.some((p) => String(getter(p)).toLowerCase().trim() !== firstVal);
  };

  // 1. Processor & Performance Benchmark Winner
  const performanceAnalysis = useMemo(() => {
    if (selectedPhones.length === 0) return null;
    const scores = selectedPhones.map((p) => ({
      phone: p,
      score: extractNumber(p.specs.performance.antutuScore),
      chipset: p.specs.performance.chipset
    }));
    const maxScore = Math.max(...scores.map((s) => s.score));
    const winner = scores.find((s) => s.score === maxScore && maxScore > 0)?.phone || selectedPhones[0];
    return { scores, maxScore, winner };
  }, [selectedPhones]);

  // 2. Camera System Winner
  const cameraAnalysis = useMemo(() => {
    if (selectedPhones.length === 0) return null;
    const specs = selectedPhones.map((p) => {
      const mainMP = extractNumber(p.specs.camera.main);
      const hasTele = Boolean(p.specs.camera.telephoto && !p.specs.camera.telephoto.includes('لا'));
      const teleZoom = extractNumber(p.specs.camera.telephoto);
      const is8K = p.specs.camera.video.includes('8K');
      const score = mainMP + (hasTele ? (teleZoom > 0 ? teleZoom * 15 : 20) : 0) + (is8K ? 25 : 0);
      return { phone: p, mainMP, hasTele, teleZoom, score };
    });
    const maxScore = Math.max(...specs.map((s) => s.score));
    const winner = specs.find((s) => s.score === maxScore)?.phone || selectedPhones[0];
    return { specs, winner };
  }, [selectedPhones]);

  // 3. Battery & Power Architecture Winner
  const batteryAnalysis = useMemo(() => {
    if (selectedPhones.length === 0) return null;
    const specs = selectedPhones.map((p) => {
      const capacity = extractNumber(p.specs.battery.capacity);
      const watts = extractNumber(p.specs.battery.wiredCharging);
      const hasWireless = Boolean(p.specs.battery.wirelessCharging && !p.specs.battery.wirelessCharging.includes('غير'));
      const wirelessWatts = extractNumber(p.specs.battery.wirelessCharging);
      return { phone: p, capacity, watts, hasWireless, wirelessWatts };
    });
    const maxCapacity = Math.max(...specs.map((s) => s.capacity));
    const maxWatts = Math.max(...specs.map((s) => s.watts));
    const capacityWinner = specs.find((s) => s.capacity === maxCapacity)?.phone || selectedPhones[0];
    const chargingWinner = specs.find((s) => s.watts === maxWatts)?.phone || selectedPhones[0];
    return { specs, maxCapacity, maxWatts, capacityWinner, chargingWinner };
  }, [selectedPhones]);

  if (selectedPhones.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center" dir={direction}>
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
          <SlidersHorizontal className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {isArabic ? 'لم تختر أي هاتف للمقارنة بعد' : 'No phones selected for comparison yet'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
          {isArabic
            ? 'اختر هاتفين أو أكثر من المعرض للاطلاع على مقارنة تفصيلية دقيقة وجهاً لوجه تشمل المعالج، الكاميرا، البطارية، والأسعار.'
            : 'Select two or more phones from the gallery to view an in-depth side-by-side comparison of processor, camera, battery, and store prices.'}
        </p>
        <button
          onClick={onBackToExplore}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-colors shadow-xs"
        >
          {isArabic ? 'استعراض الهواتف واختيار المقارنة' : 'Browse Phones to Compare'}
        </button>
      </div>
    );
  }

  // Spec definition tables with intelligent best-value detectors
  const SPEC_GROUPS = [
    {
      id: 'performance',
      title: isArabic ? 'المعالج والأداء وقوة الحوسبة' : 'Processor, Performance & Hardware',
      icon: <Cpu className="w-4 h-4 text-amber-500" />,
      badge: isArabic ? 'مقارنة عتادية' : 'Hardware Duel',
      rows: [
        {
          label: isArabic ? 'شريحة المعالج الرئيسية (Chipset)' : 'Main Chipset',
          getter: (p: Phone) => p.specs.performance.chipset,
          isBest: (p: Phone) => {
            const chipset = p.specs.performance.chipset.toLowerCase();
            return chipset.includes('8 elite') || chipset.includes('a18 pro') || chipset.includes('9300+');
          },
          bestBadgeText: isArabic ? 'الجيل الأحدث والأقوى' : 'Latest Flagship Tier',
        },
        {
          label: isArabic ? 'معمارية ونوى المعالج (CPU)' : 'CPU Architecture',
          getter: (p: Phone) => p.specs.performance.cpu,
        },
        {
          label: isArabic ? 'المعالج الرسومي للألعاب (GPU)' : 'Graphics Processor (GPU)',
          getter: (p: Phone) => p.specs.performance.gpu,
          isBest: (p: Phone) => {
            const gpu = p.specs.performance.gpu.toLowerCase();
            return gpu.includes('adreno 830') || gpu.includes('apple gpu') || gpu.includes('immortalis');
          },
          bestBadgeText: isArabic ? 'أداء رسومي فائق' : 'Top Tier Graphics',
        },
        {
          label: isArabic ? 'الذاكرة العشوائية الأساسية (RAM)' : 'Base RAM Capacity',
          getter: (p: Phone) => p.baseRam,
          isBest: (p: Phone) => {
            const rams = selectedPhones.map((x) => extractNumber(x.baseRam));
            const maxRam = Math.max(...rams);
            return extractNumber(p.baseRam) === maxRam;
          },
          bestBadgeText: isArabic ? 'الرام الأعلى' : 'Highest RAM',
        },
        {
          label: isArabic ? 'سعة التخزين الأساسية' : 'Base Storage',
          getter: (p: Phone) => p.baseStorage,
          isBest: (p: Phone) => {
            const storages = selectedPhones.map((x) => extractNumber(x.baseStorage));
            const max = Math.max(...storages);
            return extractNumber(p.baseStorage) === max;
          },
          bestBadgeText: isArabic ? 'السعة الأكبر' : 'Largest Storage',
        },
        {
          label: isArabic ? 'نتيجة اختبار الأداء القياسي (AnTuTu v10)' : 'Benchmark Score (AnTuTu v10)',
          getter: (p: Phone) => p.specs.performance.antutuScore || (isArabic ? 'غير متوفر' : 'N/A'),
          isBest: (p: Phone) => {
            const scores = selectedPhones.map((x) => extractNumber(x.specs.performance.antutuScore));
            const max = Math.max(...scores);
            return max > 0 && extractNumber(p.specs.performance.antutuScore) === max;
          },
          bestBadgeText: isArabic ? 'الأعلى نتيجة' : 'Top Benchmark',
        },
        {
          label: isArabic ? 'خيارات وسعات التخزين المتاحة' : 'Available Storage Variants',
          getter: (p: Phone) => p.variants.map((v) => `${v.storage} / ${v.ram}`).join(' · '),
        },
      ],
    },
    {
      id: 'camera',
      title: isArabic ? 'الكاميرات ودقة التصوير' : 'Camera System & Imaging',
      icon: <Camera className="w-4 h-4 text-rose-500" />,
      badge: isArabic ? 'مقارنة فوتوغرافية' : 'Photo & Video Duel',
      rows: [
        {
          label: isArabic ? 'الكاميرا الرئيسية الخلفية (Main Lens)' : 'Main Rear Camera',
          getter: (p: Phone) => p.specs.camera.main,
          isBest: (p: Phone) => {
            const mps = selectedPhones.map((x) => extractNumber(x.specs.camera.main));
            const maxMP = Math.max(...mps);
            return extractNumber(p.specs.camera.main) === maxMP;
          },
          bestBadgeText: isArabic ? 'الدقة الأعلى' : 'Highest Megapixels',
        },
        {
          label: isArabic ? 'كاميرا التقريب البصري (Telephoto / Periscope)' : 'Telephoto / Zoom Lens',
          getter: (p: Phone) => p.specs.camera.telephoto || (isArabic ? 'لا يوجد (تقريب رقمي)' : 'None (Digital Zoom)'),
          isBest: (p: Phone) => {
            const zooms = selectedPhones.map((x) => extractNumber(x.specs.camera.telephoto));
            const maxZoom = Math.max(...zooms);
            return maxZoom > 0 && extractNumber(p.specs.camera.telephoto) === maxZoom;
          },
          bestBadgeText: isArabic ? 'أطول مدى تقريب بصري' : 'Longest Optical Zoom',
        },
        {
          label: isArabic ? 'الكاميرا فائقة الاتساع (Ultrawide)' : 'Ultrawide Lens',
          getter: (p: Phone) => p.specs.camera.ultrawide,
          isBest: (p: Phone) => {
            const mps = selectedPhones.map((x) => extractNumber(x.specs.camera.ultrawide));
            const max = Math.max(...mps);
            return extractNumber(p.specs.camera.ultrawide) === max && max > 12;
          },
          bestBadgeText: isArabic ? 'دقة زاوية عريضة أعلى' : 'High-Res Ultrawide',
        },
        {
          label: isArabic ? 'الكاميرا الأمامية (Selfie Camera)' : 'Front Selfie Camera',
          getter: (p: Phone) => p.specs.camera.selfie,
          isBest: (p: Phone) => {
            const mps = selectedPhones.map((x) => extractNumber(x.specs.camera.selfie));
            const max = Math.max(...mps);
            return extractNumber(p.specs.camera.selfie) === max;
          },
          bestBadgeText: isArabic ? 'سيلفي أعلى دقة' : 'Highest Selfie MP',
        },
        {
          label: isArabic ? 'أقصى دقة لتصوير الفيديو' : 'Max Video Recording Quality',
          getter: (p: Phone) => p.specs.camera.video,
          isBest: (p: Phone) => {
            const vid = p.specs.camera.video.toLowerCase();
            return vid.includes('8k') || vid.includes('120');
          },
          bestBadgeText: isArabic ? 'أعلى جودة فيديو' : 'Highest Video Specs',
        },
        {
          label: isArabic ? 'مزايا وتقنيات التصوير الاحترافية' : 'Key Camera Features',
          getter: (p: Phone) => p.specs.camera.features.join(' · '),
        },
      ],
    },
    {
      id: 'battery',
      title: isArabic ? 'البطارية وسرعة الشحن والطاقة' : 'Battery Capacity & Charging Speed',
      icon: <Battery className="w-4 h-4 text-emerald-500" />,
      badge: isArabic ? 'مقارنة الطاقة' : 'Power & Battery Duel',
      rows: [
        {
          label: isArabic ? 'سعة البطارية (mAh)' : 'Battery Capacity (mAh)',
          getter: (p: Phone) => p.specs.battery.capacity,
          isBest: (p: Phone) => {
            const caps = selectedPhones.map((x) => extractNumber(x.specs.battery.capacity));
            const max = Math.max(...caps);
            return extractNumber(p.specs.battery.capacity) === max;
          },
          bestBadgeText: isArabic ? 'البطارية الأكبر سعة' : 'Largest Battery',
        },
        {
          label: isArabic ? 'سرعة الشحن السلكي (W Watts)' : 'Wired Fast Charging Speed',
          getter: (p: Phone) => p.specs.battery.wiredCharging,
          isBest: (p: Phone) => {
            const watts = selectedPhones.map((x) => extractNumber(x.specs.battery.wiredCharging));
            const max = Math.max(...watts);
            return extractNumber(p.specs.battery.wiredCharging) === max;
          },
          bestBadgeText: isArabic ? 'الشحن السلكي الأسرع' : 'Fastest Wired Charging',
        },
        {
          label: isArabic ? 'الشحن اللاسلكي السريع' : 'Wireless Charging Speed',
          getter: (p: Phone) => p.specs.battery.wirelessCharging || (isArabic ? 'غير مدعوم' : 'Not Supported'),
          isBest: (p: Phone) => {
            const watts = selectedPhones.map((x) => extractNumber(x.specs.battery.wirelessCharging));
            const max = Math.max(...watts);
            return max > 0 && extractNumber(p.specs.battery.wirelessCharging) === max;
          },
          bestBadgeText: isArabic ? 'الشحن اللاسلكي الأسرع' : 'Fastest Wireless',
        },
        {
          label: isArabic ? 'عمر البطارية والتحمل التقديري' : 'Battery Life Score',
          getter: (p: Phone) => p.specs.battery.batteryLifeScore,
        },
      ],
    },
    {
      id: 'screen',
      title: isArabic ? 'الشاشة والعرض وسلاسة الإطارات' : 'Display Quality & Refresh Rate',
      icon: <Smartphone className="w-4 h-4 text-sky-500" />,
      rows: [
        { label: isArabic ? 'حجم الشاشة بالبوصة' : 'Screen Size', getter: (p: Phone) => p.specs.screen.size },
        { label: isArabic ? 'نوع اللوحة والتقنية' : 'Panel Type & Tech', getter: (p: Phone) => p.specs.screen.panel },
        { label: isArabic ? 'دقة الشاشة والكثافة' : 'Resolution & Density', getter: (p: Phone) => p.specs.screen.resolution },
        {
          label: isArabic ? 'معدل التحديث (Refresh Rate)' : 'Refresh Rate',
          getter: (p: Phone) => p.specs.screen.refreshRate,
          isBest: (p: Phone) => {
            const hzs = selectedPhones.map((x) => extractNumber(x.specs.screen.refreshRate));
            const max = Math.max(...hzs);
            return extractNumber(p.specs.screen.refreshRate) === max;
          },
          bestBadgeText: isArabic ? 'الشاشة الأكثر سلاسة' : 'Smoothest Refresh',
        },
        {
          label: isArabic ? 'السطوع الأقصى (Peak Brightness)' : 'Peak Brightness (Nits)',
          getter: (p: Phone) => p.specs.screen.peakBrightness,
          isBest: (p: Phone) => {
            const nits = selectedPhones.map((x) => extractNumber(x.specs.screen.peakBrightness));
            const max = Math.max(...nits);
            return extractNumber(p.specs.screen.peakBrightness) === max;
          },
          bestBadgeText: isArabic ? 'السطوع الأعلى تحت الشمس' : 'Brightest Screen',
        },
        { label: isArabic ? 'طبقة الحماية والزجاج' : 'Glass Protection', getter: (p: Phone) => p.specs.screen.protection },
      ],
    },
    {
      id: 'body',
      title: isArabic ? 'الهيكل والمتانة ومقاومة الماء' : 'Build, Durability & Water Resistance',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
      rows: [
        {
          label: isArabic ? 'معيار مقاومة الماء والغبار' : 'Water & Dust Resistance',
          getter: (p: Phone) => p.specs.body.waterResistance,
          isBest: (p: Phone) => p.specs.body.waterResistance.includes('IP68') || p.specs.body.waterResistance.includes('IP69'),
          bestBadgeText: isArabic ? 'مقاومة معتمدة IP68/69' : 'Highest IP Rating',
        },
        {
          label: isArabic ? 'الوزن بالجرام' : 'Weight (Grams)',
          getter: (p: Phone) => p.specs.body.weight,
          isBest: (p: Phone) => {
            const weights = selectedPhones.map((x) => extractNumber(x.specs.body.weight));
            const min = Math.min(...weights);
            return extractNumber(p.specs.body.weight) === min;
          },
          bestBadgeText: isArabic ? 'الأخف وزناً' : 'Lightest Weight',
        },
        { label: isArabic ? 'الأبعاد والسمك' : 'Dimensions & Thickness', getter: (p: Phone) => p.specs.body.dimensions },
        { label: isArabic ? 'خامات تصنيع الهيكل' : 'Frame & Back Materials', getter: (p: Phone) => p.specs.body.materials },
        {
          label: isArabic ? 'دعم شبكات الجيل الخامس 5G' : '5G Connectivity',
          getter: (p: Phone) => p.specs.connectivity.has5G ? (isArabic ? 'نعم، مدعوم بالكامل' : 'Supported') : (isArabic ? 'لا' : 'No')
        },
      ],
    },
    {
      id: 'price',
      title: isArabic ? 'الأسعار وأفضل الصفقات في المتاجر' : 'Prices & Store Deals',
      icon: <TrendingDown className="w-4 h-4 text-emerald-600" />,
      rows: [
        {
          label: isArabic ? 'أقل سعر متاح اليوم' : 'Lowest Price Today',
          getter: (p: Phone) => formatPrice(p.lowestPriceSAR, currency),
          isBest: (p: Phone) => {
            const min = Math.min(...selectedPhones.map((x) => x.lowestPriceSAR));
            return p.lowestPriceSAR === min;
          },
          bestBadgeText: isArabic ? 'السعر الأوفر والأرخص' : 'Best Price / Best Deal',
        },
        {
          label: isArabic ? 'المتجر صاحب أقل سعر' : 'Store with Lowest Price',
          getter: (p: Phone) => {
            const sorted = [...p.offers].sort((a, b) => a.priceSAR - b.priceSAR);
            return sorted[0] ? `${sorted[0].storeName} (${formatPrice(sorted[0].priceSAR, currency)})` : (isArabic ? 'غير متوفر' : 'Unavailable');
          },
        },
        {
          label: isArabic ? 'السعر الرسمي عند الإطلاق' : 'Original Launch Price',
          getter: (p: Phone) => formatPrice(p.originalPriceSAR, currency),
        },
        {
          label: isArabic ? 'قيمة الخصم والتوفير' : 'Discount / Savings',
          getter: (p: Phone) => {
            const diff = p.originalPriceSAR - p.lowestPriceSAR;
            return diff > 0 
              ? (isArabic ? `وفر ${formatPrice(diff, currency)} (${Math.round((diff / p.originalPriceSAR) * 100)}%)` : `Save ${formatPrice(diff, currency)} (${Math.round((diff / p.originalPriceSAR) * 100)}%)`)
              : (isArabic ? 'سعر رسمي' : 'MSRP');
          },
          isBest: (p: Phone) => {
            const diffs = selectedPhones.map((x) => x.originalPriceSAR - x.lowestPriceSAR);
            const maxDiff = Math.max(...diffs);
            return maxDiff > 0 && (p.originalPriceSAR - p.lowestPriceSAR) === maxDiff;
          },
          bestBadgeText: isArabic ? 'أكبر خصم وتوفير' : 'Largest Price Cut',
        },
        {
          label: isArabic ? 'عروض المتاجر العالمية المعتمدة 🌐' : 'Verified Global Stores 🌐',
          getter: (p: Phone) => {
            const globals = p.offers.filter((o) => o.isGlobal);
            if (globals.length === 0) return isArabic ? 'متاجر محلية فقط' : 'Local only';
            return `${globals.map((g) => g.storeName.split(' ')[0]).join(' · ')} (${isArabic ? 'شامل الجمارك DDP' : 'DDP Included'})`;
          },
          isBest: (p: Phone) => p.offers.some((o) => o.isGlobal),
          bestBadgeText: isArabic ? 'خيارات استيراد وشحن دولي' : 'Global Import Options',
        },
      ],
    },
  ];

  const filteredGroups = SPEC_GROUPS.filter((g) => {
    if (activeCategory === 'all') return true;
    return g.id === activeCategory;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6" dir={direction}>
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <button onClick={onBackToExplore} className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
              <ArrowRight className={`w-3.5 h-3.5 ${direction === 'rtl' ? '' : 'rotate-180'}`} />
              <span>{isArabic ? 'العودة لكافة الهواتف' : 'Back to explore'}</span>
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 dark:text-white font-bold">
              {isArabic ? 'مقارنة المواصفات التقنية التفصيلية' : 'Detailed Tech Specs Comparison'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{isArabic ? 'جدول المقارنة التقنية التفصيلية' : 'Technical Differences Matrix'}</span>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
              {selectedPhones.length} {isArabic ? 'هواتف' : 'phones'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isArabic 
              ? 'مقارنة حية تركز على المعالج، الكاميرا، البطارية مع تمييز المواصفات الفائزة والأفضل باللون الأخضر.'
              : 'Direct comparison focusing on Processor, Camera, and Battery with top specifications highlighted in green.'}
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Toggle highlight best specs */}
          <button
            onClick={() => setHighlightBestOnly(!highlightBestOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              highlightBestOnly
                ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isArabic ? 'تمييز المواصفات الأفضل' : 'Highlight Best Specs'}</span>
          </button>

          {/* Toggle show differences only */}
          <button
            onClick={() => setShowDifferencesOnly(!showDifferencesOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              showDifferencesOnly
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs font-extrabold'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isArabic ? 'إبراز الاختلافات فقط' : 'Differences Only'}</span>
          </button>

          {/* Share comparison */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? (isArabic ? 'تم نسخ الرابط!' : 'Link Copied!') : (isArabic ? 'مشاركة' : 'Share')}</span>
          </button>

          {/* Add phone slot button if less than 4 */}
          {selectedPhones.length < 4 && availablePhones.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setDevicePickerOpen(!devicePickerOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl transition-all shadow-xs"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{isArabic ? `إضافة هاتف (${selectedPhones.length}/4)` : `Add Phone (${selectedPhones.length}/4)`}</span>
              </button>

              {devicePickerOpen && (
                <div className="absolute end-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-40 animate-in fade-in zoom-in-95">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    {isArabic ? 'اختر هاتفاً لإضافته للمقارنة:' : 'Select a phone to add:'}
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1 mt-1">
                    {availablePhones.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onAddPhone(p);
                          setDevicePickerOpen(false);
                        }}
                        className="w-full text-start p-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-contain bg-slate-100 dark:bg-slate-800 p-0.5" />
                          <div>
                            <span className="block font-bold">{isArabic ? p.nameAr : p.name}</span>
                            <span className="text-[10px] text-slate-400">{formatPrice(p.lowestPriceSAR, currency)}</span>
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 1: QUICK TECHNICAL HIGHLIGHT CARDS (المعالج • الكاميرا • البطارية) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Processor & Performance Duel */}
        {performanceAnalysis && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-slate-800/60 dark:to-slate-900 border border-amber-300/40 dark:border-amber-700/40 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white">
                    {isArabic ? 'مقارنة المعالج وقوة الأداء' : 'Processor & Performance'}
                  </h3>
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold">
                    {isArabic ? 'اختبار AnTuTu والعتاد' : 'AnTuTu & Chipsets'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-emerald-600" />
                <span>{isArabic ? 'المتصدر' : 'Top'}: {isArabic ? performanceAnalysis.winner.nameAr : performanceAnalysis.winner.name}</span>
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {performanceAnalysis.scores.map(({ phone, score, chipset }) => {
                const isWin = phone.id === performanceAnalysis.winner.id;
                const percentage = performanceAnalysis.maxScore > 0 ? Math.round((score / performanceAnalysis.maxScore) * 100) : 50;

                return (
                  <div key={phone.id} className="text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                        {isArabic ? phone.nameAr : phone.name}
                      </span>
                      <span className={`font-mono font-bold ${isWin ? 'text-emerald-700 dark:text-emerald-400 font-black' : 'text-slate-500'}`}>
                        {score > 0 ? `${score.toLocaleString()} pts` : chipset.split(' ')[0]}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWin ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-slate-400 dark:bg-slate-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Card 2: Camera System Face-off */}
        {cameraAnalysis && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-950/40 dark:via-slate-800/60 dark:to-slate-900 border border-rose-300/40 dark:border-rose-700/40 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white">
                    {isArabic ? 'مقارنة الكاميرات والتقريب' : 'Camera & Zoom Face-off'}
                  </h3>
                  <span className="text-[10px] text-rose-800 dark:text-rose-300 font-bold">
                    {isArabic ? 'المستشعر والتقريب البصري' : 'Sensors & Optical Zoom'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-emerald-600" />
                <span>{isArabic ? 'المتصدر' : 'Top'}: {isArabic ? cameraAnalysis.winner.nameAr : cameraAnalysis.winner.name}</span>
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {cameraAnalysis.specs.map(({ phone, mainMP, teleZoom }) => {
                const isWin = phone.id === cameraAnalysis.winner.id;
                return (
                  <div key={phone.id} className="p-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[130px]">
                        {isArabic ? phone.nameAr : phone.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {mainMP}MP • {teleZoom > 0 ? `${teleZoom}x ${isArabic ? 'تقريب' : 'Zoom'}` : (isArabic ? 'تقريب رقمي' : 'Digital Zoom')}
                      </span>
                    </div>
                    {isWin && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {isArabic ? 'المنظومة الأقوى' : 'Best Optics'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Card 3: Battery & Charging Clash */}
        {batteryAnalysis && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:via-slate-800/60 dark:to-slate-900 border border-emerald-300/40 dark:border-emerald-700/40 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Battery className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white">
                    {isArabic ? 'مقارنة البطارية وسرعة الشحن' : 'Battery & Fast Charging'}
                  </h3>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">
                    {isArabic ? 'السعة وسرعة الواط W' : 'Capacity mAh & Watts'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>{batteryAnalysis.maxWatts}W {isArabic ? 'أقصى سرعة' : 'Max Watts'}</span>
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {batteryAnalysis.specs.map(({ phone, capacity, watts }) => {
                const isCapWin = phone.id === batteryAnalysis.capacityWinner.id;
                const isWattWin = phone.id === batteryAnalysis.chargingWinner.id;

                return (
                  <div key={phone.id} className="p-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[130px]">
                        {isArabic ? phone.nameAr : phone.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {capacity} mAh • {watts}W {isArabic ? 'سلكي' : 'Wired'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isCapWin && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          {isArabic ? 'الأكبر سعة' : 'Max mAh'}
                        </span>
                      )}
                      {isWattWin && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {isArabic ? 'الأسرع شحناً' : 'Fastest'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: CATEGORY FILTER TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeCategory === 'all'
              ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          {isArabic ? 'كافة المواصفات (شامل)' : 'All Specs (Full)'}
        </button>

        <button
          onClick={() => setActiveCategory('performance')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeCategory === 'performance'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>{isArabic ? 'المعالج والأداء' : 'Processor & Chipset'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('camera')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeCategory === 'camera'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-rose-500" />
          <span>{isArabic ? 'الكاميرات والتصوير' : 'Cameras & Video'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('battery')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeCategory === 'battery'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Battery className="w-3.5 h-3.5 text-emerald-500" />
          <span>{isArabic ? 'البطارية والشحن' : 'Battery & Power'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('screen')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeCategory === 'screen'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-sky-500" />
          <span>{isArabic ? 'الشاشة والعرض' : 'Display'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('body')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeCategory === 'body'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>{isArabic ? 'الهيكل والمتانة' : 'Build & Body'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('price')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeCategory === 'price'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
          <span>{isArabic ? 'الأسعار والمتاجر' : 'Prices & Deals'}</span>
        </button>
      </div>

      {/* SECTION 3: SIDE-BY-SIDE MATRIX TABLE WITH BEST SPEC HIGHLIGHTING */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full border-collapse min-w-[700px]">
          {/* Table Header: Devices Cards */}
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90">
              <th className="p-4 text-start text-xs font-extrabold text-slate-500 dark:text-slate-400 w-48 sm:w-60 sticky start-0 bg-slate-50/95 dark:bg-slate-900/95 z-20 border-e border-slate-200 dark:border-slate-800 backdrop-blur-md">
                <div className="space-y-1">
                  <span className="block text-slate-900 dark:text-white font-black text-sm">
                    {isArabic ? 'المواصفة التقنية' : 'Specification'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {highlightBestOnly 
                      ? (isArabic ? '✨ الأخضر = المواصفة الأفضل' : '✨ Green = Best Spec') 
                      : (isArabic ? 'مقارنة مباشرة' : 'Direct Matrix')}
                  </span>
                </div>
              </th>

              {selectedPhones.map((phone) => (
                <th key={phone.id} className="p-4 text-center align-top min-w-[220px] max-w-[280px]">
                  <div className="relative flex flex-col items-center">
                    {/* Remove button */}
                    <button
                      onClick={() => onRemovePhone(phone.id)}
                      title={isArabic ? 'إزالة من المقارنة' : 'Remove from compare'}
                      className="absolute -top-1 start-0 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Phone Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 p-2 mb-2.5 flex items-center justify-center overflow-hidden border border-slate-200/70 dark:border-slate-700/70">
                      <img
                        src={phone.image}
                        alt={phone.name}
                        className="w-full h-full object-contain hover:scale-105 transition-transform"
                      />
                    </div>

                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      {phone.brand}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                      {isArabic ? phone.nameAr : phone.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium mb-2.5">
                      {isArabic ? phone.name : phone.nameAr}
                    </p>

                    {/* Price banner */}
                    <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-800/60 rounded-xl py-1.5 px-3 w-full mb-2.5">
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        {isArabic ? 'أقل سعر اليوم' : 'Lowest Price'}
                      </span>
                      <span className="text-sm sm:text-base font-black text-slate-950 dark:text-amber-400">
                        {formatPrice(phone.lowestPriceSAR, currency)}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectPhoneForDetails(phone.id)}
                      className="w-full py-2 px-3 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'عرض تفاصيل ومتاجر' : 'Store Details'}</span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body: Spec Groups */}
          <tbody>
            {filteredGroups.map((group, groupIndex) => {
              // Filter rows if "show differences only" is enabled
              const rowsToDisplay = group.rows.filter((row) => {
                if (!showDifferencesOnly) return true;
                return isRowDifferent(row.getter);
              });

              if (rowsToDisplay.length === 0) return null;

              return (
                <React.Fragment key={group.id}>
                  {/* Category Title Header Bar */}
                  <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-y border-slate-200 dark:border-slate-700/80">
                    <td
                      colSpan={selectedPhones.length + 1}
                      className="py-2.5 px-4 text-xs font-black text-slate-800 dark:text-slate-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {group.icon}
                          <span>{group.title}</span>
                        </div>
                        {group.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {group.badge}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Spec Rows */}
                  {rowsToDisplay.map((row, rowIndex) => {
                    const isDiff = isRowDifferent(row.getter);

                    return (
                      <tr
                        key={rowIndex}
                        className={`border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${
                          isDiff ? 'bg-amber-50/15 dark:bg-amber-950/10' : ''
                        }`}
                      >
                        {/* Spec Name Column (Sticky) */}
                        <td className="p-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 sticky start-0 bg-white dark:bg-slate-900 z-10 border-e border-slate-200 dark:border-slate-800 shadow-2xs">
                          <div className="flex items-center justify-between gap-2">
                            <span>{row.label}</span>
                            {isDiff && (
                              <span className="text-[9px] text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-300/40 px-1.5 py-0.2 rounded font-black shrink-0">
                                {isArabic ? 'فارق' : 'Diff'}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Device Values */}
                        {selectedPhones.map((phone) => {
                          const value = row.getter(phone);
                          const isHighlightedBest = highlightBestOnly && row.isBest ? row.isBest(phone) : false;

                          return (
                            <td
                              key={phone.id}
                              className={`p-3.5 text-xs text-center align-middle transition-colors ${
                                isHighlightedBest
                                  ? 'bg-emerald-500/10 dark:bg-emerald-500/20 font-bold text-emerald-950 dark:text-emerald-200 border-x-2 border-emerald-500/40'
                                  : 'text-slate-800 dark:text-slate-200 font-medium'
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center gap-1">
                                {isHighlightedBest && (
                                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-black border border-emerald-500/40 shadow-2xs animate-in zoom-in-95">
                                    <Trophy className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    <span>{row.bestBadgeText || (isArabic ? 'الأفضل' : 'Best')}</span>
                                  </div>
                                )}
                                <span className={isHighlightedBest ? 'font-black text-slate-950 dark:text-white' : ''}>
                                  {value}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
