/**
 * NEXX Homepage v9.0 - Complete
 * Full homepage with all React sections
 */

// h is already defined in shared-components.js
const { useState, useEffect } = React;

// ============================================
// SITE CONFIG
// ============================================

const SITE_CONFIG = {
  name: 'NEXX',
  tagline: 'Service Profesional Reparații',
  phone: {
    display: '0XXX XXX XXX',  // TODO: Add real phone number
    tel: '',  // TODO: Add real phone number
  },
  email: 'info@nexxgsm.ro',
  whatsapp: '',  // TODO: Add real WhatsApp number
  address: {
    line1: 'Calea Șerban Vodă 47',
    line2: 'Sector 4, București 040215',
  },
  hours: {
    weekdays: '10:00 - 19:00',
    saturday: '11:00 - 17:00',
    sunday: 'Închis',
  },
  social: {
    telegram: 'https://t.me/nexx_support',
    instagram: 'https://instagram.com/nexx_service',
    facebook: 'https://facebook.com/nexx.service.center',
    whatsapp: '#',  // TODO: Add real WhatsApp link
  },
  services: [
    { icon: 'fa-mobile-screen', name: 'Ремонт Телефонів', desc: 'iPhone та Android' },
    { icon: 'fa-microscope', name: 'Діагностика', desc: 'Безкоштовно — знаходимо причину' },
    { icon: 'fa-broom', name: 'Професійна Чистка', desc: 'Після залиття' },
    { icon: 'fa-wand-magic-sparkles', name: 'Кастомізація', desc: 'Унікальний дизайн' },
    { icon: 'fa-arrows-rotate', name: 'Trade-In', desc: 'Обмін пристроїв' },
    { icon: 'fa-bag-shopping', name: 'Аксесуари', desc: 'Оригінальні' },
    { icon: 'fa-laptop', name: 'Ремонт Ноутбуків', desc: 'MacBook та інші' },
  ],
};

// ============================================
// SHARED COMPONENTS
// ============================================

const Button = ({ children, variant = 'primary', size = 'md', icon, onClick, disabled, className = '', fullWidth }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl',
    outline: 'bg-white/10 border-2 border-white/30 text-white hover:bg-white/20',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };
  
  return h('button', {
    onClick, disabled,
    className: `inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`
  },
    icon && h('i', { className: `fa ${icon}` }),
    children
  );
};

const Badge = ({ children, variant = 'success', size = 'lg' }) => {
  const variants = {
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700',
    warning: 'bg-yellow-100 text-yellow-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm', lg: 'px-4 py-1.5 text-base' };
  
  return h('span', {
    className: `inline-flex items-center justify-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`
  }, children);
};

const Card = ({ children, hover, className = '' }) => {
  return h('div', {
    className: `bg-white rounded-xl p-6 ${hover ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : 'shadow-lg'} transition-all ${className}`
  }, children);
};

// LiveCounter Component
const LiveCounter = () => {
  const [count, setCount] = useState(Math.floor(Math.random() * 6) + 2);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(Math.floor(Math.random() * 6) + 2);
    }, 15000);
    return () => clearInterval(timer);
  }, []);
  
  return h('div', {
    className: 'inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20'
  },
    h('div', { className: 'relative' },
      h('div', { className: 'w-2 h-2 bg-green-500 rounded-full' }),
      h('div', { className: 'absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping' })
    ),
    h('span', { className: 'text-white text-sm font-medium' },
      `${count} ${count === 1 ? 'клієнт' : count < 5 ? 'клієнти' : 'клієнтів'} зараз на сайті`
    )
  );
};

// ============================================
// HEADER COMPONENT
// ============================================

