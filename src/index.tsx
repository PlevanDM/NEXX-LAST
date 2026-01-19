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

// Main page
app.get('/', (c) => {
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
        
        <!-- Vite Entry Point -->
        ${import.meta.env.PROD ? `
          <script type="module" src="/static/client-v2.js"></script>
        ` : `
          <script type="module" src="/src/client.tsx"></script>
        `}
    </head>
    <body class="bg-gray-50">
        <div id="app"></div>
    </body>
    </html>
  `)
})

export default app
