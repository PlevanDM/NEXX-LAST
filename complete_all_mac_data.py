#!/usr/bin/env python3
"""
Complete Mac data with board numbers from repair.wiki
"""
import json

# Полная база номеров плат MacBook из repair.wiki
MACBOOK_BOARD_DATA = {
    # MacBook Air
    "MacBook Air 11\" (2013)": {"board_numbers": ["820-3435"], "model": "A1465", "processor": "Intel Core i5/i7 4th Gen"},
    "MacBook Air 11\" (2014)": {"board_numbers": ["820-3435"], "model": "A1465", "processor": "Intel Core i5/i7 4th Gen"},
    "MacBook Air 11\" (2015)": {"board_numbers": ["820-00164"], "model": "A1465", "processor": "Intel Core i5/i7 5th Gen"},
    "MacBook Air 13\" (2013)": {"board_numbers": ["820-3437"], "model": "A1466", "processor": "Intel Core i5/i7 4th Gen"},
    "MacBook Air 13\" (2014)": {"board_numbers": ["820-3437"], "model": "A1466", "processor": "Intel Core i5/i7 4th Gen"},
    "MacBook Air 13\" (2015)": {"board_numbers": ["820-00165"], "model": "A1466", "processor": "Intel Core i5/i7 5th Gen"},
    "MacBook Air 13\" (2017)": {"board_numbers": ["820-00165"], "model": "A1466", "processor": "Intel Core i5/i7 5th Gen"},
    "MacBook Air 13\" (2018)": {"board_numbers": ["820-01521"], "model": "A1932", "processor": "Intel Core i5 8th Gen + T2"},
    "MacBook Air 13\" (2019)": {"board_numbers": ["820-01521"], "model": "A1932", "processor": "Intel Core i5 8th Gen + T2"},
    "MacBook Air 13\" (2020)": {"board_numbers": ["820-01055", "820-01958"], "model": "A2179", "processor": "Intel Core i3/i5/i7 10th Gen + T2"},
    "MacBook Air 13\" M1 (2020)": {"board_numbers": ["820-02016"], "model": "A2337", "processor": "Apple M1"},
    "MacBook Air 13\" M2 (2022)": {"board_numbers": ["820-02536"], "model": "A2681", "processor": "Apple M2"},
    "MacBook Air 15\" M2 (2023)": {"board_numbers": ["820-02537"], "model": "A2941", "processor": "Apple M2"},
    "MacBook Air 13\" M3 (2024)": {"board_numbers": ["820-03285"], "model": "A3113", "processor": "Apple M3"},
    "MacBook Air 15\" M3 (2024)": {"board_numbers": ["820-03286"], "model": "A3114", "processor": "Apple M3"},
    "MacBook Air 13\" M4 (2025)": {"board_numbers": ["820-03597-A"], "model": "A3240", "processor": "Apple M4"},
    "MacBook Air 15\" M4 (2025)": {"board_numbers": ["820-03681"], "model": "A3241", "processor": "Apple M4"},
    
    # MacBook Pro 13"
    "MacBook Pro 13\" (2013)": {"board_numbers": ["820-3476", "820-3536"], "model": "A1502", "processor": "Intel Core i5/i7 4th Gen"},
    "MacBook Pro 13\" (2014)": {"board_numbers": ["820-3476", "820-3536"], "model": "A1502", "processor": "Intel Core i5/i7 4th Gen"},
    "MacBook Pro 13\" (2015)": {"board_numbers": ["820-4924"], "model": "A1502", "processor": "Intel Core i5/i7 5th Gen"},
    "MacBook Pro 13\" (2016)": {"board_numbers": ["820-00875"], "model": "A1708", "processor": "Intel Core i5/i7 6th Gen"},
    "MacBook Pro 13\" Touch Bar (2016)": {"board_numbers": ["820-00239"], "model": "A1706", "processor": "Intel Core i5/i7 6th Gen"},
    "MacBook Pro 13\" (2017)": {"board_numbers": ["820-00840"], "model": "A1708", "processor": "Intel Core i5/i7 7th Gen"},
    "MacBook Pro 13\" Touch Bar (2017)": {"board_numbers": ["820-00923"], "model": "A1706", "processor": "Intel Core i5/i7 7th Gen"},
    "MacBook Pro 13\" (2018)": {"board_numbers": ["820-00850"], "model": "A1989", "processor": "Intel Core i5/i7 8th Gen + T2"},
    "MacBook Pro 13\" (2019)": {"board_numbers": ["820-00850", "820-01598"], "model": "A1989/A2159", "processor": "Intel Core i5/i7 8th Gen + T2"},
    "MacBook Pro 13\" (2020)": {"board_numbers": ["820-01987", "820-01949"], "model": "A2289/A2251", "processor": "Intel Core i5/i7 8th/10th Gen + T2"},
    "MacBook Pro 13\" M1 (2020)": {"board_numbers": ["820-02020"], "model": "A2338", "processor": "Apple M1"},
    "MacBook Pro 13\" M2 (2022)": {"board_numbers": ["820-02773"], "model": "A2338", "processor": "Apple M2"},
    
    # MacBook Pro 14"
    "MacBook Pro 14\" M1 Pro (2021)": {"board_numbers": ["820-02098", "820-02443"], "model": "A2442", "processor": "Apple M1 Pro/Max"},
    "MacBook Pro 14\" M2 Pro (2023)": {"board_numbers": ["820-02655", "820-02841"], "model": "A2779", "processor": "Apple M2 Pro/Max"},
    "MacBook Pro 14\" M3 (2023)": {"board_numbers": ["820-02757"], "model": "A2918", "processor": "Apple M3"},
    "MacBook Pro 14\" M3 Pro (2023)": {"board_numbers": ["820-02918"], "model": "A2992", "processor": "Apple M3 Pro/Max"},
    "MacBook Pro 14\" M4 (2024)": {"board_numbers": ["820-03129"], "model": "A3112", "processor": "Apple M4"},
    "MacBook Pro 14\" M4 Pro (2024)": {"board_numbers": ["820-03400"], "model": "A3401", "processor": "Apple M4 Pro/Max"},
    
    # MacBook Pro 15"
    "MacBook Pro 15\" (2013)": {"board_numbers": ["820-3662"], "model": "A1398", "processor": "Intel Core i7 4th Gen"},
    "MacBook Pro 15\" dGPU (2013)": {"board_numbers": ["820-3787"], "model": "A1398", "processor": "Intel Core i7 4th Gen"},
    "MacBook Pro 15\" (2015)": {"board_numbers": ["820-00138"], "model": "A1398", "processor": "Intel Core i7 5th Gen"},
    "MacBook Pro 15\" dGPU (2015)": {"board_numbers": ["820-00163", "820-00426"], "model": "A1398", "processor": "Intel Core i7 5th Gen"},
    "MacBook Pro 15\" (2016)": {"board_numbers": ["820-00281"], "model": "A1707", "processor": "Intel Core i7 6th Gen"},
    "MacBook Pro 15\" (2017)": {"board_numbers": ["820-00928"], "model": "A1707", "processor": "Intel Core i7 7th Gen"},
    "MacBook Pro 15\" (2018)": {"board_numbers": ["820-01041", "820-01326"], "model": "A1990", "processor": "Intel Core i7/i9 8th Gen + T2"},
    "MacBook Pro 15\" (2019)": {"board_numbers": ["820-01814", "820-01827"], "model": "A1990", "processor": "Intel Core i7/i9 9th Gen + T2"},
    
    # MacBook Pro 16"
    "MacBook Pro 16\" (2019)": {"board_numbers": ["820-01700"], "model": "A2141", "processor": "Intel Core i7/i9 9th Gen + T2"},
    "MacBook Pro 16\" M1 Pro (2021)": {"board_numbers": ["820-02100", "820-02382"], "model": "A2485", "processor": "Apple M1 Pro/Max"},
    "MacBook Pro 16\" M2 Pro (2023)": {"board_numbers": ["820-02652", "820-02890"], "model": "A2780", "processor": "Apple M2 Pro/Max"},
    "MacBook Pro 16\" M3 Pro (2023)": {"board_numbers": ["820-02935", "820-02917"], "model": "A2991", "processor": "Apple M3 Pro/Max"},
    "MacBook Pro 16\" M4 Pro (2024)": {"board_numbers": ["820-03401"], "model": "A3185", "processor": "Apple M4 Pro/Max"},
}

