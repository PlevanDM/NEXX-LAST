import React from 'react';
import { Icons } from './Icons';
import { formatPrice } from '../utils';
import { ServicePrices } from '../types';

interface ServiceItem {
  name: string;
  price?: number;
  free?: boolean;
  icon?: string;
  popularity?: number;
  categories?: string[];
}

interface ServicePriceListProps {
  services: Record<string, ServiceItem>;
  servicePrices: ServicePrices | null;
  rates: any;
  onClose: () => void;
}

const iconMap: Record<string, string> = {
  'fa-microscope': '🔬',
  'fa-mobile-screen': '📱',
  'fa-battery-full': '🔋',
  'fa-plug': '🔌',
  'fa-camera': '📷',
  'fa-microchip': '💻',
  'fa-code': '💾',
  'fa-keyboard': '⌨️',
  'fa-mobile': '📱',
  'fa-water': '💧'
};

type Category = 'all' | 'phone' | 'tablet' | 'laptop' | 'watch' | 'additional';

export const ServicePriceList: React.FC<ServicePriceListProps> = ({ services, servicePrices, rates, onClose }) => {
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<Category>('all');
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 5000]);

  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'all', label: 'Toate', icon: '🔧' },
    { id: 'phone', label: 'iPhone', icon: '📱' },
    { id: 'tablet', label: 'iPad', icon: '📟' },
    { id: 'laptop', label: 'MacBook', icon: '💻' },
    { id: 'watch', label: 'Apple Watch', icon: '⌚' },
    { id: 'additional', label: 'Extra', icon: '✨' },
  ];

  const servicesList = React.useMemo(() => {
    return Object.entries(services)
      .map(([key, value]) => {
        // Find price range if available for current category
        let priceRange = null;
        if (servicePrices && selectedCategory !== 'all') {
          priceRange = servicePrices.byCategory[selectedCategory]?.[key];
        } else if (servicePrices) {
          // If all categories selected, find min across all
          const categories = ['phone', 'tablet', 'laptop'];
          let min = Infinity;
          categories.forEach(cat => {
            const p = servicePrices.byCategory[cat]?.[key];
            if (p && p.min < min) min = p.min;
          });
          if (min !== Infinity) priceRange = { min, max: 0, avg: 0 };
        }

        return {
          id: key,
          ...value,
          emoji: iconMap[value.icon || ''] || '🔧',
          dynamicPrice: priceRange?.min || value.price
        };
      })
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }, [services, servicePrices, selectedCategory]);

  const filteredServices = React.useMemo(() => {
    return servicesList.filter(s => {
      const q = search.toLowerCase();
      const matchesSearch = s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'all' || s.categories?.includes(selectedCategory);

      const price = s.free ? 0 : s.dynamicPrice || 0;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [servicesList, search, selectedCategory, priceRange]);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-orange-600 rounded-t-xl text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Icons.Price /> Servicii disponibile
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <Icons.Close />
        </button>
      </div>

      <div className="p-4 bg-white border-b border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icons.Search />
            </div>
            <input
              type="text"
              placeholder="Caută serviciu..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase px-2">Preț max:</span>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-32 h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <span className="text-sm font-bold text-orange-700 min-w-[80px]">
              {priceRange[1]} RON
            </span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-900/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div 
                key={service.id} 
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:border-orange-300 group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl transition-transform group-hover:scale-110 duration-300">
                    {service.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{service.name}</h3>
                    <div className="mt-2">
                      {service.free ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          ✓ Gratuit
                        </span>
                      ) : service.dynamicPrice ? (
                        <div className="flex flex-col">
                           <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold w-fit">
                            de la {service.dynamicPrice} RON
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium italic">Preț la cerere</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-48 text-slate-400">
              <Icons.Search className="w-12 h-12 mb-2 opacity-20" />
              <p className="font-medium">Nu s-au găsit servicii pentru criteriile selectate</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2">ℹ️ Notă</h4>
          <p className="text-sm text-blue-700">
            Prețurile finale depind de modelul dispozitivului și complexitatea reparației.
            Contactați-ne pentru o estimare exactă.
          </p>
        </div>
      </div>
    </div>
  );
};
