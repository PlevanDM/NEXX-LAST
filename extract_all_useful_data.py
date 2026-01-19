#!/usr/bin/env python3
"""
Extract ALL useful technical data from Apple Service Price List
- Part numbers (661-xxxxx, 923-xxxxx, etc.)
- Logic Board specs (CPU, GPU, RAM, Storage)
- Component compatibility data
- Model numbers mapping
"""
import pandas as pd
import json
import re
from collections import defaultdict

UAH_TO_USD = 41.5

def extract_specs_from_description(desc):
    """Извлечь технические спецификации из описания"""
    specs = {}
    
    # CPU frequency (GHz)
    ghz = re.search(r'(\d+\.?\d*)\s*GHz', desc, re.IGNORECASE)
    if ghz:
        specs['cpu_ghz'] = float(ghz.group(1))
    
    # CPU cores
    cores = re.search(r'(\d+)-core\s*CPU', desc, re.IGNORECASE)
    if cores:
        specs['cpu_cores'] = int(cores.group(1))
    
    # GPU cores
    gpu_cores = re.search(r'(\d+)-core\s*GPU', desc, re.IGNORECASE)
    if gpu_cores:
        specs['gpu_cores'] = int(gpu_cores.group(1))
    
    # RAM (GB)
    ram = re.search(r'(\d+)\s*GB(?:,|\s|$)', desc)
    if ram:
        specs['ram_gb'] = int(ram.group(1))
    
    # Storage (GB/TB)
    storage_tb = re.search(r'(\d+)\s*TB', desc)
    storage_gb = re.search(r'(\d+)\s*GB.*(?:SSD|storage|Flash)', desc, re.IGNORECASE)
    if storage_tb:
        specs['storage_gb'] = int(storage_tb.group(1)) * 1024
    elif storage_gb:
        specs['storage_gb'] = int(storage_gb.group(1))
    
    # Apple Silicon chip
    for chip in ['M4 Pro', 'M4 Max', 'M4', 'M3 Pro', 'M3 Max', 'M3', 'M2 Pro', 'M2 Max', 'M2', 'M1 Pro', 'M1 Max', 'M1']:
        if chip in desc:
            specs['chip'] = chip
            break
    
    # Intel processor
    intel = re.search(r'(i[357])', desc)
    if intel:
        specs['intel_cpu'] = intel.group(1)
    
    # GPU (Radeon)
    radeon = re.search(r'Radeon\s*Pro\s*(\d+)', desc, re.IGNORECASE)
    if radeon:
        specs['gpu'] = f"Radeon Pro {radeon.group(1)}"
    
    return specs

