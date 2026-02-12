import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';

interface MacBookModel {
  id: string;
  name: string;
  a_number: string;
  board_number: string;
  year: number;
  chip: string;
  display: {
    resolution: string;
    type: string;
    connector: string;
    backlight_ic: string;
    flex_cables: string[];
  };
  critical_notes?: string;
  compatible_donors?: string[];
  incompatible_donors?: string[];
}

interface CompatibilityResult {
  donor: MacBookModel;
  target: MacBookModel;
  status: 'compatible' | 'warning' | 'incompatible';
  details: string;
  risks?: string[];
}

const MACBOOK_MODELS: MacBookModel[] = [
  // MacBook Pro 13" Intel (2016-2020)
  {
    id: 'a1708-16',
    name: 'MacBook Pro 13" Fn (2016)',
    a_number: 'A1708',
    board_number: '820-00840',
    year: 2016,
    chip: 'Intel 6th Gen',
    display: {
      resolution: '2560×1600',
      type: 'IPS',
      connector: 'J8500 (42-pin)',
      backlight_ic: 'U8400 (TPS65640A)',
      flex_cables: ['821-00516-03', '821-00517-05']
    },
    critical_notes: 'Flexgate! Короткие flex кабели',
    compatible_donors: ['a1708-16'],
    incompatible_donors: ['a2338-m1', 'a2338-m2', 'a2441-m1p', 'a2442-m1p']
  },
  {
    id: 'a1989-18',
    name: 'MacBook Pro 13" TB (2018)',
    a_number: 'A1989',
    board_number: '820-00850',
    year: 2018,
    chip: 'Intel 8th Gen + T2',
    display: {
      resolution: '2560×1600',
      type: 'IPS, True Tone',
      connector: 'J8500 (42-pin)',
      backlight_ic: 'U8400 (TPS65640A)',
      flex_cables: ['821-00602-03', '821-00603-03']
    },
    critical_notes: 'Удлинённые flex кабели',
    compatible_donors: ['a1989-18', 'a2159-19', 'a2251-20'],
    incompatible_donors: ['a2338-m1', 'a2338-m2']
  },
  {
    id: 'a2159-19',
    name: 'MacBook Pro 13" TB (2019)',
    a_number: 'A2159',
    board_number: '820-01598',
    year: 2019,
    chip: 'Intel 8th Gen + T2',
    display: {
      resolution: '2560×1600',
      type: 'IPS, True Tone',
      connector: 'J8500 (42-pin)',
      backlight_ic: 'U8400 (TPS65640A)',
      flex_cables: ['821-00732-02-B', '821-00733-02-B']
    },
    compatible_donors: ['a1989-18', 'a2159-19', 'a2251-20'],
    incompatible_donors: ['a2338-m1', 'a2338-m2']
  },
  {
    id: 'a2251-20',
    name: 'MacBook Pro 13" 4TBT (2020)',
    a_number: 'A2251',
    board_number: '820-01949',
    year: 2020,
    chip: 'Intel 10th Gen + T2',
    display: {
      resolution: '2560×1600',
      type: 'IPS, True Tone',
      connector: 'J8500 (42-pin)',
      backlight_ic: 'U8400 (TPS65640A)',
      flex_cables: ['821-01228-A', '821-01229-A']
    },
    compatible_donors: ['a1989-18', 'a2159-19', 'a2251-20'],
    incompatible_donors: ['a2338-m1', 'a2338-m2']
  },
  // MacBook Pro 13" M1 (2020)
  {
    id: 'a2338-m1',
    name: 'MacBook Pro 13" M1 (2020)',
    a_number: 'A2338',
    board_number: '820-02020',
    year: 2020,
    chip: 'Apple M1',
    display: {
      resolution: '2560×1600',
      type: 'IPS, True Tone, P3',
      connector: 'J8500 (42-pin)',
      backlight_ic: 'UP800',
      flex_cables: ['821-02854-03/A']
    },
    critical_notes: 'UP800 часто корродирует при залитии',
    compatible_donors: ['a2338-m1'],
    incompatible_donors: ['a1708-16', 'a1989-18', 'a2159-19', 'a2251-20']
  },
  // MacBook Pro 15" (2016-2019)
  {
    id: 'a1707-16',
    name: 'MacBook Pro 15" TB (2016)',
    a_number: 'A1707',
    board_number: '820-00281',
    year: 2016,
    chip: 'Intel 6th/7th Gen',
    display: {
      resolution: '2880×1800',
      type: 'IPS',
      connector: 'J8500 (42-pin)',
      backlight_ic: 'U8400 (TPS65640A)',
      flex_cables: ['821-00690-02', '821-00691-02']
    },
    critical_notes: 'Flexgate!',
    compatible_donors: ['a1707-16', 'a1990-18'],
    incompatible_donors: ['a2141-19']
  },
  {
    id: 'a1990-18',
    name: 'MacBook Pro 15" TB (2018)',
    a_number: 'A1990',
    board_number: '820-01814',
    year: 2018,
    chip: 'Intel 8th/9th Gen + T2',
    display: {
      resolution: '2880×1800',
      type: 'IPS, True Tone',
      connector: 'J8500 (42-pin)',
      backlight_ic: 'U8400 (TPS65640A)',
      flex_cables: ['821-01270-01', '821-01271-01']
    },
    compatible_donors: ['a1707-16', 'a1990-18'],
    incompatible_donors: ['a2141-19']
  },
  {
    id: 'a1990-19',
    name: 'MacBook Pro 15" TB (2019)',
    a_number: 'A1990',
    board_number: '820-01814',
    year: 2019,
    chip: 'Intel 8th/9th Gen + T2',
    display: {
      resolution: '2880×1800',
      type: 'IPS, True Tone',
      connector: 'J8500 (42-pin)',
      backlight_ic: 'U8400 (TPS65640A)',
      flex_cables: ['821-01270-01', '821-01271-01']
    },
    compatible_donors: ['a1707-16', 'a1990-19'],
    incompatible_donors: ['a2141-19']
  },
  // MacBook Pro 16" (2019+)
  {
    id: 'a2141-19',
    name: 'MacBook Pro 16" (2019)',
    a_number: 'A2141',
    board_number: '820-01700',
    year: 2019,
    chip: 'Intel 9th Gen + T2',
    display: {
      resolution: '3072×1920',
      type: 'IPS, True Tone',
      connector: 'J8500 (42-pin, i2c only!)',
      backlight_ic: 'U8400 (i2c control)',
      flex_cables: ['821-02032-03', '821-02034-03']
    },
    critical_notes: '⚠️ i2c-only backlight! Несовместима с A1707/A1990 (PWM)',
    compatible_donors: ['a2141-19'],
    incompatible_donors: ['a1707-16', 'a1990-18', 'a1990-19']
  },
  // MacBook Pro 14" M1 Pro/Max (2021)
  {
    id: 'a2442-m1p',
    name: 'MacBook Pro 14" M1 Pro (2021)',
    a_number: 'A2442',
    board_number: '820-02020',
    year: 2021,
    chip: 'Apple M1 Pro',
    display: {
      resolution: '3024×1964',
      type: 'Mini-LED XDR, 120Hz',
      connector: 'New eDP',
      backlight_ic: 'RAA209100B1',
      flex_cables: ['821-03088-A']
    },
    critical_notes: '⚠️ Mini-LED XDR требует IC Transfer! Без IC - фиолетовые линии',
    compatible_donors: ['a2442-m1p'],
    incompatible_donors: ['a2485-m1p', 'a2779-m2p', 'a2992-m3p']
  },
  {
    id: 'a2485-m1p',
    name: 'MacBook Pro 16" M1 Pro (2021)',
    a_number: 'A2485',
    board_number: '820-02021',
    year: 2021,
    chip: 'Apple M1 Pro/Max',
    display: {
      resolution: '3456×2234',
      type: 'Mini-LED XDR, 120Hz',
      connector: 'New eDP',
      backlight_ic: 'RAA209100B1',
      flex_cables: ['821-03088-A']
    },
    critical_notes: '⚠️ Mini-LED XDR требует IC Transfer! 16" несовместима с 14"',
    compatible_donors: ['a2485-m1p'],
    incompatible_donors: ['a2442-m1p', 'a2779-m2p', 'a2991-m2p']
  },
  // MacBook Air 13" Intel (2018-2020)
  {
    id: 'a1932-18',
    name: 'MacBook Air 13" (2018)',
    a_number: 'A1932',
    board_number: '820-01516',
    year: 2018,
    chip: 'Intel 8th Gen',
    display: {
      resolution: '2560×1600',
      type: 'IPS, True Tone',
      connector: 'J8500 (42-pin)',
      backlight_ic: 'U8400',
      flex_cables: ['821-01552-A']
    },
    compatible_donors: ['a1932-18', 'a2179-20'],
    incompatible_donors: ['a2337-m1', 'a2681-m2']
  },
  {
    id: 'a2179-20',
    name: 'MacBook Air 13" (2020)',
    a_number: 'A2179',
    board_number: '820-01721',
    year: 2020,
    chip: 'Intel 10th Gen',
    display: {
      resolution: '2560×1600',
      type: 'IPS, True Tone',
      connector: 'J8500 (42-pin)',
      backlight_ic: 'U8400',
      flex_cables: ['821-01552-A']
    },
    compatible_donors: ['a1932-18', 'a2179-20'],
    incompatible_donors: ['a2337-m1', 'a2681-m2']
  },
  // MacBook Air 13" M1 (2020)
  {
    id: 'a2337-m1',
    name: 'MacBook Air 13" M1 (2020)',
    a_number: 'A2337',
    board_number: '820-02016',
    year: 2020,
    chip: 'Apple M1',
    display: {
      resolution: '2560×1600',
      type: 'IPS, True Tone, P3',
      connector: 'J8500 (42-pin)',
      backlight_ic: 'UP800',
      flex_cables: ['821-02721-A']
    },
    critical_notes: '⚠️ Кабель 821-02721-A выглядит как 821-01552-A но разный!',
    compatible_donors: ['a2337-m1'],
    incompatible_donors: ['a1932-18', 'a2179-20', 'a2681-m2', 'a3113-m3']
  },
  // MacBook Air 13" M2 (2022)
  {
    id: 'a2681-m2',
    name: 'MacBook Air 13" M2 (2022)',
    a_number: 'A2681',
    board_number: '820-02536',
    year: 2022,
    chip: 'Apple M2',
    display: {
      resolution: '2560×1664',
      type: 'Liquid Retina',
      connector: 'LVDS (40-pin)',
      backlight_ic: 'Unknown',
      flex_cables: ['821-04129-02']
    },
    compatible_donors: ['a2681-m2', 'a3113-m3', 'a3240-m4'],
    incompatible_donors: ['a1932-18', 'a2179-20', 'a2337-m1']
  },
  // MacBook Air 15" M2 (2023)
  {
    id: 'a2941-m2',
    name: 'MacBook Air 15" M2 (2023)',
    a_number: 'A2941',
    board_number: '820-02682',
    year: 2023,
    chip: 'Apple M2',
    display: {
      resolution: '2880×1864',
      type: 'Liquid Retina',
      connector: 'LVDS (40-pin)',
      backlight_ic: 'Unknown',
      flex_cables: ['821-04129-02']
    },
    critical_notes: '15" несовместима с 13.6" воздухом!',
    compatible_donors: ['a2941-m2'],
    incompatible_donors: ['a2681-m2', 'a3113-m3', 'a3240-m4']
  },
  // MacBook Air 13" M3 (2024)
  {
    id: 'a3113-m3',
    name: 'MacBook Air 13" M3 (2024)',
    a_number: 'A3113',
    board_number: '820-02843',
    year: 2024,
    chip: 'Apple M3',
    display: {
      resolution: '2560×1664',
      type: 'Liquid Retina',
      connector: 'LVDS (40-pin)',
      backlight_ic: 'Unknown',
      flex_cables: ['821-04129-02']
    },
    compatible_donors: ['a2681-m2', 'a3113-m3', 'a3240-m4'],
    incompatible_donors: ['a1932-18', 'a2179-20', 'a2337-m1', 'a2941-m2']
  },
  // MacBook Air 13" M4 (2025)
  {
    id: 'a3240-m4',
    name: 'MacBook Air 13" M4 (2025)',
    a_number: 'A3240',
    board_number: '820-03047',
    year: 2025,
    chip: 'Apple M4',
    display: {
      resolution: '2560×1664',
      type: 'Liquid Retina',
      connector: 'LVDS (40-pin)',
      backlight_ic: 'Unknown',
      flex_cables: ['821-04129-02']
    },
    compatible_donors: ['a2681-m2', 'a3113-m3', 'a3240-m4'],
    incompatible_donors: ['a1932-18', 'a2179-20', 'a2337-m1']
  }
];

