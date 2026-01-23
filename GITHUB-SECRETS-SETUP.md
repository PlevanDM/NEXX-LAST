# 🔐 GitHub Secrets Setup для Cloudflare Pages Deployment

## Необходимые Secrets

Для автоматического деплоя через GitHub Actions нужно настроить следующие секреты:

### 1. CLOUDFLARE_API_TOKEN
- **Тип:** API Token (не Global API Key!)
- **Как создать:**
  1. Перейдите: https://dash.cloudflare.com/profile/api-tokens
  2. Нажмите "Create Token"
  3. Используйте шаблон "Edit Cloudflare Workers" или создайте кастомный:
     - Permissions: `Account` → `Cloudflare Pages` → `Edit`
     - Account Resources: `Include` → `All accounts` или выберите ваш аккаунт
  4. Скопируйте токен

### 2. CLOUDFLARE_ACCOUNT_ID
- **Значение:** `ad170d773e79a037e28f4530fd5305a5`
- **Где найти:** 
  - Cloudflare Dashboard → Right sidebar → Account ID
  - Или в URL: `https://dash.cloudflare.com/[ACCOUNT_ID]/pages`

## 📋 Настройка Secrets в GitHub

1. Перейдите: https://github.com/PlevanDM/nexx-webapp/settings/secrets/actions
2. Нажмите "New repository secret"
3. Добавьте каждый секрет:
   - **Name:** `CLOUDFLARE_API_TOKEN`
   - **Secret:** [ваш API токен]
   
   - **Name:** `CLOUDFLARE_ACCOUNT_ID`
   - **Secret:** `ad170d773e79a037e28f4530fd5305a5`

## ✅ Проверка

После настройки секретов:
1. Перейдите: https://github.com/PlevanDM/nexx-webapp/actions
2. Запустите workflow вручную (Actions → Deploy to Cloudflare Pages → Run workflow)
3. Проверьте логи на наличие ошибок

## 🔧 Альтернатива: Использование Global API Key (не рекомендуется)

Если API Token не работает, можно попробовать использовать Global API Key:
- **Name:** `CLOUDFLARE_API_TOKEN`
- **Secret:** `853487a6a39bd7f6f8128b4caf420ac22de33`

⚠️ **Внимание:** Global API Key менее безопасен, рекомендуется использовать API Token.

## 📝 Текущие настройки

- **Account ID:** `ad170d773e79a037e28f4530fd5305a5`
- **Project Name:** `nexx`
- **Email:** `dmitro.plevan@gmail.com`
