import { Hono } from 'hono'
import type { Context } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'

type Bindings = {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
}

const app = new Hono<{ Bindings: Bindings }>()

// Security Headers - CSP, HSTS, X-Frame-Options, etc.
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'", 
      "'unsafe-inline'", 
      "'unsafe-eval'",
      "https://cdn.tailwindcss.com",
      "https://cdn.jsdelivr.net",
      "https://unpkg.com",
      "https://cdnjs.cloudflare.com",
      "https://static.cloudflareinsights.com"
    ],
    styleSrc: [
      "'self'", 
      "'unsafe-inline'",
      "https://cdn.tailwindcss.com",
      "https://cdn.jsdelivr.net",
      "https://cdnjs.cloudflare.com",
      "https://fonts.googleapis.com"
    ],
    imgSrc: ["'self'", "data:", "https:", "blob:"],
    fontSrc: [
      "'self'", 
      "https://cdn.jsdelivr.net",
      "https://cdnjs.cloudflare.com",
      "https://fonts.gstatic.com",
      "data:"
    ],
    connectSrc: ["'self'", "https://cloudflareinsights.com"],
    frameSrc: ["'none'"],
    objectSrc: ["'self'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    upgradeInsecureRequests: []
  },
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  strictTransportSecurity: 'max-age=31536000; includeSubDomains'
}))

// Enable CORS for API
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}))

const serveAsset = (cacheControl?: string) =>
  async (c: Context<{ Bindings: Bindings }>) => {
    const assetResponse = await c.env.ASSETS.fetch(c.req.raw)

    if (assetResponse.status === 404) {
      return assetResponse
    }

    const headers = new Headers(assetResponse.headers)
    if (cacheControl) {
      headers.set('Cache-Control', cacheControl)
    }

    return new Response(assetResponse.body, {
      headers,
      status: assetResponse.status,
      statusText: assetResponse.statusText
    })
  }

const immutableCache = 'public, max-age=31536000, immutable'
const dataCache = 'public, max-age=86400'

app.on(['GET', 'HEAD'], '/static/*', serveAsset(immutableCache))
app.on(['GET', 'HEAD'], '/images/*', serveAsset(immutableCache))
app.on(['GET', 'HEAD'], '/data/*', serveAsset(dataCache))

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

