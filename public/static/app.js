// Apple Intake Desk - Main Application v3.0
// Unified UI with service parts, official prices, and logic boards
const { useState, useMemo, useEffect, createElement: h } = React;

// ===== UTILITY FUNCTIONS =====
const cn = (...classes) => classes.filter(Boolean).join(' ');

const design = {
  surface: 'relative overflow-hidden rounded-3xl border border-indigo-100/40 bg-white/80 shadow-[0_18px_45px_rgba(79,70,229,0.06)] backdrop-blur-sm',
  interactive: 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(79,70,229,0.12)]',
  sectionTitle: 'text-xs font-semibold tracking-wide uppercase text-indigo-600',
  tag: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50/70 text-indigo-700 border border-indigo-200/60 backdrop-blur-sm',
  badge: 'px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow'
};

const Surface = ({ as = 'div', className = '', children, ...props }) =>
  h(as, { className: cn(design.surface, className), ...props }, children);

const truncate = (str, len = 90) => {
  if (!str) return '';
  return str.length > len ? `${str.slice(0, len).trim()}…` : str;
};

const formatPrice = (price, currency = 'USD') => {
  if (!price && price !== 0) return '—';
  return currency === 'USD' ? `$${Number(price).toFixed(0)}` : `${Number(price).toLocaleString('ru-RU')} ₴`;
};

// ===== ICONS =====
const SearchIcon = () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
);

const ChevronDownIcon = () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M19 9l-7 7-7-7' })
);

const ChevronUpIcon = () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M5 15l7-7 7 7' })
);

const ArrowRightIcon = () => h('svg', { className: 'w-4 h-4 ml-2', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M9 5l7 7-7 7' })
);

const ChipIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' })
);

const BoltIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M13 10V3L4 14h7v7l9-11h-7z' })
);

const CpuIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' })
);

const MeasureIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
);

const WrenchIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
);

const PhoneIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' })
);

const CableIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M8 4h8a2 2 0 012 2v3a2 2 0 01-2 2h-3v6l-3 3-3-3v-6H6a2 2 0 01-2-2V6a2 2 0 012-2z' }),
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M10 4V2M14 4V2' })
);

const TagIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' })
);

const getCategoryIcon = (category) => {
  const icons = {
    'iPhone': '📱', 'iPad': '📟', 'Mac': '💻', 'MacBook': '💻',
    'Apple Watch': '⌚', 'AirPods': '🎧'
  };
  return icons[category] || '🔧';
};

// ===== BENTO CARD =====
const BentoCard = ({ name, className, background, Icon, description, onClick, cta, badge }) => {
  return h('div', {
    onClick,
    className: cn(
      'group relative col-span-full sm:col-span-1 flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer',
      'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
      'transform-gpu hover:scale-[1.02] transition-all duration-300',
      className
    )
  },
    background && h('div', { className: 'absolute inset-0 opacity-50' }, background),
    badge && h('div', { className: 'absolute top-4 right-4 z-20' },
      h('span', { className: 'px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-lg' }, badge)
    ),
    h('div', { className: 'pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10' },
      h(Icon, { className: 'h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75' }),
      h('h3', { className: 'text-xl font-semibold text-neutral-700 mt-4' }, name),
      h('p', { className: 'max-w-lg text-neutral-500 text-sm' }, description)
    ),
    h('div', { className: 'pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100' },
      h('button', { className: 'pointer-events-auto flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg' },
        cta,
        h(ArrowRightIcon)
      )
    ),
    h('div', { className: 'pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03]' })
  );
};

// ===== BACKGROUNDS =====
const ChargingBackground = () => h('div', { className: 'absolute inset-0 flex items-center justify-center' },
  h('div', { className: 'relative' },
    h('div', { className: 'absolute inset-0 animate-ping opacity-20' },
      h('div', { className: 'w-32 h-32 rounded-full bg-yellow-400' })
    ),
    h('div', { className: 'w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center' },
      h('span', { className: 'text-4xl' }, '⚡')
    )
  )
);

const BoardBackground = () => h('div', { className: 'absolute inset-0 overflow-hidden' },
  h('div', { className: 'absolute inset-0 bg-gradient-to-br from-green-900/20 to-emerald-900/30' }),
  h('svg', { className: 'absolute inset-0 w-full h-full opacity-30' },
    ...Array.from({length: 10}, (_, i) => 
      h('line', { key: `h${i}`, x1: 0, y1: i * 40, x2: '100%', y2: i * 40, stroke: '#22c55e', strokeWidth: 1 })
    ),
    ...Array.from({length: 15}, (_, i) => 
      h('line', { key: `v${i}`, x1: i * 30, y1: 0, x2: i * 30, y2: '100%', stroke: '#22c55e', strokeWidth: 1 })
    )
  )
);

const MeasurementsBackground = () => h('div', { className: 'absolute inset-0 overflow-hidden' },
  h('div', { className: 'absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100' }),
  h('div', { className: 'absolute top-4 right-4 font-mono text-2xl text-blue-600 opacity-60' }, '0.385V')
);

