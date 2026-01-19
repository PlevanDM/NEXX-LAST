// Apple Intake Desk - Main Application v2.3
// Bento Grid UI + визуализация + замеры + доноры
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

const getCategoryMeta = (category = '') => {
  const map = {
    iPhone: {
      icon: '📱',
      gradient: 'from-indigo-50/90 via-purple-50/60 to-white',
      accent: 'text-indigo-600',
      badge: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
      ring: 'ring-indigo-200/60'
    },
    iPad: {
      icon: '📟',
      gradient: 'from-purple-50/90 via-indigo-50/60 to-white',
      accent: 'text-purple-600',
      badge: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
      ring: 'ring-purple-200/60'
    },
    MacBook: {
      icon: '💻',
      gradient: 'from-indigo-50/90 via-blue-50/60 to-white',
      accent: 'text-indigo-600',
      badge: 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white',
      ring: 'ring-indigo-200/60'
    },
    Mac: {
      icon: '🖥️',
      gradient: 'from-indigo-50/90 via-purple-50/60 to-white',
      accent: 'text-indigo-600',
      badge: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
      ring: 'ring-indigo-200/60'
    },
    'Apple Watch': {
      icon: '⌚',
      gradient: 'from-purple-50/90 via-indigo-50/60 to-white',
      accent: 'text-purple-600',
      badge: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
      ring: 'ring-purple-200/60'
    },
    default: {
      icon: '🔧',
      gradient: 'from-slate-50/90 via-slate-100/60 to-white',
      accent: 'text-slate-600',
      badge: 'bg-slate-500 text-white',
      ring: 'ring-slate-200/60'
    }
  };
  return map[category] || map.default;
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

const ClipboardIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2' }),
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 3h6a2 2 0 012 2v0a2 2 0 01-2 2H9a2 2 0 01-2-2v0a2 2 0 012-2z' }),
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 12h6M9 16h4' })
);

const getCategoryIcon = (category) => {
  switch (category) {
    case 'iPhone':
      return '📱';
    case 'iPad':
      return '📟';
    case 'Mac':
    case 'MacBook':
      return '💻';
    case 'Apple Watch':
      return '⌚';
    case 'AirPods':
      return '🎧';
    default:
      return '🔧';
  }
};

const truncateText = (text, maxLength = 160) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
};

const formatCurrency = (value) => {
  if (value == null || Number.isNaN(value)) return '—';
  return `${Number(value).toLocaleString('ru-RU')} у.е.`;
};

const formatPriceRange = (prices = []) => {
  if (!Array.isArray(prices) || prices.length === 0) return '—';
  const unique = Array.from(new Set(prices.map((v) => Number(v).toFixed(2)))).map(parseFloat);
  if (unique.length === 1) {
    return formatCurrency(unique[0]);
  }
  return unique
    .sort((a, b) => a - b)
    .map((val) => formatCurrency(val))
    .join(' / ');
};

// ===== BENTO GRID COMPONENTS =====
const BentoGrid = ({ children, className }) => {
  return h('div', {
    className: cn(
      'grid w-full auto-rows-[minmax(18rem,auto)] gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
      className
    )
  }, children);
};

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
    // Background
    background && h('div', { className: 'absolute inset-0 opacity-50' }, background),
    
    // Badge
    badge && h('div', { className: 'absolute top-4 right-4 z-20' },
      h('span', { className: 'px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-lg' }, badge)
    ),
    
    // Content
    h('div', { className: 'pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10' },
      h(Icon, { className: 'h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75' }),
      h('h3', { className: 'text-xl font-semibold text-neutral-700 mt-4' }, name),
      h('p', { className: 'max-w-lg text-neutral-500 text-sm' }, description)
    ),
    
    // CTA Button
    h('div', {
      className: cn(
        'pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'
      )
    },
      h('button', { className: 'pointer-events-auto flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg' },
        cta,
        h(ArrowRightIcon)
      )
    ),
    
    // Hover overlay
    h('div', { className: 'pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03]' })
  );
};

