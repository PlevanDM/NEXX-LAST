#!/usr/bin/env python3
"""
Глубокий анализ технических данных из официального прайса Apple
Извлечение партномеров, спецификаций материнских плат, компонентов
"""

import pandas as pd
import json
import re
import os

EXCEL_FILE = '/home/user/uploaded_files/02.12.2025_Exchange_Price_List.xlsx'
OUTPUT_DIR = '/home/user/webapp/public/data'
UAH_TO_USD = 41.5

def load_excel():
    """Загрузка Excel файла"""
    df = pd.read_excel(EXCEL_FILE)
    print(f"Загружено {len(df)} записей")
    return df

def extract_m_series_boards(df):
    """Извлечение M-серии материнских плат с детальными спеками"""
    m_series = []
    
    # Фильтр для M-серии
    mask = df['Part Description'].str.contains(r'Logic Board.*M[1-4]|MLB.*M[1-4]', case=False, na=False)
    m_boards = df[mask].copy()
    
    print(f"\n=== M-SERIES LOGIC BOARDS: {len(m_boards)} ===")
    
    for _, row in m_boards.iterrows():
        desc = str(row['Part Description'])
        article = str(row['Article'])
        price_uah = row['Exchange UAH'] if pd.notna(row['Exchange UAH']) else 0
        
        # Парсинг M-серии
        m_match = re.search(r'M([1-4])(\s+(Pro|Max|Ultra))?', desc, re.IGNORECASE)
        chip = None
        if m_match:
            base = f"M{m_match.group(1)}"
            variant = m_match.group(3)
            chip = f"{base} {variant}" if variant else base
        
        # Парсинг CPU cores
        cpu_cores = None
        cpu_match = re.search(r'(\d+)[- ]?core\s*CPU', desc, re.IGNORECASE)
        if cpu_match:
            cpu_cores = int(cpu_match.group(1))
        
        # Парсинг GPU cores
        gpu_cores = None
        gpu_match = re.search(r'(\d+)[- ]?core\s*GPU', desc, re.IGNORECASE)
        if gpu_match:
            gpu_cores = int(gpu_match.group(1))
        
        # Парсинг RAM
        ram_gb = None
        ram_match = re.search(r'(\d+)\s*GB(?:\s+RAM|\s+Memory)?(?!.*SSD)', desc, re.IGNORECASE)
        if ram_match:
            val = int(ram_match.group(1))
            if val <= 128:  # Разумное значение для RAM
                ram_gb = val
        
        # Парсинг Storage
        storage_gb = None
        storage_match = re.search(r'(\d+)\s*(?:GB|TB)(?:\s+SSD|\s+Storage)?', desc)
        if storage_match:
            val = int(storage_match.group(1))
            unit = 'TB' if 'TB' in storage_match.group(0) else 'GB'
            storage_gb = val * 1024 if unit == 'TB' else val
            if storage_gb < 128:  # Это скорее RAM
                storage_gb = None
        
        # Модель устройства
        model = None
        model_match = re.search(r'for\s+(.+?)(?:\)|$)', desc)
        if model_match:
            model = model_match.group(1).strip().rstrip(')')
        
        # Год
        year = None
        year_match = re.search(r'20(\d{2})', desc)
        if year_match:
            year = 2000 + int(year_match.group(1))
        
        entry = {
            'article': article,
            'description': desc,
            'chip': chip,
            'cpu_cores': cpu_cores,
            'gpu_cores': gpu_cores,
            'ram_gb': ram_gb,
            'storage_gb': storage_gb,
            'model': model,
            'year': year,
            'price_uah': round(price_uah, 2),
            'price_usd': round(price_uah / UAH_TO_USD, 2)
        }
        m_series.append(entry)
        
        if len(m_series) <= 20:
            print(f"  {article}: {chip or '?'} | {cpu_cores or '?'}CPU/{gpu_cores or '?'}GPU | "
                  f"{ram_gb or '?'}GB RAM | {storage_gb or '?'}GB SSD | ${entry['price_usd']}")
    
    return m_series

