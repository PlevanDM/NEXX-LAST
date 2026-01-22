import React from 'react';
import { Icons } from './Icons';

interface KeyCombinationsProps {
  data: any;
  onClose: () => void;
}

export const KeyCombinations: React.FC<KeyCombinationsProps> = ({ data, onClose }) => {
  const [activeCategory, setActiveCategory] = React.useState<string>('iphone');
  const [activeMode, setActiveMode] = React.useState<string>('dfu_mode');

  if (!data || Object.keys(data).length === 0) {
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
        <div className="flex-1 flex items-center justify-center p-8 text-slate-400">
          <p>Данные недоступны</p>
        </div>
      </div>
    );
  }

  const categoryData = data[activeCategory];
  // If activeMode not in current category, pick first available mode
  const availableModes = categoryData ? Object.keys(categoryData).filter(k => !k.startsWith('_')) : [];
  const currentMode = availableModes.includes(activeMode) ? activeMode : (availableModes[0] as any);
  const modeData = categoryData?.[currentMode];

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
          { id: 'apple_watch', label: '⌚ Watch' },
          { id: 'apple_tv', label: '📺 Apple TV' }
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
          {availableModes.map(mode => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                currentMode === mode
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {mode === 'dfu_mode' && '🔧 DFU Mode'}
              {mode === 'recovery_mode' && '🔄 Recovery Mode'}
              {mode === 'diagnostics' && '🩺 Diagnostics'}
              {mode === 'force_restart' && '🔄 Force Restart'}
              {mode === 'exit_dfu' && '⏏️ Exit DFU'}
              {mode === 'boot_options' && '🔧 Boot Options'}
              {mode === 'smc_reset' && '⚡ SMC Reset'}
              {mode === 'nvram_reset' && '💾 NVRAM Reset'}
              {mode === 'safe_mode' && '🛡️ Safe Mode'}
              {!['dfu_mode', 'recovery_mode', 'diagnostics', 'force_restart', 'exit_dfu', 'boot_options', 'smc_reset', 'nvram_reset', 'safe_mode'].includes(mode) && `📋 ${mode.replace(/_/g, ' ')}`}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {modeData ? (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{modeData.title}</h3>
              <p className="text-sm text-slate-600">{modeData.description}</p>
            </div>

            {modeData.models && Object.entries(modeData.models).map(([modelGroup, modelData]: [string, any]) => (
              <div key={modelGroup} className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">{modelGroup}</h4>
                
                {modelData.steps && (
                  <div className="mb-3">
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

                {modelData.steps_short && (
                  <div className="mb-3 p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                    <code className="text-xs text-purple-900 font-mono">{modelData.steps_short}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p>Нет инструкций для выбранного режима</p>
          </div>
        )}
      </div>
    </div>
  );
};
