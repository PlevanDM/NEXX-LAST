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
        calculator: 'Калькулятор',
        booking: 'Замовити',
        contacts: 'Контакти',
        serviceMod: 'Service Mod',
        logout: 'Вийти',
        search: 'Пошук',
      },
      
      // Hero Section
      hero: {
        title: 'Ремонт iPhone, MacBook, Samsung',
        subtitle: 'Сервіс 30-60 хв • Гарантія 30 днів',
        description: 'Професійний ремонт Apple, Samsung, Xiaomi, Huawei. Безкоштовна діагностика. Оригінальні запчастини.',
      },
      
      // Prices
      prices: {
        from: 'від',
        free: 'БЕЗКОШТОВНО',
        startingPrice: '50 lei',
        noHiddenFees: 'Без прихованих платежів',
        calculator: 'Безкоштовний онлайн калькулятор'
      },
      
      // CTA Buttons
      buttons: {
        calculate: 'Розрахувати ціну',
        bookRepair: 'Замовити ремонт',
        call: 'Дзвонити',
        order: 'Замовити',
        book: 'Замовити',
        submit: 'Відправити',
        send: 'Відправити',
        next: 'Далі',
        prev: 'Назад',
        close: 'Закрити',
        callBack: 'Передзвоніть мені',
        freeDiagnostic: 'Безкоштовна діагностика!',
        freeLabel: '🎁 БЕЗКОШТОВНО',
      },
      
      // Callback Modal
      callback: {
        title: 'Передзвоніть мені',
        aiCalls: '🤖 AI передзвонить за 10 секунд!',
        bonus: '🎁 Бонус: БЕЗКОШТОВНА діагностика для онлайн-замовлень!',
        phone: 'Телефон *',
        name: "Ім'я",
        device: 'Пристрій',
        problem: 'Проблема',
        sending: 'Відправляємо...',
        submit: 'Надіслати запит',
        orCall: 'або зателефонуйте: ',
        thanks: 'Дякуємо!',
        callingNow: '📞 AI передзвонить зараз...',
        confirmDetails: 'Наш віртуальний асистент зв\'яжеться з вами за кілька секунд для підтвердження.',
        freeIncluded: '🎁 Безкоштовна діагностика включена в замовлення!',
        close: 'Закрити',
      },
      
      // Services Section
      services: {
        title: 'Послуги Ремонту',
        subtitle: 'Мультибрендний сервіс з сертифікованими фахівцями',
        items: {
          battery: { 
            title: 'Ремонт Батарей', 
            desc: 'Заміна + відновлення акумуляторів',
            detailsText: 'Оригінальні батареї та преміум якість. Тестування ємності. Гарантія.',
            details: ['Заміна батарей', 'Відновлення ємності', 'Калібрування BMS', 'Тестування'],
            subServices: [
              { name: 'iPhone 12-16', price: '150-250 lei', time: '30 хв' },
              { name: 'iPhone SE/11', price: '100-150 lei', time: '30 хв' },
              { name: 'Samsung S/Note', price: '120-200 lei', time: '45 хв' },
              { name: 'MacBook Pro', price: '400-700 lei', time: '1-2 год' },
              { name: 'iPad', price: '200-350 lei', time: '1 год' }
            ]
          },
          board: { 
            title: 'Ремонт Плат', 
            desc: 'Пайка IC, BGA ребол, ремонт доріжок',
            detailsText: 'Ремонт на рівні компонентів. Діагностика під мікроскопом. BGA ребол.',
            details: ['Пайка IC', 'BGA ребол', 'Ремонт доріжок', 'Пошкодження водою'],
            subServices: [
              { name: 'Reballing CPU/GPU', price: '300-600 lei', time: '2-4 год' },
              { name: 'Ремонт доріжок', price: '150-400 lei', time: '1-3 год' },
              { name: 'Заміна IC', price: '200-500 lei', time: '1-2 год' },
              { name: 'Пошкодження водою', price: '250-700 lei', time: '2-8 год' },
              { name: 'Діагностика', price: '50-100 lei', time: '30 хв' }
            ]
          },
          display: { 
            title: 'Заміна Дисплею', 
            desc: 'Оригінальні або якісні екрани',
            detailsText: 'Оригінальні, відновлені або сумісні преміум. Гарантія від битих пікселів.',
            details: ['LCD/OLED', 'Сенсор', 'Ламінування', 'Калібрування'],
            subServices: [
              { name: 'iPhone 14-16 OLED', price: '450-900 lei', time: '45 хв' },
              { name: 'iPhone 12/13 OLED', price: '300-550 lei', time: '45 хв' },
              { name: 'Samsung AMOLED', price: '350-800 lei', time: '1 год' },
              { name: 'MacBook Retina', price: '1200-2500 lei', time: '2-3 год' },
              { name: 'iPad Display', price: '400-900 lei', time: '1-2 год' }
            ]
          },
          port: { 
            title: 'Порт Зарядки', 
            desc: 'Заміна конектора, очищення',
            detailsText: 'Заміна конектора. Очищення окислення. Ремонт доріжок плати.',
            details: ['Очищення порту', 'Заміна', 'Ремонт доріжок', 'Тестування зарядки'],
            subServices: [
              { name: 'iPhone Lightning', price: '100-180 lei', time: '30-45 хв' },
              { name: 'iPhone USB-C', price: '150-250 lei', time: '45 хв' },
              { name: 'Samsung USB-C', price: '80-150 lei', time: '30 хв' },
              { name: 'MacBook USB-C', price: '200-400 lei', time: '1-2 год' },
              { name: 'Очищення окислення', price: '30-60 lei', time: '15 хв' }
            ]
          },
          modular: { 
            title: 'Модульний Сервіс', 
            desc: 'Камера, динамік, кнопки, датчики',
            detailsText: 'Заміна модулів: камера, динамік, кнопка Home, кнопка живлення, шлейфи.',
            details: ['Камера', 'Динамік/Мікрофон', 'Кнопки', 'Датчики'],
            subServices: [
              { name: 'Основна камера', price: '150-400 lei', time: '30-60 хв' },
              { name: 'Фронтальна камера', price: '80-200 lei', time: '30 хв' },
              { name: 'Динамік/Мікрофон', price: '60-150 lei', time: '20-40 хв' },
              { name: 'Кнопки/Датчики', price: '80-200 lei', time: '30-60 хв' },
              { name: 'Face ID/Touch ID', price: '200-500 lei', time: '1 год' }
            ]
          },
          diagnostics: { 
            title: 'Калькулятор Ціни', 
            desc: 'Миттєва оцінка + діагностика',
            detailsText: 'Дайте відповіді на питання та дізнайтеся точну ціну. Діагностика для ймовірної причини.',
            details: ['Миттєва ціна', 'Діагностика', 'Всі марки', 'Онлайн 24/7']
          }
        },
        popular: 'Популярно',
        free: 'Безкоштовно',
        from: 'від',
        price: 'Ціна',
        time: 'Час',
        specs: {
          battery: ['Оригінальні батареї', 'Гарантія 12 місяців', 'Тест ємності', 'Калібрування BMS', 'Преміум якість', 'Регенерація елементів'],
          board: ['Мікроскоп 45x', 'BGA реболінг', 'Пайка IC', 'Діагностика', 'Професійна станція', 'Оригінальні компоненти'],
          display: ['Оригінальний OLED', 'Преміум LCD', 'Гарантія на битий піксель', 'Сенсорний екран', 'Ламінування', 'Калібрування True Tone'],
          port: ['Оригінальні роз\'єми', 'Професійна чистка', 'Тест зарядки', 'Ремонт доріжок', 'Новий шлейф', 'Гарантія 6 місяців'],
          modular: ['Оригінальні модулі', 'Тест HD камери', 'Калібрування аудіо', 'Перевірені сенсори', 'Ремонт Face ID', 'Парінг Touch ID']
        }
      },
      
      // Gallery
      gallery: {
        title: 'Галерея',
        recentWorks: 'Останні роботи',
        works: {
          displayOLED: 'Заміна OLED дисплею',
          boardWater: 'Ремонт плати - пошкодження водою',
          reballingDisplay: 'Реболінг CPU + дисплей',
          batteryPort: 'Заміна батареї + порту',
          faceIdCamera: 'Face ID + камера'
        },
        results: {
          likeNew: 'Як новий',
          functional: 'Функціональний 100%',
          satisfied: 'Клієнт задоволений',
          warranty: 'Гарантія 12 місяців',
          repaired: 'Відремонтовано за 2 години'
        }
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
      
      // Work Process Gallery
      gallery: {
        title: 'Наш Робочий Процес',
        subtitle: 'Професійне обладнання та сертифіковані фахівці',
        items: {
          tools: 'Професійні інструменти для точного ремонту',
          battery: 'Заміна батареї з тестуванням якості',
          screen: 'Ремонт екранів під мікроскопом',
          storefront: 'Наш сервісний центр NEXX GSM'
        }
      },
      
      // About/Office Section
      office: {
        title: 'Наш Сервісний Центр',
        subtitle: 'Професійний ремонт техніки в центрі Бухареста',
        address: 'Str. Victoriei 15, București',
        visit: 'Відвідайте нас'
      },
      
      // Calculator
      calculator: {
        calculator: 'Вартість ремонту',
        title: 'Приблизна вартість ремонту',
        subtitle: 'Дайте відповіді на кілька запитань, щоб дізнатись приблизну ціну',
        description: 'Дайте відповіді на кілька запитань, щоб дізнатись приблизну ціну',
        selectBrand: 'Виберіть марку:',
        selectDevice: 'Виберіть тип:',
        selectModel: 'Виберіть модель:',
        selectIssue: 'Яка проблема?',
        back: 'Назад',
        estimatedPrice: 'Приблизна ціна',
        time: 'Час ремонту',
        noHiddenFees: 'Без прихованих витрат',
        otherBrands: 'Інші бренди',
        disclaimer: 'Фінальна ціна може відрізнятись. Безкоштовна діагностика.',
        devicePhone: 'Телефон',
        deviceTablet: 'Планшет',
        deviceLaptop: 'Ноутбук',
        deviceWatch: 'Смарт-годинник',
        popular: 'Популярно',
        gallery: 'Галерея',
      },
      
      // Booking Form
      booking: {
        title: 'Замовити ремонт',
        subtitle: 'Залиште заявку - ми передзвонимо протягом 5 хвилин',
        form: {
          name: "Ваше ім'я",
          namePlaceholder: 'Олександр',
          phone: 'Телефон',
          phonePlaceholder: '+40 XXX XXX XXX',
          device: 'Пристрій',
          devicePlaceholder: 'Оберіть пристрій',
          problem: 'Опис проблеми',
          problemPlaceholder: 'Не заряджається, тріснутий екран...',
          submit: 'Відправити заявку',
          submitting: 'Відправляємо...'
        },
        success: {
          title: 'Заявка відправлена!',
          message: 'Ми зв\'яжемося з вами найближчим часом',
          newRequest: 'Нова заявка'
        },
        errors: {
          nameRequired: 'Ім\'я обов\'язкове (мін. 2 символи)',
          phoneInvalid: 'Телефон недійсний',
          deviceRequired: 'Виберіть пристрій',
          submitError: 'Помилка відправки. Спробуйте ще раз або зателефонуйте: +40 721 234 567'
        }
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
        skipToContent: 'Перейти до змісту',
        ariaLabel: 'Головна секція',
        tagline: 'Професійний ремонт техніки. Досвід 10+ років',
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
        copyright: 'NEXX Service Center. Всі права захищені.',
        security: 'Безпечний сайт • SSL шифрування'
      },
      
      // Quick Actions (Floating Menu)
      quickActions: {
        home: 'На головну',
        calculator: 'Калькулятор',
        serviceMod: 'Service Mod',
        call: 'Дзвінок',
        telegram: 'Telegram',
        close: 'Закрити',
        quickMenu: 'Швидке меню'
      },
      // Service Mod
      serviceMod: {
        enterPin: 'Введіть PIN для доступу',
        checking: 'Перевірка...',
        access: 'Доступ',
        restricted: '🔒 Доступ обмежений для авторизованого персоналу'
      },
      // PWA Install
      pwa: {
        installTitle: 'NEXX GSM',
        installSubtitle: 'Додати на головний екран',
        installButton: 'Додати',
        installed: '🎉 NEXX GSM встановлено!'
      },
      meta: { title: 'Ремонт iPhone, MacBook, Samsung Київ | Швидкий Сервіс 30 хв | NEXX ⭐' }
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
        calculator: 'Calculator',
        booking: 'Comandă',
        contacts: 'Contacte',
        serviceMod: 'Service Mod',
        logout: 'Ieșire',
        search: 'Căutare',
      },
      
      // Hero Section
      hero: {
        title: 'Reparații iPhone, MacBook, Samsung',
        subtitle: 'Service 30-60 min • Garanție 30 zile',
        description: 'Service profesional Apple, Samsung, Xiaomi, Huawei. Diagnostic gratuit. Piese originale.',
      },
      
      // Prices
      prices: {
        from: 'de la',
        free: 'GRATUIT',
        startingPrice: '50 lei',
        noHiddenFees: 'Fără costuri ascunse',
        calculator: 'Calculator gratuit online'
      },
      
      // CTA Buttons
      buttons: {
        calculate: 'Calculează prețul',
        bookRepair: 'Comandă reparație',
        call: 'Sună acum',
        order: 'Comandă',
        book: 'Comandă',
        submit: 'Trimite',
        send: 'Trimite cererea',
        next: 'Următorul',
        prev: 'Înapoi',
        close: 'Închide',
        callBack: 'Sună-mă înapoi',
        freeDiagnostic: 'Diagnostic gratuit inclus!',
        freeLabel: '🎁 GRATUIT',
      },
      
      // Callback Modal
      callback: {
        title: 'Sună-mă înapoi',
        aiCalls: '🤖 AI vă sună în 10 secunde!',
        bonus: '🎁 Bonus: Diagnostic GRATUIT pentru comenzile online!',
        phone: 'Telefon *',
        name: 'Nume',
        device: 'Dispozitiv',
        problem: 'Problemă',
        sending: 'Se trimite...',
        submit: 'Trimite cererea',
        orCall: 'sau sunați direct: ',
        thanks: 'Mulțumim!',
        callingNow: '📞 AI vă sună acum...',
        confirmDetails: 'Asistentul nostru virtual vă va contacta în câteva secunde pentru a confirma detaliile.',
        freeIncluded: '🎁 Diagnostic GRATUIT inclus în comandă!',
        close: 'Închide',
      },
      
      // Services Section
      services: {
        title: 'Ce reparăm',
        subtitle: 'Apple, Samsung, Xiaomi, Huawei - toate sub un singur acoperiș',
        items: {
          battery: { 
            title: 'Reparații Baterii', 
            desc: 'Înlocuire + regenerare acumulatori',
            detailsText: 'Baterii originale și calitate premium. Testare capacitate. Garanție.',
            details: ['Înlocuire baterie', 'Regenerare celule', 'Calibrare BMS', 'Test capacitate'],
            subServices: [
              { name: 'iPhone 12-16', price: '150-250 lei', time: '30 min' },
              { name: 'iPhone SE/11', price: '100-150 lei', time: '30 min' },
              { name: 'Samsung S/Note', price: '120-200 lei', time: '45 min' },
              { name: 'MacBook Pro', price: '400-700 lei', time: '1-2 ore' },
              { name: 'iPad', price: '200-350 lei', time: '1 oră' }
            ]
          },
          board: { 
            title: 'Reparații Plăci', 
            desc: 'Lipire IC, BGA reballing, reparare piste',
            detailsText: 'Reparații la nivel de componentă. Diagnostic sub microscop. BGA reballing.',
            details: ['Lipire IC', 'BGA reballing', 'Reparare piste', 'Deteriorare prin apă'],
            subServices: [
              { name: 'Reballing CPU/GPU', price: '300-600 lei', time: '2-4 ore' },
              { name: 'Reparare piste', price: '150-400 lei', time: '1-3 ore' },
              { name: 'Înlocuire IC', price: '200-500 lei', time: '1-2 ore' },
              { name: 'Deteriorare apă', price: '250-700 lei', time: '2-8 ore' },
              { name: 'Diagnostic avansat', price: '50-100 lei', time: '30 min' }
            ]
          },
          display: { 
            title: 'Înlocuire Display', 
            desc: 'Ecrane originale sau de calitate',
            subServices: [
              { name: 'iPhone 14-16 OLED', price: '450-900 lei', time: '45 min' },
              { name: 'iPhone 12/13 OLED', price: '300-550 lei', time: '45 min' },
              { name: 'Samsung AMOLED', price: '350-800 lei', time: '1 oră' },
              { name: 'MacBook Retina', price: '1200-2500 lei', time: '2-3 ore' },
              { name: 'iPad Display', price: '400-900 lei', time: '1-2 ore' }
            ],
            detailsText: 'Display-uri original, refurbished sau compatibil premium. Garanție dead pixel.',
            details: ['LCD/OLED', 'Touchscreen', 'Laminate/delaminate', 'Calibrare']
          },
          port: { 
            title: 'Port Încărcare', 
            desc: 'Înlocuire conector, curățare',
            detailsText: 'Înlocuire conector. Curățare oxidare. Reparare piste placa.',
            details: ['Curățare port', 'Înlocuire', 'Reparare piste', 'Testare încărcare']
          },
          modular: { 
            title: 'Service Modular', 
            desc: 'Cameră, difuzor, butoane, senzori',
            detailsText: 'Înlocuire module: cameră, speaker, home button, power button, flex-uri.',
            details: ['Cameră foto', 'Speaker/Mic', 'Butoane', 'Senzori']
          },
          diagnostics: { 
            title: 'Calculator Preț', 
            desc: 'Estimare instant + diagnostic',
            detailsText: 'Răspundeți la întrebări și aflați prețul exact. Diagnostic pentru cauza probabilă.',
            details: ['Preț instant', 'Diagnostic', 'Toate mărcile', 'Online 24/7']
          }
        },
        popular: 'Popular',
        free: 'Gratuit',
        from: 'de la',
        price: 'Preț',
        time: 'Timp',
        specs: {
          battery: ['Baterii originale', 'Garanție 12 luni', 'Test capacitate', 'Calibrare BMS', 'Premium quality', 'Regenerare celule'],
          board: ['Microscop 45x', 'BGA reballing', 'Lipire IC', 'Diagnostic', 'Stație profesională', 'Componente originale'],
          display: ['OLED Original', 'LCD Premium', 'Garanție dead pixel', 'Touchscreen', 'Laminare', 'Calibrare True Tone'],
          port: ['Conectori originali', 'Curățare profesională', 'Test încărcare', 'Reparare piste', 'Flex cablu nou', 'Garanție 6 luni'],
          modular: ['Module originale', 'Cameră HD test', 'Audio calibrare', 'Senzori verificați', 'Face ID repair', 'Touch ID pairing']
        }
      },
      
      // Gallery
      gallery: {
        title: 'Galerie',
        recentWorks: 'Lucrări Recente',
        works: {
          displayOLED: 'Înlocuire display OLED',
          boardWater: 'Reparație placă - deteriorare apă',
          reballingDisplay: 'Reballing CPU + display',
          batteryPort: 'Înlocuire baterie + port',
          faceIdCamera: 'Face ID + cameră'
        },
        results: {
          likeNew: 'Ca nou',
          functional: 'Funcțional 100%',
          satisfied: 'Client mulțumit',
          warranty: 'Garanție 12 luni',
          repaired: 'Reparat în 2 ore'
        }
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
      
      // Work Process Gallery
      gallery: {
        title: 'Procesul Nostru de Lucru',
        subtitle: 'Echipament profesional și tehnicieni certificați',
        items: {
          tools: 'Instrumente profesionale pentru reparații precise',
          battery: 'Înlocuire baterie cu testare calitate',
          screen: 'Reparații ecrane sub microscop',
          storefront: 'Centrul nostru de service NEXX GSM'
        }
      },
      
      // About/Office Section
      office: {
        title: 'Centrul Nostru de Service',
        subtitle: 'Reparații profesionale în centrul Bucureștiului',
        address: 'Str. Victoriei 15, București',
        visit: 'Vizitează-ne'
      },
      
      // Calculator
      calculator: {
        calculator: 'Cost reparație',
        title: 'Cost aproximativ reparație',
        subtitle: 'Răspundeți la câteva întrebări pentru a afla prețul aproximativ',
        description: 'Răspundeți la câteva întrebări pentru a afla prețul aproximativ',
        selectBrand: 'Alegeți marca:',
        selectDevice: 'Alegeți tipul:',
        selectModel: 'Alegeți modelul:',
        selectIssue: 'Ce problemă aveți?',
        back: 'Înapoi',
        estimatedPrice: 'Preț estimat',
        time: 'Timp reparație',
        noHiddenFees: 'Fără taxe ascunse',
        otherBrands: 'Alte mărci',
        disclaimer: 'Prețul final poate varia. Diagnostic gratuit.',
        devicePhone: 'Telefon',
        deviceTablet: 'Tabletă',
        deviceLaptop: 'Laptop',
        deviceWatch: 'Smartwatch',
        popular: 'Popular',
        gallery: 'Galerie',
      },
      
      // Booking Form
      booking: {
        title: 'Comandă reparație',
        subtitle: 'Lasă o cerere - te sunăm în 5 minute',
        form: {
          name: 'Numele tău',
          namePlaceholder: 'Alexandru',
          phone: 'Telefon',
          phonePlaceholder: '+40 XXX XXX XXX',
          device: 'Dispozitiv',
          devicePlaceholder: 'Alege dispozitivul',
          problem: 'Descriere problemă',
          problemPlaceholder: 'Nu se încarcă, ecran spart...',
          submit: 'Trimite cererea',
          submitting: 'Trimitere...'
        },
        success: {
          title: 'Cerere trimisă!',
          message: 'Te vom suna în curând',
          newRequest: 'Cerere nouă'
        },
        errors: {
          nameRequired: 'Numele este obligatoriu (min. 2 caractere)',
          phoneInvalid: 'Telefonul este invalid',
          deviceRequired: 'Selectați dispozitivul',
          submitError: 'Eroare la trimitere. Încercați din nou sau sunați: +40 721 234 567'
        }
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
        skipToContent: 'Treci la conținut',
        ariaLabel: 'Secțiunea principală',
        tagline: 'Service profesional multibrand. Garanție 30 zile. Diagnostic gratuit. București.',
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
        copyright: 'NEXX Service Center. Toate drepturile rezervate.',
        security: 'Site Securizat • SSL Criptat'
      },
      
      // Quick Actions (Floating Menu)
      quickActions: {
        home: 'Acasă',
        calculator: 'Calculator',
        serviceMod: 'Service Mod',
        call: 'Apel',
        telegram: 'Telegram',
        close: 'Închide',
        quickMenu: 'Meniu rapid'
      },
      // Service Mod
      serviceMod: {
        enterPin: 'Introduceți PIN-ul pentru acces',
        checking: 'Verificare...',
        access: 'Accesează',
        restricted: '🔒 Acces restricționat pentru personal autorizat'
      },
      // PWA Install
      pwa: {
        installTitle: 'NEXX GSM',
        installSubtitle: 'Adaugă pe ecranul principal',
        installButton: 'Adaugă',
        installed: '🎉 NEXX GSM instalat!'
      },
      meta: { title: 'Reparații iPhone, MacBook, Samsung București | Service Rapid 30 min | NEXX ⭐' }
    },
    
    // ============================================
    // РУССКИЙ
    // ============================================
    ru: {
      code: 'ru',
      name: 'Русский',
      flag: '⚪', // Білий без прапора
      direction: 'ltr',
      
      // Navigation & Header
      nav: {
        home: 'Главная',
        services: 'Услуги',
        calculator: 'Калькулятор',
        booking: 'Заказать',
        contacts: 'Контакты',
        serviceMod: 'Service Mod',
        logout: 'Выйти',
        search: 'Поиск',
      },
      
      // Hero Section
      hero: {
        title: 'Ремонт iPhone, MacBook, Samsung',
        subtitle: 'Сервис 30-60 мин • Гарантия 30 дней',
        description: 'Профессиональный ремонт Apple, Samsung, Xiaomi, Huawei. Бесплатная диагностика. Оригинальные запчасти.',
      },
      
      // Prices
      prices: {
        from: 'от',
        free: 'БЕСПЛАТНО',
        startingPrice: '50 lei',
        noHiddenFees: 'Без скрытых платежей',
        calculator: 'Бесплатный онлайн калькулятор'
      },
      
      // CTA Buttons
      buttons: {
        calculate: 'Рассчитать цену',
        bookRepair: 'Заказать ремонт',
        call: 'Позвонить сейчас',
        order: 'Заказать',
        book: 'Заказать',
        submit: 'Отправить',
        send: 'Отправить запрос',
        next: 'Далее',
        prev: 'Назад',
        close: 'Закрыть',
        callBack: 'Перезвоните мне',
        freeDiagnostic: 'Бесплатная диагностика включена!',
        freeLabel: '🎁 БЕСПЛАТНО',
      },
      
      // Callback Modal
      callback: {
        title: 'Перезвоните мне',
        aiCalls: '🤖 AI перезвонит через 10 секунд!',
        bonus: '🎁 Бонус: БЕСПЛАТНАЯ диагностика для онлайн-заказов!',
        phone: 'Телефон *',
        name: 'Имя',
        device: 'Устройство',
        problem: 'Проблема',
        sending: 'Отправляется...',
        submit: 'Отправить запрос',
        orCall: 'или позвоните напрямую: ',
        thanks: 'Спасибо!',
        callingNow: '📞 AI перезванивает сейчас...',
        confirmDetails: 'Наш виртуальный ассистент свяжется с вами через несколько секунд для подтверждения деталей.',
        freeIncluded: '🎁 Бесплатная диагностика включена в заказ!',
        close: 'Закрыть',
      },
      
      // Services Section
      services: {
        title: 'Что мы ремонтируем',
        subtitle: 'Все бренды под одной крышей',
        items: {
          battery: { 
            title: 'Ремонт Батарей', 
            desc: 'Замена + восстановление аккумуляторов',
            detailsText: 'Оригинальные батареи и премиум качество. Тестирование ёмкости. Гарантия.',
            details: ['Замена батарей', 'Восстановление ёмкости', 'Калибровка BMS', 'Тестирование'],
            subServices: [
              { name: 'iPhone 12-16', price: '150-250 lei', time: '30 мин' },
              { name: 'iPhone SE/11', price: '100-150 lei', time: '30 мин' },
              { name: 'Samsung S/Note', price: '120-200 lei', time: '45 мин' },
              { name: 'MacBook Pro', price: '400-700 lei', time: '1-2 часа' },
              { name: 'iPad', price: '200-350 lei', time: '1 час' }
            ]
          },
          board: { 
            title: 'Ремонт Плат', 
            desc: 'Пайка IC, BGA ребол, ремонт дорожек',
            detailsText: 'Ремонт на уровне компонентов. Диагностика под микроскопом. BGA ребол.',
            details: ['Пайка IC', 'BGA ребол', 'Ремонт дорожек', 'Повреждение водой'],
            subServices: [
              { name: 'Reballing CPU/GPU', price: '300-600 lei', time: '2-4 часа' },
              { name: 'Ремонт дорожек', price: '150-400 lei', time: '1-3 часа' },
              { name: 'Замена IC', price: '200-500 lei', time: '1-2 часа' },
              { name: 'Повреждение водой', price: '250-700 lei', time: '2-8 часов' },
              { name: 'Диагностика', price: '50-100 lei', time: '30 мин' }
            ]
          },
          display: { 
            title: 'Замена Дисплея', 
            desc: 'Оригинальные или качественные экраны',
            detailsText: 'Оригинальные, восстановленные или совместимые премиум. Гарантия от битых пикселей.',
            details: ['LCD/OLED', 'Сенсор', 'Ламинирование', 'Калибровка'],
            subServices: [
              { name: 'iPhone 14-16 OLED', price: '450-900 lei', time: '45 мин' },
              { name: 'iPhone 12/13 OLED', price: '300-550 lei', time: '45 мин' },
              { name: 'Samsung AMOLED', price: '350-800 lei', time: '1 час' },
              { name: 'MacBook Retina', price: '1200-2500 lei', time: '2-3 часа' },
              { name: 'iPad Display', price: '400-900 lei', time: '1-2 часа' }
            ]
          },
          port: { 
            title: 'Порт Зарядки', 
            desc: 'Замена коннектора, очистка',
            detailsText: 'Замена коннектора. Очистка окисления. Ремонт дорожек платы.',
            details: ['Очистка порта', 'Замена', 'Ремонт дорожек', 'Тестирование зарядки'],
            subServices: [
              { name: 'iPhone Lightning', price: '100-180 lei', time: '30-45 мин' },
              { name: 'iPhone USB-C', price: '150-250 lei', time: '45 мин' },
              { name: 'Samsung USB-C', price: '80-150 lei', time: '30 мин' },
              { name: 'MacBook USB-C', price: '200-400 lei', time: '1-2 часа' },
              { name: 'Очистка окисления', price: '30-60 lei', time: '15 мин' }
            ]
          },
          modular: { 
            title: 'Модульный Сервис', 
            desc: 'Камера, динамик, кнопки, датчики',
            detailsText: 'Замена модулей: камера, динамик, кнопка Home, кнопка питания, шлейфы.',
            details: ['Камера', 'Динамик/Микрофон', 'Кнопки', 'Датчики'],
            subServices: [
              { name: 'Основная камера', price: '150-400 lei', time: '30-60 мин' },
              { name: 'Фронтальная камера', price: '80-200 lei', time: '30 мин' },
              { name: 'Динамик/Микрофон', price: '60-150 lei', time: '20-40 мин' },
              { name: 'Кнопки/Датчики', price: '80-200 lei', time: '30-60 мин' },
              { name: 'Face ID/Touch ID', price: '200-500 lei', time: '1 час' }
            ]
          },
          diagnostics: { 
            title: 'Калькулятор Цены', 
            desc: 'Мгновенная оценка + диагностика',
            detailsText: 'Ответьте на вопросы и узнайте точную цену. Диагностика для вероятной причины.',
            details: ['Мгновенная цена', 'Диагностика', 'Все марки', 'Онлайн 24/7']
          }
        },
        popular: 'Популярно',
        free: 'Бесплатно',
        from: 'от',
        price: 'Цена',
        time: 'Время',
        specs: {
          battery: ['Оригинальные батареи', 'Гарантия 12 месяцев', 'Тест ёмкости', 'Калибровка BMS', 'Премиум качество', 'Регенерация элементов'],
          board: ['Микроскоп 45x', 'BGA реболлинг', 'Пайка IC', 'Диагностика', 'Профессиональная станция', 'Оригинальные компоненты'],
          display: ['Оригинальный OLED', 'Премиум LCD', 'Гарантия на битый пиксель', 'Сенсорный экран', 'Ламинирование', 'Калибровка True Tone'],
          port: ['Оригинальные разъёмы', 'Профессиональная чистка', 'Тест зарядки', 'Ремонт дорожек', 'Новый шлейф', 'Гарантия 6 месяцев'],
          modular: ['Оригинальные модули', 'Тест HD камеры', 'Калибровка аудио', 'Проверенные сенсоры', 'Ремонт Face ID', 'П pairing Touch ID']
        }
      },
      
      // Gallery
      gallery: {
        title: 'Галерея',
        recentWorks: 'Последние работы',
        works: {
          displayOLED: 'Замена OLED дисплея',
          boardWater: 'Ремонт платы - повреждение водой',
          reballingDisplay: 'Реболлинг CPU + дисплей',
          batteryPort: 'Замена батареи + порта',
          faceIdCamera: 'Face ID + камера'
        },
        results: {
          likeNew: 'Как новый',
          functional: 'Функциональный 100%',
          satisfied: 'Клиент доволен',
          warranty: 'Гарантия 12 месяцев',
          repaired: 'Отремонтировано за 2 часа'
        }
      },
      
      // Why Us Section
      whyUs: {
        title: 'Почему выбирают NEXX',
        multibrand: { title: 'Мультибренд', desc: 'Apple, Samsung, Xiaomi, Huawei и другие' },
        fast: { title: 'Быстрый Сервис', desc: 'Большинство ремонтов за 30-60 минут' },
        warranty: { title: 'Гарантия 30 дней', desc: 'На все виды ремонта' },
        honest: { title: 'Честные цены', desc: 'Без скрытых платежей' },
        original: { title: 'Оригинальные детали', desc: 'Проверенные и протестированные' },
        diagnostic: { title: 'Диагностика бесплатна', desc: 'Профессиональная под микроскопом' },
        transparent: { title: 'Прозрачно', desc: 'Фото/видео отчёт ремонта' },
        support: { title: 'Онлайн поддержка', desc: 'Консультации после ремонта' }
      },
      
      // Work Process Gallery
      gallery: {
        title: 'Наш Рабочий Процесс',
        subtitle: 'Профессиональное оборудование и сертифицированные специалисты',
        items: {
          tools: 'Профессиональные инструменты для точного ремонта',
          battery: 'Замена батареи с тестированием качества',
          screen: 'Ремонт экранов под микроскопом',
          storefront: 'Наш сервисный центр NEXX GSM'
        }
      },
      
      // About/Office Section
      office: {
        title: 'Наш Сервисный Центр',
        subtitle: 'Профессиональный ремонт в центре Бухареста',
        address: 'Str. Victoriei 15, București',
        visit: 'Посетите нас'
      },
      
      // Calculator
      calculator: {
        calculator: 'Стоимость ремонта',
        title: 'Примерная стоимость ремонта',
        subtitle: 'Ответьте на несколько вопросов, чтобы узнать примерную цену',
        description: 'Ответьте на несколько вопросов, чтобы узнать примерную цену',
        selectBrand: 'Выберите марку:',
        selectDevice: 'Выберите тип:',
        selectModel: 'Выберите модель:',
        selectIssue: 'Какая у вас проблема?',
        back: 'Назад',
        estimatedPrice: 'Примерная цена',
        time: 'Время ремонта',
        noHiddenFees: 'Без скрытых платежей',
        otherBrands: 'Другие марки',
        disclaimer: 'Окончательная цена может отличаться. Бесплатная диагностика.',
        devicePhone: 'Телефон',
        deviceTablet: 'Планшет',
        deviceLaptop: 'Ноутбук',
        deviceWatch: 'Смарт-часы',
        popular: 'Популярно',
        gallery: 'Галерея',
      },
      
      // Booking Form
      booking: {
        title: 'Заказать ремонт',
        subtitle: 'Оставьте заявку - мы перезвоним через 5 минут',
        form: {
          name: 'Ваше имя',
          namePlaceholder: 'Александр',
          phone: 'Телефон *',
          phonePlaceholder: '+40 7XX XXX XXX',
          device: 'Устройство',
          devicePlaceholder: 'ex: iPhone 14 Pro, Samsung S24',
          problem: 'Проблема',
          problemPlaceholder: 'Опишите проблему...',
          submit: 'Отправить заявку',
          sending: 'Отправляется...',
          success: 'Спасибо! Мы перезвоним в ближайшее время',
          errors: {
            nameRequired: 'Имя обязательно (мин. 2 символа)',
            phoneInvalid: 'Телефон недействителен',
            deviceRequired: 'Выберите устройство'
          }
        }
      },
      
      // Contact Section
      contact: {
        title: 'Свяжитесь с нами',
        subtitle: 'Программа: Пн-Пт 10:00-19:00',
        address: 'București, Str. Victoriei 15',
        phone: '+40 721 234 567',
        email: 'info@nexx.ro',
        social: {
          telegram: 'Telegram',
          whatsapp: 'WhatsApp',
          instagram: 'Instagram'
        }
      },
      
      // Footer
      footer: {
        skipToContent: 'Перейти к содержимому',
        description: 'Профессиональный мультибрендовый сервис. Гарантия 30 дней. Бесплатная диагностика. Бухарест.',
        company: 'Компания',
        services: 'Услуги',
        info: 'Информация',
        about: 'О нас',
        contacts: 'Контакты',
        jobs: 'Вакансии',
        phoneRepair: 'Ремонт телефонов',
        laptopRepair: 'Ремонт ноутбуков',
        priceCalculator: 'Примерная стоимость ремонта',
        faq: 'FAQ',
        privacy: 'Конфиденциальность',
        terms: 'Условия',
        rights: '© 2026 NEXX Service Center. Все права защищены.',
        secure: 'Безопасный сайт',
        ssl: 'SSL Зашифрован'
      },
      
      // Quick Actions (Floating Menu)
      quickActions: {
        home: 'Главная',
        calculator: 'Калькулятор',
        serviceMod: 'Service Mod',
        call: 'Звонок',
        telegram: 'Telegram',
        close: 'Закрыть',
        quickMenu: 'Быстрое меню'
      },
      // Service Mod
      serviceMod: {
        enterPin: 'Введите PIN для доступа',
        checking: 'Проверка...',
        access: 'Доступ',
        restricted: '🔒 Доступ ограничен для авторизованного персонала'
      },
      // PWA Install
      pwa: {
        installTitle: 'NEXX GSM',
        installSubtitle: 'Добавить на главный экран',
        installButton: 'Добавить',
        installed: '🎉 NEXX GSM установлено!'
      },
      // Meta
      meta: {
        title: 'Ремонт iPhone, MacBook, Samsung Бухарест | Быстрый Сервис 30 мин | NEXX ⭐',
        description: 'Профессиональный сервис ремонта iPhone, MacBook, Samsung в Бухаресте ⭐ Гарантия 30 дней • Бесплатная диагностика • От 60 lei • Быстрый сервис 30-60 мин • Все сектора • Звоните: 0721 234 567'
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
        calculator: 'Calculator',
        booking: 'Book',
        contacts: 'Contact',
        serviceMod: 'Service Mod',
        logout: 'Logout',
        search: 'Search',
      },
      
      // Hero Section
      hero: {
        title: 'iPhone, MacBook, Samsung Repair',
        subtitle: '30-60 min service • 30-day warranty',
        description: 'Professional Apple, Samsung, Xiaomi, Huawei repair. Free diagnostics. Original parts.',
      },
      
      // Prices
      prices: {
        from: 'from',
        free: 'FREE',
        startingPrice: '50 lei',
        noHiddenFees: 'No hidden fees',
        calculator: 'Free online calculator'
      },
      
      // CTA Buttons
      buttons: {
        calculate: 'Calculate price',
        bookRepair: 'Book repair',
        call: 'Call now',
        order: 'Book',
        book: 'Book',
        submit: 'Send',
        send: 'Send request',
        next: 'Next',
        prev: 'Back',
        close: 'Close',
        callBack: 'Call me back',
        freeDiagnostic: 'Free diagnostic included!',
        freeLabel: '🎁 FREE',
      },
      
      // Callback Modal
      callback: {
        title: 'Call me back',
        aiCalls: '🤖 AI will call you in 10 seconds!',
        bonus: '🎁 Bonus: FREE diagnostic for online orders!',
        phone: 'Phone *',
        name: 'Name',
        device: 'Device',
        problem: 'Problem',
        sending: 'Sending...',
        submit: 'Send request',
        orCall: 'or call directly: ',
        thanks: 'Thank you!',
        callingNow: '📞 AI is calling you now...',
        confirmDetails: 'Our virtual assistant will contact you in a few seconds to confirm details.',
        freeIncluded: '🎁 FREE diagnostic included with your order!',
        close: 'Close',
      },
      
      // Services Section
      services: {
        title: 'What we repair',
        subtitle: 'All brands under one roof',
        items: {
          battery: { 
            title: 'Battery Repair', 
            desc: 'Replacement + recovery',
            detailsText: 'Original batteries and premium quality. Capacity testing. Warranty.',
            details: ['Battery replacement', 'Cell recovery', 'BMS calibration', 'Capacity test']
          },
          board: { 
            title: 'Board Repair', 
            desc: 'IC soldering, BGA reballing, trace repair',
            detailsText: 'Component-level repair. Diagnostic under microscope. BGA reballing.',
            details: ['IC soldering', 'BGA reballing', 'Trace repair', 'Water damage']
          },
          display: { 
            title: 'Display Replacement', 
            desc: 'Original or quality screens',
            detailsText: 'Original, refurbished or premium compatible displays. Dead pixel warranty.',
            details: ['LCD/OLED', 'Touchscreen', 'Laminate/delaminate', 'Calibration']
          },
          port: { 
            title: 'Charging Port', 
            desc: 'Connector replacement, cleaning',
            detailsText: 'Connector replacement. Oxidation cleaning. Board trace repair.',
            details: ['Port cleaning', 'Replacement', 'Trace repair', 'Charging test']
          },
          modular: { 
            title: 'Modular Service', 
            desc: 'Camera, speaker, buttons, sensors',
            detailsText: 'Module replacement: camera, speaker, home button, power button, flex cables.',
            details: ['Camera', 'Speaker/Mic', 'Buttons', 'Sensors']
          },
          diagnostics: { 
            title: 'Price Calculator', 
            desc: 'Instant estimate + diagnostics',
            detailsText: 'Answer questions and find out the exact price. Diagnostic for probable cause.',
            details: ['Instant price', 'Diagnostics', 'All brands', 'Online 24/7']
          }
        },
        popular: 'Popular',
        free: 'Free',
        from: 'from',
        price: 'Price',
        time: 'Time',
        specs: {
          battery: ['Original batteries', '12-month warranty', 'Capacity test', 'BMS calibration', 'Premium quality', 'Cell regeneration'],
          board: ['45x microscope', 'BGA reballing', 'IC soldering', 'Diagnostics', 'Professional station', 'Original components'],
          display: ['Original OLED', 'Premium LCD', 'Dead pixel warranty', 'Touchscreen', 'Lamination', 'True Tone calibration'],
          port: ['Original connectors', 'Professional cleaning', 'Charging test', 'Track repair', 'New flex cable', '6-month warranty'],
          modular: ['Original modules', 'HD camera test', 'Audio calibration', 'Verified sensors', 'Face ID repair', 'Touch ID pairing']
        }
      },
      
      // Gallery
      gallery: {
        title: 'Gallery',
        recentWorks: 'Recent Work',
        works: {
          displayOLED: 'OLED display replacement',
          boardWater: 'Board repair - water damage',
          reballingDisplay: 'CPU reballing + display',
          batteryPort: 'Battery + port replacement',
          faceIdCamera: 'Face ID + camera'
        },
        results: {
          likeNew: 'Like new',
          functional: '100% functional',
          satisfied: 'Satisfied customer',
          warranty: '12-month warranty',
          repaired: 'Repaired in 2 hours'
        }
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
      
      // Work Process Gallery - kept for compatibility
      workGallery: {
        title: 'Our Work Process',
        subtitle: 'Professional equipment and certified technicians',
        items: {
          tools: 'Professional tools for precise repairs',
          battery: 'Battery replacement with quality testing',
          screen: 'Screen repairs under microscope',
          storefront: 'Our NEXX GSM service center'
        }
      },
      
      // About/Office Section
      office: {
        title: 'Our Service Center',
        subtitle: 'Professional repairs in central Bucharest',
        address: 'Str. Victoriei 15, București',
        visit: 'Visit us'
      },
      
      // Calculator
      calculator: {
        calculator: 'Repair Cost',
        title: 'Approximate Repair Cost',
        subtitle: 'Answer a few questions to learn the approximate price',
        description: 'Answer a few questions to learn the approximate price',
        selectBrand: 'Select brand:',
        selectDevice: 'Select type:',
        selectModel: 'Select model:',
        selectIssue: 'What\'s the problem?',
        back: 'Back',
        estimatedPrice: 'Estimated price',
        time: 'Repair time',
        noHiddenFees: 'No hidden fees',
        otherBrands: 'Other brands',
        disclaimer: 'Final price may vary. Free diagnosis.',
        devicePhone: 'Phone',
        deviceTablet: 'Tablet',
        deviceLaptop: 'Laptop',
        deviceWatch: 'Smartwatch',
        popular: 'Popular',
        gallery: 'Gallery',
      },
      
      // Booking Form
      booking: {
        title: 'Book repair',
        subtitle: 'Leave a request - we\'ll call you in 5 minutes',
        form: {
          name: 'Your name',
          namePlaceholder: 'John',
          phone: 'Phone',
          phonePlaceholder: '+40 XXX XXX XXX',
          device: 'Device',
          devicePlaceholder: 'Choose device',
          problem: 'Problem description',
          problemPlaceholder: 'Not charging, broken screen...',
          submit: 'Send request',
          submitting: 'Sending...'
        },
        success: {
          title: 'Request sent!',
          message: 'We will call you soon',
          newRequest: 'New request'
        },
        errors: {
          nameRequired: 'Name is required (min. 2 characters)',
          phoneInvalid: 'Phone number is invalid',
          deviceRequired: 'Please select a device',
          submitError: 'Submission error. Please try again or call: +40 721 234 567'
        }
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
        skipToContent: 'Skip to content',
        ariaLabel: 'Main section',
        tagline: 'Professional multibrand repair. 30-day warranty. Free diagnosis. Bucharest.',
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
        copyright: 'NEXX Service Center. All rights reserved.',
        security: 'Secure Site • SSL Encrypted'
      },
      
      // Quick Actions (Floating Menu)
      quickActions: {
        home: 'Home',
        calculator: 'Calculator',
        serviceMod: 'Service Mod',
        call: 'Call',
        telegram: 'Telegram',
        close: 'Close',
        quickMenu: 'Quick menu'
      },
      // Service Mod
      serviceMod: {
        enterPin: 'Enter PIN for access',
        checking: 'Checking...',
        access: 'Access',
        restricted: '🔒 Restricted access for authorized personnel'
      },
      // PWA Install
      pwa: {
        installTitle: 'NEXX GSM',
        installSubtitle: 'Add to home screen',
        installButton: 'Add',
        installed: '🎉 NEXX GSM installed!'
      },
      meta: { title: 'iPhone, MacBook, Samsung Repair Bucharest | Fast Service 30 min | NEXX ⭐' }
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
      window.t = (key) => this.t(key);
      document.documentElement.lang = this.currentLang;
      const metaTitle = this.t('meta.title');
      if (metaTitle && metaTitle !== 'meta.title') document.title = metaTitle;
    }
    
    detectLanguage() {
      // 1. Проверяем URL параметр ?lang=
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang && translations[urlLang]) {
        localStorage.setItem('nexx_lang', urlLang);
        return urlLang;
      }
      
      // 2. Проверяем сохранённый язык
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
    
    t = (key) => {
      if (!this.currentLang || !translations[this.currentLang]) {
        console.warn('i18n: currentLang not set, using default "ro"');
        this.currentLang = 'ro';
      }
      
      const keys = key.split('.');
      let value = translations[this.currentLang];
      
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
      
      // Якщо value є undefined або null, повертаємо key
      // Але якщо value є порожнім рядком '', повертаємо його
      if (value === undefined || value === null) {
        return key;
      }
      return value;
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
  
  const LanguageSwitcher = ({ isScrolled = false, compact = false }) => {
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
    
    // Compact mode for mobile - just flag button
    if (compact) {
      return h('div', { className: 'relative' },
        h('button', {
          onClick: () => setIsOpen(!isOpen),
          className: `${bgColor} w-10 h-10 rounded-lg transition-all duration-300 active:scale-95 focus:outline-none flex items-center justify-center text-lg`,
          title: `${currentLang.name} • Натисніть для зміни`
        },
          h('span', null, currentLang.flag)
        ),
        
        isOpen && h('div', { 
          className: 'absolute top-full right-0 mt-2 bg-gray-900 rounded-xl shadow-2xl overflow-hidden min-w-[180px] z-50 border border-gray-700'
        },
          ...languages.map((lang, idx) => h('button', {
            key: lang.code,
            onClick: () => { window.i18n.setLanguage(lang.code); setIsOpen(false); },
            className: `w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition text-left ${
              lang.code === currentLang.code ? 'bg-gray-700 text-white' : 'text-gray-300'
            } ${idx > 0 ? 'border-t border-gray-700' : ''}`,
          },
            h('span', { className: 'text-xl' }, lang.flag),
            h('span', { className: 'font-medium' }, lang.name),
            lang.code === currentLang.code && h('i', { className: 'fas fa-check text-green-500 ml-auto' })
          ))
        )
      );
    }
    
    // Full mode for desktop
    return h('div', { className: 'relative' },
      h('button', {
        onClick: () => setIsOpen(!isOpen),
        className: `${bgColor} px-3 py-2 rounded-lg transition-all duration-300 active:scale-95 focus:outline-none flex items-center gap-2 text-sm font-medium`,
        title: `${currentLang.name} • Click to change`
      },
        h('span', { className: 'text-base' }, currentLang.flag),
        h('span', null, currentLang.code.toUpperCase()),
        h('i', { className: `fas fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}` })
      ),
      
      isOpen && h('div', { 
        className: 'absolute top-full right-0 mt-2 bg-gray-900 rounded-xl shadow-2xl overflow-hidden min-w-[200px] z-50 border border-gray-700'
      },
        ...languages.map((lang, idx) => h('button', {
          key: lang.code,
          onClick: () => { window.i18n.setLanguage(lang.code); setIsOpen(false); },
          className: `w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition text-left ${
            lang.code === currentLang.code ? 'bg-gray-700 text-white' : 'text-gray-300'
          } ${idx > 0 ? 'border-t border-gray-700' : ''}`,
        },
          h('span', { className: 'text-xl' }, lang.flag),
          h('div', { className: 'flex-1' },
            h('div', { className: 'font-medium' }, lang.name)
          ),
          lang.code === currentLang.code && h('i', { className: 'fas fa-check text-green-500 ml-auto' })
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