def extract_model_from_description(desc):
    """Извлечь модель устройства"""
    # MacBook Air
    if 'MacBook Air' in desc:
        match = re.search(r'MacBook Air \(([^)]+)\)', desc)
        if match:
            return f"MacBook Air ({match.group(1)})"
        # M-series
        if 'M1' in desc:
            return "MacBook Air (M1, 2020)"
        if 'M2' in desc:
            if '15' in desc:
                return "MacBook Air 15\" (M2, 2023)"
            return "MacBook Air (M2, 2022)"
        if 'M3' in desc:
            if '15' in desc:
                return "MacBook Air 15\" (M3, 2024)"
            return "MacBook Air 13\" (M3, 2024)"
        if 'M4' in desc:
            if '15' in desc:
                return "MacBook Air 15\" (M4, 2025)"
            return "MacBook Air 13\" (M4, 2025)"
    
    # MacBook Pro
    if 'MacBook Pro' in desc or 'MBP' in desc:
        match = re.search(r'MacBook Pro \(([^)]+)\)', desc)
        if match:
            return f"MacBook Pro ({match.group(1)})"
        # By size and chip
        if 'M1' in desc:
            if '16' in desc:
                return "MacBook Pro 16\" (M1, 2021)"
            if '14' in desc:
                return "MacBook Pro 14\" (M1, 2021)"
            return "MacBook Pro 13\" (M1, 2020)"
        if 'M2' in desc:
            if '16' in desc:
                return "MacBook Pro 16\" (M2, 2023)"
            if '14' in desc:
                return "MacBook Pro 14\" (M2, 2023)"
            return "MacBook Pro 13\" (M2, 2022)"
        if 'M3' in desc:
            if '16' in desc:
                return "MacBook Pro 16\" (M3, 2023)"
            if '14' in desc:
                return "MacBook Pro 14\" (M3, 2023)"
        if 'M4' in desc:
            if '16' in desc:
                return "MacBook Pro 16\" (M4, 2024)"
            if '14' in desc:
                return "MacBook Pro 14\" (M4, 2024)"
    
    # iMac
    if 'iMac' in desc:
        match = re.search(r'iMac \(([^)]+)\)', desc)
        if match:
            return f"iMac ({match.group(1)})"
    
    # Mac mini
    if 'Mac mini' in desc:
        match = re.search(r'Mac mini \(([^)]+)\)', desc)
        if match:
            return f"Mac mini ({match.group(1)})"
    
    # iPhone
    iphone_patterns = [
        r'iPhone 17 Pro Max', r'iPhone 17 Pro', r'iPhone 17',
        r'iPhone 16 Pro Max', r'iPhone 16 Pro', r'iPhone 16 Plus', r'iPhone 16e', r'iPhone 16',
        r'iPhone 15 Pro Max', r'iPhone 15 Pro', r'iPhone 15 Plus', r'iPhone 15',
        r'iPhone 14 Pro Max', r'iPhone 14 Pro', r'iPhone 14 Plus', r'iPhone 14',
        r'iPhone 13 Pro Max', r'iPhone 13 Pro', r'iPhone 13 mini', r'iPhone 13',
        r'iPhone 12 Pro Max', r'iPhone 12 Pro', r'iPhone 12 mini', r'iPhone 12',
        r'iPhone 11 Pro Max', r'iPhone 11 Pro', r'iPhone 11',
        r'iPhone XS Max', r'iPhone XS', r'iPhone XR', r'iPhone X',
        r'iPhone SE', r'iPhone 8 Plus', r'iPhone 8', r'iPhone 7 Plus', r'iPhone 7',
        r'iPhone 6s Plus', r'iPhone 6s', r'iPhone 6 Plus', r'iPhone 6'
    ]
    for pattern in iphone_patterns:
        if re.search(pattern, desc, re.IGNORECASE):
            return re.search(pattern, desc, re.IGNORECASE).group(0)
    
    # iPad
    if 'iPad' in desc:
        match = re.search(r'iPad[^,)]*(?:\([^)]+\))?', desc)
        if match:
            return match.group(0).strip()
    
    # Apple Watch
    if 'Watch' in desc:
        match = re.search(r'Apple Watch[^,)]*(?:\([^)]+\))?', desc)
        if match:
            return match.group(0).strip()
    
    return None

