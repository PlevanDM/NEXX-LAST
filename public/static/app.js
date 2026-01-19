// NEXX Database - Apple Repair Database v6.6
// Enhanced with IC chips tab, power rails diagnostics, improved device cards
const { useState, useMemo, useEffect, useCallback, createElement: h } = React;

// ===== UTILITY FUNCTIONS =====
const cn = (...classes) => classes.filter(Boolean).join(' ');

const formatPrice = (price, currency = 'UAH') => {
  if (!price && price !== 0) return '—';
  if (currency === 'UAH') return `${Number(price).toLocaleString('uk-UA')} ₴`;
  if (currency === 'USD') return `$${Number(price).toFixed(2)}`;
  if (currency === 'EUR') return `€${Number(price).toFixed(2)}`;
  return `${Number(price).toFixed(2)}`;
};

// Currency conversion rates (approximate, update as needed)
const RATES = { UAH_TO_USD: 0.024, UAH_TO_EUR: 0.022, USD_TO_UAH: 41.5, EUR_TO_UAH: 45.0 };

const convertPrice = (price, from, to) => {
  if (!price) return null;
  if (from === to) return price;
  if (from === 'UAH' && to === 'USD') return price * RATES.UAH_TO_USD;
  if (from === 'UAH' && to === 'EUR') return price * RATES.UAH_TO_EUR;
  if (from === 'USD' && to === 'UAH') return price * RATES.USD_TO_UAH;
  if (from === 'EUR' && to === 'UAH') return price * RATES.EUR_TO_UAH;
  return price;
};

// ===== ICONS =====
const Icons = {
  Search: () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })),
  Back: () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M15 19l-7-7 7-7' })),
  Close: () => h('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M6 18L18 6M6 6l12 12' })),
  Chip: () => h('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' })),
  Board: () => h('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' })),
  Price: () => h('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })),
  Error: () => h('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' })),
  Calculator: () => h('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' })),
  Book: () => h('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' })),
  Tag: () => h('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' })),
};

const getCategoryIcon = (cat) => ({ 'iPhone': '📱', 'iPad': '📟', 'Mac': '💻', 'MacBook': '💻', 'Apple Watch': '⌚', 'AirPods': '🎧' }[cat] || '🔧');

// ===== MODAL WRAPPER =====
const Modal = ({ title, subtitle, onClose, children, color = 'indigo' }) => {
  const colors = {
    indigo: 'from-indigo-500 to-purple-600',
    green: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    red: 'from-red-500 to-rose-600',
    blue: 'from-blue-500 to-cyan-600',
    violet: 'from-violet-500 to-purple-600',
  };
  
  return h('div', { 
    className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm',
    onClick: (e) => e.target === e.currentTarget && onClose()
  },
    h('div', { className: 'bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200' },
      h('div', { className: `bg-gradient-to-r ${colors[color]} p-5 text-white` },
        h('div', { className: 'flex justify-between items-start' },
          h('div', null,
            h('h2', { className: 'text-xl font-bold' }, title),
            subtitle && h('p', { className: 'text-white/80 text-sm mt-1' }, subtitle)
          ),
          h('button', { 
            onClick: onClose, 
            className: 'w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors' 
          }, h(Icons.Close))
        )
      ),
      children
    )
  );
};

// ===== DETAIL MODAL (for clickable items) =====
const DetailModal = ({ item, type, onClose, ukrainePrices }) => {
  if (!item) return null;
  
  const getUkrainePrice = (article) => {
    if (!ukrainePrices || !article) return null;
    return ukrainePrices[article];
  };
  
  // Logic Board Detail
  if (type === 'board') {
    const uaPrice = getUkrainePrice(item.article);
    return h(Modal, { title: `🖥️ ${item.board_number || item.article}`, subtitle: item.model, onClose, color: 'violet' },
      h('div', { className: 'p-6 overflow-y-auto' },
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
          // Left column - Main info
          h('div', { className: 'space-y-4' },
            h('div', { className: 'bg-violet-50 rounded-xl p-4' },
              h('h3', { className: 'font-semibold text-violet-800 mb-3' }, '📋 Основная информация'),
              h('div', { className: 'space-y-2 text-sm' },
                item.article && h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-600' }, 'Артикул:'),
                  h('span', { className: 'font-mono font-bold text-violet-600' }, item.article)
                ),
                item.board_number && h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-600' }, 'Board Number:'),
                  h('span', { className: 'font-mono font-bold' }, item.board_number)
                ),
                item.model_number && h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-600' }, 'Model Number:'),
                  h('span', { className: 'font-bold' }, item.model_number)
                ),
                item.emc && h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-600' }, 'EMC:'),
                  h('span', { className: 'font-bold' }, item.emc)
                ),
                item.year && h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-600' }, 'Год:'),
                  h('span', { className: 'font-bold' }, item.year)
                ),
                item.architecture && h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-600' }, 'Архитектура:'),
                  h('span', { className: 'font-bold text-purple-600' }, item.architecture)
                )
              )
            ),
            
            // Specs if available
            item.specs && h('div', { className: 'bg-blue-50 rounded-xl p-4' },
              h('h3', { className: 'font-semibold text-blue-800 mb-3' }, '⚙️ Характеристики'),
              h('div', { className: 'space-y-2 text-sm' },
                item.specs.cpu_ghz && h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-600' }, 'CPU:'),
                  h('span', { className: 'font-bold' }, `${item.specs.cpu_ghz} GHz`)
                ),
                item.specs.ram_gb && h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-600' }, 'RAM:'),
                  h('span', { className: 'font-bold' }, `${item.specs.ram_gb} GB`)
                ),
                item.specs.storage_gb && h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-600' }, 'Storage:'),
                  h('span', { className: 'font-bold' }, `${item.specs.storage_gb} GB`)
                )
              )
            )
          ),
          
          // Right column - Prices
          h('div', { className: 'space-y-4' },
            h('div', { className: 'bg-green-50 rounded-xl p-4' },
              h('h3', { className: 'font-semibold text-green-800 mb-3' }, '💰 Цены'),
              h('div', { className: 'space-y-3' },
                // Ukraine price
                (uaPrice || item.price_uah) && h('div', { className: 'p-3 bg-yellow-100 rounded-lg' },
                  h('div', { className: 'flex items-center gap-2 mb-1' },
                    h('span', null, '🇺🇦'),
                    h('span', { className: 'font-semibold text-slate-700' }, 'Украина')
                  ),
                  h('p', { className: 'text-2xl font-bold text-yellow-700' }, 
                    formatPrice(uaPrice?.price_uah || item.price_uah, 'UAH')
                  ),
                  h('p', { className: 'text-sm text-slate-500' }, 
                    `≈ ${formatPrice(convertPrice(uaPrice?.price_uah || item.price_uah, 'UAH', 'USD'), 'USD')}`
                  )
                ),
                
                // USD price if available
                item.price_usd && h('div', { className: 'p-3 bg-blue-100 rounded-lg' },
                  h('div', { className: 'flex items-center gap-2 mb-1' },
                    h('span', null, '🇺🇸'),
                    h('span', { className: 'font-semibold text-slate-700' }, 'USD')
                  ),
                  h('p', { className: 'text-2xl font-bold text-blue-700' }, formatPrice(item.price_usd, 'USD'))
                )
              )
            ),
            
            // Description
            item.description && h('div', { className: 'bg-slate-50 rounded-xl p-4' },
              h('h3', { className: 'font-semibold text-slate-800 mb-2' }, '📝 Описание'),
              h('p', { className: 'text-sm text-slate-600' }, item.description)
            )
          )
        )
      )
    );
  }
  
  // Article/Part Detail
  if (type === 'article') {
    const uaPrice = getUkrainePrice(item.article);
    const uaPriceVal = uaPrice?.price_uah || item.price_uah;
    const euPriceVal = item.price_eur || (item.price_usd ? item.price_usd * 0.91 : null) || (uaPriceVal ? uaPriceVal * RATES.UAH_TO_EUR : null);
    const usdPriceVal = item.price_usd || (uaPriceVal ? uaPriceVal * RATES.UAH_TO_USD : null);
    
    // Calculate savings between UA and EU
    const savings = uaPriceVal && euPriceVal ? ((euPriceVal * RATES.EUR_TO_UAH) - uaPriceVal) : null;
    const savingsPercent = savings && euPriceVal ? Math.round((savings / (euPriceVal * RATES.EUR_TO_UAH)) * 100) : 0;
    
    return h(Modal, { title: `🔧 ${item.article}`, subtitle: item.description || item.label, onClose, color: 'green' },
      h('div', { className: 'p-6 overflow-y-auto' },
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
          h('div', { className: 'space-y-4' },
            h('div', { className: 'bg-emerald-50 rounded-xl p-4' },
              h('h3', { className: 'font-semibold text-emerald-800 mb-3' }, '📋 Информация'),
              h('div', { className: 'space-y-2 text-sm' },
                h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-600' }, 'Артикул:'),
                  h('span', { className: 'font-mono font-bold text-emerald-600' }, item.article)
                ),
                (item.type || item.label) && h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-600' }, 'Тип:'),
                  h('span', { className: 'font-bold capitalize' }, (item.label || item.type || '').replace('_', ' '))
                ),
                item.model && h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-600' }, 'Модель:'),
                  h('span', { className: 'font-bold' }, item.model)
                )
              )
            ),
            
            item.description && h('div', { className: 'bg-slate-50 rounded-xl p-4' },
              h('h3', { className: 'font-semibold text-slate-800 mb-2' }, '📝 Описание'),
              h('p', { className: 'text-sm text-slate-600' }, item.description)
            )
          ),
          
          h('div', { className: 'space-y-4' },
            h('div', { className: 'bg-green-50 rounded-xl p-4' },
              h('h3', { className: 'font-semibold text-green-800 mb-3' }, '💰 Сравнение цен'),
              h('div', { className: 'space-y-3' },
                // Ukraine price
                h('div', { className: 'p-3 bg-yellow-100 rounded-lg' },
                  h('div', { className: 'flex items-center gap-2 mb-1' },
                    h('span', null, '🇺🇦'),
                    h('span', { className: 'font-semibold text-slate-700' }, 'Украина')
                  ),
                  uaPriceVal 
                    ? h('div', null,
                        h('p', { className: 'text-2xl font-bold text-yellow-700' }, formatPrice(uaPriceVal, 'UAH')),
                        h('p', { className: 'text-sm text-slate-500' }, `≈ ${formatPrice(usdPriceVal, 'USD')}`)
                      )
                    : h('p', { className: 'text-slate-500' }, 'Цена не доступна')
                ),
                
                // EU price
                h('div', { className: 'p-3 bg-blue-100 rounded-lg' },
                  h('div', { className: 'flex items-center gap-2 mb-1' },
                    h('span', null, '🇪🇺'),
                    h('span', { className: 'font-semibold text-slate-700' }, 'Европа (Self-Repair)')
                  ),
                  euPriceVal 
                    ? h('div', null,
                        h('p', { className: 'text-2xl font-bold text-blue-700' }, formatPrice(euPriceVal, 'EUR')),
                        h('p', { className: 'text-sm text-slate-500' }, `≈ ${formatPrice(euPriceVal * RATES.EUR_TO_UAH, 'UAH')}`)
                      )
                    : h('p', { className: 'text-slate-500' }, 'Цена не доступна')
                ),
                
                // Savings comparison
                savings !== null && savings !== 0 && h('div', { 
                  className: cn('p-3 rounded-lg', savings > 0 ? 'bg-green-100' : 'bg-red-100')
                },
                  h('div', { className: 'flex items-center justify-between' },
                    h('span', { className: 'font-semibold text-slate-700' }, 
                      savings > 0 ? '💚 Экономия в UA:' : '⚠️ Дороже в UA:'
                    ),
                    h('span', { className: cn('font-bold', savings > 0 ? 'text-green-700' : 'text-red-700') },
                      `${savings > 0 ? '-' : '+'}${formatPrice(Math.abs(savings), 'UAH')} (${Math.abs(savingsPercent)}%)`
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }
  
  // IC Detail (ENHANCED)
  if (type === 'ic') {
    // Get IC category icon
    const getCategoryIcon = () => {
      const cat = item.category || '';
      if (cat.includes('charging')) return '⚡';
      if (cat.includes('power')) return '🔋';
      if (cat.includes('audio')) return '🔊';
      if (cat.includes('baseband')) return '📡';
      if (cat.includes('wifi') || cat.includes('bt')) return '📶';
      if (cat.includes('biometric')) return '👆';
      if (cat.includes('nand')) return '💾';
      return '🔌';
    };
    
    // Difficulty color and icon
    const getDifficultyBadge = () => {
      if (!item.difficulty) return null;
      const colors = {
        'Basic': { bg: 'bg-green-100', text: 'text-green-700', icon: '✅' },
        'Intermediate': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '⚠️' },
        'Advanced': { bg: 'bg-orange-100', text: 'text-orange-700', icon: '🔶' },
        'Expert': { bg: 'bg-red-100', text: 'text-red-700', icon: '🔴' }
      };
      const style = colors[item.difficulty] || colors['Advanced'];
      return { ...style, text: item.difficulty };
    };
    
    const diffBadge = getDifficultyBadge();
    
    return h(Modal, { title: `${getCategoryIcon()} ${item.name}`, subtitle: item.designation, onClose, color: 'violet' },
      h('div', { className: 'p-6 overflow-y-auto max-h-[70vh]' },
        // Header badges
        h('div', { className: 'flex flex-wrap gap-2 mb-6' },
          item.category && h('span', { className: 'px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold' }, 
            item.category.replace('_', ' ').replace('ics', 'IC')
          ),
          item.package && h('span', { className: 'px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-mono' }, 
            item.package
          ),
          diffBadge && h('span', { className: `px-3 py-1 ${diffBadge.bg} ${diffBadge.text} rounded-full text-sm font-semibold flex items-center gap-1` }, 
            diffBadge.icon, ' ', diffBadge.text
          ),
          item.price_range && h('span', { className: 'px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold' }, 
            `💰 ${item.price_range}`
          )
        ),
        
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
          // Left column
          h('div', { className: 'space-y-4' },
            // Main info
            h('div', { className: 'bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200' },
              h('h3', { className: 'font-bold text-violet-800 mb-3 flex items-center gap-2' }, 
                h('span', { className: 'w-8 h-8 bg-violet-200 rounded-lg flex items-center justify-center' }, '📋'),
                'Информация о микросхеме'
              ),
              h('div', { className: 'space-y-3 text-sm' },
                h('div', { className: 'p-2 bg-white/80 rounded-lg' },
                  h('span', { className: 'text-slate-500 text-xs' }, 'Микросхема'),
                  h('p', { className: 'font-mono font-bold text-lg text-violet-600' }, item.name)
                ),
                item.designation && h('div', { className: 'p-2 bg-white/80 rounded-lg' },
                  h('span', { className: 'text-slate-500 text-xs' }, 'Обозначение на плате'),
                  h('p', { className: 'font-semibold text-slate-800' }, item.designation)
                ),
                item.manufacturer && h('div', { className: 'flex justify-between items-center' },
                  h('span', { className: 'text-slate-600' }, 'Производитель:'),
                  h('span', { className: 'font-bold' }, item.manufacturer)
                )
              )
            ),
            
            // Functions
            item.functions?.length > 0 && h('div', { className: 'bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200' },
              h('h3', { className: 'font-bold text-blue-800 mb-3 flex items-center gap-2' }, 
                h('span', { className: 'w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center' }, '⚙️'),
                'Функции'
              ),
              h('ul', { className: 'space-y-2' },
                ...item.functions.map((f, i) => h('li', { key: i, className: 'text-sm text-slate-700 flex items-start gap-2 p-2 bg-white/60 rounded-lg' },
                  h('span', { className: 'text-blue-500 mt-0.5' }, '▸'), f
                ))
              )
            ),
            
            // Diagnostics
            item.diagnostics && h('div', { className: 'bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200' },
              h('h3', { className: 'font-bold text-green-800 mb-3 flex items-center gap-2' }, 
                h('span', { className: 'w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center' }, '🔍'),
                'Диагностика'
              ),
              h('div', { className: 'space-y-3' },
                item.diagnostics.diode_mode && h('div', { className: 'p-3 bg-white/80 rounded-lg' },
                  h('p', { className: 'font-semibold text-slate-700 mb-2 text-xs uppercase tracking-wide' }, '📊 Диодный режим'),
                  h('div', { className: 'grid grid-cols-2 gap-2' },
                    ...Object.entries(item.diagnostics.diode_mode).map(([key, val]) =>
                      h('div', { key, className: 'p-2 bg-green-100 rounded text-center' },
                        h('p', { className: 'text-xs text-green-600' }, key),
                        h('p', { className: 'font-mono font-bold text-green-800' }, val)
                      )
                    )
                  )
                ),
                (item.diagnostics.pp5v0_usb || item.diagnostics.pp_vdd_main || item.diagnostics.usb_pd) && h('div', { className: 'p-3 bg-white/80 rounded-lg' },
                  h('p', { className: 'font-semibold text-slate-700 mb-2 text-xs uppercase tracking-wide' }, '⚡ Напряжения'),
                  h('div', { className: 'space-y-1 text-sm' },
                    item.diagnostics.pp5v0_usb && h('div', { className: 'flex justify-between' },
                      h('span', { className: 'text-slate-600' }, 'PP5V0_USB:'),
                      h('span', { className: 'font-mono font-bold text-green-600' }, item.diagnostics.pp5v0_usb)
                    ),
                    item.diagnostics.pp_vdd_main && h('div', { className: 'flex justify-between' },
                      h('span', { className: 'text-slate-600' }, 'PP_VDD_MAIN:'),
                      h('span', { className: 'font-mono font-bold text-green-600' }, item.diagnostics.pp_vdd_main)
                    ),
                    item.diagnostics.usb_pd && h('div', { className: 'flex justify-between' },
                      h('span', { className: 'text-slate-600' }, 'USB-PD:'),
                      h('span', { className: 'font-mono font-bold text-green-600' }, item.diagnostics.usb_pd)
                    )
                  )
                ),
                item.diagnostics.current_draw && h('div', { className: 'p-3 bg-yellow-50 rounded-lg' },
                  h('p', { className: 'font-semibold text-slate-700 mb-1 text-xs uppercase tracking-wide' }, '🔌 Потребление тока'),
                  h('p', { className: 'font-mono text-yellow-700' }, item.diagnostics.current_draw)
                )
              )
            )
          ),
          
          // Right column
          h('div', { className: 'space-y-4' },
            // Symptoms when faulty
            item.symptoms_when_faulty?.length > 0 && h('div', { className: 'bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-200' },
              h('h3', { className: 'font-bold text-red-800 mb-3 flex items-center gap-2' }, 
                h('span', { className: 'w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center' }, '⚠️'),
                'Симптомы неисправности'
              ),
              h('ul', { className: 'space-y-2' },
                ...item.symptoms_when_faulty.map((s, i) => h('li', { key: i, className: 'text-sm text-red-700 flex items-start gap-2 p-2 bg-white/60 rounded-lg' },
                  h('span', { className: 'text-red-500' }, '❌'), s
                ))
              )
            ),
            
            // Repair tips
            item.repair_tips?.length > 0 && h('div', { className: 'bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200' },
              h('h3', { className: 'font-bold text-amber-800 mb-3 flex items-center gap-2' }, 
                h('span', { className: 'w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center' }, '💡'),
                'Советы по ремонту'
              ),
              h('ul', { className: 'space-y-2' },
                ...item.repair_tips.map((tip, i) => h('li', { key: i, className: 'text-sm text-amber-700 flex items-start gap-2 p-2 bg-white/60 rounded-lg' },
                  h('span', { className: 'text-amber-500' }, '→'), tip
                ))
              )
            ),
            
            // Compatible devices
            item.compatible_devices?.length > 0 && h('div', { className: 'bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-4 border border-slate-200' },
              h('h3', { className: 'font-bold text-slate-800 mb-3 flex items-center gap-2' }, 
                h('span', { className: 'w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center' }, '📱'),
                `Совместимые устройства (${item.compatible_devices.length})`
              ),
              h('div', { className: 'flex flex-wrap gap-2' },
                ...item.compatible_devices.map((d, i) => h('span', { 
                  key: i, 
                  className: 'px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-slate-700 border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors' 
                }, d))
              )
            ),
            
            // Quick reference card
            h('div', { className: 'bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white' },
              h('h3', { className: 'font-bold mb-3 flex items-center gap-2' }, 
                h('span', { className: 'w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center' }, '📌'),
                'Быстрая справка'
              ),
              h('div', { className: 'space-y-2 text-sm' },
                h('div', { className: 'flex justify-between items-center p-2 bg-white/10 rounded-lg' },
                  h('span', { className: 'text-white/80' }, 'Микросхема:'),
                  h('span', { className: 'font-mono font-bold' }, item.name)
                ),
                item.designation && h('div', { className: 'flex justify-between items-center p-2 bg-white/10 rounded-lg' },
                  h('span', { className: 'text-white/80' }, 'На плате:'),
                  h('span', { className: 'font-bold' }, item.designation)
                ),
                item.price_range && h('div', { className: 'flex justify-between items-center p-2 bg-white/10 rounded-lg' },
                  h('span', { className: 'text-white/80' }, 'Цена:'),
                  h('span', { className: 'font-bold text-green-300' }, item.price_range)
                ),
                item.difficulty && h('div', { className: 'flex justify-between items-center p-2 bg-white/10 rounded-lg' },
                  h('span', { className: 'text-white/80' }, 'Сложность:'),
                  h('span', { className: cn('font-bold', 
                    item.difficulty === 'Expert' ? 'text-red-300' : 
                    item.difficulty === 'Advanced' ? 'text-orange-300' : 'text-green-300'
                  ) }, item.difficulty)
                )
              )
            )
          )
        )
      )
    );
  }
  
  return null;
};

// ===== PRICES PANEL (Real Data) =====
const PricesPanel = ({ ukrainePrices, logicBoardsSpecs, onClose, onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // Build unified price list from ukraine_prices.json
  const priceList = useMemo(() => {
    if (!ukrainePrices) return [];
    
    return Object.entries(ukrainePrices)
      .map(([article, data]) => ({
        article,
        description: data.description || '',
        price_uah: data.price_uah,
        price_usd: convertPrice(data.price_uah, 'UAH', 'USD'),
        discount: data.discount || 0,
        category: detectCategory(data.description)
      }))
      .filter(item => item.price_uah > 0);
  }, [ukrainePrices]);
  
  const categories = useMemo(() => {
    const cats = new Set(priceList.map(p => p.category));
    return ['all', ...Array.from(cats).sort()];
  }, [priceList]);
  
  const filtered = useMemo(() => {
    let result = priceList;
    
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.article.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }
    
    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_uah - b.price_uah;
      if (sortBy === 'price_desc') return b.price_uah - a.price_uah;
      return a.description.localeCompare(b.description);
    });
    
    return result.slice(0, 200);
  }, [priceList, searchTerm, category, sortBy]);
  
  return h(Modal, { 
    title: '💰 Каталог цен', 
    subtitle: `${priceList.length.toLocaleString()} позиций • Реальные цены Украина`, 
    onClose, 
    color: 'amber' 
  },
    h('div', { className: 'flex flex-col h-[70vh]' },
      // Filters
      h('div', { className: 'p-4 border-b bg-slate-50 space-y-3' },
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Поиск по артикулу или описанию...',
          className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none'
        }),
        h('div', { className: 'flex gap-2 flex-wrap items-center' },
          h('select', {
            value: category,
            onChange: e => setCategory(e.target.value),
            className: 'px-3 py-1.5 rounded-lg border border-slate-200 text-sm'
          },
            ...categories.map(c => h('option', { key: c, value: c }, c === 'all' ? 'Все категории' : c))
          ),
          h('select', {
            value: sortBy,
            onChange: e => setSortBy(e.target.value),
            className: 'px-3 py-1.5 rounded-lg border border-slate-200 text-sm'
          },
            h('option', { value: 'name' }, 'По названию'),
            h('option', { value: 'price_asc' }, 'Цена ↑'),
            h('option', { value: 'price_desc' }, 'Цена ↓')
          ),
          h('span', { className: 'text-sm text-slate-500 ml-auto' }, `Показано: ${filtered.length}`)
        )
      ),
      
      // Results
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'space-y-2' },
          filtered.length === 0 && h('p', { className: 'text-center text-slate-500 py-8' }, 'Ничего не найдено'),
          ...filtered.map(item => 
            h('div', { 
              key: item.article, 
              onClick: () => onSelectItem({ ...item, type: 'article' }),
              className: 'p-3 bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-md cursor-pointer transition-all flex justify-between items-center gap-4'
            },
              h('div', { className: 'flex-1 min-w-0' },
                h('p', { className: 'font-mono text-sm font-bold text-amber-600' }, item.article),
                h('p', { className: 'text-sm text-slate-600 truncate' }, item.description),
                h('span', { className: 'inline-block mt-1 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-500' }, item.category)
              ),
              h('div', { className: 'text-right flex-shrink-0' },
                h('p', { className: 'text-lg font-bold text-amber-600' }, formatPrice(item.price_uah, 'UAH')),
                h('p', { className: 'text-xs text-slate-500' }, `≈ ${formatPrice(item.price_usd, 'USD')}`)
              )
            )
          )
        )
      )
    )
  );
};