def extract_intel_boards(df):
    """Извлечение Intel материнских плат"""
    intel_boards = []
    
    # Фильтр для Intel плат (с GHz но без M-серии)
    mask = (df['Part Description'].str.contains(r'Logic Board.*GHz|MLB.*GHz', case=False, na=False) &
            ~df['Part Description'].str.contains(r'M[1-4]', case=False, na=False))
    boards = df[mask].copy()
    
    print(f"\n=== INTEL LOGIC BOARDS: {len(boards)} ===")
    
    for _, row in boards.iterrows():
        desc = str(row['Part Description'])
        article = str(row['Article'])
        price_uah = row['Exchange UAH'] if pd.notna(row['Exchange UAH']) else 0
        
        # Парсинг CPU GHz
        cpu_ghz = None
        ghz_match = re.search(r'(\d+\.?\d*)\s*GHz', desc, re.IGNORECASE)
        if ghz_match:
            cpu_ghz = float(ghz_match.group(1))
        
        # Парсинг RAM
        ram_gb = None
        ram_match = re.search(r'(\d+)\s*GB', desc)
        if ram_match:
            val = int(ram_match.group(1))
            if val <= 64:  # Разумное значение для RAM
                ram_gb = val
        
        # GPU (интегрированная или дискретная)
        gpu = None
        if 'Discrete' in desc or 'NVIDIA' in desc or 'AMD' in desc:
            gpu = 'discrete'
        elif 'IRIS' in desc.upper() or 'Intel' in desc:
            gpu = 'integrated'
        
        # Модель устройства
        model = None
        model_match = re.search(r'(?:for|-)?\s*(Mac\s*(?:Book|mini)|iMac).*?(?:\)|$)', desc)
        if model_match:
            model = model_match.group(1).strip()
        
        # Год
        year = None
        year_match = re.search(r'(20\d{2})', desc)
        if year_match:
            year = int(year_match.group(1))
        
        entry = {
            'article': article,
            'description': desc,
            'architecture': 'Intel',
            'cpu_ghz': cpu_ghz,
            'ram_gb': ram_gb,
            'gpu': gpu,
            'model': model,
            'year': year,
            'price_uah': round(price_uah, 2),
            'price_usd': round(price_uah / UAH_TO_USD, 2)
        }
        intel_boards.append(entry)
    
    print(f"  Первые 10 записей:")
    for e in intel_boards[:10]:
        print(f"    {e['article']}: {e['cpu_ghz'] or '?'}GHz | {e['ram_gb'] or '?'}GB | ${e['price_usd']}")
    
    return intel_boards

def extract_displays(df):
    """Извлечение информации о дисплеях"""
    displays = {}
    
    mask = df['Part Description'].str.contains(r'Display(?! Adhesive| Cable| Extension| Removal| Starter| Refill)', 
                                                case=False, na=False)
    display_df = df[mask].copy()
    
    print(f"\n=== DISPLAYS: {len(display_df)} ===")
    
    for _, row in display_df.iterrows():
        desc = str(row['Part Description'])
        article = str(row['Article'])
        price_uah = row['Exchange UAH'] if pd.notna(row['Exchange UAH']) else 0
        
        # Определение типа устройства
        device_type = None
        if 'iPhone' in desc:
            device_type = 'iPhone'
        elif 'iPad' in desc:
            device_type = 'iPad'
        elif 'MacBook' in desc:
            device_type = 'MacBook'
        elif 'iMac' in desc:
            device_type = 'iMac'
        elif 'Watch' in desc:
            device_type = 'Apple Watch'
        
        # Цвет
        color = None
        for c in ['Space Gray', 'Silver', 'Gold', 'Rose Gold', 'Midnight', 'Starlight', 'Blue', 'Green', 'Purple', 'Red', 'Black', 'White']:
            if c.lower() in desc.lower():
                color = c
                break
        
        # Модель
        model = None
        model_patterns = [
            r'iPhone\s+(\d+(?:\s+(?:Pro|Plus|mini|Pro Max))?)',
            r'iPad\s+(Pro|Air|mini)?\s*(?:\d+(?:\.\d+)?(?:-inch)?)?',
            r'MacBook\s+(Pro|Air)?\s*\(([^)]+)\)',
            r'iMac\s*\(([^)]+)\)',
            r'Watch\s*(Series\s*\d+|Ultra(?:\s*\d+)?|SE)?'
        ]
        
        for pattern in model_patterns:
            m = re.search(pattern, desc, re.IGNORECASE)
            if m:
                model = m.group(0).strip()
                break
        
        entry = {
            'article': article,
            'description': desc,
            'device_type': device_type,
            'model': model,
            'color': color,
            'price_uah': round(price_uah, 2),
            'price_usd': round(price_uah / UAH_TO_USD, 2)
        }
        displays[article] = entry
    
    print(f"  По типам устройств:")
    type_counts = {}
    for d in displays.values():
        t = d['device_type'] or 'Other'
        type_counts[t] = type_counts.get(t, 0) + 1
    for t, c in sorted(type_counts.items(), key=lambda x: -x[1]):
        print(f"    {t}: {c}")
    
    return displays

