// Apple Intake Desk - Main Application v4.0
// Full-featured repair tool with diagnostics, error codes, and calculators
const { useState, useMemo, useEffect, createElement: h } = React;

// ===== UTILITY FUNCTIONS =====
const cn = (...classes) => classes.filter(Boolean).join(' ');

const design = {
  surface: 'relative overflow-hidden rounded-3xl border border-indigo-100/40 bg-white/80 shadow-[0_18px_45px_rgba(79,70,229,0.06)] backdrop-blur-sm',
  interactive: 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(79,70,229,0.12)]',
  tag: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50/70 text-indigo-700 border border-indigo-200/60 backdrop-blur-sm',
};

const Surface = ({ as = 'div', className = '', children, ...props }) =>
  h(as, { className: cn(design.surface, className), ...props }, children);

const formatPrice = (price, currency = 'USD') => {
  if (!price && price !== 0) return '—';
  return currency === 'USD' ? `$${Number(price).toFixed(0)}` : `${Number(price).toLocaleString('ru-RU')} ₴`;
};

// ===== ICONS =====
const SearchIcon = () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
);

const ArrowRightIcon = () => h('svg', { className: 'w-4 h-4 ml-2', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M9 5l7 7-7 7' })
);

const CpuIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' })
);

const TagIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' })
);

const WrenchIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
);

const AlertIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' })
);

const CalculatorIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' })
);

const BookIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' })
);

const ChipIcon = ({ className = 'w-12 h-12' }) => h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5, d: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' })
);

const getCategoryIcon = (category) => {
  const icons = { 'iPhone': '📱', 'iPad': '📟', 'Mac': '💻', 'MacBook': '💻', 'Apple Watch': '⌚', 'AirPods': '🎧' };
  return icons[category] || '🔧';
};

// ===== DEVICE-SPECIFIC DATA HELPERS =====
const getConnectorType = (device) => {
  const year = device.year || 2020;
  const category = device.category;
  const name = device.name?.toLowerCase() || '';
  
  if (category === 'Mac' || category === 'MacBook') return 'usbc';
  if (category === 'iPad') {
    if (name.includes('pro') && year >= 2018) return 'usbc';
    if (name.includes('air') && year >= 2020) return 'usbc';
    if (name.includes('mini') && year >= 2021) return 'usbc';
    if (year >= 2022) return 'usbc';
    return 'lightning';
  }
  if (category === 'iPhone') {
    if (year >= 2023) return 'usbc';
    return 'lightning';
  }
  return 'lightning';
};

const getChargingICDiagnostics = (device) => {
  const icMain = device.charging_ic?.main || '';
  const connectorType = getConnectorType(device);
  
  if (icMain.includes('SN2400') || icMain.includes('1610')) {
    return {
      icType: 'Tristar U2',
      icModel: icMain,
      symptoms: ['Не заряжается совсем', '"Аксессуар не поддерживается"', 'Заряжается только от ПК', 'Не определяется в iTunes', 'Греется возле разъёма'],
      diagnostics: [
        { name: 'Ток потребления', normal: '> 0.1A', fault: '0.00A = Tristar' },
        { name: 'Диодный режим D+', normal: '0.450-0.650V', fault: '< 0.300V = КЗ' },
        { name: 'Диодный режим D-', normal: '0.450-0.650V', fault: '< 0.300V = КЗ' },
        { name: 'PP5V0_USB', normal: '5.0V', fault: '0V = нет питания USB' }
      ],
      notes: 'Tristar нельзя перепаять - только замена. Использовать Amtech 559, фен 380-400°C'
    };
  }
  
  if (icMain.includes('SN2611') || icMain.includes('Hydra')) {
    const isUSBC = connectorType === 'usbc';
    return {
      icType: isUSBC ? 'USB-C Hydra' : 'Hydra',
      icModel: icMain,
      symptoms: ['Не заряжается', isUSBC ? 'USB-C не определяется' : '"Аксессуар не поддерживается"', 'Медленная зарядка', 'Не передаёт данные', isUSBC ? 'Нет быстрой зарядки PD' : 'Греется при зарядке'],
      diagnostics: [
        { name: 'Ток потребления', normal: isUSBC ? '> 0.5A (PD)' : '> 0.1A', fault: '0.00A = Hydra' },
        { name: isUSBC ? 'CC1/CC2' : 'Диодный режим D+', normal: isUSBC ? '0.200-0.400V' : '0.500-0.700V', fault: 'КЗ или обрыв' },
        { name: 'VBUS', normal: isUSBC ? '5V/9V/15V/20V' : '5V', fault: '0V = нет питания' },
        { name: 'PP_VCC_MAIN', normal: '3.7-4.2V', fault: '< 3.0V = проблема PMIC' }
      ],
      notes: isUSBC ? 'USB-C PD до 27W (iPhone 15+). Проверить CC линии и VBUS' : 'Hydra управляет зарядкой и USB. Проверить конденсаторы вокруг IC'
    };
  }
  
  if (icMain.includes('343S')) {
    return {
      icType: 'iPad Charging Controller',
      icModel: icMain,
      symptoms: ['Не заряжается', 'Очень медленная зарядка', 'Показывает зарядку, но % не растёт', 'Греется при зарядке'],
      diagnostics: [
        { name: 'Ток потребления', normal: '> 1.5A (USB-C)', fault: '< 0.5A' },
        { name: 'PP_BATT_VCC', normal: '3.7-4.35V', fault: '< 3.0V' },
        { name: 'VBUS', normal: '5V/9V/15V/20V', fault: '0V или нестабильно' }
      ],
      notes: 'iPad использует USB-C PD. Проверить кабель и адаптер сначала'
    };
  }
  
  return {
    icType: 'USB-C Controller',
    icModel: icMain || 'CD3217/CD3218',
    symptoms: ['Не заряжается', 'Порт не работает', 'Нет видео через USB-C'],
    diagnostics: [
      { name: 'CC1/CC2', normal: '0.2-0.4V', fault: 'КЗ к GND' },
      { name: 'VBUS', normal: '5V-20V', fault: '0V' }
    ],
    notes: 'Mac использует Thunderbolt/USB-C. Проверить все порты'
  };
};

