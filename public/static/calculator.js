/**
 * Calculator Page - NEXX v9.0
 * Калькулятор вартості ремонту
 */

// h is already defined in shared-components.js
const { useState } = React;

// ============================================
// DATA - Services by Device
// ============================================

const CALCULATOR_SERVICES = {
  iphone: [
    { id: 'screen', name: 'Заміна дисплея', price: 80, time: 30 },
    { id: 'battery', name: 'Заміна батареї', price: 45, time: 20 },
    { id: 'charging', name: 'Ремонт зарядки', price: 35, time: 25 },
    { id: 'speaker', name: 'Заміна динаміка', price: 30, time: 20 },
    { id: 'camera', name: 'Заміна камери', price: 55, time: 30 },
    { id: 'water', name: 'Чистка після залиття', price: 70, time: 60 },
    { id: 'glass', name: 'Заміна заднього скла', price: 60, time: 45 },
    { id: 'diagnostic', name: 'Діагностика', price: 0, time: 15 },
  ],
  android: [
    { id: 'screen', name: 'Заміна дисплея', price: 65, time: 40 },
    { id: 'battery', name: 'Заміна батареї', price: 35, time: 25 },
    { id: 'charging', name: 'Ремонт зарядки', price: 30, time: 30 },
    { id: 'speaker', name: 'Заміна динаміка', price: 25, time: 20 },
    { id: 'camera', name: 'Заміна камери', price: 45, time: 35 },
    { id: 'water', name: 'Чистка після залиття', price: 60, time: 60 },
    { id: 'software', name: 'Програмне забезпечення', price: 25, time: 30 },
    { id: 'diagnostic', name: 'Діагностика', price: 0, time: 15 },
  ],
  macbook: [
    { id: 'screen', name: 'Заміна екрану', price: 250, time: 90 },
    { id: 'battery', name: 'Заміна батареї', price: 120, time: 60 },
    { id: 'keyboard', name: 'Заміна клавіатури', price: 150, time: 90 },
    { id: 'ssd', name: 'Заміна SSD', price: 80, time: 45 },
    { id: 'cleaning', name: 'Чистка від пилу', price: 45, time: 60 },
    { id: 'thermal', name: 'Заміна термопасти', price: 35, time: 45 },
    { id: 'water', name: 'Чистка після залиття', price: 150, time: 120 },
    { id: 'diagnostic', name: 'Діагностика', price: 0, time: 30 },
  ],
  laptop: [
    { id: 'screen', name: 'Заміна екрану', price: 120, time: 60 },
    { id: 'battery', name: 'Заміна батареї', price: 60, time: 30 },
    { id: 'keyboard', name: 'Заміна клавіатури', price: 70, time: 60 },
    { id: 'ram', name: 'Збільшення RAM', price: 40, time: 30 },
    { id: 'ssd', name: 'Заміна SSD', price: 50, time: 30 },
    { id: 'cleaning', name: 'Чистка від пилу', price: 35, time: 45 },
    { id: 'thermal', name: 'Заміна термопасти', price: 25, time: 30 },
    { id: 'diagnostic', name: 'Діагностика', price: 0, time: 20 },
  ],
  ipad: [
    { id: 'screen', name: 'Заміна дисплея', price: 120, time: 60 },
    { id: 'battery', name: 'Заміна батареї', price: 65, time: 45 },
    { id: 'charging', name: 'Ремонт зарядки', price: 45, time: 30 },
    { id: 'button', name: 'Заміна кнопки', price: 40, time: 30 },
    { id: 'camera', name: 'Заміна камери', price: 50, time: 35 },
    { id: 'water', name: 'Чистка після залиття', price: 80, time: 90 },
    { id: 'diagnostic', name: 'Діагностика', price: 0, time: 20 },
  ],
  watch: [
    { id: 'screen', name: 'Заміна дисплея', price: 90, time: 45 },
    { id: 'battery', name: 'Заміна батареї', price: 55, time: 30 },
    { id: 'crown', name: 'Ремонт Digital Crown', price: 40, time: 30 },
    { id: 'sensor', name: 'Заміна датчика', price: 30, time: 20 },
    { id: 'water', name: 'Чистка після залиття', price: 45, time: 30 },
    { id: 'diagnostic', name: 'Діагностика', price: 0, time: 15 },
  ],
};

const DEVICES = [
  { id: 'iphone', name: 'iPhone', emoji: '📱', icon: 'fa-mobile-screen' },
  { id: 'android', name: 'Android', emoji: '🤖', icon: 'fa-mobile' },
  { id: 'macbook', name: 'MacBook', emoji: '💻', icon: 'fa-laptop' },
  { id: 'laptop', name: 'Ноутбук', emoji: '🖥️', icon: 'fa-laptop-code' },
  { id: 'ipad', name: 'iPad', emoji: '📱', icon: 'fa-tablet-screen-button' },
  { id: 'watch', name: 'Apple Watch', emoji: '⌚', icon: 'fa-clock' },
];

// ============================================
// CALCULATOR COMPONENT
// ============================================

