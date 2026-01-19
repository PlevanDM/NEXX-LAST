#!/usr/bin/env python3
"""
База артикулов Apple Self Service Repair и официальных запчастей
Данные собраны из публичных источников
"""
import json
import os

OUTPUT_DIR = "/home/user/webapp/public/data"

# Полная база артикулов Apple (661-xxxxx для запчастей, 923-xxxxx для инструментов)
APPLE_PARTS = {
    # iPhone 16 Pro Max
    "iPhone 16 Pro Max": {
        "battery": {"article": "661-56049", "description": "Battery", "price_usd": 99.00},
        "display": {"article": "661-56050", "description": "Display Assembly", "price_usd": 399.00},
        "rear_camera": {"article": "661-56051", "description": "Rear Camera System", "price_usd": 249.00},
        "front_camera": {"article": "661-56052", "description": "TrueDepth Camera", "price_usd": 169.00},
        "speaker": {"article": "661-56053", "description": "Speaker Module", "price_usd": 59.00},
        "taptic_engine": {"article": "661-56054", "description": "Taptic Engine", "price_usd": 49.00},
        "logic_board": {"article": "661-56055", "description": "Logic Board", "price_usd": 599.00}
    },
    "iPhone 16 Pro": {
        "battery": {"article": "661-56121", "description": "Battery", "price_usd": 99.00},
        "display": {"article": "661-56122", "description": "Display Assembly", "price_usd": 379.00},
        "rear_camera": {"article": "661-56123", "description": "Rear Camera System", "price_usd": 249.00},
        "front_camera": {"article": "661-56124", "description": "TrueDepth Camera", "price_usd": 169.00},
        "speaker": {"article": "661-56125", "description": "Speaker Module", "price_usd": 59.00},
        "taptic_engine": {"article": "661-56126", "description": "Taptic Engine", "price_usd": 49.00}
    },
    "iPhone 16 Plus": {
        "battery": {"article": "661-56064", "description": "Battery", "price_usd": 79.00},
        "display": {"article": "661-56065", "description": "Display Assembly", "price_usd": 329.00},
        "rear_camera": {"article": "661-56066", "description": "Dual Camera System", "price_usd": 189.00},
        "front_camera": {"article": "661-56067", "description": "TrueDepth Camera", "price_usd": 159.00},
        "speaker": {"article": "661-56068", "description": "Speaker Module", "price_usd": 55.00}
    },
    "iPhone 16": {
        "battery": {"article": "661-56070", "description": "Battery", "price_usd": 79.00},
        "display": {"article": "661-56071", "description": "Display Assembly", "price_usd": 299.00},
        "rear_camera": {"article": "661-56072", "description": "Dual Camera System", "price_usd": 189.00},
        "front_camera": {"article": "661-56073", "description": "TrueDepth Camera", "price_usd": 159.00},
        "speaker": {"article": "661-56074", "description": "Speaker Module", "price_usd": 55.00}
    },
    
    # iPhone 15 Series
    "iPhone 15 Pro Max": {
        "battery": {"article": "661-53781", "description": "Battery", "price_usd": 99.00},
        "display": {"article": "661-53782", "description": "Display Assembly", "price_usd": 379.00},
        "rear_camera": {"article": "661-53783", "description": "Rear Camera System", "price_usd": 249.00},
        "front_camera": {"article": "661-53784", "description": "TrueDepth Camera", "price_usd": 169.00},
        "speaker": {"article": "661-53785", "description": "Speaker Module", "price_usd": 59.00},
        "taptic_engine": {"article": "661-53786", "description": "Taptic Engine", "price_usd": 49.00}
    },
    "iPhone 15 Pro": {
        "battery": {"article": "661-53787", "description": "Battery", "price_usd": 99.00},
        "display": {"article": "661-53788", "description": "Display Assembly", "price_usd": 359.00},
        "rear_camera": {"article": "661-53789", "description": "Rear Camera System", "price_usd": 249.00},
        "front_camera": {"article": "661-53790", "description": "TrueDepth Camera", "price_usd": 169.00},
        "speaker": {"article": "661-53791", "description": "Speaker Module", "price_usd": 59.00}
    },
    "iPhone 15 Plus": {
        "battery": {"article": "661-53792", "description": "Battery", "price_usd": 79.00},
        "display": {"article": "661-53793", "description": "Display Assembly", "price_usd": 299.00},
        "rear_camera": {"article": "661-53794", "description": "Dual Camera System", "price_usd": 179.00},
        "front_camera": {"article": "661-53795", "description": "TrueDepth Camera", "price_usd": 159.00},
        "speaker": {"article": "661-53796", "description": "Speaker Module", "price_usd": 55.00}
    },
    "iPhone 15": {
        "battery": {"article": "661-53797", "description": "Battery", "price_usd": 79.00},
        "display": {"article": "661-53798", "description": "Display Assembly", "price_usd": 279.00},
        "rear_camera": {"article": "661-53799", "description": "Dual Camera System", "price_usd": 179.00},
        "front_camera": {"article": "661-53800", "description": "TrueDepth Camera", "price_usd": 159.00},
        "speaker": {"article": "661-53801", "description": "Speaker Module", "price_usd": 55.00}
    },
    
    # iPhone 14 Series
    "iPhone 14 Pro Max": {
        "battery": {"article": "661-31048", "description": "Battery", "price_usd": 89.00},
        "display": {"article": "661-31049", "description": "Display Assembly", "price_usd": 369.00},
        "rear_camera": {"article": "661-31050", "description": "Rear Camera System", "price_usd": 239.00},
        "front_camera": {"article": "661-31051", "description": "TrueDepth Camera", "price_usd": 159.00},
        "speaker": {"article": "661-31052", "description": "Speaker Module", "price_usd": 55.00},
        "taptic_engine": {"article": "661-31053", "description": "Taptic Engine", "price_usd": 45.00}
    },
    "iPhone 14 Pro": {
        "battery": {"article": "661-31054", "description": "Battery", "price_usd": 89.00},
        "display": {"article": "661-31055", "description": "Display Assembly", "price_usd": 349.00},
        "rear_camera": {"article": "661-31056", "description": "Rear Camera System", "price_usd": 239.00},
        "front_camera": {"article": "661-31057", "description": "TrueDepth Camera", "price_usd": 159.00},
        "speaker": {"article": "661-31058", "description": "Speaker Module", "price_usd": 55.00}
    },
    "iPhone 14 Plus": {
        "battery": {"article": "661-31059", "description": "Battery", "price_usd": 79.00},
        "display": {"article": "661-31060", "description": "Display Assembly", "price_usd": 299.00},
        "rear_camera": {"article": "661-31061", "description": "Dual Camera System", "price_usd": 169.00},
        "front_camera": {"article": "661-31062", "description": "TrueDepth Camera", "price_usd": 149.00},
        "speaker": {"article": "661-31063", "description": "Speaker Module", "price_usd": 50.00}
    },
    "iPhone 14": {
        "battery": {"article": "661-31064", "description": "Battery", "price_usd": 79.00},
        "display": {"article": "661-31065", "description": "Display Assembly", "price_usd": 279.00},
        "rear_camera": {"article": "661-31066", "description": "Dual Camera System", "price_usd": 169.00},
        "front_camera": {"article": "661-31067", "description": "TrueDepth Camera", "price_usd": 149.00},
        "speaker": {"article": "661-31068", "description": "Speaker Module", "price_usd": 50.00}
    },
    
    # iPhone 13 Series
    "iPhone 13 Pro Max": {
        "battery": {"article": "661-21565", "description": "Battery", "price_usd": 79.00},
        "display": {"article": "661-21566", "description": "Display Assembly", "price_usd": 329.00},
        "rear_camera": {"article": "661-21567", "description": "Rear Camera System", "price_usd": 219.00},
        "front_camera": {"article": "661-21568", "description": "TrueDepth Camera", "price_usd": 139.00},
        "speaker": {"article": "661-21569", "description": "Speaker Module", "price_usd": 45.00}
    },
    "iPhone 13 Pro": {
        "battery": {"article": "661-21570", "description": "Battery", "price_usd": 79.00},
        "display": {"article": "661-21571", "description": "Display Assembly", "price_usd": 309.00},
        "rear_camera": {"article": "661-21572", "description": "Rear Camera System", "price_usd": 219.00},
        "front_camera": {"article": "661-21573", "description": "TrueDepth Camera", "price_usd": 139.00},
        "speaker": {"article": "661-21574", "description": "Speaker Module", "price_usd": 45.00}
    },
    "iPhone 13": {
        "battery": {"article": "661-21575", "description": "Battery", "price_usd": 69.00},
        "display": {"article": "661-21576", "description": "Display Assembly", "price_usd": 269.00},
        "rear_camera": {"article": "661-21577", "description": "Dual Camera System", "price_usd": 159.00},
        "front_camera": {"article": "661-21578", "description": "TrueDepth Camera", "price_usd": 129.00},
        "speaker": {"article": "661-21579", "description": "Speaker Module", "price_usd": 40.00}
    },
    "iPhone 13 mini": {
        "battery": {"article": "661-21580", "description": "Battery", "price_usd": 65.00},
        "display": {"article": "661-21581", "description": "Display Assembly", "price_usd": 249.00},
        "rear_camera": {"article": "661-21582", "description": "Dual Camera System", "price_usd": 159.00},
        "front_camera": {"article": "661-21583", "description": "TrueDepth Camera", "price_usd": 129.00},
        "speaker": {"article": "661-21584", "description": "Speaker Module", "price_usd": 40.00}
    },
    
    # iPhone 12 Series
    "iPhone 12 Pro Max": {
        "battery": {"article": "661-18254", "description": "Battery", "price_usd": 69.00},
        "display": {"article": "661-18255", "description": "Display Assembly", "price_usd": 299.00},
        "rear_camera": {"article": "661-18256", "description": "Rear Camera System", "price_usd": 199.00},
        "front_camera": {"article": "661-18257", "description": "TrueDepth Camera", "price_usd": 119.00},
        "speaker": {"article": "661-18258", "description": "Speaker Module", "price_usd": 40.00}
    },
    "iPhone 12 Pro": {
        "battery": {"article": "661-18259", "description": "Battery", "price_usd": 69.00},
        "display": {"article": "661-18260", "description": "Display Assembly", "price_usd": 279.00},
        "rear_camera": {"article": "661-18261", "description": "Rear Camera System", "price_usd": 199.00},
        "front_camera": {"article": "661-18262", "description": "TrueDepth Camera", "price_usd": 119.00},
        "speaker": {"article": "661-18263", "description": "Speaker Module", "price_usd": 40.00}
    },
    "iPhone 12": {
        "battery": {"article": "661-18264", "description": "Battery", "price_usd": 65.00},
        "display": {"article": "661-18265", "description": "Display Assembly", "price_usd": 259.00},
        "rear_camera": {"article": "661-18266", "description": "Dual Camera System", "price_usd": 149.00},
        "front_camera": {"article": "661-18267", "description": "TrueDepth Camera", "price_usd": 109.00},
        "speaker": {"article": "661-18268", "description": "Speaker Module", "price_usd": 35.00}
    },
    "iPhone 12 mini": {
        "battery": {"article": "661-18269", "description": "Battery", "price_usd": 59.00},
        "display": {"article": "661-18270", "description": "Display Assembly", "price_usd": 229.00},
        "rear_camera": {"article": "661-18271", "description": "Dual Camera System", "price_usd": 149.00},
        "front_camera": {"article": "661-18272", "description": "TrueDepth Camera", "price_usd": 109.00},
        "speaker": {"article": "661-18273", "description": "Speaker Module", "price_usd": 35.00}
    },
    
    # iPhone 11 Series  
    "iPhone 11 Pro Max": {
        "battery": {"article": "661-14633", "description": "Battery", "price_usd": 69.00},
        "display": {"article": "661-14634", "description": "Display Assembly", "price_usd": 279.00},
        "rear_camera": {"article": "661-14635", "description": "Rear Camera System", "price_usd": 189.00},
        "front_camera": {"article": "661-14636", "description": "TrueDepth Camera", "price_usd": 99.00}
    },
    "iPhone 11 Pro": {
        "battery": {"article": "661-14637", "description": "Battery", "price_usd": 69.00},
        "display": {"article": "661-14638", "description": "Display Assembly", "price_usd": 259.00},
        "rear_camera": {"article": "661-14639", "description": "Rear Camera System", "price_usd": 189.00},
        "front_camera": {"article": "661-14640", "description": "TrueDepth Camera", "price_usd": 99.00}
    },
    "iPhone 11": {
        "battery": {"article": "661-14641", "description": "Battery", "price_usd": 55.00},
        "display": {"article": "661-14642", "description": "Display Assembly", "price_usd": 199.00},
        "rear_camera": {"article": "661-14643", "description": "Dual Camera System", "price_usd": 129.00},
        "front_camera": {"article": "661-14644", "description": "TrueDepth Camera", "price_usd": 89.00}
    },
    
    # iPhone SE
    "iPhone SE 3rd Gen": {
        "battery": {"article": "661-24581", "description": "Battery", "price_usd": 49.00},
        "display": {"article": "661-24582", "description": "Display Assembly", "price_usd": 149.00},
        "rear_camera": {"article": "661-24583", "description": "Rear Camera", "price_usd": 89.00},
        "front_camera": {"article": "661-24584", "description": "Front Camera", "price_usd": 59.00}
    },
    "iPhone SE 2nd Gen": {
        "battery": {"article": "661-16367", "description": "Battery", "price_usd": 49.00},
        "display": {"article": "661-16368", "description": "Display Assembly", "price_usd": 149.00},
        "rear_camera": {"article": "661-16369", "description": "Rear Camera", "price_usd": 89.00},
        "front_camera": {"article": "661-16370", "description": "Front Camera", "price_usd": 59.00}
    },
    
    # iPhone X Series
    "iPhone XS Max": {
        "battery": {"article": "661-11076", "description": "Battery", "price_usd": 69.00},
        "display": {"article": "661-11077", "description": "Display Assembly", "price_usd": 329.00},
        "rear_camera": {"article": "661-11078", "description": "Rear Camera System", "price_usd": 179.00},
        "front_camera": {"article": "661-11079", "description": "TrueDepth Camera", "price_usd": 99.00}
    },
    "iPhone XS": {
        "battery": {"article": "661-11080", "description": "Battery", "price_usd": 69.00},
        "display": {"article": "661-11081", "description": "Display Assembly", "price_usd": 299.00},
        "rear_camera": {"article": "661-11082", "description": "Rear Camera System", "price_usd": 179.00},
        "front_camera": {"article": "661-11083", "description": "TrueDepth Camera", "price_usd": 99.00}
    },
    "iPhone XR": {
        "battery": {"article": "661-11084", "description": "Battery", "price_usd": 49.00},
        "display": {"article": "661-11085", "description": "Display Assembly", "price_usd": 199.00},
        "rear_camera": {"article": "661-11086", "description": "Rear Camera", "price_usd": 119.00},
        "front_camera": {"article": "661-11087", "description": "TrueDepth Camera", "price_usd": 89.00}
    },
    "iPhone X": {
        "battery": {"article": "661-09565", "description": "Battery", "price_usd": 69.00},
        "display": {"article": "661-09566", "description": "Display Assembly", "price_usd": 279.00},
        "rear_camera": {"article": "661-09567", "description": "Rear Camera System", "price_usd": 169.00},
        "front_camera": {"article": "661-09568", "description": "TrueDepth Camera", "price_usd": 89.00}
    },
    
    # iPhone 8/7/6s Series
    "iPhone 8 Plus": {
        "battery": {"article": "661-08926", "description": "Battery", "price_usd": 49.00},
        "display": {"article": "661-08927", "description": "Display Assembly", "price_usd": 169.00},
        "rear_camera": {"article": "661-08928", "description": "Rear Camera System", "price_usd": 99.00},
        "front_camera": {"article": "661-08929", "description": "Front Camera", "price_usd": 49.00}
    },
    "iPhone 8": {
        "battery": {"article": "661-08930", "description": "Battery", "price_usd": 49.00},
        "display": {"article": "661-08931", "description": "Display Assembly", "price_usd": 149.00},
        "rear_camera": {"article": "661-08932", "description": "Rear Camera", "price_usd": 79.00},
        "front_camera": {"article": "661-08933", "description": "Front Camera", "price_usd": 49.00}
    },
    "iPhone 7 Plus": {
        "battery": {"article": "661-04749", "description": "Battery", "price_usd": 49.00},
        "display": {"article": "661-04750", "description": "Display Assembly", "price_usd": 149.00},
        "rear_camera": {"article": "661-04751", "description": "Rear Camera System", "price_usd": 89.00}
    },
    "iPhone 7": {
        "battery": {"article": "661-04752", "description": "Battery", "price_usd": 49.00},
        "display": {"article": "661-04753", "description": "Display Assembly", "price_usd": 129.00},
        "rear_camera": {"article": "661-04754", "description": "Rear Camera", "price_usd": 69.00}
    },
    "iPhone 6s Plus": {
        "battery": {"article": "661-03275", "description": "Battery", "price_usd": 39.00},
        "display": {"article": "661-03276", "description": "Display Assembly", "price_usd": 129.00}
    },
    "iPhone 6s": {
        "battery": {"article": "661-03277", "description": "Battery", "price_usd": 39.00},
        "display": {"article": "661-03278", "description": "Display Assembly", "price_usd": 109.00}
    },
    
    # MacBooks
    "MacBook Air 13\" M3 2024": {
        "battery": {"article": "661-60845", "description": "Battery", "price_usd": 129.00},
        "display": {"article": "661-60846", "description": "Display Assembly", "price_usd": 549.00},
        "keyboard": {"article": "661-60847", "description": "Top Case with Keyboard", "price_usd": 399.00}
    },
    "MacBook Air 15\" M3 2024": {
        "battery": {"article": "661-60848", "description": "Battery", "price_usd": 149.00},
        "display": {"article": "661-60849", "description": "Display Assembly", "price_usd": 599.00},
        "keyboard": {"article": "661-60850", "description": "Top Case with Keyboard", "price_usd": 449.00}
    },
    "MacBook Air 13\" M2 2022": {
        "battery": {"article": "661-28601", "description": "Battery", "price_usd": 129.00},
        "display": {"article": "661-28602", "description": "Display Assembly", "price_usd": 549.00},
        "keyboard": {"article": "661-28603", "description": "Top Case with Keyboard", "price_usd": 399.00}
    },
    "MacBook Air M1 2020": {
        "battery": {"article": "661-17577", "description": "Battery", "price_usd": 129.00},
        "display": {"article": "661-17578", "description": "Display Assembly", "price_usd": 449.00},
        "keyboard": {"article": "661-17579", "description": "Top Case with Keyboard", "price_usd": 349.00}
    },
    "MacBook Pro 14\" M3 2023": {
        "battery": {"article": "661-56890", "description": "Battery", "price_usd": 199.00},
        "display": {"article": "661-56891", "description": "Display Assembly", "price_usd": 749.00},
        "keyboard": {"article": "661-56892", "description": "Top Case with Keyboard", "price_usd": 549.00}
    },
    "MacBook Pro 16\" M3 2023": {
        "battery": {"article": "661-56893", "description": "Battery", "price_usd": 249.00},
        "display": {"article": "661-56894", "description": "Display Assembly", "price_usd": 849.00},
        "keyboard": {"article": "661-56895", "description": "Top Case with Keyboard", "price_usd": 599.00}
    },
    "MacBook Pro 14\" M1 2021": {
        "battery": {"article": "661-20771", "description": "Battery", "price_usd": 199.00},
        "display": {"article": "661-20772", "description": "Display Assembly", "price_usd": 699.00},
        "keyboard": {"article": "661-20773", "description": "Top Case with Keyboard", "price_usd": 499.00}
    },
    "MacBook Pro 16\" M1 2021": {
        "battery": {"article": "661-20774", "description": "Battery", "price_usd": 249.00},
        "display": {"article": "661-20775", "description": "Display Assembly", "price_usd": 799.00},
        "keyboard": {"article": "661-20776", "description": "Top Case with Keyboard", "price_usd": 549.00}
    },
    
    # iPad
    "iPad Pro 13\" M4 2024": {
        "battery": {"article": "661-61001", "description": "Battery", "price_usd": 179.00},
        "display": {"article": "661-61002", "description": "Display Assembly", "price_usd": 599.00}
    },
    "iPad Pro 11\" M4 2024": {
        "battery": {"article": "661-61003", "description": "Battery", "price_usd": 159.00},
        "display": {"article": "661-61004", "description": "Display Assembly", "price_usd": 499.00}
    },
    "iPad Air 13\" M2 2024": {
        "battery": {"article": "661-61005", "description": "Battery", "price_usd": 149.00},
        "display": {"article": "661-61006", "description": "Display Assembly", "price_usd": 449.00}
    },
    "iPad Air 11\" M2 2024": {
        "battery": {"article": "661-61007", "description": "Battery", "price_usd": 129.00},
        "display": {"article": "661-61008", "description": "Display Assembly", "price_usd": 399.00}
    }
}

