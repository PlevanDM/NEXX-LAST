import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/data/*', serveStatic({ root: './public' }))

// API Routes
app.get('/api/settings', (c) => {
  return c.json({
    currency: {
      rates: {
        UAH_TO_USD: 0.024,
        UAH_TO_EUR: 0.022,
        USD_TO_UAH: 41.5,
        EUR_TO_UAH: 45.0
      },
      updated_at: new Date().toISOString()
    },
    service: {
      name: "NEXX Repair",
      phone: "+380 00 000 0000",
      working_hours: "10:00 - 19:00"
    }
  })
})

// Favicon
app.get('/favicon.ico', (c) => c.redirect('/static/favicon.ico'))

// Test click page
app.get('/test-click', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NEXX - Click Test</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css">
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    </head>
    <body class="bg-gray-100 p-4">
        <div id="app"></div>
        <script>
        const { useState, useEffect, createElement: h } = React;
        
        const TestApp = () => {
            const [device, setDevice] = useState(null);
            const [error, setError] = useState(null);
            const [devices, setDevices] = useState([]);
            const [loading, setLoading] = useState(true);
            
            useEffect(() => {
                console.log('Loading devices...');
                fetch('/data/devices.json')
                    .then(r => r.json())
                    .then(data => {
                        console.log('Loaded', data.length, 'devices');
                        setDevices(data.slice(0, 6));
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error('Error loading devices:', err);
                        setError(err.message);
                        setLoading(false);
                    });
            }, []);
            
            const handleClick = (d) => {
                console.log('%c CLICK:', 'background: green; color: white; font-size: 16px;', d.name);
                try {
                    setDevice(d);
                    console.log('%c setDevice OK', 'background: blue; color: white;');
                } catch (err) {
                    console.error('Error:', err);
                    setError(err.message);
                }
            };
            
            if (loading) return h('div', { className: 'p-8 text-center' }, 'Loading...');
            if (error) return h('div', { className: 'p-8 text-center text-red-500' }, 'Error: ' + error);
            
            if (device) {
                console.log('%c Rendering detail:', 'background: purple; color: white;', device.name);
                return h('div', { className: 'max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-lg' },
                    h('button', { onClick: () => setDevice(null), className: 'mb-4 px-4 py-2 bg-gray-200 rounded-lg' }, '← Back'),
                    h('h1', { className: 'text-2xl font-bold mb-4' }, device.name),
                    h('div', { className: 'grid grid-cols-2 gap-4' },
                        h('div', { className: 'p-3 bg-gray-50 rounded' },
                            h('p', { className: 'text-xs text-gray-500' }, 'Category'),
                            h('p', { className: 'font-bold' }, device.category)
                        ),
                        h('div', { className: 'p-3 bg-gray-50 rounded' },
                            h('p', { className: 'text-xs text-gray-500' }, 'Year'),
                            h('p', { className: 'font-bold' }, device.year)
                        ),
                        h('div', { className: 'p-3 bg-gray-50 rounded' },
                            h('p', { className: 'text-xs text-gray-500' }, 'Processor'),
                            h('p', { className: 'font-bold' }, device.processor || 'N/A')
                        ),
                        h('div', { className: 'p-3 bg-gray-50 rounded' },
                            h('p', { className: 'text-xs text-gray-500' }, 'Model'),
                            h('p', { className: 'font-bold text-sm' }, device.model || 'N/A')
                        )
                    ),
                    device.charging_ic && h('div', { className: 'mt-4 p-3 bg-yellow-50 rounded' },
                        h('p', { className: 'text-xs text-yellow-600' }, 'Charging IC'),
                        h('p', { className: 'font-bold text-yellow-800' }, device.charging_ic.main)
                    ),
                    h('div', { className: 'mt-6 p-4 bg-green-100 rounded-lg text-green-800' }, '✅ Rendered OK!')
                );
            }
            
            return h('div', { className: 'max-w-4xl mx-auto' },
                h('h1', { className: 'text-2xl font-bold mb-6' }, '🧪 Click Test'),
                h('div', { className: 'grid grid-cols-2 md:grid-cols-3 gap-4' },
                    ...devices.map(d => 
                        h('div', {
                            key: d.name,
                            onClick: () => handleClick(d),
                            className: 'bg-white rounded-xl p-4 shadow cursor-pointer hover:shadow-lg border-2 border-transparent hover:border-blue-500'
                        },
                            h('p', { className: 'font-bold' }, d.name),
                            h('p', { className: 'text-sm text-gray-500' }, d.category + ' ' + d.year)
                        )
                    )
                )
            );
        };
        
        ReactDOM.createRoot(document.getElementById('app')).render(h(TestApp));
        </script>
    </body>
    </html>
  `)
})

// NEXX Database (protected with pincode)
app.get('/nexx', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NEXX Database - Apple Repair</title>
        <meta name="description" content="NEXX Database - База данных для ремонта устройств Apple: цены, платы, микросхемы">
        <link rel="icon" type="image/png" href="/static/nexx-logo.png">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css">
        
        <!-- React from CDN (dev mode for debugging) -->
        <script crossorigin src="https://unpkg.com/react@18/umd/react-development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    </head>
    <body class="bg-gray-50">
        <div id="app"></div>
        
        <!-- Pincode Protection + NEXX Database App -->
        <script>
        const { useState, createElement: h } = React;
        const CORRECT_PIN = '31618585';
        
        const PincodeScreen = ({ onSuccess }) => {
          const [pin, setPin] = useState('');
          const [error, setError] = useState(false);
          
          const handleSubmit = (e) => {
            e.preventDefault();
            if (pin === CORRECT_PIN) {
              localStorage.setItem('nexx_auth', 'true');
              onSuccess();
            } else {
              setError(true);
              setPin('');
              setTimeout(() => setError(false), 2000);
            }
          };
          
          return h('div', { className: 'min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4' },
            h('div', { className: 'bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md' },
              h('div', { className: 'text-center mb-8' },
                h('div', { className: 'text-6xl mb-4' }, '🔐'),
                h('h1', { className: 'text-2xl font-bold text-slate-800 mb-2' }, 'NEXX Database'),
                h('p', { className: 'text-slate-600' }, 'Введите пинкод для доступа')
              ),
              h('form', { onSubmit: handleSubmit },
                h('input', {
                  type: 'password',
                  value: pin,
                  onChange: (e) => setPin(e.target.value),
                  placeholder: 'Пинкод',
                  maxLength: 8,
                  className: 'w-full px-4 py-3 text-center text-2xl tracking-widest rounded-lg border-2 ' + 
                    (error ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-indigo-500') + 
                    ' focus:outline-none transition-all',
                  autoFocus: true
                }),
                error && h('p', { className: 'text-red-500 text-sm mt-2 text-center' }, '❌ Неверный пинкод'),
                h('button', {
                  type: 'submit',
                  className: 'w-full mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl'
                }, 'Войти')
              ),
              h('div', { className: 'mt-6 text-center text-xs text-slate-500' },
                'Protected access only'
              )
            )
          );
        };
        
        const App = () => {
          const [authenticated, setAuthenticated] = useState(
            localStorage.getItem('nexx_auth') === 'true'
          );
          
          if (!authenticated) {
            return h(PincodeScreen, { onSuccess: () => setAuthenticated(true) });
          }
          
          // Load NEXX Database app
          return h('div', { id: 'nexx-app' },
            h('div', { className: 'fixed top-4 right-4 z-50' },
              h('button', {
                onClick: () => {
                  localStorage.removeItem('nexx_auth');
                  window.location.reload();
                },
                className: 'px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-lg text-sm font-medium transition-all'
              }, '🔒 Выйти')
            )
          );
        };
        
        ReactDOM.createRoot(document.getElementById('app')).render(h(App));
        </script>
        
        <!-- Load NEXX Database after authentication -->
        <script>
        if (localStorage.getItem('nexx_auth') === 'true') {
          const script = document.createElement('script');
          script.src = '/static/app.js';
          document.getElementById('nexx-app').appendChild(script);
        }
        </script>
    </body>
    </html>
  `)
})

// Main page - Service Center Landing
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NEXX - Сервісний центр Apple в Києві</title>
        <meta name="description" content="Професійний ремонт Apple техніки в Києві. iPhone, iPad, MacBook. Швидко, якісно, з гарантією.">
        <link rel="icon" type="image/png" href="/static/nexx-logo.png">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css">
    </head>
    <body class="bg-white">
        <!-- Header -->
        <header class="fixed w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">N</div>
                        <div>
                            <h1 class="text-xl font-bold text-slate-900">NEXX</h1>
                            <p class="text-xs text-slate-600">Service Center</p>
                        </div>
                    </div>
                    <nav class="hidden md:flex items-center gap-6">
                        <a href="#services" class="text-slate-700 hover:text-indigo-600 font-medium transition-colors">Послуги</a>
                        <a href="#prices" class="text-slate-700 hover:text-indigo-600 font-medium transition-colors">Ціни</a>
                        <a href="#about" class="text-slate-700 hover:text-indigo-600 font-medium transition-colors">Про нас</a>
                        <a href="#contact" class="text-slate-700 hover:text-indigo-600 font-medium transition-colors">Контакти</a>
                    </nav>
                    <a href="tel:+380000000000" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl">
                        <i class="fas fa-phone mr-2"></i>Зателефонувати
                    </a>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="pt-32 pb-20 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto text-center">
                    <div class="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
                        🏆 Понад 10 років досвіду
                    </div>
                    <h2 class="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                        Професійний ремонт<br/>
                        <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Apple техніки</span>
                    </h2>
                    <p class="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        iPhone, iPad, MacBook, Apple Watch. Швидко, якісно, з гарантією. 
                        Використовуємо оригінальні комплектуючі та професійне обладнання.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#contact" class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                            Записатися на ремонт
                        </a>
                        <a href="#prices" class="bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg border-2 border-slate-200 hover:border-indigo-300">
                            Дізнатися ціни
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features -->
        <section class="py-20 bg-white">
            <div class="container mx-auto px-4">
                <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-bolt text-indigo-600 text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">Швидкий ремонт</h3>
                        <p class="text-slate-600">Більшість ремонтів виконуємо за 1-2 години. Експрес-заміна за 30 хвилин.</p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-shield-alt text-purple-600 text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">Гарантія якості</h3>
                        <p class="text-slate-600">6 місяців гарантії на всі види робіт. Оригінальні комплектуючі.</p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-tools text-green-600 text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">Професіонали</h3>
                        <p class="text-slate-600">Сертифіковані майстри з 10+ років досвіду. Мікропайка будь-якої складності.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section id="services" class="py-20 bg-slate-50">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-bold text-slate-900 mb-4">Наші послуги</h2>
                    <p class="text-xl text-slate-600 max-w-2xl mx-auto">
                        Ремонтуємо всі види пошкоджень Apple пристроїв
                    </p>
                </div>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200">
                        <div class="text-4xl mb-4">📱</div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">iPhone</h3>
                        <ul class="text-slate-600 space-y-2">
                            <li>• Заміна дисплею та скла</li>
                            <li>• Заміна батареї</li>
                            <li>• Ремонт плати (мікропайка)</li>
                            <li>• Відновлення після залиття</li>
                        </ul>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200">
                        <div class="text-4xl mb-4">💻</div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">MacBook</h3>
                        <ul class="text-slate-600 space-y-2">
                            <li>• Заміна матриці</li>
                            <li>• Ремонт клавіатури</li>
                            <li>• Заміна SSD та оперативної пам'яті</li>
                            <li>• Чистка системи охолодження</li>
                        </ul>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200">
                        <div class="text-4xl mb-4">⌚</div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">Apple Watch</h3>
                        <ul class="text-slate-600 space-y-2">
                            <li>• Заміна дисплею</li>
                            <li>• Заміна батареї</li>
                            <li>• Ремонт після залиття</li>
                            <li>• Заміна корпусу</li>
                        </ul>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200">
                        <div class="text-4xl mb-4">🎧</div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">AirPods</h3>
                        <ul class="text-slate-600 space-y-2">
                            <li>• Заміна батареї</li>
                            <li>• Ремонт зарядного кейсу</li>
                            <li>• Чистка та обслуговування</li>
                            <li>• Відновлення звуку</li>
                        </ul>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200">
                        <div class="text-4xl mb-4">🖥️</div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">iMac</h3>
                        <ul class="text-slate-600 space-y-2">
                            <li>• Апгрейд SSD та RAM</li>
                            <li>• Заміна матриці</li>
                            <li>• Чистка та термопаста</li>
                            <li>• Діагностика несправностей</li>
                        </ul>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200">
                        <div class="text-4xl mb-4">🔧</div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">Інше</h3>
                        <ul class="text-slate-600 space-y-2">
                            <li>• iPad (всі моделі)</li>
                            <li>• Magic Keyboard/Mouse</li>
                            <li>• Apple TV</li>
                            <li>• Аксесуари Apple</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer id="contact" class="bg-slate-900 text-white py-16">
            <div class="container mx-auto px-4">
                <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div>
                        <h3 class="text-xl font-bold mb-4">NEXX Service Center</h3>
                        <p class="text-slate-400">Професійний ремонт Apple техніки в Києві з 2014 року</p>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Контакти</h4>
                        <div class="space-y-2 text-slate-400">
                            <p><i class="fas fa-phone mr-2"></i>+380 00 000 0000</p>
                            <p><i class="fas fa-envelope mr-2"></i>info@nexx.kiev.ua</p>
                            <p><i class="fas fa-map-marker-alt mr-2"></i>Київ, вул. Хрещатик 1</p>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Графік роботи</h4>
                        <div class="space-y-2 text-slate-400">
                            <p>Пн-Пт: 10:00 - 19:00</p>
                            <p>Сб: 11:00 - 17:00</p>
                            <p>Нд: Вихідний</p>
                        </div>
                    </div>
                </div>
                <div class="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
                    <p>&copy; 2026 NEXX Service Center. Всі права захищені.</p>
                </div>
            </div>
        </footer>

        <!-- Smooth scroll -->
        <script>
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
        </script>
    </body>
    </html>
  `)
})

export default app
