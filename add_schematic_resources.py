#!/usr/bin/env python3
"""
Add schematic/boardview resources and complete iPad data
"""
import json
import os

# Ресурсы для схем и boardview
SCHEMATIC_RESOURCES = {
    "free_resources": [
        {
            "name": "GSM-Forum",
            "url": "https://forum.gsmhosting.com/vbb/f631/",
            "description": "Бесплатные схемы iPhone/iPad (требуется регистрация)",
            "coverage": "iPhone 5-XS, iPad различные модели",
            "type": "forum"
        },
        {
            "name": "Repair.Wiki",
            "url": "https://repair.wiki/",
            "description": "Вики с гайдами по ремонту и boardview",
            "coverage": "MacBook, iPad, iPhone",
            "type": "wiki"
        },
        {
            "name": "Logi.Wiki", 
            "url": "https://logi.wiki/",
            "description": "Справочник по номерам плат и ремонту logic board",
            "coverage": "MacBook все модели, iMac",
            "type": "wiki"
        },
        {
            "name": "Rossmann Group Forums",
            "url": "https://boards.rossmanngroup.com/",
            "description": "Форум по микропайке и ремонту плат",
            "coverage": "MacBook, iPhone data recovery",
            "type": "forum"
        },
        {
            "name": "iFixit Chip ID",
            "url": "https://www.ifixit.com/Search?query=chip+id",
            "description": "Идентификация чипов на разборках",
            "coverage": "iPhone, iPad, MacBook все модели",
            "type": "wiki"
        }
    ],
    "paid_resources": [
        {
            "name": "Borneo Schematics",
            "url": "https://updateborneo.com/",
            "description": "Профессиональный софт с схемами и boardview",
            "coverage": "iPhone, iPad, Samsung, все бренды",
            "type": "software",
            "price": "$40-80/год"
        },
        {
            "name": "ZXW Tool",
            "url": "https://www.zxwteam.cn/",
            "description": "Китайский профессиональный инструмент",
            "coverage": "iPhone, iPad полный охват",
            "type": "software",
            "price": "~$50/год"
        },
        {
            "name": "Laptop-Schematics.com",
            "url": "https://www.laptop-schematics.com/",
            "description": "Коммерческая база схем и boardview",
            "coverage": "iPhone, iPad, MacBook все модели",
            "type": "marketplace",
            "price": "$275 полный пакет"
        },
        {
            "name": "REWA Technology",
            "url": "https://www.rewatechnology.com/",
            "description": "Обучение и ресурсы по ремонту",
            "coverage": "iPhone, iPad обучающие материалы",
            "type": "training"
        },
        {
            "name": "Phoneboard.co",
            "url": "https://phoneboard.co/",
            "description": "Интерактивные boardview онлайн",
            "coverage": "iPhone, iPad, Samsung",
            "type": "online_tool",
            "price": "$10-30/месяц"
        }
    ],
    "youtube_channels": [
        {
            "name": "iPad Rehab",
            "url": "https://www.youtube.com/@iPadRehab",
            "description": "Джесс Джонс - микропайка iPhone/iPad",
            "specialty": "Data recovery, NAND repair"
        },
        {
            "name": "Rossmann Repair Group",
            "url": "https://www.youtube.com/@rossaborealischannel",
            "description": "Louis Rossmann - MacBook repair",
            "specialty": "MacBook logic board repair"
        },
        {
            "name": "Electronics Repair School",
            "url": "https://www.youtube.com/@ElectronicsRepairSchool",
            "description": "Практические ремонты с объяснениями",
            "specialty": "MacBook M1/M2, iPhone"
        },
        {
            "name": "Hugh Jeffreys",
            "url": "https://www.youtube.com/@HughJeffreys",
            "description": "Разборки и ремонты Apple устройств",
            "specialty": "Teardowns, component-level repair"
        },
        {
            "name": "Phone Repair Guru",
            "url": "https://www.youtube.com/@PhoneRepairGuru",
            "description": "Диагностика и ремонт телефонов",
            "specialty": "iPhone baseband, charging IC"
        }
    ]
}

