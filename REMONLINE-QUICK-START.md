# NEXX Remonline Forms - Quick Start Guide

## 🚀 Быстрый Старт (Quick Start)

### 1. Использование унифицированной формы

```typescript
import { UnifiedRemonlineForm } from '@/components/UnifiedRemonlineForm';
import { useState } from 'react';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Замовити ремонт</button>
      
      <UnifiedRemonlineForm
        formType="repair_order"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={async (data) => {
          const res = await fetch('/api/remonline', {
            method: 'POST',
            body: JSON.stringify({ formType: 'repair_order', ...data })
          });
          return res.json();
        }}
      />
    </>
  );
}
```

### 2. Переводи автоматически переключаются

Все тексты в формах автоматически переключаются с `window.i18n`:

```javascript
// Язык меняется автоматически через языковой переключатель
window.i18n.setLanguage('uk');  // Українська
window.i18n.setLanguage('ru');  // Русский
window.i18n.setLanguage('en');  // English
window.i18n.setLanguage('ro');  // Română
```

### 3. Типи форм

```typescript
// Repair Order - Заказ ремонта
<UnifiedRemonlineForm formType="repair_order" ... />

// Callback - Запит на передзвін
<UnifiedRemonlineForm formType="callback" ... />

// Diagnostic - Діагностика
<UnifiedRemonlineForm formType="diagnostic" ... />

// Document - Запит на документ
<UnifiedRemonlineForm formType="document" ... />
```

---

## 📋 Структура Форм

### Repair Order (Заказ ремонта)
Поля:
- Ім'я клієнта *
- Телефон *
- Email (опціонально)
- Тип пристрою *
- Марка
- Модель
- Серійний номер
- Опис проблеми *
- Деталі (опціонально)

### Callback (Передзвін)
Поля:
- Ім'я *
- Телефон *
- Тип пристрою
- Опис проблеми
- Бажаний час дзвінка
- Дозволити AI подзвонити (чекбокс)

### Diagnostic (Діагностика)
Поля:
- Тип пристрою *
- Марка
- Модель
- Результати діагностики *
- Статус (working/defective/needs_repair)
- Орієнтовна вартість ремонту

### Document (Документ)
Поля:
- ID Замовлення *
- Тип документа *
- Ім'я *
- Email *
- Адреса доставки
- Включити повні деталі (чекбокс)

---

## 📄 Документи

### Підтримувані типи:
1. **Invoice** (Рахунок) - Фінансовий документ
2. **Act** (Акт ремонту) - Запис про проведені роботи
3. **Contract** (Договір) - Умови обслуговування
4. **Estimate** (Кошторис) - Смета вартості
5. **Receipt** (Квитанція) - Підтвердження оплати
6. **Warranty** (Гарантія) - Гарантійний талон

### Формати експорту:
- **PDF** (за замовчуванням)
- **HTML** (для веб-перегляду)
- **DOCX** (для редагування в Word)

### Приклад:
```typescript
import { DocumentTemplates } from '@/components/DocumentTemplates';

<DocumentTemplates
  document={orderData}
  onGenerate={async (docType, format) => {
    // Відправити на сервер для генерації
    const res = await fetch('/api/remonline/documents/generate', {
      method: 'POST',
      body: JSON.stringify({ documentType: docType, format, orderId: '123' })
    });
    return res.json();
  }}
/>
```

---

## 🌍 Мови

Всі формы доступні на 4 мовах:

| Мова | Код | Флаг |
|------|-----|------|
| Українська | `uk` | 🇺🇦 |
| Русский | `ru` | 🇷🇺 |
| English | `en` | 🇬🇧 |
| Română | `ro` | 🇷🇴 |

Переходи автоматично коли користувач змінює мову через `LanguageSwitcher`.

---

## 🛠️ Розширене Використання

### Custom API Endpoint

```typescript
const handleSubmit = async (data) => {
  const response = await fetch('https://your-api.com/forms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN'
    },
    body: JSON.stringify({
      formType: 'repair_order',
      ...data
    })
  });
  return response.json();
};
```

### Dark Mode

```typescript
<UnifiedRemonlineForm
  formType="repair_order"
  isOpen={true}
  onClose={() => {}}
  theme="dark"  // or "light" (default)
/>
```

### Custom Styling

```typescript
<UnifiedRemonlineForm
  formType="repair_order"
  isOpen={true}
  onClose={() => {}}
  className="custom-form-class"
/>
```

### Передача Order ID (для документів)

