import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

const Services: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState<Record<number, number>>({});
  const [lang, setLang] = useState(window.i18n?.getCurrentLanguage?.()?.code || 'ro');
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const t = (key: string) => window.i18n?.t(key) || key;

  useEffect(() => {
    if (window.i18n?.subscribe) {
      return window.i18n.subscribe((newLang?: string) => {
        setLang(newLang ?? window.i18n?.getCurrentLanguage?.()?.code ?? 'ro');
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
          { name: 'iPhone 17 / 17 Pro', price: 'de la 599 lei', time: '30 min' },
          { name: 'iPhone 16 / 16 Pro', price: 'de la 499 lei', time: '30 min' },
          { name: 'iPhone 15 / 14 / SE', price: 'de la 349 lei', time: '30 min' },
          { name: 'Samsung S25 / S24', price: 'de la 399 lei', time: '45 min' },
          { name: 'MacBook Pro / Air', price: 'de la 499 lei', time: '1-2 ore' },
          { name: 'iPad Pro / Air / Mini', price: 'de la 600 lei', time: '1 oră' }
        ],
        specs: t('services.specs.battery') as any || ['Baterii originale', 'Garanție 12 luni', 'Test capacitate', 'Calibrare BMS', 'Calitate premium', 'Regenerare celule']
      },
      { 
        icon: 'fa-microchip',
        title: board.title || 'Reparații Plăci',
        subServices: board.subServices || [
          { name: 'iPhone 17 (A19 Bionic)', price: 'de la 1199 lei', time: '3-6 ore' },
          { name: 'iPhone 16/15 Pro', price: 'de la 999 lei', time: '2-4 ore' },
          { name: 'Reballing CPU/GPU', price: 'de la 899 lei', time: '2-4 ore' },
          { name: 'Deteriorare apă', price: 'de la 999 lei', time: '2-8 ore' },
          { name: 'MacBook M4/M3 SoC', price: 'de la 499 lei', time: '1-3 zile' }
        ],
        specs: t('services.specs.board') as any || ['Diagnostic precis — găsim cauza', 'Reparare chipuri și microcipuri', 'Înlocuire BGA', 'Diagnostic gratuit', 'Echipament profesional', 'Componente originale']
      },
      { 
        icon: 'fa-mobile-screen',
        title: display.title || 'Înlocuire Display',
        subServices: display.subServices || [
          { name: 'iPhone 17 Pro / Pro Max', price: 'de la 1999 lei', time: '50-60 min' },
          { name: 'iPhone 17 / 17 Plus', price: 'de la 1499 lei', time: '45 min' },
          { name: 'iPhone 16 / 15 OLED', price: 'de la 895 lei', time: '45 min' },
          { name: 'Samsung S25 / S24', price: 'de la 999 lei', time: '1 oră' },
          { name: 'MacBook Retina', price: 'de la 999 lei', time: '2-3 ore' },
          { name: 'iPad Pro / Air', price: 'de la 899 lei', time: '1-2 ore' }
        ],
        specs: t('services.specs.display') as any || ['OLED/LTPO Original', 'LCD Premium', 'Garanție dead pixel', 'Touchscreen', 'Laminare', 'Calibrare True Tone']
      },
      { 
        icon: 'fa-bolt',
        title: port.title || 'Port Încărcare',
        subServices: port.subServices || [
          { name: 'iPhone 17 USB4', price: 'de la 599 lei', time: '45 min' },
          { name: 'iPhone 16/15 USB-C', price: 'de la 499 lei', time: '45 min' },
          { name: 'iPhone 14 Lightning', price: 'de la 449 lei', time: '30-45 min' },
          { name: 'Samsung / Android', price: 'de la 449 lei', time: '30 min' },
          { name: 'MacBook USB-C', price: 'de la 499 lei', time: '1-2 ore' }
        ],
        specs: t('services.specs.port') as any || ['Conectori originali', 'Curățare profesională', 'Test încărcare', 'Reparare piste', 'Flex cablu nou', 'Garanție 6 luni']
      },
      { 
        icon: 'fa-screwdriver-wrench',
        title: modular.title || 'Service Modular',
        subServices: modular.subServices || [
          { name: 'Cameră iPhone 17 Pro', price: 'de la 999 lei', time: '45-60 min' },
          { name: 'Cameră iPhone 16/15', price: 'de la 449 lei', time: '30-60 min' },
          { name: 'Face ID / Touch ID', price: 'de la 599 lei', time: '1 oră' },
          { name: 'Speaker / Microfon', price: 'de la 449 lei', time: '30 min' },
          { name: 'Cameră Samsung S25', price: 'de la 499 lei', time: '45 min' }
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

  // Sync active dot with scroll position
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.children[0]?.getBoundingClientRect().width || 0;
    if (cardWidth === 0) return;
    const gap = 16;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveServiceIdx(Math.max(0, Math.min(idx, services.length - 1)));
  }, [services.length]);

  // Scroll to a specific card when dot is clicked
  const scrollToCard = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el || !el.children[idx]) return;
    (el.children[idx] as HTMLElement).scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }, []);

  return (
    <section id="services" className="py-12 sm:py-16 md:py-24 bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-white">
            {t('services.title')}
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg">
            {t('services.subtitle')}
          </p>
        </div>
        
        {/* Mobile swipe dots */}
        <div className="flex sm:hidden justify-center gap-2 mb-4">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              aria-label={`Card ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${i === activeServiceIdx ? 'w-6 bg-blue-500' : 'w-2 bg-gray-600'}`}
            />
          ))}
        </div>

        {/* Mobile: horizontal swipe | Desktop: grid */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="
            flex sm:grid
            sm:grid-cols-2 lg:grid-cols-3
            gap-4 sm:gap-6 md:gap-8
            sm:auto-rows-fr
            overflow-x-auto sm:overflow-x-visible
            snap-x snap-mandatory sm:snap-none
            pb-4 sm:pb-0
            -mx-3 px-3 sm:mx-0 sm:px-0
            scrollbar-hide
          "
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services.map((service, idx) => {
            const currentIndex = activeCardIndex[idx] || 0;
            const items = service.isGallery ? (service.works as any[]) : (service.subServices as any[]);
            const currentItem = items ? items[currentIndex] : null;
            
            return (
              <div
                key={idx}
                className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 overflow-visible flex flex-col h-full min-w-[85vw] sm:min-w-0 snap-start flex-shrink-0 sm:flex-shrink"
              >
                {/* Gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                {/* Badge */}
                {(service.popular || service.featured) && (
                  <div className={`absolute -top-3 right-4 sm:right-6 ${service.popular ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg z-20 flex items-center gap-1 sm:gap-1.5`}>
                    <span>{service.popular ? '🔥' : '📸'}</span>
                    {service.popular ? t('services.popular') : t('gallery.title')}
                  </div>
                )}
                
                {/* Header with icon and title */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg flex-shrink-0">
                    <i className={`fas ${service.icon}`}></i>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors"> 
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
                        aria-label={t('services.prevSlide')}
                        className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-lg"
                      >
                        <i className="fas fa-chevron-left text-sm"></i>
                      </button>
                      <div className="flex gap-2" role="tablist" aria-label={t('services.slides')}>
                        {items.map((_, i) => (
                          <div
                            key={i}
                            role="tab"
                            aria-selected={i === currentIndex}
                            aria-label={`${t('services.slide')} ${i + 1}`}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-blue-500 w-4' : 'bg-gray-600'}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => nextSlide(idx, items.length)}
                        aria-label={t('services.nextSlide')}
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
                        aria-label={t('services.prevSlide')}
                        className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-lg"
                      >
                        <i className="fas fa-chevron-left text-sm"></i>
                      </button>
                      <div className="flex gap-2" role="tablist" aria-label={t('services.slides')}>
                        {items.map((_, i) => (
                          <div
                            key={i}
                            role="tab"
                            aria-selected={i === currentIndex}
                            aria-label={`${t('services.slide')} ${i + 1}`}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-blue-500 w-4' : 'bg-gray-600'}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => nextSlide(idx, items.length)}
                        aria-label={t('services.nextSlide')}
                        className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-lg"
                      >
                        <i className="fas fa-chevron-right text-sm"></i>
                      </button>
                    </div>
                    
                    {/* Specs in 2 columns */}
                    {service.specs && (
                      <div className="grid grid-cols-2 gap-x-2 sm:gap-x-3 gap-y-1.5 sm:gap-y-2 pt-3 sm:pt-4 border-t border-gray-700/50 mb-4 sm:mb-6">
                        {(service.specs as string[]).map((spec, sidx) => (
                          <div
                            key={sidx}
                            className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-400"
                          >
                            <i className="fas fa-check text-green-500/80 text-[10px] flex-shrink-0"></i>
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

        {/* Mobile swipe hint */}
        <p className="sm:hidden text-center text-gray-500 text-xs mt-3 flex items-center justify-center gap-1.5">
          <i className="fas fa-hand-pointer"></i>
          {t('services.swipeHint') || 'Glisați pentru mai multe servicii'}
        </p>
      </div>

      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Services;
