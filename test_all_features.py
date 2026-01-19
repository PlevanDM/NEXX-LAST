#!/usr/bin/env python3
import requests
import json

BASE = "http://localhost:3000"

def test_endpoint(name, url, validator=None):
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            if validator:
                result = validator(r.json())
                print(f"✅ {name}: {result}")
            else:
                print(f"✅ {name}: OK ({len(r.content)} bytes)")
        else:
            print(f"❌ {name}: HTTP {r.status_code}")
    except Exception as e:
        print(f"❌ {name}: {e}")

# Main page
test_endpoint("Главная страница", BASE)

# Static assets
test_endpoint("Static JS", f"{BASE}/static/app.js")
test_endpoint("Static favicon", f"{BASE}/static/favicon.ico")

# Data endpoints
test_endpoint("devices.json", f"{BASE}/data/devices.json", 
    lambda d: f"{len(d)} устройств")
    
test_endpoint("article_search_index.json", f"{BASE}/data/article_search_index.json",
    lambda d: f"{d.get('total', 0)} артикулов")
    
test_endpoint("logic_boards_comprehensive.json", f"{BASE}/data/logic_boards_comprehensive.json",
    lambda d: f"M-series: {len(d.get('m_series', []))}, Intel: {len(d.get('intel', []))}")
    
test_endpoint("official_service_prices.json", f"{BASE}/data/official_service_prices.json",
    lambda d: f"{len(d.get('models', {}))} моделей")
    
test_endpoint("error_codes.json", f"{BASE}/data/error_codes.json",
    lambda d: f"iTunes: {len(d.get('itunes_restore_errors', {}))}, Mac: {len(d.get('mac_diagnostics', {}))}")
    
test_endpoint("ic_compatibility.json", f"{BASE}/data/ic_compatibility.json",
    lambda d: f"Charging: {len(d.get('charging_ics', {}))}, Power: {len(d.get('power_ics', {}))}")
    
test_endpoint("repair_knowledge.json", f"{BASE}/data/repair_knowledge.json",
    lambda d: f"Разделов: {len(d.keys())}")

print("\n=== ТЕСТ ФУНКЦИОНАЛА ПАНЕЛЕЙ ===")

# Test devices data structure
r = requests.get(f"{BASE}/data/devices.json")
devices = r.json()

iphone = next((d for d in devices if d.get('category') == 'iPhone' and d.get('official_service_prices')), None)
if iphone:
    prices = iphone.get('official_service_prices', {})
    print(f"✅ Калькулятор: iPhone с ценами найден ({iphone['name']})")
    print(f"   Виды ремонта: {list(prices.keys())}")
else:
    print("❌ Калькулятор: Нет iPhone с ценами")

# Test error codes
r = requests.get(f"{BASE}/data/error_codes.json")
errors = r.json()
popular_codes = ['9', '14', '4013', '4014']
found = [c for c in popular_codes if c in errors.get('itunes_restore_errors', {})]
print(f"✅ Ошибки: Найдено {len(found)}/4 популярных кодов ({', '.join(found)})")

# Test IC database categories
r = requests.get(f"{BASE}/data/ic_compatibility.json")
ics = r.json()
ic_cats = ['charging_ics', 'power_ics', 'audio_ics', 'baseband_ics', 'nand_ics']
found_cats = [c for c in ic_cats if c in ics and len(ics[c]) > 0]
print(f"✅ IC Database: {len(found_cats)}/5 категорий с данными")

# Test knowledge base
r = requests.get(f"{BASE}/data/repair_knowledge.json")
kb = r.json()
kb_topics = ['tristar_hydra', 'baseband', 'touch_ic', 'water_damage', 'nand_programming', 'tools_supplies']
found_topics = [t for t in kb_topics if t in kb]
print(f"✅ База знаний: {len(found_topics)}/6 тем найдено")

print("\n=== ИТОГОВАЯ СТАТИСТИКА ===")
print(f"📱 Устройства: {len(devices)}")
print(f"💰 С ценами: {len([d for d in devices if d.get('official_service_prices')])}")
print(f"🔧 С артикулами: {len([d for d in devices if d.get('service_parts')])}")
print(f"⚠️ С неисправностями: {len([d for d in devices if d.get('common_issues')])}")
print(f"⚡ С charging IC: {len([d for d in devices if d.get('charging_ic')])}")