// const Header = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [mastersMenuOpen, setMastersMenuOpen] = useState(false);
//   
//   const navItems = [
//     { label: 'Головна', href: '/' },
//     { label: 'Послуги', href: '/#services' },
//     { label: 'Калькулятор', href: '/calculator' },
//     { label: 'Курси', href: '/#courses' },
//     { label: 'FAQ', href: '/faq' },
//     { label: 'Контакти', href: '/#contact' },
//   ];
//   
//   const mastersItems = [
//     { label: 'NEXX Database', href: '/nexx', icon: 'fa-database', protected: true },
//     { label: 'База знань', href: '/nexx#knowledge', icon: 'fa-book' },
//     { label: 'Прайс-лист', href: '/nexx#prices', icon: 'fa-money-bill' },
//     { label: 'Інструменти', href: '/nexx#tools', icon: 'fa-toolbox' },
//   ];
//   
//   return h('header', { className: 'sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md' },
//     h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
//       h('div', { className: 'flex items-center justify-between h-16' },
//         h('div', { className: 'flex items-center' },
//           h('a', { href: '/', className: 'flex items-center gap-3' },
//             h('div', { className: 'w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center' },
//               h('i', { className: 'fa fa-mobile-screen text-white text-xl' })
//             ),
//             h('div', { className: 'hidden sm:block' },
//               h('div', { className: 'text-xl font-bold text-slate-900' }, SITE_CONFIG.name),
//               h('div', { className: 'text-xs text-slate-600' }, SITE_CONFIG.tagline)
//             )
//           )
//         ),
//         h('nav', { className: 'hidden lg:flex items-center gap-6' },
//           ...navItems.map(item =>
//             h('a', { key: item.href, href: item.href, className: 'text-sm font-medium transition-colors hover:text-blue-600 text-slate-700' }, item.label)
//           ),
//           h('div', { className: 'relative' },
//             h('button', {
//               onClick: () => setMastersMenuOpen(!mastersMenuOpen),
//               className: 'text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1'
//             },
//               'Для майстрів',
//               h('i', { className: `fa fa-chevron-down text-xs transition-transform ${mastersMenuOpen ? 'rotate-180' : ''}` })
//             ),
//             mastersMenuOpen && h('div', { className: 'absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2' },
//               ...mastersItems.map(item =>
//                 h('a', { key: item.href, href: item.href, className: 'block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors', onClick: () => setMastersMenuOpen(false) },
//                   h('i', { className: `fa ${item.icon} w-5` }),
//                   h('span', { className: 'ml-2' }, item.label),
//                   item.protected && h('i', { className: 'fa fa-lock text-xs ml-2 text-slate-400' })
//                 )
//               )
//             )
//           )
//         ),
//         h('div', { className: 'hidden lg:block' },
//           h(Button, { variant: 'primary', icon: 'fa-phone', onClick: () => window.location.href = `tel:${SITE_CONFIG.phone.tel}` }, 'Зателефонувати')
//         ),
//         h('button', { className: 'lg:hidden p-2', onClick: () => setMobileMenuOpen(!mobileMenuOpen) },
//           h('i', { className: `fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl` })
//         )
//       ),
//       mobileMenuOpen && h('div', { className: 'lg:hidden border-t border-slate-200 py-4' },
//         h('nav', { className: 'flex flex-col gap-2' },
//           ...navItems.map(item =>
//             h('a', { key: item.href, href: item.href, className: 'px-4 py-2 text-sm font-medium rounded-lg transition-colors text-slate-700 hover:bg-slate-50', onClick: () => setMobileMenuOpen(false) }, item.label)
//           ),
//           h('div', { className: 'border-t border-slate-200 my-2' }),
//           h('div', { className: 'px-4 py-1 text-xs font-semibold text-slate-500 uppercase' }, 'Для майстрів'),
//           ...mastersItems.map(item =>
//             h('a', { key: item.href, href: item.href, className: 'px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors', onClick: () => setMobileMenuOpen(false) },
//               h('i', { className: `fa ${item.icon} w-5` }),
//               h('span', { className: 'ml-2' }, item.label),
//               item.protected && h('i', { className: 'fa fa-lock text-xs ml-2 text-slate-400' })
//             )
//           ),
//           h('div', { className: 'border-t border-slate-200 my-2' }),
//           h('div', { className: 'px-4' },
//             h(Button, { variant: 'primary', icon: 'fa-phone', onClick: () => window.location.href = `tel:${SITE_CONFIG.phone.tel}`, fullWidth: true }, 'Зателефонувати')
//           )
//         )
//       )
//     )
//   );
// };

// ============================================
// HERO SECTION
// ============================================

