#!/usr/bin/env python3
"""
Обогащение основной базы устройств артикулами и официальными ценами
"""

import json
import re
import os

DATA_DIR = '/home/user/webapp/public/data'

def load_json(filename):
    """Загрузка JSON файла"""
    filepath = os.path.join(DATA_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def save_json(filename, data):
    """Сохранение JSON файла"""
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def normalize_model_name(name):
    """Нормализация названия модели для сопоставления"""
    name = name.lower().strip()
    # Удаляем лишние пробелы
    name = re.sub(r'\s+', ' ', name)
    # Убираем скобки с годом
    name = re.sub(r'\s*\(\d{4}\)', '', name)
    return name

def match_iphone_model(device_name, components_data):
    """Сопоставление iPhone модели с компонентами"""
    
    # Паттерны для нормализации названий iPhone
    iphone_patterns = {
        'iphone 17 pro max': ['iPhone 17 Pro Max'],
        'iphone 17 pro': ['iPhone 17 Pro'],
        'iphone 17 plus': ['iPhone 17 Plus'],
        'iphone 17': ['iPhone 17'],
        'iphone 16 pro max': ['iPhone 16 Pro Max'],
        'iphone 16 pro': ['iPhone 16 Pro'],
        'iphone 16 plus': ['iPhone 16 Plus'],
        'iphone 16e': ['iPhone 16e'],
        'iphone 16': ['iPhone 16'],
        'iphone 15 pro max': ['iPhone 15 Pro Max'],
        'iphone 15 pro': ['iPhone 15 Pro'],
        'iphone 15 plus': ['iPhone 15 Plus'],
        'iphone 15': ['iPhone 15'],
        'iphone 14 pro max': ['iPhone 14 Pro Max'],
        'iphone 14 pro': ['iPhone 14 Pro'],
        'iphone 14 plus': ['iPhone 14 Plus'],
        'iphone 14': ['iPhone 14'],
        'iphone 13 pro max': ['iPhone 13 Pro Max'],
        'iphone 13 pro': ['iPhone 13 Pro'],
        'iphone 13 mini': ['iPhone 13 mini'],
        'iphone 13': ['iPhone 13'],
        'iphone 12 pro max': ['iPhone 12 Pro Max'],
        'iphone 12 pro': ['iPhone 12 Pro'],
        'iphone 12 mini': ['iPhone 12 mini'],
        'iphone 12': ['iPhone 12'],
        'iphone 11 pro max': ['iPhone 11 Pro Max'],
        'iphone 11 pro': ['iPhone 11 Pro'],
        'iphone 11': ['iPhone 11'],
        'iphone xs max': ['iPhone XS Max'],
        'iphone xs': ['iPhone XS'],
        'iphone xr': ['iPhone XR'],
        'iphone x': ['iPhone X'],
        'iphone 8 plus': ['iPhone 8 Plus'],
        'iphone 8': ['iPhone 8'],
        'iphone 7 plus': ['iPhone 7 Plus'],
        'iphone 7': ['iPhone 7'],
        'iphone se': ['iPhone SE'],
        'iphone 6s plus': ['iPhone 6s Plus'],
        'iphone 6s': ['iPhone 6s'],
        'iphone 6 plus': ['iPhone 6 Plus'],
        'iphone 6': ['iPhone 6'],
    }
    
    device_lower = normalize_model_name(device_name)
    
    for pattern, keys in iphone_patterns.items():
        if pattern in device_lower:
            for key in keys:
                if key in components_data.get('iphone', {}):
                    return components_data['iphone'][key]
    
    return None

def enrich_devices():
    """Обогащение базы устройств"""
    
    print("Загрузка данных...")
    
    # Загружаем основную базу устройств
    devices_list = load_json('devices.json')
    if not devices_list:
        print("❌ devices.json не найден")
        return
    
    # Преобразуем список в словарь по категориям
    devices = {'iphone': {}, 'ipad': {}, 'mac': {}}
    for device in devices_list:
        category = device.get('category', '').lower()
        device_id = str(device.get('id', device.get('name', '')))
        
        if 'iphone' in category.lower():
            devices['iphone'][device_id] = device
        elif 'ipad' in category.lower():
            devices['ipad'][device_id] = device
        elif 'mac' in category.lower():
            devices['mac'][device_id] = device
    
    # Загружаем компоненты
    components = load_json('components_comprehensive.json')
    if not components:
        print("❌ components_comprehensive.json не найден")
        return
    
    # Загружаем официальные цены
    official_prices = load_json('official_service_prices.json')
    
    # Загружаем Logic Boards
    logic_boards = load_json('logic_boards_comprehensive.json')
    
    # Загружаем маппинг
    mapping = load_json('model_article_mapping.json')
    
    print(f"Устройств в базе: {len(devices.get('iphone', {}))} iPhone, "
          f"{len(devices.get('ipad', {}))} iPad, {len(devices.get('mac', {}))} Mac")
    
    # Статистика обогащения
    enriched_iphone = 0
    enriched_ipad = 0
    enriched_mac = 0
    
    # Обогащаем iPhone
    if 'iphone' in devices:
        for device_id, device in devices['iphone'].items():
            device_name = device.get('name', device_id)
            
            # Ищем компоненты
            parts = match_iphone_model(device_name, components)
            if parts:
                # Добавляем артикулы компонентов
                device['service_parts'] = {}
                
                for part_type, part_list in parts.items():
                    if part_list:
                        device['service_parts'][part_type] = []
                        for part in part_list:
                            device['service_parts'][part_type].append({
                                'article': part['article'],
                                'description': part['description'],
                                'price_usd': part['price_usd']
                            })
                
                enriched_iphone += 1
            
            # Добавляем официальные цены если есть
            if official_prices and 'prices' in official_prices:
                for price_model, prices in official_prices['prices'].items():
                    if normalize_model_name(price_model) in normalize_model_name(device_name) or \
                       normalize_model_name(device_name) in normalize_model_name(price_model):
                        device['official_service_prices'] = {
                            'battery': prices.get('battery', {}).get('price_usd'),
                            'display': prices.get('display', {}).get('price_usd'),
                            'rear_camera': prices.get('rear_camera', {}).get('price_usd'),
                            'face_id': prices.get('face_id', {}).get('price_usd'),
                            'taptic_engine': prices.get('taptic_engine', {}).get('price_usd'),
                            'speaker': prices.get('speaker', {}).get('price_usd')
                        }
                        # Убираем None значения
                        device['official_service_prices'] = {
                            k: v for k, v in device['official_service_prices'].items() if v
                        }
                        break
    
    # Обогащаем iPad
    if 'ipad' in devices:
        ipad_parts = components.get('ipad', {})
        for device_id, device in devices['ipad'].items():
            device_name = device.get('name', device_id)
            
            # Простой поиск по iPad Pro/Air/mini
            for ipad_type, parts_list in ipad_parts.items():
                if ipad_type.lower() in device_name.lower():
                    device['service_parts_count'] = len(parts_list) if isinstance(parts_list, list) else 0
                    enriched_ipad += 1
                    break
    
    # Обогащаем Mac
    if 'mac' in devices and logic_boards:
        m_series = logic_boards.get('m_series', [])
        intel_series = logic_boards.get('intel', [])
        
        for device_id, device in devices['mac'].items():
            device_name = device.get('name', device_id)
            
            # Ищем подходящие Logic Boards
            matching_boards = []
            
            for board in m_series:
                if board.get('model') and board['model'].lower() in device_name.lower():
                    matching_boards.append({
                        'article': board['article'],
                        'chip': board.get('chip'),
                        'cpu_cores': board.get('cpu_cores'),
                        'gpu_cores': board.get('gpu_cores'),
                        'ram_gb': board.get('ram_gb'),
                        'price_usd': board['price_usd']
                    })
            
            for board in intel_series:
                if board.get('model') and board['model'].lower() in device_name.lower():
                    matching_boards.append({
                        'article': board['article'],
                        'cpu_ghz': board.get('cpu_ghz'),
                        'ram_gb': board.get('ram_gb'),
                        'price_usd': board['price_usd']
                    })
            
            if matching_boards:
                device['available_logic_boards'] = matching_boards
                enriched_mac += 1
    
    # Преобразуем обратно в список и сохраняем
    enriched_list = []
    for category in ['iphone', 'ipad', 'mac']:
        for device_id, device in devices.get(category, {}).items():
            enriched_list.append(device)
    
    # Сохраняем обогащенные данные
    save_json('devices.json', enriched_list)
    
    print(f"\n✅ Обогащено:")
    print(f"   iPhone: {enriched_iphone}")
    print(f"   iPad: {enriched_ipad}")
    print(f"   Mac: {enriched_mac}")
    
    # Создаем сводную таблицу артикулов для поиска
    create_article_search_index(components, logic_boards, mapping)
    
    return devices

def create_article_search_index(components, logic_boards, mapping):
    """Создание индекса для быстрого поиска по артикулам"""
    
    index = {
        'title': 'Apple Part Number Search Index',
        'source': 'Exchange Price List 02.12.2025 (Ukraine AASP)',
        'total': 0,
        'by_prefix': {},
        'by_device_type': {
            'iPhone': [],
            'iPad': [],
            'MacBook': [],
            'iMac': [],
            'Mac mini': [],
            'Apple Watch': []
        }
    }
    
    # Собираем все артикулы
    all_articles = {}
    
    # Из дисплеев
    for article, data in components.get('displays', {}).items():
        all_articles[article] = {
            'article': article,
            'type': 'display',
            'description': data.get('description'),
            'device_type': data.get('device_type'),
            'price_usd': data.get('price_usd')
        }
    
    # Из батарей
    for article, data in components.get('batteries', {}).items():
        all_articles[article] = {
            'article': article,
            'type': 'battery',
            'description': data.get('description'),
            'device_type': data.get('device'),
            'price_usd': data.get('price_usd')
        }
    
    # Из камер
    for article, data in components.get('cameras', {}).items():
        all_articles[article] = {
            'article': article,
            'type': data.get('camera_type', 'camera'),
            'description': data.get('description'),
            'price_usd': data.get('price_usd')
        }
    
    # Из Logic Boards
    if logic_boards:
        for board in logic_boards.get('m_series', []):
            all_articles[board['article']] = {
                'article': board['article'],
                'type': 'logic_board',
                'description': board.get('description'),
                'chip': board.get('chip'),
                'specs': {
                    'cpu_cores': board.get('cpu_cores'),
                    'gpu_cores': board.get('gpu_cores'),
                    'ram_gb': board.get('ram_gb')
                },
                'price_usd': board.get('price_usd')
            }
        
        for board in logic_boards.get('intel', []):
            all_articles[board['article']] = {
                'article': board['article'],
                'type': 'logic_board',
                'description': board.get('description'),
                'architecture': 'Intel',
                'specs': {
                    'cpu_ghz': board.get('cpu_ghz'),
                    'ram_gb': board.get('ram_gb')
                },
                'price_usd': board.get('price_usd')
            }
    
    # Группируем по префиксам
    for article, data in all_articles.items():
        prefix = article.split('-')[0] if '-' in article else article[:3]
        if prefix not in index['by_prefix']:
            index['by_prefix'][prefix] = []
        index['by_prefix'][prefix].append(data)
        
        # Группируем по типу устройства
        device_type = data.get('device_type')
        if device_type and device_type in index['by_device_type']:
            index['by_device_type'][device_type].append(article)
    
    index['total'] = len(all_articles)
    index['articles'] = all_articles
    
    # Сохраняем индекс
    save_json('article_search_index.json', index)
    
    print(f"\n📑 Создан индекс поиска по артикулам:")
    print(f"   Всего артикулов: {index['total']}")
    print(f"   Префиксов: {len(index['by_prefix'])}")
    
    # Статистика по типам
    type_stats = {}
    for data in all_articles.values():
        t = data.get('type', 'unknown')
        type_stats[t] = type_stats.get(t, 0) + 1
    
    print(f"   По типам:")
    for t, count in sorted(type_stats.items(), key=lambda x: -x[1]):
        print(f"      {t}: {count}")

def main():
    print("="*60)
    print("ОБОГАЩЕНИЕ БАЗЫ УСТРОЙСТВ АРТИКУЛАМИ И ЦЕНАМИ")
    print("="*60)
    
    devices = enrich_devices()
    
    if devices:
        print("\n✅ База устройств обогащена и сохранена")
    else:
        print("\n❌ Ошибка обогащения")

if __name__ == '__main__':
    main()
