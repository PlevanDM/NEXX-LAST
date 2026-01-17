// Apple Repair Tool - Main Application v2.1
// С визуализацией, донорами, замерами и диагностикой
const { useState, useMemo, useEffect, createElement: h } = React;

// Icons
const SearchIcon = () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
);

const ChevronDownIcon = () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M19 9l-7 7-7-7' })
);

const ChevronUpIcon = () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M5 15l7-7 7 7' })
);

const ChipIcon = () => h('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' })
);

// ===== КОМПОНЕНТ ЗАМЕРОВ И ДИАГНОСТИКИ =====
const MeasurementsPanel = ({ measurementsData }) => {
  const [activeSection, setActiveSection] = useState('power_rails');
  const [expandedRail, setExpandedRail] = useState(null);

  if (!measurementsData) return null;

  const sections = [
    { key: 'power_rails', name: '⚡ Шины питания', icon: '⚡' },
    { key: 'boot_sequence', name: '🔄 Boot Sequence', icon: '🔄' },
    { key: 'fault_signatures', name: '🔍 Диагностика', icon: '🔍' },
    { key: 'diode_technique', name: '📏 Техника замеров', icon: '📏' }
  ];

  const renderPowerRails = () => {
    const rails = measurementsData.power_rails?.rails;
    if (!rails) return null;

    return h('div', { className: 'space-y-3' },
      Object.entries(rails).map(([key, rail]) =>
        h('div', { 
          key, 
          className: 'bg-white rounded-lg shadow-sm border overflow-hidden'
        },
          h('div', {
            className: 'p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center',
            onClick: () => setExpandedRail(expandedRail === key ? null : key)
          },
            h('div', { className: 'flex items-center gap-3' },
              h('span', { className: 'text-2xl' }, '⚡'),
              h('div', null,
                h('p', { className: 'font-bold text-gray-800' }, key),
                h('p', { className: 'text-sm text-gray-500' }, rail.name)
              )
            ),
            h('div', { className: 'flex items-center gap-4' },
              h('div', { className: 'text-right' },
                h('p', { className: 'font-mono text-blue-600 font-bold' }, rail.voltage),
                h('p', { className: 'text-xs text-gray-500' }, `Diode: ${rail.diode_mode_normal}`)
              ),
              expandedRail === key ? h(ChevronUpIcon) : h(ChevronDownIcon)
            )
          ),
          expandedRail === key && h('div', { className: 'p-4 bg-gray-50 border-t space-y-3' },
            h('p', { className: 'text-sm text-gray-600' }, rail.description),
            
            h('div', { className: 'grid grid-cols-2 gap-4' },
              h('div', { className: 'bg-green-50 p-3 rounded' },
                h('p', { className: 'text-xs text-green-600 font-semibold' }, 'Норма (Diode Mode)'),
                h('p', { className: 'font-mono text-lg text-green-800' }, rail.diode_mode_normal)
              ),
              h('div', { className: 'bg-red-50 p-3 rounded' },
                h('p', { className: 'text-xs text-red-600 font-semibold' }, 'КЗ если меньше'),
                h('p', { className: 'font-mono text-lg text-red-800' }, rail.short_threshold)
              )
            ),
            
            h('div', null,
              h('p', { className: 'text-xs font-semibold text-gray-600 mb-1' }, '📍 Где измерять:'),
              h('div', { className: 'flex flex-wrap gap-1' },
                ...rail.check_points.map((point, idx) =>
                  h('span', { key: idx, className: 'text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded' }, point)
                )
              )
            ),
            
            rail.if_shorted && h('div', { className: 'bg-orange-50 p-3 rounded' },
              h('p', { className: 'text-xs font-semibold text-orange-600 mb-2' }, '⚠️ Если КЗ:'),
              h('ul', { className: 'space-y-1' },
                ...rail.if_shorted.map((action, idx) =>
                  h('li', { key: idx, className: 'text-sm text-orange-800 flex items-start gap-2' },
                    h('span', null, '•'),
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

    return h('div', { className: 'space-y-4' },
      h('div', { className: 'bg-blue-50 p-4 rounded-lg' },
        h('h4', { className: 'font-bold text-blue-800 mb-3' }, '🔄 Последовательность загрузки'),
        h('div', { className: 'space-y-2' },
          ...boot.steps.map((step, idx) =>
            h('div', { key: idx, className: 'flex items-center gap-3 bg-white p-3 rounded shadow-sm' },
              h('div', { className: 'w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm' }, step.step),
              h('div', { className: 'flex-1' },
                h('p', { className: 'font-semibold text-gray-800' }, step.name),
                h('p', { className: 'text-xs text-gray-500' }, step.description)
              ),
              h('div', { className: 'text-right' },
                h('p', { className: 'font-mono text-green-600 font-bold' }, step.current_draw),
                h('p', { className: 'text-xs text-gray-400' }, step.duration)
              )
            )
          )
        )
      ),
      
      h('div', { className: 'bg-red-50 p-4 rounded-lg' },
        h('h4', { className: 'font-bold text-red-800 mb-3' }, '⚠️ Аномальные паттерны загрузки'),
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
          ...Object.entries(boot.abnormal_patterns).map(([key, pattern]) =>
            h('div', { key, className: 'bg-white p-3 rounded shadow-sm' },
              h('p', { className: 'font-semibold text-red-700' }, pattern.description),
              h('ul', { className: 'mt-2 space-y-1' },
                ...pattern.possible_causes.map((cause, idx) =>
                  h('li', { key: idx, className: 'text-xs text-gray-600' }, `• ${cause}`)
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

    const faultIcons = {
      no_power: '🔌',
      no_charge: '🔋',
      no_image: '🖥️',
      no_touch: '👆',
      no_service: '📶',
      audio_disease: '🔊'
    };

    return h('div', { className: 'space-y-3' },
      h('p', { className: 'text-sm text-gray-600 mb-4' }, 
        'Быстрая диагностика по симптомам. Чеклист для каждой неисправности.'
      ),
      ...Object.entries(faults).map(([key, fault]) =>
        h('div', { key, className: 'bg-white rounded-lg shadow-sm border overflow-hidden' },
          h('div', {
            className: 'p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center',
            onClick: () => setExpandedRail(expandedRail === key ? null : key)
          },
            h('div', { className: 'flex items-center gap-3' },
              h('span', { className: 'text-2xl' }, faultIcons[key] || '❓'),
              h('div', null,
                h('p', { className: 'font-bold text-gray-800' }, fault.symptom),
                h('p', { className: 'text-xs text-gray-500' }, `${fault.checklist.length} шагов диагностики`)
              )
            ),
            expandedRail === key ? h(ChevronUpIcon) : h(ChevronDownIcon)
          ),
          expandedRail === key && h('div', { className: 'p-4 bg-gray-50 border-t' },
            h('ol', { className: 'space-y-2' },
              ...fault.checklist.map((step, idx) =>
                h('li', { key: idx, className: 'flex items-start gap-3' },
                  h('span', { className: 'w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0' }, idx + 1),
                  h('span', { className: 'text-sm text-gray-700' }, step)
                )
              )
            )
          )
        )
      )
    );
  };

  const renderDiodeTechnique = () => {
    const technique = measurementsData.diode_mode_technique;
    if (!technique) return null;

    return h('div', { className: 'space-y-4' },
      h('div', { className: 'bg-blue-50 p-4 rounded-lg' },
        h('h4', { className: 'font-bold text-blue-800 mb-3' }, '🔧 Настройка мультиметра'),
        h('div', { className: 'grid grid-cols-2 gap-3' },
          h('div', { className: 'bg-white p-3 rounded' },
            h('p', { className: 'text-xs text-gray-500' }, 'Мультиметр'),
            h('p', { className: 'font-semibold' }, technique.setup.multimeter)
          ),
          h('div', { className: 'bg-white p-3 rounded' },
            h('p', { className: 'text-xs text-gray-500' }, 'Режим'),
            h('p', { className: 'font-semibold' }, technique.setup.mode)
          ),
          h('div', { className: 'bg-red-100 p-3 rounded' },
            h('p', { className: 'text-xs text-red-600' }, 'Красный щуп'),
            h('p', { className: 'font-semibold text-red-700' }, technique.setup.red_probe)
          ),
          h('div', { className: 'bg-gray-800 p-3 rounded' },
            h('p', { className: 'text-xs text-gray-400' }, 'Чёрный щуп'),
            h('p', { className: 'font-semibold text-white' }, technique.setup.black_probe)
          )
        )
      ),

      h('div', { className: 'bg-green-50 p-4 rounded-lg' },
        h('h4', { className: 'font-bold text-green-800 mb-3' }, '📊 Интерпретация значений'),
        h('div', { className: 'space-y-2' },
          ...Object.entries(technique.interpretation).map(([value, meaning]) =>
            h('div', { key: value, className: 'flex items-center gap-3 bg-white p-2 rounded' },
              h('span', { className: 'font-mono font-bold text-blue-600 w-24' }, value),
              h('span', { className: 'text-sm text-gray-700' }, meaning)
            )
          )
        )
      ),

      h('div', { className: 'bg-yellow-50 p-4 rounded-lg' },
        h('h4', { className: 'font-bold text-yellow-800 mb-3' }, '💡 Советы'),
        h('ul', { className: 'space-y-2' },
          ...technique.tips.map((tip, idx) =>
            h('li', { key: idx, className: 'flex items-start gap-2 text-sm text-yellow-900' },
              h('span', { className: 'text-yellow-600' }, '✓'),
              tip
            )
          )
        )
      )
    );
  };

  return h('div', { className: 'bg-white rounded-lg shadow p-4' },
    h('h3', { className: 'text-xl font-bold text-gray-800 mb-4' }, '📏 Замеры и Диагностика'),
    
    // Tabs
    h('div', { className: 'flex flex-wrap gap-2 mb-4 border-b pb-3' },
      ...sections.map(section =>
        h('button', {
          key: section.key,
          onClick: () => { setActiveSection(section.key); setExpandedRail(null); },
          className: `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeSection === section.key 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`
        }, section.name)
      )
    ),

    // Content
    activeSection === 'power_rails' && renderPowerRails(),
    activeSection === 'boot_sequence' && renderBootSequence(),
    activeSection === 'fault_signatures' && renderFaultSignatures(),
    activeSection === 'diode_technique' && renderDiodeTechnique()
  );
};

// ===== КОМПОНЕНТ ВИЗУАЛИЗАЦИИ ПЛАТЫ =====
const BoardVisualization = ({ device, icData, onChipSelect, selectedChip }) => {
  const [boardSide, setBoardSide] = useState('front');
  const [hoveredChip, setHoveredChip] = useState(null);

  const generateComponents = () => {
    const components = [];
    
    if (device.charging_ic) {
      components.push({
        id: 'charging', name: 'Charging IC', fullName: device.charging_ic.main,
        x: 50, y: 85, side: 'front', color: 'bg-yellow-500',
        category: 'charging_ics', icKey: device.charging_ic.main?.split(' ')[0]
      });
    }
    
    if (device.power_ic) {
      components.push({
        id: 'power', name: 'Power IC', fullName: device.power_ic.main,
        x: 45, y: 40, side: 'front', color: 'bg-red-500',
        category: 'power_ics', icKey: device.power_ic.main?.split(' ')[0]
      });
    }
    
    if (device.audio_codec) {
      components.push({
        id: 'audio', name: 'Audio IC', fullName: device.audio_codec.main,
        x: 50, y: 10, side: 'front', color: 'bg-purple-500',
        category: 'audio_ics', icKey: device.audio_codec.main?.split(' ')[0]
      });
    }
    
    if (device.memory) {
      components.push({
        id: 'nand', name: 'NAND', fullName: device.memory.nand_type || 'NVMe NAND',
        x: 65, y: 40, side: 'front', color: 'bg-blue-500', category: 'nand_ics'
      });
    }
    
    components.push({
      id: 'wifi', name: 'WiFi/BT', fullName: 'WiFi/Bluetooth Module',
      x: 70, y: 45, side: 'back', color: 'bg-green-500', category: 'wifi_bt_ics'
    });
    
    if (device.category === 'iPhone') {
      components.push({
        id: 'baseband', name: 'Baseband', fullName: 'Cellular Modem',
        x: 30, y: 75, side: 'back', color: 'bg-orange-500', category: 'baseband_ics'
      });
    }

    return components;
  };

  const components = generateComponents();
  const visibleComponents = components.filter(c => c.side === boardSide);

  return h('div', { className: 'bg-white rounded-lg shadow p-4 mb-4' },
    h('div', { className: 'flex items-center justify-between mb-4' },
      h('h3', { className: 'text-lg font-semibold flex items-center gap-2' },
        h(ChipIcon), 'Расположение компонентов'
      ),
      h('div', { className: 'flex gap-2' },
        h('button', {
          onClick: () => setBoardSide('front'),
          className: `px-3 py-1 rounded text-sm ${boardSide === 'front' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`
        }, 'Лицевая'),
        h('button', {
          onClick: () => setBoardSide('back'),
          className: `px-3 py-1 rounded text-sm ${boardSide === 'back' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`
        }, 'Обратная')
      )
    ),
    
    h('div', { className: 'relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden', style: { height: '350px' } },
      h('div', { className: 'absolute inset-4 bg-green-900 rounded-lg border-2 border-green-700' },
        h('div', { className: 'absolute inset-0 opacity-20' },
          h('svg', { className: 'w-full h-full' },
            ...Array.from({length: 20}, (_, i) => 
              h('line', { key: `h${i}`, x1: 0, y1: i * 20, x2: '100%', y2: i * 20, stroke: '#4ade80', strokeWidth: 0.5 })
            ),
            ...Array.from({length: 15}, (_, i) => 
              h('line', { key: `v${i}`, x1: i * 25, y1: 0, x2: i * 25, y2: '100%', stroke: '#4ade80', strokeWidth: 0.5 })
            )
          )
        )
      ),
      
      ...visibleComponents.map(comp => 
        h('div', {
          key: comp.id,
          className: `absolute cursor-pointer transition-all duration-200 ${selectedChip === comp.id ? 'scale-125 z-20' : 'hover:scale-110 z-10'}`,
          style: { left: `${comp.x}%`, top: `${comp.y}%`, transform: 'translate(-50%, -50%)' },
          onClick: () => onChipSelect(comp),
          onMouseEnter: () => setHoveredChip(comp.id),
          onMouseLeave: () => setHoveredChip(null)
        },
          h('div', { 
            className: `${comp.color} w-12 h-10 rounded flex items-center justify-center shadow-lg border-2 ${selectedChip === comp.id ? 'border-white' : 'border-gray-600'}`
          }, h('span', { className: 'text-white text-xs font-bold' }, comp.name.slice(0, 4))),
          (hoveredChip === comp.id || selectedChip === comp.id) && h('div', {
            className: 'absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white px-3 py-2 rounded shadow-lg text-xs whitespace-nowrap z-30'
          }, h('p', { className: 'font-bold' }, comp.name), h('p', { className: 'text-gray-300' }, comp.fullName))
        )
      ),
      
      h('div', { className: 'absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 justify-center text-xs' },
        h('span', { className: 'px-2 py-1 bg-yellow-500/80 text-white rounded' }, '⚡ Charging'),
        h('span', { className: 'px-2 py-1 bg-red-500/80 text-white rounded' }, '🔋 Power'),
        h('span', { className: 'px-2 py-1 bg-purple-500/80 text-white rounded' }, '🔊 Audio'),
        h('span', { className: 'px-2 py-1 bg-blue-500/80 text-white rounded' }, '💾 NAND'),
        h('span', { className: 'px-2 py-1 bg-green-500/80 text-white rounded' }, '📶 WiFi'),
        h('span', { className: 'px-2 py-1 bg-orange-500/80 text-white rounded' }, '📡 Baseband')
      ),
      
      h('div', { className: 'absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded text-sm' },
        boardSide === 'front' ? '🔍 Лицевая' : '🔍 Обратная'
      )
    ),
    h('p', { className: 'text-sm text-gray-500 mt-2 text-center' }, '💡 Нажмите на компонент для деталей')
  );
};

// ===== КОМПОНЕНТ ДЕТАЛЕЙ МИКРОСХЕМЫ =====
const ChipDetailsPanel = ({ chip, icData, devices, onClose }) => {
  if (!chip) return null;

  const findChipData = () => {
    if (!icData || !chip.category) return null;
    const category = icData[chip.category];
    if (!category) return null;
    if (chip.icKey && category[chip.icKey]) return category[chip.icKey];
    for (const [key, data] of Object.entries(category)) {
      if (chip.fullName?.includes(key) || data.name?.includes(chip.fullName?.split(' ')[0])) return data;
    }
    return null;
  };

  const chipData = findChipData();

  return h('div', { className: 'bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-4 mb-4 border border-blue-200' },
    h('div', { className: 'flex justify-between items-start mb-4' },
      h('div', null,
        h('h3', { className: 'text-xl font-bold text-gray-800' }, chip.name),
        h('p', { className: 'text-gray-600' }, chip.fullName)
      ),
      h('button', { onClick: onClose, className: 'text-gray-400 hover:text-gray-600 text-xl' }, '×')
    ),

    chipData ? h('div', { className: 'space-y-4' },
      h('div', { className: 'grid grid-cols-2 gap-4' },
        h('div', { className: 'bg-white p-3 rounded shadow-sm' },
          h('p', { className: 'text-xs text-gray-500' }, 'Обозначение'),
          h('p', { className: 'font-semibold' }, chipData.designation || 'N/A')
        ),
        h('div', { className: 'bg-white p-3 rounded shadow-sm' },
          h('p', { className: 'text-xs text-gray-500' }, 'Корпус'),
          h('p', { className: 'font-semibold' }, chipData.package || 'N/A')
        )
      ),

      chipData.functions && h('div', { className: 'bg-white p-3 rounded shadow-sm' },
        h('p', { className: 'text-xs text-gray-500 mb-2' }, 'Функции'),
        h('div', { className: 'flex flex-wrap gap-1' },
          ...chipData.functions.map((func, idx) =>
            h('span', { key: idx, className: 'text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded' }, func)
          )
        )
      ),

      chipData.analogues && chipData.analogues.length > 0 && h('div', { className: 'bg-white p-3 rounded shadow-sm' },
        h('p', { className: 'text-xs text-gray-500 mb-2' }, '🔄 Аналоги'),
        h('div', { className: 'space-y-2' },
          ...chipData.analogues.map((analog, idx) =>
            h('div', { key: idx, className: 'flex items-center justify-between bg-green-50 p-2 rounded' },
              h('div', null,
                h('span', { className: 'font-semibold text-green-800' }, analog.part),
                h('span', { className: 'text-xs text-gray-500 ml-2' }, analog.notes)
              ),
              h('span', { className: `text-xs px-2 py-1 rounded ${analog.compatibility === '100%' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'}` }, analog.compatibility)
            )
          )
        )
      ),

      chipData.donor_models && chipData.donor_models.length > 0 && h('div', { className: 'bg-white p-3 rounded shadow-sm' },
        h('p', { className: 'text-xs text-gray-500 mb-2' }, '📱 Доноры'),
        h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
          ...chipData.donor_models.map((donor, idx) =>
            h('div', { key: idx, className: 'bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded border' },
              h('div', { className: 'flex justify-between items-start' },
                h('div', null,
                  h('p', { className: 'font-semibold text-sm' }, donor.model),
                  h('p', { className: 'text-xs text-gray-500' }, `${donor.years} • ${donor.location}`)
                ),
                h('span', { className: `text-xs px-2 py-1 rounded ${
                  donor.difficulty.includes('Средняя') ? 'bg-yellow-100 text-yellow-800' :
                  donor.difficulty.includes('Сложная') ? 'bg-orange-100 text-orange-800' :
                  donor.difficulty.includes('Экстремально') ? 'bg-red-100 text-red-800' :
                  donor.difficulty.includes('Невозможно') ? 'bg-gray-800 text-white' : 'bg-green-100 text-green-800'
                }` }, donor.difficulty)
              )
            )
          )
        )
      ),

      h('div', { className: 'flex gap-2 items-center' },
        chipData.price_range && h('div', { className: 'px-4 py-2 bg-green-100 text-green-700 rounded font-semibold' }, '💰 ', chipData.price_range),
        chipData.aliexpress && h('a', { href: chipData.aliexpress, target: '_blank', className: 'px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm' }, '🛒 AliExpress')
      ),

      chipData.notes?.includes('ПРИВЯЗАН') && h('div', { className: 'bg-red-100 border border-red-300 p-3 rounded' },
        h('p', { className: 'text-red-800 text-sm font-semibold' }, '⚠️ ', chipData.notes)
      )
    ) : h('div', { className: 'text-center py-8 text-gray-500' }, 'Подробная информация будет добавлена позже')
  );
};

// ===== ГЛАВНЫЙ КОМПОНЕНТ =====
const RepairTool = () => {
  const [devices, setDevices] = useState([]);
  const [icData, setIcData] = useState(null);
  const [measurementsData, setMeasurementsData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedChip, setSelectedChip] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [expandedSections, setExpandedSections] = useState({
    charging: true, memory: true, power: true, audio: true, issues: true, tools: true
  });
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
      console.error('Ошибка загрузки:', err);
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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChipSelect = (chip) => {
    setSelectedChip(chip);
    setActiveTab('chips');
  };

  const renderDeviceCard = (device) => {
    return h('div', {
      key: device.id,
      className: 'bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500',
      onClick: () => { setSelectedDevice(device); setActiveTab('info'); setSelectedChip(null); }
    },
      h('div', { className: 'flex justify-between items-start' },
        h('div', null,
          h('h3', { className: 'text-xl font-bold text-gray-800' }, device.name),
          h('p', { className: 'text-sm text-gray-600 mt-1' }, device.model),
          h('p', { className: 'text-xs text-gray-500 mt-1' }, `${device.year} • ${device.category}`)
        ),
        h('span', { className: 'text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded' }, device.processor)
      )
    );
  };

  const renderSection = (title, icon, content, sectionKey) => {
    const isExpanded = expandedSections[sectionKey];
    return h('div', { className: 'bg-gray-50 rounded-lg p-4 mb-4' },
      h('div', { className: 'flex items-center justify-between cursor-pointer', onClick: () => toggleSection(sectionKey) },
        h('div', { className: 'flex items-center gap-2' },
          h('span', { className: 'text-blue-600' }, icon),
          h('h3', { className: 'text-lg font-semibold text-gray-800' }, title)
        ),
        isExpanded ? h(ChevronUpIcon) : h(ChevronDownIcon)
      ),
      isExpanded && h('div', { className: 'mt-4' }, content)
    );
  };

  const renderICSection = (title, icon, icInfo, sectionKey, icCategory) => {
    if (!icInfo) return null;
    const isExpanded = expandedSections[sectionKey];
    const icName = icInfo.main?.split(' ')[0];
    const compatData = icData?.[icCategory]?.[icName];
    
    return h('div', { className: 'bg-gray-50 rounded-lg p-4 mb-4' },
      h('div', { className: 'flex items-center justify-between cursor-pointer', onClick: () => toggleSection(sectionKey) },
        h('div', { className: 'flex items-center gap-2' },
          h('span', { className: 'text-blue-600' }, icon),
          h('h3', { className: 'text-lg font-semibold text-gray-800' }, title)
        ),
        isExpanded ? h(ChevronUpIcon) : h(ChevronDownIcon)
      ),
      isExpanded && h('div', { className: 'mt-4' },
        h('div', { className: 'grid grid-cols-2 gap-4 mb-4' },
          h('div', null,
            h('p', { className: 'text-sm text-gray-600' }, 'Микросхема:'),
            h('p', { className: 'font-semibold' }, icInfo.main),
            icInfo.full_name && h('p', { className: 'text-xs text-gray-500 mt-1' }, icInfo.full_name)
          ),
          h('div', null,
            h('p', { className: 'text-sm text-gray-600' }, 'Расположение:'),
            h('p', { className: 'font-semibold' }, icInfo.location)
          ),
          icInfo.voltage_support && h('div', null,
            h('p', { className: 'text-sm text-gray-600' }, 'Напряжение:'),
            h('p', { className: 'font-semibold' }, icInfo.voltage_support || icInfo.voltage)
          ),
          icInfo.max_current && h('div', null,
            h('p', { className: 'text-sm text-gray-600' }, 'Макс. ток:'),
            h('p', { className: 'font-semibold' }, icInfo.max_current || icInfo.current)
          )
        ),

        (icInfo.fast_charging || icInfo.usb_pd || icInfo.wireless_charging) && 
        h('div', { className: 'grid grid-cols-3 gap-2 mb-4 text-xs' },
          icInfo.fast_charging && h('div', { className: 'bg-green-50 p-2 rounded' },
            h('p', { className: 'text-gray-600' }, '⚡ Быстрая:'), h('p', { className: 'font-semibold text-green-700' }, icInfo.fast_charging)
          ),
          icInfo.usb_pd && h('div', { className: 'bg-blue-50 p-2 rounded' },
            h('p', { className: 'text-gray-600' }, '🔌 USB PD:'), h('p', { className: 'font-semibold text-blue-700' }, icInfo.usb_pd)
          ),
          icInfo.wireless_charging && h('div', { className: 'bg-purple-50 p-2 rounded' },
            h('p', { className: 'text-gray-600' }, '📡 Wireless:'), h('p', { className: 'font-semibold text-purple-700' }, icInfo.wireless_charging)
          )
        ),

        compatData?.analogues && compatData.analogues.length > 0 && h('div', { className: 'mb-4' },
          h('p', { className: 'text-sm font-semibold text-gray-700 mb-2' }, '🔄 Аналоги:'),
          h('div', { className: 'flex flex-wrap gap-2' },
            ...compatData.analogues.map((a, i) =>
              h('span', { key: i, className: `text-xs px-2 py-1 rounded ${a.compatibility === '100%' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}` }, `${a.part} (${a.compatibility})`)
            )
          )
        ),

        compatData?.donor_models && compatData.donor_models.length > 0 && h('div', { className: 'mb-4' },
          h('p', { className: 'text-sm font-semibold text-gray-700 mb-2' }, '📱 Доноры:'),
          h('div', { className: 'grid grid-cols-2 sm:grid-cols-3 gap-2' },
            ...compatData.donor_models.slice(0, 6).map((d, i) =>
              h('div', { key: i, className: 'text-xs p-2 bg-white rounded border' },
                h('p', { className: 'font-semibold' }, d.model),
                h('p', { className: 'text-gray-500' }, d.difficulty)
              )
            )
          ),
          compatData.donor_models.length > 6 && h('p', { className: 'text-xs text-gray-500 mt-2' }, `+ ещё ${compatData.donor_models.length - 6}`)
        ),

        h('div', { className: 'flex gap-2' },
          icInfo.aliexpress && h('a', { href: icInfo.aliexpress, target: '_blank', className: 'px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm' }, '🛒 AliExpress'),
          h('button', {
            onClick: () => handleChipSelect({ id: sectionKey, name: title, fullName: icInfo.main, category: icCategory, icKey: icName }),
            className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm'
          }, '🔍 Подробнее'),
          h('div', { className: 'flex-1' }),
          icInfo.price_range && h('div', { className: 'px-4 py-2 bg-green-100 text-green-700 rounded font-semibold' }, '💰 ', icInfo.price_range)
        )
      )
    );
  };

  const renderDeviceDetails = () => {
    if (!selectedDevice) return null;

    return h('div', { className: 'bg-white rounded-lg shadow-xl p-6' },
      h('div', { className: 'border-b pb-4 mb-4' },
        h('button', { onClick: () => { setSelectedDevice(null); setSelectedChip(null); }, className: 'text-blue-600 hover:text-blue-800 mb-2' }, '← Назад'),
        h('h2', { className: 'text-2xl font-bold text-gray-800' }, selectedDevice.name),
        h('p', { className: 'text-gray-600 mt-1' }, selectedDevice.model),
        h('div', { className: 'flex gap-2 mt-2 flex-wrap' },
          h('span', { className: 'text-xs px-2 py-1 bg-gray-100 rounded' }, `${selectedDevice.year}`),
          h('span', { className: 'text-xs px-2 py-1 bg-gray-100 rounded' }, selectedDevice.category),
          h('span', { className: 'text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded' }, selectedDevice.processor),
          selectedDevice.board_numbers?.map((bn, i) =>
            h('span', { key: i, className: 'text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded' }, `Board: ${bn}`)
          )
        )
      ),

      h('div', { className: 'flex gap-2 mb-4 border-b overflow-x-auto pb-2' },
        h('button', { onClick: () => setActiveTab('info'), className: `px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}` }, '📋 Инфо'),
        h('button', { onClick: () => setActiveTab('board'), className: `px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'board' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}` }, '🔌 Плата'),
        h('button', { onClick: () => setActiveTab('chips'), className: `px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'chips' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}` }, '🔧 IC'),
        h('button', { onClick: () => setActiveTab('measurements'), className: `px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'measurements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}` }, '📏 Замеры')
      ),

      activeTab === 'board' && h('div', null,
        h(BoardVisualization, { device: selectedDevice, icData, onChipSelect: handleChipSelect, selectedChip: selectedChip?.id }),
        selectedChip && h(ChipDetailsPanel, { chip: selectedChip, icData, devices, onClose: () => setSelectedChip(null) })
      ),

      activeTab === 'chips' && h('div', null,
        selectedChip && h(ChipDetailsPanel, { chip: selectedChip, icData, devices, onClose: () => setSelectedChip(null) })
      ),

      activeTab === 'measurements' && h(MeasurementsPanel, { measurementsData }),

      activeTab === 'info' && h('div', null,
        renderICSection('Charging IC', '⚡', selectedDevice.charging_ic, 'charging', 'charging_ics'),
        selectedDevice.memory && renderSection('Память', '💾',
          h('div', { className: 'grid grid-cols-2 gap-4' },
            h('div', null, h('p', { className: 'text-sm text-gray-600' }, 'NAND:'), h('p', { className: 'font-semibold' }, selectedDevice.memory.nand_type || 'N/A'), selectedDevice.memory.price_nand && h('p', { className: 'text-sm text-green-600' }, selectedDevice.memory.price_nand)),
            h('div', null, h('p', { className: 'text-sm text-gray-600' }, 'RAM:'), h('p', { className: 'font-semibold' }, selectedDevice.memory.ram_type || 'N/A'), selectedDevice.memory.price_ram && h('p', { className: 'text-sm text-green-600' }, selectedDevice.memory.price_ram))
          ), 'memory'),
        renderICSection('Power IC', '🔋', selectedDevice.power_ic, 'power', 'power_ics'),
        renderICSection('Audio Codec', '🔊', selectedDevice.audio_codec, 'audio', 'audio_ics'),
        
        selectedDevice.common_issues?.length > 0 && renderSection('Типовые неисправности', '⚠️',
          h('ul', { className: 'space-y-2' },
            ...selectedDevice.common_issues.map((issue, idx) =>
              h('li', { key: idx, className: 'flex items-start gap-2' }, h('span', { className: 'text-red-500' }, '•'), h('span', { className: 'text-sm' }, issue))
            )
          ), 'issues'),

        selectedDevice.tools_needed?.length > 0 && renderSection('Инструменты', '🔧',
          h('ul', { className: 'space-y-2' },
            ...selectedDevice.tools_needed.map((tool, idx) =>
              h('li', { key: idx, className: 'flex items-start gap-2' }, h('span', { className: 'text-blue-500' }, '✓'), h('span', { className: 'text-sm' }, tool))
            )
          ), 'tools'),

        selectedDevice.repair_notes && h('div', { className: 'mt-4 p-4 bg-blue-50 rounded-lg' },
          h('p', { className: 'text-sm text-gray-700' }, '📝 ', selectedDevice.repair_notes)
        ),

        h('div', { className: 'mt-4 flex gap-4' },
          selectedDevice.repair_difficulty && h('div', null,
            h('span', { className: 'text-sm text-gray-600' }, 'Сложность: '),
            h('span', { className: `font-semibold ${
              selectedDevice.repair_difficulty.includes('Средняя') ? 'text-yellow-600' :
              selectedDevice.repair_difficulty.includes('Сложная') ? 'text-orange-600' :
              selectedDevice.repair_difficulty.includes('Экстремально') ? 'text-red-600' : 'text-green-600'
            }` }, selectedDevice.repair_difficulty)
          ),
          selectedDevice.repair_time && h('div', null,
            h('span', { className: 'text-sm text-gray-600' }, 'Время: '),
            h('span', { className: 'font-semibold' }, selectedDevice.repair_time)
          )
        ),

        selectedDevice.documentation_links && h('div', { className: 'mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg' },
          h('h3', { className: 'text-lg font-semibold mb-3' }, '📚 Ресурсы'),
          h('div', { className: 'grid grid-cols-2 gap-2' },
            Object.entries(selectedDevice.documentation_links).map(([key, url]) =>
              h('a', { key, href: url, target: '_blank', className: 'flex items-center gap-2 px-3 py-2 bg-white rounded shadow-sm hover:shadow-md text-sm' },
                '🔗', key === 'ifixit' ? 'iFixit' : key === 'apple_support' ? 'Apple' : key === 'boardview' ? 'BoardView' : key === 'schematics' ? 'Схемы' : key
              )
            )
          )
        )
      )
    );
  };

  if (loading) {
    return h('div', { className: 'flex items-center justify-center h-64' },
      h('div', { className: 'text-xl text-gray-600' }, 'Загрузка...')
    );
  }

  return h('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4' },
    h('div', { className: 'max-w-7xl mx-auto' },
      h('div', { className: 'text-center mb-8' },
        h('h1', { className: 'text-4xl font-bold text-gray-800 mb-2' }, '🔧 Apple Repair Tool'),
        h('p', { className: 'text-gray-600' }, 'База для ремонта Apple: микросхемы, доноры, замеры'),
        h('p', { className: 'text-sm text-gray-500 mt-1' }, 'v2.1 • Аналоги • Доноры • Диод-режим • Boot Sequence')
      ),

      !selectedDevice && h('div', { className: 'mb-6' },
        h('div', { className: 'relative' },
          h('input', {
            type: 'text',
            placeholder: 'Поиск по модели...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: 'w-full px-4 py-3 pl-12 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none'
          }),
          h('div', { className: 'absolute left-4 top-3.5 text-gray-400' }, h(SearchIcon))
        ),
        h('p', { className: 'text-sm text-gray-600 mt-2' }, `Найдено: ${filteredDevices.length} из ${devices.length}`)
      ),

      selectedDevice ? renderDeviceDetails() :
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
          ...filteredDevices.map(device => renderDeviceCard(device))
        )
    )
  );
};

ReactDOM.createRoot(document.getElementById('app')).render(h(RepairTool));
