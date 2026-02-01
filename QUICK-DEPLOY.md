# Quick Deploy Guide

## Setup (.env)

Copy `.env.example` to `.env` and fill values. **Never commit .env** (gitignored).

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token   # For GitHub Actions + wrangler
CLOUDFLARE_GLOBAL_API_KEY=...         # For purge scripts (cache)
CLOUDFLARE_EMAIL=your@email.com
REMONLINE_API_KEY=...
```

## Deploy Options

### Option 1: wrangler login (local)

```powershell
wrangler login
npm run build
wrangler pages deploy dist --project-name nexx-gsm
```

### Option 2: deploy-2026.ps1 (uses .env)

```powershell
.\deploy-2026.ps1
```

### Option 3: GitHub Actions

1. Set secrets: `.\scripts\set-github-cloudflare-secrets.ps1` (reads .env, requires gh CLI)
2. Or manually: GitHub → Settings → Secrets → CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN
3. Push to main or: Actions → Deploy to Cloudflare Pages → Run

**Note:** GitHub Actions needs API Token (not Global Key). Create at: https://dash.cloudflare.com/profile/api-tokens (template: Edit Cloudflare Workers)

## Cache Purge

```powershell
.\purge-cloudflare-cache.ps1   # Loads from .env
```

---

## Боевой режим: перезапуск, проверка, логи

### Полный цикл перезапуска сайта

```powershell
# 1. Сборка
npm run build

# 2. Деплой на Cloudflare Pages
npx wrangler pages deploy dist --project-name nexx-gsm --branch main
# или: .\deploy-2026.ps1

# 3. Проверка боевого сайта (9 проверок: главная, /nexx, API callback/booking, лого, данные)
node scripts/test-deployed-site.cjs https://nexxgsm.com
```

### Проверка запуска

- **Продакшен:** `node scripts/test-deployed-site.cjs https://nexxgsm.com`
- **Превью деплоя:** `node scripts/test-deployed-site.cjs https://<deployment-id>.nexx-gsm.pages.dev`
- Ожидаемый результат: **Result: 9/9 passed**

### Логирование

- **Логи Cloudflare (Functions / Worker):**  
  [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **nexx-gsm** → **Logs** (Real-time Logs) или **Analytics**.
- В коде Functions используется `console.log` / `console.error` — вывод попадает в Real-time Logs при запросах к `/api/*`.

---

**Recommended:** `wrangler login` for local deploy; API Token in GitHub secrets for CI.
