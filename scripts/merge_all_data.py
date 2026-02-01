#!/usr/bin/env python3
"""
Объединение всех собранных данных в единые файлы для приложения
"""
import json
import os
from datetime import datetime

OUTPUT_DIR = "/home/user/webapp/public/data"

def load_json(filename):
    """Загрузить JSON файл"""
    filepath = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    return None

def save_json(data, filename):
    """Сохранить JSON файл"""
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ Сохранено: {filename}")

def merge_devices():
    """Объединить все данные по устройствам"""
    print("\n📱 Объединение данных устройств...")
    
    # Загружаем данные
    ifixit = load_json("ifixit_data.json")
    github = load_json("github_devices.json")
    boards = load_json("board_numbers.json")
    parts = load_json("apple_parts_comprehensive.json")
    ic_data = load_json("ic_comprehensive.json")
    
    devices = []
    
    # Начинаем с iFixit данных (iPhone)
    if ifixit:
        for iphone in ifixit.get("iphones", []):
            name = iphone.get("name", "")
            device = {
                "name": name,
                "category": "iPhone",
                "model": "",
                "year": 0,
                "ifixit_url": iphone.get("ifixit_url", ""),
                "ifixit_image": iphone.get("image", ""),
                "repairability": iphone.get("repairability"),
                "guides_count": iphone.get("guides_count", 0),
                "available_repairs": iphone.get("available_repairs", []),
                "board_numbers": [],
                "processor": "",
                "charging_ic": {},
                "official_service_prices": {},
                "service_parts": {},
                "common_issues": [],
                "repair_difficulty": "Средняя",
                "repair_time": "1-2 часа"
            }
            
            # Добавляем данные плат
            if boards:
                for board_info in boards.get("iphones", []):
                    if board_info.get("name", "") in name or name in board_info.get("name", ""):
                        device["model"] = board_info.get("model", "")
                        device["year"] = board_info.get("year", 0)
                        board_num = board_info.get("board")
                        if isinstance(board_num, list):
                            device["board_numbers"] = board_num
                        else:
                            device["board_numbers"] = [board_num] if board_num else []
                        break
            
            # Добавляем артикулы и цены
            if parts:
                parts_data = parts.get("parts_by_model", {}).get(name, {})
                if parts_data:
                    for part_type, part_info in parts_data.items():
                        device["official_service_prices"][part_type] = part_info.get("price_usd", 0)
                        device["service_parts"][part_type] = {
                            "article": part_info.get("article", ""),
                            "description": part_info.get("description", ""),
                            "price_usd": part_info.get("price_usd", 0)
                        }
            
            # Добавляем IC данные
            if ic_data:
                year = device.get("year", 0)
                if year >= 2023:
                    device["charging_ic"] = {"main": "SN2800", "designation": "USB-C Controller"}
                    device["connector_type"] = "USB-C"
                elif year >= 2020:
                    device["charging_ic"] = {"main": "SN2611D0", "designation": "Tristar U3300"}
                    device["connector_type"] = "Lightning"
                elif year >= 2018:
                    device["charging_ic"] = {"main": "SN2600B1", "designation": "Tigris"}
                    device["connector_type"] = "Lightning"
                elif year >= 2017:
                    device["charging_ic"] = {"main": "SN2501", "designation": "Hydra U3300"}
                    device["connector_type"] = "Lightning"
                elif year >= 2016:
                    device["charging_ic"] = {"main": "1612A1", "designation": "Hydra"}
                    device["connector_type"] = "Lightning"
                elif year >= 2015:
                    device["charging_ic"] = {"main": "1610A3", "designation": "Tristar U2"}
                    device["connector_type"] = "Lightning"
                elif year >= 2014:
                    device["charging_ic"] = {"main": "1610A2", "designation": "Tristar U2"}
                    device["connector_type"] = "Lightning"
                else:
                    device["charging_ic"] = {"main": "1610A1", "designation": "Tristar U2"}
                    device["connector_type"] = "Lightning"
            
            # Типичные проблемы
            device["common_issues"] = get_common_issues("iPhone", device.get("year", 0), name)
            
            # Сложность ремонта
            device["repair_difficulty"] = get_repair_difficulty(name)
            device["repair_time"] = get_repair_time(name)
            
            devices.append(device)
    
    # Добавляем iPad
    if boards:
        for ipad in boards.get("ipads", []):
            name = ipad.get("name", "")
            device = {
                "name": name,
                "category": "iPad",
                "model": ipad.get("model", ""),
                "year": ipad.get("year", 0),
                "board_numbers": [ipad.get("board", "")] if ipad.get("board") else [],
                "processor": "",
                "charging_ic": {},
                "official_service_prices": {},
                "service_parts": {},
                "common_issues": get_common_issues("iPad", ipad.get("year", 0), name),
                "repair_difficulty": "Сложная",
                "repair_time": "2-4 часа"
            }
            
            # iPad Pro с USB-C
            if "Pro" in name and ipad.get("year", 0) >= 2018:
                device["charging_ic"] = {"main": "SN2800", "designation": "USB-C Controller"}
                device["connector_type"] = "USB-C"
            elif "Air" in name and ipad.get("year", 0) >= 2020:
                device["charging_ic"] = {"main": "SN2800", "designation": "USB-C Controller"}
                device["connector_type"] = "USB-C"
            elif "mini 6" in name or (ipad.get("year", 0) >= 2021 and "mini" in name.lower()):
                device["charging_ic"] = {"main": "SN2800", "designation": "USB-C Controller"}
                device["connector_type"] = "USB-C"
            else:
                device["charging_ic"] = {"main": "SN2611D0", "designation": "Tristar"}
                device["connector_type"] = "Lightning"
            
            # Добавляем артикулы если есть
            if parts:
                for model_name, parts_data in parts.get("parts_by_model", {}).items():
                    if "iPad" in model_name and (name in model_name or model_name in name):
                        for part_type, part_info in parts_data.items():
                            device["official_service_prices"][part_type] = part_info.get("price_usd", 0)
                            device["service_parts"][part_type] = {
                                "article": part_info.get("article", ""),
                                "description": part_info.get("description", ""),
                                "price_usd": part_info.get("price_usd", 0)
                            }
                        break
            
            devices.append(device)
    
    # Добавляем MacBook
    if boards:
        for mac in boards.get("macbooks", []):
            name = mac.get("name", "")
            device = {
                "name": name,
                "category": "Mac",
                "model": mac.get("model", ""),
                "emc": mac.get("emc", ""),
                "year": mac.get("year", 0),
                "board_numbers": [mac.get("board", "")] if mac.get("board") else [],
                "processor": mac.get("arch", ""),
                "charging_ic": {"main": "USB-C PD Controller", "designation": "CD3217"},
                "connector_type": "USB-C",
                "official_service_prices": {},
                "service_parts": {},
                "common_issues": get_common_issues("Mac", mac.get("year", 0), name),
                "repair_difficulty": "Сложная",
                "repair_time": "2-6 часов"
            }
            
            # Добавляем артикулы если есть
            if parts:
                for model_name, parts_data in parts.get("parts_by_model", {}).items():
                    if "MacBook" in model_name and (name in model_name or model_name in name):
                        for part_type, part_info in parts_data.items():
                            device["official_service_prices"][part_type] = part_info.get("price_usd", 0)
                            device["service_parts"][part_type] = {
                                "article": part_info.get("article", ""),
                                "description": part_info.get("description", ""),
                                "price_usd": part_info.get("price_usd", 0)
                            }
                        break
            
            devices.append(device)
    
    print(f"  📱 iPhone: {len([d for d in devices if d['category'] == 'iPhone'])}")
    print(f"  📱 iPad: {len([d for d in devices if d['category'] == 'iPad'])}")
    print(f"  💻 Mac: {len([d for d in devices if d['category'] == 'Mac'])}")
    print(f"  📊 Всего: {len(devices)}")
    
    return devices

