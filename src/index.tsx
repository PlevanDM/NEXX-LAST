import { Hono } from 'hono'
import type { Context } from 'hono'
import { setCookie, getCookie } from 'hono/cookie'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'

type Bindings = {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
  REMONLINE_API_KEY?: string
  REMONLINE_BASE_URL?: string
  REMONLINE_BRANCH_ID?: string
  REMONLINE_ORDER_TYPE?: string
  /** Optional; fallback: REMONLINE_API_KEY. Used to sign cabinet JWT. */
  CABINET_JWT_SECRET?: string
}

// --- Cabinet JWT (HMAC-SHA256) ---
const b64url = (buf: ArrayBuffer | Uint8Array): string => {
  const u = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let binary = ''
  for (let i = 0; i < u.length; i++) binary += String.fromCharCode(u[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function signJWT (payload: Record<string, unknown>, secret: string): Promise<string> {
  const s = String(secret || '')
  if (!s) throw new Error('JWT secret required')
  const header = { alg: 'HS256', typ: 'JWT' }
  const enc = new TextEncoder()
  const part1 = b64url(enc.encode(JSON.stringify(header)))
  const part2 = b64url(enc.encode(JSON.stringify(payload)))
  const message = enc.encode(`${part1}.${part2}`)
  const keyBytes = enc.encode(s)
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes.buffer.slice(keyBytes.byteOffset, keyBytes.byteOffset + keyBytes.byteLength),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, message)
  return `${part1}.${part2}.${b64url(sig)}`
}

async function verifyJWT (token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const s = String(secret || '')
    if (!s) return null
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [part1, part2, sigB64] = parts
    const enc = new TextEncoder()
    const message = enc.encode(`${part1}.${part2}`)
    const keyBytes = enc.encode(s)
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes.buffer.slice(keyBytes.byteOffset, keyBytes.byteOffset + keyBytes.byteLength),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const sigBin = Uint8Array.from(atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
    const ok = await crypto.subtle.verify('HMAC', key, sigBin.buffer.slice(sigBin.byteOffset, sigBin.byteOffset + sigBin.byteLength), message)
    if (!ok) return null
    const payloadJson = atob(part2.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson) as Record<string, unknown>
    if (payload.exp != null && Number(payload.exp) * 1000 < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

function normalizePhone (raw: string): string {
  let clean = (raw || '').replace(/[^0-9+]/g, '')
  if (clean.startsWith('07')) clean = '+40' + clean.substring(1)
  else if (clean.startsWith('40') && !clean.startsWith('+')) clean = '+' + clean
  else if (!clean.startsWith('+') && clean.length >= 9) clean = '+40' + clean
  return clean
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
  origin: (origin: string) => origin || '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-NEXX-PIN'],
  credentials: true,
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

// Auth middleware for protected data
const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  const pin = c.req.header('X-NEXX-PIN') || c.req.query('pin')
  const authCookie = getCookie(c, 'nexx_auth')
  const cookieVal = typeof authCookie === 'string' ? authCookie : ''

  const CORRECT_PIN = '31618585'

  if (pin === CORRECT_PIN || cookieVal === 'true') {
    return await next()
  }

  return c.json({ error: 'Unauthorized', message: 'PIN code required' }, 401)
}

// API Routes
app.post('/api/auth/login', async (c) => {
  const { pin } = await c.req.json()
  const CORRECT_PIN = '31618585'

  if (pin === CORRECT_PIN) {
    setCookie(c, 'nexx_auth', 'true', {
      path: '/',
      secure: true,
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'Lax',
    })
    return c.json({ success: true, token: 'authenticated' })
  }
  return c.json({ success: false, error: 'Invalid PIN' }, 401)
})

// Public chunks (calculator, landing) — no PIN; rest of /data/* requires auth
// Use wildcard so path like /data/chunks/devices.json always matches; then parse filename
const PUBLIC_CHUNKS = ['config', 'devices', 'prices', 'services', 'version', 'brands']
app.on(['GET', 'HEAD'], '/data/chunks/*', async (c) => {
  const path = c.req.path.replace(/^\/data\/chunks\//, '').replace(/\/$/, '')
  const name = path.replace(/\.json$/, '') // "devices.json" -> "devices"
  if (!path.endsWith('.json') || !name) {
    return c.json({ error: 'Not found' }, 404)
  }
  const isPublic = PUBLIC_CHUNKS.includes(name)
  if (!isPublic) {
    const pin = c.req.header('X-NEXX-PIN') || c.req.query('pin')
    const authCookie = getCookie(c, 'nexx_auth')
    if (pin !== '31618585' && authCookie !== 'true') {
      return c.json({ error: 'Unauthorized', message: 'PIN code required' }, 401)
    }
  }
  return serveAsset(dataCache)(c)
})
app.on(['GET', 'HEAD'], '/data/*', authMiddleware, serveAsset(dataCache))

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
    
    let cleanPhone = phone.replace(/[^0-9+]/g, '')
    // Format phone for Romanian numbers
    if (cleanPhone.startsWith('07')) {
      cleanPhone = '+40' + cleanPhone.substring(1)
    } else if (cleanPhone.startsWith('40') && !cleanPhone.startsWith('+')) {
      cleanPhone = '+' + cleanPhone
    } else if (!cleanPhone.startsWith('+') && cleanPhone.length >= 9) {
      cleanPhone = '+40' + cleanPhone
    }
    
    // Remonline integration - from environment variables
    const REMONLINE_API_KEY = (c.env as Bindings)?.REMONLINE_API_KEY || ''
    const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app'
    const BRANCH_ID = parseInt((c.env as Bindings)?.REMONLINE_BRANCH_ID || '218970')
    const ORDER_TYPE = parseInt((c.env as Bindings)?.REMONLINE_ORDER_TYPE || '334611')
    
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
                fetch('/data/chunks/devices.json', { credentials: 'include' })
                    .then(r => { if (!r.ok) throw new Error(r.status === 401 ? 'Auth required' : r.statusText); return r.json(); })
                    .then(data => {
                        const list = Array.isArray(data) ? data : [];
                        console.log('Loaded', list.length, 'devices');
                        setDevices(list.slice(0, 6));
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

// NEXX Database — один источник: nexx.html (без дубля в воркере)
app.get('/nexx', (c) => c.redirect('/nexx.html', 302))
app.get('/nexx/', (c) => c.redirect('/nexx.html', 302))
app.get('/nexx/*', (c) => c.redirect('/nexx.html', 302))


// Booking API - creates order in RemOnline
app.post('/api/booking', async (c) => {
  const REMONLINE_API_KEY = (c.env as Bindings)?.REMONLINE_API_KEY || '';
  const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app';
  const BRANCH_ID = parseInt((c.env as Bindings)?.REMONLINE_BRANCH_ID || '218970');
  const ORDER_TYPE = parseInt((c.env as Bindings)?.REMONLINE_ORDER_TYPE || '334611');
  if (!REMONLINE_API_KEY) {
    return c.json({ success: false, message: 'Service temporar indisponibil' }, 503);
  }
  try {
    const body = await c.req.json();
    const getBrand = (d: string) => {
      if (!d) return '';
      const dl = (d as string).toLowerCase();
      if (dl.includes('iphone') || dl.includes('macbook') || dl.includes('ipad')) return 'Apple';
      if (dl.includes('samsung') || dl.includes('galaxy')) return 'Samsung';
      if (dl.includes('xiaomi') || dl.includes('redmi') || dl.includes('poco')) return 'Xiaomi';
      return '';
    };
    let cleanPhone = (body.phone || '').replace(/[^0-9+]/g, '');
    if (cleanPhone.startsWith('07')) cleanPhone = '+40' + cleanPhone.substring(1);
    else if (cleanPhone.startsWith('40') && !cleanPhone.startsWith('+')) cleanPhone = '+' + cleanPhone;
    else if (!cleanPhone.startsWith('+') && cleanPhone.length >= 9) cleanPhone = '+40' + cleanPhone;
    const tokenRes = await fetch(`${REMONLINE_BASE}/token/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `api_key=${REMONLINE_API_KEY}`
    });
    const tokenJson = await tokenRes.json() as { success?: boolean; token?: string };
    if (!tokenJson.success || !tokenJson.token) {
      return c.json({ success: false, message: 'Eroare autentificare RemOnline' }, 500);
    }
    const token = tokenJson.token;
    const createClientRes = await fetch(`${REMONLINE_BASE}/clients/?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: body.name || 'Client Website', phone: [cleanPhone] })
    });
    const createClientData = await createClientRes.json() as { data?: { id: number }; success?: boolean };
    let clientId = createClientData.data?.id;
    if (!clientId) {
      const searchRes = await fetch(`${REMONLINE_BASE}/clients/?token=${token}&phones[]=${encodeURIComponent(cleanPhone)}`);
      const searchData = await searchRes.json() as { data?: Array<{ id: number }> };
      if (searchData.data?.length) clientId = searchData.data[0].id;
    }
    if (!clientId) {
      return c.json({ success: false, message: 'Nu s-a putut crea clientul' }, 500);
    }
    const brand = getBrand(body.device);
    const model = body.device || '';
    const orderRes = await fetch(`${REMONLINE_BASE}/order/?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch_id: BRANCH_ID,
        order_type: ORDER_TYPE,
        client_id: clientId,
        kindof_good: 'Telefon',
        brand,
        model,
        malfunction: body.problem || 'Cerere website',
        manager_notes: `[WEBSITE BOOKING] ${body.name}\nDevice: ${model}\nProblem: ${body.problem || 'N/A'}\n${new Date().toISOString()}`
      })
    });
    const orderData = await orderRes.json() as { success?: boolean; data?: { id: number }; message?: string };
    if (!orderData.success) {
      return c.json({ success: false, message: orderData.message || 'Eroare creare comandă' }, 500);
    }
    return c.json({
      success: true,
      message: 'Cerere trimisă! Vă vom contacta în curând.',
      order_id: orderData.data?.id,
      orderId: orderData.data?.id
    });
  } catch (error) {
    console.error('Booking/RemOnline error:', error);
    return c.json({ success: false, message: 'Eroare la trimitere. Încercați din nou.' }, 500);
  }
});

// Remonline unified API endpoint
app.post('/api/remonline', async (c) => {
  try {
    const body = await c.req.json();
    const action = new URL(c.req.url).searchParams.get('action');
    const formType = body.formType || action;
    
    // Remonline API configuration
    const REMONLINE_API_KEY = (c.env as Bindings)?.REMONLINE_API_KEY || '';
    const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app';
    const BRANCH_ID = parseInt((c.env as Bindings)?.REMONLINE_BRANCH_ID || '218970');
    const ORDER_TYPE = parseInt((c.env as Bindings)?.REMONLINE_ORDER_TYPE || '334611');
    
    if (!REMONLINE_API_KEY) {
      return c.json({ 
        success: false,
        error: 'Remonline API not configured',
        message: 'Service temporarily unavailable'
      }, 503);
    }
    
    // Get auth token
    const tokenRes = await fetch(`${REMONLINE_BASE}/token/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `api_key=${REMONLINE_API_KEY}`
    });
    const tokenJson = await tokenRes.json() as { success: boolean; token?: string; message?: string };
    
    if (!tokenJson.success || !tokenJson.token) {
      return c.json({ 
        success: false, 
        error: 'Failed to authenticate with Remonline',
        message: tokenJson.message || 'Authentication failed'
      }, 500);
    }
    
    const token = tokenJson.token;
    
    // Get or create client
    let cleanPhone = (body.customerPhone || body.phone || '').replace(/[^0-9+]/g, '');
    // Ensure phone has + prefix for Romanian numbers
    if (cleanPhone.startsWith('07')) {
      cleanPhone = '+40' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('40') && !cleanPhone.startsWith('+')) {
      cleanPhone = '+' + cleanPhone;
    } else if (!cleanPhone.startsWith('+') && cleanPhone.length >= 9) {
      cleanPhone = '+40' + cleanPhone;
    }
    
    const customerName = body.customerName || body.name || 'Website Client';
    
    // Try to create client
    const createClientRes = await fetch(`${REMONLINE_BASE}/clients/?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        name: customerName,
        phone: [cleanPhone]
      })
    });
    const createClientData = await createClientRes.json() as { data?: { id: number }; success?: boolean };
    
    let clientId = createClientData.data?.id;
    
    // If client exists, search for it
    if (!clientId) {
      const searchRes = await fetch(`${REMONLINE_BASE}/clients/?token=${token}&phones[]=${encodeURIComponent(cleanPhone)}`);
      const searchData = await searchRes.json() as { data?: Array<{ id: number }> };
      if (searchData.data?.length) {
        clientId = searchData.data[0].id;
      }
    }
    
    if (!clientId) {
      return c.json({ 
        success: false, 
        error: 'Failed to create client',
        message: 'Could not create or find client'
      }, 500);
    }
    
    // Create order based on form type
    const now = new Date().toISOString();
    let notes = '';
    let deviceType = 'Telefon';
    let brand = '';
    let model = '';
    let malfunction = '';
    
    if (formType === 'callback') {
      // Parse device string for brand/model if provided
      const deviceStr = body.device || '';
      if (deviceStr.toLowerCase().includes('iphone')) {
        brand = 'Apple';
        model = deviceStr;
        deviceType = 'Telefon';
      } else if (deviceStr.toLowerCase().includes('samsung')) {
        brand = 'Samsung';
        model = deviceStr;
        deviceType = 'Telefon';
      } else if (deviceStr.toLowerCase().includes('macbook')) {
        brand = 'Apple';
        model = deviceStr;
        deviceType = 'Laptop';
      } else {
        deviceType = deviceStr || 'Telefon';
      }
      malfunction = body.problem || 'Callback request';
      notes = `[CALLBACK] ${customerName} | ${cleanPhone}\nDevice: ${deviceStr || 'N/A'}\nProblem: ${body.problem || 'N/A'}\nTime: ${body.preferredTime || 'ASAP'}\nDate: ${now}`;
    } else if (formType === 'repair_order' || action === 'create_order') {
      deviceType = body.device?.type || body.deviceType || 'Telefon';
      brand = body.device?.brand || '';
      model = body.device?.model || '';
      malfunction = body.problem || 'Repair request';
      notes = `[REPAIR ORDER] ${customerName}\nDevice: ${deviceType} ${brand} ${model}\nProblem: ${malfunction}\nEstimate: ${body.estimatedCost || 'N/A'}\nDate: ${now}`;
    } else if (action === 'create_inquiry' || action === 'create_lead') {
      // Price calculator lead
      if (!cleanPhone && !customerName) {
        return c.json({ success: true, message: 'Price calculated (no contact)' });
      }
      const typeMap: Record<string, string> = { 'phone': 'Telefon', 'tablet': 'Tablet', 'laptop': 'Laptop', 'watch': 'Smartwatch' };
      deviceType = typeMap[body.device?.type] || body.device?.type || 'Telefon';
      brand = body.device?.brand || '';
      model = body.device?.model || '';
      malfunction = body.issue || 'Calculator inquiry';
      notes = `[CALCULATOR LEAD] ${customerName}\nDevice: ${brand} ${model}\nIssue: ${body.issue || 'N/A'}\nEstimate: ${body.estimated_price || body.estimatedPrice || 'N/A'}\nDate: ${now}`;
    } else if (formType === 'booking' || formType === 'appointment') {
      malfunction = body.comment || 'Programare vizită';
      notes = `[BOOKING] ${customerName}\nPhone: ${body.customerPhone || body.phone || cleanPhone}\nDate: ${body.preferredDate || 'N/A'}\nComment: ${body.comment || 'N/A'}\n${now}`;
    } else {
      malfunction = body.problem || 'Website inquiry';
      notes = `[WEBSITE] ${customerName}\nDevice: ${body.device || 'N/A'}\nProblem: ${body.problem || 'N/A'}\nDate: ${now}`;
    }
    
    // Create order
    const orderRes = await fetch(`${REMONLINE_BASE}/order/?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch_id: BRANCH_ID,
        order_type: ORDER_TYPE,
        client_id: clientId,
        kindof_good: deviceType,
        brand: brand,
        model: model,
        malfunction: malfunction,
        manager_notes: notes
      })
    });
    
    const orderData = await orderRes.json() as { success: boolean; data?: { id: number }; message?: string };
    
    if (!orderData.success) {
      return c.json({ 
        success: false, 
        error: 'Failed to create order',
        message: orderData.message || 'Order creation failed'
      }, 500);
    }
    
    return c.json({
      success: true,
      id: orderData.data?.id,
      formId: orderData.data?.id,
      message: 'Request submitted successfully',
      data: orderData.data
    });
    
  } catch (error) {
    console.error('Remonline API error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Error processing request'
    }, 500);
  }
});