const getPowerRails = (device) => {
  const category = device.category;
  
  if (category === 'iPhone') {
    return [
      { name: 'PP_BATT_VCC', voltage: '3.7-4.35V', desc: 'Напряжение батареи', diode: '0.350-0.450V', short: '< 0.100V' },
      { name: 'PP_VCC_MAIN', voltage: '3.7-4.2V', desc: 'Основная шина питания', diode: '0.300-0.400V', short: '< 0.050V' },
      { name: 'PP1V8_SDRAM', voltage: '1.8V', desc: 'Питание памяти', diode: '0.350-0.500V', short: '< 0.100V' },
      { name: 'PP_CPU', voltage: '0.85-1.1V', desc: 'Питание процессора', diode: '0.200-0.350V', short: '< 0.050V' },
      { name: 'PP3V0_NAND', voltage: '3.0V', desc: 'Питание NAND', diode: '0.400-0.550V', short: '< 0.150V' },
      { name: 'PP5V0_USB', voltage: '5.0V', desc: 'USB питание (от кабеля)', diode: '0.500-0.650V', short: '< 0.200V' }
    ];
  }
  
  if (category === 'iPad') {
    return [
      { name: 'PP_BATT_VCC', voltage: '3.7-4.35V', desc: 'Напряжение батареи', diode: '0.350-0.450V', short: '< 0.100V' },
      { name: 'PP_VCC_MAIN', voltage: '3.7-4.2V', desc: 'Основная шина', diode: '0.300-0.400V', short: '< 0.050V' },
      { name: 'PP3V3_S5', voltage: '3.3V', desc: 'Standby питание', diode: '0.400-0.550V', short: '< 0.150V' },
      { name: 'PP1V8_S3', voltage: '1.8V', desc: 'Питание RAM', diode: '0.350-0.500V', short: '< 0.100V' },
      { name: 'PPVCC_GPU', voltage: '0.9-1.1V', desc: 'Питание GPU', diode: '0.200-0.350V', short: '< 0.050V' }
    ];
  }
  
  return [
    { name: 'PPBUS_G3H', voltage: '12.6V', desc: 'Основная шина от адаптера', diode: '0.450-0.600V', short: '< 0.150V' },
    { name: 'PP3V42_G3H', voltage: '3.42V', desc: 'Always-on питание', diode: '0.400-0.550V', short: '< 0.100V' },
    { name: 'PP5V_S5', voltage: '5.0V', desc: 'S5 state питание', diode: '0.500-0.650V', short: '< 0.200V' },
    { name: 'PP3V3_S5', voltage: '3.3V', desc: 'S5 standby', diode: '0.400-0.550V', short: '< 0.150V' },
    { name: 'PPVCORE_S0', voltage: '0.8-1.2V', desc: 'CPU Core', diode: '0.150-0.300V', short: '< 0.050V' }
  ];
};

const getConnectorPinout = (device) => {
  const connType = getConnectorType(device);
  
  if (connType === 'lightning') {
    return {
      name: 'Lightning',
      icon: '⚡',
      pins: [
        { num: 1, name: 'GND', desc: 'Земля' },
        { num: 2, name: 'L0p / D+', desc: 'USB Data+ / DP AUX+' },
        { num: 3, name: 'L0n / D-', desc: 'USB Data- / DP AUX-' },
        { num: 4, name: 'ID0', desc: 'ID аксессуара' },
        { num: 5, name: 'PWR', desc: 'Питание (до 12W)' },
        { num: 6, name: 'L1n', desc: 'High-speed пара' },
        { num: 7, name: 'L1p', desc: 'High-speed пара' },
        { num: 8, name: 'ID1', desc: 'ID аксессуара' }
      ],
      notes: ['Tristar определяет ориентацию кабеля', 'Максимум 2.4A (12W) зарядка', 'USB 2.0 скорость передачи']
    };
  }
  
  return {
    name: 'USB-C',
    icon: '🔌',
    pins: [
      { num: 'A1/B1', name: 'GND', desc: 'Земля' },
      { num: 'A4/B4', name: 'VBUS', desc: 'Питание 5-20V' },
      { num: 'A5', name: 'CC1', desc: 'Config Channel 1' },
      { num: 'B5', name: 'CC2', desc: 'Config Channel 2' },
      { num: 'A6/B6', name: 'D+/D-', desc: 'USB 2.0 Data' },
      { num: 'A2-3/B2-3', name: 'TX/RX', desc: 'SuperSpeed пары' },
      { num: 'A7/B7', name: 'SBU1/2', desc: 'Sideband (аудио)' }
    ],
    notes: [
      `USB PD до ${device.category === 'Mac' ? '140W' : '27W'}`,
      device.category === 'iPhone' && device.name?.includes('Pro') ? 'USB 3.0 (до 10Gbps)' : 'USB 2.0 скорость',
      'CC линии определяют роль и мощность'
    ]
  };
};

// ===== BACKGROUNDS =====
const PartsBackground = () => h('div', { className: 'absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-100' });
const PricingBackground = () => h('div', { className: 'absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-100' });
const BoardBackground = () => h('div', { className: 'absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-100' });
const ErrorBackground = () => h('div', { className: 'absolute inset-0 bg-gradient-to-br from-red-50 to-rose-100' });
const CalcBackground = () => h('div', { className: 'absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-100' });
const KnowledgeBackground = () => h('div', { className: 'absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100' });

// ===== BENTO CARD =====
const BentoCard = ({ name, className, background, Icon, description, onClick, cta, badge }) => {
  return h('div', {
    onClick,
    className: cn(
      'group relative col-span-full sm:col-span-1 flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer',
      'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
      'transform-gpu hover:scale-[1.02] transition-all duration-300 min-h-[160px]',
      className
    )
  },
    background && h('div', { className: 'absolute inset-0 opacity-50' }, background),
    badge && h('div', { className: 'absolute top-3 right-3 z-20' },
      h('span', { className: 'px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-lg' }, badge)
    ),
    h('div', { className: 'pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-4 transition-all duration-300 group-hover:-translate-y-8' },
      h(Icon, { className: 'h-10 w-10 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75' }),
      h('h3', { className: 'text-lg font-semibold text-neutral-700 mt-2' }, name),
      h('p', { className: 'text-neutral-500 text-xs' }, description)
    ),
    h('div', { className: 'pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100' },
      h('button', { className: 'pointer-events-auto flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-xs font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg' },
        cta,
        h(ArrowRightIcon)
      )
    )
  );
};

