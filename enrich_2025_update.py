#!/usr/bin/env python3
"""
Обогащение базы данных Apple Intake Desk - Январь 2025
Источники: iFixit, Rossmann Forums, DIYFixTool, TechInsights, Repair.Wiki
"""

import json
import os
from datetime import datetime

# Пути к файлам
DATA_DIR = "/home/user/webapp/public/data"
IC_FILE = os.path.join(DATA_DIR, "ic_compatibility.json")
DEVICES_FILE = os.path.join(DATA_DIR, "devices.json")

# ============================================================
# НОВЫЕ ДАННЫЕ: iPhone 15/16 Pro компоненты (iFixit Chip ID)
# ============================================================

IPHONE_15_PRO_MAX_CHIPS = {
    "processor": {
        "main": "Apple APL1V02 / 339S01257 A17 Pro",
        "cores": "6 (2 performance + 4 efficiency)",
        "gpu": "6-core GPU",
        "neural_engine": "16-core Neural Engine",
        "process": "TSMC 3nm",
        "ram": "8GB LPDDR5 (SK hynix H58G66AK6HX132)"
    },
    "modem": {
        "main": "Qualcomm SDX70M (Snapdragon X70)",
        "type": "5G modem",
        "bands": "Sub-6GHz + mmWave"
    },
    "power_management": [
        {"chip": "Apple APL109A / 338S01022", "function": "Main PMIC"},
        {"chip": "STMicroelectronics STCPM1A3", "function": "Power management"},
        {"chip": "STMicroelectronics STB605A11", "function": "Power management"},
        {"chip": "Apple 338S00946-B0", "function": "Power management"},
        {"chip": "Apple 338S00616", "function": "Power management"},
        {"chip": "Qualcomm PMX65", "function": "RF PMIC"}
    ],
    "charging": {
        "main": "Texas Instruments SN2012017",
        "type": "Battery charger",
        "usb_c": True
    },
    "audio": [
        {"chip": "Apple 338S00739", "function": "Audio CODEC"},
        {"chip": "Apple 338S00537", "function": "Audio amplifier"}
    ],
    "wireless": {
        "wifi_bt": "Apple 339S01232 WiFi & Bluetooth module",
        "uwb": "Apple 339M00298 UWB Module",
        "nfc": "NXP Semiconductor NFC controller"
    },
    "rf_components": [
        {"chip": "Qualcomm SDR735", "function": "RF transceiver"},
        {"chip": "Qualcomm SMR546", "function": "RF transceiver"},
        {"chip": "Qualcomm QET7100", "function": "Wideband envelope tracker"},
        {"chip": "Broadcom AFEM-8234", "function": "Front-end module"},
        {"chip": "Skyworks SKY58440-11", "function": "Front-end module"},
        {"chip": "Qorvo QM76305", "function": "Front-end module"},
        {"chip": "Broadcom AFEM-8245", "function": "Front-end module"}
    ],
    "display": {
        "driver": "Texas Instruments TPS65657B0",
        "function": "Display power supply"
    },
    "storage": {
        "nand": "Kioxia K5A4RB6302CA12304 256GB",
        "type": "NAND flash"
    },
    "wireless_charging": {
        "chip": "Broadcom BCM59365EA1IUBG",
        "function": "Wireless power receiver"
    },
    "sensors": {
        "motion": "Bosch Sensortec 6-axis MEMS accelerometer & gyroscope"
    },
    "security": {
        "esim": "STMicroelectronics ST33J",
        "function": "Secure microcontroller / eSIM"
    },
    "flash": {
        "chip": "Texas Instruments LM3567A1",
        "function": "Flash controller"
    },
    "nor_flash": {
        "chip": "Winbond W25Q80DVUXIE",
        "size": "1 MB",
        "function": "Serial NOR flash memory"
    }
}

