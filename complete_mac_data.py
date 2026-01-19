#!/usr/bin/env python3
"""
Заполнение board numbers для MacBook
Источник: repair.wiki/w/Macbook_Board_and_Model_numbers
"""

import json
import os

DATA_DIR = "/home/user/webapp/public/data"
DEVICES_FILE = os.path.join(DATA_DIR, "devices.json")

# MacBook Air board numbers
MACBOOK_AIR_DATA = {
    "MacBook Air M4 13\"": {"board_numbers": ["820-03597-A"], "year": 2025, "processor": "Apple M4"},
    "MacBook Air M4 15\"": {"board_numbers": ["820-03681"], "year": 2025, "processor": "Apple M4"},
    "MacBook Air M3 13\"": {"board_numbers": ["820-03285"], "year": 2024, "processor": "Apple M3"},
    "MacBook Air M3 15\"": {"board_numbers": ["820-03286"], "year": 2024, "processor": "Apple M3"},
    "MacBook Air M2 13\"": {"board_numbers": ["820-02536"], "year": 2022, "processor": "Apple M2"},
    "MacBook Air M2 15\"": {"board_numbers": ["820-02537"], "year": 2023, "processor": "Apple M2"},
    "MacBook Air M1": {"board_numbers": ["820-02016"], "year": 2020, "processor": "Apple M1"},
    "MacBook Air 13\" (2020)": {"board_numbers": ["820-01055", "820-01958"], "year": 2020, "processor": "Intel Core i5 10th Gen"},
    "MacBook Air 13\" (2019)": {"board_numbers": ["820-01521"], "year": 2019, "processor": "Intel Core i5 8th Gen"},
    "MacBook Air 13\" (2018)": {"board_numbers": ["820-01521"], "year": 2018, "processor": "Intel Core i5 8th Gen"},
    "MacBook Air 13\" (2017)": {"board_numbers": ["820-00165"], "year": 2017, "processor": "Intel Core i5 5th Gen"},
    "MacBook Air 11\" (2015)": {"board_numbers": ["820-00164"], "year": 2015, "processor": "Intel Core i5 5th Gen"},
    "MacBook Air 13\" (2015)": {"board_numbers": ["820-00165"], "year": 2015, "processor": "Intel Core i5 5th Gen"},
}