def extract_batteries(df):
    """Извлечение информации о батареях"""
    batteries = {}
    
    mask = df['Part Description'].str.contains(r'Battery(?!.*Kit|.*Screw|.*Cover|.*Connector|.*Board)', 
                                                case=False, na=False)
    battery_df = df[mask].copy()
    
    print(f"\n=== BATTERIES: {len(battery_df)} ===")
    
    for _, row in battery_df.iterrows():
        desc = str(row['Part Description'])
        article = str(row['Article'])
        price_uah = row['Exchange UAH'] if pd.notna(row['Exchange UAH']) else 0
        
        # Определение устройства
        device = None
        if 'iPhone' in desc:
            device = 'iPhone'
        elif 'iPad' in desc:
            device = 'iPad'
        elif 'MacBook' in desc:
            device = 'MacBook'
        elif 'Watch' in desc:
            device = 'Apple Watch'
        
        # Емкость (Wh)
        capacity_wh = None
        wh_match = re.search(r'(\d+(?:\.\d+)?)\s*W', desc)
        if wh_match:
            capacity_wh = float(wh_match.group(1))
        
        batteries[article] = {
            'article': article,
            'description': desc,
            'device': device,
            'capacity_wh': capacity_wh,
            'price_uah': round(price_uah, 2),
            'price_usd': round(price_uah / UAH_TO_USD, 2)
        }
    
    return batteries

def extract_cameras(df):
    """Извлечение информации о камерах"""
    cameras = {}
    
    mask = df['Part Description'].str.contains(r'Camera(?!.*Screw|.*Cover|.*Bracket)', case=False, na=False)
    camera_df = df[mask].copy()
    
    print(f"\n=== CAMERAS: {len(camera_df)} ===")
    
    for _, row in camera_df.iterrows():
        desc = str(row['Part Description'])
        article = str(row['Article'])
        price_uah = row['Exchange UAH'] if pd.notna(row['Exchange UAH']) else 0
        
        # Тип камеры
        camera_type = 'rear'
        if any(x in desc.lower() for x in ['front', 'facetime', 'truedepth', 'face id']):
            camera_type = 'front'
        
        cameras[article] = {
            'article': article,
            'description': desc,
            'camera_type': camera_type,
            'price_uah': round(price_uah, 2),
            'price_usd': round(price_uah / UAH_TO_USD, 2)
        }
    
    return cameras