def get_common_issues(category, year, name):
    """Получить типичные проблемы для устройства"""
    issues = []
    
    if category == "iPhone":
        issues = [
            "Разбитый экран",
            "Не заряжается",
            "Быстро разряжается батарея",
            "Не работает микрофон",
            "Проблемы с динамиком"
        ]
        
        if year >= 2017:
            issues.append("Face ID не работает")
        else:
            issues.append("Touch ID не работает")
        
        if "Pro" in name:
            issues.append("Проблемы с камерой (OIS)")
        
        if year >= 2020:
            issues.append("Проблемы с 5G модемом")
        
        if year == 2016 or year == 2017:
            if "7" in name:
                issues.append("Audio IC (Loop Disease)")
        
        if year >= 2023:
            issues.append("USB-C порт повреждён")
        else:
            issues.append("Lightning порт повреждён")
            
    elif category == "iPad":
        issues = [
            "Разбитый экран",
            "Не заряжается",
            "Быстро разряжается батарея",
            "Не работает Touch ID / Face ID",
            "Проблемы с Apple Pencil"
        ]
        
        if "Pro" in name:
            issues.append("Bent frame (погнутый корпус)")
            issues.append("USB-C порт повреждён")
        else:
            issues.append("Lightning порт повреждён")
            
    elif category == "Mac":
        issues = [
            "Не включается",
            "Не заряжается",
            "Перегрев / громкий вентилятор",
            "Проблемы с клавиатурой",
            "Проблемы с трекпадом",
            "Повреждён дисплей",
            "Вздутая батарея"
        ]
        
        if "Intel" in name or year < 2020:
            issues.append("Flexgate (подсветка)")
            issues.append("GPU артефакты")
        
        if "2016" in name or "2017" in name or "2018" in name or "2019" in name:
            issues.append("Butterfly keyboard (залипание)")
        
        if year >= 2018 and year < 2020:
            issues.append("T2 chip проблемы")
    
    return issues

