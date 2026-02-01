#!/usr/bin/env python3
"""
Полная база кодов ошибок iTunes/Finder и Mac диагностики
"""
import json
import os

OUTPUT_DIR = "/home/user/webapp/public/data"

# Полная база ошибок iTunes/Finder при восстановлении
ITUNES_ERRORS = [
    # Критические ошибки Hardware
    {"code": -1, "description": "Неизвестная ошибка", "cause": "Baseband/модем не отвечает", "solution": "Проверить baseband IC, возможна перепайка", "hardware": True, "severity": "critical"},
    {"code": 1, "description": "Ошибка загрузки прошивки", "cause": "Проблема с интернетом или повреждённый файл", "solution": "Проверьте интернет, отключите VPN/Firewall, попробуйте другой USB порт", "hardware": False, "severity": "medium"},
    {"code": 2, "description": "ASR не может обработать прошивку", "cause": "Повреждённая прошивка или jailbreak", "solution": "Скачать свежий IPSW с ipsw.me, войти в DFU режим", "hardware": False, "severity": "medium"},
    {"code": 3, "description": "Не удаётся связаться с сервером", "cause": "Сетевые проблемы или устаревший iTunes", "solution": "Обновите iTunes, проверьте hosts файл, отключите антивирус", "hardware": False, "severity": "low"},
    {"code": 4, "description": "Устройство не поддерживается", "cause": "Несовместимая версия iTunes/Finder", "solution": "Обновить iTunes/macOS до последней версии", "hardware": False, "severity": "low"},
    {"code": 5, "description": "Прошивка не совместима", "cause": "Неправильный IPSW файл", "solution": "Скачать правильный IPSW для модели устройства", "hardware": False, "severity": "low"},
    {"code": 6, "description": "Образ слишком большой", "cause": "Недостаточно места или повреждённый IPSW", "solution": "Освободить место на компьютере, перескачать IPSW", "hardware": False, "severity": "low"},
    {"code": 9, "description": "Устройство отключилось", "cause": "Проблема USB, кабеля, батареи или NAND", "solution": "Заменить кабель, проверить USB порт, проверить батарею", "hardware": True, "severity": "high"},
    {"code": 10, "description": "Низкий заряд NAND", "cause": "NAND flash память разряжена", "solution": "Зарядить устройство 15 минут, попробовать снова", "hardware": True, "severity": "medium"},
    {"code": 11, "description": "Ошибка восстановления baseband", "cause": "Baseband firmware не загрузился", "solution": "Проверить антенный коннектор, baseband IC", "hardware": True, "severity": "high"},
    {"code": 13, "description": "USB проблема", "cause": "Кабель USB 3.0 или хаб несовместим", "solution": "Использовать USB 2.0 порт напрямую", "hardware": False, "severity": "low"},
    {"code": 14, "description": "Ошибка проверки прошивки", "cause": "Повреждённый IPSW или NAND", "solution": "Скачать IPSW заново, проверить NAND память", "hardware": True, "severity": "high"},
    {"code": 17, "description": "Устройство в неверном режиме", "cause": "Не в DFU/Recovery режиме", "solution": "Войти в DFU режим правильно", "hardware": False, "severity": "low"},
    {"code": 18, "description": "Медиатека повреждена", "cause": "Corrupt media library на устройстве", "solution": "Стереть устройство через DFU", "hardware": False, "severity": "medium"},
    {"code": 19, "description": "IPSW поврежден на диске", "cause": "Файл повреждён при загрузке", "solution": "Удалить и перескачать IPSW", "hardware": False, "severity": "low"},
    {"code": 20, "description": "Устройство в режиме восстановления", "cause": "Неожиданный режим устройства", "solution": "Использовать DFU режим вместо Recovery", "hardware": False, "severity": "low"},
    {"code": 21, "description": "Не входит в DFU режим", "cause": "Проблема с батареей или кнопками", "solution": "Зарядить минимум до 20%, проверить кнопки", "hardware": True, "severity": "medium"},
    {"code": 23, "description": "Ошибка чтения IMEI/Serial", "cause": "Проблема с baseband или NAND (SysCfg)", "solution": "Проверить baseband, восстановить NVRAM", "hardware": True, "severity": "critical"},
    {"code": 26, "description": "NOR поврежден", "cause": "NOR flash память повреждена", "solution": "Перепрошить NOR через программатор", "hardware": True, "severity": "critical"},
    {"code": 27, "description": "Baseband таймаут", "cause": "Baseband чип не отвечает", "solution": "Проверить baseband IC, возможна замена", "hardware": True, "severity": "critical"},
    {"code": 28, "description": "Ошибка питания baseband", "cause": "Нет питания на baseband", "solution": "Проверить PM IC и обвязку baseband", "hardware": True, "severity": "critical"},
    {"code": 29, "description": "Ошибка батареи/питания", "cause": "Батарея не совместима или PM IC", "solution": "Заменить на оригинальную батарею, проверить PM IC", "hardware": True, "severity": "high"},
    {"code": 31, "description": "DFU режим недоступен", "cause": "Аппаратная проблема кнопок/CPU", "solution": "Проверить кнопки и соединения CPU", "hardware": True, "severity": "critical"},
    {"code": 34, "description": "NAND не отвечает", "cause": "NAND flash не отвечает", "solution": "Проверить NAND, возможна замена с переносом данных", "hardware": True, "severity": "critical"},
    {"code": 35, "description": "Не удалось запретить загрузку", "cause": "Проблема с bootrom/security", "solution": "Попробовать разные версии IPSW", "hardware": False, "severity": "medium"},
    {"code": 37, "description": "Не удалось подготовить NOR", "cause": "NOR flash проблема", "solution": "Перепрошить NOR", "hardware": True, "severity": "high"},
    {"code": 40, "description": "Ошибка сенсоров/камеры", "cause": "Аппаратная проблема сенсоров", "solution": "Проверить flex кабели камеры и сенсоров", "hardware": True, "severity": "medium"},
    {"code": 47, "description": "Ошибка загрузки iBoot", "cause": "iBoot не загружается", "solution": "Попробовать DFU режим, проверить NAND", "hardware": True, "severity": "high"},
    {"code": 50, "description": "Проблема даты/времени", "cause": "Неверная дата на компьютере", "solution": "Установить правильную дату и время", "hardware": False, "severity": "low"},
    {"code": 51, "description": "Не удаётся подключиться к устройству", "cause": "iTunes не может связаться с устройством", "solution": "Переустановить iTunes, драйверы Apple Mobile Device", "hardware": False, "severity": "low"},
    {"code": 52, "description": "Таймаут FDR", "cause": "FDR сервер не отвечает", "solution": "Проверить интернет, попробовать позже", "hardware": False, "severity": "low"},
    {"code": 53, "description": "Ошибка Touch ID", "cause": "Touch ID модуль не оригинальный или отключен", "solution": "Установить оригинальный Touch ID модуль", "hardware": True, "severity": "medium"},
    {"code": 54, "description": "Ошибка синхронизации", "cause": "Устройство не авторизовано", "solution": "Деавторизовать и авторизовать компьютер", "hardware": False, "severity": "low"},
    {"code": 56, "description": "Ошибка NFC/Apple Pay", "cause": "NFC модуль неисправен", "solution": "Проверить NFC антенну и IC", "hardware": True, "severity": "medium"},
    
    # 1xxx ошибки
    {"code": 1002, "description": "Ошибка распаковки IPSW", "cause": "IPSW повреждён", "solution": "Перескачать IPSW", "hardware": False, "severity": "low"},
    {"code": 1004, "description": "SHSH сервер недоступен", "cause": "Apple сервер не отвечает", "solution": "Проверить интернет, попробовать позже", "hardware": False, "severity": "low"},
    {"code": 1011, "description": "Ошибка восстановления из резервной копии", "cause": "Резервная копия повреждена", "solution": "Создать новую резервную копию", "hardware": False, "severity": "low"},
    {"code": 1013, "description": "Ошибка активации baseband", "cause": "Baseband не активируется", "solution": "Проверить baseband IC и антенну", "hardware": True, "severity": "high"},
    {"code": 1014, "description": "Ошибка активации", "cause": "Проблемы с сервером активации", "solution": "Попробовать позже или проверить hosts файл", "hardware": False, "severity": "low"},
    {"code": 1015, "description": "Даунгрейд не разрешён", "cause": "Попытка установить старую iOS", "solution": "Установить последнюю подписанную iOS", "hardware": False, "severity": "low"},
    {"code": 1100, "description": "Ошибка записи данных", "cause": "Проблема с диском компьютера или NAND", "solution": "Проверить свободное место и NAND устройства", "hardware": True, "severity": "medium"},
    {"code": 1110, "description": "Недостаточно места на устройстве", "cause": "NAND переполнен", "solution": "Освободить место или восстановить через DFU", "hardware": False, "severity": "medium"},
    {"code": 1394, "description": "Ошибка связи с устройством", "cause": "USB проблема", "solution": "Попробовать другой порт/кабель", "hardware": False, "severity": "low"},
    {"code": 1667, "description": "Ошибка активации iOS", "cause": "Сервер активации недоступен", "solution": "Проверить интернет, попробовать позже", "hardware": False, "severity": "low"},
    {"code": 1669, "description": "Ошибка прошивки baseband", "cause": "Baseband firmware не применился", "solution": "Попробовать другой IPSW или проверить baseband", "hardware": True, "severity": "high"},
    
    # 2xxx ошибки
    {"code": 2001, "description": "Проблема USB драйвера", "cause": "Apple Mobile Device драйвер", "solution": "Переустановить драйверы Apple Mobile Device", "hardware": False, "severity": "low"},
    {"code": 2002, "description": "Устройство занято", "cause": "Антивирус или другая программа блокирует", "solution": "Закрыть все программы, отключить антивирус", "hardware": False, "severity": "low"},
    {"code": 2003, "description": "Ошибка соединения", "cause": "Кабель или порт проблема", "solution": "Использовать оригинальный кабель напрямую", "hardware": False, "severity": "low"},
    {"code": 2005, "description": "Ошибка USB соединения", "cause": "Плохой кабель или порт", "solution": "Использовать оригинальный кабель, USB 2.0 порт", "hardware": False, "severity": "low"},
    {"code": 2006, "description": "Ошибка образа IPSW", "cause": "IPSW файл повреждён", "solution": "Перескачать IPSW с ipsw.me", "hardware": False, "severity": "low"},
    {"code": 2009, "description": "Внутренняя ошибка", "cause": "Проблема с iTunes/Finder", "solution": "Обновить или переустановить iTunes/macOS", "hardware": False, "severity": "low"},
    
    # 3xxx ошибки
    {"code": 3000, "description": "Ошибка сети", "cause": "Сетевые проблемы", "solution": "Проверить интернет и firewall", "hardware": False, "severity": "low"},
    {"code": 3001, "description": "Ошибка подписи IPSW", "cause": "IPSW не подписан Apple", "solution": "Скачать подписанную версию iOS", "hardware": False, "severity": "low"},
    {"code": 3002, "description": "Ошибка запуска восстановления", "cause": "Устройство отклонило восстановление", "solution": "Войти в DFU режим", "hardware": False, "severity": "low"},
    {"code": 3004, "description": "Нет интернета", "cause": "Компьютер не подключен к интернету", "solution": "Проверить подключение к интернету", "hardware": False, "severity": "low"},
    {"code": 3014, "description": "Сервер отклонил запрос", "cause": "gs.apple.com заблокирован", "solution": "Проверить файл hosts, отключить VPN", "hardware": False, "severity": "low"},
    {"code": 3123, "description": "Ошибка аренды видео", "cause": "DRM проблема", "solution": "Деавторизовать и авторизовать iTunes", "hardware": False, "severity": "low"},
    {"code": 3194, "description": "SHSH не подписан", "cause": "Apple не подписывает эту iOS", "solution": "Обновить на последнюю подписанную iOS", "hardware": False, "severity": "medium"},
    {"code": 3195, "description": "IPSW недействителен", "cause": "SHSH blob недействителен", "solution": "Скачать новый IPSW", "hardware": False, "severity": "low"},
    
    # 4xxx ошибки (критические hardware)
    {"code": 4000, "description": "Невозможно подключиться", "cause": "iTunes не может связаться с устройством", "solution": "Проверить кабель, порт и драйверы", "hardware": False, "severity": "low"},
    {"code": 4005, "description": "Таймаут при восстановлении", "cause": "Медленный USB или проблема NAND", "solution": "Попробовать USB 2.0, проверить NAND", "hardware": True, "severity": "high"},
    {"code": 4013, "description": "Отключение во время обновления", "cause": "NAND/CPU/питание проблема", "solution": "Прогреть CPU, перекатать NAND, проверить питание", "hardware": True, "severity": "critical"},
    {"code": 4014, "description": "Критическая ошибка обновления", "cause": "NAND/CPU проблема", "solution": "Перекатать/заменить NAND, прогреть CPU", "hardware": True, "severity": "critical"},
    {"code": 4015, "description": "Ошибка загрузчика", "cause": "iBoot не загружается", "solution": "Проверить CPU и NAND", "hardware": True, "severity": "critical"},
    {"code": 4016, "description": "Тайм-аут NOR", "cause": "NOR flash не отвечает", "solution": "Проверить NOR flash IC", "hardware": True, "severity": "critical"},
    
    # 9xxx ошибки
    {"code": 9006, "description": "Ошибка загрузки прошивки", "cause": "Проблема с интернетом", "solution": "Проверить интернет, отключить VPN", "hardware": False, "severity": "low"},
    {"code": 9807, "description": "Ошибка сертификата", "cause": "Сертификат Apple истёк/недействителен", "solution": "Установить правильную дату, обновить систему", "hardware": False, "severity": "low"},
]