```typescript
<UnifiedRemonlineForm
  formType="document"
  isOpen={true}
  onClose={() => {}}
  orderId="ORD-12345"  // Pre-fill order ID
/>
```

---

## 📡 API Endpoints

### POST /api/remonline

```bash
# Repair Order
curl -X POST /api/remonline \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "repair_order",
    "customerName": "Іван",
    "customerPhone": "+380671234567",
    "device": {"type": "iphone", "model": "iPhone 15"},
    "problem": "Розбитий екран",
    "language": "uk"
  }'

# Callback
curl -X POST /api/remonline \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "callback",
    "customerName": "Іван",
    "customerPhone": "+380671234567",
    "aiCallEnabled": true,
    "language": "uk"
  }'
```

### Response

```json
{
  "success": true,
  "id": "REP-123456",
  "message": "Замовлення успішно створено",
  "data": { ... }
}
```

---

## ✅ Валідація

Формы автоматично валідують:
- Обов'язкові поля (*)
- Формат телефону
- Формат email
- Мінімальна довжина імені (2 символи)
- Специфічні поля для кожної форми

Помилки показуються червоною підсвіткою з описом.

---

## 🎨 Теми (Themes)

### Light Theme (за замовчуванням)
```typescript
<UnifiedRemonlineForm theme="light" ... />
```

### Dark Theme
```typescript
<UnifiedRemonlineForm theme="dark" ... />
```

Обидві теми підтримують:
- Full responsiveness
- Accessibility (WCAG)
- Print-friendly styling
- Mobile optimization

---

## 📱 Mobile Friendly

Усі форми автоматично адаптуються до мобільних пристроїв:
- Stack forms на мобілі (1 column)
- Grid на планшеті (2 columns)
- Full grid на десктопі (до 3 columns)
- Touch-friendly buttons
- Mobile-optimized inputs

---

## 🔗 Інтеграція з Remonline CRM

### Конфігурація (Cloudflare Workers)

```wrangler.toml
[env.production]
vars = { ... }
env_variables = [
  { binding = "REMONLINE_API_KEY", value = "your-api-key" },
  { binding = "REMONLINE_BASE_URL", value = "https://api.remonline.app" },
  { binding = "REMONLINE_BRANCH_ID", value = "your-branch-id" }
]
```

### Дані передаються в Remonline:
- ✅ Repair Orders → Orders API
- ✅ Callbacks → Callbacks API
- ✅ Diagnostics → Diagnostics API
- ✅ Documents → Documents API
- ✅ Legacy Inquiries → Inquiries API (fallback)

---

## 🐛 Відладка

### Check API Connection
```javascript
// In browser console
const res = await fetch('/api/remonline?action=ping');
console.log(res.status); // Should be 200 or 500 with error
```

### Check Translations
```javascript
// In browser console
console.log(window.i18n.getCurrentLanguage());
console.log(window.i18n.getCurrentTranslations().forms);
```

### Check Form Data
```javascript
// Before submission
console.log(formData); // Inspect form structure
console.log(JSON.stringify(formData, null, 2)); // Pretty print
```

---

## 📚 Повна Документація

Детальна документація доступна в:
- [`REMONLINE-FORMS-GUIDE.md`](./REMONLINE-FORMS-GUIDE.md) - Complete guide
- [`src/components/REMONLINE-EXAMPLES.tsx`](./src/components/REMONLINE-EXAMPLES.tsx) - Code examples
- [`lib/types.ts`](./lib/types.ts) - Type definitions

---

## 🎯 Контрольний список впровадження

- [x] ✅ Компоненти створені
- [x] ✅ Переводи підготовлені (UA/RU/EN/RO)
- [x] ✅ API обробники оновлені
- [x] ✅ Types визначені
- [x] ✅ Примери готові
- [x] ✅ Документація завершена

### Наступні кроки:
- [ ] Розгорнути на production
- [ ] Тестувати на всіх пристроях
- [ ] Налаштувати Remonline webhook
- [ ] Включити email notifications
- [ ] Налаштувати AI callback system

---

## 🆘 Support

При проблемах:
1. Перевірте Browser Console (F12) на помилки
2. Перевірте Network Tab на API responses
3. Подивіться на [examples file](./src/components/REMONLINE-EXAMPLES.tsx)
4. Читайте [full guide](./REMONLINE-FORMS-GUIDE.md)

---

**Версія:** 1.0.0  
**Статус:** ✅ Ready for Production  
**Дата:** 23 січня 2026
