import React from 'react';
import { Icons } from './Icons';
import { OfficialServiceData, OfficialPart, Device, ExchangePrice } from '../types';
import { formatPrice, convertPrice } from '../utils';

interface RepairCalculatorProps {
  officialPrices: OfficialServiceData;
  exchangePrices: Record<string, ExchangePrice>; // Added this
  devices: Device[];
  rates: any;
  onClose: () => void;
}

export const RepairCalculator: React.FC<RepairCalculatorProps> = ({ officialPrices, exchangePrices, devices, rates, onClose }) => {
  const [selectedModelName, setSelectedModelName] = React.useState<string>('');
  const [laborCost, setLaborCost] = React.useState<number>(1000); // Default labor cost in UAH
  const [markupPercent, setMarkupPercent] = React.useState<number>(20); // Default markup %

  // Get list of models available in official prices
  const availableModels = React.useMemo(() => {
    return officialPrices.models.map(m => m.device).sort();
  }, [officialPrices]);

  const selectedModelData = React.useMemo(() => {
    return officialPrices.models.find(m => m.device === selectedModelName);
  }, [selectedModelName, officialPrices]);

  const calculateTotal = (partPriceUah: number) => {
    const withMarkup = partPriceUah * (1 + markupPercent / 100);
    return Math.ceil(withMarkup + laborCost);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-blue-600 rounded-t-xl text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Icons.Calculator /> Калькулятор ремонта (Exchange)
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <Icons.Close />
        </button>
      </div>

      <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Устройство</label>
          <select 
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedModelName}
            onChange={(e) => setSelectedModelName(e.target.value)}
          >
            <option value="">Выберите модель...</option>
            {availableModels.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Стоимость работы (UAH)</label>
          <input 
            type="number" 
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={laborCost}
            onChange={(e) => setLaborCost(Number(e.target.value))}
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Наценка на запчасть (%)</label>
           <input 
            type="number" 
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={markupPercent}
            onChange={(e) => setMarkupPercent(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-white">
        {selectedModelData ? (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Запчасти и цены</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {selectedModelData.parts.map((part) => {
                // Пытаемся найти реальную цену в Exchange прайсе по артикулу
                const realPart = exchangePrices[part.article];
                
                // Если есть реальная цена - используем её. Если нет - берем старую (конвертируем EUR -> UAH)
                // Приоритет: Exchange Price UAH > Official EUR converted
                let partPriceUah = 0;
                let source = 'N/A';

                if (realPart && realPart.price_exchange_uah > 0) {
                    partPriceUah = realPart.price_exchange_uah;
                    source = 'Exchange UA';
                } else if (part.price_eur) {
                    partPriceUah = part.price_eur * rates.EUR_TO_UAH;
                    source = 'Est. EUR';
                }

                const clientPrice = calculateTotal(partPriceUah);
                const profit = clientPrice - partPriceUah; // Profit = Labor + Markup

                return (
                  <div key={part.article} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg capitalize text-slate-800">
                            {part.part.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {part.article}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500">
                          Закупка ({source}): <span className="font-semibold text-slate-700">{formatPrice(partPriceUah, 'UAH')}</span>
                          {realPart && <div className="text-xs text-green-600 mt-1">{realPart.description}</div>}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto bg-slate-50 p-3 rounded-lg">
                        <div className="text-center">
                          <div className="text-xs text-slate-500 uppercase font-semibold">Итого клиенту</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {formatPrice(clientPrice, 'UAH')}
                          </div>
                        </div>
                        
                        <div className="w-px h-10 bg-slate-200"></div>

                        <div className="text-center">
                           <div className="text-xs text-slate-500 uppercase font-semibold">Прибыль</div>
                           <div className="text-lg font-bold text-green-600">
                             {formatPrice(profit, 'UAH')}
                           </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Icons.Calculator />
            <p className="mt-4 text-lg">Выберите модель устройства сверху</p>
          </div>
        )}
      </div>
    </div>
  );
};