const PartsBackground = () => h('div', { className: 'absolute inset-0 overflow-hidden' },
  h('div', { className: 'absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-100' }),
  h('div', { className: 'absolute inset-0 flex items-center justify-center gap-4 opacity-20' },
    ...['🔋', '📱', '📷'].map((emoji, i) => 
      h('span', { key: i, className: 'text-5xl', style: { transform: `rotate(${(i-1)*15}deg)` } }, emoji)
    )
  )
);

const PricingBackground = () => h('div', { className: 'absolute inset-0 overflow-hidden' },
  h('div', { className: 'absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-100' }),
  h('div', { className: 'absolute inset-0 flex items-center justify-center opacity-20' },
    h('span', { className: 'text-6xl' }, '💰')
  )
);

// ===== DEVICE CARD =====
const DeviceCard = ({ device, onSelect }) => {
  const aNumbers = (device.model || '').split(',').map(s => s.trim()).filter(Boolean);
  const boardNumbers = (device.board_numbers || []).filter(Boolean);
  const hasOfficialPrices = device.official_service_prices && Object.keys(device.official_service_prices).length > 0;
  const hasServiceParts = device.service_parts && Object.keys(device.service_parts).length > 0;
  const icon = getCategoryIcon(device.category);

  return h(Surface, {
    className: cn(design.interactive, 'cursor-pointer p-6 flex flex-col gap-4 border border-indigo-100/60'),
    onClick: () => onSelect?.(device)
  },
    h('div', { className: 'flex items-start justify-between gap-4' },
      h('div', { className: 'flex-1' },
        h('div', { className: 'flex flex-wrap gap-2 mb-2' },
          h('span', { className: cn(design.tag, 'text-xs') }, device.category || 'Устройство'),
          hasOfficialPrices && h('span', { className: 'px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700' }, '💵 Цены'),
          hasServiceParts && h('span', { className: 'px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700' }, '🔧 Артикулы')
        ),
        h('h3', { className: 'text-lg font-bold text-slate-900' }, device.name)
      ),
      h('span', { className: 'text-3xl' }, icon)
    ),
    
    aNumbers.length > 0 && h('div', { className: 'flex flex-wrap gap-1' },
      ...aNumbers.slice(0, 3).map((num, i) => h('span', { key: i, className: 'px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600' }, num)),
      aNumbers.length > 3 && h('span', { className: 'px-2 py-0.5 text-xs text-slate-400' }, `+${aNumbers.length - 3}`)
    ),
    
    boardNumbers.length > 0 && h('div', { className: 'flex flex-wrap gap-1' },
      h('span', { className: 'text-xs text-slate-400 mr-1' }, 'Board:'),
      ...boardNumbers.slice(0, 2).map((bn, i) => h('span', { key: i, className: 'px-2 py-0.5 bg-purple-100 rounded text-xs text-purple-700' }, bn))
    ),
    
    h('div', { className: 'grid grid-cols-2 gap-2 text-xs' },
      device.year && h('div', { className: 'bg-slate-50 rounded-lg p-2' },
        h('p', { className: 'text-slate-400' }, 'Год'),
        h('p', { className: 'font-semibold text-slate-700' }, device.year)
      ),
      device.processor && h('div', { className: 'bg-slate-50 rounded-lg p-2' },
        h('p', { className: 'text-slate-400' }, 'CPU'),
        h('p', { className: 'font-semibold text-slate-700' }, device.processor)
      )
    ),
    
    hasOfficialPrices && h('div', { className: 'flex flex-wrap gap-2 pt-2 border-t border-slate-100' },
      device.official_service_prices.display && h('span', { className: 'text-xs text-slate-600' }, `📱 ${formatPrice(device.official_service_prices.display)}`),
      device.official_service_prices.battery && h('span', { className: 'text-xs text-slate-600' }, `🔋 ${formatPrice(device.official_service_prices.battery)}`),
      device.official_service_prices.rear_camera && h('span', { className: 'text-xs text-slate-600' }, `📷 ${formatPrice(device.official_service_prices.rear_camera)}`)
    ),
    
    h('div', { className: 'flex items-center justify-end text-indigo-600 text-sm font-medium' },
      'Подробнее',
      h(ArrowRightIcon)
    )
  );
};

