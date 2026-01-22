/**
 * NEXX Homepage v10.0 - Unified Design & Romanian Localization
 * Full homepage with Romanian content and Slate Dark theme
 */

const { useState, useEffect, createElement: h } = React;

// ============================================
// SITE CONFIG
// ============================================

const SITE_CONFIG = {
  name: 'NEXX',
  tagline: 'Reparații Profesionale Apple',
  phone: {
    display: '+40 721 234 567',
    tel: '+40721234567',
  },
  email: 'info@nexx.ro',
  address: {
    line1: 'Str. Victoriei 15',
    line2: 'București, România 010001',
  },
  hours: {
    weekdays: '10:00 - 19:00',
    saturday: '11:00 - 17:00',
    sunday: 'Închis',
  },
};

// ============================================
// COMPONENTS FROM DESIGN SYSTEM
// ============================================

const { Button, Card, Badge } = window.NEXXDesign || {};

// Fallback components if Design System fails to load
const SafeButton = Button || (({ children, onClick, className }) => h('button', { onClick, className: `px-6 py-3 bg-blue-600 text-white rounded-lg ${className}` }, children));
const SafeCard = Card || (({ children, className }) => h('div', { className: `bg-white p-6 rounded-xl shadow ${className}` }, children));
const SafeBadge = Badge || (({ children, className }) => h('span', { className: `px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs ${className}` }, children));

// LiveCounter Component
const LiveCounter = () => {
  const [count, setCount] = useState(Math.floor(Math.random() * 6) + 3);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next < 2 ? 2 : next > 12 ? 12 : next;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, []);
  
  return h('div', {
    className: 'inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-md rounded-full border border-slate-700 shadow-lg'
  },
    h('div', { className: 'relative' },
      h('div', { className: 'w-2.5 h-2.5 bg-green-500 rounded-full' }),
      h('div', { className: 'absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping' })
    ),
    h('span', { className: 'text-slate-200 text-sm font-semibold' },
      `${count} ${count === 1 ? 'client' : 'clienți'} online acum`
    )
  );
};

// ============================================
// SECTIONS
// ============================================