// ===== DEVICE CARD =====
const DeviceCard = ({ device, onSelect }) => {
  const aNumbers = (device.model || '').split(',').map(s => s.trim()).filter(Boolean);
  const boardNumbers = (device.board_numbers || []).filter(Boolean);
  const hasOfficialPrices = device.official_service_prices && Object.keys(device.official_service_prices).length > 0;
  const hasServiceParts = device.service_parts && Object.keys(device.service_parts).length > 0;
  const icon = getCategoryIcon(device.category);
  const connType = getConnectorType(device);

  return h(Surface, {
    className: cn(design.interactive, 'cursor-pointer p-5 flex flex-col gap-3 border border-indigo-100/60'),
    onClick: () => onSelect?.(device)
  },
    h('div', { className: 'flex items-start justify-between gap-3' },
      h('div', { className: 'flex-1' },
        h('div', { className: 'flex flex-wrap gap-1.5 mb-2' },
          h('span', { className: cn(design.tag, 'text-xs py-0.5') }, device.category || 'Устройство'),
          h('span', { className: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600' }, 
            connType === 'usbc' ? '🔌 USB-C' : '⚡ Lightning'
          ),
          hasOfficialPrices && h('span', { className: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700' }, '💵'),
          hasServiceParts && h('span', { className: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700' }, '🔧')
        ),
        h('h3', { className: 'text-base font-bold text-slate-900' }, device.name)
      ),
      h('span', { className: 'text-2xl' }, icon)
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
        h('p', { className: 'font-semibold text-slate-700 truncate' }, device.processor)
      )
    ),
    
    hasOfficialPrices && h('div', { className: 'flex flex-wrap gap-2 pt-2 border-t border-slate-100' },
      device.official_service_prices.display && h('span', { className: 'text-xs text-slate-600' }, 
        `📱 ${formatPrice(typeof device.official_service_prices.display === 'object' ? device.official_service_prices.display.price_usd : device.official_service_prices.display)}`),
      device.official_service_prices.battery && h('span', { className: 'text-xs text-slate-600' }, 
        `🔋 ${formatPrice(typeof device.official_service_prices.battery === 'object' ? device.official_service_prices.battery.price_usd : device.official_service_prices.battery)}`)
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
      return article.toLowerCase().includes(term) || (info.description || '').toLowerCase().includes(term);
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
             type === 'logic_board' ? 'Платы' : type === 'rear' ? 'Задние' : 'Фронт'))
        )
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'space-y-2' },
          filtered.length === 0 && h('p', { className: 'text-center text-slate-500 py-8' }, 'Ничего не найдено'),
          ...filtered.map(([article, info]) => 
            h('div', { key: article, className: 'p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300' },
              h('div', { className: 'flex justify-between items-start gap-4' },
                h('div', { className: 'flex-1' },
                  h('p', { className: 'font-mono font-bold text-emerald-600' }, article),
                  h('p', { className: 'text-sm text-slate-700 mt-1' }, info.description || ''),
                  h('span', { className: 'inline-block mt-2 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-500' }, info.type || '')
                ),
                info.price_usd && h('div', { className: 'text-right' },
                  h('p', { className: 'text-lg font-bold text-emerald-600' }, formatPrice(info.price_usd))
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
            h('h2', { className: 'text-2xl font-bold' }, '🖥️ Logic Boards'),
            h('p', { className: 'text-purple-100 text-sm' }, `${mSeries.length} M-серии • ${intel.length} Intel`)
          ),
          h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl' }, '×')
        )
      ),
      
      h('div', { className: 'p-4 border-b bg-slate-50' },
        h('div', { className: 'flex gap-3 mb-3' },
          h('button', {
            onClick: () => setShowMSeries(true),
            className: cn('px-4 py-2 rounded-xl font-medium', showMSeries ? 'bg-purple-500 text-white' : 'bg-white text-slate-600')
          }, `Apple Silicon (${mSeries.length})`),
          h('button', {
            onClick: () => setShowMSeries(false),
            className: cn('px-4 py-2 rounded-xl font-medium', !showMSeries ? 'bg-blue-500 text-white' : 'bg-white text-slate-600')
          }, `Intel (${intel.length})`)
        ),
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Поиск...',
          className: 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none'
        })
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
          ...filtered.map((board, i) => 
            h('div', { key: i, className: 'p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-300' },
              h('div', { className: 'flex justify-between items-start mb-2' },
                h('span', { className: 'font-mono font-bold text-purple-600' }, board.article),
                h('span', { className: 'text-lg font-bold text-green-600' }, formatPrice(board.price_usd))
              ),
              h('div', { className: 'flex gap-2 flex-wrap mb-2' },
                board.chip && h('span', { className: 'px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold' }, board.chip),
                board.cpu_cores && h('span', { className: 'px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs' }, `${board.cpu_cores}CPU`),
                board.ram_gb && h('span', { className: 'px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs' }, `${board.ram_gb}GB`)
              ),
              h('p', { className: 'text-xs text-slate-500 line-clamp-2' }, board.description)
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
    return Object.entries(prices).filter(([model]) => !term || model.toLowerCase().includes(term));
  }, [prices, searchTerm]);
  
  return h('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col' },
      h('div', { className: 'bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white' },
        h('div', { className: 'flex justify-between items-start' },
          h('div', null,
            h('h2', { className: 'text-2xl font-bold' }, '💰 Официальные цены Apple'),
            h('p', { className: 'text-amber-100 text-sm' }, `Курс: 1 USD = ${data.currency?.rate_usd || 41.5} UAH`)
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
              h('th', { className: 'text-center p-4' }, '🔋'),
              h('th', { className: 'text-center p-4' }, '📱'),
              h('th', { className: 'text-center p-4' }, '📷'),
              h('th', { className: 'text-center p-4' }, '🤳')
            )
          ),
          h('tbody', null,
            ...filtered.map(([model, info]) => 
              h('tr', { key: model, className: 'border-b hover:bg-amber-50' },
                h('td', { className: 'p-4 font-medium' }, model),
                h('td', { className: 'p-4 text-center text-green-600 font-bold' }, info.battery?.price_usd ? formatPrice(info.battery.price_usd) : '—'),
                h('td', { className: 'p-4 text-center text-blue-600 font-bold' }, info.display?.price_usd ? formatPrice(info.display.price_usd) : '—'),
                h('td', { className: 'p-4 text-center text-purple-600 font-bold' }, info.rear_camera?.price_usd ? formatPrice(info.rear_camera.price_usd) : '—'),
                h('td', { className: 'p-4 text-center text-orange-600 font-bold' }, info.front_camera?.price_usd ? formatPrice(info.front_camera.price_usd) : '—')
              )
            )
          )
        )
      )
    )
  );
};

