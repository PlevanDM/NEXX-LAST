# 🔧 Context7 MCP + Remonline + Cloudflare - Полная настройка

## ✅ Context7 MCP

Context7 MCP уже установлен и настроен в `.cursor/mcp.json`.

### Использование:
Добавьте `use context7` в промпты для получения актуальной документации:
```
"Настрой Remonline API интеграцию. use context7"
```

## 🔧 Remonline Configuration

### Текущие настройки:
- **API Key:** `a7948011b9a3ccf979db1b706e9bcd3c`
- **Base URL:** `https://api.remonline.app`
- **Branch ID:** `218970`
- **Order Type:** `334611`

### Настройка через Cloudflare Pages Environment Variables:

1. **Через PowerShell скрипт:**
```powershell
.\setup-cloudflare-env-vars.ps1
```

2. **Через Cloudflare Dashboard:**
   - Перейдите: https://dash.cloudflare.com/
   - Pages → nexx → Settings → Environment Variables
   - Добавьте переменные:
     - `REMONLINE_API_KEY`
     - `REMONLINE_BASE_URL`
     - `REMONLINE_BRANCH_ID`
     - `REMONLINE_ORDER_TYPE`
     - `VAPI_API_KEY`
     - `VAPI_PHONE_ID`
     - `VAPI_ASSISTANT_ID`

3. **Через Wrangler CLI:**
```bash
wrangler secret put REMONLINE_API_KEY
wrangler secret put VAPI_API_KEY
```

## 📋 Обновления кода

### ✅ Обновлено:
- `functions/api/callback.js` - использует `env.*` переменные
- `functions/api/remonline.js` - уже использует `env.*`
- `functions/api/booking.js` - уже использует `env.*`

### 🔄 Fallback значения:
Код использует fallback на захардкоженные значения, если env переменные не установлены.

## 🚀 Cloudflare Configuration

### Environment Variables в wrangler.toml:
```toml
[env.production.vars]
REMONLINE_API_KEY = "your_key_here"
REMONLINE_BASE_URL = "https://api.remonline.app"
REMONLINE_BRANCH_ID = "218970"
REMONLINE_ORDER_TYPE = "334611"
```

**⚠️ ВАЖНО:** Не коммитьте секреты в wrangler.toml! Используйте:
- Cloudflare Dashboard для Pages
- `wrangler secret put` для Workers
- Environment Variables через API

## 📊 Проверка

### Проверить environment variables:
```powershell
.\check-cloudflare-env-vars.ps1
```

### Тест Remonline API:
```powershell
.\test-remonline-api.ps1
```

## ✅ Итог

Все настройки применены:
- ✅ Context7 MCP установлен
- ✅ Remonline использует env переменные
- ✅ Cloudflare Pages настроен
- ✅ Fallback значения для разработки
