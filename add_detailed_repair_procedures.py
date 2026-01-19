#!/usr/bin/env python3
import json
import os

def load_json(filepath):
    """Загружает JSON файл"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_json(data, filepath):
    """Сохраняет данные в JSON файл"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Загружаем существующие данные
ic_data = load_json('public/data/ic_compatibility.json')
repair_knowledge = load_json('public/data/repair_knowledge.json')
devices_data = load_json('public/data/devices.json')

# Детальные процедуры ремонта для каждой микросхемы
detailed_procedures = {
    "338S00122": {
        "name": "PMIC iPhone 6",
        "type": "Power Management",
        "location": "U1202",
        "symptoms": [
            "Не включается после замены батареи",
            "Перезагрузка при подключении камеры",
            "Не заряжается, но работает от батареи",
            "Греется в районе процессора"
        ],
        "test_points": {
            "PP_VDD_MAIN": "4.2V при подключенном ЗУ",
            "PP_BATT_VCC": "3.8-4.2V от батареи",
            "PP3V0_NAND": "3.0V для памяти",
            "PP1V8_SDRAM": "1.8V для ОЗУ",
            "PP_CPU": "0.9-1.1V динамическое"
        },
        "procedure": [
            "1. Проверить напряжения на тестовых точках",
            "2. Если нет PP_VDD_MAIN - проверить Q1403 и U1401",
            "3. Проверить сопротивление на линии PP_CPU (норма 20-40 Ом)",
            "4. При замене: преднагрев плата 150°C, фен 350°C",
            "5. Обязательно заменить C1239, C1240 возле PMIC",
            "6. После установки проверить все выходные напряжения"
        ],
        "tools": "Паяльная станция, микроскоп, мультиметр, осциллограф",
        "difficulty": "Высокая",
        "time": "45-60 минут",
        "common_mistakes": [
            "Перегрев при демонтаже - отслоение дорожек",
            "Не проверены конденсаторы возле PMIC",
            "Неправильная ориентация микросхемы"
        ]
    },
    "338S00105": {
        "name": "Audio Codec iPhone 6S/7",
        "type": "Audio IC",
        "location": "U3500/U3101",
        "symptoms": [
            "Серый динамик при звонке",
            "Voice memo не запускается",
            "Bootloop после падения",
            "Нет звука в наушниках",
            "Siri не слышит голос"
        ],
        "test_points": {
            "PP1V8_AUDIO": "1.8V питание аудио",
            "CODEC_TO_AP_I2S": "Линии данных к процессору",
            "C12_PAD": "Проверить на обрыв (iPhone 7)",
            "FL3265": "Фильтр на линии микрофона"
        },
        "procedure": [
            "1. Для iPhone 7: обязательно проверить C12 pad на обрыв",
            "2. Если C12 оборван - делать джампер от площадки к via под IC",
            "3. Снятие: преднагрев 180°C, температура фена 340°C",
            "4. Очистить площадки, проверить целостность падов",
            "5. При установке использовать флюс Amtech 559",
            "6. После пайки: ультразвук 3 минуты в изопропиле",
            "7. Обязательно проверить FL3265, FL3266"
        ],
        "jumper_wire": {
            "from": "C12 pad",
            "to": "Via hole под микросхемой",
            "wire": "0.02mm эмалированный провод",
            "note": "Критично для iPhone 7 Audio IC disease"
        },
        "tools": "Термофен, микроскоп 45X, паяльник с жалом 0.2mm",
        "difficulty": "Очень высокая",
        "time": "60-90 минут"
    },
    "339S00043": {
        "name": "WiFi/BT Module",
        "type": "Wireless IC",
        "location": "U5200",
        "symptoms": [
            "WiFi кнопка серая",
            "Bluetooth не включается",
            "MAC адрес 02:00:00:00:00:00",
            "WiFi работает только рядом с роутером"
        ],
        "test_points": {
            "PP1V8_WLAN": "1.8V питание модуля",
            "WL_REG_ON": "Сигнал включения WiFi",
            "WLAN_DEVICE_WAKE": "Пробуждение модуля"
        },
        "procedure": [
            "1. Проверить антенные коннекторы J2118, J3801",
            "2. Измерить сопротивление антенных линий (норма 25 Ом)",
            "3. Проверить FL1119-FL1125 (фильтры питания)",
            "4. Замена: нанести флюс, прогрев 160°C",
            "5. Демонтаж при 330°C круговыми движениями",
            "6. Установка новой с BGA шариками 0.3mm",
            "7. После пайки проверить короткое замыкание"
        ],
        "bga_profile": {
            "preheat": "160°C 60 сек",
            "reflow": "330°C 40 сек",
            "cooling": "Естественное 120 сек"
        },
        "tools": "BGA станция, трафареты, шары 0.3mm",
        "difficulty": "Высокая",
        "time": "40-50 минут"
    },
    "U2700": {
        "name": "Tristar/Hydra USB Controller",
        "type": "Charging IC",
        "location": "U2700/U4500",
        "symptoms": [
            "Не заряжается с оригинального кабеля",
            "Заряжается только с одной стороны Lightning",
            "Сообщение 'Accessory not supported'",
            "Быстрый разряд батареи",
            "Греется при зарядке"
        ],
        "test_points": {
            "PP5V0_USB": "5V от зарядника",
            "TRISTAR_TO_TIGRIS": "Связь с Tigris",
            "D+/D-": "USB data линии"
        },
        "procedure": [
            "1. Проверить разъем Lightning на окисление",
            "2. Измерить напряжение PP5V0_USB при подключенном ЗУ",
            "3. Проверить FL11, FL12 возле разъема",
            "4. Снятие Tristar: 350°C, защитить окружающие компоненты",
            "5. Очистить площадку от старых шариков",
            "6. Новая микросхема обязательно с шариками",
            "7. После установки тест всех режимов зарядки",
            "8. Проверка USB синхронизации с iTunes"
        ],
        "prevention": "Использовать только оригинальные кабели",
        "tools": "Термофен, каптон лента, USB тестер",
        "difficulty": "Средняя",
        "time": "30-40 минут"
    },
    "CD3215": {
        "name": "USB-C Controller MacBook",
        "type": "USB-C PD Controller",
        "location": "U3100/U3200",
        "symptoms": [
            "Не заряжается ни с одного порта",
            "Заряжается только один порт USB-C",
            "20V присутствует но нет зарядки",
            "Kernel panic при подключении USB-C"
        ],
        "test_points": {
            "PP20V_USBC": "20V от адаптера",
            "PP3V3_G3H": "3.3V standby",
            "PPDCIN_G3H": "Вход питания к системе",
            "CC1/CC2": "Configuration channel"
        },
        "procedure": [
            "1. Проверить предохранители F3100, F3200",
            "2. Измерить PP20V_USBC на каждом порту",
            "3. Проверить SMC на наличие обновлений",
            "4. Демонтаж CD3215: защита CPU каптоном",
            "5. Температура 380°C, нижний подогрев 200°C",
            "6. Обязательно заменить все керамические конденсаторы вокруг",
            "7. После замены сброс SMC и NVRAM",
            "8. Тест с оригинальным адаптером 61W/87W"
        ],
        "firmware": "Может требовать прошивку через USB-C updater",
        "tools": "Инфракрасная паяльная станция, осциллограф",
        "difficulty": "Очень высокая",
        "time": "60-90 минут"
    },
    "TPS65730": {
        "name": "Display Power IC",
        "type": "Backlight Driver",
        "location": "U8300",
        "symptoms": [
            "Черный экран но есть изображение на свету",
            "Мерцание подсветки",
            "Подсветка работает 1 секунду и гаснет",
            "Линии на экране"
        ],
        "test_points": {
            "PP5V7_LCM_AVDDH": "5.7V для LCD",
            "PPVOUT_LCM": "Выход на подсветку",
            "LCM_BKL_EN": "Сигнал включения подсветки"
        },
        "procedure": [
            "1. Проверить шлейф дисплея на повреждения",
            "2. Измерить PP5V7_LCM_AVDDH (норма 5.7V)",
            "3. Проверить диоды D8301-D8306",
            "4. Проверить катушку L8323",
            "5. Замена TPS65730: температура 340°C",
            "6. После замены калибровка True Tone",
            "7. Тест на разных уровнях яркости"
        ],
        "calibration": "Требуется i2C программатор для True Tone",
        "tools": "Термофен, программатор JC Pro1000S",
        "difficulty": "Средняя",
        "time": "30-40 минут"
    }
}

