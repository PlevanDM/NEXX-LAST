#!/usr/bin/env python3
import json

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

# Полная база флешек NAND с программаторами
nand_programming = {
    "programmers": {
        "JC_P13": {
            "supported": ["iPhone 6-13", "iPad all models"],
            "functions": ["Read/Write NAND", "Unbind WiFi", "Expand storage"],
            "price": "$89"
        },
        "MiJing_Z15": {
            "supported": ["iPhone 6-12"],
            "functions": ["NAND read/write", "Data recovery"],
            "price": "$120"
        },
        "iPAD_Rehab_Navi_Plus": {
            "supported": ["iPhone 6-14", "iPad all"],
            "functions": ["NAND repair", "Syscfg editing"],
            "price": "$450"
        }
    },
    "nand_chips_detailed": {
        "Toshiba": {
            "THGBX2G7B2JLA01": {
                "capacity": "16GB",
                "devices": ["iPhone 6", "iPhone 6 Plus"],
                "package": "BGA-153",
                "voltage": "3.3V"
            },
            "THGBX3G7D2KLA0C": {
                "capacity": "32GB",
                "devices": ["iPhone 6", "iPhone 6 Plus"],
                "package": "BGA-153"
            },
            "THGBX4G6D2HLA0C": {
                "capacity": "64GB",
                "devices": ["iPhone 6", "iPhone 6S"],
                "package": "BGA-153"
            },
            "THGBX5G8D4KLDXG": {
                "capacity": "128GB",
                "devices": ["iPhone 6", "iPhone 6S", "iPhone 7"],
                "package": "BGA-153"
            }
        },
        "SanDisk": {
            "SDIN9DW4-32G": {
                "capacity": "32GB",
                "devices": ["iPhone 7", "iPhone 8"],
                "package": "BGA-153"
            },
            "SDINBDG4-64G": {
                "capacity": "64GB",
                "devices": ["iPhone X", "iPhone XS"],
                "package": "BGA-153"
            },
            "SDINBDG4-256G": {
                "capacity": "256GB",
                "devices": ["iPhone X", "iPhone 11"],
                "package": "BGA-153"
            }
        },
        "Kioxia": {
            "KICM224AY64B4": {
                "capacity": "64GB",
                "devices": ["iPhone 11", "iPhone 12"],
                "package": "BGA"
            },
            "KICM224BY128B4": {
                "capacity": "128GB",
                "devices": ["iPhone 11", "iPhone 12", "iPhone 13"],
                "package": "BGA"
            }
        }
    },
    "syscfg_regions": {
        "WiFi_Address": {
            "offset": "0x4000",
            "size": "6 bytes",
            "description": "WiFi MAC address"
        },
        "Bluetooth_Address": {
            "offset": "0x4006",
            "size": "6 bytes",
            "description": "Bluetooth MAC"
        },
        "Serial_Number": {
            "offset": "0x2000",
            "size": "12 bytes",
            "description": "Device serial"
        },
        "Color": {
            "offset": "0x3000",
            "size": "4 bytes",
            "values": {
                "0x00": "Space Gray",
                "0x01": "Silver",
                "0x02": "Gold",
                "0x03": "Rose Gold",
                "0x04": "Jet Black",
                "0x05": "Matte Black",
                "0x06": "Red",
                "0x07": "Blue",
                "0x08": "Yellow",
                "0x09": "Coral",
                "0x0A": "White",
                "0x0B": "Purple",
                "0x0C": "Green",
                "0x0D": "Black",
                "0x0E": "Pacific Blue",
                "0x0F": "Graphite"
            }
        }
    }
}

