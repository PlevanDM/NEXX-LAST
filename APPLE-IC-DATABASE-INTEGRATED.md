# Интегрированная база данных Apple IC - NEXX (v3.3)

**Статус:** Дополнение к master-db.json с ссылками на Apple IC Database.md

**Дата:** 2026-02-12

---

## 📊 Структура интеграции

### 1. iPhone USB/Charging Controllers

Для каждого iPhone в `master-db.json` добавлена информация:

| Поколение | Part Number | Position | Модели из БД | Производитель |
|-----------|------------|----------|------------|--------------|
| Tristar 1 | 1608A1 | U1700 | iPhone 5 | NXP |
| Tristar 2 | 1610A1 | U1700 | iPhone 5S/5C | NXP |
| Tristar 2 rev | 1610A2 | U1700 | iPhone 6/6P | NXP |
| Tristar 3 | 1610A3 | U4500 | iPhone 6S/6SP/SE1 | NXP |
| Tristar 3B | 610A3B | U4001 | iPhone 7/7P | NXP |
| Hydra | 1612A1 | U6300 | iPhone 8–11 PM | NXP |
| — | 1614A1 | U9300 | iPhone 12 all | NXP |
| — | 1616A0 | U9300 | iPhone 13 all | NXP |
| — | 1618A0 | U9300 | iPhone 14 all | NXP |
| **USB-C** | **SN2012027** | **U2** | **iPhone 15/16 all** | **TI** |

**Критическое изменение iPhone 15/16:** Apple перейшла на USB-C с TI SN2012027 (вместо NXP Tristar).

### 2. iPhone Audio IC (338S series - Cirrus Logic)

Важно: для iPhone 16 разные модели используют разные Audio IC:
- **iPhone 16 Pro / Pro Max**: 338S00967 (Big Audio Codec)
- **iPhone 16 / Plus**: 338S01087 (разный кодек, не-Pro модели)
- **Вспомогательный**: 338S00537 (Small Audio IC)

### 3. iPhone Baseband (Модемы) - Critical для диагностики

| Поколение | Part Number | Технология | Модели |
|----------|------------|-----------|--------|
| iPhone 5 | MDM9615 | LTE Cat 3 | Qualcomm |
| iPhone 5S/5C | MDM9625 | LTE Cat 4 | Qualcomm |
| iPhone 6/6S | MDM9635M / PMB9948 | LTE Cat 6 | Qualcomm / Intel |
| iPhone 7 | PMB9955 (XMM7480) | LTE Cat 16 | Intel / Qualcomm |
| iPhone 8-11 | PMB9960 (XMM7560) / MDM9655 | LTE Cat 16 | Intel / Qualcomm |
| iPhone 12 | SDX55M | 5G X55 | Qualcomm |
| iPhone 13 | SDX60M | 5G X60 | Qualcomm |
| iPhone 14 | SDX65M | 5G X65 + спутник | Qualcomm |
| iPhone 15 | SDX70M | 5G X70 | Qualcomm |
| iPhone 16 Pro/Pro Max | SDX71M | 5G X71 | Qualcomm |
| **iPhone 16e** | **Apple C1** | **5G sub-6** | **Apple (ПЕРВЫЙ APPLE МОДЕМ!)** |

**Значение для NEXX:**
- iPhone 16e имеет ПЕРВЫЙ собственный Apple модем (C1)
- Это исторический момент, требует специальной документации
- Диагностика & ремонт модема будет отличаться

### 4. MacBook Board Numbers - Полный справочник

#### MacBook Air
| Модель | Board Number | Процессор |
|--------|-------------|-----------|
| A1465 (2013-14) | 820-3435 | Intel 4th Gen |
| A1466 (2013-14) | 820-3437 | Intel 4th Gen |
| A1465 (2015-17) | 820-00164 | Intel 5th Gen |
| A1466 (2015-17) | 820-00165 | Intel 5th Gen |
| A1932 (2018-19) | 820-01521 | T2 + Intel 8th |
| A2179 (2020) | 820-01055/820-01958 | T2 + Intel 10th |
| A2337 M1 (2020) | 820-02016 | Apple M1 |
| A2681 M2 (2022) | 820-02536 | Apple M2 |
| A3113 M3 (2024) | 820-03285 | Apple M3 |
| A3114 M3 15" (2024) | 820-03286 | Apple M3 |
| A3240 M4 (2025) | 820-03597-A | Apple M4 |
| A3241 M4 15" (2025) | 820-03681 | Apple M4 |