// Callback API - creates order in Remonline CRM
app.post('/api/callback', async (c) => {
  try {
    const body = await c.req.json()
    const { phone, name, device, problem } = body
    
    // Validate phone
    if (!phone || phone.length < 9) {
      return c.json({ success: false, error: 'Număr de telefon invalid' }, 400)
    }
    
    const cleanPhone = phone.replace(/[^0-9+]/g, '')
    
    // Remonline integration
    const REMONLINE_API_KEY = '55f93eacf65e94ef55e6fed9fd41f8c4'
    const REMONLINE_BASE = 'https://api.remonline.app'
    const BRANCH_ID = 218970
    const ORDER_TYPE = 334611
    
    let orderId = null
    let remonlineSuccess = false
    
    try {
      // Get token
      const tokenRes = await fetch(`${REMONLINE_BASE}/token/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `api_key=${REMONLINE_API_KEY}`
      })
      const tokenJson = await tokenRes.json() as { success: boolean; token?: string }
      
      if (tokenJson.success && tokenJson.token) {
        const token = tokenJson.token
        
        // Create client
        const clientRes = await fetch(`${REMONLINE_BASE}/clients/?token=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name || 'Client Website',
            phone: [cleanPhone]
          })
        })
        const clientJson = await clientRes.json() as { success?: boolean; data?: { id: number } }
        
        let clientId = clientJson.data?.id
        
        // If client exists, search for it
        if (!clientId) {
          const searchRes = await fetch(`${REMONLINE_BASE}/clients/?token=${token}&phones[]=${encodeURIComponent(cleanPhone)}`)
          const searchJson = await searchRes.json() as { data?: Array<{ id: number }> }
          if (searchJson.data && searchJson.data.length > 0) {
            clientId = searchJson.data[0].id
          }
        }
        
        if (clientId) {
          // Create order
          const now = new Date().toISOString()
          const getBrand = (d: string | undefined) => {
            if (!d) return ''
            const dl = d.toLowerCase()
            if (dl.includes('iphone') || dl.includes('macbook') || dl.includes('ipad')) return 'Apple'
            if (dl.includes('samsung') || dl.includes('galaxy')) return 'Samsung'
            if (dl.includes('xiaomi') || dl.includes('redmi') || dl.includes('poco')) return 'Xiaomi'
            if (dl.includes('huawei') || dl.includes('honor')) return 'Huawei'
            return ''
          }
          
          const orderRes = await fetch(`${REMONLINE_BASE}/order/?token=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              branch_id: BRANCH_ID,
              order_type: ORDER_TYPE,
              client_id: clientId,
              kindof_good: device?.toLowerCase().includes('macbook') ? 'Laptop' : 'Telefon',
              brand: getBrand(device),
              model: device || '',
              malfunction: problem || 'Callback de pe website',
              manager_notes: `🌐 CALLBACK WEBSITE\n🎁 BONUS: DIAGNOSTIC GRATUIT!\n📱 ${device || 'N/A'}\n📞 ${cleanPhone}\n❓ ${problem || 'N/A'}\n⏰ ${now}\n\n✅ Comandă online - diagnostic gratuit inclus`
            })
          })
          const orderJson = await orderRes.json() as { success?: boolean; data?: { id: number } }
          
          if (orderJson.success && orderJson.data) {
            orderId = orderJson.data.id
            remonlineSuccess = true
          }
        }
      }
    } catch (e) {
      console.error('Remonline error:', e)
    }
    
    // Always return success to user
    return c.json({
      success: true,
      order_id: orderId,
      message: remonlineSuccess 
        ? 'Mulțumim! Vă vom contacta în câteva minute!' 
        : 'Cererea a fost primită! Vă contactăm în curând.'
    })
    
  } catch (error) {
    console.error('Callback error:', error)
    return c.json({ success: false, error: 'Eroare server' }, 500)
  }
})

// Favicon
app.get('/favicon.ico', (c) => c.redirect('/static/favicon.ico'))

// Test click page
app.get('/test-click', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NEXX - Click Test</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css">
        <!-- React 19 Production -->
        <script crossorigin src="/static/vendor/react.production.min.js"></script>
        <script crossorigin src="/static/vendor/react-dom.production.min.js"></script>
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
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NEXX Database - Apple Repair</title>
        <meta name="description" content="NEXX Database - База данных для ремонта устройств Apple: цены, платы, микросхемы">
        <link rel="icon" type="image/png" href="/static/nexx-logo.png">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css">
        
        <!-- React 19 Production -->
        <script crossorigin src="/static/vendor/react.production.min.js"></script>
        <script crossorigin src="/static/vendor/react-dom.production.min.js"></script>
    </head>
    <body class="bg-gray-50">
        <div id="app"></div>
        
        <!-- Pincode Protection + NEXX Database App -->
        <script>
        (() => {
          const { useState, createElement: h } = React;
          const { createRoot } = ReactDOM;
          const CORRECT_PIN = '31618585';
          const container = document.getElementById('app');
          let root = null;
          let isDatabaseLoading = false;

          const setLoader = (message) => {
            const text = message || 'Загрузка базы данных...';
            container.innerHTML = '<div class="min-h-screen bg-gray-50 flex items-center justify-center"><div class="bg-white rounded-2xl shadow-2xl px-8 py-6 text-center"><div class="w-12 h-12 mx-auto mb-4 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div><p class="text-slate-600 font-semibold">' + text + '</p></div></div>';
          };

          const loadDatabaseApp = () => {
            if (isDatabaseLoading || document.getElementById('nexx-db-script')) {
              return;
            }
            isDatabaseLoading = true;

            if (root) {
              root.unmount();
              root = null;
            }

            setLoader();

            const script = document.createElement('script');
            script.id = 'nexx-db-script';
            script.src = '/static/client-v2.js?v=2.0.1';
            script.async = true;
            script.onload = () => {
              container.innerHTML = '';
            };
            script.onerror = () => {
              isDatabaseLoading = false;
              container.innerHTML = '<div class="min-h-screen bg-red-50 flex items-center justify-center"><div class="bg-white rounded-2xl shadow-xl px-8 py-6 text-center"><p class="text-red-600 font-semibold mb-3">Не удалось загрузить базу данных</p><button id="retry-load" class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg">Повторить</button></div></div>';
              script.remove();
              const retry = document.getElementById('retry-load');
              if (retry) {
                retry.addEventListener('click', () => {
                  loadDatabaseApp();
                }, { once: true });
              }
            };
            document.body.appendChild(script);
          };

          const PincodeScreen = () => {
            const [pin, setPin] = useState('');
            const [error, setError] = useState(false);

            const handleSubmit = (event) => {
              event.preventDefault();
              if (pin === CORRECT_PIN) {
                localStorage.setItem('nexx_auth', 'true');
                loadDatabaseApp();
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
                    onChange: (event) => setPin(event.target.value),
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

          const init = () => {
            if (localStorage.getItem('nexx_auth') === 'true') {
              loadDatabaseApp();
            } else {
              root = createRoot(container);
              root.render(h(PincodeScreen));
            }
          };

          init();
        })();
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

// Helper function to generate page template
const createPageTemplate = (title: string, description: string, scriptFile: string, bodyClass = 'bg-white', useJSX = false) => {
  return `
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <meta name="description" content="${description}">
        <link rel="icon" type="image/png" href="/static/nexx-logo.png">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css">
        <!-- React 19 Production -->
        <script crossorigin src="/static/vendor/react.production.min.js"></script>
        <script crossorigin src="/static/vendor/react-dom.production.min.js"></script>
        ${useJSX ? '<!-- Babel Standalone for JSX transformation -->\n        <script src="/static/vendor/babel.min.js"></script>' : ''}
        <style>
          html { scroll-behavior: smooth; }
        </style>
    </head>
    <body class="${bodyClass}">
        <div id="header"></div>
        <div id="app"></div>
        <div id="footer"></div>
        
        <!-- Shared Components (Header + Footer) -->
        <script src="/static/shared-components.js"></script>
        <script>
          // Render Header
          const headerRoot = ReactDOM.createRoot(document.getElementById('header'));
          headerRoot.render(React.createElement(window.NEXXShared.Header));
          
          // Render Footer
          const footerRoot = ReactDOM.createRoot(document.getElementById('footer'));
          footerRoot.render(React.createElement(window.NEXXShared.Footer));
        </script>
        
        <!-- Page-specific content -->
        <script ${useJSX ? 'type="text/babel"' : ''} src="/static/${scriptFile}"></script>
    </body>
    </html>
  `;
};

// Calculator page
app.get('/calculator', (c) => {
  return c.html(createPageTemplate(
    'Calculator preț reparații - NEXX',
    'Calculează prețul reparației dispozitivului tău online. iPhone, Android, MacBook, iPad, Apple Watch.',
    'calculator.js',
    'bg-slate-50'
  ));
})

// About page
app.get('/about', (c) => {
  return c.html(createPageTemplate(
    'Despre noi - NEXX Service Center',
    'Istoria NEXX - centru de service profesional Apple în București. Echipa noastră, valori și experiență.',
    'about.js',
    'bg-white',
    true
  ));
})

// FAQ page
app.get('/faq', (c) => {
  return c.html(createPageTemplate(
    'Întrebări frecvente (FAQ) - NEXX',
    'Răspunsuri la cele mai frecvente întrebări despre reparații Apple: garanție, termen, plată, livrare.',
    'faq.js',
    'bg-slate-50',
    true
  ));
})

// Privacy page
app.get('/privacy', (c) => {
  return c.html(createPageTemplate(
    'Politica de confidențialitate - NEXX',
    'Politica de confidențialitate NEXX Service Center. Protecția datelor personale conform GDPR.',
    'privacy.js',
    'bg-white',
    true
  ));
})

// Terms page
app.get('/terms', (c) => {
  return c.html(createPageTemplate(
    'Termeni și condiții - NEXX',
    'Termeni și condiții NEXX Service Center. Reguli și condiții pentru reparații Apple.',
    'terms.js',
    'bg-white',
    true
  ));
})

// Main page - serve static index.html (Romanian version with i18n support)
app.get('/', async (c) => {
  // Serve the static index.html file
  const assetResponse = await c.env.ASSETS.fetch(new Request(new URL('/index.html', c.req.url)))
  if (assetResponse.ok) {
    return new Response(assetResponse.body, {
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }
  // Fallback to dynamic generation if static file not found
  return c.html(createPageTemplate(
    'Reparații iPhone, MacBook, Samsung București | Service Rapid 30 min | NEXX ⭐',
    'Service profesional reparații iPhone, MacBook, Samsung în București ⭐ Garanție 30 zile • Diagnostic gratuit • De la 60 lei',
    'homepage.js'
  ));
})

export default app
