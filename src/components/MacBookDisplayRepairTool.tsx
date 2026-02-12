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
    compatible_donors: ['a1708-17', 'a1706-16', 'a1706-17'],
    incompatible_donors: ['a2338-m1', 'a2338-m2']
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
    compatible_donors: ['a1708-16', 'a1708-17', 'a1706-16', 'a1706-17', 'a1989-18', 'a2159-19', 'a2251-20', 'a2289-20'],
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
    compatible_donors: ['a1708-16', 'a1708-17', 'a1706-16', 'a1706-17', 'a1989-18', 'a2159-19', 'a2251-20', 'a2289-20'],
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
    compatible_donors: ['a1708-16', 'a1708-17', 'a1706-16', 'a1706-17', 'a1989-18', 'a2159-19', 'a2251-20', 'a2289-20'],
    incompatible_donors: ['a2338-m1', 'a2338-m2']
  },
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
    incompatible_donors: ['a1708-16', 'a1708-17', 'a1706-16', 'a1706-17', 'a1989-18', 'a2159-19', 'a2251-20', 'a2289-20']
  },
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
    compatible_donors: ['a1707-16', 'a1707-17', 'a1990-18', 'a1990-19'],
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
    compatible_donors: ['a1707-16', 'a1707-17', 'a1990-18', 'a1990-19'],
    incompatible_donors: ['a2141-19']
  },
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
    critical_notes: '⚠️ НЕ используется PWM! Только i2c backlight control - несовместима с A1707/A1990!',
    compatible_donors: ['a2141-19'],
    incompatible_donors: ['a1707-16', 'a1707-17', 'a1990-18', 'a1990-19']
  },
  {
    id: 'a2681-m2',
    name: 'MacBook Air 13.6" M2 (2022)',
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
    critical_notes: 'Lid Angle Sensor',
    compatible_donors: ['a2681-m2', 'a3113-m3', 'a3240-m4'],
    incompatible_donors: ['a1932-18', 'a2179-20', 'a2337-m1']
  },
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
    critical_notes: '⚠️ Кабель 821-02721-A выглядит как 821-01552-A но разный! Перепутать = не работает',
    compatible_donors: ['a2337-m1'],
    incompatible_donors: ['a1932-18', 'a2179-20', 'a2681-m2', 'a3113-m3']
  }
];

export const MacBookDisplayRepairTool: React.FC = () => {
  const [selectedDonor, setSelectedDonor] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const donorModel = useMemo(
    () => MACBOOK_MODELS.find(m => m.id === selectedDonor),
    [selectedDonor]
  );

  const targetModel = useMemo(
    () => MACBOOK_MODELS.find(m => m.id === selectedTarget),
    [selectedTarget]
  );

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
            📱 Донор (экран откуда)
          </h2>
          <input
            type="text"
            placeholder="Поиск модели..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3 text-sm"
          />
          <select
            value={selectedDonor}
            onChange={(e) => setSelectedDonor(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium"
          >
            <option value="">Выбрать модель-донор...</option>
            {filteredModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.a_number} - {model.name}
              </option>
            ))}
          </select>

          {donorModel && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">{donorModel.name}</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p>📌 Board: {donorModel.board_number}</p>
                <p>📺 Display: {donorModel.display.resolution}</p>
                <p>🔌 Connector: {donorModel.display.connector}</p>
                <p>💾 Backlight: {donorModel.display.backlight_ic}</p>
                {donorModel.critical_notes && (
                  <p className="text-orange-600 font-semibold mt-2">⚠️ {donorModel.critical_notes}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Target Selection */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            💻 Целевая (куда ставить)
          </h2>
          <input
            type="text"
            placeholder="Поиск модели..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3 text-sm"
          />
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium"
          >
            <option value="">Выбрать целевую модель...</option>
            {filteredModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.a_number} - {model.name}
              </option>
            ))}
          </select>

          {targetModel && (
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="font-semibold text-emerald-900 mb-2">{targetModel.name}</h3>
              <div className="space-y-1 text-sm text-emerald-800">
                <p>📌 Board: {targetModel.board_number}</p>
                <p>📺 Display: {targetModel.display.resolution}</p>
                <p>🔌 Connector: {targetModel.display.connector}</p>
                <p>💾 Backlight: {targetModel.display.backlight_ic}</p>
                {targetModel.critical_notes && (
                  <p className="text-orange-600 font-semibold mt-2">⚠️ {targetModel.critical_notes}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compatibility Result */}
      {compatibility && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {compatibility.status === 'compatible' ? '✅' : compatibility.status === 'warning' ? '⚠️' : '❌'} Результат совместимости
          </h2>
          
          <p className="text-lg font-semibold text-slate-900 mb-3">{compatibility.details}</p>

          {compatibility.risks && compatibility.risks.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">⚠️ Возможные проблемы:</h3>
              <ul className="space-y-1 text-red-800 text-sm">
                {compatibility.risks.map((risk, idx) => (
                  <li key={idx}>• {risk}</li>
                ))}
              </ul>
            </div>
          )}

          {compatibility.status === 'compatible' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-4">
              <p className="text-emerald-800 font-semibold mb-2">✅ Рекомендации:</p>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Используйте оригинальные flex кабели</li>
                <li>• Убедитесь что оба коннектора J8500/LVDS</li>
                <li>• Отключайте батарею перед подключением eDP кабеля!</li>
                <li>• Проверьте диод mode перед установкой</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Parts Comparison */}
      {donorModel && targetModel && compatibility && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">📦 Сравнение компонентов</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Flex Cables (Донор)</h3>
              <ul className="text-sm space-y-1">
                {donorModel.display.flex_cables.map(cable => (
                  <li key={cable} className="text-slate-600">
                    • {cable}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Flex Cables (Целевая)</h3>
              <ul className="text-sm space-y-1">
                {targetModel.display.flex_cables.map(cable => (
                  <li key={cable} className="text-slate-600">
                    • {cable}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {compatibility.status === 'compatible' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
              ℹ️ Используйте flex cables от целевой модели для лучшей совместимости
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MacBookDisplayRepairTool;