# Типовые проблемы Mac по чипам
MAC_COMMON_ISSUES = {
    "T2": [
        "BridgeOS не загружается",
        "SSD не определяется",
        "No POST (DFU режим)",
        "Kernel panic при загрузке",
        "Touch ID не работает",
        "T2 chip failure (коды ADP)"
    ],
    "M1": [
        "No power (CD3217B12 failure)",
        "PPBUS_AON short",
        "USB-C ports not working",
        "Display backlight failure",
        "SSD controller failure",
        "Liquid damage corrosion"
    ],
    "M2": [
        "No power (CD3217B12)",
        "PP5V_S2 short",
        "G3H power rail short",
        "USB-C controller failure",
        "Display connector damage"
    ],
    "M3": [
        "USB-C charging issues",
        "Display backlight problems", 
        "Power button issues",
        "SSD not detected"
    ],
    "M4": [
        "Early production issues",
        "USB-C charging problems"
    ],
    "Intel": [
        "GPU failure (Radeon)",
        "Flexgate (display cable)",
        "Keyboard butterfly issues",
        "Battery swelling",
        "SMC reset required",
        "PRAM/NVRAM corruption"
    ]
}

def get_chip_type(processor):
    """Определить тип чипа по процессору"""
    if "M4" in processor:
        return "M4"
    elif "M3" in processor:
        return "M3"
    elif "M2" in processor:
        return "M2"
    elif "M1" in processor:
        return "M1"
    elif "T2" in processor:
        return "T2"
    else:
        return "Intel"