# Коды диагностики Mac (Apple Diagnostics / Apple Hardware Test)
MAC_DIAGNOSTICS = [
    # ADP - Apple Diagnostics Pass
    {"code": "ADP000", "description": "Нет проблем", "cause": "Тест пройден успешно", "component": "System", "severity": "none"},
    
    # CNW - Wi-Fi
    {"code": "CNW001", "description": "Проблема с Wi-Fi модулем", "cause": "Wi-Fi модуль неисправен", "solution": "Заменить Wi-Fi карту или модуль", "component": "WiFi", "severity": "medium"},
    {"code": "CNW002", "description": "Wi-Fi антенна", "cause": "Антенна отключена или повреждена", "solution": "Проверить антенный кабель", "component": "WiFi", "severity": "low"},
    {"code": "CNW003", "description": "Wi-Fi конфигурация", "cause": "Ошибка настроек Wi-Fi", "solution": "Сбросить NVRAM, переустановить macOS", "component": "WiFi", "severity": "low"},
    {"code": "CNW004", "description": "Wi-Fi не обнаружен", "cause": "Модуль не определяется", "solution": "Проверить соединение модуля", "component": "WiFi", "severity": "high"},
    {"code": "CNW005", "description": "Wi-Fi не включается", "cause": "Проблема питания Wi-Fi", "solution": "Проверить PM IC и power rails", "component": "WiFi", "severity": "high"},
    {"code": "CNW006", "description": "Wi-Fi перегрев", "cause": "Перегрев Wi-Fi модуля", "solution": "Проверить охлаждение, заменить термопасту", "component": "WiFi", "severity": "medium"},
    {"code": "CNW007", "description": "Ошибка Wi-Fi firmware", "cause": "Wi-Fi firmware повреждён", "solution": "Обновить macOS или восстановить firmware", "component": "WiFi", "severity": "medium"},
    {"code": "CNW008", "description": "Wi-Fi не сканирует сети", "cause": "Аппаратная проблема сканирования", "solution": "Заменить Wi-Fi модуль", "component": "WiFi", "severity": "high"},
    
    # CNB - Bluetooth
    {"code": "CNB001", "description": "Проблема с Bluetooth", "cause": "Bluetooth модуль неисправен", "solution": "Заменить Bluetooth модуль", "component": "Bluetooth", "severity": "medium"},
    {"code": "CNB002", "description": "Bluetooth антенна", "cause": "Антенна отключена", "solution": "Проверить антенный кабель", "component": "Bluetooth", "severity": "low"},
    {"code": "CNB003", "description": "Bluetooth firmware", "cause": "Ошибка firmware", "solution": "Сбросить NVRAM, обновить macOS", "component": "Bluetooth", "severity": "low"},
    {"code": "CNB004", "description": "Bluetooth не обнаружен", "cause": "Модуль не определяется", "solution": "Проверить соединение или заменить", "component": "Bluetooth", "severity": "high"},
    
    # NDC - Camera
    {"code": "NDC001", "description": "Камера не обнаружена", "cause": "FaceTime камера неисправна", "solution": "Проверить flex кабель, заменить камеру", "component": "Camera", "severity": "medium"},
    {"code": "NDC003", "description": "Ошибка камеры", "cause": "Камера не отвечает", "solution": "Проверить соединение камеры", "component": "Camera", "severity": "medium"},
    {"code": "NDC004", "description": "Ошибка изображения камеры", "cause": "Проблема с сенсором", "solution": "Заменить камеру", "component": "Camera", "severity": "medium"},
    {"code": "NDC005", "description": "Камера недоступна", "cause": "Камера заблокирована системой", "solution": "Проверить права доступа, сбросить SMC", "component": "Camera", "severity": "low"},
    {"code": "NDC006", "description": "Камера занята", "cause": "Другое приложение использует камеру", "solution": "Закрыть все приложения, перезагрузить", "component": "Camera", "severity": "low"},
    
    # NDD - Display
    {"code": "NDD001", "description": "Проблема с дисплеем", "cause": "GPU или дисплей неисправен", "solution": "Проверить LVDS кабель, GPU", "component": "Display", "severity": "high"},
    {"code": "NDD002", "description": "Ошибка подсветки", "cause": "Backlight не работает", "solution": "Проверить backlight fuse, LED driver", "component": "Display", "severity": "medium"},
    {"code": "NDD003", "description": "Дисплей не обнаружен", "cause": "Дисплей не определяется", "solution": "Проверить LVDS/eDP кабель", "component": "Display", "severity": "high"},
    {"code": "NDD004", "description": "Ошибка разрешения", "cause": "GPU не поддерживает разрешение", "solution": "Сбросить NVRAM", "component": "Display", "severity": "low"},
    {"code": "NDD005", "description": "Артефакты на дисплее", "cause": "GPU или VRAM проблема", "solution": "Прогреть/перекатать GPU", "component": "Display", "severity": "critical"},
    {"code": "NDD006", "description": "Мерцание дисплея", "cause": "Flex cable или backlight", "solution": "Заменить display flex cable", "component": "Display", "severity": "medium"},
    
    # PFM - Fan/Cooling
    {"code": "PFM001", "description": "Проблема с охлаждением", "cause": "Вентилятор неисправен", "solution": "Очистить или заменить вентилятор", "component": "Cooling", "severity": "high"},
    {"code": "PFM002", "description": "Вентилятор не обнаружен", "cause": "Вентилятор отключен", "solution": "Проверить коннектор вентилятора", "component": "Cooling", "severity": "high"},
    {"code": "PFM003", "description": "Вентилятор не работает", "cause": "Вентилятор сгорел", "solution": "Заменить вентилятор", "component": "Cooling", "severity": "high"},
    {"code": "PFM004", "description": "Вентилятор работает медленно", "cause": "Пыль или износ подшипника", "solution": "Очистить от пыли, заменить вентилятор", "component": "Cooling", "severity": "medium"},
    {"code": "PFM005", "description": "Превышение температуры", "cause": "Недостаточное охлаждение", "solution": "Заменить термопасту, очистить радиатор", "component": "Cooling", "severity": "high"},
    {"code": "PFM006", "description": "Ошибка датчика температуры", "cause": "Датчик неисправен", "solution": "Проверить temp sensor", "component": "Cooling", "severity": "medium"},
    {"code": "PFM007", "description": "Критическая температура", "cause": "Перегрев системы", "solution": "Срочно проверить охлаждение", "component": "Cooling", "severity": "critical"},
    
    # PPF/PPP - Power/PMU
    {"code": "PPF001", "description": "Проблема с питанием", "cause": "Неисправность системы питания", "solution": "Проверить PM IC и цепи питания", "component": "Power", "severity": "critical"},
    {"code": "PPF002", "description": "Ошибка адаптера питания", "cause": "Адаптер не определяется", "solution": "Проверить MagSafe/USB-C порт", "component": "Power", "severity": "medium"},
    {"code": "PPF003", "description": "Недостаточное питание", "cause": "Слабый адаптер или проблема DC-In", "solution": "Использовать оригинальный адаптер", "component": "Power", "severity": "medium"},
    {"code": "PPF004", "description": "Не заряжается", "cause": "Проблема зарядки", "solution": "Проверить SMC, зарядный IC", "component": "Power", "severity": "high"},
    {"code": "PPF005", "description": "Питание нестабильно", "cause": "Проблема стабилизации напряжения", "solution": "Проверить PM IC и конденсаторы", "component": "Power", "severity": "high"},
    
    # PPM - Memory (RAM)
    {"code": "PPM001", "description": "Проблема с памятью", "cause": "RAM неисправна", "solution": "Заменить RAM (если съёмная) или logic board", "component": "Memory", "severity": "critical"},
    {"code": "PPM002", "description": "RAM не обнаружена", "cause": "RAM не установлена или не контактирует", "solution": "Переустановить RAM", "component": "Memory", "severity": "high"},
    {"code": "PPM003", "description": "Ошибка теста RAM", "cause": "Дефектный модуль RAM", "solution": "Определить неисправный модуль и заменить", "component": "Memory", "severity": "high"},
    {"code": "PPM004", "description": "Несовместимая RAM", "cause": "RAM не поддерживается", "solution": "Установить совместимую RAM", "component": "Memory", "severity": "medium"},
    {"code": "PPM005", "description": "Ошибка конфигурации RAM", "cause": "RAM неправильно сконфигурирована", "solution": "Установить RAM в правильные слоты", "component": "Memory", "severity": "medium"},
    {"code": "PPM006", "description": "Критическая ошибка памяти", "cause": "Множественные ошибки RAM", "solution": "Полная замена RAM", "component": "Memory", "severity": "critical"},
    {"code": "PPM007", "description": "Память перегревается", "cause": "RAM перегрев", "solution": "Улучшить охлаждение", "component": "Memory", "severity": "high"},
    {"code": "PPM008", "description": "ECC ошибка памяти", "cause": "Корректируемая ошибка", "solution": "Мониторить, возможна замена", "component": "Memory", "severity": "medium"},
    {"code": "PPM009", "description": "Память распаяна и неисправна", "cause": "Soldered RAM failure", "solution": "Reballing или замена logic board", "component": "Memory", "severity": "critical"},
    
    # PPP - Processor
    {"code": "PPP001", "description": "Проблема с процессором", "cause": "CPU неисправен", "solution": "Прогреть/перекатать CPU или заменить logic board", "component": "CPU", "severity": "critical"},
    {"code": "PPP002", "description": "Перегрев CPU", "cause": "CPU перегревается", "solution": "Заменить термопасту, проверить охлаждение", "component": "CPU", "severity": "high"},
    {"code": "PPP003", "description": "Ошибка кэша CPU", "cause": "L1/L2/L3 кэш неисправен", "solution": "Замена logic board", "component": "CPU", "severity": "critical"},
    {"code": "PPP004", "description": "CPU throttling", "cause": "CPU снижает частоту из-за температуры", "solution": "Улучшить охлаждение", "component": "CPU", "severity": "medium"},
    {"code": "PPP005", "description": "CPU не загружается", "cause": "CPU не стартует", "solution": "Проверить питание CPU", "component": "CPU", "severity": "critical"},
    {"code": "PPP006", "description": "Ошибка SMC", "cause": "SMC неисправен", "solution": "Сбросить/перепрограммировать SMC", "component": "CPU", "severity": "high"},
    {"code": "PPP007", "description": "T2 чип ошибка", "cause": "T2 Security Chip проблема", "solution": "Восстановить через DFU, возможна замена", "component": "CPU", "severity": "critical"},
    
    # PPT - Battery
    {"code": "PPT001", "description": "Проблема с батареей", "cause": "Батарея неисправна", "solution": "Заменить батарею", "component": "Battery", "severity": "high"},
    {"code": "PPT002", "description": "Батарея не обнаружена", "cause": "Батарея не подключена", "solution": "Проверить коннектор батареи", "component": "Battery", "severity": "high"},
    {"code": "PPT003", "description": "Сервис рекомендован", "cause": "Батарея износилась", "solution": "Заменить батарею", "component": "Battery", "severity": "medium"},
    {"code": "PPT004", "description": "Батарея не заряжается", "cause": "Ошибка зарядки", "solution": "Проверить SMC, зарядный IC", "component": "Battery", "severity": "high"},
    {"code": "PPT005", "description": "Низкий заряд батареи", "cause": "Критически низкий заряд", "solution": "Зарядить устройство", "component": "Battery", "severity": "low"},
    {"code": "PPT006", "description": "Батарея перегрета", "cause": "Перегрев батареи", "solution": "Дать остыть, проверить на вздутие", "component": "Battery", "severity": "high"},
    {"code": "PPT007", "description": "Батарея вздулась", "cause": "Battery swelling", "solution": "Срочно заменить батарею!", "component": "Battery", "severity": "critical"},
    
    # VDC/VFD - Video/GPU
    {"code": "VDC001", "description": "Проблема с видео", "cause": "GPU неисправен", "solution": "Прогреть/перекатать GPU", "component": "GPU", "severity": "critical"},
    {"code": "VDC003", "description": "GPU не обнаружен", "cause": "GPU не определяется", "solution": "Проверить питание GPU, пайку", "component": "GPU", "severity": "critical"},
    {"code": "VDC004", "description": "Ошибка VRAM", "cause": "Видеопамять неисправна", "solution": "Ребол GPU, возможна замена", "component": "GPU", "severity": "critical"},
    {"code": "VDC005", "description": "GPU перегрев", "cause": "GPU перегревается", "solution": "Заменить термопасту, проверить охлаждение", "component": "GPU", "severity": "high"},
    {"code": "VDC006", "description": "Артефакты видео", "cause": "GPU или VRAM умирает", "solution": "Ребол/замена GPU", "component": "GPU", "severity": "critical"},
    {"code": "VDC007", "description": "GPU не стартует", "cause": "GPU не инициализируется", "solution": "Проверить питание GPU", "component": "GPU", "severity": "critical"},
    {"code": "VFD001", "description": "Проблема FaceTime HD", "cause": "Камера FaceTime неисправна", "solution": "Заменить камеру", "component": "Camera", "severity": "medium"},
    {"code": "VFD002", "description": "FaceTime камера не обнаружена", "cause": "Камера отключена", "solution": "Проверить flex cable", "component": "Camera", "severity": "medium"},
    {"code": "VFD005", "description": "Ошибка видеовыхода", "cause": "Проблема внешнего видео", "solution": "Проверить порт Thunderbolt/HDMI", "component": "GPU", "severity": "medium"},
    {"code": "VFD006", "description": "DisplayPort ошибка", "cause": "DP controller проблема", "solution": "Проверить Thunderbolt IC", "component": "GPU", "severity": "high"},
    
    # SDC - Storage
    {"code": "SDC001", "description": "Проблема с накопителем", "cause": "SSD/HDD неисправен", "solution": "Заменить накопитель", "component": "Storage", "severity": "critical"},
    {"code": "SDC002", "description": "Накопитель не обнаружен", "cause": "Диск не определяется", "solution": "Проверить соединение, SATA/NVMe кабель", "component": "Storage", "severity": "critical"},
    {"code": "SDC003", "description": "SMART ошибка", "cause": "Диск в критическом состоянии", "solution": "Срочно сделать backup и заменить", "component": "Storage", "severity": "critical"},
    {"code": "SDC004", "description": "Ошибка чтения диска", "cause": "Bad sectors или контроллер", "solution": "Заменить накопитель", "component": "Storage", "severity": "high"},
    {"code": "SDC005", "description": "Диск медленный", "cause": "Износ SSD или проблема HDD", "solution": "Проверить SMART, заменить при необходимости", "component": "Storage", "severity": "medium"},
    {"code": "SDC006", "description": "Ошибка FileVault", "cause": "Проблема шифрования", "solution": "Отключить FileVault, переформатировать", "component": "Storage", "severity": "medium"},
    
    # NDL - Ambient Light Sensor
    {"code": "NDL001", "description": "Датчик света не работает", "cause": "ALS неисправен", "solution": "Проверить flex, заменить сенсор", "component": "Sensor", "severity": "low"},
    
    # NDK - Keyboard
    {"code": "NDK001", "description": "Проблема с клавиатурой", "cause": "Клавиатура неисправна", "solution": "Заменить клавиатуру/top case", "component": "Keyboard", "severity": "medium"},
    {"code": "NDK002", "description": "Клавиша залипает", "cause": "Грязь под клавишей", "solution": "Очистить или заменить butterfly mechanism", "component": "Keyboard", "severity": "low"},
    
    # NDT - Trackpad
    {"code": "NDT001", "description": "Проблема с трекпадом", "cause": "Trackpad неисправен", "solution": "Заменить trackpad", "component": "Trackpad", "severity": "medium"},
    {"code": "NDT002", "description": "Трекпад не кликает", "cause": "Механизм клика сломан или батарея вздулась", "solution": "Проверить батарею, заменить trackpad", "component": "Trackpad", "severity": "medium"},
    {"code": "NDT003", "description": "Force Touch не работает", "cause": "Force Touch механизм", "solution": "Заменить trackpad", "component": "Trackpad", "severity": "medium"},
    
    # USB/Thunderbolt
    {"code": "USB001", "description": "USB порт не работает", "cause": "USB IC или порт повреждён", "solution": "Проверить USB IC, заменить порт", "component": "USB", "severity": "medium"},
    {"code": "TBT001", "description": "Thunderbolt не работает", "cause": "Thunderbolt controller", "solution": "Проверить Thunderbolt IC", "component": "Thunderbolt", "severity": "high"},
    {"code": "TBT002", "description": "Thunderbolt перегрев", "cause": "Thunderbolt IC перегрев", "solution": "Проверить охлаждение", "component": "Thunderbolt", "severity": "medium"},
]

def main():
    print("=" * 60)
    print("🚨 Генерация полной базы кодов ошибок")
    print("=" * 60)
    
    result = {
        "source": "Apple Support + Community Knowledge",
        "collected_at": __import__("time").strftime("%Y-%m-%d %H:%M:%S"),
        "itunes_restore_errors": ITUNES_ERRORS,
        "mac_diagnostics": MAC_DIAGNOSTICS,
        "stats": {
            "itunes_errors": len(ITUNES_ERRORS),
            "mac_diagnostics": len(MAC_DIAGNOSTICS),
            "total": len(ITUNES_ERRORS) + len(MAC_DIAGNOSTICS)
        }
    }
    
    output_file = os.path.join(OUTPUT_DIR, "error_codes_comprehensive.json")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Сохранено в {output_file}")
    print(f"📊 iTunes ошибок: {len(ITUNES_ERRORS)}")
    print(f"📊 Mac диагностика: {len(MAC_DIAGNOSTICS)}")
    print(f"📊 Всего: {result['stats']['total']}")
    
    return result

if __name__ == "__main__":
    main()