// ===== ANIMATED BACKGROUNDS FOR BENTO CARDS =====
const ChargingBackground = () => h('div', { className: 'absolute inset-0 flex items-center justify-center' },
  h('div', { className: 'relative' },
    // Animated circles
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
  // PCB pattern
  h('svg', { className: 'absolute inset-0 w-full h-full opacity-30' },
    ...Array.from({length: 10}, (_, i) => 
      h('line', { key: `h${i}`, x1: 0, y1: i * 40, x2: '100%', y2: i * 40, stroke: '#22c55e', strokeWidth: 1 })
    ),
    ...Array.from({length: 15}, (_, i) => 
      h('line', { key: `v${i}`, x1: i * 30, y1: 0, x2: i * 30, y2: '100%', stroke: '#22c55e', strokeWidth: 1 })
    ),
    // Connection points
    ...Array.from({length: 20}, (_, i) => 
      h('circle', { key: `c${i}`, cx: Math.random() * 400, cy: Math.random() * 300, r: 3, fill: '#4ade80' })
    )
  )
);

const MeasurementsBackground = () => h('div', { className: 'absolute inset-0 overflow-hidden' },
  h('div', { className: 'absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100' }),
  // Sine wave animation
  h('svg', { className: 'absolute bottom-0 w-full h-24 opacity-50', viewBox: '0 0 400 100', preserveAspectRatio: 'none' },
    h('path', { 
      d: 'M0,50 Q50,10 100,50 T200,50 T300,50 T400,50', 
      fill: 'none', 
      stroke: '#3b82f6', 
      strokeWidth: 2,
      className: 'animate-pulse'
    }),
    h('path', { 
      d: 'M0,60 Q50,20 100,60 T200,60 T300,60 T400,60', 
      fill: 'none', 
      stroke: '#6366f1', 
      strokeWidth: 2,
      className: 'animate-pulse',
      style: { animationDelay: '0.5s' }
    })
  ),
  // Digital display
  h('div', { className: 'absolute top-4 right-4 font-mono text-2xl text-blue-600 opacity-60' }, '0.385V')
);

const DonorBackground = () => h('div', { className: 'absolute inset-0 overflow-hidden' },
  h('div', { className: 'absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-100' }),
  // Phone silhouettes
  h('div', { className: 'absolute inset-0 flex items-center justify-center gap-4 opacity-20' },
    ...Array.from({length: 3}, (_, i) => 
      h('div', { 
        key: i, 
        className: 'w-16 h-28 rounded-xl border-2 border-purple-400 bg-purple-200/50',
        style: { transform: `rotate(${(i - 1) * 10}deg)` }
      })
    )
  )
);

const PricingBackground = () => h('div', { className: 'absolute inset-0 overflow-hidden' },
  h('div', { className: 'absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-100' }),
  h('div', { className: 'absolute inset-0 flex items-center justify-center gap-6 opacity-20' },
    ...Array.from({ length: 4 }, (_, i) =>
      h('div', {
        key: i,
        className: 'w-20 h-20 rounded-full border-2 border-amber-400 bg-white/60 flex items-center justify-center',
        style: { transform: `rotate(${i * 12}deg)` }
      },
        h('span', { className: 'text-2xl text-amber-500' }, i % 2 === 0 ? '₽' : '💱')
      )
    )
  )
);

const AppDeviceCard = ({ device, onSelect }) => {
  const aNumbers = (device.model || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const boardNumbers = (device.board_numbers || []).filter(Boolean);
  const donors = (device.donors || []).filter(Boolean);
  const infoItems = [
    { label: 'Год выпуска', value: device.year },
    { label: 'Процессор', value: device.processor },
    { label: 'Сложность', value: device.repair_difficulty },
    { label: 'Время ремонта', value: device.repair_time }
  ].filter((item) => item.value);
  const note = truncateText(device.intake_focus || device.repair_notes, 140);
  const icon = getCategoryIcon(device.category);

  return h(Surface, {
    className: cn(
      design.interactive,
      'cursor-pointer p-6 flex flex-col gap-5 overflow-hidden bg-gradient-to-br from-white via-indigo-50/20 to-white border border-indigo-100/60'
    ),
    onClick: () => onSelect?.(device)
  },
    h('div', { className: 'absolute inset-0 bg-gradient-to-br from-indigo-100/10 via-white to-purple-100/10 pointer-events-none' }),
    h('div', { className: 'absolute -right-12 -top-12 w-36 h-36 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none' }),
    h('div', { className: 'relative flex flex-col gap-4' },
      h('div', { className: 'flex items-start justify-between gap-4' },
        h('div', { className: 'space-y-2' },
          device.priority_intake && h('span', { className: cn(design.badge, 'shadow-lg shadow-purple-500/30') }, device.priority_intake),
          h('span', { className: cn(design.tag, 'bg-indigo-50/80 text-indigo-700 uppercase tracking-wide') }, device.category || 'Устройство'),
          h('h3', { className: 'text-xl font-bold text-slate-900' }, device.name)
        ),
        h('span', { className: 'text-4xl text-indigo-500/80' }, icon)
      ),
      aNumbers.length > 0 && h('div', { className: 'flex flex-wrap gap-2' },
        ...aNumbers.map((num, idx) =>
          h('span', { key: `a-${idx}`, className: cn(design.tag) }, num)
        )
      ),
      boardNumbers.length > 0 && h('div', { className: 'flex flex-wrap items-center gap-2 text-xs text-slate-500' },
        h('span', { className: 'text-xs font-semibold text-slate-400 tracking-wide' }, 'Платы:'),
        ...boardNumbers.map((board, idx) =>
          h('span', { key: `b-${idx}`, className: cn(design.tag, 'bg-purple-50/70 text-purple-700 border-purple-200/60') }, board)
        )
      ),
      infoItems.length > 0 && h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600' },
        ...infoItems.map((item, idx) =>
          h('div', {
            key: `info-${idx}`,
            className: 'rounded-2xl bg-white/80 border border-white/70 p-3 shadow-sm'
          },
            h('p', { className: cn(design.sectionTitle, 'text-slate-400') }, item.label),
            h('p', { className: 'text-slate-800 font-semibold mt-1' }, item.value)
          )
        )
      ),
      note && h('p', { className: 'text-sm text-slate-600 bg-white/70 border border-white/80 rounded-2xl p-3 leading-relaxed' }, note),
      h('div', { className: 'flex items-center justify-between text-xs text-slate-500' },
        donors.length > 0
          ? h('span', null, `Доноры: ${donors.slice(0, 2).join(', ')}${donors.length > 2 ? '…' : ''}`)
          : aNumbers.length > 0
            ? h('span', null, `A-number: ${aNumbers[0]}`)
            : h('span', null, device.processor_family || ''),
        h('span', { className: 'inline-flex items-center text-indigo-600 font-semibold text-sm' }, 'Подробнее', h(ArrowRightIcon))
      )
    )
  );
};

const IntakeBackground = () => h('div', { className: 'absolute inset-0 overflow-hidden' },
  h('div', { className: 'absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-100' }),
  h('div', { className: 'absolute inset-0 flex justify-center items-center opacity-20' },
    h('div', { className: 'grid grid-cols-2 gap-3' },
      ...Array.from({ length: 4 }, (_, i) =>
        h('div', {
          key: i,
          className: 'w-16 h-20 rounded-xl border-2 border-indigo-400/60 bg-white/40 flex flex-col items-center justify-center text-xs font-semibold text-indigo-600'
        },
          h('div', { className: 'text-lg' }, ['📸', '🔋', '💧', '🧾'][i] || '🔧'),
          h('span', null, ['Осмотр', 'Батарея', 'Повреждения', 'Документы'][i] || 'Комлект')
        )
      )
    )
  )
);

// ===== ИЗМЕРЕНИЯ PANEL =====
const MeasurementsPanel = ({ measurementsData, onClose }) => {
  const [activeSection, setActiveSection] = useState('power_rails');
  const [expandedRail, setExpandedRail] = useState(null);

  if (!measurementsData) return null;

  const sections = [
    { key: 'power_rails', name: '⚡ Шины питания', icon: '⚡' },
    { key: 'boot_sequence', name: '🔄 Boot Sequence', icon: '🔄' },
    { key: 'fault_signatures', name: '🔍 Диагностика', icon: '🔍' },
    { key: 'diode_technique', name: '📏 Техника', icon: '📏' }
  ];

  const renderPowerRails = () => {
    const rails = measurementsData.power_rails?.rails;
    if (!rails) return null;

    return h('div', { className: 'space-y-3' },
      Object.entries(rails).map(([key, rail]) =>
        h(Surface, {
          key,
          className: 'overflow-hidden border border-indigo-100/60 bg-gradient-to-br from-white via-indigo-50/20 to-white'
        },
          h('div', {
            className: 'p-4 cursor-pointer flex justify-between items-center transition-colors hover:bg-white/60',
            onClick: () => setExpandedRail(expandedRail === key ? null : key)
          },
            h('div', { className: 'flex items-center gap-4' },
              h('div', { className: 'w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl shadow-lg shadow-orange-200/40' }, '⚡'),
              h('div', null,
                h('p', { className: 'font-bold text-slate-800' }, key),
                h('p', { className: 'text-sm text-slate-500' }, rail.name)
              )
            ),
            h('div', { className: 'flex items-center gap-4' },
              h('div', { className: 'text-right' },
                h('p', { className: 'font-mono text-indigo-600 font-bold' }, rail.voltage),
                h('p', { className: 'text-xs text-slate-400' }, `Diode: ${rail.diode_mode_normal}`)
              ),
              expandedRail === key ? h(ChevronUpIcon) : h(ChevronDownIcon)
            )
          ),
          expandedRail === key && h('div', { className: 'p-5 bg-gradient-to-b from-white/90 to-blue-50/30 border-t space-y-4' },
            h('p', { className: 'text-sm text-slate-600' }, rail.description),
            
            h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
              h('div', { className: 'rounded-2xl border border-green-200/70 bg-gradient-to-br from-green-50/70 to-white p-4 shadow-sm' },
                h('p', { className: 'text-xs text-green-600 font-semibold mb-1' }, '✓ Норма (Diode Mode)'),
                h('p', { className: 'font-mono text-2xl text-green-700' }, rail.diode_mode_normal)
              ),
              h('div', { className: 'rounded-2xl border border-red-200/70 bg-gradient-to-br from-red-50/70 to-white p-4 shadow-sm' },
                h('p', { className: 'text-xs text-red-600 font-semibold mb-1' }, '✗ КЗ если меньше'),
                h('p', { className: 'font-mono text-2xl text-red-700' }, rail.short_threshold)
              )
            ),
            
            h('div', { className: 'rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/40 p-4 border border-indigo-100/60' },
              h('p', { className: 'text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-wide' }, '📍 Где измерять:'),
              h('div', { className: 'flex flex-wrap gap-2' },
                ...rail.check_points.map((point, idx) =>
                  h('span', { key: idx, className: cn(design.tag, 'text-indigo-700 bg-white/80 border-indigo-200/60') }, point)
                )
              )
            ),
            
            rail.if_shorted && h('div', { className: 'rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50/80 to-white p-4' },
              h('p', { className: 'text-xs font-semibold text-orange-600 mb-2 uppercase tracking-wide' }, '⚠️ Если КЗ - что делать:'),
              h('ul', { className: 'space-y-1' },
                ...rail.if_shorted.map((action, idx) =>
                  h('li', { key: idx, className: 'text-sm text-orange-800 flex items-center gap-2' },
                    h('span', { className: 'w-5 h-5 rounded-full bg-orange-200/80 text-orange-700 flex items-center justify-center text-xs shadow-sm' }, idx + 1),
                    action
                  )
                )
              )
            )
          )
        )
      )
    );
  };

  const renderBootSequence = () => {
    const boot = measurementsData.boot_sequence;
    if (!boot) return null;

    return h('div', { className: 'space-y-6' },
      h('div', { className: 'bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl text-white' },
        h('h4', { className: 'font-bold text-xl mb-4' }, '🔄 Последовательность загрузки iPhone'),
        h('div', { className: 'space-y-3' },
          ...boot.steps.map((step, idx) =>
            h('div', { key: idx, className: 'flex items-center gap-4 bg-white/10 backdrop-blur p-3 rounded-xl' },
              h('div', { className: 'w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold' }, step.step),
              h('div', { className: 'flex-1' },
                h('p', { className: 'font-semibold' }, step.name),
                h('p', { className: 'text-xs text-blue-100' }, step.description)
              ),
              h('div', { className: 'text-right' },
                h('p', { className: 'font-mono font-bold text-green-300' }, step.current_draw),
                h('p', { className: 'text-xs text-blue-200' }, step.duration)
              )
            )
          )
        )
      ),
      
      h('div', { className: 'bg-gradient-to-br from-red-500 to-orange-500 p-6 rounded-2xl text-white' },
        h('h4', { className: 'font-bold text-xl mb-4' }, '⚠️ Аномальные паттерны'),
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
          ...Object.entries(boot.abnormal_patterns).map(([key, pattern]) =>
            h('div', { key, className: 'bg-white/10 backdrop-blur p-4 rounded-xl' },
              h('p', { className: 'font-semibold mb-2' }, pattern.description),
              h('ul', { className: 'space-y-1' },
                ...pattern.possible_causes.map((cause, idx) =>
                  h('li', { key: idx, className: 'text-xs text-red-100' }, `• ${cause}`)
                )
              )
            )
          )
        )
      )
    );
  };

  const renderFaultSignatures = () => {
    const faults = measurementsData.common_fault_signatures;
    if (!faults) return null;

    const faultData = {
      no_power: { icon: '🔌', color: 'from-gray-600 to-gray-800' },
      no_charge: { icon: '🔋', color: 'from-green-500 to-emerald-600' },
      no_image: { icon: '🖥️', color: 'from-blue-500 to-cyan-600' },
      no_touch: { icon: '👆', color: 'from-purple-500 to-pink-600' },
      no_service: { icon: '📶', color: 'from-orange-500 to-red-500' },
      audio_disease: { icon: '🔊', color: 'from-indigo-500 to-purple-600' }
    };

    return h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
      ...Object.entries(faults).map(([key, fault]) => {
        const data = faultData[key] || { icon: '❓', color: 'from-gray-400 to-gray-600' };
        return h(Surface, { 
          key,
          className: cn(design.interactive, 'cursor-pointer overflow-hidden p-0') ,
          onClick: () => setExpandedRail(expandedRail === key ? null : key)
        },
          h('div', { className: `bg-gradient-to-r ${data.color} p-4 text-white` },
            h('div', { className: 'flex items-center gap-3' },
              h('span', { className: 'text-3xl drop-shadow' }, data.icon),
              h('div', null,
                h('p', { className: 'font-bold text-lg' }, fault.symptom),
                h('p', { className: 'text-sm opacity-80' }, `${fault.checklist.length} шагов`)
              )
            )
          ),
          expandedRail === key && h('div', { className: 'p-5 bg-gradient-to-br from-white to-slate-50' },
            h('ol', { className: 'space-y-2' },
              ...fault.checklist.map((step, idx) =>
                h('li', { key: idx, className: 'flex items-start gap-3' },
                  h('span', { className: `w-6 h-6 rounded-full bg-gradient-to-r ${data.color} text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow` }, idx + 1),
                  h('span', { className: 'text-sm text-slate-700' }, step)
                )
              )
            )
          )
        );
      })
    );
  };

  const renderDiodeTechnique = () => {
    const technique = measurementsData.diode_mode_technique;
    if (!technique) return null;

    return h('div', { className: 'space-y-6' },
      h('div', { className: 'bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white' },
        h('h4', { className: 'font-bold text-xl mb-4' }, '🔧 Настройка мультиметра'),
        h('div', { className: 'grid grid-cols-2 gap-4' },
          h('div', { className: 'bg-white/10 p-4 rounded-xl' },
            h('p', { className: 'text-xs text-gray-400 mb-1' }, 'Мультиметр'),
            h('p', { className: 'font-semibold' }, technique.setup.multimeter)
          ),
          h('div', { className: 'bg-white/10 p-4 rounded-xl' },
            h('p', { className: 'text-xs text-gray-400 mb-1' }, 'Режим'),
            h('p', { className: 'font-semibold' }, technique.setup.mode)
          ),
          h('div', { className: 'bg-red-500/30 p-4 rounded-xl border border-red-400' },
            h('p', { className: 'text-xs text-red-300 mb-1' }, '🔴 Красный щуп'),
            h('p', { className: 'font-bold text-red-200' }, technique.setup.red_probe)
          ),
          h('div', { className: 'bg-gray-700 p-4 rounded-xl border border-gray-500' },
            h('p', { className: 'text-xs text-gray-400 mb-1' }, '⚫ Чёрный щуп'),
            h('p', { className: 'font-bold' }, technique.setup.black_probe)
          )
        )
      ),

      h(Surface, { className: 'p-6 border border-slate-100/70 bg-gradient-to-br from-white via-slate-50/30 to-white' },
        h('h4', { className: 'font-bold text-xl mb-4 text-slate-800' }, '📊 Интерпретация значений'),
        h('div', { className: 'space-y-2' },
          ...Object.entries(technique.interpretation).map(([value, meaning]) =>
            h('div', { key: value, className: 'flex items-center gap-4 p-3 rounded-2xl border border-blue-100/60 bg-white/85 backdrop-blur-sm shadow-sm' },
              h('span', { className: 'font-mono font-bold text-blue-600 text-lg w-28' }, value),
              h('span', { className: 'text-slate-700' }, meaning)
            )
          )
        )
      ),

      h('div', { className: 'bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-2xl text-white' },
        h('h4', { className: 'font-bold text-xl mb-4' }, '💡 Советы профи'),
        h('ul', { className: 'space-y-3' },
          ...technique.tips.map((tip, idx) =>
            h('li', { key: idx, className: 'flex items-start gap-3' },
              h('span', { className: 'w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm' }, '✓'),
              h('span', null, tip)
            )
          )
        )
      )
    );
  };

  return h('div', { className: 'fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white/40 bg-gradient-to-br from-white via-blue-50/30 to-white shadow-[0_28px_80px_rgba(15,23,42,0.2)] backdrop-blur' },
      // Header
      h('div', { className: 'bg-white/85 backdrop-blur-sm p-6 border-b border-white/60 flex items-center justify-between' },
        h('div', null,
          h('h2', { className: 'text-2xl font-bold text-slate-800' }, '📏 Замеры и Диагностика'),
          h('p', { className: 'text-slate-500 text-sm' }, 'Справочник для ремонта iPhone')
        ),
        h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/70 hover:bg-white text-slate-600 text-xl shadow-sm border border-white/70' }, '×')
      ),
      
      // Tabs
      h('div', { className: 'bg-white/80 backdrop-blur-sm px-6 py-3 border-b border-white/60 flex gap-2 overflow-x-auto' },
        ...sections.map(section =>
          h('button', {
            key: section.key,
            onClick: () => { setActiveSection(section.key); setExpandedRail(null); },
            className: cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
              activeSection === section.key 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white/70 text-slate-600 hover:bg-white'
            )
          }, section.name)
        )
      ),

      // Content
      h('div', { className: 'flex-1 overflow-y-auto p-6' },
        activeSection === 'power_rails' && renderPowerRails(),
        activeSection === 'boot_sequence' && renderBootSequence(),
        activeSection === 'fault_signatures' && renderFaultSignatures(),
        activeSection === 'diode_technique' && renderDiodeTechnique()
      )
    )
  );
};