def main():
    print("🔧 Полное заполнение данных MacBook из repair.wiki")
    
    with open("public/data/devices.json", "r", encoding="utf-8") as f:
        devices = json.load(f)
    
    updated = 0
    
    for device in devices:
        name = device.get("name", "")
        category = device.get("category", "")
        
        if category != "Mac":
            continue
            
        # Пробуем найти соответствие в базе
        matched = False
        for board_name, board_data in MACBOOK_BOARD_DATA.items():
            # Нечеткое сопоставление
            name_lower = name.lower()
            board_lower = board_name.lower()
            
            # Проверяем ключевые слова
            if ("macbook air" in name_lower and "macbook air" in board_lower) or \
               ("macbook pro" in name_lower and "macbook pro" in board_lower):
                
                # Проверяем размер экрана
                size_match = False
                for size in ["11\"", "13\"", "14\"", "15\"", "16\""]:
                    if size in name and size in board_name:
                        size_match = True
                        break
                
                # Проверяем чип/год
                chip_match = False
                for chip in ["M1", "M2", "M3", "M4"]:
                    if chip in name and chip in board_name:
                        chip_match = True
                        break
                
                # Проверяем год
                for year in ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]:
                    if year in name and year in board_name:
                        chip_match = True
                        break
                
                if size_match and chip_match:
                    # Обновляем данные
                    if not device.get("board_numbers") or device["board_numbers"] == []:
                        device["board_numbers"] = board_data["board_numbers"]
                    
                    if not device.get("model_number"):
                        device["model_number"] = board_data["model"]
                    
                    # Определяем тип чипа и добавляем типовые проблемы
                    chip_type = get_chip_type(board_data["processor"])
                    if chip_type in MAC_COMMON_ISSUES:
                        existing_issues = device.get("common_issues", [])
                        new_issues = MAC_COMMON_ISSUES[chip_type]
                        # Добавляем только новые проблемы
                        for issue in new_issues:
                            if issue not in existing_issues:
                                existing_issues.append(issue)
                        device["common_issues"] = existing_issues
                    
                    print(f"  ✅ {name}: {board_data['board_numbers']}")
                    updated += 1
                    matched = True
                    break
        
        if not matched and "MacBook" in name:
            print(f"  ⚠️ Не найдено соответствие: {name}")
    
    with open("public/data/devices.json", "w", encoding="utf-8") as f:
        json.dump(devices, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Обновлено MacBook: {updated}")
    
    # Проверяем результат
    mac_with_boards = sum(1 for d in devices if d.get("category") == "Mac" and d.get("board_numbers"))
    mac_total = sum(1 for d in devices if d.get("category") == "Mac")
    print(f"Mac с board_numbers: {mac_with_boards}/{mac_total}")

if __name__ == "__main__":
    main()