# Добавляем процедуры восстановления Face ID
face_id_repair = {
    "face_id_dot_projector": {
        "title": "Восстановление Face ID - Dot Projector",
        "symptoms": [
            "Face ID недоступен",
            "Не работает Animoji",
            "Портретный режим без размытия"
        ],
        "diagnosis": [
            "Проверить целостность шлейфа",
            "3uTools тест Dot Projector",
            "Проверка flood illuminator"
        ],
        "repair_limitations": [
            "Dot Projector привязан к плате криптографически",
            "Замена только в паре с платой",
            "Возможна только пересадка с донора вместе с платой"
        ]
    },
    "touch_id_restoration": {
        "title": "Восстановление Touch ID",
        "iphone_7_8": [
            "Home button привязан к плате",
            "Замена только оригинальной парой",
            "Возможен ремонт шлейфа"
        ],
        "repair_options": [
            "Восстановление дорожек шлейфа",
            "Замена только механики кнопки",
            "JC programmer для копирования данных"
        ]
    }
}

# Схемы диагностики по симптомам
diagnostic_flowcharts = {
    "no_power": {
        "title": "Телефон не включается",
        "steps": [
            {
                "check": "Подключить к ЗУ, проверить ток",
                "if_yes": "Ток 0.00A -> проверить PMIC",
                "if_no": "Ток есть -> проверить батарею"
            },
            {
                "check": "PP_VDD_MAIN присутствует?",
                "if_yes": "Проверить PP_CPU",
                "if_no": "Заменить PMIC"
            },
            {
                "check": "Короткое замыкание на VDD_MAIN?",
                "if_yes": "Искать КЗ конденсаторы",
                "if_no": "Проверить NAND"
            }
        ]
    },
    "no_image": {
        "title": "Нет изображения",
        "steps": [
            {
                "check": "Подсветка работает?",
                "if_yes": "Проблема LCD или драйвер",
                "if_no": "Проверить backlight IC"
            },
            {
                "check": "Изображение видно на свету?",
                "if_yes": "Заменить backlight IC/диоды",
                "if_no": "Проверить шлейф/LCD"
            }
        ]
    },
    "no_charge": {
        "title": "Не заряжается",
        "steps": [
            {
                "check": "Проверить разъем на окисление",
                "if_yes": "Чистка/замена разъема",
                "if_no": "Проверить Tristar"
            },
            {
                "check": "PP5V0_USB присутствует?",
                "if_yes": "Проверить Tigris",
                "if_no": "Заменить Tristar"
            },
            {
                "check": "Ток зарядки присутствует?",
                "if_yes": "Проверить батарею/Gas gauge",
                "if_no": "Проверить PMIC"
            }
        ]
    }
}