// Helper to detect category from description
function detectCategory(desc) {
  const d = desc.toLowerCase();
  if (d.includes('logic board') || d.includes('материнская')) return 'Logic Board';
  if (d.includes('display') || d.includes('lcd') || d.includes('screen') || d.includes('дисплей')) return 'Display';
  if (d.includes('battery') || d.includes('батарея') || d.includes('аккумулятор')) return 'Battery';
  if (d.includes('camera') || d.includes('камера')) return 'Camera';
  if (d.includes('speaker') || d.includes('динамик')) return 'Speaker';
  if (d.includes('keyboard') || d.includes('клавиатура') || d.includes('top case')) return 'Keyboard/TopCase';
  if (d.includes('bottom case') || d.includes('housing')) return 'Housing';
  if (d.includes('trackpad') || d.includes('трекпад')) return 'Trackpad';
  if (d.includes('fan') || d.includes('вентилятор')) return 'Fan';
  if (d.includes('ssd') || d.includes('flash') || d.includes('storage')) return 'Storage';
  if (d.includes('charger') || d.includes('adapter') || d.includes('зарядка')) return 'Charger';
  if (d.includes('cable') || d.includes('flex') || d.includes('кабель')) return 'Cable';
  if (d.includes('screw') || d.includes('винт')) return 'Screws';
  if (d.includes('iphone')) return 'iPhone Parts';
  if (d.includes('ipad')) return 'iPad Parts';
  if (d.includes('macbook') || d.includes('mbp')) return 'MacBook Parts';
  if (d.includes('imac')) return 'iMac Parts';
  if (d.includes('mac mini') || d.includes('mac pro')) return 'Mac Parts';
  if (d.includes('watch')) return 'Watch Parts';
  if (d.includes('airpods') || d.includes('beats')) return 'Audio Parts';
  return 'Other';
}

// ===== LOGIC BOARDS PANEL (with click) =====
const LogicBoardsPanel = ({ logicBoards, logicBoardsSpecs, ukrainePrices, onClose, onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showType, setShowType] = useState('all');
  
  // Merge comprehensive boards with specs (which have prices)
  const allBoards = useMemo(() => {
    const boards = [];
    
    // From logic_boards_comprehensive.json
    if (logicBoards) {
      (logicBoards.m_series_boards || []).forEach(b => {
        boards.push({ ...b, type: 'M-series', source: 'comprehensive' });
      });
      (logicBoards.intel_boards || []).forEach(b => {
        boards.push({ ...b, type: 'Intel', source: 'comprehensive' });
      });
    }
    
    // From logic_boards_specs.json (with prices)
    if (logicBoardsSpecs?.boards) {
      Object.entries(logicBoardsSpecs.boards).forEach(([article, data]) => {
        // Check if already exists
        const existing = boards.find(b => b.article === article);
        if (existing) {
          Object.assign(existing, data, { article, hasPrice: true });
        } else {
          boards.push({ 
            ...data, 
            article, 
            type: data.model?.includes('M1') || data.model?.includes('M2') || data.model?.includes('M3') || data.model?.includes('M4') ? 'M-series' : 'Intel',
            source: 'specs',
            hasPrice: true 
          });
        }
      });
    }
    
    return boards;
  }, [logicBoards, logicBoardsSpecs]);
  
  const filtered = useMemo(() => {
    let result = allBoards;
    
    if (showType !== 'all') {
      result = result.filter(b => b.type === showType);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b => 
        (b.board_number || '').toLowerCase().includes(term) ||
        (b.model || '').toLowerCase().includes(term) ||
        (b.model_number || '').toLowerCase().includes(term) ||
        (b.article || '').toLowerCase().includes(term) ||
        (b.description || '').toLowerCase().includes(term)
      );
    }
    
    return result.slice(0, 100);
  }, [allBoards, searchTerm, showType]);
  
  const stats = useMemo(() => ({
    total: allBoards.length,
    mSeries: allBoards.filter(b => b.type === 'M-series').length,
    intel: allBoards.filter(b => b.type === 'Intel').length,
    withPrices: allBoards.filter(b => b.hasPrice || b.price_uah || b.price_usd).length
  }), [allBoards]);
  
  return h(Modal, { 
    title: '🖥️ Logic Boards', 
    subtitle: `${stats.total} плат • ${stats.mSeries} M-series • ${stats.intel} Intel • ${stats.withPrices} с ценами`, 
    onClose, 
    color: 'violet' 
  },
    h('div', { className: 'flex flex-col h-[70vh]' },
      h('div', { className: 'p-4 border-b bg-slate-50 space-y-3' },
        h('div', { className: 'flex gap-2' },
          ['all', 'M-series', 'Intel'].map(type => 
            h('button', {
              key: type,
              onClick: () => setShowType(type),
              className: cn('px-4 py-2 rounded-xl font-medium text-sm transition-colors',
                showType === type ? 'bg-violet-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100')
            }, type === 'all' ? `Все (${stats.total})` : type === 'M-series' ? `Apple Silicon (${stats.mSeries})` : `Intel (${stats.intel})`)
          )
        ),
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Поиск по модели, board number, артикулу...',
          className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-violet-500 focus:outline-none'
        })
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
          ...filtered.map((board, i) => {
            const uaPrice = ukrainePrices?.[board.article];
            const hasAnyPrice = board.price_uah || board.price_usd || uaPrice;
            
            return h('div', { 
              key: board.article || board.board_number || i,
              onClick: () => onSelectItem({ ...board, ...(uaPrice || {}), type: 'board' }),
              className: 'p-4 bg-white rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-md cursor-pointer transition-all'
            },
              h('div', { className: 'flex justify-between items-start mb-2' },
                h('div', null,
                  h('p', { className: 'font-mono font-bold text-violet-600' }, board.board_number || board.article),
                  board.article && board.board_number && h('p', { className: 'text-xs text-slate-400 font-mono' }, board.article)
                ),
                h('div', { className: 'flex gap-1' },
                  h('span', { className: cn('px-2 py-0.5 rounded text-xs font-medium',
                    board.type === 'M-series' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  ) }, board.type),
                  hasAnyPrice && h('span', { className: 'px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700' }, '💰')
                )
              ),
              h('p', { className: 'text-sm text-slate-700 mb-2 line-clamp-2' }, board.model || board.description),
              h('div', { className: 'flex flex-wrap gap-2 text-xs' },
                board.model_number && h('span', { className: 'px-2 py-0.5 bg-slate-100 rounded text-slate-600' }, board.model_number),
                board.emc && h('span', { className: 'px-2 py-0.5 bg-slate-100 rounded text-slate-600' }, board.emc),
                board.year && h('span', { className: 'px-2 py-0.5 bg-slate-100 rounded text-slate-600' }, board.year),
                board.architecture && h('span', { className: 'px-2 py-0.5 bg-purple-100 rounded text-purple-600' }, board.architecture)
              ),
              hasAnyPrice && h('div', { className: 'mt-2 pt-2 border-t border-slate-100 flex justify-between items-center' },
                h('span', { className: 'text-xs text-slate-500' }, '🇺🇦'),
                h('span', { className: 'font-bold text-amber-600' }, 
                  formatPrice(uaPrice?.price_uah || board.price_uah, 'UAH')
                )
              )
            );
          })
        )
      )
    )
  );
};

