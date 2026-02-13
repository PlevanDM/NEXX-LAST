import { Hono } from 'hono'
import type { Context } from 'hono'
import { setCookie, getCookie } from 'hono/cookie'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { EnrichmentEngine } from '../lib/enrichment-engine'

type Bindings = {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
  DB: D1Database
  CACHE: KVNamespace
  REMONLINE_API_KEY?: string
  REMONLINE_BASE_URL?: string
  REMONLINE_BRANCH_ID?: string
  REMONLINE_ORDER_TYPE?: string
  /** Optional; fallback: REMONLINE_API_KEY. Used to sign cabinet JWT. */
  CABINET_JWT_SECRET?: string
  /** PIN for protected data access. Set in Cloudflare Pages env vars. */
  NEXX_PIN?: string
}

// D1 JSON field parsing helper
const D1_JSON_FIELDS = [
  'board_numbers', 'charging_ic', 'power_ics', 'audio_ics',
  'available_repairs', 'repairs', 'service_prices', 'service_prices_ron',
  'official_service_prices', 'service_parts', 'price_ron', 'price_eur'
]

function parseD1JsonFields(row: Record<string, unknown>): Record<string, unknown> {
  if (!row) return row
  const parsed = { ...row }
  for (const field of D1_JSON_FIELDS) {
    const val = parsed[field]
    if (val && typeof val === 'string') {
      try { parsed[field] = JSON.parse(val) } catch {}
    }
  }
  return parsed
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

/** Detect brand from device string */
function detectBrand (device?: string): string {
  if (!device) return ''
  const dl = device.toLowerCase()
  if (dl.includes('iphone') || dl.includes('macbook') || dl.includes('ipad') || dl.includes('apple watch')) return 'Apple'
  if (dl.includes('samsung') || dl.includes('galaxy')) return 'Samsung'
  if (dl.includes('xiaomi') || dl.includes('redmi') || dl.includes('poco')) return 'Xiaomi'
  if (dl.includes('huawei') || dl.includes('honor')) return 'Huawei'
  if (dl.includes('oneplus')) return 'OnePlus'
  if (dl.includes('google') || dl.includes('pixel')) return 'Google'
  if (dl.includes('oppo')) return 'OPPO'
  if (dl.includes('realme')) return 'Realme'
  if (dl.includes('motorola') || dl.includes('moto')) return 'Motorola'
  if (dl.includes('sony') || dl.includes('xperia')) return 'Sony'
  if (dl.includes('nokia')) return 'Nokia'
  if (dl.includes('lenovo')) return 'Lenovo'
  return ''
}

/** Detect device type from device string */
function detectDeviceType (device?: string): string {
  if (!device) return 'Telefon'
  const dl = device.toLowerCase()
  if (dl.includes('macbook') || dl.includes('laptop')) return 'Laptop'
  if (dl.includes('ipad') || dl.includes('tablet')) return 'Tablet'
  if (dl.includes('watch')) return 'Smartwatch'
  if (dl.includes('airpods') || dl.includes('headphone') || dl.includes('earbud')) return 'Audio'
  return 'Telefon'
}

// --- RemOnline token cache (tokens valid for 10 minutes) ---
let _remonlineTokenCache: { token: string; expiresAt: number } | null = null

async function getRemonlineTokenCached (apiKey: string, baseUrl: string): Promise<{ token: string | null; error?: string; code?: number }> {
  // Return cached token if still valid (with 60s safety margin)
  if (_remonlineTokenCache && _remonlineTokenCache.expiresAt > Date.now() + 60_000) {
    return { token: _remonlineTokenCache.token }
  }
  _remonlineTokenCache = null

  if (!apiKey) return { token: null, error: 'REMONLINE_API_KEY not configured', code: 503 }

  try {
    const res = await fetch(`${baseUrl}/token/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `api_key=${apiKey}`
    })
    const json = await res.json() as { success?: boolean; token?: string; message?: string; code?: number }

    if (!json.success || !json.token) {
      const msg = json.message || 'Authentication failed'
      const isExpired = msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('subscription') || json.code === 403
      console.error(`[RemOnline] Token error: ${msg} (code: ${json.code || res.status})`)
      return {
        token: null,
        error: isExpired
          ? 'Abonamentul RemOnline a expirat. Contactați administratorul.'
          : `Eroare autentificare RemOnline: ${msg}`,
        code: isExpired ? 403 : 500
      }
    }

    // Cache token for 9 minutes (tokens valid for 10 min)
    _remonlineTokenCache = { token: json.token, expiresAt: Date.now() + 9 * 60 * 1000 }
    return { token: json.token }
  } catch (e) {
    console.error('[RemOnline] Network error getting token:', e)
    return { token: null, error: 'Nu se poate conecta la RemOnline. Încercați mai târziu.', code: 503 }
  }
}

/** Create or find client in RemOnline, returns client_id or null */
async function getOrCreateClient (token: string, baseUrl: string, name: string, phone: string): Promise<{ clientId: number | null; error?: string }> {
  // Try to create client
  const createRes = await fetch(`${baseUrl}/clients/?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ name, phone: [phone] })
  })
  const createData = await createRes.json() as { data?: { id: number }; success?: boolean }
  if (createData.data?.id) return { clientId: createData.data.id }

  // Client may already exist — search by phone
  const searchRes = await fetch(`${baseUrl}/clients/?token=${token}&phones[]=${encodeURIComponent(phone)}`)
  const searchData = await searchRes.json() as { data?: Array<{ id: number }> }
  if (searchData.data?.length) return { clientId: searchData.data[0].id }

  return { clientId: null, error: 'Nu s-a putut crea/găsi clientul' }
}

const app = new Hono<{ Bindings: Bindings }>()

// Global error handler — never leak stack traces
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ success: false, error: 'Internal server error' }, 500)
})

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
    frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"],
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
const ALLOWED_ORIGINS = ['https://nexxgsm.com', 'https://www.nexxgsm.com', 'https://nexx-gsm.pages.dev']
app.use('/api/*', cors({
  origin: (origin: string) => {
    // Allow same-origin (no Origin header) and known origins
    if (!origin) return 'https://nexxgsm.com'
    if (ALLOWED_ORIGINS.includes(origin)) return origin
    // Allow *.nexx-gsm.pages.dev preview deployments
    if (origin.endsWith('.nexx-gsm.pages.dev')) return origin
    // Deny unknown origins
    return ''
  },
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-NEXX-PIN'],
  credentials: true,
  maxAge: 86400
}))

const serveAsset = (cacheControl?: string) =>
  async (c: Context<{ Bindings: Bindings }>) => {
    // In dev mode (Vite), ASSETS binding doesn't exist — return 404 so Vite can serve the file
    if (!c.env?.ASSETS?.fetch) {
      return c.notFound()
    }
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
const authMiddleware = async (c: Context<{ Bindings: Bindings }>, next: () => Promise<void>) => {
  const pin = (c.req.header('X-NEXX-PIN') || c.req.query('pin') || '').trim()
  const authCookie = getCookie(c, 'nexx_auth')
  const cookieVal = typeof authCookie === 'string' ? authCookie : ''
  const CORRECT_PIN = (c.env as Bindings)?.NEXX_PIN || ''

  if (!CORRECT_PIN.trim()) {
    console.error('[Auth] NEXX_PIN env variable not set!')
    return c.json({ error: 'Service not configured' }, 503)
  }

  if (pin === CORRECT_PIN.trim() || cookieVal === 'true') {
    return await next()
  }

  return c.json({ error: 'Unauthorized', message: 'PIN code required' }, 401)
}

// API Routes
app.post('/api/auth/login', async (c) => {
  const body = await c.req.json().catch(() => ({})) as { pin?: string }
  const pin = (body.pin || '').trim()
  const CORRECT_PIN = ((c.env as Bindings)?.NEXX_PIN || '').trim()

  if (!CORRECT_PIN) {
    return c.json({ success: false, error: 'Service not configured' }, 503)
  }

  if (!pin || pin.length < 4) {
    return c.json({ success: false, error: 'PIN required' }, 400)
  }

  if (pin === CORRECT_PIN) {
    setCookie(c, 'nexx_auth', 'true', {
      path: '/',
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'Lax',
    })
    return c.json({ success: true, token: 'authenticated' })
  }
  // Slow down brute-force: 1s delay on wrong PIN
  await new Promise(r => setTimeout(r, 1000))
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
    const pin = (c.req.header('X-NEXX-PIN') || c.req.query('pin') || '').trim()
    const authCookie = getCookie(c, 'nexx_auth')
    const CORRECT_PIN = ((c.env as Bindings)?.NEXX_PIN || '').trim()
    if (!CORRECT_PIN || (pin !== CORRECT_PIN && authCookie !== 'true')) {
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
      name: "NEXX GSM SERVICE POINT SRL",
      phone: "+380 00 000 0000",
      working_hours: "10:00 - 19:00"
    }
  })
})

