#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Обогащение базы данных IC микросхем детальной информацией
"""

import json
import os

def load_json(filename):
    """Загрузка JSON файла"""
    filepath = f'public/data/{filename}'
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_json(data, filename):
    """Сохранение JSON файла"""
    filepath = f'public/data/{filename}'
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ Обновлен файл: {filepath}")

def enrich_power_management_ics():
    """Детальная информация по Power Management ICs"""
    
    power_ics = {
        "338S00122": {
            "designation": "Big PMIC",
            "package": "BGA",
            "devices": ["iPhone 6S", "iPhone 6S Plus"],
            "location": "U1202",
            "functions": [
                "Основное управление питанием",
                "Регулировка напряжений для CPU/GPU",
                "Управление зарядкой батареи",
                "Контроль температуры"
            ],
            "analogues": [
                {"part": "338S00120", "compatibility": "95%", "notes": "Из iPhone 6 - требует доработки"},
                {"part": "338S00155", "compatibility": "100%", "notes": "Из iPhone SE 1"}
            ],
            "donor_models": [
                {"model": "iPhone 6S любой емкости", "years": "2015-2016", "location": "U1202", "difficulty": "Средняя"},
                {"model": "iPhone 6S Plus", "years": "2015-2016", "location": "U1202", "difficulty": "Средняя"},
                {"model": "iPhone SE 1st gen", "years": "2016", "location": "U1202", "difficulty": "Средняя"}
            ],
            "common_failures": [
                "Не включается после падения",
                "Перезагрузки при нагрузке",
                "Не заряжается (вместе с Tristar)",
                "Перегрев без нагрузки"
            ],
            "diagnostic": {
                "resistance_to_ground": "10-25 Ohm",
                "voltage_output": "Multiple rails 0.9V-3.8V",
                "test_points": ["PP_CPU", "PP_GPU", "PP_BATT_VCC"]
            },
            "repair_tips": [
                "Проверить на трещины под микроскопом",
                "Температура демонтажа 380-400°C",
                "Обязательно reballing перед установкой",
                "Проверить все выходные напряжения после замены"
            ],
            "price_range": "$15-25",
            "aliexpress": "https://www.aliexpress.com/item/338S00122-power-ic.html"
        },
        "338S00309": {
            "designation": "Main PMIC",
            "package": "BGA",
            "devices": ["iPhone 8", "iPhone 8 Plus", "iPhone X", "iPhone SE 2020"],
            "location": "U2700",
            "functions": [
                "Управление всеми power rails",
                "Поддержка беспроводной зарядки",
                "Fast charging контроллер",
                "Thermal management"
            ],
            "analogues": [
                {"part": "338S00309-B0", "compatibility": "100%", "notes": "Улучшенная ревизия"},
                {"part": "338S00375", "compatibility": "90%", "notes": "Из iPhone XR - нужна прошивка"}
            ],
            "donor_models": [
                {"model": "iPhone 8", "years": "2017-2020", "location": "U2700", "difficulty": "Средняя"},
                {"model": "iPhone 8 Plus", "years": "2017-2020", "location": "U2700", "difficulty": "Средняя"},
                {"model": "iPhone X", "years": "2017-2018", "location": "U2700", "difficulty": "Высокая"},
                {"model": "iPhone SE 2nd gen", "years": "2020-2022", "location": "U2700", "difficulty": "Средняя"}
            ],
            "common_failures": [
                "Bootloop после обновления iOS",
                "Не работает беспроводная зарядка",
                "Случайные выключения",
                "4013/4014 ошибки в iTunes"
            ],
            "diagnostic": {
                "resistance_to_ground": "15-30 Ohm",
                "i2c_communication": "Check with oscilloscope",
                "test_points": ["PPVDD_MAIN", "PP3V0_TRISTAR", "PP1V8_ALWAYS"]
            },
            "repair_tips": [
                "Часто выходит из строя вместе с Tristar",
                "Проверить underfill на трещины",
                "После замены требуется restore через iTunes",
                "Использовать качественный флюс"
            ],
            "price_range": "$20-35",
            "aliexpress": "https://www.aliexpress.com/item/338S00309-ic.html"
        },
        "343S00089": {
            "designation": "PMIC Tiger",
            "package": "BGA",
            "devices": ["iPhone 7", "iPhone 7 Plus"],
            "location": "U2700",
            "functions": [
                "Основной контроллер питания",
                "Управление haptic engine",
                "Контроль home button",
                "Power sequencing"
            ],
            "analogues": [
                {"part": "343S00091", "compatibility": "100%", "notes": "Полный аналог"}
            ],
            "donor_models": [
                {"model": "iPhone 7", "years": "2016-2019", "location": "U2700", "difficulty": "Средняя"},
                {"model": "iPhone 7 Plus", "years": "2016-2019", "location": "U2700", "difficulty": "Средняя"}
            ],
            "common_failures": [
                "Аудио-болезнь (Audio IC disease)",
                "Не работает home button",
                "Bootloop при холодном старте",
                "Проблемы с haptic feedback"
            ],
            "diagnostic": {
                "resistance_to_ground": "12-28 Ohm",
                "boot_sequence": "Monitor current draw",
                "test_points": ["PP_VDD_MAIN", "PP_VDD_BOOST", "MESA_BOOST"]
            },
            "repair_tips": [
                "Часто требует замены вместе с Audio IC",
                "Проверить flex home button",
                "Требует опыта в микропайке",
                "Внимание к ориентации чипа"
            ],
            "price_range": "$18-28",
            "aliexpress": "https://www.aliexpress.com/item/343S00089-pmic.html"
        }
    }
    
    return power_ics

def enrich_audio_codecs():
    """Детальная информация по Audio Codec ICs"""
    
    audio_ics = {
        "338S00105": {
            "designation": "Big Audio IC (Caltra)",
            "package": "BGA",
            "devices": ["iPhone 6S", "iPhone 6S Plus", "iPhone 7", "iPhone 7 Plus"],
            "location": "U3500 (6S) / U3101 (7)",
            "functions": [
                "Аудио кодек для динамиков",
                "Управление микрофонами",
                "Обработка голоса для Siri",
                "Noise cancellation"
            ],
            "analogues": [],
            "donor_models": [
                {"model": "iPhone 6S/6S Plus", "years": "2015-2016", "location": "U3500", "difficulty": "Высокая"},
                {"model": "iPhone 7/7 Plus", "years": "2016-2019", "location": "U3101", "difficulty": "Очень высокая"},
                {"model": "iPhone SE 1st gen", "years": "2016", "location": "U3500", "difficulty": "Высокая"}
            ],
            "common_failures": [
                "Серая кнопка Voice Memos",
                "Нет звука при звонке",
                "Siri не слышит голос",
                "Bootloop (Audio IC disease на iPhone 7)"
            ],
            "diagnostic": {
                "i2c_lines": "Check SDA/SCL communication",
                "resistance": "350-450 Ohm to ground",
                "test_points": ["CODEC_TO_AP_I2S", "AP_TO_CODEC_I2S"]
            },
            "repair_tips": [
                "iPhone 7 требует дополнительную перемычку",
                "Очень чувствителен к перегреву",
                "Использовать low-melt solder для демонтажа",
                "Проверить C12 pad на iPhone 7"
            ],
            "price_range": "$25-40",
            "aliexpress": "https://www.aliexpress.com/item/338S00105-audio.html"
        },
        "CS42L77": {
            "designation": "Audio Codec Cirrus Logic",
            "package": "BGA",
            "devices": ["iPhone X", "iPhone XS", "iPhone XS Max"],
            "location": "U4700",
            "functions": [
                "Высококачественный аудио кодек",
                "Поддержка стерео записи",
                "Управление haptic engine",
                "Digital signal processing"
            ],
            "analogues": [
                {"part": "CS42L75", "compatibility": "95%", "notes": "Небольшие отличия в распиновке"}
            ],
            "donor_models": [
                {"model": "iPhone X", "years": "2017-2018", "location": "U4700", "difficulty": "Очень высокая"},
                {"model": "iPhone XS/XS Max", "years": "2018-2019", "location": "U4700", "difficulty": "Очень высокая"}
            ],
            "common_failures": [
                "Нет звука в наушниках",
                "Проблемы с записью видео",
                "Не работает громкая связь",
                "Искажения звука"
            ],
            "diagnostic": {
                "power_rails": "1.8V and 3.3V must be present",
                "clock_signal": "24.576MHz",
                "test_points": ["I2S_AP_TO_CODEC", "I2S_CODEC_TO_AP"]
            },
            "repair_tips": [
                "Требует профессионального оборудования",
                "Очень маленькие контактные площадки",
                "Проверить все фильтры после замены",
                "Часто повреждается при падении"
            ],
            "price_range": "$30-50",
            "aliexpress": "https://www.aliexpress.com/item/CS42L77-codec.html"
        },
        "338S00248": {
            "designation": "Audio IC (338S00248)",
            "package": "BGA",
            "devices": ["iPhone XS", "iPhone XS Max", "iPhone 11 Pro", "iPhone 11 Pro Max"],
            "location": "U4700",
            "functions": [
                "Премиум аудио обработка",
                "Spatial audio поддержка",
                "Многоканальная запись",
                "Эквалайзер и эффекты"
            ],
            "analogues": [
                {"part": "338S00411", "compatibility": "80%", "notes": "Из iPhone 11 - требует адаптации"}
            ],
            "donor_models": [
                {"model": "iPhone XS", "years": "2018-2019", "location": "U4700", "difficulty": "Экстремально сложная"},
                {"model": "iPhone XS Max", "years": "2018-2019", "location": "U4700", "difficulty": "Экстремально сложная"},
                {"model": "iPhone 11 Pro/Pro Max", "years": "2019-2020", "location": "U4700", "difficulty": "Экстремально сложная"}
            ],
            "common_failures": [
                "Пропадает звук после обновления",
                "Не работает запись в 4K",
                "Проблемы с FaceTime audio",
                "Перегрев при использовании камеры"
            ],
            "diagnostic": {
                "boot_check": "Monitor during boot sequence",
                "voltage_check": "All rails must be stable",
                "oscilloscope": "Check I2S data lines"
            },
            "repair_tips": [
                "Используйте только оригинальные чипы",
                "Требуется калибровка после замены",
                "Защитите окружающие компоненты каптоном",
                "Не превышать 380°C при демонтаже"
            ],
            "price_range": "$40-70",
            "aliexpress": "https://www.aliexpress.com/item/338S00248.html"
        }
    }
    
    return audio_ics

def enrich_wifi_bluetooth_ics():
    """Детальная информация по WiFi/Bluetooth ICs"""
    
    wifi_bt_ics = {
        "339S0242": {
            "designation": "WiFi/BT Module BCM4355",
            "package": "BGA Module",
            "devices": ["iPhone 6", "iPhone 6 Plus"],
            "location": "U5201_RF",
            "functions": [
                "WiFi 802.11 a/b/g/n/ac",
                "Bluetooth 4.2",
                "AirDrop поддержка",
                "WiFi calling"
            ],
            "analogues": [
                {"part": "339S0228", "compatibility": "100%", "notes": "Полностью совместим"},
                {"part": "339S0231", "compatibility": "100%", "notes": "Улучшенная версия"}
            ],
            "donor_models": [
                {"model": "iPhone 6", "years": "2014-2016", "location": "U5201_RF", "difficulty": "Высокая"},
                {"model": "iPhone 6 Plus", "years": "2014-2016", "location": "U5201_RF", "difficulty": "Высокая"}
            ],
            "common_failures": [
                "WiFi выделен серым",
                "Bluetooth постоянно ищет",
                "Слабый сигнал WiFi",
                "AirDrop не работает"
            ],
            "diagnostic": {
                "check_antenna": "Проверить антенные контакты",
                "power_check": "1.2V, 1.8V, 3.3V rails",
                "crystal": "37.4MHz oscillator"
            },
            "repair_tips": [
                "Модуль с экранированием - снимать осторожно",
                "Проверить все антенные коннекторы",
                "После замены сбросить сетевые настройки",
                "Часто помогает просто реболлинг"
            ],
            "price_range": "$20-35",
            "aliexpress": "https://www.aliexpress.com/item/339S0242-wifi.html"
        },
        "339S00448": {
            "designation": "WiFi/BT Module USI",
            "package": "BGA Module with shield",
            "devices": ["iPhone 8", "iPhone 8 Plus", "iPhone X"],
            "location": "U6200_RF",
            "functions": [
                "WiFi 802.11ac Wave 2",
                "Bluetooth 5.0",
                "NFC controller integration",
                "MIMO 2x2 support"
            ],
            "analogues": [],
            "donor_models": [
                {"model": "iPhone 8/8 Plus", "years": "2017-2020", "location": "U6200_RF", "difficulty": "Очень высокая"},
                {"model": "iPhone X", "years": "2017-2018", "location": "U6200_RF", "difficulty": "Очень высокая"}
            ],
            "common_failures": [
                "Пропадает WiFi после падения",
                "Bluetooth отключается сам",
                "Не видит 5GHz сети",
                "Проблемы с AirPods"
            ],
            "diagnostic": {
                "module_test": "Проверить наличие MAC адреса",
                "antenna_diversity": "Тест обеих антенн",
                "nfc_check": "Проверить NFC если есть"
            },
            "repair_tips": [
                "Снимать щит термофеном на 200°C",
                "Модуль очень чувствителен к ESD",
                "Проверить пасту под щитом",
                "Возможны проблемы с True Tone после замены"
            ],
            "price_range": "$35-55",
            "aliexpress": "https://www.aliexpress.com/item/339S00448.html"
        },
        "339S00761": {
            "designation": "WiFi 6/BT 5.2 Module",
            "package": "BGA Module",
            "devices": ["iPhone 12", "iPhone 12 Pro", "iPhone 13", "iPhone 13 Pro"],
            "location": "U7500_RF",
            "functions": [
                "WiFi 6 (802.11ax)",
                "Bluetooth 5.2",
                "Ultra Wideband (UWB)",
                "5G/WiFi coexistence"
            ],
            "analogues": [],
            "donor_models": [
                {"model": "iPhone 12 все версии", "years": "2020-2021", "location": "U7500_RF", "difficulty": "Экстремально сложная"},
                {"model": "iPhone 13 все версии", "years": "2021-2022", "location": "U7500_RF", "difficulty": "Экстремально сложная"}
            ],
            "common_failures": [
                "Перегрев при использовании WiFi",
                "UWB не работает (AirTag)",
                "Низкая скорость WiFi 6",
                "Конфликт с 5G модемом"
            ],
            "diagnostic": {
                "uwb_test": "Проверить U1 chip communication",
                "wifi6_features": "Test OFDMA and MU-MIMO",
                "thermal": "Monitor temperature during operation"
            },
            "repair_tips": [
                "Требует специального stencil для reballing",
                "Критично соблюдать температурный режим",
                "После замены нужна калибровка в сервисном режиме",
                "Проверить термопасту на процессоре"
            ],
            "price_range": "$60-100",
            "aliexpress": "https://www.aliexpress.com/item/339S00761-wifi6.html"
        }
    }
    
    return wifi_bt_ics

def enrich_display_backlight_ics():
    """Детальная информация по Display/Backlight ICs"""
    
    display_ics = {
        "backlight_drivers": {
            "LM3534": {
                "designation": "Backlight Driver",
                "devices": ["iPhone 6", "iPhone 6 Plus"],
                "location": "U1502",
                "functions": ["LED подсветка дисплея", "Яркость экрана", "Ambient light sensor"],
                "common_failures": ["Нет подсветки", "Мерцание экрана", "Не регулируется яркость"],
                "donor_compatibility": ["iPhone 6 ↔ iPhone 6 Plus"],
                "price_range": "$8-15"
            },
            "TPS65730": {
                "designation": "Display Power Management",
                "devices": ["iPhone 7", "iPhone 8"],
                "location": "U3703",
                "functions": ["Boost converter для подсветки", "True Tone контроль", "Display timing"],
                "common_failures": ["Белый экран", "Линии на экране", "True Tone не работает"],
                "donor_compatibility": ["iPhone 7 → iPhone 8 (с модификацией)"],
                "price_range": "$12-20"
            }
        },
        "touch_controllers": {
            "343S0694": {
                "designation": "Touch IC Cumulus",
                "devices": ["iPad Air 2", "iPad Mini 4"],
                "package": "BGA",
                "functions": ["Обработка касаний", "Palm rejection", "Force touch"],
                "common_failures": ["Touch не работает после замены стекла", "Ghost touch"],
                "repair_difficulty": "Очень высокая - требует микроскопа",
                "price_range": "$25-40"
            }
        }
    }
    
    return display_ics

def enrich_nand_ram_ics():
    """Информация по памяти NAND и RAM"""
    
    memory_ics = {
        "nand_flash": {
            "SanDisk_SDMFLBCB2_128G": {
                "capacity": "128GB",
                "devices": ["iPhone 6S Plus", "iPhone 7"],
                "technology": "3D TLC NAND",
                "interface": "Toggle DDR 2.0",
                "donor_notes": "Требуется программатор для переноса данных",
                "compatibility": "Только той же емкости"
            },
            "Toshiba_THGBX5G8D4KLDXG": {
                "capacity": "64GB",
                "devices": ["iPhone 8", "iPhone X"],
                "technology": "BiCS3 3D NAND",
                "interface": "Toggle DDR 3.0",
                "donor_notes": "Привязан к CPU - нужен программатор JC P11",
                "compatibility": "Можно upgrade емкости с прошивкой"
            }
        },
        "ram_modules": {
            "Samsung_K3RG1G10BM": {
                "capacity": "2GB LPDDR4",
                "devices": ["iPhone 7", "iPhone 8"],
                "frequency": "3200MHz",
                "voltage": "1.1V",
                "donor_compatibility": "Взаимозаменяемы между моделями",
                "soldering_notes": "Критична соосность при установке"
            },
            "Micron_MT53D512M64D4SB": {
                "capacity": "4GB LPDDR4X",
                "devices": ["iPhone X", "iPhone XS"],
                "frequency": "4266MHz", 
                "voltage": "0.6V",
                "donor_compatibility": "XS → X возможен даунгрейд",
                "soldering_notes": "Underfill обязателен"
            }
        }
    }
    
    return memory_ics

def update_ic_compatibility_file():
    """Обновление основного файла ic_compatibility.json"""
    
    ic_data = load_json('ic_compatibility.json')
    
    # Добавляем детальную информацию по power ICs
    power_ics = enrich_power_management_ics()
    for ic_name, ic_info in power_ics.items():
        if 'power_ics' not in ic_data:
            ic_data['power_ics'] = {}
        ic_data['power_ics'][ic_name] = ic_info
    
    # Добавляем audio codecs
    audio_ics = enrich_audio_codecs()
    for ic_name, ic_info in audio_ics.items():
        if 'audio_ics' not in ic_data:
            ic_data['audio_ics'] = {}
        ic_data['audio_ics'][ic_name] = ic_info
    
    # Добавляем WiFi/Bluetooth
    wifi_bt = enrich_wifi_bluetooth_ics()
    for ic_name, ic_info in wifi_bt.items():
        if 'wifi_bluetooth_ics' not in ic_data:
            ic_data['wifi_bluetooth_ics'] = {}
        ic_data['wifi_bluetooth_ics'][ic_name] = ic_info
    
    # Добавляем display/backlight
    display = enrich_display_backlight_ics()
    if 'display_ics' not in ic_data:
        ic_data['display_ics'] = {}
    ic_data['display_ics'].update(display)
    
    # Добавляем memory
    memory = enrich_nand_ram_ics()
    if 'memory_ics' not in ic_data:
        ic_data['memory_ics'] = {}
    ic_data['memory_ics'].update(memory)
    
    save_json(ic_data, 'ic_compatibility.json')
    
    return ic_data

def add_common_issues_by_model():
    """Добавление типичных проблем по моделям"""
    
    common_issues = {
        "iPhone_6_Plus": {
            "touch_disease": {
                "symptoms": ["Серая полоса сверху экрана", "Touch не работает", "Экран мерцает"],
                "cause": "Отвал Touch IC Cumulus/Meson из-за гибкости корпуса",
                "solution": "Замена обоих Touch IC + укрепление платы",
                "difficulty": "Очень высокая"
            },
            "error_4013": {
                "symptoms": ["Ошибка 4013 в iTunes", "Bootloop", "Греется"],
                "cause": "Проблема с NAND или CPU",
                "solution": "Reballing NAND, если не помогает - замена платы",
                "difficulty": "Экстремальная"
            }
        },
        "iPhone_7": {
            "audio_ic_disease": {
                "symptoms": ["Bootloop", "Серая кнопка записи голоса", "Нет звука при звонке", "Зависает на логотипе"],
                "cause": "Отвал Audio IC 338S00105 из-за изгибов платы",
                "solution": "Замена Audio IC + перемычка на C12 pad",
                "difficulty": "Очень высокая",
                "note": "Самая частая проблема iPhone 7"
            },
            "baseband_failure": {
                "symptoms": ["No Service", "Поиск сети", "Нет IMEI"],
                "cause": "Отвал Baseband CPU или PMU",
                "solution": "Reballing BB_CPU/BB_PMU для Qualcomm версии",
                "difficulty": "Высокая для Qualcomm, невозможна для Intel"
            }
        },
        "iPhone_X": {
            "face_id_failure": {
                "symptoms": ["Face ID недоступен", "Не работает после замены экрана"],
                "cause": "Повреждение flood illuminator или dot projector",
                "solution": "Требуется микропайка или замена модуля (Face ID потеряется)",
                "difficulty": "Экстремальная"
            },
            "sandwich_board_issues": {
                "symptoms": ["Не включается", "Bootloop", "Перегрев"],
                "cause": "Проблема с нижней платой (sandwich design)",
                "solution": "Разделение плат и диагностика каждой",
                "difficulty": "Очень высокая"
            }
        },
        "iPhone_11_Pro": {
            "camera_failure": {
                "symptoms": ["Черный экран в камере", "Камера не фокусируется", "Ошибка камеры"],
                "cause": "Повреждение камерного модуля или контроллера",
                "solution": "Замена камерного модуля (потеря некоторых функций)",
                "difficulty": "Средняя"
            },
            "wireless_charging": {
                "symptoms": ["Не заряжается беспроводной зарядкой", "Греется при зарядке"],
                "cause": "Повреждение катушки или контроллера зарядки",
                "solution": "Замена катушки беспроводной зарядки",
                "difficulty": "Средняя"
            }
        },
        "MacBook_Pro_2016": {
            "flexgate": {
                "symptoms": ["Stage light effect", "Подсветка пропадает при открытии"],
                "cause": "Повреждение flex кабеля подсветки",
                "solution": "Замена всей верхней части с экраном",
                "difficulty": "Высокая",
                "cost": "Очень дорого"
            },
            "keyboard_failure": {
                "symptoms": ["Залипают клавиши", "Двойное срабатывание", "Не работают клавиши"],
                "cause": "Butterfly механизм забивается пылью",
                "solution": "Замена всего topcase с батареей",
                "difficulty": "Средняя",
                "cost": "Дорого"
            }
        },
        "iPad_Air_2": {
            "touch_ic_failure": {
                "symptoms": ["Touch не работает", "Работает только после нагрева", "Ghost touch"],
                "cause": "Отвал Touch IC из-за изгибов",
                "solution": "Замена Cumulus и Meson IC",
                "difficulty": "Очень высокая"
            }
        }
    }
    
    return common_issues

def add_temperature_profiles():
    """Температурные профили для BGA пайки"""
    
    temp_profiles = {
        "standard_bga": {
            "preheating": {
                "bottom": "150-180°C",
                "duration": "60-90 секунд",
                "purpose": "Равномерный прогрев платы"
            },
            "removal": {
                "top": "380-400°C",
                "bottom": "180-200°C",
                "duration": "20-30 секунд",
                "flux": "Обильно Amtech 559 или аналог"
            },
            "installation": {
                "top": "360-380°C",
                "bottom": "180-200°C",
                "duration": "30-40 секунд",
                "note": "Следить за выравниванием чипа"
            }
        },
        "cpu_reballing": {
            "warning": "Только для опытных мастеров!",
            "preheating": {
                "bottom": "200°C",
                "duration": "120 секунд"
            },
            "removal": {
                "top": "400-420°C",
                "spiral_motion": "Да",
                "duration": "40-60 секунд"
            },
            "reballing": {
                "stencil": "Обязательно оригинальный",
                "balls": "Leaded 0.35-0.4mm",
                "temperature": "180-200°C для припоя"
            }
        },
        "underfill_chips": {
            "note": "Для чипов с underfill (compound)",
            "removal": {
                "top": "420-450°C",
                "duration": "60-90 секунд",
                "technique": "Покачивание пинцетом"
            },
            "cleaning": {
                "tool": "Ультразвук или механически",
                "solution": "Изопропанол 99%"
            }
        }
    }
    
    return temp_profiles

def main():
    """Основная функция"""
    
    print("🔧 Обогащение базы данных IC микросхем...")
    
    # Обновляем ic_compatibility.json
    update_ic_compatibility_file()
    
    # Добавляем типичные проблемы
    devices = load_json('devices.json')
    common_issues = add_common_issues_by_model()
    
    # Обновляем устройства с common issues
    for device in devices:
        model_key = device.get('model', '').replace(' ', '_')
        if model_key in common_issues:
            device['detailed_issues'] = common_issues[model_key]
    
    save_json(devices, 'devices.json')
    
    # Добавляем температурные профили в repair_knowledge
    repair_knowledge = load_json('repair_knowledge.json')
    repair_knowledge['temperature_profiles'] = add_temperature_profiles()
    save_json(repair_knowledge, 'repair_knowledge.json')
    
    print("\n✅ База данных успешно обновлена!")
    print("📊 Добавлено:")
    print("  - Детальная информация по Power Management ICs")
    print("  - Полные данные по Audio Codec чипам")
    print("  - WiFi/Bluetooth модули с донорами")
    print("  - Display/Backlight контроллеры")
    print("  - NAND/RAM совместимость")
    print("  - Типичные проблемы по моделям")
    print("  - Температурные профили для BGA")

if __name__ == "__main__":
    main()