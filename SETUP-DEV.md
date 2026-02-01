# Настройка для разработки и деплоя

Один раз настрой — потом только `npm run dev` / пуши в main.

## 1. Зависимости

```powershell
npm install
```

## 2. Секреты для деплоя (GitHub Actions → Cloudflare Pages)

Деплой по пушу в `main` работает, когда в репозитории заданы секреты GitHub.

### Вариант A: через скрипт (если установлен gh CLI)

1. Скопируйте пример и заполните:
   ```powershell
   copy .env.example .env
   # Откройте .env и заполните:
   # CLOUDFLARE_ACCOUNT_ID — из Cloudflare Dashboard (правый сайдбар, Account ID)
   # CLOUDFLARE_API_TOKEN — создать: https://dash.cloudflare.com/profile/api-tokens (шаблон "Edit Cloudflare Workers")
   ```

2. Установите и войдите в gh (если ещё не сделано):
   ```powershell
   winget install GitHub.cli
   gh auth login
   ```

3. Загрузите секреты в репозиторий:
   ```powershell
   .\scripts\set-github-cloudflare-secrets.ps1
   ```

### Вариант B: вручную в GitHub

1. Откройте: **https://github.com/PlevanDM/1/settings/secrets/actions**
2. **New repository secret** → имя `CLOUDFLARE_ACCOUNT_ID` → значение (Account ID из Cloudflare).
3. **New repository secret** → имя `CLOUDFLARE_API_TOKEN` → значение (API Token из Cloudflare, не Global Key).

После этого при пуше в `main` или при ручном запуске **Actions → Deploy to Cloudflare Pages** деплой будет проходить.

## 3. Разработка

```powershell
npm run dev          # Локальный сервер (лендинг + SPA)
npm run build        # Сборка (client + SSR + postbuild)
npm run type-check   # Проверка TypeScript
npm run validate     # Проверка базы устройств
```

## 4. Деплой

- **Через GitHub:** пуш в `main` или Actions → Deploy to Cloudflare Pages → Run.
- **Локально:** после `wrangler login` можно запускать `.\deploy-2026.ps1` или `npm run deploy`.

## 5. Полезные ссылки

- Секреты репо: https://github.com/PlevanDM/1/settings/secrets/actions  
- Cloudflare API Token: https://dash.cloudflare.com/profile/api-tokens  
- Краткий деплой: [QUICK-DEPLOY.md](QUICK-DEPLOY.md)
