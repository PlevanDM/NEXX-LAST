#!/usr/bin/env python3
"""
Full extraction of official Apple Service prices from Ukraine price list
Source: 02.12.2025_Exchange_Price_List.xlsx
"""
import pandas as pd
import json
import re
import os

UAH_TO_USD = 41.5

def clean_model_name(model):
    """Стандартизировать название модели"""
    model = re.sub(r'\s+', ' ', model).strip()
    model = model.replace('Iphone', 'iPhone')
    return model

def extract_iphone_model(description):
    """Извлечь модель iPhone"""
    patterns = [
        (r'iPhone 17 Pro Max', 'iPhone 17 Pro Max'),
        (r'iPhone 17 Pro', 'iPhone 17 Pro'),
        (r'iPhone 17', 'iPhone 17'),
        (r'iPhone Air', 'iPhone Air'),
        (r'iPhone 16 Pro Max', 'iPhone 16 Pro Max'),
        (r'iPhone 16 Pro', 'iPhone 16 Pro'),
        (r'iPhone 16 Plus', 'iPhone 16 Plus'),
        (r'iPhone 16e', 'iPhone 16e'),
        (r'iPhone 16', 'iPhone 16'),
        (r'iPhone 15 Pro Max', 'iPhone 15 Pro Max'),
        (r'iPhone 15 Pro', 'iPhone 15 Pro'),
        (r'iPhone 15 Plus', 'iPhone 15 Plus'),
        (r'iPhone 15', 'iPhone 15'),
        (r'iPhone 14 Pro Max', 'iPhone 14 Pro Max'),
        (r'iPhone 14 Pro', 'iPhone 14 Pro'),
        (r'iPhone 14 Plus', 'iPhone 14 Plus'),
        (r'iPhone 14', 'iPhone 14'),
        (r'iPhone 13 Pro Max', 'iPhone 13 Pro Max'),
        (r'iPhone 13 Pro', 'iPhone 13 Pro'),
        (r'iPhone 13 mini', 'iPhone 13 mini'),
        (r'iPhone 13', 'iPhone 13'),
        (r'iPhone 12 Pro Max', 'iPhone 12 Pro Max'),
        (r'iPhone 12 Pro', 'iPhone 12 Pro'),
        (r'iPhone 12 mini', 'iPhone 12 mini'),
        (r'iPhone 12', 'iPhone 12'),
        (r'iPhone 11 Pro Max', 'iPhone 11 Pro Max'),
        (r'iPhone 11 Pro', 'iPhone 11 Pro'),
        (r'iPhone 11', 'iPhone 11'),
        (r'iPhone XS Max', 'iPhone XS Max'),
        (r'iPhone XS|iPhone Xs', 'iPhone XS'),
        (r'iPhone XR', 'iPhone XR'),
        (r'iPhone X(?![SR])', 'iPhone X'),
        (r'iPhone SE.*3rd|iPhone SE 3', 'iPhone SE (3rd gen)'),
        (r'iPhone SE.*2nd|iPhone SE 2', 'iPhone SE (2nd gen)'),
        (r'iPhone SE(?! [23])', 'iPhone SE (1st gen)'),
        (r'iPhone 8 Plus', 'iPhone 8 Plus'),
        (r'iPhone 8', 'iPhone 8'),
        (r'iPhone 7 Plus', 'iPhone 7 Plus'),
        (r'iPhone 7', 'iPhone 7'),
        (r'iPhone 6s Plus', 'iPhone 6s Plus'),
        (r'iPhone 6s', 'iPhone 6s'),
        (r'iPhone 6 Plus', 'iPhone 6 Plus'),
        (r'iPhone 6(?![s ])', 'iPhone 6'),
        (r'iPhone 5s', 'iPhone 5s'),
    ]
    
    for pattern, model in patterns:
        if re.search(pattern, description, re.IGNORECASE):
            return model
    return None