const Calculator = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  
  const deviceServices = selectedDevice ? CALCULATOR_SERVICES[selectedDevice] : [];
  
  const handleServiceToggle = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };
  
  const totalPrice = deviceServices
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);
    
  const totalTime = deviceServices
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.time, 0);
  
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} хв`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} год ${mins} хв` : `${hours} год`;
  };
  
  return h('div', { className: 'min-h-screen' },
    h('main', { className: 'py-12' },
      h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        // Page Header
        h('div', { className: 'text-center mb-12' },
          h('h1', { className: 'text-4xl md:text-5xl font-bold text-slate-900 mb-4' }, 'Калькулятор вартості ремонту'),
          h('p', { className: 'text-xl text-slate-600 max-w-3xl mx-auto' }, 'Виберіть пристрій та послуги для розрахунку вартості')
        ),
        
        // Device Selection
        !selectedDevice && h('div', {},
          h('h2', { className: 'text-2xl font-bold text-slate-900 mb-8 text-center' }, 'Виберіть ваш пристрій'),
          h('div', { className: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto' },
            ...DEVICES.map(device =>
              h('button', {
                key: device.id,
                onClick: () => setSelectedDevice(device.id),
                className: 'bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-transparent hover:border-blue-600 cursor-pointer'
              },
                h('div', { className: 'text-5xl mb-3' }, device.emoji),
                h('div', { className: 'font-semibold text-slate-900' }, device.name)
              )
            )
          )
        ),
        
        // Services Selection
        selectedDevice && h('div', {},
          h('div', { className: 'mb-8 flex items-center justify-between' },
            h('div', { className: 'flex items-center gap-4' },
              h('button', {
                onClick: () => { setSelectedDevice(null); setSelectedServices([]); },
                className: 'text-slate-600 hover:text-slate-900 transition-colors'
              },
                h('i', { className: 'fa fa-arrow-left mr-2' }),
                'Змінити пристрій'
              ),
              h('div', { className: 'text-3xl' }, DEVICES.find(d => d.id === selectedDevice).emoji),
              h('h2', { className: 'text-2xl font-bold text-slate-900' }, DEVICES.find(d => d.id === selectedDevice).name)
            )
          ),
          
          h('div', { className: 'grid lg:grid-cols-3 gap-8' },
            // Services List
            h('div', { className: 'lg:col-span-2' },
              h('div', { className: 'bg-white rounded-2xl p-6 shadow-lg' },
                h('h3', { className: 'text-xl font-bold text-slate-900 mb-6' }, 'Виберіть послуги'),
                h('div', { className: 'space-y-3' },
                  ...deviceServices.map(service =>
                    h('label', {
                      key: service.id,
                      className: `flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedServices.includes(service.id) 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`
                    },
                      h('div', { className: 'flex items-center gap-3' },
                        h('input', {
                          type: 'checkbox',
                          checked: selectedServices.includes(service.id),
                          onChange: () => handleServiceToggle(service.id),
                          className: 'w-5 h-5 text-blue-600 rounded'
                        }),
                        h('div', {},
                          h('div', { className: 'font-semibold text-slate-900' }, service.name),
                          h('div', { className: 'text-sm text-slate-600' }, `${formatTime(service.time)}`)
                        )
                      ),
                      h('div', { className: 'text-lg font-bold text-slate-900' },
                        service.price > 0 ? `${service.price} €` : 'Безкоштовно'
                      )
                    )
                  )
                )
              )
            ),
            
            // Summary
            h('div', { className: 'lg:col-span-1' },
              h('div', { className: 'bg-white rounded-2xl p-6 shadow-lg sticky top-24' },
                h('h3', { className: 'text-xl font-bold text-slate-900 mb-6' }, 'Підсумок'),
                
                selectedServices.length === 0 && h('p', { className: 'text-slate-600 text-center py-8' }, 'Виберіть послуги для розрахунку'),
                
                selectedServices.length > 0 && h('div', {},
                  h('div', { className: 'space-y-4 mb-6' },
                    h('div', { className: 'flex justify-between py-3 border-b border-slate-200' },
                      h('span', { className: 'text-slate-600' }, 'Вартість:'),
                      h('span', { className: 'text-2xl font-bold text-slate-900' }, `${totalPrice} €`)
                    ),
                    h('div', { className: 'flex justify-between py-3 border-b border-slate-200' },
                      h('span', { className: 'text-slate-600' }, 'Час:'),
                      h('span', { className: 'text-xl font-semibold text-slate-900' }, formatTime(totalTime))
                    ),
                    h('div', { className: 'flex justify-between py-3' },
                      h('span', { className: 'text-slate-600' }, 'Послуг:'),
                      h('span', { className: 'text-xl font-semibold text-slate-900' }, selectedServices.length)
                    )
                  ),
                  
                  h('button', {
                    onClick: () => window.location.href = '/#contact',
                    className: 'w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all'
                  },
                    h('i', { className: 'fa fa-calendar-check mr-2' }),
                    'Записатися на ремонт'
                  ),
                  
                  h('p', { className: 'text-xs text-slate-500 text-center mt-4' }, '* Вартість може відрізнятися залежно від моделі пристрою')
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
// RENDER
// ============================================

ReactDOM.createRoot(document.getElementById('app')).render(h(Calculator));
