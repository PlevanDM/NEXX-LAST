# 🔐 Налаштування GitHub Secrets через API

## ✅ Що готово

- ✅ GitHub токен протестовано і працює
- ✅ API доступ до Secrets підтверджено
- ✅ Public key репозиторію отримано
- ✅ Node.js з tweetnacl встановлено для шифрування
- ✅ Скрипт `setup-github-secrets.ps1` готовий до використання

## 🚀 Як використовувати

### Варіант 1: Через PowerShell скрипт (рекомендовано)

```powershell
.\setup-github-secrets.ps1 -CloudflareApiToken "ваш_cloudflare_api_token"
```

Скрипт автоматично:
1. Отримає public key репозиторію
2. Зашифрує secrets через Node.js + tweetnacl
3. Відправить через GitHub API
4. Встановить обидва secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

### Варіант 2: Через GitHub CLI

```powershell
gh secret set CLOUDFLARE_API_TOKEN --repo PlevanDM/nexx-webapp
gh secret set CLOUDFLARE_ACCOUNT_ID --repo PlevanDM/nexx-webapp --body "ad170d773e79a037e28f4530fd5305a5"
```

### Варіант 3: Вручну через веб-інтерфейс

1. Перейдіть: https://github.com/PlevanDM/nexx-webapp/settings/secrets/actions
2. Натисніть "New repository secret"
3. Додайте:
   - **Name:** `CLOUDFLARE_API_TOKEN`
   - **Value:** ваш Cloudflare API Token
4. Повторіть для `CLOUDFLARE_ACCOUNT_ID` = `ad170d773e79a037e28f4530fd5305a5`

## 📋 Перевірка

### Тест API доступу:
```powershell
.\test-github-secrets-api.ps1
```

### Перевірка встановлених secrets:
```powershell
.\test-github-token.ps1
```

## 🔧 Технічні деталі

### Як працює шифрування:

1. **Отримання public key:**
   ```
   GET /repos/{owner}/{repo}/actions/secrets/public-key
   ```

2. **Шифрування через NaCl Box:**
   - Використовується tweetnacl (Node.js)
   - Генерується ephemeral key pair
   - Шифрування: Curve25519 + XSalsa20 + Poly1305
   - Формат: ephemeral_public_key (32 bytes) + nonce (24 bytes) + encrypted_message

3. **Відправка через API:**
   ```
   PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}
   Body: {
     "encrypted_value": "base64_encoded_encrypted_data",
     "key_id": "public_key_id"
   }
   ```

## 📝 Потрібні дані

### Вже є:
- ✅ GitHub Token: `YOUR_GITHUB_TOKEN` (установите свой токен)
- ✅ Account ID: `ad170d773e79a037e28f4530fd5305a5`
- ✅ Repository: `PlevanDM/nexx-webapp`

### Потрібно отримати:
- ⏳ **Cloudflare API Token** (не Global Key!)
  - Створіть тут: https://dash.cloudflare.com/profile/api-tokens
  - Права: Account → Cloudflare Pages → Edit

## ✅ Після налаштування

Після встановлення secrets:
1. GitHub Actions автоматично деплоїть при push на `main`
2. Workflow "Deploy to Cloudflare Pages" буде виконуватися автоматично
3. Перевірити можна тут: https://github.com/PlevanDM/nexx-webapp/actions

## 🛠️ Доступні скрипти

- `setup-github-secrets.ps1` - Встановлення secrets через API
- `test-github-secrets-api.ps1` - Тестування API доступу
- `test-github-token.ps1` - Перевірка GitHub токену
