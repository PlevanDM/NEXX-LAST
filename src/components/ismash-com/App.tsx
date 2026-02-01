import React, { useState } from 'react';
import {
  Header,
  Footer,
  DesktopHeroCarousel,
  MobileHeroCarousel,
  TrustpilotWidget,
  ServiceOptions,
  RepairedDevicesAndBrands,
  WhyIsmash,
  PromotionalBanner,
  BusinessServices,
  LoginModal,
  Button,
  LiveCounter,
  StatCard,
} from '@/components/ismash-com/components';

// ============================================
// SITE CONFIGURATION
// Дані конфігурації сайту NEXX (iSmash style)
// ============================================
const SITE_CONFIG = {
  name: 'NEXX',
  tagline: 'Професійний ремонт Apple техніки',
  phone: {
    display: '+380 12 345 6789',
    tel: '+380123456789',
  },
  email: 'info@nexx.com.ua',
  address: {
    line1: 'вул. Хрещатик, 22',
    line2: 'Київ, Україна 01001',
  },
  hours: {
    weekdays: '10:00 - 19:00',
    saturday: '11:00 - 17:00',
    sunday: 'Вихідний',
  },
  social: {
    instagram: 'https://instagram.com/nexx_repair',
    telegram: 'https://t.me/nexx_repair',
    facebook: 'https://facebook.com/nexx.repair',
  },
};

// Hero Carousel Slides
const heroSlides = [
  {
    id: 1,
    title: 'Професійний ремонт iPhone',
    subtitle: 'Від 30 хвилин',
    description: 'Заміна екрану, батареї, роз\'ємів та інших компонентів з гарантією 30 днів',
    image: '/images/iphone-hero.png',
    ctaText: 'Записатися на ремонт',
    ctaLink: '/calculator',
    bgColor: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
  },
  {
    id: 2,
    title: 'MacBook ремонт материнських плат',
    subtitle: 'Компонентний рівень',
    description: 'Мікропайка, заміна чіпів, відновлення після залиття',
    image: '/images/macbook-hero.png',
    ctaText: 'Дізнатися ціну',
    ctaLink: '/calculator',
    bgColor: 'bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900',
  },
  {
    id: 3,
    title: 'Trade-In програма',
    subtitle: 'Вигідно!',
    description: 'Здайте старий пристрій та отримайте знижку на новий',
    image: '/images/trade-in.png',
    ctaText: 'Оцінити пристрій',
    ctaLink: '/about',
    bgColor: 'bg-gradient-to-br from-green-800 via-emerald-900 to-slate-900',
  },
];

// Services list
const services = [
  {
    id: 'screen',
    icon: '📱',
    title: 'Заміна екрану',
    description: 'Оригінальні та якісні OEM дисплеї для iPhone та iPad',
    price: '1 500 ₴',
    duration: '30 хв',
    popular: true,
  },
  {
    id: 'battery',
    icon: '🔋',
    title: 'Заміна батареї',
    description: 'Нова батарея з максимальною ємністю та гарантією',
    price: '800 ₴',
    duration: '20 хв',
  },
  {
    id: 'charging',
    icon: '🔌',
    title: 'Ремонт зарядки',
    description: 'Заміна роз\'єму, чистка, мікропайка контролера',
    price: '600 ₴',
    duration: '40 хв',
  },
  {
    id: 'water',
    icon: '💧',
    title: 'Після залиття',
    description: 'Чистка ультразвуком, заміна пошкоджених компонентів',
    price: '1 200 ₴',
    duration: '1-2 год',
  },
  {
    id: 'motherboard',
    icon: '🔧',
    title: 'Ремонт плати',
    description: 'Компонентний ремонт материнських плат MacBook',
    price: '2 500 ₴',
    duration: '2-5 днів',
  },
  {
    id: 'diagnostic',
    icon: '🔍',
    title: 'Діагностика',
    description: 'Безкоштовна діагностика всіх пристроїв Apple',
    price: 'Безкоштовно',
    duration: '15 хв',
  },
];

