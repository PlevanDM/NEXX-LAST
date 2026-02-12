import React, { useState, useEffect, useCallback } from 'react';

const CABINET_TOKEN_KEY = 'nexx_cabinet_token';

const Cabinet: React.FC = () => {
  const t = (key: string) => {
    const k = `cabinet.${key}`;
    return (window as any).i18n?.t?.(k) ?? key;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const raw = (phone || '').trim();
    if (!raw) return;
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
    if (!v) return '—';
    const d = new Date(v);
    return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
  };

  const statusName = (id: any) => statuses[Number(id)] ?? (id != null ? String(id) : '—');

  if (token === 'pending') {
    return (
      <div className="min-h-screen bg-slate-900 text-white pt-20 sm:pt-28 pb-12 sm:pb-16 px-3 sm:px-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="inline-block w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden />
          <span className="text-gray-400">{t('loading')}</span>
        </div>
      </div>
    );
  }

  if (token === null) {
    return (
      <div className="min-h-screen bg-slate-900 text-white pt-20 sm:pt-28 pb-12 sm:pb-16 px-3 sm:px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-gray-400 mb-8">{t('login')}</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(null); }}
              placeholder={t('phonePlaceholder')}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-colors"
              autoComplete="tel"
              disabled={loading}
            />
            {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? t('loading') : t('submit')}
            </button>
          </form>
          <p className="mt-6 text-center">
            <a href="/" className="text-blue-400 hover:text-blue-300">{t('backToHome')}</a>
            <span className="mx-2 text-gray-500">|</span>
            <a href="/#track-order" className="text-blue-400 hover:text-blue-300">{t('trackOrder')}</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20 sm:pt-28 pb-12 sm:pb-16 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">{t('myOrders')}</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchOrders}
              disabled={ordersLoading}
              className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50 flex items-center gap-2"
              title={t('refresh')}
            >
              <i className="fas fa-rotate-right" />
              <span className="hidden sm:inline">{t('refresh')}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white"
            >
              {t('logout')}
            </button>
          </div>
        </div>
        {ordersLoading ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <span className="inline-block w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden />
            <span className="text-gray-400">{t('loading')}</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-900/20 border border-red-700 text-red-300">
            <p>{error}</p>
            <button type="button" onClick={fetchOrders} className="mt-3 text-blue-400 hover:underline">{t('refresh')}</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 rounded-xl bg-gray-800 border border-gray-700 text-center">
            <p className="text-gray-400 mb-4">{t('noOrdersYet')}</p>
            <a href="/#track-order" className="text-blue-400 hover:text-blue-300">{t('trackOrder')}</a>
            <span className="mx-2 text-gray-500">|</span>
            <a href="/" className="text-blue-400 hover:text-blue-300">{t('backToHome')}</a>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order: any) => (
              <li
                key={order.id}
                className="p-4 rounded-xl bg-gray-800 border border-gray-700 flex flex-wrap gap-4 items-center justify-between"
              >
                <span className="font-mono text-blue-300">#{order.id}</span>
                <span>{statusName(order.status_id ?? order.status)}</span>
                <span className="text-gray-400">{formatDate(order.created_at ?? order.date)}</span>
                <a href={`/#track-order`} className="text-blue-400 hover:text-blue-300 text-sm">{t('trackOrder')}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Cabinet;
