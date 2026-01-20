# 🚀 NEXX GSM - ДЕПЛОЙ НА nexxgsm.com

**Дата:** 2026-01-20  
**Статус:** ✅ ВСЕ ГОТОВО К ПУБЛИКАЦИИ

---

## 📦 **ЧТО ГОТОВО:**

✅ Production build: **dist/** папка (275 KB gzipped)  
✅ Database: 134 устройства + 4846 цен  
✅ Переводы: 3 языка (румынский, украинский, английский)  
✅ Страницы: index, nexx, faq, about, privacy, terms  
✅ API endpoints: booking, remonline  
✅ Калькулятор: работает с реальными ценами  
✅ Формы: отправка настроена  

---

## 🔑 **CLOUDFLARE CREDENTIALS:**

**Account ID:** `ad170d773e79a037e28f4530fd5305a5`  
**API Token:** `9825f62db74c0feb99167b3aa66e746295aa9`  
**Domain:** `nexxgsm.com`

---

## 📝 **ПОШАГОВАЯ ИНСТРУКЦИЯ ДЕПЛОЯ:**

### **Метод 1: Wrangler CLI (РЕКОМЕНДУЕТСЯ)**

```powershell
# Шаг 1: Установить Wrangler (если нет)
npm install -g wrangler

# Шаг 2: Авторизоваться
wrangler login

# Шаг 3: Деплой
wrangler pages deploy dist --project-name=nexxgsm

# Шаг 4: Настроить домен
# В Cloudflare Dashboard → Pages → nexxgsm → Custom domains
# Добавить: nexxgsm.com
```

### **Метод 2: Cloudflare Dashboard (РУЧНОЙ)**

```
1. Откройте: https://dash.cloudflare.com/ad170d773e79a037e28f4530fd5305a5

2. Pages → Create a project → Upload assets

3. Название проекта: nexxgsm

4. Загрузите папку: C:\NEXX_APP\dist

5. Custom domains → Add: nexxgsm.com

6. Done! Сайт будет доступен через 2-3 минуты
```

### **Метод 3: Git + Cloudflare Auto-Deploy**

```bash
# Если используете Git:
git init
git add .
git commit -m "Initial deployment"
git push origin main

# В Cloudflare Pages → Connect Git repository
# Build command: npm run build && npm run postbuild
# Output directory: dist
```

---

## ⚙️ **ПОСЛЕ ДЕПЛОЯ - Настройки:**

### **1. Environment Variables** (Cloudflare Dashboard)

```
Pages → nexxgsm → Settings → Environment Variables

Добавьте:

# Remonline API (когда уточните Base URL)
REMONLINE_API_KEY = 49b16db2d181c5a486a181769e2c82d9
REMONLINE_BASE_URL = https://api.remonline.app (УТОЧНИТЬ!)
REMONLINE_BRANCH_ID = 1 (УТОЧНИТЬ!)

# Email уведомления (опционально)
EMAIL_API_KEY = your_sendgrid_or_mailgun_key
EMAIL_FROM = noreply@nexxgsm.com
EMAIL_TO = info@nexx.ro

# Telegram уведомления (опционально)
TELEGRAM_BOT_TOKEN = your_bot_token
TELEGRAM_CHAT_ID = your_chat_id
```

### **2. Custom Domain DNS**

Cloudflare автоматически настроит DNS если домен уже в Cloudflare.

Если домен в другом регистраторе:
```
Добавьте CNAME запись:
nexxgsm.com → nexxgsm.pages.dev
```

---

## 📸 **НЕ ЗАБУДЬТЕ:**

**Перед деплоем сохраните 4 фотографии:**

```
C:\NEXX_APP\public\static\images\

1. store-front.jpg - Фото фасада
2. tools-setup.jpg - Инструменты  
3. battery-repair-process.jpg - Батарея
4. screen-repair-process.jpg - Экран
```

**Затем пересоберите:**
```bash
npm run build
```

---

## ✅ **ПРОВЕРКА ПОСЛЕ ДЕПЛОЯ:**

Откройте https://nexxgsm.com и проверьте:

- [ ] Главная страница загружается
- [ ] Переключение языков работает (RO / UK / EN)
- [ ] Навигация работает
- [ ] Калькулятор показывает цены
- [ ] Форма бронирования отправляется
- [ ] FAQ страница открывается
- [ ] About страница открывается
- [ ] NEXX Database работает (nexxgsm.com/nexx.html)
- [ ] Фотографии отображаются
- [ ] Mobile версия корректна

---

## 📞 **ПОДДЕРЖКА:**

**Если что-то не работает:**
1. Проверьте Cloudflare → Analytics → Errors
2. Проверьте Environment Variables
3. Проверьте DNS propagation (может занять до 24 часов)

---

## 🎯 **КОМАНДЫ ДЛЯ ЗАПУСКА:**

```powershell
# ВАРИАНТ A: Автоматический деплой
.\deploy.ps1

# ВАРИАНТ B: Wrangler CLI
wrangler pages deploy dist --project-name=nexxgsm

# ВАРИАНТ C: Ручная загрузка
# Откройте https://dash.cloudflare.com/ad170d773e79a037e28f4530fd5305a5/pages
# Upload → Выберите dist/ папку
```

---

**ГОТОВО! ЗАПУСКАЙТЕ ДЕПЛОЙ!** 🚀🎉