def get_repair_difficulty(name):
    """Определить сложность ремонта"""
    name_lower = name.lower()
    
    if "pro max" in name_lower or "pro 12" in name_lower or "pro 13" in name_lower:
        return "Сложная"
    elif "pro" in name_lower:
        return "Средняя-Сложная"
    elif "mini" in name_lower or "se" in name_lower:
        return "Средняя"
    elif "air" in name_lower:
        return "Средняя"
    else:
        return "Средняя"

def get_repair_time(name):
    """Определить время ремонта"""
    name_lower = name.lower()
    
    if "macbook" in name_lower or "imac" in name_lower:
        return "2-6 часов"
    elif "ipad" in name_lower:
        return "2-4 часа"
    elif "pro max" in name_lower:
        return "2-3 часа"
    elif "pro" in name_lower:
        return "1.5-2.5 часа"
    else:
        return "1-2 часа"

def merge_error_codes():
    """Объединить коды ошибок"""
    print("\n🚨 Объединение кодов ошибок...")
    
    comprehensive = load_json("error_codes_comprehensive.json")
    
    if comprehensive:
        save_json(comprehensive, "error_codes.json")
        print(f"  📊 iTunes: {len(comprehensive.get('itunes_restore_errors', []))}")
        print(f"  📊 Mac: {len(comprehensive.get('mac_diagnostics', []))}")
        return comprehensive
    
    return None

def merge_ic_database():
    """Объединить базу микросхем"""
    print("\n🔌 Объединение базы микросхем...")
    
    comprehensive = load_json("ic_comprehensive.json")
    
    if comprehensive:
        save_json(comprehensive, "ic_compatibility.json")
        stats = comprehensive.get("stats", {})
        print(f"  📊 Charging: {stats.get('charging', 0)}")
        print(f"  📊 Power: {stats.get('power', 0)}")
        print(f"  📊 Audio: {stats.get('audio', 0)}")
        print(f"  📊 Baseband: {stats.get('baseband', 0)}")
        print(f"  📊 NAND: {stats.get('nand', 0)}")
        print(f"  📊 WiFi/BT: {stats.get('wifi_bt', 0)}")
        print(f"  📊 Biometric: {stats.get('biometric', 0)}")
        print(f"  📊 Всего: {stats.get('total', 0)}")
        return comprehensive
    
    return None

def merge_logic_boards():
    """Объединить базу плат"""
    print("\n🔧 Объединение базы плат...")
    
    boards = load_json("board_numbers.json")
    
    if boards:
        # Преобразуем в формат для приложения
        result = {
            "source": "repair.wiki + community",
            "generated_at": datetime.now().isoformat(),
            "m_series_boards": [],
            "intel_boards": []
        }
        
        for mac in boards.get("macbooks", []):
            arch = mac.get("arch", "")
            board_entry = {
                "model": mac.get("name", ""),
                "model_number": mac.get("model", ""),
                "emc": mac.get("emc", ""),
                "board_number": mac.get("board", ""),
                "year": mac.get("year", 0),
                "architecture": arch
            }
            
            if "Apple" in arch or "M1" in arch or "M2" in arch or "M3" in arch:
                result["m_series_boards"].append(board_entry)
            else:
                result["intel_boards"].append(board_entry)
        
        # Добавляем iPhone и iPad платы
        result["iphone_boards"] = boards.get("iphones", [])
        result["ipad_boards"] = boards.get("ipads", [])
        
        save_json(result, "logic_boards_comprehensive.json")
        print(f"  📊 M-series Mac: {len(result['m_series_boards'])}")
        print(f"  📊 Intel Mac: {len(result['intel_boards'])}")
        print(f"  📊 iPhone: {len(result['iphone_boards'])}")
        print(f"  📊 iPad: {len(result['ipad_boards'])}")
        return result
    
    return None