app.get('/api/remonline', async (c) => {
  const url = new URL(c.req.url);
  const action = url.searchParams.get('action');
  const REMONLINE_API_KEY = (c.env as Bindings)?.REMONLINE_API_KEY || '';
  const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app';

  if (action === 'health') {
    return c.json({ success: true, status: 'ok' });
  }
  if (!REMONLINE_API_KEY) {
    return c.json({ error: 'Remonline API not configured' }, 500);
  }

  const needToken = ['get_order', 'get_branches', 'get_statuses', 'get_services'].includes(action || '');
  let token = '';
  if (needToken) {
    const tokenRes = await fetch(`${REMONLINE_BASE}/token/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `api_key=${REMONLINE_API_KEY}`
    });
    const tokenJson = await tokenRes.json() as { success?: boolean; token?: string };
    if (!tokenJson.success || !tokenJson.token) {
      return c.json({ error: 'Failed to authenticate with Remonline' }, 500);
    }
    token = tokenJson.token;
  }

  if (action === 'get_order') {
    const orderId = url.searchParams.get('id');
    if (!orderId) return c.json({ error: 'Missing id' }, 400);
    const res = await fetch(`${REMONLINE_BASE}/order/?token=${token}&ids[]=${encodeURIComponent(orderId)}`);
    const data = await res.json() as { data?: any[]; success?: boolean };
    const order = data.data?.[0] ?? data.data ?? data;
    return c.json({ success: data.success !== false, data: order }, 200, {
      'Cache-Control': 'private, max-age=60'
    });
  }
  if (action === 'get_branches') {
    const res = await fetch(`${REMONLINE_BASE}/branches/?token=${token}`);
    const data = await res.json() as { data?: any };
    return c.json({ success: true, data: data.data ?? data }, 200, {
      'Cache-Control': 'public, max-age=3600'
    });
  }
  if (action === 'get_statuses') {
    const res = await fetch(`${REMONLINE_BASE}/statuses/?token=${token}`);
    const data = await res.json() as { data?: any };
    return c.json({ success: true, data: data.data ?? data }, 200, {
      'Cache-Control': 'public, max-age=3600'
    });
  }
  if (action === 'get_services') {
    const res = await fetch(`${REMONLINE_BASE}/services/?token=${token}`);
    const data = await res.json().catch(() => ({})) as { data?: any; services?: any };
    const list = data.data ?? data.services ?? (Array.isArray(data) ? data : []);
    return c.json({ success: true, data: list }, 200, {
      'Cache-Control': 'public, max-age=3600'
    });
  }

  return c.json({
    error: 'Unknown action',
    supported: ['get_order', 'get_branches', 'get_statuses', 'get_services', 'health']
  }, 400);
});

// --- Cabinet (personal account): login by phone, list orders from Remonline ---
async function getRemonlineToken (c: Context<{ Bindings: Bindings }>): Promise<string | null> {
  const REMONLINE_API_KEY = (c.env as Bindings)?.REMONLINE_API_KEY || ''
  const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app'
  if (!REMONLINE_API_KEY) return null
  const res = await fetch(`${REMONLINE_BASE}/token/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `api_key=${REMONLINE_API_KEY}`
  })
  const json = await res.json() as { success?: boolean; token?: string }
  return (json.success && json.token) ? json.token : null
}

app.post('/api/cabinet/login', async (c) => {
  const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app'
  const secret = (c.env as Bindings)?.CABINET_JWT_SECRET || (c.env as Bindings)?.REMONLINE_API_KEY || ''
  if (!secret) return c.json({ success: false, error: 'Cabinet not configured' }, 503)
  try {
    const body = await c.req.json() as { phone?: string }
    const raw = (body.phone || '').trim()
    if (!raw || raw.length < 8) return c.json({ success: false, error: 'Invalid phone' }, 400)
    const phone = normalizePhone(raw)
    if (!phone || phone.length < 10 || !/^\+[0-9]{10,15}$/.test(phone)) {
      return c.json({ success: false, error: 'Invalid phone' }, 400)
    }
    const token = await getRemonlineToken(c)
    if (!token) return c.json({ success: false, error: 'Service unavailable' }, 503)
    const searchRes = await fetch(`${REMONLINE_BASE}/clients/?token=${token}&phones[]=${encodeURIComponent(phone)}`)
    const searchData = await searchRes.json() as { data?: Array<{ id: number }> }
    const clientId = searchData.data?.[0]?.id
    if (!clientId) {
      return c.json({ success: false, error: 'Client not found', code: 'NOT_FOUND' }, 404)
    }
    const jwtPayload = {
      client_id: clientId,
      phone,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
    }
    let jwt: string
    try {
      jwt = await signJWT(jwtPayload, secret)
    } catch (jwtErr) {
      console.error('Cabinet JWT sign error:', jwtErr)
      return c.json({ success: false, error: 'Server error' }, 500)
    }
    return c.json({ success: true, token: jwt, client_id: clientId })
  } catch (e) {
    console.error('Cabinet login error:', e)
    return c.json({ success: false, error: 'Server error' }, 500)
  }
})

app.get('/api/cabinet/orders', async (c) => {
  const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app'
  const secret = (c.env as Bindings)?.CABINET_JWT_SECRET || (c.env as Bindings)?.REMONLINE_API_KEY || ''
  if (!secret) return c.json({ success: false, error: 'Cabinet not configured' }, 503)
  const auth = c.req.header('Authorization')
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!bearer) return c.json({ success: false, error: 'Unauthorized' }, 401)
  const payload = await verifyJWT(bearer, secret)
  if (!payload || payload.client_id == null) return c.json({ success: false, error: 'Unauthorized' }, 401)
  const clientId = Number(payload.client_id)
  try {
    const token = await getRemonlineToken(c)
    if (!token) return c.json({ success: false, error: 'Service unavailable' }, 503)
    let orders: any[] = []
    let url = `${REMONLINE_BASE}/order/?token=${token}&client_id=${clientId}`
    let res = await fetch(url)
    let data: { data?: any[]; success?: boolean }
    try {
      data = (await res.json()) as { data?: any[]; success?: boolean }
    } catch {
      return c.json({ success: false, error: 'Service unavailable' }, 503)
    }
    orders = Array.isArray(data.data) ? data.data : (data.data && !Array.isArray(data.data) ? [data.data] : [])
    if (orders.length === 0) {
      url = `${REMONLINE_BASE}/order/?token=${token}`
      res = await fetch(url)
      try {
        data = (await res.json()) as { data?: any[] }
      } catch {
        return c.json({ success: true, data: [] }, 200, { 'Cache-Control': 'private, max-age=60' })
      }
      const all = Array.isArray(data.data) ? data.data : []
      orders = all.filter((o: any) => o.client_id === clientId || o.client?.id === clientId)
    }
    return c.json({ success: true, data: orders }, 200, { 'Cache-Control': 'private, max-age=60' })
  } catch (e) {
    console.error('Cabinet orders error:', e)
    return c.json({ success: false, error: 'Server error' }, 500)
  }
})