const ConnectorPanel = ({ data, onClose }) => {
  if (!data) return null;

  const lightning = data.lightning || {};
  const usbC = data.usb_c || {};
  const sources = data.sources || [];

  const renderPinout = () => {
    if (!lightning.pinout) return null;
    return h(Surface, {
      className: 'space-y-3 border border-indigo-100/70 bg-gradient-to-br from-white via-indigo-50/30 to-white'
    },
      h('h3', { className: 'text-lg font-semibold text-slate-800' }, '🔌 Lightning pinout'),
      h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
        ...lightning.pinout.map((pin) =>
          h('div', {
            key: pin.index,
            className: 'rounded-2xl border border-indigo-100/60 bg-white/80 backdrop-blur-sm p-3 shadow-sm space-y-2'
          },
            h('div', { className: 'flex items-center justify-between' },
              h('span', { className: 'text-xs font-semibold text-indigo-600 uppercase tracking-wide' }, `Пин ${pin.index}`),
              h('span', { className: 'text-xs text-slate-400' }, pin.contacts?.join(' / '))
            ),
            h('p', { className: 'text-sm font-bold text-slate-800' }, pin.name),
            pin.description && h('p', { className: 'text-sm text-slate-600' }, pin.description),
            pin.notes && h('p', { className: 'text-xs text-slate-500 italic' }, pin.notes)
          )
        )
      )
    );
  };

  const renderControllers = () => {
    if (!lightning.controller_variants) return null;
    return h(Surface, {
      className: 'space-y-3 border border-purple-100/70 bg-gradient-to-br from-white via-purple-50/30 to-white'
    },
      h('h3', { className: 'text-lg font-semibold text-slate-800' }, '🧠 Контроллеры Tristar/Hydra'),
      h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
        ...lightning.controller_variants.map((variant, idx) =>
          h('div', {
            key: idx,
            className: 'rounded-2xl border border-purple-100/60 bg-white/85 backdrop-blur-sm p-4 space-y-2 shadow-sm'
          },
            h('div', { className: 'flex items-center justify-between' },
              h('p', { className: 'font-semibold text-slate-800' }, variant.code),
              h('span', { className: cn('px-2 py-1 text-xs rounded-full', variant.wireless_charging ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600') }, variant.wireless_charging ? 'Wireless' : 'Wired only')
            ),
            variant.nickname && h('p', { className: 'text-xs uppercase text-slate-400' }, variant.nickname),
            variant.devices && h('p', { className: 'text-sm text-slate-600' }, `Устройства: ${variant.devices.join(', ')}`),
            variant.notes && h('p', { className: 'text-xs text-slate-500 italic' }, variant.notes)
          )
        )
      )
    );
  };

  const renderIDBUS = () => {
    const idbus = lightning.idbus_protocol || {};
    return h(Surface, {
      className: 'space-y-4 border border-slate-100/70 bg-gradient-to-br from-white via-slate-50/40 to-white'
    },
      h('h3', { className: 'text-lg font-semibold text-slate-800' }, '🧾 IDBUS протокол'),
      idbus.word_timings_microseconds && h('div', { className: 'space-y-2' },
        h('h4', { className: cn(design.sectionTitle, 'text-indigo-500') }, 'Тайминги слов'),
        h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
          ...idbus.word_timings_microseconds.map((item, idx) =>
            h('div', { key: idx, className: 'rounded-2xl border border-indigo-100/70 bg-white/85 backdrop-blur-sm p-3 shadow-sm space-y-1' },
              h('p', { className: 'font-bold text-slate-800' }, item.word),
              h('p', { className: 'text-xs text-slate-500' }, item.description),
              h('div', { className: 'mt-2 flex gap-4 text-xs text-slate-600' },
                h('span', null, `Meaningful: ${item.meaningful} µs`),
                h('span', null, `Recovery: ${item.recovery} µs`)
              )
            )
          )
        )
      ),
      idbus.request_map && h('div', { className: 'space-y-2' },
        h('h4', { className: cn(design.sectionTitle, 'text-indigo-500') }, 'Команды'),
        h('div', { className: 'space-y-2' },
          ...idbus.request_map.map((req, idx) =>
            h('div', { key: idx, className: 'rounded-2xl border border-indigo-100/70 bg-indigo-50/60 p-3 shadow-sm space-y-1' },
              h('p', { className: 'font-mono text-sm text-indigo-600' }, req.code),
              h('p', { className: 'text-xs text-slate-500' }, req.direction),
              h('p', { className: 'text-sm text-slate-600' }, req.purpose)
            )
          )
        )
      ),
      idbus.accessory_ids && h('div', { className: 'space-y-2' },
        h('h4', { className: cn(design.sectionTitle, 'text-indigo-500') }, 'Идентификаторы аксессуаров'),
        h('div', { className: 'space-y-2 max-h-48 overflow-y-auto pr-2' },
          ...idbus.accessory_ids.map((acc, idx) =>
            h('div', { key: idx, className: 'rounded-2xl border border-indigo-100/60 bg-white/85 backdrop-blur-sm p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm' },
              h('div', null,
                h('p', { className: 'font-semibold text-slate-800' }, acc.accessory),
                h('p', { className: 'text-xs text-slate-500' }, `HOSTID: ${acc.hostid}`)
              ),
              h('span', { className: 'font-mono text-xs text-blue-600 bg-white px-3 py-1 rounded-full border border-blue-100/70 shadow-sm' }, acc.id)
            )
          )
        )
      ),
      idbus.power_handshake && h('div', { className: 'space-y-2' },
        h('h4', { className: cn(design.sectionTitle, 'text-indigo-500') }, 'Power handshake'),
        h('ol', { className: 'space-y-2 list-decimal list-inside text-sm text-slate-700' },
          ...idbus.power_handshake.map(step =>
            h('li', { key: step.step, className: 'rounded-2xl border border-blue-100/60 bg-white/85 backdrop-blur-sm p-3 shadow-sm' },
              h('p', { className: 'font-semibold text-slate-800' }, step.message),
              step.diagnostics && h('p', { className: 'text-xs text-slate-500 mt-1' }, step.diagnostics)
            )
          )
        )
      ),
      lightning.diagnostic_tools && h('div', { className: 'space-y-2' },
        h('h4', { className: cn(design.sectionTitle, 'text-indigo-500') }, 'Диагностика'),
        h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
          ...lightning.diagnostic_tools.map((tool, idx) =>
            h('div', { key: idx, className: 'rounded-2xl border border-slate-100/70 bg-white/85 backdrop-blur-sm p-3 shadow-sm space-y-1' },
              h('p', { className: 'font-semibold text-slate-800' }, tool.tool),
              h('p', { className: 'text-xs text-slate-500 uppercase tracking-wide' }, tool.platform),
              h('p', { className: 'text-sm text-slate-600' }, tool.notes)
            )
          )
        )
      )
    );
  };

  const renderUsbC = () => {
    if (!usbC) return null;
    return h(Surface, {
      className: 'space-y-3 border border-emerald-100/70 bg-gradient-to-br from-white via-emerald-50/30 to-white'
    },
      h('h3', { className: 'text-lg font-semibold text-slate-800' }, '🔄 USB-C справка'),
      usbC.overview && h('p', { className: 'text-sm text-slate-600' }, usbC.overview),
      usbC.pinout_summary && h('div', { className: 'space-y-2' },
        h('h4', { className: cn(design.sectionTitle, 'text-emerald-600') }, 'Pinout summary'),
        h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
          ...usbC.pinout_summary.map((item, idx) =>
            h('div', { key: idx, className: 'rounded-2xl border border-emerald-100/60 bg-white/85 backdrop-blur-sm p-3 shadow-sm space-y-1' },
              h('p', { className: 'font-semibold text-slate-800' }, item.name),
              h('p', { className: 'text-xs text-slate-500 uppercase tracking-wide' }, item.pins.join(', ')),
              item.notes && h('p', { className: 'text-sm text-slate-600' }, item.notes)
            )
          )
        )
      ),
      usbC.cc_detection && h('div', { className: 'space-y-1 text-sm text-slate-700' },
        h('h4', { className: cn(design.sectionTitle, 'text-emerald-600') }, 'CC распознавание'),
        usbC.cc_detection.dfp_pullup_rp && h('p', null, `DFP pull-up (Rp): ${usbC.cc_detection.dfp_pullup_rp}`),
        usbC.cc_detection.ufp_pulldown_rd && h('p', null, `UFP pull-down (Rd): ${usbC.cc_detection.ufp_pulldown_rd}`),
        usbC.cc_detection.audio_accessory_ra && h('p', null, `Audio accessory (Ra): ${usbC.cc_detection.audio_accessory_ra}`),
        usbC.cc_detection.notes && h('p', { className: 'text-xs text-slate-500' }, usbC.cc_detection.notes)
      ),
      usbC.power_delivery_profiles && h('div', { className: 'space-y-2' },
        h('h4', { className: cn(design.sectionTitle, 'text-emerald-600') }, 'PD профили'),
        h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
          ...usbC.power_delivery_profiles.map((profile, idx) =>
            h('div', { key: idx, className: 'rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-3 shadow-sm space-y-1' },
              h('p', { className: 'font-semibold text-slate-800' }, profile.profile),
              h('p', { className: 'text-sm text-slate-600' }, `${profile.voltage} • ${profile.current}`),
              profile.condition && h('p', { className: 'text-xs text-slate-500' }, profile.condition)
            )
          )
        )
      ),
      usbC.diagnostic_notes && h('div', { className: 'space-y-1' },
        h('h4', { className: cn(design.sectionTitle, 'text-emerald-600') }, 'Диагностические заметки'),
        h('ul', { className: 'list-disc list-inside text-sm text-slate-700 space-y-1' },
          ...usbC.diagnostic_notes.map((note, idx) => h('li', { key: idx }, note))
        )
      )
    );
  };

  return h('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col border border-white/40 bg-gradient-to-br from-white via-blue-50/40 to-white shadow-[0_30px_80px_rgba(15,23,42,0.25)] backdrop-blur' },
      h('div', { className: 'bg-white/85 backdrop-blur-sm p-6 border-b border-white/60 flex items-center justify-between' },
        h('div', null,
          h('h2', { className: 'text-2xl font-bold text-slate-800' }, '🔌 Lightning & USB-C справочник'),
          data.generated_at && h('p', { className: 'text-xs text-slate-400 mt-1' }, `Обновлено: ${new Date(data.generated_at).toLocaleString('ru-RU')}`)
        ),
        h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/70 hover:bg-white text-slate-600 text-xl shadow-sm border border-white/70' }, '×')
      ),
      h('div', { className: 'flex-1 overflow-y-auto p-6 space-y-4' },
        renderPinout(),
        renderControllers(),
        renderIDBUS(),
        renderUsbC(),
        sources.length > 0 && h(Surface, { className: 'border border-slate-100/70 bg-gradient-to-br from-white via-blue-50/20 to-white' },
          h('h3', { className: cn(design.sectionTitle, 'text-slate-600 mb-2') }, 'Источники'),
          h('ul', { className: 'space-y-1 text-sm text-slate-600' },
            ...sources.map((source, idx) =>
              h('li', { key: idx },
                h('a', { href: source.url, target: '_blank', rel: 'noreferrer', className: 'text-blue-600 hover:underline' }, source.title || source.url),
                source.license && h('span', { className: 'text-xs text-slate-400 ml-2' }, source.license)
              )
            )
          )
        )
      )
    )
  );
};

