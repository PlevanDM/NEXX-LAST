import React from 'react';
import { Icons } from './Icons';
import { useTranslation } from '../hooks/useTranslation';

const STORAGE_KEY = 'nexx_power_price_history';
const STORAGE_KEY_TODOS = 'nexx_power_todos';
const API_BASE = '/api/db/power-prices';
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 min

/** UA pricing parameters */
const UA_VAT_PERCENT = 20;
const UA_DELIVERY_USD = 20;
const UA_PROFIT_PERCENT = 15;
const EUR_TO_USD = 1.08;

function calcUaPrice(priceEur: number) {
  const baseWithVat = priceEur * (1 + UA_VAT_PERCENT / 100);
  const deliveryEur = UA_DELIVERY_USD / EUR_TO_USD;
  const beforeProfit = baseWithVat + deliveryEur;
  const profitAmount = beforeProfit * (UA_PROFIT_PERCENT / 100);
  const total = beforeProfit + profitAmount;
  return {
    total: Math.round(total * 100) / 100,
    breakdown: {
      base: priceEur,
      vat: Math.round((priceEur * UA_VAT_PERCENT / 100) * 100) / 100,
      deliveryEur: Math.round(deliveryEur * 100) / 100,
      profit: Math.round(profitAmount * 100) / 100,
    },
  };
}

export interface PowerStationOffer {
  supplier: string;
  price: number;
  currency?: string;
  note?: string;
  region?: 'EU' | 'UA';
}

export interface PriceRecord {
  date: string;
  timestamp?: string;
  price_eu: number | null;
  price_ua?: number | null;
  amazon_de?: number | null;
  source?: string;
  note?: string;
}

export interface TodoItem {
  id: string;
  productId: string;
  deadline?: string;
  note?: string;
  createdAt: string;
}

interface PowerStation {
  id: string;
  brand: string;
  name: string;
  model?: string;
  specs?: string;
  price_eu: number;
  currency?: string;
  category: string;
  offers?: PowerStationOffer[];
}

interface LivePrices {
  [productId: string]: {
    official_eu?: number;
    amazon_de?: number;
  };
}

interface PriceStats {
  [productId: string]: {
    records: number;
    latest: PriceRecord | null;
    previous: PriceRecord | null;
    trend: 'up' | 'down' | 'stable' | 'unknown';
  };
}

interface Props {
  onClose: () => void;
}

function normalizeOffers(station: PowerStation): PowerStationOffer[] {
  if (station.offers && station.offers.length > 0) {
    return station.offers.map(o => ({
      supplier: o.supplier,
      price: o.price,
      currency: o.currency || 'EUR',
      note: o.note,
      region: o.region,
    }));
  }
  return [{ supplier: 'EU Base', price: station.price_eu, currency: station.currency || 'EUR', region: 'EU' as const }];
}

function minOffer(offers: PowerStationOffer[]) {
  if (offers.length === 0) return null;
  let best = offers[0];
  for (let i = 1; i < offers.length; i++) {
    if (offers[i].price < best.price) best = offers[i];
  }
  return best;
}

function minEuOffer(offers: PowerStationOffer[]): PowerStationOffer | null {
  const eu = offers.filter(o => o.region === 'EU' || !o.region);
  return eu.length ? eu.reduce((a, b) => (a.price <= b.price ? a : b)) : minOffer(offers);
}

function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// ==================== localStorage fallback for todos ====================
function getTodos(): { watch: TodoItem[]; buy: TodoItem[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TODOS);
    if (!raw) return { watch: [], buy: [] };
    const data = JSON.parse(raw);
    return { watch: data.watch || [], buy: data.buy || [] };
  } catch { return { watch: [], buy: [] }; }
  }
function saveTodos(todos: { watch: TodoItem[]; buy: TodoItem[] }) {
  localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
}
function addTodo(list: 'watch' | 'buy', productId: string, deadline?: string, note?: string): TodoItem {
  const todos = getTodos();
  const item: TodoItem = { id: productId + '-' + Date.now(), productId, deadline, note, createdAt: todayISO() };
  todos[list].push(item);
  saveTodos(todos);
  return item;
}
function removeTodo(list: 'watch' | 'buy', id: string) {
  const todos = getTodos();
  todos[list] = todos[list].filter(t => t.id !== id);
  saveTodos(todos);
}
function isOverdue(deadline?: string): boolean {
  if (!deadline) return false;
  return deadline < todayISO();
}

// ==================== Sparkline SVG ====================
const Sparkline: React.FC<{ data: number[]; width?: number; height?: number; color?: string }> = ({
  data, width = 80, height = 28, color = '#10b981',
}) => {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - pad * 2) + pad;
    const y = height - ((v - min) / range) * (height - pad * 2) - pad;
    return `${x},${y}`;
  }).join(' ');

  const fillPoints = `${pad},${height - pad} ${points} ${width - pad},${height - pad}`;
  const lastX = width - pad;
  const lastY = height - ((data[data.length - 1] - min) / range) * (height - pad * 2) - pad;

  return (
    <svg width={width} height={height} className="inline-block align-middle">
      <polygon fill={color} fillOpacity={0.08} points={fillPoints} />
      <polyline fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx={lastX} cy={lastY} r={2} fill={color} />
    </svg>
  );
};