# Обновляем существующие данные
for ic_code, details in detailed_procedures.items():
    if ic_code in ic_data:
        ic_data[ic_code].update(details)
    else:
        ic_data[ic_code] = details

# Добавляем Face ID в базу знаний
repair_knowledge["face_id_touch_id"] = {
    "face_id": face_id_repair["face_id_dot_projector"],
    "touch_id": face_id_repair["touch_id_restoration"]
}

# Добавляем диагностические схемы
repair_knowledge["diagnostic_flowcharts"] = diagnostic_flowcharts

# Детальная информация по платам MacBook
macbook_boards = {
    "820-00165": {
        "model": "MacBook Pro 13\" 2016-2017",
        "cpu": "Intel Core i5-6360U",
        "gpu": "Intel Iris 540",
        "ram": "LPDDR3 on board",
        "common_issues": [
            "CD3215 failure - не заряжается",
            "Вздутие батареи",
            "Flexgate - проблема шлейфа дисплея",
            "Отвал Touch Bar контроллера"
        ],
        "test_points": {
            "PPBUS_G3H": "12.6V главная шина",
            "PP3V3_G3H": "3.3V standby",
            "PP5V_G3S": "5V system",
            "PP3V3_S5": "3.3V system"
        },
        "repair_notes": "Часто проблема с CD3215, проверить оба порта USB-C"
    },
    "820-01987": {
        "model": "MacBook Pro 16\" 2019",
        "cpu": "Intel Core i7-9750H",
        "gpu": "AMD Radeon Pro 5300M",
        "ram": "DDR4 on board",
        "common_issues": [
            "Перегрев VRM",
            "Kernel panic от T2",
            "Проблемы с дискретной графикой",
            "Отказ порта Thunderbolt 3"
        ],
        "test_points": {
            "PPVCORE_GPU": "GPU core напряжение",
            "PP1V8_S0": "1.8V для периферии",
            "PP0V9_S0": "0.9V CPU core"
        },
        "repair_notes": "T2 chip может блокировать загрузку после ремонта"
    },
    "820-01700": {
        "model": "MacBook Air M1 2020",
        "cpu": "Apple M1",
        "gpu": "Apple M1 integrated",
        "ram": "Unified memory",
        "common_issues": [
            "Нет изображения после падения",
            "Жидкость на плате",
            "USB-C порт не работает",
            "Восстановление после DFU"
        ],
        "test_points": {
            "PP3V3_AON": "Always-on 3.3V",
            "PP1V8_AON": "Always-on 1.8V",
            "PPVBAT_G3H_CHGR": "Напряжение батареи"
        },
        "repair_notes": "M1 требует специальные инструменты Apple Configurator"
    }
}

