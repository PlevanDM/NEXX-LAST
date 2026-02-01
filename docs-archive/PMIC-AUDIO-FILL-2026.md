# Заполнение PMIC и Audio для iPad и устройств (2026)

## Что сделано

1. **iPad Pro M4 (4 записи)**  
   В `master-db.json` для iPad Pro 11" M4, 13" M4, 11-inch M4, 13-inch M4 заполнены:
   - **PMIC:** APL1066/343S00682 (и при необходимости APL1067/343S00683)
   - **Audio:** MAX98709B (в `audio_ics`, чтобы отображалось в UI)

2. **Справочник iPad**  
   Создан `public/data/ipad-ic-reference.json` с полями `power_ics` и `audio_ics` для всех 34 моделей iPad:
   - **С реальными данными:** iPad Pro 11" M4, 13" M4, 11-inch M4, 13-inch M4 (PMIC + MAX98709B); iPad Pro 11" 2nd Gen (343S00288, 98728B); iPad Pro 12.9" 4th Gen (343S00328, 338S1213); iPad Pro 12.9" 1st Gen, 11" 1st Gen, 12.9" 3rd Gen (Audio: 338S1213 или 98728B где известно).
   - **С плейсхолдером "—":** остальные iPad (для единообразия полей; при появлении данных можно обновить справочник).

3. **Скрипт apply-audit-ic**  
   `scripts/apply-audit-ic.cjs` доработан:
   - Загружает и объединяет `audit-ic-reference.json` (iPhone) и `ipad-ic-reference.json` (iPad).
   - При запуске с `--overwrite` перезаписывает `power_ics`/`audio_ics` в `master-db.json` данными из справочников.

4. **API (src/api.ts)**  
   Добавлен fallback: если у устройства нет `audio_ics`, но есть `audio_ic`, для отображения Audio используется `audio_ic.name`/`audio_ic.main`.

## Как добавить или обновить PMIC/Audio

- **iPhone:** править `public/data/audit-ic-reference.json` (ключ `byName` → точное имя устройства).
- **iPad:** править `public/data/ipad-ic-reference.json` (то же самое).
- Затем выполнить:
  ```bash
  node scripts/apply-audit-ic.cjs --overwrite
  ```
  Перезапись затрагивает только устройства, чьи имена есть в справочниках.

## Рекомендации из отчёта (выполнено)

- **MacBook, Samsung, Apple Watch:** созданы справочники и подключены в `apply-audit-ic.cjs`:
  - `public/data/macbook-ic-reference.json` — 56 устройств (плейсхолдер "—");
  - `public/data/samsung-ic-reference.json` — 98 устройств (Samsung/Galaxy по имени);
  - `public/data/apple-watch-ic-reference.json` — 16 устройств.
  - Генерация из master-db: `node scripts/generate-ic-refs-from-db.cjs`.
- **Другие бренды (Redmi, POCO, Xiaomi Pad, Allview, Huawei):** заполнять MODEL, BOARD ID, PMIC, Audio по мере появления источников и добавлять в новые справочники (по тому же формату) или в `master-db.json`.
