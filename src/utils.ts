export const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// Default rates
const DEFAULT_RATES = { 
  RON_TO_USD: 0.21,
  USD_TO_RON: 4.65,
  UAH_TO_USD: 0.024, 
  UAH_TO_EUR: 0.022, 
  USD_TO_UAH: 41.5, 
  EUR_TO_UAH: 45.0 
};

export const formatPrice = (price: number | null | undefined, currency: string = 'RON') => {
  if (!price && price !== 0) return '—';
  if (currency === 'RON') return `${Number(price).toLocaleString('ro-RO')} lei`;
  if (currency === 'UAH') return `${Number(price).toLocaleString('uk-UA')} ₴`;
  if (currency === 'USD') return `$${Number(price).toFixed(2)}`;
  if (currency === 'EUR') return `€${Number(price).toFixed(2)}`;
  return `${Number(price).toFixed(2)} ${currency}`;
};

export const convertPrice = (price: number | null | undefined, from: string, to: string, rates = DEFAULT_RATES) => {
  if (!price) return null;
  if (from === to) return price;
  // Basic conversions
  if (from === 'USD' && to === 'RON') return price * (rates.USD_TO_RON || 4.65);
  if (from === 'RON' && to === 'USD') return price * (rates.RON_TO_USD || 0.21);
  return price;
};

export const getCategoryIcon = (cat: string) => ({ 
  'iPhone': '📱', 
  'iPad': '📟', 
  'Mac': '💻', 
  'MacBook': '💻', 
  'Apple Watch': '⌚', 
  'AirPods': '🎧' 
}[cat] || '🔧');
