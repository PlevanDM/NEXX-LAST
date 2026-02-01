import React, { useState, useEffect } from 'react';

const RemonlineServices: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const t = (key: string) => window.i18n?.t(key) || key;

  useEffect(() => {
    fetch('/api/remonline?action=get_services')
      .then(r => r.json())
      .then(data => {
        const arr = data.data || data.services || (Array.isArray(data) ? data : []);
        setList(Array.isArray(arr) ? arr : []);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="remonline-services" className="py-16 md:py-24 px-4 bg-black overflow-x-hidden">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">{t('remonlineServices.loading')}</p>
        </div>
      </section>
    );
  }

  if (!list.length) return null;

  const items = list.map((s, i) => {
    const name = s.name || s.title || s.service_name || (typeof s === 'string' ? s : null);
    if (!name) return null;
    return (
      <div 
        key={i} 
        className="group px-6 py-4 bg-gray-900 border border-gray-800 hover:border-blue-500/30 rounded-2xl text-white transition-all hover:bg-gray-800 flex items-center gap-4"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-blue-600/20 flex items-center justify-center text-gray-500 group-hover:text-blue-400 transition-colors">
          <i className="fas fa-check text-xs"></i>
        </div>
        <span className="font-medium text-sm md:text-base">{name}</span>
      </div>
    );
  }).filter(Boolean);

  return (
    <section id="remonline-services" className="py-16 md:py-24 px-4 bg-black overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('remonlineServices.title')}</h2>
          <p className="text-gray-400 text-lg">{t('remonlineServices.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.length ? items : (
            <p className="text-gray-400 col-span-full text-center py-12 bg-gray-900 rounded-3xl border border-dashed border-gray-700">
              {t('remonlineServices.empty')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RemonlineServices;