IPHONE_16_PRO_CHIPS = {
    "processor": {
        "main": "Apple APL1V07 / 339S01527 A18 Pro",
        "cores": "6 (2 performance + 4 efficiency)",
        "gpu": "6-core GPU",
        "neural_engine": "16-core Neural Engine",
        "process": "TSMC 3nm (2nd gen)",
        "ram": "Micron MT62F1G64D4AQ-031 XT:C LPDDR5X SDRAM"
    },
    "modem": {
        "main": "Qualcomm SDX71M-000",
        "type": "5G modem",
        "bands": "Sub-6GHz + mmWave"
    },
    "power_management": [
        {"chip": "Apple APL109A / 338S01119", "function": "Main PMIC"},
        {"chip": "STMicroelectronics STPMIA3C", "function": "Power management"},
        {"chip": "Apple 338S00616", "function": "DC-DC converter"},
        {"chip": "Apple 338S01026-B1", "function": "Power management"},
        {"chip": "Qualcomm PMX65-000", "function": "RF PMIC"},
        {"chip": "Cirrus Logic 338S00843", "function": "Power management"}
    ],
    "charging": {
        "main": "Texas Instruments SN2012027",
        "type": "USB type-C controller",
        "battery_charger": "Texas Instruments CP3200B1G0",
        "usb_c": True,
        "usb_pd": "3.1"
    },
    "audio": [
        {"chip": "Cirrus Logic 338S00967", "function": "Audio codec"},
        {"chip": "Cirrus Logic 338S01087", "function": "Audio amplifier (x2)"}
    ],
    "wireless": {
        "wifi_bt": "USI 339S01464 Bluetooth & WiFi Module",
        "uwb": "USI 339M00326 UWB module",
        "nfc": "NXP Semiconductors NFC controller"
    },
    "rf_components": [
        {"chip": "Qualcomm SDR735-001", "function": "RF transceiver"},
        {"chip": "Qualcomm SMR546-002", "function": "IF transceiver"},
        {"chip": "Qualcomm QET7100-001", "function": "Wideband envelope tracker"},
        {"chip": "Broadcom AFEM-8234", "function": "Front-end module"},
        {"chip": "Skyworks SKY58440-11", "function": "Front-end module"},
        {"chip": "Qorvo QM76307", "function": "Front-end module"},
        {"chip": "Qorvo QM76306", "function": "Front-end module"}
    ],
    "display": {
        "driver": "Texas Instruments TPS65657B0",
        "function": "Display power supply"
    },
    "storage": {
        "nand": "Kioxia K5A3RF9864 128GB",
        "type": "NAND flash"
    },
    "wireless_charging": {
        "chip": "Broadcom BCM59367A1",
        "function": "Wireless charging controller"
    },
    "sensors": {
        "motion": "Bosch Sensortec accelerometer & gyroscope",
        "adc": "Analog Devices MAX11390A analog to digital converter"
    },
    "security": {
        "esim": "STMicroelectronics ST33J",
        "function": "eSIM/secure element"
    },
    "flash": {
        "chip": "Texas Instruments LM3567A1",
        "function": "LED flash driver"
    },
    "nor_flash": {
        "chip": "GigaDevice GD25Q80E",
        "size": "1 MB",
        "function": "Serial NOR flash memory"
    },
    "battery_frontend": {
        "chip": "Texas Instruments TPS61280H",
        "function": "Battery front-end DC-DC converter"
    }
}

# ============================================================
# НОВЫЕ ДАННЫЕ: USB-C контроллеры (CD3217 серия)
# ============================================================

USB_C_CONTROLLERS = {
    "CD3217B12": {
        "name": "CD3217B12 (USB-C Controller)",
        "manufacturer": "Texas Instruments",
        "designation": "U3100",
        "package": "BGA 64-ball",
        "functions": [
            "USB-C Power Delivery",
            "USB 3.1 Gen 2 контроль",
            "Зарядка до 140W",
            "Data role swap"
        ],
        "devices": [
            "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
            "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
            "iPad Pro M2/M4", "iPad Air M2",
            "MacBook Air M1/M2/M3", "MacBook Pro M1/M2/M3"
        ],
        "common_issues": [
            "No charge / No power",
            "USB-C not recognized",
            "No data transfer",
            "Baseband failure (связь с модемом)",
            "Перегрев при зарядке"
        ],
        "repair_notes": "Критический чип для USB-C устройств. Часто требует прошивки после замены. Использовать JCID V1S Pro.",
        "price_range": "$8-20",
        "aliexpress": "https://www.aliexpress.com/w/wholesale-CD3217B12.html",
        "donor_models": [
            {"model": "iPhone 15", "years": "2023", "difficulty": "Сложная"},
            {"model": "iPad Pro 11\" M2", "years": "2022", "difficulty": "Очень сложная"}
        ]
    },
    "SN2012027": {
        "name": "SN2012027 (USB-C Controller iPhone 16)",
        "manufacturer": "Texas Instruments",
        "designation": "U3100",
        "functions": [
            "USB Type-C controller",
            "USB PD 3.1",
            "Быстрая зарядка",
            "Data transfer"
        ],
        "devices": ["iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max"],
        "price_range": "$10-25",
        "repair_notes": "Новый контроллер для iPhone 16 серии. Требует калибровки."
    },
    "CP3200B1G0": {
        "name": "CP3200B1G0 (Battery Charger)",
        "manufacturer": "Texas Instruments",
        "designation": "U3200",
        "functions": [
            "Battery charging control",
            "OVP/OCP protection",
            "Thermal management"
        ],
        "devices": ["iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max"],
        "price_range": "$8-18"
    }
}

