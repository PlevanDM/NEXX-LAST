/**
 * NEXX Site Configuration
 * Contact info, social links, business hours
 */

export const SITE_CONFIG = {
  // Business info
  name: 'NEXX',
  fullName: 'NEXX Service Center',
  tagline: 'Професійний ремонт Apple техніки',
  description: 'Швидкий та якісний ремонт iPhone, iPad, MacBook, Apple Watch в Києві. Гарантія 30 днів.',

  // Contact
  contact: {
    // Phone Romania - TODO: Add real phone number
    phoneE164: '',
    phoneDisplay: '',
    phoneWhatsApp: '',
    
    // Email
    email: 'info@nexx.ro',
    supportEmail: 'support@nexx.ro',

    // Address - Bucharest, Romania (Sector 4)
    addressLine1: 'Calea Șerban Vodă 47',
    addressLine2: 'Sector 4, București 040215',
    city: 'București',
    cityLocal: 'Bucharest',
    sector: 'Sector 4',
    country: 'România',
    countryCode: 'RO',
    postalCode: '040215',
    
    // Map coordinates (Calea Victoriei, Bucharest)
    mapsLat: 44.42146803174267,
    mapsLng: 26.102888425255543,
  },
  
  // Currency (Romanian Leu)
  currency: {
    code: 'RON',
    symbol: 'lei',
    symbolAfter: true, // "100 lei" не "lei 100"
    rates: {
      RON_TO_EUR: 0.20,
      RON_TO_USD: 0.22,
      EUR_TO_RON: 5.00,
      USD_TO_RON: 4.55
    }
  },

  // Working hours
  hours: {
    weekdays: '10:00 - 19:00',  // Пн-Пт
    saturday: '11:00 - 17:00',  // Сб
    sunday: 'Вихідний',         // Нд
    
    // Full format for display
    full: {
      monday: '10:00 - 19:00',
      tuesday: '10:00 - 19:00',
      wednesday: '10:00 - 19:00',
      thursday: '10:00 - 19:00',
      friday: '10:00 - 19:00',
      saturday: '11:00 - 17:00',
      sunday: 'Вихідний',
    },
  },

  // Social media
  social: {
    instagram: 'nexx_service',
    facebook: 'nexx.service.center',
    telegram: 'nexx_support',
    tiktok: '@nexx_repairs',
    youtube: '@nexxrepairs',
  },

  // Stats (for hero section)
  stats: {
    repairTime: '30-40 хв',
    warranty: '30 днів',
    documentation: '100%',
    experience: '5+ років',
    masters: '10+ майстрів',
    repairs: '5000+ ремонтів',
  },

  // Pricing plans (for subscription section)
  pricing: {
    basic: {
      name: 'Базовий',
      price: 0,
      currency: '₴',
      period: '',
      features: [
        'Безплатна діагностика',
        '30 днів гарантії',
        'Фото/відео фіксація стану',
        'Прозорі ціни',
        'Запчастини в наявності',
      ],
    },
    manager: {
      name: 'Менеджер',
      price: 299,
      currency: '₴',
      period: 'міс',
      popular: true,
      discount: { from: 599, save: '50%' },
      features: [
        'Все з Базового',
        'Пріоритетна підтримка 24/7',
        'Безлімітні чистки та діагностики',
        'До 4 пристроїв в обслуговуванні',
        '-20% на всі послуги та запчастини',
        'Персональний менеджер в Telegram',
        'Fast-Track сервіс (без черги)',
        'Подарунок на День Народження',
      ],
    },
  },

  // Courses (for kids section)
  courses: [
    {
      id: 'ipad-drawing',
      name: 'Малювання на iPad',
      age: '6-10 років',
      duration: '4 тижні',
      icon: 'fa-palette',
      description: 'Творчість з Procreate',
    },
    {
      id: 'mobile-photo',
      name: 'Мобільна Фотографія',
      age: '10-14 років',
      duration: '4 тижні',
      icon: 'fa-camera',
      description: 'Секрети крутих знімків',
    },
    {
      id: 'first-code',
      name: 'Перше Програмування',
      age: '8-12 років',
      duration: '6 тижнів',
      icon: 'fa-code',
      description: 'Swift Playgrounds',
    },
    {
      id: 'video-creation',
      name: 'Створення Відео',
      age: '10-15 років',
      duration: '4 тижні',
      icon: 'fa-video',
      description: 'iMovie та Final Cut',
    },
    {
      id: 'ai-ml-intro',
      name: 'Вступ до AI & ML',
      age: '12-16 років',
      duration: '6 тижнів',
      icon: 'fa-brain',
      description: 'Штучний інтелект для дітей',
    },
    {
      id: 'game-design',
      name: 'Дизайн Ігор',
      age: '10-14 років',
      duration: '6 тижнів',
      icon: 'fa-gamepad',
      description: 'Створюй свої ігри',
    },
  ],

  // Services (main categories)
  services: [
    {
      id: 'phone-repair',
      name: 'Ремонт Телефонів',
      icon: 'fa-mobile-screen',
      description: 'iPhone та Android. Дисплей, батарея, камера, динаміки.',
    },
    {
      id: 'diagnostics',
      name: 'Діагностика Під Мікроскопом',
      icon: 'fa-microscope',
      description: 'Точне виявлення несправностей на рівні мікросхем.',
    },
    {
      id: 'cleaning',
      name: 'Професійна Чистка',
      icon: 'fa-broom',
      description: 'Чистка після залиття, заміна термопасти, профілактика.',
    },
    {
      id: 'customization',
      name: 'Кастомізація & Дизайн',
      icon: 'fa-wand-magic-sparkles',
      description: 'Унікальний корпус, кольорові акценти, персоналізація.',
    },
    {
      id: 'trade-in',
      name: 'Trade-In & Перепродаж',
      icon: 'fa-arrows-rotate',
      description: 'Обмін старого пристрою на новий з доплатою.',
    },
    {
      id: 'accessories',
      name: 'Аксесуари & Запчастини',
      icon: 'fa-bag-shopping',
      description: 'Оригінальні чохли, скло, кабелі, зарядки.',
    },
    {
      id: 'laptop-repair',
      name: 'Ремонт Ноутбуків',
      icon: 'fa-laptop',
      description: 'MacBook та Windows ноутбуки. Екран, клавіатура, SSD.',
    },
  ],

  // Database access (for NEXX Database pincode)
  database: {
    pincode: '31618585',
    name: 'NEXX Database',
    description: 'База знань для майстрів з ремонту Apple',
  },
} as const;

// Helper functions
export const getWhatsAppUrl = (text?: string) => {
  const base = `https://wa.me/${SITE_CONFIG.contact.phoneWhatsApp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};

export const getTelegramUrl = () => {
  return `https://t.me/${SITE_CONFIG.social.telegram}`;
};

export const getInstagramUrl = () => {
  return `https://instagram.com/${SITE_CONFIG.social.instagram}`;
};

export const getFacebookUrl = () => {
  return `https://facebook.com/${SITE_CONFIG.social.facebook}`;
};

export const getDirectionsUrl = () => {
  const { mapsLat, mapsLng } = SITE_CONFIG.contact;
  return `https://maps.google.com/?q=${mapsLat},${mapsLng}`;
};

export const getEmailUrl = (subject?: string) => {
  const base = `mailto:${SITE_CONFIG.contact.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
};

// Type exports for TypeScript
export type Service = typeof SITE_CONFIG.services[number];
export type Course = typeof SITE_CONFIG.courses[number];
export type PricingPlan = typeof SITE_CONFIG.pricing.basic | typeof SITE_CONFIG.pricing.manager;