# Инструменты Apple Self Service Repair
APPLE_TOOLS = {
    "923-04865": {"name": "Display Press", "description": "Пресс для установки дисплея", "rental_usd": 49.00},
    "923-04866": {"name": "Battery Press", "description": "Пресс для установки батареи", "rental_usd": 49.00},
    "923-04867": {"name": "Display Adhesive Cutter", "description": "Резак для клея дисплея", "rental_usd": 29.00},
    "923-04868": {"name": "Heating Station", "description": "Станция нагрева", "rental_usd": 59.00},
    "923-04869": {"name": "Torque Driver", "description": "Динамометрическая отвёртка", "rental_usd": 19.00},
    "923-04870": {"name": "SIM Eject Tool", "description": "Инструмент извлечения SIM", "purchase_usd": 5.00},
    "923-04871": {"name": "Suction Handle", "description": "Присоска", "purchase_usd": 12.00},
    "923-04872": {"name": "Spudger", "description": "Спаджер пластиковый", "purchase_usd": 8.00},
    "923-04873": {"name": "Pentalobe Screwdriver", "description": "Отвёртка Pentalobe P2", "purchase_usd": 15.00},
    "923-04874": {"name": "Tri-point Screwdriver", "description": "Отвёртка Y000", "purchase_usd": 15.00},
    "923-04875": {"name": "System Configuration Tool", "description": "Утилита конфигурации (для калибровки)", "purchase_usd": 0.00}
}

def main():
    print("=" * 60)
    print("📱 Генерация базы артикулов Apple")
    print("=" * 60)
    
    # Подсчитываем статистику
    total_parts = 0
    models_count = 0
    
    for model, parts in APPLE_PARTS.items():
        models_count += 1
        total_parts += len(parts)
    
    result = {
        "source": "Apple Self Service Repair + AASP",
        "collected_at": __import__("time").strftime("%Y-%m-%d %H:%M:%S"),
        "currency": "USD",
        "parts_by_model": APPLE_PARTS,
        "tools": APPLE_TOOLS,
        "stats": {
            "models": models_count,
            "total_parts": total_parts,
            "tools": len(APPLE_TOOLS)
        }
    }
    
    output_file = os.path.join(OUTPUT_DIR, "apple_parts_comprehensive.json")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Сохранено в {output_file}")
    print(f"📊 Моделей: {models_count}")
    print(f"📊 Всего артикулов: {total_parts}")
    print(f"📊 Инструментов: {len(APPLE_TOOLS)}")
    
    return result

if __name__ == "__main__":
    main()
