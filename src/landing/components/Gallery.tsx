import React, { useState, useEffect } from 'react';

const Gallery: React.FC = () => {
  const [lang, setLang] = useState(window.i18n?.getCurrentLanguage?.()?.code || 'ro');
  
  const t = (key: string) => window.i18n?.t(key) || key;

  useEffect(() => {
    if (window.i18n?.subscribe) {
      return window.i18n.subscribe((newLang?: string) => {
        setLang(newLang ?? window.i18n?.getCurrentLanguage?.()?.code ?? 'ro');
      });
    }
  }, []);

  const captions: any = {
    ro: { battery: 'Înlocuire Baterie', screen: 'Înlocuire Display', workshop: 'Atelier Profesional', reception: 'Recepție Service' },
    en: { battery: 'Battery Replacement', screen: 'Screen Replacement', workshop: 'Professional Workshop', reception: 'Service Reception' },
    ru: { battery: 'Замена Батареи', screen: 'Замена Дисплея', workshop: 'Профессиональная Мастерская', reception: 'Ресепшн Сервиса' },
    uk: { battery: 'Заміна Батареї', screen: 'Заміна Дисплея', workshop: 'Професійна Майстерня', reception: 'Ресепшн Сервісу' }
  };
  const cap = captions[lang] || captions.ro;

  const photos = [
    {
      src: '/static/images/screen-repair-process.jpg',
      alt: cap.screen,
      title: cap.screen,
      featured: true
    },
    {
      src: '/static/images/battery-repair-process.jpg',
      alt: cap.battery,
      title: cap.battery
    },
    {
      src: '/static/images/tools-setup.jpg',
      alt: cap.workshop,
      title: cap.workshop
    }
  ];

  return (
    <section id="gallery" className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 bg-gradient-to-br from-gray-950 to-black overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-white">
            {t('gallery.title')}
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg">
            {t('gallery.subtitle')}
          </p>
        </div>
        
        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-800 hover:border-gray-600 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 ${photo.featured ? 'sm:col-span-2' : ''}`}
            >
              {/* Image */}
              <div className={`overflow-hidden bg-gray-800 ${photo.featured ? 'aspect-[16/9] sm:aspect-[21/9]' : 'aspect-[4/3]'}`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  loading="lazy"
                />
              </div>
              
              {/* Overlay with title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                <div className="p-4 sm:p-6 md:p-8 w-full">
                  <p className="text-white font-bold text-base sm:text-xl md:text-2xl flex items-center gap-2 sm:gap-3">
                    <i className="fas fa-camera text-blue-400"></i>
                    {photo.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
