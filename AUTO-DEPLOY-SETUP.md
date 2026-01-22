# 🚀 Автоматичний деплой через GitHub Actions

## Налаштування (один раз)

### 1. Створити API Token в Cloudflare

1. Перейдіть: https://dash.cloudflare.com/profile/api-tokens
2. Натисніть **"Create Token"**
3. Використайте шаблон **"Edit Cloudflare Workers"** або створіть Custom token:
   - **Account** → **Cloudflare Pages** → **Edit**
   - **Account** → **Workers Scripts** → **Edit**
4. Скопіюйте токен

### 2. Додати Secrets в GitHub

1. Перейдіть: https://github.com/PlevanDM/nexx-webapp/settings/secrets/actions
2. Додайте наступні secrets:
   - `CLOUDFLARE_API_TOKEN` - ваш API Token з Cloudflare
   - `CLOUDFLARE_ACCOUNT_ID` - ваш Account ID (ad170d773e79a037e28f4530fd5305a5)

### 3. Закомітити workflow файл

```powershell
git add .github/workflows/deploy-cloudflare.yml
git commit -m "Add automatic Cloudflare Pages deployment"
git push origin main
```

## Як працює

Після налаштування:
- Кожен push на `main` автоматично деплоїть на Cloudflare Pages
- Деплой відбувається в GitHub Actions (без ручного втручання)
- Статус деплою видно в GitHub → Actions

## Переваги

✅ Повністю автоматичний
✅ Не потребує ручного втручання
✅ Працює з будь-якого комп'ютера
✅ Історія деплоїв в GitHub

## Поточний статус

- ✅ Workflow файл створено: `.github/workflows/deploy-cloudflare.yml`
- ⏳ Потрібно додати secrets в GitHub
- ⏳ Потрібно закомітити workflow файл

## Альтернатива (якщо не хочете GitHub Actions)

Використайте скрипт `deploy-wrangler-auto.ps1` після ручного `wrangler login`:

```powershell
# Один раз (відкриє браузер)
wrangler login

# Потім завжди
.\deploy-wrangler-auto.ps1
```
