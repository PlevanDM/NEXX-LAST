#!/usr/bin/env python3
"""
Заполнение данных для iPhone до 2020 года
"""

import json
import os

DATA_DIR = "/home/user/webapp/public/data"
DEVICES_FILE = os.path.join(DATA_DIR, "devices.json")

# Данные по старым iPhone
OLD_IPHONE_DATA = {
    # iPhone 11 серия (2019)
    "iPhone 11": {
        "modem": {
            "chip": "Intel XMM7660",
            "type": "4G LTE Advanced Pro",
            "manufacturer": "Intel",
            "notes": "Последний iPhone с Intel модемом"
        },
        "board_numbers": ["820-01738"]
    },
    "iPhone 11 Pro": {
        "modem": {
            "chip": "Intel XMM7660",
            "type": "4G LTE Advanced Pro",
            "manufacturer": "Intel"
        },
        "board_numbers": ["820-01734"]
    },
    "iPhone 11 Pro Max": {
        "modem": {
            "chip": "Intel XMM7660",
            "type": "4G LTE Advanced Pro",
            "manufacturer": "Intel"
        },
        "board_numbers": ["820-01736"]
    },
    
    # iPhone XS/XR серия (2018)
    "iPhone XS": {
        "modem": {
            "chip": "Intel XMM7560",
            "type": "4G LTE Advanced",
            "manufacturer": "Intel"
        },
        "board_numbers": ["820-01388"]
    },
    "iPhone XS Max": {
        "modem": {
            "chip": "Intel XMM7560",
            "type": "4G LTE Advanced",
            "manufacturer": "Intel"
        },
        "board_numbers": ["820-01386"]
    },
    "iPhone XR": {
        "modem": {
            "chip": "Intel XMM7560",
            "type": "4G LTE Advanced",
            "manufacturer": "Intel"
        },
        "board_numbers": ["820-01390"]
    },
    
    # iPhone X/8 серия (2017)
    "iPhone X": {
        "modem": {
            "chip": "Qualcomm MDM9655 / Intel XMM7480",
            "type": "4G LTE Advanced",
            "manufacturer": "Qualcomm/Intel",
            "notes": "Dual source: Qualcomm для US, Intel для остальных"
        },
        "board_numbers": ["820-00863 (Top)", "820-00864 (Bottom)"]
    },
    "iPhone 8": {
        "modem": {
            "chip": "Qualcomm MDM9655 / Intel XMM7480",
            "type": "4G LTE Advanced",
            "manufacturer": "Qualcomm/Intel"
        },
        "board_numbers": ["820-00832"]
    },
    "iPhone 8 Plus": {
        "modem": {
            "chip": "Qualcomm MDM9655 / Intel XMM7480",
            "type": "4G LTE Advanced",
            "manufacturer": "Qualcomm/Intel"
        },
        "board_numbers": ["820-00830"]
    },
    
    # iPhone 7 серия (2016)
    "iPhone 7": {
        "modem": {
            "chip": "Qualcomm MDM9645M / Intel XMM7360",
            "type": "4G LTE Advanced",
            "manufacturer": "Qualcomm/Intel",
            "notes": "A1660/A1661 = Qualcomm, A1778/A1784 = Intel"
        },
        "board_numbers": ["820-00188"]
    },
    "iPhone 7 Plus": {
        "modem": {
            "chip": "Qualcomm MDM9645M / Intel XMM7360",
            "type": "4G LTE Advanced",
            "manufacturer": "Qualcomm/Intel"
        },
        "board_numbers": ["820-00186"]
    },
    "iPhone SE (1st gen)": {
        "modem": {
            "chip": "Qualcomm MDM9625M",
            "type": "4G LTE",
            "manufacturer": "Qualcomm"
        },
        "board_numbers": ["820-5585"]
    },
    
    # iPhone 6s серия (2015)
    "iPhone 6s": {
        "modem": {
            "chip": "Qualcomm MDM9635M",
            "type": "4G LTE Advanced",
            "manufacturer": "Qualcomm"
        },
        "board_numbers": ["820-5585"]
    },
    "iPhone 6s Plus": {
        "modem": {
            "chip": "Qualcomm MDM9635M",
            "type": "4G LTE Advanced",
            "manufacturer": "Qualcomm"
        },
        "board_numbers": ["820-5583"]
    }
}

def main():
    print("🔧 Заполнение данных старых iPhone (до 2020)")
    
    with open(DEVICES_FILE, 'r', encoding='utf-8') as f:
        devices = json.load(f)
    
    updated = 0
    for name, data in OLD_IPHONE_DATA.items():
        for device in devices:
            if device.get('name') == name:
                # Обновить modem
                if 'modem' in data:
                    device['modem'] = data['modem']
                
                # Обновить board_numbers
                if 'board_numbers' in data:
                    existing = device.get('board_numbers', [])
                    if not existing or existing == ['TBD']:
                        device['board_numbers'] = data['board_numbers']
                
                print(f"  ✅ {name}")
                updated += 1
                break
    
    with open(DEVICES_FILE, 'w', encoding='utf-8') as f:
        json.dump(devices, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Обновлено: {updated} устройств")

if __name__ == "__main__":
    main()
