# 🚀 NEXX Service Center v9.5.0

> Професійний веб-додаток для сервісного центру з ремонту Apple техніки

[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-purple)](https://vitejs.dev/)
[![Hono](https://img.shields.io/badge/Hono-4.11-orange)](https://hono.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📋 Про проект

**NEXX** - це комплексне рішення для сервісного центру Apple, що включає:

### 🏠 Клієнтський лендінг
- Простий і зрозумілий інтерфейс для клієнтів
- Інформація про послуги та ціни
- Форма онлайн-замовлення
- Контакти та години роботи

### 🔧 База знань для майстрів
- 134 моделі Apple пристроїв
- 167 кодів помилок (iTunes + Mac)
- 115+ IC компонентів з діагностикою
- 9 детальних гайдів по ремонту
- 12 профілів діодних вимірювань

---

## ✨ Основні можливості

### Для клієнтів:
- ✅ Перегляд послуг та цін
- ✅ Онлайн-замовлення ремонту
- ✅ Контактна інформація
- ✅ Швидкі дії (дзвінок, месенджери)

### Для майстрів:
- ✅ База 134 пристроїв з технічними характеристиками
- ✅ Пошук по моделі, процесору, board number
- ✅ Фільтри за категорією та роком
- ✅ IC compatibility база
- ✅ Коди помилок з рішеннями
- ✅ Гайди по ремонту (USB-C, M4/M5, батареї)
- ✅ Діодні вимірювання
- ✅ AI Self-Healing система

---

## 🛠️ Технології

### Frontend
- **React 19.2.3** - UI library
- **Tailwind CSS** - Utility-first styling
- **Font Awesome 6.5** - Icons

### Backend
- **Hono 4.11** - Web framework для Cloudflare
- **Vite 7.3.1** - Build tool
- **TypeScript** - Type safety

### Hosting
- **Cloudflare Pages** - Edge deployment
- **Wrangler 4.59** - CLI tool

---

## 🚀 Швидкий старт

### Встановлення

```bash
# Clone repository
git clone https://github.com/PlevanDM/nexx-webapp.git
cd nexx-webapp

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Homepage: http://localhost:5173/
# Database: http://localhost:5173/nexx.html (PIN: 31618585)
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Cloudflare Pages
npm run deploy
```

---

## 📁 Структура проекту

```
nexx-webapp/
├── index.html              # Клієнтський лендінг
├── public/
│   ├── nexx.html          # База знань (з PIN)
│   ├── static/
│   │   ├── ui-components.js       # UI library
│   │   ├── navigation-system.js   # Navigation system
│   │   ├── app.js                 # NEXX Database app (124KB)
│   │   └── ...
│   ├── data/
│   │   ├── devices.json           # 134 пристрої
│   │   ├── ic_compatibility.json  # 115+ IC
│   │   ├── error_codes.json       # 167 кодів
│   │   └── ...
│   ├── images/            # 7 images
│   ├── robots.txt         # SEO
│   └── sitemap.xml        # SEO
├── src/
│   ├── index.tsx          # Hono API server
│   ├── App.tsx            # Main React app
│   ├── client.tsx         # Client entry
│   └── components/        # 32 React components
├── lib/
│   ├── design-system.ts   # Complete design tokens
│   ├── site-config.ts     # Site configuration
│   └── types.ts           # TypeScript types
└── scripts/               # Utility scripts
    ├── enhance_database_2026.cjs
    ├── fix_missing_data.cjs
    ├── copy-assets.cjs
    └── show_stats.cjs
```

---

## 🎨 Design System

### Unified Components
- **Button** - 6 variants, 4 sizes
- **Modal** - с escape handling
- **Card** - hover effects
- **Badge** - 6 colors
- **Header** - responsive + mobile menu
- **Footer** - 3 columns
- **Breadcrumbs** - navigation trail
- **QuickActions** - floating widget
- **SearchBar** - global search (Ctrl+K)

### Color Palette
- Primary: Blue (#2563eb)
- Secondary: Purple (#8b5cf6)
- Success: Green (#22c55e)
- Danger: Red (#ef4444)

### Icons
40+ категорій уніфікованих іконок (Font Awesome 6.5)

---

## 🔐 Безпека

### Захист бази даних
- PIN-код: `31618585`
- localStorage auth
- Тільки для авторизованих майстрів

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- CORS configured

---

## 📊 База даних

### Статистика
```
Devices:          134 (100% complete)
  - iPhone:       44 моделей
  - iPad:         34 моделі
  - MacBook:      56 моделей

IC Components:    26 категорій, 115+ chips
Error Codes:      167 (81 iTunes + 86 Mac)
Knowledge Base:   9 comprehensive guides
Measurements:     12 device profiles
```

### Нові пристрої 2026
- iPhone 17 / 17 Pro / 17 Pro Max
- MacBook Air M4 (13" & 15")
- MacBook Pro M5 (14" & 16")
- iPad Pro M4 (11" & 13")
- iPad Air M3 (11" & 13")

---

## 🌐 URLs

### Development
- Homepage: `http://localhost:5173/`
- Database: `http://localhost:5173/nexx.html`

### Production
- Live site: `https://nexx.com.ua/`
- Database: `https://nexx.com.ua/nexx` (PIN: 31618585)

---

## 🎯 Команди

```bash
# Development
npm run dev              # Vite dev server (port 5173)

# Build
npm run build            # Production build
npm run clean            # Clean dist/

# Deploy
npm run deploy           # Deploy to Cloudflare Pages

# Utilities
npm run validate         # Validate database
npm run type-check       # TypeScript check
```

---

## 📈 Performance

### Metrics
- Build time: ~2.5s
- Client bundle: 275KB (78KB gzipped)
- Server bundle: 40KB
- Total assets: ~2MB (optimized)

### Optimizations
- ✅ JavaScript minification
- ✅ Image optimization
- ✅ JSON cleanup (-77%)
- ✅ HTTP caching
- ✅ CDN delivery
- ✅ Lazy loading

---

## 🔄 Навігаційна система

### Клієнтська навігація
- Головна
- Послуги
- Замовити
- Контакти

### Сервісна навігація
- Головна
- Послуги
- **База даних** (тільки для майстрів)
- Контакти

### Додаткові features
- Breadcrumbs (хлібні крихти)
- Quick Actions (швидкі дії)
- Back button (кнопка назад)
- Global Search (Ctrl+K)
- Mobile menu

---

## 🤝 Contributing

Проект розробляється та підтримується командою NEXX.

---

## 📝 License

MIT License © 2026 NEXX Service Center

---

## 👨‍💻 Автор

**Dmitry** - Service Center Manager & Developer

---

**Built with ❤️ using React + Hono + Cloudflare Pages**
