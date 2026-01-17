// Apple Repair Tool - Main Application v2.0
// С визуализацией расположения микросхем и поиском доноров
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

// Компонент визуализации платы
const BoardVisualization = ({ device, icData, onChipSelect, selectedChip }) => {
  const [boardSide, setBoardSide] = useState('front');
  const [hoveredChip, setHoveredChip] = useState(null);
  
  // Определяем какая раскладка платы использовать
  const getBoardLayout = () => {
    const name = device.name.toLowerCase();
    if (name.includes('15')) return 'iphone_15_layout';
    if (name.includes('12') || name.includes('13') || name.includes('14')) return 'iphone_12_layout';
    if (name.includes('x') || name.includes('xs') || name.includes('xr') || name.includes('11')) return 'iphone_x_layout';
    return 'iphone_x_layout'; // fallback
  };

  const layoutKey = getBoardLayout();
  const layout = icData?.board_layouts?.[layoutKey];

  // Генерируем компоненты на основе данных устройства
  const generateComponents = () => {
    const components = [];
    
    // Charging IC
    if (device.charging_ic) {
      const icName = device.charging_ic.main?.split(' ')[0];
      components.push({
        id: 'charging',
        name: 'Charging IC',
        fullName: device.charging_ic.main,
        x: 50, y: 85,
        side: 'front',
        color: 'bg-yellow-500',
        category: 'charging_ics',
        icKey: icName
      });
    }
    
    // Power IC
    if (device.power_ic) {
      components.push({
        id: 'power',
        name: 'Power IC',
        fullName: device.power_ic.main,
        x: 45, y: 40,
        side: 'front',
        color: 'bg-red-500',
        category: 'power_ics',
        icKey: device.power_ic.main?.split(' ')[0]
      });
    }
    
    // Audio Codec
    if (device.audio_codec) {
      components.push({
        id: 'audio',
        name: 'Audio IC',
        fullName: device.audio_codec.main,
        x: 50, y: 10,
        side: 'front',
        color: 'bg-purple-500',
        category: 'audio_ics',
        icKey: device.audio_codec.main?.split(' ')[0]
      });
    }
    
    // NAND
    if (device.memory) {
      components.push({
        id: 'nand',
        name: 'NAND',
        fullName: device.memory.nand_type || 'NVMe NAND',
        x: 65, y: 40,
        side: 'front',
        color: 'bg-blue-500',
        category: 'nand_ics'
      });
    }
    
    // WiFi/BT (предполагаем наличие)
    components.push({
      id: 'wifi',
      name: 'WiFi/BT',
      fullName: 'WiFi/Bluetooth Module',
      x: 70, y: 45,
      side: 'back',
      color: 'bg-green-500',
      category: 'wifi_bt_ics'
    });
    
    // Baseband (для моделей с модемом)
    if (device.category === 'iPhone') {
      components.push({
        id: 'baseband',
        name: 'Baseband',
        fullName: 'Cellular Modem',
        x: 30, y: 75,
        side: 'back',
        color: 'bg-orange-500',
        category: 'baseband_ics'
      });
    }

    return components;
  };

  const components = generateComponents();
  const visibleComponents = components.filter(c => c.side === boardSide);

  return h('div', { className: 'bg-white rounded-lg shadow p-4 mb-4' },
    h('div', { className: 'flex items-center justify-between mb-4' },
      h('h3', { className: 'text-lg font-semibold flex items-center gap-2' },
        h(ChipIcon),
        'Расположение компонентов на плате'
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
    
    // Визуализация платы
    h('div', { className: 'relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden', style: { height: '400px' } },
      // Фон платы
      h('div', { className: 'absolute inset-4 bg-green-900 rounded-lg border-2 border-green-700' },
        // Паттерн дорожек
        h('div', { className: 'absolute inset-0 opacity-20' },
          h('svg', { className: 'w-full h-full' },
            // Горизонтальные линии
            ...Array.from({length: 20}, (_, i) => 
              h('line', { 
                key: `h${i}`,
                x1: 0, y1: i * 20, x2: '100%', y2: i * 20,
                stroke: '#4ade80', strokeWidth: 0.5
              })
            ),
            // Вертикальные линии
            ...Array.from({length: 15}, (_, i) => 
              h('line', { 
                key: `v${i}`,
                x1: i * 25, y1: 0, x2: i * 25, y2: '100%',
                stroke: '#4ade80', strokeWidth: 0.5
              })
            )
          )
        )
      ),
      
      // Компоненты на плате
      ...visibleComponents.map(comp => 
        h('div', {
          key: comp.id,
          className: `absolute cursor-pointer transition-all duration-200 ${
            selectedChip === comp.id ? 'scale-125 z-20' : 'hover:scale-110 z-10'
          }`,
          style: {
            left: `${comp.x}%`,
            top: `${comp.y}%`,
            transform: 'translate(-50%, -50%)'
          },
          onClick: () => onChipSelect(comp),
          onMouseEnter: () => setHoveredChip(comp.id),
          onMouseLeave: () => setHoveredChip(null)
        },
          // Чип
          h('div', { 
            className: `${comp.color} w-12 h-10 rounded flex items-center justify-center shadow-lg border-2 ${
              selectedChip === comp.id ? 'border-white' : 'border-gray-600'
            }`
          },
            h('span', { className: 'text-white text-xs font-bold' }, comp.name.slice(0, 4))
          ),
          // Tooltip
          (hoveredChip === comp.id || selectedChip === comp.id) && h('div', {
            className: 'absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white px-3 py-2 rounded shadow-lg text-xs whitespace-nowrap z-30'
          },
            h('p', { className: 'font-bold' }, comp.name),
            h('p', { className: 'text-gray-300' }, comp.fullName)
          )
        )
      ),
      
      // Легенда
      h('div', { className: 'absolute bottom-2 left-2 right-2 flex flex-wrap gap-2 justify-center' },
        h('span', { className: 'text-xs px-2 py-1 bg-yellow-500/80 text-white rounded' }, '⚡ Charging'),
        h('span', { className: 'text-xs px-2 py-1 bg-red-500/80 text-white rounded' }, '🔋 Power'),
        h('span', { className: 'text-xs px-2 py-1 bg-purple-500/80 text-white rounded' }, '🔊 Audio'),
        h('span', { className: 'text-xs px-2 py-1 bg-blue-500/80 text-white rounded' }, '💾 NAND'),
        h('span', { className: 'text-xs px-2 py-1 bg-green-500/80 text-white rounded' }, '📶 WiFi'),
        h('span', { className: 'text-xs px-2 py-1 bg-orange-500/80 text-white rounded' }, '📡 Baseband')
      ),
      
      // Индикатор стороны
      h('div', { className: 'absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded text-sm' },
        boardSide === 'front' ? '🔍 Лицевая сторона' : '🔍 Обратная сторона'
      )
    ),
    
    // Подсказка
    h('p', { className: 'text-sm text-gray-500 mt-2 text-center' }, 
      '💡 Нажмите на компонент для просмотра деталей и поиска доноров'
    )
  );
};

// Компонент детальной информации о микросхеме
const ChipDetailsPanel = ({ chip, icData, devices, onClose }) => {
  if (!chip) return null;

  // Ищем данные о микросхеме в базе совместимости
  const findChipData = () => {
    if (!icData || !chip.category) return null;
    const category = icData[chip.category];
    if (!category) return null;
    
    // Ищем по ключу или перебираем все
    if (chip.icKey && category[chip.icKey]) {
      return category[chip.icKey];
    }
    
    // Ищем по частичному совпадению названия
    for (const [key, data] of Object.entries(category)) {
      if (chip.fullName?.includes(key) || data.name?.includes(chip.fullName?.split(' ')[0])) {
        return data;
      }
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
      h('button', {
        onClick: onClose,
        className: 'text-gray-400 hover:text-gray-600 text-xl'
      }, '×')
    ),

    chipData ? h('div', { className: 'space-y-4' },
      // Основная информация
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

      // Функции
      chipData.functions && h('div', { className: 'bg-white p-3 rounded shadow-sm' },
        h('p', { className: 'text-xs text-gray-500 mb-2' }, 'Функции'),
        h('div', { className: 'flex flex-wrap gap-1' },
          ...chipData.functions.map((func, idx) =>
            h('span', { key: idx, className: 'text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded' }, func)
          )
        )
      ),

      // Аналоги
      chipData.analogues && chipData.analogues.length > 0 && h('div', { className: 'bg-white p-3 rounded shadow-sm' },
        h('p', { className: 'text-xs text-gray-500 mb-2' }, '🔄 Аналоги (совместимые замены)'),
        h('div', { className: 'space-y-2' },
          ...chipData.analogues.map((analog, idx) =>
            h('div', { key: idx, className: 'flex items-center justify-between bg-green-50 p-2 rounded' },
              h('div', null,
                h('span', { className: 'font-semibold text-green-800' }, analog.part),
                h('span', { className: 'text-xs text-gray-500 ml-2' }, analog.notes)
              ),
              h('span', { 
                className: `text-xs px-2 py-1 rounded ${
                  analog.compatibility === '100%' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'
                }`
              }, analog.compatibility)
            )
          )
        )
      ),

      // Доноры
      chipData.donor_models && chipData.donor_models.length > 0 && h('div', { className: 'bg-white p-3 rounded shadow-sm' },
        h('p', { className: 'text-xs text-gray-500 mb-2' }, '📱 Модели-доноры (откуда можно выпаять)'),
        h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
          ...chipData.donor_models.map((donor, idx) =>
            h('div', { key: idx, className: 'bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded border' },
              h('div', { className: 'flex justify-between items-start' },
                h('div', null,
                  h('p', { className: 'font-semibold text-sm' }, donor.model),
                  h('p', { className: 'text-xs text-gray-500' }, `${donor.years} • ${donor.location}`)
                ),
                h('span', { 
                  className: `text-xs px-2 py-1 rounded ${
                    donor.difficulty.includes('Средняя') ? 'bg-yellow-100 text-yellow-800' :
                    donor.difficulty.includes('Сложная') ? 'bg-orange-100 text-orange-800' :
                    donor.difficulty.includes('Экстремально') ? 'bg-red-100 text-red-800' :
                    donor.difficulty.includes('Невозможно') ? 'bg-gray-800 text-white' :
                    'bg-green-100 text-green-800'
                  }`
                }, donor.difficulty)
              )
            )
          )
        )
      ),

      // Цена и покупка
      h('div', { className: 'flex gap-2 items-center' },
        chipData.price_range && h('div', { className: 'px-4 py-2 bg-green-100 text-green-700 rounded font-semibold' },
          '💰 ', chipData.price_range
        ),
        chipData.aliexpress && h('a', {
          href: chipData.aliexpress,
          target: '_blank',
          className: 'px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm'
        }, '🛒 Купить на AliExpress')
      ),

      // Предупреждение для привязанных IC
      chipData.notes?.includes('ПРИВЯЗАН') && h('div', { className: 'bg-red-100 border border-red-300 p-3 rounded' },
        h('p', { className: 'text-red-800 text-sm font-semibold' }, '⚠️ ', chipData.notes)
      )
    ) : h('div', { className: 'text-center py-8 text-gray-500' },
      h('p', null, 'Подробная информация о данной микросхеме будет добавлена позже'),
      h('p', { className: 'text-sm mt-2' }, 'Проверьте маркировку на плате для точной идентификации')
    )
  );
};

// Компонент списка всех заменяемых микросхем
const AllReplacableChips = ({ device, icData, onChipSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const chipCategories = [
    { key: 'charging_ics', name: 'Charging IC', icon: '⚡', color: 'yellow' },
    { key: 'power_ics', name: 'Power IC', icon: '🔋', color: 'red' },
    { key: 'audio_ics', name: 'Audio IC', icon: '🔊', color: 'purple' },
    { key: 'wifi_bt_ics', name: 'WiFi/BT', icon: '📶', color: 'green' },
    { key: 'baseband_ics', name: 'Baseband', icon: '📡', color: 'orange' },
    { key: 'nand_ics', name: 'NAND', icon: '💾', color: 'blue' },
    { key: 'display_ics', name: 'Display IC', icon: '🖥️', color: 'pink' },
    { key: 'face_id_ics', name: 'Face ID', icon: '👤', color: 'gray' }
  ];

  return h('div', { className: 'bg-white rounded-lg shadow p-4 mb-4' },
    h('div', { 
      className: 'flex items-center justify-between cursor-pointer',
      onClick: () => setExpanded(!expanded)
    },
      h('h3', { className: 'text-lg font-semibold flex items-center gap-2' },
        '🔧 Все заменяемые микросхемы'
      ),
      expanded ? h(ChevronUpIcon) : h(ChevronDownIcon)
    ),

    expanded && h('div', { className: 'mt-4 grid grid-cols-1 md:grid-cols-2 gap-4' },
      ...chipCategories.map(cat => {
        const chips = icData?.[cat.key];
        if (!chips) return null;
        
        return h('div', { key: cat.key, className: `bg-${cat.color}-50 p-3 rounded border border-${cat.color}-200` },
          h('h4', { className: `font-semibold text-${cat.color}-800 mb-2` }, `${cat.icon} ${cat.name}`),
          h('div', { className: 'space-y-1' },
            ...Object.entries(chips).slice(0, 3).map(([key, data]) =>
              h('div', { 
                key: key,
                className: 'text-sm p-2 bg-white rounded cursor-pointer hover:shadow-md transition-shadow',
                onClick: () => onChipSelect({ 
                  id: key, 
                  name: cat.name, 
                  fullName: data.name,
                  category: cat.key 
                })
              },
                h('p', { className: 'font-medium' }, data.name),
                h('p', { className: 'text-xs text-gray-500' }, 
                  `${data.donor_models?.length || 0} доноров • ${data.analogues?.length || 0} аналогов`
                )
              )
            ),
            Object.keys(chips).length > 3 && h('p', { className: 'text-xs text-gray-500 text-center' },
              `+ ещё ${Object.keys(chips).length - 3} микросхем`
            )
          )
        );
      })
    )
  );
};

// Главный компонент
const RepairTool = () => {
  const [devices, setDevices] = useState([]);
  const [icData, setIcData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedChip, setSelectedChip] = useState(null);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'board', 'chips'
  const [expandedSections, setExpandedSections] = useState({
    charging: true,
    memory: true,
    power: true,
    audio: true,
    issues: true,
    tools: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/devices.json').then(res => res.json()),
      fetch('/data/ic_compatibility.json').then(res => res.json())
    ])
    .then(([devicesData, icCompatData]) => {
      setDevices(devicesData);
      setIcData(icCompatData);
      setLoading(false);
    })
    .catch(err => {
      console.error('Ошибка загрузки данных:', err);
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
      onClick: () => {
        setSelectedDevice(device);
        setActiveTab('info');
        setSelectedChip(null);
      }
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
      h('div', {
        className: 'flex items-center justify-between cursor-pointer',
        onClick: () => toggleSection(sectionKey)
      },
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
    
    // Ищем данные о микросхеме в базе совместимости
    const icName = icInfo.main?.split(' ')[0];
    const compatData = icData?.[icCategory]?.[icName];
    
    return h('div', { className: 'bg-gray-50 rounded-lg p-4 mb-4' },
      h('div', {
        className: 'flex items-center justify-between cursor-pointer',
        onClick: () => toggleSection(sectionKey)
      },
        h('div', { className: 'flex items-center gap-2' },
          h('span', { className: 'text-blue-600' }, icon),
          h('h3', { className: 'text-lg font-semibold text-gray-800' }, title)
        ),
        isExpanded ? h(ChevronUpIcon) : h(ChevronDownIcon)
      ),
      isExpanded && h('div', { className: 'mt-4' },
        // Основная информация
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

        // Дополнительные характеристики
        (icInfo.fast_charging || icInfo.usb_pd || icInfo.wireless_charging) && 
        h('div', { className: 'grid grid-cols-3 gap-2 mb-4 text-xs' },
          icInfo.fast_charging && h('div', { className: 'bg-green-50 p-2 rounded' },
            h('p', { className: 'text-gray-600' }, '⚡ Быстрая зарядка:'),
            h('p', { className: 'font-semibold text-green-700' }, icInfo.fast_charging)
          ),
          icInfo.usb_pd && h('div', { className: 'bg-blue-50 p-2 rounded' },
            h('p', { className: 'text-gray-600' }, '🔌 USB PD:'),
            h('p', { className: 'font-semibold text-blue-700' }, icInfo.usb_pd)
          ),
          icInfo.wireless_charging && h('div', { className: 'bg-purple-50 p-2 rounded' },
            h('p', { className: 'text-gray-600' }, '📡 Беспроводная:'),
            h('p', { className: 'font-semibold text-purple-700' }, icInfo.wireless_charging)
          )
        ),

        // Аналоги (из базы совместимости)
        compatData?.analogues && compatData.analogues.length > 0 && h('div', { className: 'mb-4' },
          h('p', { className: 'text-sm font-semibold text-gray-700 mb-2' }, '🔄 Совместимые аналоги:'),
          h('div', { className: 'flex flex-wrap gap-2' },
            ...compatData.analogues.map((analog, idx) =>
              h('span', { 
                key: idx, 
                className: `text-xs px-2 py-1 rounded ${
                  analog.compatibility === '100%' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`
              }, `${analog.part} (${analog.compatibility})`)
            )
          )
        ),

        // Доноры (из базы совместимости)
        compatData?.donor_models && compatData.donor_models.length > 0 && h('div', { className: 'mb-4' },
          h('p', { className: 'text-sm font-semibold text-gray-700 mb-2' }, '📱 Модели-доноры:'),
          h('div', { className: 'grid grid-cols-2 sm:grid-cols-3 gap-2' },
            ...compatData.donor_models.slice(0, 6).map((donor, idx) =>
              h('div', { key: idx, className: 'text-xs p-2 bg-white rounded border' },
                h('p', { className: 'font-semibold' }, donor.model),
                h('p', { className: 'text-gray-500' }, donor.difficulty)
              )
            )
          ),
          compatData.donor_models.length > 6 && h('p', { className: 'text-xs text-gray-500 mt-2' },
            `+ ещё ${compatData.donor_models.length - 6} моделей`
          )
        ),

        // Кнопки действий
        h('div', { className: 'flex gap-2' },
          icInfo.aliexpress && h('a', {
            href: icInfo.aliexpress,
            target: '_blank',
            className: 'inline-block px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm'
          }, '🛒 Купить на AliExpress'),
          h('button', {
            onClick: () => handleChipSelect({ 
              id: sectionKey, 
              name: title, 
              fullName: icInfo.main,
              category: icCategory,
              icKey: icName
            }),
            className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm'
          }, '🔍 Подробнее'),
          h('div', { className: 'flex-1' }),
          icInfo.price_range && h('div', { className: 'px-4 py-2 bg-green-100 text-green-700 rounded font-semibold' }, 
            '💰 ', icInfo.price_range
          )
        )
      )
    );
  };

  const renderDeviceDetails = () => {
    if (!selectedDevice) return null;

    return h('div', { className: 'bg-white rounded-lg shadow-xl p-6' },
      // Header
      h('div', { className: 'border-b pb-4 mb-4' },
        h('button', {
          onClick: () => {
            setSelectedDevice(null);
            setSelectedChip(null);
          },
          className: 'text-blue-600 hover:text-blue-800 mb-2'
        }, '← Назад к списку'),
        h('h2', { className: 'text-2xl font-bold text-gray-800' }, selectedDevice.name),
        h('p', { className: 'text-gray-600 mt-1' }, selectedDevice.model),
        h('div', { className: 'flex gap-2 mt-2 flex-wrap' },
          h('span', { className: 'text-xs px-2 py-1 bg-gray-100 rounded' }, `${selectedDevice.year}`),
          h('span', { className: 'text-xs px-2 py-1 bg-gray-100 rounded' }, selectedDevice.category),
          h('span', { className: 'text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded' }, selectedDevice.processor),
          selectedDevice.board_numbers && selectedDevice.board_numbers.map((bn, idx) =>
            h('span', { key: idx, className: 'text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded' }, `Board: ${bn}`)
          )
        )
      ),

      // Tabs
      h('div', { className: 'flex gap-2 mb-4 border-b' },
        h('button', {
          onClick: () => setActiveTab('info'),
          className: `px-4 py-2 font-medium ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`
        }, '📋 Информация'),
        h('button', {
          onClick: () => setActiveTab('board'),
          className: `px-4 py-2 font-medium ${activeTab === 'board' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`
        }, '🔌 Карта платы'),
        h('button', {
          onClick: () => setActiveTab('chips'),
          className: `px-4 py-2 font-medium ${activeTab === 'chips' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`
        }, '🔧 Микросхемы')
      ),

      // Tab content
      activeTab === 'board' && h('div', null,
        h(BoardVisualization, {
          device: selectedDevice,
          icData: icData,
          onChipSelect: handleChipSelect,
          selectedChip: selectedChip?.id
        }),
        selectedChip && h(ChipDetailsPanel, {
          chip: selectedChip,
          icData: icData,
          devices: devices,
          onClose: () => setSelectedChip(null)
        })
      ),

      activeTab === 'chips' && h('div', null,
        selectedChip && h(ChipDetailsPanel, {
          chip: selectedChip,
          icData: icData,
          devices: devices,
          onClose: () => setSelectedChip(null)
        }),
        h(AllReplacableChips, {
          device: selectedDevice,
          icData: icData,
          onChipSelect: handleChipSelect
        })
      ),

      activeTab === 'info' && h('div', null,
        // Charging IC с аналогами и донорами
        renderICSection(
          'Charging IC (Контроллер зарядки)',
          '⚡',
          selectedDevice.charging_ic,
          'charging',
          'charging_ics'
        ),

        // Memory
        selectedDevice.memory && renderSection(
          'Память',
          '💾',
          h('div', { className: 'grid grid-cols-2 gap-4' },
            h('div', null,
              h('p', { className: 'text-sm text-gray-600' }, 'NAND:'),
              h('p', { className: 'font-semibold' }, selectedDevice.memory.nand_type || selectedDevice.memory.type || 'N/A'),
              selectedDevice.memory.price_nand && h('p', { className: 'text-sm text-green-600' }, selectedDevice.memory.price_nand)
            ),
            h('div', null,
              h('p', { className: 'text-sm text-gray-600' }, 'RAM:'),
              h('p', { className: 'font-semibold' }, selectedDevice.memory.ram_type || 'N/A'),
              selectedDevice.memory.price_ram && h('p', { className: 'text-sm text-green-600' }, selectedDevice.memory.price_ram)
            )
          ),
          'memory'
        ),

        // Power IC с аналогами и донорами
        renderICSection(
          'Power Management IC',
          '🔋',
          selectedDevice.power_ic,
          'power',
          'power_ics'
        ),

        // Audio Codec с аналогами и донорами
        renderICSection(
          'Audio Codec',
          '🔊',
          selectedDevice.audio_codec,
          'audio',
          'audio_ics'
        ),

        // Common Issues
        selectedDevice.common_issues && selectedDevice.common_issues.length > 0 && renderSection(
          'Типовые неисправности',
          '⚠️',
          h('ul', { className: 'space-y-2' },
            ...selectedDevice.common_issues.map((issue, idx) =>
              h('li', { key: idx, className: 'flex items-start gap-2' },
                h('span', { className: 'text-red-500' }, '•'),
                h('span', { className: 'text-sm' }, issue)
              )
            )
          ),
          'issues'
        ),

        // Tools Needed
        selectedDevice.tools_needed && selectedDevice.tools_needed.length > 0 && renderSection(
          'Необходимые инструменты',
          '🔧',
          h('ul', { className: 'space-y-2' },
            ...selectedDevice.tools_needed.map((tool, idx) =>
              h('li', { key: idx, className: 'flex items-start gap-2' },
                h('span', { className: 'text-blue-500' }, '✓'),
                h('span', { className: 'text-sm' }, tool)
              )
            )
          ),
          'tools'
        ),

        // Repair Notes
        selectedDevice.repair_notes && h('div', { className: 'mt-4 p-4 bg-blue-50 rounded-lg' },
          h('p', { className: 'text-sm text-gray-700' }, '📝 ', selectedDevice.repair_notes)
        ),

        // Difficulty
        h('div', { className: 'mt-4 flex gap-4' },
          selectedDevice.repair_difficulty && h('div', null,
            h('span', { className: 'text-sm text-gray-600' }, 'Сложность: '),
            h('span', { 
              className: `font-semibold ${
                selectedDevice.repair_difficulty.includes('Средняя') ? 'text-yellow-600' :
                selectedDevice.repair_difficulty.includes('Сложная') ? 'text-orange-600' :
                selectedDevice.repair_difficulty.includes('Экстремально') ? 'text-red-600' :
                'text-green-600'
              }` 
            }, selectedDevice.repair_difficulty)
          ),
          selectedDevice.repair_time && h('div', null,
            h('span', { className: 'text-sm text-gray-600' }, 'Время: '),
            h('span', { className: 'font-semibold' }, selectedDevice.repair_time)
          )
        ),

        // Documentation Links
        selectedDevice.documentation_links && h('div', { className: 'mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg' },
          h('h3', { className: 'text-lg font-semibold mb-3 text-gray-800' }, '📚 Полезные ресурсы'),
          h('div', { className: 'grid grid-cols-2 gap-2' },
            Object.entries(selectedDevice.documentation_links).map(([key, url]) =>
              h('a', {
                key: key,
                href: url,
                target: '_blank',
                className: 'flex items-center gap-2 px-3 py-2 bg-white rounded shadow-sm hover:shadow-md transition-shadow text-sm'
              },
                h('span', { className: 'text-blue-600' }, '🔗'),
                h('span', { className: 'text-gray-700' }, 
                  key === 'ifixit' ? 'iFixit Руководство' :
                  key === 'apple_support' ? 'Apple Support' :
                  key === 'boardview' ? 'BoardView' :
                  key === 'schematics' ? 'Схемы' : key
                )
              )
            )
          )
        )
      )
    );
  };

  if (loading) {
    return h('div', { className: 'flex items-center justify-center h-64' },
      h('div', { className: 'text-xl text-gray-600' }, 'Загрузка данных...')
    );
  }

  return h('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4' },
    h('div', { className: 'max-w-7xl mx-auto' },
      // Header
      h('div', { className: 'text-center mb-8' },
        h('h1', { className: 'text-4xl font-bold text-gray-800 mb-2' }, '🔧 Apple Repair Tool'),
        h('p', { className: 'text-gray-600' }, 'Профессиональная база данных для ремонта устройств Apple'),
        h('p', { className: 'text-sm text-gray-500 mt-1' }, 'Аналоги • Доноры • Расположение на плате')
      ),

      // Search
      !selectedDevice && h('div', { className: 'mb-6' },
        h('div', { className: 'relative' },
          h('input', {
            type: 'text',
            placeholder: 'Поиск по модели, имени или категории...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: 'w-full px-4 py-3 pl-12 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none'
          }),
          h('div', { className: 'absolute left-4 top-3.5 text-gray-400' }, h(SearchIcon))
        ),
        h('p', { className: 'text-sm text-gray-600 mt-2' }, 
          `Найдено устройств: ${filteredDevices.length} из ${devices.length}`
        )
      ),

      // Content
      selectedDevice ? renderDeviceDetails() :
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
          ...filteredDevices.map(device => renderDeviceCard(device))
        )
    )
  );
};

// Mount application
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(h(RepairTool));