const HeroSection = () => {
  return h('section', { className: 'relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900' },
    h('div', { className: 'absolute inset-0' },
      h('div', { className: 'absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse' }),
      h('div', { className: 'absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse', style: { animationDelay: '1s' } }),
      h('div', { className: 'absolute inset-0', style: { backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '4rem 4rem' } })
    ),
    h('div', { className: 'relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20' },
      h('div', { className: 'grid lg:grid-cols-2 gap-12 items-center' },
        h('div', { className: 'text-center lg:text-left' },
          h('div', { className: 'mb-6 flex justify-center lg:justify-start' },
            h(LiveCounter)
          ),
          h('h1', { className: 'text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight' },
            'Професійний ремонт',
            h('span', { className: 'block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent' }, 'Apple техніки')
          ),
          h('p', { className: 'text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed' },
            'iPhone, iPad, MacBook, Apple Watch.',
            h('br'),
            'Швидко, якісно, з гарантією.'
          ),
          h('div', { className: 'flex flex-wrap gap-3 mb-8 justify-center lg:justify-start' },
            h(Badge, { variant: 'success' }, h('i', { className: 'fa fa-clock mr-1' }), '30-40 хв ремонт'),
            h(Badge, { variant: 'info' }, h('i', { className: 'fa fa-shield mr-1' }), '30 днів гарантії'),
            h(Badge, { variant: 'warning' }, h('i', { className: 'fa fa-camera mr-1' }), '100% фіксація стану')
          ),
          h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center lg:justify-start' },
            h(Button, { variant: 'primary', size: 'lg', icon: 'fa-calendar-check', onClick: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }, 'Записатися на ремонт'),
            h(Button, { variant: 'outline', size: 'lg', icon: 'fa-list', onClick: () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) }, 'Наші послуги')
          ),
          h('div', { className: 'mt-12 grid grid-cols-3 gap-6' },
            h('div', { className: 'text-center lg:text-left' },
              h('div', { className: 'text-3xl font-bold text-white mb-1' }, '5+'),
              h('div', { className: 'text-sm text-blue-200' }, 'років досвіду')
            ),
            h('div', { className: 'text-center lg:text-left' },
              h('div', { className: 'text-3xl font-bold text-white mb-1' }, '10+'),
              h('div', { className: 'text-sm text-blue-200' }, 'майстрів')
            ),
            h('div', { className: 'text-center lg:text-left' },
              h('div', { className: 'text-3xl font-bold text-white mb-1' }, '5000+'),
              h('div', { className: 'text-sm text-blue-200' }, 'ремонтів')
            )
          )
        ),
        h('div', { className: 'hidden lg:block relative' },
          h('div', { className: 'relative w-full h-[600px]' },
            h('div', { className: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20' },
              h('img', { src: '/images/reception.png', alt: 'NEXX Reception', className: 'w-full h-full object-cover' })
            ),
            h('div', { className: 'absolute top-10 left-10 w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl', style: { animation: 'float 3s ease-in-out infinite' } },
              h('i', { className: 'fa fa-mobile-screen text-4xl text-white' })
            ),
            h('div', { className: 'absolute top-20 right-10 w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl', style: { animation: 'float 3s ease-in-out infinite 0.5s' } },
              h('i', { className: 'fa fa-laptop text-4xl text-white' })
            ),
            h('div', { className: 'absolute bottom-20 left-20 w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl', style: { animation: 'float 3s ease-in-out infinite 1s' } },
              h('i', { className: 'fa fa-microscope text-4xl text-white' })
            ),
            h('div', { className: 'absolute bottom-10 right-20 w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl', style: { animation: 'float 3s ease-in-out infinite 1.5s' } },
              h('i', { className: 'fa fa-shield-halved text-4xl text-white' })
            )
          )
        )
      )
    ),
    h('div', { className: 'absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce' },
      h('i', { className: 'fa fa-chevron-down text-2xl' })
    ),
    h('style', {}, `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
    `)
  );
};

// ============================================
// STATS SECTION
// ============================================

const StatsSection = () => {
  const stats = [
    { icon: 'fa-clock', value: '30-40 хв', label: 'Середній час ремонту', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { icon: 'fa-shield-halved', value: '30 днів', label: 'Гарантія на послуги', color: 'text-green-600', bgColor: 'bg-green-50' },
    { icon: 'fa-camera', value: '100%', label: 'Фіксація стану', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { icon: 'fa-award', value: '5+ років', label: 'Досвід роботи', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];
  
  return h('section', { className: 'py-20 bg-slate-50' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'text-center mb-16' },
        h('h2', { className: 'text-4xl md:text-5xl font-bold text-slate-900 mb-4' }, 
          window.i18n?.t('whyUs.title') || 'Чому обирають нас'
        ),
        h('p', { className: 'text-xl text-slate-600 max-w-3xl mx-auto' }, 
          'Професійний підхід до кожного клієнта та прозорість на всіх етапах ремонту'
        )
      ),
      h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8' },
        ...stats.map(stat =>
          h(Card, { key: stat.label, hover: true, className: 'text-center group' },
            h('div', { className: `w-20 h-20 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300` },
              h('i', { className: `fa ${stat.icon} text-4xl ${stat.color}` })
            ),
            h('div', { className: `text-4xl font-bold ${stat.color} mb-2` }, stat.value),
            h('div', { className: 'text-lg font-semibold text-slate-900 mb-2' }, stat.label)
          )
        )
      )
    )
  );
};

// ============================================
// SERVICES SECTION
// ============================================

