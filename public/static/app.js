// Apple Repair Tool - Main Application
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

const RepairTool = () => {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
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
    fetch('/data/devices.json')
      .then(res => res.json())
      .then(data => {
        setDevices(data);
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

  const renderDeviceCard = (device) => {
    return h('div', {
      key: device.id,
      className: 'bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500',
      onClick: () => setSelectedDevice(device)
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

  const renderDeviceDetails = () => {
    if (!selectedDevice) return null;

    return h('div', { className: 'bg-white rounded-lg shadow-xl p-6' },
      // Header
      h('div', { className: 'border-b pb-4 mb-4' },
        h('button', {
          onClick: () => setSelectedDevice(null),
          className: 'text-blue-600 hover:text-blue-800 mb-2'
        }, '← Назад к списку'),
        h('h2', { className: 'text-2xl font-bold text-gray-800' }, selectedDevice.name),
        h('p', { className: 'text-gray-600 mt-1' }, selectedDevice.model),
        h('div', { className: 'flex gap-2 mt-2' },
          h('span', { className: 'text-xs px-2 py-1 bg-gray-100 rounded' }, `${selectedDevice.year}`),
          h('span', { className: 'text-xs px-2 py-1 bg-gray-100 rounded' }, selectedDevice.category),
          h('span', { className: 'text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded' }, selectedDevice.processor)
        )
      ),

      // Charging IC
      selectedDevice.charging_ic && renderSection(
        'Charging IC (Контроллер зарядки)',
        '⚡',
        h('div', null,
          h('div', { className: 'grid grid-cols-2 gap-4 mb-4' },
            h('div', null,
              h('p', { className: 'text-sm text-gray-600' }, 'Микросхема:'),
              h('p', { className: 'font-semibold' }, selectedDevice.charging_ic.main),
              selectedDevice.charging_ic.full_name && h('p', { className: 'text-xs text-gray-500 mt-1' }, selectedDevice.charging_ic.full_name)
            ),
            h('div', null,
              h('p', { className: 'text-sm text-gray-600' }, 'Расположение:'),
              h('p', { className: 'font-semibold' }, selectedDevice.charging_ic.location)
            ),
            h('div', null,
              h('p', { className: 'text-sm text-gray-600' }, 'Напряжение:'),
              h('p', { className: 'font-semibold' }, selectedDevice.charging_ic.voltage_support || selectedDevice.charging_ic.voltage)
            ),
            h('div', null,
              h('p', { className: 'text-sm text-gray-600' }, 'Макс. ток:'),
              h('p', { className: 'font-semibold' }, selectedDevice.charging_ic.max_current || selectedDevice.charging_ic.current)
            )
          ),
          // Дополнительные характеристики
          (selectedDevice.charging_ic.fast_charging || selectedDevice.charging_ic.usb_pd || selectedDevice.charging_ic.wireless_charging) && 
          h('div', { className: 'grid grid-cols-3 gap-2 mb-4 text-xs' },
            selectedDevice.charging_ic.fast_charging && h('div', { className: 'bg-green-50 p-2 rounded' },
              h('p', { className: 'text-gray-600' }, '⚡ Быстрая зарядка:'),
              h('p', { className: 'font-semibold text-green-700' }, selectedDevice.charging_ic.fast_charging)
            ),
            selectedDevice.charging_ic.usb_pd && h('div', { className: 'bg-blue-50 p-2 rounded' },
              h('p', { className: 'text-gray-600' }, '🔌 USB PD:'),
              h('p', { className: 'font-semibold text-blue-700' }, selectedDevice.charging_ic.usb_pd)
            ),
            selectedDevice.charging_ic.wireless_charging && h('div', { className: 'bg-purple-50 p-2 rounded' },
              h('p', { className: 'text-gray-600' }, '📡 Беспроводная:'),
              h('p', { className: 'font-semibold text-purple-700' }, selectedDevice.charging_ic.wireless_charging)
            )
          ),
          h('div', { className: 'flex gap-2' },
            selectedDevice.charging_ic.aliexpress && h('a', {
              href: selectedDevice.charging_ic.aliexpress,
              target: '_blank',
              className: 'inline-block px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm'
            }, '🛒 Купить на AliExpress'),
            h('div', { className: 'flex-1' }),
            selectedDevice.charging_ic.price_range && h('div', { className: 'px-4 py-2 bg-green-100 text-green-700 rounded font-semibold' }, 
              '💰 ', selectedDevice.charging_ic.price_range
            )
          )
        ),
        'charging'
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

      // Power IC
      selectedDevice.power_ic && renderSection(
        'Power Management IC',
        '🔋',
        h('div', null,
          h('p', { className: 'font-semibold mb-2' }, selectedDevice.power_ic.main),
          h('p', { className: 'text-sm text-gray-600' }, selectedDevice.power_ic.location),
          selectedDevice.power_ic.functions && h('p', { className: 'text-sm text-gray-500 mt-2' }, selectedDevice.power_ic.functions)
        ),
        'power'
      ),

      // Audio Codec
      selectedDevice.audio_codec && renderSection(
        'Audio Codec',
        '🔊',
        h('div', null,
          h('p', { className: 'font-semibold mb-2' }, selectedDevice.audio_codec.main),
          h('p', { className: 'text-sm text-gray-600' }, selectedDevice.audio_codec.location)
        ),
        'audio'
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
        h('p', { className: 'text-gray-600' }, 'Профессиональная база данных для ремонта устройств Apple')
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