app.post('/api/cabinet/logout', (c) => {
  return c.json({ success: true })
})

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
        
        <!-- Database (required for calculator models) -->
        <script src="/static/database.min.js"></script>
        
        <!-- Page-specific content -->
        <script ${useJSX ? 'type="text/babel"' : ''} src="/static/${scriptFile}"></script>
    </body>
    </html>
  `;
};

// Calculator page (тот же скрипт, что и на главной)
app.get('/calculator', (c) => {
  return c.html(createPageTemplate(
    'Calculator preț reparații - NEXX',
    'Calculează prețul reparației dispozitivului tău online. iPhone, Android, MacBook, iPad, Apple Watch.',
    'price-calculator.js',
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

// Directions page - "Cum să Ajungi"
app.get('/directions', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ro">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cum să Ajungi la NEXX GSM Sector 4 | Metrou, Autobuz, Taxi</title>
        <meta name="description" content="Ghid complet cum să ajungi la NEXX GSM din Calea Șerban Vodă 47, Sector 4, București. Rute metrou M2, autobuz 116, tramvai 19, taxi. Tarife și timp actualizate 2026.">
        <meta name="keywords" content="nexx gsm sector 4, service telefoane sector 4, cum sa ajungi calea serban voda, reparatii telefoane bucuresti, metrou piata unirii">
        <link rel="canonical" href="https://nexxgsm.com/directions">
        <link rel="icon" type="image/png" href="/static/nexx-logo.png">
        
        <!-- Open Graph -->
        <meta property="og:title" content="Cum să Ajungi la NEXX GSM Sector 4 București">
        <meta property="og:description" content="Ghid complet: Metrou M2, Autobuz 116, Tramvai 19, Taxi. 3 minute de la Piața Unirii.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://nexxgsm.com/directions">
        <meta property="og:locale" content="ro_RO">
        
        <!-- Scripts -->
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css">
        <script crossorigin src="/static/vendor/react.production.min.js"></script>
        <script crossorigin src="/static/vendor/react-dom.production.min.js"></script>
        
        <!-- Structured Data - LocalBusiness -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "NEXX GSM Service Center",
          "description": "Service profesional de reparații telefoane, tablete și electronice în București Sector 4",
          "image": "https://nexxgsm.com/images/reception.png",
          "telephone": "",
          "email": "info@nexxgsm.ro",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Calea Șerban Vodă 47",
            "addressLocality": "București",
            "addressRegion": "Sector 4",
            "postalCode": "040215",
            "addressCountry": "RO"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 44.42146803174267,
            "longitude": 26.102888425255543
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "10:00",
              "closes": "19:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": "Saturday",
              "opens": "11:00",
              "closes": "17:00"
            }
          ],
          "areaServed": {
            "@type": "City",
            "name": "București"
          },
          "priceRange": "$$"
        }
        </script>
        
        <!-- Structured Data - FAQ -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Care este cea mai rapidă cale să ajung la NEXX GSM?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Cea mai rapidă opțiune este metroul M2. Coborâți la Piața Unirii sau Eroii Revoluției și mergeți 3 minute pe jos. Timp total: 15-25 minute din majoritatea zonelor Bucureștiului."
              }
            },
            {
              "@type": "Question",
              "name": "Ce linii de transport trec lângă NEXX GSM?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Metroul M2 (Piața Unirii, Eroii Revoluției), Autobuz 116 (circulă 24/7), Tramvai 19 (stația Adesgo), plus liniile 232, 141, 312 și autobuze de noapte N101-N119."
              }
            },
            {
              "@type": "Question",
              "name": "Este parcare disponibilă lângă NEXX GSM?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Da, există parcare pe stradă pe Calea Șerban Vodă (0.50-1.00 RON/oră) și parcare subterană în U-Center 2 la 200m distanță."
              }
            }
          ]
        }
        </script>
        
        <style>
          html { scroll-behavior: smooth; }
        </style>
    </head>
    <body class="bg-white">
        <div id="header"></div>
        <div id="app"></div>
        <div id="footer"></div>
        
        <!-- i18n + UI Components -->
        <script src="/static/i18n.js?v=11.0.0"></script>
        <script src="/static/ui-components.min.js?v=10.0.3"></script>
        <script>
          // Render Header & Footer if available
          if (window.NEXXDesign) {
            const headerRoot = ReactDOM.createRoot(document.getElementById('header'));
            headerRoot.render(React.createElement(window.NEXXDesign.Header, { currentPage: 'directions' }));
            const footerRoot = ReactDOM.createRoot(document.getElementById('footer'));
            footerRoot.render(React.createElement(window.NEXXDesign.Footer));
          }
        </script>
        
        <!-- Directions Page -->
        <script src="/static/directions.js?v=1.0.0"></script>
    </body>
    </html>
  `);
})

// Alternative Romanian URL
app.get('/cum-sa-ajungi', (c) => c.redirect('/directions'))

// Main page - excluded from worker, served directly as static index.html
// This route is handled by Cloudflare Pages static file serving
// See _routes.json for exclusion configuration

export default app