# Расширенная база микросхем с полными данными
advanced_ic_database = {
    "Tristar_Hydra_evolution": {
        "1608A1": {
            "name": "Tristar 1608A1",
            "devices": ["iPhone 5", "iPhone 5C", "iPhone 5S"],
            "marking": "1608A1",
            "location": "U2",
            "package": "BGA-25",
            "voltage_test": {
                "PP5V0_USB": "5V when charging",
                "USB_D+": "0V-3.3V data",
                "USB_D-": "0V-3.3V data"
            }
        },
        "1610A1": {
            "name": "Tristar 1610A1",
            "devices": ["iPhone 5S"],
            "marking": "1610A1",
            "location": "U2"
        },
        "1610A2": {
            "name": "Tristar 1610A2",
            "devices": ["iPhone 6", "iPhone 6 Plus"],
            "marking": "1610A2",
            "location": "U2",
            "common_failure": "Not charging with original cable"
        },
        "1610A3": {
            "name": "Tristar 1610A3",
            "devices": ["iPhone 6S", "iPhone 6S Plus", "iPhone SE", "iPhone 7", "iPhone 7 Plus"],
            "marking": "1610A3B",
            "location": "U4500/U2"
        },
        "1612A1": {
            "name": "Hydra 1612A1",
            "devices": ["iPhone 8", "iPhone 8 Plus", "iPhone X"],
            "marking": "U6300",
            "location": "U6300",
            "features": ["USB-PD support", "Fast charging"]
        },
        "1614A1": {
            "name": "Hydra U2 IC",
            "devices": ["iPhone XS", "iPhone 11", "iPhone 12"],
            "marking": "U6300",
            "features": ["USB-C PD", "20W fast charging"]
        }
    },
    "Power_Management_detailed": {
        "338S1251-AZ": {
            "name": "PMIC iPhone 6",
            "location": "U1202",
            "outputs": {
                "BUCK0": "PP_CPU",
                "BUCK1": "PP_SOC",
                "BUCK2": "PP_GPU",
                "BUCK3": "PP_DRAM",
                "LDO1": "PP1V8",
                "LDO2": "PP3V0",
                "LDO3": "PP1V2"
            }
        },
        "338S00122": {
            "name": "PMIC iPhone 6S",
            "location": "U2700",
            "thermal_limit": "125°C",
            "package": "CSP-180"
        }
    },
    "Display_ICs": {
        "Chestnut": {
            "marking": "65730",
            "devices": ["iPhone 5S", "iPhone 6"],
            "location": "U1501",
            "function": "Display power and timing"
        },
        "Sage": {
            "marking": "338S00267",
            "devices": ["iPad Pro"],
            "function": "ProMotion 120Hz controller"
        },
        "LM3600": {
            "marking": "LM36001",
            "devices": ["iPhone 7", "iPhone 8"],
            "location": "U3701",
            "function": "LED backlight driver",
            "test": "6V on inductor, 20V LED+"
        }
    }
}

# Схемы измерений с мультиметром
measurement_procedures = {
    "diode_mode_testing": {
        "iPhone_main_rails": {
            "PP_VDD_MAIN": {
                "red_probe": "Ground",
                "black_probe": "PP_VDD_MAIN cap",
                "normal": "0.400-0.450",
                "shorted": "<0.050",
                "open": "OL"
            },
            "PP_BATT_VCC": {
                "red_probe": "Ground",
                "black_probe": "Battery terminal",
                "normal": "0.400-0.500"
            },
            "PP3V0": {
                "red_probe": "Ground",
                "black_probe": "PP3V0 cap",
                "normal": "0.350-0.400"
            },
            "PP1V8": {
                "red_probe": "Ground",
                "black_probe": "PP1V8 cap",
                "normal": "0.250-0.350"
            },
            "PP_CPU": {
                "red_probe": "Ground",
                "black_probe": "CPU cap",
                "normal": "0.020-0.050",
                "note": "Very low due to CPU"
            }
        },
        "MacBook_rails": {
            "PPBUS_G3H": {
                "resistance": "7-8 KΩ",
                "diode": "0.120-0.200"
            },
            "PP3V3_G3H": {
                "resistance": "180-220 Ω",
                "diode": "0.400-0.500"
            }
        }
    },
    "resistance_testing": {
        "procedure": [
            "1. Device completely OFF",
            "2. Battery disconnected",
            "3. Measure in Ohms mode",
            "4. Red probe on ground",
            "5. Black probe on test point",
            "6. Wait for reading to stabilize"
        ],
        "interpretation": {
            "0 Ω": "Dead short to ground",
            "1-10 Ω": "Partial short, check caps",
            "Expected value": "Normal",
            "OL/infinite": "Open circuit"
        }
    },
    "voltage_injection": {
        "WARNING": "ONLY for experienced technicians",
        "equipment": "DC power supply 30V 5A",
        "procedure": [
            "1. Set current limit to 100mA",
            "2. Set voltage to rail voltage",
            "3. Connect to shorted rail",
            "4. Slowly increase current",
            "5. Feel/thermal cam for hot component",
            "6. Replace hot component"
        ]
    }
}

