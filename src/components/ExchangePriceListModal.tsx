import React from 'react';
import { Icons } from './Icons';
import { ExchangePrice } from '../types';

interface ExchangePriceListModalProps {
  exchangePrices: Record<string, ExchangePrice>;
  meta?: { lastUpdated: string; source: string };
  onClose: () => void;
}

type SortKey = 'article' | 'description' | 'stock' | 'exchange' | 'full';

const ARTICLE_KEYS = ['артикул', 'art', 'article', 'код', 'part'];
const DESC_KEYS = ['опис', 'description', 'описание', 'назва', 'наименование', 'name'];
const STOCK_KEYS = ['цена склада', 'price stock', 'ціна складу', 'склад', 'stock', 'закуп'];
const EXCHANGE_KEYS = ['цена обмена', 'price exchange', 'ціна обміну', 'обмін', 'exchange', 'обмен'];
const FULL_KEYS = ['полная', 'полная цена', 'розница', 'price full', 'ціна повна', 'retail'];

function findCol(headers: string[], patterns: string[]): number {
  const row = headers.map((h) => String(h ?? '').toLowerCase().trim());
  for (let i = 0; i < row.length; i++) {
    const cell = row[i];
    for (const p of patterns) {
      if (cell.includes(p) || p.includes(cell)) return i;
    }
  }
  return -1;
}

function parseNum(val: unknown): number {
  if (val == null || val === '') return 0;
  if (typeof val === 'number' && !Number.isNaN(val)) return Math.round(val);
  const s = String(val).replace(/\s/g, '').replace(',', '.');
  const n = parseFloat(s);
  return Number.isNaN(n) ? 0 : Math.round(n);
}

