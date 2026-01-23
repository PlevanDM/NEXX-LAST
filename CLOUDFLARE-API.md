# 🌐 Cloudflare API Configuration

## 📋 Швидкий старт

Ваш проект налаштовано для роботи з Cloudflare Global API.

### Токен та Email

- **API Token**: `519bdfbd2efeaa9c3a418b905202058bac2fc`
- **Email**: `dmitro.plevan@gmail.com`

### ⚠️ Важливо про токени

Cloudflare підтримує два типи авторизації:

1. **API Token** (рекомендовано)
   - Формат: довгий рядок (40+ символів)
   - Використовує: `Authorization: Bearer <token>`
   - Створюється в: [API Tokens](https://dash.cloudflare.com/profile/api-tokens)

2. **Global API Key** (застарілий)
   - Формат: коротший рядок
   - Використовує: `X-Auth-Key` + `X-Auth-Email`
   - Знаходиться в: [API Tokens > Global API Key](https://dash.cloudflare.com/profile/api-tokens)

**Якщо тести не працюють:**
1. Перевірте, що токен правильний
2. Переконайтеся, що токен має необхідні права
3. Спробуйте створити новий API Token з правами на Pages/Workers

## 🧪 Тестування API

### PowerShell скрипт

```powershell
.\test-cloudflare-api.ps1
```

Або з параметрами:

```powershell
.\test-cloudflare-api.ps1 -Token "ваш_токен" -Email "ваш_email"
```

### Node.js скрипт

```bash
npm run test:cf-api
```

Або напряму:

```bash
node test-cloudflare-api.js
```

### З змінними середовища

```powershell
# PowerShell
$env:CLOUDFLARE_API_TOKEN = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$env:CLOUDFLARE_EMAIL = "dmitro.plevan@gmail.com"
npm run test:cf-api
```

```bash
# Bash
export CLOUDFLARE_API_TOKEN="519bdfbd2efeaa9c3a418b905202058bac2fc"
export CLOUDFLARE_EMAIL="dmitro.plevan@gmail.com"
npm run test:cf-api
```

## 🔧 Налаштування Wrangler

### Авторизація через браузер

```bash
npm run cf:login
```

### Перевірка поточного користувача

```bash
npm run cf:whoami
```

### Встановлення секретів

```bash
# Встановити API токен як секрет
wrangler secret put CLOUDFLARE_API_TOKEN
# (введіть токен при запиті)
```

## 📁 Файли конфігурації

### `wrangler.toml`

Основна конфігурація для Cloudflare Pages/Workers:

```toml
name = "nexx-webapp"
compatibility_date = "2025-01-20"
pages_build_output_dir = "dist"
```

### Змінні середовища

Створіть файл `.env` (не комітиться в git):

```env
CLOUDFLARE_API_TOKEN=519bdfbd2efeaa9c3a418b905202058bac2fc
CLOUDFLARE_EMAIL=dmitro.plevan@gmail.com
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ZONE_ID=your_zone_id
```

## 🚀 Використання API

### В коді (Node.js/TypeScript)

```typescript
const API_BASE = 'https://api.cloudflare.com/client/v4';
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const EMAIL = process.env.CLOUDFLARE_EMAIL;

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
  'X-Auth-Email': EMAIL
};

// Приклад: отримати інформацію про користувача
const response = await fetch(`${API_BASE}/user`, {
  method: 'GET',
  headers
});
const data = await response.json();
```

### В PowerShell

```powershell
$API_BASE = "https://api.cloudflare.com/client/v4"
$TOKEN = "519bdfbd2efeaa9c3a418b905202058bac2fc"
$EMAIL = "dmitro.plevan@gmail.com"

$HEADERS = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
    "X-Auth-Email" = $EMAIL
}

$response = Invoke-RestMethod -Uri "$API_BASE/user" -Method Get -Headers $HEADERS
```

## 📚 Основні API endpoints

### User API

- `GET /user` - Інформація про користувача
- `GET /user/tokens/verify` - Перевірка токену
- `GET /user/organizations` - Список організацій

### Zones API

- `GET /zones` - Список зон (доменів)
- `GET /zones/:zone_id` - Деталі зони
- `GET /zones/:zone_id/dns_records` - DNS записи

### Accounts API

- `GET /accounts` - Список акаунтів
- `GET /accounts/:account_id` - Деталі акаунту

### Pages API

- `GET /accounts/:account_id/pages/projects` - Список проектів
- `GET /accounts/:account_id/pages/projects/:project_name` - Деталі проекту
- `POST /accounts/:account_id/pages/projects/:project_name/deployments` - Створити деплой

## 🔐 Безпека

1. **Ніколи не комітьте токени в git**
   - Використовуйте `.env` файли (вже в `.gitignore`)
   - Використовуйте Wrangler secrets для production

2. **Обмежте права токену**
   - Створюйте токени з мінімальними необхідними правами
   - Використовуйте API токени замість Global API Key

3. **Ротація токенів**
   - Регулярно змінюйте токени
   - Видаляйте невикористовувані токени

## 📖 Документація

- [Cloudflare API Documentation](https://developers.cloudflare.com/api/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Pages API](https://developers.cloudflare.com/api/operations/pages-project-list-projects)

## 🐛 Troubleshooting

### Помилка авторизації

```bash
# Перевірте токен
npm run test:cf-api

# Перевірте авторизацію Wrangler
npm run cf:whoami
```

### Помилка доступу до Pages

```bash
# Переконайтеся, що токен має права на Pages
# Перевірте Account ID в wrangler.toml
```

### Помилка деплою

```bash
# Перевірте авторизацію
npm run cf:login

# Перевірте конфігурацію
cat wrangler.toml
```

---

**Репозиторій:** https://github.com/PlevanDM/nexx-webapp  
**Версія:** 9.6.0