# ============================================================
# НОВЫЕ ДАННЫЕ: Qualcomm 5G модемы
# ============================================================

QUALCOMM_MODEMS = {
    "SDX70M": {
        "name": "Qualcomm Snapdragon X70 (SDX70M)",
        "type": "5G Modem-RF System",
        "process": "4nm",
        "devices": [
            "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max"
        ],
        "features": [
            "5G Sub-6 + mmWave",
            "AI-based modem",
            "Smart Transmit 3.0",
            "Dual SIM Dual Active"
        ],
        "common_issues": [
            "No Service / Searching",
            "No IMEI",
            "No Modem Firmware",
            "Weak signal / Dropping calls",
            "SIM not detected"
        ],
        "diagnosis": [
            "Проверить *#06# - должен показать IMEI",
            "Settings > General > About - Modem Firmware должен быть",
            "Диагностика: отсутствие modem firmware = baseband CPU failure",
            "Проверить RF кабели и антенны"
        ],
        "repair_difficulty": "Очень сложная",
        "price_range": "$50-150 (reballing/замена)"
    },
    "SDX71M": {
        "name": "Qualcomm Snapdragon X71 (SDX71M-000)",
        "type": "5G Modem-RF System",
        "process": "4nm (enhanced)",
        "devices": [
            "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max"
        ],
        "features": [
            "5G Sub-6 + mmWave enhanced",
            "AI-based modem v2",
            "Improved power efficiency",
            "Better signal reception"
        ],
        "common_issues": [
            "No Service / Searching",
            "No IMEI",
            "No Modem Firmware",
            "eSIM activation issues"
        ]
    }
}

# ============================================================
# НОВЫЕ ДАННЫЕ: Face ID компоненты
# ============================================================

FACE_ID_COMPONENTS = {
    "dot_projector": {
        "name": "Dot Projector",
        "function": "Проецирует 30,000+ инфракрасных точек на лицо",
        "issues": [
            "Face ID unavailable",
            "Move iPhone a little higher/lower",
            "Face ID не настраивается"
        ],
        "repair": {
            "difficulty": "Экстремально сложная",
            "requires": [
                "QianLi iCopy Plus",
                "Микроскоп 40x+",
                "Специальный паяльник для micro BGA"
            ],
            "procedure": [
                "1. Снять Dot Projector с поврежденного flex",
                "2. Очистить под микроскопом",
                "3. Припаять на новый QianLi flex",
                "4. Калибровка через специальный софт"
            ],
            "success_rate": "60-70%",
            "notes": "Paired to CPU. Нельзя просто заменить на новый."
        }
    },
    "flood_illuminator": {
        "name": "Flood Illuminator",
        "function": "Инфракрасная подсветка для Face ID",
        "issues": [
            "Face ID не работает в темноте",
            "Proximity sensor не работает"
        ],
        "repair": {
            "difficulty": "Очень сложная",
            "procedure": [
                "1. Reballing Flood Illuminator",
                "2. Или перенос на donor flex",
                "3. Проверка proximity sensor"
            ]
        }
    },
    "ir_camera": {
        "name": "Infrared Camera",
        "function": "Захват IR изображения для Face ID",
        "repair_notes": "Можно заменить отдельно, не paired"
    },
    "models_support": {
        "iPhone X": "Face ID v1",
        "iPhone XR": "Face ID v1 (без Animoji depth)",
        "iPhone XS/XS Max": "Face ID v1",
        "iPhone 11 series": "Face ID v2 (широкий угол)",
        "iPhone 12 series": "Face ID v2 (меньший модуль)",
        "iPhone 13 series": "Face ID v2.1 (диагональный)",
        "iPhone 14 series": "Face ID v2.2",
        "iPhone 14 Pro/Pro Max": "Face ID + Dynamic Island",
        "iPhone 15 series": "Face ID + Dynamic Island",
        "iPhone 16 series": "Face ID + Dynamic Island v2"
    }
}

# ============================================================
# НОВЫЕ ДАННЫЕ: iTunes/Finder коды ошибок
# ============================================================

