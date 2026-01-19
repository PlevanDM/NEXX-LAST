# NEXX Database v6.9.3

## Публичный URL
**https://3000-ityb8kprz6pu8mu25elee-5185f4aa.sandbox.novita.ai**

## Что нового в v6.9.3 (2026-01-19)

### 🆕 iPhone Air & iPhone 17 IC Database (2025/2026)
- **Apple C1X Modem** (APL1114/337S01030) - Apple's 2nd-gen 5G modem
- **Apple N1 WiFi chip** (339M00400) - WiFi 7, Bluetooth 6, Thread
- **Apple A19 Pro** (339S01839) и **A19** (339S01805) SoCs
- **Qualcomm X80** modem для iPhone 17 (non-Air)
- **Apple U2** UWB chip, **NXP SN300** NFC controller
- 6 RF Front-End Modules (Skyworks, Broadcom, Qorvo)

### 🖼️ Device Icons Database
- **126 устройств** с изображениями из iFixit, pngimg, icons8
- Автоматический fallback на emoji при ошибке загрузки
- Индикатор источника иконки на карточке

### 📊 IC Database Expansion
- **111 микросхем** в базе (+60 с v6.3)
- Новые категории: processor_ics, rf_fe_modules
- 16 категорий IC

## Актуальная статистика v6.9.3

| Метрика | Значение |
|---------|----------|
| Устройства | 126 |
| iPhone | 44 (включая iPhone Air, 17 серию) |
| iPad | 30 |
| MacBook | 52 |
| Микросхем IC | 111 |
| Device Icons | 126 |
| Региональные коды | 74 |
| Коды ошибок | 151 (67 iTunes + 84 Mac) |
| Артикулов | 4,846 |
| Logic Boards | 49 |

## IC Database (111 микросхем)

| Категория | Количество | Примеры |
|-----------|------------|---------|
| Charging ICs | 16 | 1614A1, 1616A0, SN2611, CP3200C1H3 |
| Power ICs | 19 | 338S01279, STPMIA3C, MAX20348P |
| Audio ICs | 11 | 338S00967, 338S01148 |
| Baseband ICs | 19 | C1X, X80, SDX71M |
| WiFi/BT ICs | 11 | N1, 339S01464 |
| Display ICs | 4 | TPS65658A0, MAX11390A |
| NFC ICs | 2 | 30V4E0, SN300 |
| Sensor ICs | 4 | BMI323, Bosch |
| Processor ICs | 2 | A19 Pro, A19 |
| RF FE Modules | 6 | AFEM-8254, SKY58452 |
| + Others | 17 | NAND, MacBook, Apple Watch |

## Новые устройства 2025

### iPhone Air
- **Толщина**: 5.6mm (самый тонкий iPhone)
- **Процессор**: Apple A19 Pro
- **Модем**: Apple C1X (собственная разработка Apple)
- **WiFi**: Apple N1 - WiFi 7, Bluetooth 6, Thread
- **Цвета**: Space Black, Cloud White, Light Gold, Sky Blue

### iPhone 17 Series
- **iPhone 17 Pro Max/Pro**: A19 Pro + Qualcomm X80
- **iPhone 17**: A19 + Qualcomm X80
- **ProMotion 120Hz** на базовом iPhone 17

## 7 панелей быстрого доступа

| Панель | Описание | Данные |
|--------|----------|--------|
| 💰 Цены | Каталог цен UA | 4,846 позиций |
| 🖥️ Платы | Logic Boards | M-series + Intel |
| 🔍 Артикулы | Поиск запчастей | С ценами UA/EU |
| 🚨 Ошибки | iTunes + Mac | 151 код |
| 🧮 Калькулятор | Расчёт ремонта | UA или EU |
| 📚 База знаний | Гайды | Tristar, Baseband, Touch IC |
| 🔌 Микросхемы | IC справочник | 111 микросхем |

## Источники данных

- **iFixit** - teardown, Chip ID, repair guides
- **Apple** - официальные спецификации
- **TechInsights** - chip analysis
- **repair.wiki** - community repair wiki
- **pngimg.com** - device icons (Creative Commons)
- **icons8.com** - device icons (with attribution)

## Технологии

- **Backend**: Hono на Cloudflare Workers
- **Frontend**: React 18 (CDN) + Tailwind CSS
- **Данные**: JSON файлы (real-time загрузка)
- **UI**: Standalone app.js (3000+ строк)

## Структура данных

```
public/data/
├── devices.json              # 126 устройств + IC + icons
├── ic_compatibility.json     # 111 микросхем
├── device_icons.json         # 126 иконок устройств
├── regional_codes.json       # 74 региональных кода
├── ukraine_prices.json       # 4,846 артикулов
├── logic_boards*.json        # Logic boards
├── error_codes.json          # 151 ошибка
└── repair_knowledge.json     # Гайды
```

## История версий

### v6.9.3 (19.01.2026)
- 24 новых IC (iPhone Air, iPhone 17)
- Apple C1X, N1, A19 Pro, Qualcomm X80
- Полные IC данные для iPhone Air
- 111 микросхем в базе

### v6.9.2 (19.01.2026)
- Device Icons Database (126 устройств)
- Иконки из iFixit, pngimg, icons8
- Обновлён DeviceCard с изображениями

### v6.9.1 (19.01.2026)
- IC Database Expansion v3.0 (87 ICs)
- Display, NFC, Sensor, Apple Watch категории
- iPad Pro M4, iPhone 16 IC mapping

### v6.3-v6.6 (19.01.2026)
- Standalone app.js (React 18)
- 7 панелей быстрого доступа
- Региональные коды, калькулятор ремонта

## Для кого

- **Менеджеры**: приёмка, цены, калькулятор
- **Техники**: диагностика, IC, схемы, board numbers
- **Руководители**: контроль качества, отчёты

## Запуск

```bash
# Сборка
npm run build

# Локальный запуск
pm2 start ecosystem.config.cjs

# Деплой на Cloudflare
npm run deploy
```
