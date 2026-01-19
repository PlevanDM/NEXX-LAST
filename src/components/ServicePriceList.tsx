import React from 'react';
import { Icons } from './Icons';
import { ServicePrices, ServiceModel } from '../types';
import { formatPrice, convertPrice } from '../utils';

interface ServicePriceListProps {
  prices: ServicePrices;
  rates: any;
  onClose: () => void;
}

export const ServicePriceList: React.FC<ServicePriceListProps> = ({ prices, rates, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<keyof ServicePrices>('iPhone');
  const [search, setSearch] = React.useState('');

  const currentModels = React.useMemo(() => {
    const models = prices[activeTab] || [];
    return models.filter(m => m.model.toLowerCase().includes(search.toLowerCase()));
  }, [prices, activeTab, search]);

  const getServicePriceUah = (priceStr: string) => {
    // Цена в строке может быть "25" (EUR) или "25-30"
    // Мы берем первое число и конвертируем
    const num = parseFloat(priceStr.split(/[^0-9.]/)[0]);
    if (isNaN(num)) return null;
    return convertPrice(num, 'EUR', 'UAH', rates);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-orange-600 rounded-t-xl text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Icons.Price /> Прайс на услуги (Работа)
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <Icons.Close />
        </button>
      </div>

      <div className="bg-slate-50 p-2 flex gap-2 border-b border-slate-200 overflow-x-auto">
        {Object.keys(prices).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as keyof ServicePrices)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white border-b border-slate-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Поиск модели..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        <div className="grid grid-cols-1 gap-4">
          {currentModels.map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-slate-800 mb-3 border-b border-slate-100 pb-2">
                {item.model}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(item.services).map(([service, price]) => {
                  const uahPrice = getServicePriceUah(price);
                  return (
                    <div key={service} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                      <span className="text-sm text-slate-600 font-medium truncate pr-2" title={service}>
                        {service}
                      </span>
                      <div className="text-right">
                        <span className="block font-bold text-orange-600">
                          {uahPrice ? formatPrice(uahPrice, 'UAH') : price}
                        </span>
                        {uahPrice && <span className="text-[10px] text-slate-400">({price} EUR)</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