def extract_iphone_components(df):
    """Детальное извлечение iPhone компонентов по моделям"""
    iphone_parts = {}
    
    mask = df['Part Description'].str.contains(r'iPhone', case=False, na=False)
    iphone_df = df[mask].copy()
    
    print(f"\n=== iPHONE COMPONENTS BY MODEL ===")
    
    # Модели для группировки
    models = [
        'iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17 Plus', 'iPhone 17',
        'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16', 'iPhone 16e',
        'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
        'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
        'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13 mini', 'iPhone 13',
        'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12 mini', 'iPhone 12',
        'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
        'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X',
        'iPhone 8 Plus', 'iPhone 8',
        'iPhone 7 Plus', 'iPhone 7',
        'iPhone SE'
    ]
    
    for model in models:
        model_mask = iphone_df['Part Description'].str.contains(model.replace(' ', r'\s*'), case=False, na=False)
        model_df = iphone_df[model_mask]
        
        if len(model_df) == 0:
            continue
        
        parts = {
            'display': [],
            'battery': [],
            'rear_camera': [],
            'front_camera': [],
            'speaker': [],
            'taptic': [],
            'lightning': [],
            'usb_c': [],
            'sim_tray': [],
            'enclosure': [],
            'other': []
        }
        
        for _, row in model_df.iterrows():
            desc = str(row['Part Description']).lower()
            article = str(row['Article'])
            price_uah = row['Exchange UAH'] if pd.notna(row['Exchange UAH']) else 0
            
            part = {
                'article': article,
                'description': row['Part Description'],
                'price_uah': round(price_uah, 2),
                'price_usd': round(price_uah / UAH_TO_USD, 2)
            }
            
            # Классификация
            if 'display' in desc and not any(x in desc for x in ['adhesive', 'cable', 'removal', 'kit']):
                parts['display'].append(part)
            elif 'battery' in desc and not any(x in desc for x in ['screw', 'cover', 'kit']):
                parts['battery'].append(part)
            elif any(x in desc for x in ['rear camera', 'svc,rear camera']):
                parts['rear_camera'].append(part)
            elif any(x in desc for x in ['front camera', 'truedepth', 'facetime', 'face id']):
                parts['front_camera'].append(part)
            elif 'speaker' in desc:
                parts['speaker'].append(part)
            elif 'taptic' in desc:
                parts['taptic'].append(part)
            elif 'lightning' in desc:
                parts['lightning'].append(part)
            elif 'usb-c' in desc or 'usb c' in desc:
                parts['usb_c'].append(part)
            elif 'sim tray' in desc:
                parts['sim_tray'].append(part)
            elif 'enclosure' in desc or 'housing' in desc:
                parts['enclosure'].append(part)
            else:
                parts['other'].append(part)
        
        # Удаляем пустые категории
        parts = {k: v for k, v in parts.items() if v}
        
        if parts:
            iphone_parts[model] = parts
            total_parts = sum(len(v) for v in parts.values())
            print(f"  {model}: {total_parts} компонентов")
    
    return iphone_parts

def extract_macbook_components(df):
    """Детальное извлечение MacBook компонентов"""
    macbook_parts = {}
    
    mask = df['Part Description'].str.contains(r'MacBook', case=False, na=False)
    mac_df = df[mask].copy()
    
    print(f"\n=== MacBook COMPONENTS ===")
    
    # Категории компонентов
    components = {
        'logic_board': [],
        'top_case': [],
        'display': [],
        'battery': [],
        'keyboard': [],
        'trackpad': [],
        'fan': [],
        'speaker': [],
        'io_board': [],
        'flex_cable': []
    }
    
    for _, row in mac_df.iterrows():
        desc = str(row['Part Description']).lower()
        article = str(row['Article'])
        price_uah = row['Exchange UAH'] if pd.notna(row['Exchange UAH']) else 0
        
        part = {
            'article': article,
            'description': row['Part Description'],
            'price_uah': round(price_uah, 2),
            'price_usd': round(price_uah / UAH_TO_USD, 2)
        }
        
        if 'logic board' in desc or 'mlb' in desc:
            components['logic_board'].append(part)
        elif 'top case' in desc:
            components['top_case'].append(part)
        elif 'display' in desc and 'assembly' in desc:
            components['display'].append(part)
        elif 'battery' in desc:
            components['battery'].append(part)
        elif 'keyboard' in desc:
            components['keyboard'].append(part)
        elif 'trackpad' in desc:
            components['trackpad'].append(part)
        elif 'fan' in desc:
            components['fan'].append(part)
        elif 'speaker' in desc:
            components['speaker'].append(part)
        elif 'i/o board' in desc or 'io board' in desc or 'audio board' in desc:
            components['io_board'].append(part)
        elif 'flex' in desc or 'cable' in desc:
            components['flex_cable'].append(part)
    
    for cat, parts in components.items():
        if parts:
            print(f"  {cat}: {len(parts)} компонентов")
    
    return components