// ===== ERROR CODES PANEL =====
const ErrorCodesPanel = ({ data, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('itunes');
  
  if (!data) return null;
  
  const itunesErrors = data.itunes_restore_errors || {};
  const macErrors = data.mac_diagnostics || {};
  
  const currentErrors = category === 'itunes' ? itunesErrors : macErrors;
  
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return Object.entries(currentErrors);
    return Object.entries(currentErrors).filter(([code, info]) => 
      code.toLowerCase().includes(term) || 
      (info.description || '').toLowerCase().includes(term) ||
      (info.cause || '').toLowerCase().includes(term)
    );
  }, [currentErrors, searchTerm]);
  
  return h('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col' },
      h('div', { className: 'bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white' },
        h('div', { className: 'flex justify-between items-start' },
          h('div', null,
            h('h2', { className: 'text-2xl font-bold' }, '🚨 Коды ошибок'),
            h('p', { className: 'text-red-100 text-sm' }, 'iTunes, Finder, Mac диагностика')
          ),
          h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl' }, '×')
        )
      ),
      
      h('div', { className: 'p-4 border-b bg-slate-50' },
        h('div', { className: 'flex gap-3 mb-3' },
          h('button', {
            onClick: () => setCategory('itunes'),
            className: cn('px-4 py-2 rounded-xl font-medium', category === 'itunes' ? 'bg-red-500 text-white' : 'bg-white text-slate-600')
          }, `iTunes/Finder (${Object.keys(itunesErrors).length})`),
          h('button', {
            onClick: () => setCategory('mac'),
            className: cn('px-4 py-2 rounded-xl font-medium', category === 'mac' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600')
          }, `Mac Diagnostics (${Object.keys(macErrors).length})`)
        ),
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Введите код ошибки (например, 4013)...',
          className: 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-none'
        })
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'space-y-3' },
          filtered.length === 0 && h('p', { className: 'text-center text-slate-500 py-8' }, 'Ошибка не найдена'),
          ...filtered.map(([code, info]) => 
            h('div', { key: code, className: 'p-4 bg-white rounded-xl border border-slate-200 hover:border-red-300' },
              h('div', { className: 'flex items-start gap-4' },
                h('div', { className: 'w-20 h-20 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0' },
                  h('span', { className: 'text-2xl font-bold text-red-600' }, code)
                ),
                h('div', { className: 'flex-1' },
                  h('p', { className: 'font-semibold text-slate-800 mb-1' }, info.description || 'Описание отсутствует'),
                  info.cause && h('p', { className: 'text-sm text-slate-600 mb-2' }, `⚠️ Причина: ${info.cause}`),
                  info.solution && h('div', { className: 'p-3 bg-green-50 rounded-lg' },
                    h('p', { className: 'text-sm text-green-800' }, `✅ Решение: ${info.solution}`)
                  ),
                  info.hardware && h('span', { className: 'inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs' }, '🔧 Аппаратная проблема')
                )
              )
            )
          )
        )
      )
    )
  );
};

// ===== REPAIR CALCULATOR PANEL =====
const RepairCalculatorPanel = ({ devices, onClose }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedRepairs, setSelectedRepairs] = useState([]);
  const [laborCost, setLaborCost] = useState(20);
  const [margin, setMargin] = useState(30);
  
  const repairTypes = [
    { id: 'battery', name: 'Замена батареи', icon: '🔋' },
    { id: 'display', name: 'Замена дисплея', icon: '📱' },
    { id: 'rear_camera', name: 'Замена задней камеры', icon: '📷' },
    { id: 'front_camera', name: 'Замена фронтальной камеры', icon: '🤳' },
    { id: 'speaker', name: 'Замена динамика', icon: '🔊' },
    { id: 'charging', name: 'Ремонт зарядки', icon: '⚡' },
  ];
  
  const deviceOptions = devices.filter(d => d.official_service_prices && Object.keys(d.official_service_prices).length > 0);
  
  const calculations = useMemo(() => {
    if (!selectedDevice) return null;
    
    const prices = selectedDevice.official_service_prices || {};
    let partsCost = 0;
    
    selectedRepairs.forEach(repairId => {
      const price = prices[repairId];
      if (price) {
        partsCost += typeof price === 'object' ? price.price_usd : price;
      }
    });
    
    const labor = selectedRepairs.length * laborCost;
    const subtotal = partsCost + labor;
    const marginAmount = subtotal * (margin / 100);
    const total = subtotal + marginAmount;
    
    return { partsCost, labor, subtotal, marginAmount, total };
  }, [selectedDevice, selectedRepairs, laborCost, margin]);
  
  return h('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col' },
      h('div', { className: 'bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white' },
        h('div', { className: 'flex justify-between items-start' },
          h('div', null,
            h('h2', { className: 'text-2xl font-bold' }, '🧮 Калькулятор ремонта'),
            h('p', { className: 'text-blue-100 text-sm' }, 'Расчёт стоимости работ')
          ),
          h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl' }, '×')
        )
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto p-6 space-y-6' },
        // Device selector
        h('div', null,
          h('label', { className: 'block text-sm font-medium text-slate-700 mb-2' }, 'Выберите устройство'),
          h('select', {
            value: selectedDevice?.id || '',
            onChange: e => {
              const device = deviceOptions.find(d => d.id === e.target.value);
              setSelectedDevice(device);
              setSelectedRepairs([]);
            },
            className: 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none'
          },
            h('option', { value: '' }, '-- Выберите --'),
            ...deviceOptions.map(d => h('option', { key: d.id, value: d.id }, d.name))
          )
        ),
        
        // Repair types
        selectedDevice && h('div', null,
          h('label', { className: 'block text-sm font-medium text-slate-700 mb-2' }, 'Виды работ'),
          h('div', { className: 'grid grid-cols-2 gap-2' },
            ...repairTypes.map(repair => {
              const price = selectedDevice.official_service_prices?.[repair.id];
              const priceVal = price ? (typeof price === 'object' ? price.price_usd : price) : null;
              const isSelected = selectedRepairs.includes(repair.id);
              
              return h('button', {
                key: repair.id,
                disabled: !priceVal,
                onClick: () => {
                  if (isSelected) {
                    setSelectedRepairs(selectedRepairs.filter(r => r !== repair.id));
                  } else {
                    setSelectedRepairs([...selectedRepairs, repair.id]);
                  }
                },
                className: cn(
                  'p-3 rounded-xl border-2 text-left transition-all',
                  !priceVal && 'opacity-50 cursor-not-allowed',
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                )
              },
                h('div', { className: 'flex items-center gap-2' },
                  h('span', { className: 'text-xl' }, repair.icon),
                  h('div', null,
                    h('p', { className: 'font-medium text-sm' }, repair.name),
                    h('p', { className: 'text-xs text-slate-500' }, priceVal ? formatPrice(priceVal) : 'Нет данных')
                  )
                )
              );
            })
          )
        ),
        
        // Settings
        selectedDevice && h('div', { className: 'grid grid-cols-2 gap-4' },
          h('div', null,
            h('label', { className: 'block text-sm font-medium text-slate-700 mb-2' }, 'Работа за услугу ($)'),
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
        calculations && selectedRepairs.length > 0 && h('div', { className: 'p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl' },
          h('h3', { className: 'font-bold text-slate-800 mb-3' }, '📊 Расчёт'),
          h('div', { className: 'space-y-2 text-sm' },
            h('div', { className: 'flex justify-between' },
              h('span', { className: 'text-slate-600' }, 'Запчасти:'),
              h('span', { className: 'font-medium' }, formatPrice(calculations.partsCost))
            ),
            h('div', { className: 'flex justify-between' },
              h('span', { className: 'text-slate-600' }, `Работа (${selectedRepairs.length}x):`),
              h('span', { className: 'font-medium' }, formatPrice(calculations.labor))
            ),
            h('div', { className: 'flex justify-between border-t pt-2' },
              h('span', { className: 'text-slate-600' }, 'Подитог:'),
              h('span', { className: 'font-medium' }, formatPrice(calculations.subtotal))
            ),
            h('div', { className: 'flex justify-between' },
              h('span', { className: 'text-slate-600' }, `Наценка ${margin}%:`),
              h('span', { className: 'font-medium' }, formatPrice(calculations.marginAmount))
            ),
            h('div', { className: 'flex justify-between border-t pt-2 text-lg' },
              h('span', { className: 'font-bold text-slate-800' }, 'ИТОГО:'),
              h('span', { className: 'font-bold text-blue-600' }, formatPrice(calculations.total))
            )
          )
        )
      )
    )
  );
};