def classify_part(description):
    """Классифицировать тип запчасти"""
    desc_lower = description.lower()
    
    # Исключаем пакеты и аксессуары
    if any(x in desc_lower for x in ['pk,', 'pack', 'screw', 'adhesive', 'cowling', 
                                       'fixture', 'tool', 'lever', 'latch', 'case', 
                                       'cover', 'cutter', 'pocket', 'carrier']):
        return None
    
    if 'battery' in desc_lower:
        return 'battery'
    elif 'display' in desc_lower:
        return 'display'
    elif 'truedepth camera' in desc_lower or 'front camera' in desc_lower:
        return 'front_camera'
    elif 'camera' in desc_lower and 'rear' in desc_lower:
        return 'rear_camera'
    elif 'camera' in desc_lower:
        return 'rear_camera'
    elif 'speaker' in desc_lower and 'ear' not in desc_lower:
        return 'speaker'
    elif 'taptic' in desc_lower:
        return 'taptic_engine'
    elif 'sim tray' in desc_lower:
        return 'sim_tray'
    elif 'enclosure' in desc_lower or 'housing' in desc_lower:
        return 'housing'
    elif 'logic board' in desc_lower or 'mlb' in desc_lower:
        return 'logic_board'
    
    return None

def main():
    print("📊 Полное извлечение официальных цен Apple Service")
    
    df = pd.read_excel('/home/user/uploaded_files/02.12.2025_Exchange_Price_List.xlsx')
    
    # Структура для результата
    result = {
        "title": "Официальные цены Apple Authorized Service Provider (Украина)",
        "source": "Exchange Price List 02.12.2025",
        "date": "2025-12-02",
        "currency": {
            "original": "UAH",
            "rate_usd": UAH_TO_USD,
            "note": "Exchange UAH - цена обмена по гарантии"
        },
        "prices": {}
    }
    
    # Обрабатываем iPhone
    iphone_df = df[df['Part Description'].str.contains('iPhone', case=False, na=False)]
    
    for _, row in iphone_df.iterrows():
        desc = row['Part Description']
        model = extract_iphone_model(desc)
        part_type = classify_part(desc)
        
        if not model or not part_type:
            continue
        
        price_uah = row['Exchange UAH']
        price_usd = round(price_uah / UAH_TO_USD, 2)
        
        if model not in result['prices']:
            result['prices'][model] = {}
        
        # Сохраняем только если нет или если дешевле
        if part_type not in result['prices'][model]:
            result['prices'][model][part_type] = {
                'price_uah': round(price_uah, 2),
                'price_usd': price_usd,
                'article': row['Article']
            }
        elif price_uah < result['prices'][model][part_type]['price_uah']:
            result['prices'][model][part_type] = {
                'price_uah': round(price_uah, 2),
                'price_usd': price_usd,
                'article': row['Article']
            }
    
    # Сортируем модели
    def sort_key(model):
        # Извлекаем номер
        match = re.search(r'(\d+)', model)
        num = int(match.group(1)) if match else 0
        
        # Приоритет типа
        type_priority = 0
        if 'Pro Max' in model: type_priority = 1
        elif 'Pro' in model: type_priority = 2
        elif 'Plus' in model: type_priority = 3
        elif 'mini' in model: type_priority = 4
        elif 'Air' in model: type_priority = 5
        elif 'SE' in model: type_priority = 10
        else: type_priority = 3
        
        return (-num, type_priority, model)
    
    sorted_prices = dict(sorted(result['prices'].items(), key=lambda x: sort_key(x[0])))
    result['prices'] = sorted_prices
    
    # Сохраняем
    output_path = 'public/data/official_service_prices.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Сохранено: {output_path}")
    print(f"   Моделей: {len(result['prices'])}")
    
    # Печатаем сводку
    print("\n" + "="*80)
    print("СВОДКА ОФИЦИАЛЬНЫХ ЦЕН APPLE SERVICE (UAH / USD)")
    print("="*80)
    print(f"{'Модель':<22} {'Батарея':>10} {'Дисплей':>12} {'Задняя кам.':>12} {'Face ID':>12}")
    print("-"*80)
    
    for model, parts in list(sorted_prices.items())[:25]:
        battery = f"${parts.get('battery', {}).get('price_usd', 0):.0f}" if 'battery' in parts else '-'
        display = f"${parts.get('display', {}).get('price_usd', 0):.0f}" if 'display' in parts else '-'
        rear_cam = f"${parts.get('rear_camera', {}).get('price_usd', 0):.0f}" if 'rear_camera' in parts else '-'
        front_cam = f"${parts.get('front_camera', {}).get('price_usd', 0):.0f}" if 'front_camera' in parts else '-'
        print(f"{model:<22} {battery:>10} {display:>12} {rear_cam:>12} {front_cam:>12}")
    
    print("-"*80)
    print(f"Курс: 1 USD = {UAH_TO_USD} UAH")

if __name__ == "__main__":
    main()
