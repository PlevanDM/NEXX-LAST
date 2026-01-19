#!/usr/bin/env python3
"""
Сбор данных с iFixit API
https://www.ifixit.com/api/2.0/
"""
import json
import requests
import time
import os

BASE_URL = "https://www.ifixit.com/api/2.0"
OUTPUT_DIR = "/home/user/webapp/public/data"

def get_categories():
    """Получить все категории Apple устройств"""
    categories = []
    apple_categories = ["iPhone", "iPad", "Mac", "MacBook Pro", "MacBook Air", "iMac", "Mac mini", "Mac Pro"]
    
    for cat in apple_categories:
        try:
            url = f"{BASE_URL}/categories/{cat}"
            resp = requests.get(url, timeout=30)
            if resp.status_code == 200:
                data = resp.json()
                categories.append({
                    "name": cat,
                    "data": data
                })
                print(f"✅ Category: {cat}")
            time.sleep(0.5)  # Rate limiting
        except Exception as e:
            print(f"❌ Error {cat}: {e}")
    
    return categories

def get_device_info(device_name):
    """Получить информацию об устройстве"""
    try:
        url = f"{BASE_URL}/wikis/CATEGORY/{device_name}"
        resp = requests.get(url, timeout=30)
        if resp.status_code == 200:
            return resp.json()
    except:
        pass
    return None

def get_guides(category):
    """Получить гайды для категории"""
    try:
        url = f"{BASE_URL}/guides?category={category}&limit=50"
        resp = requests.get(url, timeout=30)
        if resp.status_code == 200:
            return resp.json()
    except:
        pass
    return []

def collect_iphone_data():
    """Собрать данные по iPhone"""
    iphones = []
    
    # Список всех моделей iPhone
    models = [
        "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
        "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
        "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
        "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13 mini", "iPhone 13",
        "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12 mini", "iPhone 12",
        "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11",
        "iPhone XS Max", "iPhone XS", "iPhone XR", "iPhone X",
        "iPhone 8 Plus", "iPhone 8", "iPhone 7 Plus", "iPhone 7",
        "iPhone 6s Plus", "iPhone 6s", "iPhone 6 Plus", "iPhone 6",
        "iPhone SE 3rd Generation", "iPhone SE 2nd Generation", "iPhone SE"
    ]
    
    for model in models:
        try:
            encoded = model.replace(" ", "_")
            url = f"{BASE_URL}/wikis/CATEGORY/{encoded}"
            resp = requests.get(url, timeout=30)
            
            if resp.status_code == 200:
                data = resp.json()
                device = {
                    "name": model,
                    "ifixit_url": f"https://www.ifixit.com/Device/{encoded}",
                    "image": data.get("image", {}).get("standard"),
                    "summary": data.get("summary"),
                    "repairability": data.get("repairability"),
                    "parts": [],
                    "guides_count": 0
                }
                
                # Получить гайды
                guides_url = f"{BASE_URL}/guides?category={encoded}&limit=100"
                guides_resp = requests.get(guides_url, timeout=30)
                if guides_resp.status_code == 200:
                    guides = guides_resp.json()
                    device["guides_count"] = len(guides)
                    
                    # Извлечь виды ремонта из гайдов
                    repair_types = set()
                    for guide in guides:
                        title = guide.get("title", "").lower()
                        if "battery" in title:
                            repair_types.add("battery")
                        if "screen" in title or "display" in title:
                            repair_types.add("display")
                        if "camera" in title:
                            repair_types.add("camera")
                        if "speaker" in title:
                            repair_types.add("speaker")
                        if "charging" in title or "port" in title:
                            repair_types.add("charging_port")
                    
                    device["available_repairs"] = list(repair_types)
                
                iphones.append(device)
                print(f"✅ {model}: {device['guides_count']} guides")
            
            time.sleep(0.3)
            
        except Exception as e:
            print(f"❌ {model}: {e}")
    
    return iphones

def collect_ipad_data():
    """Собрать данные по iPad"""
    ipads = []
    
    models = [
        "iPad Pro 12.9\" 6th Gen", "iPad Pro 11\" 4th Gen",
        "iPad Pro 12.9\" 5th Gen", "iPad Pro 11\" 3rd Gen",
        "iPad Air 5", "iPad Air 4",
        "iPad 10", "iPad 9",
        "iPad mini 6", "iPad mini 5"
    ]
    
    for model in models:
        try:
            encoded = model.replace(" ", "_").replace('"', "")
            url = f"{BASE_URL}/wikis/CATEGORY/{encoded}"
            resp = requests.get(url, timeout=30)
            
            if resp.status_code == 200:
                data = resp.json()
                ipads.append({
                    "name": model,
                    "ifixit_url": f"https://www.ifixit.com/Device/{encoded}",
                    "image": data.get("image", {}).get("standard"),
                    "summary": data.get("summary"),
                    "repairability": data.get("repairability")
                })
                print(f"✅ {model}")
            
            time.sleep(0.3)
            
        except Exception as e:
            print(f"❌ {model}: {e}")
    
    return ipads

def collect_mac_data():
    """Собрать данные по Mac"""
    macs = []
    
    models = [
        "MacBook Pro 16\" 2023", "MacBook Pro 14\" 2023",
        "MacBook Pro 16\" 2021", "MacBook Pro 14\" 2021",
        "MacBook Air M3", "MacBook Air M2", "MacBook Air M1",
        "iMac 24\" M3", "iMac 24\" M1",
        "Mac mini M2", "Mac mini M1",
        "Mac Studio M2", "Mac Studio M1",
        "Mac Pro 2023"
    ]
    
    for model in models:
        try:
            encoded = model.replace(" ", "_").replace('"', "")
            url = f"{BASE_URL}/wikis/CATEGORY/{encoded}"
            resp = requests.get(url, timeout=30)
            
            if resp.status_code == 200:
                data = resp.json()
                macs.append({
                    "name": model,
                    "ifixit_url": f"https://www.ifixit.com/Device/{encoded}",
                    "image": data.get("image", {}).get("standard"),
                    "summary": data.get("summary"),
                    "repairability": data.get("repairability")
                })
                print(f"✅ {model}")
            
            time.sleep(0.3)
            
        except Exception as e:
            print(f"❌ {model}: {e}")
    
    return macs

def main():
    print("=" * 60)
    print("📱 Сбор данных с iFixit API")
    print("=" * 60)
    
    # Собираем данные
    print("\n📱 Сбор iPhone...")
    iphones = collect_iphone_data()
    
    print("\n📱 Сбор iPad...")
    ipads = collect_ipad_data()
    
    print("\n💻 Сбор Mac...")
    macs = collect_mac_data()
    
    # Сохраняем
    result = {
        "source": "iFixit API",
        "collected_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "iphones": iphones,
        "ipads": ipads,
        "macs": macs,
        "stats": {
            "iphones": len(iphones),
            "ipads": len(ipads),
            "macs": len(macs),
            "total": len(iphones) + len(ipads) + len(macs)
        }
    }
    
    output_file = os.path.join(OUTPUT_DIR, "ifixit_data.json")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Сохранено в {output_file}")
    print(f"📊 iPhone: {len(iphones)}, iPad: {len(ipads)}, Mac: {len(macs)}")
    
    return result

if __name__ == "__main__":
    main()
