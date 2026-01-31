# Прайс Apple Official Ukraine (Exchange)

Оновлення цін з Excel → `public/data/apple-exchange-ua.json` → сайт «Прайс Украина».

---

## Один клік з робочого столу

1. Покладіть файл на **робочий стіл**, наприклад: `29.01.2026_Exchange_Price_List.xlsx`.
2. У корені проекту виконайте:
   ```bash
   npm run import:exchange-ua:desktop
   ```
   Скрипт сам знайде `.xlsx` на столі (паттерни: `*Exchange*Price*.xlsx`, `29*.xlsx`), скопіює в `data/exchange-ua/` і запустить імпорт. Результат — оновлений `public/data/apple-exchange-ua.json`.

---

## Ручне оновлення

1. Скопіюйте Excel у папку проекту:
   - **Папка:** `data/exchange-ua/` (або повний шлях: `c:\NEXX LAST\data\exchange-ua\`).
2. Запустіть:
   ```bash
   npm run import:exchange-ua
   ```
   Візьметься останній `.xlsx` з папки.

**З явним шляхом** (якщо шлях без кирилиці):
```bash
node scripts/import-exchange-ua-xlsx.cjs "C:\path\to\file.xlsx"
```

---

## Очікувані колонки в Excel

| Колонка | Варіанти заголовків |
|---------|----------------------|
| Артикул | артикул, art, article, код, part |
| Опис    | опис, description, описание, назва, name |
| Ціна складу | цена склада, price stock, ціна складу, stock, закуп |
| Ціна обміну | цена обмена, price exchange, ціна обміну, обмін, exchange |
| Повна ціна | полная, полная цена, розница, price full, retail |

Регістр не важливий. Після імпорту на сайті в розділі **«Прайс Украина»** будуть актуальні ціни, фільтр по моделях і загрузка .xlsx в браузері.