const BoardReferencePanel = ({ data, onClose }) => {
  if (!data) return null;
  const models = data.models || [];

  const renderBoardCodes = (codes = []) => {
    if (codes.length <= 6) return codes.join(', ');
    const shown = codes.slice(0, 6).join(', ');
    return `${shown} +${codes.length - 6}`;
  };

  return h('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'bg-gray-50 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col' },
      h('div', { className: 'bg-white p-6 border-b flex items-center justify-between' },
        h('div', null,
          h('h2', { className: 'text-2xl font-bold text-gray-800' }, '🧭 Справочник логических плат Mac'),
          data.generated_at && h('p', { className: 'text-xs text-gray-400 mt-1' }, `Обновлено: ${new Date(data.generated_at).toLocaleString('ru-RU')}`)
        ),
        h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-xl' }, '×')
      ),
      h('div', { className: 'flex-1 overflow-y-auto p-6 space-y-4' },
        ...models.map((model, idx) =>
          h(Surface, {
            key: idx,
            className: 'space-y-4 border border-emerald-100/60 bg-gradient-to-br from-white via-emerald-50/30 to-white'
          },
            h('div', { className: 'flex flex-col md:flex-row md:items-start md:justify-between gap-4' },
              h('div', { className: 'space-y-2' },
                h('h3', { className: 'text-xl font-semibold text-slate-800' }, model.label),
                h('p', { className: 'text-sm text-slate-500' }, `${model.system_product_name} • ${model.family}`)
              ),
              h('div', { className: 'flex flex-wrap gap-2 text-xs text-slate-600' },
                model.model_years?.length > 0 && h('span', { className: cn(design.tag, 'bg-emerald-50/70 text-emerald-700') }, `Годы: ${model.model_years.join(', ')}`),
                model.minimum_os_version && h('span', { className: cn(design.tag, 'bg-blue-50/70 text-blue-700') }, `minOS ${model.minimum_os_version}`),
                model.maximum_os_version && h('span', { className: cn(design.tag, 'bg-blue-50/70 text-blue-700') }, `maxOS ${model.maximum_os_version}`)
              )
            ),
            model.board_product && model.board_product.length > 0 && h('p', { className: 'text-sm text-slate-600' }, `BoardProduct: ${model.board_product.join(', ')}`),
            model.board_codes && h('p', { className: 'text-sm text-slate-600' }, `Board codes: ${renderBoardCodes(model.board_codes)}`),
            model.board_revision && h('p', { className: 'text-sm text-slate-600' }, `Revision: ${model.board_revision}`),
            h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-700' },
              h('div', { className: 'rounded-2xl bg-white/75 border border-white/80 p-4 shadow-sm' },
                h('p', { className: 'font-semibold text-slate-800 mb-2 uppercase tracking-wide text-xs' }, 'CPU'),
                h('ul', { className: 'space-y-1 text-slate-600' },
                  ...(model.cpu_options || []).map((cpu, cpuIdx) => h('li', { key: cpuIdx }, cpu))
                )
              ),
              h('div', { className: 'rounded-2xl bg-white/75 border border-white/80 p-4 shadow-sm' },
                h('p', { className: 'font-semibold text-slate-800 mb-2 uppercase tracking-wide text-xs' }, 'GPU'),
                h('ul', { className: 'space-y-1 text-slate-600' },
                  ...(model.gpu_options || []).map((gpu, gpuIdx) => h('li', { key: gpuIdx }, gpu))
                )
              ),
              h('div', { className: 'rounded-2xl bg-white/75 border border-white/80 p-4 shadow-sm' },
                h('p', { className: 'font-semibold text-slate-800 mb-2 uppercase tracking-wide text-xs' }, 'RAM'),
                h('ul', { className: 'space-y-1 text-slate-600' },
                  ...(model.ram_options || []).map((ram, ramIdx) => h('li', { key: ramIdx }, ram))
                )
              )
            ),
            model.source && h('div', { className: 'text-xs text-slate-500 flex flex-wrap gap-2 items-center' },
              h('span', null, model.source.license || ''),
              model.source.html && h('a', { href: model.source.html, target: '_blank', rel: 'noreferrer', className: 'text-blue-600 hover:underline' }, 'Источник'),
              model.platform_feature && h('span', { className: cn(design.tag, 'bg-white/70 text-slate-600') }, `PlatformFeature ${model.platform_feature}`),
              model.smc_generation != null && h('span', { className: cn(design.tag, 'bg-white/70 text-slate-600') }, `SMC Gen ${model.smc_generation}`),
              model.smc_platform?.length > 0 && h('span', { className: cn(design.tag, 'bg-white/70 text-slate-600') }, `SMC Platform ${model.smc_platform.join(' ')}`)
            )
          )
        ),
        data.attribution && h(Surface, { className: 'text-sm text-slate-600 border border-emerald-100/60 bg-gradient-to-br from-white via-emerald-50/30 to-white' },
          h('h4', { className: cn(design.sectionTitle, 'text-emerald-600 mb-2') }, 'Атрибуция'),
          h('ul', { className: 'space-y-1' },
            ...data.attribution.map((item, idx) =>
              h('li', { key: idx },
                h('a', { href: item.url, target: '_blank', rel: 'noreferrer', className: 'text-blue-600 hover:underline' }, item.name),
                item.license && h('span', { className: 'text-xs text-slate-400 ml-2' }, item.license)
              )
            )
          )
        )
      )
    )
  );
};

