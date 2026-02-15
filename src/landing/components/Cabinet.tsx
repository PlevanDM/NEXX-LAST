import React, { useState, useEffect, useCallback } from 'react';

const CABINET_TOKEN_KEY = 'nexx_cabinet_token';

/* ── Status color helpers ── */
const STATUS_COLORS: Record<string, string> = {
  // Romanian status names from Remonline
  'nou': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'new': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'în lucru': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'in progress': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'în așteptare': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'waiting': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'finalizat': 'bg-green-500/20 text-green-300 border-green-500/30',
  'completed': 'bg-green-500/20 text-green-300 border-green-500/30',
  'done': 'bg-green-500/20 text-green-300 border-green-500/30',
  'predat': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'delivered': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'anulat': 'bg-red-500/20 text-red-300 border-red-500/30',
  'cancelled': 'bg-red-500/20 text-red-300 border-red-500/30',
  'urgent': 'bg-red-500/20 text-red-300 border-red-500/30',
  'diagnosticare': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'diagnostic': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const getStatusColor = (name: string) => {
  const lower = (name || '').toLowerCase().trim();
  for (const [key, cls] of Object.entries(STATUS_COLORS)) {
    if (lower.includes(key)) return cls;
  }
  return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

/* ── Phone formatter for Romanian numbers ── */
const formatPhoneInput = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('40')) {
    const local = digits.slice(2);
    if (local.length <= 3) return `+40 ${local}`;
    if (local.length <= 6) return `+40 ${local.slice(0, 3)} ${local.slice(3)}`;
    return `+40 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 9)}`;
  }
  if (digits.startsWith('0') && digits.length > 1) {
    const local = digits.slice(1);
    if (local.length <= 3) return `0${local}`;
    if (local.length <= 6) return `0${local.slice(0, 3)} ${local.slice(3)}`;
    return `0${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 9)}`;
  }
  return value;
};

/* ── Header/Footer wrappers ── */
const NEXXHeader = () => {
  const H = (window as any).NEXXDesign?.Header;
  return H ? React.createElement(H, { currentPage: 'cabinet' }) : null;
};
const NEXXFooter = () => {
  const F = (window as any).NEXXDesign?.Footer;
  return F ? React.createElement(F) : null;
};