#### MacBook Pro (выборка ключевых)
| Модель | Board Number | Процессор |
|--------|-------------|-----------|
| A1502 (2013-14) 13" | 820-3476/820-3536 | Intel 4th Gen |
| A1398 (2013-14) 15" | 820-3662 / 820-3787 | Intel 4th Gen |
| A1706 (2016-17) 13" Touch Bar | 820-00239/820-00923 | Intel 6th/7th Gen |
| A1707 (2016-17) 15" Touch Bar | 820-00281/820-00928 | Intel 6th/7th Gen |
| A1989 (2018-19) 13" | 820-00850 | T2 + Intel 8th |
| A1990 (2018-19) 15" | 820-01041 | T2 + Intel 9th |
| A2338 M1 (2020) | 820-02020 | Apple M1 |
| A2442 M1 Pro 14" (2021) | 820-02098 | Apple M1 Pro/Max |
| A2779 M2 Pro 14" (2023) | 820-02655 | Apple M2 Pro/Max |
| A3112 M4 14" (2024) | 820-03129 | Apple M4 |
| A3401 M4 Pro 14" (2024) | 820-03400 | Apple M4 Pro/Max |

### 5. MacBook USB-C/PD Controllers - КРИТИЧЕСКИЙ компонент

| Чип | Модели | Позиция | Примечание |
|-----|--------|---------|-----------|
| CD3215C00/B03 | MacBook 2016-17 (A1534, A1706, A1707, A1708) | U3100/U3200 | TI. Если 1 из 4 умер → остальные не работают |
| CD3217B12/B13 | MacBook 2018-2022 (A1989-A2338) | UB300/UB310 | I2C адреса через strapping |
| SN25A12 | MacBook Pro M3/M4 (2023-2025) | — | Новое поколение TI |

**Криический момент:** Если CD3215/CD3217 повреждён или SPI ROM повреждён:
- MacBook застрявает на 5V в зарядке
- Требуется восстановление SPI ROM firmware
- SPI ROM: Winbond W25Q80DVUXIE (1MB) или GigaDevice GD25Q80E

### 6. MacBook Charging ICs

| Чип | Позиция | Модели | Примечание |
|-----|---------|--------|-----------|
| ISL6259 | U7000/U7100 | MacBook 2010-2015 | Управляет зарядкой, батареей, PPBUS_G3H |
| ISL9239 | U7000 | A1706, A1708, A1707 (2016-17) | + PP3V3_G3H. Критичен для загрузки |
| ISL9240 | U7000 | A1989, A1990, A2141, A2159 (2018-20) | + PP3V3_G3H_RTC |
| RAA489901A5 | — | MacBook Pro M3 Pro/M4 | Renesas battery charger |

### 7. MacBook Pro M3 Pro - Полный список (эталон для Silicon era)

**SoC & Memory:**
- APL1203/339S01320: Apple M3 Pro SoC
- K5A3U08299, K5A3UN0975: Kioxia 128GB NAND

**Power Management (PMIC):**
- APL109H/343S00652, 343S00653: PMIC
- 338S00600-A0: PMIC
- APL109G/343S00649, 343S00650: PMIC

**Connectivity:**
- SN25A12 (x2): USB-C controller (TI)
- U0KSS1-L2: Thunderbolt controller (Apple)
- GL9755A: Card reader (Genesys Logic)
- USI 339S01093: WiFi/BT module

**Audio & Video:**
- CS42L84A: Audio codec (Cirrus Logic)
- SN012776B0: Audio amplifier (TI)
- PS190: DP-to-HDMI (Parade Tech)

**Power Regulators:**
- RAA489901A5: Battery charger (Renesas)
- RAA225702B, RAA209100B1: DC-DC converters (Renesas)
- LT8642EV-1: Step-down regulator (Analog Devices)
- TPS62180: Buck converter (TI)

**Other:**
- LP8548B1: LED backlight driver (TI)
- REF3325: Voltage reference (TI)
- GD25Q80E, W25Q80DVUXIE, W25Q64NEXGIG: SPI NOR flash

### 8. iPad SoC Reference

| Модель | SoC | Категория |
|--------|-----|----------|
| iPad 1st gen | A4 | Baseline |
| iPad 2 | A5 | Baseline |
| iPad Air 1st / mini 2/3 | A7 | 64-bit |
| iPad Air 2 | A8X | Performance |
| iPad 5th gen | A9 | Performance |
| iPad Pro 12.9" 1st / 9.7" | A9X | Premium |
| iPad Pro 10.5" / 12.9" 2nd | A10X Fusion | Premium |
| iPad mini 5 / Air 3 / iPad 8th | A12 Bionic | Modern |
| iPad 9th gen | A13 Bionic | Modern |
| iPad Air 4th / iPad 10th | A14 Bionic | Modern |
| iPad mini 6th | A15 Bionic | Modern |
| iPad Pro 11" 3rd / 12.9" 5th / Air 5th | M1 | Apple Silicon |
| iPad Pro 11" 4th / 12.9" 6th / Air 6th | M2 | Apple Silicon |
| iPad Pro 11" 5th / 13" / iPad Air M3 | M4 | Apple Silicon |
| iPad mini 7th | A17 Pro | Premium |

