#!/usr/bin/env python3
import json
import os

def save_json(data, filepath):
    """Сохраняет данные в JSON файл"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_json(filepath):
    """Загружает JSON файл"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return {}

# База данных iPad с полными техническими данными
ipad_database = {
    "iPad_Air_2": {
        "model": "iPad Air 2",
        "board": "J81AP / J82AP",
        "year": "2014",
        "chips": {
            "CPU": {
                "marking": "APL1012 / A8X",
                "location": "U0201",
                "package": "PoP with 2GB RAM"
            },
            "PMIC": {
                "marking": "343S0583",
                "location": "U8100",
                "type": "Main Power Management"
            },
            "Touch_IC": {
                "marking": "343S0694 (Cumulus)",
                "location": "U2402",
                "type": "Touch Controller",
                "common_issue": "No touch after drop"
            },
            "Audio_Codec": {
                "marking": "338S1213",
                "location": "U3800",
                "type": "Cirrus Logic"
            },
            "WiFi_BT": {
                "marking": "339S0213",
                "location": "U6800",
                "type": "BCM4354"
            },
            "Backlight": {
                "marking": "LP8550",
                "location": "U8200",
                "type": "Backlight Driver"
            },
            "NAND": {
                "marking": "Various",
                "sizes": ["16GB", "32GB", "64GB", "128GB"]
            }
        },
        "test_points": {
            "PP_VDD_MAIN": "4.3V",
            "PP5V0_USB": "5V",
            "PP3V3_ACC": "3.3V",
            "PP1V8": "1.8V"
        },
        "common_failures": [
            "Touch IC failure - no touch",
            "Backlight failure after water damage",
            "Charging port failure"
        ]
    },
    "iPad_Pro_10.5": {
        "model": "iPad Pro 10.5",
        "board": "J207AP / J208AP",
        "year": "2017",
        "chips": {
            "CPU": {
                "marking": "APL1071 / A10X Fusion",
                "location": "U1000",
                "package": "PoP with 4GB RAM"
            },
            "PMIC": {
                "marking": "343S00203",
                "location": "U8000",
                "type": "Power Management"
            },
            "Touch_IC": {
                "marking": "343S00154 (Orion)",
                "location": "U4000",
                "type": "Touch Controller"
            },
            "Display_Timing": {
                "marking": "338S00267 (Sage)",
                "location": "U5600",
                "type": "Display Timing Controller"
            },
            "ProMotion": {
                "marking": "Custom Apple",
                "type": "120Hz Display Controller"
            }
        },
        "test_points": {
            "PP_BATT_VCC": "3.8V",
            "PP_VDD_MAIN": "4.35V",
            "PP3V0": "3.0V"
        },
        "common_failures": [
            "White spot on LCD",
            "Touch IC failure",
            "Charging IC failure"
        ]
    },
    "iPad_Pro_11_2018": {
        "model": "iPad Pro 11 (2018)",
        "board": "J317AP / J318AP",
        "year": "2018",
        "chips": {
            "CPU": {
                "marking": "APL1083 / A12X Bionic",
                "location": "Main Board",
                "package": "PoP with 4/6GB RAM"
            },
            "PMIC": {
                "marking": "338S00456",
                "location": "Power Board",
                "type": "Power Management"
            },
            "Touch_IC": {
                "marking": "343S00250 (Theia)",
                "location": "Touch Board",
                "type": "Touch Controller"
            },
            "USB-C": {
                "marking": "CD3217B12",
                "location": "U3100",
                "type": "USB-C Controller"
            },
            "Face_ID": {
                "marking": "Secure Enclave",
                "type": "Face ID Module"
            }
        },
        "test_points": {
            "PPVBAT": "3.8V",
            "PP5V_USB": "5-20V USB-C",
            "PP3V3": "3.3V"
        }
    },
    "iPad_Pro_12.9_M1": {
        "model": "iPad Pro 12.9 (2021)",
        "board": "J517AP / J518AP",
        "year": "2021",
        "chips": {
            "CPU": {
                "marking": "APL1103 / M1",
                "location": "Main SoC",
                "package": "Unified Memory Architecture"
            },
            "PMIC": {
                "marking": "338S00647",
                "location": "Power Management",
                "type": "Apple Custom PMIC"
            },
            "Thunderbolt": {
                "marking": "JHL8040R",
                "location": "U7700",
                "type": "Thunderbolt 3 Controller"
            },
            "miniLED": {
                "marking": "Custom Driver",
                "type": "miniLED Backlight Array"
            }
        },
        "test_points": {
            "PP_AON": "Always On Power",
            "PP_CPU": "Dynamic",
            "PP_GPU": "Dynamic"
        }
    }
}