# Данные для iPad
IPAD_DATA = {
    "iPad Pro 11\" (2018)": {
        "model": "A1980/A2013/A1934",
        "processor": "Apple A12X Bionic",
        "charging_ic": {"main": "CD3217B10", "designation": "U2200"},
        "power_ic": {"main": "338S00383", "designation": "U1801"},
        "common_issues": [
            "CD3217 failure (No charge)",
            "Bend/flex damage",
            "Face ID calibration issues",
            "USB-C port damage",
            "Display connector damage"
        ]
    },
    "iPad Pro 11\" (2020)": {
        "model": "A2228/A2068/A2230",
        "processor": "Apple A12Z Bionic",
        "charging_ic": {"main": "CD3217B12", "designation": "U2200"},
        "power_ic": {"main": "338S00383", "designation": "U1801"},
        "common_issues": [
            "CD3217B12 failure",
            "LiDAR sensor issues",
            "Ghost touch problems",
            "USB-C charging issues"
        ]
    },
    "iPad Pro 11\" (2021)": {
        "model": "A2377/A2459/A2301",
        "processor": "Apple M1",
        "charging_ic": {"main": "CD3217B12", "designation": "U2200"},
        "power_ic": {"main": "338S00770", "designation": "U1801"},
        "common_issues": [
            "CD3217 ROM pairing issues",
            "5G modem problems",
            "Thunderbolt port issues",
            "Mini-LED backlight (12.9 only)"
        ]
    },
    "iPad Pro 11\" (2022)": {
        "model": "A2759/A2435/A2761",
        "processor": "Apple M2",
        "charging_ic": {"main": "CD3217B12", "designation": "U2200"},
        "power_ic": {"main": "338S00817", "designation": "U1801"},
        "common_issues": [
            "CD3217 charging failures",
            "Apple Pencil hover issues",
            "USB-C controller damage",
            "Stage Manager bugs"
        ]
    },
    "iPad Pro 11\" M4 (2024)": {
        "model": "A3044/A3045/A3046",
        "processor": "Apple M4",
        "charging_ic": {"main": "CD3217B12", "designation": "U2200"},
        "power_ic": {"main": "Apple M4 integrated"},
        "common_issues": [
            "Early production issues",
            "OLED display problems",
            "USB-C port damage"
        ]
    },
    "iPad Pro 12.9\" (2018)": {
        "model": "A1876/A2014/A1895",
        "processor": "Apple A12X Bionic",
        "charging_ic": {"main": "CD3217B10", "designation": "U2200"},
        "power_ic": {"main": "338S00383", "designation": "U1801"},
        "common_issues": [
            "CD3217 charging failure",
            "Bend damage",
            "Face ID issues"
        ]
    },
    "iPad Pro 12.9\" (2020)": {
        "model": "A2229/A2069/A2232",
        "processor": "Apple A12Z Bionic",
        "charging_ic": {"main": "CD3217B12", "designation": "U2200"},
        "power_ic": {"main": "338S00383", "designation": "U1801"},
        "common_issues": [
            "CD3217B12 failure",
            "Ghost touch",
            "LiDAR sensor issues"
        ]
    },
    "iPad Pro 12.9\" (2021)": {
        "model": "A2378/A2461/A2379",
        "processor": "Apple M1",
        "charging_ic": {"main": "CD3217B12", "designation": "U2200"},
        "power_ic": {"main": "338S00770", "designation": "U1801"},
        "common_issues": [
            "Mini-LED backlight blooming",
            "CD3217 ROM issues",
            "5G modem problems"
        ]
    },
    "iPad Pro 12.9\" (2022)": {
        "model": "A2764/A2437/A2766",
        "processor": "Apple M2",
        "charging_ic": {"main": "CD3217B12", "designation": "U2200"},
        "power_ic": {"main": "338S00817", "designation": "U1801"},
        "common_issues": [
            "CD3217 charging issues",
            "Mini-LED problems",
            "USB-C controller damage"
        ]
    },
    "iPad Pro 13\" M4 (2024)": {
        "model": "A3047/A3048/A3049",
        "processor": "Apple M4",
        "charging_ic": {"main": "CD3217B12", "designation": "U2200"},
        "power_ic": {"main": "Apple M4 integrated"},
        "common_issues": [
            "OLED display issues",
            "Early production defects"
        ]
    },
    "iPad Air (2020)": {
        "model": "A2316/A2324/A2325",
        "processor": "Apple A14 Bionic",
        "charging_ic": {"main": "CD3217B12", "designation": "U2200"},
        "power_ic": {"main": "338S00456", "designation": "U1801"},
        "common_issues": [
            "CD3217 failure (common!)",
            "Touch ID issues",
            "USB-C port damage"
        ]
    },
    "iPad Air M1 (2022)": {
        "model": "A2588/A2589/A2591",
        "processor": "Apple M1",
        "charging_ic": {"main": "CD3217B12", "designation": "U2200"},
        "power_ic": {"main": "338S00770", "designation": "U1801"},
        "common_issues": [
            "CD3217 charging issues",
            "5G connection problems",
            "Front camera issues"
        ]
    },
    "iPad Air M2 (2024)": {
        "model": "A2898/A2899/A2900",
        "processor": "Apple M2",
        "charging_ic": {"main": "CD3217B12", "designation": "U2200"},
        "power_ic": {"main": "338S00817", "designation": "U1801"},
        "common_issues": [
            "USB-C charging issues",
            "Center Stage problems"
        ]
    },
    "iPad 10th Gen (2022)": {
        "model": "A2696/A2757/A2777",
        "processor": "Apple A14 Bionic",
        "charging_ic": {"main": "CD3217B12", "designation": "U2200"},
        "power_ic": {"main": "338S00456", "designation": "U1801"},
        "common_issues": [
            "CD3217 charging IC failure",
            "USB-C port issues",
            "Touch screen problems"
        ]
    }
}