// ===== IC DATABASE PANEL =====
const ICDatabasePanel = ({ data, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('charging');
  
  if (!data) return null;
  
  const categories = {
    charging: { name: 'Зарядка', data: data.charging_ics || {} },
    power: { name: 'Питание', data: data.power_ics || {} },
    audio: { name: 'Аудио', data: data.audio_ics || {} },
    baseband: { name: 'Baseband', data: data.baseband_ics || {} },
    nand: { name: 'NAND', data: data.nand_ics || {} },
  };
  
  const currentData = categories[category]?.data || {};
  
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return Object.entries(currentData).filter(([name, info]) => {
      if (!term) return true;
      return name.toLowerCase().includes(term) || 
             (info.description || '').toLowerCase().includes(term) ||
             (info.models || []).some(m => m.toLowerCase().includes(term));
    });
  }, [currentData, searchTerm]);
  
  return h('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col' },
      h('div', { className: 'bg-gradient-to-r from-violet-500 to-purple-600 p-6 text-white' },
        h('div', { className: 'flex justify-between items-start' },
          h('div', null,
            h('h2', { className: 'text-2xl font-bold' }, '🔌 База микросхем'),
            h('p', { className: 'text-violet-100 text-sm' }, 'Справочник IC с совместимостью')
          ),
          h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl' }, '×')
        )
      ),
      
      h('div', { className: 'p-4 border-b bg-slate-50' },
        h('div', { className: 'flex gap-2 mb-3 flex-wrap' },
          ...Object.entries(categories).map(([key, cat]) => 
            h('button', {
              key,
              onClick: () => setCategory(key),
              className: cn('px-3 py-1.5 rounded-xl font-medium text-sm', 
                category === key ? 'bg-violet-500 text-white' : 'bg-white text-slate-600')
            }, cat.name)
          )
        ),
        h('input', {
          type: 'text',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value),
          placeholder: 'Поиск по названию или модели...',
          className: 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:outline-none'
        })
      ),
      
      h('div', { className: 'flex-1 overflow-y-auto p-4' },
        h('div', { className: 'space-y-3' },
          filtered.length === 0 && h('p', { className: 'text-center text-slate-500 py-8' }, 'Ничего не найдено'),
          ...filtered.map(([name, info]) => 
            h('div', { key: name, className: 'p-4 bg-white rounded-xl border border-slate-200 hover:border-violet-300' },
              h('div', { className: 'flex items-start justify-between mb-2' },
                h('h3', { className: 'font-bold text-violet-600 font-mono' }, name),
                info.price_range && h('span', { className: 'px-2 py-1 bg-green-100 text-green-700 rounded text-xs' }, info.price_range)
              ),
              h('p', { className: 'text-sm text-slate-700 mb-2' }, info.description || info.function),
              info.models && h('div', { className: 'flex flex-wrap gap-1 mb-2' },
                ...info.models.slice(0, 5).map((m, i) => h('span', { key: i, className: 'px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600' }, m)),
                info.models.length > 5 && h('span', { className: 'text-xs text-slate-400' }, `+${info.models.length - 5}`)
              ),
              info.repair_notes && h('p', { className: 'text-xs text-amber-700 bg-amber-50 p-2 rounded' }, `💡 ${info.repair_notes}`)
            )
          )
        )
      )
    )
  );
};

// ===== KNOWLEDGE BASE PANEL =====
const KnowledgeBasePanel = ({ data, onClose }) => {
  const [topic, setTopic] = useState('tristar');
  
  if (!data) return null;
  
  const topics = {
    tristar: { name: 'Tristar/Hydra', key: 'tristar_hydra' },
    baseband: { name: 'Baseband', key: 'baseband' },
    touch_ic: { name: 'Touch IC', key: 'touch_ic' },
    water: { name: 'Залитие', key: 'water_damage' },
    nand: { name: 'NAND', key: 'nand_programming' },
    tools: { name: 'Инструменты', key: 'tools_supplies' },
  };
  
  const currentTopic = data[topics[topic]?.key] || {};
  
  return h('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col' },
      h('div', { className: 'bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white' },
        h('div', { className: 'flex justify-between items-start' },
          h('div', null,
            h('h2', { className: 'text-2xl font-bold' }, '📚 База знаний'),
            h('p', { className: 'text-green-100 text-sm' }, 'Руководства и процедуры ремонта')
          ),
          h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl' }, '×')
        )
      ),
      
      h('div', { className: 'p-4 border-b bg-slate-50' },
        h('div', { className: 'flex gap-2 flex-wrap' },
          ...Object.entries(topics).map(([key, t]) => 
            h('button', {
              key,
              onClick: () => setTopic(key),
              className: cn('px-3 py-1.5 rounded-xl font-medium text-sm', 
                topic === key ? 'bg-green-500 text-white' : 'bg-white text-slate-600')
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
              ...currentTopic.symptoms.map((s, i) => h('li', { key: i, className: 'text-sm text-slate-700' }, s))
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
            h('h3', { className: 'font-bold text-slate-700 mb-2' }, '🔧 Необходимые инструменты'),
            h('div', { className: 'flex flex-wrap gap-2' },
              ...currentTopic.tools.map((t, i) => h('span', { key: i, className: 'px-2 py-1 bg-slate-100 rounded text-xs' }, t))
            )
          ),
          
          currentTopic.notes && h('div', { className: 'p-4 bg-amber-50 rounded-xl' },
            h('p', { className: 'text-sm text-amber-800' }, `💡 ${currentTopic.notes}`)
          ),
          
          // If topic has nested structure, render it
          !currentTopic.description && !currentTopic.symptoms && h('div', { className: 'space-y-4' },
            ...Object.entries(currentTopic).slice(0, 10).map(([key, val]) => 
              h('div', { key, className: 'p-4 bg-slate-50 rounded-xl' },
                h('h4', { className: 'font-bold text-slate-700 mb-2' }, key.replace(/_/g, ' ')),
                h('p', { className: 'text-sm text-slate-600' }, 
                  typeof val === 'string' ? val : Array.isArray(val) ? val.join(', ') : JSON.stringify(val).slice(0, 200)
                )
              )
            )
          )
        )
      )
    )
  );
};