// ==================== Trend Badge ====================
const TrendBadge: React.FC<{ trend: string; compact?: boolean; diff?: number }> = ({ trend, compact, diff }) => {
  const absDiff = diff ? Math.abs(diff) : 0;
  const diffStr = absDiff >= 1 ? ` ${absDiff.toFixed(0)}€` : '';
  const pctStr = diff && absDiff >= 1 ? ` (${diff > 0 ? '+' : ''}${((diff / (absDiff + 100)) * 100).toFixed(1)}%)` : '';
  if (trend === 'down') return (
    <span className={`inline-flex items-center gap-0.5 ${compact ? 'text-[11px] px-1.5 py-0.5 rounded bg-emerald-50' : 'px-2.5 py-1 rounded-lg text-xs bg-emerald-50 border border-emerald-200'} font-bold text-emerald-700`}>
      <svg className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3v10M4 9l4 4 4-4"/>
      </svg>
      {compact ? diffStr : `Зниження${diffStr}`}
    </span>
  );
  if (trend === 'up') return (
    <span className={`inline-flex items-center gap-0.5 ${compact ? 'text-[11px] px-1.5 py-0.5 rounded bg-red-50' : 'px-2.5 py-1 rounded-lg text-xs bg-red-50 border border-red-200'} font-bold text-red-600`}>
      <svg className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 13V3M4 7l4-4 4 4"/>
      </svg>
      {compact ? diffStr : `Зростання${diffStr}`}
    </span>
  );
  if (trend === 'stable') return (
    <span className={`inline-flex items-center gap-0.5 ${compact ? 'text-[11px] px-1.5 py-0.5 rounded bg-slate-50' : 'px-2.5 py-1 rounded-lg text-xs bg-slate-50 border border-slate-200'} font-medium text-slate-500`}>
      <svg className={compact ? 'w-3 h-3' : 'w-4 h-4'} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 8h10"/>
      </svg>
      {compact ? '' : 'Стабільно'}
    </span>
  );
  return (
    <span className={`inline-flex items-center gap-0.5 ${compact ? 'text-[11px] px-1.5 py-0.5 rounded bg-slate-50' : 'px-2 py-0.5 rounded-lg text-xs bg-slate-50'} text-slate-400`}>
      <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 8h10"/>
      </svg>
      {compact ? '' : 'Немає даних'}
    </span>
  );
};

