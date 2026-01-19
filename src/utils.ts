export const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// Default rates (will be updated from API in future)
const DEFAULT_RATES = { 
  UAH_TO_USD: 0.024, 
  UAH_TO_EUR: 0.022, 
  USD_TO_UAH: 41.5, 
  EUR_TO_UAH: 45.0 
};

export const formatPrice = (price: number | null | undefined, currency: 'UAH' | 'USD' | 'EUR' = 'UAH') => {
  if (!price && price !== 0) return '—';
  if (currency === 'UAH') return `${Number(price).toLocaleString('uk-UA')} ₴`;
  if (currency === 'USD') return `$${Number(price).toFixed(2)}`;
  if (currency === 'EUR') return `€${Number(price).toFixed(2)}`;
  return `${Number(price).toFixed(2)}`;
};

export const convertPrice = (price: number | null | undefined, from: 'UAH' | 'USD' | 'EUR', to: 'UAH' | 'USD' | 'EUR', rates = DEFAULT_RATES) => {
  if (!price) return null;
  if (from === to) return price;
  if (from === 'UAH' && to === 'USD') return price * rates.UAH_TO_USD;
  if (from === 'UAH' && to === 'EUR') return price * rates.UAH_TO_EUR;
  if (from === 'USD' && to === 'UAH') return price * rates.USD_TO_UAH;
  if (from === 'EUR' && to === 'UAH') return price * rates.EUR_TO_UAH;
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