const HeroSection = () => {
  return h('section', { className: 'relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-20' },
    // Animated Background
    h('div', { className: 'absolute inset-0 overflow-hidden pointer-events-none' },
      h('div', { className: 'absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse' }),
      h('div', { className: 'absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse', style: { animationDelay: '2s' } }),
      h('div', { className: 'absolute inset-0 opacity-[0.03]', style: { backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' } })
    ),

    h('div', { className: 'relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center' },
        h('div', { className: 'mb-8 flex justify-center' },
            h(LiveCounter)
        ),
        h('h1', { className: 'text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight' },
            'Reparații Profesionale',
            h('span', { className: 'block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent' }, 'Tehnică Apple')
        ),
        h('p', { className: 'text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed' },
            'iPhone • MacBook • iPad • Apple Watch',
            h('br'),
            'Service rapid în 30-60 minute cu piese originale și garanție.'
        ),

        h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center items-center' },
            h(SafeButton, {
                variant: 'accent',
                size: 'xl',
                icon: 'fa-calculator',
                onClick: () => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
            }, 'Calculează prețul'),
            h(SafeButton, {
                variant: 'outline',
                size: 'xl',
                icon: 'fa-phone',
                onClick: () => window.openCallbackModal?.()
            }, 'Sună-mă înapoi')
        ),

        h('div', { className: 'mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto' },
            [
                { label: 'Ani experiență', value: '10+' },
                { label: 'Tehnicieni', value: '15+' },
                { label: 'Reparații', value: '50,000+' },
                { label: 'Garanție', value: '30 zile' }
            ].map(stat => h('div', { key: stat.label, className: 'text-center' },
                h('div', { className: 'text-3xl md:text-4xl font-bold text-white mb-1' }, stat.value),
                h('div', { className: 'text-sm text-slate-500 font-medium uppercase tracking-wider' }, stat.label)
            ))
        )
    )
  );
};

const ServicesSection = () => {
  const services = [
    { icon: 'fa-mobile-screen', name: 'iPhone', desc: 'Ecran, baterie, port încărcare, camere, carcasă.' },
    { icon: 'fa-laptop', name: 'MacBook', desc: 'Tastatură, baterie, curățare, reparații placă de bază.' },
    { icon: 'fa-tablet-screen-button', name: 'iPad', desc: 'Touchscreen, LCD, baterie, conectori.' },
    { icon: 'fa-clock', name: 'Apple Watch', desc: 'Ecran spart, baterie, senzori.' },
    { icon: 'fa-microscope', name: 'Micro-lipire', desc: 'Reparații complexe pe placa de bază sub microscop.' },
    { icon: 'fa-broom', name: 'Curățare', desc: 'Îndepărtare praf și oxidare după contact cu lichide.' }
  ];

  return h('section', { id: 'services', className: 'py-24 bg-slate-900' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'text-center mb-16' },
        h('h2', { className: 'text-4xl md:text-5xl font-bold text-white mb-4' }, 'Serviciile Noastre'),
        h('p', { className: 'text-xl text-slate-400' }, 'Expertiză completă pentru întreg ecosistemul Apple')
      ),
      h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' },
        ...services.map(service =>
          h(SafeCard, { key: service.name, className: 'bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all group' },
            h('div', { className: 'w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all text-blue-500 shadow-inner' },
              h('i', { className: `fa ${service.icon} text-2xl` })
            ),
            h('h3', { className: 'text-2xl font-bold text-white mb-3' }, service.name),
            h('p', { className: 'text-slate-400 leading-relaxed mb-6' }, service.desc),
            h('a', {
                href: '/calculator',
                className: 'inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors'
            }, 'Detalii preț', h('i', { className: 'fa fa-arrow-right text-xs' }))
          )
        )
      )
    )
  );
};

const WhyUsSection = () => {
  const reasons = [
    { icon: 'fa-bolt', title: 'Rapiditate', desc: '60% din reparații se fac pe loc, în fața clientului.' },
    { icon: 'fa-shield-halved', title: 'Garanție Reală', desc: 'Certificat de garanție 30 de zile pentru orice lucrare.' },
    { icon: 'fa-camera', title: 'Transparență', desc: 'Înregistrăm video procesul de reparație la cerere.' },
    { icon: 'fa-location-dot', title: 'Locație Centrală', desc: 'Suntem în inima Bucureștiului, ușor de găsit.' }
  ];

  return h('section', { className: 'py-24 bg-slate-950' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'grid lg:grid-cols-2 gap-16 items-center' },
        h('div', {},
            h('h2', { className: 'text-4xl md:text-5xl font-bold text-white mb-8' }, 'De ce să alegi NEXX?'),
            h('div', { className: 'space-y-8' },
                ...reasons.map(reason => h('div', { key: reason.title, className: 'flex gap-6' },
                    h('div', { className: 'flex-shrink-0 w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500' },
                        h('i', { className: `fa ${reason.icon} text-xl` })
                    ),
                    h('div', {},
                        h('h3', { className: 'text-xl font-bold text-white mb-2' }, reason.title),
                        h('p', { className: 'text-slate-400' }, reason.desc)
                    )
                ))
            )
        ),
        h('div', { className: 'relative' },
            h('div', { className: 'aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-800' },
                h('img', {
                    src: '/static/images/workspace.png',
                    alt: 'Workspace',
                    className: 'w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700'
                })
            ),
            h('div', { className: 'absolute -bottom-6 -left-6 bg-blue-600 p-8 rounded-3xl shadow-xl' },
                h('div', { className: 'text-4xl font-bold text-white mb-1' }, '4.9/5'),
                h('div', { className: 'text-blue-100 text-sm font-medium' }, 'Rating pe Google Maps')
            )
        )
      )
    )
  );
};

