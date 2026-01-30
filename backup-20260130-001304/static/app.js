// NEXX Database 2026 - Ultimate Repair Knowledge Base
// Version 12.0 - Unified Professional Edition with Smart Search
// Build: 2026-01-20

const { useState, useEffect, useMemo, useCallback, useRef, createElement: h } = React;

// ============================================
// UTILITY FUNCTIONS
// ============================================

const cn = (...classes) => classes.filter(Boolean).join(' ');

const formatPrice = (price, currency = 'UAH') => {
  if (!price && price !== 0) return '—';
  const num = Number(price);
  if (currency === 'UAH') return `${num.toLocaleString('uk-UA')} ₴`;
  if (currency === 'USD') return `$${num.toFixed(2)}`;
  if (currency === 'EUR') return `€${num.toFixed(2)}`;
  return `${num.toFixed(2)}`;
};

const RATES = { UAH_TO_USD: 0.024, UAH_TO_EUR: 0.022, USD_TO_UAH: 41.5, EUR_TO_UAH: 45.0 };

// ============================================
// ICONS
// ============================================

const Icons = {
  Search: () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })),
  Close: () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M6 18L18 6M6 6l12 12' })),
  Back: () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M15 19l-7-7 7-7' })),
  Chip: () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' })),
  ArrowRight: () => h('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M9 5l7 7-7 7' })),
};

const getCategoryIcon = (cat) => {
  const icons = { 'iPhone': '📱', 'iPad': '📟', 'Mac': '💻', 'MacBook': '💻', 'Apple Watch': '⌚', 'AirPods': '🎧', 'iMac': '🖥️' };
  return icons[cat] || '🔧';
};

const getYearColor = (year) => {
  if (!year) return 'bg-slate-100 text-slate-600';
  if (year >= 2024) return 'bg-gradient-to-r from-violet-500 to-purple-500 text-white';
  if (year >= 2022) return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
  if (year >= 2020) return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white';
  if (year >= 2018) return 'bg-amber-100 text-amber-700';
  return 'bg-slate-100 text-slate-600';
};

// ============================================
// MODAL COMPONENT
// ============================================

const Modal = ({ title, subtitle, onClose, children, size = 'lg', color = 'indigo' }) => {
  const colors = {
    indigo: 'from-indigo-600 to-purple-600',
    green: 'from-emerald-600 to-teal-600',
    amber: 'from-amber-500 to-orange-500',
    red: 'from-red-500 to-rose-500',
    blue: 'from-blue-600 to-cyan-600',
    violet: 'from-violet-600 to-purple-600',
    slate: 'from-slate-700 to-slate-800',
  };
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    full: 'max-w-[95vw]'
  };
  
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  return h('div', { 
    className: 'fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm',
    onClick: (e) => e.target === e.currentTarget && onClose()
  },
    h('div', { className: `bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[95vh] overflow-hidden flex flex-col animate-scale-in` },
      h('div', { className: `bg-gradient-to-r ${colors[color]} p-4 sm:p-5 text-white flex-shrink-0` },
        h('div', { className: 'flex justify-between items-start gap-4' },
          h('div', { className: 'min-w-0 flex-1' },
            h('h2', { className: 'text-lg sm:text-xl font-bold truncate' }, title),
            subtitle && h('p', { className: 'text-white/80 text-sm mt-1 truncate' }, subtitle)
          ),
          h('button', { 
            onClick: onClose, 
            className: 'w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0' 
          }, h(Icons.Close))
        )
      ),
      children
    )
  );
};

// ============================================
// STATS DASHBOARD
// ============================================

