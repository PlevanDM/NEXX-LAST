import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';
import { getCategoryIcon } from '../utils';
import { Device } from '../types';

interface DeviceListProps {
  devices: Device[];
  onSelect: (device: Device) => void;
  isLoading?: boolean;
}

// Компонент изображения устройства с улучшенным fallback
const DeviceImage: React.FC<{ device: Device }> = ({ device }) => {
  const [imageState, setImageState] = React.useState<'icon' | 'ifixit' | 'fallback'>(
    device.icon_url ? 'icon' : device.ifixit_image ? 'ifixit' : 'fallback'
  );

  const handleImageError = () => {
    if (imageState === 'icon' && device.ifixit_image) {
      setImageState('ifixit');
    } else {
      setImageState('fallback');
    }
  };

  const getCategoryEmoji = (category?: string) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('iphone')) return '📱';
    if (cat.includes('ipad')) return '📟';
    if (cat.includes('macbook')) return '💻';
    if (cat.includes('mac')) return '🖥️';
    if (cat.includes('watch')) return '⌚';
    if (cat.includes('airpods')) return '🎧';
    return '🔧';
  };

  if (imageState === 'fallback') {
    return (
      <div className="h-32 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 border-b border-slate-200">
        <div className="text-6xl opacity-30">{getCategoryEmoji(device.category)}</div>
      </div>
    );
  }

  const currentImage = imageState === 'icon' ? device.icon_url : device.ifixit_image;
  const bgClass = imageState === 'icon' 
    ? 'bg-white' 
    : 'bg-gradient-to-br from-slate-50 to-slate-100';

  return (
    <div className={`h-32 flex items-center justify-center ${bgClass} border-b border-slate-200 overflow-hidden`}>
      <img
        src={currentImage}
        alt={device.name}
        loading="lazy"
        className={`max-h-28 object-contain transition-transform duration-300 group-hover:scale-105 ${
          imageState === 'icon' ? 'drop-shadow-sm' : 'opacity-90'
        }`}
        onError={handleImageError}
      />
    </div>
  );
};

export const DeviceList: React.FC<DeviceListProps> = ({ devices, onSelect, isLoading = false }) => {
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const categories = React.useMemo(() => {
    const cats = new Set(devices.map(d => d.category).filter(Boolean));
    return Array.from(cats);
  }, [devices]);

  const filteredDevices = React.useMemo(() => {
    return devices.filter(device => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        device.name.toLowerCase().includes(searchLower) || 
        device.model_number?.toLowerCase().includes(searchLower) ||
        device.model?.toLowerCase().includes(searchLower) ||
        (device.board_numbers || []).some(bn => bn.toLowerCase().includes(searchLower)) ||
        device.board_number?.toLowerCase().includes(searchLower) ||
        device.processor?.toLowerCase().includes(searchLower) ||
        device.year?.toString().includes(search);
        
      const matchesCategory = selectedCategory ? device.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [devices, search, selectedCategory]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full animate-pulse">
            {/* Image skeleton */}
            <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200"></div>
            
            {/* Header skeleton */}
            <div className="p-3 bg-slate-50 border-b border-slate-200">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="p-3">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="h-16 bg-slate-100 rounded"></div>
                <div className="h-16 bg-slate-100 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded"></div>
                <div className="h-3 bg-slate-200 rounded w-4/5"></div>
                <div className="h-3 bg-slate-200 rounded w-3/5"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters — фиксированная панель при скролле */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-200 sticky top-[52px] sm:top-[56px] z-10">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Поиск (A2338, 820-02020, EMC...)"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm placeholder-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all flex-shrink-0 ${
              selectedCategory === null 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-400 hover:bg-slate-100'
            }`}
          >
            Все
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as string)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-300 hover:bg-blue-50'
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
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/5 active:scale-[0.99] transition-all cursor-pointer overflow-hidden flex flex-col h-full group"
            >
              {/* Device Image */}
              <DeviceImage device={device} />

              {/* Header: Name & Year */}
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-base leading-tight line-clamp-2">{device.name}</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">{device.category}</div>
                </div>
                {device.year && (
                  <div className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded ml-2 flex-shrink-0">
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
                      {device.board_numbers?.[0] || device.board_number || '-'}
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
                  {device.processor && (
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500">CPU:</span>
                      <span className="font-bold text-blue-700">
                        {device.processor}
                      </span>
                    </div>
                  )}
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
                  
                  {(device.power_ic || device.power_ics?.[0]) && (
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500">PMIC:</span>
                      <span className="font-mono font-bold text-slate-700">
                        {(device.power_ic?.main || device.power_ics?.[0]?.name)?.split(' ')[0] || '-'}
                      </span>
                    </div>
                  )}

                  {(device.audio_codec || device.audio_ics?.[0] || device.audio_ic) && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Audio:</span>
                      <span className="font-mono font-bold text-slate-700">
                        {(device.audio_codec?.main || device.audio_ics?.[0]?.name || device.audio_ic?.name)?.split(' ')[0] || '-'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
            <Icons.Search className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">Ничего не найдено</h3>
          <p className="text-sm text-slate-500 text-center max-w-sm">Измените фильтр категории или введите номер модели (Axxxx), платы (820-xxxx) или EMC</p>
        </div>
      )}
    </div>
  );
};