def extract_ipad_components(df):
    """Детальное извлечение iPad компонентов"""
    ipad_parts = {}
    
    mask = df['Part Description'].str.contains(r'iPad', case=False, na=False)
    ipad_df = df[mask].copy()
    
    print(f"\n=== iPAD COMPONENTS: {len(ipad_df)} ===")
    
    models = ['iPad Pro', 'iPad Air', 'iPad mini', 'iPad']
    
    for model in models:
        model_mask = ipad_df['Part Description'].str.contains(model, case=False, na=False)
        model_df = ipad_df[model_mask]
        
        if len(model_df) == 0:
            continue
        
        parts = []
        for _, row in model_df.iterrows():
            parts.append({
                'article': str(row['Article']),
                'description': row['Part Description'],
                'price_uah': round(row['Exchange UAH'], 2) if pd.notna(row['Exchange UAH']) else 0,
                'price_usd': round(row['Exchange UAH'] / UAH_TO_USD, 2) if pd.notna(row['Exchange UAH']) else 0
            })
        
        ipad_parts[model] = parts
        print(f"  {model}: {len(parts)} компонентов")
    
    return ipad_parts

def extract_apple_watch_components(df):
    """Извлечение Apple Watch компонентов"""
    watch_parts = []
    
    mask = df['Part Description'].str.contains(r'Watch|WATCH', case=False, na=False)
    watch_df = df[mask].copy()
    
    print(f"\n=== APPLE WATCH COMPONENTS: {len(watch_df)} ===")
    
    for _, row in watch_df.iterrows():
        watch_parts.append({
            'article': str(row['Article']),
            'description': row['Part Description'],
            'price_uah': round(row['Exchange UAH'], 2) if pd.notna(row['Exchange UAH']) else 0,
            'price_usd': round(row['Exchange UAH'] / UAH_TO_USD, 2) if pd.notna(row['Exchange UAH']) else 0
        })
    
    return watch_parts

def create_model_article_mapping(df):
    """Создание маппинга: модель -> артикулы компонентов"""
    mapping = {}
    
    # Паттерны для извлечения моделей
    patterns = {
        'iPhone': r'iPhone\s+(\d+(?:\s*(?:Pro\s*Max|Pro|Plus|mini|e))?|SE(?:\s*\d+)?|X[SRs]?(?:\s*Max)?)',
        'iPad': r'iPad\s+(Pro|Air|mini)?\s*(?:\d+(?:\.\d+)?(?:-inch)?)?(?:\s*\d+(?:st|nd|rd|th)\s*Gen)?',
        'MacBook': r'MacBook\s+(Pro|Air)?\s*\(([^)]+)\)',
        'iMac': r'iMac\s*\(([^)]+)\)',
        'Mac mini': r'Mac\s*mini\s*\(([^)]+)\)',
        'Mac Pro': r'Mac\s*Pro\s*\(([^)]+)\)',
        'Watch': r'Watch\s*(Series\s*\d+|Ultra(?:\s*\d+)?|SE)?'
    }
    
    for _, row in df.iterrows():
        desc = str(row['Part Description'])
        article = str(row['Article'])
        
        for device_type, pattern in patterns.items():
            match = re.search(pattern, desc, re.IGNORECASE)
            if match:
                model_name = match.group(0).strip()
                
                if model_name not in mapping:
                    mapping[model_name] = {
                        'device_type': device_type,
                        'articles': []
                    }
                
                mapping[model_name]['articles'].append(article)
                break
    
    print(f"\n=== MODEL-ARTICLE MAPPING: {len(mapping)} моделей ===")
    
    return mapping

