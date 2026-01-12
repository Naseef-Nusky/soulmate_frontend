// Currency conversion rates (base: GBP)
// You can update these rates from an API or your backend
const EXCHANGE_RATES = {
  USD: 1.266,  // 1 / 0.79 (converted from USD base)
  EUR: 1.165,  // 0.92 / 0.79
  GBP: 1.0,
  INR: 105.1,  // 83.0 / 0.79
  CAD: 1.722,  // 1.36 / 0.79
  AUD: 1.924,  // 1.52 / 0.79
  JPY: 188.6,  // 149.0 / 0.79
  CNY: 9.165,  // 7.24 / 0.79
  AED: 4.646,  // 3.67 / 0.79
  SAR: 4.747,  // 3.75 / 0.79
  SGD: 1.696,  // 1.34 / 0.79
  MYR: 5.962,  // 4.71 / 0.79
  THB: 45.32,  // 35.8 / 0.79
  IDR: 19873,  // 15700 / 0.79
  PHP: 70.25,  // 55.5 / 0.79
  VND: 31013,  // 24500 / 0.79
  KRW: 1671,   // 1320 / 0.79
  NZD: 2.101,  // 1.66 / 0.79
  CHF: 1.114,  // 0.88 / 0.79
  SEK: 13.54,  // 10.7 / 0.79
  NOK: 13.67,  // 10.8 / 0.79
  DKK: 8.696,  // 6.87 / 0.79
  PLN: 5.063,  // 4.0 / 0.79
  HUF: 455.7,  // 360 / 0.79
  CZK: 28.48,  // 22.5 / 0.79
  RON: 5.797,  // 4.58 / 0.79
  BGN: 2.278,  // 1.80 / 0.79
  HRK: 8.797,  // 6.95 / 0.79
  TRY: 40.51,  // 32.0 / 0.79
  ZAR: 23.42,  // 18.5 / 0.79
  BRL: 6.266,  // 4.95 / 0.79
  MXN: 21.52,  // 17.0 / 0.79
  ARS: 443.0,  // 350 / 0.79
  CLP: 1165,   // 920 / 0.79
  COP: 5187,   // 4100 / 0.79
  PEN: 4.684,  // 3.70 / 0.79
  LKR: 386.1,  // 305.0 / 0.79
};

const BASE_CURRENCY = 'GBP';

// Base prices in GBP (match Stripe products)
const BASE_TRIAL_PRICE = 0.99;      // GuruLink 7-Day Trial
const BASE_MONTHLY_PRICE = 14.99;  // GuruLink Monthly Plan
const BASE_TOTAL_PRICE = 15.0;     // Reference list price before discount

