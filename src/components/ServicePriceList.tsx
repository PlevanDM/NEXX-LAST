import React from 'react';
import { Icons } from './Icons';

interface ServiceItem {
  name: string;
  price?: number;
  free?: boolean;
  icon?: string;
  description?: string;
}

interface PriceRange {
  min: number;
  max: number;
  avg: number;
}

interface ServicePriceListProps {
  services: Record<string, ServiceItem>;
  rates: any;
  onClose: () => void;
}

const iconMap: Record<string, string> = {
  'fa-microscope': '🔬',
  'fa-mobile-screen': '📱',
  'fa-shield-halved': '🛡️',
  'fa-battery-full': '🔋',
  'fa-plug': '🔌',
  'fa-camera': '📷',
  'fa-camera-retro': '🤳',
  'fa-circle-dot': '⭕',
  'fa-microchip': '💻',
  'fa-box': '📦',
  'fa-microphone': '🎙️',
  'fa-volume-high': '🔊',
  'fa-keyboard': '⌨️',
  'fa-hand-pointer': '👆',
  'fa-fingerprint': '🔐',
  'fa-laptop': '💻',
  'fa-right-left': '🔄',
  'fa-droplet': '💧',
  'fa-code': '💾',
  'fa-database': '💿',
  'fa-broom': '🧹',
  'fa-shield': '🛡️',
  'fa-user-shield': '👤',
  'fa-circle-play': '⏯️',
  'fa-gem': '💎',
  'fa-magnet': '🧲'
};

type CategoryKey = 'all' | 'phone' | 'tablet' | 'laptop' | 'watch' | 'additional';

const categoryLabels: Record<CategoryKey, string> = {
  all: '🔧 Toate',
  phone: '📱 iPhone',
  tablet: '📟 iPad',
  laptop: '💻 MacBook',
  watch: '⌚ Apple Watch',
  additional: '✨ Extra'
};

// Additional services from the price list
const additionalServicesList = [
  { id: 'firmware_update', name: 'Actualizare / Firmware / Resetare Mac', time: '1 oră', price: 249, emoji: '💾' },
  { id: 'data_transfer', name: 'Transmitere date (cu instalarea aplicației)', time: '1-6 ore', price: 249, emoji: '📲' },
  { id: 'data_recovery', name: 'Recuperare date (memorie plină)', time: '1 zi', price: 149, emoji: '💿' },
  { id: 'speaker_cleaning', name: 'Curățarea difuzoarelor (fără deschidere)', time: '10-20 min', price: 99, emoji: '🧹' },
  { id: 'airpods_cleaning', name: 'Curățare AirPods', time: '1 oră', price: 99, emoji: '🎧' },
  { id: 'screen_protector_iphone', name: 'Sticlă de protecție iPhone', time: '15 min', price: 99, emoji: '🛡️' },
  { id: 'screen_protector_ipad', name: 'Sticlă de protecție iPad', time: '15 min', price: 149, emoji: '🛡️' },
  { id: 'apple_id_setup', name: 'Creare și Configurare Apple ID', time: '30 min', price: 99, emoji: '👤' },
  { id: 'apple_id_unlock_forgot', name: 'Deblocare dispozitiv (parolă uitată Apple ID)', time: '2 săptămâni', price: 199, emoji: '🔓' },
  { id: 'apple_id_unlock_fraud', name: 'Deblocare dispozitiv (Apple ID fraudulos)', time: '2 săptămâni', price: 499, emoji: '🚨' },
];

// Category-specific services mapping
const categoryServices: Record<string, string[]> = {
  phone: ['diagnostic', 'screen', 'screen_glass', 'battery', 'charging', 'camera_rear', 'camera_glass', 'motherboard', 'housing', 'microphone', 'software', 'glass_protection'],
  tablet: ['diagnostic', 'touchscreen', 'screen', 'battery', 'charging', 'camera_rear', 'camera_front', 'housing', 'buttons', 'speaker', 'motherboard', 'software', 'glass_protection'],
  laptop: ['diagnostic', 'liquid_damage', 'motherboard', 'screen', 'touchid', 'flexcable', 'topcase', 'keyboard', 'trackpad', 'battery', 'speaker', 'magsafe', 'software'],
  watch: ['screen', 'battery', 'speaker', 'software', 'polish', 'housing', 'cleaning'],
};

