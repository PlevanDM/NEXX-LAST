import React from 'react';

const Hero: React.FC = () => {
  const t = (key: string) => window.i18n?.t(key) || key;

  return (
    <section 
      id="main-content"
      className="relative min-h-[85vh] flex items-center justify-center hero-bg text-white overflow-hidden pt-24 py-16 md:py-24"
      aria-label={t('footer.ariaLabel')}
    >
      {/* Animated dots background */}
      <div className="absolute inset-0 z-0 opacity-30">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-500 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center animate-fade-in w-full">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-3 md:mb-6 leading-tight">
          <span className="block">{t('hero.title')}</span>
          <span className="block mt-1 md:mt-2 text-gray-300 text-3xl sm:text-4xl md:text-5xl">
            {t('hero.subtitle')}
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-10 text-blue-100 max-w-3xl mx-auto px-4">
          {t('hero.description')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto w-full px-4">
          <a
            href="#calculator"
            className="group relative px-8 py-5 md:py-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-size-200 hover:bg-right text-white text-lg md:text-xl font-bold rounded-2xl shadow-2xl hover:shadow-blue-900/50 transition-all duration-500 active:scale-95 flex items-center justify-center gap-3 overflow-hidden min-h-[64px]"
            style={{ backgroundSize: '200% 100%' }}
          >
            <span className="relative z-10 text-lg flex items-center gap-2">
              <i className="fas fa-calculator"></i>
              {t('buttons.calculate')}
              <i className="fas fa-arrow-right transition-transform group-hover:translate-x-1"></i>
            </span>
          </a>
          <button
            onClick={() => (window as any).openCallbackModal?.()}
            className="relative px-8 py-5 md:py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-2 border-green-400 text-white text-lg md:text-xl font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-green-500/30 group min-h-[64px]"
          >
            {/* Bonus badge */}
            <span className="absolute -top-3 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-lg z-10">
              {t('buttons.freeLabel')}
            </span>
            <i className="fas fa-phone-volume group-hover:animate-bounce"></i>
            <span className="text-center">
              <span className="block">{t('buttons.callBack')}</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