const MacServicePanel = ({ data, onClose }) => {
  if (!data) return null;
  const records = data.records || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('Все модели');

  const keyServices = useMemo(() => [
    { key: 'diagnostics', label: 'Диагностика' },
    { key: 'repair_logic_board', label: 'Логическая плата' },
    { key: 'display_lid_swap', label: 'Дисплей / крышка' },
    { key: 'keyboard', label: 'Клавиатура' },
    { key: 'battery_swap', label: 'Батарея' },
    { key: 'type_c_magsafe', label: 'Питание' },
    { key: 'swap_top_case', label: 'Top case' }
  ], []);

  const seriesList = useMemo(() => {
    const uniq = Array.from(new Set(records.map((rec) => rec.series).filter(Boolean))).sort();
    return ['Все модели', ...uniq];
  }, [records]);

  const serviceLabelMap = useMemo(() => {
    const map = {};
    keyServices.forEach(({ key, label }) => {
      map[key] = label;
    });
    return map;
  }, [keyServices]);

  const filteredRecords = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const list = records.filter((rec) => {
      if (selectedSeries !== 'Все модели' && rec.series !== selectedSeries) return false;
      if (!term) return true;
      return (
        rec.model_label?.toLowerCase().includes(term) ||
        rec.a_number?.toLowerCase().includes(term)
      );
    });
    return list.sort((a, b) => {
      const yearA = Number(a.year) || 0;
      const yearB = Number(b.year) || 0;
      return yearB - yearA;
    });
  }, [records, searchTerm, selectedSeries]);

  const serviceSummary = useMemo(() => {
    return keyServices.map(({ key, label }) => {
      const prices = [];
      records.forEach((rec) => {
        const servicePrices = rec.services?.[key]?.prices;
        if (servicePrices && servicePrices.length) {
          prices.push(...servicePrices);
        }
      });
      if (!prices.length) return { key, label, hasData: false };
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const avg = prices.reduce((acc, val) => acc + val, 0) / prices.length;
      return { key, label, hasData: true, min, max, avg };
    });
  }, [records, keyServices]);

  const anomalies = useMemo(() => {
    const flagged = [];
    records.forEach((rec) => {
      const year = Number(rec.year) || 0;
      Object.entries(rec.services || {}).forEach(([serviceKey, info]) => {
        const prices = info?.prices || [];
        if (!prices.length) return;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        if (minPrice > 0 && maxPrice / minPrice >= 2.5) {
          flagged.push({
            model: rec.model_label,
            a_number: rec.a_number,
            serviceKey,
            spread: formatPriceRange([minPrice, maxPrice]),
            reason: 'Слишком большой разброс (вероятно донор/оригинал)'
          });
        } else if (year >= 2018 && minPrice < 100) {
          flagged.push({
            model: rec.model_label,
            a_number: rec.a_number,
            serviceKey,
            spread: formatPriceRange([minPrice]),
            reason: 'Слишком низкая цена для современной модели'
          });
        }
      });
    });
    return flagged.slice(0, 8);
  }, [records]);

  return h('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'rounded-3xl w-full max-w-6xl max-h-[94vh] overflow-hidden flex flex-col border border-white/35 bg-gradient-to-br from-white via-amber-50/30 to-white shadow-[0_32px_90px_rgba(15,23,42,0.22)] backdrop-blur' },
      h('div', { className: 'bg-white/85 backdrop-blur-sm p-6 border-b border-white/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4' },
        h('div', null,
          h('h2', { className: 'text-2xl font-bold text-slate-800' }, '💻 Прайс на ремонт Mac'),
          h('p', { className: 'text-sm text-slate-500 mt-1' }, 'Данные из Google Sheets: ремонт MacBook / iMac / Mac Studio (условные единицы)')
        ),
        h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/70 hover:bg-white text-slate-600 text-xl shadow-sm border border-white/70 self-end md:self-auto' }, '×')
      ),
      h('div', { className: 'bg-white/80 backdrop-blur-sm border-b border-white/60 px-6 py-4 space-y-4' },
        h('div', { className: 'flex flex-col md:flex-row md:items-center md:justify-between gap-4' },
          h('div', { className: 'flex flex-wrap gap-2' },
            seriesList.map((series) => h('button', {
              key: series,
              onClick: () => setSelectedSeries(series),
              className: cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                selectedSeries === series ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/70 text-slate-600 hover:bg-white'
              )
            }, series))
          ),
          h('div', { className: 'relative w-full md:w-72' },
            h('input', {
              type: 'text',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              placeholder: 'Поиск по A-номеру или названию...',
              className: 'w-full px-4 py-2 pl-10 rounded-xl border border-blue-100/70 bg-white/85 backdrop-blur focus:border-blue-500 focus:outline-none text-sm text-slate-700 placeholder:text-slate-400'
            }),
            h('div', { className: 'absolute left-3 top-2.5 text-blue-400' }, h(SearchIcon))
          )
        ),
        h('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-3' },
          serviceSummary.filter((item) => item.hasData).map((item) =>
            h(Surface, {
              key: item.key,
              className: 'p-4 border border-blue-100/70 bg-gradient-to-br from-white via-blue-50/40 to-white'
            },
              h('p', { className: cn(design.sectionTitle, 'text-blue-600') }, item.label),
              h('p', { className: 'text-base font-semibold text-blue-900 mt-2' }, `${formatCurrency(item.min)} → ${formatCurrency(item.max)}`),
              h('p', { className: 'text-xs text-blue-500 mt-1' }, `Среднее: ${formatCurrency(item.avg)}`)
            )
          )
        ),
        anomalies.length > 0 && h(Surface, { className: 'border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/40 to-white p-4' },
          h('p', { className: 'text-sm font-semibold text-amber-700 mb-2' }, '⚠️ Требует проверки:'),
          h('ul', { className: 'space-y-1 text-sm text-amber-800' },
            anomalies.map((anom, idx) =>
              h('li', { key: idx }, `• ${anom.a_number} ${anom.model} — ${serviceLabelMap[anom.serviceKey] || anom.serviceKey}: ${anom.spread} (${anom.reason})`)
            )
          )
        )
      ),
      h('div', { className: 'flex-1 overflow-y-auto p-6' },
        h('div', { className: 'flex items-center justify-between mb-3 text-sm text-slate-500' },
          h('span', null, `Найдено моделей: ${filteredRecords.length} из ${records.length}`),
          h('span', null, 'Цены указаны в условных единицах (проверьте курс/себестоимость перед озвучиванием клиенту)')
        ),
        h(Surface, { className: 'border border-gray-100/70 bg-white/90 backdrop-blur overflow-hidden p-0' },
          h('div', { className: 'overflow-x-auto' },
            h('table', { className: 'min-w-full text-sm' },
              h('thead', { className: 'bg-gray-100 text-gray-600 uppercase text-xs tracking-wide' },
                h('tr', null,
                  h('th', { className: 'px-4 py-3 text-left' }, 'A-номер'),
                  h('th', { className: 'px-4 py-3 text-left w-64' }, 'Модель'),
                  h('th', { className: 'px-4 py-3 text-left' }, 'Год'),
                  ...keyServices.map(({ key, label }) => h('th', { key, className: 'px-4 py-3 text-left' }, label))
                )
              ),
              h('tbody', { className: 'divide-y divide-gray-100 bg-white/95' },
                filteredRecords.map((rec) =>
                  h('tr', { key: rec.a_number, className: 'hover:bg-blue-50/40 transition-colors' },
                    h('td', { className: 'px-4 py-3 font-semibold text-slate-800 whitespace-nowrap' }, rec.a_number),
                    h('td', { className: 'px-4 py-3 text-slate-700' }, rec.model_label),
                    h('td', { className: 'px-4 py-3 text-slate-500 whitespace-nowrap' }, rec.year || '—'),
                    ...keyServices.map(({ key }) => {
                      const prices = rec.services?.[key]?.prices;
                      return h('td', { key, className: 'px-4 py-3 text-slate-700 whitespace-nowrap' }, formatPriceRange(prices));
                    })
                  )
                )
              )
            )
          )
        )
      ),
      h('div', { className: 'bg-white border-t px-6 py-4 text-xs text-gray-500 space-y-1' },
        h('p', null, 'Совет: храните два значения, если указаны через «/» — первая цена для восстановленных деталей, вторая для оригинала.'),
        h('p', null, 'Перед озвучиванием стоимости клиенту уточняйте доступность запчастей и финальный курс.' )
      )
    )
  );
};