// Callback API - creates order in Remonline CRM
app.post('/api/callback', async (c) => {
  try {
    const body = await c.req.json()
    const { phone, name, device, problem, source } = body
    
    // Validate phone
    if (!phone || phone.replace(/\D/g, '').length < 9) {
      return c.json({ success: false, error: 'Număr de telefon invalid' }, 400)
    }
    
    const cleanPhone = normalizePhone(phone)
    const REMONLINE_API_KEY = (c.env as Bindings)?.REMONLINE_API_KEY || ''
    const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app'
    const BRANCH_ID = parseInt((c.env as Bindings)?.REMONLINE_BRANCH_ID || '218970')
    const ORDER_TYPE = parseInt((c.env as Bindings)?.REMONLINE_ORDER_TYPE || '334611')
    
      // Get token
    const { token, error: tokenError, code: tokenCode } = await getRemonlineTokenCached(REMONLINE_API_KEY, REMONLINE_BASE)
    if (!token) {
      console.error('[Callback] Token error:', tokenError)
      return c.json({
        success: false,
        error: tokenError || 'Serviciul temporar indisponibil',
        code: tokenCode === 403 ? 'SUBSCRIPTION_EXPIRED' : 'SERVICE_UNAVAILABLE'
      }, (tokenCode || 503) as 200 | 400 | 401 | 403 | 404 | 500 | 503)
    }
    
    // Get or create client
    const { clientId, error: clientError } = await getOrCreateClient(token, REMONLINE_BASE, name || 'Client Website', cleanPhone)
        if (!clientId) {
      return c.json({ success: false, error: clientError || 'Eroare creare client' }, 500 as const)
    }
    
          // Create order
          const now = new Date().toISOString()
    const brand = detectBrand(device)
    const deviceType = detectDeviceType(device)
    const sourceLabel = source ? ` (${source})` : ''
          
          const orderRes = await fetch(`${REMONLINE_BASE}/order/?token=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              branch_id: BRANCH_ID,
              order_type: ORDER_TYPE,
              client_id: clientId,
        kindof_good: deviceType,
        brand,
              model: device || '',
              malfunction: problem || 'Callback de pe website',
        manager_notes: `🌐 CALLBACK WEBSITE${sourceLabel}\n🎁 BONUS: DIAGNOSTIC GRATUIT!\n📱 ${device || 'N/A'}\n📞 ${cleanPhone}\n❓ ${problem || 'N/A'}\n⏰ ${now}\n\n✅ Comandă online - diagnostic gratuit inclus`
      })
    })
    const orderData = await orderRes.json() as { success?: boolean; data?: { id: number }; message?: string }
    
    if (!orderData.success || !orderData.data) {
      console.error('[Callback] Order creation failed:', orderData)
      return c.json({ success: false, error: orderData.message || 'Eroare creare comandă' }, 500)
    }
    
    return c.json({
      success: true,
      order_id: orderData.data.id,
      orderId: orderData.data.id,
      message: 'Mulțumim! Vă vom contacta în câteva minute!'
    })
    
  } catch (error) {
    console.error('[Callback] Error:', error)
    return c.json({ success: false, error: 'Eroare server. Încercați din nou sau sunați-ne.' }, 500)
  }
})

// Favicon
app.get('/favicon.ico', (c) => c.redirect('/static/favicon.ico'))

// Test click page
app.get('/test-click', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ro">
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

// NEXX Database — served as static nexx.html by Cloudflare Pages Pretty URLs
// /nexx and /nexx/ are excluded in _routes.json (served as static)
// /nexx/* subpaths (power-tracker, ics, errors, etc.) go through worker for SPA routing
app.get('/nexx/:path{.+}', async (c) => {
  try {
    const origin = new URL(c.req.url).origin
    const assetResponse = await c.env.ASSETS.fetch(`${origin}/nexx.html`)
    const path = (c.req.param('path') || '').toLowerCase()
    // Для power-tracker отдаём HTML с манифестом PWA с первого байта — тогда Chrome покажет нативный "Установить?" при клике
    if (path === 'power-tracker') {
      let html = await assetResponse.text()
      html = html.replace(/<link rel="manifest" href="[^"]*">/, '<link rel="manifest" href="/ecoflow-manifest.json">')
      html = html.replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#f59e0b">')
      return new Response(html, {
        status: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-cache',
        }
      })
    }
    return new Response(assetResponse.body, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-cache',
      }
    })
  } catch {
    return c.redirect('/nexx')
  }
})


// Booking API - creates order in RemOnline
app.post('/api/booking', async (c) => {
  try {
    const body = await c.req.json()
    const phone = body.customerPhone || body.phone || ''
    const name = body.customerName || body.name || 'Client Website'

    if (!phone || phone.replace(/\D/g, '').length < 9) {
      return c.json({ success: false, error: 'Număr de telefon invalid' }, 400)
    }

    const cleanPhone = normalizePhone(phone)
    const REMONLINE_API_KEY = (c.env as Bindings)?.REMONLINE_API_KEY || ''
    const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app'
    const BRANCH_ID = parseInt((c.env as Bindings)?.REMONLINE_BRANCH_ID || '218970')
    const ORDER_TYPE = parseInt((c.env as Bindings)?.REMONLINE_ORDER_TYPE || '334611')

    const { token, error: tokenError, code: tokenCode } = await getRemonlineTokenCached(REMONLINE_API_KEY, REMONLINE_BASE)
    if (!token) {
      return c.json({ success: false, error: tokenError, code: tokenCode === 403 ? 'SUBSCRIPTION_EXPIRED' : 'SERVICE_UNAVAILABLE' }, tokenCode || 503)
    }

    const { clientId, error: clientError } = await getOrCreateClient(token, REMONLINE_BASE, name, cleanPhone)
    if (!clientId) {
      return c.json({ success: false, error: clientError }, 500)
    }

    const device = body.device || ''
    const brand = detectBrand(device)
    const deviceType = detectDeviceType(device)
    const now = new Date().toISOString()
    const preferredDate = body.preferredDate || ''
    const comment = body.comment || body.problem || ''

    const orderRes = await fetch(`${REMONLINE_BASE}/order/?token=${token}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch_id: BRANCH_ID,
        order_type: ORDER_TYPE,
        client_id: clientId,
        kindof_good: deviceType,
        brand,
        model: device,
        malfunction: comment || 'Programare vizită',
        manager_notes: `📅 BOOKING WEBSITE\n👤 ${name}\n📱 ${device || 'N/A'}\n📞 ${cleanPhone}\n🗓️ Data preferată: ${preferredDate || 'Cât mai curând'}\n💬 ${comment || 'N/A'}\n⏰ ${now}`
      })
    })
    const orderData = await orderRes.json() as { success?: boolean; data?: { id: number }; message?: string }

    if (!orderData.success || !orderData.data) {
      return c.json({ success: false, error: orderData.message || 'Eroare creare comandă' }, 500)
    }
    
    return c.json({
      success: true,
      message: 'Programare confirmată! Vă așteptăm.',
      order_id: orderData.data.id,
      orderId: orderData.data.id
    })
  } catch (error) {
    console.error('[Booking] Error:', error)
    return c.json({ success: false, error: 'Eroare la trimitere. Încercați din nou.' }, 500)
  }
})

