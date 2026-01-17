#!/usr/bin/env python3
"""
Скрипт для загрузки дополнительных данных из iFixit API
"""

import json
import requests
import time

# iFixit API endpoint
IFIXIT_API = "https://www.ifixit.com/api/2.0"

# Список популярных моделей iPhone для загрузки
IPHONE_MODELS = [
    "iPhone_6s", "iPhone_6s_Plus",  
    "iPhone_7", "iPhone_7_Plus",
    "iPhone_8", "iPhone_8_Plus",
    "iPhone_X",
    "iPhone_XR", "iPhone_XS", "iPhone_XS_Max",
    "iPhone_11", "iPhone_11_Pro", "iPhone_11_Pro_Max",
    "iPhone_12", "iPhone_12_mini", "iPhone_12_Pro", "iPhone_12_Pro_Max",
    "iPhone_13", "iPhone_13_mini", "iPhone_13_Pro", "iPhone_13_Pro_Max",
    "iPhone_14", "iPhone_14_Plus", "iPhone_14_Pro", "iPhone_14_Pro_Max",
    "iPhone_15", "iPhone_15_Plus", "iPhone_15_Pro", "iPhone_15_Pro_Max"
]

def get_device_info(device_name):
    """Получить информацию об устройстве из iFixit"""
    try:
        url = f"{IFIXIT_API}/wikis/CATEGORY/{device_name}"
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        print(f"Ошибка при загрузке {device_name}: {e}")
        return None

def get_device_guides(device_name):
    """Получить руководства по ремонту устройства"""
    try:
        url = f"{IFIXIT_API}/categories/{device_name}"
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return data.get('guides', [])
        return []
    except Exception as e:
        print(f"Ошибка при загрузке руководств {device_name}: {e}")
        return []

# Загружаем дополнительную информацию
ifixit_data = {}

print("Загрузка данных из iFixit API...")
print(f"Устройств для загрузки: {len(IPHONE_MODELS)}")

for i, model in enumerate(IPHONE_MODELS, 1):
    print(f"[{i}/{len(IPHONE_MODELS)}] Загрузка {model}...")
    
    device_info = get_device_info(model)
    if device_info:
        ifixit_data[model] = {
            'wiki_info': device_info,
            'description': device_info.get('description', ''),
            'image': device_info.get('image', {}),
            'guides_count': len(device_info.get('guides', []))
        }
        
        # Получаем список руководств
        guides = get_device_guides(model.replace('_', ' '))
        if guides:
            ifixit_data[model]['top_guides'] = [
                {
                    'title': g.get('title', ''),
                    'guideid': g.get('guideid', ''),
                    'url': g.get('url', ''),
                    'difficulty': g.get('difficulty', ''),
                    'time_required': g.get('time_required', '')
                }
                for g in guides[:5]  # Топ-5 руководств
            ]
    
    # Пауза чтобы не нагружать API
    time.sleep(0.5)

# Сохраняем данные
with open('/home/user/webapp/public/data/ifixit_data.json', 'w', encoding='utf-8') as f:
    json.dump(ifixit_data, f, ensure_ascii=False, indent=2)

print(f"\nЗагружено данных для {len(ifixit_data)} устройств")
print("Сохранено в ifixit_data.json")

# Создаем сводную статистику
stats = {
    'total_devices': len(ifixit_data),
    'devices_with_guides': sum(1 for d in ifixit_data.values() if d.get('guides_count', 0) > 0),
    'total_guides': sum(d.get('guides_count', 0) for d in ifixit_data.values()),
    'devices_list': list(ifixit_data.keys())
}

with open('/home/user/webapp/public/data/ifixit_stats.json', 'w', encoding='utf-8') as f:
    json.dump(stats, f, ensure_ascii=False, indent=2)

print(f"\nСтатистика:")
print(f"  - Устройств с руководствами: {stats['devices_with_guides']}")
print(f"  - Всего руководств: {stats['total_guides']}")