const ServicesSection = () => {
  return h('section', { id: 'services', className: 'py-20 bg-white' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'text-center mb-16' },
        h('h2', { className: 'text-4xl md:text-5xl font-bold text-slate-900 mb-4' }, 
          window.i18n?.t('services.title') || 'Наші послуги'
        ),
        h('p', { className: 'text-xl text-slate-600 max-w-3xl mx-auto' }, 
          window.i18n?.t('services.subtitle') || 'Повний спектр послуг з ремонту та обслуговування Apple техніки'
        )
      ),
      h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' },
        ...SITE_CONFIG.services.map(service =>
          h(Card, { key: service.name, hover: true, className: 'group' },
            h('div', { className: 'w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300' },
              h('i', { className: `fa ${service.icon} text-2xl text-white` })
            ),
            h('h3', { className: 'text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors' }, service.name),
            h('p', { className: 'text-sm text-slate-600 leading-relaxed' }, service.desc)
          )
        )
      ),
      h('div', { className: 'mt-12 text-center' },
        h('p', { className: 'text-slate-600 mb-4' }, 
          window.i18n?.t('services.notFound') || 'Не знайшли потрібну послугу?'
        ),
        h('a', { href: '#contact', className: 'inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg' },
          window.i18n?.t('contact.title') || 'Зв\'яжіться з нами',
          h('i', { className: 'fa fa-arrow-right' })
        )
      )
    )
  );
};

// ============================================
// PRICING SECTION  
// ============================================

const PricingSection = () => {
  return h('section', { className: 'py-20 bg-gradient-to-br from-slate-50 to-blue-50' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'text-center mb-16' },
        h('h2', { className: 'text-4xl md:text-5xl font-bold text-slate-900 mb-4' }, 
          'Тарифні плани'
        ),
        h('p', { className: 'text-xl text-slate-600 max-w-3xl mx-auto' }, 
          'Виберіть план, який підходить саме вам'
        )
      ),
      h('div', { className: 'grid md:grid-cols-2 gap-8 max-w-5xl mx-auto' },
        h(Card, { className: 'relative' },
          h('div', { className: 'text-center mb-6' },
            h('h3', { className: 'text-2xl font-bold text-slate-900 mb-2' }, 'Базовий'),
            h('div', { className: 'flex items-baseline justify-center gap-2' },
              h('span', { className: 'text-5xl font-bold text-slate-900' }, '0'),
              h('span', { className: 'text-2xl text-slate-600' }, '₴')
            ),
            h('p', { className: 'text-slate-600 mt-2' }, 'Для разових звернень')
          ),
          h('ul', { className: 'space-y-3 mb-8' },
            ['Безплатна діагностика', '30 днів гарантії', 'Фото/відео фіксація стану', 'Прозорі ціни', 'Запчастини в наявності'].map(feature =>
              h('li', { key: feature, className: 'flex items-start gap-3' },
                h('i', { className: 'fa fa-check-circle text-green-500 mt-1' }),
                h('span', { className: 'text-slate-700' }, feature)
              )
            )
          ),
          h(Button, { variant: 'outline', size: 'lg', fullWidth: true, onClick: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }, 'Записатися')
        ),
        h(Card, { className: 'relative border-2 border-blue-600 shadow-2xl' },
          h('div', { className: 'absolute -top-4 left-1/2 -translate-x-1/2' },
            h(Badge, { variant: 'info' }, h('i', { className: 'fa fa-star mr-1' }), 'Популярний')
          ),
          h('div', { className: 'text-center mb-6' },
            h('h3', { className: 'text-2xl font-bold text-slate-900 mb-2' }, 'Менеджер'),
            h('div', { className: 'flex items-baseline justify-center gap-2' },
              h('span', { className: 'text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' }, '299'),
              h('span', { className: 'text-2xl text-slate-600' }, '₴/міс')
            ),
            h('div', { className: 'mt-2 flex items-center justify-center gap-2' },
              h('span', { className: 'text-slate-400 line-through' }, '599 ₴'),
              h(Badge, { variant: 'warning', size: 'sm' }, 'Економія 50%')
            ),
            h('p', { className: 'text-slate-600 mt-2' }, 'Для постійних клієнтів')
          ),
          h('ul', { className: 'space-y-3 mb-8' },
            ['Все з Базового', 'Пріоритетна підтримка 24/7', 'Безлімітні чистки', 'До 4 пристроїв', '-20% на всі послуги', 'Персональний менеджер', 'Fast-Track сервіс', 'Подарунок на ДН'].map(feature =>
              h('li', { key: feature, className: 'flex items-start gap-3' },
                h('i', { className: 'fa fa-check-circle text-blue-600 mt-1' }),
                h('span', { className: 'text-slate-700 font-medium' }, feature)
              )
            )
          ),
          h('div', { className: 'bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200' },
            h('div', { className: 'flex items-start gap-3' },
              h('i', { className: 'fa fa-bolt text-blue-600 text-xl mt-1' }),
              h('div', {},
                h('div', { className: 'font-semibold text-blue-900 mb-1' }, 'Fast-Track сервіс'),
                h('p', { className: 'text-sm text-blue-700' }, 'Ваш персональний менеджер бере весь процес на себе. Статуси в Telegram, без черг.')
              )
            )
          ),
          h(Button, { variant: 'primary', size: 'lg', fullWidth: true, icon: 'fa-crown', onClick: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }, 'Підключити план')
        )
      )
    )
  );
};

