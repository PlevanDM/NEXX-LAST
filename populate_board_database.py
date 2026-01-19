#!/usr/bin/env python3
import json
import os

def save_json(data, filepath):
    """Сохраняет данные в JSON файл"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Полная база данных плат MacBook с маркировками чипов
macbook_boards = {
    "820-00165": {
        "model": "MacBook Pro 13\" 2016-2017 Touch Bar",
        "years": "2016-2017",
        "cpu": "Intel Core i5-6267U / i7-6567U",
        "gpu": "Intel Iris 550",
        "ram": "8GB/16GB LPDDR3 on board",
        "board_code": "J130",
        "chips": {
            "SMC": {
                "marking": "980YFE1",
                "location": "U4900",
                "type": "System Management Controller",
                "package": "BGA"
            },
            "ISL9239": {
                "marking": "ISL9239HRZ",
                "location": "U7800",
                "type": "Charging Controller",
                "package": "QFN-32"
            },
            "CD3215C00": {
                "marking": "CD3215C00",
                "location": "U3100/U3200",
                "type": "USB-C Controller",
                "package": "BGA-96"
            },
            "TPS65987D": {
                "marking": "TPS65987DDHRSHR",
                "location": "U3300/U3400",
                "type": "USB-C PD Controller",
                "package": "WQFN-54"
            },
            "TPS62180": {
                "marking": "TPS62180",
                "location": "U8410",
                "type": "3.3V Buck Converter",
                "package": "QFN-16"
            },
            "FDMF6808N": {
                "marking": "FDMF6808N",
                "location": "U7400",
                "type": "CPU VCore Controller",
                "package": "PQFN-31"
            },
            "BCM15700A2": {
                "marking": "BCM15700A2KMLG",
                "location": "U5870",
                "type": "Camera Controller",
                "package": "BGA"
            }
        },
        "test_points": {
            "PPBUS_G3H": "12.6V",
            "PP3V3_G3H": "3.3V",
            "PP5V_G3S": "5V",
            "PP3V3_S5": "3.3V",
            "PP1V8_S3": "1.8V",
            "PP1V2_S3": "1.2V",
            "PPVRTC_G3H": "3.0V",
            "PP3V3_S0": "3.3V in S0 state"
        },
        "common_failures": [
            "CD3215 failure - USB-C не работает",
            "ISL9239 - не заряжается",
            "Flexgate - проблема шлейфа дисплея",
            "T1 chip issues - Touch Bar не работает"
        ],
        "donor_boards": ["820-00164", "820-00239", "820-00875"],
        "resistance_values": {
            "PPBUS_G3H": "6.3 KΩ",
            "PP3V3_G3H": "200 Ω",
            "PP5V_G3S": "3.2 KΩ",
            "PPVCORE_S0_CPU": "2.2 Ω"
        }
    },
    "820-01987": {
        "model": "MacBook Pro 13\" 2020 2 Thunderbolt",
        "years": "2020",
        "cpu": "Intel Core i5-8257U / i7-8557U",
        "gpu": "Intel Iris Plus 645",
        "ram": "8GB/16GB LPDDR3 on board",
        "board_code": "J223",
        "chips": {
            "T2": {
                "marking": "338S00584",
                "location": "U7700",
                "type": "T2 Security Chip",
                "package": "BGA"
            },
            "ISL9240": {
                "marking": "ISL9240HRZ",
                "location": "U7800",
                "type": "Charging Controller",
                "package": "QFN-32"
            },
            "CD3215B03": {
                "marking": "CD3215B03",
                "location": "U3100/U3200",
                "type": "USB-C Controller",
                "package": "BGA-96"
            },
            "TPS62827": {
                "marking": "TPS62827",
                "location": "U8410",
                "type": "1.2V Buck Converter",
                "package": "QFN-8"
            },
            "BCM15700A2": {
                "marking": "BCM15700A2",
                "location": "U5870",
                "type": "Camera Controller",
                "package": "BGA"
            }
        },
        "test_points": {
            "PPBUS_G3H": "12.6V",
            "PP3V3_G3H": "3.3V",
            "PP5V_G3H": "5V",
            "PP3V3_S5": "3.3V",
            "PP1V8_AON": "1.8V always on",
            "PP1V2_S3": "1.2V",
            "PPVDDCPU": "0.7-1.2V dynamic"
        },
        "common_failures": [
            "T2 kernel panic",
            "CD3215 failure",
            "ISL9240 charging issues",
            "Bridge OS crashes"
        ],
        "donor_boards": ["820-01949", "820-01958"],
        "resistance_values": {
            "PPBUS_G3H": "7.1 KΩ",
            "PP3V3_G3H": "190 Ω",
            "PP5V_G3H": "2.9 KΩ"
        }
    },
    "820-01700": {
        "model": "MacBook Pro 16\" 2019",
        "years": "2019",
        "cpu": "Intel Core i7-9750H / i9-9880H",
        "gpu": "AMD Radeon Pro 5300M/5500M",
        "ram": "16GB/32GB/64GB DDR4 on board",
        "board_code": "J152F",
        "chips": {
            "T2": {
                "marking": "338S00584",
                "location": "U7700",
                "type": "T2 Security Chip",
                "package": "BGA"
            },
            "ISL9240": {
                "marking": "ISL9240HRZ",
                "location": "U7800",
                "type": "Charging Controller",
                "package": "QFN-32"
            },
            "CD3215C00": {
                "marking": "CD3215C00ZQZR",
                "location": "U3100/U3200/U3300/U3400",
                "type": "USB-C Controller",
                "package": "BGA-96"
            },
            "ISL6259": {
                "marking": "ISL6259AHRTZ",
                "location": "U7900",
                "type": "Battery Charger",
                "package": "QFN-28"
            },
            "GPU_VRM": {
                "marking": "IR35217",
                "location": "U9850",
                "type": "GPU Voltage Regulator",
                "package": "QFN-56"
            }
        },
        "test_points": {
            "PPBUS_G3H": "12.6V",
            "PP3V3_G3H": "3.3V",
            "PP5V_G3S": "5V",
            "PPVCORE_GPU": "0.85V",
            "PP1V8_S0": "1.8V",
            "PP0V9_S0": "0.9V"
        },
        "common_failures": [
            "VRM перегрев",
            "GPU kernel panic",
            "CD3215 failure all 4 ports",
            "T2 Bridge OS issues"
        ],
        "donor_boards": ["820-01700-05", "820-01700-07"],
        "resistance_values": {
            "PPBUS_G3H": "7.5 KΩ",
            "PPVCORE_GPU": "1.8 Ω",
            "PP5V_G3S": "3.1 KΩ"
        }
    },
    "820-01814": {
        "model": "MacBook Air M1 2020",
        "years": "2020",
        "cpu": "Apple M1",
        "gpu": "Apple M1 GPU",
        "ram": "8GB/16GB Unified Memory",
        "board_code": "J313",
        "chips": {
            "M1": {
                "marking": "APL1102 / 343S00467",
                "location": "U1",
                "type": "M1 SoC",
                "package": "BGA"
            },
            "CD3217B12": {
                "marking": "CD3217B12ACPR",
                "location": "U3100/U3200",
                "type": "USB-C Controller",
                "package": "BGA-96"
            },
            "PMIC": {
                "marking": "338S00571",
                "location": "U7800",
                "type": "Power Management IC",
                "package": "BGA"
            },
            "WiFi_BT": {
                "marking": "339S00758",
                "location": "U4900",
                "type": "WiFi/Bluetooth Module",
                "package": "BGA"
            }
        },
        "test_points": {
            "PPVBAT_G3H_CHGR": "11.4V from battery",
            "PP3V3_AON": "3.3V always on",
            "PP1V8_AON": "1.8V always on",
            "PP1V2_AON": "1.2V always on",
            "PP5V_USB": "5V USB"
        },
        "common_failures": [
            "Liquid damage near USB-C",
            "No image after drop",
            "DFU restore issues",
            "CD3217 failure"
        ],
        "donor_boards": ["820-02020", "820-01958"],
        "resistance_values": {
            "PPVBAT": "450 KΩ",
            "PP3V3_AON": "200 Ω",
            "PP1V8_AON": "150 Ω"
        }
    },
    "820-00850": {
        "model": "MacBook Pro 15\" 2018",
        "years": "2018",
        "cpu": "Intel Core i7-8750H / i9-8950HK",
        "gpu": "AMD Radeon Pro 555X/560X",
        "ram": "16GB/32GB DDR4 on board",
        "board_code": "J680",
        "chips": {
            "T2": {
                "marking": "338S00427",
                "location": "U7700",
                "type": "T2 Security Chip",
                "package": "BGA"
            },
            "ISL9239": {
                "marking": "ISL9239HRZ",
                "location": "U7800",
                "type": "Charging Controller",
                "package": "QFN-32"
            },
            "CD3215C00": {
                "marking": "CD3215C00",
                "location": "U3100/U3200/U3300/U3400",
                "type": "USB-C Controller",
                "package": "BGA-96"
            }
        },
        "test_points": {
            "PPBUS_G3H": "12.6V",
            "PP3V3_G3H": "3.3V",
            "PP5V_G3S": "5V",
            "PPVCORE_S0_GPU": "0.9V"
        },
        "common_failures": [
            "VRM failure",
            "T2 panic",
            "Display cable failure",
            "GPU issues"
        ],
        "donor_boards": ["820-00850-A", "820-00928"],
        "resistance_values": {
            "PPBUS_G3H": "7.2 KΩ",
            "PP3V3_G3H": "195 Ω"
        }
    }
}

# База данных iPhone чипов и маркировок
iphone_chips = {
    "iPhone_6": {
        "model": "iPhone 6",
        "board": "D10 / D11",
        "year": "2014",
        "chips": {
            "CPU": {
                "marking": "APL0698 / A8",
                "location": "U0201",
                "package": "PoP with RAM"
            },
            "PMIC": {
                "marking": "338S1251-AZ",
                "location": "U1202",
                "type": "Power Management"
            },
            "NAND": {
                "marking": "Various (Toshiba/SanDisk/SK Hynix)",
                "location": "U0601",
                "sizes": ["16GB", "64GB", "128GB"]
            },
            "Audio_Codec": {
                "marking": "338S1201",
                "location": "U0900",
                "type": "Cirrus Logic"
            },
            "Tristar": {
                "marking": "610A2",
                "location": "U2",
                "type": "USB Controller"
            },
            "Touch_IC": {
                "marking": "343S0694",
                "location": "U2402",
                "type": "Cumulus Touch Controller"
            },
            "WiFi_BT": {
                "marking": "339S0228",
                "location": "U5201_RF",
                "type": "Murata/USI Module"
            },
            "Baseband": {
                "marking": "MDM9625M",
                "location": "U_BB_RF",
                "type": "Qualcomm"
            }
        },
        "test_points": {
            "PP_VDD_MAIN": "4.2V",
            "PP_BATT_VCC": "3.8V",
            "PP3V0_NAND": "3.0V",
            "PP1V8_SDRAM": "1.8V",
            "PP_CPU": "0.9-1.1V"
        }
    },
    "iPhone_7": {
        "model": "iPhone 7",
        "board": "D10 / D11",
        "year": "2016",
        "chips": {
            "CPU": {
                "marking": "APL1W24 / A10 Fusion",
                "location": "U1000",
                "package": "PoP with RAM"
            },
            "PMIC": {
                "marking": "338S00225",
                "location": "U2700",
                "type": "Dialog Power Management"
            },
            "Audio_IC": {
                "marking": "338S00105",
                "location": "U3500/U3101",
                "type": "Cirrus Logic CS42L77"
            },
            "Tristar": {
                "marking": "610A3B",
                "location": "U4500/U2",
                "type": "USB/Lightning Controller"
            },
            "Baseband_Intel": {
                "marking": "PMB9943 (Intel)",
                "location": "U_BB",
                "type": "Intel XMM7360"
            },
            "Baseband_Qualcomm": {
                "marking": "MDM9645M (Qualcomm)",
                "location": "U_BB",
                "type": "Qualcomm X12 LTE"
            },
            "WiFi_BT": {
                "marking": "339S00199",
                "location": "U5200",
                "type": "USI Module"
            }
        },
        "test_points": {
            "PP_VDD_MAIN": "4.3V",
            "PP_GPU": "Variable",
            "PP3V0_NAND": "3.0V",
            "PP1V8": "1.8V"
        }
    },
    "iPhone_X": {
        "model": "iPhone X",
        "board": "D22 / D221",
        "year": "2017",
        "chips": {
            "CPU": {
                "marking": "APL1W72 / A11 Bionic",
                "location": "Upper board U1000",
                "package": "PoP with RAM"
            },
            "PMIC_Main": {
                "marking": "338S00341",
                "location": "Lower board",
                "type": "Main PMIC"
            },
            "PMIC_Sub": {
                "marking": "338S00383",
                "location": "Lower board",
                "type": "Sub PMIC"
            },
            "Audio_Codec": {
                "marking": "338S00248",
                "location": "Lower board",
                "type": "Audio IC"
            },
            "Hydra": {
                "marking": "U6300",
                "location": "Lower board",
                "type": "USB-C/Lightning Controller"
            },
            "NAND": {
                "marking": "Various (SanDisk/Toshiba)",
                "location": "Upper board",
                "sizes": ["64GB", "256GB"]
            },
            "Display_Driver": {
                "marking": "S2D18A01X01",
                "location": "Upper board",
                "type": "Samsung OLED Driver"
            }
        },
        "test_points": {
            "VDD_MAIN": "4.3V",
            "VDD_BOOST": "4.6V",
            "PP3V0": "3.0V"
        },
        "sandwich_board_notes": [
            "Two boards connected via interposer",
            "Requires separation for many repairs",
            "Critical: maintain alignment during reassembly"
        ]
    },
    "iPhone_11": {
        "model": "iPhone 11",
        "board": "N104",
        "year": "2019",
        "chips": {
            "CPU": {
                "marking": "APL1W85 / A13 Bionic",
                "location": "U1000",
                "package": "PoP with RAM"
            },
            "PMIC": {
                "marking": "338S00509",
                "location": "U2700",
                "type": "Power Management"
            },
            "Audio_IC": {
                "marking": "338S00537",
                "location": "U3300",
                "type": "Audio Codec"
            },
            "U2_IC": {
                "marking": "U6300",
                "location": "U6300",
                "type": "USB/Lightning Controller"
            },
            "UWB": {
                "marking": "U1 Chip",
                "location": "U5600",
                "type": "Ultra Wideband"
            },
            "WiFi6_BT5": {
                "marking": "339S00647",
                "location": "U7000",
                "type": "WiFi 6 + BT 5.0"
            }
        }
    },
    "iPhone_12": {
        "model": "iPhone 12",
        "board": "D52G / D53G",
        "year": "2020",
        "chips": {
            "CPU": {
                "marking": "APL1W05 / A14 Bionic",
                "location": "Upper layer",
                "package": "PoP with RAM"
            },
            "PMIC_Main": {
                "marking": "338S00689",
                "location": "Lower layer",
                "type": "Main PMIC"
            },
            "5G_Modem": {
                "marking": "SDX55M (Qualcomm)",
                "location": "RF board",
                "type": "5G Modem"
            },
            "Audio_IC": {
                "marking": "338S00740",
                "location": "Lower layer",
                "type": "Audio Codec"
            },
            "MagSafe": {
                "marking": "NFC Controller",
                "location": "U8100",
                "type": "MagSafe/NFC"
            }
        },
        "sandwich_board": True,
        "test_points": {
            "VDD_MAIN": "4.45V",
            "VDD_BOOST": "4.7V",
            "PP3V3": "3.3V"
        }
    },
    "iPhone_13": {
        "model": "iPhone 13",
        "board": "D16 / D17",
        "year": "2021",
        "chips": {
            "CPU": {
                "marking": "APL1W07 / A15 Bionic",
                "location": "Upper layer",
                "package": "PoP with LPDDR4X"
            },
            "PMIC": {
                "marking": "338S00770",
                "location": "Lower layer",
                "type": "Power Management"
            },
            "Audio_IC": {
                "marking": "338S00773",
                "location": "Lower layer",
                "type": "Audio Codec"
            },
            "5G_Modem": {
                "marking": "SDR865 (Qualcomm)",
                "location": "RF board",
                "type": "5G Modem"
            }
        }
    },
    "iPhone_14": {
        "model": "iPhone 14",
        "board": "D27 / D28",
        "year": "2022",
        "chips": {
            "CPU": {
                "marking": "APL1W07 / A15 Bionic",
                "location": "Main board",
                "package": "PoP with 6GB LPDDR4X"
            },
            "PMIC": {
                "marking": "338S00817",
                "location": "Power board",
                "type": "Power Management"
            },
            "eSIM": {
                "marking": "eSIM Controller",
                "location": "U7700",
                "type": "eSIM only (US models)"
            }
        }
    }
}

# Распиновка основных разъемов
connector_pinouts = {
    "Lightning": {
        "pins": 8,
        "pinout": {
            "1": "GND",
            "2": "L0p (Data+)",
            "3": "L0n (Data-)",
            "4": "ID0",
            "5": "PWR (5V)",
            "6": "L1n",
            "7": "L1p", 
            "8": "ID1"
        }
    },
    "USB-C_MacBook": {
        "pins": 24,
        "pinout": {
            "A1/B12": "GND",
            "A2/B11": "TX1+/RX2+",
            "A3/B10": "TX1-/RX2-",
            "A4/B9": "VBUS",
            "A5/B8": "CC1/CC2",
            "A6/B7": "D+",
            "A7/B6": "D-",
            "A8/B5": "SBU1/SBU2",
            "A9/B4": "VBUS",
            "A10/B3": "RX1-/TX2-",
            "A11/B2": "RX1+/TX2+",
            "A12/B1": "GND"
        }
    },
    "Display_Connector_iPhone": {
        "iPhone_11_12_13": {
            "pins": 40,
            "important_pins": {
                "1-4": "MIPI DSI Data Lanes",
                "5-6": "MIPI Clock",
                "10": "VSYNC",
                "15": "Touch I2C SDA",
                "16": "Touch I2C SCL",
                "20": "LED Backlight Anode",
                "25": "3D Touch/Force Touch",
                "30-33": "Touch Drive Lines",
                "38-40": "GND"
            }
        }
    },
    "Battery_Connector": {
        "iPhone_X_11_12": {
            "pins": 4,
            "pinout": {
                "1": "BATT_VCC (3.8V)",
                "2": "BATT_SWI (Battery data)",
                "3": "NTC (Temperature sensor)",
                "4": "GND"
            }
        }
    }
}

# Таблицы сопротивлений основных линий
resistance_tables = {
    "iPhone_common_lines": {
        "PP_VDD_MAIN": {
            "iPhone_6": "400-450 Ω",
            "iPhone_7": "350-400 Ω",
            "iPhone_X": "300-350 Ω",
            "iPhone_11": "280-320 Ω",
            "iPhone_12": "250-300 Ω"
        },
        "PP_BATT_VCC": {
            "all_models": "50-100 KΩ"
        },
        "PP3V0_NAND": {
            "all_models": "300-400 Ω"
        },
        "PP1V8": {
            "all_models": "150-200 Ω"
        },
        "PP_CPU": {
            "all_models": "10-30 Ω"
        },
        "PP_GPU": {
            "iPhone_7_up": "20-40 Ω"
        }
    },
    "MacBook_common_lines": {
        "PPBUS_G3H": {
            "13_inch": "6-8 KΩ",
            "15_16_inch": "7-9 KΩ"
        },
        "PP3V3_G3H": {
            "all_models": "180-220 Ω"
        },
        "PP5V_G3S": {
            "all_models": "2.8-3.5 KΩ"
        },
        "PPVCORE_CPU": {
            "Intel": "1-3 Ω",
            "M1": "2-4 Ω"
        }
    }
}

# NAND маркировки и совместимость
nand_compatibility = {
    "iPhone_6_6Plus": {
        "16GB": ["THGBX2G7B2JLA01", "THGBX3G7D2KLA0C"],
        "64GB": ["THGBX4G6D2HLA0C", "THGBX5G8D4KLDXG"],
        "128GB": ["THGBX6G8D4KLDXG", "THGBX7G8E4KLDXG"]
    },
    "iPhone_7_7Plus": {
        "32GB": ["THGBX4G6D2HLA0C", "SDIN9DW4-32G"],
        "128GB": ["THGBX6G8D4KLDXG", "SDIN9DW4-128G"],
        "256GB": ["THGBX7G9E4KLDXG", "SDINBDG4-256G"]
    },
    "iPhone_X": {
        "64GB": ["SDINBDG4-64G", "THGBX5G9D4KLDXG"],
        "256GB": ["SDINBDG4-256G", "THGBX7G9E4KLDXG"]
    },
    "iPhone_11_12_13": {
        "64GB": ["KICM224AY64B4", "H9HPNNNFAMMDAR"],
        "128GB": ["KICM224BY128B4", "H9HPNNNFBMMDAR"],
        "256GB": ["KICM224EY256B4", "H9HPNNNGCMMDAR"],
        "512GB": ["KICM225EY512B4", "H9HPNNNHCMMDAR"]
    },
    "programming_note": "Требуется JC P13 или аналогичный программатор для переноса данных"
}

# Совместимость дисплеев
display_compatibility = {
    "interchangeable_groups": {
        "group_1": {
            "models": ["iPhone X", "iPhone XS"],
            "note": "Взаимозаменяемы, требуется перепрограммирование True Tone"
        },
        "group_2": {
            "models": ["iPhone 11", "iPhone XR"],
            "note": "LCD дисплеи, разные разрешения, не совместимы"
        },
        "group_3": {
            "models": ["iPhone 12", "iPhone 12 Pro"],
            "note": "Полностью взаимозаменяемы"
        },
        "group_4": {
            "models": ["iPhone 13", "iPhone 13 Pro"],
            "note": "Разные частоты обновления (60Hz vs 120Hz ProMotion)"
        }
    },
    "touch_ic_locations": {
        "iPhone_6_Plus": "U2402 (Cumulus) + U2401 (Meson)",
        "iPhone_7": "Integrated in display assembly",
        "iPhone_X_up": "Integrated OLED controller"
    }
}

# Батарейные контроллеры
battery_controllers = {
    "iPhone": {
        "Texas_Instruments": {
            "BQ27545": ["iPhone 6", "iPhone 6S"],
            "BQ27546": ["iPhone 7", "iPhone 8"],
            "SN27546": ["iPhone X", "iPhone XS"]
        },
        "Analog_Devices": {
            "AD7149": ["iPhone 11", "iPhone 12", "iPhone 13"]
        }
    },
    "reprogramming": "Требуется JC V1S или аналог для переноса данных батареи"
}

# Сохраняем все данные
save_json(macbook_boards, 'public/data/mac_board_reference.json')
save_json(iphone_chips, 'public/data/iphone_chip_database.json')
save_json(connector_pinouts, 'public/data/connector_pinouts.json')
save_json(resistance_tables, 'public/data/resistance_tables.json')
save_json(nand_compatibility, 'public/data/nand_compatibility.json')
save_json(display_compatibility, 'public/data/display_compatibility.json')
save_json(battery_controllers, 'public/data/battery_controllers.json')

print("✅ База данных плат Mac заполнена маркировками чипов")
print("✅ База данных iPhone чипов создана")
print("✅ Добавлены распиновки разъемов")
print("✅ Добавлены таблицы сопротивлений")
print("✅ Добавлена совместимость NAND")
print("✅ Добавлена совместимость дисплеев")
print("✅ Добавлены батарейные контроллеры")