def main():
    print("📊 Извлечение ВСЕХ технических данных из прайс-листа Apple")
    
    df = pd.read_excel('/home/user/uploaded_files/02.12.2025_Exchange_Price_List.xlsx')
    print(f"Загружено записей: {len(df)}")
    
    # 1. PART NUMBERS DATABASE
    print("\n📦 Создание базы партномеров...")
    part_numbers = {}
    
    for _, row in df.iterrows():
        article = str(row['Article'])
        desc = row['Part Description']
        price_uah = row['Exchange UAH']
        
        # Определяем тип запчасти
        part_type = None
        if 'Logic Board' in desc:
            part_type = 'logic_board'
        elif 'Display' in desc and 'Adhesive' not in desc:
            part_type = 'display'
        elif 'Battery' in desc and 'Case' not in desc:
            part_type = 'battery'
        elif 'Camera' in desc and 'Cowling' not in desc:
            part_type = 'camera'
        elif 'Top Case' in desc:
            part_type = 'top_case'
        elif 'Trackpad' in desc:
            part_type = 'trackpad'
        elif 'Keyboard' in desc:
            part_type = 'keyboard'
        elif 'Speaker' in desc:
            part_type = 'speaker'
        elif 'Fan' in desc:
            part_type = 'fan'
        elif 'Taptic' in desc:
            part_type = 'taptic_engine'
        elif 'Touch ID' in desc:
            part_type = 'touch_id'
        elif 'SIM' in desc and 'Tray' in desc:
            part_type = 'sim_tray'
        elif 'Antenna' in desc:
            part_type = 'antenna'
        elif 'Flex' in desc:
            part_type = 'flex_cable'
        elif 'Enclosure' in desc or 'Housing' in desc:
            part_type = 'enclosure'
        
        if part_type:
            model = extract_model_from_description(desc)
            specs = extract_specs_from_description(desc)
            
            part_numbers[article] = {
                'description': desc,
                'type': part_type,
                'model': model,
                'price_uah': round(price_uah, 2),
                'price_usd': round(price_uah / UAH_TO_USD, 2),
                'specs': specs if specs else None
            }
    
    print(f"  Найдено партномеров с типами: {len(part_numbers)}")
    
    # 2. LOGIC BOARDS DATABASE (детальная)
    print("\n🔧 Создание базы Logic Boards...")
    logic_boards = {}
    
    logic_df = df[df['Part Description'].str.contains('Logic Board', case=False, na=False)]
    for _, row in logic_df.iterrows():
        article = str(row['Article'])
        desc = row['Part Description']
        specs = extract_specs_from_description(desc)
        model = extract_model_from_description(desc)
        
        if specs:  # Только записи со спецификациями
            logic_boards[article] = {
                'description': desc,
                'model': model,
                'specs': specs,
                'price_uah': round(row['Exchange UAH'], 2),
                'price_usd': round(row['Exchange UAH'] / UAH_TO_USD, 2)
            }
    
    print(f"  Logic boards со спецификациями: {len(logic_boards)}")
    
    # 3. MODEL TO PARTS MAPPING
    print("\n📱 Создание маппинга модель -> запчасти...")
    model_parts = defaultdict(lambda: defaultdict(list))
    
    for article, data in part_numbers.items():
        model = data.get('model')
        part_type = data.get('type')
        if model and part_type:
            model_parts[model][part_type].append({
                'article': article,
                'description': data['description'],
                'price_usd': data['price_usd']
            })
    
    print(f"  Моделей с запчастями: {len(model_parts)}")
    
    # 4. COMPONENT COMPATIBILITY (iPhone)
    print("\n📲 Создание базы совместимости iPhone...")
    iphone_components = {}
    
    iphone_df = df[df['Part Description'].str.contains('iPhone', case=False, na=False)]
    for _, row in iphone_df.iterrows():
        desc = row['Part Description']
        article = str(row['Article'])
        
        # Находим все упомянутые модели iPhone в одной записи
        models_found = []
        for pattern in [r'iPhone \d+[a-z]*(?: Pro)?(?: Max)?(?: Plus)?(?: mini)?']:
            matches = re.findall(pattern, desc, re.IGNORECASE)
            models_found.extend(matches)
        
        if len(models_found) > 1:
            # Это запчасть совместимая с несколькими моделями
            part_key = f"{article}"
            iphone_components[part_key] = {
                'article': article,
                'description': desc,
                'compatible_models': list(set(models_found)),
                'price_usd': round(row['Exchange UAH'] / UAH_TO_USD, 2)
            }
    
    # 5. Сохранение результатов
    print("\n💾 Сохранение данных...")
    
    # Part numbers database
    with open('public/data/apple_part_numbers.json', 'w', encoding='utf-8') as f:
        json.dump({
            'title': 'Apple Official Part Numbers Database',
            'source': 'Exchange Price List 02.12.2025 (Ukraine AASP)',
            'total_parts': len(part_numbers),
            'parts': part_numbers
        }, f, indent=2, ensure_ascii=False)
    print(f"  ✅ apple_part_numbers.json ({len(part_numbers)} записей)")
    
    # Logic boards with specs
    with open('public/data/logic_boards_specs.json', 'w', encoding='utf-8') as f:
        json.dump({
            'title': 'Apple Logic Board Specifications',
            'source': 'Exchange Price List 02.12.2025',
            'total': len(logic_boards),
            'boards': logic_boards
        }, f, indent=2, ensure_ascii=False)
    print(f"  ✅ logic_boards_specs.json ({len(logic_boards)} записей)")
    
    # Model to parts mapping
    with open('public/data/model_parts_mapping.json', 'w', encoding='utf-8') as f:
        json.dump({
            'title': 'Model to Parts Mapping',
            'source': 'Exchange Price List 02.12.2025',
            'models': dict(model_parts)
        }, f, indent=2, ensure_ascii=False)
    print(f"  ✅ model_parts_mapping.json ({len(model_parts)} моделей)")
    
    # Statistics
    print("\n📈 СТАТИСТИКА:")
    type_counts = defaultdict(int)
    for data in part_numbers.values():
        type_counts[data['type']] += 1
    
    for ptype, count in sorted(type_counts.items(), key=lambda x: -x[1]):
        print(f"  {ptype}: {count}")
    
    # Sample Logic Boards
    print("\n🔧 ПРИМЕРЫ LOGIC BOARDS:")
    for article, data in list(logic_boards.items())[:10]:
        specs = data.get('specs', {})
        chip = specs.get('chip', specs.get('intel_cpu', 'N/A'))
        ram = specs.get('ram_gb', '?')
        storage = specs.get('storage_gb', '?')
        print(f"  {article}: {chip}, {ram}GB RAM, {storage}GB - ${data['price_usd']:.0f}")

if __name__ == "__main__":
    main()
