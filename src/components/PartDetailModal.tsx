import React from 'react';
import { Modal } from './Modal';
import { PriceData } from '../types';
import { formatPrice, cn } from '../utils';

interface PartDetailModalProps {
  item: PriceData;
  onClose: () => void;
  rates: any;
}

export const PartDetailModal: React.FC<PartDetailModalProps> = ({ item, onClose, rates }) => {
  // Логика расчета цен из старого app.js
  const uaPriceVal = item.price_uah;
  
  // Если есть цена в USD, переводим в EUR (примерный курс 0.91), иначе конвертируем из гривны
  const euPriceVal = item.price_eur || (item.price_usd ? item.price_usd * 0.91 : null) || (uaPriceVal ? uaPriceVal * rates.UAH_TO_EUR : null);
  const usdPriceVal = item.price_usd || (uaPriceVal ? uaPriceVal * rates.UAH_TO_USD : null);
  
  // Расчет экономии (разница между ценой в Европе и Украине)
  // Европа обычно дороже (Self Repair), поэтому считаем, сколько экономим, делая в Украине
  const euPriceInUah = euPriceVal ? euPriceVal * rates.EUR_TO_UAH : 0;
  const savings = uaPriceVal && euPriceVal ? (euPriceInUah - uaPriceVal) : null;
  const savingsPercent = savings && euPriceInUah ? Math.round((savings / euPriceInUah) * 100) : 0;

  return (
    <Modal title={`🔧 ${item.article}`} subtitle={item.description} onClose={onClose} color="green">
      <div className="p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Левая колонка - Инфо */}
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-xl p-4">
              <h3 className="font-semibold text-emerald-800 mb-3">📋 Информация</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Артикул:</span>
                  <span className="font-mono font-bold text-emerald-600">{item.article}</span>
                </div>
                {item.category && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Категория:</span>
                    <span className="font-bold capitalize">{item.category}</span>
                  </div>
                )}
                {item.model && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Модель:</span>
                    <span className="font-bold">{item.model}</span>
                  </div>
                )}
              </div>
            </div>
            
            {item.description && (
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-800 mb-2">📝 Описание</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            )}
          </div>
          
          {/* Правая колонка - Цены и Сравнение */}
          <div className="space-y-4">
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-semibold text-green-800 mb-3">💰 Сравнение цен</h3>
              <div className="space-y-3">
                {/* Украина */}
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span>🇺🇦</span>
                    <span className="font-semibold text-slate-700">Украина</span>
                  </div>
                  {uaPriceVal ? (
                    <div>
                      <p className="text-2xl font-bold text-yellow-700">{formatPrice(uaPriceVal, 'UAH')}</p>
                      <p className="text-sm text-slate-500">≈ {formatPrice(usdPriceVal, 'USD')}</p>
                    </div>
                  ) : (
                    <p className="text-slate-500">Нет данных</p>
                  )}
                </div>
                
                {/* Европа */}
                <div className="p-3 bg-blue-100 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span>🇪🇺</span>
                    <span className="font-semibold text-slate-700">Европа (Self-Repair)</span>
                  </div>
                  {euPriceVal ? (
                    <div>
                      <p className="text-2xl font-bold text-blue-700">{formatPrice(euPriceVal, 'EUR')}</p>
                      <p className="text-sm text-slate-500">≈ {formatPrice(euPriceInUah, 'UAH')}</p>
                    </div>
                  ) : (
                    <p className="text-slate-500">Нет данных</p>
                  )}
                </div>
                
                {/* Итог сравнения */}
                {savings !== null && savings !== 0 && (
                  <div className={cn(
                    'p-3 rounded-lg', 
                    savings > 0 ? 'bg-green-100' : 'bg-red-100'
                  )}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">
                        {savings > 0 ? '💚 Экономия в UA:' : '⚠️ Дороже в UA:'}
                      </span>
                      <span className={cn(
                        'font-bold', 
                        savings > 0 ? 'text-green-700' : 'text-red-700'
                      )}>
                        {savings > 0 ? '-' : '+'}{formatPrice(Math.abs(savings), 'UAH')} ({Math.abs(savingsPercent)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
