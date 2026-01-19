#!/usr/bin/env python3
"""
Сбор данных Apple устройств с GitHub репозиториев
"""
import json
import requests
import os

OUTPUT_DIR = "/home/user/webapp/public/data"

def collect_device_identifiers():
    """Собрать данные с kyle-seongwoo-jun/apple-device-identifiers"""
    print("📱 Сбор apple-device-identifiers...")
    
    devices = {}
    platforms = ["ios", "watchos", "tvos"]
    
    for platform in platforms:
        url = f"https://raw.githubusercontent.com/kyle-seongwoo-jun/apple-device-identifiers/main/{platform}/device-identifiers.json"
        try:
            resp = requests.get(url, timeout=30)
            if resp.status_code == 200:
                data = resp.json()
                devices[platform] = data
                print(f"  ✅ {platform}: {len(data)} устройств")
        except Exception as e:
            print(f"  ❌ {platform}: {e}")
    
    return devices

def collect_ios_device_list():
    """Собрать данные с pbakondy/ios-device-list"""
    print("📱 Сбор ios-device-list...")
    
    url = "https://raw.githubusercontent.com/pbakondy/ios-device-list/master/devices.json"
    try:
        resp = requests.get(url, timeout=30)
        if resp.status_code == 200:
            data = resp.json()
            print(f"  ✅ {len(data)} устройств")
            return data
    except Exception as e:
        print(f"  ❌ {e}")
    
    return []

def collect_adamawolf_list():
    """Собрать данные с gist adamawolf"""
    print("📱 Сбор adamawolf gist...")
    
    url = "https://gist.githubusercontent.com/adamawolf/3048717/raw/apple-machine-identifiers.txt"
    try:
        resp = requests.get(url, timeout=30)
        if resp.status_code == 200:
            lines = resp.text.strip().split("\n")
            devices = []
            for line in lines:
                if " : " in line:
                    parts = line.split(" : ")
                    if len(parts) == 2:
                        devices.append({
                            "identifier": parts[0].strip(),
                            "name": parts[1].strip()
                        })
            print(f"  ✅ {len(devices)} устройств")
            return devices
    except Exception as e:
        print(f"  ❌ {e}")
    
    return []

def process_and_normalize(device_identifiers, ios_list, adamawolf):
    """Объединить и нормализовать данные"""
    print("\n🔄 Нормализация данных...")
    
    all_devices = {}
    
    # Добавляем из ios-device-list (наиболее полный)
    # Формат: {"name": "iPhone 6", "model": "iPhone7,2", "ANumber": ["A1549", "A1586"], "FCCID": [...]}
    for device in ios_list:
        identifier = device.get("model", device.get("Identifier", ""))
        if identifier:
            anumber = device.get("ANumber", [])
            if isinstance(anumber, list):
                anumber = ", ".join(anumber) if anumber else ""
            fccid = device.get("FCCID", [])
            if isinstance(fccid, list):
                fccid = ", ".join(fccid) if fccid else ""
            
            all_devices[identifier] = {
                "identifier": identifier,
                "name": device.get("name", ""),
                "anumber": anumber,
                "fccid": fccid,
                "internal_name": device.get("InternalName", ""),
                "bootrom": device.get("Bootrom", ""),
                "soc": device.get("soc", "")
            }
    
    # Дополняем из adamawolf
    for device in adamawolf:
        identifier = device.get("identifier", "")
        if identifier:
            if identifier not in all_devices:
                all_devices[identifier] = {
                    "identifier": identifier,
                    "name": device.get("name", ""),
                    "anumber": "",
                    "fccid": "",
                    "internal_name": "",
                    "bootrom": "",
                    "soc": ""
                }
            else:
                # Обновляем имя если лучше
                if not all_devices[identifier]["name"] and device.get("name"):
                    all_devices[identifier]["name"] = device.get("name")
    
    # Дополняем из device-identifiers
    for platform, devices in device_identifiers.items():
        if isinstance(devices, dict):
            for identifier, name in devices.items():
                if identifier not in all_devices:
                    all_devices[identifier] = {
                        "identifier": identifier,
                        "name": name,
                        "anumber": "",
                        "fccid": "",
                        "internal_name": "",
                        "bootrom": "",
                        "soc": "",
                        "platform": platform
                    }
    
    # Классифицируем устройства
    iphones = []
    ipads = []
    macs = []
    watches = []
    airpods = []
    others = []
    
    for identifier, device in all_devices.items():
        if identifier.startswith("iPhone"):
            iphones.append(device)
        elif identifier.startswith("iPad"):
            ipads.append(device)
        elif identifier.startswith("Mac") or identifier.startswith("iMac"):
            macs.append(device)
        elif identifier.startswith("Watch"):
            watches.append(device)
        elif identifier.startswith("AirPods") or identifier.startswith("iPod") or identifier.startswith("Audio"):
            airpods.append(device)
        else:
            others.append(device)
    
    print(f"  iPhone: {len(iphones)}")
    print(f"  iPad: {len(ipads)}")
    print(f"  Mac: {len(macs)}")
    print(f"  Watch: {len(watches)}")
    print(f"  AirPods/iPod: {len(airpods)}")
    print(f"  Other: {len(others)}")
    
    return {
        "iphones": iphones,
        "ipads": ipads,
        "macs": macs,
        "watches": watches,
        "airpods": airpods,
        "others": others,
        "total": len(all_devices)
    }

def main():
    print("=" * 60)
    print("📱 Сбор данных Apple устройств с GitHub")
    print("=" * 60)
    
    # Сбор из разных источников
    device_identifiers = collect_device_identifiers()
    ios_list = collect_ios_device_list()
    adamawolf = collect_adamawolf_list()
    
    # Нормализация
    normalized = process_and_normalize(device_identifiers, ios_list, adamawolf)
    
    # Сохраняем
    result = {
        "source": "GitHub Open Source",
        "sources": [
            "kyle-seongwoo-jun/apple-device-identifiers",
            "pbakondy/ios-device-list",
            "adamawolf/apple-machine-identifiers"
        ],
        "collected_at": __import__("time").strftime("%Y-%m-%d %H:%M:%S"),
        "devices": normalized
    }
    
    output_file = os.path.join(OUTPUT_DIR, "github_devices.json")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Сохранено в {output_file}")
    print(f"📊 Всего: {normalized['total']} устройств")
    
    return result

if __name__ == "__main__":
    main()