RESTORE_ERROR_CODES = {
    "error_9": {
        "code": 9,
        "meaning": "Device disconnected during restore",
        "hardware_causes": [
            "Неисправный USB кабель/порт",
            "Tristar/Hydra IC поврежден",
            "NAND flash failure",
            "Baseband CPU issue"
        ],
        "software_causes": [
            "Timeout при записи firmware",
            "Антивирус блокирует iTunes"
        ],
        "diagnosis": [
            "Попробовать другой кабель/порт/компьютер",
            "Восстановить без экрана (отключить дисплей)",
            "Проверить NAND на программаторе"
        ]
    },
    "error_14": {
        "code": 14,
        "meaning": "USB disconnect or firmware mismatch",
        "hardware_causes": [
            "NAND flash ошибка чтения/записи",
            "USB IC (Tristar) повреждение"
        ],
        "diagnosis": ["Аналогично error 9"]
    },
    "error_4005": {
        "code": 4005,
        "meaning": "Device timeout during restore",
        "hardware_causes": [
            "NAND timing issue",
            "Memory controller failure",
            "Logic board damage"
        ]
    },
    "error_4013": {
        "code": 4013,
        "meaning": "Device disconnected",
        "hardware_causes": [
            "NAND flash failure (80% случаев)",
            "Tristar IC damage",
            "Board-level short circuit",
            "Water damage корозия"
        ],
        "repair_approach": [
            "1. Попробовать restore без дисплея",
            "2. Проверить NAND через программатор JCID",
            "3. Reballing NAND",
            "4. Замена NAND (потеря данных)",
            "5. Проверить baseband PMIC"
        ]
    },
    "error_4014": {
        "code": 4014,
        "meaning": "Device timeout (similar to 4013)",
        "hardware_causes": [
            "NAND flash failure",
            "Memory controller",
            "Baseband issues"
        ],
        "notes": "Часто связано с sandwich board issues на iPhone X+"
    },
    "error_2001_2011": {
        "codes": "2001-2011",
        "meaning": "USB communication errors",
        "causes": [
            "Tristar IC failure",
            "USB port damage",
            "Lightning connector damage"
        ]
    },
    "error_40_53_56": {
        "codes": "40, 53, 56",
        "meaning": "Security / Hardware mismatch",
        "causes": [
            "Error 40: Заменен Audio IC без reballing (iPhone 7)",
            "Error 53: Touch ID mismatch (replaced home button)",
            "Error 56: NFC chip issue"
        ]
    },
    "error_1": {
        "code": 1,
        "meaning": "Hardware incompatible with firmware",
        "causes": [
            "Wrong firmware for device",
            "Modded firmware",
            "Baseband mismatch"
        ]
    },
    "error_(-1)": {
        "code": -1,
        "meaning": "Baseband update failure",
        "causes": [
            "Baseband CPU/PMIC failure",
            "RF section damage",
            "Antenna disconnected"
        ],
        "diagnosis": [
            "Проверить наличие IMEI (*#06#)",
            "Проверить Modem Firmware в настройках",
            "Если пусто - baseband hardware failure"
        ]
    }
}

# ============================================================
# НОВЫЕ ДАННЫЕ: MacBook M1/M2/M3 диагностика
# ============================================================