const StatsDashboard = ({ stats }) => {
  const items = [
    { icon: '📱', label: 'Устройства', value: stats.devices, color: 'from-blue-500 to-indigo-500' },
    { icon: '💰', label: 'Цены UA', value: stats.prices?.toLocaleString(), color: 'from-amber-500 to-orange-500' },
    { icon: '🖥️', label: 'Платы', value: stats.boards, color: 'from-violet-500 to-purple-500' },
    { icon: '🔌', label: 'Микросхемы', value: stats.ics, color: 'from-emerald-500 to-green-500' },
    { icon: '🚨', label: 'Ошибки', value: stats.errors, color: 'from-red-500 to-rose-500' },
  ];
  
  return h('div', { className: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6' },
    ...items.map(item => 
      h('div', { 
        key: item.label,
        className: `bg-gradient-to-br ${item.color} rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-default`
      },
        h('div', { className: 'flex items-center gap-3' },
          h('span', { className: 'text-2xl' }, item.icon),
          h('div', null,
            h('p', { className: 'text-2xl font-black' }, item.value || 0),
            h('p', { className: 'text-xs text-white/80' }, item.label)
          )
        )
      )
    )
  );
};

// ============================================
// SMART UNIVERSAL SEARCH WITH AUTOCOMPLETE
// ============================================

const SmartSearch = ({ searchTerm, setSearchTerm, searchResults, onSelectResult, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  
  useEffect(() => {
    setShowResults(isFocused && searchTerm.length >= 2 && searchResults.length > 0);
  }, [isFocused, searchTerm, searchResults]);
  
  const getCategoryColor = (type) => {
    const colors = {
      device: 'bg-blue-100 text-blue-700',
      price: 'bg-amber-100 text-amber-700',
      board: 'bg-violet-100 text-violet-700',
      ic: 'bg-emerald-100 text-emerald-700',
      error: 'bg-red-100 text-red-700',
      article: 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-slate-100 text-slate-700';
  };
  
  const getCategoryIcon = (type) => {
    const icons = { device: '📱', price: '💰', board: '🖥️', ic: '🔌', error: '🚨', article: '📦' };
    return icons[type] || '🔍';
  };
  
  return h('div', { className: 'relative mb-6' },
    h('div', { className: cn('relative transition-all', showResults && 'shadow-2xl rounded-2xl') },
      h('div', { className: 'absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' }, h(Icons.Search)),
      h('input', {
        ref: inputRef,
        type: 'text',
        value: searchTerm,
        onChange: e => setSearchTerm(e.target.value),
        onFocus: () => setIsFocused(true),
        onBlur: () => setTimeout(() => setIsFocused(false), 200),
        placeholder: placeholder || 'Умный поиск: модель, IC, артикул, код ошибки...',
        className: cn(
          'w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-lg transition-all',
          showResults && 'rounded-b-none border-b-0'
        )
      }),
      searchTerm && h('button', {
        onClick: () => { setSearchTerm(''); inputRef.current?.focus(); },
        className: 'absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
      }, h(Icons.Close))
    ),
    
    // Results dropdown
    showResults && h('div', { 
      className: 'absolute top-full left-0 right-0 bg-white border-2 border-t-0 border-slate-200 rounded-b-2xl shadow-2xl overflow-hidden z-50'
    },
      h('div', { className: 'max-h-96 overflow-y-auto' },
        ...searchResults.slice(0, 20).map((result, i) =>
          h('button', {
            key: `${result.type}-${result.id}-${i}`,
            onClick: () => { onSelectResult(result); setShowResults(false); },
            className: 'w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center gap-3'
          },
            h('span', { className: 'text-xl' }, getCategoryIcon(result.type)),
            h('div', { className: 'flex-1 min-w-0' },
              h('p', { className: 'font-medium text-slate-800 truncate' }, result.title),
              h('p', { className: 'text-sm text-slate-500 truncate' }, result.subtitle)
            ),
            h('span', { className: cn('px-2 py-1 rounded-lg text-xs font-medium', getCategoryColor(result.type)) }, result.typeLabel),
            h(Icons.ArrowRight)
          )
        )
      ),
      searchResults.length > 20 && h('div', { className: 'px-4 py-2 bg-slate-50 text-sm text-slate-500 text-center' },
        `И ещё ${searchResults.length - 20} результатов...`
      )
    )
  );
};

// ============================================
// QUICK ACTION CARDS
// ============================================

const QuickActionCard = ({ icon, title, subtitle, onClick, color = 'slate', badge }) => {
  const colors = {
    slate: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    green: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
    amber: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
    red: 'bg-red-50 hover:bg-red-100 border-red-200',
    violet: 'bg-violet-50 hover:bg-violet-100 border-violet-200',
    indigo: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
  };
  
  return h('button', {
    onClick,
    className: `${colors[color]} p-4 rounded-2xl border-2 transition-all hover:shadow-lg hover:scale-[1.02] text-left w-full`
  },
    h('div', { className: 'flex items-start gap-3' },
      h('span', { className: 'text-3xl' }, icon),
      h('div', { className: 'flex-1 min-w-0' },
        h('div', { className: 'flex items-center gap-2' },
          h('p', { className: 'font-bold text-slate-800' }, title),
          badge && h('span', { className: 'px-2 py-0.5 bg-white rounded-full text-xs font-bold text-slate-600 shadow-sm' }, badge)
        ),
        subtitle && h('p', { className: 'text-sm text-slate-500 mt-0.5' }, subtitle)
      )
    )
  );
};

// ============================================
// DEVICE CARD (Enhanced)
// ============================================

const DeviceCard = ({ device, ukrainePrices, onClick }) => {
  const getPriceInfo = () => {
    const prices = [];
    if (device.service_parts) {
      Object.entries(device.service_parts).forEach(([type, part]) => {
        if (part.article && ukrainePrices?.[part.article]) {
          prices.push({ type, price: ukrainePrices[part.article].price_uah });
        } else if (part.price_usd) {
          prices.push({ type, price: part.price_usd * RATES.USD_TO_UAH });
        }
      });
    }
    return prices;
  };
  
  const prices = getPriceInfo();
  const minPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : null;
  
  return h('div', {
    onClick,
    className: 'bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all cursor-pointer overflow-hidden group'
  },
    device.ifixit_image && h('div', { className: 'h-32 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center overflow-hidden' },
      h('img', { 
        src: device.ifixit_image, 
        alt: device.name,
        className: 'h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-300',
        loading: 'lazy'
      })
    ),
    h('div', { className: 'p-4' },
      h('div', { className: 'flex items-center gap-2 mb-2' },
        h('span', { className: `px-2 py-1 rounded-lg text-xs font-bold ${getYearColor(device.year)}` }, device.year || '?'),
        h('span', { className: 'text-lg' }, getCategoryIcon(device.category))
      ),
      h('h3', { className: 'font-bold text-slate-800 mb-1 line-clamp-2' }, device.name),
      device.model && h('p', { className: 'text-xs text-slate-500 font-mono mb-2' }, device.model),
      device.processor && h('div', { className: 'flex items-center gap-1 text-xs text-slate-600 mb-2' },
        h(Icons.Chip),
        h('span', { className: 'truncate' }, device.processor.split(' ').slice(0, 2).join(' '))
      ),
      minPrice && h('div', { className: 'mt-2 pt-2 border-t border-slate-100' },
        h('div', { className: 'flex items-center justify-between' },
          h('span', { className: 'text-xs text-slate-500' }, 'от'),
          h('span', { className: 'font-bold text-amber-600' }, formatPrice(minPrice, 'UAH'))
        )
      ),
      device.available_repairs && h('div', { className: 'flex flex-wrap gap-1 mt-2' },
        ...device.available_repairs.slice(0, 3).map(r => 
          h('span', { key: r, className: 'px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600' }, 
            r === 'battery' ? '🔋' : r === 'display' ? '📱' : r === 'charging_port' ? '⚡' : '🔧'
          )
        ),
        device.available_repairs.length > 3 && h('span', { className: 'px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-500' }, 
          `+${device.available_repairs.length - 3}`
        )
      )
    )
  );
};

// ============================================
// DEVICE DETAILS VIEW (Enhanced)
// ============================================

const DeviceDetailsView = ({ device, ukrainePrices, logicBoardsSpecs, icData, errorData, measurementsData, onClose, onOpenIC, onOpenError, onOpenBoard }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get all related data with improved matching
  const relatedBoards = useMemo(() => {
    if (!logicBoardsSpecs?.boards) return [];
    const deviceNameLower = (device.name || '').toLowerCase();
    const deviceYear = device.year;
    
    return Object.entries(logicBoardsSpecs.boards)
      .filter(([_, board]) => {
        const model = (board.model || board.description || '').toLowerCase();
        // Match by device name patterns
        const nameMatch = deviceNameLower.split(' ').slice(0, 3).some(part => 
          part.length > 3 && model.includes(part)
        );
        // Match by year if available
        const yearMatch = deviceYear && model.includes(String(deviceYear));
        return nameMatch || yearMatch;
      })
      .map(([article, board]) => ({ article, ...board }))
      .slice(0, 15);
  }, [device, logicBoardsSpecs]);
  
  const relatedICs = useMemo(() => {
    if (!icData) return [];
    const ics = [];
    const deviceSearch = device.name.toLowerCase().split(' ').slice(0, 2).join(' ');
    
    Object.values(icData).forEach(category => {
      if (Array.isArray(category)) {
        category.forEach(ic => {
          if (ic.compatible_devices?.some(d => 
            d.toLowerCase().includes(deviceSearch) ||
            deviceSearch.includes(d.toLowerCase().split(' ')[0])
          )) {
            ics.push(ic);
          }
        });
      }
    });
    return ics.slice(0, 15);
  }, [device, icData]);

  const deviceMeasurements = useMemo(() => {
    if (!measurementsData?.devices) return null;
    const key = Object.keys(measurementsData.devices).find(k => 
      k.toLowerCase().includes(device.name.split(' ').slice(0, 2).join(' ').toLowerCase())
    );
    return key ? measurementsData.devices[key] : null;
  }, [device, measurementsData]);
  
  const tabs = [
    { id: 'overview', label: '📋 Обзор', count: null },
    { id: 'parts', label: '🔧 Запчасти', count: device.service_parts ? Object.keys(device.service_parts).length : 0 },
    { id: 'boards', label: '🖥️ Платы', count: relatedBoards.length },
    { id: 'ics', label: '🔌 IC', count: relatedICs.length },
    { id: 'diagnostics', label: '🔍 Диагностика', count: deviceMeasurements ? 1 : 0 },
  ];
  
  return h(Modal, { 
    title: device.name, 
    subtitle: `${device.category} • ${device.year || 'N/A'} • ${device.model || ''}`,
    onClose,
    size: 'xl',
    color: 'indigo'
  },
    h('div', { className: 'flex overflow-x-auto bg-slate-50 border-b flex-shrink-0' },
      ...tabs.map(tab => 
        h('button', {
          key: tab.id,
          onClick: () => setActiveTab(tab.id),
          className: cn(
            'px-4 py-3 font-medium text-sm whitespace-nowrap transition-all border-b-2',
            activeTab === tab.id 
              ? 'text-indigo-600 border-indigo-600 bg-white' 
              : 'text-slate-500 border-transparent hover:text-slate-700'
          )
        }, 
          tab.label,
          tab.count > 0 && h('span', { className: 'ml-2 px-2 py-0.5 bg-slate-200 rounded-full text-xs' }, tab.count)
        )
      )
    ),
    
    h('div', { className: 'flex-1 overflow-y-auto p-4 sm:p-6' },
      // Overview Tab
      activeTab === 'overview' && h('div', { className: 'grid md:grid-cols-2 gap-6' },
        h('div', { className: 'space-y-4' },
          device.ifixit_image && h('div', { className: 'bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-6 flex items-center justify-center' },
            h('img', { src: device.ifixit_image, alt: device.name, className: 'max-h-64 object-contain' })
          ),
          h('div', { className: 'grid grid-cols-2 gap-3' },
            h('div', { className: 'bg-blue-50 rounded-xl p-4' },
              h('p', { className: 'text-xs text-blue-600 font-medium' }, 'Год'),
              h('p', { className: 'text-2xl font-bold text-blue-800' }, device.year || 'N/A')
            ),
            h('div', { className: 'bg-purple-50 rounded-xl p-4' },
              h('p', { className: 'text-xs text-purple-600 font-medium' }, 'Категория'),
              h('p', { className: 'text-lg font-bold text-purple-800' }, device.category)
            ),
            device.guides_count && h('div', { className: 'bg-green-50 rounded-xl p-4' },
              h('p', { className: 'text-xs text-green-600 font-medium' }, 'Гайды iFixit'),
              h('p', { className: 'text-2xl font-bold text-green-800' }, device.guides_count)
            ),
            device.repairability && h('div', { className: 'bg-amber-50 rounded-xl p-4' },
              h('p', { className: 'text-xs text-amber-600 font-medium' }, 'Ремонтопригодность'),
              h('p', { className: 'text-2xl font-bold text-amber-800' }, `${device.repairability}/10`)
            )
          )
        ),
        h('div', { className: 'space-y-4' },
          h('div', { className: 'bg-slate-50 rounded-xl p-4' },
            h('h4', { className: 'font-bold text-slate-800 mb-3 flex items-center gap-2' }, '📋 Идентификация'),
            h('div', { className: 'space-y-2 text-sm' },
              device.model && h('div', { className: 'flex justify-between' },
                h('span', { className: 'text-slate-500' }, 'Model:'),
                h('span', { className: 'font-mono font-bold' }, device.model)
              ),
              device.board_numbers?.length > 0 && h('div', { className: 'flex justify-between items-start' },
                h('span', { className: 'text-slate-500' }, 'Board:'),
                h('div', { className: 'text-right' },
                  ...device.board_numbers.map(bn => 
                    h('span', { key: bn, className: 'font-mono font-bold text-violet-600 block' }, bn)
                  )
                )
              )
            )
          ),
          device.processor && h('div', { className: 'bg-violet-50 rounded-xl p-4' },
            h('h4', { className: 'font-bold text-violet-800 mb-2 flex items-center gap-2' }, h(Icons.Chip), 'Процессор'),
            h('p', { className: 'text-sm font-mono text-violet-700' }, device.processor)
          ),
          device.charging_ic && h('div', { className: 'bg-emerald-50 rounded-xl p-4' },
            h('h4', { className: 'font-bold text-emerald-800 mb-3 flex items-center gap-2' }, '⚡ Зарядка IC'),
            h('div', { className: 'space-y-2 text-sm' },
              device.charging_ic.main && h('div', { className: 'flex justify-between' },
                h('span', { className: 'text-slate-500' }, 'Main:'),
                h('span', { className: 'font-mono font-bold text-emerald-700' }, device.charging_ic.main)
              ),
              device.charging_ic.designation && h('div', { className: 'flex justify-between' },
                h('span', { className: 'text-slate-500' }, 'Designation:'),
                h('span', { className: 'font-bold' }, device.charging_ic.designation)
              ),
              device.charging_ic.secondary && h('div', { className: 'flex justify-between' },
                h('span', { className: 'text-slate-500' }, 'Secondary:'),
                h('span', { className: 'font-mono text-sm' }, device.charging_ic.secondary)
              )
            )
          ),
          device.official_service_prices && h('div', { className: 'bg-amber-50 rounded-xl p-4' },
            h('h4', { className: 'font-bold text-amber-800 mb-3 flex items-center gap-2' }, '💰 Цены Apple (USD)'),
            h('div', { className: 'grid grid-cols-2 gap-2' },
              ...Object.entries(device.official_service_prices).map(([type, price]) =>
                h('div', { key: type, className: 'flex justify-between items-center p-2 bg-white rounded-lg' },
                  h('span', { className: 'text-xs text-slate-600 capitalize' }, type.replace('_', ' ')),
                  h('span', { className: 'font-bold text-amber-700' }, formatPrice(price, 'USD'))
                )
              )
            )
          ),
          device.ifixit_url && h('a', {
            href: device.ifixit_url,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'flex items-center justify-center gap-2 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors'
          }, '🔗 Открыть на iFixit')
        )
      ),
      
      // Parts Tab
      activeTab === 'parts' && device.service_parts && h('div', { className: 'space-y-3' },
        ...Object.entries(device.service_parts).map(([type, part]) => {
          const uaPrice = part.article && ukrainePrices?.[part.article];
          return h('div', { 
            key: type,
            className: 'bg-white rounded-xl border-2 border-slate-200 p-4 hover:border-indigo-300 transition-colors'
          },
            h('div', { className: 'flex justify-between items-start gap-4' },
              h('div', { className: 'flex-1' },
                h('div', { className: 'flex items-center gap-2 mb-1' },
                  h('span', { className: 'text-xl' }, type === 'battery' ? '🔋' : type === 'display' ? '📱' : type.includes('camera') ? '📷' : '🔧'),
                  h('h4', { className: 'font-bold text-slate-800 capitalize' }, type.replace('_', ' '))
                ),
                h('p', { className: 'text-sm text-slate-600' }, part.description),
                part.article && h('p', { className: 'text-xs font-mono text-indigo-600 mt-1' }, part.article)
              ),
              h('div', { className: 'text-right' },
                uaPrice && h('div', null,
                  h('p', { className: 'text-lg font-bold text-amber-600' }, formatPrice(uaPrice.price_uah, 'UAH')),
                  h('p', { className: 'text-xs text-slate-500' }, '🇺🇦 Украина')
                ),
                part.price_usd && h('div', { className: uaPrice ? 'mt-2 pt-2 border-t border-slate-100' : '' },
                  h('p', { className: 'text-sm font-bold text-blue-600' }, formatPrice(part.price_usd, 'USD')),
                  h('p', { className: 'text-xs text-slate-500' }, '🍎 Apple')
                )
              )
            )
          );
        })
      ),
      
      // Boards Tab
      activeTab === 'boards' && h('div', { className: 'space-y-3' },
        relatedBoards.length === 0 
          ? h('div', { className: 'text-center py-12 text-slate-500' }, 'Платы не найдены для этого устройства')
          : relatedBoards.map(board => 
              h('div', { 
                key: board.article,
                className: 'bg-white rounded-xl border-2 border-slate-200 p-4 hover:border-violet-300 cursor-pointer transition-colors',
                onClick: () => onOpenBoard && onOpenBoard(board)
              },
                h('div', { className: 'flex justify-between items-start' },
                  h('div', null,
                    h('p', { className: 'font-mono font-bold text-violet-600' }, board.article),
                    h('p', { className: 'text-sm text-slate-600 mt-1' }, board.description),
                    board.specs && h('div', { className: 'flex gap-2 mt-2' },
                      board.specs.cpu_ghz && h('span', { className: 'px-2 py-1 bg-slate-100 rounded text-xs' }, `${board.specs.cpu_ghz} GHz`),
                      board.specs.ram_gb && h('span', { className: 'px-2 py-1 bg-slate-100 rounded text-xs' }, `${board.specs.ram_gb} GB RAM`)
                    )
                  ),
                  h('div', { className: 'text-right' },
                    board.price_uah && h('p', { className: 'text-lg font-bold text-amber-600' }, formatPrice(board.price_uah, 'UAH')),
                    board.price_usd && h('p', { className: 'text-sm text-slate-500' }, formatPrice(board.price_usd, 'USD'))
                  )
                )
              )
            )
      ),
      
      // ICs Tab
      activeTab === 'ics' && h('div', { className: 'space-y-3' },
        relatedICs.length === 0 
          ? h('div', { className: 'text-center py-12 text-slate-500' }, 'Микросхемы не найдены для этого устройства')
          : relatedICs.map((ic, i) => 
              h('div', { 
                key: ic.name + i,
                onClick: () => onOpenIC && onOpenIC(ic),
                className: 'bg-white rounded-xl border-2 border-slate-200 p-4 hover:border-emerald-300 cursor-pointer transition-colors'
              },
                h('div', { className: 'flex justify-between items-start' },
                  h('div', null,
                    h('div', { className: 'flex items-center gap-2' },
                      h('p', { className: 'font-mono font-bold text-emerald-600' }, ic.name),
                      ic.designation && h('span', { className: 'px-2 py-0.5 bg-slate-100 rounded text-xs' }, ic.designation)
                    ),
                    ic.functions && h('p', { className: 'text-sm text-slate-600 mt-1' }, ic.functions.slice(0, 2).join(', ')),
                    ic.symptoms_when_faulty && h('p', { className: 'text-xs text-red-500 mt-2' }, '⚠️ ' + ic.symptoms_when_faulty[0])
                  ),
                  h('div', { className: 'text-right' },
                    ic.price_range && h('p', { className: 'font-bold text-emerald-600' }, ic.price_range),
                    ic.difficulty && h('span', { 
                      className: cn('px-2 py-1 rounded text-xs font-bold mt-1 inline-block',
                        ic.difficulty === 'Expert' ? 'bg-red-100 text-red-700' :
                        ic.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      )
                    }, ic.difficulty)
                  )
                )
              )
            )
      ),
      
      // Diagnostics Tab
      activeTab === 'diagnostics' && h('div', { className: 'space-y-4' },
        // Device-specific measurements
        deviceMeasurements && h('div', { className: 'bg-violet-50 rounded-xl p-4' },
          h('h4', { className: 'font-bold text-violet-800 mb-3' }, '📐 Измерения для ' + device.name),
          h('div', { className: 'grid sm:grid-cols-2 gap-3' },
            ...Object.entries(deviceMeasurements).slice(0, 10).map(([point, value]) =>
              h('div', { key: point, className: 'p-3 bg-white rounded-lg' },
                h('p', { className: 'font-mono font-bold text-violet-600 text-sm' }, point),
                h('p', { className: 'text-sm text-slate-600' }, String(value))
              )
            )
          )
        ),
        
        // DFU/Recovery
        h('div', { className: 'bg-indigo-50 rounded-xl p-4' },
          h('h4', { className: 'font-bold text-indigo-800 mb-3' }, '⌨️ DFU/Recovery режимы'),
          h('div', { className: 'grid sm:grid-cols-2 gap-3' },
            h('div', { className: 'bg-white rounded-lg p-3' },
              h('p', { className: 'font-bold text-sm mb-1' }, 'DFU Mode'),
              h('p', { className: 'text-xs text-slate-600' }, 
                device.category === 'iPhone' || device.category === 'iPad'
                  ? 'Vol+ → Vol- → Hold Side → Side+Vol- (5s) → Vol- only (10s)'
                  : 'Power + Option/Alt при загрузке'
              )
            ),
            h('div', { className: 'bg-white rounded-lg p-3' },
              h('p', { className: 'font-bold text-sm mb-1' }, 'Recovery Mode'),
              h('p', { className: 'text-xs text-slate-600' }, 
                device.category === 'iPhone' || device.category === 'iPad'
                  ? 'Vol+ → Vol- → Hold Side до логотипа iTunes'
                  : 'Cmd + R при загрузке'
              )
            )
          )
        ),
        
        // Common Issues
        h('div', { className: 'bg-red-50 rounded-xl p-4' },
          h('h4', { className: 'font-bold text-red-800 mb-3' }, '🚨 Частые проблемы'),
          h('div', { className: 'space-y-2' },
            ['4013', '4014', '-1', '9', '56'].map(code =>
              h('button', {
                key: code,
                onClick: () => onOpenError && onOpenError(code),
                className: 'w-full text-left p-3 bg-white rounded-lg hover:bg-red-100 transition-colors'
              },
                h('p', { className: 'font-bold text-sm' }, `Error ${code}`),
                h('p', { className: 'text-xs text-slate-600' }, 
                  code === '4013' ? 'NAND/eMMC проблемы' :
                  code === '4014' ? 'Проблемы восстановления' :
                  code === '-1' ? 'Baseband не отвечает' :
                  code === '9' ? 'Потеря связи USB' :
                  'Проблемы с батареей'
                )
              )
            )
          )
        )
      )
    )
  );
};

// ============================================
// PRICES PANEL
// ============================================

const PricesPanel = ({ ukrainePrices, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  
  const filtered = useMemo(() => {
    if (!ukrainePrices) return [];
    let items = Object.entries(ukrainePrices).map(([article, data]) => ({ article, ...data }));
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(p => 
        p.article.toLowerCase().includes(term) ||
        (p.description || '').toLowerCase().includes(term)
      );
    }
    
    if (priceRange !== 'all') {
      const ranges = {
        'low': [0, 1000],
        'mid': [1000, 5000],
        'high': [5000, 20000],
        'premium': [20000, Infinity]
      };
      const [min, max] = ranges[priceRange];
      items = items.filter(p => (p.price_uah || 0) >= min && (p.price_uah || 0) < max);
    }
    
    items.sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price_uah || 0) - (b.price_uah || 0);
      if (sortBy === 'price_desc') return (b.price_uah || 0) - (a.price_uah || 0);
      return (a.description || '').localeCompare(b.description || '');
    });
    
    return items.slice(0, 200);
  }, [ukrainePrices, searchTerm, sortBy, priceRange]);
  
  return h(Modal, { title: '💰 Каталог цен Украина', subtitle: `${Object.keys(ukrainePrices || {}).length.toLocaleString()} позиций`, onClose, color: 'amber' },
    h('div', { className: 'flex flex-col h-[70vh]' },
      h('div', { className: 'p-4 border-b bg-slate-50 space-y-3 flex-shrink-0' },
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Поиск по артикулу или описанию...',
          className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none'
        }),
        h('div', { className: 'flex gap-2 flex-wrap' },
          h('select', {
            value: sortBy,
            onChange: e => setSortBy(e.target.value),
            className: 'px-3 py-1.5 rounded-lg border border-slate-200 text-sm'
          },
            h('option', { value: 'name' }, 'По названию'),
            h('option', { value: 'price_asc' }, 'Цена ↑'),
            h('option', { value: 'price_desc' }, 'Цена ↓')
          ),
          h('select', {
            value: priceRange,
            onChange: e => setPriceRange(e.target.value),
            className: 'px-3 py-1.5 rounded-lg border border-slate-200 text-sm'
          },
            h('option', { value: 'all' }, 'Все цены'),
            h('option', { value: 'low' }, 'До 1000₴'),
            h('option', { value: 'mid' }, '1-5 тыс₴'),
            h('option', { value: 'high' }, '5-20 тыс₴'),
            h('option', { value: 'premium' }, '20+ тыс₴')
          ),
          h('span', { className: 'text-sm text-slate-500 ml-auto self-center' }, `Показано: ${filtered.length}`)
        )
      ),
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'space-y-2' },
          ...filtered.map(item =>
            h('div', { key: item.article, className: 'p-3 bg-white rounded-xl border border-slate-200 hover:border-amber-300 transition-colors' },
              h('div', { className: 'flex justify-between items-start gap-4' },
                h('div', { className: 'flex-1 min-w-0' },
                  h('p', { className: 'font-mono text-sm font-bold text-amber-600' }, item.article),
                  h('p', { className: 'text-sm text-slate-600 line-clamp-2' }, item.description)
                ),
                h('div', { className: 'text-right flex-shrink-0' },
                  h('p', { className: 'text-lg font-bold text-amber-600' }, formatPrice(item.price_uah, 'UAH')),
                  h('p', { className: 'text-xs text-slate-500' }, `≈ ${formatPrice(item.price_uah * RATES.UAH_TO_USD, 'USD')}`)
                )
              )
            )
          )
        )
      )
    )
  );
};

