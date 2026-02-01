import React from 'react';

const WhyUs: React.FC = () => {
  const t = (key: string) => window.i18n?.t(key) || key;

  const features = [
    { 
      icon: 'fa-mobile-alt',
      title: t('whyUs.multibrand.title') || 'Multibrand',
      desc: t('whyUs.multibrand.desc') || 'Apple, Samsung, Xiaomi, Huawei și alte mărci'
    },
    { 
      icon: 'fa-bolt',
      title: t('whyUs.fast.title') || 'Service Express',
      desc: t('whyUs.fast.desc') || 'Reparații rapide, fără așteptare'
    },
    { 
      icon: 'fa-shield-alt',
      title: t('whyUs.warranty.title') || 'Garanție Inclusă',
      desc: t('whyUs.warranty.desc') || 'Calitate garantată'
    },
    { 
      icon: 'fa-tag',
      title: t('whyUs.honest.title') || 'Prețuri corecte',
      desc: t('whyUs.honest.desc') || 'Fără costuri ascunse'
    },
    { 
      icon: 'fa-tools',
      title: t('whyUs.original.title') || 'Piese originale',
      desc: t('whyUs.original.desc') || 'Verificate și testate'
    },
    { 
      icon: 'fa-microscope',
      title: t('whyUs.diagnostic.title') || 'Diagnostic gratuit',
      desc: t('whyUs.diagnostic.desc') || 'Profesional sub microscop'
    },
    { 
      icon: 'fa-camera',
      title: t('whyUs.transparent.title') || 'Transparent',
      desc: t('whyUs.transparent.desc') || 'Raport foto/video al reparației'
    },
    { 
      icon: 'fa-headset',
      title: t('whyUs.support.title') || 'Suport Online',
      desc: t('whyUs.support.desc') || 'Telegram, WhatsApp disponibil'
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-gray-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {t('whyUs.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0.5 bg-gray-800/50 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-gray-900 p-8 md:p-10 hover:bg-gray-800/80 transition-all duration-300"
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
              
              {/* Icon */}
              <div className="mb-6 relative z-10">
                <i className={`fas ${feature.icon} text-4xl text-gray-500 group-hover:text-blue-400 transition-colors duration-300`} />
              </div>
              
              {/* Title with animated bar */}
              <div className="relative mb-4 z-10 flex items-center">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/40 group-hover:bg-blue-500 group-hover:w-1.5 transition-all duration-300 rounded-full" />
                <h3 className="text-xl font-bold pl-5 text-white group-hover:translate-x-1 transition-transform duration-300">
                  {feature.title}
                </h3>
              </div>
              
              {/* Description */}
              <p className="text-sm text-gray-400 group-hover:text-gray-300 relative z-10 pl-5 transition-colors duration-300 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
