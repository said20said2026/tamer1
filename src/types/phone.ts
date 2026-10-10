export type CurrencyCode = 'SAR' | 'AED' | 'USD' | 'EGP' | 'KWD' | 'QAR' | 'DZD' | 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateAgainstSAR: number; // 1 SAR = X other currency
  decimals: number;
}

export interface StoreOffer {
  id: string;
  storeName: string;
  storeNameEn?: string;
  storeLogoText: string;
  storeColor: string;
  priceSAR: number;
  originalPriceSAR: number;
  url: string;
  inStock: boolean;
  stockNote?: string;
  shipping: string;
  warranty: string;
  rating: number;
  reviewsCount: number;
  deliveryDays: string;
  // Global / International Store properties
  isGlobal?: boolean;
  storeType?: 'local' | 'global';
  countryOrigin?: string; // e.g. "الولايات المتحدة 🇺🇸" or "متجر عالمي 🌐"
  customsDutyIncluded?: boolean; // هل السعر شامل الجمارك والضريبة المضافة
  shippingCostSAR?: number; // 0 = شحن مجاني
  versionNote?: string; // e.g. "النسخة العالمية (Global Version)"
}

export interface StorageVariant {
  storage: string;
  ram: string;
  priceModifierSAR: number; // added to base price
}

export interface PriceHistoryPoint {
  date: string;
  priceSAR: number;
  storeName: string;
}

export interface UsedOffer {
  id: string;
  storeName: string;
  storeLogoText: string;
  storeColor: string;
  condition: 'refurbished' | 'used';
  conditionGrade: 'like_new' | 'excellent' | 'good';
  conditionLabelAr: string; // e.g. "مجدد معتمد - ممتاز (Grade A)" أو "مستعمل - كالجديد"
  priceSAR: number;
  originalNewPriceSAR: number;
  savingsPercent: number; // e.g. 25
  warrantyText: string; // e.g. "ضمان 12 شهر معتمد" أو "ضمان 3 أشهر"
  inspectionPoints: number; // e.g. 50 نقطة فحص فني
  batteryHealth: string; // e.g. "95% - 100%"
  includesAccessories: string; // e.g. "شاحن وكابل أصلي مع العلبة"
  returnPolicy: string; // e.g. "إرجاع مجاني خلال 14 يوم"
  url: string;
}

export interface Phone {
  id: string;
  name: string;
  nameAr: string;
  brand: 'Apple' | 'Samsung' | 'Xiaomi' | 'Google' | 'OnePlus' | 'Honor' | 'Nothing' | 'Realme';
  releaseYear: number;
  releaseDateText: string;
  rating: number;
  ratingCount: number;
  image: string;
  colors: { name: string; hex: string }[];
  variants: StorageVariant[];
  baseStorage: string;
  baseRam: string;
  lowestPriceSAR: number;
  originalPriceSAR: number;
  
  // Barcode & Retail Packaging
  barcode?: string;
  barcodeUpc?: string;
  boxSku?: string;
  barcodes?: string[];

  // Refurbished & Used Market properties
  hasRefurbished?: boolean;
  hasUsed?: boolean;
  lowestRefurbishedPriceSAR?: number;
  lowestUsedPriceSAR?: number;
  usedOffers?: UsedOffer[];
  
  // Specifications
  specs: {
    screen: {
      size: string;
      panel: string;
      resolution: string;
      refreshRate: string;
      peakBrightness: string;
      protection: string;
    };
    performance: {
      chipset: string;
      cpu: string;
      gpu: string;
      antutuScore?: string;
    };
    camera: {
      main: string;
      ultrawide: string;
      telephoto?: string;
      selfie: string;
      video: string;
      features: string[];
    };
    battery: {
      capacity: string;
      wiredCharging: string;
      wirelessCharging?: string;
      batteryLifeScore: string;
    };
    body: {
      dimensions: string;
      weight: string;
      waterResistance: string;
      materials: string;
    };
    connectivity: {
      has5G: boolean;
      sim: string;
      wifi: string;
      bluetooth: string;
      nfc: boolean;
    };
    os: string;
  };
  
  pros: string[];
  cons: string[];
  offers: StoreOffer[];
  priceHistory: PriceHistoryPoint[];
  tags?: ('best_seller' | 'biggest_drop' | 'flagship' | 'value_king' | 'new_arrival')[];
}

export interface FilterState {
  search: string;
  brand: string;
  priceMin: number;
  priceMax: number;
  storage: string[];
  ram: string[];
  has5G: boolean | null;
  minScreenHz: number | null;
  minBattery: number | null;
  minCameraMP: number | null;
  minChargingWatt: number | null;
  waterResistantOnly: boolean;
  condition: 'all' | 'new_only' | 'refurbished' | 'used';
  storeOriginFilter?: 'all' | 'local_only' | 'global_only';
  sortBy: 'price_asc' | 'price_desc' | 'discount_desc' | 'rating_desc' | 'release_desc';
  categoryTag?: string;
}

export interface PriceAlert {
  id: string;
  phoneId: string;
  phoneName: string;
  phoneImage: string;
  targetPriceSAR: number;
  currentPriceSAR: number;
  email: string;
  createdAt: string;
}