// ============================================
// LOGIC BOARDS PANEL
// ============================================

const LogicBoardsPanel = ({ logicBoardsSpecs, onClose, onSelectBoard }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  
  const categories = useMemo(() => {
    if (!logicBoardsSpecs?.boards) return ['all'];
    const cats = new Set();
    Object.values(logicBoardsSpecs.boards).forEach(b => {
      if (b.model?.includes('MacBook')) cats.add('MacBook');
      else if (b.model?.includes('iMac')) cats.add('iMac');
      else if (b.model?.includes('Mac')) cats.add('Mac');
      else if (b.model?.includes('iPhone')) cats.add('iPhone');
      else if (b.model?.includes('iPad')) cats.add('iPad');
    });
    return ['all', ...Array.from(cats).sort()];
  }, [logicBoardsSpecs]);
  
  const boards = useMemo(() => {
    if (!logicBoardsSpecs?.boards) return [];
    let items = Object.entries(logicBoardsSpecs.boards).map(([article, data]) => ({ article, ...data }));
    
    if (category !== 'all') {
      items = items.filter(b => (b.model || b.description || '').includes(category));
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(b => 
        b.article.toLowerCase().includes(term) ||
        (b.description || '').toLowerCase().includes(term) ||
        (b.model || '').toLowerCase().includes(term)
      );
    }
    
    return items.slice(0, 100);
  }, [logicBoardsSpecs, searchTerm, category]);
  
  return h(Modal, { title: '🖥️ Logic Boards', subtitle: `${logicBoardsSpecs?.total || 0} плат`, onClose, color: 'violet' },
    h('div', { className: 'flex flex-col h-[70vh]' },
      h('div', { className: 'p-4 border-b bg-slate-50 space-y-3 flex-shrink-0' },
        h('div', { className: 'flex gap-2 overflow-x-auto pb-2' },
          ...categories.map(cat =>
            h('button', {
              key: cat,
              onClick: () => setCategory(cat),
              className: cn('px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all',
                category === cat ? 'bg-violet-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100')
            }, cat === 'all' ? 'Все' : cat)
          )
        ),
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Поиск по артикулу, модели...',
          className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-violet-500 focus:outline-none'
        })
      ),
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'space-y-2' },
          ...boards.map(board =>
            h('div', { 
              key: board.article, 
              className: 'p-4 bg-white rounded-xl border border-slate-200 hover:border-violet-300 cursor-pointer transition-all',
              onClick: () => onSelectBoard && onSelectBoard(board)
            },
              h('div', { className: 'flex justify-between items-start' },
                h('div', null,
                  h('p', { className: 'font-mono font-bold text-violet-600' }, board.article),
                  h('p', { className: 'text-sm text-slate-600 mt-1' }, board.description),
                  board.specs && h('div', { className: 'flex gap-2 mt-2' },
                    board.specs.cpu_ghz && h('span', { className: 'px-2 py-1 bg-violet-100 rounded text-xs text-violet-700' }, `${board.specs.cpu_ghz} GHz`),
                    board.specs.ram_gb && h('span', { className: 'px-2 py-1 bg-blue-100 rounded text-xs text-blue-700' }, `${board.specs.ram_gb} GB`)
                  )
                ),
                h('div', { className: 'text-right' },
                  board.price_uah && h('p', { className: 'text-lg font-bold text-amber-600' }, formatPrice(board.price_uah, 'UAH')),
                  board.price_usd && h('p', { className: 'text-sm text-slate-500' }, formatPrice(board.price_usd, 'USD'))
                )
              )
            )
          )
        )
      )
    )
  );
};

// ============================================
// IC DATABASE PANEL
// ============================================

const ICDatabasePanel = ({ icData, onClose, onSelectIC }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('charging_ics');
  
  const categories = {
    charging_ics: { name: '⚡ Зарядка', key: 'charging_ics' },
    power_ics: { name: '🔋 Питание', key: 'power_ics' },
    audio_ics: { name: '🔊 Аудио', key: 'audio_ics' },
    baseband_ics: { name: '📶 Baseband', key: 'baseband_ics' },
    nand_ics: { name: '💾 NAND', key: 'nand_ics' },
    wifi_bt_ics: { name: '📡 WiFi/BT', key: 'wifi_bt_ics' },
  };
  
  const ics = useMemo(() => {
    const items = icData?.[category] || [];
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(ic => 
      ic.name.toLowerCase().includes(term) ||
      (ic.designation || '').toLowerCase().includes(term) ||
      (ic.compatible_devices || []).some(d => d.toLowerCase().includes(term))
    );
  }, [icData, category, searchTerm]);
  
  return h(Modal, { title: '🔌 База микросхем', subtitle: 'IC диагностика и совместимость', onClose, color: 'green' },
    h('div', { className: 'flex flex-col h-[70vh]' },
      h('div', { className: 'p-4 border-b bg-slate-50 space-y-3 flex-shrink-0' },
        h('div', { className: 'flex gap-2 flex-wrap' },
          ...Object.entries(categories).map(([key, cat]) =>
            h('button', {
              key,
              onClick: () => setCategory(key),
              className: cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                category === key ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100')
            }, cat.name)
          )
        ),
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Поиск IC...',
          className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none'
        })
      ),
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'space-y-3' },
          ...ics.map((ic, i) =>
            h('div', { 
              key: ic.name + i,
              onClick: () => onSelectIC(ic),
              className: 'p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 cursor-pointer transition-colors'
            },
              h('div', { className: 'flex justify-between items-start' },
                h('div', null,
                  h('div', { className: 'flex items-center gap-2' },
                    h('p', { className: 'font-mono font-bold text-emerald-600' }, ic.name),
                    ic.designation && h('span', { className: 'px-2 py-0.5 bg-slate-100 rounded text-xs' }, ic.designation)
                  ),
                  ic.functions && h('p', { className: 'text-sm text-slate-600 mt-1' }, ic.functions.slice(0, 2).join(', ')),
                  ic.compatible_devices && h('div', { className: 'flex flex-wrap gap-1 mt-2' },
                    ...ic.compatible_devices.slice(0, 4).map((d, j) =>
                      h('span', { key: j, className: 'px-2 py-0.5 bg-slate-100 rounded text-xs' }, d)
                    ),
                    ic.compatible_devices.length > 4 && h('span', { className: 'text-xs text-slate-400' }, `+${ic.compatible_devices.length - 4}`)
                  )
                ),
                h('div', { className: 'text-right' },
                  ic.price_range && h('p', { className: 'font-bold text-emerald-600' }, ic.price_range),
                  ic.difficulty && h('span', { 
                    className: cn('px-2 py-1 rounded text-xs font-bold',
                      ic.difficulty === 'Expert' ? 'bg-red-100 text-red-700' :
                      ic.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    )
                  }, ic.difficulty)
                )
              )
            )
          )
        )
      )
    )
  );
};

// ============================================
// IC DETAIL MODAL
// ============================================

const ICDetailModal = ({ ic, onClose }) => {
  if (!ic) return null;
  
  return h(Modal, { title: `🔌 ${ic.name}`, subtitle: ic.designation, onClose, color: 'green', size: 'lg' },
    h('div', { className: 'p-6 overflow-y-auto max-h-[70vh]' },
      h('div', { className: 'grid md:grid-cols-2 gap-6' },
        h('div', { className: 'space-y-4' },
          h('div', { className: 'bg-emerald-50 rounded-xl p-4' },
            h('h4', { className: 'font-bold text-emerald-800 mb-3' }, '📋 Информация'),
            h('div', { className: 'space-y-2 text-sm' },
              h('div', { className: 'flex justify-between' },
                h('span', { className: 'text-slate-500' }, 'IC:'),
                h('span', { className: 'font-mono font-bold' }, ic.name)
              ),
              ic.designation && h('div', { className: 'flex justify-between' },
                h('span', { className: 'text-slate-500' }, 'Designation:'),
                h('span', { className: 'font-bold' }, ic.designation)
              ),
              ic.package && h('div', { className: 'flex justify-between' },
                h('span', { className: 'text-slate-500' }, 'Package:'),
                h('span', { className: 'font-mono' }, ic.package)
              )
            )
          ),
          ic.functions && h('div', { className: 'bg-blue-50 rounded-xl p-4' },
            h('h4', { className: 'font-bold text-blue-800 mb-3' }, '⚙️ Функции'),
            h('ul', { className: 'space-y-1' },
              ...ic.functions.map((f, i) => h('li', { key: i, className: 'text-sm text-slate-700 flex items-start gap-2' },
                h('span', { className: 'text-blue-500' }, '▸'), f
              ))
            )
          ),
          ic.diagnostics && h('div', { className: 'bg-violet-50 rounded-xl p-4' },
            h('h4', { className: 'font-bold text-violet-800 mb-3' }, '🔍 Диагностика'),
            ic.diagnostics.diode_mode && h('div', { className: 'mb-3' },
              h('p', { className: 'text-xs font-bold text-violet-600 mb-2' }, 'Диодный режим:'),
              h('div', { className: 'grid grid-cols-2 gap-2' },
                ...Object.entries(ic.diagnostics.diode_mode).map(([k, v]) =>
                  h('div', { key: k, className: 'p-2 bg-white rounded text-center' },
                    h('p', { className: 'text-xs text-violet-600' }, k),
                    h('p', { className: 'font-mono font-bold' }, v)
                  )
                )
              )
            ),
            ic.diagnostics.current_draw && h('p', { className: 'text-sm text-slate-600' }, '⚡ ', ic.diagnostics.current_draw)
          )
        ),
        h('div', { className: 'space-y-4' },
          ic.symptoms_when_faulty && h('div', { className: 'bg-red-50 rounded-xl p-4' },
            h('h4', { className: 'font-bold text-red-800 mb-3' }, '⚠️ Симптомы неисправности'),
            h('ul', { className: 'space-y-1' },
              ...ic.symptoms_when_faulty.map((s, i) => h('li', { key: i, className: 'text-sm text-red-700 flex items-start gap-2' },
                h('span', null, '❌'), s
              ))
            )
          ),
          ic.repair_tips && h('div', { className: 'bg-amber-50 rounded-xl p-4' },
            h('h4', { className: 'font-bold text-amber-800 mb-3' }, '💡 Советы по ремонту'),
            h('ul', { className: 'space-y-1' },
              ...ic.repair_tips.map((t, i) => h('li', { key: i, className: 'text-sm text-amber-700 flex items-start gap-2' },
                h('span', null, '→'), t
              ))
            )
          ),
          ic.compatible_devices && h('div', { className: 'bg-slate-50 rounded-xl p-4' },
            h('h4', { className: 'font-bold text-slate-800 mb-3' }, `📱 Совместимость (${ic.compatible_devices.length})`),
            h('div', { className: 'flex flex-wrap gap-2' },
              ...ic.compatible_devices.map((d, i) =>
                h('span', { key: i, className: 'px-2 py-1 bg-white rounded-lg text-xs border' }, d)
              )
            )
          ),
          h('div', { className: 'bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-4 text-white' },
            h('div', { className: 'flex justify-between items-center' },
              h('div', null,
                h('p', { className: 'text-sm text-white/80' }, 'Цена'),
                h('p', { className: 'text-2xl font-bold' }, ic.price_range || 'N/A')
              ),
              h('div', { className: 'text-right' },
                h('p', { className: 'text-sm text-white/80' }, 'Сложность'),
                h('p', { className: 'text-xl font-bold' }, ic.difficulty || 'N/A')
              )
            )
          )
        )
      )
    )
  );
};