// ===== DEVICE DETAILS VIEW =====
const DeviceDetailsView = ({ device, onBack }) => {
  const [activeTab, setActiveTab] = useState('info');
  
  const officialPrices = device.official_service_prices || {};
  const serviceParts = device.service_parts || {};
  const hasOfficialPrices = Object.keys(officialPrices).length > 0;
  const hasServiceParts = Object.keys(serviceParts).length > 0;
  
  const connectorPinout = getConnectorPinout(device);
  const chargingDiag = getChargingICDiagnostics(device);
  const powerRails = getPowerRails(device);

  const tabs = [
    { id: 'info', name: '📋 Инфо' },
    { id: 'diagnostics', name: `⚡ IC` },
    { id: 'power', name: '🔌 Шины' },
    { id: 'connector', name: connectorPinout.icon }
  ];

  return h('div', { className: 'space-y-4 pb-10' },
    h('div', { className: 'flex items-start gap-4' },
      h('button', { onClick: onBack, className: 'w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center hover:shadow-xl text-xl flex-shrink-0' }, '←'),
      h('div', { className: 'flex-1' },
        h('h1', { className: 'text-xl font-bold text-gray-800' }, device.name),
        h('p', { className: 'text-sm text-gray-500' }, device.model)
      )
    ),

    h('div', { className: 'flex flex-wrap gap-2' },
      device.year && h('span', { className: 'px-3 py-1 bg-white rounded-xl shadow text-sm' }, `📅 ${device.year}`),
      device.processor && h('span', { className: 'px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow text-sm' }, device.processor),
      ...(device.board_numbers || []).slice(0, 2).map((bn, i) => h('span', { key: i, className: 'px-3 py-1 bg-purple-100 text-purple-700 rounded-xl text-sm' }, bn)),
      h('span', { className: 'px-3 py-1 bg-slate-100 text-slate-700 rounded-xl text-sm' }, `${connectorPinout.icon} ${connectorPinout.name}`)
    ),

    h('div', { className: 'flex gap-2 overflow-x-auto pb-2' },
      ...tabs.map(tab => h('button', {
        key: tab.id,
        onClick: () => setActiveTab(tab.id),
        className: cn('px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all text-sm',
          activeTab === tab.id ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100')
      }, tab.name))
    ),

    activeTab === 'info' && h('div', { className: 'space-y-4' },
      hasOfficialPrices && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-3' }, '💰 Цены AASP'),
        h('div', { className: 'grid grid-cols-2 md:grid-cols-3 gap-3' },
          ...Object.entries(officialPrices).slice(0, 6).map(([key, val]) => {
            const price = typeof val === 'object' ? val.price_usd : val;
            const icons = { battery: '🔋', display: '📱', rear_camera: '📷', front_camera: '🤳', speaker: '🔊', taptic_engine: '📳', keyboard: '⌨️', ssd: '💾' };
            return h('div', { key, className: 'p-3 bg-slate-50 rounded-xl text-center' },
              h('p', { className: 'text-xl mb-1' }, icons[key] || '🔧'),
              h('p', { className: 'text-xs text-slate-500 capitalize' }, key.replace('_', ' ')),
              h('p', { className: 'text-lg font-bold text-green-600' }, formatPrice(price))
            );
          })
        )
      ),

      hasServiceParts && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-3' }, '🔧 Артикулы'),
        h('div', { className: 'space-y-3' },
          ...Object.entries(serviceParts).slice(0, 3).map(([partType, parts]) =>
            h('div', { key: partType },
              h('h3', { className: 'text-sm font-semibold text-slate-600 mb-2 capitalize' }, partType.replace('_', ' ')),
              h('div', { className: 'grid grid-cols-1 gap-2' },
                ...parts.slice(0, 3).map((part, i) =>
                  h('div', { key: i, className: 'p-2 bg-slate-50 rounded-lg flex justify-between items-center' },
                    h('div', null,
                      h('p', { className: 'font-mono text-xs text-indigo-600' }, part.article),
                      h('p', { className: 'text-xs text-slate-500 truncate max-w-[200px]' }, part.description)
                    ),
                    part.price_usd > 0 && h('span', { className: 'font-bold text-green-600 text-sm' }, formatPrice(part.price_usd))
                  )
                )
              )
            )
          )
        )
      ),

      device.charging_ic && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-3' }, '⚡ Контроллер зарядки'),
        h('div', { className: 'grid grid-cols-2 gap-3' },
          h('div', { className: 'p-3 bg-yellow-50 rounded-xl' },
            h('p', { className: 'text-xs text-yellow-600 font-semibold' }, 'IC'),
            h('p', { className: 'font-bold text-slate-800 text-sm' }, device.charging_ic.main)
          ),
          device.charging_ic.voltage && h('div', { className: 'p-3 bg-blue-50 rounded-xl' },
            h('p', { className: 'text-xs text-blue-600 font-semibold' }, 'Напряжение'),
            h('p', { className: 'font-bold text-slate-800 text-sm' }, device.charging_ic.voltage)
          )
        )
      ),

      device.common_issues?.length > 0 && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
        h('h2', { className: 'text-lg font-bold text-gray-800 mb-3' }, '⚠️ Типовые неисправности'),
        h('ul', { className: 'space-y-1' },
          ...device.common_issues.slice(0, 5).map((issue, i) =>
            h('li', { key: i, className: 'flex items-start gap-2 text-sm text-slate-700' },
              h('span', { className: 'text-red-500' }, '•'), issue
            )
          )
        )
      ),

      h('div', { className: 'grid grid-cols-2 gap-3' },
        device.repair_difficulty && h('div', { className: 'bg-white rounded-2xl shadow-lg p-4 text-center' },
          h('p', { className: 'text-xs text-slate-500' }, 'Сложность'),
          h('p', { className: cn('text-lg font-bold',
            device.repair_difficulty.includes('Экстремал') ? 'text-red-600' :
            device.repair_difficulty.includes('Сложн') ? 'text-orange-600' : 'text-green-600'
          ) }, device.repair_difficulty)
        ),
        device.repair_time && h('div', { className: 'bg-white rounded-2xl shadow-lg p-4 text-center' },
          h('p', { className: 'text-xs text-slate-500' }, 'Время'),
          h('p', { className: 'text-lg font-bold text-blue-600' }, device.repair_time)
        )
      )
    ),

    activeTab === 'diagnostics' && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
      h('h2', { className: 'text-lg font-bold text-gray-800 mb-2' }, `⚡ ${chargingDiag.icType}`),
      h('p', { className: 'text-sm text-slate-500 mb-4' }, chargingDiag.icModel),
      
      h('h3', { className: 'font-semibold text-red-600 mb-2 text-sm' }, '❌ Симптомы:'),
      h('ul', { className: 'space-y-1 mb-4' },
        ...chargingDiag.symptoms.map((s, i) => h('li', { key: i, className: 'text-sm text-slate-700' }, `• ${s}`))
      ),
      
      h('h3', { className: 'font-semibold text-blue-600 mb-2 text-sm' }, '🔍 Замеры:'),
      h('div', { className: 'space-y-2 mb-4' },
        ...chargingDiag.diagnostics.map((d, i) => 
          h('div', { key: i, className: 'p-2 bg-slate-50 rounded-lg grid grid-cols-3 gap-2 text-xs' },
            h('span', { className: 'font-medium text-slate-700' }, d.name),
            h('span', { className: 'text-green-600' }, `✓ ${d.normal}`),
            h('span', { className: 'text-red-600' }, `✗ ${d.fault}`)
          )
        )
      ),
      
      h('div', { className: 'p-3 bg-amber-50 rounded-xl' },
        h('p', { className: 'text-sm text-amber-800' }, `💡 ${chargingDiag.notes}`)
      )
    ),

    activeTab === 'power' && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
      h('h2', { className: 'text-lg font-bold text-gray-800 mb-4' }, `🔌 Шины питания`),
      h('div', { className: 'space-y-3' },
        ...powerRails.map((rail, i) => 
          h('div', { key: i, className: 'p-3 bg-slate-50 rounded-xl' },
            h('div', { className: 'flex justify-between items-start mb-2' },
              h('div', null,
                h('p', { className: 'font-mono font-bold text-indigo-600 text-sm' }, rail.name),
                h('p', { className: 'text-xs text-slate-500' }, rail.desc)
              ),
              h('span', { className: 'px-2 py-1 bg-indigo-100 text-indigo-700 rounded font-mono text-xs font-bold' }, rail.voltage)
            ),
            h('div', { className: 'grid grid-cols-2 gap-2 text-xs' },
              h('div', { className: 'p-2 bg-green-50 rounded' },
                h('p', { className: 'text-green-600' }, 'Диод (норма)'),
                h('p', { className: 'font-mono text-green-700' }, rail.diode)
              ),
              h('div', { className: 'p-2 bg-red-50 rounded' },
                h('p', { className: 'text-red-600' }, 'КЗ если'),
                h('p', { className: 'font-mono text-red-700' }, rail.short)
              )
            )
          )
        )
      )
    ),

    activeTab === 'connector' && h('div', { className: 'bg-white rounded-2xl shadow-lg p-5' },
      h('h2', { className: 'text-lg font-bold text-gray-800 mb-4' }, `${connectorPinout.icon} ${connectorPinout.name}`),
      h('div', { className: 'space-y-2 mb-4' },
        ...connectorPinout.pins.map((pin, i) => 
          h('div', { key: i, className: 'flex items-center gap-3 p-2 bg-slate-50 rounded-lg' },
            h('span', { className: 'w-14 h-7 bg-slate-200 rounded flex items-center justify-center font-mono text-xs font-bold' }, pin.num),
            h('div', null,
              h('p', { className: 'font-semibold text-slate-800 text-sm' }, pin.name),
              h('p', { className: 'text-xs text-slate-500' }, pin.desc)
            )
          )
        )
      ),
      h('div', { className: 'space-y-2' },
        ...connectorPinout.notes.filter(Boolean).map((note, i) => 
          h('div', { key: i, className: 'p-2 bg-blue-50 rounded-lg text-sm text-blue-800' }, note)
        )
      )
    )
  );
};

