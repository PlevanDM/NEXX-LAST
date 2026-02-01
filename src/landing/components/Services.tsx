import React, { useState, useEffect, useMemo } from 'react';

const Services: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState<Record<number, number>>({});
  const [lang, setLang] = useState(window.i18n?.getCurrentLanguage()?.code || 'ro');
  
  const t = (key: string) => window.i18n?.t(key) || key;

  useEffect(() => {
    if (window.i18n?.subscribe) {
      return window.i18n.subscribe((newLang: string) => {
        setLang(newLang);
      });
    }
  }, []);

  const services = useMemo(() => {
    const battery = t('services.items.battery') as any || {};
    const board = t('services.items.board') as any || {};
    const display = t('services.items.display') as any || {};
    const port = t('services.items.port') as any || {};
    const modular = t('services.items.modular') as any || {};
    
    return [
      { 
        icon: 'fa-battery-full',
        title: battery.title || 'Reparații Baterii',
        popular: true,
        subServices: battery.subServices || [
          { name: 'iPhone 12-16', price: '150-250 lei', time: '30 min' },
          { name: 'iPhone SE/11', price: '100-150 lei', time: '30 min' },
          { name: 'Samsung S/Note', price: '120-200 lei', time: '45 min' },
          { name: 'MacBook Pro', price: '400-700 lei', time: '1-2 ore' },
          { name: 'iPad', price: '200-350 lei', time: '1 oră' }
        ],
        specs: t('services.specs.battery') as any || ['Baterii originale', 'Garanție 12 luni', 'Test capacitate', 'Calibrare BMS', 'Calitate premium', 'Regenerare celule']
      },
      { 
        icon: 'fa-microchip',
        title: board.title || 'Reparații Plăci',
        subServices: board.subServices || [
          { name: 'Reballing CPU/GPU', price: '300-600 lei', time: '2-4 ore' },
          { name: 'Reparare piste', price: '150-400 lei', time: '1-3 ore' },
          { name: 'Înlocuire IC', price: '200-500 lei', time: '1-2 ore' },
          { name: 'Deteriorare apă', price: '250-700 lei', time: '2-8 ore' },
          { name: 'Diagnostic avansat', price: '50-100 lei', time: '30 min' }
        ],
        specs: t('services.specs.board') as any || ['Diagnostic precis — găsim cauza', 'Reparare chipuri și microcipuri', 'Înlocuire BGA', 'Diagnostic gratuit', 'Echipament profesional', 'Componente originale']
      },
      { 
        icon: 'fa-mobile-screen',
        title: display.title || 'Înlocuire Display',
        subServices: display.subServices || [
          { name: 'iPhone 14-16 OLED', price: '450-900 lei', time: '45 min' },
          { name: 'iPhone 12/13 OLED', price: '300-550 lei', time: '45 min' },
          { name: 'Samsung AMOLED', price: '350-800 lei', time: '1 oră' },
          { name: 'MacBook Retina', price: '1200-2500 lei', time: '2-3 ore' },
          { name: 'iPad Display', price: '400-900 lei', time: '1-2 ore' }
        ],
        specs: t('services.specs.display') as any || ['OLED Original', 'LCD Premium', 'Garanție dead pixel', 'Touchscreen', 'Laminare', 'Calibrare True Tone']
      },
      { 
        icon: 'fa-bolt',
        title: port.title || 'Port Încărcare',
        subServices: port.subServices || [
          { name: 'iPhone Lightning', price: '100-180 lei', time: '30-45 min' },
          { name: 'iPhone USB-C', price: '150-250 lei', time: '45 min' },
          { name: 'Samsung USB-C', price: '80-150 lei', time: '30 min' },
          { name: 'MacBook USB-C', price: '200-400 lei', time: '1-2 ore' },
          { name: 'Curățare oxidare', price: '30-60 lei', time: '15 min' }
        ],
        specs: t('services.specs.port') as any || ['Conectori originali', 'Curățare profesională', 'Test încărcare', 'Reparare piste', 'Flex cablu nou', 'Garanție 6 luni']
      },
      { 
        icon: 'fa-screwdriver-wrench',
        title: modular.title || 'Service Modular',
        subServices: modular.subServices || [
          { name: 'Cameră principală', price: '150-400 lei', time: '30-60 min' },
          { name: 'Cameră frontală', price: '80-200 lei', time: '30 min' },
          { name: 'Speaker/Microfon', price: '60-150 lei', time: '20-40 min' },
          { name: 'Butoane/Senzori', price: '80-200 lei', time: '30-60 min' },
          { name: 'Face ID/Touch ID', price: '200-500 lei', time: '1 oră' }
        ],
        specs: t('services.specs.modular') as any || ['Module originale', 'Cameră HD test', 'Audio calibrare', 'Senzori verificați', 'Face ID repair', 'Touch ID pairing']
      },
      { 
        icon: 'fa-images',
        title: t('gallery.recentWorks'),
        isGallery: true,
        featured: true,
        works: (() => {
          const g = t('gallery.works') as any || {};
          const r = t('gallery.results') as any || {};
          return [
            { device: 'iPhone 15 Pro Max', repair: g.displayOLED || 'Înlocuire display OLED', result: r.likeNew || 'Ca nou' },
            { device: 'MacBook Pro M3', repair: g.boardWater || 'Reparație placă - deteriorare apă', result: r.functional || 'Funcțional 100%' },
            { device: 'Samsung S24 Ultra', repair: g.reballingDisplay || 'Reballing CPU + display', result: r.satisfied || 'Client mulțumit' },
            { device: 'iPad Pro 12.9', repair: g.batteryPort || 'Înlocuire baterie + port', result: r.warranty || 'Garanție 12 luni' },
            { device: 'iPhone 14', repair: g.faceIdCamera || 'Face ID + cameră', result: r.repaired || 'Reparat în 2 ore' }
          ];
        })()
      }
    ];
  }, [lang]);

  useEffect(() => {
    const initial: Record<number, number> = {};
    services.forEach((_, idx) => { initial[idx] = 0; });
    setActiveCardIndex(initial);
  }, [services]);

  const nextSlide = (idx: number, maxLen: number) => {
    setActiveCardIndex(prev => ({
      ...prev,
      [idx]: (prev[idx] + 1) % maxLen
    }));
  };

  const prevSlide = (idx: number, maxLen: number) => {
    setActiveCardIndex(prev => ({
      ...prev,
      [idx]: (prev[idx] - 1 + maxLen) % maxLen
    }));
  };

  return (
    <section id="services" className="py-16 md:py-24 px-4 bg-gray-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {t('services.title')}
          </h2>
          <p className="text-gray-400 text-lg">
            {t('services.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
          {services.map((service, idx) => {
            const currentIndex = activeCardIndex[idx] || 0;
            const items = service.isGallery ? (service.works as any[]) : (service.subServices as any[]);
            const currentItem = items ? items[currentIndex] : null;
            
            return (
              <div
                key={idx}
                className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 p-6 md:p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 overflow-visible flex flex-col h-full min-h-[440px]"
              >
                {/* Gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                {/* Badge */}
                {(service.popular || service.featured) && (
                  <div className={`absolute -top-3 right-6 ${service.popular ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg z-20 flex items-center gap-1.5`}>
                    <span>{service.popular ? '🔥' : '📸'}</span>
                    {service.popular ? t('services.popular') : t('gallery.title')}
                  </div>
                )}
                
                {/* Header with icon and title */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">
                    <i className={`fas ${service.icon}`}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors"> 
                    {service.title}
                  </h3>
                </div>
                
                {/* Carousel content */}
                {service.isGallery ? (
                  <div className="relative z-10 flex-1 flex flex-col">
                    {currentItem && (
                      <div className="bg-gray-700/50 rounded-2xl p-5 mb-4 min-h-[120px] flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <i className="fas fa-mobile-alt text-blue-400"></i>
                          <span className="text-white font-semibold text-base">{currentItem.device}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{currentItem.repair}</p>
                        <div className="flex items-center gap-1.5 text-green-400 text-sm">
                          <i className="fas fa-check-circle"></i>
                          <span>{currentItem.result}</span>
                        </div>
                      </div>
                    )}
                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-auto">
                      <button
                        onClick={() => prevSlide(idx, items.length)}
                        className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-lg"
                      >
                        <i className="fas fa-chevron-left text-sm"></i>
                      </button>
                      <div className="flex gap-2">
                        {items.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-blue-500 w-4' : 'bg-gray-600'}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => nextSlide(idx, items.length)}
                        className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-lg"
                      >
                        <i className="fas fa-chevron-right text-sm"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 flex-1 flex flex-col">
                    {currentItem && (
                      <div className="bg-gray-700/50 rounded-2xl p-5 mb-4 flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-white font-medium text-base">{currentItem.name}</span>
                          <span className="text-blue-400 font-bold text-base">{currentItem.price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <i className="far fa-clock"></i>
                          <span>{currentItem.time}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={() => prevSlide(idx, items.length)}
                        className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-lg"
                      >
                        <i className="fas fa-chevron-left text-sm"></i>
                      </button>
                      <div className="flex gap-2">
                        {items.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-blue-500 w-4' : 'bg-gray-600'}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => nextSlide(idx, items.length)}
                        className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-lg"
                      >
                        <i className="fas fa-chevron-right text-sm"></i>
                      </button>
                    </div>
                    
                    {/* Specs in 2 columns */}
                    {service.specs && (
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-4 border-t border-gray-700/50 mb-6">
                        {(service.specs as string[]).map((spec, sidx) => (
                          <div
                            key={sidx}
                            className="flex items-center gap-2 text-xs text-gray-400"
                          >
                            <i className="fas fa-check text-green-500/80 text-[10px]"></i>
                            <span className="truncate">{spec}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* CTA Button */}
                    <a
                      href="#calculator"
                      className="mt-auto w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all hover:shadow-xl flex items-center justify-center gap-2 text-sm shadow-lg active:scale-95"
                    >
                      {t('buttons.calculate') || 'Calculează prețul'}
                      <i className="fas fa-arrow-right text-xs"></i>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
