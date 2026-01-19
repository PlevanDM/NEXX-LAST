#!/usr/bin/env python3
"""
Extract detailed MacBook specifications from Apple Service Price List
"""
import pandas as pd
import json
import re
from collections import defaultdict

UAH_TO_USD = 41.5

def parse_macbook_logic_board(desc, article, price_uah):
    """Parse Logic Board description to extract specs"""
    specs = {
        'article': article,
        'description': desc,
        'price_usd': round(price_uah / UAH_TO_USD, 2)
    }
    
    # Apple Silicon chip
    if 'M4 Pro' in desc or 'M4 Max' in desc:
        specs['chip'] = 'M4 Pro/Max'
    elif 'M4' in desc:
        specs['chip'] = 'M4'
    elif 'M3 Pro' in desc or 'M3 Max' in desc:
        specs['chip'] = 'M3 Pro/Max'
    elif 'M3' in desc:
        specs['chip'] = 'M3'
    elif 'M2 Pro' in desc or 'M2 Max' in desc:
        specs['chip'] = 'M2 Pro/Max'
    elif 'M2' in desc:
        specs['chip'] = 'M2'
    elif 'M1 Pro' in desc or 'M1 Max' in desc:
        specs['chip'] = 'M1 Pro/Max'
    elif 'M1' in desc:
        specs['chip'] = 'M1'
    
    # CPU cores
    cpu_match = re.search(r'(\d+)-core\s*CPU', desc, re.IGNORECASE)
    if cpu_match:
        specs['cpu_cores'] = int(cpu_match.group(1))
    elif re.search(r'(\d+)-core(?!.*GPU)', desc):
        match = re.search(r'(\d+)-core', desc)
        specs['cpu_cores'] = int(match.group(1))
    
    # GPU cores
    gpu_match = re.search(r'(\d+)-core\s*GPU', desc, re.IGNORECASE)
    if gpu_match:
        specs['gpu_cores'] = int(gpu_match.group(1))
    
    # Intel CPU
    intel_match = re.search(r'(i[357])', desc)
    if intel_match:
        specs['intel_cpu'] = intel_match.group(1)
    
    # CPU frequency
    ghz_match = re.search(r'(\d+\.?\d*)\s*GHz', desc, re.IGNORECASE)
    if ghz_match:
        specs['cpu_ghz'] = float(ghz_match.group(1))
    
    # RAM - ищем числа перед GB, исключая storage
    # Формат: "8GB, 256GB" или "16GB, 512GB" или "8 GB, 256 GB"
    ram_match = re.search(r'(\d+)\s*GB[,\s]+(\d+)(?:GB|TB)', desc)
    if ram_match:
        ram_val = int(ram_match.group(1))
        storage_val = int(ram_match.group(2))
        # RAM обычно меньше storage
        if ram_val <= 128 and storage_val >= ram_val:
            specs['ram_gb'] = ram_val
            if 'TB' in desc[desc.find(str(storage_val)):desc.find(str(storage_val))+10]:
                specs['storage_gb'] = storage_val * 1024
            else:
                specs['storage_gb'] = storage_val
    
    # Alternative RAM pattern
    if 'ram_gb' not in specs:
        ram_patterns = [
            r'(\d+)GB(?:\s*RAM)?[,\s]',
            r',\s*(\d+)GB[,\s]',
        ]
        for pattern in ram_patterns:
            match = re.search(pattern, desc)
            if match:
                val = int(match.group(1))
                if val <= 128:  # Reasonable RAM size
                    specs['ram_gb'] = val
                    break
    
    # Storage
    if 'storage_gb' not in specs:
        tb_match = re.search(r'(\d+)\s*TB', desc)
        if tb_match:
            specs['storage_gb'] = int(tb_match.group(1)) * 1024
        else:
            # Look for storage-like GB values (256, 512, 1024, 2048)
            storage_match = re.search(r'(\d{3,4})\s*GB', desc)
            if storage_match:
                val = int(storage_match.group(1))
                if val in [256, 512, 1024, 2048]:
                    specs['storage_gb'] = val
    
    # Discrete GPU
    radeon_match = re.search(r'Radeon\s*Pro\s*(\d+)', desc, re.IGNORECASE)
    if radeon_match:
        specs['discrete_gpu'] = f"Radeon Pro {radeon_match.group(1)}"
    
    # Model extraction
    if 'MacBook Air' in desc:
        if 'M1' in desc:
            specs['model'] = 'MacBook Air M1 (2020)'
        elif 'M2' in desc:
            if '15' in desc:
                specs['model'] = 'MacBook Air 15\" M2 (2023)'
            else:
                specs['model'] = 'MacBook Air M2 (2022)'
        elif 'M3' in desc:
            if '15' in desc:
                specs['model'] = 'MacBook Air 15\" M3 (2024)'
            else:
                specs['model'] = 'MacBook Air 13\" M3 (2024)'
        elif 'M4' in desc:
            if '15' in desc:
                specs['model'] = 'MacBook Air 15\" M4 (2025)'
            else:
                specs['model'] = 'MacBook Air 13\" M4 (2025)'
        else:
            model_match = re.search(r'MacBook Air \(([^)]+)\)', desc)
            if model_match:
                specs['model'] = f"MacBook Air ({model_match.group(1)})"
    
    elif 'MacBook Pro' in desc or 'MBP' in desc:
        if '16' in desc:
            size = '16"'
        elif '15' in desc:
            size = '15"'
        elif '14' in desc:
            size = '14"'
        else:
            size = '13"'
        
        if 'M4' in desc:
            specs['model'] = f'MacBook Pro {size} M4 (2024)'
        elif 'M3' in desc:
            specs['model'] = f'MacBook Pro {size} M3 (2023)'
        elif 'M2' in desc:
            specs['model'] = f'MacBook Pro {size} M2 (2022-2023)'
        elif 'M1' in desc:
            specs['model'] = f'MacBook Pro {size} M1 (2020-2021)'
        else:
            model_match = re.search(r'MacBook Pro \(([^)]+)\)', desc)
            if model_match:
                specs['model'] = f"MacBook Pro ({model_match.group(1)})"
    
    elif 'iMac' in desc:
        model_match = re.search(r'iMac \(([^)]+)\)', desc)
        if model_match:
            specs['model'] = f"iMac ({model_match.group(1)})"
    
    elif 'Mac mini' in desc:
        model_match = re.search(r'Mac mini \(([^)]+)\)', desc)
        if model_match:
            specs['model'] = f"Mac mini ({model_match.group(1)})"
    
    return specs