### 9. Apple Watch - Известные микросхемы

#### Series 3 (A1861, GPS + Cellular)
- **SoC**: Apple S3 SiP (dual-core)
- **NAND**: Toshiba FPV7_32G x4 = 16GB
- **W2 чип**: Apple 338S00348 (Bluetooth)
- **RF**: USI 339M00034 (Qualcomm WTR3925 transceiver)
- **FEM**: Avago AFEM-8069
- **PA**: Skyworks SKY78198
- **PMIC**: Qualcomm PMD9645
- **MCU**: STMicro ST33G1M2 (NFC/eSIM)

#### Series 2
- **SoC**: Apple S2 SiP
- **Memory**: Micron 1GB LPDDR4 + 32GB 3D NAND
- **Sensor**: Bosch BMP280 barometric + ST C451 gyro/accel
- **PMIC**: Dialog Semiconductor
- **Wireless charging**: Broadcom receiver

---

## 🔗 Критические паiring ограничения

### iPhone до iPhone 15
Следующие компоненты **полностью привязаны** к SoC:
- ✗ Face ID / Touch ID — потеря биометрии
- ✗ Baseband + NAND — пара привязана
- ✗ Передняя камера — привязана (iPhone 12–15)
- ✗ LiDAR — заблокирован (iPhone 15 Pro Max)
- ⚠️ Батарея — предупреждения после замены
- ⚠️ Дисплей — предупреждения, True Tone теряется

### iPhone 16 (революционные изменения!)
Apple отменила большинство pairing-ограничений (закон Oregon):
- ✅ Большинство компонентов можно менять через Repair Assistant
- ⚠️ Face ID всё ещё требует калибровку
- ⚠️ Камера Pro Max требует ~5 мин калибровки

### MacBook
- ✗ T2 чип — привязан к SSD. Замена T2 = потеря данных
- ✗ CD3215/CD3217 — требуют корректный SPI ROM firmware
- ✗ Apple Silicon SoC (M1–M4) — SSD припаян, замена невозможна

---

## 🎯 Рекомендации по интеграции в NEXX

### 1. **Обновить device entries для iPhone**
```json
{
  "charging_ic": {
    "primary": "SN2012027",
    "type": "USB-C Controller (TI)",
    "generation": "iPhone 15+ (USB-C era)",
    "eeprom": "8N EEPROM"
  },
  "audio_ics": [
    { "name": "338S00967", "function": "Big Audio Codec" },
    { "name": "338S00537", "function": "Small Audio IC" }
  ],
  "baseband": {
    "part": "SDX71M",
    "technology": "5G X71",
    "manufacturer": "Qualcomm"
  }
}
```

### 2. **Обновить MacBook entries**
```json
{
  "usb_c_controller": {
    "part": "SN25A12",
    "manufacturer": "TI",
    "position": "Unknown (behind heatsinks)",
    "critical_notes": "If corrupted → 5V stuck charging"
  },
  "spi_rom": {
    "part": "GD25Q80E or W25Q64NEXGIG",
    "size": "1MB or 8MB",
    "firmware": "Essential for USB-C functionality"
  }
}
```

### 3. **Добавить Board Numbers для всех MacBook**
Уже частично сделано, но нужно проверить консистентность.

### 4. **Добавить Apple Watch microchips**
Для диагностики и ремонта Apple Watch.

### 5. **Создать таблицу совместимости донорских устройств**
- iPhone 16: 338S01087 audio IC (non-Pro) не совместим с 338S00967 (Pro)
- MacBook USB-C: CD3215 может быть донором для A1706/A1707 друг друга
- iPad: SoC не всегда определяет совместимость других компонентов

---

## ⚠️ Критические места для диагностики

### iPhone
1. **Зарядка не работает** → проверить SN2012027 (iPhone 15/16) или Tristar (старше)
2. **No Sound** → проверить Audio IC (338S серия)
3. **5G не работает** → проверить Baseband IC (SDX series)

### MacBook
1. **Charging Stuck at 5V** → CD3215/CD3217 SPI ROM повреждён
2. **USB-C не работает** → CD3215/CD3217 dead или неправильный firmware
3. **No Power** → ISL9239/ISL9240 charging IC проблема

### iPad
1. **No Audio** → 338S1213 (iPad Air 2, iPad Pro 9.7")
2. **Device won't boot** → проверить PMIC & Power Rails

---

## 📚 Источники данных

1. iFixit Teardowns (2024-2026)
2. Repair Wiki (Computer-Automation.de, MacFactory)
3. TechInsights
4. DIYFixTool & professional repair forums
5. Apple official specifications

**Документ:** Apple IC Database.md (2026-02-12)
