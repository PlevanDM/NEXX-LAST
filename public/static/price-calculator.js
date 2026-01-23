/**
 * NEXX Modern Price Calculator v3.1
 * Современный калькулятор с дизайном от 21st.dev
 * Обновленный UI с градиентами, анимациями и улучшенным UX
 * + Full Error Protection
 */

(function() {
  'use strict';
  
  const h = React.createElement;
  
  // Check if Framer Motion is available
  const hasFramerMotion = typeof window !== 'undefined' && window.motion;
  
  // ============================================
  // ERROR BOUNDARY - Ловит все ошибки React
  // ============================================
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
      console.error('❌ Calculator Error:', error, errorInfo);
    }
    
    render() {
      if (this.state.hasError) {
        return h('div', { className: 'max-w-md mx-auto p-6 bg-zinc-900 border border-red-500/50 rounded-2xl text-center' },
          h('div', { className: 'w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center' },
            h('i', { className: 'fas fa-exclamation-triangle text-3xl text-red-400' })
          ),
          h('h3', { className: 'text-xl font-bold text-white mb-2' }, 'Oops! Ceva nu a mers bine'),
          h('p', { className: 'text-zinc-400 mb-4' }, 'A apărut o eroare. Vă rugăm reîncărcați pagina.'),
          h('button', {
            onClick: () => window.location.reload(),
            className: 'px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all'
          }, 'Reîncărcați pagina')
        );
      }
      return this.props.children;
    }
  }
  
  // ============================================
  // SAFE HELPERS - Безопасные функции
  // ============================================
  const safeGet = (obj, path, defaultValue = null) => {
    try {
      return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : defaultValue, obj);
    } catch {
      return defaultValue;
    }
  };
  
  const safeCall = (fn, ...args) => {
    try {
      return fn(...args);
    } catch (e) {
      console.warn('⚠️ Safe call error:', e);
      return null;
    }
  };
  
  const safeArray = (arr) => Array.isArray(arr) ? arr : [];
  
  const safeString = (str) => (typeof str === 'string') ? str : '';
  
  // Ціни по категоріях ремонтів (базові ціни) - 2026 România
  // Цены в RON (Romanian Lei) - обновлены на январь 2026
  const REPAIR_PRICES = {
    screen: { 
      phone: { min: 150, max: 600, avg: 350 },      // iPhone/Samsung flagship: 400-600, budget: 150-250
      tablet: { min: 200, max: 800, avg: 450 },     // iPad Pro: 600-800, iPad: 300-450
      laptop: { min: 350, max: 1500, avg: 800 },    // MacBook: 800-1500, Windows: 350-700
      watch: { min: 200, max: 1100, avg: 600 }      // Apple Watch Series 10-11: 750-1100, SE: 500-850
    },
    battery: {
      phone: { min: 100, max: 300, avg: 180 },      // iPhone: 150-250, Android: 100-180
      tablet: { min: 150, max: 400, avg: 250 },     // iPad: 200-400, Android: 150-250
      laptop: { min: 250, max: 600, avg: 400 },     // MacBook: 350-600, Windows: 250-400
      watch: { min: 150, max: 400, avg: 250 }       // Apple Watch: 200-400
    },
    charging: {
      phone: { min: 80, max: 250, avg: 150 },       // Port cleaning: 80-120, replacement: 150-250
      tablet: { min: 100, max: 300, avg: 180 },     // iPad: 150-300, Android: 100-200
      laptop: { min: 150, max: 400, avg: 250 },     // MacBook: 200-400, Windows: 150-300
      watch: { min: 100, max: 300, avg: 180 }       // Sensor/port repair
    },
    camera: {
      phone: { min: 120, max: 450, avg: 250 },      // iPhone Pro camera: 300-450, main: 150-250
      tablet: { min: 150, max: 350, avg: 220 },     // iPad camera: 150-350
      laptop: { min: 150, max: 400, avg: 250 },     // Webcam replacement
      watch: { min: 100, max: 250, avg: 150 }       // Sensors
    },
    motherboard: {
      phone: { min: 250, max: 900, avg: 500 },      // BGA repair, IC replacement
      tablet: { min: 350, max: 1000, avg: 600 },    // Logic board repair
      laptop: { min: 500, max: 2000, avg: 1000 },   // MacBook logic board: 800-2000
      watch: { min: 200, max: 600, avg: 350 }       // Main board repair
    },
    keyboard: {
      laptop: { min: 200, max: 600, avg: 350 },     // MacBook butterfly/magic: 350-600
      phone: { min: 80, max: 200, avg: 120 },       // Button/connector repair
      tablet: { min: 100, max: 250, avg: 150 },     // Button repair
      watch: { min: 80, max: 200, avg: 120 }        // Crown/button repair
    },
    software: {
      phone: { min: 50, max: 250, avg: 150 },       // Data recovery, firmware
      tablet: { min: 50, max: 250, avg: 150 },
      laptop: { min: 100, max: 350, avg: 200 },     // OS reinstall, data recovery
      watch: { min: 50, max: 200, avg: 100 }
    },
    diagnostic: {
      phone: { min: 0, max: 0, avg: 0 },
      tablet: { min: 0, max: 0, avg: 0 },
      laptop: { min: 0, max: 0, avg: 0 },
      watch: { min: 0, max: 0, avg: 0 },
      all: { min: 0, max: 0, avg: 0 }
    }
  };
  
  // Коэффициенты сложности ремонта
  const COMPLEXITY_FACTORS = {
    screen: 1.0,      // Простая замена
    battery: 1.0,     // Простая замена
    charging: 1.1,    // Средняя сложность (очистка, пайка)
    camera: 1.2,      // Средняя сложность
    motherboard: 2.0, // Высокая сложность (BGA, пайка микросхем)
    keyboard: 1.3,    // Средняя сложность
    software: 0.8,    // Программное обеспечение
    diagnostic: 0.0   // Бесплатно
  };
  
  // Коэффициенты возраста модели (для редких запчастей)
  const AGE_FACTORS = {
    current: 1.0,    // Текущие модели (2024-2026)
    recent: 1.05,    // Недавние (2021-2023)
    old: 1.15,       // Старые (2018-2020)
    veryOld: 1.25    // Очень старые (до 2018)
  };
  
  // Специальные цены Apple Watch (из прайс-листа 2026) в RON
  const APPLE_WATCH_PRICES = {
    'Series 11': { screen: 750, battery: 400, micro: 400 },
    'Series 10': { screen: 750, battery: 400, micro: 400 },
    'Series 9': { screen: 750, battery: 400, micro: 400 },
    'Series 8': { screen: 550, battery: 400, micro: 550 },
    'Series 7': { screen: 550, battery: 400, micro: 500 },
    'Series 6': { screen: 450, battery: 400, micro: 450 },
    'Series 5': { screen: 450, battery: 400, micro: 400 },
    'Series 4': { screen: 450, battery: 400, micro: 350 },
    'SE 3': { screen: 500, battery: 400, micro: null },
    'SE 2': { screen: 500, battery: 400, micro: 650 },
    'SE': { screen: 400, battery: 400, micro: 400 }
  };
  
  // Коэффициенты бренда (премиум бренды дороже)
  const BRAND_FACTORS = {
    apple: 1.15,      // Apple premium
    samsung: 1.1,     // Samsung flagship premium
    xiaomi: 0.85,     // Budget friendly
    huawei: 0.95,     // Средняя цена
    oneplus: 1.0,     // Средняя цена
    google: 1.1,      // Pixel premium
    oppo: 0.9,        // Budget
    realme: 0.85,
    motorola: 0.95,
    vivo: 0.9,
    nokia: 0.9,
    sony: 1.1,
    asus: 1.0,
    nothing: 1.0,
    other: 1.0
  };
  
  const PriceCalculator = () => {
    const [step, setStep] = React.useState(1);
    const [data, setData] = React.useState({
      brand: null,
      deviceType: null,
      model: null,
      issues: [],  // Множественный выбор дефектов
      name: '',
      phone: ''
    });
    const [result, setResult] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [models, setModels] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [direction, setDirection] = React.useState(0);
    const [errors, setErrors] = React.useState({});
    const [dbReady, setDbReady] = React.useState(false);
    const [loadingModels, setLoadingModels] = React.useState(false);
    // State for language changes
    const [lang, setLang] = React.useState(window.i18n?.getCurrentLanguage()?.code || 'ro');
    
    // Subscribe to language changes
    React.useEffect(() => {
      if (!window.i18n) return;
      const unsubscribe = window.i18n.subscribe((newLang) => {
        setLang(newLang);
      });
      return unsubscribe;
    }, []);
    
    // Load models from NEXXDatabase - улучшенная загрузка
    React.useEffect(() => {
      let isMounted = true;
      let checkInterval = null;
      
      const loadModels = async () => {
        setLoadingModels(true);
        
        // Функция загрузки из базы
        const loadFromDatabase = () => {
          if (window.NEXXDatabase && window.NEXXDatabase.devices && Array.isArray(window.NEXXDatabase.devices)) {
            if (isMounted) {
              setModels(window.NEXXDatabase.devices);
              setDbReady(true);
              setLoadingModels(false);
              console.log(`✅ Калькулятор: загружено ${window.NEXXDatabase.devices.length} моделей`);
            }
            return true;
          }
          return false;
        };
        
        // Проверяем, есть ли уже загруженные данные
        if (loadFromDatabase()) {
          return;
        }
        
        // Ждем загрузки базы данных
        if (window.NEXXDatabase) {
          // Подписываемся на событие загрузки
          const unsubscribe = window.NEXXDatabase.subscribe(() => {
            if (isMounted && loadFromDatabase()) {
              unsubscribe();
            }
          });
          
          // Запускаем загрузку если еще не загружено
          if (!window.NEXXDatabase.loaded && !window.NEXXDatabase.loading) {
            window.NEXXDatabase.loadAll().catch(e => {
              console.error('❌ Ошибка загрузки базы:', e);
            });
          }
        }
        
        // Интервальная проверка как резерв
        checkInterval = setInterval(() => {
          if (loadFromDatabase()) {
            clearInterval(checkInterval);
          }
        }, 200);
        
        // Fallback через 3 секунды - загружаем из единой базы master-db.json
        setTimeout(() => {
          if (isMounted && !dbReady) {
            console.warn('⚠️ База не загружена, используем fallback');
            fetch('/data/master-db.json')
              .then(r => r.json())
              .then(db => {
                if (isMounted && db && Array.isArray(db.devices)) {
                  setModels(db.devices);
                  setDbReady(true);
                  setLoadingModels(false);
                  console.log(`✅ Fallback: загружено ${db.devices.length} моделей из master-db.json`);
                }
              })
              .catch(e => {
                console.error('❌ Fallback ошибка:', e);
                if (isMounted) {
                  setModels([]);
                  setDbReady(true);
                  setLoadingModels(false);
                }
              });
          }
        }, 3000);
      };
      
      loadModels();
      
      return () => {
        isMounted = false;
        if (checkInterval) clearInterval(checkInterval);
      };
    }, [dbReady]);
    
    // Полный список брендов для румынского рынка (сортировка по популярности)
    // SVG иконки брендов в /static/brands/
    // Используем useMemo для обновления при изменении языка
    const brands = React.useMemo(() => [
      { id: 'apple', name: 'Apple', svg: '/static/brands/apple.svg', color: 'from-gray-600 to-gray-800', gradient: 'from-blue-500/20 to-purple-500/20' },
      { id: 'samsung', name: 'Samsung', svg: '/static/brands/samsung.svg', color: 'from-blue-500 to-blue-700', gradient: 'from-blue-500/20 to-cyan-500/20' },
      { id: 'xiaomi', name: 'Xiaomi', svg: '/static/brands/xiaomi.svg', color: 'from-orange-500 to-orange-700', gradient: 'from-orange-500/20 to-red-500/20' },
      { id: 'huawei', name: 'Huawei', svg: '/static/brands/huawei.svg', color: 'from-red-500 to-red-700', gradient: 'from-red-500/20 to-pink-500/20' },
      { id: 'oneplus', name: 'OnePlus', svg: '/static/brands/oneplus.svg', color: 'from-red-600 to-red-800', gradient: 'from-red-500/20 to-orange-500/20' },
      { id: 'google', name: 'Google Pixel', svg: '/static/brands/google.svg', color: 'from-green-500 to-blue-500', gradient: 'from-green-500/20 to-blue-500/20' },
      { id: 'oppo', name: 'Oppo', svg: '/static/brands/oppo.svg', color: 'from-green-600 to-green-800', gradient: 'from-green-500/20 to-teal-500/20' },
      { id: 'realme', name: 'Realme', svg: '/static/brands/realme.svg', color: 'from-gray-600 to-gray-800', gradient: 'from-gray-500/20 to-gray-600/20' },
      { id: 'motorola', name: 'Motorola', svg: '/static/brands/motorola.svg', color: 'from-blue-600 to-blue-800', gradient: 'from-blue-500/20 to-indigo-500/20' },
      { id: 'vivo', name: 'Vivo', svg: '/static/brands/vivo.svg', color: 'from-blue-400 to-blue-600', gradient: 'from-blue-400/20 to-cyan-500/20' },
      { id: 'nokia', name: 'Nokia', svg: '/static/brands/nokia.svg', color: 'from-blue-700 to-blue-900', gradient: 'from-blue-600/20 to-indigo-600/20' },
      { id: 'sony', name: 'Sony', svg: '/static/brands/sony.svg', color: 'from-gray-700 to-gray-900', gradient: 'from-gray-600/20 to-black/20' },
      { id: 'asus', name: 'Asus', svg: '/static/brands/asus.svg', color: 'from-purple-600 to-purple-800', gradient: 'from-purple-500/20 to-pink-500/20' },
      { id: 'nothing', name: 'Nothing', svg: '/static/brands/nothing.svg', color: 'from-gray-800 to-black', gradient: 'from-gray-700/20 to-black/20' },
      { id: 'other', name: (() => {
          if (window.i18n && typeof window.i18n.t === 'function') {
            const translated = window.i18n.t('calculator.otherBrands');
            if (translated && translated !== 'calculator.otherBrands') return translated;
          }
          return 'Alte mărci';
        })(), svg: '/static/brands/other.svg', color: 'from-gray-500 to-gray-700', gradient: 'from-gray-500/20 to-gray-600/20' }
    ], [lang]);
    
    const deviceTypes = React.useMemo(() => [
      { id: 'phone', nameKey: 'calculator.devicePhone', name: 'Telefon', icon: 'fa-mobile', color: 'from-blue-500 to-blue-700' },
      { id: 'tablet', nameKey: 'calculator.deviceTablet', name: 'Tabletă', icon: 'fa-tablet', color: 'from-purple-500 to-purple-700' },
      { id: 'laptop', nameKey: 'calculator.deviceLaptop', name: 'Laptop', icon: 'fa-laptop', color: 'from-green-500 to-green-700' },
      { id: 'watch', nameKey: 'calculator.deviceWatch', name: 'Smartwatch', icon: 'fa-watch', color: 'from-pink-500 to-pink-700' }
    ], [lang]);
    const deviceTypeName = (type) => {
      if (!type) return '';
      if (type.nameKey && window.i18n && typeof window.i18n.t === 'function') {
        const translated = window.i18n.t(type.nameKey);
        if (translated && translated !== type.nameKey) return translated;
      }
      return type.name || '';
    };
    
    const issues = {
      phone: [
        { id: 'screen', name: 'Ecran spart/defect', price: 'screen', icon: 'fa-mobile-screen' },
        { id: 'battery', name: 'Baterie (se descarcă rapid)', price: 'battery', icon: 'fa-battery-quarter' },
        { id: 'charging', name: 'Nu se încarcă', price: 'charging', icon: 'fa-plug' },
        { id: 'camera', name: 'Cameră nu funcționează', price: 'camera', icon: 'fa-camera' },
        { id: 'motherboard', name: 'Problemă la placă', price: 'motherboard', icon: 'fa-microchip' }
      ],
      tablet: [
        { id: 'screen', name: 'Display spart', price: 'screen', icon: 'fa-tablet-screen-button' },
        { id: 'battery', name: 'Baterie', price: 'battery', icon: 'fa-battery-quarter' },
        { id: 'charging', name: 'Port charging', price: 'charging', icon: 'fa-plug' },
        { id: 'camera', name: 'Cameră nu funcționează', price: 'camera', icon: 'fa-camera' },
        { id: 'motherboard', name: 'Placă logică', price: 'motherboard', icon: 'fa-microchip' }
      ],
      laptop: [
        { id: 'screen', name: 'Ecran/Display', price: 'screen', icon: 'fa-laptop' },
        { id: 'battery', name: 'Baterie', price: 'battery', icon: 'fa-battery-quarter' },
        { id: 'keyboard', name: 'Tastatură', price: 'keyboard', icon: 'fa-keyboard' },
        { id: 'charging', name: 'Încărcare', price: 'charging', icon: 'fa-plug' },
        { id: 'camera', name: 'Cameră web', price: 'camera', icon: 'fa-camera' },
        { id: 'motherboard', name: 'Placă de bază', price: 'motherboard', icon: 'fa-microchip' }
      ],
      watch: [
        { id: 'screen', name: 'Ecran', price: 'screen', icon: 'fa-watch' },
        { id: 'battery', name: 'Baterie', price: 'battery', icon: 'fa-battery-quarter' },
        { id: 'charging', name: 'Port charging', price: 'charging', icon: 'fa-plug' }
      ]
    };
    
    const steps = [
      { id: 1, name: 'Marca', icon: 'fa-mobile-screen' },
      { id: 2, name: 'Tip', icon: 'fa-tablet-screen-button' },
      { id: 3, name: 'Model', icon: 'fa-list' },
      { id: 4, name: 'Problemă', icon: 'fa-wrench' },
      { id: 6, name: 'Preț', icon: 'fa-calculator' }
    ];
    
    const handleNext = () => {
      if (step < 6) {
        setDirection(1);
        setStep(step + 1);
      }
    };
    
    const handlePrevious = () => {
      if (step > 1) {
        setDirection(-1);
        setStep(step - 1);
      }
    };
    
    const calculatePrice = async () => {
      if (!data.deviceType || !data.issues || data.issues.length === 0) {
        if (window.showToast) {
          window.showToast('Selectați cel puțin o problemă', 'warning', 3000);
        }
        return;
      }
      
      setLoading(true);
      
      setTimeout(async () => {
        try {
          const deviceType = data.deviceType;
          const issues = data.issues;  // Массив выбранных проблем
          const model = data.model;
          
          console.log(`🔍 Расчет цены: deviceType=${deviceType}, issues=${issues.map(i => i.id).join(', ')}, model=${model?.name || 'не выбрана'}`);
          
          // Функция расчёта цены для одного дефекта
          const calculateSingleIssuePrice = async (issue) => {
            let priceData = null;
            
            // Приоритет 1: Цена из базы данных NEXXDatabase
            if (model && window.NEXXDatabase && typeof window.NEXXDatabase.getDevicePrice === 'function') {
              try {
                const deviceName = typeof model === 'string' ? model : (model.name || '');
                const dbPrice = window.NEXXDatabase.getDevicePrice(deviceName, issue.id);
                if (dbPrice && typeof dbPrice === 'number' && dbPrice > 0) {
                  priceData = { min: Math.round(dbPrice * 0.8), max: Math.round(dbPrice * 1.2), avg: dbPrice };
                }
              } catch (dbError) {
                console.warn('⚠️ Ошибка получения цены из БД:', dbError);
              }
            }
            
            // Приоритет 2: Цена из official_service_prices модели (Apple цены в USD)
            // ВАЖНО: official_service_prices это цены Apple в USD - конвертируем в RON
            if (!priceData && model && model.official_service_prices) {
              const prices = model.official_service_prices;
              const keyMap = { 'screen': 'display', 'battery': 'battery', 'charging': 'charging_port', 'camera': 'rear_camera', 'motherboard': 'logic_board', 'keyboard': 'keyboard' };
              let priceUSD = prices[issue.id] || prices[keyMap[issue.id]];
              if (priceUSD && typeof priceUSD === 'number' && priceUSD > 0) {
                // Конвертация USD в RON (курс ~4.5 RON за 1 USD)
                const USD_TO_RON = 4.5;
                const priceRON = Math.round(priceUSD * USD_TO_RON);
                priceData = { min: Math.round(priceRON * 0.8), max: Math.round(priceRON * 1.2), avg: priceRON };
                console.log(`💰 Конвертация: ${priceUSD} USD → ${priceRON} RON`);
              }
            }
            
            // Приоритет 3: Расчёт на основе базовых цен
            if (!priceData) {
              let basePrice = REPAIR_PRICES[issue.id]?.[deviceType] || REPAIR_PRICES[issue.price]?.[deviceType];
              if (basePrice && basePrice.avg) {
                let calculatedPrice = basePrice.avg;
                const complexityFactor = COMPLEXITY_FACTORS[issue.id] || COMPLEXITY_FACTORS[issue.price] || 1.0;
                calculatedPrice *= complexityFactor;
                
                if (model && model.year) {
                  const age = new Date().getFullYear() - model.year;
                  let ageFactor = age <= 1 ? AGE_FACTORS.current : age <= 3 ? AGE_FACTORS.recent : age <= 6 ? AGE_FACTORS.old : AGE_FACTORS.veryOld;
                  calculatedPrice *= ageFactor;
                }
                
                const brandFactor = BRAND_FACTORS[data.brand?.id] || BRAND_FACTORS.other;
                calculatedPrice *= brandFactor;
                calculatedPrice = Math.max(30, Math.round(calculatedPrice / 10) * 10);
                
                priceData = { min: Math.max(30, Math.round(calculatedPrice * 0.75)), max: Math.round(calculatedPrice * 1.35), avg: calculatedPrice };
              }
            }
            
            // Fallback: минимальные цены
            if (!priceData) {
              for (const issueKey in REPAIR_PRICES) {
                const priceForDevice = REPAIR_PRICES[issueKey]?.[deviceType];
                if (priceForDevice) {
                  priceData = { min: priceForDevice.min || 50, max: priceForDevice.max || 200, avg: priceForDevice.avg || 100 };
                  break;
                }
              }
            }
            
            return priceData;
          };
          
          // Расчёт цен для всех выбранных дефектов
          const allPrices = await Promise.all(issues.map(issue => calculateSingleIssuePrice(issue)));
          const validPrices = allPrices.filter(p => p && p.avg > 0);
          
          if (validPrices.length > 0) {
            // Суммируем цены всех дефектов со скидкой за комплекс
            let totalMin = 0, totalMax = 0, totalAvg = 0;
            validPrices.forEach((p, i) => {
              // Скидка 10% на каждый последующий дефект
              const discount = i === 0 ? 1 : 0.9;
              totalMin += Math.round(p.min * discount);
              totalMax += Math.round(p.max * discount);
              totalAvg += Math.round(p.avg * discount);
            });
            
            // Определяем время ремонта
            let time = '30-60 min';
            const hasComplexIssue = issues.some(i => i.id === 'motherboard' || i.id === 'board');
            if (hasComplexIssue) {
              time = deviceType === 'phone' || deviceType === 'tablet' ? '2-4 ore' : '4-8 ore';
            } else if (issues.length > 2) {
              time = '1-2 ore';
            } else if (deviceType === 'laptop') {
              time = '1-2 ore';
            }
            
            const issueNames = issues.map(i => i.name).join(', ');
            const resultData = {
              min: totalMin,
              max: totalMax,
              avg: totalAvg,
              diagnostic: `Probleme selectate: ${issueNames}`,
              time: time,
              model: model?.name || null,
              issues: issues.map(i => i.name)  // Список выбранных проблем
            };
            
            console.log(`✅ Итого за ${issues.length} дефект(ов): ${totalAvg} lei (${totalMin}-${totalMax})`);
            setResult(resultData);
            setStep(6);
          } else {
            if (window.showToast) {
              window.showToast('Nu s-a putut calcula prețul. Încercați din nou.', 'error', 4000);
            }
          }
        } catch (error) {
          console.error('❌ Ошибка расчета цены:', error);
          if (window.showToast) {
            window.showToast('Eroare la calcularea prețului. Încercați din nou.', 'error', 4000);
          }
        } finally {
          setLoading(false);
        }
      }, 800);
    };
    
    const sendLeadToRemonline = async (leadData, retries = 2) => {
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch('/api/remonline?action=create_inquiry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source: 'price_calculator',
              name: leadData.name || '',
              phone: leadData.phone || '',
              device: {
                brand: leadData.brand,
                type: leadData.deviceType,
                model: leadData.model
              },
              issue: leadData.issue,
              estimated_price: leadData.estimatedPrice,
              timestamp: new Date().toISOString()
            }),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              console.log('✅ Лид успешно отправлен в Remonline');
              return true;
            }
          }
        } catch (error) {
          if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          }
        }
      }
      return false;
    };
    
    // Получаем доступные типы устройств для выбранного бренда
    const getAvailableDeviceTypes = React.useCallback(() => {
      try {
        if (!data.brand) return deviceTypes;
        
        const selectedBrand = safeString(safeGet(data, 'brand.id', '')).toLowerCase();
        if (!selectedBrand) return deviceTypes;
        
        const devices = safeArray(window.NEXXDatabase?.devices || models);
        
        if (devices.length === 0) {
          return deviceTypes; // Если база пуста, показываем все типы
        }
        
        // Маппинг бренда
        const brandMap = {
          'apple': 'Apple', 'samsung': 'Samsung', 'xiaomi': 'Xiaomi',
          'huawei': 'Huawei', 'oneplus': 'OnePlus', 'google': 'Google',
          'oppo': 'Oppo', 'realme': 'Realme', 'motorola': 'Motorola',
          'vivo': 'Vivo', 'nokia': 'Nokia', 'sony': 'Sony',
          'asus': 'Asus', 'nothing': 'Nothing', 'other': 'Other'
        };
        const targetBrand = brandMap[selectedBrand] || selectedBrand;
        
        // Находим какие типы устройств есть у этого бренда
        const availableTypes = new Set();
        devices.forEach(device => {
          if (!device) return;
          const deviceBrand = safeString(device.brand);
          if (deviceBrand.toLowerCase() === targetBrand.toLowerCase()) {
            availableTypes.add(device.device_type);
          }
        });
        
        // Фильтруем типы устройств
        const filtered = deviceTypes.filter(type => availableTypes.has(type.id));
        
        console.log(`🔍 Типы для бренда ${targetBrand}:`, Array.from(availableTypes), '→ показываем:', filtered.map(t => t.id));
        
        return filtered.length > 0 ? filtered : deviceTypes;
      } catch (error) {
        console.error('❌ Ошибка получения типов устройств:', error);
        return deviceTypes;
      }
    }, [data.brand, models, dbReady]);
    
    // Упрощенная и надёжная фильтрация моделей через поля brand и device_type
    const getFilteredModels = React.useCallback(() => {
      try {
        if (!data.brand || !data.deviceType) return [];
        
        const selectedBrand = safeString(safeGet(data, 'brand.id', '')).toLowerCase();
        const selectedType = safeString(data.deviceType);
        
        if (!selectedBrand || !selectedType) return [];
      
      let filtered = [];
      const devices = window.NEXXDatabase?.devices || models || [];
      
      if (!Array.isArray(devices) || devices.length === 0) {
        console.warn('⚠️ База данных пуста или не загружена');
        return [];
      }
      
      // Маппинг ID бренда на название в базе
      const brandMap = {
        'apple': 'Apple',
        'samsung': 'Samsung',
        'xiaomi': 'Xiaomi',
        'huawei': 'Huawei',
        'oneplus': 'OnePlus',
        'google': 'Google',
        'oppo': 'Oppo',
        'realme': 'Realme',
        'motorola': 'Motorola',
        'vivo': 'Vivo',
        'nokia': 'Nokia',
        'sony': 'Sony',
        'asus': 'Asus',
        'nothing': 'Nothing',
        'other': 'Other'
      };
      
      const targetBrand = brandMap[selectedBrand] || selectedBrand;
      
      filtered = devices.filter(m => {
        if (!m || !m.name) return false;
        
        // Используем поле brand если оно есть
        const deviceBrand = m.brand || '';
        const deviceType = m.device_type || '';
        
        // Фильтр по бренду
        let brandMatch = false;
        if (selectedBrand === 'other') {
          // Для "Alte mărci" показываем устройства с брендом "Other" или без бренда
          brandMatch = deviceBrand === 'Other' || !deviceBrand;
        } else {
          // Точное совпадение по бренду
          brandMatch = deviceBrand.toLowerCase() === targetBrand.toLowerCase();
        }
        
        if (!brandMatch) return false;
        
        // Фильтр по типу устройства
        const typeMatch = deviceType === selectedType;
        
        return typeMatch;
      });
      
      // Если новые поля не работают, используем fallback логику
      if (filtered.length === 0) {
        console.log(`⚠️ Fallback фильтрация для ${selectedBrand}/${selectedType}`);
        filtered = devices.filter(m => {
          if (!m || !m.name) return false;
          const n = m.name.toLowerCase();
          const category = (m.category || '').toLowerCase();
          
          // Fallback проверка бренда по имени
          let brandMatch = false;
          if (selectedBrand === 'apple') {
            brandMatch = n.includes('iphone') || n.includes('ipad') || n.includes('macbook') || 
                        category === 'iphone' || category === 'ipad' || category === 'macbook' || category === 'watch';
          } else if (selectedBrand === 'samsung') {
            brandMatch = n.includes('samsung') || n.includes('galaxy') || category === 'samsung';
          } else if (selectedBrand === 'xiaomi') {
            brandMatch = n.includes('xiaomi') || n.includes('redmi') || n.includes('poco') || category === 'xiaomi';
          } else if (selectedBrand === 'huawei') {
            brandMatch = n.includes('huawei') || n.includes('honor') || category === 'huawei';
          } else if (selectedBrand === 'oneplus') {
            brandMatch = n.includes('oneplus') || category === 'oneplus';
          } else if (selectedBrand === 'google') {
            brandMatch = n.includes('pixel') || n.includes('google') || category === 'google';
          } else if (selectedBrand === 'oppo') {
            brandMatch = n.includes('oppo') || category === 'oppo';
          } else if (selectedBrand === 'realme') {
            brandMatch = n.includes('realme') || category === 'realme';
          } else if (selectedBrand === 'motorola') {
            brandMatch = n.includes('motorola') || n.includes('moto ') || n.includes('razr') || category === 'motorola';
          } else if (selectedBrand === 'vivo') {
            brandMatch = n.includes('vivo') || category === 'vivo';
          } else if (selectedBrand === 'nokia') {
            brandMatch = n.includes('nokia') || category === 'nokia';
          } else if (selectedBrand === 'sony') {
            brandMatch = n.includes('sony') || n.includes('xperia') || category === 'sony';
          } else if (selectedBrand === 'asus') {
            brandMatch = n.includes('asus') || n.includes('rog phone') || n.includes('zenfone') || category === 'asus';
          } else if (selectedBrand === 'nothing') {
            brandMatch = n.includes('nothing') || category === 'nothing';
          } else if (selectedBrand === 'other') {
            brandMatch = true; // Показываем все для other
          }
          
          if (!brandMatch) return false;
          
          // Fallback проверка типа устройства
          if (selectedType === 'phone') {
            return !n.includes('ipad') && !n.includes('macbook') && !n.includes('tab') && 
                   !n.includes('laptop') && !n.includes('watch') && !n.includes('pad') &&
                   category !== 'ipad' && category !== 'macbook' && category !== 'watch';
          } else if (selectedType === 'tablet') {
            return n.includes('ipad') || n.includes('tab') || n.includes('pad') || 
                   category === 'ipad' || category.includes('tablet');
          } else if (selectedType === 'laptop') {
            return n.includes('macbook') || n.includes('laptop') || n.includes('book') ||
                   category === 'macbook' || category.includes('laptop');
          } else if (selectedType === 'watch') {
            return n.includes('watch') || category === 'watch' || category.includes('watch');
          }
          
          return true;
        });
      }
      
      // Применяем поисковый запрос
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(m => {
          const name = (m.name || '').toLowerCase();
          const category = (m.category || '').toLowerCase();
          const model = (m.model || '').toLowerCase();
          return name.includes(query) || category.includes(query) || model.includes(query);
        });
      }
      
      // Сортируем: сначала новые модели
      filtered.sort((a, b) => {
        const yearA = a.year || 0;
        const yearB = b.year || 0;
        if (yearB !== yearA) return yearB - yearA;
        // Если год одинаковый, сортируем по имени
        return (a.name || '').localeCompare(b.name || '');
      });
      
      // Логирование для отладки
      if (filtered.length > 0) {
        console.log(`✅ Фильтрация: бренд=${selectedBrand}, тип=${selectedType}, найдено=${filtered.length} моделей`);
      } else {
        console.warn(`⚠️ Не найдено моделей: бренд=${selectedBrand}, тип=${selectedType}`);
      }
      
      return filtered;
      } catch (error) {
        console.error('❌ Ошибка фильтрации моделей:', error);
        return [];
      }
    }, [data.brand, data.deviceType, models, searchQuery]);
    
    const reset = () => {
      setStep(1);
      setData({ brand: null, deviceType: null, model: null, issue: null, name: '', phone: '' });
      setResult(null);
      setSearchQuery('');
      setDirection(-1);
      setErrors({});
    };
    
    return h('div', { id: 'calculator', className: 'max-w-3xl mx-auto' },
      h('div', { className: 'bg-gradient-to-br from-zinc-900/90 via-zinc-900 to-zinc-950/90 border border-zinc-800 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-sm' },
        // Modern Header
        h('div', { className: 'text-center mb-4' },
          h('div', { className: 'inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full mb-3 backdrop-blur-sm' },
            h('i', { className: 'fas fa-calculator text-blue-400 text-sm' }),
            h('span', { className: 'text-xs font-semibold text-zinc-300' }, 
              window.i18n?.t('calculator.calculator') || 'Calculator preț'
            )
          ),
          h('h2', { className: 'text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent mb-2' }, 
            window.i18n?.t('calculator.title') || 'Estimare gratuită online'
          ),
          h('p', { className: 'text-zinc-400 text-xs' }, 
            window.i18n?.t('calculator.description') || 'Răspundeți la câteva întrebări pentru a afla prețul aproximativ'
          )
        ),
        
        // Modern Steps Indicator
        step < 6 && h('div', { className: 'mb-4' },
          h('div', { className: 'flex items-center justify-between relative' },
            // Progress line
            h('div', { 
              className: 'absolute top-6 left-0 right-0 h-1 bg-zinc-800 rounded-full z-0'
            }),
            h('div', { 
              className: 'absolute top-6 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full z-10 transition-all duration-500',
              style: { width: `${((step - 1) / (steps.length - 1)) * 100}%` }
            }),
            ...steps.map((s, idx) => h('div', {
              key: s.id,
              className: 'relative z-20 flex flex-col items-center'
            },
              h('div', {
                className: `w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step >= s.id 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-110' 
                    : 'bg-zinc-800 text-zinc-500'
                }`
              },
                step > s.id 
                  ? h('i', { className: 'fas fa-check text-white text-sm' })
                  : h('i', { className: `fas ${s.icon} ${step >= s.id ? 'text-white' : 'text-zinc-500'} text-sm` })
              ),
              h('span', {
                className: `text-xs mt-2 hidden sm:block ${step >= s.id ? 'text-white' : 'text-zinc-500'}`
              }, s.name)
            ))
          )
        ),
        
        // Step Content with Animation
        h('div', { className: 'min-h-[220px] relative' },
          // Step 1: Brand Selection
          step === 1 && !result && h('div', { className: 'space-y-4 ' },
            h('h3', { className: 'text-lg font-bold text-white mb-3 text-center' }, 
              window.i18n?.t('calculator.selectBrand') || 'Alegeți marca:'
            ),
            h('div', { className: 'grid grid-cols-3 md:grid-cols-5 gap-2' },
              ...brands.map(brand => h('button', {
                key: brand.id,
                onClick: () => {
                  setData({ ...data, brand });
                  handleNext();
                  // Скролл к калькулятору
                  setTimeout(() => {
                    const calcEl = document.getElementById('calculator');
                    if (calcEl) {
                      calcEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                },
                className: 'group relative p-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-blue-500 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20 overflow-hidden cursor-pointer'
              },
                h('div', { 
                  className: `absolute inset-0 bg-gradient-to-br ${brand.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`
                }),
                h('div', { 
                  className: `w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${brand.color} flex items-center justify-center group-hover:scale-110 transition-all duration-200 shadow-md p-2`
                },
                  h('img', { 
                    src: brand.svg, 
                    alt: brand.name, 
                    className: 'w-full h-full object-contain',
                    style: { filter: 'brightness(0) invert(1)' },
                    loading: 'lazy'
                  })
                ),
                h('div', { className: 'font-medium text-white text-xs relative z-10' }, brand.name)
              ))
            )
          ),
          
          // Step 2: Device Type
          step === 2 && !result && h('div', { className: 'space-y-4 ' },
            h('h3', { className: 'text-lg font-bold text-white mb-4 text-center' }, 
              `${data.brand?.name} - ${window.i18n?.t('calculator.selectDevice') || 'Alegeți tipul:'}`
            ),
            // Показываем индикатор загрузки базы данных
            !dbReady && h('div', { className: 'text-center py-4' },
              h('div', { className: 'inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg' },
                h('div', { className: 'w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin' }),
                h('span', { className: 'text-sm text-blue-400' }, 'Se încarcă baza de date...')
              )
            ),
            h('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-2' },
              ...getAvailableDeviceTypes().map(type => h('button', {
                key: type.id,
                onClick: () => {
                  const newData = { ...data, deviceType: type.id, model: null };
                  setData(newData);
                  setSearchQuery('');
                  const n_brand = data.brand?.id?.toLowerCase();
                  console.log(`📱 Выбран тип: brand=${n_brand}, type=${type.id}, dbReady=${dbReady}, models=${models.length}`);
                  setStep(3);
                  setTimeout(() => {
                    const calcEl = document.getElementById('calculator');
                    if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                },
                className: 'group p-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-blue-500 rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer'
              },
                h('div', { 
                  className: `w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center group-hover:scale-110 transition-all duration-200 shadow-md`
                },
                  h('i', { className: `fas ${type.icon} text-lg text-white` })
                ),
                h('div', { className: 'font-medium text-white text-xs' }, deviceTypeName(type))
              ))
            ),
            h('button', {
              onClick: handlePrevious,
              className: 'mt-6 text-zinc-400 hover:text-white transition flex items-center gap-2 mx-auto'
            },
              h('i', { className: 'fas fa-arrow-left' }),
              window.i18n?.t('calculator.back') || 'Înapoi'
            )
          ),
          
          // Step 3: Model Selection with Search
          step === 3 && !result && h('div', { className: 'space-y-4 ' },
            h('h3', { className: 'text-lg font-bold text-white mb-3 text-center' }, 
              window.i18n?.t('calculator.selectModel') || 'Alegeți modelul:'
            ),
            // Показываем информацию о выборе
            h('div', { className: 'text-center mb-4' },
              h('span', { className: 'inline-flex items-center gap-2 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-400' },
                h('i', { className: 'fas fa-info-circle' }),
                `${data.brand?.name || ''} / ${deviceTypeName(deviceTypes.find(t => t.id === data.deviceType) || {}) || ''}`
              )
            ),
            // Индикатор загрузки моделей
            loadingModels && h('div', { className: 'text-center py-8' },
              h('div', { className: 'w-10 h-10 mx-auto mb-4 border-3 border-zinc-700 border-t-blue-500 rounded-full animate-spin' }),
              h('p', { className: 'text-zinc-400' }, 'Se încarcă modelele...')
            ),
            // Поле поиска
            !loadingModels && h('div', { className: 'relative mb-6' },
              h('div', { className: 'absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500' },
                h('i', { className: 'fas fa-search' })
              ),
              h('input', {
                type: 'text',
                placeholder: 'Căutați model...',
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: 'w-full pl-12 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all'
              }),
              // Показываем количество найденных моделей
              h('div', { className: 'absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500' },
                `${getFilteredModels().length} modele`
              )
            ),
            // Список моделей
            !loadingModels && h('div', { className: 'space-y-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar' },
              getFilteredModels()
                .slice(0, 30)
                .map(model => h('button', {
                  key: model.name + '-' + (model.year || ''),
                  onClick: () => {
                    console.log('✅ Выбрана модель:', model.name);
                    setData({ ...data, model });
                    setStep(4);
                  },
                  className: 'w-full p-2 bg-zinc-800/40 hover:bg-zinc-800/70 border border-zinc-700 hover:border-blue-500/50 rounded-lg transition-all text-left flex items-center justify-between group'
                },
                  h('div', { className: 'flex-1 min-w-0' },
                    h('div', { className: 'text-white font-medium text-sm truncate' }, model.name),
                    h('div', { className: 'text-zinc-500 text-xs flex items-center gap-1' }, 
                      h('span', null, model.year || 'N/A'),
                      h('span', { className: 'text-zinc-600' }, '•'),
                      h('span', null, model.category || 'N/A')
                    )
                  ),
                  h('i', { className: 'fas fa-chevron-right text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2' })
                ))
            ),
            // Сообщение если нет моделей для этой комбинации бренд/тип
            !loadingModels && getFilteredModels().length === 0 && h('div', { className: 'text-center py-6' },
              h('div', { className: 'w-14 h-14 mx-auto mb-4 bg-zinc-800/50 rounded-full flex items-center justify-center' },
                h('i', { className: 'fas fa-box-open text-2xl text-zinc-500' })
              ),
              h('p', { className: 'text-base text-white mb-1' }, 'Nu avem modele pentru această combinație'),
              h('p', { className: 'text-zinc-400 mb-6' }, 
                `${data.brand?.name || ''} nu produce ${(deviceTypeName(deviceTypes.find(t => t.id === data.deviceType) || {}) || '').toLowerCase() || 'acest tip'}.`
              ),
              h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center' },
                h('button', {
                  onClick: () => setStep(2),
                  className: 'px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-all flex items-center justify-center gap-2'
                },
                  h('i', { className: 'fas fa-arrow-left' }),
                  'Alegeți alt tip'
                ),
                h('button', {
                  onClick: () => {
                    // Продолжаем без конкретной модели
                    setData({ ...data, model: { name: `${data.brand?.name || 'Dispozitiv'} (general)`, year: null, category: data.deviceType } });
                    setStep(4);
                  },
                  className: 'px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all flex items-center justify-center gap-2'
                },
                  'Continuați fără model',
                  h('i', { className: 'fas fa-arrow-right' })
                )
              )
            ),
            // Кнопки навигации
            h('div', { className: 'flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 pt-4 border-t border-zinc-800' },
              h('button', {
                onClick: () => {
                  setStep(2);
                  setSearchQuery('');
                },
                className: 'text-zinc-400 hover:text-white transition flex items-center gap-2'
              },
                h('i', { className: 'fas fa-arrow-left' }),
                window.i18n?.t('calculator.back') || 'Înapoi'
              ),
              h('button', {
                onClick: () => {
                  console.log('➡️ Продолжаем без модели');
                  setData({ ...data, model: null });
                  setStep(4);
                },
                className: 'px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg'
              },
                'Continuă fără model',
                h('i', { className: 'fas fa-arrow-right' })
              )
            )
          ),
          
          // Step 4: Issue Selection (множественный выбор)
          step === 4 && !result && h('div', { className: 'space-y-4 ' },
            h('h3', { className: 'text-lg font-bold text-white mb-2 text-center' }, 
              `${data.model?.name || data.brand?.name || ''} - ${window.i18n?.t('calculator.selectIssue') || 'Ce problemă aveți?'}`
            ),
            h('p', { className: 'text-zinc-400 text-sm text-center mb-4' },
              `Puteți selecta mai multe probleme (${data.issues?.length || 0} selectate)`
            ),
            h('div', { className: 'grid grid-cols-2 md:grid-cols-3 gap-2' },
              ...((function() {
                // Получаем тип устройства
                const deviceType = typeof data.deviceType === 'string' ? data.deviceType : (data.deviceType?.id || 'phone');
                const issueList = issues[deviceType] || issues['phone'] || [];
                return issueList;
              })().map(issue => {
                const isSelected = (data.issues || []).some(i => i.id === issue.id);
                return h('button', {
                  key: issue.id,
                  onClick: () => {
                    if (!issue || !issue.id) return;
                    // Toggle выбор дефекта
                    const currentIssues = data.issues || [];
                    const exists = currentIssues.some(i => i.id === issue.id);
                    const newIssues = exists 
                      ? currentIssues.filter(i => i.id !== issue.id)  // Удаляем
                      : [...currentIssues, issue];  // Добавляем
                    setData({ ...data, issues: newIssues });
                  },
                  className: `group p-3 border rounded-lg transition-all text-left flex items-center gap-2 hover:scale-[1.02] ${
                    isSelected 
                      ? 'bg-blue-600/30 border-blue-500 ring-2 ring-blue-500/50' 
                      : 'bg-zinc-800/40 hover:bg-zinc-800/70 border-zinc-700 hover:border-blue-500/50'
                  }`
                },
                  h('div', { className: `w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-blue-500' : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
                  }` },
                    isSelected 
                      ? h('i', { className: 'fas fa-check text-white text-sm' })
                      : h('i', { className: `fas ${issue.icon || 'fa-wrench'} text-blue-400 text-sm` })
                  ),
                  h('span', { className: `font-medium text-xs ${isSelected ? 'text-blue-300' : 'text-white'}` }, issue.name)
                );
              }))
            ),
            // Показываем выбранные проблемы
            data.issues && data.issues.length > 0 && h('div', { className: 'mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg' },
              h('p', { className: 'text-sm text-blue-300' },
                `✓ Selectate: ${data.issues.map(i => i.name).join(', ')}`
              )
            ),
            // Кнопки: Назад и Рассчитать
            h('div', { className: 'flex items-center justify-center gap-4 mt-6' },
              h('button', {
                onClick: handlePrevious,
                className: 'text-zinc-400 hover:text-white transition flex items-center gap-2'
              },
                h('i', { className: 'fas fa-arrow-left' }),
                'Înapoi'
              ),
              h('button', {
                onClick: () => {
                  if (data.issues && data.issues.length > 0) {
                    calculatePrice();
                  } else if (window.showToast) {
                    window.showToast('Selectați cel puțin o problemă', 'warning', 2000);
                  }
                },
                disabled: !data.issues || data.issues.length === 0,
                className: `px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  data.issues && data.issues.length > 0
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                }`
              },
                h('i', { className: 'fas fa-calculator' }),
                `Calculează prețul${data.issues?.length > 1 ? ` (${data.issues.length})` : ''}`
              )
            )
          ),
          
          // Loading State
          loading && h('div', { className: 'text-center py-8' },
            h('div', { className: 'w-12 h-12 mx-auto mb-4 border-3 border-zinc-700 border-t-blue-500 rounded-full animate-spin' }),
            h('p', { className: 'text-zinc-400 text-sm' }, 'Calculăm prețul...')
          ),
          
          // Step 5: Contact Data Collection
          step === 5 && result && h('div', { className: 'space-y-6 ' },
            h('h3', { className: 'text-2xl font-bold text-white mb-2 text-center' }, 
              'Introduceți datele pentru a obține prețul'
            ),
            h('p', { className: 'text-zinc-400 text-center mb-8' }, 
              'Vă vom contacta în curând cu prețul exact'
            ),
            h('div', { className: 'space-y-4 max-w-md mx-auto' },
              h('div', null,
                h('label', { className: 'block text-sm font-medium text-zinc-300 mb-2' }, 
                  'Numele dvs.'
                ),
                h('input', {
                  type: 'text',
                  value: data.name,
                  onChange: (e) => {
                    setData({ ...data, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  },
                  placeholder: 'Ex: Ion Popescu',
                  className: `w-full px-4 py-3 bg-zinc-800/50 border-2 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${
                    errors.name ? 'border-red-500' : 'border-zinc-700'
                  }`
                }),
                errors.name && h('p', { className: 'text-red-400 text-sm mt-1' }, errors.name)
              ),
              h('div', null,
                h('label', { className: 'block text-sm font-medium text-zinc-300 mb-2' }, 
                  'Telefon'
                ),
                h('input', {
                  type: 'tel',
                  value: data.phone,
                  onChange: (e) => {
                    setData({ ...data, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  },
                  placeholder: '+40 XXX XXX XXX',
                  className: `w-full px-4 py-3 bg-zinc-800/50 border-2 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${
                    errors.phone ? 'border-red-500' : 'border-zinc-700'
                  }`
                }),
                errors.phone && h('p', { className: 'text-red-400 text-sm mt-1' }, errors.phone)
              ),
              h('button', {
                onClick: () => {
                  const newErrors = {};
                  if (!data.name || data.name.trim().length < 2) {
                    newErrors.name = 'Numele trebuie să aibă minim 2 caractere';
                  }
                  if (!data.phone || data.phone.trim().length < 8) {
                    newErrors.phone = 'Telefonul este obligatoriu';
                  }
                  
                  if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    if (window.showToast) {
                      window.showToast('Completați toate câmpurile', 'error', 3000);
                    }
                    return;
                  }
                  
                  // Отправляем лид в Remonline с контактными данными
                  sendLeadToRemonline({
                    name: data.name.trim(),
                    phone: data.phone.trim(),
                    brand: data.brand?.name,
                    deviceType: data.deviceType,
                    model: data.model?.name || 'Not specified',
                    issue: (data.issues || []).map(i => i.name).join(', ') || 'Not specified',
                    estimatedPrice: `${result.min}-${result.max} lei`,
                    source: 'price_calculator'
                  });
                  
                  // Переходим на шаг с результатом
                  setStep(6);
                },
                className: 'w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mt-6'
              },
                h('i', { className: 'fas fa-calculator text-xl' }),
                'Obțineți prețul'
              )
            ),
            h('button', {
              onClick: () => setStep(4),
              className: 'mt-6 text-zinc-400 hover:text-white transition flex items-center gap-2 mx-auto'
            },
              h('i', { className: 'fas fa-arrow-left' }),
              window.i18n?.t('calculator.back') || 'Înapoi'
            )
          ),
          
          // Step 6: Result
          step === 6 && result && h('div', { className: 'text-center space-y-4 ' },
            h('div', { className: 'inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-3' },
              h('i', { className: 'fas fa-circle-check text-3xl text-green-400' })
            ),
            
            h('div', null,
              h('h3', { className: 'text-xl font-bold text-white mb-2' }, 
                window.i18n?.t('calculator.estimatedPrice') || 'Preț estimat'
              ),
              result.model && h('p', { className: 'text-zinc-400 text-sm mb-3' }, result.model),
              result.min === result.max
                ? h('div', { className: 'text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' },
                    result.avg === 0 ? 'GRATUIT' : `${result.avg} lei`
                  )
                : h('div', { className: 'text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' },
                    `${result.min}-${result.max} lei`
                  )
            ),
            
            // Показываем выбранные проблемы
            result.issues && result.issues.length > 0 && h('div', { className: 'bg-blue-500/10 rounded-xl p-4 mb-4 border border-blue-500/30 max-w-sm mx-auto' },
              h('p', { className: 'text-sm font-medium text-blue-300 mb-2' }, 
                `Probleme selectate (${result.issues.length}):`
              ),
              h('ul', { className: 'space-y-1' },
                ...result.issues.map((issue, i) => 
                  h('li', { key: i, className: 'flex items-center gap-2 text-xs text-zinc-300' },
                    h('i', { className: 'fas fa-check text-green-400 text-[10px]' }),
                    issue
                  )
                )
              ),
              result.issues.length > 1 && h('p', { className: 'text-[10px] text-zinc-500 mt-2 pt-2 border-t border-zinc-700/50' },
                '* Reducere 10% aplicată pentru reparații multiple'
              )
            ),
            
            h('div', { className: 'bg-zinc-800/50 rounded-xl p-4 space-y-2 text-left max-w-sm mx-auto border border-zinc-700/50' },
              h('div', { className: 'flex items-center gap-2 text-xs text-zinc-400' },
                h('i', { className: 'fas fa-clock text-blue-400' }),
                `Timp estimat: ${result.time || '30-60 min'}`
              ),
              h('div', { className: 'flex items-center gap-2 text-xs text-zinc-400' },
                h('i', { className: 'fas fa-shield-check text-green-400' }),
                'Garanție 30 zile'
              ),
              h('div', { className: 'flex items-center gap-2 text-xs text-zinc-400' },
                h('i', { className: 'fas fa-stethoscope text-purple-400' }),
                'Diagnostic gratuit'
              )
            ),
            
            h('div', { className: 'flex flex-col sm:flex-row gap-2 justify-center mt-4' },
              // TODO: Add real WhatsApp number in site-config.ts
              // (() => {
              //   const whatsappNumber = window.SITE_CONFIG?.contact?.phoneWhatsApp || '';
              //   if (!whatsappNumber) return null;
              //   return h('a', {
              //     href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bună! Am estimat ${result.min}-${result.max} lei pentru reparație. Doresc să programez.`)}`,
              //     target: '_blank',
              //     className: 'px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all shadow-md flex items-center justify-center gap-2 text-sm'
              //   },
              //     h('i', { className: 'fab fa-whatsapp text-lg' }),
              //     'Comandă pe WhatsApp'
              //   );
              // })(),
              h('button', {
                onClick: reset,
                className: 'px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-all border border-zinc-700 text-sm'
              },
                h('i', { className: 'fas fa-redo mr-1' }),
                'Din nou'
              )
            )
          )
        )
      ),
      
      // Info footer
      step < 6 && h('div', { className: 'text-center mt-4 text-xs text-zinc-500 flex items-center justify-center gap-1' },
        h('i', { className: 'fas fa-circle-info text-[10px]' }),
        window.i18n?.t('calculator.disclaimer') || 'Prețul final poate varia. Diagnostic gratuit.'
      )
    );
  };
  
  // Оборачиваем в ErrorBoundary для защиты от ошибок
  const SafePriceCalculator = () => {
    return h(ErrorBoundary, null, h(PriceCalculator));
  };
  
  window.PriceCalculator = SafePriceCalculator;
  window.PriceCalculatorRaw = PriceCalculator; // Для отладки
  console.log('✅ Modern Price Calculator v3.1 loaded (with Error Boundary)');
})();