def main():
    print("📚 Добавление ресурсов схем и boardview")
    
    # Сохраняем ресурсы
    resources_path = "public/data/schematic_resources.json"
    with open(resources_path, "w", encoding="utf-8") as f:
        json.dump(SCHEMATIC_RESOURCES, f, indent=2, ensure_ascii=False)
    print(f"  ✅ Сохранено: {resources_path}")
    
    # Обновляем данные iPad
    print("\n📱 Обновление данных iPad")
    
    with open("public/data/devices.json", "r", encoding="utf-8") as f:
        devices = json.load(f)
    
    updated = 0
    for device in devices:
        name = device.get("name", "")
        category = device.get("category", "")
        
        if category != "iPad":
            continue
        
        # Ищем соответствие
        for ipad_name, ipad_data in IPAD_DATA.items():
            # Нечеткое сопоставление
            if ipad_name.replace("\"", "").lower() in name.replace("\"", "").lower() or \
               name.replace("\"", "").lower() in ipad_name.replace("\"", "").lower():
                
                # Обновляем данные
                if ipad_data.get("charging_ic"):
                    device["charging_ic"] = ipad_data["charging_ic"]
                    
                if ipad_data.get("power_ic"):
                    device["power_ic"] = ipad_data["power_ic"]
                    
                if ipad_data.get("common_issues"):
                    existing = device.get("common_issues", [])
                    for issue in ipad_data["common_issues"]:
                        if issue not in existing:
                            existing.append(issue)
                    device["common_issues"] = existing
                
                if ipad_data.get("model"):
                    device["model_numbers"] = ipad_data["model"]
                
                print(f"  ✅ {name}: {ipad_data.get('charging_ic', {}).get('main', 'N/A')}")
                updated += 1
                break
    
    with open("public/data/devices.json", "w", encoding="utf-8") as f:
        json.dump(devices, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Обновлено iPad: {updated}")
    
    # Проверяем статистику
    ipad_with_charging = sum(1 for d in devices if d.get("category") == "iPad" and d.get("charging_ic"))
    ipad_total = sum(1 for d in devices if d.get("category") == "iPad")
    print(f"iPad с charging_ic: {ipad_with_charging}/{ipad_total}")
    
    # Выводим размеры файлов
    print("\n📊 Размеры файлов данных:")
    data_dir = "public/data"
    total_size = 0
    for f in sorted(os.listdir(data_dir)):
        if f.endswith(".json"):
            size = os.path.getsize(os.path.join(data_dir, f))
            total_size += size
            if size > 5000:
                print(f"  {f}: {size/1024:.1f} KB")
    print(f"  ВСЕГО: {total_size/1024:.1f} KB")

if __name__ == "__main__":
    main()
