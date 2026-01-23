# Імпорт цін у lei з Google Sheets

Ціни в **lei (RON)** з вкладок **\*_price** (наприклад `iPhone_price`, `iPad_price`, `Mac_price`, `Watch_price`) з [прайс-листу](https://docs.google.com/spreadsheets/d/1AuaES9Yk279ruMQQ_bubzPVBv08wIOaB/edit) імпортуються в `master-db.json` → `service_prices_ron`.

## Кроки

### 1. Експорт CSV з Google Sheets

- Відкрийте таблицю.
- Для кожної вкладки з назвою **\*_price** (наприклад `iPhone_price`, `iPad_price`):
  - Виберіть цю вкладку.
  - **File → Download → Comma Separated Values (.csv)**
  - Збережіть як `iPhone_price.csv`, `iPad_price.csv` тощо.

### 2. Розмістіть файли

Скопіюйте CSV у папку:

```
data/sheets-export/
├── iPhone_price.csv
├── iPad_price.csv
├── Mac_price.csv
├── Watch_price.csv
└── README.md   (цей файл)
```

### 3. Формат CSV

- **Перша колонка** (або колонка з заголовком Model / Modelul / Модель): назва моделі, як у базі (наприклад `iPhone 16 Pro Max`, `MacBook Pro 14" (M3)`).
- **Інші колонки**: ціни в **lei** (тільки числа). Заголовки мапляться на типи ремонту:

| Заголовок (RO/EN) | Ключ |
|-------------------|------|
| Baterie, Battery | battery |
| Display, Ecran, Screen | display |
| Încărcare, Charging, Port | charging_port |
| Cameră, Camera | rear_camera |
| Front camera, Cameră față | front_camera |
| Speaker, Difuzor | speaker |
| Taptic, Motor vibrații | taptic_engine |
| Placă, Logic board, Motherboard | logic_board |
| Tastatură, Keyboard | keyboard |

Приклад:

```csv
Model,battery,display,charging_port,rear_camera,logic_board
iPhone 16 Pro Max,450,1800,500,1100,2700
iPhone 15,400,1200,450,1000,2300
```

### 4. Запуск імпорту

```bash
node scripts/import-sheets-prices-lei.cjs
```

Скрипт оновить `public/data/master-db.json`: у кожного пристрою з’явиться (або оновиться) `service_prices_ron`. Калькулятор і `getDevicePrice` спочатку використовують **lei** з `service_prices_ron`, якщо їх немає — конвертацію з `official_service_prices` (USD → RON).

### 5. Перевірка

- Зробіть `npm run build` і перевірте калькулятор на сайті.
- Або локально: `npm run dev` → відкрити `/#calculator`, вибрати модель та тип ремонту.

---

**Посилання на таблицю:**  
https://docs.google.com/spreadsheets/d/1AuaES9Yk279ruMQQ_bubzPVBv08wIOaB/edit