def main():
    print("📊 Извлечение спецификаций MacBook из прайс-листа")
    
    df = pd.read_excel('/home/user/uploaded_files/02.12.2025_Exchange_Price_List.xlsx')
    
    # Filter Logic Boards
    logic_df = df[df['Part Description'].str.contains('Logic Board', case=False, na=False)]
    
    # Exclude screws and accessories
    logic_df = logic_df[~logic_df['Part Description'].str.contains('Screw|Cowling|Flex|Tray', case=False, na=False)]
    
    print(f"Найдено Logic Boards: {len(logic_df)}")
    
    # Parse all logic boards
    all_specs = []
    
    for _, row in logic_df.iterrows():
        specs = parse_macbook_logic_board(
            row['Part Description'],
            str(row['Article']),
            row['Exchange UAH']
        )
        all_specs.append(specs)
    
    # Group by model
    by_model = defaultdict(list)
    for spec in all_specs:
        model = spec.get('model', 'Unknown')
        by_model[model].append(spec)
    
    # Create summary
    summary = {
        'title': 'MacBook/iMac/Mac mini Logic Board Specifications',
        'source': 'Apple AASP Exchange Price List 02.12.2025 (Ukraine)',
        'total_boards': len(all_specs),
        'models_count': len(by_model),
        'by_model': {},
        'all_boards': all_specs
    }
    
    # Add model summaries
    for model, specs_list in sorted(by_model.items()):
        # Get price range
        prices = [s['price_usd'] for s in specs_list]
        
        # Get RAM options
        ram_options = sorted(set(s.get('ram_gb') for s in specs_list if s.get('ram_gb')))
        
        # Get storage options
        storage_options = sorted(set(s.get('storage_gb') for s in specs_list if s.get('storage_gb')))
        
        summary['by_model'][model] = {
            'variants': len(specs_list),
            'price_range_usd': [min(prices), max(prices)],
            'ram_options_gb': ram_options,
            'storage_options_gb': storage_options,
            'boards': specs_list
        }
    
    # Save
    output_path = 'public/data/macbook_logic_board_specs.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Сохранено: {output_path}")
    
    # Print summary
    print("\n📊 СВОДКА ПО МОДЕЛЯМ:")
    print(f"{'Модель':<45} {'Вариантов':<10} {'Цена USD':<15} {'RAM':<15}")
    print("-" * 90)
    
    for model, data in sorted(summary['by_model'].items(), key=lambda x: -x[1]['price_range_usd'][0])[:25]:
        price_range = f"${data['price_range_usd'][0]:.0f}-${data['price_range_usd'][1]:.0f}"
        ram = ', '.join(f"{r}GB" for r in data['ram_options_gb'][:3])
        print(f"{model:<45} {data['variants']:<10} {price_range:<15} {ram:<15}")

if __name__ == "__main__":
    main()