# Схемы цепей питания и Boot Sequence
power_sequences = {
    "iPhone_boot_sequence": {
        "stages": [
            {
                "stage": "1. Button Press",
                "voltage": "BUTTON_TO_PMU",
                "description": "Power button signal to PMIC"
            },
            {
                "stage": "2. PMIC Activation",
                "voltage": "VDD_MAIN (4.2V)",
                "description": "Main power rail activation"
            },
            {
                "stage": "3. Clock Generation",
                "voltage": "32KHz + 19.2MHz",
                "description": "Crystal oscillators start"
            },
            {
                "stage": "4. Reset Sequence",
                "voltage": "PMU_TO_SOC_RESET_L",
                "description": "CPU reset release"
            },
            {
                "stage": "5. SecureROM",
                "voltage": "PP_CPU (0.9V)",
                "description": "BootROM execution"
            },
            {
                "stage": "6. iBoot",
                "voltage": "PP_GPU + PP_NAND",
                "description": "Bootloader loads"
            },
            {
                "stage": "7. Kernel",
                "voltage": "All rails active",
                "description": "iOS kernel boot"
            }
        ],
        "failure_points": {
            "No VDD_MAIN": "PMIC failure or short",
            "No clocks": "Crystal or oscillator failure",
            "Stuck at Apple logo": "NAND or kernel panic",
            "Boot loop": "Software corruption or hardware failure"
        }
    },
    "MacBook_boot_sequence": {
        "stages": [
            {
                "stage": "1. Power Button",
                "signal": "PWR_BTN_L to SMC",
                "voltage": "3.3V"
            },
            {
                "stage": "2. SMC Wake",
                "signal": "SMC_ONOFF_L",
                "voltage": "PP3V3_G3H active"
            },
            {
                "stage": "3. S5 to S4",
                "signal": "PM_DSW_PWRGD",
                "voltage": "PP5V_S5 + PP3V3_S5"
            },
            {
                "stage": "4. S4 to S3",
                "signal": "PM_SLP_S4_L",
                "voltage": "PP1V8_S3 + PP1V2_S3"
            },
            {
                "stage": "5. S3 to S0",
                "signal": "PM_SLP_S3_L",
                "voltage": "PPVCORE_S0 (CPU voltage)"
            },
            {
                "stage": "6. Display Init",
                "signal": "EDP_PANEL_PWR",
                "voltage": "PP_LCD_PANEL"
            }
        ],
        "power_states": {
            "G3": "Mechanical off",
            "S5": "Soft off",
            "S4": "Hibernate",
            "S3": "Sleep",
            "S0": "Active"
        }
    }
}

# DFU и коды ошибок
error_database = {
    "dfu_exit_codes": {
        "-1": "General error - check logs",
        "1": "Success - device restored",
        "2": "USB connection lost",
        "3": "Timeout waiting for device",
        "9": "NAND failure - likely hardware",
        "14": "Baseband failure",
        "21": "Battery or baseband issue",
        "35": "Can't find NAND chip",
        "40": "NAND or CPU issue",
        "53": "Touch ID mismatch",
        "56": "NFC or baseband failure",
        "1669": "Compass IC failure",
        "2009": "NAND memory issue",
        "3503": "Sensor failure (proximity/ambient)",
        "4005": "Critical restore failure",
        "4013": "Cable or NAND failure",
        "4014": "CPU communication failure",
        "-18": "Jailbreak detected"
    },
    "panic_strings": {
        "watchdog timeout": {
            "cause": "Process hung for >120s",
            "solution": "Check thermals, restore iOS"
        },
        "i2c0::_checkBusStatus": {
            "cause": "I2C sensor bus failure",
            "solution": "Check proximity flex, ambient light sensor"
        },
        "thermalmonitord": {
            "cause": "Overheating detected",
            "solution": "Check thermal sensors, replace thermal paste"
        },
        "kernel data abort": {
            "cause": "Memory corruption",
            "solution": "Test RAM, check for shorts"
        },
        "smc::smcReadKeyAction": {
            "cause": "SMC communication failure",
            "solution": "Check SMC, reset SMC, check sensors"
        },
        "gpu hang": {
            "cause": "GPU driver crash",
            "solution": "Check GPU voltages, thermal issues"
        }
    }
}