def merge_article_search():
    """Создать поисковый индекс артикулов"""
    print("\n📦 Создание поискового индекса артикулов...")
    
    parts = load_json("apple_parts_comprehensive.json")
    
    if parts:
        search_index = []
        
        for model, model_parts in parts.get("parts_by_model", {}).items():
            for part_type, part_info in model_parts.items():
                search_index.append({
                    "article": part_info.get("article", ""),
                    "model": model,
                    "part_type": part_type,
                    "description": part_info.get("description", ""),
                    "price_usd": part_info.get("price_usd", 0)
                })
        
        # Добавляем инструменты
        for article, tool_info in parts.get("tools", {}).items():
            search_index.append({
                "article": article,
                "model": "Apple Tool",
                "part_type": "tool",
                "description": tool_info.get("description", ""),
                "price_usd": tool_info.get("rental_usd", tool_info.get("purchase_usd", 0))
            })
        
        result = {
            "source": "Apple Self Service Repair",
            "generated_at": datetime.now().isoformat(),
            "articles": search_index
        }
        
        save_json(result, "article_search_index.json")
        print(f"  📊 Артикулов: {len(search_index)}")
        return result
    
    return None

def merge_repair_knowledge():
    """Создать базу знаний по ремонту"""
    print("\n📚 Создание базы знаний...")
    
    ic_data = load_json("ic_comprehensive.json")
    
    # Создаём структурированную базу знаний
    knowledge = {
        "generated_at": datetime.now().isoformat(),
        "version": "2.0",
        
        "tristar_hydra": {
            "description": "Диагностика и ремонт Tristar/Hydra/U2 IC - контроллера зарядки iPhone",
            "symptoms": [
                "Не заряжается",
                "Accessory not supported",
                "Заряжается только от компьютера",
                "Не определяется в iTunes/Finder",
                "Перегрев около порта зарядки",
                "Boot loop после залития"
            ],
            "diagnosis": [
                "Проверить диодный режим на D+ и D- (норма 0.450-0.650V)",
                "Проверить наличие PP5V0_USB (5V при подключении)",
                "Измерить потребление тока (норма 0.05-0.15A в покое)",
                "Проверить наличие USB данных в диагностике"
            ],
            "solution": [
                "Замена Tristar/Hydra IC требует BGA паяльной станции",
                "Нужен preheater для прогрева платы",
                "После замены требуется калибровка батареи"
            ],
            "tools": [
                "Паяльная станция с горячим воздухом",
                "BGA ребол станция",
                "Мультиметр",
                "DC Power Supply с измерением тока"
            ],
            "ic_by_model": {}
        },
        
        "baseband": {
            "description": "Диагностика baseband/модема - нет сети, нет IMEI",
            "symptoms": [
                "No Service / Searching...",
                "Нет IMEI (Settings -> About)",
                "Ошибка -1 или 1 при восстановлении",
                "Нет сотовых данных"
            ],
            "diagnosis": [
                "Проверить IMEI в настройках",
                "Проверить антенный коннектор",
                "Измерить напряжение питания baseband",
                "Проверить наличие baseband в диагностике"
            ],
            "solution": [
                "Проверить и переустановить антенные коннекторы",
                "Ребол baseband IC (сложно, PoP корпус)",
                "Замена baseband IC требует переноса NVRAM"
            ],
            "tools": [
                "BGA станция с точным контролем температуры",
                "Программатор для NVRAM backup",
                "Hot air station"
            ]
        },
        
        "touch_ic": {
            "description": "Проблемы Touch IC на iPad и старых iPhone",
            "symptoms": [
                "Touch не работает полностью или частично",
                "Мерцание серой полосы вверху экрана (iPad)",
                "Touch работает после нажатия на экран"
            ],
            "diagnosis": [
                "Проверить flex cable дисплея",
                "Проверить пайку Touch IC",
                "Тест с новым дисплеем"
            ],
            "solution": [
                "Jumper wire на отваливающиеся пады",
                "Ребол Touch IC",
                "Установка дополнительного шунта под разъём"
            ]
        },
        
        "water_damage": {
            "immediate_actions": [
                "НЕ включать устройство!",
                "НЕ ставить на зарядку!",
                "Извлечь SIM и лоток",
                "Разобрать как можно быстрее",
                "Отключить батарею в первую очередь"
            ],
            "professional_repair": [
                "Ультразвуковая очистка в изопропиловом спирте",
                "Осмотр под микроскопом на коррозию",
                "Проверка всех коннекторов",
                "Проверка после очистки перед сборкой"
            ],
            "common_failures_after_water": [
                "Tristar/Hydra IC",
                "Audio IC",
                "Baseband IC",
                "Backlight IC",
                "Батарея"
            ]
        },
        
        "nand_programming": {
            "description": "NAND программирование и перенос данных",
            "programmers": [
                "JC P7 / P8 / Pro1000S",
                "Magico NAND Box",
                "PCIE NAND Programmer"
            ],
            "use_cases": [
                "Ошибки 4013, 4014, 9",
                "Расширение памяти (upgrade)",
                "Перенос данных с неисправной платы",
                "Замена NAND после физ. повреждения"
            ],
            "important_notes": [
                "SN и ECID должны совпадать с оригиналом",
                "SysCfg должен быть скопирован",
                "На новых устройствах NAND привязан к CPU"
            ]
        },
        
        "tools_supplies": {
            "essential_tools": [
                {"name": "Hot Air Station", "examples": "Quick 861DW, Atten ST-862D"},
                {"name": "Soldering Station", "examples": "JBC, Hakko FX-951"},
                {"name": "Microscope", "examples": "AmScope, Trinocular 7-45x"},
                {"name": "DC Power Supply", "examples": "Mechanic P30, Sunshine P-3005DA"},
                {"name": "Multimeter", "examples": "Fluke 15B+, UNI-T UT61E"},
                {"name": "Ultrasonic Cleaner", "examples": "Vevor 6L, GT Sonic"},
                {"name": "Preheater", "examples": "UYUE 946S-II"}
            ],
            "supplies": [
                "Изопропиловый спирт 99%",
                "Flux (паяльная паста)",
                "Solder paste",
                "BGA шарики разных размеров",
                "Kapton tape",
                "Термопаста"
            ]
        }
    }
    
    # Добавляем IC данные по моделям
    if ic_data:
        for ic in ic_data.get("charging_ics", []):
            for device in ic.get("compatible_devices", []):
                knowledge["tristar_hydra"]["ic_by_model"][device] = {
                    "ic_name": ic.get("name"),
                    "designation": ic.get("designation"),
                    "symptoms": ic.get("symptoms_when_faulty", []),
                    "diagnostics": ic.get("diagnostics", {}),
                    "difficulty": ic.get("difficulty"),
                    "price_range": ic.get("price_range")
                }
    
    save_json(knowledge, "repair_knowledge.json")
    print(f"  📊 Разделов: {len(knowledge.keys())}")
    return knowledge