// ===== IC DATABASE PANEL (with click) =====
const ICDatabasePanel = ({ icData, onClose, onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('charging');
  
  const categories = {
    charging: { name: '⚡ Зарядка', data: icData?.charging_ics || [] },
    power: { name: '🔋 Питание', data: icData?.power_ics || [] },
    audio: { name: '🔊 Аудио', data: icData?.audio_ics || [] },
    baseband: { name: '📶 Baseband', data: icData?.baseband_ics || [] },
    nand: { name: '💾 NAND', data: icData?.nand_ics || [] },
    wifi_bt: { name: '📡 WiFi/BT', data: icData?.wifi_bt_ics || [] },
    biometric: { name: '👆 Биометрия', data: icData?.biometric_ics || [] },
  };
  
  const currentData = categories[category]?.data || [];
  
  const filtered = useMemo(() => {
    if (!searchTerm) return currentData;
    const term = searchTerm.toLowerCase();
    return currentData.filter(ic => 
      (ic.name || '').toLowerCase().includes(term) ||
      (ic.designation || '').toLowerCase().includes(term) ||
      (ic.compatible_devices || []).some(d => d.toLowerCase().includes(term))
    );
  }, [currentData, searchTerm]);
  
  const totalICs = Object.values(categories).reduce((sum, cat) => sum + cat.data.length, 0);
  
  return h(Modal, { 
    title: '🔌 База микросхем', 
    subtitle: `${totalICs} микросхем • Диагностика и совместимость`, 
    onClose, 
    color: 'violet' 
  },
    h('div', { className: 'flex flex-col h-[70vh]' },
      h('div', { className: 'p-4 border-b bg-slate-50 space-y-3' },
        h('div', { className: 'flex gap-2 flex-wrap' },
          ...Object.entries(categories).map(([key, cat]) => 
            h('button', {
              key,
              onClick: () => setCategory(key),
              className: cn('px-3 py-1.5 rounded-lg font-medium text-sm transition-colors',
                category === key ? 'bg-violet-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100')
            }, `${cat.name} (${cat.data.length})`)
          )
        ),
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Поиск по названию, устройству...',
          className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-violet-500 focus:outline-none'
        })
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'space-y-3' },
          filtered.length === 0 && h('p', { className: 'text-center text-slate-500 py-8' }, 'Ничего не найдено'),
          ...filtered.map((ic, i) => 
            h('div', { 
              key: ic.name || i,
              onClick: () => onSelectItem({ ...ic, type: 'ic' }),
              className: 'p-4 bg-white rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-md cursor-pointer transition-all'
            },
              h('div', { className: 'flex justify-between items-start mb-2' },
                h('div', null,
                  h('p', { className: 'font-mono font-bold text-violet-600' }, ic.name),
                  ic.designation && h('p', { className: 'text-xs text-slate-500' }, ic.designation)
                ),
                h('div', { className: 'flex gap-2' },
                  ic.price_range && h('span', { className: 'px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs' }, ic.price_range),
                  ic.difficulty && h('span', { className: cn('px-2 py-0.5 rounded text-xs',
                    ic.difficulty === 'Expert' ? 'bg-red-100 text-red-700' :
                    ic.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  ) }, ic.difficulty)
                )
              ),
              
              ic.functions?.length > 0 && h('p', { className: 'text-sm text-slate-600 mb-2' }, 
                ic.functions.slice(0, 2).join(', ')
              ),
              
              ic.compatible_devices?.length > 0 && h('div', { className: 'flex flex-wrap gap-1' },
                ...ic.compatible_devices.slice(0, 5).map((d, j) => 
                  h('span', { key: j, className: 'px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600' }, d)
                ),
                ic.compatible_devices.length > 5 && h('span', { className: 'text-xs text-slate-400' }, `+${ic.compatible_devices.length - 5}`)
              ),
              
              ic.symptoms_when_faulty?.length > 0 && h('div', { className: 'mt-2 pt-2 border-t border-slate-100' },
                h('p', { className: 'text-xs text-red-600' }, `⚠️ ${ic.symptoms_when_faulty[0]}`)
              )
            )
          )
        )
      )
    )
  );
};

// ===== ARTICLE SEARCH PANEL (with click) =====
const ArticleSearchPanel = ({ articleData, ukrainePrices, onClose, onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [partType, setPartType] = useState('all');
  
  const articles = articleData?.articles || [];
  const partTypes = ['all', 'display', 'battery', 'rear_camera', 'front_camera', 'speaker', 'logic_board'];
  
  const filtered = useMemo(() => {
    let result = articles;
    
    if (partType !== 'all') {
      result = result.filter(a => a.part_type === partType);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(a => 
        (a.article || '').toLowerCase().includes(term) ||
        (a.description || '').toLowerCase().includes(term) ||
        (a.model || '').toLowerCase().includes(term)
      );
    }
    
    return result.slice(0, 100);
  }, [articles, searchTerm, partType]);
  
  return h(Modal, { 
    title: '🔍 Поиск артикулов', 
    subtitle: `${articleData?.total || 0} артикулов в базе`, 
    onClose, 
    color: 'green' 
  },
    h('div', { className: 'flex flex-col h-[70vh]' },
      h('div', { className: 'p-4 border-b bg-slate-50 space-y-3' },
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Введите артикул, модель или описание...',
          className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none'
        }),
        h('div', { className: 'flex gap-2 flex-wrap' },
          ...partTypes.map(type => 
            h('button', {
              key: type,
              onClick: () => setPartType(type),
              className: cn('px-3 py-1 rounded-full text-sm font-medium transition-colors',
                partType === type ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100')
            }, type === 'all' ? 'Все' : 
               type === 'display' ? '📱 Дисплеи' : 
               type === 'battery' ? '🔋 Батареи' :
               type === 'rear_camera' ? '📷 Задние камеры' :
               type === 'front_camera' ? '🤳 Фронт камеры' :
               type === 'speaker' ? '🔊 Динамики' :
               type === 'logic_board' ? '🖥️ Платы' : type)
          )
        )
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'space-y-2' },
          filtered.length === 0 && h('p', { className: 'text-center text-slate-500 py-8' }, 'Ничего не найдено'),
          ...filtered.map((art, i) => {
            const uaPrice = ukrainePrices?.[art.article];
            return h('div', { 
              key: art.article || i,
              onClick: () => onSelectItem({ ...art, ...(uaPrice || {}), type: 'article' }),
              className: 'p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all'
            },
              h('div', { className: 'flex justify-between items-start gap-4' },
                h('div', { className: 'flex-1 min-w-0' },
                  h('p', { className: 'font-mono font-bold text-emerald-600' }, art.article),
                  h('p', { className: 'text-sm text-slate-700 truncate' }, art.description),
                  h('p', { className: 'text-xs text-slate-500 mt-1' }, art.model),
                  h('span', { className: 'inline-block mt-1 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-500 capitalize' }, 
                    (art.part_type || '').replace('_', ' ')
                  )
                ),
                h('div', { className: 'text-right flex-shrink-0' },
                  uaPrice && h('p', { className: 'text-lg font-bold text-amber-600' }, formatPrice(uaPrice.price_uah, 'UAH')),
                  art.price_usd && h('p', { className: 'text-sm text-blue-600' }, formatPrice(art.price_usd, 'USD')),
                  !uaPrice && !art.price_usd && h('p', { className: 'text-sm text-slate-400' }, '—')
                )
              )
            );
          })
        )
      )
    )
  );
};

// ===== ERROR CODES PANEL =====
const ErrorCodesPanel = ({ errorData, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('itunes');
  
  const itunesErrors = errorData?.itunes_restore_errors || [];
  const macErrors = errorData?.mac_diagnostics || [];
  const currentErrors = category === 'itunes' ? itunesErrors : macErrors;
  
  const filtered = useMemo(() => {
    if (!searchTerm) return currentErrors;
    const term = searchTerm.toLowerCase();
    return currentErrors.filter(err => 
      String(err.code).toLowerCase().includes(term) ||
      (err.description || '').toLowerCase().includes(term) ||
      (err.cause || '').toLowerCase().includes(term)
    );
  }, [currentErrors, searchTerm]);
  
  return h(Modal, { 
    title: '🚨 Коды ошибок', 
    subtitle: `${itunesErrors.length} iTunes • ${macErrors.length} Mac диагностика`, 
    onClose, 
    color: 'red' 
  },
    h('div', { className: 'flex flex-col h-[70vh]' },
      h('div', { className: 'p-4 border-b bg-slate-50 space-y-3' },
        h('div', { className: 'flex gap-2' },
          h('button', {
            onClick: () => setCategory('itunes'),
            className: cn('px-4 py-2 rounded-xl font-medium text-sm',
              category === 'itunes' ? 'bg-red-500 text-white' : 'bg-white text-slate-600')
          }, `iTunes/Finder (${itunesErrors.length})`),
          h('button', {
            onClick: () => setCategory('mac'),
            className: cn('px-4 py-2 rounded-xl font-medium text-sm',
              category === 'mac' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600')
          }, `Mac Diagnostics (${macErrors.length})`)
        ),
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Введите код ошибки (4013, 9, ADP...)...',
          className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-none'
        })
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'space-y-3' },
          filtered.length === 0 && h('p', { className: 'text-center text-slate-500 py-8' }, 'Ошибка не найдена'),
          ...filtered.map((err, i) => 
            h('div', { key: err.code || i, className: 'p-4 bg-white rounded-xl border border-slate-200' },
              h('div', { className: 'flex items-start gap-4' },
                h('div', { className: 'w-16 h-16 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0' },
                  h('span', { className: 'text-xl font-bold text-red-600' }, err.code)
                ),
                h('div', { className: 'flex-1' },
                  h('p', { className: 'font-semibold text-slate-800 mb-1' }, err.description || 'Описание отсутствует'),
                  err.cause && h('p', { className: 'text-sm text-slate-600 mb-2' }, `⚠️ Причина: ${err.cause}`),
                  err.solution && h('div', { className: 'p-3 bg-green-50 rounded-lg' },
                    h('p', { className: 'text-sm text-green-800' }, `✅ Решение: ${err.solution}`)
                  ),
                  h('div', { className: 'flex gap-2 mt-2' },
                    err.hardware && h('span', { className: 'px-2 py-1 bg-red-100 text-red-700 rounded text-xs' }, '🔧 Hardware'),
                    err.severity && h('span', { className: cn('px-2 py-1 rounded text-xs',
                      err.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      err.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      err.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    ) }, err.severity),
                    err.component && h('span', { className: 'px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs' }, err.component)
                  )
                )
              )
            )
          )
        )
      )
    )
  );
};