MACBOOK_APPLE_SILICON_DIAGNOSIS = {
    "m1_m2_m3_common_issues": {
        "no_power": {
            "symptoms": [
                "Не включается от кнопки",
                "Не заряжается",
                "MagSafe не светится",
                "USB-C не распознается"
            ],
            "diagnosis_steps": [
                "1. Проверить зарядку с оригинальным адаптером",
                "2. SMC reset: зажать power 10 сек",
                "3. Проверить USB-C порты визуально",
                "4. Подключить USB-C амперметр - ток должен быть",
                "5. Если нет тока - проблема с CD3217 или PMIC"
            ],
            "common_culprits": [
                "CD3217B12 USB-C controller (90% случаев)",
                "Liquid damage на USB-C порту",
                "Main PMIC failure"
            ]
        },
        "no_display": {
            "symptoms": [
                "Включается (звук), но экран черный",
                "Внешний монитор работает, встроенный нет"
            ],
            "diagnosis": [
                "Проверить яркость (F2)",
                "Shine flashlight - видно изображение = backlight failure",
                "NVRAM reset: Option+Command+P+R при загрузке"
            ]
        },
        "kernel_panic": {
            "symptoms": ["Restart notification", "Зависания"],
            "common_causes": [
                "RAM issue (не заменяется на M-чипах!)",
                "SSD controller failure",
                "Перегрев из-за термопасты"
            ]
        },
        "usb_c_issues": {
            "symptoms": [
                "Только один порт работает",
                "Зарядка работает, данные нет"
            ],
            "causes": [
                "CD3217B12 для этого порта поврежден",
                "Физическое повреждение порта"
            ]
        }
    },
    "diagnostic_codes": {
        "ADP000": "No issues found - все OK",
        "CNW001-CNW006": "WiFi/Bluetooth hardware issue",
        "CNB001-CNB004": "Bluetooth issue",
        "NDC001-NDC006": "Camera issue",
        "NDD001": "USB hardware issue",
        "NNN001": "Serial number not found",
        "PFM001-PFM007": "System Management Controller issue",
        "PFR001": "System firmware issue",
        "PPF001-PPF004": "Fan issue",
        "PPM001-PPM015": "Memory issue",
        "PPP001-PPP007": "Power adapter issue",
        "PPR001": "CPU issue",
        "PPT001-PPT007": "Battery issue",
        "VDC001-VDC007": "Graphics/display issue",
        "VFD001-VFD007": "Display issue",
        "VFF001": "Audio hardware issue",
        "SDC001": "SD Card reader issue"
    },
    "repair_limitations": {
        "not_repairable": [
            "RAM (встроена в чип)",
            "CPU (M1/M2/M3 - весь SoC)",
            "Neural Engine",
            "GPU"
        ],
        "board_level_only": [
            "CD3217 USB-C controllers",
            "SSD controller",
            "PMIC chips",
            "Audio codec"
        ],
        "user_replaceable": [
            "SSD (модульный на некоторых моделях)",
            "Battery (с инструментами)",
            "Display assembly",
            "Keyboard/TopCase"
        ]
    }
}

# ============================================================
# НОВЫЕ ДАННЫЕ: NAND программирование
# ============================================================

NAND_PROGRAMMING = {
    "programmers": {
        "JCID_P13": {
            "name": "JCID P13 NAND Programmer",
            "supported": "iPhone 8 - iPhone 13 Pro Max",
            "functions": [
                "Read/Write NAND",
                "SYSCFG repair",
                "WiFi unlock",
                "Bootcode reflash",
                "Purple mode fix"
            ],
            "price": "$150-300"
        },
        "JCID_P15": {
            "name": "JCID P15 NAND Programmer",
            "supported": "iPhone 14 - iPhone 16 series",
            "functions": [
                "Read/Write NAND",
                "SYSCFG repair",
                "iCloud bypass data save"
            ],
            "price": "$200-400"
        },
        "JCID_V1S_Pro": {
            "name": "JCID V1S Pro",
            "supported": "Universal iPhone/iPad",
            "modules": [
                "BGA70 (NAND iPhone 5-7)",
                "BGA110 (NAND iPhone 8-11)",
                "BGA315 (NAND iPhone 12+)"
            ],
            "additional": [
                "True Tone repair",
                "Face ID dot matrix repair",
                "Battery serial write",
                "Screen data repair"
            ],
            "price": "$80-150 (base) + modules"
        }
    },
    "common_nand_issues": {
        "error_4013_4014": "NAND timing/corruption",
        "purple_mode": "SYSCFG corrupted - need reflash",
        "boot_loop": "Bootcode or partition corruption",
        "no_storage": "NAND controller or chip failure"
    },
    "nand_compatibility": {
        "iPhone_12_13": ["Kioxia", "SK Hynix", "Samsung"],
        "iPhone_14_15": ["Kioxia", "SK Hynix"],
        "iPhone_16": ["Kioxia K5A3RF9864"]
    }
}

# ============================================================
# ОБНОВЛЕНИЕ Apple Watch данных
# ============================================================

APPLE_WATCH_UPDATE = {
    "Series_8": {
        "processor": "S8 SiP (Apple)",
        "display": "LTPO OLED Always-On",
        "common_issues": [
            "Battery drain after watchOS update",
            "Screen not responding to touch",
            "Won't turn on (red lightning bolt)",
            "GPS inaccuracy",
            "Heart rate sensor issues"
        ],
        "repair_difficulty": "Очень сложная - клей и плотная компоновка",
        "battery_replacement": "$79 Apple / $40-60 third party"
    },
    "Series_9": {
        "processor": "S9 SiP (Apple)",
        "features": ["Double Tap gesture", "Brighter display 2000 nits"],
        "common_issues": [
            "Battery drain",
            "Double Tap not working",
            "Display ghost touch"
        ],
        "repair_difficulty": "Очень сложная"
    },
    "Ultra_2": {
        "processor": "S9 SiP (Apple)",
        "features": ["Titanium case", "Action button", "Dual-frequency GPS"],
        "common_issues": [
            "Action button stuck",
            "GPS issues in mountains",
            "Crown rotation issues"
        ],
        "repair_difficulty": "Экстремально сложная - титановый корпус"
    }
}

