import React from 'react';
import { Icons } from './Icons';

interface KeyCombinationsProps {
  onClose: () => void;
}

export const KeyCombinations: React.FC<KeyCombinationsProps> = ({ onClose }) => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState<'iphone' | 'ipad' | 'mac' | 'watch'>('iphone');
  const [activeMode, setActiveMode] = React.useState<'dfu_mode' | 'recovery_mode' | 'diagnostics'>('dfu_mode');

  React.useEffect(() => {
    const loadKeyCombinations = async () => {
      try {
        const response = await fetch('/data/key_combinations.json');
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load key combinations:', error);
        setLoading(false);
      }
    };
    loadKeyCombinations();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-purple-600 rounded-t-xl text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            ⌨️ Комбинации клавиш
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <Icons.Close />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-purple-600 rounded-t-xl text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            ⌨️ Комбинации клавиш
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <Icons.Close />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-slate-600">
            <Icons.Error />
            <p className="mt-2">Ошибка загрузки данных</p>
          </div>
        </div>
      </div>
    );
  }

  const categoryData = data[activeCategory];
  const modeData = categoryData?.[activeMode];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-purple-600 rounded-t-xl text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          ⌨️ Комбинации клавиш - DFU & Recovery Mode
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <Icons.Close />
        </button>
      </div>

      {/* Category tabs */}
      <div className="bg-slate-50 p-2 flex gap-2 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'iphone', label: '📱 iPhone' },
          { id: 'ipad', label: '📱 iPad' },
          { id: 'mac', label: '💻 Mac' },
          { id: 'watch', label: '⌚ Watch' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Mode tabs */}
      {categoryData && (
        <div className="bg-white p-2 flex gap-2 border-b border-slate-200 overflow-x-auto">
          {Object.keys(categoryData).filter(key => !key.startsWith('_')).map(mode => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeMode === mode
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {mode === 'dfu_mode' && '🔧 DFU Mode'}
              {mode === 'recovery_mode' && '🔄 Recovery Mode'}
              {mode === 'diagnostics' && '🩺 Diagnostics'}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {modeData && (
          <div className="space-y-4">
            {/* Title and description */}
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{modeData.title}</h3>
              <p className="text-sm text-slate-600">{modeData.description}</p>
            </div>

            {/* Models */}
            {modeData.models && Object.entries(modeData.models).map(([modelGroup, modelData]: [string, any]) => (
              <div key={modelGroup} className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">{modelGroup}</h4>
                
                {/* Applies to */}
                {modelData.applies_to && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Применимо к:</p>
                    <div className="flex flex-wrap gap-1">
                      {modelData.applies_to.map((model: string) => (
                        <span key={model} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Steps */}
                {modelData.steps && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Инструкция:</p>
                    <ol className="space-y-2">
                      {modelData.steps.map((step: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-sm text-slate-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Short version */}
                {modelData.steps_short && (
                  <div className="mb-3 p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                    <p className="text-xs font-semibold text-purple-700 mb-1">Краткая форма:</p>
                    <code className="text-xs text-purple-900 font-mono">{modelData.steps_short}</code>
                  </div>
                )}

                {/* Notes */}
                {modelData.notes && modelData.notes.length > 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                    <p className="text-xs font-semibold text-yellow-800 mb-1">⚠️ Важные примечания:</p>
                    <ul className="space-y-1">
                      {modelData.notes.map((note: string, idx: number) => (
                        <li key={idx} className="text-xs text-yellow-900">• {note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