# Добавляем типичные коды ошибок
error_codes = {
    "iphone_errors": {
        "9": "Ошибка прошивки - проверить NAND",
        "14": "Проблема с baseband или NAND",
        "21": "Baseband или батарея",
        "35": "Отсутствует память NAND",
        "40": "Проблема с NAND или CPU",
        "53": "Touch ID не соответствует плате",
        "56": "NFC или baseband проблема",
        "1669": "Compass IC проблема",
        "2009": "Проблема с памятью",
        "3503": "Проблема с датчиками",
        "4005": "Критическая ошибка прошивки",
        "4013": "Отвал NAND или проблема с кабелем",
        "4014": "Плохое соединение или отвал CPU"
    },
    "panic_codes": {
        "panic-full": "Переполнение логов kernel panic",
        "watchdog timeout": "Зависание процесса",
        "i2c0 bus error": "Проблема с датчиками",
        "thermalmonitord": "Перегрев",
        "missing sensor": "Отсутствует датчик",
        "smc failure": "Проблема с SMC (MacBook)"
    }
}

# Ремонт водных повреждений
water_damage_repair = {
    "immediate_actions": [
        "НЕ ВКЛЮЧАТЬ устройство",
        "Извлечь батарею если возможно",
        "Слить видимую жидкость",
        "Не использовать фен или рис"
    ],
    "professional_repair": [
        "1. Разборка в течение 24 часов",
        "2. Промывка платы изопропиловым спиртом 99%",
        "3. Ультразвуковая ванна 5-10 минут",
        "4. Проверка под микроскопом на коррозию",
        "5. Замена корродированных компонентов",
        "6. Проверка всех разъемов и шлейфов",
        "7. Сушка платы 60°C в течение 2 часов",
        "8. Проверка изоляции всех цепей питания"
    ],
    "common_failures_after_water": [
        "Backlight IC - сразу или через время",
        "Touch IC - потеря тача",
        "Audio IC - проблемы со звуком",
        "Charging IC - не заряжается",
        "Коррозия под BGA микросхемами"
    ],
    "inspection_points": [
        "Индикаторы влаги (LCI)",
        "Разъемы (особенно Lightning/USB-C)",
        "Под экранирующими крышками",
        "Возле батарейного коннектора",
        "Power Management IC область"
    ]
}

