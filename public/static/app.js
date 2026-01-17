// Apple Repair Tool - Main Application v2.2
// Bento Grid UI + визуализация + замеры + доноры
const { useState, useMemo, useEffect, createElement: h } = React;

// ===== UTILITY FUNCTIONS =====
const cn = (...classes) => classes.filter(Boolean).join(' ');

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

// ===== BENTO GRID COMPONENTS =====
const BentoGrid = ({ children, className }) => {
  return h('div', {
    className: cn(
      'grid w-full auto-rows-[22rem] grid-cols-3 gap-4',
      className
    )
  }, children);
};

const BentoCard = ({ name, className, background, Icon, description, onClick, cta, badge }) => {
  return h('div', {
    onClick,
    className: cn(
      'group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer',
      'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
      'transform-gpu hover:scale-[1.02] transition-all duration-300',
      className
    )
  },
    // Background
    background && h('div', { className: 'absolute inset-0 opacity-50' }, background),
    
    // Badge
    badge && h('div', { className: 'absolute top-4 right-4 z-20' },
      h('span', { className: 'px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full' }, badge)
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
      h('button', { className: 'pointer-events-auto flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors' },
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
        h('div', { key, className: 'bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow' },
          h('div', {
            className: 'p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center',
            onClick: () => setExpandedRail(expandedRail === key ? null : key)
          },
            h('div', { className: 'flex items-center gap-4' },
              h('div', { className: 'w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl' }, '⚡'),
              h('div', null,
                h('p', { className: 'font-bold text-gray-800' }, key),
                h('p', { className: 'text-sm text-gray-500' }, rail.name)
              )
            ),
            h('div', { className: 'flex items-center gap-4' },
              h('div', { className: 'text-right' },
                h('p', { className: 'font-mono text-blue-600 font-bold' }, rail.voltage),
                h('p', { className: 'text-xs text-gray-400' }, `Diode: ${rail.diode_mode_normal}`)
              ),
              expandedRail === key ? h(ChevronUpIcon) : h(ChevronDownIcon)
            )
          ),
          expandedRail === key && h('div', { className: 'p-4 bg-gradient-to-b from-gray-50 to-white border-t space-y-4' },
            h('p', { className: 'text-sm text-gray-600' }, rail.description),
            
            h('div', { className: 'grid grid-cols-2 gap-4' },
              h('div', { className: 'bg-green-50 p-4 rounded-xl border border-green-200' },
                h('p', { className: 'text-xs text-green-600 font-semibold mb-1' }, '✓ Норма (Diode Mode)'),
                h('p', { className: 'font-mono text-2xl text-green-700' }, rail.diode_mode_normal)
              ),
              h('div', { className: 'bg-red-50 p-4 rounded-xl border border-red-200' },
                h('p', { className: 'text-xs text-red-600 font-semibold mb-1' }, '✗ КЗ если меньше'),
                h('p', { className: 'font-mono text-2xl text-red-700' }, rail.short_threshold)
              )
            ),
            
            h('div', { className: 'bg-blue-50 p-3 rounded-xl' },
              h('p', { className: 'text-xs font-semibold text-blue-600 mb-2' }, '📍 Где измерять:'),
              h('div', { className: 'flex flex-wrap gap-2' },
                ...rail.check_points.map((point, idx) =>
                  h('span', { key: idx, className: 'text-xs px-3 py-1 bg-white text-blue-700 rounded-full border border-blue-200' }, point)
                )
              )
            ),
            
            rail.if_shorted && h('div', { className: 'bg-orange-50 p-3 rounded-xl border border-orange-200' },
              h('p', { className: 'text-xs font-semibold text-orange-600 mb-2' }, '⚠️ Если КЗ - что делать:'),
              h('ul', { className: 'space-y-1' },
                ...rail.if_shorted.map((action, idx) =>
                  h('li', { key: idx, className: 'text-sm text-orange-800 flex items-center gap-2' },
                    h('span', { className: 'w-5 h-5 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs' }, idx + 1),
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
        return h('div', { 
          key, 
          className: 'bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer',
          onClick: () => setExpandedRail(expandedRail === key ? null : key)
        },
          h('div', { className: `bg-gradient-to-r ${data.color} p-4 text-white` },
            h('div', { className: 'flex items-center gap-3' },
              h('span', { className: 'text-3xl' }, data.icon),
              h('div', null,
                h('p', { className: 'font-bold text-lg' }, fault.symptom),
                h('p', { className: 'text-sm opacity-80' }, `${fault.checklist.length} шагов`)
              )
            )
          ),
          expandedRail === key && h('div', { className: 'p-4 bg-gray-50' },
            h('ol', { className: 'space-y-2' },
              ...fault.checklist.map((step, idx) =>
                h('li', { key: idx, className: 'flex items-start gap-3' },
                  h('span', { className: `w-6 h-6 rounded-full bg-gradient-to-r ${data.color} text-white flex items-center justify-center text-xs font-bold flex-shrink-0` }, idx + 1),
                  h('span', { className: 'text-sm text-gray-700' }, step)
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

      h('div', { className: 'bg-white p-6 rounded-2xl shadow-lg' },
        h('h4', { className: 'font-bold text-xl mb-4 text-gray-800' }, '📊 Интерпретация значений'),
        h('div', { className: 'space-y-2' },
          ...Object.entries(technique.interpretation).map(([value, meaning]) =>
            h('div', { key: value, className: 'flex items-center gap-4 p-3 bg-gray-50 rounded-xl' },
              h('span', { className: 'font-mono font-bold text-blue-600 text-lg w-28' }, value),
              h('span', { className: 'text-gray-700' }, meaning)
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

  return h('div', { className: 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm' },
    h('div', { className: 'bg-gray-100 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col' },
      // Header
      h('div', { className: 'bg-white p-6 border-b flex items-center justify-between' },
        h('div', null,
          h('h2', { className: 'text-2xl font-bold text-gray-800' }, '📏 Замеры и Диагностика'),
          h('p', { className: 'text-gray-500 text-sm' }, 'Справочник для ремонта iPhone')
        ),
        h('button', { onClick: onClose, className: 'w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-xl' }, '×')
      ),
      
      // Tabs
      h('div', { className: 'bg-white px-6 py-3 border-b flex gap-2 overflow-x-auto' },
        ...sections.map(section =>
          h('button', {
            key: section.key,
            onClick: () => { setActiveSection(section.key); setExpandedRail(null); },
            className: cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
              activeSection === section.key 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

  return h('div', { className: 'space-y-6' },
    // Back button and header
    h('div', { className: 'flex items-center gap-4' },
      h('button', { 
        onClick: onBack, 
        className: 'w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow' 
      }, '←'),
      h('div', { className: 'flex-1' },
        h('h1', { className: 'text-3xl font-bold text-gray-800' }, device.name),
        h('p', { className: 'text-gray-500' }, device.model)
      )
    ),

    // Tags
    h('div', { className: 'flex flex-wrap gap-2' },
      h('span', { className: 'px-4 py-2 bg-white rounded-xl shadow text-sm font-medium' }, `📅 ${device.year}`),
      h('span', { className: 'px-4 py-2 bg-white rounded-xl shadow text-sm font-medium' }, `📱 ${device.category}`),
      h('span', { className: 'px-4 py-2 bg-blue-500 text-white rounded-xl shadow text-sm font-medium' }, `💻 ${device.processor}`),
      device.board_numbers?.map((bn, i) =>
        h('span', { key: i, className: 'px-4 py-2 bg-purple-500 text-white rounded-xl shadow text-sm font-medium' }, `🔧 ${bn}`)
      )
    ),

    // Quick actions
    h('div', { className: 'grid grid-cols-2 gap-4' },
      h('button', {
        onClick: () => setShowMeasurements(true),
        className: 'p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white text-left hover:shadow-xl transition-all hover:scale-[1.02]'
      },
        h('span', { className: 'text-4xl mb-2 block' }, '📏'),
        h('p', { className: 'font-bold text-xl' }, 'Замеры'),
        h('p', { className: 'text-blue-100 text-sm' }, 'Шины питания, Boot Sequence, Диагностика')
      ),
      h('a', {
        href: device.documentation_links?.ifixit || '#',
        target: '_blank',
        className: 'p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white text-left hover:shadow-xl transition-all hover:scale-[1.02]'
      },
        h('span', { className: 'text-4xl mb-2 block' }, '📚'),
        h('p', { className: 'font-bold text-xl' }, 'iFixit'),
        h('p', { className: 'text-green-100 text-sm' }, 'Руководства по разборке')
      )
    ),

    // IC Cards as Bento Grid
    h('h2', { className: 'text-xl font-bold text-gray-800 mt-8' }, '🔧 Микросхемы'),
    h('div', { className: 'grid grid-cols-2 gap-4' },
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
    h('div', { className: 'mt-6 flex gap-4' },
      device.repair_difficulty && h('div', { className: 'flex-1 bg-white rounded-2xl shadow-lg p-6 text-center' },
        h('p', { className: 'text-sm text-gray-500 mb-1' }, 'Сложность'),
        h('p', { className: cn('text-2xl font-bold',
          device.repair_difficulty.includes('Средняя') ? 'text-yellow-600' :
          device.repair_difficulty.includes('Сложная') ? 'text-orange-600' :
          device.repair_difficulty.includes('Экстремально') ? 'text-red-600' : 'text-green-600'
        ) }, device.repair_difficulty)
      ),
      device.repair_time && h('div', { className: 'flex-1 bg-white rounded-2xl shadow-lg p-6 text-center' },
        h('p', { className: 'text-sm text-gray-500 mb-1' }, 'Время ремонта'),
        h('p', { className: 'text-2xl font-bold text-blue-600' }, device.repair_time)
      )
    ),

    // Modals
    showMeasurements && h(MeasurementsPanel, { measurementsData, onClose: () => setShowMeasurements(false) }),
    selectedChip && h(ChipDetailsModal, { chip: selectedChip, icData, onClose: () => setSelectedChip(null) })
  );
};

// ===== MAIN APP =====
const RepairTool = () => {
  const [devices, setDevices] = useState([]);
  const [icData, setIcData] = useState(null);
  const [measurementsData, setMeasurementsData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/devices.json').then(res => res.json()),
      fetch('/data/ic_compatibility.json').then(res => res.json()),
      fetch('/data/measurements.json').then(res => res.json())
    ])
    .then(([devicesData, icCompatData, measData]) => {
      setDevices(devicesData);
      setIcData(icCompatData);
      setMeasurementsData(measData);
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
      device.name.toLowerCase().includes(term) ||
      device.model.toLowerCase().includes(term) ||
      device.category.toLowerCase().includes(term)
    );
  }, [searchTerm, devices]);

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
    h('div', { className: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-16 px-6' },
      h('div', { className: 'max-w-6xl mx-auto text-center' },
        h('h1', { className: 'text-5xl font-bold mb-4' }, '🔧 Apple Repair Tool'),
        h('p', { className: 'text-xl text-blue-100 mb-8' }, 'Профессиональная база для ремонта iPhone и iPad'),
        h('div', { className: 'flex gap-4 justify-center flex-wrap' },
          h('span', { className: 'px-4 py-2 bg-white/20 rounded-full text-sm' }, `📱 ${devices.length} устройств`),
          h('span', { className: 'px-4 py-2 bg-white/20 rounded-full text-sm' }, '🔧 30+ микросхем'),
          h('span', { className: 'px-4 py-2 bg-white/20 rounded-full text-sm' }, '📏 Замеры'),
          h('span', { className: 'px-4 py-2 bg-white/20 rounded-full text-sm' }, '📱 Доноры')
        )
      )
    ),

    // Main Content
    h('div', { className: 'max-w-6xl mx-auto px-6 -mt-8' },
      // Search Bar
      h('div', { className: 'bg-white rounded-2xl shadow-xl p-2 mb-8' },
        h('div', { className: 'relative' },
          h('input', {
            type: 'text',
            placeholder: 'Поиск по модели, имени или категории...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: 'w-full px-6 py-4 pl-14 rounded-xl border-2 border-transparent focus:border-blue-500 focus:outline-none text-lg'
          }),
          h('div', { className: 'absolute left-5 top-5 text-gray-400' }, h(SearchIcon))
        )
      ),

      // Quick Access Bento Cards
      h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-8' },
        h(BentoCard, {
          name: 'Замеры и Диагностика',
          description: 'Шины питания, Boot Sequence, чеклисты неисправностей',
          Icon: MeasureIcon,
          background: h(MeasurementsBackground),
          onClick: () => setShowMeasurements(true),
          cta: 'Открыть',
          className: 'md:col-span-2',
          badge: 'NEW'
        }),
        h(BentoCard, {
          name: 'Доноры IC',
          description: 'Откуда выпаять микросхемы',
          Icon: PhoneIcon,
          background: h(DonorBackground),
          onClick: () => {},
          cta: 'В карточках',
          className: 'md:col-span-1'
        })
      ),

      // Results count
      h('p', { className: 'text-gray-500 mb-4' }, `Найдено: ${filteredDevices.length} устройств`),

      // Device Grid
      h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12' },
        ...filteredDevices.slice(0, 50).map(device =>
          h('div', {
            key: device.id,
            onClick: () => setSelectedDevice(device),
            className: 'bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02] border-l-4 border-blue-500'
          },
            h('div', { className: 'flex justify-between items-start' },
              h('div', null,
                h('h3', { className: 'text-xl font-bold text-gray-800' }, device.name),
                h('p', { className: 'text-sm text-gray-500 mt-1' }, device.model),
                h('div', { className: 'flex gap-2 mt-3' },
                  h('span', { className: 'text-xs px-2 py-1 bg-gray-100 rounded-full' }, device.year),
                  h('span', { className: 'text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full' }, device.processor)
                )
              ),
              h('span', { className: 'text-3xl' }, device.category === 'iPhone' ? '📱' : device.category === 'iPad' ? '📟' : '⌚')
            )
          )
        )
      )
    ),

    // Measurements Modal
    showMeasurements && h(MeasurementsPanel, { measurementsData, onClose: () => setShowMeasurements(false) })
  );
};

// Mount
ReactDOM.createRoot(document.getElementById('app')).render(h(RepairTool));
