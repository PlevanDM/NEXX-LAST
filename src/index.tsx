import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/data/*', serveStatic({ root: './public' }))

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🛠️ Apple Intake Desk</title>
        <meta name="description" content="Софт для приёмки устройств Apple: чек-листы, диагностика и база по платам">
        <script src="https://cdn.tailwindcss.com"></script>
        
        <!-- Local Vendor Scripts -->
        <script src="/static/vendor/react.production.min.js"></script>
        <script src="/static/vendor/react-dom.production.min.js"></script>

        <!-- Error Handling -->
        <script>
          window.onerror = function(msg, url, line, col, error) {
            document.body.innerHTML = '<div style="color:red; padding:20px;"><h1>Something went wrong</h1><pre>' + msg + '\\n' + url + ':' + line + '</pre></div>';
          };
          if (typeof React === 'undefined') {
            document.body.innerHTML = '<div style="color:red; padding:20px;"><h1>Error: React failed to load</h1><p>Check your internet connection or vendor files.</p></div>';
          }
        </script>
    </head>
    <body class="bg-gray-50">
        <div id="app"></div>
        <script src="/static/app.js?v=3.2"></script>
    </body>
    </html>
  `)
})

export default app