# Инструменты и их применение
tools_usage_guide = {
    "microscopes": {
        "Amscope_SM745": {
            "magnification": "7X-45X",
            "use": "SMD soldering",
            "price": "$350"
        },
        "Andonstar_AD407": {
            "magnification": "270X digital",
            "use": "Inspection",
            "price": "$200"
        }
    },
    "soldering_stations": {
        "Quick_861DW": {
            "temp": "100-500°C",
            "use": "Hot air rework",
            "nozzles": ["3mm", "5mm", "7mm", "10mm"]
        },
        "ATTEN_ST-862D": {
            "temp": "100-500°C",
            "airflow": "Adjustable",
            "price": "$150"
        },
        "JBC_CD-2SQE": {
            "use": "Precision micro soldering",
            "tips": ["C210-001", "C210-002", "C210-018"],
            "price": "$600"
        }
    },
    "BGA_equipment": {
        "ACHI_IR6500": {
            "use": "iPhone X sandwich board",
            "profiles": "Customizable",
            "price": "$2000"
        },
        "Jovy_RE8500": {
            "use": "Professional BGA",
            "zones": "3 heating zones",
            "price": "$3500"
        }
    },
    "test_equipment": {
        "DC_Power": {
            "model": "Kaisi 3005D",
            "specs": "30V 5A",
            "use": "Short circuit finding",
            "price": "$80"
        },
        "USB_Tester": {
            "model": "Power-Z KT002",
            "use": "USB-PD testing",
            "measures": ["Voltage", "Current", "PD negotiation"],
            "price": "$40"
        },
        "Thermal_Camera": {
            "model": "FLIR ONE Pro",
            "use": "Finding shorts",
            "resolution": "160x120",
            "price": "$400"
        }
    },
    "consumables": {
        "flux": {
            "Amtech_559": "General use",
            "Amtech_NC223": "BGA work",
            "Kingbo_RMA218": "Lead-free",
            "MG_8341": "No-clean"
        },
        "solder": {
            "63/37": "Leaded, 183°C",
            "SAC305": "Lead-free, 217°C",
            "Low_melt": "138°C for shields"
        },
        "wick": {
            "Goot_CP-2015": "1.5mm precision",
            "MG_426": "2.0mm general",
            "Chemtronics": "2.5mm heavy duty"
        }
    }
}

# Схемы поиска коротких замыканий
short_circuit_finding = {
    "methods": {
        "visual_inspection": {
            "tools": ["Microscope 45X", "Good lighting"],
            "look_for": [
                "Burnt components",
                "Liquid damage corrosion",
                "Cracked capacitors",
                "Blown fuses",
                "Missing components"
            ]
        },
        "thermal_camera": {
            "setup": [
                "Apply 1V at 1-2A to shorted rail",
                "Wait 30 seconds",
                "Scan with thermal camera",
                "Hottest component is likely shorted"
            ]
        },
        "freeze_spray": {
            "procedure": [
                "Apply power to short",
                "Spray freeze spray on suspected area",
                "Component that thaws first is shorted"
            ]
        },
        "rosin_method": {
            "procedure": [
                "Apply rosin flux to board",
                "Inject voltage to short",
                "Rosin burns at shorted component"
            ]
        }
    },
    "common_shorts": {
        "iPhone": {
            "PP_VDD_MAIN": [
                "C1239, C1240 near PMIC",
                "Caps near CPU",
                "PMIC itself"
            ],
            "PP3V0": [
                "NAND area caps",
                "Baseband caps",
                "Audio IC area"
            ],
            "PP1V8": [
                "CPU underfill caps",
                "RAM area"
            ]
        },
        "MacBook": {
            "PPBUS_G3H": [
                "C7771 on 820-00165",
                "Tantalum caps",
                "CD3215 IC"
            ],
            "PP3V3_G3H": [
                "U7800 ISL9239",
                "Caps near USB-C"
            ]
        }
    }
}

# Сохраняем все новые базы
save_json(nand_programming, 'public/data/nand_programming.json')
save_json(advanced_ic_database, 'public/data/advanced_ic_database.json')
save_json(measurement_procedures, 'public/data/measurement_procedures.json')
save_json(tools_usage_guide, 'public/data/tools_usage_guide.json')
save_json(short_circuit_finding, 'public/data/short_circuit_finding.json')

# Обновляем repair_knowledge
repair_knowledge = load_json('public/data/repair_knowledge.json')
repair_knowledge['nand_programming'] = nand_programming
repair_knowledge['advanced_ic_database'] = advanced_ic_database
repair_knowledge['measurement_procedures'] = measurement_procedures
repair_knowledge['tools_usage'] = tools_usage_guide
repair_knowledge['short_finding'] = short_circuit_finding

save_json(repair_knowledge, 'public/data/repair_knowledge.json')

print("✅ Добавлена база NAND чипов и программаторов")
print("✅ Добавлена расширенная база Tristar/Hydra")
print("✅ Добавлены процедуры измерений")
print("✅ Добавлен гид по инструментам")
print("✅ Добавлены методы поиска КЗ")