// ===== ARTICLE SEARCH PANEL =====
const ArticleSearchPanel = ({ data, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  
  if (!data) return null;
  
  const articles = data.articles || {};
  const types = ['all', 'display', 'battery', 'logic_board', 'rear', 'front'];
  
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return Object.entries(articles).filter(([article, info]) => {
      if (selectedType !== 'all' && info.type !== selectedType) return false;
      if (!term) return true;
      return article.toLowerCase().includes(term) || 
             (info.description || '').toLowerCase().includes(term);
    }).slice(0, 100);
  }, [articles, searchTerm, selectedType]);
  
  return h('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col' },
      h('div', { className: 'bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white' },
        h('div', { className: 'flex justify-between items-start' },
          h('div', null,
            h('h2', { className: 'text-2xl font-bold' }, '🔍 Поиск по артикулам'),
            h('p', { className: 'text-emerald-100 text-sm' }, `${data.total || 0} артикулов в базе`)
          ),
          h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl' }, '×')
        )
      ),
      
      h('div', { className: 'p-4 border-b bg-slate-50' },
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Введите артикул или описание...',
          className: 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none'
        }),
        h('div', { className: 'flex gap-2 mt-3 flex-wrap' },
          ...types.map(type => h('button', {
            key: type,
            onClick: () => setSelectedType(type),
            className: cn('px-3 py-1 rounded-full text-sm font-medium transition-all',
              selectedType === type ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            )
          }, type === 'all' ? 'Все' : type === 'display' ? 'Дисплеи' : type === 'battery' ? 'Батареи' : 
             type === 'logic_board' ? 'Платы' : type === 'rear' ? 'Задние камеры' : 'Фронт. камеры'))
        )
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'space-y-2' },
          filtered.length === 0 && h('p', { className: 'text-center text-slate-500 py-8' }, 'Ничего не найдено'),
          ...filtered.map(([article, info]) => 
            h('div', { key: article, className: 'p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors' },
              h('div', { className: 'flex justify-between items-start gap-4' },
                h('div', { className: 'flex-1' },
                  h('p', { className: 'font-mono font-bold text-emerald-600' }, article),
                  h('p', { className: 'text-sm text-slate-700 mt-1' }, info.description || 'Нет описания'),
                  h('span', { className: 'inline-block mt-2 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-500' }, info.type || 'unknown')
                ),
                info.price_usd && h('div', { className: 'text-right' },
                  h('p', { className: 'text-lg font-bold text-emerald-600' }, formatPrice(info.price_usd)),
                  h('p', { className: 'text-xs text-slate-400' }, 'AASP UA')
                )
              )
            )
          )
        )
      )
    )
  );
};

// ===== LOGIC BOARDS PANEL =====
const LogicBoardsPanel = ({ data, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMSeries, setShowMSeries] = useState(true);
  
  if (!data) return null;
  
  const mSeries = data.m_series || [];
  const intel = data.intel || [];
  const boards = showMSeries ? mSeries : intel;
  
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return boards.filter(board => {
      if (!term) return true;
      return board.article?.toLowerCase().includes(term) ||
             board.description?.toLowerCase().includes(term) ||
             board.chip?.toLowerCase().includes(term);
    }).slice(0, 50);
  }, [boards, searchTerm]);
  
  return h('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col' },
      h('div', { className: 'bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white' },
        h('div', { className: 'flex justify-between items-start' },
          h('div', null,
            h('h2', { className: 'text-2xl font-bold' }, '🖥️ Logic Boards Database'),
            h('p', { className: 'text-purple-100 text-sm' }, `${data.m_series_count || 0} M-серии • ${data.intel_count || 0} Intel`)
          ),
          h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl' }, '×')
        )
      ),
      
      h('div', { className: 'p-4 border-b bg-slate-50' },
        h('div', { className: 'flex gap-3 mb-3' },
          h('button', {
            onClick: () => setShowMSeries(true),
            className: cn('px-4 py-2 rounded-xl font-medium transition-all',
              showMSeries ? 'bg-purple-500 text-white shadow-lg' : 'bg-white text-slate-600')
          }, `Apple Silicon (${data.m_series_count || 0})`),
          h('button', {
            onClick: () => setShowMSeries(false),
            className: cn('px-4 py-2 rounded-xl font-medium transition-all',
              !showMSeries ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-slate-600')
          }, `Intel (${data.intel_count || 0})`)
        ),
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Поиск по артикулу, чипу или описанию...',
          className: 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none'
        })
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
          ...filtered.map((board, i) => 
            h('div', { key: i, className: 'p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-300 transition-colors' },
              h('div', { className: 'flex justify-between items-start mb-2' },
                h('span', { className: 'font-mono font-bold text-purple-600' }, board.article),
                h('span', { className: 'text-lg font-bold text-green-600' }, formatPrice(board.price_usd))
              ),
              showMSeries ? h('div', { className: 'space-y-1' },
                board.chip && h('div', { className: 'flex gap-2' },
                  h('span', { className: 'px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold' }, board.chip),
                  board.cpu_cores && h('span', { className: 'px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs' }, `${board.cpu_cores}CPU`),
                  board.gpu_cores && h('span', { className: 'px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs' }, `${board.gpu_cores}GPU`)
                ),
                board.ram_gb && h('p', { className: 'text-xs text-slate-500' }, `RAM: ${board.ram_gb}GB`)
              ) : h('div', { className: 'space-y-1' },
                board.cpu_ghz && h('span', { className: 'px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs' }, `${board.cpu_ghz}GHz`),
                board.ram_gb && h('span', { className: 'px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs ml-1' }, `${board.ram_gb}GB`)
              ),
              h('p', { className: 'text-xs text-slate-500 mt-2 line-clamp-2' }, board.description)
            )
          )
        )
      )
    )
  );
};