// ============================================
// ERROR CODES PANEL
// ============================================

const ErrorCodesPanel = ({ errorData, onClose, initialSearch }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  const [category, setCategory] = useState('itunes');
  
  const errors = useMemo(() => {
    const items = category === 'itunes' 
      ? (errorData?.itunes_restore_errors || [])
      : (errorData?.mac_diagnostics || []);
    
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(e =>
      String(e.code).toLowerCase().includes(term) ||
      (e.description || '').toLowerCase().includes(term) ||
      (e.cause || '').toLowerCase().includes(term) ||
      (e.fix || '').toLowerCase().includes(term)
    );
  }, [errorData, category, searchTerm]);
  
  return h(Modal, { title: '🚨 Коды ошибок', subtitle: `${errors.length} ошибок`, onClose, color: 'red' },
    h('div', { className: 'flex flex-col h-[70vh]' },
      h('div', { className: 'p-4 border-b bg-slate-50 space-y-3 flex-shrink-0' },
        h('div', { className: 'flex gap-3' },
          h('button', {
            onClick: () => setCategory('itunes'),
            className: cn('px-4 py-2 rounded-xl font-medium transition-all',
              category === 'itunes' ? 'bg-red-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100')
          }, '🍎 iTunes/Finder'),
          h('button', {
            onClick: () => setCategory('mac'),
            className: cn('px-4 py-2 rounded-xl font-medium transition-all',
              category === 'mac' ? 'bg-red-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100')
          }, '💻 Mac Diagnostics')
        ),
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Поиск по коду или описанию...',
          className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-none'
        })
      ),
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'space-y-3' },
          ...errors.map((error, i) =>
            h('div', { key: `${error.code}-${i}`, className: 'bg-white rounded-xl border-2 border-slate-200 p-4 hover:border-red-300 transition-colors' },
              h('div', { className: 'flex items-start gap-4' },
                h('span', { className: 'px-3 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-mono font-bold text-lg flex-shrink-0' }, error.code),
                h('div', { className: 'flex-1' },
                  h('p', { className: 'font-bold text-slate-800 mb-1' }, error.description),
                  error.cause && h('p', { className: 'text-sm text-slate-600 mb-2' },
                    h('span', { className: 'font-medium text-red-600' }, '📍 Причина: '), error.cause
                  ),
                  error.fix && h('div', { className: 'p-3 bg-green-50 rounded-lg border border-green-200' },
                    h('p', { className: 'text-sm' },
                      h('span', { className: 'font-medium text-green-700' }, '✅ Решение: '),
                      h('span', { className: 'text-green-800' }, error.fix)
                    )
                  ),
                  error.severity && h('span', { 
                    className: cn('mt-2 inline-block px-2 py-1 rounded text-xs font-bold',
                      error.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      error.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700')
                  }, error.severity)
                )
              )
            )
          )
        ),
        errors.length === 0 && h('p', { className: 'text-center text-slate-500 py-8' }, 'Ошибки не найдены')
      )
    )
  );
};

// ============================================
// REPAIR KNOWLEDGE PANEL
// ============================================

const RepairKnowledgePanel = ({ knowledgeData, onClose }) => {
  const [selectedTopic, setSelectedTopic] = useState('tristar_hydra');
  
  const topics = knowledgeData ? Object.keys(knowledgeData).filter(k => typeof knowledgeData[k] === 'object' && knowledgeData[k].description) : [];
  const current = knowledgeData?.[selectedTopic];
  
  return h(Modal, { title: '📚 База знаний', subtitle: 'Профессиональные гайды по ремонту', onClose, color: 'blue', size: 'xl' },
    h('div', { className: 'flex h-[70vh]' },
      h('div', { className: 'w-48 border-r bg-slate-50 overflow-y-auto flex-shrink-0' },
        h('div', { className: 'p-2 space-y-1' },
          ...topics.map(topic =>
            h('button', {
              key: topic,
              onClick: () => setSelectedTopic(topic),
              className: cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors capitalize',
                selectedTopic === topic ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100')
            }, topic.replace(/_/g, ' '))
          )
        )
      ),
      h('div', { className: 'flex-1 overflow-y-auto p-6' },
        current ? h('div', { className: 'space-y-6' },
          h('div', null,
            h('h3', { className: 'text-2xl font-bold text-slate-800 mb-2 capitalize' }, selectedTopic.replace(/_/g, ' ')),
            h('p', { className: 'text-slate-600' }, current.description)
          ),
          current.common_names && h('div', { className: 'flex flex-wrap gap-2' },
            ...current.common_names.map(name => h('span', { key: name, className: 'px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium' }, name))
          ),
          current.symptoms && h('div', { className: 'bg-red-50 rounded-xl p-4' },
            h('h4', { className: 'font-bold text-red-800 mb-3' }, '⚠️ Симптомы'),
            h('ul', { className: 'grid sm:grid-cols-2 gap-2' },
              ...current.symptoms.map((s, i) => h('li', { key: i, className: 'text-sm text-red-700 flex items-start gap-2' },
                h('span', null, '•'), s
              ))
            )
          ),
          current.diagnostics?.voltage_checks && h('div', { className: 'bg-violet-50 rounded-xl p-4' },
            h('h4', { className: 'font-bold text-violet-800 mb-3' }, '🔍 Проверка напряжений'),
            h('div', { className: 'space-y-2' },
              ...current.diagnostics.voltage_checks.map((v, i) =>
                h('div', { key: i, className: 'p-3 bg-white rounded-lg' },
                  h('p', { className: 'font-mono font-bold text-violet-600' }, v.point),
                  h('p', { className: 'text-sm text-slate-600' }, v.description),
                  h('p', { className: 'text-sm font-bold text-green-600 mt-1' }, `Ожидается: ${v.expected}`)
                )
              )
            )
          )
        ) : h('p', { className: 'text-slate-500' }, 'Выберите тему')
      )
    )
  );
};

// ============================================
// REGIONAL CODES PANEL
// ============================================

const RegionalCodesPanel = ({ regionData, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  
  const codes = regionData?.regional_codes || {};
  const regions = useMemo(() => {
    const r = new Set(Object.values(codes).map(c => c.region).filter(Boolean));
    return ['all', ...Array.from(r).sort()];
  }, [codes]);
  
  const filteredCodes = useMemo(() => {
    return Object.entries(codes).filter(([code, data]) => {
      const term = searchTerm.toLowerCase();
      if (filterRegion !== 'all' && data.region !== filterRegion) return false;
      return code.toLowerCase().includes(term) ||
             data.region?.toLowerCase().includes(term) ||
             data.countries?.some(c => c.toLowerCase().includes(term));
    });
  }, [codes, searchTerm, filterRegion]);
  
  return h(Modal, { title: '🌍 Региональные коды', subtitle: 'Коды стран для Apple устройств', onClose, color: 'blue' },
    h('div', { className: 'p-4 border-b bg-slate-50' },
      h('div', { className: 'flex gap-3 flex-wrap' },
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Поиск по коду или стране...',
          className: 'flex-1 min-w-48 px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none'
        }),
        h('select', {
          value: filterRegion,
          onChange: e => setFilterRegion(e.target.value),
          className: 'px-4 py-2 rounded-xl border border-slate-200'
        }, ...regions.map(r => h('option', { key: r, value: r }, r === 'all' ? 'Все регионы' : r)))
      )
    ),
    h('div', { className: 'overflow-y-auto max-h-[60vh] p-4' },
      h('div', { className: 'grid gap-3' },
        ...filteredCodes.map(([code, data]) =>
          h('div', { key: code, className: 'bg-white rounded-xl border-2 border-slate-200 p-4 hover:border-blue-300 transition-all' },
            h('div', { className: 'flex items-start justify-between mb-2' },
              h('span', { className: 'px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-mono font-bold text-lg' }, code),
              h('span', { className: 'px-2 py-1 bg-slate-100 rounded text-sm text-slate-600' }, data.region)
            ),
            h('div', { className: 'text-sm text-slate-600' },
              h('p', { className: 'font-medium mb-1' }, 'Страны:'),
              h('p', { className: 'text-slate-500' }, data.countries?.join(', ') || 'N/A')
            ),
            h('div', { className: 'flex gap-3 mt-3 text-xs' },
              h('span', { className: cn('px-2 py-1 rounded',
                data.facetime === true ? 'bg-green-100 text-green-700' :
                data.facetime === false ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              )}, `FaceTime: ${data.facetime === true ? 'Да' : data.facetime === false ? 'Нет' : data.facetime}`),
              h('span', { className: cn('px-2 py-1 rounded',
                data.dual_sim ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
              )}, `Dual SIM: ${data.dual_sim ? 'Да' : 'Нет'}`)
            ),
            data.notes && h('p', { className: 'mt-2 text-xs text-slate-500 italic' }, data.notes)
          )
        )
      ),
      filteredCodes.length === 0 && h('p', { className: 'text-center text-slate-500 py-8' }, 'Коды не найдены')
    )
  );
};

// ============================================
// DFU / RECOVERY MODES PANEL
// ============================================