// ===== CHIP DETAILS MODAL =====
const ChipDetailsModal = ({ chip, icData, onClose }) => {
  if (!chip) return null;

  const findChipData = () => {
    if (!icData || !chip.category) return null;
    const category = icData[chip.category];
    if (!category) return null;
    if (chip.icKey && category[chip.icKey]) return category[chip.icKey];
    for (const [key, data] of Object.entries(category)) {
      if (chip.fullName?.includes(key)) return data;
    }
    return null;
  };

  const chipData = findChipData();

  return h('div', { className: 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden' },
      // Header with gradient
      h('div', { className: 'bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white' },
        h('div', { className: 'flex justify-between items-start' },
          h('div', null,
            h('h2', { className: 'text-2xl font-bold' }, chip.name),
            h('p', { className: 'text-blue-100' }, chip.fullName)
          ),
          h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl' }, '×')
        )
      ),
      
      // Content
      h('div', { className: 'p-6 overflow-y-auto max-h-[60vh] space-y-4' },
        chipData ? h('div', { className: 'space-y-4' },
          // Basic info
          h('div', { className: 'grid grid-cols-2 gap-4' },
            h('div', { className: 'bg-gray-50 p-4 rounded-xl' },
              h('p', { className: 'text-xs text-gray-500 mb-1' }, 'Обозначение'),
              h('p', { className: 'font-bold text-lg' }, chipData.designation || 'N/A')
            ),
            h('div', { className: 'bg-gray-50 p-4 rounded-xl' },
              h('p', { className: 'text-xs text-gray-500 mb-1' }, 'Корпус'),
              h('p', { className: 'font-bold text-lg' }, chipData.package || 'N/A')
            )
          ),

          // Functions
          chipData.functions && h('div', { className: 'bg-blue-50 p-4 rounded-xl' },
            h('p', { className: 'text-xs text-blue-600 font-semibold mb-2' }, 'Функции'),
            h('div', { className: 'flex flex-wrap gap-2' },
              ...chipData.functions.map((func, idx) =>
                h('span', { key: idx, className: 'px-3 py-1 bg-white text-blue-700 rounded-full text-sm border border-blue-200' }, func)
              )
            )
          ),

          // Analogues
          chipData.analogues?.length > 0 && h('div', { className: 'bg-green-50 p-4 rounded-xl' },
            h('p', { className: 'text-xs text-green-600 font-semibold mb-3' }, '🔄 Совместимые аналоги'),
            h('div', { className: 'space-y-2' },
              ...chipData.analogues.map((analog, idx) =>
                h('div', { key: idx, className: 'flex items-center justify-between bg-white p-3 rounded-lg' },
                  h('div', null,
                    h('span', { className: 'font-bold text-green-800' }, analog.part),
                    h('span', { className: 'text-xs text-gray-500 ml-2' }, analog.notes)
                  ),
                  h('span', { className: cn('px-3 py-1 rounded-full text-xs font-bold', analog.compatibility === '100%' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black') }, analog.compatibility)
                )
              )
            )
          ),

          // Donors
          chipData.donor_models?.length > 0 && h('div', { className: 'bg-purple-50 p-4 rounded-xl' },
            h('p', { className: 'text-xs text-purple-600 font-semibold mb-3' }, '📱 Модели-доноры'),
            h('div', { className: 'grid grid-cols-2 gap-2' },
              ...chipData.donor_models.map((donor, idx) =>
                h('div', { key: idx, className: 'bg-white p-3 rounded-lg border border-purple-200' },
                  h('p', { className: 'font-semibold text-sm' }, donor.model),
                  h('p', { className: 'text-xs text-gray-500' }, `${donor.years} • ${donor.location}`),
                  h('span', { className: cn('inline-block mt-1 px-2 py-0.5 rounded text-xs',
                    donor.difficulty.includes('Средняя') ? 'bg-yellow-100 text-yellow-800' :
                    donor.difficulty.includes('Сложная') ? 'bg-orange-100 text-orange-800' :
                    donor.difficulty.includes('Экстремально') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  ) }, donor.difficulty)
                )
              )
            )
          ),

          // Price and buy
          h('div', { className: 'flex gap-3' },
            chipData.price_range && h('div', { className: 'flex-1 bg-green-100 p-4 rounded-xl text-center' },
              h('p', { className: 'text-xs text-green-600 mb-1' }, 'Цена'),
              h('p', { className: 'font-bold text-xl text-green-700' }, chipData.price_range)
            ),
            chipData.aliexpress && h('a', { 
              href: chipData.aliexpress, 
              target: '_blank', 
              className: 'flex-1 bg-orange-500 p-4 rounded-xl text-center text-white hover:bg-orange-600 transition-colors'
            },
              h('p', { className: 'text-xs opacity-80 mb-1' }, 'Купить'),
              h('p', { className: 'font-bold text-lg' }, '🛒 AliExpress')
            )
          )
        ) : h('div', { className: 'text-center py-12 text-gray-500' },
          h('p', { className: 'text-4xl mb-4' }, '🔍'),
          h('p', null, 'Подробная информация будет добавлена')
        )
      )
    )
  );
};

// ===== INTAKE CHECKLIST MODAL =====
const IntakeChecklistModal = ({ onClose }) => {
  const sections = [
    {
      title: 'Внешний осмотр',
      items: [
        'Фиксируйте сколы, вмятины, следы влаги',
        'Проверяйте целостность стекла, рамки, винтов',
        'Сделайте фото IMEI/серийного номера'
      ]
    },
    {
      title: 'Комплектация',
      items: [
        'Отметьте наличие зарядки, кабеля, коробки',
        'Снимите аксессуары клиента (чехлы, стекла)',
        'Уточните пароли, Apple ID, блокировки'
      ]
    },
    {
      title: 'Признаки неисправности',
      items: [
        'Проверка включения, зарядки, реакции кнопок',
        'Фиксируйте симптомы со слов клиента',
        'Укажите условия проявления (после падения, после обновления)'
      ]
    },
    {
      title: 'Документы и сроки',
      items: [
        'Продублируйте контакт клиента',
        'Согласуйте ориентировочные сроки и цену диагностики',
        'Передайте талон или чек с номером заказа'
      ]
    }
  ];

  return h('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col' },
      h('div', { className: 'bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex items-center justify-between' },
        h('div', null,
          h('h2', { className: 'text-2xl font-bold' }, '🧾 Приёмочный чек-лист'),
          h('p', { className: 'text-indigo-100 text-sm' }, 'Для менеджера приёмки: фиксируйте состояние и договорённости')
        ),
        h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl' }, '×')
      ),
      h('div', { className: 'flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50' },
        ...sections.map((section, idx) =>
          h('div', { key: idx, className: 'bg-white rounded-2xl shadow border border-gray-100 p-5' },
            h('div', { className: 'flex items-start gap-3' },
              h('div', { className: 'w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-bold' }, idx + 1),
              h('div', null,
                h('h3', { className: 'text-lg font-semibold text-gray-800 mb-2' }, section.title),
                h('ul', { className: 'space-y-2 text-sm text-gray-600' },
                  ...section.items.map((item, itemIdx) =>
                    h('li', { key: itemIdx, className: 'flex items-start gap-2' },
                      h('span', { className: 'text-indigo-500 mt-0.5' }, '•'),
                      h('span', null, item)
                    )
                  )
                )
              )
            )
          )
        ),
        h('div', { className: 'bg-white rounded-2xl shadow border border-indigo-100 p-5 text-sm text-indigo-700' },
          h('h4', { className: 'font-semibold text-indigo-800 mb-2' }, 'Шаблон описания заказа'),
          h('p', null, 'IMEI/Серийный номер, комплектация, внешний вид, пароль, заявленная неисправность, согласованная диагностика.')
        )
      )
    )
  );
};

// ===== DEVICE DETAILS VIEW =====
const DeviceDetailsView = ({ device, icData, measurementsData, onBack }) => {
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [selectedChip, setSelectedChip] = useState(null);

  const features = [
    {
      name: 'Charging IC',
      description: device.charging_ic?.main || 'N/A',
      Icon: BoltIcon,
      color: 'from-yellow-400 to-orange-500',
      data: device.charging_ic,
      category: 'charging_ics'
    },
    {
      name: 'Power Management',
      description: device.power_ic?.main || 'N/A',
      Icon: CpuIcon,
      color: 'from-red-400 to-pink-500',
      data: device.power_ic,
      category: 'power_ics'
    },
    {
      name: 'Audio Codec',
      description: device.audio_codec?.main || 'N/A',
      Icon: WrenchIcon,
      color: 'from-purple-400 to-indigo-500',
      data: device.audio_codec,
      category: 'audio_ics'
    },
    {
      name: 'Memory',
      description: `${device.memory?.nand_type || 'N/A'} / ${device.memory?.ram_type || 'N/A'}`,
      Icon: ChipIcon,
      color: 'from-blue-400 to-cyan-500',
      data: device.memory,
      category: 'nand_ics'
    }
  ];

  return h('div', { className: 'space-y-6 pb-10' },
    // Back button and header
    h('div', { className: 'flex flex-col gap-4 md:flex-row md:items-center' },
      h('button', { 
        onClick: onBack, 
        className: 'w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow self-start' 
      }, '←'),
      h('div', { className: 'flex-1' },
        h('h1', { className: 'text-2xl md:text-3xl font-bold text-gray-800' }, device.name),
        h('p', { className: 'text-sm md:text-base text-gray-500 mt-1 break-words' }, device.model)
      )
    ),

    // Tags
    h('div', { className: 'flex flex-wrap gap-2' },
      device.year && h('span', { className: 'px-4 py-2 bg-white rounded-xl shadow text-xs md:text-sm font-medium' }, `📅 ${device.year}`),
      device.category && h('span', { className: 'px-4 py-2 bg-white rounded-xl shadow text-xs md:text-sm font-medium' }, `${['MacBook', 'Mac'].includes(device.category) ? '💻' : device.category === 'iPad' ? '📟' : device.category === 'Apple Watch' ? '⌚' : '📱'} ${device.category}`),
      device.processor && h('span', { className: 'px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow text-xs md:text-sm font-medium' }, `CPU ${device.processor}`),
      device.a_number && h('span', { className: 'px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow text-xs md:text-sm font-medium' }, `A-number ${device.a_number}`),
      device.intake_priority && h('span', { className: 'px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl shadow text-xs md:text-sm font-medium' }, device.intake_priority),
      ...(device.board_numbers || []).map((bn, i) =>
        h('span', { key: `board-${i}`, className: 'px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl shadow text-xs md:text-sm font-medium' }, `Board ${bn}`)
      )
    ),

    // Quick actions
    h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
      h('button', {
        onClick: () => setShowMeasurements(true),
        className: 'p-5 sm:p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white text-left hover:shadow-xl transition-all hover:scale-[1.02]'
      },
        h('span', { className: 'text-3xl sm:text-4xl mb-2 block' }, '📏'),
        h('p', { className: 'font-bold text-lg sm:text-xl' }, 'Диагностика'),
        h('p', { className: 'text-indigo-100 text-sm' }, 'Шины питания, Boot Sequence, чек-листы')
      ),
      (device.documentation_links?.ifixit || device.documentation_links?.schematics) && h('a', {
        href: device.documentation_links?.ifixit || device.documentation_links?.schematics || '#',
        target: '_blank',
        className: 'p-5 sm:p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white text-left hover:shadow-xl transition-all hover:scale-[1.02]'
      },
        h('span', { className: 'text-3xl sm:text-4xl mb-2 block' }, '📚'),
        h('p', { className: 'font-bold text-lg sm:text-xl' }, 'Документация'),
        h('p', { className: 'text-green-100 text-sm' }, device.documentation_links?.ifixit ? 'Руководства по разборке' : 'Схемы/Boardview')
      )
    ),

    device.intake_focus?.length > 0 && h('div', { className: 'mt-6 bg-white rounded-2xl shadow-lg p-6 border border-indigo-100' },
      h('h2', { className: 'text-xl font-bold text-gray-800 mb-3' }, '📋 Что проверить при приёмке'),
      h('ul', { className: 'space-y-2 text-sm text-gray-700' },
        ...device.intake_focus.map((point, idx) =>
          h('li', { key: idx, className: 'flex items-start gap-3' },
            h('span', { className: 'w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold' }, idx + 1),
            h('span', null, point)
          )
        )
      )
    ),

    // IC Cards as Bento Grid
    h('h2', { className: 'text-xl font-bold text-gray-800 mt-8' }, '🔧 Микросхемы'),
    h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
      ...features.map((feature, idx) =>
        h('div', {
          key: idx,
          onClick: () => feature.data && setSelectedChip({
            name: feature.name,
            fullName: feature.description,
            category: feature.category,
            icKey: feature.description?.split(' ')[0]
          }),
          className: cn(
            'p-6 rounded-2xl text-white cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02]',
            `bg-gradient-to-br ${feature.color}`
          )
        },
          h(feature.Icon, { className: 'w-10 h-10 mb-3 opacity-80' }),
          h('p', { className: 'font-bold text-lg' }, feature.name),
          h('p', { className: 'text-sm opacity-80' }, feature.description)
        )
      )
    ),

    // Common issues
    device.common_issues?.length > 0 && h('div', { className: 'mt-8' },
      h('h2', { className: 'text-xl font-bold text-gray-800 mb-4' }, '⚠️ Типовые неисправности'),
      h('div', { className: 'bg-white rounded-2xl shadow-lg p-6' },
        h('ul', { className: 'space-y-2' },
          ...device.common_issues.map((issue, idx) =>
            h('li', { key: idx, className: 'flex items-start gap-3' },
              h('span', { className: 'text-red-500' }, '•'),
              h('span', { className: 'text-gray-700' }, issue)
            )
          )
        )
      )
    ),

    // Tools needed
    device.tools_needed?.length > 0 && h('div', { className: 'mt-6' },
      h('h2', { className: 'text-xl font-bold text-gray-800 mb-4' }, '🔧 Инструменты'),
      h('div', { className: 'flex flex-wrap gap-2' },
        ...device.tools_needed.map((tool, idx) =>
          h('span', { key: idx, className: 'px-4 py-2 bg-white rounded-xl shadow text-sm' }, tool)
        )
      )
    ),

    // Difficulty
    h('div', { className: 'mt-6 flex flex-col md:flex-row gap-4' },
      device.repair_difficulty && h('div', { className: 'flex-1 bg-white rounded-2xl shadow-lg p-6 text-center' },
        h('p', { className: 'text-sm text-gray-500 mb-1' }, 'Сложность'),
        h('p', { className: cn('text-2xl font-bold',
          device.repair_difficulty.includes('Средняя') ? 'text-amber-600' :
          device.repair_difficulty.includes('Сложная') ? 'text-orange-600' :
          device.repair_difficulty.includes('Экстремально') ? 'text-red-600' : 'text-green-600'
        ) }, device.repair_difficulty)
      ),
      device.repair_time && h('div', { className: 'flex-1 bg-white rounded-2xl shadow-lg p-6 text-center' },
        h('p', { className: 'text-sm text-gray-500 mb-1' }, 'Время ремонта'),
        h('p', { className: 'text-2xl font-bold text-blue-600' }, device.repair_time)
      )
    ),

    device.intake_notes && h('div', { className: 'mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-blue-800' },
      h('h3', { className: 'font-semibold text-blue-900 mb-2' }, 'Заметки при приёмке'),
      h('p', null, device.intake_notes)
    ),

    device.service_notes && h('div', { className: 'mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-6 text-sm text-amber-800' },
      h('h3', { className: 'font-semibold text-amber-900 mb-2' }, 'Внимание для техника'),
      h('p', null, device.service_notes)
    ),

    // Modals
    showMeasurements && h(MeasurementsPanel, { measurementsData, onClose: () => setShowMeasurements(false) }),
    selectedChip && h(ChipDetailsModal, { chip: selectedChip, icData, onClose: () => setSelectedChip(null) })
  );
};