# Face ID и Touch ID компоненты
biometric_components = {
    "Face_ID": {
        "iPhone_X": {
            "dot_projector": "Encrypted to logic board",
            "flood_illuminator": "Can be replaced",
            "ir_camera": "Encrypted to logic board",
            "proximity_sensor": "Replaceable",
            "ambient_light": "Replaceable",
            "speaker": "Replaceable",
            "microphone": "Replaceable"
        },
        "repair_notes": [
            "Dot projector paired to board - cannot swap",
            "IR camera paired to board - cannot swap",
            "Only flood illuminator is repairable",
            "Any damage to dot projector = no Face ID"
        ]
    },
    "Touch_ID": {
        "iPhone_6_6S": {
            "sensor": "Encrypted to board",
            "controller": "On logic board",
            "flex_cable": "Can be repaired",
            "home_button": "Mechanical part replaceable"
        },
        "iPhone_7_8": {
            "sensor": "Encrypted with Secure Enclave",
            "haptic_engine": "Replaceable",
            "controller": "Integrated in A10/A11",
            "return_function": "Can be restored without Touch ID"
        },
        "repair_notes": [
            "Touch ID sensor paired at factory",
            "Screen replacement doesn't affect Touch ID",
            "Home button cable can be micro-soldered",
            "YMJ or JC programmers cannot restore Touch ID"
        ]
    }
}

# Совместимость камер
camera_compatibility = {
    "rear_cameras": {
        "iPhone_6_6Plus": {
            "resolution": "8MP",
            "compatible": ["iPhone 6", "iPhone 6 Plus"],
            "not_compatible": ["6S due to different connector"]
        },
        "iPhone_7_7Plus": {
            "resolution": "12MP",
            "compatible": ["Same model only"],
            "features": ["OIS", "Dual camera (Plus)"]
        },
        "iPhone_X_XS": {
            "resolution": "12MP dual",
            "compatible": ["X and XS interchangeable"],
            "note": "Requires reprogramming"
        },
        "iPhone_11_series": {
            "resolution": "12MP dual/triple",
            "compatible": ["Within same model"],
            "features": ["Ultra wide", "Night mode"]
        },
        "iPhone_12_13": {
            "resolution": "12MP",
            "compatible": ["12 and 12 Pro", "13 and 13 Pro"],
            "note": "ProRAW requires original camera"
        }
    },
    "front_cameras": {
        "group_1": ["iPhone 6", "iPhone 6 Plus"],
        "group_2": ["iPhone 6S", "iPhone 6S Plus"],
        "group_3": ["iPhone 7", "iPhone 7 Plus"],
        "group_4": ["iPhone X", "iPhone XS"],
        "group_5": ["iPhone 11", "iPhone 12 same size"]
    }
}

# Антенны и модемы
antenna_database = {
    "iPhone_modems": {
        "Qualcomm": {
            "MDM9625M": ["iPhone 6", "iPhone 6 Plus"],
            "MDM9635M": ["iPhone 6S", "iPhone 6S Plus"],
            "MDM9645M": ["iPhone 7 (A1660)", "iPhone 7 Plus (A1661)"],
            "SDX20M": ["iPhone XS", "iPhone XS Max"],
            "SDX55M": ["iPhone 12 series 5G"],
            "SDX60": ["iPhone 13 series 5G"],
            "SDX65": ["iPhone 14 series 5G"]
        },
        "Intel": {
            "PMB9943": ["iPhone 7 (A1778)", "iPhone 7 Plus (A1784)"],
            "PMB9948": ["iPhone 8", "iPhone 8 Plus"],
            "PMB9955": ["iPhone X"],
            "PMB9960": ["iPhone XR", "iPhone 11"]
        }
    },
    "antenna_locations": {
        "iPhone": {
            "diversity_antenna": "Top - GPS/WiFi/Bluetooth",
            "main_antenna": "Bottom - Cellular primary",
            "wifi_antenna": "Top flex cable",
            "nfc_antenna": "Back glass (8 and newer)"
        },
        "testing": {
            "cellular_test": "*3001#12345#* Field Test Mode",
            "wifi_test": "Check RSSI in WiFi settings",
            "bluetooth_test": "Range test with AirPods"
        }
    },
    "common_antenna_issues": {
        "No_Service": [
            "Check baseband PMU",
            "Verify antenna connections",
            "Test with known good antenna",
            "Check for board cracks near antenna pads"
        ],
        "Weak_Signal": [
            "Clean antenna contacts",
            "Check for corrosion",
            "Verify antenna spring contacts",
            "Test antenna with multimeter (25-50 ohm)"
        ]
    }
}