const DfuRecoveryPanel = ({ keyCombinations, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('iphone');
  const [selectedMode, setSelectedMode] = useState('dfu_mode');
  
  const categories = ['iphone', 'ipad', 'mac', 'apple_watch', 'airpods'];
  const modes = ['dfu_mode', 'recovery_mode', 'diagnostics'];
  
  const modeLabels = { 'dfu_mode': '🔧 DFU Mode', 'recovery_mode': '🔄 Recovery Mode', 'diagnostics': '🔍 Diagnostics' };
  const catLabels = { 'iphone': '📱 iPhone', 'ipad': '📟 iPad', 'mac': '💻 Mac', 'apple_watch': '⌚ Watch', 'airpods': '🎧 AirPods' };
  
  const data = keyCombinations?.[selectedCategory]?.[selectedMode];
  
  return h(Modal, { title: '⌨️ DFU / Recovery Modes', subtitle: 'Комбинации клавиш', onClose, size: 'xl', color: 'slate' },
    h('div', { className: 'flex flex-wrap gap-2 p-4 border-b bg-slate-50' },
      ...categories.filter(c => keyCombinations?.[c]).map(cat =>
        h('button', {
          key: cat,
          onClick: () => setSelectedCategory(cat),
          className: cn('px-4 py-2 rounded-xl font-medium transition-all',
            selectedCategory === cat ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100')
        }, catLabels[cat])
      )
    ),
    h('div', { className: 'flex flex-wrap gap-2 p-4 border-b' },
      ...modes.filter(m => keyCombinations?.[selectedCategory]?.[m]).map(mode =>
        h('button', {
          key: mode,
          onClick: () => setSelectedMode(mode),
          className: cn('px-4 py-2 rounded-xl font-medium transition-all',
            selectedMode === mode ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
        }, modeLabels[mode])
      )
    ),
    h('div', { className: 'overflow-y-auto max-h-[60vh] p-4' },
      data ? h('div', { className: 'space-y-4' },
        h('div', { className: 'bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-6' },
          h('h3', { className: 'text-xl font-bold mb-2' }, data.title),
          h('p', { className: 'text-slate-300' }, data.description)
        ),
        data.models && Object.entries(data.models).map(([modelGroup, info]) =>
          h('div', { key: modelGroup, className: 'bg-white rounded-xl border-2 border-slate-200 p-4' },
            h('h4', { className: 'font-bold text-lg text-slate-800 mb-3 flex items-center gap-2' },
              h('span', { className: 'w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600' }, '📱'),
              modelGroup
            ),
            info.applies_to && h('div', { className: 'mb-3' },
              h('p', { className: 'text-xs text-slate-500 mb-1' }, 'Применимо к:'),
              h('p', { className: 'text-sm text-slate-600' }, info.applies_to.join(', '))
            ),
            info.steps && h('div', { className: 'bg-slate-50 rounded-xl p-4' },
              h('p', { className: 'font-medium text-slate-700 mb-3' }, 'Шаги:'),
              h('ol', { className: 'space-y-2' },
                ...info.steps.map((step, i) =>
                  h('li', { key: i, className: 'flex gap-3 text-sm' },
                    h('span', { className: 'w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold' }, i + 1),
                    h('span', { className: 'text-slate-600 pt-0.5' }, step)
                  )
                )
              )
            ),
            info.steps_short && h('div', { className: 'mt-3 p-3 bg-indigo-50 rounded-xl' },
              h('p', { className: 'text-sm font-mono text-indigo-700' }, info.steps_short)
            ),
            info.notes && h('div', { className: 'mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200' },
              h('p', { className: 'font-medium text-amber-700 text-sm mb-1' }, '💡 Примечания:'),
              h('ul', { className: 'space-y-1' },
                ...info.notes.map((note, i) => h('li', { key: i, className: 'text-sm text-amber-600' }, '• ' + note))
              )
            )
          )
        )
      ) : h('p', { className: 'text-center text-slate-500 py-8' }, 'Нет данных')
    )
  );
};

// ============================================
// ARTICLES SEARCH PANEL
// ============================================

const ArticlesSearchPanel = ({ articlesIndex, ukrainePrices, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const articles = articlesIndex?.articles || [];
  const types = useMemo(() => {
    const t = new Set(articles.map(a => a.part_type).filter(Boolean));
    return ['all', ...Array.from(t).sort()];
  }, [articles]);
  
  const filtered = useMemo(() => {
    return articles.filter(a => {
      const term = searchTerm.toLowerCase();
      if (filterType !== 'all' && a.part_type !== filterType) return false;
      return a.article?.toLowerCase().includes(term) ||
             a.model?.toLowerCase().includes(term) ||
             a.description?.toLowerCase().includes(term);
    }).slice(0, 100);
  }, [articles, searchTerm, filterType]);
  
  return h(Modal, { title: '📦 Артикулы запчастей', subtitle: `${articles.length} позиций`, onClose, size: 'lg', color: 'amber' },
    h('div', { className: 'p-4 border-b bg-slate-50 flex gap-3 flex-wrap' },
      h('input', {
        type: 'text',
        value: searchTerm,
        onChange: e => setSearchTerm(e.target.value),
        placeholder: 'Поиск по артикулу или модели...',
        className: 'flex-1 min-w-48 px-4 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none'
      }),
      h('select', {
        value: filterType,
        onChange: e => setFilterType(e.target.value),
        className: 'px-4 py-2 rounded-xl border border-slate-200'
      }, ...types.map(t => h('option', { key: t, value: t }, t === 'all' ? 'Все типы' : t.replace('_', ' '))))
    ),
    h('div', { className: 'overflow-y-auto max-h-[60vh]' },
      h('table', { className: 'w-full' },
        h('thead', { className: 'bg-slate-50 sticky top-0' },
          h('tr', null,
            h('th', { className: 'text-left p-3 font-medium text-slate-600' }, 'Артикул'),
            h('th', { className: 'text-left p-3 font-medium text-slate-600' }, 'Модель'),
            h('th', { className: 'text-left p-3 font-medium text-slate-600 hidden sm:table-cell' }, 'Тип'),
            h('th', { className: 'text-right p-3 font-medium text-slate-600' }, 'Цена UA')
          )
        ),
        h('tbody', null,
          ...filtered.map(a => {
            const uaPrice = ukrainePrices?.[a.article]?.price_uah;
            return h('tr', { key: a.article, className: 'border-b hover:bg-slate-50' },
              h('td', { className: 'p-3 font-mono font-bold text-amber-600 text-sm' }, a.article),
              h('td', { className: 'p-3 text-sm' }, a.model),
              h('td', { className: 'p-3 hidden sm:table-cell' },
                h('span', { className: 'px-2 py-1 bg-slate-100 rounded text-xs capitalize' }, a.part_type?.replace('_', ' '))
              ),
              h('td', { className: 'p-3 text-right font-bold text-amber-600' }, uaPrice ? formatPrice(uaPrice, 'UAH') : formatPrice(a.price_usd, 'USD'))
            );
          })
        )
      ),
      filtered.length === 0 && h('p', { className: 'text-center text-slate-500 py-8' }, 'Артикулы не найдены')
    )
  );
};

// ============================================
// CALCULATOR PANEL
// ============================================

const CalculatorPanel = ({ devices, ukrainePrices, onClose }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedRepairs, setSelectedRepairs] = useState([]);
  const [laborCost, setLaborCost] = useState(500);
  const [margin, setMargin] = useState(30);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDevices = useMemo(() => {
    if (!searchTerm) return devices.slice(0, 50);
    const term = searchTerm.toLowerCase();
    return devices.filter(d => 
      d.name.toLowerCase().includes(term) || 
      (d.model || '').toLowerCase().includes(term)
    ).slice(0, 50);
  }, [devices, searchTerm]);
  
  const calculation = useMemo(() => {
    if (!selectedDevice || selectedRepairs.length === 0) return null;
    
    let partsCost = 0;
    const details = [];
    
    selectedRepairs.forEach(type => {
      const part = selectedDevice.service_parts?.[type];
      if (part) {
        const uaPrice = part.article && ukrainePrices?.[part.article];
        const price = uaPrice?.price_uah || (part.price_usd * RATES.USD_TO_UAH) || 0;
        partsCost += price;
        details.push({ type, price });
      }
    });
    
    const labor = laborCost * selectedRepairs.length;
    const subtotal = partsCost + labor;
    const marginAmount = subtotal * (margin / 100);
    const total = subtotal + marginAmount;
    
    return { partsCost, labor, marginAmount, total, details };
  }, [selectedDevice, selectedRepairs, laborCost, margin, ukrainePrices]);
  
  return h(Modal, { title: '🧮 Калькулятор ремонта', subtitle: 'Расчёт стоимости', onClose, size: 'lg', color: 'indigo' },
    h('div', { className: 'p-6 overflow-y-auto max-h-[70vh]' },
      h('div', { className: 'grid md:grid-cols-2 gap-6' },
        h('div', { className: 'space-y-4' },
          h('div', null,
            h('label', { className: 'block text-sm font-medium text-slate-700 mb-2' }, 'Поиск устройства'),
            h('input', {
              type: 'text',
              value: searchTerm,
              onChange: e => setSearchTerm(e.target.value),
              placeholder: 'iPhone 15, MacBook...',
              className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none'
            })
          ),
          h('div', null,
            h('label', { className: 'block text-sm font-medium text-slate-700 mb-2' }, 'Устройство'),
            h('select', {
              value: selectedDevice?.name || '',
              onChange: e => {
                const d = filteredDevices.find(x => x.name === e.target.value);
                setSelectedDevice(d);
                setSelectedRepairs([]);
              },
              className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none',
              size: 5
            },
              h('option', { value: '' }, '-- Выберите --'),
              ...filteredDevices.map(d => h('option', { key: d.name, value: d.name }, `${d.name} (${d.year})`))
            )
          ),
          selectedDevice && h('div', null,
            h('label', { className: 'block text-sm font-medium text-slate-700 mb-2' }, 'Ремонты'),
            h('div', { className: 'space-y-2' },
              ...Object.entries(selectedDevice.service_parts || {}).map(([type, part]) => {
                const uaPrice = part.article && ukrainePrices?.[part.article];
                const price = uaPrice?.price_uah || (part.price_usd * RATES.USD_TO_UAH);
                const isSelected = selectedRepairs.includes(type);
                
                return h('button', {
                  key: type,
                  onClick: () => {
                    if (isSelected) setSelectedRepairs(selectedRepairs.filter(r => r !== type));
                    else setSelectedRepairs([...selectedRepairs, type]);
                  },
                  className: cn('w-full p-3 rounded-xl border-2 text-left transition-all',
                    isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300')
                },
                  h('div', { className: 'flex justify-between' },
                    h('span', { className: 'font-medium capitalize' }, type.replace('_', ' ')),
                    h('span', { className: 'font-bold text-amber-600' }, price ? formatPrice(price, 'UAH') : 'N/A')
                  )
                );
              })
            )
          ),
          h('div', { className: 'grid grid-cols-2 gap-4' },
            h('div', null,
              h('label', { className: 'block text-sm font-medium text-slate-700 mb-2' }, 'Работа (₴)'),
              h('input', {
                type: 'number',
                value: laborCost,
                onChange: e => setLaborCost(Number(e.target.value)),
                className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none'
              })
            ),
            h('div', null,
              h('label', { className: 'block text-sm font-medium text-slate-700 mb-2' }, 'Маржа (%)'),
              h('input', {
                type: 'number',
                value: margin,
                onChange: e => setMargin(Number(e.target.value)),
                className: 'w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none'
              })
            )
          )
        ),
        h('div', null,
          calculation ? h('div', { className: 'bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white' },
            h('h3', { className: 'text-lg font-bold mb-4' }, '📊 Расчёт'),
            h('div', { className: 'space-y-3' },
              ...calculation.details.map(d =>
                h('div', { key: d.type, className: 'flex justify-between text-sm' },
                  h('span', { className: 'capitalize' }, d.type.replace('_', ' ')),
                  h('span', null, formatPrice(d.price, 'UAH'))
                )
              ),
              h('div', { className: 'border-t border-white/20 pt-3 mt-3' },
                h('div', { className: 'flex justify-between text-sm' },
                  h('span', null, 'Запчасти'),
                  h('span', null, formatPrice(calculation.partsCost, 'UAH'))
                ),
                h('div', { className: 'flex justify-between text-sm' },
                  h('span', null, `Работа (${selectedRepairs.length}x)`),
                  h('span', null, formatPrice(calculation.labor, 'UAH'))
                ),
                h('div', { className: 'flex justify-between text-sm' },
                  h('span', null, `Маржа ${margin}%`),
                  h('span', null, formatPrice(calculation.marginAmount, 'UAH'))
                )
              ),
              h('div', { className: 'border-t border-white/20 pt-3 mt-3' },
                h('div', { className: 'flex justify-between text-xl font-bold' },
                  h('span', null, 'ИТОГО'),
                  h('span', null, formatPrice(calculation.total, 'UAH'))
                ),
                h('p', { className: 'text-sm text-white/70 mt-1' }, `≈ ${formatPrice(calculation.total * RATES.UAH_TO_USD, 'USD')}`)
              )
            )
          ) : h('div', { className: 'bg-slate-100 rounded-2xl p-6 text-center text-slate-500' },
            h('p', null, 'Выберите устройство и ремонты для расчёта')
          )
        )
      )
    )
  );
};

// ============================================
// PARTS COMPATIBILITY PANEL (NEW 2026)
// ============================================

const PartsCompatibilityPanel = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('displays');
  const extData = window.NEXXExtendedData?.partsCompatibility || {};
  
  const tabs = [
    { id: 'displays', label: '📱 Дисплеи', data: extData.displays?.iphone || [] },
    { id: 'batteries', label: '🔋 Батареи', data: extData.batteries?.iphone || [] },
    { id: 'charging', label: '⚡ Порты зарядки', data: extData.charging_ports?.iphone || [] },
    { id: 'ics', label: '🔌 IC Cross-Ref', data: extData.ics_cross_reference?.charging_ics || [] }
  ];
  
  const activeData = tabs.find(t => t.id === activeTab)?.data || [];
  
  const filteredData = useMemo(() => {
    if (!searchTerm) return activeData;
    const term = searchTerm.toLowerCase();
    return activeData.filter(item => 
      JSON.stringify(item).toLowerCase().includes(term)
    );
  }, [activeData, searchTerm]);
  
  return h(Modal, { title: '🔧 Совместимость запчастей', subtitle: 'iPhone 14-17 cross-reference', onClose, size: 'lg', color: 'cyan' },
    h('div', { className: 'p-4' },
      // Tabs
      h('div', { className: 'flex gap-2 mb-4 overflow-x-auto pb-2' },
        tabs.map(tab => h('button', {
          key: tab.id,
          onClick: () => setActiveTab(tab.id),
          className: `px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === tab.id ? 'bg-cyan-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`
        }, `${tab.label} (${tab.data.length})`))
      ),
      // Search
      h('input', {
        type: 'text',
        placeholder: 'Поиск по модели или артикулу...',
        value: searchTerm,
        onChange: e => setSearchTerm(e.target.value),
        className: 'w-full p-3 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-cyan-500'
      }),
      // Content
      h('div', { className: 'space-y-3 max-h-[50vh] overflow-y-auto' },
        filteredData.length === 0 
          ? h('p', { className: 'text-center text-slate-400 py-8' }, 'Нет данных')
          : filteredData.map((item, idx) => 
            h('div', { key: idx, className: 'bg-slate-50 rounded-xl p-4' },
              h('div', { className: 'flex justify-between items-start mb-2' },
                h('span', { className: 'font-bold text-slate-800' }, item.part_name || item.ic_name || item.name || 'Запчасть'),
                item.apple_part && h('span', { className: 'text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded' }, item.apple_part)
              ),
              item.compatible_models && h('div', { className: 'text-sm text-green-600 mb-1' },
                '✅ Совместимо: ', item.compatible_models.join(', ')
              ),
              item.not_compatible && h('div', { className: 'text-sm text-red-500 mb-1' },
                '❌ Несовместимо: ', item.not_compatible.join(', ')
              ),
              item.used_in && h('div', { className: 'text-sm text-blue-600 mb-1' },
                '📱 Используется в: ', item.used_in.slice(0, 5).join(', '), item.used_in.length > 5 ? '...' : ''
              ),
              item.notes && h('div', { className: 'text-xs text-slate-500 mt-2 italic' }, item.notes),
              item.price_range_usd && h('div', { className: 'text-sm text-amber-600 mt-1' }, `💰 ${item.price_range_usd}`)
            )
          )
      )
    )
  );
};

// ============================================
// EXTENDED DIAGNOSTICS PANEL (NEW 2026)
// ============================================

const ExtendedDiagnosticsPanel = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const extData = window.NEXXExtendedData?.diagnosticsExtended || {};
  
  const allCodes = useMemo(() => {
    const codes = [];
    if (extData.apple_diagnostics_codes) {
      Object.entries(extData.apple_diagnostics_codes).forEach(([category, items]) => {
        items.forEach(item => codes.push({ ...item, category }));
      });
    }
    if (extData.iphone_16_specific_issues) {
      extData.iphone_16_specific_issues.forEach(item => codes.push({ ...item, category: 'iphone16' }));
    }
    return codes;
  }, [extData]);
  
  const categories = ['all', ...new Set(allCodes.map(c => c.category))];
  
  const filteredCodes = useMemo(() => {
    let filtered = allCodes;
    if (activeCategory !== 'all') {
      filtered = filtered.filter(c => c.category === activeCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        (c.code || '').toLowerCase().includes(term) ||
        (c.description || '').toLowerCase().includes(term) ||
        (c.issue || '').toLowerCase().includes(term)
      );
    }
    return filtered.slice(0, 100);
  }, [allCodes, activeCategory, searchTerm]);
  
  const getSeverityColor = (sev) => {
    const colors = { critical: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-green-100 text-green-700' };
    return colors[sev] || 'bg-slate-100 text-slate-700';
  };
  
  return h(Modal, { title: '🔬 Расширенная диагностика', subtitle: 'Apple Diagnostics + iPhone 16 Issues', onClose, size: 'lg', color: 'purple' },
    h('div', { className: 'p-4' },
      // Category filter
      h('div', { className: 'flex gap-2 mb-4 overflow-x-auto pb-2' },
        categories.slice(0, 8).map(cat => h('button', {
          key: cat,
          onClick: () => setActiveCategory(cat),
          className: `px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            activeCategory === cat ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`
        }, cat === 'all' ? 'Все' : cat.replace('_', ' ')))
      ),
      // Search
      h('input', {
        type: 'text',
        placeholder: 'Поиск по коду или описанию...',
        value: searchTerm,
        onChange: e => setSearchTerm(e.target.value),
        className: 'w-full p-3 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500'
      }),
      h('p', { className: 'text-sm text-slate-500 mb-3' }, `Найдено: ${filteredCodes.length} записей`),
      // Results
      h('div', { className: 'space-y-2 max-h-[50vh] overflow-y-auto' },
        filteredCodes.map((item, idx) => 
          h('div', { key: idx, className: 'bg-white border border-slate-200 rounded-xl p-3 hover:shadow-md transition-shadow' },
            h('div', { className: 'flex justify-between items-start mb-2' },
              h('span', { className: 'font-mono font-bold text-purple-700' }, item.code || item.issue),
              item.severity && h('span', { className: `text-xs px-2 py-1 rounded-full ${getSeverityColor(item.severity)}` }, item.severity)
            ),
            h('p', { className: 'text-sm text-slate-700 mb-1' }, item.description || item.symptom),
            item.description_ru && h('p', { className: 'text-sm text-slate-600' }, item.description_ru),
            item.action && h('p', { className: 'text-xs text-blue-600 mt-2' }, '🔧 ', item.action),
            item.fix && h('p', { className: 'text-xs text-green-600 mt-1' }, '✅ ', item.fix),
            item.diagnostic && h('p', { className: 'text-xs text-orange-600 mt-1' }, '📊 ', item.diagnostic)
          )
        )
      )
    )
  );
};

// ============================================
// MEASUREMENTS PANEL (NEW 2026)
// ============================================

const MeasurementsPanel = ({ measurementsData, onClose }) => {
  const [activeDevice, setActiveDevice] = useState('iphone_16');
  const extMeasurements = window.NEXXExtendedData?.measurementsExtended || {};
  
  const deviceData = activeDevice === 'iphone_16' ? extMeasurements.iphone_16_measurements :
                     activeDevice === 'iphone_15' ? extMeasurements.iphone_15_measurements :
                     activeDevice === 'mac_m4' ? extMeasurements.mac_m4_measurements :
                     measurementsData?.power_rails?.rails;
  
  const powerRails = deviceData?.power_rails || deviceData || {};
  
  return h(Modal, { title: '📏 Измерения и точки', subtitle: 'Voltage & Diode Mode', onClose, size: 'lg', color: 'teal' },
    h('div', { className: 'p-4' },
      // Device selector
      h('div', { className: 'flex gap-2 mb-4' },
        [
          { id: 'iphone_16', label: 'iPhone 16' },
          { id: 'iphone_15', label: 'iPhone 15' },
          { id: 'mac_m4', label: 'Mac M4' },
          { id: 'legacy', label: 'Старые модели' }
        ].map(d => h('button', {
          key: d.id,
          onClick: () => setActiveDevice(d.id),
          className: `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeDevice === d.id ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'
          }`
        }, d.label))
      ),
      // Power rails table
      h('div', { className: 'space-y-3 max-h-[55vh] overflow-y-auto' },
        Object.entries(powerRails).map(([key, rail]) => 
          h('div', { key, className: 'bg-slate-50 rounded-xl p-4 border-l-4 border-teal-500' },
            h('div', { className: 'flex justify-between items-center mb-2' },
              h('span', { className: 'font-mono font-bold text-teal-700' }, key),
              rail.expected_voltage && h('span', { className: 'bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full' }, rail.expected_voltage || rail.voltage)
            ),
            h('p', { className: 'text-sm text-slate-600 mb-2' }, rail.description || rail.name),
            h('div', { className: 'grid grid-cols-2 gap-2 text-xs' },
              rail.diode_mode && h('div', { className: 'bg-blue-50 p-2 rounded' },
                h('span', { className: 'text-blue-600' }, '🔍 Diode: '), rail.diode_mode || rail.diode_mode_normal
              ),
              rail.if_shorted && h('div', { className: 'bg-red-50 p-2 rounded' },
                h('span', { className: 'text-red-600' }, '⚠️ Если КЗ: '), 
                Array.isArray(rail.if_shorted) ? rail.if_shorted[0] : rail.if_shorted
              ),
              rail.if_missing && h('div', { className: 'bg-orange-50 p-2 rounded col-span-2' },
                h('span', { className: 'text-orange-600' }, '❓ Если нет: '), rail.if_missing
              ),
              rail.source_ic && h('div', { className: 'bg-purple-50 p-2 rounded' },
                h('span', { className: 'text-purple-600' }, '🔌 IC: '), rail.source_ic
              )
            )
          )
        )
      ),
      // USB-C diagnostics for iPhone 16
      activeDevice === 'iphone_16' && extMeasurements.iphone_16_measurements?.usb_c_diagnostics && 
        h('div', { className: 'mt-4 bg-cyan-50 rounded-xl p-4' },
          h('h4', { className: 'font-bold text-cyan-800 mb-3' }, '🔌 USB-C Диагностика'),
          h('div', { className: 'grid grid-cols-2 gap-3' },
            Object.entries(extMeasurements.iphone_16_measurements.usb_c_diagnostics).map(([pin, data]) =>
              h('div', { key: pin, className: 'bg-white rounded-lg p-3' },
                h('span', { className: 'font-mono font-bold text-cyan-700' }, pin),
                h('p', { className: 'text-xs text-slate-500' }, data.description),
                h('p', { className: 'text-sm text-green-600' }, 'Diode: ', data.diode_mode)
              )
            )
          )
        )
    )
  );
};

// ============================================
// CALIBRATION PANEL (NEW 2026)
// ============================================

const CalibrationPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('display');
  const extData = window.NEXXExtendedData?.calibrationRepair || {};
  
  const tabs = [
    { id: 'display', label: '📱 Дисплей', color: 'blue' },
    { id: 'battery', label: '🔋 Батарея', color: 'green' },
    { id: 'faceid', label: '👤 Face ID', color: 'purple' },
    { id: 'bga', label: '🔩 BGA', color: 'orange' }
  ];
  
  const displayData = extData.display_calibration || {};
  const batteryData = extData.battery_calibration || {};
  const faceIdData = extData.face_id_calibration || {};
  const bgaData = extData.microsoldering_guides?.bga_reballing || {};
  const bgaRepairs = extData.microsoldering_guides?.common_bga_repairs || {};
  
  return h(Modal, { title: '🎯 Калибровка и Ремонт', subtitle: 'True Tone, Face ID, BGA', onClose, size: 'lg', color: 'rose' },
    h('div', { className: 'p-4' },
      // Tabs
      h('div', { className: 'flex gap-2 mb-4 overflow-x-auto pb-2' },
        tabs.map(tab => h('button', {
          key: tab.id,
          onClick: () => setActiveTab(tab.id),
          className: `px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === tab.id ? `bg-rose-500 text-white` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`
        }, tab.label))
      ),
      
      // Display Calibration
      activeTab === 'display' && h('div', { className: 'space-y-4 max-h-[60vh] overflow-y-auto' },
        h('div', { className: 'bg-blue-50 rounded-xl p-4' },
          h('h4', { className: 'font-bold text-blue-800 mb-3' }, '📱 Калибровка дисплеев'),
          h('p', { className: 'text-sm text-slate-600 mb-3' }, displayData.description || 'Калибровка True Tone для восстановления цветопередачи'),
          displayData.tools_required && h('div', { className: 'mb-3' },
            h('p', { className: 'text-xs text-blue-600 font-medium mb-2' }, '🔧 Инструменты:'),
            h('div', { className: 'grid grid-cols-2 gap-2' },
              displayData.tools_required.map((tool, i) => h('div', { key: i, className: 'bg-blue-100 p-2 rounded-lg' },
                h('span', { className: 'text-blue-800 text-sm font-medium' }, tool.name),
                h('p', { className: 'text-xs text-blue-600' }, tool.purpose)
              ))
            )
          )
        ),
        displayData.iphone_16_display && h('div', { className: 'bg-indigo-50 rounded-xl p-4' },
          h('h4', { className: 'font-bold text-indigo-800 mb-2' }, '📱 iPhone 16 Display'),
          h('p', { className: 'text-xs text-indigo-600 mb-2' }, `True Tone: ${displayData.iphone_16_display.true_tone_data_location}`),
          displayData.iphone_16_display.programming_steps && h('ol', { className: 'text-sm text-slate-700 space-y-1 list-decimal list-inside' },
            displayData.iphone_16_display.programming_steps.map((step, i) => h('li', { key: i }, step))
          ),
          displayData.iphone_16_display.without_programming && h('div', { className: 'mt-3 bg-amber-100 rounded-lg p-2' },
            h('p', { className: 'text-xs font-medium text-amber-800' }, '⚠️ Без программирования:'),
            h('p', { className: 'text-xs text-amber-700' }, `True Tone: ${displayData.iphone_16_display.without_programming.true_tone}`),
            h('p', { className: 'text-xs text-amber-700' }, displayData.iphone_16_display.without_programming.important_message)
          )
        )
      ),
      
      // Battery Calibration
      activeTab === 'battery' && h('div', { className: 'space-y-4 max-h-[60vh] overflow-y-auto' },
        h('div', { className: 'bg-green-50 rounded-xl p-4' },
          h('h4', { className: 'font-bold text-green-800 mb-3' }, '🔋 Калибровка батареи'),
          h('p', { className: 'text-sm text-slate-600 mb-3' }, batteryData.description || 'Калибровка батарей iPhone'),
          batteryData.tools_required && h('div', { className: 'mb-3' },
            h('p', { className: 'text-xs text-green-600 font-medium mb-2' }, '🔧 Инструменты:'),
            h('div', { className: 'flex flex-wrap gap-2' },
              batteryData.tools_required.map((tool, i) => h('div', { key: i, className: 'bg-green-100 px-2 py-1 rounded text-xs' },
                h('span', { className: 'text-green-800 font-medium' }, tool.name)
              ))
            )
          )
        ),
        batteryData.iphone_16_battery && h('div', { className: 'bg-emerald-50 rounded-xl p-4' },
          h('h4', { className: 'font-bold text-emerald-800 mb-2' }, '🔋 iPhone 16 Battery'),
          h('p', { className: 'text-xs text-emerald-600 mb-2' }, `Метод: ${batteryData.iphone_16_battery.removal_method}`),
          batteryData.iphone_16_battery.programming_steps && h('ol', { className: 'text-sm text-slate-700 space-y-1 list-decimal list-inside' },
            batteryData.iphone_16_battery.programming_steps.map((step, i) => h('li', { key: i }, step))
          ),
          batteryData.iphone_16_battery.without_programming && h('div', { className: 'mt-3 bg-yellow-100 rounded-lg p-2' },
            h('p', { className: 'text-xs font-medium text-yellow-800' }, '⚠️ Без программирования:'),
            h('p', { className: 'text-xs text-yellow-700' }, batteryData.iphone_16_battery.without_programming.message),
            h('p', { className: 'text-xs text-yellow-700' }, `Health: ${batteryData.iphone_16_battery.without_programming.health_display}`)
          )
        ),
        batteryData.battery_health_reset && h('div', { className: 'bg-red-50 rounded-xl p-4' },
          h('h4', { className: 'font-bold text-red-800 mb-2' }, '⚠️ Health Reset'),
          h('p', { className: 'text-xs text-red-700' }, batteryData.battery_health_reset.warning),
          h('p', { className: 'text-xs text-slate-600 mt-1' }, `Допустимо: ${batteryData.battery_health_reset.legitimate_use}`)
        )
      ),
      
      // Face ID
      activeTab === 'faceid' && h('div', { className: 'space-y-4 max-h-[60vh] overflow-y-auto' },
        h('div', { className: 'bg-purple-50 rounded-xl p-4' },
          h('h4', { className: 'font-bold text-purple-800 mb-3' }, '👤 Face ID Ремонт'),
          h('p', { className: 'text-sm text-slate-600 mb-3' }, faceIdData.description || 'Калибровка и восстановление Face ID'),
          faceIdData.components && h('div', { className: 'grid grid-cols-2 gap-2 mb-3' },
            Object.entries(faceIdData.components).map(([key, val]) => h('div', { key, className: 'bg-purple-100 p-2 rounded-lg' },
              h('span', { className: 'text-xs text-purple-800 font-medium' }, key.replace(/_/g, ' ')),
              h('p', { className: 'text-xs text-purple-600' }, val)
            ))
          ),
          faceIdData.serialization && h('div', { className: 'bg-red-100 rounded-lg p-3' },
            h('p', { className: 'text-xs text-red-800 font-medium' }, '🔒 Сериализация:'),
            h('p', { className: 'text-xs text-red-700' }, `Paired to: ${faceIdData.serialization.paired_to}`),
            h('p', { className: 'text-xs text-red-700' }, faceIdData.serialization.apple_tools)
          )
        ),
        faceIdData.repair_options && h('div', { className: 'bg-violet-50 rounded-xl p-4' },
          h('h4', { className: 'font-bold text-violet-800 mb-3' }, '🔧 Варианты ремонта'),
          Object.entries(faceIdData.repair_options).map(([key, opt]) => h('div', { key, className: 'bg-white rounded-lg p-3 mb-2 border-l-4 border-violet-500' },
            h('p', { className: 'font-medium text-violet-700 text-sm' }, key.replace(/_/g, ' ')),
            h('p', { className: 'text-xs text-slate-600 mt-1' }, `Face ID: ${opt.affects_face_id}`),
            opt.steps && h('ol', { className: 'text-xs text-slate-500 mt-2 list-decimal list-inside' },
              opt.steps.map((s, i) => h('li', { key: i }, s))
            )
          ))
        )
      ),
      
      // BGA Reballing
      activeTab === 'bga' && h('div', { className: 'space-y-4 max-h-[60vh] overflow-y-auto' },
        h('div', { className: 'bg-orange-50 rounded-xl p-4' },
          h('h4', { className: 'font-bold text-orange-800 mb-3' }, '🔩 BGA Reballing'),
          h('p', { className: 'text-sm text-slate-600 mb-3' }, bgaData.description || 'Процесс замены шариков BGA'),
          bgaData.temperature_profiles && h('div', { className: 'mb-4' },
            h('p', { className: 'text-xs text-orange-600 font-medium mb-2' }, '🌡️ Температурные профили:'),
            h('div', { className: 'grid grid-cols-2 gap-2' },
              Object.entries(bgaData.temperature_profiles).map(([type, temps]) => h('div', { key: type, className: 'bg-white rounded-lg p-2' },
                h('p', { className: 'font-mono text-sm text-orange-700' }, type),
                h('p', { className: 'text-xs text-slate-500' }, `Preheat: ${temps.preheat}`),
                h('p', { className: 'text-xs text-slate-500' }, `Reflow: ${temps.reflow}`)
              ))
            )
          ),
          bgaData.equipment && h('div', { className: 'mb-4' },
            h('p', { className: 'text-xs text-orange-600 font-medium mb-2' }, '🔧 Оборудование:'),
            h('div', { className: 'grid grid-cols-2 gap-2' },
              bgaData.equipment.map((eq, i) => h('div', { key: i, className: 'bg-orange-100 p-2 rounded text-xs' },
                h('span', { className: 'text-orange-800 font-medium' }, eq.item),
                eq.specs && h('p', { className: 'text-orange-600 text-xs' }, eq.specs)
              ))
            )
          ),
          bgaData.steps && h('div', null,
            h('p', { className: 'text-xs text-orange-600 font-medium mb-2' }, '📋 Шаги:'),
            h('ol', { className: 'text-sm text-slate-700 space-y-1 list-decimal list-inside' },
              bgaData.steps.map((step, i) => h('li', { key: i }, step))
            )
          )
        ),
        bgaRepairs.iphone && h('div', { className: 'bg-amber-50 rounded-xl p-4' },
          h('h4', { className: 'font-bold text-amber-800 mb-3' }, '📱 iPhone BGA Ремонты'),
          h('div', { className: 'space-y-2' },
            bgaRepairs.iphone.map((rep, i) => h('div', { key: i, className: 'bg-white rounded-lg p-3 border-l-4 border-amber-500' },
              h('div', { className: 'flex justify-between items-start' },
                h('span', { className: 'font-medium text-amber-700' }, rep.ic),
                h('span', { className: `text-xs px-2 py-0.5 rounded ${rep.difficulty === 'Expert' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}` }, rep.difficulty)
              ),
              h('p', { className: 'text-xs text-slate-600 mt-1' }, rep.common_issue),
              h('p', { className: 'text-xs text-blue-600' }, `📱 ${rep.models}`),
              rep.notes && h('p', { className: 'text-xs text-slate-500 mt-1 italic' }, rep.notes)
            ))
          )
        )
      )
    )
  );
};

// ============================================
// MICROSOLDERING PANEL (NEW 2026)
// ============================================

const MicrosolderingPanel = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('backlight');
  const extData = window.NEXXExtendedData?.microsolderingComponents || {};
  
  const categories = ['backlight', 'charging', 'audio', 'touch', 'baseband', 'power'];
  
  const categoryData = extData[activeCategory] || {};
  
  const allComponents = useMemo(() => {
    const comps = [];
    // Parse device-specific components from the category
    Object.entries(categoryData).forEach(([device, deviceData]) => {
      if (device === 'description') return;
      Object.entries(deviceData || {}).forEach(([compType, compData]) => {
        if (compData && typeof compData === 'object') {
          comps.push({
            name: compType.replace(/_/g, ' '),
            device: device.replace(/_/g, ' '),
            value: compData.value,
            digikey: compData.digikey,
            locations: compData.locations,
            aliexpress: compData.aliexpress,
            note: compData.note
          });
        }
      });
    });
    return comps;
  }, [categoryData]);
  
  const filteredComponents = useMemo(() => {
    if (!searchTerm) return allComponents;
    const term = searchTerm.toLowerCase();
    return allComponents.filter(c => 
      (c.name || '').toLowerCase().includes(term) ||
      (c.device || '').toLowerCase().includes(term) ||
      (c.value || '').toLowerCase().includes(term) ||
      (c.locations?.join(' ') || '').toLowerCase().includes(term)
    );
  }, [allComponents, searchTerm]);
  
  const getCategoryIcon = (cat) => {
    const icons = { 
      backlight: '💡', charging: '🔋', audio: '🔊', 
      touch: '👆', baseband: '📡', power: '⚡'
    };
    return icons[cat] || '🔩';
  };
  
  return h(Modal, { title: '🔩 Микропайка', subtitle: 'Компоненты для микропайки', onClose, size: 'lg', color: 'orange' },
    h('div', { className: 'p-4' },
      // Category description
      categoryData.description && h('p', { className: 'text-sm text-slate-600 mb-4 bg-orange-50 p-3 rounded-lg' }, categoryData.description),
      
      // Category filter
      h('div', { className: 'flex gap-2 mb-4 overflow-x-auto pb-2' },
        categories.map(cat => h('button', {
          key: cat,
          onClick: () => setActiveCategory(cat),
          className: `px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            activeCategory === cat ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`
        }, getCategoryIcon(cat), ' ', cat.charAt(0).toUpperCase() + cat.slice(1)))
      ),
      
      // Search
      h('input', {
        type: 'text',
        placeholder: 'Поиск компонента или устройства...',
        value: searchTerm,
        onChange: e => setSearchTerm(e.target.value),
        className: 'w-full p-3 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-orange-500'
      }),
      
      h('p', { className: 'text-sm text-slate-500 mb-3' }, `Найдено: ${filteredComponents.length} компонентов`),
      
      // Components grid
      h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto' },
        filteredComponents.map((comp, idx) => 
          h('div', { key: idx, className: 'bg-white border border-slate-200 rounded-xl p-3 hover:shadow-md transition-shadow' },
            h('div', { className: 'flex justify-between items-start mb-2' },
              h('span', { className: 'font-bold text-slate-800 text-sm' }, comp.name),
              h('span', { className: 'bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded' }, comp.device)
            ),
            comp.value && h('p', { className: 'text-xs text-amber-600 mb-1' }, '📏 ', comp.value),
            comp.locations && h('p', { className: 'text-xs text-purple-600 font-mono' }, '📍 ', comp.locations.join(', ')),
            comp.digikey && h('p', { className: 'text-xs text-green-600 mt-1' }, '🛒 DigiKey: ', comp.digikey),
            comp.aliexpress && h('p', { className: 'text-xs text-orange-600' }, '🛍️ ', comp.aliexpress),
            comp.note && h('p', { className: 'text-xs text-slate-500 mt-1 italic' }, comp.note)
          )
        )
      ),
      
      // Sources
      extData.references && h('div', { className: 'mt-4 bg-slate-50 rounded-xl p-3' },
        h('p', { className: 'text-xs text-slate-500' }, '📚 Источники: ', extData.references.join(', '))
      )
    )
  );
};

