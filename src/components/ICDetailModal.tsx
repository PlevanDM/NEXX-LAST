import React from 'react';
import { Modal } from './Modal';
import { ICComponent } from '../types';
import { cn } from '../utils';

interface ICDetailModalProps {
  item: ICComponent;
  onClose: () => void;
}

export const ICDetailModal: React.FC<ICDetailModalProps> = ({ item, onClose }) => {
  return (
    <Modal title={`🔌 ${item.name}`} subtitle={item.designation} onClose={onClose} color="violet">
      <div className="p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Основная инфо */}
            <div className="bg-violet-50 rounded-xl p-4">
              <h3 className="font-semibold text-violet-800 mb-3">📋 Информация</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Микросхема:</span>
                  <span className="font-mono font-bold text-violet-600">{item.name}</span>
                </div>
                {item.designation && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Обозначение:</span>
                    <span className="font-bold">{item.designation}</span>
                  </div>
                )}
                {item.package && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Корпус:</span>
                    <span className="font-bold">{item.package}</span>
                  </div>
                )}
                {item.price_range && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Цена:</span>
                    <span className="font-bold text-green-600">{item.price_range}</span>
                  </div>
                )}
                {item.difficulty && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Сложность:</span>
                    <span className={cn('font-bold', 
                      item.difficulty === 'Advanced' ? 'text-orange-600' : 
                      item.difficulty === 'Expert' ? 'text-red-600' : 'text-green-600'
                    )}>{item.difficulty}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Функции */}
            {item.functions && item.functions.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-3">⚙️ Функции</h3>
                <ul className="space-y-1">
                  {item.functions.map((f, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-blue-500">•</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Диагностика */}
            {item.diagnostics && (
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-3">🔍 Диагностика</h3>
                <div className="space-y-2 text-sm">
                  {item.diagnostics.diode_mode && (
                    <div>
                      <p className="font-medium text-slate-700 mb-1">Диодный режим:</p>
                      {Object.entries(item.diagnostics.diode_mode).map(([key, val]) => (
                        <div key={key} className="flex justify-between pl-2">
                          <span className="text-slate-600">{key}:</span>
                          <span className="font-mono text-green-600">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.diagnostics.pp5v0_usb && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">PP5V0_USB:</span>
                      <span className="font-mono text-green-600">{item.diagnostics.pp5v0_usb}</span>
                    </div>
                  )}
                  {item.diagnostics.current_draw && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ток:</span>
                      <span className="font-mono text-green-600">{item.diagnostics.current_draw}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Симптомы */}
            {item.symptoms_when_faulty && item.symptoms_when_faulty.length > 0 && (
              <div className="bg-red-50 rounded-xl p-4">
                <h3 className="font-semibold text-red-800 mb-3">⚠️ Симптомы неисправности</h3>
                <ul className="space-y-1">
                  {item.symptoms_when_faulty.map((s, i) => (
                    <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                      <span>❌</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Совместимость */}
            {item.compatible_devices && item.compatible_devices.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-800 mb-3">📱 Совместимые устройства</h3>
                <div className="flex flex-wrap gap-2">
                  {item.compatible_devices.map((d, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-200 rounded text-xs font-medium text-slate-700">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
