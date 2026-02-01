/**
 * NEXX Directions Page - "Cum să Ajungi"
 * Interactive guide to reach NEXX GSM Service Center
 * SEO optimized for Sector 4, București
 */

const { useState, useEffect } = React;
const h = React.createElement;

// ============================================
// SITE CONFIG
// ============================================

const LOCATION = {
  name: 'NEXX GSM Service Center',
  address: 'Calea Șerban Vodă 47',
  sector: 'Sector 4',
  city: 'București',
  postalCode: '040215',
  country: 'România',
  lat: 44.42146803174267,
  lng: 26.102888425255543,
  phone: '',  // TODO: Add real phone number
  phoneTel: '',  // TODO: Add real phone number
  telegram: 'https://t.me/nexx_support',
  hours: {
    weekdays: '10:00 - 19:00',
    saturday: '11:00 - 17:00',
    sunday: 'Închis',
  },
};

// ============================================
// TRANSPORT OPTIONS DATA
// ============================================

const TRANSPORT_OPTIONS = [
  {
    id: 'metro',
    icon: 'fa-train-subway',
    name: 'Metrou M2',
    subtitle: 'Cea mai rapidă opțiune',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-700',
    badge: 'Recomandat',
    badgeColor: 'green',
    time: '15-25 min',
    price: '3-4 RON',
    frequency: 'La fiecare 5-10 min',
    schedule: '05:00 - 23:30',
    stations: ['Piața Unirii (3 min pe jos)', 'Eroii Revoluției (3 min pe jos)'],
    advantages: ['Nu depinde de trafic', 'Rapid și punctual', 'Acces central'],
    directions: [
      'Intrați în cea mai apropiată stație de metrou',
      'Luați linia M2 spre Piața Unirii sau Eroii Revoluției',
      'Coborâți și urmăriți semnele spre Calea Șerban Vodă',
      'Mergeți 3 minute pe jos până la numărul 47',
    ],
  },
  {
    id: 'bus',
    icon: 'fa-bus',
    name: 'Autobuz 116',
    subtitle: 'Traseu direct pe Calea Șerban Vodă',
    color: 'green',
    gradient: 'from-green-500 to-green-700',
    time: '20-30 min',
    price: '1.30 RON',
    frequency: 'La fiecare 8-10 min',
    schedule: '05:00 - 04:40 (24/7)',
    stations: ['Piața Sf. Vineri', 'Bd. Dimitrie Cantemir', 'Calea Șerban Vodă', 'Piața Eroii Revoluției'],
    advantages: ['Circulă 24/7', 'Tarif accesibil', 'Oprește în fața service-ului'],
    directions: [
      'Găsiți cea mai apropiată stație a liniei 116',
      'Urcați în direcția Gara Progresul',
      'Coborâți la stația Calea Șerban Vodă',
      'NEXX GSM este la 50m de stație',
    ],
  },
  {
    id: 'tram',
    icon: 'fa-train-tram',
    name: 'Tramvai 19',
    subtitle: 'Conectează Vitan cu Zețarilor',
    color: 'orange',
    gradient: 'from-orange-500 to-orange-700',
    time: '18-25 min',
    price: '1.30 RON',
    frequency: 'La fiecare 8-12 min',
    schedule: '05:12 - 04:58',
    stations: ['Piața Vitan', 'Adesgo (lângă noi)', 'Piața Eroii Revoluției'],
    advantages: ['Traseu scenic', 'Stație apropiată', 'Frecvență bună'],
    directions: [
      'Urcați în tramvaiul 19 din direcția dorită',
      'Coborâți la stația Adesgo',
      'Mergeți 2 minute spre Calea Șerban Vodă 47',
    ],
  },
  {
    id: 'car',
    icon: 'fa-car',
    name: 'Mașină / Taxi / Uber',
    subtitle: 'Flexibilitate maximă',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-700',
    time: '5-15 min',
    price: '5-25 RON',
    frequency: 'Oricând',
    schedule: '24/7',
    parking: 'Parcare pe stradă: 0.50-1.00 RON/oră',
    advantages: ['Convenabil', 'Ușă-în-ușă', 'Parcare disponibilă'],
    directions: [
      'Introduceți adresa în GPS: Calea Șerban Vodă 47',
      'Urmați indicațiile spre Sector 4',
      'Parcați pe stradă sau în parcarea subterană U-Center 2',
    ],
  },
];