def main():
    print("=" * 60)
    print("🔄 ОБЪЕДИНЕНИЕ ВСЕХ СОБРАННЫХ ДАННЫХ")
    print("=" * 60)
    
    # 1. Объединяем устройства
    devices = merge_devices()
    save_json(devices, "devices.json")
    
    # 2. Объединяем коды ошибок
    merge_error_codes()
    
    # 3. Объединяем базу IC
    merge_ic_database()
    
    # 4. Объединяем базу плат
    merge_logic_boards()
    
    # 5. Создаём поисковый индекс артикулов
    merge_article_search()
    
    # 6. Создаём базу знаний
    merge_repair_knowledge()
    
    # 7. Создаём файл официальных цен
    parts = load_json("apple_parts_comprehensive.json")
    if parts:
        prices = {
            "title": "Apple Official Service Prices",
            "source": "Apple Self Service Repair",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "currency": "USD",
            "prices": {}
        }
        
        for model, model_parts in parts.get("parts_by_model", {}).items():
            prices["prices"][model] = {}
            for part_type, part_info in model_parts.items():
                prices["prices"][model][part_type] = {
                    "price_usd": part_info.get("price_usd", 0),
                    "article": part_info.get("article", "")
                }
        
        save_json(prices, "official_service_prices.json")
        print(f"\n📊 Официальных цен: {len(prices['prices'])} моделей")
    
    print("\n" + "=" * 60)
    print("✅ ОБЪЕДИНЕНИЕ ЗАВЕРШЕНО!")
    print("=" * 60)
    
    # Итоговая статистика
    print("\n📊 ИТОГОВАЯ СТАТИСТИКА:")
    print(f"  • Устройств: {len(devices)}")
    print(f"  • Категории: iPhone, iPad, Mac")

if __name__ == "__main__":
    main()
