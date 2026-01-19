#!/usr/bin/env python3
"""
NEXX Database Validator
Проверка целостности и корректности базы данных
"""

import json
import os
from typing import Dict, List, Set
from datetime import datetime

class NEXXDatabaseValidator:
    """Валидатор для проверки целостности базы данных NEXX"""
    
    def __init__(self, base_path: str = './public/data'):
        self.base_path = base_path
        self.errors = []
        self.warnings = []
        self.stats = {}
        
    def validate_all(self):
        """Полная валидация всей базы данных"""
        print("🔍 Начало валидации базы данных NEXX...")
        
        self.validate_devices()
        self.validate_ics()
        self.validate_error_codes()
        self.validate_key_combinations()
        
        self.print_report()
        
    def validate_devices(self):
        """Проверка устройств на корректность данных"""
        devices_path = f"{self.base_path}/devices_enhanced.json"
        
        if not os.path.exists(devices_path):
            self.errors.append({
                'type': 'MISSING_FILE',
                'file': devices_path
            })
            return
        
        with open(devices_path, 'r', encoding='utf-8') as f:
            devices = json.load(f)
        
        board_numbers = set()
        processors = set()
        categories = set()
        with_images = 0
        
        for idx, device in enumerate(devices):
            # Проверка обязательных полей
            required_fields = ['name', 'category']
            for field in required_fields:
                if field not in device or not device[field]:
                    self.errors.append({
                        'type': 'MISSING_FIELD',
                        'device': device.get('name', f'Index {idx}'),
                        'field': field
                    })
            
            # Сбор статистики
            if 'board_number' in device and device['board_number']:
                board_numbers.add(device['board_number'])
            
            if 'board_numbers' in device and device['board_numbers']:
                for bn in device['board_numbers']:
                    if bn and bn != 'TBD':
                        board_numbers.add(bn)
            
            if 'processor' in device and device['processor']:
                processors.add(device['processor'])
            
            if 'category' in device:
                categories.add(device['category'])
            
            # Проверка изображений
            if (device.get('icon_url') or device.get('ifixit_image')):
                with_images += 1
            
            # Проверка года
            if 'year' in device:
                year = device['year']
                if year < 2013 or year > 2026:
                    self.warnings.append({
                        'type': 'SUSPICIOUS_YEAR',
                        'device': device.get('name'),
                        'year': year
                    })
            
            # Проверка board numbers на формат
            if 'board_number' in device and device['board_number']:
                bn = device['board_number']
                if bn != 'TBD' and not bn.startswith('820-'):
                    self.warnings.append({
                        'type': 'INVALID_BOARD_FORMAT',
                        'device': device.get('name'),
                        'board': bn
                    })
        
        self.stats['devices'] = {
            'total': len(devices),
            'categories': list(categories),
            'unique_boards': len(board_numbers),
            'processors': len(processors),
            'with_images': with_images,
            'image_coverage': f"{(with_images/len(devices)*100):.1f}%"
        }
    
    def validate_ics(self):
        """Проверка базы микросхем"""
        # Try multiple possible filenames
        possible_files = [
            "ic_data_expanded.json",
            "ic_comprehensive.json", 
            "advanced_ic_database.json"
        ]
        
        ics_path = None
        for filename in possible_files:
            path = f"{self.base_path}/{filename}"
            if os.path.exists(path):
                ics_path = path
                break
        
        if not ics_path:
            self.errors.append({
                'type': 'MISSING_FILE',
                'file': 'IC database (tried: ic_data_expanded.json, ic_comprehensive.json, advanced_ic_database.json)'
            })
            return
        
        with open(ics_path, 'r', encoding='utf-8') as f:
            ics_data = json.load(f)
        
        categories = set()
        manufacturers = set()
        
        for part_number, ic in ics_data.items():
            # Проверка обязательных полей
            if 'name' not in ic or not ic['name']:
                self.warnings.append({
                    'type': 'MISSING_NAME',
                    'part_number': part_number
                })
            
            if 'category' in ic and ic['category']:
                categories.add(ic['category'])
            
            if 'manufacturer' in ic and ic['manufacturer']:
                manufacturers.add(ic['manufacturer'])
        
        self.stats['ics'] = {
            'total': len(ics_data),
            'categories': len(categories),
            'manufacturers': len(manufacturers)
        }
    
    def validate_error_codes(self):
        """Проверка кодов ошибок"""
        # Try multiple possible filenames
        possible_files = [
            "error_codes_merged.json",
            "error_codes.json",
            "error_codes_comprehensive.json"
        ]
        
        errors_path = None
        for filename in possible_files:
            path = f"{self.base_path}/{filename}"
            if os.path.exists(path):
                errors_path = path
                break
        
        if not errors_path:
            self.errors.append({
                'type': 'MISSING_FILE',
                'file': 'Error codes database (tried: error_codes_merged.json, error_codes.json, error_codes_comprehensive.json)'
            })
            return
        
        with open(errors_path, 'r', encoding='utf-8') as f:
            errors_data = json.load(f)
        
        codes_seen = set()
        duplicates = []
        missing_solutions = 0
        
        for code, error in errors_data.items():
            if code in codes_seen:
                duplicates.append(code)
            codes_seen.add(code)
            
            # Проверка обязательных полей
            if 'description' not in error or not error['description']:
                self.warnings.append({
                    'type': 'MISSING_DESCRIPTION',
                    'code': code
                })
            
            if 'solution' not in error or not error['solution']:
                missing_solutions += 1
        
        self.stats['error_codes'] = {
            'total': len(errors_data),
            'duplicates': len(duplicates),
            'missing_solutions': missing_solutions
        }
    
    def validate_key_combinations(self):
        """Проверка DFU/Recovery комбинаций"""
        kb_path = f"{self.base_path}/key_combinations.json"
        
        if not os.path.exists(kb_path):
            self.errors.append({
                'type': 'MISSING_FILE',
                'file': kb_path
            })
            return
        
        with open(kb_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        categories = ['iphone', 'ipad', 'mac', 'watch']
        missing_categories = []
        
        for category in categories:
            if category not in data:
                missing_categories.append(category)
        
        self.stats['key_combinations'] = {
            'categories': len([c for c in categories if c in data]),
            'missing': missing_categories
        }
    
    def print_report(self):
        """Вывод отчета валидации"""
        print("\n" + "="*60)
        print("📊 ОТЧЕТ ВАЛИДАЦИИ БАЗЫ ДАННЫХ NEXX")
        print("="*60)
        
        print(f"\n📈 СТАТИСТИКА:")
        for category, stats in self.stats.items():
            print(f"\n  {category.upper()}:")
            for key, value in stats.items():
                if isinstance(value, list) and len(value) > 5:
                    print(f"    - {key}: {len(value)} items")
                else:
                    print(f"    - {key}: {value}")
        
        print(f"\n🔴 ОШИБКИ ({len(self.errors)}):")
        if not self.errors:
            print("  ✅ Ошибок не найдено!")
        else:
            for error in self.errors[:10]:  # Показать первые 10
                print(f"  - {error}")
        
        print(f"\n🟡 ПРЕДУПРЕЖДЕНИЯ ({len(self.warnings)}):")
        if not self.warnings:
            print("  ✅ Предупреждений нет!")
        else:
            for warning in self.warnings[:10]:
                print(f"  - {warning}")
        
        print("\n" + "="*60)
        
        # Итоговая оценка
        if len(self.errors) == 0 and len(self.warnings) < 5:
            print("✅ СТАТУС: База данных в отличном состоянии!")
        elif len(self.errors) == 0:
            print("🟡 СТАТУС: База данных в хорошем состоянии (есть предупреждения)")
        else:
            print("🔴 СТАТУС: Требуется исправление критических ошибок")
        
        print("="*60 + "\n")

# Запуск
if __name__ == "__main__":
    validator = NEXXDatabaseValidator()
    validator.validate_all()
