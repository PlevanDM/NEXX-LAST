import React from 'react';
import { Icons } from './Icons';
import { formatPrice } from '../utils';

interface ServiceItem {
  name: string;
  price?: number;
  free?: boolean;
  icon?: string;
}

interface ServicePriceListProps {
  services: Record<string, ServiceItem>;
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
  'fa-keyboard': '⌨️'
};

export const ServicePriceList: React.FC<ServicePriceListProps> = ({ services, rates, onClose }) => {
  const [search, setSearch] = React.useState('');

  const servicesList = React.useMemo(() => {
    return Object.entries(services).map(([key, value]) => ({
      id: key,
      ...value,
      emoji: iconMap[value.icon || ''] || '🔧'
    }));
  }, [services]);

  const filteredServices = React.useMemo(() => {
    if (!search) return servicesList;
    const q = search.toLowerCase();
    return servicesList.filter(s => 
      s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    );
  }, [servicesList, search]);

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

      <div className="p-4 bg-white border-b border-slate-200">
        <div className="relative">
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
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div 
                key={service.id} 
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:border-orange-300"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{service.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{service.name}</h3>
                    <div className="mt-2">
                      {service.free ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                          ✓ Gratuit
                        </span>
                      ) : service.price ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                          de la {service.price} RON
                        </span>
                      ) : (
                        <span className="text-sm text-slate-500">Preț la cerere</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-48 text-slate-400">
              <p>Nu s-au găsit servicii</p>
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