# SMD компоненты маркировки
smd_components = {
    "capacitors": {
        "tantalum": {
            "marking": "106 = 10uF, 107 = 100uF",
            "voltage": "A=10V, B=16V, C=25V, D=35V",
            "polarity": "Line indicates positive"
        },
        "ceramic": {
            "0201": "No marking",
            "0402": "No marking",
            "0603": "Sometimes marked",
            "0805": "Often marked with code"
        }
    },
    "resistors": {
        "marking_codes": {
            "01C": "10KΩ",
            "01B": "10Ω",
            "R001": "0.001Ω current sense",
            "2R2": "2.2Ω"
        }
    },
    "diodes": {
        "schottky": {
            "SS14": "1A 40V",
            "SS34": "3A 40V",
            "BAT54": "200mA 30V"
        },
        "zener": {
            "marking": "Voltage rating",
            "example": "5V1 = 5.1V zener"
        }
    },
    "mosfets": {
        "common_markings": {
            "AO": "Alpha & Omega Semi",
            "FD": "Fairchild/ON Semi",
            "SI": "Vishay Siliconix",
            "TI": "Texas Instruments"
        }
    }
}

# Температурные датчики
thermal_sensors = {
    "iPhone": {
        "battery_temp": {
            "location": "Battery connector",
            "type": "NTC thermistor",
            "normal_range": "20-45°C"
        },
        "board_temp": {
            "location": "Near CPU",
            "type": "Internal to SOC",
            "shutdown": ">85°C"
        },
        "display_temp": {
            "location": "Display assembly",
            "type": "NTC",
            "warning": ">60°C"
        }
    },
    "MacBook": {
        "sensors": [
            "CPU Die",
            "CPU Proximity",
            "GPU Die",
            "Memory Bank",
            "SSD",
            "Battery",
            "Palm Rest",
            "Trackpad"
        ],
        "fan_control": {
            "min_rpm": "1200-1800",
            "max_rpm": "5000-6000",
            "trigger": ">75°C CPU"
        }
    }
}

# Boot процессы для всех устройств
boot_sequences = {
    "A_series_chips": {
        "A8": {
            "SecureROM": "Boot ROM in silicon",
            "LLB": "Low Level Bootloader",
            "iBoot": "Main bootloader",
            "kernel": "XNU kernel"
        },
        "A10_and_newer": {
            "SecureROM": "Immutable boot ROM",
            "iBoot1": "First stage",
            "iBoot2": "Second stage with SEP",
            "kernel": "Kernel with KTRR"
        },
        "M1_M2": {
            "1stStage": "In SoC ROM",
            "iBoot1": "From NOR flash",
            "iBoot2": "From SSD",
            "kernel": "macOS XNU"
        }
    }
}

# Сохраняем все базы данных
save_json(ipad_database, 'public/data/ipad_database.json')
save_json(power_sequences, 'public/data/power_sequences.json')
save_json(error_database, 'public/data/error_database.json')
save_json(biometric_components, 'public/data/biometric_components.json')
save_json(camera_compatibility, 'public/data/camera_compatibility.json')
save_json(antenna_database, 'public/data/antenna_database.json')
save_json(smd_components, 'public/data/smd_components.json')
save_json(thermal_sensors, 'public/data/thermal_sensors.json')
save_json(boot_sequences, 'public/data/boot_sequences.json')

# Обновляем существующую базу устройств
devices = load_json('public/data/devices.json')
ic_data = load_json('public/data/ic_compatibility.json')

