import React from 'react';
import { Icons } from './Icons';

interface EnrichmentStats {
  totalDevices: number;
  totalICs: number;
  totalErrors: number;
  totalBoards: number;
  missingChargingIC: number;
  missingPowerIC: number;
  missingAudioCodec: number;
  missingBoardNumber: number;
  missingCategory: number;
  missingBrand: number;
  missingYear: number;
  missingConnector: number;
  devicesWithNoICs: number;
  databaseHealth: number;
  icCoverage: number;
}

interface EnrichmentChange {
  action: string;
  target: string;
  field: string;
  oldValue: string | null;
  newValue: string;
  source: string;
  timestamp: string;
}

interface EnrichmentRun {
  runId: string;
  startedAt: string;
  completedAt: string;
  dryRun: boolean;
  stats: EnrichmentStats;
  changes: EnrichmentChange[];
  errors: Array<{ target: string; message: string; timestamp: string }>;
}

interface Props {
  onClose: () => void;
}

export const EnrichmentPanel: React.FC<Props> = ({ onClose }) => {
  const [status, setStatus] = React.useState<{ paused: boolean; lastRun: EnrichmentRun | null } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [running, setRunning] = React.useState(false);
  const [lastResult, setLastResult] = React.useState<EnrichmentRun | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'status' | 'changes' | 'health'>('status');

  const pin = React.useMemo(() => localStorage.getItem('nexx_pin') || '', []);

  const apiFetch = React.useCallback(async (url: string, opts?: RequestInit) => {
    const res = await fetch(url, {
      ...opts,
      headers: { 'Content-Type': 'application/json', 'X-Pin': pin, ...(opts?.headers || {}) },
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }, [pin]);

  // Load status on mount
  React.useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch('/api/enrichment/status');
      setStatus(data);
      if (data.lastRun) setLastResult(data.lastRun);
    } catch (err: any) {
      setError(err.message || 'Failed to load status');
    } finally {
      setLoading(false);
    }
  };

  const runEnrichment = async (dryRun: boolean) => {
    try {
      setRunning(true);
      setError(null);
      const data = await apiFetch('/api/enrichment/run', {
        method: 'POST',
        body: JSON.stringify({ dryRun, maxChanges: 25 }),
      });
      setLastResult(data);
      setActiveTab('changes');
      // Reload status
      await loadStatus();
    } catch (err: any) {
      setError(err.message || 'Failed to run enrichment');
    } finally {
      setRunning(false);
    }
  };

  const togglePause = async () => {
    try {
      const endpoint = status?.paused ? '/api/enrichment/resume' : '/api/enrichment/pause';
      await apiFetch(endpoint, { method: 'POST' });
      await loadStatus();
    } catch (err: any) {
      setError(err.message || 'Failed');
    }
  };

  const loadHistory = async () => {
    try {
      const data = await apiFetch('/api/enrichment/history');
      if (data.changes) {
        setLastResult(prev => prev ? { ...prev, changes: data.changes, errors: data.errors || [] } : null);
      }
    } catch {
      // silent
    }
  };

  const stats = lastResult?.stats;

  const actionIcon = (action: string) => {
    switch (action) {
      case 'enrich': return '✨';
      case 'discover': return '🆕';
      case 'ic_add': return '🔬';
      case 'error_code_add': return '📋';
      case 'cross_ref': return '🔗';
      default: return '📝';
    }
  };

  const actionLabel = (action: string) => {
    switch (action) {
      case 'enrich': return 'Обогащение';
      case 'discover': return 'Новое устройство';
      case 'ic_add': return 'Новая IC';
      case 'error_code_add': return 'Новый код ошибки';
      case 'cross_ref': return 'Перекрёстная ссылка';
      default: return action;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <span className="text-xl">⚙️</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Enrichment Engine</h2>
            <p className="text-xs text-slate-400">Автоматическое обновление базы данных</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status.paused ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {status.paused ? '⏸ Пауза' : '● Активен'}
            </span>
          )}
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition">
            ✕
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-50 border-b border-slate-200 px-4 pt-2 gap-1">
        {[
          { id: 'status' as const, label: 'Управление', icon: '🎛️' },
          { id: 'health' as const, label: 'Здоровье БД', icon: '💊' },
          { id: 'changes' as const, label: 'Изменения', icon: '📋' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); if (tab.id === 'changes') loadHistory(); }}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-white text-slate-900 border border-slate-200 border-b-white -mb-px shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500">Загрузка статуса...</p>
            </div>
          </div>
        ) : activeTab === 'status' ? (
          /* ═══ STATUS TAB ═══ */
          <div className="space-y-6">
            {/* Main Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => runEnrichment(true)}
                disabled={running}
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl shrink-0 group-hover:scale-110 transition-transform">
                  {running ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '🔍'}
                </div>
                <div className="text-left">
                  <div className="font-bold text-blue-900">Поиск (Dry Run)</div>
                  <div className="text-xs text-blue-600">Сканирование без изменений — покажет что можно обновить</div>
                </div>
              </button>

              <button
                onClick={() => runEnrichment(false)}
                disabled={running}
                className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 hover:border-emerald-300 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-xl shrink-0 group-hover:scale-110 transition-transform">
                  {running ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '🚀'}
                </div>
                <div className="text-left">
                  <div className="font-bold text-emerald-900">Обновить базу</div>
                  <div className="text-xs text-emerald-600">Запустить обогащение — реальные изменения в БД</div>
                </div>
              </button>
            </div>

            {/* Pause / Resume */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePause}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  status?.paused 
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                {status?.paused ? '▶ Возобновить' : '⏸ Пауза'}
              </button>
              <button
                onClick={loadStatus}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-600 transition"
              >
                🔄 Обновить статус
              </button>
            </div>

            {/* Last Run Info */}
            {lastResult && (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    📊 Последний запуск
                    {lastResult.dryRun && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">Dry Run</span>}
                  </h3>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">{lastResult.stats?.totalDevices || 0}</div>
                    <div className="text-xs text-slate-500">Устройств</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">{lastResult.stats?.totalICs || 0}</div>
                    <div className="text-xs text-slate-500">IC в базе</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{lastResult.changes?.length || lastResult.changeCount || 0}</div>
                    <div className="text-xs text-slate-500">Изменений</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{lastResult.errors?.length || lastResult.errorCount || 0}</div>
                    <div className="text-xs text-slate-500">Ошибок</div>
                  </div>
                </div>
                {lastResult.completedAt && (
                  <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
                    Завершён: {new Date(lastResult.completedAt).toLocaleString()}
                    {lastResult.runId && <span className="ml-2 font-mono text-slate-400">{lastResult.runId}</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : activeTab === 'health' ? (
          /* ═══ HEALTH TAB ═══ */
          <div className="space-y-6">
            {stats ? (
              <>
                {/* Health Score */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r="56" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                      <circle
                        cx="64" cy="64" r="56" fill="none"
                        stroke={stats.databaseHealth >= 80 ? '#10b981' : stats.databaseHealth >= 50 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="12"
                        strokeDasharray={`${(stats.databaseHealth / 100) * 351.86} 351.86`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-800">{stats.databaseHealth}%</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Здоровье базы данных</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {stats.databaseHealth >= 80 ? 'Отличное состояние' : stats.databaseHealth >= 50 ? 'Есть пробелы в данных' : 'Много пропущенных данных'}
                  </p>
                </div>

                {/* Coverage bars */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">📊 Покрытие данных</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {[
                      { label: 'IC Coverage', value: stats.icCoverage, total: stats.totalDevices, missing: stats.devicesWithNoICs, color: 'blue' },
                      { label: 'Charging IC', value: stats.totalDevices > 0 ? Math.round(((stats.totalDevices - stats.missingChargingIC) / stats.totalDevices) * 100) : 0, total: stats.totalDevices, missing: stats.missingChargingIC, color: 'violet' },
                      { label: 'Power IC', value: stats.totalDevices > 0 ? Math.round(((stats.totalDevices - stats.missingPowerIC) / stats.totalDevices) * 100) : 0, total: stats.totalDevices, missing: stats.missingPowerIC, color: 'purple' },
                      { label: 'Audio Codec', value: stats.totalDevices > 0 ? Math.round(((stats.totalDevices - stats.missingAudioCodec) / stats.totalDevices) * 100) : 0, total: stats.totalDevices, missing: stats.missingAudioCodec, color: 'pink' },
                      { label: 'Board Numbers', value: stats.totalDevices > 0 ? Math.round(((stats.totalDevices - stats.missingBoardNumber) / stats.totalDevices) * 100) : 0, total: stats.totalDevices, missing: stats.missingBoardNumber, color: 'amber' },
                      { label: 'Brand', value: stats.totalDevices > 0 ? Math.round(((stats.totalDevices - stats.missingBrand) / stats.totalDevices) * 100) : 0, total: stats.totalDevices, missing: stats.missingBrand, color: 'emerald' },
                      { label: 'Category', value: stats.totalDevices > 0 ? Math.round(((stats.totalDevices - stats.missingCategory) / stats.totalDevices) * 100) : 0, total: stats.totalDevices, missing: stats.missingCategory, color: 'teal' },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-700">{item.label}</span>
                          <span className="text-slate-500">{item.value}% <span className="text-xs text-slate-400">({item.missing} пропущено)</span></span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.value >= 80 ? 'bg-emerald-500' : item.value >= 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Устройств', value: stats.totalDevices, icon: '📱', color: 'blue' },
                    { label: 'IC в базе', value: stats.totalICs, icon: '🔬', color: 'violet' },
                    { label: 'Кодов ошибок', value: stats.totalErrors, icon: '⚠️', color: 'amber' },
                    { label: 'Плат', value: stats.totalBoards, icon: '🔧', color: 'emerald' },
                  ].map(item => (
                    <div key={item.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-xl font-bold text-slate-800">{item.value}</div>
                      <div className="text-xs text-slate-500">{item.label}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <div className="text-4xl mb-3">📊</div>
                <p>Запустите поиск для анализа базы данных</p>
              </div>
            )}
          </div>
        ) : (
          /* ═══ CHANGES TAB ═══ */
          <div className="space-y-4">
            {lastResult?.changes && lastResult.changes.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">
                    {lastResult.dryRun ? '🔍 Найденные изменения (Dry Run)' : '✅ Применённые изменения'}
                  </h3>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                    {lastResult.changes.length} изменений
                  </span>
                </div>
                <div className="space-y-2">
                  {lastResult.changes.map((change, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition">
                      <div className="flex items-start gap-3">
                        <span className="text-lg shrink-0">{actionIcon(change.action)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-800 truncate">{change.target}</span>
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-mono">{actionLabel(change.action)}</span>
                          </div>
                          <div className="text-sm text-slate-600 mt-0.5">
                            <span className="text-slate-400">{change.field}:</span>{' '}
                            {change.oldValue && <span className="line-through text-red-400 mr-1">{change.oldValue}</span>}
                            <span className="text-emerald-600 font-medium">{change.newValue}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Источник: {change.source}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {lastResult.dryRun && lastResult.changes.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-blue-700 mb-3">Это предварительный просмотр. Нажмите «Обновить базу» для применения изменений.</p>
                    <button
                      onClick={() => runEnrichment(false)}
                      disabled={running}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition disabled:opacity-50"
                    >
                      {running ? 'Обновление...' : '🚀 Применить изменения'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <div className="text-4xl mb-3">📋</div>
                <p>Нет данных об изменениях</p>
                <p className="text-xs mt-1">Запустите поиск для сканирования базы</p>
              </div>
            )}

            {/* Errors */}
            {lastResult?.errors && lastResult.errors.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-red-700 mb-2">⚠️ Ошибки ({lastResult.errors.length})</h3>
                <div className="space-y-1">
                  {lastResult.errors.map((err, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-2 text-sm text-red-700">
                      <span className="font-mono font-bold">{err.target}:</span> {err.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
