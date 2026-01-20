# 📊 NEXX GSM - Database Structure

## 🎯 **Централизованная база данных**

Все компоненты сайта теперь используют **единую базу данных** через модуль `database.js`.

---

## 📁 **Файловая структура:**

```
public/data/
├── master-db.json              ← Главная база (конфигурация, цены, бренды)
├── devices.json                ← Детальная база устройств (7000+ записей)
├── ukraine_prices.json         ← Цены на запчасти (опционально)
├── error_codes.json            ← Коды ошибок (для NEXX Database)
├── ic_compatibility.json       ← Совместимость микросхем
├── repair_knowledge.json       ← База знаний по ремонту
└── archive/                    ← Архивные файлы
```

---

## 🔧 **Использование в коде:**

### **1. Загрузка базы данных:**

```javascript
// База загружается автоматически при загрузке страницы
// Или можно загрузить вручную:
await window.NEXXDatabase.loadAll();
```

### **2. Получение брендов:**

```javascript
// Для телефонов
const phoneBrands = window.NEXXDatabase.getBrands('phone');
// → [{ id: 'apple', name: 'Apple', models: ['iPhone'], icon: 'fa-apple' }, ...]

// Для ноутбуков
const laptopBrands = window.NEXXDatabase.getBrands('laptop');
```

### **3. Получение устройств:**

```javascript
// Все iPhone
const iphones = window.NEXXDatabase.getDevicesByBrand('iPhone');

// Поиск устройства
const results = window.NEXXDatabase.searchDevice('iPhone 15 Pro');

// Популярные устройства
const popular = window.NEXXDatabase.getPopularDevices(10);
```

### **4. Получение цен:**

```javascript
// Цена замены батареи для iPhone
const price = window.NEXXDatabase.getPrice('iPhone', 'battery');
// → { min: 60, max: 150, currency: 'lei', time: '30-60 min' }
```

### **5. Информация об услугах:**

```javascript
// Информация о диагностике
const diagnostic = window.NEXXDatabase.getServiceInfo('diagnostic');
// → { icon: 'fa-microscope', price: 0, free: true, duration: {...} }
```

### **6. Контакты и SEO:**

```javascript
const contact = window.NEXXDatabase.getContact();
const seo = window.NEXXDatabase.getSEO();
```

### **7. Подписка на загрузку:**

```javascript
window.NEXXDatabase.subscribe((db) => {
  console.log('Database loaded!', db.devices.length, 'devices');
  // Обновить UI
});
```

---

## 🔄 **Компоненты использующие базу:**

### **Текущие:**
- ✅ `price-calculator.js` - Использует `devices.json` напрямую
- ✅ `index.html` (booking form) - Использует статический список
- ✅ `nexx.html` (NEXX Database) - Использует все базы

### **После миграции:**
- ✅ Калькулятор → `NEXXDatabase.getDevicesByBrand()` + `NEXXDatabase.getPrice()`
- ✅ Форма бронирования → `NEXXDatabase.getBrands()` для dropdown
- ✅ NEXX Database → `NEXXDatabase.searchDevice()` для поиска

---

## 📦 **Структура master-db.json:**

```json
{
  "version": "1.0.0",
  "config": {
    "currency": "lei",
    "supportedLanguages": ["ro", "uk", "en"],
    "remonlineEnabled": false
  },
  "devices": {
    "source": "/data/devices.json"
  },
  "prices": {
    "commonRepairs": {
      "battery": { "iPhone": { "min": 60, "max": 150 } },
      "display": { "iPhone": { "min": 100, "max": 400 } },
      "board": { "iPhone": { "min": 150, "max": 400 } }
    }
  },
  "brands": {
    "phone": [...],
    "laptop": [...],
    "tablet": [...],
    "watch": [...],
    "audio": [...]
  },
  "services": {
    "battery": { "icon": "fa-battery-full", "duration": {...} },
    "display": { "icon": "fa-tv", "duration": {...} }
  },
  "contact": {
    "phone": "+40 721 234 567",
    "email": "info@nexx.ro",
    "address": {...}
  }
}
```

---

## 🚀 **Преимущества централизации:**

✅ **Единая точка правды** - одна база для всего сайта  
✅ **Легкое обновление** - изменили в одном месте → обновилось везде  
✅ **Кэширование** - данные загружаются один раз  
✅ **Типизация** - четкая структура данных  
✅ **Масштабируемость** - легко добавить новые устройства/услуги  
✅ **Интеграция с Remonline** - готово к подключению API  

---

## 🔄 **Миграция существующих компонентов:**

### **До (разрозненные базы):**
```javascript
// price-calculator.js
const devices = await fetch('/data/devices.json');

// index.html
const prices = { iPhone: 100, Samsung: 90 }; // Hardcoded

// nexx.html
const ukrainePrices = await fetch('/data/ukraine_prices.json');
```

### **После (единая база):**
```javascript
// Все компоненты
const db = window.NEXXDatabase;
await db.loadAll();

const iphones = db.getDevicesByBrand('iPhone');
const price = db.getPrice('iPhone', 'battery');
```

---

## 📝 **TODO: Миграция**

- [ ] Обновить `price-calculator.js` для использования `NEXXDatabase`
- [ ] Обновить booking form для динамической загрузки брендов
- [ ] Подключить Remonline API через `NEXXDatabase`
- [ ] Добавить кэширование в localStorage
- [ ] Создать админ-панель для управления базой

---

**Last updated:** 2026-01-20  
**Status:** ✅ Централизованная база готова