// ===== REPAIR CALCULATOR =====
const RepairCalculatorPanel = ({ devices, ukrainePrices, officialPrices, onClose }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedRepairs, setSelectedRepairs] = useState([]);
  const [laborCost, setLaborCost] = useState(500); // UAH per repair
  const [margin, setMargin] = useState(30);
  const [region, setRegion] = useState('UA');
  const [searchTerm, setSearchTerm] = useState('');
  
  const repairTypes = [
    { id: 'battery', name: 'Замена батареи', icon: '🔋' },
    { id: 'display', name: 'Замена дисплея', icon: '📱' },
    { id: 'rear_camera', name: 'Задняя камера', icon: '📷' },
    { id: 'front_camera', name: 'Фронтальная камера', icon: '🤳' },
    { id: 'speaker', name: 'Динамик', icon: '🔊' },
    { id: 'taptic_engine', name: 'Taptic Engine', icon: '📳' },
    { id: 'keyboard', name: 'Клавиатура', icon: '⌨️' },
    { id: 'charging_port', name: 'Разъём зарядки', icon: '⚡' },
  ];
  
  const deviceOptions = useMemo(() => {
    let result = devices.filter(d => d.service_parts && Object.keys(d.service_parts).length > 0);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(d => d.name.toLowerCase().includes(term));
    }
    return result.sort((a, b) => (b.year || 0) - (a.year || 0));
  }, [devices, searchTerm]);
  
  // Get part price (UA or EU based on region)
  const getPartPrice = (device, repairId) => {
    if (!device?.service_parts?.[repairId]) return null;
    const part = device.service_parts[repairId];
    const article = part?.article;
    
    if (region === 'UA') {
      // UA price from ukraine_prices.json
      if (article && ukrainePrices?.[article]) {
        return { price: ukrainePrices[article].price_uah, currency: 'UAH' };
      }
      // Fallback: convert USD price to UAH
      if (part.price_usd) {
        return { price: part.price_usd * RATES.USD_TO_UAH, currency: 'UAH' };
      }
    } else {
      // EU price - use official prices or convert from USD
      if (part.price_usd) {
        return { price: part.price_usd * 0.91, currency: 'EUR' }; // USD to EUR
      }
      // Fallback: convert from UAH
      if (article && ukrainePrices?.[article]) {
        return { price: ukrainePrices[article].price_uah * RATES.UAH_TO_EUR, currency: 'EUR' };
      }
    }
    return null;
  };
  
  const calculations = useMemo(() => {
    if (!selectedDevice || selectedRepairs.length === 0) return null;
    
    let partsCost = 0;
    const repairDetails = [];
    const currency = region === 'UA' ? 'UAH' : 'EUR';
    
    selectedRepairs.forEach(repairId => {
      const priceData = getPartPrice(selectedDevice, repairId);
      if (priceData) {
        partsCost += priceData.price;
        repairDetails.push({ 
          id: repairId, 
          price: priceData.price, 
          currency: priceData.currency,
          name: repairTypes.find(r => r.id === repairId)?.name 
        });
      }
    });
    
    // Convert labor to selected currency if needed
    const laborInCurrency = region === 'UA' ? laborCost : laborCost * RATES.UAH_TO_EUR;
    const labor = selectedRepairs.length * laborInCurrency;
    const subtotal = partsCost + labor;
    const marginAmount = subtotal * (margin / 100);
    const total = subtotal + marginAmount;
    
    return { partsCost, labor, subtotal, marginAmount, total, repairDetails, currency };
  }, [selectedDevice, selectedRepairs, laborCost, margin, region, ukrainePrices]);
  
  return h(Modal, { 
    title: '🧮 Калькулятор ремонта', 
    subtitle: 'Расчёт стоимости с реальными ценами', 
    onClose, 
    color: 'blue' 
  },
    h('div', { className: 'flex flex-col h-[70vh]' },
      h('div', { className: 'flex-1 overflow-y-auto p-6 space-y-6' },
        // Region selector
        h('div', { className: 'flex gap-2' },
          h('button', {
            onClick: () => setRegion('UA'),
            className: cn('px-4 py-2 rounded-xl font-medium flex items-center gap-2',
              region === 'UA' ? 'bg-yellow-400 text-yellow-900' : 'bg-slate-100 text-slate-600')
          }, '🇺🇦 Украина (₴)'),
          h('button', {
            onClick: () => setRegion('EU'),
            className: cn('px-4 py-2 rounded-xl font-medium flex items-center gap-2',
              region === 'EU' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600')
          }, '🇪🇺 Европа (€)')
        ),
        
        // Device search
        h('div', null,
          h('label', { className: 'block text-sm font-medium text-slate-700 mb-2' }, 'Поиск устройства'),
          h('input', {
            type: 'text',
            value: searchTerm,
            onChange: e => setSearchTerm(e.target.value),
            placeholder: 'iPhone 15, MacBook Pro...',
            className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none'
          })
        ),
        
        // Device selector
        h('div', null,
          h('label', { className: 'block text-sm font-medium text-slate-700 mb-2' }, 
            `Выберите устройство (${deviceOptions.length})`
          ),
          h('select', {
            value: selectedDevice?.name || '',
            onChange: e => {
              const device = deviceOptions.find(d => d.name === e.target.value);
              setSelectedDevice(device);
              setSelectedRepairs([]);
            },
            size: 6,
            className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none'
          },
            h('option', { value: '', disabled: true }, '-- Выберите --'),
            ...deviceOptions.map(d => h('option', { key: d.name, value: d.name }, 
              `${d.name} (${d.year || '?'})`
            ))
          )
        ),
        
        // Repair types - show only available for device
        selectedDevice && h('div', null,
          h('label', { className: 'block text-sm font-medium text-slate-700 mb-2' }, 'Виды работ'),
          h('div', { className: 'grid grid-cols-2 gap-2' },
            ...repairTypes.filter(repair => selectedDevice.service_parts?.[repair.id]).map(repair => {
              const priceData = getPartPrice(selectedDevice, repair.id);
              const isSelected = selectedRepairs.includes(repair.id);
              const displayCurrency = region === 'UA' ? 'UAH' : 'EUR';
              
              return h('button', {
                key: repair.id,
                disabled: !priceData,
                onClick: () => {
                  if (isSelected) {
                    setSelectedRepairs(selectedRepairs.filter(r => r !== repair.id));
                  } else {
                    setSelectedRepairs([...selectedRepairs, repair.id]);
                  }
                },
                className: cn('p-3 rounded-xl border-2 text-left transition-all',
                  !priceData && 'opacity-50 cursor-not-allowed',
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300')
              },
                h('div', { className: 'flex items-center gap-2' },
                  h('span', { className: 'text-xl' }, repair.icon),
                  h('div', null,
                    h('p', { className: 'font-medium text-sm' }, repair.name),
                    h('p', { className: 'text-xs text-slate-500' }, 
                      priceData ? formatPrice(priceData.price, displayCurrency) : 'Нет данных'
                    )
                  )
                )
              );
            })
          ),
          // Show if no parts available
          Object.keys(selectedDevice.service_parts || {}).length === 0 && 
            h('p', { className: 'text-center text-slate-500 py-4' }, 'Нет данных о запчастях для этого устройства')
        ),
        
        // Settings
        selectedDevice && h('div', { className: 'grid grid-cols-2 gap-4' },
          h('div', null,
            h('label', { className: 'block text-sm font-medium text-slate-700 mb-2' }, 'Работа за услугу (₴)'),
            h('input', {
              type: 'number',
              value: laborCost,
              onChange: e => setLaborCost(Number(e.target.value)),
              className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none'
            })
          ),
          h('div', null,
            h('label', { className: 'block text-sm font-medium text-slate-700 mb-2' }, 'Наценка (%)'),
            h('input', {
              type: 'number',
              value: margin,
              onChange: e => setMargin(Number(e.target.value)),
              className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none'
            })
          )
        ),
        
        // Results
        calculations && h('div', { className: 'p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200' },
          h('h3', { className: 'font-bold text-slate-800 mb-4 text-lg' }, 
            region === 'UA' ? '📊 Итоговый расчёт (UA)' : '📊 Итоговый расчёт (EU)'
          ),
          
          h('div', { className: 'space-y-2 text-sm mb-4' },
            ...calculations.repairDetails.map(r => 
              h('div', { key: r.id, className: 'flex justify-between items-center p-2 bg-white rounded' },
                h('span', { className: 'text-slate-600' }, r.name),
                h('span', { className: 'font-medium text-blue-600' }, formatPrice(r.price, calculations.currency))
              )
            )
          ),
          
          h('div', { className: 'space-y-2 text-sm border-t border-slate-200 pt-4' },
            h('div', { className: 'flex justify-between' },
              h('span', { className: 'text-slate-600' }, '💰 Запчасти:'),
              h('span', { className: 'font-medium' }, formatPrice(calculations.partsCost, calculations.currency))
            ),
            h('div', { className: 'flex justify-between' },
              h('span', { className: 'text-slate-600' }, 
                region === 'UA' 
                  ? `🔧 Работа (${selectedRepairs.length}x${laborCost}₴):` 
                  : `🔧 Работа (${selectedRepairs.length}x€${Math.round(laborCost * RATES.UAH_TO_EUR)}):`
              ),
              h('span', { className: 'font-medium' }, formatPrice(calculations.labor, calculations.currency))
            ),
            h('div', { className: 'flex justify-between border-t pt-2' },
              h('span', { className: 'text-slate-600' }, '📝 Подитог:'),
              h('span', { className: 'font-semibold' }, formatPrice(calculations.subtotal, calculations.currency))
            ),
            h('div', { className: 'flex justify-between' },
              h('span', { className: 'text-slate-600' }, `📈 Наценка ${margin}%:`),
              h('span', { className: 'font-medium text-green-600' }, `+${formatPrice(calculations.marginAmount, calculations.currency)}`)
            )
          ),
          
          h('div', { className: 'flex justify-between items-center p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white mt-4' },
            h('span', { className: 'font-bold text-lg' }, '💵 ИТОГО:'),
            h('div', { className: 'text-right' },
              h('span', { className: 'font-bold text-2xl' }, formatPrice(calculations.total, calculations.currency)),
              h('p', { className: 'text-xs text-blue-100' }, 
                region === 'UA' 
                  ? `≈ ${formatPrice(convertPrice(calculations.total, 'UAH', 'USD'), 'USD')}`
                  : `≈ ${formatPrice(convertPrice(calculations.total, 'EUR', 'UAH'), 'UAH')}`
              )
            )
          )
        )
      )
    )
  );
};

// ===== KEY COMBINATIONS PANEL =====
const KeyCombinationsPanel = ({ onClose }) => {
  const [keyCombos, setKeyCombos] = useState(null);
  const [activeDevice, setActiveDevice] = useState('iphone');
  const [activeMode, setActiveMode] = useState('dfu_mode');
  
  // Load key combinations data
  useEffect(() => {
    fetch('/data/key_combinations.json')
      .then(r => r.json())
      .then(data => setKeyCombos(data))
      .catch(err => console.error('Failed to load key combinations:', err));
  }, []);
  
  if (!keyCombos) {
    return h(Modal, { title: '⌨️ Комбинации клавиш', subtitle: 'Загрузка...', onClose, color: 'indigo' },
      h('div', { className: 'p-8 text-center' },
        h('div', { className: 'w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto' })
      )
    );
  }
  
  const deviceTabs = [
    { id: 'iphone', name: '📱 iPhone', icon: '📱' },
    { id: 'ipad', name: '📟 iPad', icon: '📟' },
    { id: 'mac', name: '💻 Mac', icon: '💻' },
    { id: 'apple_watch', name: '⌚ Watch', icon: '⌚' },
  ];
  
  const modeTabs = {
    iphone: [
      { id: 'dfu_mode', name: '🔧 DFU Mode' },
      { id: 'recovery_mode', name: '🔄 Recovery Mode' },
      { id: 'force_restart', name: '🔃 Перезагрузка' },
      { id: 'exit_dfu', name: '🚪 Выход из DFU' },
    ],
    ipad: [
      { id: 'dfu_mode', name: '🔧 DFU Mode' },
      { id: 'recovery_mode', name: '🔄 Recovery Mode' },
    ],
    mac: [
      { id: 'startup_modes', name: '🚀 Режимы запуска' },
      { id: 'dfu_mode', name: '🔧 DFU Mode' },
      { id: 'diagnostics', name: '🩺 Диагностика' },
    ],
    apple_watch: [
      { id: 'dfu_mode', name: '🔧 DFU Mode' },
      { id: 'force_restart', name: '🔃 Перезагрузка' },
    ],
  };
  
  const currentDeviceData = keyCombos[activeDevice];
  const currentModeData = currentDeviceData?.[activeMode];
  
  // Render steps for a specific device model group
  const renderSteps = (modelData) => {
    if (!modelData) return null;
    
    return h('div', { className: 'space-y-4' },
      // Steps
      modelData.steps && h('div', { className: 'p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200' },
        h('h4', { className: 'font-bold text-indigo-800 mb-3 flex items-center gap-2' },
          h('span', { className: 'w-8 h-8 bg-indigo-200 rounded-lg flex items-center justify-center' }, '📝'),
          'Пошаговая инструкция'
        ),
        h('ol', { className: 'space-y-2' },
          ...modelData.steps.map((step, i) => h('li', { 
            key: i, 
            className: 'flex items-start gap-3 text-sm text-slate-700 p-2 bg-white/80 rounded-lg' 
          },
            h('span', { className: 'w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0' }, i + 1),
            h('span', null, step)
          ))
        )
      ),
      
      // Short version
      modelData.steps_short && h('div', { className: 'p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200' },
        h('h4', { className: 'font-bold text-emerald-800 mb-2 flex items-center gap-2' },
          h('span', { className: 'w-8 h-8 bg-emerald-200 rounded-lg flex items-center justify-center' }, '⚡'),
          'Быстрая схема'
        ),
        h('p', { className: 'font-mono text-sm bg-white/80 p-3 rounded-lg text-emerald-700 font-semibold' }, modelData.steps_short)
      ),
      
      // Notes
      modelData.notes && h('div', { className: 'p-4 bg-amber-50 rounded-xl border border-amber-200' },
        h('h4', { className: 'font-bold text-amber-800 mb-2 flex items-center gap-2' },
          h('span', { className: 'w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center' }, '💡'),
          'Примечания'
        ),
        h('ul', { className: 'space-y-1' },
          ...modelData.notes.map((note, i) => h('li', { key: i, className: 'text-sm text-amber-700 flex items-start gap-2' },
            h('span', null, '•'), note
          ))
        )
      ),
      
      // Alternative method (for older iPhones)
      modelData.alternative_method && h('div', { className: 'p-4 bg-slate-50 rounded-xl border border-slate-200' },
        h('h4', { className: 'font-bold text-slate-800 mb-2' }, '🔄 Альтернативный метод'),
        h('ol', { className: 'space-y-1 text-sm text-slate-600' },
          ...modelData.alternative_method.map((step, i) => h('li', { key: i }, `${i + 1}. ${step}`))
        )
      ),
      
      // Applies to (device list)
      modelData.applies_to && h('div', { className: 'p-3 bg-slate-100 rounded-lg' },
        h('p', { className: 'text-xs text-slate-500 mb-2' }, 'Применимо к:'),
        h('div', { className: 'flex flex-wrap gap-1' },
          ...modelData.applies_to.slice(0, 10).map((d, i) => h('span', { 
            key: i, 
            className: 'px-2 py-0.5 bg-white text-slate-600 rounded text-xs' 
          }, d)),
          modelData.applies_to.length > 10 && h('span', { className: 'text-xs text-slate-400' }, `+${modelData.applies_to.length - 10}`)
        )
      )
    );
  };
  
  // Render Mac startup modes (special case)
  const renderMacStartupModes = () => {
    if (activeDevice !== 'mac' || activeMode !== 'startup_modes') return null;
    
    const startupData = currentModeData;
    if (!startupData) return null;
    
    return h('div', { className: 'space-y-6' },
      // Intel Macs
      startupData.intel_macs && h('div', { className: 'bg-white rounded-xl shadow p-5' },
        h('h3', { className: 'font-bold text-blue-800 mb-4 flex items-center gap-2' },
          h('span', { className: 'w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center' }, '🔵'),
          'Intel Mac (до 2020)'
        ),
        h('p', { className: 'text-sm text-slate-600 mb-4' }, startupData.intel_macs.description),
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
          ...Object.entries(startupData.intel_macs.combinations || {}).map(([key, combo]) =>
            h('div', { key, className: 'p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors' },
              h('p', { className: 'font-semibold text-slate-800 text-sm' }, combo.title),
              h('p', { className: 'font-mono text-indigo-600 text-sm font-bold my-1' }, combo.keys),
              h('p', { className: 'text-xs text-slate-500' }, combo.description)
            )
          )
        )
      ),
      
      // Apple Silicon Macs
      startupData.apple_silicon && h('div', { className: 'bg-white rounded-xl shadow p-5' },
        h('h3', { className: 'font-bold text-purple-800 mb-4 flex items-center gap-2' },
          h('span', { className: 'w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center' }, '🟣'),
          'Apple Silicon Mac (M1/M2/M3/M4/M5)'
        ),
        h('p', { className: 'text-sm text-slate-600 mb-4' }, startupData.apple_silicon.description),
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
          ...Object.entries(startupData.apple_silicon.combinations || {}).map(([key, combo]) =>
            h('div', { key, className: 'p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors' },
              h('p', { className: 'font-semibold text-purple-800 text-sm' }, combo.title),
              h('p', { className: 'font-mono text-purple-600 text-sm font-bold my-1' }, combo.keys),
              h('p', { className: 'text-xs text-slate-500' }, combo.description)
            )
          )
        ),
        startupData.apple_silicon.notes && h('div', { className: 'mt-4 p-3 bg-amber-50 rounded-lg' },
          h('p', { className: 'text-xs font-semibold text-amber-800 mb-1' }, '⚠️ Важно:'),
          h('ul', { className: 'text-xs text-amber-700 space-y-1' },
            ...startupData.apple_silicon.notes.map((n, i) => h('li', { key: i }, `• ${n}`))
          )
        )
      )
    );
  };
  
  // Render Mac diagnostics (special case)
  const renderMacDiagnostics = () => {
    if (activeDevice !== 'mac' || activeMode !== 'diagnostics') return null;
    
    const diagData = currentModeData;
    if (!diagData) return null;
    
    return h('div', { className: 'space-y-6' },
      h('div', { className: 'bg-white rounded-xl shadow p-5' },
        h('h3', { className: 'font-bold text-slate-800 mb-4' }, '🩺 Apple Diagnostics'),
        h('p', { className: 'text-sm text-slate-600 mb-4' }, diagData.description),
        
        // Intel steps
        diagData.intel_macs && h('div', { className: 'mb-4 p-4 bg-blue-50 rounded-xl' },
          h('p', { className: 'font-semibold text-blue-800 mb-2' }, '🔵 Intel Mac'),
          h('ol', { className: 'text-sm text-slate-700 space-y-1' },
            ...diagData.intel_macs.steps.map((s, i) => h('li', { key: i }, `${i + 1}. ${s}`))
          ),
          diagData.intel_macs.alternative && h('p', { className: 'text-xs text-slate-500 mt-2' }, 
            `Альтернатива: ${diagData.intel_macs.alternative}`
          )
        ),
        
        // Apple Silicon steps
        diagData.apple_silicon && h('div', { className: 'mb-4 p-4 bg-purple-50 rounded-xl' },
          h('p', { className: 'font-semibold text-purple-800 mb-2' }, '🟣 Apple Silicon'),
          h('ol', { className: 'text-sm text-slate-700 space-y-1' },
            ...diagData.apple_silicon.steps.map((s, i) => h('li', { key: i }, `${i + 1}. ${s}`))
          )
        ),
        
        // Error code categories legend
        diagData.error_code_categories && h('div', { className: 'mt-4 p-3 bg-slate-100 rounded-xl' },
          h('h4', { className: 'font-semibold text-slate-700 mb-2 text-sm' }, '📋 Категории кодов:'),
          h('div', { className: 'flex flex-wrap gap-2' },
            ...Object.entries(diagData.error_code_categories).slice(0, 10).map(([prefix, info]) =>
              h('span', { 
                key: prefix, 
                className: `px-2 py-1 rounded text-xs font-mono ${
                  info.severity === 'critical' ? 'bg-red-200 text-red-800' :
                  info.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                  'bg-yellow-200 text-yellow-800'
                }`
              }, `${prefix}: ${info.category}`)
            )
          )
        ),
        
        // Error codes with scrollable container
        diagData.error_codes && h('div', { className: 'mt-4' },
          h('h4', { className: 'font-bold text-red-800 mb-3' }, `🚨 Коды ошибок диагностики (${Object.keys(diagData.error_codes).length})`),
          h('div', { className: 'max-h-80 overflow-y-auto p-2 bg-slate-50 rounded-xl' },
            h('div', { className: 'grid grid-cols-2 md:grid-cols-3 gap-2' },
              ...Object.entries(diagData.error_codes).map(([code, desc]) =>
                h('div', { key: code, className: 'p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors' },
                  h('p', { className: 'font-mono font-bold text-red-600 text-sm' }, code),
                  h('p', { className: 'text-xs text-slate-600 line-clamp-2' }, desc)
                )
              )
            )
          )
        )
      )
    );
  };
  
  return h(Modal, { 
    title: '⌨️ Комбинации клавиш', 
    subtitle: 'DFU, Recovery, Diagnostics режимы', 
    onClose, 
    color: 'indigo' 
  },
    h('div', { className: 'flex flex-col h-[70vh]' },
      // Device tabs
      h('div', { className: 'p-4 border-b bg-slate-50' },
        h('div', { className: 'flex gap-2 mb-3' },
          ...deviceTabs.map(tab => h('button', {
            key: tab.id,
            onClick: () => { setActiveDevice(tab.id); setActiveMode(modeTabs[tab.id]?.[0]?.id || 'dfu_mode'); },
            className: cn('px-4 py-2 rounded-xl font-medium text-sm transition-all',
              activeDevice === tab.id ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100')
          }, tab.name))
        ),
        // Mode tabs
        h('div', { className: 'flex gap-2 overflow-x-auto' },
          ...(modeTabs[activeDevice] || []).map(tab => h('button', {
            key: tab.id,
            onClick: () => setActiveMode(tab.id),
            className: cn('px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              activeMode === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-slate-500 hover:bg-slate-100')
          }, tab.name))
        )
      ),
      
      // Content
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        // Title
        currentModeData?.title && h('h2', { className: 'text-xl font-bold text-slate-800 mb-2' }, currentModeData.title),
        currentModeData?.description && h('p', { className: 'text-sm text-slate-600 mb-4' }, currentModeData.description),
        
        // Special renderers for Mac
        renderMacStartupModes(),
        renderMacDiagnostics(),
        
        // Regular mode content (iPhone, iPad, etc)
        activeDevice !== 'mac' || (activeMode !== 'startup_modes' && activeMode !== 'diagnostics') 
          ? h('div', { className: 'space-y-6' },
              // Models groups
              currentModeData?.models && Object.entries(currentModeData.models).map(([modelGroup, modelData]) =>
                h('div', { key: modelGroup, className: 'bg-white rounded-xl shadow p-5' },
                  h('h3', { className: 'font-bold text-slate-800 mb-4 flex items-center gap-2' },
                    h('span', { className: 'w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm' }, 
                      modelGroup.includes('8') ? '8+' : modelGroup.includes('7') ? '7' : modelGroup.includes('6') ? '6' : '📱'
                    ),
                    modelGroup.replace(/_/g, ' ')
                  ),
                  modelData.chip_generation && h('p', { className: 'text-xs text-slate-500 mb-3' }, 
                    `Поколение чипа: ${modelData.chip_generation}`
                  ),
                  renderSteps(modelData)
                )
              ),
              
              // Direct steps (for simpler modes like apple_watch)
              !currentModeData?.models && currentModeData?.steps && renderSteps(currentModeData)
            )
          : null,
        
        // Quick Reference Card
        keyCombos.quick_reference && h('div', { className: 'mt-6 p-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white' },
          h('h3', { className: 'font-bold mb-3 flex items-center gap-2' },
            h('span', { className: 'w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center' }, '📋'),
            'Быстрая справка'
          ),
          h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
            h('div', { className: 'p-3 bg-white/10 rounded-lg' },
              h('p', { className: 'text-white/80 text-xs mb-1' }, 'iPhone DFU (A11+)'),
              h('p', { className: 'font-mono text-sm font-semibold' }, keyCombos.quick_reference.iphone_dfu_quick?.A11_and_newer)
            ),
            h('div', { className: 'p-3 bg-white/10 rounded-lg' },
              h('p', { className: 'text-white/80 text-xs mb-1' }, 'Mac Recovery (Intel)'),
              h('p', { className: 'font-mono text-sm font-semibold' }, keyCombos.quick_reference.mac_recovery_quick?.intel)
            ),
            h('div', { className: 'p-3 bg-white/10 rounded-lg' },
              h('p', { className: 'text-white/80 text-xs mb-1' }, 'Mac Recovery (Apple Silicon)'),
              h('p', { className: 'font-mono text-sm font-semibold' }, keyCombos.quick_reference.mac_recovery_quick?.apple_silicon)
            ),
            h('div', { className: 'p-3 bg-white/10 rounded-lg' },
              h('p', { className: 'text-white/80 text-xs mb-1' }, 'Mac Diagnostics (Intel)'),
              h('p', { className: 'font-mono text-sm font-semibold' }, keyCombos.quick_reference.mac_diagnostics_quick?.intel)
            )
          )
        )
      )
    )
  );
};