/** Из описания запчасти извлекаем продукт/категорію: iPhone, iPad, MacBook, iMac, Mac mini, Apple Watch, плати Mac тощо */
function extractProduct(description: string): string {
  const d = description;
  const lower = d.toLowerCase();
  // Явні моделі в тексті (for MacBook Pro (...), for iMac (...), iPhone 14 тощо)
  const explicit = d.match(/(?:for\s+)?(iPhone|iPad|iMac|Mac\s*mini|Mac\s*Pro|MacBook\s*Pro|MacBook\s*Air|MacBook|Apple\s*Watch)\s*[\(\d]/i);
  if (explicit) {
    const name = explicit[1].replace(/\s+/g, ' ');
    if (/^iPhone/i.test(name)) return 'iPhone';
    if (/^iPad/i.test(name)) return 'iPad';
    if (/^Apple Watch/i.test(name)) return 'Apple Watch';
    if (/^iMac/i.test(name)) return 'iMac';
    if (/^Mac mini/i.test(name)) return 'Mac mini';
    if (/^Mac Pro/i.test(name)) return 'Mac Pro';
    if (/^MacBook/i.test(name)) return 'MacBook';
    return name;
  }
  // Короткі позначення: MBP, IMAC, MacBook у будь-якому місці
  if (/\bMBP\b|MacBook|Mac\s*Book/i.test(d)) return 'MacBook';
  if (/\bIMAC\b|iMac\b/i.test(d)) return 'iMac';
  if (/\biPhone\s+[\d\w]/i.test(d)) return 'iPhone';
  if (/\biPad\s+[\d\w]/i.test(d)) return 'iPad';
  if (/\bApple\s*Watch\b/i.test(d)) return 'Apple Watch';
  if (/\bMac\s*mini\b/i.test(d)) return 'Mac mini';
  // Плати, корпуси, дисплеї Mac — без явної моделі
  if (lower.includes('logic board') || lower.includes('macbook') || lower.includes('bottom case') || lower.includes('heat sink') && lower.includes('mac')) return 'MacBook / плати';
  if (lower.includes('imac') || lower.includes('lcd') && (lower.includes('27') || lower.includes('24') || lower.includes('21'))) return 'iMac';
  if (lower.includes('display') && (lower.includes('refill') || lower.includes('kit')) && !lower.includes('iphone')) return 'Запчастини (Display/Kit)';
  return 'Інше';
}

export const ExchangePriceListModal: React.FC<ExchangePriceListModalProps> = ({
  exchangePrices,
  meta,
  onClose
}) => {
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<SortKey>('article');
  const [sortAsc, setSortAsc] = React.useState(true);
  const [uploadedPrices, setUploadedPrices] = React.useState<Record<string, ExchangePrice>>({});
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [fallbackPrices, setFallbackPrices] = React.useState<Record<string, ExchangePrice>>({});
  const [loadingFallback, setLoadingFallback] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedProduct, setSelectedProductState] = React.useState<string>(() => {
    try {
      return sessionStorage.getItem('nexx_exchange_ua_product') || 'Все';
    } catch {
      return 'Все';
    }
  });
  const setSelectedProduct = React.useCallback((product: string) => {
    setSelectedProductState(product);
    try {
      sessionStorage.setItem('nexx_exchange_ua_product', product);
    } catch (_) {}
  }, []);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const mergedPrices = React.useMemo(
    () => ({ ...exchangePrices, ...fallbackPrices, ...uploadedPrices }),
    [exchangePrices, fallbackPrices, uploadedPrices]
  );

  // Если при открытии модалки данных нет — подгружаем /data/apple-exchange-ua.json один раз
  const fallbackFetchedRef = React.useRef(false);
  React.useEffect(() => {
    const hasData = Object.keys(exchangePrices).length > 0 || Object.keys(fallbackPrices).length > 0 || Object.keys(uploadedPrices).length > 0;
    if (hasData || loadingFallback || fallbackFetchedRef.current) return;
    fallbackFetchedRef.current = true;
    setLoadingFallback(true);
    fetch('/data/apple-exchange-ua.json?t=' + Date.now())
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.prices && typeof data.prices === 'object') {
          setFallbackPrices(data.prices);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingFallback(false));
  }, [exchangePrices, fallbackPrices, uploadedPrices, loadingFallback]);

  const list = React.useMemo(() => {
    return Object.entries(mergedPrices).map(([article, p]) => ({
      article,
      description: p.description || '',
      product: extractProduct(p.description || ''),
      price_stock_uah: p.price_stock_uah ?? 0,
      price_exchange_uah: p.price_exchange_uah ?? 0,
      price_full_uah: p.price_full_uah ?? 0
    }));
  }, [mergedPrices]);

  const products = React.useMemo(() => {
    const set = new Set(list.map((r) => r.product));
    return ['Все', ...Array.from(set).sort((a, b) => (a === 'Інше' ? 1 : b === 'Інше' ? -1 : a.localeCompare(b)))];
  }, [list]);

  // Если сохранённый продукт больше не в списке (другие данные) — сброс на «Все»
  React.useEffect(() => {
    if (selectedProduct !== 'Все' && products.length > 1 && !products.includes(selectedProduct)) {
      setSelectedProductState('Все');
      try {
        sessionStorage.setItem('nexx_exchange_ua_product', 'Все');
      } catch (_) {}
    }
  }, [products, selectedProduct]);

  const byProduct = React.useMemo(() => {
    if (!selectedProduct || selectedProduct === 'Все') return list;
    return list.filter((row) => row.product === selectedProduct);
  }, [list, selectedProduct]);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return byProduct;
    const q = search.toLowerCase().trim();
    return byProduct.filter(
      (row) =>
        row.article.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q)
    );
  }, [byProduct, search]);

  const sorted = React.useMemo(() => {
    const dir = sortAsc ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortBy === 'article') return dir * a.article.localeCompare(b.article);
      if (sortBy === 'description') return dir * a.description.localeCompare(b.description);
      if (sortBy === 'stock') return dir * (a.price_stock_uah - b.price_stock_uah);
      if (sortBy === 'exchange') return dir * (a.price_exchange_uah - b.price_exchange_uah);
      if (sortBy === 'full') return dir * ((a.price_full_uah ?? 0) - (b.price_full_uah ?? 0));
      return 0;
    });
  }, [filtered, sortBy, sortAsc]);

  // Сводка: у кого какие цены (по текущему списку)
  const priceSummary = React.useMemo(() => {
    const items = filtered;
    const withStock = items.filter((r) => r.price_stock_uah > 0).length;
    const withExchange = items.filter((r) => r.price_exchange_uah > 0).length;
    const withFull = items.filter((r) => (r.price_full_uah ?? 0) > 0).length;
    const max = Math.max(withStock, withExchange, withFull, 1);
    return { withStock, withExchange, withFull, total: items.length, max };
  }, [filtered]);

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    setFallbackPrices({});
    fallbackFetchedRef.current = false;
    fetch('/data/apple-exchange-ua.json?t=' + Date.now())
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.prices && typeof data.prices === 'object') {
          setFallbackPrices(data.prices);
        }
      })
      .catch(() => {})
      .finally(() => {
        setRefreshing(false);
      });
  }, []);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortAsc((v) => !v);
    else {
      setSortBy(key);
      setSortAsc(true);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    setUploadError(null);
    if (!file || !/\.xlsx?$/i.test(file.name)) {
      setUploadError('Выберите файл .xlsx');
      return;
    }
    try {
      const buf = await file.arrayBuffer();
      const XLSX = await import('xlsx');
      const wb = XLSX.read(new Uint8Array(buf), { type: 'array', cellDates: false });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(sheet as never, { header: 1, defval: '' }) as unknown[][];
      if (!raw.length) {
        setUploadError('Лист пустой');
        return;
      }
      const headers = (raw[0] as unknown[]).map((h) => String(h ?? '').trim());
      const colArt = findCol(headers, ARTICLE_KEYS);
      const colDesc = findCol(headers, DESC_KEYS);
      const colStock = findCol(headers, STOCK_KEYS);
      const colExchange = findCol(headers, EXCHANGE_KEYS);
      const colFull = findCol(headers, FULL_KEYS);
      if (colArt < 0 && colDesc < 0) {
        setUploadError('Нужна колонка Артикул или Опис. Заголовки: ' + headers.join(', '));
        return;
      }
      const prices: Record<string, ExchangePrice> = {};
      for (let i = 1; i < raw.length; i++) {
        const row = raw[i] as unknown[];
        const art = (row[colArt] != null ? String(row[colArt]).trim() : '').replace(/\s+/g, ' ') || null;
        const desc = (row[colDesc] != null ? String(row[colDesc]).trim() : '') || '';
        const priceStock = colStock >= 0 ? parseNum(row[colStock]) : 0;
        const priceExchange = colExchange >= 0 ? parseNum(row[colExchange]) : priceStock || 0;
        const priceFull = colFull >= 0 ? parseNum(row[colFull]) : 0;
        const key = art || `row-${i}`;
        if (!key || key.startsWith('row-')) continue;
        prices[key] = {
          description: desc || key,
          price_stock_uah: priceStock,
          price_exchange_uah: priceExchange,
          ...(priceFull > 0 && { price_full_uah: priceFull })
        };
      }
      setUploadedPrices(prices);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Ошибка чтения файла');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-amber-600 rounded-t-xl text-white">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Icons.Price /> Прайс Apple Official Украина
          </h2>
          {meta?.lastUpdated && (
            <p className="text-xs text-amber-100 mt-1">
              Оновлено: {meta.lastUpdated}
              {meta.source ? ` · ${meta.source}` : ''}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 rounded-lg text-sm font-medium transition-colors"
            title="Обновить данные с сервера"
          >
            {refreshing ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            )}
            <span>{refreshing ? 'Загрузка...' : 'Обновить'}</span>
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <Icons.Close />
          </button>
        </div>
      </div>

      {/* Белая область: кнопка вложения файла + инструкция */}
      <div className="px-4 pt-3 pb-3 bg-white border-b border-slate-200">
        <input
          id="exchange-ua-file-input"
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Вибрати файл .xlsx"
        />
        <label
          htmlFor="exchange-ua-file-input"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg border border-amber-600 shadow-sm transition-colors cursor-pointer inline-block"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span>Прикрепить файл (.xlsx)</span>
        </label>
        {uploadError && (
          <p className="mt-2 text-xs text-red-600">{uploadError}</p>
        )}
        {Object.keys(uploadedPrices).length > 0 && (
          <p className="mt-2 text-xs text-green-700">Загружено позиций: {Object.keys(uploadedPrices).length}. Данные отображаются в таблице ниже.</p>
        )}
      </div>

      <div className="px-4 pt-2 pb-2 bg-amber-50 border-b border-amber-200">
        <p className="text-xs font-semibold text-amber-800 mb-1">Или через терминал</p>
        <ol className="text-xs text-amber-900/90 list-decimal list-inside space-y-0.5">
          <li>Положите <strong>.xlsx</strong> в <code className="bg-amber-100 px-1 rounded">data/exchange-ua/</code></li>
          <li>Выполните: <code className="bg-amber-100 px-1 rounded">npm run import:exchange-ua</code></li>
          <li>Обновите страницу.</li>
        </ol>
      </div>

      {/* Сводка: у кого какие цены + мини-график (всегда видно) */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <p className="text-xs font-semibold text-slate-600 mb-2">У кого какие цены (позиций в текущем списке)</p>
        <div className="flex flex-wrap items-center gap-4 mb-3">
          <span className="inline-flex items-center gap-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <strong>Склад:</strong> {priceSummary.withStock} поз.
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <strong>Обмін:</strong> {priceSummary.withExchange} поз.
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <strong>Полная:</strong> {priceSummary.withFull} поз.
          </span>
          <span className="text-slate-500 text-sm">всього: {priceSummary.total}</span>
        </div>
        {/* Мини-график: три полосы — Склад / Обмін / Полная (всегда видно) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-slate-500">Склад</span>
            <div className="h-2 rounded bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-slate-500 rounded transition-all"
                style={{ width: `${priceSummary.total ? (priceSummary.withStock / priceSummary.total) * 100 : 0}%` }}
                title={`Склад: ${priceSummary.withStock} з ${priceSummary.total}`}
              />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-amber-600">Обмін</span>
            <div className="h-2 rounded bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded transition-all"
                style={{ width: `${priceSummary.total ? (priceSummary.withExchange / priceSummary.total) * 100 : 0}%` }}
                title={`Обмін: ${priceSummary.withExchange} з ${priceSummary.total}`}
              />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-emerald-600">Полная</span>
            <div className="h-2 rounded bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded transition-all"
                style={{ width: `${priceSummary.total ? (priceSummary.withFull / priceSummary.total) * 100 : 0}%` }}
                title={`Полная: ${priceSummary.withFull} з ${priceSummary.total}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Кнопки выбора продукта/модели */}
      {products.length > 1 && (
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
          <p className="text-xs font-semibold text-slate-600 mb-2">Модель / продукт</p>
          <div className="flex flex-wrap gap-2">
            {products.map((product) => (
              <button
                key={product}
                type="button"
                onClick={() => setSelectedProduct(product)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                  selectedProduct === product
                    ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                {product}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-white border-b border-slate-200 space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Пошук за артикулом або описом..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-slate-500">Сортування:</span>
          {(['article', 'description', 'stock', 'exchange', 'full'] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className={`px-2 py-1 rounded ${
                sortBy === key
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {key === 'article' && 'Артикул'}
              {key === 'description' && 'Запчасть'}
              {key === 'stock' && 'Склад'}
              {key === 'exchange' && 'Обмін'}
              {key === 'full' && 'Полная'}
              {sortBy === key && (sortAsc ? ' ↑' : ' ↓')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            {loadingFallback && list.length === 0
              ? 'Завантаження прайсу...'
              : list.length === 0
                ? 'Нет данных. Загрузите прайс по инструкции выше или прикрепите .xlsx.'
                : selectedProduct !== 'Все'
                  ? `Нет запчастей для «${selectedProduct}». Выберите другую модель или «Все».`
                  : 'Нічого не знайдено за пошуком'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 sticky top-0">
                <tr>
                  <th className="text-left p-2 font-semibold text-slate-700">Артикул</th>
                  <th className="text-left p-2 font-semibold text-slate-700">Запчасть</th>
                  <th className="text-right p-2 font-semibold text-slate-700">Склад, ₴</th>
                  <th className="text-right p-2 font-semibold text-slate-700">Обмін, ₴</th>
                  <th className="text-right p-2 font-semibold text-slate-700">Полная, ₴</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((row) => (
                  <tr
                    key={row.article}
                    className="border-b border-slate-100 hover:bg-amber-50/50"
                  >
                    <td className="p-2 font-mono text-slate-800">{row.article}</td>
                    <td className="p-2 text-slate-600 max-w-xs truncate" title={row.description}>
                      {row.description}
                    </td>
                    <td className="p-2 text-right font-medium text-slate-700">
                      {row.price_stock_uah > 0 ? `${row.price_stock_uah} ₴` : '—'}
                    </td>
                    <td className="p-2 text-right font-semibold text-amber-700">
                      {row.price_exchange_uah > 0 ? `${row.price_exchange_uah} ₴` : '—'}
                    </td>
                    <td className="p-2 text-right font-medium text-slate-600">
                      {row.price_full_uah && row.price_full_uah > 0 ? `${row.price_full_uah} ₴` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