// ===== OFFICIAL PRICES PANEL =====
const OfficialPricesPanel = ({ data, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!data) return null;
  
  const prices = data.prices || {};
  
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return Object.entries(prices).filter(([model]) => {
      if (!term) return true;
      return model.toLowerCase().includes(term);
    });
  }, [prices, searchTerm]);
  
  return h('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col' },
      h('div', { className: 'bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white' },
        h('div', { className: 'flex justify-between items-start' },
          h('div', null,
            h('h2', { className: 'text-2xl font-bold' }, '💰 Официальные цены Apple'),
            h('p', { className: 'text-amber-100 text-sm' }, `Источник: ${data.source || 'AASP Ukraine'} • Курс: 1 USD = ${data.rate_usd || 41.5} UAH`)
          ),
          h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl' }, '×')
        )
      ),
      
      h('div', { className: 'p-4 border-b bg-slate-50' },
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Поиск по модели...',
          className: 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none'
        })
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', { className: 'bg-slate-100 sticky top-0' },
            h('tr', null,
              h('th', { className: 'text-left p-4 font-semibold' }, 'Модель'),
              h('th', { className: 'text-center p-4 font-semibold' }, '🔋 Батарея'),
              h('th', { className: 'text-center p-4 font-semibold' }, '📱 Дисплей'),
              h('th', { className: 'text-center p-4 font-semibold' }, '📷 Камера'),
              h('th', { className: 'text-center p-4 font-semibold' }, '🔐 Face ID')
            )
          ),
          h('tbody', null,
            ...filtered.map(([model, info]) => 
              h('tr', { key: model, className: 'border-b hover:bg-amber-50' },
                h('td', { className: 'p-4 font-medium' }, model),
                h('td', { className: 'p-4 text-center' }, info.battery?.price_usd ? formatPrice(info.battery.price_usd) : '—'),
                h('td', { className: 'p-4 text-center' }, info.display?.price_usd ? formatPrice(info.display.price_usd) : '—'),
                h('td', { className: 'p-4 text-center' }, info.rear_camera?.price_usd ? formatPrice(info.rear_camera.price_usd) : '—'),
                h('td', { className: 'p-4 text-center' }, info.face_id?.price_usd ? formatPrice(info.face_id.price_usd) : '—')
              )
            )
          )
        )
      )
    )
  );
};