# Инструменты и расходники
tools_and_supplies = {
    "essential_tools": {
        "Микроскоп": "Минимум 45X для SMD работы",
        "Паяльная станция": "Quick 861DW или Accta 301",
        "Паяльник": "TS100/TS80 с жалами B2, D24",
        "Мультиметр": "Fluke 15B+ или UNI-T UT61E",
        "Осциллограф": "Rigol DS1054Z для диагностики",
        "USB тестер": "Power-Z для проверки зарядки",
        "Термопистолет": "Quick 857DW+ или Yihua 8786D"
    },
    "supplies": {
        "Флюс": "Amtech 559, NC-223, Kingbo RMA-218",
        "Припой": "Sn63/Pb37 0.6mm, низкотемпературный 138°C",
        "BGA шары": "0.2mm, 0.25mm, 0.3mm, 0.35mm leaded",
        "Медная оплетка": "2.0mm, 2.5mm, 3.0mm",
        "Изопропанол": "99% для промывки",
        "Каптон лента": "Для защиты компонентов",
        "УФ маска": "MECHANIC LY-UVH900 для дорожек",
        "Джамперы": "0.02mm эмалированный провод"
    },
    "bga_rework": {
        "Трафареты": "iPhone 6-14 набор, MacBook набор",
        "BGA станция": "Achi IR-6500 или Jovy RE-8500",
        "Держатели плат": "Универсальные с регулировкой",
        "Reballing kit": "Набор для реболлинга"
    }
}

# Обновляем repair_knowledge
repair_knowledge["error_codes"] = error_codes
repair_knowledge["water_damage"] = water_damage_repair
repair_knowledge["tools_supplies"] = tools_and_supplies
repair_knowledge["macbook_boards"] = macbook_boards

# Обновляем devices.json с типичными проблемами
typical_device_issues = {
    "iPhone 6": [
        "Touch IC disease - серые полосы",
        "Бендгейт - отвал touch IC",
        "Проблемы с GPS антенной",
        "Быстрый разряд батареи"
    ],
    "iPhone 6S": [
        "Неожиданные выключения",
        "Audio IC проблемы",
        "Поиск сети после замены экрана"
    ],
    "iPhone 7": [
        "Audio IC disease - bootloop",
        "Baseband отвал - no service",
        "Home button не работает после замены"
    ],
    "iPhone 8": [
        "Отвал Audio IC от падения",
        "Проблемы с NFC",
        "Разбитое заднее стекло"
    ],
    "iPhone X": [
        "Sandwich board расслоение",
        "Face ID отказ после падения",
        "Зеленая линия на экране"
    ],
    "iPhone 11": [
        "Проблемы с ночным режимом камеры",
        "Ghost touch после замены экрана",
        "Отвал модуля UWB"
    ],
    "iPhone 12": [
        "No service после обновления",
        "Проблемы с 5G модемом",
        "MagSafe не работает"
    ]
}

# Обновляем устройства
for device in devices_data:
    model = device.get("model", "")
    for issue_model, issues in typical_device_issues.items():
        if issue_model in model:
            device["typical_issues"] = issues
            device["repair_difficulty"] = "Высокая" if "IC" in str(issues) else "Средняя"
            break

# Добавляем shortcuts для быстрой диагностики
quick_tests = {
    "battery_test": {
        "tools": "3uTools, CoconutBattery",
        "check": [
            "Количество циклов < 500",
            "Capacity > 80%",
            "Voltage 3.7-4.2V",
            "No Service Needed - статус"
        ]
    },
    "display_test": {
        "check": [
            "3D Touch давление",
            "True Tone работает",
            "Яркость на максимум",
            "Проверка битых пикселей"
        ]
    },
    "camera_test": {
        "check": [
            "OIS стабилизация",
            "Автофокус скорость",
            "Вспышка яркость",
            "Portrait mode blur"
        ]
    }
}

repair_knowledge["quick_tests"] = quick_tests

# Сохраняем обновленные данные
save_json(ic_data, 'public/data/ic_compatibility.json')
save_json(repair_knowledge, 'public/data/repair_knowledge.json')
save_json(devices_data, 'public/data/devices.json')

print("✅ Детальные процедуры ремонта добавлены")
print("✅ База знаний расширена полными инструкциями")
print("✅ Добавлены тест-поинты и схемы диагностики")
print("✅ Обновлена информация по инструментам и расходникам")