// ===== KNOWLEDGE BASE PANEL =====
const KnowledgeBasePanel = ({ knowledgeData, onClose }) => {
  const [topic, setTopic] = useState('tristar_hydra');
  
  const topics = {
    tristar_hydra: { name: '⚡ Tristar/Hydra', key: 'tristar_hydra' },
    baseband: { name: '📶 Baseband', key: 'baseband' },
    touch_ic: { name: '👆 Touch IC', key: 'touch_ic' },
    water_damage: { name: '💧 Залитие', key: 'water_damage' },
    nand_programming: { name: '💾 NAND', key: 'nand_programming' },
    tools_supplies: { name: '🔧 Инструменты', key: 'tools_supplies' },
  };
  
  const currentTopic = knowledgeData?.[topics[topic]?.key] || {};
  
  return h(Modal, { 
    title: '📚 База знаний', 
    subtitle: 'Руководства и процедуры ремонта', 
    onClose, 
    color: 'green' 
  },
    h('div', { className: 'flex flex-col h-[70vh]' },
      h('div', { className: 'p-4 border-b bg-slate-50' },
        h('div', { className: 'flex gap-2 flex-wrap' },
          ...Object.entries(topics).map(([key, t]) => 
            h('button', {
              key,
              onClick: () => setTopic(key),
              className: cn('px-3 py-1.5 rounded-lg font-medium text-sm',
                topic === key ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600')
            }, t.name)
          )
        )
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto p-6' },
        h('div', { className: 'prose prose-sm max-w-none' },
          currentTopic.description && h('p', { className: 'text-slate-700 mb-4' }, currentTopic.description),
          
          currentTopic.symptoms && h('div', { className: 'mb-4' },
            h('h3', { className: 'font-bold text-red-600 mb-2' }, '❌ Симптомы'),
            h('ul', { className: 'space-y-1' },
              ...(Array.isArray(currentTopic.symptoms) ? currentTopic.symptoms : []).map((s, i) => 
                h('li', { key: i, className: 'text-sm text-slate-700' }, s)
              )
            )
          ),
          
          currentTopic.diagnosis && h('div', { className: 'mb-4' },
            h('h3', { className: 'font-bold text-blue-600 mb-2' }, '🔍 Диагностика'),
            h('ul', { className: 'space-y-1' },
              ...(Array.isArray(currentTopic.diagnosis) ? currentTopic.diagnosis : [currentTopic.diagnosis]).map((d, i) => 
                h('li', { key: i, className: 'text-sm text-slate-700' }, typeof d === 'string' ? d : JSON.stringify(d))
              )
            )
          ),
          
          currentTopic.solution && h('div', { className: 'mb-4 p-4 bg-green-50 rounded-xl' },
            h('h3', { className: 'font-bold text-green-600 mb-2' }, '✅ Решение'),
            h('p', { className: 'text-sm text-green-800' }, 
              typeof currentTopic.solution === 'string' ? currentTopic.solution : JSON.stringify(currentTopic.solution)
            )
          ),
          
          currentTopic.tools && h('div', { className: 'mb-4' },
            h('h3', { className: 'font-bold text-slate-700 mb-2' }, '🔧 Инструменты'),
            h('div', { className: 'flex flex-wrap gap-2' },
              ...(Array.isArray(currentTopic.tools) ? currentTopic.tools : []).map((t, i) => 
                h('span', { key: i, className: 'px-2 py-1 bg-slate-100 rounded text-xs' }, t)
              )
            )
          ),
          
          currentTopic.notes && h('div', { className: 'p-4 bg-amber-50 rounded-xl' },
            h('p', { className: 'text-sm text-amber-800' }, `💡 ${currentTopic.notes}`)
          )
        )
      )
    )
  );
};

// ===== DEVICE CARD (ENHANCED v6.9.2 - with Device Icons) =====
const DeviceCard = ({ device, onSelect, ukrainePrices }) => {
  const icon = getCategoryIcon(device.category);
  const hasServiceParts = device.service_parts && Object.keys(device.service_parts).length > 0;
  const partsCount = hasServiceParts ? Object.keys(device.service_parts).length : 0;
  
  // Check if device has a custom icon image
  const hasDeviceIcon = device.device_icon || device.device_icon_small;
  
  // Check if we have real prices
  const hasRealPrices = useMemo(() => {
    if (!hasServiceParts || !ukrainePrices) return false;
    return Object.values(device.service_parts).some(part => part.article && ukrainePrices[part.article]);
  }, [device, ukrainePrices, hasServiceParts]);
  
  // Calculate approximate total price
  const totalPrice = useMemo(() => {
    if (!hasRealPrices) return null;
    let sum = 0;
    Object.values(device.service_parts).forEach(part => {
      if (part.article && ukrainePrices[part.article]) {
        sum += ukrainePrices[part.article].price_uah || 0;
      }
    });
    return sum > 0 ? sum : null;
  }, [device, ukrainePrices, hasRealPrices]);
  
  // Determine device generation/era for styling
  const getGenerationColor = () => {
    if (!device.year) return 'from-slate-50 to-slate-100';
    if (device.year >= 2025) return 'from-fuchsia-50 to-pink-100';   // 2025+
    if (device.year >= 2024) return 'from-violet-50 to-purple-100'; // Latest
    if (device.year >= 2021) return 'from-blue-50 to-indigo-100';   // Modern
    if (device.year >= 2018) return 'from-emerald-50 to-teal-100';  // Recent
    return 'from-amber-50 to-orange-100'; // Legacy
  };
  
  // Get repair complexity indicator
  const getRepairIndicator = () => {
    if (device.repairability) {
      if (device.repairability >= 7) return { icon: '✅', text: 'Легкий', color: 'text-green-600' };
      if (device.repairability >= 4) return { icon: '⚠️', text: 'Средний', color: 'text-yellow-600' };
      return { icon: '🔴', text: 'Сложный', color: 'text-red-600' };
    }
    return null;
  };
  
  const repairInfo = getRepairIndicator();
  
  // Image loading error handler - fall back to emoji icon
  const [imageError, setImageError] = useState(false);
  
  return h('div', {
    onClick: () => onSelect(device),
    className: `bg-gradient-to-br ${getGenerationColor()} rounded-2xl border border-slate-200 p-4 hover:border-indigo-400 hover:shadow-xl cursor-pointer transition-all duration-200 group relative overflow-hidden`
  },
    // Decorative corner accent
    h('div', { className: 'absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-indigo-200/30 to-purple-300/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500' }),
    
    // Header with icon and badges
    h('div', { className: 'flex items-start justify-between gap-3 mb-3 relative' },
      h('div', { className: 'flex-1' },
        h('div', { className: 'flex flex-wrap gap-1.5 mb-2' },
          h('span', { className: 'px-2 py-0.5 rounded-full text-xs font-bold bg-white/80 text-indigo-700 shadow-sm' }, device.category),
          device.year && h('span', { className: cn('px-2 py-0.5 rounded-full text-xs font-bold shadow-sm',
            device.year >= 2025 ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white' :
            device.year >= 2024 ? 'bg-violet-500 text-white' : 
            device.year >= 2021 ? 'bg-blue-500 text-white' : 'bg-white/80 text-slate-700'
          ) }, device.year),
          hasRealPrices && h('span', { className: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white shadow-sm animate-pulse' }, '💰'),
          device.charging_ic && h('span', { className: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900 shadow-sm' }, '⚡'),
          (device.board_numbers?.length > 0) && h('span', { className: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500 text-white shadow-sm' }, '🖥️')
        ),
        h('h3', { className: 'font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2' }, device.name),
        device.model && h('p', { className: 'text-xs text-slate-500 mt-1 font-mono truncate' }, device.model.split('/')[0])
      ),
      // Device Icon - Show image if available, otherwise emoji
      h('div', { className: 'flex flex-col items-center' },
        (hasDeviceIcon && !imageError) 
          ? h('div', { className: 'relative w-16 h-16 group-hover:scale-110 transition-transform' },
              h('img', {
                src: device.device_icon_small || device.device_icon,
                alt: device.name,
                className: 'w-full h-full object-contain drop-shadow-md rounded-lg',
                loading: 'lazy',
                onError: () => setImageError(true)
              }),
              // Source indicator
              device.icon_source && h('span', { 
                className: 'absolute -bottom-1 -right-1 w-4 h-4 rounded-full text-[8px] flex items-center justify-center bg-white shadow border border-slate-200',
                title: `Source: ${device.icon_source}`
              }, device.icon_source === 'ifixit' ? '🔧' : device.icon_source === 'pngimg' ? '🖼️' : '📱')
            )
          : h('span', { className: 'text-4xl drop-shadow-md group-hover:scale-110 transition-transform' }, icon),
        repairInfo && h('span', { className: `text-xs font-semibold ${repairInfo.color} mt-1` }, repairInfo.icon)
      )
    ),
    
    // Processor badge (prominent)
    device.processor && h('div', { className: 'mb-3' },
      h('div', { className: 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md' },
        h('span', { className: 'text-white/80 text-xs' }, '🧠'),
        h('span', { className: 'text-white font-bold text-sm' }, device.processor)
      )
    ),
    
    // Model numbers (LL/A, ZA/A, etc.) - extracted from device.model
    device.model && h('div', { className: 'mb-3' },
      h('div', { className: 'flex flex-wrap gap-1.5' },
        ...device.model.split('/').map((m, i) => 
          h('span', { key: i, className: 'px-2 py-1 bg-slate-100/90 text-slate-700 rounded-lg text-xs font-mono font-semibold border border-slate-200' }, m.trim())
        )
      )
    ),
    
    // Board numbers (if available)
    (device.board_numbers?.length > 0) && h('div', { className: 'mb-3' },
      h('div', { className: 'flex flex-wrap gap-1.5' },
        ...device.board_numbers.slice(0, 2).map((bn, i) => 
          h('span', { key: i, className: 'px-2 py-1 bg-white/80 text-purple-700 rounded-lg text-xs font-mono font-semibold shadow-sm border border-purple-200' }, bn)
        ),
        device.board_numbers.length > 2 && h('span', { className: 'px-2 py-1 text-xs text-slate-500 bg-white/50 rounded-lg' }, `+${device.board_numbers.length - 2}`)
      )
    ),
    
    // Charging IC quick info
    device.charging_ic && h('div', { className: 'mb-3 p-2 bg-yellow-100/80 rounded-lg' },
      h('div', { className: 'flex items-center gap-2 text-xs' },
        h('span', { className: 'text-yellow-700' }, '⚡ IC:'),
        h('span', { className: 'font-bold text-yellow-800' }, device.charging_ic.main)
      )
    ),
    
    // Stats row
    h('div', { className: 'flex items-center justify-between pt-3 border-t border-slate-200/50' },
      h('div', { className: 'flex items-center gap-2 text-xs' },
        hasServiceParts && h('div', { className: 'flex items-center gap-1 px-2 py-1 bg-white/70 rounded-full' },
          h('span', null, '🔧'),
          h('span', { className: 'font-semibold text-slate-700' }, `${partsCount}`)
        ),
        totalPrice && h('div', { className: 'flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full' },
          h('span', null, '💰'),
          h('span', { className: 'font-bold text-green-700' }, formatPrice(totalPrice, 'UAH'))
        ),
        device.common_issues?.length > 0 && h('div', { className: 'flex items-center gap-1 px-2 py-1 bg-red-100 rounded-full' },
          h('span', null, '⚠️'),
          h('span', { className: 'font-semibold text-red-700' }, device.common_issues.length)
        )
      ),
      h('span', { className: 'text-indigo-600 text-sm font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1' }, 
        'Детали', 
        h('span', { className: 'text-lg' }, '→')
      )
    )
  );
};

// ===== DEVICE DETAILS VIEW (ENHANCED v6.5) =====
const DeviceDetailsView = ({ device, onBack, ukrainePrices, onSelectItem, icData, measurementsData, compatibilityData }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [priceRegion, setPriceRegion] = useState('UA');
  
  const serviceParts = device.service_parts || {};
  const hasServiceParts = Object.keys(serviceParts).length > 0;
  
  // Part type labels
  const partLabels = {
    battery: '🔋 Батарея',
    display: '📱 Дисплей',
    rear_camera: '📷 Задняя камера',
    front_camera: '🤳 Фронт. камера',
    speaker: '🔊 Динамик',
    taptic_engine: '📳 Taptic Engine',
    keyboard: '⌨️ Клавиатура',
    charging_port: '⚡ Разъём зарядки',
    logic_board: '🖥️ Плата',
    trackpad: '🖱️ Трекпад',
    top_case: '⌨️ Top Case'
  };
  
  // Get IC data for this device
  const deviceICs = useMemo(() => {
    if (!icData) return [];
    const ics = [];
    
    // Check all IC categories
    ['charging_ics', 'power_ics', 'audio_ics', 'baseband_ics', 'wifi_bt_ics', 'biometric_ics'].forEach(category => {
      const list = icData[category] || [];
      list.forEach(ic => {
        if (ic.compatible_devices?.some(d => 
          device.name.includes(d) || d.includes(device.name.split(' ').slice(0,2).join(' '))
        )) {
          ics.push({ ...ic, category });
        }
      });
    });
    
    return ics;
  }, [device, icData]);
  
  // Get real prices for parts
  const partsWithPrices = useMemo(() => {
    if (!hasServiceParts) return [];
    return Object.entries(serviceParts).map(([type, part]) => {
      const uaData = ukrainePrices?.[part.article];
      const uaPrice = uaData?.price_uah || (part.price_usd ? part.price_usd * RATES.USD_TO_UAH : null);
      const euPrice = part.price_usd ? part.price_usd * 0.91 : (uaPrice ? uaPrice * RATES.UAH_TO_EUR : null);
      return {
        type,
        label: partLabels[type] || type.replace('_', ' '),
        ...part,
        price_uah: uaPrice,
        price_eur: euPrice,
        price_usd: part.price_usd || (uaPrice ? uaPrice * RATES.UAH_TO_USD : null)
      };
    });
  }, [serviceParts, ukrainePrices]);
  
  // Power rails data based on device
  const powerRails = useMemo(() => {
    if (!measurementsData?.power_rails?.rails) return [];
    return Object.entries(measurementsData.power_rails.rails)
      .filter(([_, rail]) => !rail.models || rail.models === 'All iPhone' || 
        device.name.toLowerCase().includes('iphone') ||
        rail.models.toLowerCase().includes(device.category.toLowerCase()))
      .map(([key, rail]) => ({ id: key, ...rail }));
  }, [device, measurementsData]);
  
  // Get compatibility data for components
  const componentCompatibility = useMemo(() => {
    if (!compatibilityData) return null;
    
    const compat = {
      cameras: [],
      displays: [],
      batteries: []
    };
    
    // Check rear cameras
    if (compatibilityData.rear_cameras) {
      Object.entries(compatibilityData.rear_cameras).forEach(([group, data]) => {
        if (data.compatible?.some(d => device.name.includes(d))) {
          compat.cameras.push({
            type: 'rear',
            ...data,
            compatibleWith: data.compatible
          });
        }
      });
    }
    
    // Check front cameras
    if (compatibilityData.front_cameras) {
      Object.entries(compatibilityData.front_cameras).forEach(([group, devices]) => {
        if (devices?.some(d => device.name.includes(d))) {
          compat.cameras.push({
            type: 'front',
            compatibleWith: devices
          });
        }
      });
    }
    
    return compat;
  }, [device, compatibilityData]);
  
  const tabs = [
    { id: 'info', name: '📋 Информация' },
    { id: 'parts', name: '🔧 Запчасти' },
    { id: 'chips', name: '🔌 Микросхемы' },
    { id: 'diagnostics', name: '⚡ Диагностика' },
    { id: 'compatibility', name: '🔄 Совместимость' },
  ];
  
  return h('div', { className: 'space-y-4 pb-10' },
    // Header
    h('div', { className: 'flex items-start gap-4' },
      h('button', { 
        onClick: onBack, 
        className: 'w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center hover:shadow-xl' 
      }, h(Icons.Back)),
      h('div', { className: 'flex-1' },
        h('h1', { className: 'text-xl font-bold text-gray-800' }, device.name),
        h('p', { className: 'text-sm text-gray-500' }, device.model)
      )
    ),
    
    // Tags
    h('div', { className: 'flex flex-wrap gap-2' },
      device.year && h('span', { className: 'px-3 py-1 bg-white rounded-xl shadow text-sm' }, `📅 ${device.year}`),
      device.processor && h('span', { className: 'px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow text-sm' }, device.processor),
      ...(device.board_numbers || []).slice(0, 2).map((bn, i) => 
        h('span', { key: i, className: 'px-3 py-1 bg-purple-100 text-purple-700 rounded-xl text-sm' }, bn)
      )
    ),
    
    // Tabs
    h('div', { className: 'flex gap-2 overflow-x-auto pb-2' },
      ...tabs.map(tab => h('button', {
        key: tab.id,
        onClick: () => setActiveTab(tab.id),
        className: cn('px-4 py-2 rounded-xl font-medium whitespace-nowrap text-sm transition-all',
          activeTab === tab.id ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100')
      }, tab.name))
    ),
    
    // Info Tab (ENHANCED)
    activeTab === 'info' && h('div', { className: 'space-y-4' },
      // Device Overview Card
      h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-4' }, '📋 Обзор устройства'),
        h('div', { className: 'grid grid-cols-2 md:grid-cols-3 gap-3' },
          // Year
          device.year && h('div', { className: 'p-3 bg-slate-50 rounded-xl' },
            h('p', { className: 'text-xs text-slate-500' }, '📅 Год выпуска'),
            h('p', { className: 'font-bold text-slate-800' }, device.year)
          ),
          // Model number
          device.model && h('div', { className: 'p-3 bg-slate-50 rounded-xl' },
            h('p', { className: 'text-xs text-slate-500' }, '📱 Модель'),
            h('p', { className: 'font-bold text-slate-800 text-sm' }, device.model.split('/')[0])
          ),
          // Processor
          device.processor && h('div', { className: 'p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl' },
            h('p', { className: 'text-xs text-purple-600' }, '🧠 Процессор'),
            h('p', { className: 'font-bold text-purple-800' }, device.processor)
          ),
          // Architecture
          device.architecture && h('div', { className: 'p-3 bg-slate-50 rounded-xl' },
            h('p', { className: 'text-xs text-slate-500' }, '⚙️ Архитектура'),
            h('p', { className: 'font-bold text-slate-800 text-sm' }, device.architecture)
          ),
          // Charging IC
          device.charging_ic && h('div', { className: 'p-3 bg-yellow-50 rounded-xl' },
            h('p', { className: 'text-xs text-yellow-700' }, '⚡ Charging IC'),
            h('p', { className: 'font-bold text-yellow-800' }, device.charging_ic.main)
          ),
          // Connector type
          device.connector_type && h('div', { className: 'p-3 bg-slate-50 rounded-xl' },
            h('p', { className: 'text-xs text-slate-500' }, '🔌 Разъём'),
            h('p', { className: 'font-bold text-slate-800' }, device.connector_type)
          )
        )
      ),
      
      // Board Numbers Card
      (device.board_numbers?.length > 0 || device.emc) && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-3' }, '🖥️ Идентификация платы'),
        h('div', { className: 'space-y-3' },
          device.board_numbers?.length > 0 && h('div', null,
            h('p', { className: 'text-xs text-slate-500 mb-2' }, 'Board Numbers'),
            h('div', { className: 'flex flex-wrap gap-2' },
              ...device.board_numbers.map((bn, i) => 
                h('span', { key: i, className: 'px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg font-mono text-sm font-semibold' }, bn)
              )
            )
          ),
          device.emc && h('div', { className: 'flex items-center gap-2' },
            h('span', { className: 'text-xs text-slate-500' }, 'EMC:'),
            h('span', { className: 'px-2 py-1 bg-slate-100 rounded font-mono text-sm' }, device.emc)
          )
        )
      ),
      
      // Common Issues Card
      device.common_issues?.length > 0 && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-3' }, '⚠️ Типовые неисправности'),
        h('ul', { className: 'space-y-2' },
          ...device.common_issues.slice(0, 8).map((issue, i) =>
            h('li', { key: i, className: 'flex items-start gap-2 text-sm text-slate-700 p-2 bg-red-50 rounded-lg' },
              h('span', { className: 'text-red-500 mt-0.5' }, '⚡'), issue
            )
          )
        )
      ),
      
      // Repair Info
      (device.repair_difficulty || device.repair_time || device.repairability) && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-3' }, '🔧 Информация о ремонте'),
        h('div', { className: 'grid grid-cols-2 md:grid-cols-3 gap-3' },
          device.repair_difficulty && h('div', { className: 'p-4 bg-slate-50 rounded-xl text-center' },
            h('p', { className: 'text-xs text-slate-500 mb-1' }, 'Сложность'),
            h('p', { className: cn('text-lg font-bold',
              device.repair_difficulty.includes('Экстремал') || device.repair_difficulty.includes('Expert') ? 'text-red-600' :
              device.repair_difficulty.includes('Сложн') || device.repair_difficulty.includes('Advanced') ? 'text-orange-600' : 'text-green-600'
            ) }, device.repair_difficulty)
          ),
          device.repair_time && h('div', { className: 'p-4 bg-slate-50 rounded-xl text-center' },
            h('p', { className: 'text-xs text-slate-500 mb-1' }, 'Время'),
            h('p', { className: 'text-lg font-bold text-blue-600' }, device.repair_time)
          ),
          device.repairability && h('div', { className: 'p-4 bg-slate-50 rounded-xl text-center' },
            h('p', { className: 'text-xs text-slate-500 mb-1' }, 'iFixit Score'),
            h('p', { className: cn('text-lg font-bold',
              device.repairability >= 7 ? 'text-green-600' :
              device.repairability >= 4 ? 'text-yellow-600' : 'text-red-600'
            ) }, `${device.repairability}/10`)
          )
        )
      ),
      
      // Official Service Prices (if available)
      device.official_service_prices && Object.keys(device.official_service_prices).length > 0 && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-3' }, '🍎 Официальный сервис Apple (USD)'),
        h('div', { className: 'grid grid-cols-2 md:grid-cols-3 gap-2' },
          ...Object.entries(device.official_service_prices).map(([key, price]) =>
            h('div', { key, className: 'p-3 bg-blue-50 rounded-xl' },
              h('p', { className: 'text-xs text-blue-600 capitalize' }, key.replace('_', ' ')),
              h('p', { className: 'font-bold text-blue-800' }, formatPrice(price, 'USD'))
            )
          )
        )
      ),
      
      // Description
      device.description && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-3' }, '📝 Описание'),
        h('p', { className: 'text-sm text-slate-700' }, device.description)
      )
    ),
    
    // Parts Tab
    activeTab === 'parts' && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
      h('div', { className: 'flex justify-between items-center mb-4' },
        h('h2', { className: 'text-lg font-bold text-gray-800' }, '🔧 Запчасти и цены'),
        // Region toggle
        h('div', { className: 'flex gap-1 bg-slate-100 rounded-lg p-1' },
          h('button', {
            onClick: () => setPriceRegion('UA'),
            className: cn('px-3 py-1 rounded-md text-xs font-medium transition-all',
              priceRegion === 'UA' ? 'bg-yellow-400 text-yellow-900' : 'text-slate-600 hover:bg-slate-200')
          }, '🇺🇦 UA'),
          h('button', {
            onClick: () => setPriceRegion('EU'),
            className: cn('px-3 py-1 rounded-md text-xs font-medium transition-all',
              priceRegion === 'EU' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-200')
          }, '🇪🇺 EU')
        )
      ),
      partsWithPrices.length === 0 
        ? h('p', { className: 'text-slate-500 text-center py-4' }, 'Нет данных о запчастях для этого устройства')
        : h('div', { className: 'space-y-3' },
            ...partsWithPrices.map((part, i) => 
              h('div', { 
                key: i,
                onClick: () => onSelectItem({ ...part, type: 'article' }),
                className: 'p-3 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors border border-transparent hover:border-indigo-200'
              },
                h('div', { className: 'flex justify-between items-start' },
                  h('div', { className: 'flex-1' },
                    h('p', { className: 'font-semibold text-slate-800' }, part.label),
                    h('p', { className: 'font-mono text-xs text-indigo-600' }, part.article),
                    part.description && h('p', { className: 'text-xs text-slate-500 truncate max-w-[200px]' }, part.description)
                  ),
                  h('div', { className: 'text-right' },
                    priceRegion === 'UA' 
                      ? (part.price_uah 
                          ? h('div', null,
                              h('p', { className: 'font-bold text-amber-600' }, formatPrice(part.price_uah, 'UAH')),
                              h('p', { className: 'text-xs text-slate-500' }, `≈ ${formatPrice(part.price_usd, 'USD')}`)
                            )
                          : h('p', { className: 'text-sm text-slate-400' }, '—')
                        )
                      : (part.price_eur
                          ? h('div', null,
                              h('p', { className: 'font-bold text-blue-600' }, formatPrice(part.price_eur, 'EUR')),
                              h('p', { className: 'text-xs text-slate-500' }, `≈ ${formatPrice(part.price_usd, 'USD')}`)
                            )
                          : h('p', { className: 'text-sm text-slate-400' }, '—')
                        )
                  )
                )
              )
            ),
            // Summary
            h('div', { className: 'mt-4 pt-4 border-t border-slate-200' },
              h('div', { className: 'flex justify-between items-center' },
                h('span', { className: 'text-sm text-slate-600' }, '💰 Всего деталей:'),
                h('span', { className: 'font-bold text-slate-800' }, partsWithPrices.length)
              ),
              h('div', { className: 'flex justify-between items-center mt-1' },
                h('span', { className: 'text-sm text-slate-600' }, '💵 Сумма (примерно):'),
                h('span', { className: cn('font-bold', priceRegion === 'UA' ? 'text-amber-600' : 'text-blue-600') }, 
                  priceRegion === 'UA'
                    ? formatPrice(partsWithPrices.reduce((sum, p) => sum + (p.price_uah || 0), 0), 'UAH')
                    : formatPrice(partsWithPrices.reduce((sum, p) => sum + (p.price_eur || 0), 0), 'EUR')
                )
              )
            )
          )
    ),
    
    // Chips/IC Tab (NEW)
    activeTab === 'chips' && h('div', { className: 'space-y-4' },
      // Main chips from device data
      h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-4' }, '🔌 Основные микросхемы'),
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
          // Charging IC
          device.charging_ic && h('div', { 
            className: 'p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 cursor-pointer hover:shadow-md transition-all',
            onClick: () => {
              const ic = icData?.charging_ics?.find(c => c.name === device.charging_ic.main);
              if (ic) onSelectItem({ ...ic, type: 'ic' });
            }
          },
            h('div', { className: 'flex items-center gap-3' },
              h('div', { className: 'w-10 h-10 rounded-lg bg-yellow-200 flex items-center justify-center' }, '⚡'),
              h('div', null,
                h('p', { className: 'text-xs text-yellow-700 font-semibold' }, 'Charging IC (U2/Tristar)'),
                h('p', { className: 'font-bold text-slate-800' }, device.charging_ic.main),
                device.charging_ic.designation && h('p', { className: 'text-xs text-slate-500' }, device.charging_ic.designation)
              )
            )
          ),
          
          // Processor
          device.processor && h('div', { className: 'p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200' },
            h('div', { className: 'flex items-center gap-3' },
              h('div', { className: 'w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center' }, '🧠'),
              h('div', null,
                h('p', { className: 'text-xs text-purple-700 font-semibold' }, 'Процессор (SoC)'),
                h('p', { className: 'font-bold text-slate-800' }, device.processor),
                h('p', { className: 'text-xs text-slate-500' }, device.architecture || (device.processor.includes('M') ? 'Apple Silicon' : 'A-series'))
              )
            )
          ),
          
          // Power IC (if known)
          device.power_ic && h('div', { className: 'p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200' },
            h('div', { className: 'flex items-center gap-3' },
              h('div', { className: 'w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center' }, '🔋'),
              h('div', null,
                h('p', { className: 'text-xs text-green-700 font-semibold' }, 'Power Management IC'),
                h('p', { className: 'font-bold text-slate-800' }, device.power_ic)
              )
            )
          ),
          
          // Audio Codec (if known)
          device.audio_codec && h('div', { className: 'p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200' },
            h('div', { className: 'flex items-center gap-3' },
              h('div', { className: 'w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center' }, '🔊'),
              h('div', null,
                h('p', { className: 'text-xs text-blue-700 font-semibold' }, 'Audio Codec'),
                h('p', { className: 'font-bold text-slate-800' }, device.audio_codec)
              )
            )
          )
        )
      ),
      
      // Matched ICs from database
      deviceICs.length > 0 && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-4' }, '📋 Совместимые IC из базы'),
        h('div', { className: 'space-y-3' },
          ...deviceICs.map((ic, i) => h('div', {
            key: i,
            onClick: () => onSelectItem({ ...ic, type: 'ic' }),
            className: 'p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-transparent hover:border-violet-200'
          },
            h('div', { className: 'flex justify-between items-start' },
              h('div', null,
                h('p', { className: 'font-bold text-violet-700' }, ic.name),
                ic.designation && h('p', { className: 'text-sm text-slate-600' }, ic.designation),
                h('p', { className: 'text-xs text-slate-400 mt-1' }, ic.category.replace('_', ' '))
              ),
              h('div', { className: 'text-right' },
                ic.price_range && h('p', { className: 'text-sm font-semibold text-green-600' }, ic.price_range),
                ic.difficulty && h('span', { 
                  className: cn('text-xs px-2 py-0.5 rounded-full',
                    ic.difficulty === 'Expert' ? 'bg-red-100 text-red-700' :
                    ic.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  )
                }, ic.difficulty)
              )
            )
          ))
        )
      ),
      
      // If no ICs found
      deviceICs.length === 0 && !device.charging_ic && h('div', { className: 'bg-slate-50 rounded-2xl p-8 text-center' },
        h('p', { className: 'text-slate-500' }, '🔍 Нет данных о микросхемах для этого устройства')
      )
    ),
    
    // Diagnostics Tab (ENHANCED)
    activeTab === 'diagnostics' && h('div', { className: 'space-y-4' },
      // Board numbers
      (device.board_numbers?.length > 0) && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-3' }, '🖥️ Board Numbers'),
        h('div', { className: 'flex flex-wrap gap-2' },
          ...device.board_numbers.map((bn, i) => 
            h('span', { key: i, className: 'px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg font-mono text-sm' }, bn)
          )
        ),
        device.emc && h('p', { className: 'text-sm text-slate-500 mt-2' }, `EMC: ${device.emc}`)
      ),
      
      // Quick diagnostic info
      device.charging_ic && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-3' }, '⚡ Быстрая диагностика зарядки'),
        h('div', { className: 'p-4 bg-yellow-50 rounded-xl' },
          h('p', { className: 'font-semibold text-yellow-800 mb-2' }, `IC: ${device.charging_ic.main}`),
          h('div', { className: 'text-sm text-slate-700 space-y-1' },
            h('p', null, '• Диодный режим D+/D-: 0.400-0.600V'),
            h('p', null, '• PP5V0_USB: 5.0V при подключении'),
            h('p', null, '• Ток покоя: 0.05-0.20A')
          ),
          h('div', { className: 'mt-3 p-3 bg-red-50 rounded-lg' },
            h('p', { className: 'text-xs font-semibold text-red-700' }, '⚠️ Симптомы неисправности:'),
            h('p', { className: 'text-xs text-red-600' }, 'Не заряжается, "Аксессуар не поддерживается", Нет определения в iTunes')
          )
        )
      ),
      
      // Power Rails (from measurements.json)
      powerRails.length > 0 && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-3' }, '📊 Шины питания (Power Rails)'),
        h('div', { className: 'space-y-3' },
          ...powerRails.slice(0, 6).map(rail => h('div', { key: rail.id, className: 'p-3 bg-slate-50 rounded-xl' },
            h('div', { className: 'flex justify-between items-start mb-2' },
              h('div', null,
                h('p', { className: 'font-semibold text-slate-800' }, rail.name),
                h('p', { className: 'text-xs text-slate-500' }, rail.id)
              ),
              h('span', { className: 'px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-mono' }, rail.voltage)
            ),
            h('div', { className: 'grid grid-cols-2 gap-2 text-xs' },
              h('div', { className: 'p-2 bg-blue-50 rounded' },
                h('p', { className: 'text-blue-600' }, 'Диод режим'),
                h('p', { className: 'font-mono text-slate-700' }, rail.diode_mode_normal)
              ),
              h('div', { className: 'p-2 bg-red-50 rounded' },
                h('p', { className: 'text-red-600' }, 'КЗ если'),
                h('p', { className: 'font-mono text-slate-700' }, rail.short_threshold)
              )
            )
          ))
        )
      ),
      
      // If no diagnostics data
      !device.charging_ic && powerRails.length === 0 && h('div', { className: 'bg-slate-50 rounded-2xl p-8 text-center' },
        h('p', { className: 'text-slate-500' }, '🔍 Нет данных диагностики для этого устройства')
      )
    ),
    
    // Compatibility Tab (NEW)
    activeTab === 'compatibility' && h('div', { className: 'space-y-4' },
      // Component compatibility info
      h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-4' }, '🔄 Совместимость компонентов'),
        h('p', { className: 'text-sm text-slate-600 mb-4' }, 
          'Информация о взаимозаменяемости компонентов между моделями'
        ),
        
        h('div', { className: 'space-y-4' },
          // Camera compatibility
          h('div', { className: 'p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200' },
            h('h3', { className: 'font-bold text-blue-800 mb-3 flex items-center gap-2' },
              h('span', { className: 'w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center' }, '📷'),
              'Камеры'
            ),
            componentCompatibility?.cameras?.length > 0 
              ? h('div', { className: 'space-y-2' },
                  ...componentCompatibility.cameras.map((cam, i) => h('div', { key: i, className: 'p-3 bg-white/80 rounded-lg' },
                    h('p', { className: 'text-sm font-semibold text-slate-700 mb-2' }, 
                      `${cam.type === 'rear' ? '📷 Задняя' : '🤳 Фронтальная'} камера`
                    ),
                    cam.resolution && h('p', { className: 'text-xs text-slate-500' }, `Разрешение: ${cam.resolution}`),
                    cam.features && h('p', { className: 'text-xs text-slate-500' }, `Особенности: ${cam.features.join(', ')}`),
                    cam.compatibleWith && h('div', { className: 'mt-2' },
                      h('p', { className: 'text-xs text-slate-500 mb-1' }, 'Совместимо с:'),
                      h('div', { className: 'flex flex-wrap gap-1' },
                        ...cam.compatibleWith.map((d, j) => h('span', { 
                          key: j, 
                          className: 'px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs' 
                        }, d))
                      )
                    ),
                    cam.notes && h('p', { className: 'text-xs text-amber-600 mt-2' }, `⚠️ ${cam.notes}`)
                  ))
                )
              : h('p', { className: 'text-sm text-slate-500' }, 'Данные о совместимости камер не найдены')
          ),
          
          // Display compatibility
          h('div', { className: 'p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200' },
            h('h3', { className: 'font-bold text-purple-800 mb-3 flex items-center gap-2' },
              h('span', { className: 'w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center' }, '📱'),
              'Дисплеи'
            ),
            h('div', { className: 'p-3 bg-white/80 rounded-lg' },
              h('p', { className: 'text-sm text-slate-700' }, 
                device.category === 'iPhone' 
                  ? 'Дисплеи iPhone обычно НЕ взаимозаменяемы между моделями. True Tone требует калибровки.'
                  : 'Для точной информации о совместимости дисплеев проверьте номер детали.'
              ),
              h('div', { className: 'mt-2 p-2 bg-amber-50 rounded' },
                h('p', { className: 'text-xs text-amber-700' }, 
                  '⚠️ Замена дисплея может привести к потере True Tone без специального оборудования для калибровки'
                )
              )
            )
          ),
          
          // Battery compatibility
          h('div', { className: 'p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200' },
            h('h3', { className: 'font-bold text-green-800 mb-3 flex items-center gap-2' },
              h('span', { className: 'w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center' }, '🔋'),
              'Батареи'
            ),
            h('div', { className: 'p-3 bg-white/80 rounded-lg' },
              h('p', { className: 'text-sm text-slate-700 mb-2' }, 
                'Батареи обычно уникальны для каждой модели из-за различий в форме и разъёмах.'
              ),
              device.service_parts?.battery && h('div', { className: 'space-y-1 text-sm' },
                device.service_parts.battery.article && h('p', { className: 'text-slate-600' },
                  'Артикул: ',
                  h('span', { className: 'font-mono font-bold text-green-600' }, device.service_parts.battery.article)
                ),
                device.service_parts.battery.description && h('p', { className: 'text-slate-600' },
                  device.service_parts.battery.description
                )
              ),
              h('div', { className: 'mt-2 p-2 bg-red-50 rounded' },
                h('p', { className: 'text-xs text-red-700' }, 
                  '⚠️ Использование неоригинальной батареи может привести к предупреждению в iOS и проблемам с Battery Health'
                )
              )
            )
          ),
          
          // Charging IC compatibility (for iPhone)
          device.charging_ic && h('div', { className: 'p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200' },
            h('h3', { className: 'font-bold text-yellow-800 mb-3 flex items-center gap-2' },
              h('span', { className: 'w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center' }, '⚡'),
              'Контроллер зарядки'
            ),
            h('div', { className: 'p-3 bg-white/80 rounded-lg' },
              h('div', { className: 'flex items-center gap-3 mb-2' },
                h('span', { className: 'px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg font-mono font-bold' }, device.charging_ic.main),
                device.charging_ic.designation && h('span', { className: 'text-sm text-slate-600' }, device.charging_ic.designation)
              ),
              h('p', { className: 'text-sm text-slate-600' }, 
                'Этот IC контроллер используется в данном устройстве. Нажмите на вкладку "Микросхемы" для детальной информации.'
              )
            )
          )
        )
      ),
      
      // General compatibility notes
      h('div', { className: 'bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-5 text-white' },
        h('h2', { className: 'text-lg font-bold mb-3 flex items-center gap-2' },
          h('span', { className: 'w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center' }, '💡'),
          'Советы по совместимости'
        ),
        h('ul', { className: 'space-y-2 text-sm' },
          h('li', { className: 'flex items-start gap-2 p-2 bg-white/10 rounded-lg' },
            h('span', null, '✓'),
            'Всегда проверяйте номер модели и артикул перед заказом запчастей'
          ),
          h('li', { className: 'flex items-start gap-2 p-2 bg-white/10 rounded-lg' },
            h('span', null, '✓'),
            'Face ID и Touch ID компоненты привязаны к материнской плате и не переносятся'
          ),
          h('li', { className: 'flex items-start gap-2 p-2 bg-white/10 rounded-lg' },
            h('span', null, '✓'),
            'Камеры iPhone 12+ требуют программирования для полной функциональности'
          ),
          h('li', { className: 'flex items-start gap-2 p-2 bg-white/10 rounded-lg' },
            h('span', null, '✓'),
            'Батареи отображают "Service" без оригинального BMS чипа'
          )
        )
      )
    )
  );
};

