/**
 * NEXX Interactive Price Calculator
 * Розумний калькулятор з базою моделей
 */

(function() {
  'use strict';
  
  const h = React.createElement;
  
  // Ціни по категоріях ремонтів
  const REPAIR_PRICES = {
    screen: { 
      phone: { min: 80, max: 300, avg: 150 },
      tablet: { min: 120, max: 400, avg: 250 },
      laptop: { min: 200, max: 800, avg: 450 }
    },
    battery: {
      phone: { min: 60, max: 150, avg: 90 },
      tablet: { min: 80, max: 200, avg: 120 },
      laptop: { min: 150, max: 400, avg: 250 }
    },
    charging: {
      phone: { min: 40, max: 120, avg: 70 },
      tablet: { min: 50, max: 150, avg: 90 },
      laptop: { min: 80, max: 200, avg: 120 }
    },
    camera: {
      phone: { min: 80, max: 250, avg: 140 },
      tablet: { min: 100, max: 200, avg: 150 }
    },
    motherboard: {
      phone: { min: 150, max: 600, avg: 350 },
      tablet: { min: 200, max: 700, avg: 400 },
      laptop: { min: 300, max: 1200, avg: 600 }
    },
    keyboard: {
      laptop: { min: 100, max: 350, avg: 200 }
    },
    diagnostic: {
      all: { min: 0, max: 0, avg: 0 }
    }
  };
  
  const PriceCalculator = () => {
    const [step, setStep] = React.useState(1);
    const [data, setData] = React.useState({
      brand: null,
      deviceType: null,
      model: null,
      issue: null
    });
    const [result, setResult] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [models, setModels] = React.useState([]);
    
    // Load models from devices.json
    React.useEffect(() => {
      fetch('/data/devices.json')
        .then(r => r.json())
        .then(devices => {
          setModels(devices || []);
        })
        .catch(e => console.error('Error loading devices:', e));
    }, []);
    
    const brands = [
      { id: 'apple', name: 'Apple', icon: 'fab fa-apple', color: 'from-gray-500 to-gray-700' },
      { id: 'samsung', name: 'Samsung', icon: 'fas fa-mobile-screen', color: 'from-gray-500 to-gray-700' },
      { id: 'xiaomi', name: 'Xiaomi', icon: 'fas fa-circle-notch', color: 'from-gray-500 to-gray-700' },
      { id: 'huawei', name: 'Huawei', icon: 'fas fa-square-full', color: 'from-gray-500 to-gray-700' },
      { id: 'other', name: 'Alte mărci', icon: 'fas fa-sitemap', color: 'from-gray-500 to-gray-700' }
    ];
    
    const deviceTypes = [
      { id: 'phone', name: 'Telefon', icon: 'fa-mobile', color: 'from-gray-500 to-gray-700' },
      { id: 'tablet', name: 'Tabletă', icon: 'fa-tablet', color: 'from-gray-500 to-gray-700' },
      { id: 'laptop', name: 'Laptop', icon: 'fa-laptop', color: 'from-gray-500 to-gray-700' },
      { id: 'watch', name: 'Smartwatch', icon: 'fa-watch', color: 'from-gray-500 to-gray-700' }
    ];
    
    const issues = {
      phone: [
        { id: 'screen', name: 'Ecran spart/defect', price: 'screen' },
        { id: 'battery', name: 'Baterie (se descarcă rapid)', price: 'battery' },
        { id: 'charging', name: 'Nu se încarcă', price: 'charging' },
        { id: 'camera', name: 'Cameră nu funcționează', price: 'camera' },
        { id: 'motherboard', name: 'Problemă la placă', price: 'motherboard' }
      ],
      tablet: [
        { id: 'screen', name: 'Display spart', price: 'screen' },
        { id: 'battery', name: 'Baterie', price: 'battery' },
        { id: 'charging', name: 'Port charging', price: 'charging' },
        { id: 'motherboard', name: 'Placă logică', price: 'motherboard' }
      ],
      laptop: [
        { id: 'screen', name: 'Ecran/Display', price: 'screen' },
        { id: 'battery', name: 'Baterie', price: 'battery' },
        { id: 'keyboard', name: 'Tastatură', price: 'keyboard' },
        { id: 'charging', name: 'Încărcare', price: 'charging' },
        { id: 'motherboard', name: 'Placă de bază', price: 'motherboard' }
      ],
      watch: [
        { id: 'screen', name: 'Ecran', price: 'screen' },
        { id: 'battery', name: 'Baterie', price: 'battery' }
      ]
    };
    
    const calculatePrice = () => {
      setLoading(true);
      
      setTimeout(() => {
        const deviceType = data.deviceType;
        const issue = data.issue;
        const model = data.model;
        
        let priceData = null;
        
        // Если выбрана модель - берем цены из неё
        if (model && model.official_service_prices) {
          const prices = model.official_service_prices;
          const issueKey = issue.id; // 'battery', 'display', etc.
          
          if (prices[issueKey]) {
            // Цена есть для конкретной проблемы
            const price = prices[issueKey];
            priceData = {
              min: Math.round(price * 0.8), // -20%
              max: Math.round(price * 1.2), // +20%
              avg: price
            };
          } else {
            // Нет цены для этой проблемы - используем типовые
            priceData = REPAIR_PRICES[issue.price]?.[deviceType] || REPAIR_PRICES[issue.price]?.all;
          }
        } else {
          // Модель не выбрана или нет цен - используем типовые по категории
          priceData = REPAIR_PRICES[issue.price]?.[deviceType] || REPAIR_PRICES[issue.price]?.all;
        }
        
        if (priceData) {
          // Определяем время ремонта
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
          
          // ВАЖНО: Отправляем лид в Remonline
          sendLeadToRemonline({
            brand: data.brand?.name,
            deviceType: deviceType,
            model: model?.name || 'Not specified',
            issue: issue.name,
            estimatedPrice: `${priceData.min}-${priceData.max} lei`,
            source: 'price_calculator'
          });
        }
        
        setLoading(false);
      }, 800);
    };
    
    // Отправка лида в Remonline
    const sendLeadToRemonline = async (leadData) => {
      try {
        const response = await fetch('/api/remonline?action=create_lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'price_calculator',
            device: {
              brand: leadData.brand,
              type: leadData.deviceType,
              model: leadData.model
            },
            issue: leadData.issue,
            estimated_price: leadData.estimatedPrice,
            timestamp: new Date().toISOString()
          })
        });
        
        if (response.ok) {
          console.log('✅ Лид отправлен в Remonline');
        }
      } catch (error) {
        console.error('Ошибка отправки лида:', error);
        // Не показываем ошибку пользователю - это фоновая операция
      }
    };
    
    const getFilteredModels = React.useCallback(() => {
      if (!data.brand) return [];
      const n_brand = data.brand.id.toLowerCase();
      return models.filter(m => {
        if (!m.name) return false;
        const n = m.name.toLowerCase();
        switch (n_brand) {
          case 'apple':
            return n.includes('iphone') || n.includes('ipad') || n.includes('macbook') || n.includes('imac') || n.includes('mac');
          case 'samsung':
            return n.includes('samsung') || n.includes('galaxy');
          case 'xiaomi':
            return n.includes('xiaomi') || n.includes('redmi') || n.includes('poco');
          case 'huawei':
            return n.includes('huawei') || n.includes('honor');
          default:
            return true;
        }
      });
    }, [data.brand, models]);
    
    return h('div', { id: 'calculator', className: 'max-w-4xl mx-auto' },
      h('div', { className: 'bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 md:p-12' },
        // Header
        h('div', { className: 'text-center mb-10' },
          h('div', { className: 'inline-flex items-center gap-2 px-4 py-2 bg-gray-800/40 border border-gray-700/50 rounded-full mb-4' },
            h('i', { className: 'fas fa-calculator text-gray-500' }),
            h('span', { className: 'text-sm font-medium text-gray-400' }, window.i18n?.t('calculator.calculator') || 'Calculator preț')
          ),
          h('h2', { className: 'text-3xl md:text-4xl font-bold text-white mb-3' }, 
            window.i18n?.t('calculator.title') || 'Estimare gratuită online'
          ),
          h('p', { className: 'text-gray-400' }, 
            window.i18n?.t('calculator.description') || 'Răspundeți la câteva întrebări pentru a afla prețul aproximativ'
          )
        ),
        
        // Steps indicator
        !result && h('div', { className: 'flex items-center justify-center gap-2 mb-8' },
          [1, 2, 3, 4].map(s => h('div', {
            key: s,
            className: `w-3 h-3 rounded-full transition-all ${step >= s ? 'bg-gray-500 w-8' : 'bg-gray-700'}`
          }))
        ),
        
        // Step 1: Brand
        step === 1 && !result && h('div', { className: 'space-y-4' },
          h('h3', { className: 'text-xl font-semibold text-white mb-6' }, window.i18n?.t('calculator.selectBrand') || 'Alegeți marca:'),
          h('div', { className: 'grid grid-cols-2 md:grid-cols-3 gap-4' },
            ...brands.map(brand => h('button', {
              key: brand.id,
              onClick: () => {
                setData({ ...data, brand });
                setStep(2);
              },
              className: 'group p-6 bg-gray-800/30 hover:bg-gray-800/60 border-2 border-gray-700 hover:border-gray-500 rounded-xl transition-all hover:scale-105 relative overflow-hidden'
            },
              h('div', { 
                className: `absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`
              }),
              h('div', { 
                className: `w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${brand.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`
              },
                h('i', { className: `fas ${brand.icon} text-2xl text-white` })
              ),
              h('div', { className: 'font-semibold text-white' }, brand.name)
            ))
          )
        ),
        
        // Step 2: Device Type
        step === 2 && !result && h('div', { className: 'space-y-4' },
          h('h3', { className: 'text-xl font-semibold text-white mb-6' }, 
            `${data.brand?.name} - ${window.i18n?.t('calculator.selectDevice') || 'Alegeți tipul:'}`
          ),
          h('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
            ...deviceTypes.map(type => h('button', {
              key: type.id,
              onClick: () => {
                setData({ ...data, deviceType: type.id });
                // Skip to Step 4 if no models, otherwise go to Step 3
                setTimeout(() => {
                  const filteredModels = models.filter(m => {
                    if (!data.brand || !m.name) return false;
                    const n = m.name.toLowerCase();
                    const bid = data.brand.id.toLowerCase();
                    switch (bid) {
                      case 'apple': return n.includes('iphone') || n.includes('ipad') || n.includes('macbook');
                      case 'samsung': return n.includes('samsung') || n.includes('galaxy');
                      case 'xiaomi': return n.includes('xiaomi') || n.includes('redmi') || n.includes('poco');
                      case 'huawei': return n.includes('huawei') || n.includes('honor');
                      default: return true;
                    }
                  });
                  setStep(filteredModels.length > 0 ? 3 : 4);
                }, 0);
              },
              className: 'group p-6 bg-gray-800/30 hover:bg-gray-800/60 border-2 border-gray-700 hover:border-gray-500 rounded-xl transition-all hover:scale-105 relative overflow-hidden'
            },
              h('div', { 
                className: `absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`
              }),
              h('div', { 
                className: `w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center group-hover:scale-110 transition-all duration-300`
              },
                h('i', { className: `fas ${type.icon} text-2xl text-white` })
              ),
              h('div', { className: 'font-semibold text-white text-sm' }, type.name)
            ))
          ),
          h('button', {
            onClick: () => setStep(1),
            className: 'mt-6 text-gray-400 hover:text-white transition flex items-center gap-2'
          },
            h('i', { className: 'fas fa-arrow-left' }),
            window.i18n?.t('calculator.back') || 'Înapoi'
          )
        ),
        
        // Step 3: Model Selection
        step === 3 && !result && h('div', { className: 'space-y-4' },
          h('h3', { className: 'text-xl font-semibold text-white mb-6' }, 
            window.i18n?.t('calculator.selectModel') || 'Alegeți modelul:'
          ),
          h('div', { className: 'mb-4 p-3 bg-gray-800/30 border border-gray-700 rounded-lg' },
            h('input', {
              type: 'text',
              placeholder: 'Căutați model...',
              className: 'w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-gray-500 outline-none',
              id: 'modelSearch'
            })
          ),
          h('div', { className: 'space-y-2 max-h-96 overflow-y-auto' },
            getFilteredModels()
              .slice(0, 25)
              .map(model => h('button', {
                key: model.name,
                onClick: () => {
                  setData({ ...data, model });
                  setStep(4);
                },
                className: 'w-full p-3 bg-gray-800/30 hover:bg-gray-800/60 border-2 border-gray-700 hover:border-gray-500 rounded-lg transition-all text-left flex items-center justify-between group'
              },
                h('div', null,
                  h('div', { className: 'text-white font-medium truncate' }, model.name),
                  h('div', { className: 'text-gray-500 text-sm' }, `${model.year || 'N/A'} • ${model.category || 'N/A'}`)
                ),
                h('i', { className: 'fas fa-chevron-right text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all flex-shrink-0' })
              ))
          ),
          getFilteredModels().length === 0 && h('div', { className: 'text-center py-8 text-gray-400' },
            h('p', null, 'Niciun model găsit. Alegeți o altă marcă.')
          ),
          h('button', {
            onClick: () => setStep(2),
            className: 'mt-6 text-gray-400 hover:text-white transition flex items-center gap-2'
          },
            h('i', { className: 'fas fa-arrow-left' }),
            window.i18n?.t('calculator.back') || 'Înapoi'
          )
        ),
        
        // Step 4: Issue
        step === 4 && !result && h('div', { className: 'space-y-4' },
          h('h3', { className: 'text-xl font-semibold text-white mb-6' }, 
            `${data.model?.name} - ${window.i18n?.t('calculator.selectIssue') || 'Ce problemă aveți?'}`
          ),
          h('div', { className: 'space-y-3' },
            ...(issues[data.deviceType] || []).map(issue => h('button', {
              key: issue.id,
              onClick: () => {
                setData({ ...data, issue });
                calculatePrice();
              },
              className: 'group w-full p-4 bg-gray-800/30 hover:bg-gray-800/60 border-2 border-gray-700 hover:border-gray-500 rounded-xl transition-all text-left flex items-center justify-between'
            },
              h('span', { className: 'text-white font-medium' }, issue.name),
              h('i', { className: 'fas fa-chevron-right text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all' })
            ))
          ),
          h('button', {
            onClick: () => setStep(3),
            className: 'mt-6 text-gray-400 hover:text-white transition flex items-center gap-2'
          },
            h('i', { className: 'fas fa-arrow-left' }),
            window.i18n?.t('calculator.back') || 'Înapoi'
          )
        ),
        
        // Loading
        loading && h('div', { className: 'text-center py-12' },
          h('div', { className: 'w-16 h-16 mx-auto mb-4 border-4 border-gray-700 border-t-gray-400 rounded-full animate-spin' }),
          h('p', { className: 'text-gray-400' }, 'Calculăm prețul...')
        ),
        
        // Result
        result && h('div', { className: 'text-center space-y-6' },
          h('div', { className: 'inline-block p-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl mb-4' },
            h('i', { className: 'fas fa-circle-check text-5xl text-gray-500' })
          ),
          
          h('div', null,
            h('h3', { className: 'text-2xl font-bold text-white mb-2' }, window.i18n?.t('calculator.estimatedPrice') || 'Preț estimat'),
            result.model && h('p', { className: 'text-sm text-gray-400 mb-4' }, result.model),
            result.min === result.max
              ? h('div', { className: 'text-5xl font-bold text-white' },
                  result.avg === 0 ? 'GRATUIT' : `${result.avg} lei`
                )
              : h('div', { className: 'text-4xl font-bold text-white' },
                  h('span', { className: 'text-gray-400' }, 'de la '),
                  h('span', { className: 'text-white' }, 
                    `${result.min}-${result.max} lei`
                  )
                )
          ),
          
          h('div', { className: 'bg-gray-800/30 rounded-xl p-6 space-y-3 text-left max-w-md mx-auto border border-gray-700/50' },
            h('div', { className: 'flex items-start gap-3' },
              h('i', { className: 'fas fa-circle-info text-gray-500 mt-1' }),
              h('div', null,
                h('div', { className: 'text-sm font-medium text-gray-300' }, result.diagnostic),
                h('div', { className: 'text-xs text-gray-500 mt-1' }, `Timp estimat: ${result.time}`)
              )
            ),
            h('div', { className: 'flex items-center gap-2 text-sm text-gray-400' },
              h('i', { className: 'fas fa-shield-check text-gray-500' }),
              'Garanție 30 zile inclusă'
            ),
            h('div', { className: 'flex items-center gap-2 text-sm text-gray-400' },
              h('i', { className: 'fas fa-stethoscope text-gray-500' }),
              'Diagnostic gratuit'
            )
          ),
          
          h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center mt-8' },
            h('a', {
              href: `https://wa.me/40721234567?text=Bună! Am estimat ${result.min}-${result.max} lei pentru reparație. Doresc să programez.`,
              className: 'px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2'
            },
              h('i', { className: 'fab fa-whatsapp text-xl' }),
              'Comandă pe WhatsApp'
            ),
            h('button', {
              onClick: reset,
              className: 'px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all'
            },
              'Calculează din nou'
            )
          )
        )
      ),
      
      // Info footer
      !result && h('div', { className: 'text-center mt-8 text-sm text-gray-500' },
        h('i', { className: 'fas fa-circle-info mr-2' }),
        'Prețul final poate varia în funcție de complexitate. Diagnostic gratuit pentru confirmare.'
      )
    );
  };
  
  window.PriceCalculator = PriceCalculator;
  console.log('✅ Price Calculator loaded');
})();
