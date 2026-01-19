#!/usr/bin/env python3
"""
Скрипт для полного заполнения данных устройств iPhone/iPad/Mac
Источники: iFixit, Apple Wiki, Wikipedia, TechInsights
"""

import json
import os
from datetime import datetime

DATA_DIR = "/home/user/webapp/public/data"
DEVICES_FILE = os.path.join(DATA_DIR, "devices.json")

# ============================================================
# ПОЛНЫЕ ДАННЫЕ ПО МОДЕМАМ И BOARD NUMBERS
# ============================================================

IPHONE_COMPLETE_DATA = {
    # iPhone 16 серия (2024)
    "iPhone 16": {
        "year": 2024,
        "model": "A3287, A3290, A3289, A3288",
        "processor": "Apple A18",
        "processor_family": "A18",
        "modem": {
            "chip": "Qualcomm SDX71M (Snapdragon X71)",
            "type": "5G Sub-6GHz + mmWave",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "SN2012027 (USB-C Controller)",
            "battery_charger": "CP3200B1G0",
            "location": "USB-C порт",
            "voltage": "5V/9V/15V/20V",
            "current": "До 4.7A",
            "fast_charging": "27W USB-C PD",
            "usb_pd": "3.1",
            "wireless_charging": "MagSafe 25W, Qi2 15W",
            "price_range": "$10-25"
        },
        "power_ic": {
            "main": "Apple 338S01119 (APL109A)",
            "secondary": ["STPMIA3C", "338S00616", "PMX65-000"],
            "location": "Центр платы"
        },
        "audio_codec": {
            "main": "Cirrus Logic 338S00967",
            "amplifier": "Cirrus Logic 338S01087"
        },
        "memory": {
            "nand": "128/256/512GB NVMe",
            "ram": "8GB LPDDR5X",
            "nand_manufacturer": "Kioxia/SK Hynix"
        },
        "board_numbers": ["820-02896"],
        "common_issues": [
            "USB-C не заряжает - проверить CD3217/SN2012027",
            "No Service - Qualcomm SDX71M или антенна",
            "Перегрев при использовании камеры",
            "Face ID unavailable - Dot Projector",
            "Батарея быстро разряжается",
            "Error 4013/4014 при восстановлении - NAND",
            "Wireless charging не работает - BCM59367"
        ],
        "repair_difficulty": "Очень сложная",
        "repair_time": "2-4 часа"
    },
    
    "iPhone 16 Plus": {
        "year": 2024,
        "model": "A3291, A3294, A3293, A3292",
        "processor": "Apple A18",
        "processor_family": "A18",
        "modem": {
            "chip": "Qualcomm SDX71M (Snapdragon X71)",
            "type": "5G Sub-6GHz + mmWave",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "SN2012027 (USB-C Controller)",
            "battery_charger": "CP3200B1G0",
            "voltage": "5V/9V/15V/20V",
            "fast_charging": "27W USB-C PD",
            "usb_pd": "3.1",
            "wireless_charging": "MagSafe 25W, Qi2 15W"
        },
        "power_ic": {
            "main": "Apple 338S01119",
            "secondary": ["STPMIA3C", "338S00616", "PMX65-000"]
        },
        "audio_codec": {
            "main": "Cirrus Logic 338S00967",
            "amplifier": "Cirrus Logic 338S01087"
        },
        "memory": {
            "nand": "128/256/512GB NVMe",
            "ram": "8GB LPDDR5X"
        },
        "board_numbers": ["820-02897"],
        "common_issues": [
            "USB-C не заряжает",
            "No Service - 5G modem",
            "Перегрев",
            "Face ID unavailable",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Очень сложная"
    },
    
    "iPhone 16 Pro": {
        "year": 2024,
        "model": "A3101, A3102, A3103, A3104",
        "processor": "Apple A18 Pro",
        "processor_family": "A18",
        "modem": {
            "chip": "Qualcomm SDX71M-000 (Snapdragon X71)",
            "type": "5G Sub-6GHz + mmWave",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "SN2012027 (USB-C Controller)",
            "battery_charger": "CP3200B1G0",
            "voltage": "5V/9V/15V/20V/28V",
            "fast_charging": "27W USB-C PD / 140W Max",
            "usb_pd": "3.1",
            "wireless_charging": "MagSafe 25W, Qi2 15W"
        },
        "power_ic": {
            "main": "Apple APL109A / 338S01119",
            "secondary": ["STMicroelectronics STPMIA3C", "Apple 338S00616", "Apple 338S01026-B1", "Qualcomm PMX65-000", "Cirrus Logic 338S00843"]
        },
        "audio_codec": {
            "main": "Cirrus Logic 338S00967",
            "amplifier": "Cirrus Logic 338S01087 (x2)"
        },
        "memory": {
            "nand": "Kioxia K5A3RF9864 128GB/256GB/512GB/1TB",
            "ram": "Micron LPDDR5X 8GB"
        },
        "board_numbers": ["820-02898"],
        "common_issues": [
            "USB-C не заряжает / не передает данные",
            "No Service - Qualcomm SDX71M-000 или RF",
            "Face ID unavailable - Dot Projector",
            "Перегрев при съемке видео 4K ProRes",
            "Battery drain при использовании 5G",
            "Error 4013/4014 - NAND Kioxia",
            "Action Button не работает"
        ],
        "repair_difficulty": "Очень сложная",
        "repair_time": "2-4 часа"
    },
    
    "iPhone 16 Pro Max": {
        "year": 2024,
        "model": "A3105, A3106, A3107, A3108",
        "processor": "Apple A18 Pro",
        "processor_family": "A18",
        "modem": {
            "chip": "Qualcomm SDX71M-000",
            "type": "5G Sub-6GHz + mmWave"
        },
        "charging_ic": {
            "main": "SN2012027 (USB-C Controller)",
            "battery_charger": "CP3200B1G0",
            "voltage": "5V/9V/15V/20V/28V",
            "fast_charging": "27W USB-C PD",
            "usb_pd": "3.1",
            "wireless_charging": "MagSafe 25W"
        },
        "power_ic": {
            "main": "Apple APL109A / 338S01119",
            "secondary": ["STPMIA3C", "338S00616", "338S01026-B1", "PMX65-000"]
        },
        "audio_codec": {
            "main": "Cirrus Logic 338S00967"
        },
        "memory": {
            "nand": "256GB/512GB/1TB NVMe",
            "ram": "8GB LPDDR5X"
        },
        "board_numbers": ["820-02899"],
        "common_issues": [
            "USB-C charging issues",
            "No Service / 5G connectivity",
            "Face ID problems",
            "Overheating during video",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Очень сложная"
    },
    
    # iPhone 15 серия (2023)
    "iPhone 15": {
        "year": 2023,
        "model": "A2846, A3089, A3090, A3092",
        "processor": "Apple A16 Bionic",
        "processor_family": "A16",
        "modem": {
            "chip": "Qualcomm SDX70M (Snapdragon X70)",
            "type": "5G Sub-6GHz + mmWave",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "SN2012017 (USB-C Controller)",
            "voltage": "5V/9V/15V/20V",
            "fast_charging": "27W USB-C PD",
            "usb_pd": "3.0",
            "wireless_charging": "MagSafe 15W, Qi 7.5W"
        },
        "power_ic": {
            "main": "Apple 338S01022",
            "secondary": ["STCPM1A3", "338S00946-B0", "338S00616"]
        },
        "audio_codec": {
            "main": "Apple 338S00739",
            "amplifier": "Apple 338S00537"
        },
        "memory": {
            "nand": "128/256/512GB NVMe",
            "ram": "6GB LPDDR5"
        },
        "board_numbers": ["820-02742"],
        "common_issues": [
            "USB-C не заряжает - SN2012017",
            "No Service - Qualcomm SDX70M",
            "Face ID unavailable",
            "Перегрев",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Очень сложная"
    },
    
    "iPhone 15 Plus": {
        "year": 2023,
        "model": "A2847, A3093, A3094, A3096",
        "processor": "Apple A16 Bionic",
        "processor_family": "A16",
        "modem": {
            "chip": "Qualcomm SDX70M (Snapdragon X70)",
            "type": "5G Sub-6GHz + mmWave"
        },
        "charging_ic": {
            "main": "SN2012017 (USB-C Controller)",
            "fast_charging": "27W USB-C PD",
            "usb_pd": "3.0"
        },
        "power_ic": {
            "main": "Apple 338S01022"
        },
        "audio_codec": {
            "main": "Apple 338S00739"
        },
        "memory": {
            "nand": "128/256/512GB NVMe",
            "ram": "6GB LPDDR5"
        },
        "board_numbers": ["820-02743"],
        "common_issues": [
            "USB-C charging issues",
            "No Service",
            "Face ID problems",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Очень сложная"
    },
    
    "iPhone 15 Pro": {
        "year": 2023,
        "model": "A2848, A3101, A3102, A3104",
        "processor": "Apple A17 Pro",
        "processor_family": "A17",
        "modem": {
            "chip": "Qualcomm SDX70M (Snapdragon X70)",
            "type": "5G Sub-6GHz + mmWave",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "Texas Instruments SN2012017",
            "voltage": "5V/9V/15V/20V",
            "fast_charging": "27W USB-C PD",
            "usb_pd": "3.0",
            "wireless_charging": "MagSafe 15W"
        },
        "power_ic": {
            "main": "Apple APL109A / 338S01022",
            "secondary": ["STCPM1A3", "STB605A11", "338S00946-B0", "338S00616", "Qualcomm PMX65"]
        },
        "audio_codec": {
            "main": "Apple 338S00739",
            "amplifier": "Apple 338S00537"
        },
        "memory": {
            "nand": "Kioxia 128/256/512GB/1TB NVMe",
            "ram": "8GB LPDDR5"
        },
        "board_numbers": ["820-02744"],
        "common_issues": [
            "USB-C не заряжает - SN2012017",
            "No Service - Qualcomm SDX70M",
            "Face ID unavailable - Dot Projector",
            "Перегрев при играх/видео",
            "Sandwich board delamination",
            "Action Button не работает",
            "Error 4013/4014 - NAND"
        ],
        "repair_difficulty": "Очень сложная"
    },
    
    "iPhone 15 Pro Max": {
        "year": 2023,
        "model": "A2849, A3105, A3106, A3108",
        "processor": "Apple A17 Pro",
        "processor_family": "A17",
        "modem": {
            "chip": "Qualcomm SDX70M (Snapdragon X70)",
            "type": "5G Sub-6GHz + mmWave",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "Texas Instruments SN2012017",
            "voltage": "5V/9V/15V/20V",
            "fast_charging": "27W USB-C PD",
            "usb_pd": "3.0",
            "wireless_charging": "MagSafe 15W"
        },
        "power_ic": {
            "main": "Apple APL109A / 338S01022",
            "secondary": ["STCPM1A3", "STB605A11", "338S00946-B0", "338S00616", "Qualcomm PMX65"]
        },
        "audio_codec": {
            "main": "Apple 338S00739",
            "amplifier": "Apple 338S00537"
        },
        "memory": {
            "nand": "Kioxia K5A4RB6302CA12304 256GB/512GB/1TB",
            "ram": "SK hynix H58G66AK6HX132 8GB LPDDR5"
        },
        "board_numbers": ["820-02745"],
        "common_issues": [
            "USB-C не заряжает / не передает данные",
            "No Service - Qualcomm SDX70M или RF",
            "Face ID unavailable",
            "Sandwich board delamination",
            "Перегрев при 4K ProRes",
            "Battery drain на 5G",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Очень сложная"
    },
    
    # iPhone 14 серия (2022)
    "iPhone 14": {
        "year": 2022,
        "model": "A2649, A2881, A2882, A2884",
        "processor": "Apple A15 Bionic",
        "processor_family": "A15",
        "modem": {
            "chip": "Qualcomm SDX65M (Snapdragon X65)",
            "type": "5G Sub-6GHz + mmWave",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "SN2611C0 (Tigris)",
            "designation": "U3300",
            "voltage": "5V/9V",
            "fast_charging": "20W",
            "wireless_charging": "MagSafe 15W, Qi 7.5W"
        },
        "power_ic": {
            "main": "Apple 338S00829",
            "secondary": ["STB605", "338S00770"]
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L84",
            "amplifier": "Apple 338S00537"
        },
        "memory": {
            "nand": "128/256/512GB NVMe",
            "ram": "6GB LPDDR4X"
        },
        "board_numbers": ["820-02466"],
        "common_issues": [
            "Не заряжается - Tigris SN2611C0",
            "No Service - Qualcomm SDX65M",
            "Face ID unavailable",
            "Crash Detection ложные срабатывания",
            "Батарея быстро садится на 5G",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Сложная"
    },
    
    "iPhone 14 Plus": {
        "year": 2022,
        "model": "A2632, A2885, A2886, A2888",
        "processor": "Apple A15 Bionic",
        "processor_family": "A15",
        "modem": {
            "chip": "Qualcomm SDX65M (Snapdragon X65)",
            "type": "5G Sub-6GHz + mmWave"
        },
        "charging_ic": {
            "main": "SN2611C0 (Tigris)",
            "fast_charging": "20W",
            "wireless_charging": "MagSafe 15W"
        },
        "power_ic": {
            "main": "Apple 338S00829"
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L84"
        },
        "memory": {
            "nand": "128/256/512GB NVMe",
            "ram": "6GB LPDDR4X"
        },
        "board_numbers": ["820-02467"],
        "common_issues": [
            "Не заряжается - Tigris",
            "No Service",
            "Face ID unavailable",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Сложная"
    },
    
    "iPhone 14 Pro": {
        "year": 2022,
        "model": "A2650, A2889, A2890, A2892",
        "processor": "Apple A16 Bionic",
        "processor_family": "A16",
        "modem": {
            "chip": "Qualcomm SDX65M (Snapdragon X65)",
            "type": "5G Sub-6GHz + mmWave",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "SN2611C0 (Tigris)",
            "designation": "U3300",
            "voltage": "5V/9V",
            "fast_charging": "27W",
            "wireless_charging": "MagSafe 15W"
        },
        "power_ic": {
            "main": "Apple 338S00829",
            "secondary": ["STB605", "338S00770", "PMX55"]
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L84",
            "amplifier": "Apple 338S00537"
        },
        "memory": {
            "nand": "128/256/512GB/1TB NVMe",
            "ram": "6GB LPDDR5"
        },
        "board_numbers": ["820-02468"],
        "common_issues": [
            "Не заряжается - Tigris SN2611C0",
            "No Service - Qualcomm SDX65M",
            "Face ID unavailable + Dynamic Island",
            "Камера дрожит/вибрирует в сторонних приложениях",
            "Always-On Display battery drain",
            "Перегрев при видео",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Очень сложная"
    },
    
    "iPhone 14 Pro Max": {
        "year": 2022,
        "model": "A2651, A2893, A2894, A2896",
        "processor": "Apple A16 Bionic",
        "processor_family": "A16",
        "modem": {
            "chip": "Qualcomm SDX65M (Snapdragon X65)",
            "type": "5G Sub-6GHz + mmWave"
        },
        "charging_ic": {
            "main": "SN2611C0 (Tigris)",
            "fast_charging": "27W",
            "wireless_charging": "MagSafe 15W"
        },
        "power_ic": {
            "main": "Apple 338S00829"
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L84"
        },
        "memory": {
            "nand": "128/256/512GB/1TB NVMe",
            "ram": "6GB LPDDR5"
        },
        "board_numbers": ["820-02469"],
        "common_issues": [
            "Не заряжается",
            "No Service",
            "Face ID + Dynamic Island",
            "Камера вибрация",
            "Перегрев",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Очень сложная"
    },
    
    "iPhone SE (3rd gen)": {
        "year": 2022,
        "model": "A2595, A2782, A2783, A2784, A2785",
        "processor": "Apple A15 Bionic",
        "processor_family": "A15",
        "modem": {
            "chip": "Qualcomm SDX55M (Snapdragon X55)",
            "type": "5G Sub-6GHz",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "SN2611B0 (Tigris)",
            "voltage": "5V/9V",
            "fast_charging": "20W",
            "wireless_charging": "Qi 7.5W"
        },
        "power_ic": {
            "main": "Apple 338S00829"
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L84"
        },
        "memory": {
            "nand": "64/128/256GB NVMe",
            "ram": "4GB LPDDR4X"
        },
        "board_numbers": ["820-02403"],
        "common_issues": [
            "Не заряжается - Tigris",
            "No Service",
            "Touch ID не работает",
            "Home button failure",
            "Error 53 после ремонта Touch ID"
        ],
        "repair_difficulty": "Средняя"
    },
    
    # iPhone 13 серия (2021)
    "iPhone 13": {
        "year": 2021,
        "model": "A2633, A2482, A2631, A2634, A2635",
        "processor": "Apple A15 Bionic",
        "processor_family": "A15",
        "modem": {
            "chip": "Qualcomm SDX60M (Snapdragon X60)",
            "type": "5G Sub-6GHz + mmWave",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "SN2611B0 (Tigris)",
            "designation": "U3300",
            "voltage": "5V/9V",
            "fast_charging": "20W",
            "wireless_charging": "MagSafe 15W, Qi 7.5W"
        },
        "power_ic": {
            "main": "Apple 338S00770",
            "secondary": ["STB605", "338S00643"]
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L84"
        },
        "memory": {
            "nand": "128/256/512GB NVMe",
            "ram": "4GB LPDDR4X"
        },
        "board_numbers": ["820-02096"],
        "common_issues": [
            "Не заряжается - Tigris SN2611B0",
            "No Service - Qualcomm SDX60M",
            "Face ID unavailable - диагональный модуль",
            "MagSafe не магнитится",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Сложная"
    },
    
    "iPhone 13 mini": {
        "year": 2021,
        "model": "A2628, A2481, A2626, A2629, A2630",
        "processor": "Apple A15 Bionic",
        "processor_family": "A15",
        "modem": {
            "chip": "Qualcomm SDX60M (Snapdragon X60)",
            "type": "5G Sub-6GHz + mmWave"
        },
        "charging_ic": {
            "main": "SN2611B0 (Tigris)",
            "fast_charging": "20W",
            "wireless_charging": "MagSafe 12W"
        },
        "power_ic": {
            "main": "Apple 338S00770"
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L84"
        },
        "memory": {
            "nand": "128/256/512GB NVMe",
            "ram": "4GB LPDDR4X"
        },
        "board_numbers": ["820-02095"],
        "common_issues": [
            "Не заряжается",
            "No Service",
            "Face ID unavailable",
            "Battery drain (маленький аккумулятор)"
        ],
        "repair_difficulty": "Сложная"
    },
    
    "iPhone 13 Pro": {
        "year": 2021,
        "model": "A2638, A2483, A2636, A2639, A2640",
        "processor": "Apple A15 Bionic",
        "processor_family": "A15",
        "modem": {
            "chip": "Qualcomm SDX60M (Snapdragon X60)",
            "type": "5G Sub-6GHz + mmWave",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "SN2611B0 (Tigris)",
            "voltage": "5V/9V",
            "fast_charging": "27W",
            "wireless_charging": "MagSafe 15W"
        },
        "power_ic": {
            "main": "Apple 338S00770",
            "secondary": ["STB605", "338S00643", "PMX55"]
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L84"
        },
        "memory": {
            "nand": "128/256/512GB/1TB NVMe",
            "ram": "6GB LPDDR4X"
        },
        "board_numbers": ["820-02097"],
        "common_issues": [
            "Не заряжается - Tigris",
            "No Service - Qualcomm SDX60M",
            "Face ID unavailable",
            "ProMotion 120Hz глюки",
            "Macro mode не переключается",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Очень сложная"
    },
    
    "iPhone 13 Pro Max": {
        "year": 2021,
        "model": "A2643, A2484, A2641, A2644, A2645",
        "processor": "Apple A15 Bionic",
        "processor_family": "A15",
        "modem": {
            "chip": "Qualcomm SDX60M (Snapdragon X60)",
            "type": "5G Sub-6GHz + mmWave"
        },
        "charging_ic": {
            "main": "SN2611B0 (Tigris)",
            "fast_charging": "27W",
            "wireless_charging": "MagSafe 15W"
        },
        "power_ic": {
            "main": "Apple 338S00770"
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L84"
        },
        "memory": {
            "nand": "128/256/512GB/1TB NVMe",
            "ram": "6GB LPDDR4X"
        },
        "board_numbers": ["820-02098"],
        "common_issues": [
            "Не заряжается",
            "No Service",
            "Face ID",
            "ProMotion issues",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Очень сложная"
    },
    
    # iPhone 12 серия (2020)
    "iPhone 12": {
        "year": 2020,
        "model": "A2172, A2402, A2403, A2404",
        "processor": "Apple A14 Bionic",
        "processor_family": "A14",
        "modem": {
            "chip": "Qualcomm SDX55M (Snapdragon X55)",
            "type": "5G Sub-6GHz + mmWave",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "SN2611E0 (Tigris E)",
            "designation": "U3300",
            "voltage": "5V/9V",
            "fast_charging": "20W",
            "wireless_charging": "MagSafe 15W, Qi 7.5W"
        },
        "power_ic": {
            "main": "Apple 338S00643",
            "secondary": ["STB605", "PMX55"]
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L83"
        },
        "memory": {
            "nand": "64/128/256GB NVMe",
            "ram": "4GB LPDDR4X"
        },
        "board_numbers": ["820-01970 (Bottom)", "820-01955 (Top)"],
        "common_issues": [
            "Не заряжается - Tigris SN2611E0",
            "No Service - Qualcomm SDX55M",
            "Face ID unavailable после падения",
            "Ceramic Shield все равно бьется",
            "MagSafe магниты слабые",
            "Battery health быстро падает",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Сложная"
    },
    
    "iPhone 12 mini": {
        "year": 2020,
        "model": "A2176, A2398, A2399, A2400",
        "processor": "Apple A14 Bionic",
        "processor_family": "A14",
        "modem": {
            "chip": "Qualcomm SDX55M (Snapdragon X55)",
            "type": "5G Sub-6GHz + mmWave"
        },
        "charging_ic": {
            "main": "SN2611E0 (Tigris E)",
            "fast_charging": "20W",
            "wireless_charging": "MagSafe 12W"
        },
        "power_ic": {
            "main": "Apple 338S00643"
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L83"
        },
        "memory": {
            "nand": "64/128/256GB NVMe",
            "ram": "4GB LPDDR4X"
        },
        "board_numbers": ["820-01961"],
        "common_issues": [
            "Не заряжается",
            "No Service",
            "Face ID",
            "Battery drain (очень маленький акк)",
            "Перегрев при 5G"
        ],
        "repair_difficulty": "Сложная"
    },
    
    "iPhone 12 Pro": {
        "year": 2020,
        "model": "A2341, A2406, A2407, A2408",
        "processor": "Apple A14 Bionic",
        "processor_family": "A14",
        "modem": {
            "chip": "Qualcomm SDX55M (Snapdragon X55)",
            "type": "5G Sub-6GHz + mmWave",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "SN2611E0 (Tigris E)",
            "voltage": "5V/9V",
            "fast_charging": "20W",
            "wireless_charging": "MagSafe 15W"
        },
        "power_ic": {
            "main": "Apple 338S00643",
            "secondary": ["STB605", "PMX55"]
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L83"
        },
        "memory": {
            "nand": "128/256/512GB NVMe",
            "ram": "6GB LPDDR4X"
        },
        "board_numbers": ["820-01970 (Bottom)", "820-01955 (Top)"],
        "common_issues": [
            "Не заряжается - Tigris",
            "No Service - Qualcomm SDX55M",
            "Face ID unavailable",
            "LiDAR не работает",
            "Зеленый экран (green tint display)",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Сложная"
    },
    
    "iPhone 12 Pro Max": {
        "year": 2020,
        "model": "A2342, A2410, A2411, A2412",
        "processor": "Apple A14 Bionic",
        "processor_family": "A14",
        "modem": {
            "chip": "Qualcomm SDX55M (Snapdragon X55)",
            "type": "5G Sub-6GHz + mmWave",
            "manufacturer": "Qualcomm"
        },
        "charging_ic": {
            "main": "SN2611E0 (Tigris E)",
            "voltage": "5V/9V",
            "fast_charging": "20W",
            "wireless_charging": "MagSafe 15W"
        },
        "power_ic": {
            "main": "Apple 338S00643",
            "secondary": ["STB605", "PMX55"]
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L83"
        },
        "memory": {
            "nand": "128/256/512GB NVMe",
            "ram": "6GB LPDDR4X"
        },
        "board_numbers": ["820-01968 (Bottom)", "820-01953 (Top)"],
        "common_issues": [
            "Не заряжается - Tigris SN2611E0",
            "No Service - Qualcomm SDX55M",
            "Face ID unavailable",
            "Sensor shift OIS проблемы",
            "LiDAR failure",
            "Error 4013/4014"
        ],
        "repair_difficulty": "Очень сложная"
    },
    
    "iPhone SE (2nd gen)": {
        "year": 2020,
        "model": "A2275, A2296, A2298",
        "processor": "Apple A13 Bionic",
        "processor_family": "A13",
        "modem": {
            "chip": "Intel XMM7660 / Qualcomm SDX55",
            "type": "4G LTE Advanced",
            "manufacturer": "Intel/Qualcomm"
        },
        "charging_ic": {
            "main": "SN2611A0 (Tigris)",
            "voltage": "5V/9V",
            "fast_charging": "18W",
            "wireless_charging": "Qi 7.5W"
        },
        "power_ic": {
            "main": "Apple 338S00509"
        },
        "audio_codec": {
            "main": "Cirrus Logic CS42L83"
        },
        "memory": {
            "nand": "64/128/256GB NVMe",
            "ram": "3GB LPDDR4X"
        },
        "board_numbers": ["820-01798"],
        "common_issues": [
            "Не заряжается - Tigris SN2611A0",
            "Touch ID не работает",
            "Home button failure",
            "No Service",
            "Error 53 после замены кнопки"
        ],
        "repair_difficulty": "Средняя"
    },
    
    # iPhone 16e (2025)
    "iPhone 16e": {
        "year": 2025,
        "model": "A3212, A3213",
        "processor": "Apple A18",
        "processor_family": "A18",
        "modem": {
            "chip": "Apple C1 (первый Apple modem)",
            "type": "5G Sub-6GHz",
            "manufacturer": "Apple",
            "notes": "Первый собственный модем Apple"
        },
        "charging_ic": {
            "main": "Apple USB-C Controller",
            "fast_charging": "27W USB-C PD",
            "usb_pd": "3.1"
        },
        "power_ic": {
            "main": "Apple PMIC"
        },
        "audio_codec": {
            "main": "Cirrus Logic"
        },
        "memory": {
            "nand": "128/256/512GB NVMe",
            "ram": "8GB LPDDR5X"
        },
        "board_numbers": ["TBD"],
        "common_issues": [
            "Apple C1 modem - новый чип, мало данных",
            "Face ID",
            "USB-C",
            "TBD - модель новая"
        ],
        "repair_difficulty": "Очень сложная"
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
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False

def update_device(device, complete_data):
    """Обновить устройство полными данными"""
    updated = False
    
    for key, value in complete_data.items():
        if key in ['year', 'model', 'processor', 'processor_family']:
            if not device.get(key) or device.get(key) != value:
                device[key] = value
                updated = True
        elif key == 'modem':
            if not device.get('modem') or not device.get('modem', {}).get('chip'):
                device['modem'] = value
                updated = True
        elif key == 'charging_ic':
            existing = device.get('charging_ic', {})
            if isinstance(existing, dict):
                for k, v in value.items():
                    if not existing.get(k):
                        existing[k] = v
                        updated = True
                device['charging_ic'] = existing
            else:
                device['charging_ic'] = value
                updated = True
        elif key == 'power_ic':
            if not device.get('power_ic') or not device.get('power_ic', {}).get('main'):
                device['power_ic'] = value
                updated = True
        elif key == 'audio_codec':
            if not device.get('audio_codec') or not device.get('audio_codec', {}).get('main'):
                device['audio_codec'] = value
                updated = True
        elif key == 'memory':
            existing = device.get('memory', {})
            if isinstance(existing, dict):
                for k, v in value.items():
                    if not existing.get(k):
                        existing[k] = v
                        updated = True
                device['memory'] = existing
            else:
                device['memory'] = value
                updated = True
        elif key == 'board_numbers':
            existing = device.get('board_numbers', [])
            if not existing or existing == ['TBD'] or existing == []:
                device['board_numbers'] = value
                updated = True
        elif key == 'common_issues':
            existing = device.get('common_issues', [])
            if len(existing) < len(value):
                # Добавить недостающие issues
                for issue in value:
                    if issue not in existing:
                        existing.append(issue)
                        updated = True
                device['common_issues'] = existing
        elif key == 'repair_difficulty':
            if not device.get('repair_difficulty'):
                device['repair_difficulty'] = value
                updated = True
        elif key == 'repair_time':
            if not device.get('repair_time'):
                device['repair_time'] = value
                updated = True
    
    return updated

def main():
    """Главная функция"""
    print("=" * 60)
    print("🔧 Заполнение полных данных устройств")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 60)
    
    # Загрузить текущие устройства
    devices = load_json(DEVICES_FILE)
    if not devices:
        print("❌ Не удалось загрузить devices.json")
        return
    
    print(f"\n📱 Загружено устройств: {len(devices)}")
    
    # Обновить устройства
    updated_count = 0
    not_found = []
    
    for name, complete_data in IPHONE_COMPLETE_DATA.items():
        # Найти устройство по имени
        found = False
        for device in devices:
            if device.get('name') == name:
                found = True
                if update_device(device, complete_data):
                    print(f"  ✅ Обновлено: {name}")
                    updated_count += 1
                else:
                    print(f"  ⏭️  Без изменений: {name}")
                break
        
        if not found:
            not_found.append(name)
    
    if not_found:
        print(f"\n⚠️ Не найдены в базе (нужно добавить):")
        for name in not_found:
            print(f"  ❌ {name}")
    
    # Сохранить
    if updated_count > 0:
        save_json(DEVICES_FILE, devices)
        print(f"\n✅ Обновлено {updated_count} устройств")
    else:
        print("\n📝 Нет изменений для сохранения")
    
    # Проверка после обновления
    print("\n" + "=" * 60)
    print("📊 ПРОВЕРКА ПОСЛЕ ОБНОВЛЕНИЯ")
    print("=" * 60)
    
    iphones_2020_plus = [d for d in devices if d.get('category') == 'iPhone' and isinstance(d.get('year'), int) and d.get('year') >= 2020]
    
    complete = 0
    incomplete = 0
    
    for device in sorted(iphones_2020_plus, key=lambda x: (x.get('year', 0), x.get('name', '')), reverse=True):
        name = device.get('name')
        year = device.get('year')
        
        issues = []
        
        modem = device.get('modem')
        if modem is None or (isinstance(modem, dict) and not modem.get('chip')):
            issues.append('modem')
        
        bn = device.get('board_numbers', [])
        if not bn or bn == ['TBD']:
            issues.append('board_numbers')
        
        if issues:
            print(f"⚠️ {year} {name}: {issues}")
            incomplete += 1
        else:
            print(f"✅ {year} {name}")
            complete += 1
    
    print(f"\n📈 Итого: {complete} полных, {incomplete} неполных")

if __name__ == "__main__":
    main()