// ===== QUICK ACTION CARD =====
const QuickCard = ({ name, icon, count, color, onClick }) => {
  const colors = {
    green: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    violet: 'from-violet-500 to-purple-600',
    red: 'from-red-500 to-rose-600',
    blue: 'from-blue-500 to-cyan-600',
    indigo: 'from-indigo-500 to-purple-600',
  };
  
  return h('button', {
    onClick,
    className: 'bg-white rounded-2xl p-4 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all text-left'
  },
    h('div', { className: `w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white mb-3` },
      icon
    ),
    h('h3', { className: 'font-semibold text-slate-800' }, name),
    count && h('p', { className: 'text-xs text-slate-500 mt-1' }, count)
  );
};

// ===== MAIN APP =====
const App = () => {
  // Data states
  const [devices, setDevices] = useState([]);
  const [ukrainePrices, setUkrainePrices] = useState(null);
  const [logicBoards, setLogicBoards] = useState(null);
  const [logicBoardsSpecs, setLogicBoardsSpecs] = useState(null);
  const [articleData, setArticleData] = useState(null);
  const [errorData, setErrorData] = useState(null);
  const [icData, setICData] = useState(null);
  const [knowledgeData, setKnowledgeData] = useState(null);
  const [measurementsData, setMeasurementsData] = useState(null);
  const [compatibilityData, setCompatibilityData] = useState(null);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Panel states
  const [showPrices, setShowPrices] = useState(false);
  const [showBoards, setShowBoards] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [showICs, setShowICs] = useState(false);
  const [showKeyCombos, setShowKeyCombos] = useState(false);
  
  // Load data
  useEffect(() => {
    Promise.all([
      fetch('/data/devices.json').then(r => r.json()),
      fetch('/data/ukraine_prices.json').then(r => r.json()).catch(() => null),
      fetch('/data/logic_boards_comprehensive.json').then(r => r.json()).catch(() => null),
      fetch('/data/logic_boards_specs.json').then(r => r.json()).catch(() => null),
      fetch('/data/article_search_index.json').then(r => r.json()).catch(() => null),
      fetch('/data/error_codes.json').then(r => r.json()).catch(() => null),
      fetch('/data/ic_compatibility.json').then(r => r.json()).catch(() => null),
      fetch('/data/repair_knowledge.json').then(r => r.json()).catch(() => null),
      fetch('/data/measurements.json').then(r => r.json()).catch(() => null),
      fetch('/data/camera_compatibility.json').then(r => r.json()).catch(() => null),
    ])
    .then(([devicesData, ukraine, boards, boardsSpecs, articles, errors, ic, knowledge, measurements, compatibility]) => {
      setDevices(Array.isArray(devicesData) ? devicesData : []);
      setUkrainePrices(ukraine);
      setLogicBoards(boards);
      setLogicBoardsSpecs(boardsSpecs);
      setArticleData(articles);
      setErrorData(errors);
      setICData(ic);
      setKnowledgeData(knowledge);
      setMeasurementsData(measurements);
      setCompatibilityData(compatibility);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error loading data:', err);
      setLoading(false);
    });
  }, []);
  
  // Categories
  const categories = useMemo(() => {
    const cats = new Set(devices.map(d => d.category).filter(Boolean));
    return ['all', ...Array.from(cats).sort()];
  }, [devices]);
  
  // Years
  const years = useMemo(() => {
    const yrs = new Set(devices.map(d => d.year).filter(Boolean));
    return ['all', ...Array.from(yrs).sort((a, b) => b - a)];
  }, [devices]);
  
  // Filtered and sorted devices
  const filteredDevices = useMemo(() => {
    let result = devices;
    if (selectedCategory !== 'all') {
      result = result.filter(d => d.category === selectedCategory);
    }
    if (selectedYear !== 'all') {
      result = result.filter(d => d.year === parseInt(selectedYear));
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(d =>
        (d.name || '').toLowerCase().includes(term) ||
        (d.model || '').toLowerCase().includes(term) ||
        (d.processor || '').toLowerCase().includes(term) ||
        (d.board_numbers || []).some(bn => bn.toLowerCase().includes(term))
      );
    }
    // Sort by year (newest first), then by name within same year
    return result.sort((a, b) => {
      // First sort by year descending
      if (b.year !== a.year) return (b.year || 0) - (a.year || 0);
      // Then by category order (iPhone, iPad, MacBook)
      const catOrder = { 'iPhone': 0, 'iPad': 1, 'MacBook': 2 };
      const catA = catOrder[a.category] ?? 99;
      const catB = catOrder[b.category] ?? 99;
      if (catA !== catB) return catA - catB;
      // Finally by name for devices in same year and category
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [devices, searchTerm, selectedCategory, selectedYear]);
  
  // Stats
  const stats = useMemo(() => ({
    devices: devices.length,
    prices: ukrainePrices ? Object.keys(ukrainePrices).length : 0,
    boards: logicBoardsSpecs?.total || (logicBoards ? (logicBoards.m_series_boards?.length || 0) + (logicBoards.intel_boards?.length || 0) : 0),
    errors: errorData ? (errorData.itunes_restore_errors?.length || 0) + (errorData.mac_diagnostics?.length || 0) : 0,
    ics: icData ? Object.values(icData).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0) : 0
  }), [devices, ukrainePrices, logicBoards, logicBoardsSpecs, errorData, icData]);
  
  // Handle item selection
  const handleSelectItem = useCallback((item) => {
    setSelectedItem(item);
  }, []);
  
  // Loading
  if (loading) {
    return h('div', { className: 'min-h-screen bg-gray-100 flex items-center justify-center' },
      h('div', { className: 'text-center' },
        h('div', { className: 'w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4' }),
        h('p', { className: 'text-gray-600' }, 'Загрузка...')
      )
    );
  }
  
  // Device details view
  if (selectedDevice) {
    return h('div', { className: 'min-h-screen bg-gray-100 p-4' },
      h('div', { className: 'max-w-4xl mx-auto' },
        h(DeviceDetailsView, { 
          device: selectedDevice, 
          onBack: () => setSelectedDevice(null),
          ukrainePrices,
          onSelectItem: handleSelectItem,
          icData,
          measurementsData,
          compatibilityData
        })
      ),
      selectedItem && h(DetailModal, { 
        item: selectedItem, 
        type: selectedItem.type, 
        onClose: () => setSelectedItem(null),
        ukrainePrices 
      })
    );
  }
  
  // Main view
  return h('div', { className: 'min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20' },
    // Header
    h('div', { className: 'bg-white border-b border-gray-100 shadow-sm' },
      h('div', { className: 'max-w-6xl mx-auto px-4 py-4' },
        h('div', { className: 'flex items-center justify-between flex-wrap gap-4' },
          h('div', { className: 'flex items-center gap-4' },
            h('img', { 
              src: '/static/nexx-logo.png', 
              alt: 'NEXX Database',
              className: 'h-12 md:h-14 object-contain'
            }),
            h('p', { className: 'text-sm text-gray-600 font-medium hidden sm:block' }, 
              'База данных для ремонта Apple'
            )
          ),
          h('div', { className: 'flex flex-wrap gap-2 text-xs' },
            h('span', { className: 'px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold' }, 
              `📱 ${stats.devices} устройств`
            ),
            h('span', { className: 'px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 font-semibold' }, 
              `💰 ${stats.prices.toLocaleString()} цен`
            ),
            h('span', { className: 'px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 font-semibold' }, 
              `🖥️ ${stats.boards} плат`
            )
          )
        )
      )
    ),
    
    // Main content
    h('div', { className: 'max-w-6xl mx-auto px-4 py-6' },
      // Search
      h('div', { className: 'bg-white rounded-2xl shadow-sm border border-slate-200 p-2 mb-4' },
        h('div', { className: 'relative' },
          h('input', {
            type: 'text',
            placeholder: 'Поиск по модели, процессору, номеру платы...',
            value: searchTerm,
            onChange: e => setSearchTerm(e.target.value),
            className: 'w-full px-5 py-3 pl-12 rounded-xl border-0 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
          }),
          h('div', { className: 'absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' }, h(Icons.Search))
        )
      ),
      
      // Filters row (Categories + Year)
      h('div', { className: 'flex flex-wrap gap-4 mb-4 items-center' },
        // Categories
        h('div', { className: 'flex gap-2 overflow-x-auto pb-1' },
          ...categories.map(cat => h('button', {
            key: cat,
            onClick: () => setSelectedCategory(cat),
            className: cn('px-3 py-1.5 rounded-xl font-medium whitespace-nowrap text-sm transition-all',
              selectedCategory === cat ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100')
          }, cat === 'all' ? 'Все' : cat))
        ),
        
        // Year filter
        h('div', { className: 'flex items-center gap-2' },
          h('span', { className: 'text-sm text-slate-500' }, '📅'),
          h('select', {
            value: selectedYear,
            onChange: e => setSelectedYear(e.target.value),
            className: 'px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500'
          },
            ...years.map(yr => h('option', { key: yr, value: yr }, yr === 'all' ? 'Все года' : yr))
          )
        )
      ),
      
      // Quick actions (removed Артикулы card per user request)
      h('div', { className: 'grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6' },
        h(QuickCard, { 
          name: 'Цены', 
          icon: '💰', 
          count: `${stats.prices.toLocaleString()} позиций`, 
          color: 'amber',
          onClick: () => setShowPrices(true) 
        }),
        h(QuickCard, { 
          name: 'Платы', 
          icon: '🖥️', 
          count: `${stats.boards} плат`, 
          color: 'violet',
          onClick: () => setShowBoards(true) 
        }),
        h(QuickCard, { 
          name: 'Ошибки', 
          icon: '🚨', 
          count: `${stats.errors} кодов`, 
          color: 'red',
          onClick: () => setShowErrors(true) 
        }),
        h(QuickCard, { 
          name: 'Калькулятор', 
          icon: '🧮', 
          count: 'Расчёт цен', 
          color: 'blue',
          onClick: () => setShowCalculator(true) 
        }),
        h(QuickCard, { 
          name: 'База знаний', 
          icon: '📚', 
          count: 'Гайды', 
          color: 'green',
          onClick: () => setShowKnowledge(true) 
        }),
        h(QuickCard, { 
          name: 'Микросхемы', 
          icon: '🔌', 
          count: `${stats.ics} IC`, 
          color: 'violet',
          onClick: () => setShowICs(true) 
        }),
        h(QuickCard, { 
          name: 'DFU/Recovery', 
          icon: '⌨️', 
          count: 'Комбинации', 
          color: 'indigo',
          onClick: () => setShowKeyCombos(true) 
        })
      ),
      
      // Devices count
      h('p', { className: 'text-slate-500 mb-3 text-sm' }, `Найдено: ${filteredDevices.length}`),
      
      // Devices grid
      h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4' },
        ...filteredDevices.map(device =>
          h(DeviceCard, { 
            key: device.name, 
            device, 
            onSelect: setSelectedDevice,
            ukrainePrices 
          })
        )
      )
    ),
    
    // Panels
    showPrices && h(PricesPanel, { 
      ukrainePrices, 
      logicBoardsSpecs,
      onClose: () => setShowPrices(false),
      onSelectItem: handleSelectItem
    }),
    showBoards && h(LogicBoardsPanel, { 
      logicBoards, 
      logicBoardsSpecs,
      ukrainePrices,
      onClose: () => setShowBoards(false),
      onSelectItem: handleSelectItem
    }),
    showErrors && h(ErrorCodesPanel, { 
      errorData, 
      onClose: () => setShowErrors(false) 
    }),
    showCalculator && h(RepairCalculatorPanel, { 
      devices, 
      ukrainePrices,
      onClose: () => setShowCalculator(false) 
    }),
    showKnowledge && h(KnowledgeBasePanel, { 
      knowledgeData, 
      onClose: () => setShowKnowledge(false) 
    }),
    showICs && h(ICDatabasePanel, { 
      icData, 
      onClose: () => setShowICs(false),
      onSelectItem: handleSelectItem
    }),
    showKeyCombos && h(KeyCombinationsPanel, { 
      onClose: () => setShowKeyCombos(false) 
    }),
    
    // Detail modal
    selectedItem && !selectedDevice && h(DetailModal, { 
      item: selectedItem, 
      type: selectedItem.type, 
      onClose: () => setSelectedItem(null),
      ukrainePrices 
    })
  );
};

ReactDOM.createRoot(document.getElementById('app')).render(h(App));
