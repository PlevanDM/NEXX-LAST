/**
 * NEXX Modern Price Calculator v3.0
 * Современный калькулятор с дизайном от 21st.dev
 * Обновленный UI с градиентами, анимациями и улучшенным UX
 */

(function() {
  'use strict';
  
  const h = React.createElement;
  
  // Check if Framer Motion is available
  const hasFramerMotion = typeof window !== 'undefined' && window.motion;
  
  // Ціни по категоріях ремонтів (базові ціни)
  const REPAIR_PRICES = {
    screen: { 
      phone: { min: 80, max: 300, avg: 150 },
      tablet: { min: 120, max: 400, avg: 250 },
      laptop: { min: 200, max: 800, avg: 450 },
      watch: { min: 60, max: 200, avg: 120 }
    },
    battery: {
      phone: { min: 60, max: 150, avg: 90 },
      tablet: { min: 80, max: 200, avg: 120 },
      laptop: { min: 150, max: 400, avg: 250 },
      watch: { min: 50, max: 150, avg: 90 }
    },
    charging: {
      phone: { min: 40, max: 120, avg: 70 },
      tablet: { min: 50, max: 150, avg: 90 },
      laptop: { min: 80, max: 200, avg: 120 },
      watch: { min: 30, max: 100, avg: 60 }
    },
    camera: {
      phone: { min: 80, max: 250, avg: 140 },
      tablet: { min: 100, max: 200, avg: 150 },
      laptop: { min: 120, max: 300, avg: 180 },
      watch: { min: 50, max: 150, avg: 80 }
    },
    motherboard: {
      phone: { min: 150, max: 600, avg: 350 },
      tablet: { min: 200, max: 700, avg: 400 },
      laptop: { min: 300, max: 1200, avg: 600 },
      watch: { min: 100, max: 400, avg: 200 }
    },
    keyboard: {
      laptop: { min: 100, max: 350, avg: 200 },
      phone: { min: 50, max: 150, avg: 80 },
      tablet: { min: 60, max: 180, avg: 100 },
      watch: { min: 40, max: 120, avg: 70 }
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
    battery: 1.0,    // Простая замена
    charging: 1.2,   // Средняя сложность (очистка, пайка)
    camera: 1.3,     // Средняя сложность
    motherboard: 2.5, // Высокая сложность (BGA, пайка микросхем)
    keyboard: 1.5,   // Средняя сложность
    diagnostic: 0.0  // Бесплатно
  };
  
  // Коэффициенты возраста модели (для редких запчастей)
  const AGE_FACTORS = {
    current: 1.0,    // Текущие модели (2023-2026)
    recent: 1.1,     // Недавние (2020-2022)
    old: 1.3,        // Старые (2017-2019)
    veryOld: 1.5     // Очень старые (до 2017)
  };
  
  // Коэффициенты бренда (премиум бренды дороже)
  const BRAND_FACTORS = {
    apple: 1.2,
    samsung: 1.1,
    xiaomi: 0.9,
    huawei: 1.0,
    other: 1.0
  };
  
  const PriceCalculator = () => {
    const [step, setStep] = React.useState(1);
    const [data, setData] = React.useState({
      brand: null,
      deviceType: null,
      model: null,
      issue: null,
      name: '',
      phone: ''
    });
    const [result, setResult] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [models, setModels] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [direction, setDirection] = React.useState(0);
    const [errors, setErrors] = React.useState({});
    
    // Load models from NEXXDatabase
    React.useEffect(() => {
      let isMounted = true;
      
      const loadModels = async () => {
        // Ждем загрузки базы данных
        if (!window.NEXXDatabase) {
          // Если база еще не загружена, ждем
          const checkInterval = setInterval(() => {
            if (window.NEXXDatabase && !window.NEXXDatabase.loading) {
              clearInterval(checkInterval);
              if (isMounted) {
                if (window.NEXXDatabase.loaded) {
                  setModels(window.NEXXDatabase.devices || []);
                  console.log(`✅ Загружено ${(window.NEXXDatabase.devices || []).length} моделей из базы данных`);
                } else {
                  window.NEXXDatabase.loadAll().then(() => {
                    if (isMounted) {
                      setModels(window.NEXXDatabase.devices || []);
                      console.log(`✅ Загружено ${(window.NEXXDatabase.devices || []).length} моделей из базы данных`);
                    }
                  }).catch(e => {
                    console.error('❌ Ошибка загрузки базы данных:', e);
                    if (isMounted) setModels([]);
                  });
                }
              }
            }
          }, 100);
          
          // Таймаут на случай, если база не загрузится
          setTimeout(() => {
            clearInterval(checkInterval);
            if (isMounted && !window.NEXXDatabase?.devices) {
              console.warn('⚠️ База данных не загружена, используем fallback');
              // Fallback: загружаем напрямую
              fetch('/data/devices.json')
                .then(r => r.json())
                .then(devices => {
                  if (isMounted && Array.isArray(devices)) {
                    setModels(devices);
                    console.log(`✅ Загружено ${devices.length} моделей (fallback)`);
                  }
                })
                .catch(e => {
                  console.error('❌ Ошибка fallback загрузки:', e);
                  if (isMounted) setModels([]);
                });
            }
          }, 5000);
          
          return;
        }
        
        // База уже есть
        if (window.NEXXDatabase.loaded) {
          if (isMounted) {
            setModels(window.NEXXDatabase.devices || []);
            console.log(`✅ Загружено ${(window.NEXXDatabase.devices || []).length} моделей из базы данных`);
          }
        } else if (!window.NEXXDatabase.loading) {
          // Загружаем базу
          window.NEXXDatabase.loadAll().then(() => {
            if (isMounted) {
              setModels(window.NEXXDatabase.devices || []);
              console.log(`✅ Загружено ${(window.NEXXDatabase.devices || []).length} моделей из базы данных`);
            }
          }).catch(e => {
            console.error('❌ Ошибка загрузки базы данных:', e);
            if (isMounted) setModels([]);
          });
        }
      };
      
      loadModels();
      
      return () => {
        isMounted = false;
      };
    }, []);
    
    const brands = [
      { id: 'apple', name: 'Apple', icon: 'fab fa-apple', color: 'from-gray-600 to-gray-800', gradient: 'from-blue-500/20 to-purple-500/20' },
      { id: 'samsung', name: 'Samsung', icon: 'fas fa-mobile-screen', color: 'from-blue-500 to-blue-700', gradient: 'from-blue-500/20 to-cyan-500/20' },
      { id: 'xiaomi', name: 'Xiaomi', icon: 'fas fa-circle-notch', color: 'from-orange-500 to-orange-700', gradient: 'from-orange-500/20 to-red-500/20' },
      { id: 'huawei', name: 'Huawei', icon: 'fas fa-square-full', color: 'from-red-500 to-red-700', gradient: 'from-red-500/20 to-pink-500/20' },
      { id: 'other', name: 'Alte mărci', icon: 'fas fa-sitemap', color: 'from-gray-500 to-gray-700', gradient: 'from-gray-500/20 to-gray-600/20' }
    ];
    
    const deviceTypes = [
      { id: 'phone', name: 'Telefon', icon: 'fa-mobile', color: 'from-blue-500 to-blue-700' },
      { id: 'tablet', name: 'Tabletă', icon: 'fa-tablet', color: 'from-purple-500 to-purple-700' },
      { id: 'laptop', name: 'Laptop', icon: 'fa-laptop', color: 'from-green-500 to-green-700' },
      { id: 'watch', name: 'Smartwatch', icon: 'fa-watch', color: 'from-pink-500 to-pink-700' }
    ];
    
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
      { id: 2, name: 'Tip', icon: 'fa-device' },
      { id: 3, name: 'Model', icon: 'fa-list' },
      { id: 4, name: 'Problemă', icon: 'fa-wrench' },
      { id: 5, name: 'Date', icon: 'fa-user' },
      { id: 6, name: 'Rezultat', icon: 'fa-check' }
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
      if (!data.deviceType || !data.issue) {
        if (window.showToast) {
          window.showToast('Selectați toate câmpurile necesare', 'warning', 3000);
        }
        return;
      }
      
      setLoading(true);
      
      setTimeout(async () => {
        try {
          const deviceType = data.deviceType;
          const issue = data.issue;
          const model = data.model;
          
          console.log(`🔍 Расчет цены: deviceType=${deviceType}, issue=${issue?.id || issue?.name}, model=${model?.name || 'не выбрана'}`);
          
          let priceData = null;
          
          // Приоритет 1: Цена из базы данных NEXXDatabase
          if (model && window.NEXXDatabase && typeof window.NEXXDatabase.getDevicePrice === 'function') {
            try {
              const deviceName = typeof model === 'string' ? model : (model.name || '');
              const dbPrice = window.NEXXDatabase.getDevicePrice(deviceName, issue.id);
              if (dbPrice && typeof dbPrice === 'number' && dbPrice > 0) {
                priceData = {
                  min: Math.round(dbPrice * 0.8),
                  max: Math.round(dbPrice * 1.2),
                  avg: dbPrice
                };
                console.log(`✅ Цена из базы данных: ${dbPrice} lei для ${deviceName} - ${issue.id}`);
              }
            } catch (dbError) {
              console.warn('⚠️ Ошибка получения цены из БД:', dbError);
            }
          }
          
          // Приоритет 2: Цена из official_service_prices модели
          if (!priceData && model && model.official_service_prices) {
            const prices = model.official_service_prices;
            const issueKey = issue.id;
            
            // Пробуем разные варианты ключей
            let price = prices[issueKey];
            if (!price) {
              // Маппинг ключей проблем на ключи цен
              const keyMap = {
                'screen': 'display',
                'battery': 'battery',
                'charging': 'charging_port',
                'camera': 'rear_camera',
                'motherboard': 'logic_board',
                'keyboard': 'keyboard',
                'diagnostic': 'diagnostic'
              };
              const mappedKey = keyMap[issueKey];
              if (mappedKey && prices[mappedKey]) {
                price = prices[mappedKey];
              }
            }
            
            if (price && typeof price === 'number' && price > 0) {
              priceData = {
                min: Math.round(price * 0.8),
                max: Math.round(price * 1.2),
                avg: price
              };
              console.log(`✅ Цена из модели: ${price} lei для ${model.name} - ${issueKey}`);
            }
          }
          
          // Приоритет 3: Цена из masterDb по категории
          if (!priceData && window.NEXXDatabase && window.NEXXDatabase.masterDb) {
            try {
              const category = model?.category?.toLowerCase() || deviceType;
              const categoryMap = {
                'phone': 'phone',
                'tablet': 'tablet',
                'laptop': 'laptop',
                'iphone': 'phone',
                'ipad': 'tablet',
                'macbook': 'laptop'
              };
              const mappedCategory = categoryMap[category] || deviceType;
              
              const commonPrice = window.NEXXDatabase.getPrice(
                data.brand?.id || 'apple',
                issue.price || issue.id
              );
              
              if (commonPrice && typeof commonPrice === 'object') {
                const categoryPrice = commonPrice[mappedCategory] || commonPrice.avg || commonPrice;
                if (categoryPrice && typeof categoryPrice === 'number' && categoryPrice > 0) {
                  priceData = {
                    min: Math.round(categoryPrice * 0.8),
                    max: Math.round(categoryPrice * 1.2),
                    avg: categoryPrice
                  };
                  console.log(`✅ Цена из общих цен: ${categoryPrice} lei для ${mappedCategory} - ${issue.id}`);
                }
              }
            } catch (e) {
              console.warn('⚠️ Ошибка получения общей цены:', e);
            }
          }
          
          // Приоритет 4: Онлайн-запрос цены через API (параллельно, не блокирует)
          // Запрос выполняется асинхронно с таймаутом
          if (!priceData) {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 2000); // Таймаут 2 секунды
              
              const apiResponse = await Promise.race([
                fetch('/api/price-estimate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    brand: data.brand?.id || 'apple',
                    deviceType: deviceType,
                    model: model?.name || null,
                    issue: issue.id
                  }),
                  signal: controller.signal
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
              ]);
              
              clearTimeout(timeoutId);
              
              if (apiResponse && apiResponse.ok) {
                const apiData = await apiResponse.json();
                if (apiData.success && apiData.price && apiData.price.avg > 0) {
                  priceData = apiData.price;
                  console.log(`✅ Цена из онлайн API: ${apiData.price.avg} lei (источник: ${apiData.source})`);
                }
              }
            } catch (apiError) {
              // Тихая ошибка - не критично, используем локальный расчет
              if (apiError.name !== 'AbortError' && apiError.message !== 'Timeout') {
                console.debug('Онлайн-запрос цены недоступен, используем локальный расчет');
              }
            }
          }
          
          // Приоритет 5: Расчет на основе базовых цен с коэффициентами
          if (!priceData) {
            console.log(`📊 Пробуем расчет на основе базовых цен: issue.id=${issue.id}, issue.price=${issue.price}, deviceType=${deviceType}`);
            
            // Пробуем получить базовую цену по issue.id
            let basePrice = REPAIR_PRICES[issue.id]?.[deviceType];
            
            console.log(`🔍 Поиск базовой цены: REPAIR_PRICES[${issue.id}]?.[${deviceType}] =`, basePrice);
            
            // Если не нашли по issue.id, пробуем по issue.price
            if (!basePrice && issue.price) {
              basePrice = REPAIR_PRICES[issue.price]?.[deviceType];
              console.log(`🔍 Поиск по issue.price: REPAIR_PRICES[${issue.price}]?.[${deviceType}] =`, basePrice);
            }
            
            // Если все еще нет, пробуем найти любую цену для этого типа устройства
            if (!basePrice) {
              console.log(`⚠️ Не найдена цена для ${issue.id}/${issue.price} и ${deviceType}, ищем альтернативу...`);
              // Ищем первую доступную цену для этого типа устройства
              for (const issueKey in REPAIR_PRICES) {
                const priceForDevice = REPAIR_PRICES[issueKey]?.[deviceType];
                if (priceForDevice && priceForDevice.avg) {
                  basePrice = priceForDevice;
                  console.log(`⚠️ Используем базовую цену для ${issueKey} вместо ${issue.id}`);
                  break;
                }
              }
            }
            
            if (basePrice && basePrice.avg) {
              let calculatedPrice = basePrice.avg;
              console.log(`💰 Базовая цена: ${calculatedPrice} lei`);
              
              // Применяем коэффициент сложности
              const complexityFactor = COMPLEXITY_FACTORS[issue.id] || COMPLEXITY_FACTORS[issue.price] || 1.0;
              calculatedPrice *= complexityFactor;
              console.log(`📈 После коэффициента сложности (${complexityFactor}): ${calculatedPrice} lei`);
              
              // Применяем коэффициент возраста модели (если модель выбрана)
              if (model && model.year) {
                const modelYear = model.year;
                const currentYear = new Date().getFullYear();
                const age = currentYear - modelYear;
                let ageFactor = AGE_FACTORS.current;
                if (age <= 1) ageFactor = AGE_FACTORS.current;
                else if (age <= 3) ageFactor = AGE_FACTORS.recent;
                else if (age <= 6) ageFactor = AGE_FACTORS.old;
                else ageFactor = AGE_FACTORS.veryOld;
                calculatedPrice *= ageFactor;
                console.log(`📅 После коэффициента возраста (${ageFactor}, возраст: ${age} лет): ${calculatedPrice} lei`);
              }
              
              // Применяем коэффициент бренда
              const brandId = data.brand?.id || 'other';
              const brandFactor = BRAND_FACTORS[brandId] || BRAND_FACTORS.other;
              calculatedPrice *= brandFactor;
              console.log(`🏷️ После коэффициента бренда (${brandFactor}): ${calculatedPrice} lei`);
              
              // Округляем до ближайших 10
              calculatedPrice = Math.round(calculatedPrice / 10) * 10;
              
              // Минимальная цена не должна быть меньше 30
              if (calculatedPrice < 30) calculatedPrice = 30;
              
              priceData = {
                min: Math.max(30, Math.round(calculatedPrice * 0.75)),
                max: Math.round(calculatedPrice * 1.35),
                avg: calculatedPrice
              };
              
              console.log(`✅ Итоговая расчетная цена: ${priceData.avg} lei (диапазон: ${priceData.min}-${priceData.max}) для ${deviceType} - ${issue.id}`);
            } else {
              console.warn(`❌ Не найдена базовая цена для ${issue.id}/${issue.price} и ${deviceType}`);
            }
          }
          
          // Последний fallback: используем минимальные цены из REPAIR_PRICES
          if (!priceData) {
            console.log(`🔄 Используем последний fallback для ${deviceType}...`);
            // Пробуем найти любую цену для этого типа устройства
            for (const issueKey in REPAIR_PRICES) {
              const priceForDevice = REPAIR_PRICES[issueKey]?.[deviceType];
              if (priceForDevice) {
                priceData = {
                  min: priceForDevice.min || 50,
                  max: priceForDevice.max || 200,
                  avg: priceForDevice.avg || 100
                };
                console.log(`⚠️ Используем fallback цену из REPAIR_PRICES для ${issueKey} - ${deviceType}: ${priceData.avg} lei`);
                break;
              }
            }
          }
          
          if (priceData && typeof priceData.min === 'number' && typeof priceData.max === 'number') {
            let time = '30-60 min';
            if (issue.id === 'board' || issue.id === 'water') {
              time = deviceType === 'phone' || deviceType === 'tablet' ? '2-4 ore' : '4-8 ore';
            } else if (deviceType === 'laptop') {
              time = '1-2 ore';
            } else if (deviceType === 'tablet') {
              time = '45-90 min';
            }
            
            const resultData = {
              min: priceData.min,
              max: priceData.max,
              avg: priceData.avg,
              diagnostic: `Posibilă cauză: ${issue.name}`,
              time: time,
              model: model?.name || null
            };
            
            setResult(resultData);
            // Переходим на шаг сбора контактных данных, а не сразу показываем результат
            setStep(5);
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
    
    const getFilteredModels = React.useCallback(() => {
      if (!data.brand || !data.deviceType) return [];
      
      const n_brand = data.brand.id.toLowerCase();
      const deviceType = data.deviceType;
      
      // Используем базу данных для фильтрации, если доступна
      let filtered = [];
      
      if (window.NEXXDatabase && window.NEXXDatabase.devices && Array.isArray(window.NEXXDatabase.devices)) {
        // Фильтруем модели из базы данных
        filtered = window.NEXXDatabase.devices.filter(m => {
          if (!m || !m.name) return false;
          const n = m.name.toLowerCase();
          const category = (m.category || '').toLowerCase();
          
          // Фильтр по бренду
          let brandMatch = false;
          switch (n_brand) {
            case 'apple':
              brandMatch = n.includes('iphone') || n.includes('ipad') || n.includes('macbook') || n.includes('imac') || n.includes('mac') || n.includes('watch') ||
                          category.includes('iphone') || category.includes('ipad') || category.includes('macbook') || category.includes('watch');
              break;
            case 'samsung':
              brandMatch = n.includes('samsung') || n.includes('galaxy') || category.includes('samsung') || category.includes('galaxy');
              break;
            case 'xiaomi':
              brandMatch = n.includes('xiaomi') || n.includes('redmi') || n.includes('poco') || category.includes('xiaomi');
              break;
            case 'huawei':
              brandMatch = n.includes('huawei') || n.includes('honor') || category.includes('huawei') || category.includes('honor');
              break;
            default:
              brandMatch = true;
          }
          
          if (!brandMatch) return false;
          
          // Фильтр по типу устройства
          if (deviceType === 'phone') {
            // Для телефонов: iPhone, Samsung Galaxy, Xiaomi, Huawei и другие смартфоны
            if (n_brand === 'apple') {
              return (n.includes('iphone') || category.includes('iphone')) && 
                     !n.includes('ipad') && !n.includes('macbook') && !n.includes('tablet') && !n.includes('watch');
            } else if (n_brand === 'samsung') {
              // Samsung телефоны: все Galaxy модели кроме Tab и Watch
              // Проверяем категорию "Samsung" ИЛИ название содержит "galaxy" (но не tab)
              const isSamsung = category === 'samsung' || n.includes('samsung') || n.includes('galaxy');
              const isNotTablet = !n.includes('tab') && !n.includes('tablet');
              const isNotWatch = !n.includes('watch');
              return isSamsung && isNotTablet && isNotWatch;
            } else if (n_brand === 'xiaomi') {
              // Xiaomi телефоны: все модели кроме Pad, Laptop и Watch
              const isXiaomi = category === 'xiaomi' || n.includes('xiaomi') || n.includes('redmi') || n.includes('poco');
              const isNotTablet = !n.includes('pad') && !n.includes('tablet');
              const isNotLaptop = !n.includes('laptop') && !n.includes('notebook') && !category.includes('laptop');
              const isNotWatch = !n.includes('watch') && !category.includes('watch');
              return isXiaomi && isNotTablet && isNotLaptop && isNotWatch;
            } else {
              // Другие бренды - все что не планшет/ноутбук/часы
              return !n.includes('tablet') && !n.includes('pad') && !n.includes('macbook') && 
                     !n.includes('laptop') && !n.includes('notebook') && !n.includes('watch') &&
                     !category.includes('tablet') && !category.includes('laptop') && !category.includes('watch');
            }
          } else if (deviceType === 'tablet') {
            // Для планшетов: iPad, Galaxy Tab, Xiaomi Pad и исключаем телефоны/ноутбуки
            const isTablet = n.includes('ipad') || n.includes('tablet') || n.includes('tab') || n.includes('pad') ||
                            category.includes('ipad') || category.includes('tablet');
            
            // Исключаем телефоны, ноутбуки и часы
            const isNotPhone = !n.includes('iphone') && !n.includes('galaxy s') && 
                              !category.includes('iphone') && !category.includes('phone');
            const isNotLaptop = !n.includes('macbook') && !n.includes('laptop') && !n.includes('notebook') &&
                               !category.includes('macbook') && !category.includes('laptop');
            const isNotWatch = !n.includes('watch') && !category.includes('watch');
            
            return isTablet && isNotPhone && isNotLaptop && isNotWatch;
          } else if (deviceType === 'laptop') {
            // Для ноутбуков: MacBook, Windows ноутбуки, Xiaomi ноутбуки, и исключаем телефоны/планшеты
            const isLaptop = n.includes('macbook') || n.includes('mac') || n.includes('laptop') || 
                            n.includes('xps') || n.includes('inspiron') || n.includes('latitude') ||
                            n.includes('pavilion') || n.includes('spectre') || n.includes('elitebook') ||
                            n.includes('thinkpad') || n.includes('ideapad') || n.includes('legion') ||
                            n.includes('zenbook') || n.includes('vivobook') || n.includes('rog') ||
                            n.includes('aspire') || n.includes('swift') || n.includes('predator') ||
                            n.includes('surface') || n.includes('blade') ||
                            n.includes('mi book') || n.includes('redmibook') || n.includes('mi notebook') ||
                            category.includes('macbook') || category.includes('laptop') || category.includes('notebook');
            
            // Исключаем телефоны, планшеты и часы
            // Для Xiaomi: исключаем телефоны (Xiaomi, Redmi, Poco), но включаем ноутбуки (Mi Book, RedmiBook)
            const isNotPhone = !(n.includes('xiaomi') && !n.includes('book') && !n.includes('notebook')) &&
                               !(n.includes('redmi') && !n.includes('book') && !n.includes('notebook')) &&
                               !(n.includes('poco') && !n.includes('book')) &&
                               !n.includes('iphone') && !(n.includes('galaxy') && !n.includes('tab')) &&
                               !n.includes('huawei') && !category.includes('iphone') && !category.includes('phone');
            const isNotTablet = !n.includes('ipad') && !n.includes('tablet') && !n.includes('tab') && 
                               !n.includes('pad') && !category.includes('ipad') && !category.includes('tablet');
            const isNotWatch = !n.includes('watch') && !category.includes('watch');
            
            return isLaptop && isNotPhone && isNotTablet && isNotWatch;
          } else if (deviceType === 'watch') {
            // Для watch: фильтруем по бренду
            if (n_brand === 'apple') {
              return (n.includes('watch') || category.includes('watch')) && 
                     (n.includes('apple') || n.includes('watch') || category.includes('watch'));
            } else if (n_brand === 'samsung') {
              return (n.includes('watch') || category.includes('watch')) && 
                     (n.includes('samsung') || n.includes('galaxy') || category.includes('samsung'));
            } else if (n_brand === 'xiaomi') {
              return (n.includes('watch') || category.includes('watch')) && 
                     (n.includes('xiaomi') || category.includes('xiaomi'));
            } else if (n_brand === 'huawei') {
              return (n.includes('watch') || category.includes('watch')) && 
                     (n.includes('huawei') || n.includes('honor') || category.includes('huawei'));
            } else {
              // Другие бренды - все watch
              return n.includes('watch') || category.includes('watch');
            }
          }
          
          return true;
        });
      } else if (Array.isArray(models) && models.length > 0) {
        // Fallback: фильтруем из локального состояния
        filtered = models.filter(m => {
          if (!m || !m.name) return false;
          const n = m.name.toLowerCase();
          const category = (m.category || '').toLowerCase();
          
          // Фильтр по бренду
          let brandMatch = false;
          switch (n_brand) {
            case 'apple':
              brandMatch = n.includes('iphone') || n.includes('ipad') || n.includes('macbook') || n.includes('imac') || n.includes('mac') || 
                          category.includes('iphone') || category.includes('ipad');
              break;
            case 'samsung':
              brandMatch = n.includes('samsung') || n.includes('galaxy') || category.includes('samsung') || category.includes('watch');
              break;
            case 'xiaomi':
              brandMatch = n.includes('xiaomi') || n.includes('redmi') || n.includes('poco') || category.includes('xiaomi');
              break;
            case 'huawei':
              brandMatch = n.includes('huawei') || n.includes('honor') || category.includes('huawei');
              break;
            default:
              brandMatch = true;
          }
          
          if (!brandMatch) return false;
          
          // Фильтр по типу устройства
          if (deviceType === 'phone') {
            // Телефоны: iPhone, Galaxy S, Xiaomi, Huawei и другие смартфоны (но НЕ ноутбуки)
            const isPhone = (n.includes('iphone') || category.includes('iphone') ||
                            (n.includes('galaxy') && !n.includes('tab') && !n.includes('watch') && !n.includes('book')) ||
                            ((n.includes('xiaomi') || n.includes('redmi') || n.includes('poco')) && 
                             !n.includes('book') && !n.includes('notebook')) ||
                            (n.includes('huawei') || n.includes('honor'))) &&
                            !n.includes('ipad') && !n.includes('macbook') && !n.includes('tablet') && 
                            !n.includes('laptop') && !n.includes('notebook') && !n.includes('watch') &&
                            !n.includes('pad') && !n.includes('tab');
            return isPhone;
          } else if (deviceType === 'tablet') {
            // Планшеты: iPad, Galaxy Tab, Xiaomi Pad
            const isTablet = (n.includes('ipad') || n.includes('tablet') || n.includes('tab') || n.includes('pad') ||
                            category.includes('ipad') || category.includes('tablet')) &&
                            !n.includes('iphone') && !n.includes('macbook') && !n.includes('laptop') &&
                            !n.includes('notebook') && !n.includes('watch');
            return isTablet;
          } else if (deviceType === 'laptop') {
            // Ноутбуки: MacBook, Windows ноутбуки, Xiaomi ноутбуки (Dell, HP, Lenovo, Asus, Acer и т.д.)
            const isLaptop = (n.includes('macbook') || n.includes('mac') || n.includes('laptop') ||
                            n.includes('xps') || n.includes('inspiron') || n.includes('latitude') ||
                            n.includes('pavilion') || n.includes('spectre') || n.includes('elitebook') ||
                            n.includes('thinkpad') || n.includes('ideapad') || n.includes('legion') ||
                            n.includes('zenbook') || n.includes('vivobook') || n.includes('rog') ||
                            n.includes('aspire') || n.includes('swift') || n.includes('predator') ||
                            n.includes('surface') || n.includes('blade') ||
                            n.includes('mi book') || n.includes('redmibook') || n.includes('mi notebook') ||
                            category.includes('macbook') || category.includes('laptop') || category.includes('notebook')) &&
                            !n.includes('iphone') && !(n.includes('galaxy') && !n.includes('tab')) &&
                            !(n.includes('xiaomi') && !n.includes('book') && !n.includes('notebook')) &&
                            !(n.includes('redmi') && !n.includes('book') && !n.includes('notebook')) &&
                            !(n.includes('poco') && !n.includes('book')) &&
                            !n.includes('ipad') && !n.includes('tablet') && !n.includes('tab') && 
                            !n.includes('pad') && !n.includes('watch');
            return isLaptop;
          } else if (deviceType === 'watch') {
            // Для watch: фильтруем по бренду (fallback логика)
            if (n_brand === 'apple') {
              return (n.includes('watch') || category.includes('watch')) && 
                     (n.includes('apple') || n.includes('watch') || category.includes('watch'));
            } else if (n_brand === 'samsung') {
              return (n.includes('watch') || category.includes('watch')) && 
                     (n.includes('samsung') || n.includes('galaxy') || category.includes('samsung'));
            } else if (n_brand === 'xiaomi') {
              return (n.includes('watch') || category.includes('watch')) && 
                     (n.includes('xiaomi') || category.includes('xiaomi'));
            } else if (n_brand === 'huawei') {
              return (n.includes('watch') || category.includes('watch')) && 
                     (n.includes('huawei') || n.includes('honor') || category.includes('huawei'));
            } else {
              // Другие бренды - все watch
              return n.includes('watch') || category.includes('watch');
            }
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
        console.log(`✅ Фильтрация: бренд=${n_brand}, тип=${deviceType}, найдено=${filtered.length} моделей`);
        console.log('Примеры:', filtered.slice(0, 3).map(m => `${m.name} (${m.category})`));
      } else {
        console.warn(`⚠️ Не найдено моделей: бренд=${n_brand}, тип=${deviceType}`);
        // Показываем все устройства этого бренда для отладки
        if (window.NEXXDatabase && window.NEXXDatabase.devices) {
          const allBrand = window.NEXXDatabase.devices.filter(m => {
            const n = (m.name || '').toLowerCase();
            const cat = (m.category || '').toLowerCase();
            if (n_brand === 'samsung') return n.includes('samsung') || n.includes('galaxy') || cat === 'samsung';
            if (n_brand === 'xiaomi') return n.includes('xiaomi') || n.includes('redmi') || n.includes('poco') || cat === 'xiaomi';
            return false;
          });
          console.log(`Всего устройств бренда ${n_brand}:`, allBrand.length);
          console.log('Примеры:', allBrand.slice(0, 5).map(m => `${m.name} (${m.category})`));
        }
      }
      
      return filtered;
    }, [data.brand, data.deviceType, models, searchQuery]);
    
    const reset = () => {
      setStep(1);
      setData({ brand: null, deviceType: null, model: null, issue: null, name: '', phone: '' });
      setResult(null);
      setSearchQuery('');
      setDirection(-1);
      setErrors({});
    };
    
    return h('div', { id: 'calculator', className: 'max-w-5xl mx-auto' },
      h('div', { className: 'bg-gradient-to-br from-zinc-900/90 via-zinc-900 to-zinc-950/90 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-sm' },
        // Modern Header
        h('div', { className: 'text-center mb-10' },
          h('div', { className: 'inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full mb-5 backdrop-blur-sm' },
            h('i', { className: 'fas fa-calculator text-blue-400 text-lg' }),
            h('span', { className: 'text-sm font-semibold text-zinc-300' }, 
              window.i18n?.t('calculator.calculator') || 'Calculator preț'
            )
          ),
          h('h2', { className: 'text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent mb-4' }, 
            window.i18n?.t('calculator.title') || 'Estimare gratuită online'
          ),
          h('p', { className: 'text-zinc-400 text-lg' }, 
            window.i18n?.t('calculator.description') || 'Răspundeți la câteva întrebări pentru a afla prețul aproximativ'
          )
        ),
        
        // Modern Steps Indicator
        step < 6 && h('div', { className: 'mb-10' },
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
                className: `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
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
        h('div', { className: 'min-h-[400px] relative' },
          // Step 1: Brand Selection
          step === 1 && !result && h('div', { className: 'space-y-6 animate-fadeIn' },
            h('h3', { className: 'text-2xl font-bold text-white mb-8 text-center' }, 
              window.i18n?.t('calculator.selectBrand') || 'Alegeți marca:'
            ),
            h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
              ...brands.map(brand => h('button', {
                key: brand.id,
                onClick: () => {
                  setData({ ...data, brand });
                  handleNext();
                },
                className: 'group relative p-6 bg-zinc-800/50 hover:bg-zinc-800 border-2 border-zinc-700 hover:border-blue-500 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20 overflow-hidden cursor-pointer'
              },
                h('div', { 
                  className: `absolute inset-0 bg-gradient-to-br ${brand.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`
                }),
                h('div', { 
                  className: `w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${brand.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`
                },
                  h('i', { className: `fas ${brand.icon} text-2xl text-white` })
                ),
                h('div', { className: 'font-semibold text-white text-lg relative z-10' }, brand.name)
              ))
            )
          ),
          
          // Step 2: Device Type
          step === 2 && !result && h('div', { className: 'space-y-6 animate-fadeIn' },
            h('h3', { className: 'text-2xl font-bold text-white mb-8 text-center' }, 
              `${data.brand?.name} - ${window.i18n?.t('calculator.selectDevice') || 'Alegeți tipul:'}`
            ),
            h('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
              ...deviceTypes.map(type => h('button', {
                key: type.id,
                onClick: () => {
                  setData({ ...data, deviceType: type.id });
                  setTimeout(() => {
                    const filteredModels = getFilteredModels();
                    setStep(filteredModels.length > 0 ? 3 : 4);
                  }, 0);
                },
                className: 'group p-6 bg-zinc-800/50 hover:bg-zinc-800 border-2 border-zinc-700 hover:border-blue-500 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden cursor-pointer'
              },
                h('div', { 
                  className: `absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`
                }),
                h('div', { 
                  className: `w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`
                },
                  h('i', { className: `fas ${type.icon} text-2xl text-white` })
                ),
                h('div', { className: 'font-semibold text-white text-sm relative z-10' }, type.name)
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
          step === 3 && !result && h('div', { className: 'space-y-6 animate-fadeIn' },
            h('h3', { className: 'text-2xl font-bold text-white mb-6 text-center' }, 
              window.i18n?.t('calculator.selectModel') || 'Alegeți modelul:'
            ),
            h('div', { className: 'relative mb-6' },
              h('div', { className: 'absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500' },
                h('i', { className: 'fas fa-search' })
              ),
              h('input', {
                type: 'text',
                placeholder: 'Căutați model...',
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: 'w-full pl-12 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all'
              })
            ),
            h('div', { className: 'space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar' },
              getFilteredModels()
                .slice(0, 30)
                .map(model => h('button', {
                  key: model.name,
                  onClick: () => {
                    setData({ ...data, model });
                    handleNext();
                  },
                  className: 'w-full p-4 bg-zinc-800/40 hover:bg-zinc-800/70 border-2 border-zinc-700 hover:border-blue-500/50 rounded-xl transition-all text-left flex items-center justify-between group'
                },
                  h('div', null,
                    h('div', { className: 'text-white font-semibold truncate' }, model.name),
                    h('div', { className: 'text-zinc-500 text-sm mt-1' }, 
                      `${model.year || 'N/A'} • ${model.category || 'N/A'}`
                    )
                  ),
                  h('i', { className: 'fas fa-chevron-right text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0' })
                ))
            ),
            getFilteredModels().length === 0 && h('div', { className: 'text-center py-12 text-zinc-400' },
              h('i', { className: 'fas fa-search text-4xl mb-4 opacity-50' }),
              h('p', null, 'Niciun model găsit. Încercați altă căutare.')
            ),
            h('button', {
              onClick: handlePrevious,
              className: 'mt-6 text-zinc-400 hover:text-white transition flex items-center gap-2 mx-auto'
            },
              h('i', { className: 'fas fa-arrow-left' }),
              window.i18n?.t('calculator.back') || 'Înapoi'
            )
          ),
          
          // Step 4: Issue Selection
          step === 4 && !result && h('div', { className: 'space-y-6 animate-fadeIn' },
            h('h3', { className: 'text-2xl font-bold text-white mb-2 text-center' }, 
              `${data.brand?.name || ''}${data.model?.name ? ` ${data.model.name}` : ''} - ${window.i18n?.t('calculator.selectIssue') || 'Ce problemă aveți?'}`
            ),
            h('p', { className: 'text-zinc-400 text-center mb-8' }, 'Selectați tipul de reparație'),
            h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
              ...(issues[data.deviceType] || []).map(issue => h('button', {
                key: issue.id,
                onClick: () => {
                  if (!issue || !issue.id) return;
                  setData({ ...data, issue });
                  setTimeout(() => calculatePrice(), 100);
                },
                className: 'group p-5 bg-zinc-800/40 hover:bg-zinc-800/70 border-2 border-zinc-700 hover:border-blue-500/50 rounded-xl transition-all text-left flex items-center justify-between hover:scale-105 hover:shadow-lg'
              },
                h('div', { className: 'flex items-center gap-4' },
                  h('div', { className: 'w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform' },
                    h('i', { className: `fas ${issue.icon || 'fa-wrench'} text-blue-400` })
                  ),
                  h('span', { className: 'text-white font-medium text-lg' }, issue.name)
                ),
                h('i', { className: 'fas fa-chevron-right text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all' })
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
          
          // Loading State
          loading && h('div', { className: 'text-center py-16' },
            h('div', { className: 'w-20 h-20 mx-auto mb-6 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin' }),
            h('p', { className: 'text-zinc-400 text-lg' }, 'Calculăm prețul...')
          ),
          
          // Step 5: Contact Data Collection
          step === 5 && result && h('div', { className: 'space-y-6 animate-fadeIn' },
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
                    issue: data.issue?.name,
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
          step === 6 && result && h('div', { className: 'text-center space-y-8 animate-fadeIn' },
            h('div', { className: 'inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-6' },
              h('i', { className: 'fas fa-circle-check text-5xl text-green-400' })
            ),
            
            h('div', null,
              h('h3', { className: 'text-3xl font-bold text-white mb-3' }, 
                window.i18n?.t('calculator.estimatedPrice') || 'Preț estimat'
              ),
              result.model && h('p', { className: 'text-zinc-400 mb-6' }, result.model),
              result.min === result.max
                ? h('div', { className: 'text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' },
                    result.avg === 0 ? 'GRATUIT' : `${result.avg} lei`
                  )
                : h('div', { className: 'text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' },
                    h('span', { className: 'text-zinc-400 text-3xl' }, 'de la '),
                    `${result.min}-${result.max} lei`
                  )
            ),
            
            h('div', { className: 'bg-zinc-800/50 rounded-2xl p-8 space-y-4 text-left max-w-lg mx-auto border border-zinc-700/50' },
              h('div', { className: 'flex items-start gap-4' },
                h('div', { className: 'w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0' },
                  h('i', { className: 'fas fa-circle-info text-blue-400' })
                ),
                h('div', null,
                  h('div', { className: 'text-base font-semibold text-zinc-200 mb-1' }, result.diagnostic),
                  h('div', { className: 'text-sm text-zinc-400' }, `Timp estimat: ${result.time}`)
                )
              ),
              h('div', { className: 'flex items-center gap-3 text-sm text-zinc-400 pt-4 border-t border-zinc-700' },
                h('i', { className: 'fas fa-shield-check text-green-400' }),
                'Garanție 30 zile inclusă'
              ),
              h('div', { className: 'flex items-center gap-3 text-sm text-zinc-400' },
                h('i', { className: 'fas fa-stethoscope text-blue-400' }),
                'Diagnostic gratuit'
              )
            ),
            
            h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center mt-10' },
              h('a', {
                href: `https://wa.me/40721234567?text=Bună! Am estimat ${result.min}-${result.max} lei pentru reparație. Doresc să programez.`,
                target: '_blank',
                className: 'px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3'
              },
                h('i', { className: 'fab fa-whatsapp text-2xl' }),
                'Comandă pe WhatsApp'
              ),
              h('button', {
                onClick: reset,
                className: 'px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-all border border-zinc-700'
              },
                h('i', { className: 'fas fa-redo mr-2' }),
                'Calculează din nou'
              )
            )
          )
        )
      ),
      
      // Info footer
      step < 6 && h('div', { className: 'text-center mt-8 text-sm text-zinc-500 flex items-center justify-center gap-2' },
        h('i', { className: 'fas fa-circle-info' }),
        'Prețul final poate varia în funcție de complexitate. Diagnostic gratuit pentru confirmare.'
      )
    );
  };
  
  window.PriceCalculator = PriceCalculator;
  console.log('✅ Modern Price Calculator v2.0 loaded');
})();
