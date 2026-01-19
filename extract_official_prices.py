#!/usr/bin/env python3
"""
Extract official Apple Service prices from Ukraine price list
Source: 02.12.2025_Exchange_Price_List.xlsx
"""
import pandas as pd
import json
import re

# Курс UAH к USD (примерно декабрь 2025)
UAH_TO_USD = 41.5

def extract_model(description):
    """Извлечь модель устройства из описания"""
    # iPhone модели
    iphone_patterns = [
        r'iPhone 16 Pro Max', r'iPhone 16 Pro', r'iPhone 16 Plus', r'iPhone 16e', r'iPhone 16',
        r'iPhone 15 Pro Max', r'iPhone 15 Pro', r'iPhone 15 Plus', r'iPhone 15',
        r'iPhone 14 Pro Max', r'iPhone 14 Pro', r'iPhone 14 Plus', r'iPhone 14',
        r'iPhone 13 Pro Max', r'iPhone 13 Pro', r'iPhone 13 mini', r'iPhone 13',
        r'iPhone 12 Pro Max', r'iPhone 12 Pro', r'iPhone 12 mini', r'iPhone 12',
        r'iPhone 11 Pro Max', r'iPhone 11 Pro', r'iPhone 11',
        r'iPhone XS Max', r'iPhone XS', r'iPhone XR', r'iPhone X',
        r'iPhone SE.*3rd|iPhone SE 3', r'iPhone SE.*2nd|iPhone SE 2', r'iPhone SE',
        r'iPhone 8 Plus', r'iPhone 8', r'iPhone 7 Plus', r'iPhone 7',
        r'iPhone 6s Plus', r'iPhone 6s', r'iPhone 6 Plus', r'iPhone 6',
        r'iPhone 17 Pro Max', r'iPhone 17 Pro', r'iPhone 17', r'iPhone Air'
    ]
    
    for pattern in iphone_patterns:
        if re.search(pattern, description, re.IGNORECASE):
            match = re.search(pattern, description, re.IGNORECASE)
            return match.group(0)
    return None

def extract_part_type(description):
    """Определить тип запчасти"""
    desc_lower = description.lower()
    
    if 'battery' in desc_lower and 'case' not in desc_lower and 'screw' not in desc_lower:
        return 'battery'
    elif 'display' in desc_lower and 'adhesive' not in desc_lower and 'screw' not in desc_lower and 'cable' not in desc_lower:
        return 'display'
    elif 'rear camera' in desc_lower or 'camera, rear' in desc_lower:
        return 'rear_camera'
    elif 'front camera' in desc_lower or 'camera, front' in desc_lower:
        return 'front_camera'
    elif 'speaker' in desc_lower and 'ear' not in desc_lower:
        return 'speaker'
    elif 'taptic' in desc_lower or 'vibrator' in desc_lower:
        return 'taptic_engine'
    elif 'sim tray' in desc_lower:
        return 'sim_tray'
    elif 'charging' in desc_lower or 'lightning' in desc_lower:
        return 'charging_port'
    elif 'logic board' in desc_lower or 'mlb' in desc_lower:
        return 'logic_board'
    elif 'housing' in desc_lower or 'enclosure' in desc_lower:
        return 'housing'
    return 'other'

def main():
    print("📊 Извлечение официальных цен Apple Service (Украина)")
    
    df = pd.read_excel('/home/user/uploaded_files/02.12.2025_Exchange_Price_List.xlsx')
    print(f"Загружено записей: {len(df)}")
    
    # Фильтруем iPhone запчасти
    iphone_parts = df[df['Part Description'].str.contains('iPhone', case=False, na=False)].copy()
    print(f"iPhone запчастей: {len(iphone_parts)}")
    
    # Извлекаем модели и типы
    iphone_parts['model'] = iphone_parts['Part Description'].apply(extract_model)
    iphone_parts['part_type'] = iphone_parts['Part Description'].apply(extract_part_type)
    iphone_parts['price_usd'] = iphone_parts['Exchange UAH'] / UAH_TO_USD
    
    # Группируем по моделям и типам запчастей
    official_prices = {}
    
    for _, row in iphone_parts.iterrows():
        model = row['model']
        part_type = row['part_type']
        
        if model and part_type != 'other':
            if model not in official_prices:
                official_prices[model] = {}
            
            # Берём минимальную цену для каждого типа (исключаем паки)
            desc = row['Part Description']
            if 'PK' in desc or 'pack' in desc.lower():
                continue
                
            price_uah = row['Exchange UAH']
            price_usd = row['price_usd']
            
            if part_type not in official_prices[model]:
                official_prices[model][part_type] = {
                    'price_uah': round(price_uah, 2),
                    'price_usd': round(price_usd, 2),
                    'article': row['Article'],
                    'description': desc
                }
            # Обновляем если нашли дешевле (более базовую версию)
            elif price_uah < official_prices[model][part_type]['price_uah']:
                official_prices[model][part_type] = {
                    'price_uah': round(price_uah, 2),
                    'price_usd': round(price_usd, 2),
                    'article': row['Article'],
                    'description': desc
                }
    
    # Формируем итоговый JSON
    result = {
        "title": "Официальные цены Apple Service (Украина)",
        "source": "02.12.2025_Exchange_Price_List.xlsx",
        "date": "2025-12-02",
        "currency": {
            "base": "UAH",
            "rate_to_usd": UAH_TO_USD
        },
        "note": "Цены Exchange - для обмена по гарантии. Stock - складские цены.",
        "iphone_parts": official_prices
    }
    
    # Сортируем модели
    sorted_models = sorted(official_prices.keys(), key=lambda x: (
        # Сортировка по поколению iPhone
        -int(re.search(r'(\d+)', x).group(1)) if re.search(r'(\d+)', x) else 0,
        'Pro Max' not in x,
        'Pro' not in x,
        'Plus' not in x,
        'mini' not in x
    ))
    
    result['iphone_parts'] = {model: official_prices[model] for model in sorted_models}
    
    # Сохраняем
    output_path = 'public/data/official_service_prices.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Сохранено: {output_path}")
    
    # Выводим сводку
    print("\n=== СВОДКА ЦЕН ПО МОДЕЛЯМ ===")
    print(f"{'Модель':<25} {'Батарея':<12} {'Дисплей':<12} {'Камера':<12}")
    print("-" * 65)
    
    for model in sorted_models[:20]:
        parts = official_prices[model]
        battery = f"${parts.get('battery', {}).get('price_usd', '-'):.0f}" if 'battery' in parts else '-'
        display = f"${parts.get('display', {}).get('price_usd', '-'):.0f}" if 'display' in parts else '-'
        camera = f"${parts.get('rear_camera', {}).get('price_usd', '-'):.0f}" if 'rear_camera' in parts else '-'
        print(f"{model:<25} {battery:<12} {display:<12} {camera:<12}")
    
    print(f"\nВсего моделей: {len(official_prices)}")

if __name__ == "__main__":
    main()