# Добавляем новые IC в базу
new_ics = {
    "343S0694": {
        "name": "Cumulus Touch IC",
        "type": "Touch Controller",
        "devices": ["iPad Air 2", "iPhone 6 Plus"],
        "location": "U2402",
        "symptoms": [
            "No touch response",
            "Ghost touch",
            "Touch works intermittently"
        ],
        "test_points": {
            "RESET_CONN_L": "1.8V",
            "AP_TO_TOUCH_CLK": "Check continuity",
            "TOUCH_TO_AP_INT": "1.8V"
        },
        "procedure": [
            "1. Check all touch connections to board",
            "2. Verify 5.1V and 5.7V boost circuits",
            "3. Reball or replace IC",
            "4. May require jumper wires for broken traces"
        ],
        "donor_boards": ["iPad Air 2 any capacity", "iPhone 6 Plus logic board"],
        "tools": "Hot air station 370°C, 0.02mm jumper wire",
        "difficulty": "Very High",
        "time": "60-90 minutes"
    },
    "343S00154": {
        "name": "Orion Touch IC",
        "type": "Touch Controller",
        "devices": ["iPad Pro 10.5", "iPad Pro 12.9 Gen 2"],
        "location": "U4000",
        "symptoms": [
            "No touch after screen replacement",
            "Touch stops working randomly",
            "Requires hard reset to restore touch"
        ],
        "test_points": {
            "SAGE_TO_ORION_CLK": "Check signal",
            "RESET_L": "1.8V when active"
        }
    },
    "338S00267": {
        "name": "Sage Display Timing Controller",
        "type": "Display Controller",
        "devices": ["iPad Pro 10.5", "iPad Pro 12.9"],
        "location": "U5600",
        "symptoms": [
            "No image but backlight works",
            "Image flickering",
            "Half screen display"
        ],
        "procedure": [
            "1. Check MIPI lanes continuity",
            "2. Verify timing controller voltages",
            "3. Replace if thermal damage visible"
        ]
    },
    "CD3217B12": {
        "name": "USB-C Controller",
        "type": "USB-C PD Controller",
        "devices": ["iPad Pro 2018", "MacBook Air M1"],
        "location": "U3100",
        "symptoms": [
            "Not charging",
            "USB-C accessories not recognized",
            "Charging only one orientation"
        ],
        "test_points": {
            "CC1": "Check for shorts",
            "CC2": "Check for shorts",
            "VBUS": "5-20V depending on charger"
        },
        "procedure": [
            "1. Check USB-C port for damage",
            "2. Test CC pins resistance",
            "3. Replace CD3217 if shorted",
            "4. Verify with USB-C tester"
        ],
        "donor_boards": ["Any iPad Pro 2018+", "MacBook with same IC"],
        "difficulty": "High",
        "time": "45-60 minutes"
    }
}

# Добавляем новые IC в базу
for ic_code, ic_info in new_ics.items():
    ic_data[ic_code] = ic_info

save_json(ic_data, 'public/data/ic_compatibility.json')

# Добавляем iPad модели в основную базу устройств
ipad_models = [
    {
        "id": 1000,
        "name": "iPad Air 2",
        "model": "iPad Air 2 (A1566/A1567)",
        "year": "2014",
        "category": "iPad",
        "processor": "A8X",
        "board_numbers": ["J81AP", "J82AP"],
        "common_issues": [
            "Touch IC failure (Cumulus)",
            "Backlight IC failure",
            "Charging port damage"
        ]
    },
    {
        "id": 1001,
        "name": "iPad Pro 10.5",
        "model": "iPad Pro 10.5 (A1701/A1709)",
        "year": "2017",
        "category": "iPad",
        "processor": "A10X Fusion",
        "board_numbers": ["J207AP", "J208AP"],
        "common_issues": [
            "White spot on LCD",
            "Touch IC (Orion) failure",
            "Light spots on display"
        ]
    },
    {
        "id": 1002,
        "name": "iPad Pro 11 2018",
        "model": "iPad Pro 11 2018 (A1980/A2013)",
        "year": "2018",
        "category": "iPad",
        "processor": "A12X Bionic",
        "board_numbers": ["J317AP", "J318AP"],
        "common_issues": [
            "Bend damage",
            "USB-C port failure",
            "Face ID module damage"
        ]
    },
    {
        "id": 1003,
        "name": "iPad Pro 12.9 M1",
        "model": "iPad Pro 12.9 2021 (A2378/A2461)",
        "year": "2021",
        "category": "iPad",
        "processor": "M1",
        "board_numbers": ["J517AP", "J518AP"],
        "common_issues": [
            "Mini-LED blooming",
            "Thunderbolt port issues",
            "Liquid damage to USB-C"
        ]
    }
]

# Добавляем iPad в базу устройств
devices.extend(ipad_models)
save_json(devices, 'public/data/devices.json')

print("✅ Добавлена база данных iPad с маркировками чипов")
print("✅ Добавлены схемы цепей питания и Boot Sequence")
print("✅ Добавлены коды ошибок DFU и panic logs")
print("✅ Добавлена совместимость камер")
print("✅ Добавлены Face ID/Touch ID компоненты")
print("✅ Добавлена база антенн и модемов")
print("✅ Добавлены маркировки SMD компонентов")
print("✅ Добавлены температурные датчики")
print("✅ Добавлены boot процессы для всех чипов")