def main():
    print("="*60)
    print("ГЛУБОКИЙ АНАЛИЗ ТЕХНИЧЕСКИХ ДАННЫХ APPLE")
    print("="*60)
    
    df = load_excel()
    
    # Извлекаем все данные
    m_series_boards = extract_m_series_boards(df)
    intel_boards = extract_intel_boards(df)
    displays = extract_displays(df)
    batteries = extract_batteries(df)
    cameras = extract_cameras(df)
    iphone_components = extract_iphone_components(df)
    macbook_components = extract_macbook_components(df)
    ipad_components = extract_ipad_components(df)
    watch_components = extract_apple_watch_components(df)
    model_mapping = create_model_article_mapping(df)
    
    # Собираем полную базу материнских плат
    all_logic_boards = {
        'title': 'Apple Logic Board Comprehensive Database',
        'source': 'Exchange Price List 02.12.2025 (Ukraine AASP)',
        'date': '2025-12-02',
        'm_series': m_series_boards,
        'm_series_count': len(m_series_boards),
        'intel': intel_boards,
        'intel_count': len(intel_boards)
    }
    
    # Полная база компонентов
    all_components = {
        'title': 'Apple Components Comprehensive Database',
        'source': 'Exchange Price List 02.12.2025 (Ukraine AASP)',
        'date': '2025-12-02',
        'currency_rate': f"1 USD = {UAH_TO_USD} UAH",
        'displays': displays,
        'batteries': batteries,
        'cameras': cameras,
        'iphone': iphone_components,
        'macbook': macbook_components,
        'ipad': ipad_components,
        'apple_watch': watch_components
    }
    
    # Модель-артикул маппинг
    article_mapping = {
        'title': 'Apple Model to Article Number Mapping',
        'source': 'Exchange Price List 02.12.2025 (Ukraine AASP)',
        'models': model_mapping
    }
    
    # Сохраняем файлы
    with open(f'{OUTPUT_DIR}/logic_boards_comprehensive.json', 'w', encoding='utf-8') as f:
        json.dump(all_logic_boards, f, ensure_ascii=False, indent=2)
    
    with open(f'{OUTPUT_DIR}/components_comprehensive.json', 'w', encoding='utf-8') as f:
        json.dump(all_components, f, ensure_ascii=False, indent=2)
    
    with open(f'{OUTPUT_DIR}/model_article_mapping.json', 'w', encoding='utf-8') as f:
        json.dump(article_mapping, f, ensure_ascii=False, indent=2)
    
    print("\n" + "="*60)
    print("ИТОГИ:")
    print("="*60)
    print(f"✅ Logic Boards M-серии: {len(m_series_boards)}")
    print(f"✅ Logic Boards Intel: {len(intel_boards)}")
    print(f"✅ Дисплеи: {len(displays)}")
    print(f"✅ Батареи: {len(batteries)}")
    print(f"✅ Камеры: {len(cameras)}")
    print(f"✅ iPhone моделей с компонентами: {len(iphone_components)}")
    print(f"✅ MacBook категорий компонентов: {len(macbook_components)}")
    print(f"✅ iPad категорий: {len(ipad_components)}")
    print(f"✅ Apple Watch компонентов: {len(watch_components)}")
    print(f"✅ Моделей в маппинге: {len(model_mapping)}")
    print("\nФайлы сохранены:")
    print(f"  - {OUTPUT_DIR}/logic_boards_comprehensive.json")
    print(f"  - {OUTPUT_DIR}/components_comprehensive.json")
    print(f"  - {OUTPUT_DIR}/model_article_mapping.json")

if __name__ == '__main__':
    main()