// Navigation items
const navItems = [
  { label: 'Головна', href: '/', isActive: true },
  { label: 'Послуги', href: '#services' },
  { label: 'Калькулятор', href: '/calculator' },
  { label: 'Про нас', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Контакти', href: '#contact' },
];

// Footer columns
const footerColumns = [
  {
    title: 'Послуги',
    links: [
      { label: 'Ремонт iPhone', href: '/services/iphone' },
      { label: 'Ремонт iPad', href: '/services/ipad' },
      { label: 'Ремонт MacBook', href: '/services/macbook' },
      { label: 'Ремонт Apple Watch', href: '/services/watch' },
      { label: 'Trade-In', href: '/trade-in' },
    ],
  },
  {
    title: 'Інформація',
    links: [
      { label: 'Про нас', href: '/about' },
      { label: 'Калькулятор', href: '/calculator' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Блог', href: '/blog' },
      { label: 'Вакансії', href: '/careers' },
    ],
  },
  {
    title: 'Контакти',
    links: [
      { label: SITE_CONFIG.phone.display, href: `tel:${SITE_CONFIG.phone.tel}` },
      { label: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
      { label: 'Telegram', href: SITE_CONFIG.social.telegram },
      { label: 'Instagram', href: SITE_CONFIG.social.instagram },
    ],
  },
];

// Social links for footer
const socialLinks = [
  {
    icon: <span>📱</span>,
    href: SITE_CONFIG.social.telegram,
    label: 'Telegram',
  },
  {
    icon: <span>📷</span>,
    href: SITE_CONFIG.social.instagram,
    label: 'Instagram',
  },
  {
    icon: <span>👍</span>,
    href: SITE_CONFIG.social.facebook,
    label: 'Facebook',
  },
];

// ============================================
// MAIN APP COMPONENT
// ============================================
export const IsmashApp: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleServiceClick = (service: any) => {
    console.log('Service clicked:', service);
    // Navigate to service page or open modal
    window.location.href = `/calculator?service=${service.id}`;
  };

  const handleLogin = async (email: string, password: string) => {
    console.log('Login:', email);
    // TODO: Implement actual login logic
  };

  const handleRegister = async (data: any) => {
    console.log('Register:', data);
    // TODO: Implement actual registration logic
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <Header
        siteName={SITE_CONFIG.name}
        navItems={navItems}
        actionButton={{
          label: 'Записатися',
          onClick: () => window.location.href = '/calculator',
        }}
        sticky
      />

      {/* Hero Carousel */}
      <DesktopHeroCarousel slides={heroSlides} autoPlayInterval={6000} />
      <MobileHeroCarousel slides={heroSlides} autoPlayInterval={6000} />

      {/* Trust Indicators */}
      <section className="py-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            <TrustpilotWidget rating={4.8} reviewCount={1250} variant="default" />
            <div className="hidden sm:flex items-center gap-2 text-slate-600">
              <span className="text-green-500 font-bold">✓</span>
              <span className="text-sm">Гарантія 30 днів</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-600">
              <span className="text-green-500 font-bold">✓</span>
              <span className="text-sm">Безкоштовна діагностика</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-slate-600">
              <span className="text-green-500 font-bold">✓</span>
              <span className="text-sm">Оригінальні запчастини</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServiceOptions
        title="Популярні послуги"
        subtitle="Швидкий та якісний ремонт вашої Apple техніки"
        services={services}
        columns={3}
        onServiceClick={handleServiceClick}
      />

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard icon="🔧" value={10000} label="Ремонтів виконано" suffix="+" iconColor="text-blue-600" />
            <StatCard icon="⭐" value={4800} label="Задоволених клієнтів" iconColor="text-amber-500" />
            <StatCard icon="📱" value={126} label="Моделей у базі" iconColor="text-purple-600" />
            <StatCard icon="🏆" value={8} label="Років досвіду" iconColor="text-green-600" />
          </div>
        </div>
      </section>

      {/* Devices & Brands */}
      <RepairedDevicesAndBrands
        title="Ремонтуємо будь-яку Apple техніку"
        subtitle="Від iPhone 5 до останніх моделей MacBook Pro"
      />

      {/* Why Us Section */}
      <WhyIsmash />

      {/* Promotional Banner */}
      <PromotionalBanner
        subtitle="🎉 Акція"
        title="Знижка 20% на заміну батареї"
        description="Тільки до кінця місяця! Встигніть записатися та отримайте знижку на заміну батареї для будь-якого iPhone."
        ctaText="Записатися зі знижкою"
        ctaLink="/calculator?promo=battery20"
      />

      {/* Business Services */}
      <BusinessServices
        onCtaClick={() => window.location.href = '/about#business'}
      />

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Зв'яжіться з нами
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Готові допомогти з будь-яким питанням щодо ремонту вашої техніки
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a
              href={`tel:${SITE_CONFIG.phone.tel}`}
              className="flex flex-col items-center p-6 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
            >
              <span className="text-4xl mb-3">📞</span>
              <span className="font-bold text-slate-800 group-hover:text-blue-600">{SITE_CONFIG.phone.display}</span>
              <span className="text-sm text-slate-500">Зателефонуйте нам</span>
            </a>

            <a
              href={SITE_CONFIG.social.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
            >
              <span className="text-4xl mb-3">✈️</span>
              <span className="font-bold text-slate-800 group-hover:text-blue-600">Telegram</span>
              <span className="text-sm text-slate-500">Напишіть у месенджер</span>
            </a>

            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex flex-col items-center p-6 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
            >
              <span className="text-4xl mb-3">✉️</span>
              <span className="font-bold text-slate-800 group-hover:text-blue-600">{SITE_CONFIG.email}</span>
              <span className="text-sm text-slate-500">Напишіть email</span>
            </a>
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-600 mb-4">
              <span className="font-medium">Адреса:</span> {SITE_CONFIG.address.line1}, {SITE_CONFIG.address.line2}
            </p>
            <p className="text-slate-600">
              <span className="font-medium">Графік роботи:</span> Пн-Пт {SITE_CONFIG.hours.weekdays}, Сб {SITE_CONFIG.hours.saturday}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        siteName={SITE_CONFIG.name}
        tagline={SITE_CONFIG.tagline}
        columns={footerColumns}
        socialLinks={socialLinks}
        contactInfo={{
          phone: SITE_CONFIG.phone.display,
          email: SITE_CONFIG.email,
          address: `${SITE_CONFIG.address.line1}, ${SITE_CONFIG.address.line2}`,
        }}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default IsmashApp;