// ===== MEASUREMENTS PANEL (SIMPLIFIED) =====
const MeasurementsPanel = ({ data, onClose }) => {
  const [activeSection, setActiveSection] = useState('power_rails');
  const [expandedRail, setExpandedRail] = useState(null);

  if (!data) return null;

  const sections = [
    { key: 'power_rails', name: '⚡ Шины питания' },
    { key: 'boot_sequence', name: '🔄 Boot Sequence' },
    { key: 'fault_signatures', name: '🔍 Диагностика' }
  ];

  const renderPowerRails = () => {
    const rails = data.power_rails?.rails;
    if (!rails) return h('p', { className: 'text-slate-500' }, 'Нет данных');

    return h('div', { className: 'space-y-3' },
      Object.entries(rails).map(([key, rail]) =>
        h('div', { key, className: 'bg-white rounded-xl border border-slate-200 overflow-hidden' },
          h('div', {
            className: 'p-4 cursor-pointer flex justify-between items-center hover:bg-slate-50',
            onClick: () => setExpandedRail(expandedRail === key ? null : key)
          },
            h('div', { className: 'flex items-center gap-3' },
              h('span', { className: 'text-2xl' }, '⚡'),
              h('div', null,
                h('p', { className: 'font-bold text-slate-800' }, key),
                h('p', { className: 'text-sm text-slate-500' }, rail.name)
              )
            ),
            h('div', { className: 'flex items-center gap-4' },
              h('span', { className: 'font-mono text-indigo-600 font-bold' }, rail.voltage),
              expandedRail === key ? h(ChevronUpIcon) : h(ChevronDownIcon)
            )
          ),
          expandedRail === key && h('div', { className: 'p-4 bg-slate-50 border-t space-y-3' },
            h('p', { className: 'text-sm text-slate-600' }, rail.description),
            h('div', { className: 'grid grid-cols-2 gap-3' },
              h('div', { className: 'p-3 bg-green-50 rounded-lg' },
                h('p', { className: 'text-xs text-green-600 font-semibold' }, 'Норма'),
                h('p', { className: 'font-mono text-green-700' }, rail.diode_mode_normal)
              ),
              h('div', { className: 'p-3 bg-red-50 rounded-lg' },
                h('p', { className: 'text-xs text-red-600 font-semibold' }, 'КЗ если <'),
                h('p', { className: 'font-mono text-red-700' }, rail.short_threshold)
              )
            ),
            rail.check_points && h('div', { className: 'flex flex-wrap gap-2' },
              h('span', { className: 'text-xs text-slate-500' }, 'Точки:'),
              ...rail.check_points.map((p, i) => h('span', { key: i, className: 'px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs' }, p))
            )
          )
        )
      )
    );
  };

  const renderBootSequence = () => {
    const boot = data.boot_sequence;
    if (!boot) return h('p', { className: 'text-slate-500' }, 'Нет данных');

    return h('div', { className: 'space-y-4' },
      h('div', { className: 'bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl text-white' },
        h('h4', { className: 'font-bold text-lg mb-4' }, '🔄 Последовательность загрузки'),
        h('div', { className: 'space-y-2' },
          ...boot.steps.map((step, i) =>
            h('div', { key: i, className: 'flex items-center gap-3 bg-white/10 p-3 rounded-xl' },
              h('span', { className: 'w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-sm' }, step.step),
              h('div', { className: 'flex-1' },
                h('p', { className: 'font-semibold text-sm' }, step.name),
                h('p', { className: 'text-xs text-blue-100' }, step.description)
              ),
              h('span', { className: 'font-mono text-green-300 text-sm' }, step.current_draw)
            )
          )
        )
      )
    );
  };

  const renderFaultSignatures = () => {
    const faults = data.common_fault_signatures;
    if (!faults) return h('p', { className: 'text-slate-500' }, 'Нет данных');

    const faultColors = {
      no_power: 'from-gray-600 to-gray-800',
      no_charge: 'from-green-500 to-emerald-600',
      no_image: 'from-blue-500 to-cyan-600',
      no_touch: 'from-purple-500 to-pink-600',
      no_service: 'from-orange-500 to-red-500',
      audio_disease: 'from-indigo-500 to-purple-600'
    };

    return h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
      ...Object.entries(faults).map(([key, fault]) =>
        h('div', {
          key,
          className: 'rounded-xl overflow-hidden cursor-pointer',
          onClick: () => setExpandedRail(expandedRail === key ? null : key)
        },
          h('div', { className: `bg-gradient-to-r ${faultColors[key] || 'from-slate-500 to-slate-700'} p-4 text-white` },
            h('p', { className: 'font-bold' }, fault.symptom),
            h('p', { className: 'text-xs opacity-80' }, `${fault.checklist?.length || 0} шагов`)
          ),
          expandedRail === key && h('div', { className: 'p-4 bg-white border border-t-0 rounded-b-xl' },
            h('ol', { className: 'space-y-1 text-sm' },
              ...fault.checklist.map((step, i) =>
                h('li', { key: i, className: 'flex items-start gap-2' },
                  h('span', { className: 'w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0' }, i + 1),
                  h('span', { className: 'text-slate-700' }, step)
                )
              )
            )
          )
        )
      )
    );
  };

  return h('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col' },
      h('div', { className: 'bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white flex justify-between items-start' },
        h('div', null,
          h('h2', { className: 'text-2xl font-bold' }, '📏 Замеры и диагностика'),
          h('p', { className: 'text-blue-100 text-sm' }, 'Справочник для ремонта iPhone')
        ),
        h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl' }, '×')
      ),
      h('div', { className: 'p-4 border-b flex gap-2 overflow-x-auto' },
        ...sections.map(s => h('button', {
          key: s.key,
          onClick: () => { setActiveSection(s.key); setExpandedRail(null); },
          className: cn('px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
            activeSection === s.key ? 'bg-blue-500 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
        }, s.name))
      ),
      h('div', { className: 'flex-1 overflow-y-auto p-6' },
        activeSection === 'power_rails' && renderPowerRails(),
        activeSection === 'boot_sequence' && renderBootSequence(),
        activeSection === 'fault_signatures' && renderFaultSignatures()
      )
    )
  );
};

