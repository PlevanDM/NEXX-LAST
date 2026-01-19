#!/usr/bin/env python3
import json

def save_json(data, filepath):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_json(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return {}

# Apple Watch база данных
apple_watch_database = {
    "Series_1": {
        "model": "Apple Watch Series 1",
        "year": "2016",
        "cpu": "S1P dual-core",
        "board": "N27a",
        "common_issues": [
            "Battery swelling",
            "Screen detachment",
            "Force Touch failure"
        ],
        "chips": {
            "S1P": "System in Package",
            "WiFi_BT": "BCM43342",
            "NFC": "NXP 67V04",
            "PMIC": "338S00120"
        }
    },
    "Series_3": {
        "model": "Apple Watch Series 3",
        "year": "2017",
        "cpu": "S3 dual-core",
        "variants": ["GPS", "GPS + Cellular"],
        "chips": {
            "S3": "System in Package",
            "eSIM": "Embedded SIM (Cellular)",
            "PMIC": "338S00225"
        },
        "common_issues": [
            "Screen popping off",
            "Update failures",
            "GPS issues"
        ]
    },
    "Series_5": {
        "model": "Apple Watch Series 5",
        "year": "2019",
        "cpu": "S5 64-bit dual-core",
        "features": ["Always-On Display", "Compass"],
        "chips": {
            "S5": "System in Package",
            "U1": "Ultra Wideband chip",
            "Display": "LTPO OLED driver"
        }
    },
    "Series_7": {
        "model": "Apple Watch Series 7",
        "year": "2021",
        "cpu": "S7 SiP",
        "features": ["Larger display", "Fast charging"],
        "chips": {
            "S7": "System in Package",
            "U1": "Ultra Wideband",
            "Charging": "USB-C fast charge IC"
        }
    },
    "Ultra": {
        "model": "Apple Watch Ultra",
        "year": "2022",
        "cpu": "S8 SiP",
        "features": ["Dual frequency GPS", "Depth gauge", "Siren"],
        "chips": {
            "S8": "System in Package",
            "L1_L5_GPS": "Dual frequency",
            "Depth_sensor": "Water depth"
        },
        "repair_notes": [
            "Titanium case difficult to open",
            "Specialized tools required",
            "Very limited parts availability"
        ]
    }
}

# Остальные модели iPhone (iPhone 15, SE и т.д.)
additional_iphones = {
    "iPhone_SE_1st": {
        "model": "iPhone SE (1st gen)",
        "board": "N69",
        "year": "2016",
        "chips": {
            "CPU": "A9 APL0898",
            "PMIC": "338S00120",
            "Audio": "338S1285",
            "WiFi": "339S00043",
            "Touch_ID": "Encrypted to board"
        },
        "common_issues": [
            "Battery issues",
            "Home button failure",
            "Camera issues"
        ]
    },
    "iPhone_SE_2nd": {
        "model": "iPhone SE (2020)",
        "board": "D79",
        "year": "2020",
        "chips": {
            "CPU": "A13 Bionic",
            "PMIC": "338S00509",
            "Audio": "338S00537",
            "WiFi": "339S00647",
            "Haptic": "338S00450"
        }
    },
    "iPhone_SE_3rd": {
        "model": "iPhone SE (2022)",
        "board": "D49",
        "year": "2022",
        "chips": {
            "CPU": "A15 Bionic",
            "PMIC": "338S00770",
            "5G_Modem": "Qualcomm X57",
            "Audio": "338S00773"
        }
    },
    "iPhone_15": {
        "model": "iPhone 15",
        "board": "D37/D38",
        "year": "2023",
        "chips": {
            "CPU": "A16 Bionic (iPhone 15/15 Plus) / A17 Pro (15 Pro)",
            "PMIC": "338S00905",
            "USB-C": "Retimer IC",
            "5G": "Qualcomm X70",
            "Display": "Dynamic Island controller"
        },
        "new_features": [
            "USB-C port",
            "Dynamic Island all models",
            "Action button (Pro)",
            "Titanium (Pro)"
        ]
    }
}

# Полная база всех разъемов и их проблем
connector_issues = {
    "Lightning": {
        "pins": {
            "1": {"name": "GND", "test": "Continuity to ground"},
            "2": {"name": "L0p", "test": "No short to ground"},
            "3": {"name": "L0n", "test": "No short to ground"},
            "4": {"name": "ID0", "test": "Accessory detection"},
            "5": {"name": "PWR", "test": "5V when charging"},
            "6": {"name": "L1n", "test": "Data line"},
            "7": {"name": "L1p", "test": "Data line"},
            "8": {"name": "ID1", "test": "Accessory ID"}
        },
        "common_issues": {
            "Not_charging": [
                "Clean with isopropyl alcohol",
                "Check for bent pins",
                "Test Tristar/Hydra IC"
            ],
            "Accessory_not_supported": [
                "Tristar/Hydra failure",
                "Fake cable detection",
                "Pins 4 or 8 issue"
            ],
            "Charging_one_way": [
                "Pins bent on one side",
                "Partial Tristar failure"
            ]
        }
    },
    "USB-C": {
        "CC_pins": {
            "CC1": "Configuration Channel 1",
            "CC2": "Configuration Channel 2",
            "test": "5.1K pulldown resistor"
        },
        "power_delivery": {
            "5V": "Default USB power",
            "9V": "Fast charge tier 1",
            "15V": "Fast charge tier 2",
            "20V": "Max PD power"
        },
        "common_failures": [
            "CD3217 IC failure",
            "CC pin shorts",
            "Retimer IC issues",
            "Port physical damage"
        ]
    },
    "Battery_Connector": {
        "iPhone": {
            "pins": {
                "1": "BATT+ (3.7-4.2V)",
                "2": "SWI (Battery data)",
                "3": "NTC (Temperature)",
                "4": "GND"
            },
            "issues": {
                "Not_detected": "Check SWI line",
                "Temperature_error": "NTC thermistor",
                "Not_charging": "Check BATT+ voltage"
            }
        }
    },
    "Display_Connectors": {
        "iPhone_X_later": {
            "flex_count": 2,
            "connectors": ["Display", "Touch/Digitizer"],
            "common_issues": {
                "No_touch": "Digitizer flex",
                "No_image": "Display flex",
                "Lines_on_screen": "Flex damage"
            }
        },
        "testing": {
            "procedure": [
                "Check connector for bent pins",
                "Test with known good display",
                "Check for tears in flex"
            ]
        }
    }
}

# Расширенная база по жидкостным повреждениям
liquid_damage_guide = {
    "indicators": {
        "LCI_locations": {
            "iPhone": [
                "SIM tray (red = triggered)",
                "Inside charging port",
                "Under screen connectors"
            ],
            "MacBook": [
                "Under keyboard",
                "Logic board corners",
                "Near USB-C ports"
            ]
        }
    },
    "corrosion_types": {
        "green_corrosion": {
            "cause": "Copper oxidation",
            "location": "PCB traces, vias",
            "repair": "Scrape and coat with UV mask"
        },
        "white_residue": {
            "cause": "Flux or mineral deposits",
            "location": "Around chips",
            "repair": "Clean with isopropyl"
        },
        "black_pads": {
            "cause": "Severe corrosion",
            "location": "Connector pads",
            "repair": "Scrape and re-tin"
        }
    },
    "cleaning_process": {
        "step_1": {
            "action": "Disassemble completely",
            "time": "Immediately",
            "tools": "Proper screwdrivers"
        },
        "step_2": {
            "action": "Remove shields",
            "reason": "Liquid trapped under",
            "caution": "Don't bend shields"
        },
        "step_3": {
            "action": "Brush with isopropyl 99%",
            "tool": "Soft brush",
            "focus": "All connectors and chips"
        },
        "step_4": {
            "action": "Ultrasonic bath",
            "solution": "99% isopropyl or branson EC",
            "time": "3-5 minutes",
            "temp": "40°C"
        },
        "step_5": {
            "action": "Dry thoroughly",
            "method": "Compressed air then heat",
            "temp": "60°C for 2 hours"
        }
    },
    "common_failures_after_liquid": {
        "immediate": [
            "Short circuits",
            "No power",
            "Display issues"
        ],
        "delayed": [
            "Backlight IC failure (weeks later)",
            "Touch IC issues",
            "Audio IC problems",
            "Camera failures",
            "Face ID loss"
        ]
    }
}

# Специальные инструменты и их коды
specialized_tools = {
    "programmers": {
        "JC_V1SE": {
            "functions": [
                "True Tone repair",
                "Battery health reset",
                "Screen color restoration",
                "Ambient light repair"
            ],
            "supported": "iPhone 7-14",
            "price": "$45"
        },
        "Qianli_iCopy_Plus_2.2": {
            "functions": [
                "Screen True Tone",
                "Battery data",
                "Vibrator",
                "Home button (restore function, not Touch ID)"
            ],
            "price": "$159"
        },
        "JC_P13": {
            "functions": [
                "NAND upgrade",
                "Unbind WiFi",
                "Syscfg editing"
            ],
            "supported": "iPhone 6-13",
            "price": "$89"
        }
    },
    "diagnostic_tools": {
        "3uTools": {
            "platform": "Windows",
            "functions": [
                "Battery health",
                "Component verification",
                "Activation status",
                "Flash/JB"
            ],
            "free": True
        },
        "iMazing": {
            "platform": "Mac/Windows",
            "functions": [
                "Diagnostics",
                "Backup management",
                "Crash logs"
            ],
            "price": "$44.99"
        },
        "Apple_Configurator_2": {
            "platform": "Mac only",
            "functions": [
                "DFU restore",
                "Revive device",
                "Configure profiles"
            ],
            "free": True
        }
    },
    "microscope_cameras": {
        "Andonstar_AD407": {
            "resolution": "1080P",
            "magnification": "270X",
            "screen": "7 inch",
            "price": "$200"
        },
        "HAYEAR_4K": {
            "resolution": "4K",
            "interface": "HDMI/USB",
            "magnification": "180X",
            "price": "$350"
        }
    }
}

# Сохраняем все новые данные
save_json(apple_watch_database, 'public/data/apple_watch_database.json')
save_json(additional_iphones, 'public/data/additional_iphones.json')
save_json(connector_issues, 'public/data/connector_issues.json')
save_json(liquid_damage_guide, 'public/data/liquid_damage_guide.json')
save_json(specialized_tools, 'public/data/specialized_tools.json')

# Обновляем основные базы
devices = load_json('public/data/devices.json')

# Добавляем новые iPhone модели
new_devices = [
    {
        "id": 2001,
        "name": "iPhone SE (2016)",
        "model": "iPhone SE (A1662/A1723)",
        "year": "2016",
        "category": "iPhone",
        "processor": "A9",
        "board_numbers": ["N69"]
    },
    {
        "id": 2002,
        "name": "iPhone SE (2020)",
        "model": "iPhone SE 2nd Gen (A2275/A2296)",
        "year": "2020",
        "category": "iPhone",
        "processor": "A13 Bionic",
        "board_numbers": ["D79"]
    },
    {
        "id": 2003,
        "name": "iPhone SE (2022)",
        "model": "iPhone SE 3rd Gen (A2595/A2782)",
        "year": "2022",
        "category": "iPhone",
        "processor": "A15 Bionic",
        "board_numbers": ["D49"]
    },
    {
        "id": 2004,
        "name": "iPhone 15",
        "model": "iPhone 15 (A2846/A3089)",
        "year": "2023",
        "category": "iPhone",
        "processor": "A16 Bionic",
        "board_numbers": ["D37"],
        "common_issues": [
            "USB-C port issues",
            "Dynamic Island software bugs",
            "Overheating with iOS 17"
        ]
    },
    {
        "id": 2005,
        "name": "iPhone 15 Pro",
        "model": "iPhone 15 Pro (A2848/A3101)",
        "year": "2023",
        "category": "iPhone",
        "processor": "A17 Pro",
        "board_numbers": ["D38"],
        "common_issues": [
            "Titanium frame scratches",
            "Action button failures",
            "Thermal throttling"
        ]
    }
]

devices.extend(new_devices)
save_json(devices, 'public/data/devices.json')

print("✅ Добавлена база Apple Watch")
print("✅ Добавлены все модели iPhone SE")
print("✅ Добавлен iPhone 15 серия")
print("✅ Добавлены проблемы разъемов")
print("✅ Добавлен гид по жидкостным повреждениям")
print("✅ Добавлены специализированные инструменты")