# Инструменты сайта и файлы обновлений

**Назначение**: единая схема — какая функция сайта откуда берёт данные и **какой файл обновлять** при изменениях.  
**Обновлено**: 2026-01-31

---

## Как пользоваться

- Добавляешь/меняешь функцию сайта → смотри таблицу ниже: **Данные** и **Скрипт обновления**.
- Меняешь логику отображения → смотри **Компонент**.
- После обновления данных: пересобрать (`npm run build`) и задеплоить; при необходимости обновить версию в `index.html` для сброса кэша.

---

## Таблица: функция → данные → что обновлять

| Функция сайта | Данные (файл/источник) | Скрипт обновления | Компонент / где в коде |
|---------------|------------------------|-------------------|-------------------------|
| **Прайс Украина** (обмен, запчасти по моделям) | `public/data/apple-exchange-ua.json` | `npm run import:exchange-ua` (читает `data/exchange-ua/*.xlsx`) | `src/components/ExchangePriceListModal.tsx`, `src/App.tsx` (кнопка Прайс Украина), `src/api.ts` (загрузка JSON) |
| Пример Excel для Прайс UA | `data/exchange-ua/sample-exchange-ua.xlsx` | `npm run sample:exchange-ua` | — |
| **База моделей / устройств** | `public/data/master-db.json` (devices, и др.) | `scripts/fill-model-numbers.cjs`, `scripts/apply-audit-ic.cjs`, прочие в `scripts/` | `src/App.tsx`, `src/components/DeviceList.tsx`, `DeviceDetailModal`, загрузка через `src/api.ts` |
| **IC (микросхемы)** | `public/data/master-db.json` (ics) | `scripts/apply-audit-ic.cjs`, `scripts/expand_ic_*.cjs` | `src/components/ICList.tsx`, `ICDetailModal`, `src/api.ts` |
| **Ошибки (коды)** | `public/data/master-db.json` (errors) | Скрипты в `scripts/` (collect_error_codes.py и др.) | `src/components/ErrorCodes.tsx`, `src/api.ts` |
| **Прайс-лист** (все цены) | `public/data/master-db.json` (prices) | Импорт/скрипты цен в `scripts/` (import-sheets, normalize_prices и др.) | `src/components/PriceTable.tsx`, `src/api.ts` |
| **Услуги / сервисные цены** | `public/data/master-db.json` (services), при необходимости отдельные JSON | По необходимости скрипты в `scripts/` | `src/components/ServicePriceList.tsx`, `src/api.ts` |
| **MacBook платы** | `public/data/master-db.json` (mac_boards) | Скрипты обновления плат в `scripts/` | `src/components/MacBoardList.tsx`, `src/api.ts` |
| **Калькулятор ремонта** | officialPrices + `exchangePrices` (тот же apple-exchange-ua + master-db) | Прайс Украина: `npm run import:exchange-ua`; остальное: master-db | `src/components/RepairCalculator.tsx`, `src/App.tsx` |
| **База знаний / гайды** | `public/data/master-db.json` (guides) | Скрипты в `scripts/` | Соответствующий список в `src/App.tsx` |
| **DFU / комбинации клавиш** | `public/data/master-db.json` (key_combinations) | Скрипты в `scripts/` | `src/components/KeyCombinations.tsx`, `src/api.ts` |

---

## Правила для разработки и AI

1. **Новая функция с данными**  
   - Добавить строку в таблицу выше: функция, файл данных, скрипт обновления, компонент.  
   - Обновить этот файл (`SITE-TOOLS-AND-UPDATES.md`) в том же коммите.

2. **Изменение источника данных**  
   - Поменять в таблице столбцы **Данные** и/или **Скрипт обновления**.  
   - При добавлении нового JSON/Excel — описать путь и команду (как для Прайс UA).

3. **Обновления после правок данных**  
   - Запустить соответствующий скрипт (например `npm run import:exchange-ua`).  
   - Пересобрать: `npm run build`.  
   - Деплой: `npm run deploy`.  
   - При изменении статики — при необходимости обновить версию в `index.html` для сброса кэша.

4. **Прайс Украина как образец**  
   - Модалка с выбором продукта/модели, таблица запчастей (склад, обмен, полная цена), загрузка Excel в браузере и через скрипт — считать эталонным инструментом.  
   - Аналогичные инструменты (выбор модели → список позиций → обновление из файла) документировать по той же схеме: данные → скрипт → компонент.

---

## Связанные документы

- **Индекс документации**: [DOCUMENTATION-INDEX.md](./DOCUMENTATION-INDEX.md)  
- **База / аудит моделей и IC**: раздел "Database & Audit" в [DOCUMENTATION-INDEX.md](./DOCUMENTATION-INDEX.md), `docs-archive/AUDIT-REPORT-*.md`  
- **Прайс UA (импорт Excel)**: `data/exchange-ua/README.md`  
- **Правила и деплой**: `.cursor/rules`

---

*При любых изменениях функций сайта или источников данных — обновлять этот файл (таблицу и при необходимости раздел «Правила»).*