// ===== DEVICE DETAILS VIEW =====
const DeviceDetailsView = ({ device, icData, measurementsData, onBack }) => {
  const [showMeasurements, setShowMeasurements] = useState(false);

  const officialPrices = device.official_service_prices || {};
  const serviceParts = device.service_parts || {};
  const hasOfficialPrices = Object.keys(officialPrices).length > 0;
  const hasServiceParts = Object.keys(serviceParts).length > 0;

  return h('div', { className: 'space-y-6 pb-10' },
    // Header
    h('div', { className: 'flex items-start gap-4' },
      h('button', { onClick: onBack, className: 'w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow flex-shrink-0' }, '←'),
      h('div', { className: 'flex-1' },
        h('h1', { className: 'text-2xl md:text-3xl font-bold text-gray-800' }, device.name),
        h('p', { className: 'text-sm text-gray-500 mt-1' }, device.model)
      )
    ),

    // Tags
    h('div', { className: 'flex flex-wrap gap-2' },
      device.year && h('span', { className: 'px-3 py-1.5 bg-white rounded-xl shadow text-sm' }, `📅 ${device.year}`),
      device.category && h('span', { className: 'px-3 py-1.5 bg-white rounded-xl shadow text-sm' }, `${getCategoryIcon(device.category)} ${device.category}`),
      device.processor && h('span', { className: 'px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow text-sm' }, `CPU ${device.processor}`),
      ...(device.board_numbers || []).map((bn, i) => h('span', { key: i, className: 'px-3 py-1.5 bg-purple-100 text-purple-700 rounded-xl text-sm' }, `Board ${bn}`))
    ),

    // Quick actions
    h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
      h('button', {
        onClick: () => setShowMeasurements(true),
        className: 'p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white text-left hover:shadow-xl transition-all'
      },
        h('span', { className: 'text-3xl mb-2 block' }, '📏'),
        h('p', { className: 'font-bold text-lg' }, 'Диагностика'),
        h('p', { className: 'text-indigo-100 text-sm' }, 'Замеры, шины, Boot Sequence')
      ),
      device.documentation_links?.ifixit && h('a', {
        href: device.documentation_links.ifixit,
        target: '_blank',
        className: 'p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white text-left hover:shadow-xl transition-all'
      },
        h('span', { className: 'text-3xl mb-2 block' }, '📚'),
        h('p', { className: 'font-bold text-lg' }, 'iFixit Guide'),
        h('p', { className: 'text-green-100 text-sm' }, 'Руководства по разборке')
      )
    ),

    // Official prices
    hasOfficialPrices && h('div', { className: 'bg-white rounded-2xl shadow-lg p-6' },
      h('h2', { className: 'text-lg font-bold text-gray-800 mb-4 flex items-center gap-2' },
        '💰', 'Официальные цены Apple (AASP Ukraine)'
      ),
      h('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
        officialPrices.battery && h('div', { className: 'p-4 bg-green-50 rounded-xl text-center' },
          h('p', { className: 'text-2xl mb-1' }, '🔋'),
          h('p', { className: 'text-xs text-slate-500' }, 'Батарея'),
          h('p', { className: 'text-xl font-bold text-green-600' }, formatPrice(officialPrices.battery))
        ),
        officialPrices.display && h('div', { className: 'p-4 bg-blue-50 rounded-xl text-center' },
          h('p', { className: 'text-2xl mb-1' }, '📱'),
          h('p', { className: 'text-xs text-slate-500' }, 'Дисплей'),
          h('p', { className: 'text-xl font-bold text-blue-600' }, formatPrice(officialPrices.display))
        ),
        officialPrices.rear_camera && h('div', { className: 'p-4 bg-purple-50 rounded-xl text-center' },
          h('p', { className: 'text-2xl mb-1' }, '📷'),
          h('p', { className: 'text-xs text-slate-500' }, 'Камера'),
          h('p', { className: 'text-xl font-bold text-purple-600' }, formatPrice(officialPrices.rear_camera))
        ),
        officialPrices.face_id && h('div', { className: 'p-4 bg-orange-50 rounded-xl text-center' },
          h('p', { className: 'text-2xl mb-1' }, '🔐'),
          h('p', { className: 'text-xs text-slate-500' }, 'Face ID'),
          h('p', { className: 'text-xl font-bold text-orange-600' }, formatPrice(officialPrices.face_id))
        )
      )
    ),

    // Service parts
    hasServiceParts && h('div', { className: 'bg-white rounded-2xl shadow-lg p-6' },
      h('h2', { className: 'text-lg font-bold text-gray-800 mb-4 flex items-center gap-2' },
        '🔧', 'Артикулы запчастей'
      ),
      h('div', { className: 'space-y-4' },
        ...Object.entries(serviceParts).map(([partType, parts]) =>
          h('div', { key: partType },
            h('h3', { className: 'text-sm font-semibold text-slate-600 mb-2 capitalize' }, 
              partType === 'display' ? '📱 Дисплеи' :
              partType === 'battery' ? '🔋 Батареи' :
              partType === 'rear_camera' ? '📷 Задние камеры' :
              partType === 'front_camera' ? '🤳 Фронтальные камеры' :
              partType === 'sim_tray' ? '📱 SIM tray' : `🔧 ${partType}`
            ),
            h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-2' },
              ...parts.slice(0, 4).map((part, i) =>
                h('div', { key: i, className: 'p-3 bg-slate-50 rounded-lg flex justify-between items-center' },
                  h('div', null,
                    h('p', { className: 'font-mono text-sm text-indigo-600' }, part.article),
                    h('p', { className: 'text-xs text-slate-500 line-clamp-1' }, part.description)
                  ),
                  h('span', { className: 'font-bold text-green-600' }, formatPrice(part.price_usd))
                )
              )
            )
          )
        )
      )
    ),

    // Charging IC
    device.charging_ic && h('div', { className: 'bg-white rounded-2xl shadow-lg p-6' },
      h('h2', { className: 'text-lg font-bold text-gray-800 mb-4' }, '⚡ Charging IC'),
      h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        h('div', { className: 'p-4 bg-yellow-50 rounded-xl' },
          h('p', { className: 'text-xs text-yellow-600 font-semibold mb-1' }, 'Микросхема'),
          h('p', { className: 'font-bold text-slate-800' }, device.charging_ic.main || 'N/A')
        ),
        device.charging_ic.voltage && h('div', { className: 'p-4 bg-blue-50 rounded-xl' },
          h('p', { className: 'text-xs text-blue-600 font-semibold mb-1' }, 'Напряжение'),
          h('p', { className: 'font-bold text-slate-800' }, device.charging_ic.voltage)
        ),
        device.charging_ic.location && h('div', { className: 'p-4 bg-slate-50 rounded-xl col-span-full' },
          h('p', { className: 'text-xs text-slate-500 font-semibold mb-1' }, 'Расположение'),
          h('p', { className: 'text-sm text-slate-700' }, device.charging_ic.location)
        ),
        device.charging_ic.aliexpress && h('a', {
          href: device.charging_ic.aliexpress,
          target: '_blank',
          className: 'p-3 bg-orange-500 text-white rounded-xl text-center font-semibold hover:bg-orange-600'
        }, '🛒 Купить на AliExpress')
      )
    ),

    // Common issues
    device.common_issues?.length > 0 && h('div', { className: 'bg-white rounded-2xl shadow-lg p-6' },
      h('h2', { className: 'text-lg font-bold text-gray-800 mb-4' }, '⚠️ Типовые неисправности'),
      h('ul', { className: 'space-y-2' },
        ...device.common_issues.map((issue, i) =>
          h('li', { key: i, className: 'flex items-start gap-2 text-sm text-slate-700' },
            h('span', { className: 'text-red-500' }, '•'),
            issue
          )
        )
      )
    ),

    // Tools & Difficulty
    h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
      device.repair_difficulty && h('div', { className: 'bg-white rounded-2xl shadow-lg p-6 text-center' },
        h('p', { className: 'text-sm text-slate-500 mb-1' }, 'Сложность'),
        h('p', { className: cn('text-2xl font-bold',
          device.repair_difficulty.includes('Экстремально') ? 'text-red-600' :
          device.repair_difficulty.includes('Сложная') ? 'text-orange-600' :
          device.repair_difficulty.includes('Средняя') ? 'text-yellow-600' : 'text-green-600'
        ) }, device.repair_difficulty)
      ),
      device.repair_time && h('div', { className: 'bg-white rounded-2xl shadow-lg p-6 text-center' },
        h('p', { className: 'text-sm text-slate-500 mb-1' }, 'Время ремонта'),
        h('p', { className: 'text-2xl font-bold text-blue-600' }, device.repair_time)
      )
    ),

    device.tools_needed?.length > 0 && h('div', { className: 'bg-white rounded-2xl shadow-lg p-6' },
      h('h2', { className: 'text-lg font-bold text-gray-800 mb-4' }, '🔧 Инструменты'),
      h('div', { className: 'flex flex-wrap gap-2' },
        ...device.tools_needed.map((tool, i) =>
          h('span', { key: i, className: 'px-3 py-1.5 bg-slate-100 rounded-lg text-sm text-slate-700' }, tool)
        )
      )
    ),

    // Modals
    showMeasurements && h(MeasurementsPanel, { data: measurementsData, onClose: () => setShowMeasurements(false) })
  );
};

