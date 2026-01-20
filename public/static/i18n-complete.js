/**
 * NEXX Internationalization System - ПОЛНАЯ ВЕРСИЯ
 * Підтримка: Українська, Румунська, Англійська
 * ВСЕ елементи для повної локалізації
 */

(function() {
  'use strict';
  
  const translations = {
    // ============================================
    // УКРАЇНСЬКА
    // ============================================
    uk: {
      code: 'uk',
      name: 'Українська',
      flag: '🇺🇦',
      direction: 'ltr',
      
      // Navigation & Header
      nav: {
        home: 'Головна',
        services: 'Послуги',
        booking: 'Замовити',
        contacts: 'Контакти',
        database: 'База даних',
        logout: 'Вийти',
        search: 'Пошук',
      },
      
      // Hero Section
      hero: {
        title: 'iPhone, MacBook, Samsung - Сервіс',
        subtitle: 'Швидко • Гарантія 30 днів',
        description: 'Apple, Samsung, Xiaomi, Huawei. Телефони, ноутбуки, планшети. Усі 6 районів.',
      },
      
      // CTA Buttons
      buttons: {
        bookRepair: 'Замовити ремонт',
        call: 'Дзвонити',
        order: 'Замовити',
        book: 'Замовити',
        submit: 'Відправити',
        send: 'Відправити',
      },
      
      // Services Section
      services: {
        title: 'Послуги Ремонту',
        subtitle: 'Мультибрендний сервіс з сертифікованими фахівцями',
        items: {
          battery: { 
            title: 'Ремонт Батарей', 
            desc: 'Заміна + відновлення акумуляторів',
            details: ['Заміна батарей', 'Відновлення ємності', 'Калібрування BMS', 'Тестування']
          },
          board: { 
            title: 'Ремонт Плат', 
            desc: 'Пайка IC, BGA ребол, ремонт доріжок',
            details: ['Пайка IC', 'BGA ребол', 'Ремонт доріжок', 'Пошкодження водою']
          },
          display: { 
            title: 'Заміна Дисплею', 
            desc: 'Оригінальні або якісні екрани',
            details: ['LCD/OLED', 'Сенсор', 'Ламінування', 'Калібрування']
          },
          port: { 
            title: 'Порт Зарядки', 
            desc: 'Заміна конектора, очищення',
            details: ['Очищення порту', 'Заміна', 'Ремонт доріжок', 'Тестування']
          },
          modular: { 
            title: 'Модульний Сервіс', 
            desc: 'Камера, динамік, кнопки, датчики',
            details: ['Камера', 'Динамік', 'Кнопки', 'Датчики']
          },
          diagnostics: { 
            title: 'Діагностика', 
            desc: 'Безкоштовна при замовленні ремонту',
            details: ['Діагностика', 'Аналіз', 'Кошторис', 'План дій']
          }
        },
        popular: 'Популярно',
        free: 'Безкоштовно',
        from: 'від',
        price: 'Ціна',
        time: 'Час'
      },
      
      // Why Us Section
      whyUs: {
        title: 'Чому обирають NEXX',
        multibrand: { title: 'Мультибренд', desc: 'Apple, Samsung, Xiaomi, Huawei та інші' },
        fast: { title: 'Швидкий Сервіс', desc: 'Більшість ремонтів за 30-60 хвилин' },
        warranty: { title: 'Гарантія 30 днів', desc: 'На всі види ремонту' },
        honest: { title: 'Чесні ціни', desc: 'Без прихованих платежів' },
        original: { title: 'Оригінальні деталі', desc: 'Перевірені та протестовані' },
        diagnostic: { title: 'Діагностика безкоштовна', desc: 'Професійна під мікроскопом' },
        transparent: { title: 'Прозоро', desc: 'Фото/відео звіт ремонту' },
        support: { title: 'Онлайн підтримка', desc: 'Консультації після ремонту' }
      },
      
      // Calculator
      calculator: {
        title: 'Безплатна онлайн оцінка',
        subtitle: 'Дайте відповіді на кілька запитань, щоб дізнатись приблизну ціну',
        selectBrand: 'Виберіть марку:',
        selectDevice: 'Виберіть тип:',
        selectModel: 'Виберіть модель:',
        selectIssue: 'Яка проблема?',
        back: 'Назад',
        estimatedPrice: 'Приблизна ціна',
        time: 'Час ремонту',
        noHiddenFees: 'Без прихованих витрат'
      },
      
      // Booking Form
      booking: {
        title: 'Замовити ремонт',
        subtitle: 'Залиште заявку - ми передзвонимо протягом 5 хвилин',
        name: "Ваше ім'я",
        namePlaceholder: 'Олександр',
        phone: 'Телефон',
        phonePlaceholder: '+40 XXX XXX XXX',
        device: 'Пристрій',
        devicePlaceholder: 'Оберіть пристрій',
        problem: 'Опис проблеми',
        problemPlaceholder: 'Не заряджається, тріснутий екран...',
        submit: 'Відправити заявку',
        submitting: 'Відправляємо...',
        success: 'Дякуємо! Ми зателефонуємо найближчим часом',
      },
      
      // Contact
      contact: {
        title: "Зв'яжіться з нами",
        hours: 'Працюємо Пн-Пт 10:00-19:00',
        address: 'Бухарест, Str. Victoriei 15',
        phone: '+40 721 234 567',
        email: 'info@nexx.ro',
      },
      
      // Footer
      footer: {
        company: 'Компанія',
        about: 'Про нас',
        jobs: 'Вакансії',
        services: 'Послуги',
        servicePhone: 'Ремонт телефонів',
        serviceLaptop: 'Ремонт ноутбуків',
        info: 'Інформація',
        faq: 'FAQ',
        privacy: 'Конфіденційність',
        terms: 'Умови',
        copyright: '© 2026 NEXX Service Center. Всі права захищені.',
        security: 'Безпечний сайт • SSL шифрування'
      }
    },
    
    // ============================================
    // ROMÂNĂ
    // ============================================
    ro: {
      code: 'ro',
      name: 'Română',
      flag: '🇷🇴',
      direction: 'ltr',
      
      // Navigation & Header
      nav: {
        home: 'Acasă',
        services: 'Servicii',
        booking: 'Comandă',
        contacts: 'Contacte',
        database: 'Bază de date',
        logout: 'Ieșire',
        search: 'Căutare',
      },
      
      // Hero Section
      hero: {
        title: 'iPhone, MacBook, Samsung',
        subtitle: 'Service rapid • Garanție 30 zile',
        description: 'Apple, Samsung, Xiaomi, Huawei. Toți 6 sectoare. Diagnostic gratuit.',
      },
      
      // CTA Buttons
      buttons: {
        bookRepair: 'Comandă reparație',
        call: 'Sună acum',
        order: 'Comandă',
        book: 'Comandă',
        submit: 'Trimite',
        send: 'Trimite cererea',
      },
      
      // Services Section
      services: {
        title: 'Ce reparăm',
        subtitle: 'Apple, Samsung, Xiaomi, Huawei - toate sub un singur acoperiș',
        items: {
          battery: { 
            title: 'Reparații Baterii', 
            desc: 'Înlocuire + regenerare acumulatori',
            details: ['Înlocuire baterie', 'Regenerare celule', 'Calibrare BMS', 'Test capacitate']
          },
          board: { 
            title: 'Reparații Plăci', 
            desc: 'Lipire IC, BGA reballing, reparare piste',
            details: ['Lipire IC', 'BGA reballing', 'Reparare piste', 'Deteriorare prin apă']
          },
          display: { 
            title: 'Înlocuire Display', 
            desc: 'Ecrane originale sau de calitate',
            details: ['LCD/OLED', 'Touchscreen', 'Laminate/delaminate', 'Calibrare']
          },
          port: { 
            title: 'Port Încărcare', 
            desc: 'Înlocuire conector, curățare',
            details: ['Curățare port', 'Înlocuire', 'Reparare piste', 'Testare încărcare']
          },
          modular: { 
            title: 'Service Modular', 
            desc: 'Cameră, difuzor, butoane, senzori',
            details: ['Cameră foto', 'Speaker/Mic', 'Butoane', 'Senzori']
          },
          diagnostics: { 
            title: 'Diagnostic', 
            desc: 'Gratuit la reparație',
            details: ['Diagnostic', 'Analiză', 'Estimare', 'Plan de acțiune']
          }
        },
        popular: 'Popular',
        free: 'Gratuit',
        from: 'de la',
        price: 'Preț',
        time: 'Timp'
      },
      
      // Why Us Section
      whyUs: {
        title: 'De ce NEXX',
        multibrand: { title: 'Multibrand', desc: 'Apple, Samsung, Xiaomi, Huawei și alții' },
        fast: { title: 'Service rapid', desc: 'Majoritatea reparațiilor în 30-60 minute' },
        warranty: { title: 'Garanție 30 zile', desc: 'Pentru toate reparațiile' },
        honest: { title: 'Prețuri corecte', desc: 'Fără costuri ascunse' },
        original: { title: 'Piese originale', desc: 'Verificate și testate' },
        diagnostic: { title: 'Diagnostic gratuit', desc: 'Profesional sub microscop' },
        transparent: { title: 'Transparent', desc: 'Raport foto/video' },
        support: { title: 'Suport Online', desc: 'Consultații după reparație' }
      },
      
      // Calculator
      calculator: {
        title: 'Estimare gratuită online',
        subtitle: 'Răspundeți la câteva întrebări pentru a afla prețul aproximativ',
        selectBrand: 'Alegeți marca:',
        selectDevice: 'Alegeți tipul:',
        selectModel: 'Alegeți modelul:',
        selectIssue: 'Ce problemă aveți?',
        back: 'Înapoi',
        estimatedPrice: 'Preț estimat',
        time: 'Timp reparație',
        noHiddenFees: 'Fără taxe ascunse'
      },
      
      // Booking Form
      booking: {
        title: 'Comandă reparație',
        subtitle: 'Lasă o cerere - te sunăm în 5 minute',
        name: 'Numele tău',
        namePlaceholder: 'Alexandru',
        phone: 'Telefon',
        phonePlaceholder: '+40 XXX XXX XXX',
        device: 'Dispozitiv',
        devicePlaceholder: 'Alege dispozitivul',
        problem: 'Descriere problemă',
        problemPlaceholder: 'Nu se încarcă, ecran spart...',
        submit: 'Trimite cererea',
        submitting: 'Trimitere...',
        success: 'Mulțumim! Te vom suna în curând',
      },
      
      // Contact
      contact: {
        title: 'Contactează-ne',
        hours: 'Program: Lun-Vin 10:00-19:00',
        address: 'București, Str. Victoriei 15',
        phone: '+40 721 234 567',
        email: 'info@nexx.ro',
      },
      
      // Footer
      footer: {
        company: 'Companie',
        about: 'Despre noi',
        jobs: 'Joburi',
        services: 'Servicii',
        servicePhone: 'Reparații telefoane',
        serviceLaptop: 'Reparații laptopuri',
        info: 'Informații',
        faq: 'FAQ',
        privacy: 'Confidențialitate',
        terms: 'Termeni',
        copyright: '© 2026 NEXX Service Center. Toate drepturile rezervate.',
        security: 'Site Securizat • SSL Criptat'
      }
    },
    
    // ============================================
    // ENGLISH
    // ============================================
    en: {
      code: 'en',
      name: 'English',
      flag: '🇬🇧',
      direction: 'ltr',
      
      // Navigation & Header
      nav: {
        home: 'Home',
        services: 'Services',
        booking: 'Book',
        contacts: 'Contact',
        database: 'Database',
        logout: 'Logout',
        search: 'Search',
      },
      
      // Hero Section
      hero: {
        title: 'iPhone, MacBook, Samsung',
        subtitle: 'Fast service • 30-day warranty',
        description: 'Apple, Samsung, Xiaomi, Huawei. All 6 sectors. Free diagnosis.',
      },
      
      // CTA Buttons
      buttons: {
        bookRepair: 'Book repair',
        call: 'Call now',
        order: 'Book',
        book: 'Book',
        submit: 'Send',
        send: 'Send request',
      },
      
      // Services Section
      services: {
        title: 'What we repair',
        subtitle: 'All brands under one roof',
        items: {
          battery: { 
            title: 'Battery Repair', 
            desc: 'Replacement + recovery',
            details: ['Battery replacement', 'Cell recovery', 'BMS calibration', 'Capacity test']
          },
          board: { 
            title: 'Board Repair', 
            desc: 'IC soldering, BGA reballing, trace repair',
            details: ['IC soldering', 'BGA reballing', 'Trace repair', 'Water damage']
          },
          display: { 
            title: 'Display Replacement', 
            desc: 'Original or quality screens',
            details: ['LCD/OLED', 'Touchscreen', 'Laminate/delaminate', 'Calibration']
          },
          port: { 
            title: 'Charging Port', 
            desc: 'Connector replacement, cleaning',
            details: ['Port cleaning', 'Replacement', 'Trace repair', 'Charging test']
          },
          modular: { 
            title: 'Modular Service', 
            desc: 'Camera, speaker, buttons, sensors',
            details: ['Camera', 'Speaker/Mic', 'Buttons', 'Sensors']
          },
          diagnostics: { 
            title: 'Diagnostics', 
            desc: 'Free with repair',
            details: ['Diagnostics', 'Analysis', 'Estimate', 'Action plan']
          }
        },
        popular: 'Popular',
        free: 'Free',
        from: 'from',
        price: 'Price',
        time: 'Time'
      },
      
      // Why Us Section
      whyUs: {
        title: 'Why NEXX',
        multibrand: { title: 'Multibrand', desc: 'Apple, Samsung, Xiaomi, Huawei and more' },
        fast: { title: 'Fast Service', desc: 'Most repairs in 30-60 minutes' },
        warranty: { title: '30-day warranty', desc: 'For all repairs' },
        honest: { title: 'Fair prices', desc: 'No hidden fees' },
        original: { title: 'Original parts', desc: 'Verified and tested' },
        diagnostic: { title: 'Free diagnostics', desc: 'Professional microscopy' },
        transparent: { title: 'Transparent', desc: 'Photo/video reports' },
        support: { title: 'Online support', desc: 'Post-repair consultations' }
      },
      
      // Calculator
      calculator: {
        title: 'Free Online Estimate',
        subtitle: 'Answer a few questions to learn the approximate price',
        selectBrand: 'Select brand:',
        selectDevice: 'Select type:',
        selectModel: 'Select model:',
        selectIssue: 'What\'s the problem?',
        back: 'Back',
        estimatedPrice: 'Estimated price',
        time: 'Repair time',
        noHiddenFees: 'No hidden fees'
      },
      
      // Booking Form
      booking: {
        title: 'Book repair',
        subtitle: 'Leave a request - we\'ll call you in 5 minutes',
        name: 'Your name',
        namePlaceholder: 'John',
        phone: 'Phone',
        phonePlaceholder: '+40 XXX XXX XXX',
        device: 'Device',
        devicePlaceholder: 'Choose device',
        problem: 'Problem description',
        problemPlaceholder: 'Not charging, broken screen...',
        submit: 'Send request',
        submitting: 'Sending...',
        success: 'Thank you! We will call you soon',
      },
      
      // Contact
      contact: {
        title: 'Contact us',
        hours: 'Working hours: Mon-Fri 10:00-19:00',
        address: 'Bucharest, Str. Victoriei 15',
        phone: '+40 721 234 567',
        email: 'info@nexx.ro',
      },
      
      // Footer
      footer: {
        company: 'Company',
        about: 'About us',
        jobs: 'Jobs',
        services: 'Services',
        servicePhone: 'Phone repair',
        serviceLaptop: 'Laptop repair',
        info: 'Information',
        faq: 'FAQ',
        privacy: 'Privacy',
        terms: 'Terms',
        copyright: '© 2026 NEXX Service Center. All rights reserved.',
        security: 'Secure Site • SSL Encrypted'
      }
    }
  };
  
  // ============================================
  // I18N CLASS
  // ============================================
  
  class I18N {
    constructor() {
      this.currentLang = this.detectLanguage();
      this.listeners = [];
      this.init();
    }
    
    init() {
      // Додаємо глобальну функцію t() для сумісності
      window.t = (key) => this.t(key);
      
      // Оновлюємо HTML атрибут lang
      document.documentElement.lang = this.currentLang;
    }
    
    detectLanguage() {
      const saved = localStorage.getItem('nexx_lang');
      if (saved && translations[saved]) return saved;
      return 'ro'; // Default Romanian
    }
    
    setLanguage(lang) {
      if (!translations[lang]) return false;
      
      this.currentLang = lang;
      localStorage.setItem('nexx_lang', lang);
      document.documentElement.lang = lang;
      
      this.updatePageTranslations();
      this.notifyListeners();
      
      // Перезагружаем после обновления
      setTimeout(() => {
        window.location.reload();
      }, 150);
      
      return true;
    }
    
    updatePageTranslations() {
      // Обновляем все элементы с data-translate атрибутом
      document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        const translated = this.t(key);
        if (translated && translated !== key) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            if (el.getAttribute('placeholder')) {
              el.placeholder = translated;
            } else {
              el.value = translated;
            }
          } else {
            el.textContent = translated;
          }
        }
      });
    }
    
    t(key) {
      const keys = key.split('.');
      let value = translations[this.currentLang];
      
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
      
      return value || key;
    }
    
    getAvailableLanguages() {
      return Object.values(translations).map(t => ({
        code: t.code,
        name: t.name,
        flag: t.flag
      }));
    }
    
    getCurrentLanguage() {
      return {
        code: this.currentLang,
        ...translations[this.currentLang]
      };
    }
    
    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }
    
    notifyListeners() {
      this.listeners.forEach(l => l(this.currentLang));
    }
  }
  
  // ============================================
  // LANGUAGE SWITCHER COMPONENT
  // ============================================
  
  const LanguageSwitcher = ({ isScrolled = false }) => {
    const h = React.createElement;
    const [currentLang, setCurrentLang] = React.useState(window.i18n.getCurrentLanguage());
    const [isOpen, setIsOpen] = React.useState(false);
    
    React.useEffect(() => {
      return window.i18n.subscribe((lang) => {
        setCurrentLang(window.i18n.getCurrentLanguage());
      });
    }, []);
    
    const languages = window.i18n.getAvailableLanguages();
    const bgColor = isScrolled ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-white/20 hover:bg-white/30 text-white';
    
    return h('div', { className: 'relative' },
      h('button', {
        onClick: () => setIsOpen(!isOpen),
        className: `${bgColor} px-2 py-1 rounded-lg transition-all duration-300 active:scale-95 focus:outline-none flex items-center gap-1 text-sm font-medium`,
        title: `${currentLang.name} • Click to change`
      },
        h('span', null, currentLang.code.toUpperCase()),
        h('i', { className: `fas fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}` })
      ),
      
      isOpen && h('div', { 
        className: `absolute top-full right-0 mt-2 bg-gray-900 rounded-lg shadow-2xl overflow-hidden min-w-[200px] z-50 border border-gray-700`,
        onClick: () => setIsOpen(false)
      },
        ...languages.map((lang, idx) => h('button', {
          key: lang.code,
          onClick: () => window.i18n.setLanguage(lang.code),
          className: `w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-800 transition text-left ${
            lang.code === currentLang.code ? 'bg-gray-700 text-white' : 'text-gray-300'
          } ${idx > 0 ? 'border-t border-gray-700' : ''}`,
        },
          h('span', { className: 'text-lg' }, lang.flag),
          h('div', { className: 'flex-1 truncate' },
            h('div', { className: 'font-medium truncate' }, lang.name)
          ),
          lang.code === currentLang.code && h('i', { className: 'fas fa-check text-green-500 ml-auto flex-shrink-0' })
        ))
      )
    );
  };
  
  // ============================================
  // EXPORT TO GLOBAL
  // ============================================
  
  window.i18n = new I18N();
  window.LanguageSwitcher = LanguageSwitcher;
  
  console.log('✅ NEXX i18n ПОЛНА система загружена -', window.i18n.getCurrentLanguage().name);
})();