# ============================================================
# ОБНОВЛЕНИЕ iPad данных
# ============================================================

IPAD_UPDATE = {
    "iPad_Pro_M2": {
        "processor": "Apple M2",
        "display": "Liquid Retina XDR (12.9\") / Liquid Retina (11\")",
        "charging": "USB-C (CD3217B12)",
        "common_issues": [
            "Ghost touch / phantom touches",
            "Face ID unavailable",
            "USB-C not charging",
            "Bent frame (из-за тонкости)",
            "Apple Pencil not pairing"
        ],
        "repair_notes": "Очень тонкий корпус - легко гнется"
    },
    "iPad_Pro_M4": {
        "processor": "Apple M4 (OLED модели)",
        "display": "Ultra Retina XDR OLED",
        "common_issues": [
            "Touch issues / dead zones",
            "Face ID calibration needed after screen repair",
            "USB-C port damage"
        ],
        "repair_notes": "OLED дисплей - дорогая замена. Face ID может потребовать калибровку."
    },
    "iPad_Air_M2": {
        "processor": "Apple M2",
        "common_issues": [
            "Battery drain",
            "Charging slow",
            "Magic Keyboard issues"
        ]
    }
}

def load_json(filepath):
    """Загрузить JSON файл"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def save_json(filepath, data, indent=2):
    """Сохранить JSON файл"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=indent)
        print(f"✅ Saved: {filepath}")
        return True
    except Exception as e:
        print(f"❌ Error saving {filepath}: {e}")
        return False

def update_ic_database():
    """Обновить базу микросхем"""
    print("\n📊 Обновление базы IC...")
    
    ic_data = load_json(IC_FILE)
    if not ic_data:
        ic_data = {"charging_ics": {}, "power_ics": {}, "audio_ics": {}}
    
    # Добавить USB-C контроллеры
    if "usb_c_controllers" not in ic_data:
        ic_data["usb_c_controllers"] = {}
    
    for chip_id, chip_data in USB_C_CONTROLLERS.items():
        ic_data["usb_c_controllers"][chip_id] = chip_data
        print(f"  + {chip_id}: {chip_data['name']}")
    
    # Добавить 5G модемы
    if "modems" not in ic_data:
        ic_data["modems"] = {}
    
    for modem_id, modem_data in QUALCOMM_MODEMS.items():
        ic_data["modems"][modem_id] = modem_data
        print(f"  + {modem_id}: {modem_data['name']}")
    
    # Добавить Face ID компоненты
    if "face_id" not in ic_data:
        ic_data["face_id"] = FACE_ID_COMPONENTS
        print("  + Face ID components database added")
    
    save_json(IC_FILE, ic_data)
    return ic_data