// ============================================
// COURSES SECTION (Coming Soon)
// ============================================

const CoursesSection = () => {
  const courses = [
    { icon: 'fa-palette', name: 'Малювання на iPad', age: '6-10 років', color: 'purple' },
    { icon: 'fa-camera', name: 'Мобільна фотографія', age: '10-14 років', color: 'blue' },
    { icon: 'fa-code', name: 'Перше програмування', age: '8-12 років', color: 'green' },
    { icon: 'fa-video', name: 'Створення відео', age: '10-15 років', color: 'orange' },
    { icon: 'fa-brain', name: 'Вступ до AI & ML', age: '12-16 років', color: 'pink' },
    { icon: 'fa-gamepad', name: 'Дизайн ігор', age: '10-14 років', color: 'indigo' },
  ];
  
  return h('section', { id: 'courses', className: 'py-20 bg-white' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'text-center mb-16' },
        h(Badge, { variant: 'purple', className: 'mb-4' }, h('i', { className: 'fa fa-clock mr-2' }), 'Скоро'),
        h('h2', { className: 'text-4xl md:text-5xl font-bold text-slate-900 mb-4' }, 'Дитячі курси'),
        h('p', { className: 'text-xl text-slate-600 max-w-3xl mx-auto' }, 'Готуємо захоплюючі курси для дітей з Apple технологіями')
      ),
      h(Card, { className: 'max-w-4xl mx-auto' },
        h('div', { className: 'grid md:grid-cols-2 gap-8 items-center' },
          h('div', { className: 'relative' },
            h('div', { className: 'aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 relative' },
              h('img', { src: '/images/kids-training-1.png', alt: 'Kids Training', className: 'w-full h-full object-cover opacity-50' }),
              h('div', { className: 'absolute inset-0 flex items-center justify-center' },
                h('div', { className: 'text-center' },
                  h('i', { className: 'fa fa-graduation-cap text-6xl text-purple-600 mb-4' }),
                  h('div', { className: 'text-2xl font-bold text-purple-900' }, 'Незабаром!')
                )
              )
            )
          ),
          h('div', {},
            h('h3', { className: 'text-2xl font-bold text-slate-900 mb-6' }, 'Що буде на курсах?'),
            h('ul', { className: 'space-y-4' },
              ...courses.map(course =>
                h('li', { key: course.name, className: 'flex items-start gap-3' },
                  h('div', { className: `w-10 h-10 bg-${course.color}-100 rounded-lg flex items-center justify-center flex-shrink-0` },
                    h('i', { className: `fa ${course.icon} text-${course.color}-600` })
                  ),
                  h('div', {},
                    h('div', { className: 'font-semibold text-slate-900' }, course.name),
                    h('p', { className: 'text-sm text-slate-600' }, course.age)
                  )
                )
              )
            ),
            h('div', { className: 'mt-8 p-4 bg-purple-50 rounded-xl border border-purple-200' },
              h('div', { className: 'flex items-start gap-3' },
                h('i', { className: 'fa fa-bell text-purple-600 text-xl mt-1' }),
                h('div', { className: 'flex-1' },
                  h('div', { className: 'font-semibold text-purple-900 mb-1' }, 'Отримайте сповіщення про запуск'),
                  h('p', { className: 'text-sm text-purple-700 mb-3' }, 'Залиште контакти і ми повідомимо про початок набору'),
                  h('a', { href: '#contact', className: 'inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm' },
                    'Записатися в список очікування',
                    h('i', { className: 'fa fa-arrow-right' })
                  )
                )
              )
            )
          )
        )
      )
    )
  );
};

