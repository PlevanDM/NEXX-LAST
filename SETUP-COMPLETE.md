# NEXX Setup Complete

## Текущая конфигурация (тесты)

### RemOnline
- **API Key**: настроен в `.env`, `.dev.vars`
- **Branch**: 218970 (NEXX GSM Bucharest)
- **Order type**: 334611 (Carry-in repair)
- **Формы**: callback, booking, appointment, calculator → все в RemOnline

### Cloudflare
- **Account ID**: ad170d773e79a037e28f4530fd5305a5
- **Project**: nexx-gsm
- **Zone**: nexxgsm.com
- **Домен**: nexxgsm.com

### Сайт
- **Главная**: `/` → index.html (лендинг)
- **База NEXX**: `/nexx` → nexx.html (пинкод 31618585)
- **API**: `/api/callback`, `/api/booking`, `/api/remonline`

---

## Команды

| Команда | Описание |
|---------|----------|
| `npm run test:apis` | Проверка RemOnline + Cloudflare API |
| `npm run configure:remonline` | Настройка RemOnline через API |
| `npm run setup:all` | Полная настройка (RemOnline, build, secrets) |
| `npm run setup:cf-secrets` | Загрузка .dev.vars в Cloudflare Pages |
| `npm run preview` | Локальный просмотр (wrangler pages dev) |
| `npm run deploy` | Build + deploy на Cloudflare Pages |

---

## Первый запуск

```powershell
# 1. Установка
npm install

# 2. Проверка API
npm run test:apis

# 3. Полная настройка (опционально)
npm run setup:all

# 4. Локальный тест
npm run preview
# Открыть http://localhost:8788

# 5. Деплой
npm run deploy
```

---

## Файлы конфигурации

| Файл | Описание |
|------|----------|
| `.env` | Cloudflare + RemOnline (deploy, purge) — gitignored |
| `.dev.vars` | RemOnline + Cloudflare (локальный wrangler) — gitignored |
| `remonline.config.json` | Конфиг RemOnline (branches, statuses) |
| `wrangler.toml` | Cloudflare Pages |
| `public/_routes.json` | Маршрутизация Worker |
| `public/_redirects` | Редиректы |

---

## GitHub Actions

Секреты: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`

```powershell
.\scripts\set-github-cloudflare-secrets.ps1
```

---

## Замена API ключей

1. **RemOnline**: обновить `.env`, `.dev.vars`, затем `npm run setup:cf-secrets`
2. **Cloudflare**: обновить `.env`, затем `.\scripts\set-github-cloudflare-secrets.ps1`
