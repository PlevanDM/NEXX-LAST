import React, { useState, useEffect } from 'react';

const Gallery: React.FC = () => {
  const [lang, setLang] = useState(window.i18n?.getCurrentLanguage()?.code || 'ro');
  
  const t = (key: string) => window.i18n?.t(key) || key;

  useEffect(() => {
    if (window.i18n?.subscribe) {
      return window.i18n.subscribe((newLang: string) => {
        setLang(newLang);
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
      src: '/images/screen-replacement.png',
      alt: cap.screen,
      title: cap.screen,
      featured: true
    },
    {
      src: '/images/battery-replacement.png',
      alt: cap.battery,
      title: cap.battery
    },
    {
      src: '/images/service-center-shop.png',
      alt: cap.workshop,
      title: cap.workshop
    },
    {
      src: '/images/workspace.png',
      alt: cap.reception,
      title: cap.reception
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-gray-950 to-black overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {t('gallery.title')}
          </h2>
          <p className="text-gray-400 text-lg">
            {t('gallery.subtitle')}
          </p>
        </div>
        
        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-3xl border border-gray-800 hover:border-gray-600 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 ${photo.featured ? 'md:col-span-2' : ''}`}
            >
              {/* Image */}
              <div className={`overflow-hidden bg-gray-800 ${photo.featured ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              
              {/* Overlay with title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                <div className="p-8 w-full">
                  <p className="text-white font-bold text-xl md:text-2xl flex items-center gap-3">
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