def create_iphone_16_data():
    """Создать данные для iPhone 15/16 серии"""
    
    iphone_16_pro = {
        "id": 200,
        "name": "iPhone 16 Pro",
        "model": "A3101, A3102, A3103, A3104",
        "year": 2024,
        "category": "iPhone",
        "processor": "Apple A18 Pro",
        "processor_family": "A18",
        "charging_ic": {
            "main": "SN2012027 (USB-C Controller)",
            "battery_charger": "CP3200B1G0",
            "location": "Рядом с USB-C портом",
            "voltage": "5V/9V/15V/20V",
            "current": "До 4.7A",
            "fast_charging": "27W USB-C PD",
            "usb_pd": "3.1",
            "aliexpress": "https://www.aliexpress.com/w/wholesale-SN2012027.html",
            "price_range": "$10-25"
        },
        "memory": {
            "nand": "Kioxia K5A3RF9864 128GB/256GB/512GB/1TB",
            "ram": "Micron LPDDR5X 8GB"
        },
        "power_ic": {
            "main": "Apple APL109A / 338S01119",
            "secondary": ["STPMIA3C", "338S00616", "338S01026-B1"],
            "rf_pmic": "Qualcomm PMX65-000"
        },
        "modem": {
            "chip": "Qualcomm SDX71M-000",
            "type": "5G Sub-6 + mmWave"
        },
        "audio_codec": {
            "main": "Cirrus Logic 338S00967",
            "amplifier": "Cirrus Logic 338S01087"
        },
        "wireless": {
            "wifi_bt": "USI 339S01464",
            "uwb": "USI 339M00326",
            "nfc": "NXP Semiconductors"
        },
        "common_issues": [
            "USB-C не заряжает",
            "No Service (5G modem issue)",
            "Face ID unavailable",
            "Перегрев при использовании камеры",
            "Батарея быстро разряжается",
            "Error 4013/4014 при восстановлении"
        ],
        "repair_difficulty": "Очень сложная",
        "repair_time": "2-4 часа",
        "tools_needed": [
            "Микроскоп 40x+",
            "BGA паяльная станция",
            "JCID V1S Pro / P15",
            "USB-C тестер",
            "Термовоздушная станция",
            "Изопропиловый спирт 99%"
        ],
        "board_numbers": ["TBD"],
        "documentation_links": {
            "ifixit": "https://www.ifixit.com/Device/iPhone_16_Pro",
            "chip_id": "https://www.ifixit.com/Guide/iPhone+16+Pro+Chip+ID/177358"
        }
    }
    
    iphone_15_pro_max = {
        "id": 199,
        "name": "iPhone 15 Pro Max",
        "model": "A2849, A3105, A3106, A3108",
        "year": 2023,
        "category": "iPhone",
        "processor": "Apple A17 Pro",
        "processor_family": "A17",
        "charging_ic": {
            "main": "SN2012017 (USB-C Controller)",
            "location": "USB-C разъем",
            "voltage": "5V/9V/15V/20V",
            "current": "До 4.7A",
            "fast_charging": "27W USB-C PD",
            "usb_pd": "3.0",
            "aliexpress": "https://www.aliexpress.com/w/wholesale-SN2012017.html",
            "price_range": "$8-20"
        },
        "memory": {
            "nand": "Kioxia K5A4RB6302CA12304 256GB/512GB/1TB",
            "ram": "SK hynix H58G66AK6HX132 8GB LPDDR5"
        },
        "power_ic": {
            "main": "Apple APL109A / 338S01022",
            "secondary": ["STCPM1A3", "STB605A11", "338S00946-B0", "338S00616"],
            "rf_pmic": "Qualcomm PMX65"
        },
        "modem": {
            "chip": "Qualcomm SDX70M (Snapdragon X70)",
            "type": "5G Sub-6 + mmWave"
        },
        "audio_codec": {
            "main": "Apple 338S00739",
            "amplifier": "Apple 338S00537"
        },
        "wireless": {
            "wifi_bt": "Apple 339S01232",
            "uwb": "Apple 339M00298",
            "nfc": "NXP Semiconductor"
        },
        "common_issues": [
            "USB-C не заряжает / не передает данные",
            "No Service (5G modem issue)",
            "Face ID unavailable",
            "Sandwich board delamination",
            "Перегрев при играх",
            "Error 4013/4014 при восстановлении"
        ],
        "repair_difficulty": "Очень сложная",
        "repair_time": "2-4 часа",
        "board_numbers": ["TBD"],
        "documentation_links": {
            "ifixit": "https://www.ifixit.com/Device/iPhone_15_Pro_Max",
            "chip_id": "https://www.ifixit.com/Guide/iPhone+15+Pro+Max+Chip+ID/165320"
        }
    }
    
    return [iphone_15_pro_max, iphone_16_pro]

def update_devices_database():
    """Обновить базу устройств"""
    print("\n📱 Обновление базы устройств...")
    
    devices = load_json(DEVICES_FILE)
    if not devices:
        devices = []
    
    # Проверить существующие ID
    existing_ids = {d.get('id', 0) for d in devices}
    existing_names = {d.get('name', '') for d in devices}
    
    # Добавить новые iPhone
    new_devices = create_iphone_16_data()
    added = 0
    
    for device in new_devices:
        if device['name'] not in existing_names:
            # Найти новый ID
            while device['id'] in existing_ids:
                device['id'] += 1
            existing_ids.add(device['id'])
            devices.append(device)
            print(f"  + {device['name']}")
            added += 1
    
    if added > 0:
        save_json(DEVICES_FILE, devices)
    
    print(f"  Добавлено устройств: {added}")
    return devices