export const MacBookDisplayRepairTool: React.FC = () => {
  const [selectedDonor, setSelectedDonor] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentModels, setRecentModels] = useState<string[]>([]);

  const donorModel = useMemo(
    () => MACBOOK_MODELS.find(m => m.id === selectedDonor),
    [selectedDonor]
  );

  const targetModel = useMemo(
    () => MACBOOK_MODELS.find(m => m.id === selectedTarget),
    [selectedTarget]
  );

  // Обновить недавние модели при выборе
  const handleSelectDonor = (id: string) => {
    setSelectedDonor(id);
    setRecentModels(prev => [id, ...prev.filter(m => m !== id)].slice(0, 3));
  };

  const handleSelectTarget = (id: string) => {
    setSelectedTarget(id);
    setRecentModels(prev => [id, ...prev.filter(m => m !== id)].slice(0, 3));
  };

  // Популярные модели для быстрого выбора
  const popularModels = useMemo(() => {
    return MACBOOK_MODELS.filter(m => 
      ['a1708-16', 'a1989-18', 'a2338-m1', 'a2141-19', 'a2681-m2', 'a2337-m1'].includes(m.id)
    );
  }, []);

  // Группировка моделей по категориям
  const groupedModels = useMemo(() => {
    const groups: Record<string, MacBookModel[]> = {
      'MacBook Pro 13" (2016-2020 Intel)': MACBOOK_MODELS.filter(m => 
        m.name.includes('13"') && m.chip.includes('Intel') && m.year <= 2020
      ),
      'MacBook Pro 13" M1 (2020)': MACBOOK_MODELS.filter(m => m.id === 'a2338-m1'),
      'MacBook Pro 15"/16" (Intel)': MACBOOK_MODELS.filter(m => 
        (m.name.includes('15"') || m.name.includes('16"')) && m.chip.includes('Intel')
      ),
      'MacBook Pro 14"/16" (2021+ M1/M2)': MACBOOK_MODELS.filter(m => 
        (m.name.includes('14"') || m.name.includes('16"')) && m.year >= 2021 && (m.chip.includes('M1') || m.chip.includes('M2'))
      ),
      'MacBook Air 13" (2018-2020)': MACBOOK_MODELS.filter(m => 
        m.name.includes('Air') && m.name.includes('13"') && m.year <= 2020
      ),
      'MacBook Air 13" M1 (2020)': MACBOOK_MODELS.filter(m => m.id === 'a2337-m1'),
      'MacBook Air 13" M2-M4 (2022+)': MACBOOK_MODELS.filter(m => 
        m.name.includes('Air') && m.name.includes('13"') && m.year >= 2022 && m.year < 2024
      ),
      'MacBook Air 13" M3-M4 (2024+)': MACBOOK_MODELS.filter(m => 
        m.name.includes('Air') && m.name.includes('13"') && m.year >= 2024
      ),
      'MacBook Air 15" M2-M3 (2023-2024)': MACBOOK_MODELS.filter(m => 
        m.name.includes('Air') && m.name.includes('15"')
      ),
    };
    // Удалить пустые группы
    return Object.fromEntries(Object.entries(groups).filter(([_, models]) => models.length > 0));
  }, []);

  const compatibility = useMemo((): CompatibilityResult | null => {
    if (!donorModel || !targetModel) return null;

    if (donorModel.id === targetModel.id) {
      return {
        donor: donorModel,
        target: targetModel,
        status: 'compatible',
        details: '✅ Идеальная совместимость (одна модель)'
      };
    }

    // Check if incompatible
    if (donorModel.incompatible_donors?.includes(targetModel.id) || 
        targetModel.incompatible_donors?.includes(donorModel.id)) {
      return {
        donor: donorModel,
        target: targetModel,
        status: 'incompatible',
        details: '❌ Несовместимо',
        risks: [
          'Разные уровни логики на I2C линиях',
          'Различные управление PWM vs i2c',
          'Возможно повреждение логик-борды'
        ]
      };
    }

    // Check compatible
    if (donorModel.compatible_donors?.includes(targetModel.id) ||
        targetModel.compatible_donors?.includes(donorModel.id)) {
      return {
        donor: donorModel,
        target: targetModel,
        status: 'compatible',
        details: '✅ Совместимо',
        risks: []
      };
    }

    // Default: warning
    return {
      donor: donorModel,
      target: targetModel,
      status: 'warning',
      details: '⚠️ Возможные проблемы',
      risks: [
        'Проверить уровни логики I2C',
        'Убедиться в совместимости backlight IC',
        'Протестировать перед установкой'
      ]
    };
  }, [donorModel, targetModel]);

  const filteredModels = useMemo(
    () => MACBOOK_MODELS.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.a_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.board_number.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl border border-slate-200">
      {/* Header */}
      <div className="mb-6 border-b border-slate-300 pb-4">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          🖥️ MacBook Display Repair Tool
        </h1>
        <p className="text-slate-600">
          Полная база знаний по совместимости дисплеев, компонентов и диагностики
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Donor Selection */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            📱 Донор (источник дисплея)
          </h2>
          
          {/* Search and Quick Select */}
          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Поиск модели (A1708, 820-00840, 2018)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Popular Models */}
            {!selectedDonor && (
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">🔥 Популярные модели:</p>
                <div className="flex flex-wrap gap-2">
                  {popularModels.slice(0, 3).map(model => (
                    <button
                      key={model.id}
                      onClick={() => handleSelectDonor(model.id)}
                      className="px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-semibold transition-colors"
                    >
                      {model.a_number}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Select dropdown */}
          <select
            value={selectedDonor}
            onChange={(e) => handleSelectDonor(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Выбрать модель-донор...</option>
            {filteredModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.a_number} - {model.name} ({model.year})
              </option>
            ))}
          </select>

          {donorModel && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">{donorModel.name}</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p>📌 Board: {donorModel.board_number} | Год: {donorModel.year}</p>
                <p>📺 Display: {donorModel.display.resolution} ({donorModel.display.type})</p>
                <p>🔌 Connector: {donorModel.display.connector}</p>
                <p>💾 Backlight: {donorModel.display.backlight_ic}</p>
                {donorModel.critical_notes && (
                  <p className="text-orange-600 font-semibold mt-2">⚠️ {donorModel.critical_notes}</p>
                )}
              </div>
              <button
                onClick={() => handleSelectDonor('')}
                className="mt-3 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded font-semibold transition-colors"
              >
                Очистить выбор
              </button>
            </div>
          )}
        </div>

        {/* Target Selection */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            💻 Целевая модель (в какой MacBook)
          </h2>
          
          {/* Search and Quick Select */}
          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Поиск модели (A2338, 820-02020, 2020)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            
            {/* Recommended targets based on donor */}
            {donorModel && !selectedTarget && (
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">💡 Рекомендованные целевые:</p>
                <div className="flex flex-wrap gap-2">
                  {MACBOOK_MODELS.filter(m => 
                    donorModel.compatible_donors?.includes(m.id)
                  ).slice(0, 3).map(model => (
                    <button
                      key={model.id}
                      onClick={() => handleSelectTarget(model.id)}
                      className="px-3 py-1.5 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-semibold transition-colors"
                    >
                      {model.a_number}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Select dropdown */}
          <select
            value={selectedTarget}
            onChange={(e) => handleSelectTarget(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Выбрать целевую модель...</option>
            {filteredModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.a_number} - {model.name} ({model.year})
              </option>
            ))}
          </select>

          {targetModel && (
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="font-semibold text-emerald-900 mb-2">{targetModel.name}</h3>
              <div className="space-y-1 text-sm text-emerald-800">
                <p>📌 Board: {targetModel.board_number} | Год: {targetModel.year}</p>
                <p>📺 Display: {targetModel.display.resolution} ({targetModel.display.type})</p>
                <p>🔌 Connector: {targetModel.display.connector}</p>
                <p>💾 Backlight: {targetModel.display.backlight_ic}</p>
                {targetModel.critical_notes && (
                  <p className="text-orange-600 font-semibold mt-2">⚠️ {targetModel.critical_notes}</p>
                )}
              </div>
              <button
                onClick={() => handleSelectTarget('')}
                className="mt-3 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded font-semibold transition-colors"
              >
                Очистить выбор
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compatibility Result */}
      {compatibility && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {compatibility.status === 'compatible' ? '✅' : compatibility.status === 'warning' ? '⚠️' : '❌'} Результат совместимости
            </h2>
            <button
              onClick={() => {
                handleSelectDonor('');
                handleSelectTarget('');
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold text-sm transition-colors"
            >
              ↺ Новый поиск
            </button>
          </div>
          
          <p className={`text-lg font-semibold mb-3 ${
            compatibility.status === 'compatible' ? 'text-emerald-700' :
            compatibility.status === 'warning' ? 'text-amber-700' :
            'text-red-700'
          }`}>{compatibility.details}</p>

          {compatibility.risks && compatibility.risks.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-red-900 mb-2">⚠️ Возможные проблемы:</h3>
              <ul className="space-y-1 text-red-800 text-sm">
                {compatibility.risks.map((risk, idx) => (
                  <li key={idx}>• {risk}</li>
                ))}
              </ul>
            </div>
          )}

          {compatibility.status === 'compatible' && (
            <>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                <p className="text-emerald-800 font-semibold mb-2">✅ Рекомендации:</p>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Используйте оригинальные flex кабели</li>
                  <li>• Убедитесь что оба коннектора J8500/LVDS</li>
                  <li>• Отключайте батарею перед подключением eDP кабеля!</li>
                  <li>• Проверьте диод mode перед установкой</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-semibold mb-2">ℹ️ Техническая информация:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Проверьте Board ID на донорском MacBook</li>
                  <li>• Дисплеи M1/M2/M3 не совместимы с Intel моделями</li>
                  <li>• LVDS коннекторы (40-pin) не совместимы с J8500 (42-pin)</li>
                </ul>
              </div>
            </>
          )}
        </div>
      )}

      {/* Parts Comparison */}
      {donorModel && targetModel && compatibility && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">📦 Сравнение компонентов</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📱 Донор: {donorModel.name}</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Flex Cables:</strong></p>
                <ul className="ml-3">
                  {donorModel.display.flex_cables.map(cable => (
                    <li key={cable} className="font-mono text-xs bg-white px-2 py-1 rounded mt-1">
                      {cable}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-900 mb-2">💻 Целевая: {targetModel.name}</h3>
              <div className="space-y-2 text-sm text-emerald-800">
                <p><strong>Flex Cables:</strong></p>
                <ul className="ml-3">
                  {targetModel.display.flex_cables.map(cable => (
                    <li key={cable} className="font-mono text-xs bg-white px-2 py-1 rounded mt-1">
                      {cable}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* IC Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">🔧 Спецификация донора:</p>
              <div className="text-sm space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
                <p><strong>Коннектор:</strong> {donorModel.display.connector}</p>
                <p><strong>Backlight IC:</strong> {donorModel.display.backlight_ic}</p>
                <p><strong>Тип:</strong> {donorModel.display.type}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">🔧 Спецификация целевой:</p>
              <div className="text-sm space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
                <p><strong>Коннектор:</strong> {targetModel.display.connector}</p>
                <p><strong>Backlight IC:</strong> {targetModel.display.backlight_ic}</p>
                <p><strong>Тип:</strong> {targetModel.display.type}</p>
              </div>
            </div>
          </div>

          {compatibility.status === 'compatible' && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
              ℹ️ <strong>Совет:</strong> Используйте flex cables от целевой модели для лучшей совместимости
            </div>
          )}
        </div>
      )}

      {/* Quick Category Browser */}
      {!selectedDonor && !selectedTarget && (
        <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">📚 Категории моделей</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(groupedModels).map(([category, models]) => (
              models.length > 0 && (
                <div key={category} className="bg-white rounded-lg p-3 border border-slate-200">
                  <p className="font-semibold text-slate-700 text-sm mb-2">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {models.map(model => (
                      <button
                        key={model.id}
                        onClick={() => handleSelectDonor(model.id)}
                        className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors"
                        title={`${model.board_number} - ${model.year}`}
                      >
                        {model.a_number}
                      </button>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MacBookDisplayRepairTool;
