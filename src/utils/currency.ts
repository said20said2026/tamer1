import { CurrencyCode, CurrencyConfig } from '../types/phone';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  SAR: {
    code: 'SAR',
    symbol: 'ر.س',
    name: 'ريال سعودي',
    rateAgainstSAR: 1,
    decimals: 0,
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'درهم إماراتي',
    rateAgainstSAR: 0.98,
    decimals: 0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'دولار أمريكي',
    rateAgainstSAR: 0.267,
    decimals: 0,
  },
  EGP: {
    code: 'EGP',
    symbol: 'ج.م',
    name: 'جنيه مصري',
    rateAgainstSAR: 13.1,
    decimals: 0,
  },
  KWD: {
    code: 'KWD',
    symbol: 'د.ك',
    name: 'دينار كويتي',
    rateAgainstSAR: 0.082,
    decimals: 2,
  },
  QAR: {
    code: 'QAR',
    symbol: 'ر.ق',
    name: 'ريال قطري',
    rateAgainstSAR: 0.97,
    decimals: 0,
  },
  DZD: {
    code: 'DZD',
    symbol: 'د.ج',
    name: 'دينار جزائري',
    rateAgainstSAR: 35.8,
    decimals: 0,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'يورو أوروبي',
    rateAgainstSAR: 0.248,
    decimals: 0,
  },
};

export function convertSAR(amountSAR: number, targetCurrency: CurrencyCode): number {
  const config = CURRENCIES[targetCurrency];
  if (!config) return amountSAR;
  return amountSAR * config.rateAgainstSAR;
}

export function formatPrice(
  amountSAR: number,
  currency: CurrencyCode = 'SAR',
  includeSymbol: boolean = true
): string {
  const config = CURRENCIES[currency] || CURRENCIES.SAR;
  const converted = convertSAR(amountSAR, currency);
  
  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: config.decimals,
    minimumFractionDigits: config.decimals,
  }).format(converted);

  if (!includeSymbol) return formattedNumber;
  return `${formattedNumber} ${config.symbol}`;
}

export function calculateDiscount(originalSAR: number, currentSAR: number): number {
  if (!originalSAR || originalSAR <= currentSAR) return 0;
  return Math.round(((originalSAR - currentSAR) / originalSAR) * 100);
}
