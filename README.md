# Apple Intake Desk v2.9

## 🚀 Что реализовано

### ✅ Основные функции
- **Единая цветовая схема Indigo-Purple** - профессиональный дизайн для всех элементов
- **База знаний по ремонту** - детальные процедуры, диагностика, тест-поинты
- **Приёмочный чек-лист** - структурированная приёмка устройств
- **Справочник плат Mac** - 38+ моделей с номерами плат из repair.wiki (NEW!)
- **Прайс на ремонт Mac** - 40+ позиций с фильтрацией
- **База микросхем** - 60+ чипов с полной информацией о ремонте
- **Справочник схем и boardview** - ресурсы для ремонта (NEW!)

### 📊 База устройств
| Категория | Количество | Заполненность |
|-----------|------------|---------------|
| iPhone | 41 | 87% (36/41 полные данные) |
| iPad | 35 | 89% (31/35 с charging IC) |
| Mac | 72 | 53% (38/72 с board numbers) |
| **Всего** | **148** | - |

### 📈 Статистика базы данных
- **JSON файлов**: 38
- **Общий размер**: 850+ KB
- **Микросхем (IC)**: 25+ в ic_compatibility.json
- **Ресурсов для схем**: 15+ бесплатных и платных источников

## 🆕 Обновление 19.01.2026

### iPhone 15/16 Pro компоненты (iFixit Chip ID)
- **A17/A18 Pro процессоры** - полные спецификации
- **Qualcomm SDX70M/SDX71M** - 5G модемы с диагностикой
- **Texas Instruments SN2012017/SN2012027** - USB-C контроллеры
- **Cirrus Logic 338S00967** - Audio Codec
- **USI WiFi/BT/UWB модули** - беспроводные компоненты

### MacBook Board Numbers (repair.wiki)
| Модель | Board Number | Чип |
|--------|--------------|-----|
| MacBook Air M1 | 820-02016 | Apple M1 |
| MacBook Air M2 | 820-02536 | Apple M2 |
| MacBook Air M3 | 820-03285 | Apple M3 |
| MacBook Air M4 | 820-03597-A | Apple M4 |
| MacBook Pro 14" M4 | 820-03129 | Apple M4 |
| MacBook Pro 16" M4 Pro | 820-03400/820-03401 | Apple M4 Pro/Max |

### Ресурсы схем и boardview (NEW!)
**Бесплатные:**
- GSM-Forum (forum.gsmhosting.com)
- Repair.Wiki (repair.wiki)
- Logi.Wiki (logi.wiki) 
- Rossmann Group Forums (boards.rossmanngroup.com)
- iFixit Chip ID guides

**Платные:**
- Borneo Schematics ($40-80/год)
- ZXW Tool (~$50/год)
- Laptop-Schematics.com ($275 full)
- Phoneboard.co ($10-30/мес)

### Диагностика зарядки (NEW!)
**USB контроллеры по поколениям:**
| Поколение | Part Number | Модели |
|-----------|-------------|--------|
| Tristar | 1610A2/A3/A3B | iPhone 6-7 |
| Hydra | 1612A1 | iPhone 8-11 |
| Kraken | 1614A1-1618A0 | iPhone 12-14 |
| USB-C | CD3217B12 | iPhone 15-16 |

**Диагностические точки:**
- PP_5V0_USB, PP_VBUS1_E75
- PP_VAR_USB_RVP (RVP резистор 10Ω)
- PWR_GATE_EN_VBUS_1_VALID
- CHG_BOOT (diode mode)

### iPad Pro CD3217 Repair
- Типичная проблема: застревает на 5V (должно быть 15V)
- Диагностика: PP_LDO_CORE, PP3V3_ACE_LDO, PP3V3_S2_ACE
- Ремонт: замена CD3217 + ROM (8Nxxxx) с одного донора
- Сложность: Hard

## 📦 Структура данных

```
public/data/
├── devices.json              # 148 устройств (iPhone/iPad/Mac)
├── ic_compatibility.json     # 25+ микросхем с процедурами
├── charging_diagnostics.json # Диагностика зарядки (NEW!)
├── schematic_resources.json  # Ресурсы схем и boardview (NEW!)
├── iphone_chip_database.json # iPhone 15/16 Chip ID
├── error_codes.json          # iTunes/Finder коды ошибок
├── macbook_diagnosis.json    # MacBook M-series диагностика
├── nand_programming.json     # NAND программирование (JCID)
├── repair_knowledge.json     # База знаний по ремонту
├── measurements.json         # Измерения и тест-поинты
├── connectors.json           # Lightning/USB-C справочник
├── mac_board_reference.json  # Платы MacBook (extended)
├── mac_service_prices.json   # Прайс-лист
├── apple_watch_database.json # Apple Watch Series 8/9/Ultra
└── ipad_database.json        # iPad Pro M2/M4
```

**Всего: 850+ KB в 38 JSON файлах**

## 📂 Источники данных

### Open Source
- **iFixit** - Chip ID guides, teardowns (ifixit.com)
- **Repair.Wiki** - community repair knowledge (repair.wiki)
- **Logi.Wiki** - board numbers, schematics info (logi.wiki)
- **Rossmann Group** - forum discussions (boards.rossmanngroup.com)
- **TechInsights** - teardown analysis (techinsights.com)

### Форумы
- GSM-Forum (forum.gsmhosting.com)
- Reddit r/mobilerepair, r/macbookrepair
- Facebook repair groups

### YouTube каналы
- iPad Rehab (Jessa Jones)
- Rossmann Repair Group (Louis Rossmann)
- Electronics Repair School
- Hugh Jeffreys
- Phone Repair Guru

## 🌐 URLs
- **Локальная разработка**: http://localhost:3000
- **Публичный sandbox**: https://3000-ityb8kprz6pu8mu25elee-5185f4aa.sandbox.novita.ai
- **Production**: Готов к деплою на Cloudflare Pages

## 🛠 Технологии
- **Backend**: Hono Framework на Cloudflare Workers
- **Frontend**: React с Tailwind CSS (CDN)
- **База данных**: JSON файлы (готовы к миграции на D1)
- **Дизайн**: Bento Grid UI с градиентами

## 📈 Статус
- **Версия**: 2.9
- **Состояние**: ✅ Production Ready
- **Последнее обновление**: 19.01.2026

## 🚀 Развертывание

```bash
# Локальная разработка
npm run build
pm2 start ecosystem.config.cjs

# Деплой на Cloudflare Pages
npm run deploy
```

## 📝 Скрипты обновления

```bash
# Полное обновление базы iPhone
python3 complete_device_data.py
python3 complete_old_iphones.py

# Обновление MacBook board numbers
python3 complete_all_mac_data.py

# Добавление ресурсов схем
python3 add_schematic_resources.py

# Пересобрать и перезапустить
npm run build && pm2 restart apple-repair-tool
```

## 🔜 Что можно добавить

1. **Расширить базу Mac** - добавить оставшиеся 34 модели без board numbers
2. **BoardView визуализация** - интеграция с Phoneboard или собственная визуализация
3. **API интеграция** - подключение к iFixit API для автообновления
4. **Калькулятор ремонта** - расчёт стоимости на основе компонентов
5. **История ремонтов** - трекинг заказов с привязкой к базе знаний

## 👥 Целевая аудитория
- **Менеджеры приёмки** - чек-листы, прайсы
- **Техники** - диагностика, процедуры ремонта, схемы
- **Руководители** - контроль качества, статистика

## 📝 Лицензия
Proprietary - Все права защищены