// Remonline unified API endpoint
app.post('/api/remonline', async (c) => {
  try {
    const body = await c.req.json()
    const action = new URL(c.req.url).searchParams.get('action')
    const formType = body.formType || action

    const REMONLINE_API_KEY = (c.env as Bindings)?.REMONLINE_API_KEY || ''
    const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app'
    const BRANCH_ID = parseInt((c.env as Bindings)?.REMONLINE_BRANCH_ID || '218970')
    const ORDER_TYPE = parseInt((c.env as Bindings)?.REMONLINE_ORDER_TYPE || '334611')

    // Get token (cached)
    const { token, error: tokenError, code: tokenCode } = await getRemonlineTokenCached(REMONLINE_API_KEY, REMONLINE_BASE)
    if (!token) {
      return c.json({ 
        success: false,
        error: tokenError,
        code: tokenCode === 403 ? 'SUBSCRIPTION_EXPIRED' : 'SERVICE_UNAVAILABLE'
      }, tokenCode || 503)
    }

    // Get phone and name (support multiple field names for compatibility)
    const rawPhone = body.customerPhone || body.phone || ''
    const cleanPhone = normalizePhone(rawPhone)
    const customerName = body.customerName || body.name || 'Website Client'

    // For calculator leads without contact info — just acknowledge
    if ((action === 'create_inquiry' || action === 'create_lead') && !cleanPhone && customerName === 'Website Client') {
      return c.json({ success: true, message: 'Price calculated (no contact)' })
    }

    // Validate phone for all order types
    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 9) {
      return c.json({ success: false, error: 'Număr de telefon invalid' }, 400)
    }
    
    // Get or create client
    const { clientId, error: clientError } = await getOrCreateClient(token, REMONLINE_BASE, customerName, cleanPhone)
    if (!clientId) {
      return c.json({ success: false, error: clientError }, 500)
    }

    // Build order data based on form type
    const now = new Date().toISOString()
    let notes = ''
    let deviceType = 'Telefon'
    let brand = ''
    let model = ''
    let malfunction = ''

    if (formType === 'callback') {
      const deviceStr = body.device || ''
      brand = detectBrand(deviceStr)
      model = deviceStr
      deviceType = detectDeviceType(deviceStr)
      malfunction = body.problem || 'Callback request'
      notes = `🌐 CALLBACK\n👤 ${customerName} | ${cleanPhone}\n📱 ${deviceStr || 'N/A'}\n❓ ${body.problem || 'N/A'}\n⏰ ${body.preferredTime || 'ASAP'}\n📅 ${now}\n\n✅ Diagnostic gratuit inclus`

    } else if (formType === 'repair_order' || action === 'create_order') {
      deviceType = body.device?.type || body.deviceType || 'Telefon'
      brand = body.device?.brand || detectBrand(body.device)
      model = body.device?.model || (typeof body.device === 'string' ? body.device : '')
      malfunction = body.problem || body.problemDetails || 'Repair request'
      notes = `🔧 REPAIR ORDER\n👤 ${customerName}\n📱 ${deviceType} ${brand} ${model}\n❓ ${malfunction}\n💰 Estimare: ${body.estimatedCost || 'N/A'}\n📅 ${now}`

    } else if (action === 'create_inquiry' || action === 'create_lead') {
      const typeMap: Record<string, string> = { phone: 'Telefon', tablet: 'Tablet', laptop: 'Laptop', watch: 'Smartwatch' }
      deviceType = typeMap[body.device?.type] || body.device?.type || 'Telefon'
      brand = body.device?.brand || ''
      model = body.device?.model || ''
      malfunction = body.issue || 'Calculator inquiry'
      const estimate = body.estimated_price || body.estimatedPrice || 'N/A'
      notes = `🧮 CALCULATOR LEAD\n👤 ${customerName}\n📱 ${brand} ${model}\n❓ ${body.issue || 'N/A'}\n💰 Estimare: ${estimate}\n🔗 Source: ${body.source || 'website'}\n📅 ${now}`

    } else if (formType === 'booking' || formType === 'appointment') {
      const device = body.device || ''
      brand = detectBrand(device)
      model = device
      deviceType = detectDeviceType(device)
      malfunction = body.comment || body.problem || 'Programare vizită'
      notes = `📅 BOOKING\n👤 ${customerName}\n📞 ${cleanPhone}\n📱 ${device || 'N/A'}\n🗓️ ${body.preferredDate || 'Cât mai curând'}\n💬 ${body.comment || 'N/A'}\n📅 ${now}`

    } else if (formType === 'diagnostic') {
      deviceType = detectDeviceType(body.device)
      brand = detectBrand(body.device)
      model = body.device || ''
      malfunction = body.diagnosticResults || body.findings || 'Diagnostic request'
      notes = `🔍 DIAGNOSTIC\n📱 ${body.device || 'N/A'}\nStatus: ${body.status || 'N/A'}\nFindings: ${body.findings || 'N/A'}\n📅 ${now}`

      } else {
      const device = typeof body.device === 'string' ? body.device : ''
      brand = detectBrand(device)
      model = device
      deviceType = detectDeviceType(device)
      malfunction = body.problem || 'Website inquiry'
      notes = `🌐 WEBSITE INQUIRY\n👤 ${customerName}\n📱 ${device || 'N/A'}\n❓ ${body.problem || 'N/A'}\n📅 ${now}`
    }

    // Create order in RemOnline
    const orderRes = await fetch(`${REMONLINE_BASE}/order/?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch_id: BRANCH_ID,
        order_type: ORDER_TYPE,
        client_id: clientId,
        kindof_good: deviceType,
        brand,
        model,
        malfunction,
        manager_notes: notes
      })
    })

    const orderData = await orderRes.json() as { success: boolean; data?: { id: number }; message?: string }

    if (!orderData.success || !orderData.data) {
      console.error('[RemOnline] Order creation failed:', orderData)
      return c.json({ success: false, error: orderData.message || 'Eroare creare comandă' }, 500)
    }
    
    return c.json({
      success: true,
      id: orderData.data.id,
      orderId: orderData.data.id,
      formId: orderData.data.id,
      message: 'Cerere trimisă cu succes!',
      data: orderData.data
    })
    
  } catch (error) {
    console.error('[RemOnline POST] Error:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Eroare la trimitere. Încercați din nou.'
    }, 500)
  }
})

app.get('/api/remonline', async (c) => {
  const url = new URL(c.req.url)
  const action = url.searchParams.get('action')
  const REMONLINE_API_KEY = (c.env as Bindings)?.REMONLINE_API_KEY || ''
  const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app'

  // Health check — also validates the API key / subscription status
  if (action === 'health' || action === 'ping') {
    if (!REMONLINE_API_KEY) {
      return c.json({ success: false, status: 'error', error: 'REMONLINE_API_KEY not configured' }, 503)
    }
    const { token, error, code } = await getRemonlineTokenCached(REMONLINE_API_KEY, REMONLINE_BASE)
    if (!token) {
      return c.json({
        success: false,
        status: 'error',
        error,
        code: code === 403 ? 'SUBSCRIPTION_EXPIRED' : 'AUTH_FAILED'
      }, code || 500)
    }
    return c.json({
      success: true,
      status: 'ok',
      branchId: (c.env as Bindings)?.REMONLINE_BRANCH_ID || '218970',
      message: 'RemOnline API is connected and authenticated'
    })
  }

  if (!REMONLINE_API_KEY) {
    return c.json({ success: false, error: 'Remonline API not configured' }, 503)
  }

  // All other actions need a token
  const { token, error: tokenError, code: tokenCode } = await getRemonlineTokenCached(REMONLINE_API_KEY, REMONLINE_BASE)
  if (!token) {
    return c.json({ success: false, error: tokenError, code: tokenCode === 403 ? 'SUBSCRIPTION_EXPIRED' : 'AUTH_FAILED' }, tokenCode || 500)
  }

  if (action === 'get_order') {
    const orderId = url.searchParams.get('id')
    if (!orderId) return c.json({ error: 'Missing id parameter' }, 400)
    const res = await fetch(`${REMONLINE_BASE}/order/?token=${token}&ids[]=${encodeURIComponent(orderId)}`)
    const data = await res.json() as { data?: any[]; success?: boolean }
    const order = data.data?.[0] ?? data.data ?? data
    return c.json({ success: data.success !== false, data: order }, 200, { 'Cache-Control': 'private, max-age=60' })
  }

  if (action === 'get_branches') {
    const res = await fetch(`${REMONLINE_BASE}/branches/?token=${token}`)
    const data = await res.json() as { data?: any }
    return c.json({ success: true, data: data.data ?? data }, 200, { 'Cache-Control': 'public, max-age=3600' })
  }

  if (action === 'get_statuses') {
    const res = await fetch(`${REMONLINE_BASE}/statuses/?token=${token}`)
    const data = await res.json() as { data?: any }
    return c.json({ success: true, data: data.data ?? data }, 200, { 'Cache-Control': 'public, max-age=3600' })
  }

  if (action === 'get_services') {
    const res = await fetch(`${REMONLINE_BASE}/services/?token=${token}`)
    const data = await res.json().catch(() => ({})) as { data?: any; services?: any }
    const list = data.data ?? data.services ?? (Array.isArray(data) ? data : [])
    return c.json({ success: true, data: list }, 200, { 'Cache-Control': 'public, max-age=3600' })
  }

  return c.json({
    success: false,
    error: 'Unknown action',
    supported: ['health', 'ping', 'get_order', 'get_branches', 'get_statuses', 'get_services']
  }, 400)
})

// --- Cabinet (personal account): login by phone, list orders from Remonline ---

app.post('/api/cabinet/login', async (c) => {
  const REMONLINE_API_KEY = (c.env as Bindings)?.REMONLINE_API_KEY || ''
  const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app'
  const secret = (c.env as Bindings)?.CABINET_JWT_SECRET || REMONLINE_API_KEY
  if (!secret) return c.json({ success: false, error: 'Cabinet not configured' }, 503)
  try {
    const body = await c.req.json() as { phone?: string }
    const raw = (body.phone || '').trim()
    if (!raw || raw.length < 8) return c.json({ success: false, error: 'Invalid phone' }, 400)
    const phone = normalizePhone(raw)
    if (!phone || phone.length < 10 || !/^\+[0-9]{10,15}$/.test(phone)) {
      return c.json({ success: false, error: 'Invalid phone format' }, 400)
    }

    const { token, error: tokenError, code: tokenCode } = await getRemonlineTokenCached(REMONLINE_API_KEY, REMONLINE_BASE)
    if (!token) return c.json({ success: false, error: tokenError, code: tokenCode === 403 ? 'SUBSCRIPTION_EXPIRED' : 'SERVICE_UNAVAILABLE' }, tokenCode || 503)

    const searchRes = await fetch(`${REMONLINE_BASE}/clients/?token=${token}&phones[]=${encodeURIComponent(phone)}`)
    const searchData = await searchRes.json() as { data?: Array<{ id: number; name?: string }> }
    const client = searchData.data?.[0]
    if (!client?.id) {
      return c.json({ success: false, error: 'Client not found. Contactați-ne pentru a crea un cont.', code: 'NOT_FOUND' }, 404)
    }

    const jwtPayload = {
      client_id: client.id,
      phone,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
    }
    const jwt = await signJWT(jwtPayload, secret)
    return c.json({ success: true, token: jwt, client_id: client.id, name: client.name })
  } catch (e) {
    console.error('[Cabinet] Login error:', e)
    return c.json({ success: false, error: 'Server error' }, 500)
  }
})

app.get('/api/cabinet/orders', async (c) => {
  const REMONLINE_API_KEY = (c.env as Bindings)?.REMONLINE_API_KEY || ''
  const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app'
  const secret = (c.env as Bindings)?.CABINET_JWT_SECRET || REMONLINE_API_KEY
  if (!secret) return c.json({ success: false, error: 'Cabinet not configured' }, 503)

  const auth = c.req.header('Authorization')
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!bearer) return c.json({ success: false, error: 'Unauthorized' }, 401)

  const payload = await verifyJWT(bearer, secret)
  if (!payload || payload.client_id == null) return c.json({ success: false, error: 'Token invalid or expired' }, 401)

  const clientId = Number(payload.client_id)
  try {
    const { token, error: tokenError } = await getRemonlineTokenCached(REMONLINE_API_KEY, REMONLINE_BASE)
    if (!token) return c.json({ success: false, error: tokenError }, 503)

    // Fetch orders for this client
    const orderUrl = `${REMONLINE_BASE}/order/?token=${token}&client_id=${clientId}`
    const res = await fetch(orderUrl)
    let data: { data?: any[]; success?: boolean }
    try {
      data = (await res.json()) as { data?: any[]; success?: boolean }
    } catch {
      return c.json({ success: false, error: 'RemOnline response error' }, 503)
    }

    let orders = Array.isArray(data.data) ? data.data : (data.data && !Array.isArray(data.data) ? [data.data] : [])

    // Fallback: if no orders found by client_id param, fetch all and filter
    if (orders.length === 0) {
      try {
        const allRes = await fetch(`${REMONLINE_BASE}/order/?token=${token}`)
        const allData = (await allRes.json()) as { data?: any[] }
        const all = Array.isArray(allData.data) ? allData.data : []
        orders = all.filter((o: any) => o.client_id === clientId || o.client?.id === clientId)
      } catch {
        // Ignore fallback errors
      }
    }

    return c.json({ success: true, data: orders }, 200, { 'Cache-Control': 'private, max-age=60' })
  } catch (e) {
    console.error('[Cabinet] Orders error:', e)
    return c.json({ success: false, error: 'Server error' }, 500)
  }
})

app.post('/api/cabinet/logout', (c) => {
  return c.json({ success: true })
})

// Document generation from RemOnline order data
app.post('/api/remonline/documents/generate', async (c) => {
  try {
    const body = await c.req.json() as {
      orderId?: string | number
      documentType?: string
      format?: string
      documentId?: string
      customerName?: string
      customerEmail?: string
      customerAddress?: string
    }

    if (!body.orderId) {
      return c.json({ success: false, error: 'orderId is required' }, 400)
    }

    const REMONLINE_API_KEY = (c.env as Bindings)?.REMONLINE_API_KEY || ''
    const REMONLINE_BASE = (c.env as Bindings)?.REMONLINE_BASE_URL || 'https://api.remonline.app'

    const { token, error: tokenError, code: tokenCode } = await getRemonlineTokenCached(REMONLINE_API_KEY, REMONLINE_BASE)
    if (!token) {
      return c.json({ success: false, error: tokenError }, tokenCode || 503)
    }

    // Fetch order data from RemOnline
    const orderRes = await fetch(`${REMONLINE_BASE}/order/?token=${token}&ids[]=${encodeURIComponent(String(body.orderId))}`)
    const orderJson = await orderRes.json() as { data?: any[]; success?: boolean }
    const order = orderJson.data?.[0]

    if (!order) {
      return c.json({ success: false, error: 'Order not found' }, 404)
    }

    // Return order data for client-side document generation
    // (actual PDF generation happens in the browser using nexx-pdf-generator.ts)
    return c.json({
      success: true,
      order: {
        id: order.id,
        created_at: order.created_at,
        status: order.status?.name || order.status,
        client_name: order.client?.name || body.customerName || '',
        client_phone: order.client?.phone?.[0] || '',
        client_email: order.client?.email || body.customerEmail || '',
        client_address: body.customerAddress || '',
        device_type: order.kindof_good || '',
        brand: order.brand || '',
        model: order.model || '',
        malfunction: order.malfunction || '',
        manager_notes: order.manager_notes || '',
        estimated_cost: order.estimated_cost || 0,
        total: order.total || 0,
        services: order.operations || [],
        parts: order.parts || [],
      },
      documentType: body.documentType || 'receipt',
      format: body.format || 'pdf'
    })
  } catch (error) {
    console.error('[Documents] Generate error:', error)
    return c.json({ success: false, error: 'Eroare generare document' }, 500)
  }
})

// Helper function to generate page template
const createPageTemplate = (title: string, description: string, scriptFile: string, bodyClass = 'bg-white', useJSX = false, canonicalPath = '', mountComponent = '') => {
  const canonical = canonicalPath ? `\n        <link rel="canonical" href="https://nexxgsm.com${canonicalPath}">` : ''
  const ogMeta = canonicalPath ? `
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:url" content="https://nexxgsm.com${canonicalPath}">
        <meta property="og:type" content="website">
        <meta property="og:image" content="https://nexxgsm.com/static/nexx-logo.png">` : ''
  return `
    <!DOCTYPE html>
    <html lang="ro">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <meta name="description" content="${description}">${canonical}${ogMeta}
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
        ${mountComponent ? `<script>
          // Auto-mount component into #app
          if (window.${mountComponent}) {
            const appRoot = ReactDOM.createRoot(document.getElementById('app'));
            appRoot.render(React.createElement(window.${mountComponent}));
          } else {
            console.error('Component ${mountComponent} not found on window');
          }
        </script>` : ''}
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
    'bg-slate-50',
    false,
    '/calculator',
    'PriceCalculator'
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
          "name": "NEXX GSM SERVICE POINT SRL",
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

// ============================================
// D1-POWERED DATA CHUNKS — drop-in replacement for /data/chunks/*.json
// These serve the same format as static files but from D1
// Frontend can use /api/d1/chunks/* instead of /data/chunks/*
// ============================================

// Devices chunk (same format as /data/chunks/devices.json)
app.get('/api/d1/chunks/devices.json', async (c) => {
  const db = (c.env as Bindings).DB
  const kv = (c.env as Bindings).CACHE
  if (!db) return serveAsset(dataCache)(c) // fallback to static

  const cacheKey = 'd1:chunks:devices'
  if (kv) {
    const cached = await kv.get(cacheKey)
    if (cached) return new Response(cached, {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', 'X-Source': 'd1-kv' }
    })
  }

  try {
    const result = await db.prepare('SELECT * FROM devices ORDER BY year DESC, name ASC').all()
    const devices = result.results.map(d => {
      const p = parseD1JsonFields(d as Record<string, unknown>)
      delete p.id; delete p.created_at; delete p.updated_at
      return p
    })
    const json = JSON.stringify(devices)
    if (kv) c.executionCtx.waitUntil(kv.put(cacheKey, json, { expirationTtl: 300 }))
    return new Response(json, {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', 'X-Source': 'd1' }
    })
  } catch { return serveAsset(dataCache)(c) }
})

// Services chunk
app.get('/api/d1/chunks/services.json', async (c) => {
  const db = (c.env as Bindings).DB
  if (!db) return serveAsset(dataCache)(c)
  try {
    const result = await db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all()
    const servicesObj: Record<string, unknown> = {}
    for (const svc of result.results as any[]) {
      const { id: svcId, sort_order, ...rest } = svc
      servicesObj[svcId] = rest
    }
    return c.json(servicesObj, 200, { 'Cache-Control': 'public, max-age=3600', 'X-Source': 'd1' })
  } catch { return serveAsset(dataCache)(c) }
})

// Config chunk
app.get('/api/d1/chunks/config.json', async (c) => {
  const db = (c.env as Bindings).DB
  if (!db) return serveAsset(dataCache)(c)
  try {
    const row = await db.prepare("SELECT value FROM site_config WHERE key = 'config'").first<{ value: string }>()
    if (row?.value) return new Response(row.value, {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600', 'X-Source': 'd1' }
    })
    return serveAsset(dataCache)(c)
  } catch { return serveAsset(dataCache)(c) }
})

// Prices chunk
app.get('/api/d1/chunks/prices.json', async (c) => {
  const db = (c.env as Bindings).DB
  if (!db) return serveAsset(dataCache)(c)
  try {
    const row = await db.prepare("SELECT value FROM site_config WHERE key = 'prices'").first<{ value: string }>()
    if (row?.value) return new Response(row.value, {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600', 'X-Source': 'd1' }
    })
    return serveAsset(dataCache)(c)
  } catch { return serveAsset(dataCache)(c) }
})

// Brands chunk
app.get('/api/d1/chunks/brands.json', async (c) => {
  const db = (c.env as Bindings).DB
  if (!db) return serveAsset(dataCache)(c)
  try {
    const row = await db.prepare("SELECT value FROM site_config WHERE key = 'brands'").first<{ value: string }>()
    if (row?.value) return new Response(row.value, {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600', 'X-Source': 'd1' }
    })
    return serveAsset(dataCache)(c)
  } catch { return serveAsset(dataCache)(c) }
})

// Knowledge chunk (combines error codes, IC compat, key combos, etc.)
app.get('/api/d1/chunks/knowledge.json', async (c) => {
  const db = (c.env as Bindings).DB
  const kv = (c.env as Bindings).CACHE
  if (!db) return serveAsset(dataCache)(c)

  const cacheKey = 'd1:chunks:knowledge'
  if (kv) {
    const cached = await kv.get(cacheKey)
    if (cached) return new Response(cached, {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600', 'X-Source': 'd1-kv' }
    })
  }

  try {
    const [errors, keyCombos, configRows] = await Promise.all([
      db.prepare('SELECT * FROM error_codes ORDER BY code ASC').all(),
      db.prepare('SELECT * FROM key_combinations').all(),
      db.prepare("SELECT key, value FROM site_config WHERE key LIKE 'knowledge.%'").all(),
    ])

    // Reconstruct knowledge object
    const knowledge: Record<string, unknown> = {
      errorCodes: {
        itunes_restore_errors: errors.results
      },
      keyCombinations: {}
    }

    // Group key combinations by device_type
    for (const combo of keyCombos.results as any[]) {
      const dt = combo.device_type || 'unknown'
      if (!knowledge.keyCombinations) knowledge.keyCombinations = {}
      const kc = knowledge.keyCombinations as Record<string, Record<string, unknown>>
      if (!kc[dt]) kc[dt] = {}
      kc[dt][combo.action] = combo.steps
    }

    // Add remaining knowledge sections from site_config
    for (const row of configRows.results as any[]) {
      const key = row.key.replace('knowledge.', '')
      try { knowledge[key] = JSON.parse(row.value) } catch { knowledge[key] = row.value }
    }

    const json = JSON.stringify(knowledge)
    if (kv) c.executionCtx.waitUntil(kv.put(cacheKey, json, { expirationTtl: 3600 }))
    return new Response(json, {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600', 'X-Source': 'd1' }
    })
  } catch { return serveAsset(dataCache)(c) }
})

// Version chunk
app.get('/api/d1/chunks/version.json', async (c) => {
  const db = (c.env as Bindings).DB
  if (!db) return serveAsset(dataCache)(c)
  try {
    const [version, lastUpdated] = await Promise.all([
      db.prepare("SELECT value FROM site_config WHERE key = 'version'").first<{ value: string }>(),
      db.prepare("SELECT value FROM site_config WHERE key = 'lastUpdated'").first<{ value: string }>(),
    ])
    return c.json({
      version: version?.value || '3.2.2',
      lastUpdated: lastUpdated?.value || new Date().toISOString().split('T')[0],
      source: 'd1'
    }, 200, { 'Cache-Control': 'public, max-age=600', 'X-Source': 'd1' })
  } catch { return serveAsset(dataCache)(c) }
})

// Logic boards chunk
app.get('/api/d1/chunks/logic_boards.json', async (c) => {
  const db = (c.env as Bindings).DB
  if (!db) return serveAsset(dataCache)(c)
  try {
    const result = await db.prepare('SELECT * FROM logic_boards').all()
    return c.json(result.results, 200, { 'Cache-Control': 'public, max-age=3600', 'X-Source': 'd1' })
  } catch { return serveAsset(dataCache)(c) }
})

// Measurements chunk
app.get('/api/d1/chunks/measurements.json', async (c) => {
  const db = (c.env as Bindings).DB
  if (!db) return serveAsset(dataCache)(c)
  try {
    const result = await db.prepare('SELECT * FROM measurements').all()
    // Group by device_name to match original format
    const grouped: Record<string, unknown[]> = {}
    for (const row of result.results as any[]) {
      if (!grouped[row.device_name]) grouped[row.device_name] = []
      grouped[row.device_name].push({ line: row.line_name, value: row.value, pin: row.pin })
    }
    return c.json(grouped, 200, { 'Cache-Control': 'public, max-age=3600', 'X-Source': 'd1' })
  } catch { return serveAsset(dataCache)(c) }
})

// Pinouts chunk
app.get('/api/d1/chunks/pinouts.json', async (c) => {
  const db = (c.env as Bindings).DB
  if (!db) return serveAsset(dataCache)(c)
  try {
    const result = await db.prepare('SELECT * FROM pinouts').all()
    // Group by connector_name
    const connectors: Record<string, { name: string; pins: unknown[] }> = {}
    for (const row of result.results as any[]) {
      if (!connectors[row.connector_name]) connectors[row.connector_name] = { name: row.connector_name, pins: [] }
      connectors[row.connector_name].pins.push({ pin: row.pin_number, signal: row.signal, description: row.description })
    }
    return c.json(Object.values(connectors), 200, { 'Cache-Control': 'public, max-age=3600', 'X-Source': 'd1' })
  } catch { return serveAsset(dataCache)(c) }
})

// ============================================
// D1 Database API — /api/db/*
// Region: EEUR, Full-text search, KV caching
// ============================================

// Database stats & health check
app.get('/api/db/stats', async (c) => {
  const db = (c.env as Bindings).DB
  if (!db) return c.json({ error: 'D1 not configured' }, 503)
  try {
    const [deviceCount, serviceCount, icCount, errorCount, boardCount, categories, brands, version] = await Promise.all([
      db.prepare('SELECT count(*) as cnt FROM devices').first(),
      db.prepare('SELECT count(*) as cnt FROM services').first(),
      db.prepare('SELECT count(*) as cnt FROM ic_reference').first(),
      db.prepare('SELECT count(*) as cnt FROM error_codes').first(),
      db.prepare('SELECT count(*) as cnt FROM logic_boards').first(),
      db.prepare('SELECT category, count(*) as cnt FROM devices GROUP BY category ORDER BY cnt DESC').all(),
      db.prepare('SELECT brand, count(*) as cnt FROM devices GROUP BY brand ORDER BY cnt DESC').all(),
      db.prepare("SELECT value FROM site_config WHERE key = 'version'").first<{ value: string }>(),
    ])
    return c.json({
      success: true,
      database: { version: version?.value || 'unknown', region: 'EEUR', engine: 'Cloudflare D1 (SQLite)' },
      counts: {
        devices: (deviceCount as any)?.cnt || 0,
        services: (serviceCount as any)?.cnt || 0,
        ic_references: (icCount as any)?.cnt || 0,
        error_codes: (errorCount as any)?.cnt || 0,
        logic_boards: (boardCount as any)?.cnt || 0,
      },
      categories: categories.results || [],
      brands: brands.results || [],
    })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// ============================================
// Power Station Price Tracker — /api/db/power-prices
// Uses KV for price history, fetches live from stores
// ============================================
const POWER_KV_PREFIX = 'power_prices:'
const POWER_MAX_HISTORY = 90
const POWER_LIVE_CACHE_TTL = 1800

const POWER_PRODUCT_URLS: Record<string, Record<string, string>> = {
  'ecoflow-delta-pro-3': { ecoflow_eu: 'https://www.ecoflow.com/de/delta-pro-3-tragbare-powerstation', amazon_de: 'https://www.amazon.de/dp/B0DFG2SPC9' },
  'ecoflow-delta-pro': { ecoflow_eu: 'https://www.ecoflow.com/de/delta-pro-tragbare-powerstation', amazon_de: 'https://www.amazon.de/dp/B09TZMGWRB' },
  'ecoflow-delta-2-max': { ecoflow_eu: 'https://www.ecoflow.com/de/delta-2-max-tragbare-powerstation', amazon_de: 'https://www.amazon.de/dp/B0C7J12DQ3' },
  'ecoflow-delta-3-plus': { ecoflow_eu: 'https://www.ecoflow.com/de/delta-3-plus-tragbare-powerstation', amazon_de: 'https://www.amazon.de/dp/B0DFG58H94' },
  'ecoflow-river-2-pro': { ecoflow_eu: 'https://www.ecoflow.com/de/river-2-pro-tragbare-powerstation', amazon_de: 'https://www.amazon.de/dp/B0BX57SM1G' },
  'ecoflow-river-2-max': { ecoflow_eu: 'https://www.ecoflow.com/de/river-2-max-tragbare-powerstation', amazon_de: 'https://www.amazon.de/dp/B0BX5B8ZYP' },
  'ecoflow-river-2': { ecoflow_eu: 'https://www.ecoflow.com/de/river-2-tragbare-powerstation', amazon_de: 'https://www.amazon.de/dp/B0BX58JX4Y' },
  'bluetti-ac70p': { official: 'https://www.bluettipower.de/products/ac70p', amazon_de: 'https://www.amazon.de/dp/B0D7V9H5P6' },
  'bluetti-eb55': { official: 'https://www.bluettipower.de/products/eb55', amazon_de: 'https://www.amazon.de/dp/B098CRJFL4' },
  'bluetti-eb3a': { official: 'https://www.bluettipower.de/products/eb3a', amazon_de: 'https://www.amazon.de/dp/B0B4P3J4ST' },
  'bluetti-eb70': { official: 'https://www.bluettipower.de/products/eb70', amazon_de: 'https://www.amazon.de/dp/B09D34WCQB' },
  'jackery-explorer-300': { official: 'https://de.jackery.com/products/explorer-300', amazon_de: 'https://www.amazon.de/dp/B08ZSR51P3' },
  'jackery-explorer-500': { official: 'https://de.jackery.com/products/explorer-500', amazon_de: 'https://www.amazon.de/dp/B08LYWFXJP' },
  'jackery-explorer-1000': { official: 'https://de.jackery.com/products/explorer-1000', amazon_de: 'https://www.amazon.de/dp/B087FKVVYL' },
}

function extractPriceFromHtml(html: string): number | null {
  const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)
  if (jsonLdMatch) {
    for (const block of jsonLdMatch) {
      try {
        const data = JSON.parse(block.replace(/<\/?script[^>]*>/gi, ''))
        if (data['@type'] === 'Product' && data.offers) {
          const offers = Array.isArray(data.offers) ? data.offers : [data.offers]
          for (const o of offers) { if (o.price) return parseFloat(o.price) }
        }
      } catch {}
    }
  }
  const meta = html.match(/<meta[^>]*property="og:price:amount"[^>]*content="([^"]+)"/i)
  if (meta) { const p = parseFloat(meta[1].replace(',', '.')); if (p > 0) return p }
  return null
}

function extractAmazonPriceFromHtml(html: string): number | null {
  const patterns = [/class="a-price-whole"[^>]*>([\d.,]+)</gi, /"price"\s*:\s*"?([\d.,]+)"?/gi]
  for (const pat of patterns) { const m = pat.exec(html); if (m) { const p = parseFloat(m[1].replace(/\./g, '').replace(',', '.')); if (p > 10 && p < 50000) return p } }
  return null
}

async function fetchPriceUrl(url: string, ext: (h: string) => number | null): Promise<number | null> {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 6000)
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0', 'Accept-Language': 'de-DE,de;q=0.9' } })
    if (!r.ok) return null
    // Read only first 200KB to avoid OOM — price info is always in early HTML
    const reader = r.body?.getReader()
    if (!reader) return null
    const chunks: Uint8Array[] = []
    let totalBytes = 0
    const MAX_BYTES = 200 * 1024 // 200KB limit
    while (totalBytes < MAX_BYTES) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      totalBytes += value.byteLength
    }
    reader.cancel().catch(() => {})
    const html = new TextDecoder().decode(chunks.length === 1 ? chunks[0] : mergeChunks(chunks, totalBytes))
    return ext(html)
  } catch { return null } finally { clearTimeout(t) }
}

function mergeChunks(chunks: Uint8Array[], total: number): Uint8Array {
  const merged = new Uint8Array(total)
  let offset = 0
  for (const c of chunks) { merged.set(c, offset); offset += c.byteLength }
  return merged
}

// Fetch live prices in small batches to avoid OOM on Workers (max 128MB)
async function fetchAllLivePrices(): Promise<Record<string, Record<string, number>>> {
  const results: Record<string, Record<string, number>> = {}
  const entries = Object.entries(POWER_PRODUCT_URLS)
  const BATCH_SIZE = 2 // max 2 products at a time (4 fetches) to stay under memory limit
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE)
    const fetches: Promise<void>[] = []
    for (const [id, urls] of batch) {
      results[id] = results[id] || {}
      const off = urls.ecoflow_eu || urls.official
      if (off) fetches.push(fetchPriceUrl(off, extractPriceFromHtml).then(p => { if (p) results[id].official_eu = p }))
      if (urls.amazon_de) fetches.push(fetchPriceUrl(urls.amazon_de, extractAmazonPriceFromHtml).then(p => { if (p) results[id].amazon_de = p }))
    }
    await Promise.allSettled(fetches)
    // Small delay between batches to let GC reclaim memory
    if (i + BATCH_SIZE < entries.length) await new Promise(r => setTimeout(r, 50))
  }
  return results
}