// ============================================
// CONTACT SECTION - Full Redesign
// ============================================

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 9) {
      setSubmitStatus({ type: 'error', message: 'Introduceți un număr de telefon valid' });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || 'Client Website',
          phone: formData.phone,
          problem: formData.message || 'Solicitare de pe website'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitStatus({ type: 'success', message: 'Mulțumim! Vă vom contacta în câteva minute!' });
        setFormData({ name: '', phone: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Eroare. Încercați din nou.' });
      }
    } catch (err) {
      setSubmitStatus({ type: 'error', message: 'Eroare de conexiune. Sunați-ne direct!' });
    }
    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  // Social media links (no phone-based services until real number added)
  const socialLinks = [
    { icon: 'fa-brands fa-telegram', href: 'https://t.me/nexx_support', label: 'Telegram', color: 'bg-sky-500 hover:bg-sky-600' },
    { icon: 'fa-brands fa-instagram', href: 'https://instagram.com/nexx_service', label: 'Instagram', color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500' },
    { icon: 'fa-brands fa-facebook', href: 'https://facebook.com/nexx.service.center', label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
  ];

  return h('section', { id: 'contact', className: 'py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden' },
    // Background decoration
    h('div', { className: 'absolute inset-0' },
      h('div', { className: 'absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl' }),
      h('div', { className: 'absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl' })
    ),
    
    h('div', { className: 'relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      // Header
      h('div', { className: 'text-center mb-16' },
        h('h2', { className: 'text-4xl md:text-5xl font-bold text-white mb-4' }, 'Contactează-ne'),
        h('p', { className: 'text-xl text-blue-200 max-w-3xl mx-auto' }, 
          'Suntem aici să te ajutăm. Alege metoda preferată de contact.'
        )
      ),
      
      h('div', { className: 'grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto' },
        // Left side - Contact Info (3 columns)
        h('div', { className: 'lg:col-span-3 space-y-6' },
          
          // Main contact cards grid
          h('div', { className: 'grid sm:grid-cols-2 gap-4' },
            // Phone Card - placeholder until real number is added
            h('div', { 
              className: 'group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300'
            },
              h('div', { className: 'flex items-center gap-4' },
                h('div', { className: 'w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform' },
                  h('i', { className: 'fa fa-phone text-white text-2xl' })
                ),
                h('div', {},
                  h('p', { className: 'text-green-300 text-sm font-medium mb-1' }, 'Telefon'),
                  h('p', { className: 'text-white text-xl font-bold' }, 'În curând')
                )
              ),
              h('div', { className: 'mt-4 flex items-center gap-2 text-green-300 text-sm' },
                h('i', { className: 'fa fa-clock' }),
                h('span', {}, 'L-V: 10:00-19:00 • S: 11:00-17:00')
              )
            ),
            
            // Telegram Card (instead of WhatsApp)
            h('a', { 
              href: 'https://t.me/nexx_support',
              target: '_blank',
              className: 'group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 hover:border-sky-400/50 transition-all duration-300 cursor-pointer'
            },
              h('div', { className: 'flex items-center gap-4' },
                h('div', { className: 'w-14 h-14 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform' },
                  h('i', { className: 'fa-brands fa-telegram text-white text-3xl' })
                ),
                h('div', {},
                  h('p', { className: 'text-sky-300 text-sm font-medium mb-1' }, 'Scrie pe Telegram'),
                  h('p', { className: 'text-white text-lg font-bold' }, 'Răspuns rapid')
                )
              ),
              h('div', { className: 'mt-4 flex items-center gap-2 text-sky-300 text-sm' },
                h('i', { className: 'fa fa-check-circle' }),
                h('span', {}, 'Răspundem în câteva minute')
              )
            ),
            
            // Email Card
            h('a', { 
              href: 'mailto:info@nexxgsm.ro',
              className: 'group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 hover:border-blue-400/50 transition-all duration-300 cursor-pointer'
            },
              h('div', { className: 'flex items-center gap-4' },
                h('div', { className: 'w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform' },
                  h('i', { className: 'fa fa-envelope text-white text-2xl' })
                ),
                h('div', {},
                  h('p', { className: 'text-blue-300 text-sm font-medium mb-1' }, 'Email'),
                  h('p', { className: 'text-white text-lg font-bold' }, 'info@nexxgsm.ro')
                )
              ),
              h('div', { className: 'mt-4 flex items-center gap-2 text-blue-300 text-sm' },
                h('i', { className: 'fa fa-reply' }),
                h('span', {}, 'Răspundem în maxim 1 oră')
              )
            ),
            
            // Location Card
            h('a', { 
              href: '/directions',
              className: 'group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 hover:border-purple-400/50 transition-all duration-300 cursor-pointer'
            },
              h('div', { className: 'flex items-center gap-4' },
                h('div', { className: 'w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform' },
                  h('i', { className: 'fa fa-location-dot text-white text-2xl' })
                ),
                h('div', {},
                  h('p', { className: 'text-purple-300 text-sm font-medium mb-1' }, 'Adresa noastră'),
                  h('p', { className: 'text-white text-lg font-bold' }, 'Calea Șerban Vodă 47'),
                  h('p', { className: 'text-purple-200 text-sm' }, 'Sector 4, București')
                )
              ),
              h('div', { className: 'mt-4 flex items-center gap-2 text-purple-300 text-sm' },
                h('i', { className: 'fa fa-route' }),
                h('span', {}, 'Vezi cum să ajungi →')
              )
            )
          ),
          
          // Social Media Section
          h('div', { className: 'bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10' },
            h('h3', { className: 'text-white font-semibold mb-4 flex items-center gap-2' },
              h('i', { className: 'fa fa-share-nodes text-blue-400' }),
              'Urmărește-ne pe rețelele sociale'
            ),
            h('div', { className: 'flex flex-wrap gap-3' },
              ...socialLinks.map(link =>
                h('a', {
                  key: link.label,
                  href: link.href,
                  target: '_blank',
                  className: `inline-flex items-center gap-2 px-5 py-3 ${link.color} text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg`
                },
                  h('i', { className: `${link.icon} text-xl` }),
                  link.label
                )
              )
            )
          ),
          
          // Working Hours
          h('div', { className: 'bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10' },
            h('h3', { className: 'text-white font-semibold mb-4 flex items-center gap-2' },
              h('i', { className: 'fa fa-clock text-orange-400' }),
              'Program de lucru'
            ),
            h('div', { className: 'grid grid-cols-3 gap-4' },
              h('div', { className: 'text-center p-3 bg-white/5 rounded-xl' },
                h('p', { className: 'text-orange-300 text-sm mb-1' }, 'Luni - Vineri'),
                h('p', { className: 'text-white font-bold text-lg' }, '10:00 - 19:00')
              ),
              h('div', { className: 'text-center p-3 bg-white/5 rounded-xl' },
                h('p', { className: 'text-orange-300 text-sm mb-1' }, 'Sâmbătă'),
                h('p', { className: 'text-white font-bold text-lg' }, '11:00 - 17:00')
              ),
              h('div', { className: 'text-center p-3 bg-white/5 rounded-xl' },
                h('p', { className: 'text-orange-300 text-sm mb-1' }, 'Duminică'),
                h('p', { className: 'text-red-400 font-bold text-lg' }, 'Închis')
              )
            )
          )
        ),
        
        // Right side - Contact Form (2 columns)
        h('div', { className: 'lg:col-span-2' },
          h('div', { className: 'bg-white rounded-2xl p-8 shadow-2xl h-full' },
            h('div', { className: 'text-center mb-6' },
              h('div', { className: 'w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg' },
                h('i', { className: 'fa fa-headset text-white text-2xl' })
              ),
              h('h3', { className: 'text-2xl font-bold text-slate-900 mb-2' }, 'Solicită un apel'),
              h('p', { className: 'text-slate-600 text-sm' }, 'Completează formularul și te sunăm noi în câteva minute')
            ),
            
            h('form', { onSubmit: handleSubmit, className: 'space-y-4' },
              // Name input
              h('div', {},
                h('label', { className: 'block text-sm font-medium text-slate-700 mb-1' }, 'Numele tău'),
                h('input', {
                  type: 'text',
                  value: formData.name,
                  onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                  placeholder: 'ex: Ion Popescu',
                  className: 'w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors'
                })
              ),
              
              // Phone input
              h('div', {},
                h('label', { className: 'block text-sm font-medium text-slate-700 mb-1' }, 
                  'Număr de telefon ', 
                  h('span', { className: 'text-red-500' }, '*')
                ),
                h('input', {
                  type: 'tel',
                  value: formData.phone,
                  onChange: (e) => setFormData({ ...formData, phone: e.target.value }),
                  placeholder: '07XX XXX XXX',
                  required: true,
                  className: 'w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors'
                })
              ),
              
              // Message input
              h('div', {},
                h('label', { className: 'block text-sm font-medium text-slate-700 mb-1' }, 'Mesaj (opțional)'),
                h('textarea', {
                  value: formData.message,
                  onChange: (e) => setFormData({ ...formData, message: e.target.value }),
                  placeholder: 'Descrie pe scurt problema sau întrebarea ta...',
                  rows: 3,
                  className: 'w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none'
                })
              ),
              
              // Status message
              submitStatus && h('div', { 
                className: `p-4 rounded-xl ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} flex items-center gap-2`
              },
                h('i', { className: `fa ${submitStatus.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}` }),
                submitStatus.message
              ),
              
              // Submit button
              h('button', {
                type: 'submit',
                disabled: isSubmitting,
                className: 'w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              },
                isSubmitting ? 
                  h('span', {}, h('i', { className: 'fa fa-spinner fa-spin mr-2' }), 'Se trimite...') :
                  h('span', {}, h('i', { className: 'fa fa-paper-plane mr-2' }), 'Trimite solicitarea')
              ),
              
              // Privacy note
              h('p', { className: 'text-xs text-slate-500 text-center mt-4' },
                h('i', { className: 'fa fa-shield-halved mr-1' }),
                'Datele tale sunt în siguranță. Nu le partajăm cu terți.'
              )
            ),
            
            // Quick action buttons
            h('div', { className: 'mt-6 pt-6 border-t border-slate-200' },
              h('p', { className: 'text-sm text-slate-600 text-center mb-3' }, 'Sau contactează-ne direct:'),
              h('div', { className: 'flex gap-3' },
                h('a', {
                  href: 'https://t.me/nexx_support',
                  target: '_blank',
                  className: 'flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-center transition-colors flex items-center justify-center gap-2'
                },
                  h('i', { className: 'fa-brands fa-telegram' }),
                  'Telegram'
                ),
                h('a', {
                  href: 'https://instagram.com/nexx_service',
                  target: '_blank',
                  className: 'flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold rounded-xl text-center transition-colors flex items-center justify-center gap-2'
                },
                  h('i', { className: 'fa-brands fa-instagram' }),
                  'Instagram'
                )
              )
            )
          )
        )
      ),
      
      // Bottom CTA - Directions
      h('div', { className: 'mt-12 text-center' },
        h('a', {
          href: '/directions',
          className: 'inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105'
        },
          h('i', { className: 'fa fa-map-location-dot text-2xl text-blue-400' }),
          h('div', { className: 'text-left' },
            h('p', { className: 'text-lg' }, 'Calea Șerban Vodă 47, Sector 4'),
            h('p', { className: 'text-sm text-blue-300' }, 'Vezi indicații detaliate cum să ajungi →')
          )
        )
      )
    )
  );
};

// ============================================
// GALLERY SECTION
// ============================================

const GallerySection = () => {
  const images = [
    { src: '/images/reception.png', alt: 'Reception', title: 'Наша рецепція' },
    { src: '/images/workspace.png', alt: 'Workspace', title: 'Робоче місце майстра' },
    { src: '/images/facade.png', alt: 'Facade', title: 'Фасад сервіс-центру' },
  ];
  
  return h('section', { id: 'gallery', className: 'py-20 bg-white' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'text-center mb-16' },
        h('h2', { className: 'text-4xl md:text-5xl font-bold text-slate-900 mb-4' }, 'Наш сервіс-центр'),
        h('p', { className: 'text-xl text-slate-600 max-w-3xl mx-auto' }, 'Сучасне обладнання та комфортний простір для клієнтів')
      ),
      h('div', { className: 'grid md:grid-cols-3 gap-8' },
        ...images.map(img =>
          h('div', { key: img.src, className: 'group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300' },
            h('div', { className: 'aspect-[4/3] overflow-hidden bg-slate-200' },
              h('img', { src: img.src, alt: img.alt, className: 'w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' })
            ),
            h('div', { className: 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' },
              h('div', { className: 'absolute bottom-0 left-0 right-0 p-6 text-white' },
                h('h3', { className: 'text-xl font-bold mb-1' }, img.title)
              )
            )
          )
        )
      )
    )
  );
};

// ============================================
// FOOTER
// ============================================

// const Footer = () => {
//   return h('footer', { className: 'bg-slate-900 text-white py-16' },
//     h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
//       h('div', { className: 'grid md:grid-cols-3 gap-8 max-w-5xl mx-auto' },
//         h('div', {},
//           h('h3', { className: 'text-xl font-bold mb-4' }, 'NEXX Service Center'),
//           h('p', { className: 'text-slate-400' }, 'Професійний ремонт Apple техніки в Києві з 2014 року')
//         ),
//         h('div', {},
//           h('h4', { className: 'font-semibold mb-4' }, 'Контакти'),
//           h('div', { className: 'space-y-2 text-slate-400' },
//             h('p', {}, h('i', { className: 'fas fa-phone mr-2' }), SITE_CONFIG.phone.display),
//             h('p', {}, h('i', { className: 'fas fa-envelope mr-2' }), SITE_CONFIG.email),
//             h('p', {}, h('i', { className: 'fas fa-map-marker-alt mr-2' }), SITE_CONFIG.address.line1)
//           )
//         ),
//         h('div', {},
//           h('h4', { className: 'font-semibold mb-4' }, 'Графік роботи'),
//           h('div', { className: 'space-y-2 text-slate-400' },
//             h('p', {}, 'Пн-Пт: ', SITE_CONFIG.hours.weekdays),
//             h('p', {}, 'Сб: ', SITE_CONFIG.hours.saturday),
//             h('p', {}, 'Нд: ', SITE_CONFIG.hours.sunday)
//           )
//         )
//       ),
//       h('div', { className: 'border-t border-slate-800 mt-12 pt-8 text-center text-slate-500' },
//         h('p', {}, '© 2026 NEXX Service Center. Всі права захищені.')
//       )
//     )
//   );
// };

// ============================================
// MAIN HOMEPAGE
// ============================================

const Homepage = () => {
  return h('div', { className: 'min-h-screen' },
    h(HeroSection),
    h(StatsSection),
    h(ServicesSection),
    h(PricingSection),
    h(CoursesSection),
    h(ContactSection),
    h(GallerySection)
  );
};

// ============================================
// RENDER
// ============================================

ReactDOM.createRoot(document.getElementById('app')).render(h(Homepage));
