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

// Booking API endpoint
app.post('/api/booking', async (c) => {
  try {
    const body = await c.req.json();
    
    // TODO: Integrate with RO App API
    // For now, just return success
    console.log('Booking received:', body);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return c.json({
      success: true,
      message: 'Заявка успішно відправлена! Ми зв\'яжемося з вами найближчим часом.',
      orderId: 'TEST-' + Date.now()
    });
  } catch (error) {
    return c.json({
      success: false,
      message: 'Помилка при обробці заявки. Спробуйте ще раз.'
    }, 500);
  }
});

// Main page - Service Center Landing with React
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NEXX - Професійний ремонт Apple техніки в Києві</title>
        <meta name="description" content="Професійний ремонт Apple техніки в Києві. iPhone, iPad, MacBook, Apple Watch. Швидко, якісно, з гарантією 30 днів. Записатися онлайн.">
        <link rel="icon" type="image/png" href="/static/nexx-logo.png">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css">
        
        <!-- React from CDN -->
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        
        <!-- Custom Tailwind Config -->
        <style>
          html {
            scroll-behavior: smooth;
          }
        </style>
    </head>
    <body class="bg-white">
        <!-- React App Root -->
        <div id="app"></div>
        
        <!-- React Homepage Component -->
        <script src="/static/homepage.js"></script>
    </body>
    </html>
  `)
})

export default app
