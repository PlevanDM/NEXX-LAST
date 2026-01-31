import React from 'react';
import { Icons } from './Icons';
import { useTranslation } from '../hooks/useTranslation';

const STORAGE_KEY = 'nexx_power_price_history';

export interface PowerStationOffer {
  supplier: string;
  price: number;
  currency?: string;
  note?: string;
  region?: 'EU' | 'UA';
}

export interface PriceRecord {
  date: string;
  price_eu: number;
  price_ua?: number;
}

export interface TodoItem {
  id: string;
  productId: string;
  deadline?: string; // YYYY-MM-DD, SLA
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
      region: o.region
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

function getPriceHistory(id: string): PriceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data: Record<string, PriceRecord[]> = JSON.parse(raw);
    return (data[id] || []).slice(-20).sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

function savePriceRecord(id: string, record: PriceRecord) {
  const data: Record<string, PriceRecord[]> = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (!data[id]) data[id] = [];
  data[id].push(record);
  data[id] = data[id].slice(-30);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function getTodos(): { watch: TodoItem[]; buy: TodoItem[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TODOS);
    if (!raw) return { watch: [], buy: [] };
    const data = JSON.parse(raw);
    return { watch: data.watch || [], buy: data.buy || [] };
  } catch {
    return { watch: [], buy: [] };
  }
}

function saveTodos(todos: { watch: TodoItem[]; buy: TodoItem[] }) {
  localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
}

function addTodo(list: 'watch' | 'buy', productId: string, deadline?: string, note?: string): TodoItem {
  const todos = getTodos();
  const item: TodoItem = {
    id: productId + '-' + Date.now(),
    productId,
    deadline,
    note,
    createdAt: todayISO()
  };
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

const AddPriceRecordModal: React.FC<{
  station: PowerStation;
  onClose: () => void;
  onSave: (record: PriceRecord) => void;
}> = ({ station, onClose, onSave }) => {
  const [date, setDate] = React.useState(todayISO());
  const [priceEu, setPriceEu] = React.useState(String(minEuOffer(normalizeOffers(station))?.price ?? station.price_eu));
  const [priceUa, setPriceUa] = React.useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eu = parseFloat(priceEu.replace(',', '.'));
    if (Number.isFinite(eu)) {
      onSave({ date, price_eu: eu, price_ua: priceUa ? parseFloat(priceUa.replace(',', '.')) : undefined });
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
        <h3 className="font-bold text-slate-900 mb-1">Записати ціну</h3>
        <p className="text-sm text-slate-500 mb-4 truncate">{station.name}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Дата</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">ЄС (орієнтир) €</label>
            <input type="text" inputMode="decimal" value={priceEu} onChange={(e) => setPriceEu(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="1360" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">UA € (необовʼязково)</label>
            <input type="text" inputMode="decimal" value={priceUa} onChange={(e) => setPriceUa(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="—" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700">Скасувати</button>
            <button type="submit" className="flex-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium">Зберегти</button>
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(deadline || undefined, note || undefined);
  };
  const label = list === 'watch' ? 'Слідкувати' : 'Купити';
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
        <h3 className="font-bold text-slate-900 mb-1">Додати в список: {label}</h3>
        <p className="text-sm text-slate-500 mb-4 truncate">{station.name}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Дедлайн (SLA) — необовʼязково</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Примітка</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Перевірити ціну до..." />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700">Скасувати</button>
            <button type="submit" className="flex-1 px-3 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-medium">Додати</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const PowerStationTracker: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const [stations, setStations] = React.useState<PowerStation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = React.useState(false);

  const loadStations = React.useCallback(() => {
    return fetch('/data/power-stations.json?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        setStations(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error('Error loading power stations:', err));
  }, []);

  React.useEffect(() => {
    setLoading(true);
    loadStations().finally(() => setLoading(false));
  }, [loadStations]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadStations().finally(() => setRefreshing(false));
  };

  const filteredStations = React.useMemo(() =>
    stations.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.brand.toLowerCase().includes(search.toLowerCase()) ||
      (s.model && s.model.toLowerCase().includes(search.toLowerCase()))
    ),
    [stations, search]
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const { totalFromBest, totalAtEuBase, savings } = React.useMemo(() => {
    let fromBest = 0;
    let atEu = 0;
    filteredStations.forEach(s => {
      if (!selectedIds.has(s.id)) return;
      const offers = normalizeOffers(s);
      const best = minOffer(offers);
      if (best) fromBest += best.price;
      atEu += s.price_eu;
    });
    return {
      totalFromBest: fromBest,
      totalAtEuBase: atEu,
      savings: atEu - fromBest
    };
  }, [filteredStations, selectedIds]);

  const categories = React.useMemo(() => {
    const set = new Set(stations.map(s => s.category));
    return ['Всі', ...Array.from(set).sort()];
  }, [stations]);

  const [categoryFilter, setCategoryFilter] = React.useState<string>('Всі');
  const [sortBy, setSortBy] = React.useState<'name' | 'priceMin' | 'category'>('name');
  const [viewMode, setViewMode] = React.useState<'cards' | 'compact' | 'eu-reference' | 'lists'>('cards');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [addRecordFor, setAddRecordFor] = React.useState<PowerStation | null>(null);
  const [priceHistoryKey, setPriceHistoryKey] = React.useState(0);
  const [todos, setTodos] = React.useState<{ watch: TodoItem[]; buy: TodoItem[] }>(() => getTodos());
  const [addTodoFor, setAddTodoFor] = React.useState<{ station: PowerStation; list: 'watch' | 'buy' } | null>(null);
  const [autoRecording, setAutoRecording] = React.useState(false);

  const filteredByCategory = React.useMemo(() => {
    if (!categoryFilter || categoryFilter === 'Всі') return filteredStations;
    return filteredStations.filter(s => s.category === categoryFilter);
  }, [filteredStations, categoryFilter]);

  const sortedStations = React.useMemo(() => {
    const list = [...filteredByCategory];
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'category') list.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    if (sortBy === 'priceMin') {
      list.sort((a, b) => {
        const bestA = minOffer(normalizeOffers(a))?.price ?? a.price_eu;
        const bestB = minOffer(normalizeOffers(b))?.price ?? b.price_eu;
        return bestA - bestB;
      });
    }
    return list;
  }, [filteredByCategory, sortBy]);

  const selectAllVisible = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      sortedStations.forEach(s => next.add(s.id));
      return next;
    });
  };
  const clearSelection = () => setSelectedIds(new Set());

  /** Авто-запись истории: поточні ЄС ціни для обраних (або всіх видимих) */
  const autoRecordCurrentPrices = () => {
    const ids = selectedIds.size > 0 ? sortedStations.filter(s => selectedIds.has(s.id)) : sortedStations;
    const today = todayISO();
    setAutoRecording(true);
    ids.forEach(station => {
      const offers = normalizeOffers(station);
      const euMin = minEuOffer(offers);
      const priceEu = euMin?.price ?? station.price_eu;
      savePriceRecord(station.id, { date: today, price_eu: priceEu });
    });
    setPriceHistoryKey(k => k + 1);
    setTimeout(() => setAutoRecording(false), 500);
  };

  const refreshTodos = () => setTodos(getTodos());

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h2 className="font-bold text-slate-900">{t('tracker.powerTitle', 'Power Tracker')}</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{t('tracker.marketAnalysis', 'База поставщиків · реальний розрахунок')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
            title="Обновить базу поставщиков"
          >
            {refreshing ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            )}
            <span>{refreshing ? '...' : 'Обновить'}</span>
          </button>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <Icons.Close />
          </button>
        </div>
      </div>

      {/* Раннє попередження: ЄС = орієнтир */}
      <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden>⚠️</span>
          <div>
            <h3 className="font-bold text-amber-900 text-sm">Ціни в Європі змінюються першими</h3>
            <p className="text-xs text-amber-800 mt-0.5">
              Слідкуйте за цінами в ЄС (орієнтир) — зміни зазвичай приходять у країну з затримкою. Записуйте ЄС і локальні ціни в «Історію цін», щоб бачити тренд і встигати реагувати.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-b space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder={t('tracker.searchPlaceholder', 'Пошук EcoFlow, Bluetti...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-xl transition-all text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">{sortedStations.length} товарів</span>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-semibold text-slate-500">Категорія:</span>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${categoryFilter === cat ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
          <span className="text-xs font-semibold text-slate-500 ml-2">Сортування:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'priceMin' | 'category')}
            className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="name">За назвою</option>
            <option value="priceMin">За ціною (мін.)</option>
            <option value="category">За категорією</option>
          </select>
          <span className="text-xs font-semibold text-slate-500 ml-2">Вид:</span>
          <div className="flex gap-1">
            <button type="button" onClick={() => setViewMode('cards')} className={`px-2 py-1 rounded-lg text-xs font-medium ${viewMode === 'cards' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Картки</button>
            <button type="button" onClick={() => setViewMode('compact')} className={`px-2 py-1 rounded-lg text-xs font-medium ${viewMode === 'compact' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Компакт</button>
            <button type="button" onClick={() => setViewMode('eu-reference')} className={`px-2 py-1 rounded-lg text-xs font-medium ${viewMode === 'eu-reference' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>ЄС</button>
            <button type="button" onClick={() => { setViewMode('lists'); refreshTodos(); }} className={`px-2 py-1 rounded-lg text-xs font-medium ${viewMode === 'lists' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Списки</button>
          </div>
          <button type="button" onClick={autoRecordCurrentPrices} disabled={autoRecording || sortedStations.length === 0} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white" title="Записати поточні ЄС ціни для всіх (або обраних)">
            {autoRecording ? '...' : 'Авто-запис'}
          </button>
          <div className="ml-auto flex gap-1">
            <button type="button" onClick={selectAllVisible} className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
              Обрати всі
            </button>
            <button type="button" onClick={clearSelection} className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
              Скинути
            </button>
          </div>
        </div>
        {selectedIds.size > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 px-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase">Обрано</div>
              <div className="text-sm font-black text-emerald-800">{selectedIds.size} товарів</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase">Разом (по мін.)</div>
              <div className="text-lg font-black text-emerald-700">{totalFromBest} €</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-600 uppercase">Економія</div>
              <div className="text-lg font-black text-amber-700">{savings > 0 ? `−${savings} €` : '0 €'}</div>
              {totalAtEuBase > 0 && (
                <div className="text-[10px] text-slate-500">було б {totalAtEuBase} € по EU</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Модалка "Додати в список" (дедлайн SLA) */}
      {addTodoFor && (
        <AddTodoModal
          station={addTodoFor.station}
          list={addTodoFor.list}
          onClose={() => setAddTodoFor(null)}
          onSave={(deadline?, note?) => {
            addTodo(addTodoFor.list, addTodoFor.station.id, deadline, note);
            refreshTodos();
            setAddTodoFor(null);
          }}
        />
      )}

      {/* Модалка "Записати ціну" */}
      {addRecordFor && (
        <AddPriceRecordModal
          station={addRecordFor}
          onClose={() => { setAddRecordFor(null); setPriceHistoryKey(k => k + 1); }}
          onSave={(record) => {
            savePriceRecord(addRecordFor.id, record);
            setAddRecordFor(null);
            setPriceHistoryKey(k => k + 1);
          }}
        />
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : viewMode === 'compact' ? (
          <div className="space-y-1">
            {sortedStations.map((station) => {
              const offers = normalizeOffers(station);
              const best = minOffer(offers);
              return (
                <div key={station.id} className="flex items-center justify-between gap-3 py-2 px-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-slate-800">{station.name}</span>
                    <span className="ml-2 text-[10px] text-slate-500 uppercase">{station.category}</span>
                  </div>
                  <div className="font-bold text-emerald-600 flex-shrink-0">{best?.price ?? station.price_eu} €</div>
                  <button type="button" onClick={() => setAddRecordFor(station)} className="px-2 py-1 bg-slate-100 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-medium flex-shrink-0">
                    Записати
                  </button>
                </div>
              );
            })}
          </div>
        ) : viewMode === 'lists' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <h3 className="px-4 py-3 bg-violet-50 border-b border-violet-200 font-bold text-violet-800 text-sm">👁 Слідкувати</h3>
              <ul className="divide-y divide-slate-100">
                {todos.watch.length === 0 && <li className="px-4 py-6 text-slate-500 text-sm text-center">Порожньо. Додайте з картки товару.</li>}
                {todos.watch.map(t => {
                  const station = stations.find(s => s.id === t.productId);
                  const overdue = isOverdue(t.deadline);
                  return (
                    <li key={t.id} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-slate-800">{station?.name ?? t.productId}</span>
                        {t.deadline && (
                          <span className={`ml-2 text-xs font-mono ${overdue ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                            {overdue ? '⚠ прострочено ' : 'до '}{t.deadline}
                          </span>
                        )}
                        {t.note && <p className="text-xs text-slate-500 mt-0.5">{t.note}</p>}
                      </div>
                      <button type="button" onClick={() => { removeTodo('watch', t.id); refreshTodos(); }} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs">Видалити</button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <h3 className="px-4 py-3 bg-emerald-50 border-b border-emerald-200 font-bold text-emerald-800 text-sm">🛒 Купити</h3>
              <ul className="divide-y divide-slate-100">
                {todos.buy.length === 0 && <li className="px-4 py-6 text-slate-500 text-sm text-center">Порожньо. Додайте з картки товару.</li>}
                {todos.buy.map(t => {
                  const station = stations.find(s => s.id === t.productId);
                  const overdue = isOverdue(t.deadline);
                  return (
                    <li key={t.id} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-slate-800">{station?.name ?? t.productId}</span>
                        {t.deadline && (
                          <span className={`ml-2 text-xs font-mono ${overdue ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                            {overdue ? '⚠ прострочено ' : 'до '}{t.deadline}
                          </span>
                        )}
                        {t.note && <p className="text-xs text-slate-500 mt-0.5">{t.note}</p>}
                      </div>
                      <button type="button" onClick={() => { removeTodo('buy', t.id); refreshTodos(); }} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs">Видалити</button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : viewMode === 'eu-reference' ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="px-4 py-3 font-bold text-slate-700">Товар</th>
                  <th className="px-4 py-3 font-bold text-amber-700">ЄС (орієнтир) €</th>
                  <th className="px-4 py-3 font-bold text-slate-600">UA (остання) €</th>
                  <th className="px-4 py-3 font-bold text-slate-600 w-28">Дія</th>
                </tr>
              </thead>
              <tbody>
                {sortedStations.map((station) => {
                  const offers = normalizeOffers(station);
                  const euMin = minEuOffer(offers);
                  const history = getPriceHistory(station.id);
                  const lastUA = history.find(h => h.price_ua != null)?.price_ua;
                  return (
                    <tr key={station.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-2">
                        <span className="font-bold text-slate-800">{station.name}</span>
                        <span className="ml-2 text-[10px] text-slate-500 uppercase">{station.category}</span>
                      </td>
                      <td className="px-4 py-2 font-black text-amber-700">{euMin?.price ?? station.price_eu} €</td>
                      <td className="px-4 py-2 font-semibold text-slate-700">{lastUA != null ? `${lastUA} €` : '—'}</td>
                      <td className="px-4 py-2">
                        <button type="button" onClick={() => setAddRecordFor(station)} className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium">
                          Записати
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : sortedStations.length > 0 ? (
          sortedStations.map((station) => {
            const offers = normalizeOffers(station);
            const best = minOffer(offers);
            const euMin = minEuOffer(offers);
            const isSelected = selectedIds.has(station.id);
            const history = getPriceHistory(station.id);
            const showHistory = expandedId === station.id;
            return (
              <div key={station.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-emerald-300 transition-all group">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleSelect(station.id)}
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-emerald-400'}`}
                      title={isSelected ? 'Прибрати з підсумку' : 'Додати до підсумку'}
                    >
                      {isSelected && <span className="text-xs">✓</span>}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded uppercase">{station.brand}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{station.category}</span>
                        {euMin && (euMin.region === 'EU' || !euMin.region) && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">ЄС орієнтир</span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{station.name}</h3>
                      {station.model && <p className="text-xs text-slate-500 font-mono mt-1">{station.model}</p>}
                      {station.specs && <p className="text-xs text-blue-600 font-medium mt-1">{station.specs}</p>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Від (мін.)</div>
                    <div className="text-xl font-black text-emerald-600">{best?.price ?? station.price_eu} {best?.currency || '€'}</div>
                    {best && best.supplier !== 'EU Base' && <div className="text-[10px] text-emerald-600 font-medium mt-0.5">{best.supplier}</div>}
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">База поставщиків</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-500 border-b border-slate-100">
                          <th className="pb-1.5 pr-2 font-medium">Поставщик</th>
                          <th className="pb-1.5 pr-2 font-medium text-right">Цена</th>
                          <th className="pb-1.5 font-medium text-right">Примітка</th>
                        </tr>
                      </thead>
                      <tbody>
                        {offers.map((offer, i) => {
                          const isBest = best?.price === offer.price && best?.supplier === offer.supplier;
                          return (
                            <tr key={i} className={isBest ? 'bg-emerald-50 border-l-2 border-emerald-500' : ''}>
                              <td className="py-1.5 pr-2 font-medium text-slate-800">
                                {offer.region === 'EU' ? '🇪🇺 ' : ''}{offer.supplier}
                              </td>
                              <td className="py-1.5 pr-2 text-right font-semibold text-slate-900">{offer.price} {offer.currency || '€'}</td>
                              <td className="py-1.5 text-right text-slate-500 text-xs">{offer.note ?? '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-dashed border-slate-100 grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                    <div className="text-[9px] text-slate-500 font-bold uppercase">Локально (орієнт.)</div>
                    <div className="text-sm font-bold text-slate-700">{Math.round(station.price_eu * 1.15)} €</div>
                    <div className="text-[9px] text-slate-400">+15% імпорт</div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-2 border border-amber-100">
                    <div className="text-[9px] text-amber-600 font-bold uppercase">Економія від мін.</div>
                    <div className="text-sm font-bold text-amber-700">{best ? Math.round(station.price_eu - best.price) : 0} €</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(showHistory ? null : station.id)}
                      className="text-[10px] font-bold text-slate-600 uppercase hover:text-emerald-600"
                    >
                      Історія {history.length > 0 && `(${history.length})`}
                    </button>
                    <button type="button" onClick={() => setAddRecordFor(station)} className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium">
                      Записати ціну
                    </button>
                    <button type="button" onClick={() => setAddTodoFor({ station, list: 'watch' })} className="px-2 py-1 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-lg text-xs font-medium">
                      Слідкувати
                    </button>
                    <button type="button" onClick={() => setAddTodoFor({ station, list: 'buy' })} className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-medium">
                      Купити
                    </button>
                  </div>
                  {showHistory && (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                      {history.length === 0 ? (
                        <p className="text-slate-500">Записів немає. Натисніть «Записати ціну» і вкажіть ЄС та UA — щоб бачити тренд.</p>
                      ) : (
                        <table className="w-full">
                          <thead>
                            <tr className="text-slate-500 border-b border-slate-200">
                              <th className="pb-1 pr-2 text-left">Дата</th>
                              <th className="pb-1 pr-2 text-right">ЄС €</th>
                              <th className="pb-1 text-right">UA €</th>
                            </tr>
                          </thead>
                          <tbody>
                            {history.slice(0, 10).map((r, i) => (
                              <tr key={i} className="border-b border-slate-100">
                                <td className="py-1 pr-2 font-mono">{r.date}</td>
                                <td className="py-1 pr-2 text-right font-semibold">{r.price_eu}</td>
                                <td className="py-1 text-right font-semibold">{r.price_ua ?? '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 text-slate-400">
            <div className="text-4xl mb-4">🔍</div>
            <p className="font-medium">{t('db.noResults', 'Нічого не знайдено')}</p>
            <p className="text-sm mt-2">Змініть пошук або категорію</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900 text-white rounded-t-3xl shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest">{t('tracker.liveStatus', 'База поставщиків')}</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {t('tracker.disclaimer', 'Ціни з офіційних та маркетплейсів (EU). Обирайте товари — підсумок рахується по мінімальній ціні у кожного.')}
        </p>
      </div>
    </div>
  );
};
