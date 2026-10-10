import React, { useState, useEffect, useRef } from 'react';
import { 
  ScanBarcode, 
  Camera, 
  Upload, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Scale, 
  RotateCcw, 
  FlipHorizontal, 
  Zap, 
  Tag, 
  Search, 
  Store 
} from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Phone, CurrencyCode } from '../types/phone';
import { PHONES_DATA } from '../data/phonesData';
import { formatPrice } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onSelectPhone: (phoneId: string) => void;
  onAddToCompare: (phone: Phone) => void;
  onSearchPhone?: (query: string) => void;
}

// Sample phone packaging barcode data for instant interactive testing
const SAMPLE_BOX_BARCODES = [
  {
    phoneId: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    nameAr: 'آيفون 16 برو ماكس',
    brand: 'Apple',
    barcode: '0195949826354',
    sku: 'MYWH3LL/A',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80',
    colorNameAr: 'تيتانيوم صحراوي',
    colorNameEn: 'Desert Titanium'
  },
  {
    phoneId: 'samsung-galaxy-s25-ultra',
    name: 'Galaxy S25 Ultra',
    nameAr: 'سامسونج S25 ألترا',
    brand: 'Samsung',
    barcode: '8806095384112',
    sku: 'SM-S938B/DS',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=300&q=80',
    colorNameAr: 'تيتانيوم فضي أزرق',
    colorNameEn: 'Titanium Silver Blue'
  },
  {
    phoneId: 'google-pixel-9-pro-xl',
    name: 'Pixel 9 Pro XL',
    nameAr: 'جوجل بكسل 9 برو XL',
    brand: 'Google',
    barcode: '0840244709846',
    sku: 'GA05268-US',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80',
    colorNameAr: 'البورسلين الأبيض',
    colorNameEn: 'Porcelain White'
  },
  {
    phoneId: 'xiaomi-15-pro',
    name: 'Xiaomi 15 Pro',
    nameAr: 'شاومي 15 برو',
    brand: 'Xiaomi',
    barcode: '6941812792810',
    sku: '24101PNB7C',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=300&q=80',
    colorNameAr: 'فضي سائل',
    colorNameEn: 'Liquid Silver'
  },
  {
    phoneId: 'samsung-galaxy-a55',
    name: 'Galaxy A55 5G',
    nameAr: 'سامسونج A55 5G',
    brand: 'Samsung',
    barcode: '8806095064564',
    sku: 'SM-A556B/DS',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=300&q=80',
    colorNameAr: 'أزرق ثلجي',
    colorNameEn: 'Awesome Iceblue'
  },
  {
    phoneId: 'poco-f6-pro',
    name: 'POCO F6 Pro',
    nameAr: 'بوكو F6 برو',
    brand: 'Xiaomi',
    barcode: '6941812763285',
    sku: '23113RKC6G',
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=300&q=80',
    colorNameAr: 'أسود كربون',
    colorNameEn: 'Carbon Black'
  }
];

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  currency,
  onSelectPhone,
  onAddToCompare,
  onSearchPhone
}) => {
  const { isArabic, direction, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'demo'>('camera');
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [matchedPhone, setMatchedPhone] = useState<Phone | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isFileScanning, setIsFileScanning] = useState(false);
  const [addedToCompareAlert, setAddedToCompareAlert] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'barcode-reader-viewfinder';

  // Sound feedback on successful barcode detect
  const playSuccessSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(784, ctx.currentTime); // G5
      osc.frequency.exponentialRampToValueAtTime(1174, ctx.currentTime + 0.08); // D6
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);

      if (navigator.vibrate) {
        navigator.vibrate([40, 30, 80]);
      }
    } catch {
      // Audio or vibration unavailable
    }
  };

  // Find phone by barcode, SKU, UPC or partial model
  const findPhoneByScannedCode = (code: string): Phone | null => {
    const cleanCode = code.trim().toLowerCase();
    if (!cleanCode) return null;

    // 1. Exact match on barcode or barcodeUpc
    let found = PHONES_DATA.find((p) => {
      const b = (p.barcode || '').toLowerCase();
      const upc = (p.barcodeUpc || '').toLowerCase();
      const sku = (p.boxSku || '').toLowerCase();
      const extraBarcodes = (p.barcodes || []).map((x) => x.toLowerCase());

      return (
        b === cleanCode ||
        upc === cleanCode ||
        sku === cleanCode ||
        extraBarcodes.includes(cleanCode)
      );
    });

    if (found) return found;

    // 2. Partial match if code is part of barcode or boxSku
    found = PHONES_DATA.find((p) => {
      const b = (p.barcode || '').toLowerCase();
      const sku = (p.boxSku || '').toLowerCase();
      return (
        (b.length > 5 && (cleanCode.includes(b) || b.includes(cleanCode))) ||
        (sku.length > 3 && (cleanCode.includes(sku) || sku.includes(cleanCode)))
      );
    });

    if (found) return found;

    // 3. Name or model match if barcode text contains phone title
    found = PHONES_DATA.find((p) => {
      const name = p.name.toLowerCase();
      const nameAr = p.nameAr.toLowerCase();
      return cleanCode.includes(name) || cleanCode.includes(nameAr);
    });

    return found || null;
  };

  // Handle successful detection
  const handleBarcodeDecoded = (decodedText: string) => {
    playSuccessSound();
    setScannedCode(decodedText);
    const phone = findPhoneByScannedCode(decodedText);
    setMatchedPhone(phone);
    stopCamera();
  };

  // Stop camera stream safely
  const stopCamera = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      } finally {
        setIsScanning(false);
      }
    }
  };

  // Start camera stream
  const startCamera = async () => {
    if (!isOpen || activeTab !== 'camera' || matchedPhone) return;

    setCameraError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.DATA_MATRIX
          ],
          verbose: false
        });
      }

      // Check available cameras
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setCameras(devices.map((d) => ({ id: d.id, label: d.label || `Camera ${d.id}` })));
        }
      } catch {
        // Device enumeration fallback
      }

      const cameraConfig = selectedCameraId
        ? { deviceId: { exact: selectedCameraId } }
        : { facingMode: facingMode };

      await scannerRef.current.start(
        cameraConfig,
        {
          fps: 15,
          qrbox: { width: 280, height: 160 },
          aspectRatio: 1.333334
        },
        (decodedText) => {
          handleBarcodeDecoded(decodedText);
        },
        () => {
          // Frame without detected barcode
        }
      );
      setIsScanning(true);
    } catch (err: unknown) {
      console.error('Camera start error:', err);
      setIsScanning(false);
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('NotAllowedError') || errMsg.includes('Permission')) {
        setCameraError(
          isArabic
            ? 'لم يتم منح إذن الوصول إلى الكاميرا. يرجى السماح بالوصول في متصفحك أو استخدام خيار "رفع صورة للغلاف" أو "النماذج التجريبية".'
            : 'Camera permission denied. Please allow camera access in your browser or use "Upload Box Photo" or "Demo Boxes".'
        );
      } else {
        setCameraError(
          isArabic
            ? 'تعذر فتح الكاميرا في جهازك حالياً. يمكنك تجربة رفع صورة لغلاف الهاتف أو استخدام النماذج التجريبية.'
            : 'Could not access the camera. You can upload an image of the box barcode or try the demo boxes.'
        );
      }
    }
  };

  // File upload barcode scanning
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsFileScanning(true);
    setCameraError(null);
    try {
      const html5QrCode = new Html5Qrcode('file-scanner-temp');
      const decodedText = await html5QrCode.scanFile(file, true);
      handleBarcodeDecoded(decodedText);
    } catch (err) {
      console.error('File scan error:', err);
      setCameraError(
        isArabic
          ? 'لم نتمكن من العثور على باركود واضح في هذه الصورة. يرجى التأكد من وضوح خطوط الباركود على الغلاف وإعادة المحاولة.'
          : 'Could not detect a clear barcode in this photo. Please make sure the barcode lines on the box are sharp and try again.'
      );
    } finally {
      setIsFileScanning(false);
    }
  };

  // Switch camera front/back
  const toggleFacingMode = async () => {
    await stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Trigger demo barcode
  const handleSelectDemoBarcode = (item: (typeof SAMPLE_BOX_BARCODES)[0]) => {
    handleBarcodeDecoded(item.barcode);
  };

  // Reset and scan again
  const handleResetScanner = () => {
    setScannedCode(null);
    setMatchedPhone(null);
    setCameraError(null);
    setAddedToCompareAlert(false);
    if (activeTab === 'camera') {
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  };

  // Handle open phone details
  const handleOpenPhoneDetails = () => {
    if (!matchedPhone) return;
    onSelectPhone(matchedPhone.id);
    onClose();
  };

  // Handle add to comparison
  const handleAddToComparison = () => {
    if (!matchedPhone) return;
    onAddToCompare(matchedPhone);
    setAddedToCompareAlert(true);
    setTimeout(() => setAddedToCompareAlert(false), 3000);
  };

  // Handle search by barcode if not matched
  const handleSearchCode = () => {
    if (!scannedCode) return;
    if (onSearchPhone) {
      onSearchPhone(scannedCode);
    }
    onClose();
  };

  // Lifecycle when modal opens/closes
  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !matchedPhone) {
      const timer = setTimeout(() => {
        startCamera();
      }, 250);
      return () => clearTimeout(timer);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode, selectedCameraId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        dir={direction}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
              <ScanBarcode className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                {t.barcodeModalTitle}
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  {isArabic ? 'كاميرا حية' : 'Live Camera'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t.barcodeModalSub}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={isArabic ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs (only visible when not showing a matched result) */}
        {!matchedPhone && (
          <div className="flex items-center gap-2 px-5 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900">
            <button
              onClick={() => {
                setActiveTab('camera');
                setCameraError(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'camera'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t.liveCamera}</span>
            </button>

            <button
              onClick={() => {
                stopCamera();
                setActiveTab('upload');
                setCameraError(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'upload'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t.uploadImage}</span>
            </button>

            <button
              onClick={() => {
                stopCamera();
                setActiveTab('demo');
                setCameraError(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'demo'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t.demoBoxes}</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* STATE 1: MATCHED PHONE DETECTED! */}
          {matchedPhone ? (
            <div className="space-y-5 animate-in zoom-in-95 duration-200">
              {/* Success Badge */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-emerald-900 dark:text-emerald-200">
                      {t.barcodeSuccess}
                    </h4>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                      {t.barcodeDetected} <span className="font-mono font-bold tracking-wider">{scannedCode}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetScanner}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 border border-emerald-500/30 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  {t.barcodeScanAnother}
                </button>
              </div>

              {/* Phone Card Preview */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-xl bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
                  <img
                    src={matchedPhone.image}
                    alt={matchedPhone.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-1 right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-2xs">
                    {matchedPhone.brand}
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-start space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {isArabic ? `إصدار ${matchedPhone.releaseYear}` : `Year ${matchedPhone.releaseYear}`}
                    </span>
                    {matchedPhone.boxSku && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                        SKU: {matchedPhone.boxSku}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {isArabic ? matchedPhone.nameAr : matchedPhone.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {matchedPhone.name} • {t.storage} {matchedPhone.baseStorage} • {t.ram} {matchedPhone.baseRam}
                  </p>

                  {/* Lowest Price Banner */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="bg-white dark:bg-slate-800 border border-amber-400/40 rounded-xl px-3 py-1.5 inline-flex items-center gap-2 shadow-2xs">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                        {t.lowestPriceToday}
                      </span>
                      <span className="text-base font-black text-amber-600 dark:text-amber-400">
                        {formatPrice(matchedPhone.lowestPriceSAR, currency)}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isArabic 
                        ? `متوفر في ${matchedPhone.offers.length} متاجر موثوقة`
                        : `Available in ${matchedPhone.offers.length} verified stores`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Store Offers Fast Peek */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-amber-500" />
                  {isArabic ? 'مقارنة الأسعار السريعة في المتاجر:' : 'Quick Store Prices Comparison:'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {matchedPhone.offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-center space-y-1 shadow-2xs"
                    >
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                        {offer.storeName}
                      </div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        {formatPrice(offer.priceSAR, currency)}
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        offer.inStock 
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {offer.inStock ? t.inStock : t.outOfStock}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback toast for add to compare */}
              {addedToCompareAlert && (
                <div className="p-3 rounded-xl bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  {isArabic
                    ? `تمت إضافة ${matchedPhone.nameAr} إلى قائمة المقارنة بنجاح!`
                    : `Added ${matchedPhone.name} to comparison matrix!`}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleOpenPhoneDetails}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t.barcodeOpenDetails}</span>
                </button>

                <button
                  onClick={handleAddToComparison}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <Scale className="w-4 h-4 text-amber-500" />
                  <span>{t.barcodeCompareThis}</span>
                </button>
              </div>
            </div>
          ) : scannedCode && !matchedPhone ? (
            /* STATE 2: BARCODE SCANNED BUT NOT IN CATALOG */
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isArabic ? 'تم قراءة الباركود بنجاح: ' : 'Barcode read successfully: '}
                  <span className="font-mono text-amber-600 dark:text-amber-400">{scannedCode}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {isArabic
                    ? 'لم نتمكن من مطابقة هذا الرمز المحدد مباشرة مع الهواتف الحالية في الكتالوج. يمكنك البحث عنه أو مسح غلاف هاتف آخر.'
                    : 'This specific barcode could not be directly matched to our current catalog. You can search by it or scan another box.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleSearchCode}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xs hover:bg-amber-400 transition-all"
                >
                  <Search className="w-4 h-4" />
                  {isArabic ? 'البحث في الموقع بهذا الرمز' : 'Search Website with Code'}
                </button>

                <button
                  onClick={handleResetScanner}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  {isArabic ? 'إعادة المحاولة' : 'Try Again'}
                </button>
              </div>
            </div>
          ) : activeTab === 'camera' ? (
            /* STATE 3: LIVE CAMERA SCANNER VIEW */
            <div className="space-y-4">
              {cameraError ? (
                <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    {isArabic ? 'تعذر تشغيل الكاميرا' : 'Camera Unavailable'}
                  </div>
                  <p className="max-w-md mx-auto leading-relaxed">{cameraError}</p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-rose-400/40 font-bold text-xs hover:bg-slate-50"
                    >
                      {t.uploadImage}
                    </button>
                    <button
                      onClick={() => setActiveTab('demo')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                    >
                      {t.demoBoxes}
                    </button>
                    <button
                      onClick={startCamera}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
                    >
                      {isArabic ? 'إعادة المحاولة' : 'Retry'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner flex flex-col items-center justify-center min-h-[300px]">
                  {/* html5-qrcode target container */}
                  <div
                    id={scannerContainerId}
                    className="w-full h-full min-h-[290px] max-h-[360px]"
                  />

                  {/* Scanning HUD Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4">
                    {/* Top status tag */}
                    <div className="bg-slate-950/80 backdrop-blur-md text-amber-400 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-500/40 flex items-center gap-2 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>
                        {isArabic ? 'وجّه الكاميرا نحو باركود علبة الهاتف' : 'Point camera at phone box barcode'}
                      </span>
                    </div>

                    {/* Viewfinder Target Frame */}
                    <div className="relative w-64 sm:w-72 h-36 rounded-2xl border-2 border-amber-400/50 shadow-2xl flex items-center justify-center overflow-hidden">
                      {/* Corner Bracket Accents */}
                      <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                      <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />
                      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />

                      {/* Animated Laser Beam */}
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-bounce" />
                    </div>

                    {/* Bottom controls on live camera */}
                    <div className="pointer-events-auto flex items-center gap-2">
                      <button
                        onClick={toggleFacingMode}
                        className="bg-slate-900/80 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-700/80 flex items-center gap-1.5 transition-colors"
                        title={isArabic ? 'تبديل الكاميرا الخلفية / الأمامية' : 'Switch front/back camera'}
                      >
                        <FlipHorizontal className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          {isArabic
                            ? `قلب الكاميرا (${facingMode === 'environment' ? 'خلفية' : 'أمامية'})`
                            : `Flip Camera (${facingMode === 'environment' ? 'Rear' : 'Front'})`}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions below scanner */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-400">
                <Tag className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white">
                    {isArabic ? 'نصيحة للمسح الدقيق:' : 'Scanning tip:'}
                  </strong>{' '}
                  {isArabic
                    ? 'يتواجد الباركود عادة على الجزء الخلفي أو السفلي من كرتونة الهاتف بجانب رقم الموديل وسعة الذاكرة (رمز EAN أو UPC المكون من 12-13 رقم).'
                    : 'The barcode is usually on the back or bottom of the phone packaging box near the model number and storage capacity (12-13 digit EAN or UPC).'}
                </div>
              </div>
            </div>
          ) : activeTab === 'upload' ? (
            /* STATE 4: IMAGE FILE UPLOAD */
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-50 dark:bg-slate-800/40 hover:bg-amber-50/30 transition-all text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {isArabic ? 'اختر صورة أو التقط صورة لغلاف الهاتف' : 'Choose or capture a photo of the phone box'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    PNG, JPG, WEBP {isArabic ? 'حتى 10 ميجابايت' : 'up to 10MB'}
                  </p>
                </div>
                <span className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-xs hover:bg-amber-400 transition-colors">
                  {isFileScanning 
                    ? (isArabic ? 'جاري فحص الصورة...' : 'Analyzing photo...') 
                    : (isArabic ? 'استعراض الصورة من الجهاز' : 'Browse Photo From Device')}
                </span>
              </label>

              {/* Hidden container for file scan engine */}
              <div id="file-scanner-temp" className="hidden" />

              {cameraError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>
          ) : (
            /* STATE 5: DEMO INTERACTIVE PHONE BOXES */
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300/40 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                    {isArabic
                      ? 'انقر على أي علبة أدناه لتجربة المسح الفوري فوراً دون الحاجة لعلبة حقيقية:'
                      : 'Click any phone box below for instant simulated scanning:'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_BOX_BARCODES.map((item) => (
                  <button
                    key={item.phoneId}
                    onClick={() => handleSelectDemoBarcode(item)}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all text-start flex items-center gap-3.5 group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700/50 p-1.5 shrink-0 flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {item.brand}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                          {item.sku}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {isArabic ? item.nameAr : item.name}
                      </h4>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <ScanBarcode className="w-3 h-3 text-amber-500" />
                        <span>EAN: {item.barcode}</span>
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <Zap className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with quick tip */}
        <div className="px-5 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ScanBarcode className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {isArabic 
                ? 'يدعم معايير: EAN-13 • UPC-A • Code 128 • QR Code'
                : 'Supports standards: EAN-13 • UPC-A • Code 128 • QR Code'}
            </span>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