# MacBook Pro board numbers
MACBOOK_PRO_DATA = {
    # M4 серия
    "MacBook Pro M4 14\"": {"board_numbers": ["820-03129"], "year": 2024, "processor": "Apple M4"},
    "MacBook Pro M4 Pro 14\"": {"board_numbers": ["820-03400"], "year": 2024, "processor": "Apple M4 Pro"},
    "MacBook Pro M4 Max 14\"": {"board_numbers": ["820-03400"], "year": 2024, "processor": "Apple M4 Max"},
    "MacBook Pro M4 Pro 16\"": {"board_numbers": ["820-03401"], "year": 2024, "processor": "Apple M4 Pro"},
    "MacBook Pro M4 Max 16\"": {"board_numbers": ["820-03401"], "year": 2024, "processor": "Apple M4 Max"},
    
    # M3 серия
    "MacBook Pro M3 14\"": {"board_numbers": ["820-02757"], "year": 2023, "processor": "Apple M3"},
    "MacBook Pro M3 Pro 14\"": {"board_numbers": ["820-02918"], "year": 2023, "processor": "Apple M3 Pro"},
    "MacBook Pro M3 Max 14\"": {"board_numbers": ["820-02918"], "year": 2023, "processor": "Apple M3 Max"},
    "MacBook Pro M3 Pro 16\"": {"board_numbers": ["820-02935"], "year": 2023, "processor": "Apple M3 Pro"},
    "MacBook Pro M3 Max 16\"": {"board_numbers": ["820-02935"], "year": 2023, "processor": "Apple M3 Max"},
    
    # M2 серия
    "MacBook Pro M2 13\"": {"board_numbers": ["820-02773"], "year": 2022, "processor": "Apple M2"},
    "MacBook Pro M2 Pro 14\"": {"board_numbers": ["820-02655", "820-02841"], "year": 2023, "processor": "Apple M2 Pro"},
    "MacBook Pro M2 Max 14\"": {"board_numbers": ["820-02655", "820-02841"], "year": 2023, "processor": "Apple M2 Max"},
    "MacBook Pro M2 Pro 16\"": {"board_numbers": ["820-02652", "820-02890"], "year": 2023, "processor": "Apple M2 Pro"},
    "MacBook Pro M2 Max 16\"": {"board_numbers": ["820-02652", "820-02890"], "year": 2023, "processor": "Apple M2 Max"},
    
    # M1 серия
    "MacBook Pro M1 13\"": {"board_numbers": ["820-02020"], "year": 2020, "processor": "Apple M1"},
    "MacBook Pro M1 Pro 14\"": {"board_numbers": ["820-02098", "820-02443"], "year": 2021, "processor": "Apple M1 Pro"},
    "MacBook Pro M1 Max 14\"": {"board_numbers": ["820-02098", "820-02443"], "year": 2021, "processor": "Apple M1 Max"},
    "MacBook Pro M1 Pro 16\"": {"board_numbers": ["820-02100", "820-02382"], "year": 2021, "processor": "Apple M1 Pro"},
    "MacBook Pro M1 Max 16\"": {"board_numbers": ["820-02100", "820-02382"], "year": 2021, "processor": "Apple M1 Max"},
    
    # Intel серия
    "MacBook Pro 16\" (2019)": {"board_numbers": ["820-01700"], "year": 2019, "processor": "Intel Core i9 9th Gen"},
    "MacBook Pro 15\" (2019)": {"board_numbers": ["820-01814", "820-01827"], "year": 2019, "processor": "Intel Core i9 9th Gen"},
    "MacBook Pro 13\" (2020) 4TB": {"board_numbers": ["820-01949"], "year": 2020, "processor": "Intel Core i5 10th Gen"},
    "MacBook Pro 13\" (2020) 2TB": {"board_numbers": ["820-01987"], "year": 2020, "processor": "Intel Core i5 8th Gen"},
    "MacBook Pro 15\" (2018)": {"board_numbers": ["820-01041", "820-01326"], "year": 2018, "processor": "Intel Core i7 8th Gen"},
    "MacBook Pro 13\" (2018)": {"board_numbers": ["820-00850"], "year": 2018, "processor": "Intel Core i5 8th Gen"},
    "MacBook Pro 15\" (2017)": {"board_numbers": ["820-00928"], "year": 2017, "processor": "Intel Core i7 7th Gen"},
    "MacBook Pro 13\" (2017) TB": {"board_numbers": ["820-00923"], "year": 2017, "processor": "Intel Core i5 7th Gen"},
    "MacBook Pro 13\" (2017) No TB": {"board_numbers": ["820-00840"], "year": 2017, "processor": "Intel Core i5 7th Gen"},
    "MacBook Pro 15\" (2016)": {"board_numbers": ["820-00281"], "year": 2016, "processor": "Intel Core i7 6th Gen"},
    "MacBook Pro 13\" (2016) TB": {"board_numbers": ["820-00239"], "year": 2016, "processor": "Intel Core i5 6th Gen"},
    "MacBook Pro 13\" (2016) No TB": {"board_numbers": ["820-00875"], "year": 2016, "processor": "Intel Core i5 6th Gen"},
    "MacBook Pro 15\" (2015)": {"board_numbers": ["820-00138", "820-00163", "820-00426"], "year": 2015, "processor": "Intel Core i7 5th Gen"},
    "MacBook Pro 13\" (2015)": {"board_numbers": ["820-4924"], "year": 2015, "processor": "Intel Core i5 5th Gen"},
}

def update_mac_devices(devices, mac_data, category_filter=None):
    """Обновить устройства Mac"""
    updated = 0
    
    for device in devices:
        if device.get('category') != 'Mac':
            continue
        
        name = device.get('name', '')
        
        # Попробовать найти соответствие
        for pattern, data in mac_data.items():
            # Проверить частичное совпадение
            pattern_lower = pattern.lower()
            name_lower = name.lower()
            
            # Точное совпадение или pattern содержится в name
            if pattern_lower in name_lower or name_lower in pattern_lower:
                # Обновить board_numbers
                if 'board_numbers' in data:
                    existing_bn = device.get('board_numbers', [])
                    if not existing_bn or existing_bn == ['TBD']:
                        device['board_numbers'] = data['board_numbers']
                        updated += 1
                        print(f"  ✅ {name}: {data['board_numbers']}")
                break
    
    return updated

def main():
    print("🔧 Заполнение board numbers для MacBook")
    
    with open(DEVICES_FILE, 'r', encoding='utf-8') as f:
        devices = json.load(f)
    
    # Сначала добавим все MacBook Air
    all_mac_data = {}
    all_mac_data.update(MACBOOK_AIR_DATA)
    all_mac_data.update(MACBOOK_PRO_DATA)
    
    updated = update_mac_devices(devices, all_mac_data)
    
    print(f"\nОбновлено: {updated}")
    
    with open(DEVICES_FILE, 'w', encoding='utf-8') as f:
        json.dump(devices, f, ensure_ascii=False, indent=2)
    
    print("✅ Сохранено")
    
    # Проверка
    macs = [d for d in devices if d.get('category') == 'Mac']
    with_bn = sum(1 for d in macs if d.get('board_numbers') and d.get('board_numbers') != ['TBD'])
    print(f"\nMac с board_numbers: {with_bn}/{len(macs)}")

if __name__ == "__main__":
    main()