// Currency symbols and formatting
const CURRENCY_INFO = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
  INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  CAD: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' },
  JPY: { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  CNY: { symbol: '¥', code: 'CNY', name: 'Chinese Yuan' },
  AED: { symbol: 'د.إ', code: 'AED', name: 'UAE Dirham' },
  SAR: { symbol: 'ر.س', code: 'SAR', name: 'Saudi Riyal' },
  SGD: { symbol: 'S$', code: 'SGD', name: 'Singapore Dollar' },
  MYR: { symbol: 'RM', code: 'MYR', name: 'Malaysian Ringgit' },
  THB: { symbol: '฿', code: 'THB', name: 'Thai Baht' },
  IDR: { symbol: 'Rp', code: 'IDR', name: 'Indonesian Rupiah' },
  PHP: { symbol: '₱', code: 'PHP', name: 'Philippine Peso' },
  VND: { symbol: '₫', code: 'VND', name: 'Vietnamese Dong' },
  KRW: { symbol: '₩', code: 'KRW', name: 'South Korean Won' },
  NZD: { symbol: 'NZ$', code: 'NZD', name: 'New Zealand Dollar' },
  CHF: { symbol: 'CHF', code: 'CHF', name: 'Swiss Franc' },
  SEK: { symbol: 'kr', code: 'SEK', name: 'Swedish Krona' },
  NOK: { symbol: 'kr', code: 'NOK', name: 'Norwegian Krone' },
  DKK: { symbol: 'kr', code: 'DKK', name: 'Danish Krone' },
  PLN: { symbol: 'zł', code: 'PLN', name: 'Polish Zloty' },
  HUF: { symbol: 'Ft', code: 'HUF', name: 'Hungarian Forint' },
  CZK: { symbol: 'Kč', code: 'CZK', name: 'Czech Koruna' },
  RON: { symbol: 'lei', code: 'RON', name: 'Romanian Leu' },
  BGN: { symbol: 'лв', code: 'BGN', name: 'Bulgarian Lev' },
  HRK: { symbol: 'kn', code: 'HRK', name: 'Croatian Kuna' },
  TRY: { symbol: '₺', code: 'TRY', name: 'Turkish Lira' },
  ZAR: { symbol: 'R', code: 'ZAR', name: 'South African Rand' },
  BRL: { symbol: 'R$', code: 'BRL', name: 'Brazilian Real' },
  MXN: { symbol: '$', code: 'MXN', name: 'Mexican Peso' },
  ARS: { symbol: '$', code: 'ARS', name: 'Argentine Peso' },
  CLP: { symbol: '$', code: 'CLP', name: 'Chilean Peso' },
  COP: { symbol: '$', code: 'COP', name: 'Colombian Peso' },
  PEN: { symbol: 'S/', code: 'PEN', name: 'Peruvian Sol' },
  LKR: { symbol: 'Rs', code: 'LKR', name: 'Sri Lankan Rupee' },
};

// Always return GBP - no location-based currency detection
export function detectCurrency() {
  return 'GBP';
}

// Set currency preference
export function setCurrency(currencyCode) {
  if (CURRENCY_INFO[currencyCode]) {
    localStorage.setItem('gurulink_currency', currencyCode);
    return true;
  }
  return false;
}

// Get currency info
export function getCurrencyInfo(currencyCode) {
  return CURRENCY_INFO[currencyCode] || CURRENCY_INFO.GBP;
}

// Convert price from base currency (GBP) to target currency
export function convertPrice(baseAmount, targetCurrency) {
  const targetRate = EXCHANGE_RATES[targetCurrency] || EXCHANGE_RATES.USD;
  const baseRate = EXCHANGE_RATES[BASE_CURRENCY] || 1;
  return baseAmount * (targetRate / baseRate);
}

// Format price with currency symbol
export function formatPrice(amount, currencyCode) {
  const info = getCurrencyInfo(currencyCode);
  const rounded = Math.round(amount * 100) / 100;
  
  // For currencies with decimals
  const decimals = ['JPY', 'KRW', 'VND', 'IDR', 'CLP', 'COP'].includes(currencyCode) ? 0 : 2;
  
  // Format number
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(rounded);
  
  // Add currency symbol
  if (info.symbol.length > 1 || info.symbol.includes('$')) {
    // Multi-character symbols or $ variants go before
    return `${info.symbol}${formatted}`;
  } else {
    // Single character symbols position based on currency
    if (['EUR', 'GBP', 'INR', 'JPY', 'CNY', 'TRY'].includes(currencyCode)) {
      return `${info.symbol}${formatted}`;
    } else {
      return `${info.symbol}${formatted}`;
    }
  }
}

// Get pricing - always returns GBP prices (no conversion)
export function getPricing(currencyCode) {
  // Always use GBP regardless of input
  const currency = 'GBP';
  
  return {
    trial: {
      amount: BASE_TRIAL_PRICE,
      formatted: formatPrice(BASE_TRIAL_PRICE, currency),
    },
    monthly: {
      amount: BASE_MONTHLY_PRICE,
      formatted: formatPrice(BASE_MONTHLY_PRICE, currency),
    },
    total: {
      amount: BASE_TOTAL_PRICE,
      formatted: formatPrice(BASE_TOTAL_PRICE, currency),
    },
    currency,
    symbol: getCurrencyInfo(currency).symbol,
  };
}

// Get all available currencies
export function getAvailableCurrencies() {
  return Object.keys(CURRENCY_INFO).map(code => ({
    code,
    ...CURRENCY_INFO[code],
  }));
}