export const ServicePriceList: React.FC<ServicePriceListProps> = ({ services, rates, onClose }) => {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState<CategoryKey>('all');

  // Load prices data
  const [pricesData, setPricesData] = React.useState<any>(null);
  React.useEffect(() => {
    fetch('/data/chunks/prices.json')
      .then(r => r.json())
      .then(d => setPricesData(d))
      .catch(() => {});
  }, []);

  const servicesList = React.useMemo(() => {
    return Object.entries(services).map(([key, value]) => ({
      id: key,
      ...value,
      emoji: iconMap[value.icon || ''] || '🔧'
    }));
  }, [services]);

  // Get price range for a service in current category
  const getPriceInfo = (serviceId: string, cat: CategoryKey): { min?: number; max?: number; display: string } => {
    if (!pricesData?.byCategory) return { display: '' };
    
    const catMap: Record<string, string> = { phone: 'phone', tablet: 'tablet', laptop: 'laptop', watch: 'watch' };
    const catKey = catMap[cat];
    if (!catKey) return { display: '' };
    
    const range = pricesData.byCategory[catKey]?.[serviceId] as PriceRange | undefined;
    if (!range) return { display: '' };
    
    if (range.min === 0 && range.max === 0) return { display: 'Gratuit' };
    if (range.min === range.max) return { min: range.min, max: range.max, display: `${range.min} lei` };
    return { min: range.min, max: range.max, display: `${range.min} – ${range.max} lei` };
  };

  const filteredServices = React.useMemo(() => {
    const q = search.toLowerCase();
    
    if (category === 'additional') {
      return additionalServicesList
        .filter(s => !q || s.name.toLowerCase().includes(q))
        .map(s => ({
          id: s.id,
          name: s.name,
          emoji: s.emoji,
          price: s.price,
          time: s.time,
          isAdditional: true
        }));
    }
    
    let list = servicesList;
    
    // Filter by category
    if (category !== 'all') {
      const allowedIds = categoryServices[category] || [];
      list = list.filter(s => allowedIds.includes(s.id));
    }
    
    // Filter by search
    if (q) {
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.id.toLowerCase().includes(q) ||
        (s.description?.toLowerCase() || '').includes(q)
      );
    }
    
    return list.map(s => ({ ...s, isAdditional: false }));
  }, [servicesList, search, category]);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
      {/* Header — такой же стиль как у Power Tracker: лого в градиенте + белый бар */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-slate-200 rounded-t-xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-sm">
            <Icons.Price className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold text-slate-900 truncate">Servicii disponibile</h2>
            <p className="text-xs text-slate-500 truncate">Prețuri reparații · Diagnostic gratuit</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600" aria-label="Închide">
          <Icons.Close />
        </button>
      </div>

      {/* Search + Category tabs */}
      <div className="p-4 bg-white border-b border-slate-200 space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Caută serviciu..."
            aria-label="Caută serviciu"
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(categoryLabels) as [CategoryKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                category === key 
                  ? 'bg-orange-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Services grid */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredServices.length > 0 ? (
            filteredServices.map((service: any) => (
              <div 
                key={service.id} 
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:border-orange-300"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{service.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-800 leading-tight">{service.name}</h3>
                    
                    {service.description && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{service.description}</p>
                    )}
                    
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {service.isAdditional ? (
                        <>
                          <span className="inline-flex items-center px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                            {service.price} lei
                          </span>
                          {service.time && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">
                              ⏱️ {service.time}
                            </span>
                          )}
                        </>
                      ) : service.free ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          ✓ Gratuit
                        </span>
                      ) : (
                        <>
                          {/* Show price ranges per category if available */}
                          {category !== 'all' && (() => {
                            const info = getPriceInfo(service.id, category);
                            if (info.display) return (
                              <span className="inline-flex items-center px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                                {info.display === 'Gratuit' ? '✓ Gratuit' : `de la ${info.min ?? ''} lei`}
                              </span>
                            );
                            return null;
                          })()}
                          
                          {/* General category price badges when showing ALL */}
                          {category === 'all' && pricesData?.byCategory && (() => {
                            const cats = ['phone', 'tablet', 'laptop', 'watch'] as const;
                            const foundCats = cats.filter(c => pricesData.byCategory[c]?.[service.id]);
                            if (foundCats.length === 0 && service.price) {
                              return (
                                <span className="inline-flex items-center px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                                  de la {service.price} lei
                                </span>
                              );
                            }
                            return foundCats.map(c => {
                              const range = pricesData.byCategory[c][service.id];
                              if (!range || (range.min === 0 && range.max === 0)) return null;
                              const catIcons: Record<string, string> = { phone: '📱', tablet: '📟', laptop: '💻', watch: '⌚' };
                              return (
                                <span key={c} className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium">
                                  {catIcons[c]} {range.min === range.max ? `${range.min}` : `${range.min}–${range.max}`}
                                </span>
                              );
                            });
                          })()}
                          
                          {!pricesData && !service.price && (
                            <span className="text-xs text-slate-500">Preț la cerere</span>
                          )}
                        </>
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
        
        {/* Stats / summary */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-1 text-sm">ℹ️ Despre prețuri</h4>
            <p className="text-xs text-blue-700">
              Prețurile sunt orientative și depind de modelul exact al dispozitivului. 
              Diagnostica este GRATUITĂ. Contactați-ne pentru estimare exactă.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-bold text-green-800 mb-1 text-sm">✅ Garanție</h4>
            <p className="text-xs text-green-700">
              Toate reparațiile vin cu garanție. Folosim piese originale și aftermarket de calitate.
              {pricesData?.lastUpdated && (
                <span className="block mt-1 text-[10px] text-green-500">Actualizat: {pricesData.lastUpdated}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