async function kvGetHistory(kv: KVNamespace, id: string): Promise<any[]> {
  const raw = await kv.get(POWER_KV_PREFIX + id); if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

async function kvGetAllHistory(kv: KVNamespace): Promise<Record<string, any[]>> {
  const result: Record<string, any[]> = {}
  const list = await kv.list({ prefix: POWER_KV_PREFIX })
  await Promise.allSettled(list.keys.map(async k => {
    const raw = await kv.get(k.name); if (!raw) return
    const id = k.name.replace(POWER_KV_PREFIX, '')
    if (id !== 'live_cache' && id !== 'last_fetch') try { result[id] = JSON.parse(raw) } catch {}
  }))
  return result
}

async function kvSaveRecord(kv: KVNamespace, id: string, record: any): Promise<any[]> {
  const key = POWER_KV_PREFIX + id
  const hist = await kvGetHistory(kv, id); hist.push(record)
  const trimmed = hist.slice(-POWER_MAX_HISTORY)
  await kv.put(key, JSON.stringify(trimmed)); return trimmed
}

// GET /api/db/power-prices?action=...
app.get('/api/db/power-prices', async (c) => {
  const kv = (c.env as Bindings).CACHE
  const action = c.req.query('action')

  if (action === 'ping') return c.json({ ok: true, module: 'power-prices', kv_available: !!kv, timestamp: new Date().toISOString(), products: Object.keys(POWER_PRODUCT_URLS).length })
  if (!kv) return c.json({ error: 'KV not configured' }, 503)

  if (action === 'history') {
    const id = c.req.query('id')
    if (!id) return c.json({ error: 'Missing id' }, 400)
    return c.json({ id, history: await kvGetHistory(kv, id) })
  }
  if (action === 'history-all') {
    const all = await kvGetAllHistory(kv)
    return c.json({ history: all, count: Object.keys(all).length })
  }
  if (action === 'fetch-live') {
    const cached = await kv.get(POWER_KV_PREFIX + 'live_cache')
    const lastFetch = await kv.get(POWER_KV_PREFIX + 'last_fetch')
    const age = lastFetch ? (Date.now() - new Date(lastFetch).getTime()) / 1000 : Infinity
    if (cached && age < POWER_LIVE_CACHE_TTL) return c.json({ prices: JSON.parse(cached), cached: true, last_fetch: lastFetch, cache_age_seconds: Math.round(age) })
    const live = await fetchAllLivePrices()
    const now = new Date().toISOString()
    await kv.put(POWER_KV_PREFIX + 'live_cache', JSON.stringify(live), { expirationTtl: POWER_LIVE_CACHE_TTL })
    await kv.put(POWER_KV_PREFIX + 'last_fetch', now)
    const today = now.slice(0, 10)
    for (const [id, prices] of Object.entries(live)) {
      if (prices.official_eu || prices.amazon_de) {
        const existing = await kvGetHistory(kv, id)
        if (!existing.some((r: any) => r.date === today))
          await kvSaveRecord(kv, id, { date: today, timestamp: now, price_eu: prices.official_eu || null, amazon_de: prices.amazon_de || null, source: 'auto' })
      }
    }
    return c.json({ prices: live, cached: false, last_fetch: now, products_fetched: Object.keys(live).length })
  }

  // Default: stats
  const all = await kvGetAllHistory(kv)
  const stats: Record<string, any> = {}
  for (const [id, records] of Object.entries(all)) {
    const sorted = records.sort((a: any, b: any) => b.date.localeCompare(a.date))
    stats[id] = { records: records.length, latest: sorted[0], previous: sorted[1] || null, trend: sorted[0] && sorted[1] ? (sorted[0].price_eu > sorted[1].price_eu ? 'up' : sorted[0].price_eu < sorted[1].price_eu ? 'down' : 'stable') : 'unknown' }
  }
  return c.json({ products: Object.keys(POWER_PRODUCT_URLS).length, tracked: Object.keys(all).length, stats, product_urls: POWER_PRODUCT_URLS })
})

// POST /api/db/power-prices
app.post('/api/db/power-prices', async (c) => {
  const kv = (c.env as Bindings).CACHE
  if (!kv) return c.json({ error: 'KV not configured' }, 503)
  const body = await c.req.json().catch(() => ({} as any))
  if (body.action === 'record') {
    if (!body.id) return c.json({ error: 'Missing id' }, 400)
    const now = new Date().toISOString()
    const record = { date: now.slice(0, 10), timestamp: now, price_eu: body.price_eu || null, price_ua: body.price_ua || null, amazon_de: body.amazon_de || null, source: body.source || 'manual', note: body.note || null }
    const hist = await kvSaveRecord(kv, body.id, record)
    return c.json({ ok: true, id: body.id, record, total_records: hist.length })
  }
  if (body.action === 'fetch-live') {
    const live = await fetchAllLivePrices()
    const now = new Date().toISOString()
    await kv.put(POWER_KV_PREFIX + 'live_cache', JSON.stringify(live), { expirationTtl: POWER_LIVE_CACHE_TTL })
    await kv.put(POWER_KV_PREFIX + 'last_fetch', now)
    return c.json({ ok: true, prices: live, last_fetch: now })
  }
  return c.json({ error: 'Unknown action' }, 400)
})

// List/search devices
app.get('/api/db/devices', async (c) => {
  const db = (c.env as Bindings).DB
  const kv = (c.env as Bindings).CACHE
  if (!db) return c.json({ error: 'D1 not configured' }, 503)
  try {
    const url = new URL(c.req.url)
    const search = url.searchParams.get('search')
    const category = url.searchParams.get('category')
    const brand = url.searchParams.get('brand')
    const type = url.searchParams.get('type')
    const year = url.searchParams.get('year')
    const ic = url.searchParams.get('ic')
    const fields = url.searchParams.get('fields')
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50')))
    const offset = (page - 1) * limit

    // KV cache
    const cacheKey = `devices:${url.search}`
    if (kv) {
      const cached = await kv.get(cacheKey)
      if (cached) {
        return new Response(cached, {
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=300' }
        })
      }
    }

    const selectFields = fields
      ? fields.split(',').map(f => f.trim()).filter(f => /^[a-z_]+$/i.test(f)).join(', ')
      : '*'

    let sql: string
    let countSql: string
    const bindings: unknown[] = []
    const countBindings: unknown[] = []

    if (search) {
      sql = `SELECT ${selectFields} FROM devices WHERE id IN (SELECT rowid FROM devices_fts WHERE devices_fts MATCH ?)`
      countSql = `SELECT count(*) as total FROM devices WHERE id IN (SELECT rowid FROM devices_fts WHERE devices_fts MATCH ?)`
      bindings.push(search); countBindings.push(search)
    } else if (ic) {
      const pat = `%${ic}%`
      sql = `SELECT ${selectFields} FROM devices WHERE charging_ic LIKE ? OR power_ics LIKE ? OR audio_ics LIKE ?`
      countSql = `SELECT count(*) as total FROM devices WHERE charging_ic LIKE ? OR power_ics LIKE ? OR audio_ics LIKE ?`
      bindings.push(pat, pat, pat); countBindings.push(pat, pat, pat)
    } else {
      sql = `SELECT ${selectFields} FROM devices WHERE 1=1`
      countSql = `SELECT count(*) as total FROM devices WHERE 1=1`
    }

    if (category) { sql += ' AND category = ?'; countSql += ' AND category = ?'; bindings.push(category); countBindings.push(category) }
    if (brand) { sql += ' AND brand = ?'; countSql += ' AND brand = ?'; bindings.push(brand); countBindings.push(brand) }
    if (type) { sql += ' AND device_type = ?'; countSql += ' AND device_type = ?'; bindings.push(type); countBindings.push(type) }
    if (year) { sql += ' AND year = ?'; countSql += ' AND year = ?'; bindings.push(parseInt(year)); countBindings.push(parseInt(year)) }

    sql += ' ORDER BY year DESC, name ASC LIMIT ? OFFSET ?'
    bindings.push(limit, offset)

    const [dataResult, countResult] = await Promise.all([
      db.prepare(sql).bind(...bindings).all(),
      db.prepare(countSql).bind(...countBindings).first<{ total: number }>(),
    ])

    const devices = dataResult.results.map(d => parseD1JsonFields(d as Record<string, unknown>))

    const resp = JSON.stringify({
      success: true,
      data: devices,
      pagination: { page, limit, total: countResult?.total || 0, pages: Math.ceil((countResult?.total || 0) / limit) },
      meta: { duration_ms: dataResult.meta?.duration, region: 'EEUR' }
    })

    if (kv) c.executionCtx.waitUntil(kv.put(cacheKey, resp, { expirationTtl: 300 }))

    return new Response(resp, {
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS', 'Cache-Control': 'public, max-age=300' }
    })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// Single device lookup
app.get('/api/db/device', async (c) => {
  const db = (c.env as Bindings).DB
  if (!db) return c.json({ error: 'D1 not configured' }, 503)
  try {
    const url = new URL(c.req.url)
    const id = url.searchParams.get('id')
    const name = url.searchParams.get('name')
    const board = url.searchParams.get('board')
    let device: Record<string, unknown> | null = null

    if (id) device = await db.prepare('SELECT * FROM devices WHERE id = ?').bind(parseInt(id)).first()
    else if (name) device = await db.prepare('SELECT * FROM devices WHERE name = ?').bind(name).first()
    else if (board) device = await db.prepare("SELECT * FROM devices WHERE board_numbers LIKE ?").bind(`%${board}%`).first()
    else return c.json({ error: 'Provide ?id=, ?name=, or ?board= parameter' }, 400)

    if (!device) return c.json({ success: false, error: 'Device not found' }, 404)
    return c.json({ success: true, data: parseD1JsonFields(device) })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// Universal search
app.get('/api/db/search', async (c) => {
  const db = (c.env as Bindings).DB
  const kv = (c.env as Bindings).CACHE
  if (!db) return c.json({ error: 'D1 not configured' }, 503)
  try {
    const url = new URL(c.req.url)
    const q = url.searchParams.get('q')
    const limit = Math.min(20, parseInt(url.searchParams.get('limit') || '10'))
    if (!q || q.length < 2) return c.json({ error: 'Query must be at least 2 characters' }, 400)

    const cacheKey = `search:${q}:${limit}`
    if (kv) {
      const cached = await kv.get(cacheKey)
      if (cached) return new Response(cached, { headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' } })
    }

    const like = `%${q}%`
    const [devices, ics, errors, boards] = await Promise.all([
      db.prepare('SELECT id, name, category, brand, model, year, emc, processor FROM devices WHERE id IN (SELECT rowid FROM devices_fts WHERE devices_fts MATCH ?) LIMIT ?').bind(q, limit).all().catch(() => ({ results: [] } as any)),
      db.prepare('SELECT ic_number, ic_type, manufacturer, function, used_in FROM ic_reference WHERE ic_number LIKE ? OR function LIKE ? LIMIT ?').bind(like, like, limit).all(),
      db.prepare('SELECT code, description, cause, solution, severity FROM error_codes WHERE code LIKE ? OR description LIKE ? OR cause LIKE ? LIMIT ?').bind(like, like, like, limit).all(),
      db.prepare('SELECT board_number, device_name, cpu, ram FROM logic_boards WHERE board_number LIKE ? OR device_name LIKE ? LIMIT ?').bind(like, like, limit).all(),
    ])

    const icResults = (ics.results || []).map((ic: any) => {
      if (ic.used_in && typeof ic.used_in === 'string') try { ic.used_in = JSON.parse(ic.used_in) } catch {}
      return ic
    })

    const resp = JSON.stringify({
      success: true, query: q,
      results: {
        devices: devices.results || [],
        ics: icResults,
        error_codes: errors.results || [],
        logic_boards: boards.results || [],
      },
      total: (devices.results?.length || 0) + (ics.results?.length || 0) + (errors.results?.length || 0) + (boards.results?.length || 0),
    })

    if (kv) c.executionCtx.waitUntil(kv.put(cacheKey, resp, { expirationTtl: 300 }))
    return new Response(resp, { headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' } })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// Services list
app.get('/api/db/services', async (c) => {
  const db = (c.env as Bindings).DB
  if (!db) return c.json({ error: 'D1 not configured' }, 503)
  try {
    const result = await db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all()
    return c.json({ success: true, data: result.results, total: result.results.length })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// IC reference lookup
app.get('/api/db/ic', async (c) => {
  const db = (c.env as Bindings).DB
  if (!db) return c.json({ error: 'D1 not configured' }, 503)
  try {
    const url = new URL(c.req.url)
    const q = url.searchParams.get('q')
    const type = url.searchParams.get('type')
    const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '50'))

    let sql = 'SELECT * FROM ic_reference WHERE 1=1'
    const binds: unknown[] = []
    if (q) { const p = `%${q}%`; sql += ' AND (ic_number LIKE ? OR function LIKE ? OR manufacturer LIKE ?)'; binds.push(p, p, p) }
    if (type) { sql += ' AND ic_type = ?'; binds.push(type) }
    sql += ' ORDER BY ic_number ASC LIMIT ?'; binds.push(limit)

    const result = await db.prepare(sql).bind(...binds).all()
    const ics = result.results.map((ic: any) => {
      if (ic.used_in && typeof ic.used_in === 'string') try { ic.used_in = JSON.parse(ic.used_in) } catch {}
      if (ic.compatible_with && typeof ic.compatible_with === 'string') try { ic.compatible_with = JSON.parse(ic.compatible_with) } catch {}
      return ic
    })
    return c.json({ success: true, data: ics, total: ics.length })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// Error codes lookup
app.get('/api/db/errors', async (c) => {
  const db = (c.env as Bindings).DB
  if (!db) return c.json({ error: 'D1 not configured' }, 503)
  try {
    const url = new URL(c.req.url)
    const code = url.searchParams.get('code')
    const severity = url.searchParams.get('severity')
    const hardware = url.searchParams.get('hardware')

    let sql = 'SELECT * FROM error_codes WHERE 1=1'
    const binds: unknown[] = []
    if (code) { sql += ' AND code = ?'; binds.push(code) }
    if (severity) { sql += ' AND severity = ?'; binds.push(severity) }
    if (hardware !== null && hardware !== undefined) { sql += ' AND hardware = ?'; binds.push(parseInt(hardware)) }
    sql += ' ORDER BY code ASC'

    const result = await db.prepare(sql).bind(...binds).all()
    return c.json({ success: true, data: result.results, total: result.results.length })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// Full database export (backward compatible with master-db.json)
app.get('/api/db/export', async (c) => {
  const db = (c.env as Bindings).DB
  const kv = (c.env as Bindings).CACHE
  if (!db) return c.json({ error: 'D1 not configured' }, 503)
  try {
    const cacheKey = 'db:export:full'
    if (kv) {
      const cached = await kv.get(cacheKey)
      if (cached) return new Response(cached, { headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=3600' } })
    }

    const [devices, services, config] = await Promise.all([
      db.prepare('SELECT * FROM devices ORDER BY year DESC, name ASC').all(),
      db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all(),
      db.prepare('SELECT key, value FROM site_config').all(),
    ])

    const configMap: Record<string, unknown> = {}
    for (const row of config.results as any[]) {
      try { configMap[row.key] = JSON.parse(row.value) } catch { configMap[row.key] = row.value }
    }

    const servicesObj: Record<string, unknown> = {}
    for (const svc of services.results as any[]) {
      const { id: svcId, sort_order, ...rest } = svc
      servicesObj[svcId] = rest
    }

    const result = {
      version: (configMap.version as string) || '3.2.2',
      lastUpdated: (configMap.lastUpdated as string) || new Date().toISOString().split('T')[0],
      description: 'NEXX GSM - Centralized database (D1)',
      source: 'cloudflare-d1',
      config: configMap.config || {},
      devices: devices.results.map(d => {
        const parsed = parseD1JsonFields(d as Record<string, unknown>)
        delete parsed.id; delete parsed.created_at; delete parsed.updated_at
        return parsed
      }),
      services: servicesObj,
      prices: configMap.prices || {},
      brands: configMap.brands || {},
      contact: configMap.contact || {},
      seo: configMap.seo || {},
    }

    const json = JSON.stringify(result)
    if (kv) c.executionCtx.waitUntil(kv.put(cacheKey, json, { expirationTtl: 3600 }))
    return new Response(json, { headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS', 'Cache-Control': 'public, max-age=3600' } })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// ============================================
// Enrichment Engine — Admin API
// ============================================

app.get('/api/enrichment/status', authMiddleware, async (c) => {
  const env = c.env as unknown as { DB: D1Database; CACHE: KVNamespace }
  const [lastRun, paused] = await Promise.all([
    EnrichmentEngine.getLastRun(env.CACHE),
    EnrichmentEngine.isPaused(env.CACHE)
  ])
  return c.json({
    paused,
    lastRun: lastRun ? {
      runId: lastRun.runId,
      startedAt: lastRun.startedAt,
      completedAt: lastRun.completedAt,
      dryRun: lastRun.dryRun,
      stats: lastRun.stats,
      errorCount: lastRun.errors.length,
      changeCount: lastRun.changes.length
    } : null
  })
})

app.get('/api/enrichment/history', authMiddleware, async (c) => {
  const env = c.env as unknown as { DB: D1Database; CACHE: KVNamespace }
  const lastRun = await EnrichmentEngine.getLastRun(env.CACHE)
  if (!lastRun) return c.json({ changes: [] })
  return c.json({
    runId: lastRun.runId,
    changes: lastRun.changes,
    errors: lastRun.errors
  })
})

app.post('/api/enrichment/run', authMiddleware, async (c) => {
  const env = c.env as unknown as { DB: D1Database; CACHE: KVNamespace }
  const body = await c.req.json().catch(() => ({})) as { dryRun?: boolean; maxChanges?: number }
  
  const engine = new EnrichmentEngine(env, {
    dryRun: body.dryRun !== false, // default to dry-run for manual triggers
    maxChangesPerRun: Math.min(body.maxChanges || 10, 25), // cap at 25
  })
  
  const result = await engine.run()
  return c.json(result)
})

app.post('/api/enrichment/pause', authMiddleware, async (c) => {
  const env = c.env as unknown as { DB: D1Database; CACHE: KVNamespace }
  await EnrichmentEngine.pause(env.CACHE)
  return c.json({ success: true, paused: true })
})

app.post('/api/enrichment/resume', authMiddleware, async (c) => {
  const env = c.env as unknown as { DB: D1Database; CACHE: KVNamespace }
  await EnrichmentEngine.resume(env.CACHE)
  return c.json({ success: true, paused: false })
})

app.post('/api/enrichment/revert/:runId', authMiddleware, async (c) => {
  const env = c.env as unknown as { DB: D1Database; CACHE: KVNamespace }
  const runId = c.req.param('runId')
  
  const auditData = await env.CACHE.get(`enrichment_audit:${runId}`)
  if (!auditData) return c.json({ error: 'Run not found' }, 404)
  
  const changes = JSON.parse(auditData) as Array<{
    action: string; target: string; field: string; oldValue: string | null; newValue: string
  }>
  let reverted = 0
  
  for (const change of changes.reverse()) {
    try {
      if (change.action === 'discover') {
        await env.DB.prepare('DELETE FROM devices WHERE name = ?').bind(change.target).run()
        reverted++
      } else if (change.action === 'enrich' && change.oldValue === null) {
        await env.DB.prepare(`UPDATE devices SET ${change.field} = NULL WHERE name = ?`).bind(change.target).run()
        reverted++
      } else if (change.action === 'ic_add') {
        await env.DB.prepare('DELETE FROM ic_reference WHERE ic_number = ?').bind(change.target).run()
        reverted++
      }
    } catch {
      // continue reverting
    }
  }
  
  try {
    await env.DB.prepare('UPDATE enrichment_log SET reverted = 1 WHERE run_id = ?').bind(runId).run()
  } catch { /* table might not exist */ }
  
  return c.json({ success: true, reverted, total: changes.length })
})

// Public enrichment feed — no PIN needed, shows recent activity for the ticker
app.get('/api/enrichment/feed', async (c) => {
  const env = c.env as unknown as { DB: D1Database; CACHE: KVNamespace }
  
  // Try to get from cache first (1 hour TTL)
  const cached = await env.CACHE.get('enrichment_feed')
  if (cached) {
    c.header('X-Cache', 'HIT')
    return c.json(JSON.parse(cached))
  }
  
  // Build feed from last run + D1 enrichment_log
  const lastRun = await EnrichmentEngine.getLastRun(env.CACHE)
  const paused = await EnrichmentEngine.isPaused(env.CACHE)
  
  // Get recent changes from D1 audit log
  let recentChanges: Array<{ action: string; target: string; field: string; source: string; created_at: string }> = []
  try {
    const rows = await env.DB.prepare(`
      SELECT action, target, field, source, created_at 
      FROM enrichment_log 
      WHERE reverted = 0 
      ORDER BY created_at DESC 
      LIMIT 30
    `).all()
    recentChanges = (rows.results || []) as typeof recentChanges
  } catch {
    // Table might not exist or have no data yet — use lastRun changes
    if (lastRun?.changes) {
      recentChanges = lastRun.changes.slice(0, 30).map(ch => ({
        action: ch.action,
        target: ch.target,
        field: ch.field,
        source: ch.source,
        created_at: ch.timestamp
      }))
    }
  }
  
  // Format items for the ticker
  const tickerItems = recentChanges.map(ch => {
    switch (ch.action) {
      case 'discover':
        return { icon: '🆕', text: `${ch.target}`, type: 'new' }
      case 'enrich':
        return { icon: '✨', text: `${ch.target} → ${formatField(ch.field)}`, type: 'enrich' }
      case 'ic_add':
        return { icon: '🔬', text: `IC ${ch.target}`, type: 'ic' }
      case 'error_code_add':
        return { icon: '📋', text: `Error code ${ch.target}`, type: 'error_code' }
      default:
        return { icon: '📝', text: ch.target, type: 'other' }
    }
  })
  
  const feed = {
    active: !paused,
    lastRunAt: lastRun?.completedAt || null,
    totalChanges: lastRun?.changes?.length || 0,
    stats: lastRun?.stats || null,
    ticker: tickerItems
  }
  
  // Cache for 1 hour
  await env.CACHE.put('enrichment_feed', JSON.stringify(feed), { expirationTtl: 3600 })
  c.header('X-Cache', 'MISS')
  return c.json(feed)
})

function formatField(field: string): string {
  const map: Record<string, string> = {
    connector_type: 'Connector',
    device_type: 'Type',
    brand: 'Brand',
    repair_difficulty: 'Difficulty',
    dfu_mode: 'DFU Mode',
    recovery_mode: 'Recovery Mode',
    new_device: 'New Device',
    ic_reference: 'IC Reference'
  }
  return map[field] || field
}

// Catch-all: try serving as static asset, otherwise return branded 404 page
app.all('*', async (c) => {
  // Try to serve as static asset first
  if (c.env?.ASSETS?.fetch) {
    const assetResponse = await c.env.ASSETS.fetch(c.req.raw)
    if (assetResponse.status !== 404) return assetResponse
  }

  // Return branded 404 page
  return c.html(`<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Pagina nu a fost găsită | NEXX</title>
  <link rel="icon" type="image/png" href="/static/nexx-logo.png">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="bg-gray-900 text-white min-h-screen flex items-center justify-center">
  <div class="text-center px-6 py-12 max-w-lg">
    <div class="mb-8">
      <a href="/"><img src="/static/nexx-logo.png" alt="NEXX" class="h-16 mx-auto mb-6"></a>
      <h1 class="text-8xl font-bold text-blue-500 mb-4">404</h1>
      <h2 class="text-2xl font-bold mb-2">Pagina nu a fost găsită</h2>
      <p class="text-gray-400 mb-8">Ne pare rău, dar pagina pe care o căutați nu există sau a fost mutată.</p>
    </div>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/" class="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg inline-flex items-center justify-center gap-2">
        <i class="fas fa-home"></i> Pagina Principală
      </a>
      <a href="/calculator" class="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-all shadow-lg inline-flex items-center justify-center gap-2">
        <i class="fas fa-calculator"></i> Calculator Preț
      </a>
    </div>
    <p class="mt-8 text-gray-500 text-sm">
      <i class="fas fa-map-marker-alt mr-1"></i> Calea Șerban Vodă 47, Sector 4, București
    </p>
  </div>
</body>
</html>`, 404)
})

export default app
