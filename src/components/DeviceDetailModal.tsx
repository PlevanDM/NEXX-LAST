import React from 'react';
import { Modal } from './Modal';
import { Icons } from './Icons';
import { Device, CompatibilityItem, BootSequence, DiodeMeasurement } from '../types';
import { formatPrice, convertPrice } from '../utils';

interface DeviceDetailModalProps {
  device: Device;
  onClose: () => void;
  rates: any;
  compatibility: Record<string, any>;
  bootSequences: Record<string, BootSequence[]>;
  measurements: Record<string, DiodeMeasurement[]>;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({ 
  device, onClose, rates, compatibility, bootSequences, measurements 
}) => {
  const [activeTab, setActiveTab] = React.useState<'info' | 'chips' | 'compatibility' | 'diag'>('info');

  // Helper to find compatibility data for this device
  const getCompatibility = (type: string) => {
    const list = compatibility[type] || [];
    return list.filter((item: any) => 
      item.models && item.models.some((m: string) => device.name.includes(m) || (device.model_number && device.model_number.includes(m)))
    );
  };

  // Helper for diagnostics
  const getBootSeq = () => {
    // Try to match by model name or processor
    const key = Object.keys(bootSequences).find(k => device.name.includes(k) || (device.model_number && device.model_number.includes(k)));
    return key ? bootSequences[key] : [];
  };

  return (
    <Modal 
      title={device.name} 
      subtitle={device.model_number || String(device.year || '')}
      onClose={onClose}
      color="blue"
    >
      {/* Tabs */}
      <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto p-2 gap-2">
        <button 
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'info' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          Инфо & Цены
        </button>
        <button 
          onClick={() => setActiveTab('chips')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'chips' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          Микросхемы
        </button>
        <button 
          onClick={() => setActiveTab('compatibility')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'compatibility' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          Совместимость
        </button>
        <button 
          onClick={() => setActiveTab('diag')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'diag' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          Диагностика
        </button>
      </div>

      <div className="p-6 overflow-y-auto max-h-[70vh]">
        
        {/* INFO TAB */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Icons.Chip /> Характеристики
                </h3>
                <div className="space-y-2 text-sm">
                  {device.architecture && (
                    <div className="flex justify-between border-b border-blue-100 pb-2">
                      <span className="text-slate-600">Архитектура</span>
                      <span className="font-bold">{device.architecture}</span>
                    </div>
                  )}
                  {device.board_number && (
                    <div className="flex justify-between border-b border-blue-100 pb-2">
                      <span className="text-slate-600">Board ID</span>
                      <span className="font-mono text-purple-600 font-bold">{device.board_number}</span>
                    </div>
                  )}
                  {device.emc && (
                    <div className="flex justify-between border-b border-blue-100 pb-2">
                      <span className="text-slate-600">EMC</span>
                      <span className="font-bold">{device.emc}</span>
                    </div>
                  )}
                </div>
              </div>

              {device.description && (
                <div className="bg-slate-100 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">Описание</h3>
                  <p className="text-sm text-slate-600">{device.description}</p>
                </div>
              )}

            </div>

            <div className="space-y-4">
               <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Icons.Price /> Ориентировочные цены
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-green-100 shadow-sm">
                     <div className="text-xs text-slate-500 mb-1">Рыночная цена (Б/У)</div>
                     <div className="text-2xl font-bold text-slate-800">
                       {formatPrice(device.price_ron || 0, 'RON')}
                     </div>
                     <div className="text-sm text-slate-400 font-mono">
                       {formatPrice(device.price_eur || 0, 'EUR')}
                     </div>
                  </div>
                </div>
              </div>

              {device.tools_needed && (
                <div className="bg-amber-50 rounded-xl p-4">
                   <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                    <Icons.Book /> Инструменты
                  </h3>
                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                    {device.tools_needed.slice(0, 5).map((tool, idx) => (
                      <li key={idx}>{tool}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CHIPS TAB */}
        {activeTab === 'chips' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-violet-50 p-4 rounded-xl">
                <h3 className="font-bold text-violet-800 mb-2">Charging IC (Зарядка)</h3>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  {device.charging_ic ? (
                    typeof device.charging_ic === 'string' ? (
                      <p className="font-mono text-lg">{device.charging_ic}</p>
                    ) : (
                      <div>
                        <p className="font-mono text-lg text-violet-600 font-bold">{device.charging_ic.main}</p>
                        {device.charging_ic.note && <p className="text-xs text-slate-500 mt-1">{device.charging_ic.note}</p>}
                      </div>
                    )
                  ) : <p className="text-slate-400">Нет данных</p>}
                </div>
              </div>

              <div className="bg-violet-50 p-4 rounded-xl">
                <h3 className="font-bold text-violet-800 mb-2">PMIC (Питание)</h3>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  {device.power_ic ? (
                    <div>
                      <p className="font-mono text-lg text-violet-600 font-bold">{device.power_ic.main}</p>
                    </div>
                  ) : <p className="text-slate-400">Нет данных</p>}
                </div>
              </div>

              <div className="bg-violet-50 p-4 rounded-xl">
                <h3 className="font-bold text-violet-800 mb-2">Audio Codec</h3>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  {device.audio_codec ? (
                    <div>
                      <p className="font-mono text-lg text-violet-600 font-bold">{device.audio_codec.main}</p>
                    </div>
                  ) : <p className="text-slate-400">Нет данных</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPATIBILITY TAB */}
        {activeTab === 'compatibility' && (
          <div className="space-y-6">
            {['cameras', 'displays', 'batteries'].map(type => {
              const items = getCompatibility(type);
              if (items.length === 0) return null;
              
              return (
                <div key={type} className="bg-white border border-slate-200 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-slate-800 capitalize mb-3">{type}</h3>
                  <div className="space-y-3">
                    {items.map((item: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-semibold text-slate-700">{item.part_type || 'Component'}</span>
                            <div className="mt-1 text-sm text-slate-600">
                              <span className="font-bold">Совместимо с:</span> {item.cross_compatible?.join(', ') || 'Нет данных'}
                            </div>
                          </div>
                          {item.note && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              {item.note}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {getCompatibility('cameras').length === 0 && getCompatibility('displays').length === 0 && (
              <div className="text-center py-10 text-slate-400">
                <p>Нет информации о совместимости для этой модели</p>
              </div>
            )}
          </div>
        )}

        {/* DIAGNOSTICS TAB */}
        {activeTab === 'diag' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-800 p-3 text-white font-bold flex items-center gap-2">
                <Icons.Calculator /> Boot Sequence (Потребление тока)
              </div>
              <div className="p-4">
                {getBootSeq().length > 0 ? (
                  <div className="space-y-0">
                    {getBootSeq().map((seq, i) => (
                      <div key={i} className="flex items-center py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <div className="w-24 font-mono font-bold text-blue-600">{seq.current_consumption}</div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">{seq.stage}</div>
                          <div className="text-xs text-slate-500">{seq.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-4">Нет данных по последовательности запуска</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};