// ===== REPAIR KNOWLEDGE PANEL =====
const RepairKnowledgePanel = ({ data, onClose }) => {
  const [activeTab, setActiveTab] = useState('tristar');
  
  if (!data) return null;
  
  const tabs = [
    { key: 'tristar', name: '⚡ Tristar/Hydra', icon: '⚡' },
    { key: 'smc', name: '💻 SMC MacBook', icon: '💻' },
    { key: 'touch', name: '👆 Touch IC iPad', icon: '👆' },
    { key: 'baseband', name: '📶 Baseband', icon: '📶' },
    { key: 'common', name: '🔧 Частые ремонты', icon: '🔧' }
  ];
  
  const renderTristarContent = () => {
    const tristar = data.tristar_hydra?.tristar_hydra_diagnosis;
    if (!tristar) return null;
    
    return h('div', { className: 'space-y-6' },
      h(Surface, { className: 'p-6 border border-indigo-100/60 bg-gradient-to-br from-white via-indigo-50/30 to-white' },
        h('h3', { className: 'text-lg font-bold text-slate-800 mb-4' }, '🔌 Симптомы Tristar/Hydra проблем'),
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
          h('div', { className: 'space-y-2' },
            h('p', { className: cn(design.sectionTitle) }, 'Основные симптомы'),
            h('ul', { className: 'space-y-1' },
              ...tristar.symptoms.common.map((symptom, idx) =>
                h('li', { key: idx, className: 'flex items-start gap-2 text-sm text-slate-700' },
                  h('span', { className: 'text-red-500 mt-0.5' }, '•'),
                  symptom
                )
              )
            )
          ),
          h('div', { className: 'space-y-2' },
            h('p', { className: cn(design.sectionTitle) }, 'Причины поломки'),
            h('ul', { className: 'space-y-1' },
              ...tristar.causes.map((cause, idx) =>
                h('li', { key: idx, className: 'flex items-start gap-2 text-sm text-slate-700' },
                  h('span', { className: 'text-amber-500 mt-0.5' }, '⚠'),
                  cause
                )
              )
            )
          )
        )
      ),
      
      h(Surface, { className: 'p-6 border border-purple-100/60 bg-gradient-to-br from-white via-purple-50/30 to-white' },
        h('h3', { className: 'text-lg font-bold text-slate-800 mb-4' }, '🔍 Диагностические шаги'),
        h('ol', { className: 'space-y-2' },
          ...tristar.symptoms.diagnostic_steps.map((step, idx) =>
            h('li', { key: idx, className: 'flex items-start gap-3' },
              h('span', { className: 'w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0' }, idx + 1),
              h('span', { className: 'text-sm text-slate-700' }, step)
            )
          )
        )
      ),
      
      h(Surface, { className: 'p-6 border border-emerald-100/60 bg-gradient-to-br from-white via-emerald-50/30 to-white' },
        h('h3', { className: 'text-lg font-bold text-slate-800 mb-4' }, '🔧 Советы по ремонту'),
        h('div', { className: 'space-y-3' },
          ...tristar.repair_tips.map((tip, idx) =>
            h('div', { key: idx, className: 'flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-emerald-100/60' },
              h('span', { className: 'text-emerald-500 text-lg' }, '💡'),
              h('span', { className: 'text-sm text-slate-700' }, tip)
            )
          )
        )
      ),
      
      tristar.compatible_donors && h(Surface, { className: 'p-6 border border-indigo-100/60 bg-gradient-to-br from-white via-indigo-50/30 to-white' },
        h('h3', { className: 'text-lg font-bold text-slate-800 mb-4' }, '📱 Совместимые доноры'),
        h('div', { className: 'space-y-2' },
          ...Object.entries(tristar.compatible_donors).map(([model, donors]) =>
            h('div', { key: model, className: 'p-3 rounded-xl bg-white/80 border border-indigo-100/60' },
              h('p', { className: 'text-sm font-semibold text-indigo-700 mb-1' }, model.replace('_', ' ')),
              h('p', { className: 'text-xs text-slate-600' }, donors.join(' • '))
            )
          )
        )
      )
    );
  };
  
  const renderSMCContent = () => {
    const smc = data.smc_failures?.smc_failures;
    if (!smc) return null;
    
    return h('div', { className: 'space-y-6' },
      h(Surface, { className: 'p-6 border border-red-100/60 bg-gradient-to-br from-white via-red-50/30 to-white' },
        h('h3', { className: 'text-lg font-bold text-slate-800 mb-4' }, '⚠️ Симптомы SMC проблем'),
        h('div', { className: 'grid grid-cols-2 md:grid-cols-3 gap-2' },
          ...smc.primary_symptoms.map((symptom, idx) =>
            h('div', { key: idx, className: 'p-3 rounded-xl bg-white/80 border border-red-100/60 text-sm text-slate-700' },
              h('span', { className: 'text-red-500 mr-2' }, '⚡'),
              symptom
            )
          )
        )
      ),
      
      h(Surface, { className: 'p-6 border border-blue-100/60 bg-gradient-to-br from-white via-blue-50/30 to-white' },
        h('h3', { className: 'text-lg font-bold text-slate-800 mb-4' }, '📊 Диагностический подход'),
        h('div', { className: 'space-y-3' },
          ...Object.entries(smc.diagnostic_approach).map(([key, value]) =>
            h('div', { key, className: 'p-4 rounded-xl bg-white/80 border border-blue-100/60' },
              h('p', { className: 'text-sm font-semibold text-blue-700 mb-1' }, key.toUpperCase().replace(/_/g, ' ')),
              h('p', { className: 'text-sm text-slate-600 font-mono' }, value)
            )
          )
        )
      )
    );
  };
  
  const renderTouchContent = () => {
    const touch = data.touch_ic?.ipad_touch_problems;
    if (!touch) return null;
    
    return h('div', { className: 'space-y-6' },
      h(Surface, { className: 'p-6 border border-purple-100/60 bg-gradient-to-br from-white via-purple-50/30 to-white' },
        h('h3', { className: 'text-lg font-bold text-slate-800 mb-4' }, '📱 Затронутые модели'),
        h('div', { className: 'space-y-3' },
          ...Object.entries(touch.affected_models).map(([model, info]) =>
            h('div', { key: model, className: 'p-4 rounded-xl bg-white/80 border border-purple-100/60' },
              h('p', { className: 'text-sm font-semibold text-purple-700 mb-2' }, model.replace(/_/g, ' ')),
              h('p', { className: 'text-xs text-slate-600 mb-1' }, `Touch ICs: ${info.touch_ics.join(', ')}`),
              h('p', { className: 'text-xs text-slate-500' }, info.common_failure),
              h('span', { className: cn('inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold',
                info.repair_complexity === 'Высокая' ? 'bg-orange-100 text-orange-700' :
                info.repair_complexity === 'Очень высокая' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              ) }, `Сложность: ${info.repair_complexity}`)
            )
          )
        )
      )
    );
  };
  
  const renderBasebandContent = () => {
    const baseband = data.baseband?.baseband_failures;
    if (!baseband) return null;
    
    return h('div', { className: 'space-y-6' },
      h(Surface, { className: 'p-6 border border-orange-100/60 bg-gradient-to-br from-white via-orange-50/30 to-white' },
        h('h3', { className: 'text-lg font-bold text-slate-800 mb-4' }, '📶 Симптомы Baseband проблем'),
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
          h('div', null,
            h('p', { className: cn(design.sectionTitle, 'mb-2') }, 'No Service'),
            h('ul', { className: 'space-y-1' },
              ...baseband.symptoms.no_service.map((symptom, idx) =>
                h('li', { key: idx, className: 'text-sm text-slate-700' }, `• ${symptom}`)
              )
            )
          ),
          h('div', null,
            h('p', { className: cn(design.sectionTitle, 'mb-2') }, 'Частичный сбой'),
            h('ul', { className: 'space-y-1' },
              ...baseband.symptoms.partial_failure.map((symptom, idx) =>
                h('li', { key: idx, className: 'text-sm text-slate-700' }, `• ${symptom}`)
              )
            )
          )
        )
      ),
      
      baseband.iphone_7_special && h(Surface, { className: 'p-6 border border-blue-100/60 bg-gradient-to-br from-white via-blue-50/30 to-white' },
        h('h3', { className: 'text-lg font-bold text-slate-800 mb-4' }, '📱 iPhone 7 особенности'),
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
          h('div', { className: 'p-4 rounded-xl bg-white/80 border border-green-100/60' },
            h('p', { className: 'text-sm font-semibold text-green-700 mb-2' }, 'Qualcomm версия'),
            h('p', { className: 'text-xs text-slate-600' }, `Модели: ${baseband.iphone_7_special.qualcomm_version.model}`),
            h('p', { className: 'text-xs text-slate-600' }, `Baseband: ${baseband.iphone_7_special.qualcomm_version.baseband}`),
            h('p', { className: 'text-xs text-green-600 font-semibold mt-1' }, '✓ Ремонтопригодно')
          ),
          h('div', { className: 'p-4 rounded-xl bg-white/80 border border-red-100/60' },
            h('p', { className: 'text-sm font-semibold text-red-700 mb-2' }, 'Intel версия'),
            h('p', { className: 'text-xs text-slate-600' }, `Модели: ${baseband.iphone_7_special.intel_version.model}`),
            h('p', { className: 'text-xs text-slate-600' }, `Baseband: ${baseband.iphone_7_special.intel_version.baseband}`),
            h('p', { className: 'text-xs text-red-600 font-semibold mt-1' }, '✗ Сложно ремонтировать')
          )
        )
      )
    );
  };
  
  const renderCommonRepairs = () => {
    const repairs = data.common_repairs?.common_repairs_2024;
    if (!repairs) return null;
    
    return h('div', { className: 'space-y-6' },
      ...Object.entries(repairs).map(([repairType, info]) =>
        h(Surface, { key: repairType, className: 'p-6 border border-indigo-100/60 bg-gradient-to-br from-white via-indigo-50/30 to-white' },
          h('h3', { className: 'text-lg font-bold text-slate-800 mb-4' }, 
            repairType === 'battery_replacement' ? '🔋 Замена батареи' :
            repairType === 'screen_replacement' ? '📱 Замена экрана' :
            '🔌 Замена разъема зарядки'
          ),
          h('div', { className: 'space-y-3' },
            ...Object.entries(info).map(([device, details]) =>
              h('div', { key: device, className: 'p-4 rounded-xl bg-white/80 border border-indigo-100/60' },
                h('p', { className: 'text-sm font-semibold text-indigo-700 mb-2' }, device.replace(/_/g, ' ')),
                h('div', { className: 'grid grid-cols-2 gap-2 text-xs' },
                  h('div', { className: 'text-slate-600' },
                    h('span', { className: 'font-semibold' }, 'Сложность: '),
                    details.difficulty
                  ),
                  h('div', { className: 'text-slate-600' },
                    h('span', { className: 'font-semibold' }, 'Время: '),
                    details.time
                  )
                ),
                details.tips && h('div', { className: 'mt-2' },
                  h('p', { className: 'text-xs font-semibold text-slate-500 mb-1' }, 'Советы:'),
                  h('ul', { className: 'space-y-0.5' },
                    ...details.tips.map((tip, idx) =>
                      h('li', { key: idx, className: 'text-xs text-slate-600' }, `• ${tip}`)
                    )
                  )
                ),
                details.warning && h('p', { className: 'text-xs text-red-600 mt-2' }, `⚠️ ${details.warning}`)
              )
            )
          )
        )
      )
    );
  };
  
  return h('div', { className: 'fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-indigo-100/40 bg-gradient-to-br from-white via-indigo-50/30 to-white shadow-[0_28px_80px_rgba(79,70,229,0.15)] backdrop-blur' },
      h('div', { className: 'bg-white/85 backdrop-blur-sm p-6 border-b border-white/60 flex items-center justify-between' },
        h('div', null,
          h('h2', { className: 'text-2xl font-bold text-slate-800' }, '🎓 База знаний по ремонту'),
          h('p', { className: 'text-slate-500 text-sm' }, 'Диагностика и решения частых проблем')
        ),
        h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/70 hover:bg-white text-slate-600 text-xl shadow-sm border border-white/70' }, '×')
      ),
      
      h('div', { className: 'bg-white/80 backdrop-blur-sm px-6 py-3 border-b border-white/60 flex gap-2 overflow-x-auto' },
        ...tabs.map(tab =>
          h('button', {
            key: tab.key,
            onClick: () => setActiveTab(tab.key),
            className: cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
              activeTab === tab.key 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                : 'bg-white/70 text-slate-600 hover:bg-white'
            )
          }, tab.name)
        )
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto p-6' },
        activeTab === 'tristar' && renderTristarContent(),
        activeTab === 'smc' && renderSMCContent(),
        activeTab === 'touch' && renderTouchContent(),
        activeTab === 'baseband' && renderBasebandContent(),
        activeTab === 'common' && renderCommonRepairs()
      )
    )
  );
};