def create_error_codes_database():
    """Создать базу кодов ошибок"""
    print("\n⚠️ Создание базы кодов ошибок...")
    
    error_data = {
        "itunes_restore_errors": RESTORE_ERROR_CODES,
        "mac_diagnostics": MACBOOK_APPLE_SILICON_DIAGNOSIS["diagnostic_codes"],
        "updated": datetime.now().isoformat()
    }
    
    error_file = os.path.join(DATA_DIR, "error_codes.json")
    save_json(error_file, error_data)
    return error_data

def create_macbook_diagnosis_database():
    """Создать базу диагностики MacBook"""
    print("\n💻 Создание базы диагностики MacBook M-series...")
    
    macbook_file = os.path.join(DATA_DIR, "macbook_diagnosis.json")
    save_json(macbook_file, MACBOOK_APPLE_SILICON_DIAGNOSIS)
    return MACBOOK_APPLE_SILICON_DIAGNOSIS

def create_nand_programming_database():
    """Создать базу NAND программирования"""
    print("\n💾 Создание базы NAND программирования...")
    
    nand_file = os.path.join(DATA_DIR, "nand_programming.json")
    
    # Загрузить существующую или создать новую
    existing = load_json(nand_file)
    if existing:
        existing.update(NAND_PROGRAMMING)
        data = existing
    else:
        data = NAND_PROGRAMMING
    
    data["updated"] = datetime.now().isoformat()
    save_json(nand_file, data)
    return data

def update_apple_watch_database():
    """Обновить базу Apple Watch"""
    print("\n⌚ Обновление базы Apple Watch...")
    
    watch_file = os.path.join(DATA_DIR, "apple_watch_database.json")
    
    existing = load_json(watch_file)
    if existing:
        if isinstance(existing, dict):
            existing.update(APPLE_WATCH_UPDATE)
        else:
            existing = APPLE_WATCH_UPDATE
    else:
        existing = APPLE_WATCH_UPDATE
    
    existing["updated"] = datetime.now().isoformat()
    save_json(watch_file, existing)
    return existing

def update_ipad_database():
    """Обновить базу iPad"""
    print("\n📱 Обновление базы iPad...")
    
    ipad_file = os.path.join(DATA_DIR, "ipad_database.json")
    
    existing = load_json(ipad_file)
    if existing:
        if isinstance(existing, dict):
            existing.update(IPAD_UPDATE)
        else:
            existing = IPAD_UPDATE
    else:
        existing = IPAD_UPDATE
    
    existing["updated"] = datetime.now().isoformat()
    save_json(ipad_file, existing)
    return existing

def create_chip_reference():
    """Создать полный справочник чипов iPhone 15/16"""
    print("\n🔧 Создание справочника чипов iPhone 15/16...")
    
    chip_ref = {
        "iPhone_15_Pro_Max": IPHONE_15_PRO_MAX_CHIPS,
        "iPhone_16_Pro": IPHONE_16_PRO_CHIPS,
        "source": "iFixit Chip ID Guide",
        "updated": datetime.now().isoformat()
    }
    
    chip_file = os.path.join(DATA_DIR, "iphone_chip_database.json")
    save_json(chip_file, chip_ref)
    return chip_ref

def main():
    """Главная функция обновления"""
    print("=" * 60)
    print("🍎 Apple Intake Desk - Обновление базы данных")
    print(f"📅 Дата: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 60)
    
    print("\n📂 Источники данных:")
    print("  • iFixit Chip ID (iPhone 15/16 Pro)")
    print("  • Rossmann Repair Forums")
    print("  • DIYFixTool / REWA Tech")
    print("  • Apple Support Documentation")
    print("  • Repair.Wiki")
    print("  • TechInsights Teardowns")
    
    # Выполнить обновления
    update_ic_database()
    update_devices_database()
    create_error_codes_database()
    create_macbook_diagnosis_database()
    create_nand_programming_database()
    update_apple_watch_database()
    update_ipad_database()
    create_chip_reference()
    
    print("\n" + "=" * 60)
    print("✅ Обновление завершено!")
    print("=" * 60)
    
    # Подсчитать размер данных
    total_size = 0
    for filename in os.listdir(DATA_DIR):
        if filename.endswith('.json'):
            filepath = os.path.join(DATA_DIR, filename)
            total_size += os.path.getsize(filepath)
    
    print(f"\n📊 Статистика:")
    print(f"  • Всего данных: {total_size / 1024:.1f} KB")
    print(f"  • Файлов JSON: {len([f for f in os.listdir(DATA_DIR) if f.endswith('.json')])}")

if __name__ == "__main__":
    main()