// ==================== Price Change ====================
const PriceChange: React.FC<{ current: number; previous: number | null; showArrow?: boolean }> = ({ current, previous, showArrow = true }) => {
  if (!previous || previous === current) return null;
  const diff = current - previous;
  const pct = ((diff / previous) * 100).toFixed(1);
  const isUp = diff > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold tabular-nums ${isUp ? 'text-red-600' : 'text-emerald-600'}`}>
      {showArrow && (
        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {isUp ? <path d="M8 13V3M4 7l4-4 4 4"/> : <path d="M8 3v10M4 9l4 4 4-4"/>}
        </svg>
      )}
      {isUp ? '+' : ''}{diff.toFixed(0)}€ <span className="opacity-70 ml-0.5">({isUp ? '+' : ''}{pct}%)</span>
    </span>
  );
};

// ==================== Modals ====================
const AddPriceRecordModal: React.FC<{
  station: PowerStation;
  onClose: () => void;
  onSave: (record: PriceRecord) => void;
}> = ({ station, onClose, onSave }) => {
  const [date, setDate] = React.useState(todayISO());
  const [priceEu, setPriceEu] = React.useState(String(minEuOffer(normalizeOffers(station))?.price ?? station.price_eu));
  const [priceAmazon, setPriceAmazon] = React.useState('');
  const [priceUa, setPriceUa] = React.useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eu = parseFloat(priceEu.replace(',', '.'));
    if (Number.isFinite(eu)) {
      onSave({
        date,
        price_eu: eu,
        amazon_de: priceAmazon ? parseFloat(priceAmazon.replace(',', '.')) : null,
        price_ua: priceUa ? parseFloat(priceUa.replace(',', '.')) : null,
        source: 'manual',
      });
    }
  };
  const inputCls = 'w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all';
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Записати ціну</h3>
        <p className="text-sm text-slate-500 mb-5 truncate">{station.name}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Дата</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Офіційний ЄС, €</label>
            <input type="text" inputMode="decimal" value={priceEu} onChange={(e) => setPriceEu(e.target.value)} className={inputCls} placeholder="1360" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
          <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Amazon DE, €</label>
              <input type="text" inputMode="decimal" value={priceAmazon} onChange={(e) => setPriceAmazon(e.target.value)} className={inputCls} placeholder="—" />
          </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">UA, €</label>
              <input type="text" inputMode="decimal" value={priceUa} onChange={(e) => setPriceUa(e.target.value)} className={inputCls} placeholder="—" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-600 transition-colors">Скасувати</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddTodoModal: React.FC<{
  station: PowerStation;
  list: 'watch' | 'buy';
  onClose: () => void;
  onSave: (deadline?: string, note?: string) => void;
}> = ({ station, list, onClose, onSave }) => {
  const [deadline, setDeadline] = React.useState('');
  const [note, setNote] = React.useState('');
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(deadline || undefined, note || undefined); };
  const label = list === 'watch' ? 'Слідкувати' : 'Купити';
  const inputCls = 'w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all';
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Додати: {label}</h3>
        <p className="text-sm text-slate-500 mb-5 truncate">{station.name}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Дедлайн</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Примітка</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} placeholder="Наприклад: перевірити до..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-600 transition-colors">Скасувати</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">Додати</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== Main Component ====================
// ==================== PWA Install Hook ====================
declare global { interface Window { __PWA_DEFERRED_PROMPT__?: { preventDefault(): void; prompt(): Promise<void>; userChoice: Promise<{ outcome: string }> }; } }

function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);
  const [showIOSGuide, setShowIOSGuide] = React.useState(false);
  const [showManualGuide, setShowManualGuide] = React.useState(false);

  React.useEffect(() => {
    // Check if already installed as PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (standalone) { setIsInstalled(true); return; }

    // Событие beforeinstallprompt срабатывает один раз при загрузке; в nexx.html мы сохраняем его в window
    if (typeof window !== 'undefined' && window.__PWA_DEFERRED_PROMPT__) {
      setDeferredPrompt(window.__PWA_DEFERRED_PROMPT__);
    }

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    // Swap manifest to EcoFlow-specific (если ещё не подменён в nexx.html)
    let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (link && link.href.indexOf('ecoflow') === -1) { link.href = '/ecoflow-manifest.json'; }

    // Update theme color
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (meta) { meta.content = '#f59e0b'; }

    // Apple-specific + apple-touch-icon (уже могут быть в nexx.html)
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      const l = document.createElement('link'); l.rel = 'apple-touch-icon'; l.href = '/static/ecoflow-pwa-icon.svg'; document.head.appendChild(l);
    }

    // Доп. слушатель на случай если скрипт в nexx.html не успел (например открыли /nexx и перешли в трекер)
    const handler = (e: Event) => { e.preventDefault(); const ev = e as any; window.__PWA_DEFERRED_PROMPT__ = ev; setDeferredPrompt(ev); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = React.useCallback(async () => {
    if (isIOS) { setShowIOSGuide(true); return; }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') setIsInstalled(true);
      setDeferredPrompt(null);
      return;
    }
    setShowManualGuide(true);
  }, [deferredPrompt, isIOS]);

  const canInstall = !isInstalled;
  return { canInstall, isInstalled, isIOS, install, showIOSGuide, setShowIOSGuide, showManualGuide, setShowManualGuide };
}

export const PowerStationTracker: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const [stations, setStations] = React.useState<PowerStation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(true);
  const pwa = usePwaInstall();

  // Live prices from API
  const [livePrices, setLivePrices] = React.useState<LivePrices>({});
  const [priceStats, setPriceStats] = React.useState<PriceStats>({});
  const [allHistory, setAllHistory] = React.useState<Record<string, PriceRecord[]>>({});
  const [lastFetch, setLastFetch] = React.useState<string | null>(null);
  const [fetchingLive, setFetchingLive] = React.useState(false);
  const [liveError, setLiveError] = React.useState<string | null>(null);

  const loadStations = React.useCallback(() => {
    return fetch('/data/power-stations.json?t=' + Date.now())
      .then(res => res.json())
      .then(data => { setStations(Array.isArray(data) ? data : []); })
      .catch(err => console.error('Error loading power stations:', err));
  }, []);

  const fetchLivePricesAPI = React.useCallback(async () => {
    setFetchingLive(true);
    setLiveError(null);
    try {
      const resp = await fetch(`${API_BASE}?action=fetch-live`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      if (data.prices) setLivePrices(data.prices);
      if (data.last_fetch) setLastFetch(data.last_fetch);
    } catch (err: any) {
      setLiveError(err.message || 'Fetch failed');
    } finally {
      setFetchingLive(false);
    }
  }, []);

  const fetchHistoryAPI = React.useCallback(async () => {
    try {
      const resp = await fetch(`${API_BASE}?action=history-all`);
      if (!resp.ok) return;
      const data = await resp.json();
      if (data.history) setAllHistory(data.history);
    } catch (err) {
      console.error('History fetch error:', err);
    }
  }, []);

  const fetchStatsAPI = React.useCallback(async () => {
    try {
      const resp = await fetch(API_BASE);
      if (!resp.ok) return;
      const data = await resp.json();
      if (data.stats) setPriceStats(data.stats);
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  }, []);

  const recordPriceAPI = React.useCallback(async (id: string, record: PriceRecord) => {
    try {
      await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record', id,
          price_eu: record.price_eu, amazon_de: record.amazon_de,
          price_ua: record.price_ua, source: record.source || 'manual',
        }),
      });
    } catch (err) {
      console.error('Record price error:', err);
    }
  }, []);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([loadStations(), fetchLivePricesAPI(), fetchHistoryAPI(), fetchStatsAPI()])
      .finally(() => setLoading(false));
  }, [loadStations, fetchLivePricesAPI, fetchHistoryAPI, fetchStatsAPI]);

  React.useEffect(() => {
    const interval = setInterval(() => { fetchLivePricesAPI(); fetchHistoryAPI(); }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchLivePricesAPI, fetchHistoryAPI]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadStations(), fetchLivePricesAPI(), fetchHistoryAPI(), fetchStatsAPI()]);
    setRefreshing(false);
  };

  const filteredStations = React.useMemo(() =>
    stations.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.brand.toLowerCase().includes(search.toLowerCase()) ||
      (s.model && s.model.toLowerCase().includes(search.toLowerCase()))
    ), [stations, search]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /** Get best price using: live data > static offers > base price */
  const getEffectivePrice = (station: PowerStation): {
    official: number | null; amazon: number | null; best: number;
    staticOfficial: number | null; staticAmazon: number | null;
    isLiveOfficial: boolean; isLiveAmazon: boolean;
    trend: 'up' | 'down' | 'stable' | 'unknown'; trendDiff: number;
    savingsVsBase: number;
  } => {
    const live = livePrices[station.id];
    const offers = normalizeOffers(station);
    const euMin = minEuOffer(offers);
    const staticBest = euMin?.price ?? station.price_eu;

    // Extract static prices from offers array
    const staticOfficial = offers.find(o => /^(EcoFlow|BLUETTI|Jackery|DJI|Walter)\s*(EU|Official|DE)?$/i.test(o.supplier))?.price ?? null;
    const staticAmazon = offers.find(o => /amazon/i.test(o.supplier))?.price ?? null;

    // Live overrides static
    const official = live?.official_eu ?? staticOfficial;
    const amazon = live?.amazon_de ?? staticAmazon;
    const isLiveOfficial = !!(live?.official_eu);
    const isLiveAmazon = !!(live?.amazon_de);

    const candidates = [official, amazon, staticBest].filter((p): p is number => p !== null && p > 0);
    const best = candidates.length > 0 ? Math.min(...candidates) : staticBest;

    // Compute trend: KV history > live vs static > compare offers
    const kvTrend = priceStats[station.id]?.trend;
    let trend: 'up' | 'down' | 'stable' | 'unknown' = kvTrend || 'unknown';
    let trendDiff = 0;

    if (kvTrend && kvTrend !== 'unknown') {
      // Use KV trend, compute diff from history
      const latest = priceStats[station.id]?.latest?.price_eu;
      const prev = priceStats[station.id]?.previous?.price_eu;
      if (latest && prev) trendDiff = latest - prev;
    } else if (isLiveOfficial && staticOfficial) {
      // Compare live to static baseline
      trendDiff = live!.official_eu! - staticOfficial;
      trend = trendDiff < -1 ? 'down' : trendDiff > 1 ? 'up' : 'stable';
    } else if (official && station.price_eu) {
      // Compare current official to base price_eu
      trendDiff = official - station.price_eu;
      trend = trendDiff < -1 ? 'down' : trendDiff > 1 ? 'up' : 'stable';
    }

    // Savings compared to base price
    const savingsVsBase = station.price_eu - best;

    return { official, amazon, best, staticOfficial, staticAmazon, isLiveOfficial, isLiveAmazon, trend, trendDiff, savingsVsBase };
  };

  const categories = React.useMemo(() => {
    const set = new Set(stations.map(s => s.category));
    return ['Всі', ...Array.from(set).sort()];
  }, [stations]);

  const [categoryFilter, setCategoryFilter] = React.useState<string>('Всі');
  const [sortBy, setSortBy] = React.useState<'name' | 'priceMin' | 'category' | 'trend'>('name');
  const [viewMode, setViewMode] = React.useState<'cards' | 'table' | 'lists'>('cards');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [addRecordFor, setAddRecordFor] = React.useState<PowerStation | null>(null);
  const [todos, setTodos] = React.useState<{ watch: TodoItem[]; buy: TodoItem[] }>(() => getTodos());
  const [addTodoFor, setAddTodoFor] = React.useState<{ station: PowerStation; list: 'watch' | 'buy' } | null>(null);

  const filteredByCategory = React.useMemo(() => {
    if (!categoryFilter || categoryFilter === 'Всі') return filteredStations;
    return filteredStations.filter(s => s.category === categoryFilter);
  }, [filteredStations, categoryFilter]);

  const sortedStations = React.useMemo(() => {
    const list = [...filteredByCategory];
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'category') list.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    if (sortBy === 'priceMin') list.sort((a, b) => getEffectivePrice(a).best - getEffectivePrice(b).best);
    if (sortBy === 'trend') {
      const order = { down: 0, up: 1, stable: 2, unknown: 3 };
      list.sort((a, b) => (order[(priceStats[a.id]?.trend || 'unknown') as keyof typeof order] ?? 3) - (order[(priceStats[b.id]?.trend || 'unknown') as keyof typeof order] ?? 3));
    }
    return list;
  }, [filteredByCategory, sortBy, livePrices, priceStats]);

  const selectAllVisible = () => { setSelectedIds(prev => { const next = new Set(prev); sortedStations.forEach(s => next.add(s.id)); return next; }); };
  const clearSelection = () => setSelectedIds(new Set());
  const refreshTodos = () => setTodos(getTodos());

  const getSparklineData = (id: string): number[] => {
    const history = allHistory[id] || [];
    return history.sort((a, b) => a.date.localeCompare(b.date)).slice(-14).map(r => r.price_eu ?? r.amazon_de ?? 0).filter(p => p > 0);
  };

  const getPreviousPrice = (id: string): number | null => {
    const history = allHistory[id] || [];
    if (history.length < 2) return null;
    const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
    return sorted[1]?.price_eu ?? null;
  };

  const timeAgo = (iso: string | null): string => {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'щойно';
    if (mins < 60) return `${mins} хв`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} год`;
    return `${Math.floor(hours / 24)} дн`;
  };

  const priceDropAlerts = React.useMemo(() =>
    sortedStations.filter(s => priceStats[s.id]?.trend === 'down'), [sortedStations, priceStats]);

  const { totalFromBest, totalUa, savings } = React.useMemo(() => {
    let fromBest = 0; let atEu = 0; let uaTotal = 0;
    filteredStations.forEach(s => {
      if (!selectedIds.has(s.id)) return;
      const { best } = getEffectivePrice(s);
      fromBest += best; atEu += s.price_eu; uaTotal += calcUaPrice(best).total;
    });
    return { totalFromBest: Math.round(fromBest), totalAtEuBase: Math.round(atEu), totalUa: Math.round(uaTotal), savings: Math.round(atEu - fromBest) };
  }, [filteredStations, selectedIds, livePrices]);

  const isRefreshing = refreshing || fetchingLive;

  const isPwaStandalone = React.useMemo(() => window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone, []);

  // ==================== RENDER ====================
  return (
    <div className="h-full flex flex-col bg-slate-50" style={{ paddingTop: isPwaStandalone ? 'env(safe-area-inset-top, 0px)' : undefined }}>
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-10" style={{ paddingTop: isPwaStandalone ? 'max(0.875rem, env(safe-area-inset-top, 0px))' : undefined }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-sm">⚡</div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold text-slate-900 truncate">Аналізатор цін</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${fetchingLive ? 'bg-amber-400 animate-pulse' : liveError ? 'bg-red-400' : 'bg-emerald-400'}`} />
              <span className="truncate">
                {fetchingLive ? 'Оновлення...' : `${Object.keys(livePrices).length} джерел`}
                {lastFetch && !fetchingLive && <span className="text-slate-400"> · {timeAgo(lastFetch)}</span>}
              </span>
          </div>
        </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* PWA Install Button */}
          {pwa.canInstall && (
          <button
            type="button"
              onClick={pwa.install}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
              title="Встановити як додаток"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16" /></svg>
              <span>Встановити</span>
            </button>
          )}
          {pwa.isInstalled && (
            <span className="flex items-center gap-1 px-2 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              PWA
            </span>
          )}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Оновити
          </button>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
            <Icons.Close />
          </button>
        </div>
      </div>

      {/* ─── Alerts Banner (collapsible) ─── */}
      {showBanner && (priceDropAlerts.length > 0 || liveError) && (
        <div className="px-5 py-2.5 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200 flex items-center gap-3">
          <span className="flex-shrink-0 text-sm">📉</span>
          <div className="flex-1 min-w-0">
            {priceDropAlerts.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-emerald-800">Ціни знизились:</span>
                {priceDropAlerts.slice(0, 4).map(s => (
                  <span key={s.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100/80 rounded-md text-[11px] font-medium text-emerald-700">
                    {s.name.split(' ').slice(0, 3).join(' ')}
                  </span>
                ))}
                {priceDropAlerts.length > 4 && <span className="text-[11px] text-emerald-600">+{priceDropAlerts.length - 4}</span>}
          </div>
            ) : liveError ? (
              <span className="text-xs text-red-700">Помилка: {liveError}. Кешовані дані.</span>
            ) : null}
        </div>
          <button onClick={() => setShowBanner(false)} className="p-1 hover:bg-emerald-100 rounded text-emerald-500 flex-shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
      </div>
      )}

      {/* ─── Filters ─── */}
      <div className="px-5 py-3 bg-white border-b border-slate-200 space-y-2.5">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Пошук..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl transition-all text-sm outline-none"
          />
        </div>
        {/* Controls row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {/* Categories */}
          <div className="flex items-center gap-1 flex-shrink-0">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${categoryFilter === cat ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {cat}
            </button>
          ))}
          </div>
          <div className="w-px h-5 bg-slate-200 flex-shrink-0" />
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 outline-none flex-shrink-0"
          >
            <option value="name">Назва</option>
            <option value="priceMin">Ціна ↑</option>
            <option value="category">Категорія</option>
            <option value="trend">Тренд</option>
          </select>
          <div className="w-px h-5 bg-slate-200 flex-shrink-0" />
          {/* View mode */}
          <div className="flex gap-0.5 bg-slate-100 rounded-lg p-0.5 flex-shrink-0">
            {([['cards', 'Картки'], ['table', 'Таблиця'], ['lists', 'Списки']] as const).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => { if (mode === 'lists') refreshTodos(); setViewMode(mode); }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${viewMode === mode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {label}
          </button>
            ))}
          </div>
          <div className="ml-auto flex gap-1 flex-shrink-0">
            <button type="button" onClick={selectAllVisible} className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">Все</button>
            <button type="button" onClick={clearSelection} className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">Скинути</button>
        </div>
            </div>
            </div>

      {/* ─── Selected Summary ─── */}
      {selectedIds.size > 0 && (
        <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 flex items-center gap-4 text-sm">
          <span className="font-semibold text-emerald-800">{selectedIds.size} обрано</span>
          <span className="text-emerald-700 font-bold tabular-nums">{totalFromBest} €</span>
          <span className="text-slate-500">UA: <span className="font-semibold text-slate-700">{totalUa} €</span></span>
          {savings > 0 && <span className="text-emerald-600 font-semibold">−{savings} € економія</span>}
            </div>
              )}

      {/* ─── Modals ─── */}
      {addTodoFor && (
        <AddTodoModal station={addTodoFor.station} list={addTodoFor.list} onClose={() => setAddTodoFor(null)}
          onSave={(deadline, note) => { addTodo(addTodoFor.list, addTodoFor.station.id, deadline, note); refreshTodos(); setAddTodoFor(null); }} />
      )}
      {addRecordFor && (
        <AddPriceRecordModal station={addRecordFor} onClose={() => setAddRecordFor(null)}
          onSave={(record) => { recordPriceAPI(addRecordFor.id, record); setAddRecordFor(null); setTimeout(() => { fetchHistoryAPI(); fetchStatsAPI(); }, 500); }} />
      )}

      {/* ─── Content ─── */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-slate-500">Завантаження...</p>
          </div>
        ) : viewMode === 'table' ? (
          /* ═══════ TABLE VIEW ═══════ */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 z-[1]">
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-semibold">Товар</th>
                  <th className="text-center px-3 py-3 font-semibold w-16">Тренд</th>
                  <th className="text-right px-3 py-3 font-semibold">Офіц. ЄС</th>
                  <th className="text-right px-3 py-3 font-semibold">Amazon</th>
                  <th className="text-right px-3 py-3 font-semibold">Мін. ціна</th>
                  <th className="text-center px-3 py-3 font-semibold w-24">14 дн.</th>
                  <th className="text-right px-3 py-3 font-semibold">Зміна</th>
                  <th className="text-right px-3 py-3 font-semibold">UA</th>
                  <th className="px-3 py-3 w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
            {sortedStations.map((station) => {
                  const ep = getEffectivePrice(station);
                  const sparkData = getSparklineData(station.id);
                  const prevPrice = getPreviousPrice(station.id);

              return (
                    <tr key={station.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-semibold text-slate-900">{station.name}</div>
                        <div className="text-[11px] text-slate-400">{station.brand} · {station.category}</div>
                      </td>
                      <td className="px-3 py-3 text-center"><TrendBadge trend={ep.trend} diff={ep.trendDiff} /></td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {ep.official != null ? (
                          <div className="flex flex-col items-end">
                            <span className={`font-semibold ${ep.isLiveOfficial ? 'text-amber-700' : 'text-amber-600/70'}`}>{ep.official}€</span>
                            {ep.isLiveOfficial && <span className="text-[9px] text-emerald-500 font-medium">● live</span>}
                  </div>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {ep.amazon != null ? (
                          <div className="flex flex-col items-end">
                            <span className={`font-semibold ${ep.isLiveAmazon ? 'text-blue-700' : 'text-blue-600/70'}`}>{ep.amazon}€</span>
                            {ep.isLiveAmazon && <span className="text-[9px] text-emerald-500 font-medium">● live</span>}
                </div>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-emerald-700 tabular-nums">{ep.best}€</span>
                          {ep.savingsVsBase > 0 && <span className="text-[10px] text-emerald-500 font-medium">-{ep.savingsVsBase}€ економія</span>}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {sparkData.length >= 2 ? (
                          <Sparkline data={sparkData} width={70} height={22} color={ep.trend === 'down' ? '#059669' : ep.trend === 'up' ? '#dc2626' : '#94a3b8'} />
                        ) : <span className="text-slate-300 text-[10px]">немає даних</span>}
                      </td>
                      <td className="px-3 py-3 text-right"><PriceChange current={ep.best} previous={prevPrice} /></td>
                      <td className="px-3 py-3 text-right tabular-nums text-slate-600">{calcUaPrice(ep.best).total.toFixed(0)}€</td>
                      <td className="px-3 py-3">
                        <button onClick={() => setAddRecordFor(station)} className="p-1.5 hover:bg-emerald-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors" title="Записати ціну">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </td>
                    </tr>
              );
            })}
              </tbody>
            </table>
          </div>
        ) : viewMode === 'lists' ? (
          /* ═══════ LISTS VIEW ═══════ */
          <div className="p-5 space-y-5">
            {[{ key: 'watch' as const, title: 'Слідкувати', icon: '👁', color: 'violet' },
              { key: 'buy' as const, title: 'Купити', icon: '🛒', color: 'emerald' }].map(({ key, title, icon, color }) => (
              <div key={key} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <h3 className={`px-5 py-3 bg-${color}-50 border-b border-${color}-200 font-bold text-${color}-800 text-sm flex items-center gap-2`}>
                  <span>{icon}</span> {title}
                  <span className="ml-auto text-xs font-normal text-slate-400">{todos[key].length}</span>
                </h3>
              <ul className="divide-y divide-slate-100">
                  {todos[key].length === 0 && <li className="px-5 py-8 text-slate-400 text-sm text-center">Порожньо</li>}
                  {todos[key].map(t => {
                  const station = stations.find(s => s.id === t.productId);
                  const overdue = isOverdue(t.deadline);
                  return (
                      <li key={t.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-slate-800">{station?.name ?? t.productId}</span>
                        {t.deadline && (
                            <span className={`ml-2 text-xs ${overdue ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                              {overdue ? '⚠ ' : ''}до {t.deadline}
                          </span>
                        )}
                          {t.note && <p className="text-xs text-slate-400 mt-0.5">{t.note}</p>}
                      </div>
                        <button type="button" onClick={() => { removeTodo(key, t.id); refreshTodos(); }} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            ))}
          </div>
        ) : sortedStations.length > 0 ? (
          /* ═══════ CARDS VIEW ═══════ */
          <div className="p-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sortedStations.map((station) => {
              const ep = getEffectivePrice(station);
            const isSelected = selectedIds.has(station.id);
              const isExpanded = expandedId === station.id;
              const history = allHistory[station.id] || [];
              const sparkData = getSparklineData(station.id);
              const prevPrice = getPreviousPrice(station.id);

            return (
                <div
                  key={station.id}
                  className={`bg-white rounded-2xl border transition-all cursor-pointer ${isSelected ? 'border-emerald-400 ring-1 ring-emerald-200 shadow-md' : 'border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'}`}
                  onClick={() => setExpandedId(isExpanded ? null : station.id)}
                >
                  {/* Card Header */}
                  <div className="p-4 pb-3">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{station.brand}</span>
                          <span className="text-[10px] text-slate-300">·</span>
                          <span className="text-[10px] text-slate-400">{station.category}</span>
                          <TrendBadge trend={ep.trend} diff={ep.trendDiff} compact />
                      </div>
                        <h3 className="font-bold text-slate-900 text-[15px] leading-tight">{station.name}</h3>
                        {station.specs && <p className="text-xs text-slate-500 mt-1">{station.specs}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                        <div className="text-xl font-black text-emerald-600 tabular-nums">{ep.best}€</div>
                        <PriceChange current={ep.best} previous={prevPrice} />
                  </div>
                </div>

                    {/* Price sources row — all real data from offers/live */}
                    <div className="flex items-center gap-3 text-xs mt-2">
                      {ep.official !== null && (
                        <span className="text-amber-700 flex items-center gap-1">
                          Офіц. <span className="font-bold tabular-nums">{ep.official}€</span>
                          {ep.isLiveOfficial && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live" />}
                        </span>
                      )}
                      {ep.amazon !== null && (
                        <span className="text-blue-700 flex items-center gap-1">
                          Amazon <span className="font-bold tabular-nums">{ep.amazon}€</span>
                          {ep.isLiveAmazon && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live" />}
                        </span>
                      )}
                      {/* Show savings badge if Amazon < Official */}
                      {ep.official !== null && ep.amazon !== null && ep.amazon < ep.official && (
                        <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                          -{(ep.official - ep.amazon).toFixed(0)}€
                        </span>
                      )}
                      <span className="text-slate-400 ml-auto">UA ≈ <span className="font-semibold text-slate-600 tabular-nums">{calcUaPrice(ep.best).total.toFixed(0)}€</span></span>
                  </div>

                    {/* Sparkline */}
                    {sparkData.length >= 2 && (
                      <div className="mt-2">
                        <Sparkline data={sparkData} width={999} height={32} color={ep.trend === 'down' ? '#059669' : ep.trend === 'up' ? '#dc2626' : '#94a3b8'} />
                </div>
                    )}
                          </div>

                  {/* Card Actions (always visible, compact) */}
                  <div className="px-4 pb-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleSelect(station.id); }}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {isSelected ? '✓ Обрано' : 'Обрати'}
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setAddRecordFor(station); }} className="px-2.5 py-1.5 bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg text-xs font-medium transition-colors">
                      + Ціна
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setAddTodoFor({ station, list: 'watch' }); }} className="px-2.5 py-1.5 bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-700 rounded-lg text-xs font-medium transition-colors">
                      👁
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setAddTodoFor({ station, list: 'buy' }); }} className="px-2.5 py-1.5 bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700 rounded-lg text-xs font-medium transition-colors">
                      🛒
                    </button>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50 rounded-b-2xl space-y-3" onClick={e => e.stopPropagation()}>
                      {/* UA Breakdown */}
                      <div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Розрахунок ціни UA</div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          {[
                            ['База ЄС', `${ep.best}€`],
                            ['НДС 20%', `+${calcUaPrice(ep.best).breakdown.vat}€`],
                            ['Доставка', `+${calcUaPrice(ep.best).breakdown.deliveryEur}€`],
                            ['Прибуток 15%', `+${calcUaPrice(ep.best).breakdown.profit}€`],
                          ].map(([label, val]) => (
                            <div key={label} className="text-center">
                              <div className="text-slate-400">{label}</div>
                              <div className="font-semibold text-slate-700 tabular-nums">{val}</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-right mt-1 font-bold text-slate-900 tabular-nums">Усього: {calcUaPrice(ep.best).total.toFixed(0)} €</div>
                      </div>

                      {/* Suppliers */}
                      {normalizeOffers(station).length > 0 && (
                        <div>
                          <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Поставщики</div>
                          <div className="space-y-1">
                            {normalizeOffers(station).map((offer, i) => (
                              <div key={i} className="flex items-center justify-between text-xs">
                                <span className="text-slate-700">{offer.region === 'EU' ? '🇪🇺 ' : ''}{offer.supplier}</span>
                                <span className="font-semibold text-slate-900 tabular-nums">{offer.price} {offer.currency || '€'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* History */}
                      <div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Історія ({history.length})</div>
                      {history.length === 0 ? (
                          <p className="text-xs text-slate-400">Ще немає записів</p>
                        ) : (
                          <div className="space-y-0.5 max-h-40 overflow-y-auto">
                            {[...history].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10).map((r, i) => (
                              <div key={i} className="flex items-center justify-between text-xs py-1">
                                <span className="font-mono text-slate-500">{r.date}</span>
                                <div className="flex items-center gap-3">
                                  {r.price_eu != null && <span className="tabular-nums">{r.price_eu}€</span>}
                                  {r.amazon_de != null && <span className="tabular-nums text-blue-600">{r.amazon_de}€</span>}
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${r.source === 'auto' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {r.source === 'auto' ? 'авто' : 'ручн'}
                                  </span>
                                </div>
                              </div>
                            ))}
                    </div>
                  )}
                </div>
                    </div>
                  )}
              </div>
            );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <span className="text-3xl mb-3">🔍</span>
            <p className="font-medium">Нічого не знайдено</p>
            <p className="text-sm mt-1">Змініть пошук або категорію</p>
          </div>
        )}
      </div>

      {/* ─── Footer (minimal) ─── */}
      <div className="px-5 py-2.5 bg-slate-900 text-slate-400 text-[11px] flex items-center justify-between" style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom, 0px))' }}>
        <span>EcoFlow EU · BLUETTI · Jackery · Amazon DE</span>
        <span className="tabular-nums">UA = ЄС + НДС {UA_VAT_PERCENT}% + ${UA_DELIVERY_USD} + {UA_PROFIT_PERCENT}%</span>
        </div>

      {/* ─── iOS Install Guide ─── */}
      {pwa.showIOSGuide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-end justify-center" onClick={() => pwa.setShowIOSGuide(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-10 animate-in space-y-5" onClick={e => e.stopPropagation()} style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 0px))' }}>
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg">⚡</div>
              <h3 className="text-lg font-bold text-slate-900">Встановити додаток</h3>
              <p className="text-sm text-slate-500 mt-1">Price Tracker на головний екран</p>
      </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Натисніть кнопку "Поділитися"</p>
                  <p className="text-xs text-slate-500 mt-0.5">Іконка <span className="inline-block w-5 h-5 align-middle"><svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg></span> внизу Safari</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Прокрутіть вниз та оберіть</p>
                  <p className="text-xs text-slate-500 mt-0.5">"На Початковий екран" (Add to Home Screen)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm flex-shrink-0">3</div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Натисніть "Додати"</p>
                  <p className="text-xs text-slate-500 mt-0.5">Додаток з'явиться на головному екрані</p>
                </div>
              </div>
            </div>
            <button onClick={() => pwa.setShowIOSGuide(false)} className="w-full py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold">Зрозуміло</button>
          </div>
        </div>
      )}

      {/* ─── Manual install guide (desktop / Android) ─── */}
      {pwa.showManualGuide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-end justify-center sm:items-center" onClick={() => pwa.setShowManualGuide(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 pb-10 sm:pb-6 space-y-4" onClick={e => e.stopPropagation()} style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))' }}>
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto sm:hidden" />
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl">⚡</div>
              <h3 className="text-lg font-bold text-slate-900">Встановити додаток</h3>
            </div>
            <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
              <li><strong>Chrome (ПК):</strong> меню ⋮ → «Встановити Price Tracker»</li>
              <li><strong>Android:</strong> меню ⋮ → «Додати на головний екран»</li>
              <li><strong>iPhone:</strong> у Safari кнопка «Поділитися» → «На початковий екран»</li>
            </ul>
            <button onClick={() => pwa.setShowManualGuide(false)} className="w-full py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold">Зрозуміло</button>
          </div>
        </div>
      )}
    </div>
  );
};
