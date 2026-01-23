// About Page - NEXX v10.0
const { useState, useEffect } = React;

function AboutPage() {
  const t = (key) => window.i18n?.t(key) || key;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <i className="fas fa-star"></i>
              <span>{t('aboutPage.subtitle')}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('aboutPage.title').split(' ')[0]} <span className="text-blue-600">{t('aboutPage.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('aboutPage.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-bullseye text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('aboutPage.mission')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('aboutPage.missionDesc')}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-eye text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('aboutPage.vision')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('aboutPage.visionDesc')}
              </p>
            </div>

            {/* Values */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-heart text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('aboutPage.values')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('aboutPage.valuesDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 shadow-2xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: '5000+', label: t('aboutPage.stats.devices'), icon: 'fa-check-circle' },
                { number: '10+', label: t('aboutPage.stats.masters'), icon: 'fa-users' },
                { number: '10+', label: t('aboutPage.stats.years'), icon: 'fa-trophy' },
                { number: '98%', label: t('aboutPage.stats.satisfied'), icon: 'fa-smile' }
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 group-hover:bg-white/20 transition-colors duration-300">
                    <i className={`fas ${stat.icon} text-2xl text-white`}></i>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+40721234567"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <i className="fas fa-phone"></i>
              <span>{t('buttons.call')}</span>
            </a>
            <a 
              href="/#calculator"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-blue-600"
            >
              <i className="fas fa-calculator"></i>
              <span>{t('buttons.calculate')}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Render
const container = document.getElementById('app');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(AboutPage));
}
