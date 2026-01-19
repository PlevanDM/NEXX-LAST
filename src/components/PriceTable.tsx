import React from 'react';
import { Icons } from './Icons';
import { formatPrice, convertPrice, cn } from '../utils';
import { PriceData } from '../types';

interface PriceTableProps {
  items: PriceData[];
  onSelectItem?: (item: PriceData) => void;
  onClose: () => void;
}

export const PriceTable: React.FC<PriceTableProps> = ({ items, onSelectItem, onClose }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [sortBy, setSortBy] = React.useState<'name' | 'priceAsc' | 'priceDesc'>('name');

  const filteredItems = React.useMemo(() => {
    return items
      .filter(item => {
        const matchesSearch = 
          item.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || item.category === category;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return (a.price_uah || 0) - (b.price_uah || 0);
        if (sortBy === 'priceDesc') return (b.price_uah || 0) - (a.price_uah || 0);
        return a.description.localeCompare(b.description);
      });
  }, [items, searchTerm, category, sortBy]);

  const categories = React.useMemo(() => {
    const cats = new Set(items.map(i => i.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [items]);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="text-green-600"><Icons.Price /></span>
          Прайс-лист
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <Icons.Close />
        </button>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-3 bg-white">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Поиск по артикулу или названию..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 5).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat as string)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                category === cat 
                  ? "bg-green-600 text-white border-green-600" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-green-500"
              )}
            >
              {cat === 'all' ? 'Все' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-slate-100 text-xs font-semibold text-slate-500 border-y border-slate-200">
        <div className="col-span-2">Артикул</div>
        <div className="col-span-6">Описание</div>
        <div 
          className="col-span-2 text-right cursor-pointer hover:text-green-600"
          onClick={() => setSortBy(sortBy === 'priceAsc' ? 'priceDesc' : 'priceAsc')}
        >
          Цена (UAH) ↕
        </div>
        <div className="col-span-2 text-right text-slate-400">USD</div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div 
              key={item.article}
              onClick={() => onSelectItem?.(item)}
              className="grid grid-cols-12 gap-4 px-3 py-3 rounded-lg hover:bg-green-50 cursor-pointer transition-colors items-center group border border-transparent hover:border-green-200"
            >
              <div className="col-span-2 font-mono text-xs font-bold text-slate-600 group-hover:text-green-700">
                {item.article}
              </div>
              <div className="col-span-6 text-sm text-slate-800 font-medium truncate">
                {item.description}
              </div>
              <div className="col-span-2 text-right font-bold text-slate-900 group-hover:text-green-700">
                {formatPrice(item.price_uah, 'UAH')}
              </div>
              <div className="col-span-2 text-right text-xs text-slate-400 font-mono">
                {formatPrice(convertPrice(item.price_uah, 'UAH', 'USD'), 'USD')}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <Icons.Search />
            <p className="mt-2">Ничего не найдено</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-center text-slate-500">
        Показано {filteredItems.length} из {items.length} позиций
      </div>
    </div>
  );
};