const CalculatorSection = () => {
  return h('section', { id: 'calculator', className: 'py-24 bg-slate-900' },
    h('div', { className: 'max-w-7xl mx-auto px-4' },
      h('div', { className: 'text-center mb-12' },
        h('h2', { className: 'text-4xl font-bold text-white mb-4' }, 'Calculator Preț'),
        h('p', { className: 'text-slate-400' }, 'Află costul reparației în 3 pași simpli')
      ),
      // Container for external Calculator component
      h('div', { id: 'price-calculator-root' })
    )
  );
};

const ContactSection = () => {
  return h('section', { id: 'contact', className: 'py-24 bg-slate-950' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        h('div', { className: 'bg-slate-900 rounded-[2.5rem] p-8 md:p-16 border border-slate-800 shadow-2xl relative overflow-hidden' },
            h('div', { className: 'absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl' }),

            h('div', { className: 'grid lg:grid-cols-2 gap-12 relative z-10' },
                h('div', {},
                    h('h2', { className: 'text-4xl font-bold text-white mb-6' }, 'Ești gata pentru reparație?'),
                    h('p', { className: 'text-xl text-slate-400 mb-10' }, 'Contactează-ne acum pentru un diagnostic gratuit sau vizitează service-ul nostru.'),

                    h('div', { className: 'space-y-6' },
                        h('div', { className: 'flex items-center gap-4' },
                            h('div', { className: 'w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-blue-500' }, h('i', { className: 'fa fa-phone' })),
                            h('a', { href: `tel:${SITE_CONFIG.phone.tel}`, className: 'text-2xl font-bold text-white hover:text-blue-400 transition-colors' }, SITE_CONFIG.phone.display)
                        ),
                        h('div', { className: 'flex items-center gap-4' },
                            h('div', { className: 'w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-blue-500' }, h('i', { className: 'fa fa-location-dot' })),
                            h('div', {},
                                h('div', { className: 'text-white font-bold' }, SITE_CONFIG.address.line1),
                                h('div', { className: 'text-slate-500' }, SITE_CONFIG.address.line2)
                            )
                        ),
                        h('div', { className: 'flex items-center gap-4' },
                            h('div', { className: 'w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-blue-500' }, h('i', { className: 'fa fa-clock' })),
                            h('div', {},
                                h('div', { className: 'text-white font-bold' }, `L-V: ${SITE_CONFIG.hours.weekdays}`),
                                h('div', { className: 'text-slate-500' }, `Sâmbătă: ${SITE_CONFIG.hours.saturday}`)
                            )
                        )
                    )
                ),
                h('div', { className: 'bg-slate-800/50 p-8 rounded-3xl border border-slate-700 flex flex-col justify-center text-center' },
                    h('div', { className: 'w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500' },
                        h('i', { className: 'fa fa-paper-plane text-3xl' })
                    ),
                    h('h3', { className: 'text-2xl font-bold text-white mb-4' }, 'Solicită un apel'),
                    h('p', { className: 'text-slate-400 mb-8' }, 'Asistentul nostru te va suna în cel mai scurt timp pentru detalii.'),
                    h(SafeButton, {
                        variant: 'accent',
                        size: 'lg',
                        fullWidth: true,
                        onClick: () => window.openCallbackModal?.()
                    }, 'Sună-mă înapoi')
                )
            )
        )
    )
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

const Homepage = () => {
  useEffect(() => {
    // Mount the calculator if the PriceCalculator component is available
    if (window.PriceCalculator) {
        const calcRoot = ReactDOM.createRoot(document.getElementById('price-calculator-root'));
        calcRoot.render(h(window.PriceCalculator));
    }
  }, []);

  return h('div', { className: 'bg-slate-950 min-h-screen' },
    h(HeroSection),
    h(ServicesSection),
    h(CalculatorSection),
    h(WhyUsSection),
    h(ContactSection)
  );
};

// ============================================
// RENDER
// ============================================

const container = document.getElementById('app');
if (container) {
    ReactDOM.createRoot(container).render(h(Homepage));
}
