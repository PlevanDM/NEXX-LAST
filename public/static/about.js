// About Page - NEXX v9.0
const { useState, useEffect } = React;

function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <i className="fas fa-star"></i>
              <span>5+ ani de experiență</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Despre <span className="text-blue-600">NEXX</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Suntem o echipă de profesioniști pasionați de tehnologia Apple.
              Misiunea noastră este să readucem la viață fiecare dispozitiv și să facem reparația accesibilă pentru toată lumea.
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Misiunea noastră</h3>
              <p className="text-gray-600 leading-relaxed">
                Să oferim reparații Apple rapide, de calitate și accesibile,
                folosind cele mai noi tehnologii și componente originale.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-eye text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Viziunea noastră</h3>
              <p className="text-gray-600 leading-relaxed">
                Să devenim cel mai de încredere partener pentru proprietarii de dispozitive Apple din România,
                stabilind noi standarde în calitatea serviciilor.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-heart text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Valorile noastre</h3>
              <p className="text-gray-600 leading-relaxed">
                Integritate, profesionalism, responsabilitate și dorința de a atinge perfecțiunea
                în fiecare detaliu al muncii noastre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              De ce să alegi <span className="text-blue-600">NEXX</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Am creat un sistem unic care face reparația cât mai convenabilă și transparentă posibil.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: 'fa-clock',
                title: 'Rapiditate',
                description: 'Timp mediu de reparație 30-40 minute. Vă prețuim timpul.',
                color: 'blue'
              },
              {
                icon: 'fa-shield-alt',
                title: 'Garanție 30 zile',
                description: 'Oferim garanție oficială pentru toate tipurile de lucrări și piese.',
                color: 'green'
              },
              {
                icon: 'fa-camera',
                title: '100% Monitorizare',
                description: 'Control foto și video al fiecărei etape de reparație a dispozitivului tău.',
                color: 'purple'
              },
              {
                icon: 'fa-users',
                title: 'Echipă profesională',
                description: '10+ tehnicieni certificați cu peste 5 ani de experiență.',
                color: 'blue'
              },
              {
                icon: 'fa-tools',
                title: 'Piese originale',
                description: 'Folosim doar componente originale și analogi testați.',
                color: 'green'
              },
              {
                icon: 'fa-mobile-alt',
                title: 'Suport online',
                description: 'Urmăriți starea reparației în timp real prin serviciul nostru.',
                color: 'purple'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className={`w-14 h-14 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`fas ${item.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 shadow-2xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: '5000+', label: 'Dispozitive reparate', icon: 'fa-check-circle' },
                { number: '10+', label: 'Tehnicieni profesioniști', icon: 'fa-users' },
                { number: '5+', label: 'Ani pe piață', icon: 'fa-trophy' },
                { number: '98%', label: 'Clienți mulțumiți', icon: 'fa-smile' }
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

      {/* Team (Optional - можна розкоментувати якщо буде потрібно) */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Echipa noastră
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Profesioniști care știu totul despre Apple.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-lg">
              <i className="fas fa-info-circle text-blue-600 text-2xl"></i>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Secțiune în dezvoltare</div>
                <div className="text-sm text-gray-600">În curând veți putea face cunoștință cu echipa noastră.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ești gata să ne încredințezi dispozitivul tău?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Sună-ne sau lasă o cerere — suntem gata să te ajutăm!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+40721234567"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <i className="fas fa-phone"></i>
              <span>Sună acum</span>
            </a>
            <a 
              href="/#calculator"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-blue-600"
            >
              <i className="fas fa-calculator"></i>
              <span>Calculator preț</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Render
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(React.createElement(AboutPage));
