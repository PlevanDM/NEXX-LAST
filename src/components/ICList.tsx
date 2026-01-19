import React from 'react';
import { Icons } from './Icons';
import { ICComponent } from '../types';

interface ICListProps {
  ics: Record<string, ICComponent>;
  onClose: () => void;
  onSelect?: (ic: ICComponent) => void;
}

export const ICList: React.FC<ICListProps> = ({ ics, onClose, onSelect }) => {
  const [search, setSearch] = React.useState('');

  const filteredICs = React.useMemo(() => {
    return Object.entries(ics)
      .map(([id, detail]) => ({ id, ...detail }))
      .filter(ic => 
        ic.name.toLowerCase().includes(search.toLowerCase()) ||
        (ic.designation && ic.designation.toLowerCase().includes(search.toLowerCase())) ||
        (ic.compatible_devices && ic.compatible_devices.some(d => d.toLowerCase().includes(search.toLowerCase())))
      );
  }, [ics, search]);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-violet-50 rounded-t-xl">
        <h2 className="text-lg font-bold text-violet-800 flex items-center gap-2">
          <Icons.Chip /> База микросхем (IC)
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-violet-200 rounded-full transition-colors text-violet-800">
          <Icons.Close />
        </button>
      </div>

      <div className="p-4 bg-white">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Поиск (Tristar, U2, iPhone 7...)"
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50">
        {filteredICs.length > 0 ? (
          filteredICs.map((ic) => (
            <div 
              key={ic.id} 
              onClick={() => onSelect?.(ic)}
              className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:border-violet-200 transition-colors cursor-pointer hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-violet-700">{ic.name}</h3>
                  {ic.designation && <span className="text-xs font-mono text-slate-500">{ic.designation}</span>}
                </div>
                {ic.price_range && (
                   <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                     {ic.price_range}
                   </span>
                )}
              </div>
              
              {ic.compatible_devices && ic.compatible_devices.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {ic.compatible_devices.slice(0, 5).map(d => (
                    <span key={d} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                      {d}
                    </span>
                  ))}
                  {ic.compatible_devices.length > 5 && (
                    <span className="text-[10px] text-slate-400 px-1">+ {ic.compatible_devices.length - 5}</span>
                  )}
                </div>
              )}

              {ic.diagnostics && (
                 <div className="mt-3 text-xs text-slate-600 border-t border-slate-100 pt-2">
                    {ic.diagnostics.pp5v0_usb && <div>PP5V0_USB: <span className="font-mono">{ic.diagnostics.pp5v0_usb}</span></div>}
                 </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <p>Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
};
