# 🚀 NEXX WebApp - Полное руководство по настройке

## 📋 Быстрый старт

### 1. GitHub Secrets (уже настроено автоматически)

Секреты настраиваются через `scripts/set-github-cloudflare-secrets.ps1` (читает .env):
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### 2. Деплой

**Автоматический (через GitHub Actions):**
- При каждом push в `main` автоматически деплоится
- Workflow: `.github/workflows/deploy-cloudflare.yml`

**Ручной:**
```powershell
# Основной скрипт деплоя
.\deploy-2026.ps1

# Или через npm
npm run build
npm run deploy
```

### 3. Очистка кеша

```powershell
.\aggressive-cache-purge.ps1
```

## 📁 Основные скрипты

### Деплой
- `deploy-2026.ps1` - Основной скрипт деплоя (build + wrangler + опционально purge)
- `scripts/deploy-git-clean.ps1` - Чистый экспорт и push в другой репозиторий
- `scripts/create-project-and-deploy.ps1` - Создание проекта Pages и деплой

### Утилиты
- `aggressive-cache-purge.ps1` - Агрессивная очистка кеша Cloudflare
- `purge-cloudflare-cache.ps1` - Очистка кеша Cloudflare
- `scripts/setup-cloudflare-secrets.ps1` - Секреты для wrangler (локально)
- `scripts/set-github-cloudflare-secrets.ps1` - Секреты для GitHub Actions (из .env)

## 🔧 Cloudflare Configuration

- **Account ID:** `ad170d773e79a037e28f4530fd5305a5`
- **Project Name:** `nexx-gsm`
- **Zone:** `nexxgsm.com`

## 📚 Дополнительная документация

- `README.md` - Основная документация проекта
- `docs-archive/TODO-REPAIR-LIST.md` - Список задач и исправлений (архив)
- `GITHUB-SECRETS-SETUP.md` - Настройка GitHub Secrets

## ⚠️ Важно

- Не коммитьте секреты в код
- Используйте GitHub Secrets для токенов
- Временные файлы игнорируются через `.gitignore`
