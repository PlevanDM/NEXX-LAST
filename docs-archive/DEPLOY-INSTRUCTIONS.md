# NEXX GSM - Инструкция по деплою

## 1. Создание API Token в Cloudflare

1. Перейдите: https://dash.cloudflare.com/profile/api-tokens
2. Нажмите **Create Token**
3. Используйте шаблон **Edit Cloudflare Workers** или создайте custom:
   - **Permissions:**
     - Account > Cloudflare Pages > Edit
     - Account > Account Settings > Read
   - **Account Resources:** Include > Your Account
4. Скопируйте токен (показывается только один раз!)

## 2. Первый деплой (локально)

```powershell
# Логин в Cloudflare
npx wrangler login

# Сборка и деплой
npm run deploy
```

После первого деплоя сайт будет доступен по адресу:
**https://nexx-gsm.pages.dev**

## 3. Настройка Custom Domain (nexxgsm.com)

1. Перейдите: https://dash.cloudflare.com > Pages > nexx-gsm
2. **Custom domains** > Add custom domain
3. Введите: `nexxgsm.com`
4. Cloudflare автоматически настроит DNS

## 4. Настройка Environment Variables (API ключи)

1. Перейдите: Pages > nexx-gsm > Settings > Environment variables
2. Добавьте переменные (Production):

| Variable | Description |
|----------|-------------|
| `REMONLINE_API_KEY` | API ключ Remonline |
| `REMONLINE_BASE_URL` | `https://api.remonline.app` |
| `REMONLINE_BRANCH_ID` | ID филиала |
| `REMONLINE_ORDER_TYPE` | Тип заказа |
| `VAPI_API_KEY` | Vapi AI ключ |
| `VAPI_PHONE_ID` | ID телефона Vapi |
| `VAPI_ASSISTANT_ID` | ID ассистента Vapi |
| `EMAIL_API_KEY` | Mailgun API ключ |
| `TELEGRAM_BOT_TOKEN` | Токен Telegram бота |
| `TELEGRAM_CHAT_ID` | ID чата для уведомлений |

## 5. GitHub Actions (автодеплой)

Добавьте secrets в репозиторий:
https://github.com/PlevanDM/nexx-webapp/settings/secrets/actions

- `CLOUDFLARE_API_TOKEN` - токен из шага 1
- `CLOUDFLARE_ACCOUNT_ID` - `ad170d773e79a037e28f4530fd5305a5`

Теперь каждый push в main будет автоматически деплоить сайт.

## Команды

```powershell
# Разработка
npm run dev              # Локальный сервер
npm run dev:sandbox      # Cloudflare sandbox

# Деплой
npm run deploy           # Сборка + деплой
npm run deploy:prod      # Деплой в production

# Проверки
npm run validate         # Валидация базы данных
npm run check            # TypeScript + валидация
```

## URLs после деплоя

- **Pages URL:** https://nexx-gsm.pages.dev
- **Custom domain:** https://nexxgsm.com (после настройки)
- **API endpoints:**
  - `/api/callback` - Обратный звонок
  - `/api/booking` - Бронирование
  - `/api/remonline` - Remonline proxy
  - `/api/ai-assistant` - AI помощник
  - `/api/price-estimate` - Оценка цены