// ============================================
// BOARD DETAIL MODAL
// ============================================

const BoardDetailModal = ({ board, ukrainePrices, onClose }) => {
  if (!board) return null;
  
  return h(Modal, { title: `🖥️ ${board.article}`, subtitle: board.description, onClose, color: 'violet', size: 'md' },
    h('div', { className: 'p-6 overflow-y-auto max-h-[70vh] space-y-4' },
      h('div', { className: 'bg-violet-50 rounded-xl p-4' },
        h('h4', { className: 'font-bold text-violet-800 mb-3' }, '📋 Информация'),
        h('div', { className: 'space-y-2 text-sm' },
          h('div', { className: 'flex justify-between' },
            h('span', { className: 'text-slate-500' }, 'Артикул:'),
            h('span', { className: 'font-mono font-bold' }, board.article)
          ),
          board.model && h('div', { className: 'flex justify-between' },
            h('span', { className: 'text-slate-500' }, 'Модель:'),
            h('span', { className: 'font-bold' }, board.model)
          ),
          h('div', null,
            h('span', { className: 'text-slate-500' }, 'Описание:'),
            h('p', { className: 'text-slate-700 mt-1' }, board.description)
          )
        )
      ),
      board.specs && h('div', { className: 'bg-blue-50 rounded-xl p-4' },
        h('h4', { className: 'font-bold text-blue-800 mb-3' }, '⚙️ Спецификации'),
        h('div', { className: 'grid grid-cols-2 gap-3' },
          board.specs.cpu_ghz && h('div', { className: 'p-3 bg-white rounded-lg text-center' },
            h('p', { className: 'text-xs text-slate-500' }, 'CPU'),
            h('p', { className: 'font-bold text-blue-700' }, `${board.specs.cpu_ghz} GHz`)
          ),
          board.specs.ram_gb && h('div', { className: 'p-3 bg-white rounded-lg text-center' },
            h('p', { className: 'text-xs text-slate-500' }, 'RAM'),
            h('p', { className: 'font-bold text-blue-700' }, `${board.specs.ram_gb} GB`)
          ),
          board.specs.storage_gb && h('div', { className: 'p-3 bg-white rounded-lg text-center' },
            h('p', { className: 'text-xs text-slate-500' }, 'Storage'),
            h('p', { className: 'font-bold text-blue-700' }, `${board.specs.storage_gb} GB`)
          )
        )
      ),
      h('div', { className: 'bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white' },
        h('h4', { className: 'font-bold mb-3' }, '💰 Цены'),
        h('div', { className: 'flex justify-between items-center' },
          h('div', null,
            h('p', { className: 'text-sm text-white/80' }, 'Украина'),
            h('p', { className: 'text-2xl font-bold' }, formatPrice(board.price_uah, 'UAH'))
          ),
          h('div', { className: 'text-right' },
            h('p', { className: 'text-sm text-white/80' }, 'USD'),
            h('p', { className: 'text-xl font-bold' }, formatPrice(board.price_usd, 'USD'))
          )
        )
      )
    )
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================

const App = () => {
  // Data states
  const [devices, setDevices] = useState([]);
  const [ukrainePrices, setUkrainePrices] = useState(null);
  const [logicBoardsSpecs, setLogicBoardsSpecs] = useState(null);
  const [icData, setIcData] = useState(null);
  const [errorData, setErrorData] = useState(null);
  const [knowledgeData, setKnowledgeData] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [keyCombinations, setKeyCombinations] = useState(null);
  const [articlesIndex, setArticlesIndex] = useState(null);
  const [measurementsData, setMeasurementsData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedIC, setSelectedIC] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [errorSearchTerm, setErrorSearchTerm] = useState('');
  
  // Panels
  const [showPrices, setShowPrices] = useState(false);
  const [showBoards, setShowBoards] = useState(false);
  const [showICs, setShowICs] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const [showDfu, setShowDfu] = useState(false);
  const [showArticles, setShowArticles] = useState(false);
  // NEW 2026 Extended Panels
  const [showDiagnosticsExt, setShowDiagnosticsExt] = useState(false);
  const [showPartsCompat, setShowPartsCompat] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);
  const [showMicrosoldering, setShowMicrosoldering] = useState(false);
  
  // Load all data from ЕДИНОЙ базы master-db.json
  useEffect(() => {
    fetch('/data/master-db.json')
      .then(r => r.json())
      .then(db => {
        // Устройства
        setDevices(Array.isArray(db.devices) ? db.devices : []);
        
        // Цены
        if (db.prices) {
          setUkrainePrices(db.prices);
        }
        
        // База знаний (всё внутри knowledge)
        const knowledge = db.knowledge || {};
        
        // Логические платы
        setLogicBoardsSpecs(knowledge.logicBoards?.specs || {});
        
        // IC совместимость
        setIcData(knowledge.icCompatibility || {});
        
        // Коды ошибок
        setErrorData(knowledge.errorCodes || {});
        
        // База знаний по ремонту
        setKnowledgeData(knowledge.repairKnowledge || {});
        
        // Региональные коды
        setRegionData(knowledge.regionalCodes?.basic || {});
        
        // Комбинации клавиш
        setKeyCombinations(knowledge.keyCombinations || {});
        
        // Индекс статей
        setArticlesIndex(knowledge.articleSearchIndex || {});
        
        // Измерения
        setMeasurementsData(knowledge.measurements || {});
        
        // Расширенные данные для глобального доступа
        window.NEXXExtendedData = {
          cameraCompatibility: knowledge.cameraCompatibility,
          regionalCodesExtended: knowledge.regionalCodes?.extended
        };
        
        setLoading(false);
        console.log('✅ NEXX Database v3.0 - Единая база загружена');
        console.log('📊 Данные:', { 
          devices: db.devices?.length || 0,
          knowledge: Object.keys(knowledge).length
        });
      })
      .catch(err => {
        console.error('Error loading master-db:', err);
        setLoading(false);
      });
  }, []);
  
  // Stats - Extended with 2026 data
  const stats = useMemo(() => {
    const extData = window.NEXXExtendedData || {};
    const extDiagCodes = extData.diagnosticsExtended?.apple_diagnostics_codes ? 
      Object.values(extData.diagnosticsExtended.apple_diagnostics_codes).flat().length : 0;
    return {
      devices: devices.length,
      prices: ukrainePrices ? Object.keys(ukrainePrices).length : 0,
      boards: logicBoardsSpecs?.total || 0,
      ics: icData ? Object.values(icData).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0) : 0,
      errors: errorData ? (errorData.itunes_restore_errors?.length || 0) + (errorData.mac_diagnostics?.length || 0) + extDiagCodes : 0,
      partsCompat: extData.partsCompatibility ? (extData.partsCompatibility.displays?.iphone?.length || 0) + (extData.partsCompatibility.batteries?.iphone?.length || 0) : 0,
      measurements: extData.measurementsExtended?.iphone_16_measurements ? Object.keys(extData.measurementsExtended.iphone_16_measurements.power_rails || {}).length : 0
    };
  }, [devices, ukrainePrices, logicBoardsSpecs, icData, errorData]);
  
  // Universal search results
  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    const term = searchTerm.toLowerCase();
    const results = [];
    
    // Search devices
    devices.forEach(d => {
      if (d.name.toLowerCase().includes(term) || (d.model || '').toLowerCase().includes(term) || (d.processor || '').toLowerCase().includes(term)) {
        results.push({ type: 'device', id: d.name, title: d.name, subtitle: `${d.category} • ${d.year}`, typeLabel: 'Устройство', data: d });
      }
    });
    
    // Search prices
    if (ukrainePrices) {
      Object.entries(ukrainePrices).slice(0, 1000).forEach(([article, data]) => {
        if (article.toLowerCase().includes(term) || (data.description || '').toLowerCase().includes(term)) {
          results.push({ type: 'price', id: article, title: article, subtitle: data.description?.slice(0, 50), typeLabel: 'Цена', data: { article, ...data } });
        }
      });
    }
    
    // Search boards
    if (logicBoardsSpecs?.boards) {
      Object.entries(logicBoardsSpecs.boards).forEach(([article, board]) => {
        if (article.toLowerCase().includes(term) || (board.description || '').toLowerCase().includes(term)) {
          results.push({ type: 'board', id: article, title: article, subtitle: board.description?.slice(0, 50), typeLabel: 'Плата', data: { article, ...board } });
        }
      });
    }
    
    // Search ICs
    if (icData) {
      Object.values(icData).forEach(category => {
        if (Array.isArray(category)) {
          category.forEach(ic => {
            if (ic.name.toLowerCase().includes(term) || (ic.designation || '').toLowerCase().includes(term)) {
              results.push({ type: 'ic', id: ic.name, title: ic.name, subtitle: ic.designation || ic.functions?.[0], typeLabel: 'IC', data: ic });
            }
          });
        }
      });
    }
    
    // Search errors
    if (errorData?.itunes_restore_errors) {
      errorData.itunes_restore_errors.forEach(e => {
        if (String(e.code).includes(term) || (e.description || '').toLowerCase().includes(term)) {
          results.push({ type: 'error', id: e.code, title: `Error ${e.code}`, subtitle: e.description?.slice(0, 50), typeLabel: 'Ошибка', data: e });
        }
      });
    }
    
    // Search articles
    if (articlesIndex?.articles) {
      articlesIndex.articles.forEach(a => {
        if (a.article?.toLowerCase().includes(term) || (a.model || '').toLowerCase().includes(term)) {
          results.push({ type: 'article', id: a.article, title: a.article, subtitle: a.model, typeLabel: 'Артикул', data: a });
        }
      });
    }
    
    return results.slice(0, 50);
  }, [searchTerm, devices, ukrainePrices, logicBoardsSpecs, icData, errorData, articlesIndex]);
  
  // Handle search result selection
  const handleSelectResult = useCallback((result) => {
    switch (result.type) {
      case 'device': setSelectedDevice(result.data); break;
      case 'price': setShowPrices(true); break;
      case 'board': setSelectedBoard(result.data); break;
      case 'ic': setSelectedIC(result.data); break;
      case 'error': setErrorSearchTerm(String(result.data.code)); setShowErrors(true); break;
      case 'article': setShowArticles(true); break;
    }
    setSearchTerm('');
  }, []);
  
  // Categories & Years
  const categories = useMemo(() => {
    const cats = new Set(devices.map(d => d.category).filter(Boolean));
    return ['all', ...Array.from(cats).sort()];
  }, [devices]);
  
  const years = useMemo(() => {
    const yrs = new Set(devices.map(d => d.year).filter(Boolean));
    return ['all', ...Array.from(yrs).sort((a, b) => b - a)];
  }, [devices]);
  
  // Filtered devices
  const filteredDevices = useMemo(() => {
    let result = devices;
    
    if (selectedCategory !== 'all') {
      result = result.filter(d => d.category === selectedCategory);
    }
    if (selectedYear !== 'all') {
      result = result.filter(d => d.year === parseInt(selectedYear));
    }
    
    return result.sort((a, b) => (b.year || 0) - (a.year || 0));
  }, [devices, selectedCategory, selectedYear]);
  
  // Loading screen
  if (loading) {
    return h('div', { className: 'min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center' },
      h('div', { className: 'text-center text-white' },
        h('div', { className: 'w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4' }),
        h('p', { className: 'text-xl font-bold' }, 'NEXX Database 2026'),
        h('p', { className: 'text-slate-400' }, 'Загрузка базы знаний...')
      )
    );
  }
  
  // Main render
  return h('div', { className: 'min-h-screen bg-gradient-to-br from-slate-50 to-slate-100' },
    h('div', { className: 'max-w-7xl mx-auto px-4 py-6' },
      // Stats
      h(StatsDashboard, { stats }),
      
      // Smart Search
      h(SmartSearch, { 
        searchTerm, 
        setSearchTerm,
        searchResults,
        onSelectResult: handleSelectResult,
        placeholder: 'Умный поиск: модель, IC, артикул, код ошибки...' 
      }),
      
      // Quick Actions - Row 1
      h('div', { className: 'grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-3' },
        h(QuickActionCard, { icon: '💰', title: 'Цены UA', subtitle: `${stats.prices.toLocaleString()} поз.`, color: 'amber', onClick: () => setShowPrices(true) }),
        h(QuickActionCard, { icon: '🖥️', title: 'Платы', subtitle: `${stats.boards}`, color: 'violet', onClick: () => setShowBoards(true) }),
        h(QuickActionCard, { icon: '🔌', title: 'IC', subtitle: `${stats.ics}`, color: 'green', onClick: () => setShowICs(true) }),
        h(QuickActionCard, { icon: '🚨', title: 'Ошибки', subtitle: `${stats.errors}`, color: 'red', onClick: () => { setErrorSearchTerm(''); setShowErrors(true); } }),
        h(QuickActionCard, { icon: '📚', title: '', subtitle: '', color: 'blue', onClick: () => setShowKnowledge(true) }),
        h(QuickActionCard, { icon: '🧮', title: 'Кальк', subtitle: 'Расчёт', color: 'indigo', onClick: () => setShowCalculator(true) })
      ),
      
      // Quick Actions - Row 2
      h('div', { className: 'grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-3' },
        h(QuickActionCard, { icon: '🌍', title: 'Регионы', subtitle: 'Коды стран', color: 'blue', onClick: () => setShowRegions(true) }),
        h(QuickActionCard, { icon: '⌨️', title: 'DFU/Recovery', subtitle: 'Режимы', color: 'slate', onClick: () => setShowDfu(true) }),
        h(QuickActionCard, { icon: '📦', title: 'Артикулы', subtitle: `${articlesIndex?.articles?.length || 0} запч.`, color: 'amber', onClick: () => setShowArticles(true) }),
        h(QuickActionCard, { icon: '🔬', title: 'Диагностика+', subtitle: `${stats.errors}+ кодов`, color: 'purple', onClick: () => setShowDiagnosticsExt(true), badge: 'NEW' }),
        h(QuickActionCard, { icon: '🔧', title: 'Совместимость', subtitle: `${stats.partsCompat} запч.`, color: 'emerald', onClick: () => setShowPartsCompat(true), badge: 'NEW' }),
        h(QuickActionCard, { icon: '📏', title: 'Измерения', subtitle: `${stats.measurements} точек`, color: 'teal', onClick: () => setShowMeasurements(true), badge: 'NEW' })
      ),
      
      // Quick Actions - Row 3 (NEW 2026)
      h('div', { className: 'grid grid-cols-2 gap-3 mb-6' },
        h(QuickActionCard, { icon: '🎯', title: 'Калибровка', subtitle: 'True Tone, Face ID', color: 'rose', onClick: () => setShowCalibration(true), badge: 'NEW' }),
        h(QuickActionCard, { icon: '🔩', title: 'Микропайка', subtitle: 'BGA, Reballing', color: 'orange', onClick: () => setShowMicrosoldering(true), badge: 'NEW' })
      ),
      
      // Filters
      h('div', { className: 'flex flex-wrap gap-3 mb-6 items-center' },
        h('div', { className: 'flex gap-2 overflow-x-auto pb-1' },
          ...categories.map(cat =>
            h('button', {
              key: cat,
              onClick: () => setSelectedCategory(cat),
              className: cn('px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all',
                selectedCategory === cat ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100')
            }, cat === 'all' ? 'Все' : cat)
          )
        ),
        h('select', {
          value: selectedYear,
          onChange: e => setSelectedYear(e.target.value),
          className: 'px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium'
        },
          ...years.map(yr => h('option', { key: yr, value: yr }, yr === 'all' ? 'Все года' : yr))
        ),
        h('span', { className: 'text-sm text-slate-500 ml-auto' }, `Найдено: ${filteredDevices.length}`)
      ),
      
      // Devices Grid
      h('div', { className: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' },
        ...filteredDevices.map(device =>
          h(DeviceCard, {
            key: device.name,
            device,
            ukrainePrices,
            onClick: () => setSelectedDevice(device)
          })
        )
      )
    ),
    
    // Modals
    selectedDevice && h(DeviceDetailsView, {
      device: selectedDevice,
      ukrainePrices,
      logicBoardsSpecs,
      icData,
      errorData,
      measurementsData,
      onClose: () => setSelectedDevice(null),
      onOpenIC: (ic) => { setSelectedDevice(null); setSelectedIC(ic); },
      onOpenError: (code) => { setSelectedDevice(null); setErrorSearchTerm(code); setShowErrors(true); },
      onOpenBoard: (board) => { setSelectedDevice(null); setSelectedBoard(board); }
    }),
    
    selectedIC && h(ICDetailModal, { ic: selectedIC, onClose: () => setSelectedIC(null) }),
    selectedBoard && h(BoardDetailModal, { board: selectedBoard, ukrainePrices, onClose: () => setSelectedBoard(null) }),
    
    showPrices && h(PricesPanel, { ukrainePrices, onClose: () => setShowPrices(false) }),
    showBoards && h(LogicBoardsPanel, { logicBoardsSpecs, onClose: () => setShowBoards(false), onSelectBoard: (b) => { setShowBoards(false); setSelectedBoard(b); } }),
    showICs && h(ICDatabasePanel, { icData, onClose: () => setShowICs(false), onSelectIC: (ic) => { setShowICs(false); setSelectedIC(ic); } }),
    showErrors && h(ErrorCodesPanel, { errorData, onClose: () => setShowErrors(false), initialSearch: errorSearchTerm }),
    showKnowledge && knowledgeData && h(RepairKnowledgePanel, { knowledgeData, onClose: () => setShowKnowledge(false) }),
    showCalculator && h(CalculatorPanel, { devices, ukrainePrices, onClose: () => setShowCalculator(false) }),
    showRegions && regionData && h(RegionalCodesPanel, { regionData, onClose: () => setShowRegions(false) }),
    showDfu && keyCombinations && h(DfuRecoveryPanel, { keyCombinations, onClose: () => setShowDfu(false) }),
    showArticles && h(ArticlesSearchPanel, { articlesIndex, ukrainePrices, onClose: () => setShowArticles(false) }),
    // NEW 2026 Extended Panels
    showDiagnosticsExt && h(ExtendedDiagnosticsPanel, { onClose: () => setShowDiagnosticsExt(false) }),
    showPartsCompat && h(PartsCompatibilityPanel, { onClose: () => setShowPartsCompat(false) }),
    showMeasurements && h(MeasurementsPanel, { measurementsData, onClose: () => setShowMeasurements(false) }),
    showCalibration && h(CalibrationPanel, { onClose: () => setShowCalibration(false) }),
    showMicrosoldering && h(MicrosolderingPanel, { onClose: () => setShowMicrosoldering(false) })
  );
};

// Initialize
const appContainer = document.getElementById('app');
if (appContainer) {
  appContainer.innerHTML = '';
  ReactDOM.createRoot(appContainer).render(h(App));
  console.log('✅ NEXX Database 2026 v13 mounted - Extended Edition with Parts Compatibility, Diagnostics, Measurements, Calibration & Microsoldering data');
}
