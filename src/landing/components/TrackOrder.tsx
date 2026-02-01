import React, { useState } from 'react';

const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const t = (key: string) => window.i18n?.t(key) || key;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = (orderId || '').trim();
    if (!id) return;
    setLoading(true); setError(null); setOrder(null);
    try {
      const [orderRes, statusesRes] = await Promise.all([
        fetch('/api/remonline?action=get_order&id=' + encodeURIComponent(id)),
        fetch('/api/remonline?action=get_statuses')
      ]);
      const orderJson = await orderRes.json();
      const statusesJson = await statusesRes.json();
      const statusList = statusesJson.data || statusesJson || [];
      setStatuses(Array.isArray(statusList) ? statusList : []);
      if (orderJson.success && orderJson.data) {
        setOrder(orderJson.data);
      } else {
        setError(t('trackOrder.notFound'));
      }
    } catch (err: any) {
      setError(err.message || t('trackOrder.notFound'));
    }
    setLoading(false);
  };

  const statusName = (id: any) => {
    if (!id || !statuses.length) return String(id || '—');
    const s = statuses.find(x => x.id === id || x.id === Number(id));
    return (s && (s.name || s.title)) || String(id);
  };

  return (
    <section id="track-order" className="py-16 md:py-24 px-4 bg-gray-900/90 overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-search-location text-3xl text-blue-500"></i>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('trackOrder.title')}</h2>
          <p className="text-gray-400 text-lg">{t('trackOrder.subtitle')}</p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <i className="fas fa-hashtag absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder={t('trackOrder.placeholder')}
                className="w-full pl-12 pr-4 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg active:scale-95"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-search"></i>
              )}
              {loading ? t('trackOrder.loading') : t('trackOrder.button')}
            </button>
          </form>
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 font-medium animate-fade-in">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
          
          {order && (
            <div className="bg-gray-900/50 border border-blue-500/20 rounded-2xl p-6 md:p-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">{t('trackOrder.device')}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                      <i className="fas fa-mobile-alt"></i>
                    </div>
                    <p className="text-white font-bold text-lg">
                      {[order.kindof_good, order.brand, order.model].filter(Boolean).join(' ') || '—'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">{t('trackOrder.status')}</p>
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-green-400 font-bold">{statusName(order.status_id)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrackOrder;