// ===== MAIN APP =====
const RepairTool = () => {
  const [devices, setDevices] = useState([]);
  const [logicBoardsData, setLogicBoardsData] = useState(null);
  const [articleSearchData, setArticleSearchData] = useState(null);
  const [officialPricesData, setOfficialPricesData] = useState(null);
  const [errorCodesData, setErrorCodesData] = useState(null);
  const [icDatabaseData, setICDatabaseData] = useState(null);
  const [repairKnowledgeData, setRepairKnowledgeData] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [showArticleSearch, setShowArticleSearch] = useState(false);
  const [showLogicBoards, setShowLogicBoards] = useState(false);
  const [showOfficialPrices, setShowOfficialPrices] = useState(false);
  const [showErrorCodes, setShowErrorCodes] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showICDatabase, setShowICDatabase] = useState(false);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/devices.json').then(r => r.json()),
      fetch('/data/logic_boards_comprehensive.json').then(r => r.json()).catch(() => null),
      fetch('/data/article_search_index.json').then(r => r.json()).catch(() => null),
      fetch('/data/official_service_prices.json').then(r => r.json()).catch(() => null),
      fetch('/data/error_codes.json').then(r => r.json()).catch(() => null),
      fetch('/data/ic_compatibility.json').then(r => r.json()).catch(() => null),
      fetch('/data/repair_knowledge.json').then(r => r.json()).catch(() => null),
    ])
    .then(([devicesData, logicData, articleData, pricesData, errorsData, icData, knowledgeData]) => {
      setDevices(Array.isArray(devicesData) ? devicesData : []);
      setLogicBoardsData(logicData);
      setArticleSearchData(articleData);
      setOfficialPricesData(pricesData);
      setErrorCodesData(errorsData);
      setICDatabaseData(icData);
      setRepairKnowledgeData(knowledgeData);
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
        (d.board_numbers || []).some(bn => bn.toLowerCase().includes(term)) ||
        (d.processor || '').toLowerCase().includes(term)
      );
    }
    return result;
  }, [devices, searchTerm, selectedCategory]);

  const stats = useMemo(() => ({
    total: devices.length,
    withPrices: devices.filter(d => d.official_service_prices && Object.keys(d.official_service_prices).length > 0).length,
    articles: articleSearchData?.total || 0,
    logicBoards: (logicBoardsData?.m_series_count || 0) + (logicBoardsData?.intel_count || 0),
    errorCodes: errorCodesData ? Object.keys(errorCodesData.itunes_restore_errors || {}).length : 0
  }), [devices, articleSearchData, logicBoardsData, errorCodesData]);

  if (loading) {
    return h('div', { className: 'min-h-screen bg-gray-100 flex items-center justify-center' },
      h('div', { className: 'text-center' },
        h('div', { className: 'w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4' }),
        h('p', { className: 'text-gray-600' }, 'Загрузка...')
      )
    );
  }

  if (selectedDevice) {
    return h('div', { className: 'min-h-screen bg-gray-100 p-4' },
      h('div', { className: 'max-w-4xl mx-auto' },
        h(DeviceDetailsView, { device: selectedDevice, onBack: () => setSelectedDevice(null) })
      )
    );
  }

  return h('div', { className: 'min-h-screen bg-gray-100' },
    h('div', { className: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white py-8 px-4' },
      h('div', { className: 'max-w-6xl mx-auto text-center space-y-3' },
        h('h1', { className: 'text-2xl md:text-3xl font-bold' }, '🛠️ Apple Intake Desk'),
        h('p', { className: 'text-indigo-100 text-sm' }, 'Полная база для приёмки и ремонта'),
        h('div', { className: 'flex flex-wrap gap-2 justify-center text-xs' },
          h('span', { className: 'px-2 py-1 rounded-full bg-white/15' }, `${stats.total} устройств`),
          h('span', { className: 'px-2 py-1 rounded-full bg-green-500/30' }, `${stats.articles} артикулов`),
          h('span', { className: 'px-2 py-1 rounded-full bg-blue-500/30' }, `${stats.logicBoards} плат`)
        )
      )
    ),

    h('div', { className: 'max-w-6xl mx-auto px-4 -mt-4 pb-16' },
      h(Surface, { className: 'mb-4 p-2' },
        h('div', { className: 'relative' },
          h('input', {
            type: 'text',
            placeholder: 'Поиск по модели, номеру платы...',
            value: searchTerm,
            onChange: e => setSearchTerm(e.target.value),
            className: 'w-full px-5 py-3 pl-12 rounded-2xl border-0 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm'
          }),
          h('div', { className: 'absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400' }, h(SearchIcon))
        )
      ),

      h('div', { className: 'flex gap-2 mb-4 overflow-x-auto pb-2' },
        ...categories.map(cat => h('button', {
          key: cat,
          onClick: () => setSelectedCategory(cat),
          className: cn('px-3 py-1.5 rounded-xl font-medium whitespace-nowrap text-sm',
            selectedCategory === cat ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white text-slate-600')
        }, cat === 'all' ? 'Все' : cat))
      ),

      // Quick access - 2 rows of cards
      h('div', { className: 'grid grid-cols-3 md:grid-cols-6 gap-3 mb-6' },
        h(BentoCard, {
          name: 'Артикулы',
          description: `${stats.articles}`,
          Icon: TagIcon,
          background: h(PartsBackground),
          onClick: () => setShowArticleSearch(true),
          cta: 'Искать',
          badge: '🔍'
        }),
        h(BentoCard, {
          name: 'Платы',
          description: `${stats.logicBoards}`,
          Icon: CpuIcon,
          background: h(BoardBackground),
          onClick: () => setShowLogicBoards(true),
          cta: 'Открыть',
          badge: '🖥️'
        }),
        h(BentoCard, {
          name: 'Цены',
          description: 'AASP',
          Icon: WrenchIcon,
          background: h(PricingBackground),
          onClick: () => setShowOfficialPrices(true),
          cta: 'Смотреть',
          badge: '💰'
        }),
        h(BentoCard, {
          name: 'Ошибки',
          description: `${stats.errorCodes} кодов`,
          Icon: AlertIcon,
          background: h(ErrorBackground),
          onClick: () => setShowErrorCodes(true),
          cta: 'Найти',
          badge: '🚨'
        }),
        h(BentoCard, {
          name: 'Калькулятор',
          description: 'Расчёт',
          Icon: CalculatorIcon,
          background: h(CalcBackground),
          onClick: () => setShowCalculator(true),
          cta: 'Считать',
          badge: '🧮'
        }),
        h(BentoCard, {
          name: 'База знаний',
          description: 'Гайды',
          Icon: BookIcon,
          background: h(KnowledgeBackground),
          onClick: () => setShowKnowledgeBase(true),
          cta: 'Читать',
          badge: '📚'
        })
      ),

      h('p', { className: 'text-slate-500 mb-3 text-sm' }, `Найдено: ${filteredDevices.length}`),

      h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4' },
        ...filteredDevices.map(device =>
          h(DeviceCard, { key: device.id, device, onSelect: setSelectedDevice })
        )
      )
    ),

    showArticleSearch && h(ArticleSearchPanel, { data: articleSearchData, onClose: () => setShowArticleSearch(false) }),
    showLogicBoards && h(LogicBoardsPanel, { data: logicBoardsData, onClose: () => setShowLogicBoards(false) }),
    showOfficialPrices && h(OfficialPricesPanel, { data: officialPricesData, onClose: () => setShowOfficialPrices(false) }),
    showErrorCodes && h(ErrorCodesPanel, { data: errorCodesData, onClose: () => setShowErrorCodes(false) }),
    showCalculator && h(RepairCalculatorPanel, { devices, onClose: () => setShowCalculator(false) }),
    showICDatabase && h(ICDatabasePanel, { data: icDatabaseData, onClose: () => setShowICDatabase(false) }),
    showKnowledgeBase && h(KnowledgeBasePanel, { data: repairKnowledgeData, onClose: () => setShowKnowledgeBase(false) })
  );
};

ReactDOM.createRoot(document.getElementById('app')).render(h(RepairTool));