// ============================================
// SHARED COMPONENTS
// ============================================

const Badge = ({ children, variant = 'success', size = 'md' }) => {
  const variants = {
    success: 'bg-green-100 text-green-700 border-green-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
  };
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm', lg: 'px-4 py-1.5 text-base' };
  
  return h('span', {
    className: `inline-flex items-center justify-center font-medium rounded-full border ${variants[variant]} ${sizes[size]}`
  }, children);
};

const Card = ({ children, hover, className = '', onClick }) => {
  return h('div', {
    onClick,
    className: `bg-white rounded-2xl p-6 shadow-lg ${hover ? 'hover:shadow-2xl hover:scale-[1.02] cursor-pointer' : ''} transition-all duration-300 ${className}`
  }, children);
};

const Button = ({ children, variant = 'primary', size = 'md', icon, onClick, className = '', fullWidth }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl',
    outline: 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600',
  };
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };
  
  return h('button', {
    onClick,
    className: `inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`
  },
    icon && h('i', { className: `fa ${icon}` }),
    children
  );
};

// ============================================
// HERO SECTION
// ============================================

const HeroSection = () => {
  return h('section', { className: 'relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' },
    // Background decorations
    h('div', { className: 'absolute inset-0' },
      h('div', { className: 'absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse' }),
      h('div', { className: 'absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse', style: { animationDelay: '1s' } }),
      // Grid pattern
      h('div', { className: 'absolute inset-0 opacity-10', style: { 
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
        backgroundSize: '50px 50px' 
      } })
    ),
    
    h('div', { className: 'relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16' },
      h('div', { className: 'grid lg:grid-cols-2 gap-12 items-center' },
        // Left side - Text content
        h('div', { className: 'text-center lg:text-left' },
          h('div', { className: 'inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-400/30 mb-6' },
            h('div', { className: 'relative' },
              h('div', { className: 'w-2 h-2 bg-green-400 rounded-full' }),
              h('div', { className: 'absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping' })
            ),
            h('span', { className: 'text-green-300 text-sm font-medium' }, 'Locație centrală în București')
          ),
          
          h('h1', { className: 'text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight' },
            'Cum să Ajungi',
            h('span', { className: 'block bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent' }, 'la NEXX GSM')
          ),
          
          h('p', { className: 'text-xl text-blue-100 mb-8 leading-relaxed' },
            h('i', { className: 'fa fa-location-dot mr-2' }),
            LOCATION.address, ', ',
            h('span', { className: 'font-semibold' }, LOCATION.sector),
            h('br'),
            'Aproape de Piața Unirii și metrou'
          ),
          
          // Quick stats
          h('div', { className: 'grid grid-cols-3 gap-4 mb-8' },
            h('div', { className: 'bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10' },
              h('div', { className: 'text-3xl font-bold text-green-400 mb-1' }, '3 min'),
              h('div', { className: 'text-sm text-blue-200' }, 'de la metrou')
            ),
            h('div', { className: 'bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10' },
              h('div', { className: 'text-3xl font-bold text-blue-400 mb-1' }, '5+'),
              h('div', { className: 'text-sm text-blue-200' }, 'linii de transport')
            ),
            h('div', { className: 'bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10' },
              h('div', { className: 'text-3xl font-bold text-purple-400 mb-1' }, '24/7'),
              h('div', { className: 'text-sm text-blue-200' }, 'acces bus')
            )
          ),
          
          // CTA buttons
          h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center lg:justify-start' },
            h(Button, { 
              variant: 'secondary', 
              size: 'lg', 
              icon: 'fa-map-location-dot',
              onClick: () => window.open(`https://maps.google.com/?q=${LOCATION.lat},${LOCATION.lng}`, '_blank')
            }, 'Deschide Google Maps'),
            h(Button, { 
              variant: 'outline', 
              size: 'lg', 
              icon: 'fa-brands fa-telegram',
              className: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
              onClick: () => window.open(LOCATION.telegram, '_blank')
            }, 'Scrie pe Telegram')
          )
        ),
        
        // Right side - Map preview
        h('div', { className: 'hidden lg:block relative' },
          h('div', { className: 'relative' },
            // Map container
            h('div', { className: 'relative w-full aspect-square max-w-md mx-auto' },
              // Decorative ring
              h('div', { className: 'absolute inset-0 rounded-full border-2 border-dashed border-blue-400/30 animate-spin', style: { animationDuration: '30s' } }),
              
              // Main map card
              h('div', { className: 'absolute inset-8 bg-white rounded-3xl shadow-2xl overflow-hidden' },
                h('iframe', {
                  src: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2849.5!2d${LOCATION.lng}!3d${LOCATION.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDI1JzE3LjMiTiAyNsKwMDYnMTAuNCJF!5e0!3m2!1sro!2sro!4v1609459200000!5m2!1sro!2sro`,
                  className: 'w-full h-full border-0',
                  allowFullScreen: true,
                  loading: 'lazy',
                  referrerPolicy: 'no-referrer-when-downgrade'
                })
              ),
              
              // Floating badges
              h('div', { className: 'absolute -top-2 -right-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 animate-bounce', style: { animationDuration: '2s' } },
                h('i', { className: 'fa fa-train-subway' }),
                '3 min metrou'
              ),
              
              h('div', { className: 'absolute -bottom-2 -left-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2' },
                h('i', { className: 'fa fa-location-dot' }),
                'Sector 4'
              )
            )
          )
        )
      )
    ),
    
    // Scroll indicator
    h('div', { className: 'absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce' },
      h('i', { className: 'fa fa-chevron-down text-2xl' })
    )
  );
};

// ============================================
// TRANSPORT OPTIONS SECTION
// ============================================

const TransportCard = ({ option, isExpanded, onToggle }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', hover: 'hover:border-blue-400' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', hover: 'hover:border-green-400' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', hover: 'hover:border-orange-400' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', hover: 'hover:border-purple-400' },
  };
  
  const colors = colorClasses[option.color];
  
  return h('div', { 
    className: `bg-white rounded-2xl border-2 ${isExpanded ? colors.border : 'border-slate-100'} ${colors.hover} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`
  },
    // Header (always visible)
    h('div', { 
      className: 'p-6 cursor-pointer',
      onClick: onToggle
    },
      h('div', { className: 'flex items-start gap-4' },
        // Icon
        h('div', { className: `w-16 h-16 bg-gradient-to-br ${option.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg` },
          h('i', { className: `fa ${option.icon} text-2xl text-white` })
        ),
        
        // Content
        h('div', { className: 'flex-1 min-w-0' },
          h('div', { className: 'flex items-center gap-3 flex-wrap mb-1' },
            h('h3', { className: 'text-xl font-bold text-slate-900' }, option.name),
            option.badge && h(Badge, { variant: option.badgeColor || 'success', size: 'sm' }, 
              h('i', { className: 'fa fa-star mr-1' }), option.badge
            )
          ),
          h('p', { className: 'text-slate-500 text-sm mb-3' }, option.subtitle),
          
          // Quick info pills
          h('div', { className: 'flex flex-wrap gap-2' },
            h('span', { className: `inline-flex items-center gap-1.5 px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm font-medium` },
              h('i', { className: 'fa fa-clock' }), option.time
            ),
            h('span', { className: 'inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium' },
              h('i', { className: 'fa fa-coins' }), option.price
            ),
            h('span', { className: 'inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hidden sm:inline-flex' },
              h('i', { className: 'fa fa-repeat' }), option.frequency
            )
          )
        ),
        
        // Expand arrow
        h('div', { className: `w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}` },
          h('i', { className: `fa fa-chevron-down ${colors.text}` })
        )
      )
    ),
    
    // Expanded content
    isExpanded && h('div', { className: `px-6 pb-6 border-t ${colors.border}` },
      h('div', { className: 'grid md:grid-cols-2 gap-6 pt-6' },
        // Left column - Info
        h('div', { className: 'space-y-4' },
          // Schedule
          h('div', {},
            h('h4', { className: 'font-semibold text-slate-900 mb-2 flex items-center gap-2' },
              h('i', { className: `fa fa-calendar ${colors.text}` }), 'Program'
            ),
            h('p', { className: 'text-slate-600' }, option.schedule)
          ),
          
          // Stations
          option.stations && h('div', {},
            h('h4', { className: 'font-semibold text-slate-900 mb-2 flex items-center gap-2' },
              h('i', { className: `fa fa-map-pin ${colors.text}` }), 'Stații principale'
            ),
            h('ul', { className: 'space-y-1' },
              ...option.stations.map((station, i) =>
                h('li', { key: i, className: 'text-slate-600 flex items-center gap-2' },
                  h('div', { className: `w-2 h-2 ${colors.bg} rounded-full border ${colors.border}` }),
                  station
                )
              )
            )
          ),
          
          // Parking (for car option)
          option.parking && h('div', { className: `p-3 ${colors.bg} rounded-xl border ${colors.border}` },
            h('div', { className: 'flex items-center gap-2' },
              h('i', { className: `fa fa-square-parking ${colors.text}` }),
              h('span', { className: 'text-slate-700 text-sm' }, option.parking)
            )
          ),
          
          // Advantages
          h('div', {},
            h('h4', { className: 'font-semibold text-slate-900 mb-2 flex items-center gap-2' },
              h('i', { className: `fa fa-check-circle ${colors.text}` }), 'Avantaje'
            ),
            h('div', { className: 'flex flex-wrap gap-2' },
              ...option.advantages.map((adv, i) =>
                h('span', { key: i, className: 'inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium' },
                  h('i', { className: 'fa fa-check text-[10px]' }), adv
                )
              )
            )
          )
        ),
        
        // Right column - Directions
        h('div', { className: `p-4 ${colors.bg} rounded-xl border ${colors.border}` },
          h('h4', { className: 'font-semibold text-slate-900 mb-3 flex items-center gap-2' },
            h('i', { className: `fa fa-route ${colors.text}` }), 'Indicații pas cu pas'
          ),
          h('ol', { className: 'space-y-3' },
            ...option.directions.map((step, i) =>
              h('li', { key: i, className: 'flex gap-3' },
                h('div', { className: `w-6 h-6 bg-gradient-to-br ${option.gradient} rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold` }, i + 1),
                h('p', { className: 'text-slate-700 text-sm leading-relaxed pt-0.5' }, step)
              )
            )
          )
        )
      )
    )
  );
};

const TransportSection = () => {
  const [expandedId, setExpandedId] = useState('metro');
  
  return h('section', { className: 'py-20 bg-gradient-to-b from-slate-50 to-white' },
    h('div', { className: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8' },
      // Section header
      h('div', { className: 'text-center mb-12' },
        h('h2', { className: 'text-4xl md:text-5xl font-bold text-slate-900 mb-4' },
          'Opțiuni de Transport'
        ),
        h('p', { className: 'text-xl text-slate-600 max-w-2xl mx-auto' },
          'Alege varianta cea mai convenabilă pentru tine'
        )
      ),
      
      // Transport cards
      h('div', { className: 'space-y-4' },
        ...TRANSPORT_OPTIONS.map(option =>
          h(TransportCard, {
            key: option.id,
            option,
            isExpanded: expandedId === option.id,
            onToggle: () => setExpandedId(expandedId === option.id ? null : option.id)
          })
        )
      )
    )
  );
};


// ============================================
// LANDMARKS SECTION
// ============================================

const LandmarksSection = () => {
  const landmarks = [
    { icon: 'fa-landmark', name: 'Piața Unirii', distance: '1.5 km', time: '3 min cu metroul' },
    { icon: 'fa-monument', name: 'Eroii Revoluției', distance: '500 m', time: '3 min pe jos' },
    { icon: 'fa-building-columns', name: 'Centrul Vechi', distance: '2 km', time: '8 min cu mașina' },
    { icon: 'fa-church', name: 'Catedrala Patriarhală', distance: '1.2 km', time: '15 min pe jos' },
  ];
  
  return h('section', { className: 'py-20 bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 text-white' },
    h('div', { className: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'text-center mb-12' },
        h('h2', { className: 'text-4xl md:text-5xl font-bold mb-4' },
          'Repere în Apropiere'
        ),
        h('p', { className: 'text-xl text-blue-200' },
          'Locație excelentă în inima Bucureștiului'
        )
      ),
      
      h('div', { className: 'grid sm:grid-cols-2 lg:grid-cols-4 gap-6' },
        ...landmarks.map(landmark =>
          h('div', { 
            key: landmark.name,
            className: 'bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all text-center'
          },
            h('div', { className: 'w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4' },
              h('i', { className: `fa ${landmark.icon} text-2xl text-white` })
            ),
            h('h3', { className: 'font-bold text-lg mb-2' }, landmark.name),
            h('p', { className: 'text-blue-200 text-sm mb-1' }, landmark.distance),
            h('p', { className: 'text-green-300 text-sm font-medium' }, landmark.time)
          )
        )
      )
    )
  );
};

// ============================================
// PARKING SECTION
// ============================================

const ParkingSection = () => {
  return h('section', { className: 'py-20 bg-white' },
    h('div', { className: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'grid lg:grid-cols-2 gap-12 items-center' },
        // Left - Info
        h('div', {},
          h('div', { className: 'inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6' },
            h('i', { className: 'fa fa-square-parking text-purple-600' }),
            h('span', { className: 'text-purple-700 font-medium text-sm' }, 'Parcare convenabilă')
          ),
          
          h('h2', { className: 'text-4xl font-bold text-slate-900 mb-4' },
            'Vii cu Mașina?'
          ),
          h('p', { className: 'text-lg text-slate-600 mb-8' },
            'Ai mai multe opțiuni de parcare în apropiere'
          ),
          
          h('div', { className: 'space-y-4' },
            h(Card, { className: '!p-4 border border-slate-200' },
              h('div', { className: 'flex items-center gap-4' },
                h('div', { className: 'w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center' },
                  h('i', { className: 'fa fa-road text-blue-600 text-xl' })
                ),
                h('div', {},
                  h('h3', { className: 'font-semibold text-slate-900' }, 'Parcare pe stradă'),
                  h('p', { className: 'text-sm text-slate-500' }, 'Calea Șerban Vodă - 0.50-1.00 RON/oră')
                )
              )
            ),
            h(Card, { className: '!p-4 border border-slate-200' },
              h('div', { className: 'flex items-center gap-4' },
                h('div', { className: 'w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center' },
                  h('i', { className: 'fa fa-warehouse text-green-600 text-xl' })
                ),
                h('div', {},
                  h('h3', { className: 'font-semibold text-slate-900' }, 'U-Center 2 (subterană)'),
                  h('p', { className: 'text-sm text-slate-500' }, 'Calea Șerban Vodă 4 - la 200m de noi')
                )
              )
            ),
            h(Card, { className: '!p-4 border border-slate-200' },
              h('div', { className: 'flex items-center gap-4' },
                h('div', { className: 'w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center' },
                  h('i', { className: 'fa fa-hand-holding-dollar text-orange-600 text-xl' })
                ),
                h('div', {},
                  h('h3', { className: 'font-semibold text-slate-900' }, 'Taxi / Uber / Bolt'),
                  h('p', { className: 'text-sm text-slate-500' }, 'Oprire directă în fața service-ului')
                )
              )
            )
          )
        ),
        
        // Right - Visual
        h('div', { className: 'relative' },
          h('div', { className: 'aspect-square max-w-md mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-8 flex items-center justify-center' },
            h('div', { className: 'text-center' },
              h('div', { className: 'w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6' },
                h('i', { className: 'fa fa-car text-5xl text-purple-600' })
              ),
              h('h3', { className: 'text-2xl font-bold text-slate-900 mb-2' }, 'Acces ușor'),
              h('p', { className: 'text-slate-600' }, 'Parcare disponibilă non-stop'),
              
              h('div', { className: 'mt-6 flex justify-center gap-4' },
                h('div', { className: 'flex items-center gap-2 text-sm text-slate-600' },
                  h('i', { className: 'fa fa-car-side text-blue-500' }),
                  'Mașină personală'
                ),
                h('div', { className: 'flex items-center gap-2 text-sm text-slate-600' },
                  h('i', { className: 'fa fa-taxi text-yellow-500' }),
                  'Taxi / Ride-share'
                )
              )
            )
          ),
          
          // Floating element
          h('div', { className: 'absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm' },
            h('i', { className: 'fa fa-check mr-2' }), 'Locuri disponibile'
          )
        )
      )
    )
  );
};

// ============================================
// FAQ SECTION
// ============================================

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  
  const faqs = [
    {
      q: 'Care este cea mai rapidă cale să ajung la NEXX GSM?',
      a: 'Cea mai rapidă și sigură opțiune este metroul M2. Coborâți la stația Piața Unirii sau Eroii Revoluției și mergeți 3 minute pe jos. Nu depindeți de trafic!',
    },
    {
      q: 'Ce linii de transport public trec pe lângă service?',
      a: 'Metroul M2 (Piața Unirii, Eroii Revoluției), autobuzul 116 care circulă 24/7, tramvaiul 19, și autobuzele 232, 141, 312. De asemenea, autobuzele de noapte N101-N119.',
    },
    {
      q: 'Este parcare disponibilă în zonă?',
      a: 'Da! Aveți parcare pe stradă pe Calea Șerban Vodă (0.50-1.00 RON/oră) și parcare subterană în U-Center 2 la doar 200m distanță.',
    },
    {
      q: 'Cât costă un taxi de la Gara de Nord?',
      a: 'Un taxi sau Uber/Bolt de la Gara de Nord costă între 18-25 RON și durează aproximativ 12-18 minute în funcție de trafic.',
    },
    {
      q: 'Cum ajung de la aeroport?',
      a: 'De la Aeroportul Henri Coandă (OTP) puteți lua un taxi/Uber (35-55 RON, 25-40 min) sau autobuzul express 783 până la Piața Unirii, apoi metrou M2 sau pe jos.',
    },
    {
      q: 'Care este programul de lucru?',
      a: `Suntem deschiși: Luni-Vineri ${LOCATION.hours.weekdays}, Sâmbătă ${LOCATION.hours.saturday}. Duminica suntem închiși.`,
    },
  ];
  
  return h('section', { className: 'py-20 bg-slate-50' },
    h('div', { className: 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'text-center mb-12' },
        h('h2', { className: 'text-4xl md:text-5xl font-bold text-slate-900 mb-4' },
          'Întrebări Frecvente'
        ),
        h('p', { className: 'text-xl text-slate-600' },
          'Despre cum să ajungi la noi'
        )
      ),
      
      h('div', { className: 'space-y-4' },
        ...faqs.map((faq, i) =>
          h('div', { 
            key: i,
            className: `bg-white rounded-xl border ${openIndex === i ? 'border-blue-200 shadow-lg' : 'border-slate-200'} overflow-hidden transition-all`
          },
            h('button', {
              className: 'w-full px-6 py-4 text-left flex items-center justify-between gap-4',
              onClick: () => setOpenIndex(openIndex === i ? -1 : i)
            },
              h('span', { className: 'font-semibold text-slate-900' }, faq.q),
              h('i', { className: `fa fa-chevron-down text-slate-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}` })
            ),
            openIndex === i && h('div', { className: 'px-6 pb-4' },
              h('p', { className: 'text-slate-600 leading-relaxed' }, faq.a)
            )
          )
        )
      )
    )
  );
};

// ============================================
// CTA SECTION
// ============================================

const CTASection = () => {
  return h('section', { className: 'py-20 bg-gradient-to-r from-blue-600 to-blue-700' },
    h('div', { className: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center' },
      h('h2', { className: 'text-3xl md:text-4xl font-bold text-white mb-4' },
        'Gata să ne Vizitezi?'
      ),
      h('p', { className: 'text-xl text-blue-100 mb-8' },
        'Te așteptăm la ', LOCATION.address, ', ', LOCATION.sector
      ),
      
      h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center' },
        h(Button, {
          variant: 'secondary',
          size: 'lg',
          icon: 'fa-map-location-dot',
          onClick: () => window.open(`https://maps.google.com/?q=${LOCATION.lat},${LOCATION.lng}`, '_blank')
        }, 'Deschide în Google Maps'),
        h(Button, {
          variant: 'outline',
          size: 'lg',
          icon: 'fa-brands fa-telegram',
          className: 'bg-white/10 border-white/30 text-white hover:bg-white/20',
          onClick: () => window.open(LOCATION.telegram, '_blank')
        }, 'Telegram'),
        h(Button, {
          variant: 'outline',
          size: 'lg',
          icon: 'fa-directions',
          className: 'bg-white/10 border-white/30 text-white hover:bg-white/20',
          onClick: () => window.open(`https://waze.com/ul?ll=${LOCATION.lat},${LOCATION.lng}&navigate=yes`, '_blank')
        }, 'Deschide în Waze')
      ),
      
      // Address card
      h('div', { className: 'mt-12 inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20' },
        h('div', { className: 'flex items-center gap-6 flex-wrap justify-center' },
          h('div', { className: 'flex items-center gap-3' },
            h('i', { className: 'fa fa-location-dot text-white text-xl' }),
            h('div', { className: 'text-left' },
              h('p', { className: 'text-white font-semibold' }, LOCATION.address),
              h('p', { className: 'text-blue-200 text-sm' }, `${LOCATION.sector}, ${LOCATION.city} ${LOCATION.postalCode}`)
            )
          ),
          h('div', { className: 'w-px h-10 bg-white/20 hidden sm:block' }),
          h('div', { className: 'flex items-center gap-3' },
            h('i', { className: 'fa fa-clock text-white text-xl' }),
            h('div', { className: 'text-left' },
              h('p', { className: 'text-white font-semibold' }, 'Program'),
              h('p', { className: 'text-blue-200 text-sm' }, `L-V: ${LOCATION.hours.weekdays}`)
            )
          )
        )
      )
    )
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

const DirectionsPage = () => {
  return h('div', { className: 'min-h-screen bg-white' },
    h(HeroSection),
    h(TransportSection),
    h(LandmarksSection),
    h(ParkingSection),
    h(FAQSection),
    h(CTASection)
  );
};

// ============================================
// RENDER
// ============================================

ReactDOM.createRoot(document.getElementById('app')).render(h(DirectionsPage));