/* ── Order Card ── */
const OrderCard: React.FC<{ order: any; statusName: (id: any) => string; formatDate: (v: any) => string; t: (k: string) => string }> = ({ order, statusName, formatDate, t }) => {
  const [expanded, setExpanded] = useState(false);
  const sName = statusName(order.status_id ?? order.status);
  const colorCls = getStatusColor(sName);

  return (
    <li className="rounded-2xl bg-gray-800/80 border border-gray-700/60 overflow-hidden transition-all hover:border-gray-600">
      {/* Header row */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 sm:p-5 flex flex-wrap items-center gap-3 sm:gap-4 text-left cursor-pointer hover:bg-gray-700/30 transition-colors"
      >
        {/* Order number */}
        <span className="font-mono text-blue-400 font-bold text-lg">#{order.id}</span>

        {/* Status badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorCls}`}>
          {sName}
        </span>

        {/* Device info */}
        {(order.kindof_good || order.brand || order.model) && (
          <span className="text-gray-300 text-sm flex items-center gap-1.5">
            <i className="fas fa-mobile-screen-button text-gray-500" />
            {[order.brand, order.kindof_good, order.model].filter(Boolean).join(' ')}
          </span>
        )}

        {/* Date */}
        <span className="text-gray-500 text-sm ml-auto flex items-center gap-1.5">
          <i className="fas fa-calendar text-gray-600" />
          {formatDate(order.created_at ?? order.date)}
        </span>

        {/* Expand arrow */}
        <i className={`fas fa-chevron-down text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-700/40 pt-4 space-y-3 animate-fade-in">
          {order.malfunction && (
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider">{t('problem')}</span>
              <p className="text-gray-200 mt-1">{order.malfunction}</p>
            </div>
          )}
          {order.estimated_cost != null && Number(order.estimated_cost) > 0 && (
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider">{t('estimatedCost')}</span>
              <p className="text-green-400 font-bold mt-1">{Number(order.estimated_cost).toFixed(0)} RON</p>
            </div>
          )}
          {order.manager_notes && (
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider">{t('notes')}</span>
              <p className="text-gray-300 mt-1 text-sm whitespace-pre-line">{order.manager_notes}</p>
            </div>
          )}
          {order.modified_at && (
            <div className="text-gray-500 text-xs flex items-center gap-1.5">
              <i className="fas fa-clock" />
              {t('lastUpdate')}: {formatDate(order.modified_at)}
            </div>
          )}
        </div>
      )}
    </li>
  );
};

/* ══════════════════════════════════
   CABINET MAIN COMPONENT
   ══════════════════════════════════ */
const Cabinet: React.FC = () => {
  const t = (key: string) => {
    const k = `cabinet.${key}`;
    const v = (window as any).i18n?.t?.(k);
    return (v && v !== k) ? v : key;
  };

  const [token, setToken] = useState<string | null | 'pending'>('pending');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CABINET_TOKEN_KEY);
    setToken(stored ? stored : null);
  }, []);

  const fetchOrders = useCallback(() => {
    const tkn = localStorage.getItem(CABINET_TOKEN_KEY);
    if (!tkn) return;
    setOrdersLoading(true);
    setError(null);
    fetch('/api/cabinet/orders', {
      headers: { Authorization: `Bearer ${tkn}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          setOrders([]);
          if (data.error === 'Unauthorized') {
            localStorage.removeItem(CABINET_TOKEN_KEY);
            setToken(null);
          }
        }
      })
      .catch(() => {
        setError(t('error'));
        setOrders([]);
      })
      .finally(() => setOrdersLoading(false));
  }, []);

  useEffect(() => {
    if (token !== null && token !== 'pending') {
      fetchOrders();
    }
  }, [token]);

  useEffect(() => {
    if (orders.length === 0) return;
    fetch('/api/remonline?action=get_statuses')
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || data || [];
        const map: Record<number, string> = {};
        (Array.isArray(list) ? list : []).forEach((s: any) => {
          if (s.id != null) map[s.id] = s.name || s.title || String(s.id);
        });
        setStatuses(map);
      })
      .catch(() => {});
  }, [orders.length]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = (phone || '').replace(/\s/g, '').trim();
    if (!raw || raw.replace(/\D/g, '').length < 9) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/cabinet/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: raw })
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem(CABINET_TOKEN_KEY, data.token);
        setToken(data.token);
      } else {
        setError(data.error === 'Client not found' || data.code === 'NOT_FOUND' ? t('notFound') : (data.error || t('error')));
      }
    } catch {
      setError(t('error'));
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(CABINET_TOKEN_KEY);
    setToken(null);
    setOrders([]);
    setPhone('');
    setError(null);
  };

  const formatDate = (v: any) => {
    if (!v) return '\u2014';
    const d = new Date(typeof v === 'number' && v < 1e12 ? v * 1000 : v);
    return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const statusName = (id: any) => statuses[Number(id)] ?? (id != null ? String(id) : '\u2014');

  /* ── Loading state ── */
  if (token === 'pending') {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <NEXXHeader />
        <div className="pt-28 sm:pt-32 pb-16 px-4 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <span className="inline-block w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden />
            <span className="text-gray-400">{t('loading')}</span>
          </div>
        </div>
        <NEXXFooter />
      </div>
    );
  }

  /* ── Login screen ── */
  if (token === null) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col">
        <NEXXHeader />
        <div className="flex-1 flex items-center justify-center px-4 pt-28 sm:pt-32 pb-16">
          <div className="w-full max-w-md">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <i className="fas fa-user text-3xl text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">{t('title')}</h1>
            <p className="text-gray-400 mb-8 text-center">{t('login')}</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  <i className="fas fa-phone text-gray-500 mr-1.5" />
                  {t('phonePlaceholder')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(formatPhoneInput(e.target.value)); setError(null); }}
                  placeholder="+40 7XX XXX XXX"
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-colors text-lg"
                  autoComplete="tel"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-sm flex items-start gap-2" role="alert">
                  <i className="fas fa-circle-exclamation mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 text-lg transition-colors shadow-lg"
              >
                {loading && <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? t('loading') : t('submit')}
              </button>
            </form>

            {/* Hint for first-time visitors */}
            <div className="mt-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 text-center">
              <p className="text-gray-400 text-sm">
                <i className="fas fa-circle-info text-blue-400 mr-1.5" />
                {t('firstVisitHint')}
              </p>
            </div>

            <p className="mt-6 text-center">
              <a href="/" className="text-blue-400 hover:text-blue-300 text-sm">
                <i className="fas fa-arrow-left mr-1" />
                {t('backToHome')}
              </a>
            </p>
          </div>
        </div>
        <NEXXFooter />
      </div>
    );
  }

  /* ── Orders dashboard ── */
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <NEXXHeader />
      <div className="flex-1 pt-28 sm:pt-32 pb-16 px-3 sm:px-4">
        <div className="max-w-3xl mx-auto">
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{t('myOrders')}</h1>
              <p className="text-gray-500 text-sm mt-1">{orders.length} {orders.length === 1 ? 'comanda' : 'comenzi'}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchOrders}
                disabled={ordersLoading}
                className="px-4 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50 flex items-center gap-2 transition-colors"
                title={t('refresh')}
              >
                <i className={`fas fa-rotate-right ${ordersLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{t('refresh')}</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-2 transition-colors"
              >
                <i className="fas fa-right-from-bracket" />
                <span className="hidden sm:inline">{t('logout')}</span>
              </button>
            </div>
          </div>

          {/* Content */}
          {ordersLoading ? (
            <div className="flex flex-col items-center gap-4 py-16">
              <span className="inline-block w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden />
              <span className="text-gray-400">{t('loading')}</span>
            </div>
          ) : error ? (
            <div className="p-5 rounded-2xl bg-red-900/20 border border-red-700/50 text-red-300">
              <p className="flex items-center gap-2"><i className="fas fa-circle-exclamation" /> {error}</p>
              <button type="button" onClick={fetchOrders} className="mt-3 text-blue-400 hover:underline text-sm">{t('refresh')}</button>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-10 rounded-2xl bg-gray-800/50 border border-gray-700/50 text-center">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-inbox text-3xl text-gray-500" />
              </div>
              <p className="text-gray-400 mb-4 text-lg">{t('noOrdersYet')}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="/#appointment" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors inline-flex items-center gap-2">
                  <i className="fas fa-calendar-plus" />
                  {t('bookRepair')}
                </a>
                <a href="/" className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors inline-flex items-center gap-2">
                  <i className="fas fa-arrow-left" />
                  {t('backToHome')}
                </a>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {orders.map((order: any) => (
                <OrderCard key={order.id} order={order} statusName={statusName} formatDate={formatDate} t={t} />
              ))}
            </ul>
          )}
        </div>
      </div>
      <NEXXFooter />
    </div>
  );
};

export default Cabinet;
