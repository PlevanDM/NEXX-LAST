import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';
import { getCategoryIcon } from '../utils';
import { Device } from '../types';

interface DeviceListProps {
  devices: Device[];
  onSelect: (device: Device) => void;
  isLoading?: boolean;
}

export const DeviceList: React.FC<DeviceListProps> = ({ devices, onSelect, isLoading = false }) => {
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const categories = React.useMemo(() => {
    const cats = new Set(devices.map(d => d.category).filter(Boolean));
    return Array.from(cats);
  }, [devices]);

  const filteredDevices = React.useMemo(() => {
    return devices.filter(device => {
      const matchesSearch = 
        device.name.toLowerCase().includes(search.toLowerCase()) || 
        device.model_number?.toLowerCase().includes(search.toLowerCase()) ||
        device.board_number?.toLowerCase().includes(search.toLowerCase()) ||
        device.year?.toString().includes(search);
        
      const matchesCategory = selectedCategory ? device.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [devices, search, selectedCategory]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 h-48 animate-pulse">
            <div className="h-5 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-0 z-10 backdrop-blur-md bg-white/95">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Поиск (A2338, 820-02020, EMC...)"
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-mono text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-md text-sm font-bold uppercase tracking-wide transition-all ${
              selectedCategory === null 
                ? 'bg-slate-800 text-white' 
                : 'bg-white text-slate-600 border border-slate-300 hover:border-slate-500'
            }`}
          >
            Все
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as string)}
              className={`px-3 py-1.5 rounded-md text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-white text-slate-600 border border-slate-300 hover:border-blue-500'
              }`}
            >
              <span>{getCategoryIcon(cat as string)}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredDevices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDevices.map((device) => (
            <div
              key={device.name}
              onClick={() => onSelect(device)}
              className="bg-white rounded-lg border border-slate-300 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer overflow-hidden flex flex-col h-full"
            >
              {/* Header: Name & Year */}
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-800 text-lg leading-tight">{device.name}</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">{device.category}</div>
                </div>
                {device.year && (
                  <div className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded">
                    {device.year}
                  </div>
                )}
              </div>

              {/* Identification Block (The most important part) */}
              <div className="p-3 bg-white border-b border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  {/* Model Number */}
                  <div className="bg-blue-50 p-2 rounded border border-blue-100">
                    <div className="text-[10px] text-blue-500 uppercase font-bold tracking-wider">Model</div>
                    <div className="font-mono text-base font-bold text-blue-900 break-words leading-none mt-1">
                      {device.model_number || 'N/A'}
                    </div>
                  </div>
                  
                  {/* Board Number */}
                  <div className="bg-purple-50 p-2 rounded border border-purple-100">
                    <div className="text-[10px] text-purple-500 uppercase font-bold tracking-wider">Board ID</div>
                    <div className="font-mono text-base font-bold text-purple-900 leading-none mt-1">
                      {device.board_number || '-'}
                    </div>
                  </div>
                </div>
                
                {device.emc && (
                  <div className="mt-2 flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span className="font-bold bg-slate-100 px-1 rounded">EMC {device.emc.replace('EMC', '').trim()}</span>
                    {device.architecture && <span className="border-l pl-2 border-slate-300">{device.architecture}</span>}
                  </div>
                )}
              </div>

              {/* Technical Specs (Compact) */}
              <div className="p-3 flex-1">
                <div className="space-y-2 text-xs">
                  {device.charging_ic && (
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500">U2/USB:</span>
                      <span className="font-mono font-bold text-slate-700">
                        {typeof device.charging_ic === 'string' 
                          ? device.charging_ic.split(' ')[0] 
                          : device.charging_ic.main?.split(' ')[0] || '-'}
                      </span>
                    </div>
                  )}
                  
                  {device.power_ic && (
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500">PMIC:</span>
                      <span className="font-mono font-bold text-slate-700">
                        {device.power_ic.main?.split(' ')[0] || '-'}
                      </span>
                    </div>
                  )}

                  {device.audio_codec && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Audio:</span>
                      <span className="font-mono font-bold text-slate-700">
                        {device.audio_codec.main?.split(' ')[0] || '-'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Footer: Issues Badge */}
              {device.common_issues && device.common_issues.length > 0 && (
                <div className="bg-red-50 p-2 text-[10px] text-red-700 font-medium border-t border-red-100 truncate">
                  ⚠️ {device.common_issues[0]} {device.common_issues.length > 1 && `+${device.common_issues.length - 1}`}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Icons.Search />
          </div>
          <h3 className="text-lg font-medium text-slate-600">Ничего не найдено</h3>
          <p>Попробуйте ввести номер модели (Axxxx) или платы (820-xxxx)</p>
        </div>
      )}
    </div>
  );
};