// ===== MAIN APP =====
const RepairTool = () => {
  const [devices, setDevices] = useState([]);
  const [icData, setIcData] = useState(null);
  const [measurementsData, setMeasurementsData] = useState(null);
  const [logicBoardsData, setLogicBoardsData] = useState(null);
  const [articleSearchData, setArticleSearchData] = useState(null);
  const [officialPricesData, setOfficialPricesData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showArticleSearch, setShowArticleSearch] = useState(false);
  const [showLogicBoards, setShowLogicBoards] = useState(false);
  const [showOfficialPrices, setShowOfficialPrices] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/devices.json').then(r => r.json()),
      fetch('/data/ic_compatibility.json').then(r => r.json()).catch(() => null),
      fetch('/data/measurements.json').then(r => r.json()).catch(() => null),
      fetch('/data/logic_boards_comprehensive.json').then(r => r.json()).catch(() => null),
      fetch('/data/article_search_index.json').then(r => r.json()).catch(() => null),
      fetch('/data/official_service_prices.json').then(r => r.json()).catch(() => null)
    ])
    .then(([devicesData, icCompatData, measData, logicData, articleData, pricesData]) => {
      setDevices(devicesData || []);
      setIcData(icCompatData);
      setMeasurementsData(measData);
      setLogicBoardsData(logicData);
      setArticleSearchData(articleData);
      setOfficialPricesData(pricesData);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error:', err);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(devices.map(d => d.category).filter(Boolean));
    return ['all', ...Array.from(cats).sort()];
  }, [devices]);

  const filteredDevices = useMemo(() => {
    let result = devices;
    if (selectedCategory !== 'all') {
      result = result.filter(d => d.category === selectedCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(d =>
        (d.name || '').toLowerCase().includes(term) ||
        (d.model || '').toLowerCase().includes(term) ||
        (d.board_numbers || []).some(bn => bn.toLowerCase().includes(term))
      );
    }
    return result;
  }, [devices, searchTerm, selectedCategory]);

  const stats = useMemo(() => ({
    total: devices.length,
    withPrices: devices.filter(d => d.official_service_prices && Object.keys(d.official_service_prices).length > 0).length,
    withParts: devices.filter(d => d.service_parts && Object.keys(d.service_parts).length > 0).length
  }), [devices]);

  if (loading) {
    return h('div', { className: 'min-h-screen bg-gray-100 flex items-center justify-center' },
      h('div', { className: 'text-center' },
        h('div', { className: 'w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4' }),
        h('p', { className: 'text-gray-600' }, 'Загрузка базы данных...')
      )
    );
  }

  if (selectedDevice) {
    return h('div', { className: 'min-h-screen bg-gray-100 p-4 md:p-6' },
      h('div', { className: 'max-w-4xl mx-auto' },
        h(DeviceDetailsView, {
          device: selectedDevice,
          icData,
          measurementsData,
          onBack: () => setSelectedDevice(null)
        })
      )
    );
  }

  return h('div', { className: 'min-h-screen bg-gray-100' },
    // Hero
    h('div', { className: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white py-12 px-4' },
      h('div', { className: 'max-w-6xl mx-auto text-center space-y-4' },
        h('h1', { className: 'text-3xl md:text-4xl lg:text-5xl font-bold' }, '🛠️ Apple Intake Desk'),
        h('p', { className: 'text-lg text-indigo-100 max-w-2xl mx-auto' }, 'База данных для приёмки и ремонта устройств Apple'),
        h('div', { className: 'flex flex-wrap gap-3 justify-center text-sm' },
          h('span', { className: 'px-4 py-2 rounded-full bg-white/15 border border-white/30' }, `${stats.total} устройств`),
          h('span', { className: 'px-4 py-2 rounded-full bg-green-500/30 border border-green-400/50' }, `💰 ${stats.withPrices} с ценами`),
          h('span', { className: 'px-4 py-2 rounded-full bg-blue-500/30 border border-blue-400/50' }, `🔧 ${stats.withParts} с артикулами`)
        )
      )
    ),

    // Main content
    h('div', { className: 'max-w-6xl mx-auto px-4 -mt-6 pb-16' },
      // Search
      h(Surface, { className: 'mb-6 p-2' },
        h('div', { className: 'relative' },
          h('input', {
            type: 'text',
            placeholder: 'Поиск по модели, имени или номеру платы...',
            value: searchTerm,
            onChange: e => setSearchTerm(e.target.value),
            className: 'w-full px-6 py-4 pl-14 rounded-2xl border-0 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-lg'
          }),
          h('div', { className: 'absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400' }, h(SearchIcon))
        )
      ),

      // Category filter
      h('div', { className: 'flex gap-2 mb-6 overflow-x-auto pb-2' },
        ...categories.map(cat => h('button', {
          key: cat,
          onClick: () => setSelectedCategory(cat),
          className: cn('px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all',
            selectedCategory === cat ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100')
        }, cat === 'all' ? 'Все устройства' : cat))
      ),

      // Quick access cards
      h('div', { className: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8' },
        h(BentoCard, {
          name: 'Диагностика',
          description: 'Шины питания, Boot Sequence, чек-листы',
          Icon: MeasureIcon,
          background: h(MeasurementsBackground),
          onClick: () => setShowMeasurements(true),
          cta: 'Открыть',
          badge: '📏'
        }),
        h(BentoCard, {
          name: 'Поиск артикулов',
          description: `${articleSearchData?.total || 1170} запчастей в базе`,
          Icon: TagIcon,
          background: h(PartsBackground),
          onClick: () => setShowArticleSearch(true),
          cta: 'Искать',
          badge: '🔍'
        }),
        h(BentoCard, {
          name: 'Logic Boards',
          description: 'M-серия и Intel платы с ценами',
          Icon: CpuIcon,
          background: h(BoardBackground),
          onClick: () => setShowLogicBoards(true),
          cta: 'Открыть',
          badge: '🖥️'
        }),
        h(BentoCard, {
          name: 'Офиц. цены',
          description: 'Батареи, дисплеи, камеры от Apple',
          Icon: WrenchIcon,
          background: h(PricingBackground),
          onClick: () => setShowOfficialPrices(true),
          cta: 'Смотреть',
          badge: '💰'
        })
      ),

      // Results count
      h('p', { className: 'text-slate-500 mb-4' }, `Найдено: ${filteredDevices.length} устройств`),

      // Device grid
      h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4' },
        ...filteredDevices.map(device =>
          h(DeviceCard, { key: device.id, device, onSelect: setSelectedDevice })
        )
      )
    ),

    // Modals
    showMeasurements && h(MeasurementsPanel, { data: measurementsData, onClose: () => setShowMeasurements(false) }),
    showArticleSearch && h(ArticleSearchPanel, { data: articleSearchData, onClose: () => setShowArticleSearch(false) }),
    showLogicBoards && h(LogicBoardsPanel, { data: logicBoardsData, onClose: () => setShowLogicBoards(false) }),
    showOfficialPrices && h(OfficialPricesPanel, { data: officialPricesData, onClose: () => setShowOfficialPrices(false) })
  );
};

// Mount
ReactDOM.createRoot(document.getElementById('app')).render(h(RepairTool));