// ===== MAIN APP =====
const RepairTool = () => {
  const [devices, setDevices] = useState([]);
  const [icData, setIcData] = useState(null);
  const [measurementsData, setMeasurementsData] = useState(null);
  const [connectorData, setConnectorData] = useState(null);
  const [boardData, setBoardData] = useState(null);
  const [macServiceData, setMacServiceData] = useState(null);
  const [repairKnowledge, setRepairKnowledge] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showConnectorPanel, setShowConnectorPanel] = useState(false);
  const [showBoardPanel, setShowBoardPanel] = useState(false);
  const [showMacServicePanel, setShowMacServicePanel] = useState(false);
  const [showIntakeChecklist, setShowIntakeChecklist] = useState(false);
  const [showRepairKnowledge, setShowRepairKnowledge] = useState(false);
  const [activeRole, setActiveRole] = useState('manager');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/devices.json').then(res => res.json()),
      fetch('/data/ic_compatibility.json').then(res => res.json()),
      fetch('/data/measurements.json').then(res => res.json()),
      fetch('/data/connectors.json').then(res => res.json()),
      fetch('/data/mac_board_reference.json').then(res => res.json()),
      fetch('/data/mac_service_prices.json').then(res => res.json()),
      fetch('/data/repair_knowledge.json').then(res => res.json()).catch(() => null)
    ])
    .then(([devicesData, icCompatData, measData, connectorsJson, boardsJson, macServiceJson, repairKnowledgeJson]) => {
      setDevices(devicesData);
      setIcData(icCompatData);
      setMeasurementsData(measData);
      setConnectorData(connectorsJson);
      setBoardData(boardsJson);
      setMacServiceData(macServiceJson);
      setRepairKnowledge(repairKnowledgeJson);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error:', err);
      setLoading(false);
    });
  }, []);

  const filteredDevices = useMemo(() => {
    if (!searchTerm) return devices;
    const term = searchTerm.toLowerCase();
    return devices.filter(device => 
      (device.name || '').toLowerCase().includes(term) ||
      (device.model || '').toLowerCase().includes(term) ||
      (device.category || '').toLowerCase().includes(term) ||
      (device.a_number || '').toLowerCase().includes(term)
    );
  }, [searchTerm, devices]);

  const deviceStats = useMemo(() => {
    const stats = {
      total: devices.length,
      byCategory: {}
    };
    devices.forEach(device => {
      const category = device.category || 'Неизвестно';
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    });
    return stats;
  }, [devices]);

  const roleCopy = {
    manager: {
      title: 'Приёмка устройств Apple',
      subtitle: 'Фиксируйте состояние, комплектацию и договорённости, передайте технику всю нужную информацию.',
      highlight: 'Менеджер приёмки'
    },
    technician: {
      title: 'Рабочее место техника',
      subtitle: 'Диагностика, замеры, справочники по разъёмам и платам для точного ремонта.',
      highlight: 'Технический режим'
    }
  };

  const isManager = activeRole === 'manager';

  if (loading) {
    return h('div', { className: 'min-h-screen bg-gray-100 flex items-center justify-center' },
      h('div', { className: 'text-center' },
        h('div', { className: 'w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4' }),
        h('p', { className: 'text-gray-600' }, 'Загрузка...')
      )
    );
  }

  if (selectedDevice) {
    return h('div', { className: 'min-h-screen bg-gray-100 p-6' },
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
    // Hero Section
    h('div', { className: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-14 px-4 sm:px-6' },
      h('div', { className: 'max-w-6xl mx-auto text-center space-y-6' },
        h('div', { className: 'flex justify-center gap-3 flex-wrap' },
          ['manager', 'technician'].map(role =>
            h('button', {
              key: role,
              onClick: () => setActiveRole(role),
              className: cn(
                'px-4 py-2 rounded-full border text-sm font-semibold transition-all',
                activeRole === role
                  ? 'bg-white text-blue-600 border-white shadow-lg'
                  : 'bg-white/10 text-white border-white/40 hover:bg-white/20'
              )
            }, role === 'manager' ? 'Режим приёмки' : 'Режим техника')
          )
        ),
        h('span', { className: 'inline-flex items-center justify-center px-3 py-1 rounded-full border border-white/40 bg-white/15 text-xs uppercase tracking-wider text-white/90 backdrop-blur-sm' }, roleCopy[activeRole].highlight),
        h('h1', { className: 'text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight' }, '🛠️ Apple Intake Desk'),
        h('p', { className: 'text-base sm:text-lg lg:text-xl text-blue-100 mx-auto max-w-3xl' }, roleCopy[activeRole].subtitle),
        h('div', { className: 'flex gap-3 justify-center flex-wrap text-xs sm:text-sm' },
          h('span', { className: 'inline-flex items-center px-4 py-2 rounded-full border border-white/35 bg-white/15 text-white/90 backdrop-blur-sm' }, `Всего устройств: ${deviceStats.total}`),
          ...Object.entries(deviceStats.byCategory).map(([category, count]) =>
            h('span', { key: category, className: 'inline-flex items-center px-4 py-2 rounded-full border border-white/30 bg-white/10 text-white/85 backdrop-blur-sm' }, `${category}: ${count}`)
          )
        )
      )
    ),

    // Main Content
    h('div', { className: 'max-w-6xl mx-auto px-4 sm:px-6 -mt-8 pb-16' },
      // Search Bar
      h(Surface, {
        className: 'mb-8 p-2 border border-blue-100/70 bg-gradient-to-r from-white via-blue-50/30 to-white/90'
      },
        h('div', { className: 'relative' },
          h('input', {
            type: 'text',
            placeholder: 'Поиск по модели, имени или категории...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: 'w-full px-6 py-4 pl-14 rounded-2xl border border-transparent bg-white/80 backdrop-blur focus:border-blue-500 focus:outline-none text-lg text-slate-700 placeholder:text-slate-400'
          }),
          h('div', { className: 'absolute left-5 top-1/2 -translate-y-1/2 text-blue-400' }, h(SearchIcon))
        )
      ),

      // Quick Access Bento Cards
      h('div', { className: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8' },
        h(BentoCard, {
          name: isManager ? 'Приёмочный чек-лист' : 'Диагностика и замеры',
          description: isManager
            ? 'Пошагово зафиксируйте внешнее состояние, комплектацию и договорённости с клиентом.'
            : 'Шины питания, Boot Sequence и чек-листы неисправностей для точной диагностики.',
          Icon: isManager ? ClipboardIcon : MeasureIcon,
          background: isManager ? h(IntakeBackground) : h(MeasurementsBackground),
          onClick: () => (isManager ? setShowIntakeChecklist(true) : setShowMeasurements(true)),
          cta: isManager ? 'Открыть чек-лист' : 'Открыть диагностику',
          className: 'xl:col-span-2',
          badge: isManager ? 'Менеджер' : 'Техника'
        }),
        h(BentoCard, {
          name: 'Порты и кабели',
          description: isManager
            ? 'Подсказки для объяснения клиенту: что такое Tristar, почему не заряжается и какие кабели нужны.'
            : 'Pinout Lightning, IDBUS, USB-C PD профили и диагностика Tristar/Hydra.',
          Icon: CableIcon,
          background: h(ChargingBackground),
          onClick: () => setShowConnectorPanel(true),
          cta: 'Открыть справочник',
          className: 'xl:col-span-1',
          badge: 'Reference'
        }),
        h(BentoCard, {
          name: 'Справочник плат Mac',
          description: isManager
            ? 'BoardProduct, A-number и модельные коды — быстрый поиск соответствий в заказе.'
            : 'Ревизии, CPU/GPU/RAM и ограничения macOS для каждой платы.',
          Icon: CpuIcon,
          background: h(BoardBackground),
          onClick: () => setShowBoardPanel(true),
          cta: 'Открыть справочник',
          className: 'xl:col-span-2',
          badge: 'PRO'
        }),
        h(BentoCard, {
          name: 'Прайс на ремонт Mac',
          description: isManager
            ? 'Сверьте цены и найдите подозрительные разбросы перед согласованием с клиентом.'
            : 'Контроль прайса, фильтр по сериям и быстрый поиск аномалий для мастера.',
          Icon: WrenchIcon,
          background: h(PricingBackground),
          onClick: () => setShowMacServicePanel(true),
          cta: 'Открыть прайс',
          className: 'xl:col-span-1',
          badge: 'Цены'
        }),
        h(BentoCard, {
          name: 'База знаний ремонта',
          description: 'Tristar/Hydra, SMC, Touch IC, Baseband - диагностика и решения частых проблем.',
          Icon: PhoneIcon,
          background: h(DonorBackground),
          onClick: () => setShowRepairKnowledge(true),
          cta: 'Открыть базу знаний',
          className: 'xl:col-span-1',
          badge: 'NEW'
        })
      ),

      // Results count
      h('p', { className: 'text-gray-500 mb-4' }, `Найдено: ${filteredDevices.length} устройств`),

      // Device Grid
      h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-12' },
        ...filteredDevices.map(device =>
          h(AppDeviceCard, {
            key: device.id,
            device,
            onSelect: setSelectedDevice
          })
        )
      )
    ),

    // Modals
    showIntakeChecklist && h(IntakeChecklistModal, { onClose: () => setShowIntakeChecklist(false) }),
    showMeasurements && h(MeasurementsPanel, { measurementsData, onClose: () => setShowMeasurements(false) }),
    showConnectorPanel && connectorData && h(ConnectorPanel, { data: connectorData, onClose: () => setShowConnectorPanel(false) }),
    showMacServicePanel && macServiceData && h(MacServicePanel, { data: macServiceData, onClose: () => setShowMacServicePanel(false) }),
    showBoardPanel && boardData && h(BoardReferencePanel, { data: boardData, onClose: () => setShowBoardPanel(false) }),
    showRepairKnowledge && repairKnowledge && h(RepairKnowledgePanel, { data: repairKnowledge, onClose: () => setShowRepairKnowledge(false) })
  );
};

// Mount
ReactDOM.createRoot(document.getElementById('app')).render(h(RepairTool));
