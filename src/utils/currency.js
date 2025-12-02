// Currency conversion rates (base: USD)
// You can update these rates from an API or your backend
const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.0, // Indian Rupees
  CAD: 1.36,
  AUD: 1.52,
  JPY: 149.0,
  CNY: 7.24,
  AED: 3.67,
  SAR: 3.75,
  SGD: 1.34,
  MYR: 4.71,
  THB: 35.8,
  IDR: 15700,
  PHP: 55.5,
  VND: 24500,
  KRW: 1320,
  NZD: 1.66,
  CHF: 0.88,
  SEK: 10.7,
  NOK: 10.8,
  DKK: 6.87,
  PLN: 4.0,
  HUF: 360,
  CZK: 22.5,
  RON: 4.58,
  BGN: 1.80,
  HRK: 6.95,
  TRY: 32.0,
  ZAR: 18.5,
  BRL: 4.95,
  MXN: 17.0,
  ARS: 350,
  CLP: 920,
  COP: 4100,
  PEN: 3.70,
  LKR: 305.0, // Sri Lankan Rupees
};

const BASE_CURRENCY = 'USD';

// Base prices in USD (match Stripe products)
const BASE_TRIAL_PRICE = 1.0;      // GuruLink 7-Day Trial
const BASE_MONTHLY_PRICE = 29.99;  // GuruLink Monthly Plan
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

// Detect currency from browser locale
export function detectCurrency() {
  if (typeof window === 'undefined') return 'USD';
  
  // Try to get from localStorage first
  const saved = localStorage.getItem('gurulink_currency');
  if (saved && CURRENCY_INFO[saved]) {
    return saved;
  }
  
  // Try to detect from browser locale
  try {
    const locale = navigator.language || navigator.userLanguage || 'en-US';
    const parts = locale.split('-');
    const country = parts[1]?.toUpperCase();
    
    // Map common country codes to currencies
    const countryToCurrency = {
      US: 'USD', GB: 'GBP', IE: 'EUR', FR: 'EUR', DE: 'EUR', IT: 'EUR',
      ES: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR', PT: 'EUR', FI: 'EUR',
      GR: 'EUR', IN: 'INR', CA: 'CAD', AU: 'AUD', NZ: 'NZD', JP: 'JPY',
      CN: 'CNY', AE: 'AED', SA: 'SAR', SG: 'SGD', MY: 'MYR', TH: 'THB',
      ID: 'IDR', PH: 'PHP', VN: 'VND', KR: 'KRW', CH: 'CHF', SE: 'SEK',
      NO: 'NOK', DK: 'DKK', PL: 'PLN', HU: 'HUF', CZ: 'CZK', RO: 'RON',
      BG: 'BGN', HR: 'HRK', TR: 'TRY', ZA: 'ZAR', BR: 'BRL', MX: 'MXN',
      AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN', LK: 'LKR',
    };
    
    if (country && countryToCurrency[country]) {
      return countryToCurrency[country];
    }
    
    // Try Intl API for currency
    const currency = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' })
      .formatToParts(0)
      .find(part => part.type === 'currency')?.value;
    
    // Fallback to USD
    return 'USD';
  } catch {
    return 'USD';
  }
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
  return CURRENCY_INFO[currencyCode] || CURRENCY_INFO.USD;
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

// Get pricing for a currency
export function getPricing(currencyCode) {
  const currency = currencyCode || detectCurrency();
  const trialPrice = convertPrice(BASE_TRIAL_PRICE, currency);
  const monthlyPrice = convertPrice(BASE_MONTHLY_PRICE, currency);
  const totalPrice = convertPrice(BASE_TOTAL_PRICE, currency);
  
  return {
    trial: {
      amount: trialPrice,
      formatted: formatPrice(trialPrice, currency),
    },
    monthly: {
      amount: monthlyPrice,
      formatted: formatPrice(monthlyPrice, currency),
    },
    total: {
      amount: totalPrice,
      formatted: formatPrice(totalPrice, currency),
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






