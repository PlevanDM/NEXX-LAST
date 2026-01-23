#!/usr/bin/env node
/**
 * NEXX Database Validator
 * Проверяет целостность и корректность данных в базе
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 NEXX Database Validator\n');

const errors = [];
const warnings = [];

// Загружаем master-db.json
const dbPath = path.join(__dirname, '..', 'public', 'data', 'master-db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const devices = db.devices || [];

console.log(`📊 Загружено устройств: ${devices.length}\n`);

// ============================================
// ПРОВЕРКА 1: Соответствие имени и категории
// ============================================

console.log('1️⃣  Проверка соответствия имени и категории...');

devices.forEach((device, idx) => {
  const name = device.name?.toLowerCase() || '';
  const category = device.category?.toLowerCase() || '';
  
  // iPhone должен быть в категории iPhone
  if (name.includes('iphone') && !category.includes('iphone')) {
    errors.push({
      index: idx,
      device: device.name,
      issue: `iPhone в категории "${device.category}" (должно быть "iPhone")`
    });
  }
  
  // Samsung должен быть в категории Samsung (или Watch/Tablet если применимо)
  if (name.includes('samsung') && !category.includes('samsung') && !category.includes('watch') && !category.includes('tablet')) {
    errors.push({
      index: idx,
      device: device.name,
      issue: `Samsung в категории "${device.category}" (должно быть "Samsung", "Galaxy", "Watch" или "Tablet")`
    });
  }
  
  // MacBook должен быть в категории MacBook
  if (name.includes('macbook') && !category.includes('macbook')) {
    errors.push({
      index: idx,
      device: device.name,
      issue: `MacBook в категории "${device.category}" (должно быть "MacBook")`
    });
  }
  
  // iPad должен быть в категории iPad
  if (name.includes('ipad') && !category.includes('ipad')) {
    errors.push({
      index: idx,
      device: device.name,
      issue: `iPad в категории "${device.category}" (должно быть "iPad")`
    });
  }
});

console.log(`   Найдено ошибок категорий: ${errors.filter(e => e.issue.includes('категории')).length}`);

// ============================================
// ПРОВЕРКА 2: Обязательные поля
// ============================================

console.log('2️⃣  Проверка обязательных полей...');

const requiredFields = ['name', 'category'];

devices.forEach((device, idx) => {
  requiredFields.forEach(field => {
    if (!device[field]) {
      errors.push({
        index: idx,
        device: device.name || `Device #${idx}`,
        issue: `Отсутствует обязательное поле: ${field}`
      });
    }
  });
  
  // Проверка пустых названий
  if (device.name && device.name.trim() === '') {
    errors.push({
      index: idx,
      device: `Device #${idx}`,
      issue: 'Пустое название устройства'
    });
  }
});

console.log(`   Найдено ошибок полей: ${errors.filter(e => e.issue.includes('поле') || e.issue.includes('название')).length}`);

// ============================================
// ПРОВЕРКА 3: Дубликаты
// ============================================

console.log('3️⃣  Проверка дубликатов...');

const nameMap = new Map();

devices.forEach((device, idx) => {
  const name = device.name;
  if (nameMap.has(name)) {
    warnings.push({
      index: idx,
      device: name,
      issue: `Дубликат устройства (первый раз на индексе ${nameMap.get(name)})`
    });
  } else {
    nameMap.set(name, idx);
  }
});

console.log(`   Найдено дубликатов: ${warnings.filter(w => w.issue.includes('Дубликат')).length}`);

// ============================================
// ПРОВЕРКА 4: Корректность цен
// ============================================

console.log('4️⃣  Проверка цен...');

devices.forEach((device, idx) => {
  const prices = device.official_service_prices;
  
  if (prices) {
    // Проверка отрицательных цен
    Object.entries(prices).forEach(([key, value]) => {
      if (typeof value === 'number' && value < 0) {
        errors.push({
          index: idx,
          device: device.name,
          issue: `Отрицательная цена для ${key}: ${value}`
        });
      }
      
      // Проверка нереально высоких цен
      if (typeof value === 'number' && value > 10000) {
        warnings.push({
          index: idx,
          device: device.name,
          issue: `Подозрительно высокая цена для ${key}: ${value}`
        });
      }
    });
  }
});

console.log(`   Найдено ошибок цен: ${errors.filter(e => e.issue.includes('цена')).length}`);

// ============================================
// ПРОВЕРКА 5: Года выпуска
// ============================================

console.log('5️⃣  Проверка годов выпуска...');

devices.forEach((device, idx) => {
  if (device.year) {
    // Проверка года в будущем
    if (device.year > 2026) {
      errors.push({
        index: idx,
        device: device.name,
        issue: `Год в будущем: ${device.year}`
      });
    }
    
    // Проверка слишком старого года
    if (device.year < 2000) {
      warnings.push({
        index: idx,
        device: device.name,
        issue: `Очень старое устройство: ${device.year}`
      });
    }
  }
});

console.log(`   Найдено ошибок годов: ${errors.filter(e => e.issue.includes('Год')).length}`);

// ============================================
// ИТОГОВЫЙ ОТЧЕТ
// ============================================

console.log('\n' + '='.repeat(60));
console.log('📋 ИТОГОВЫЙ ОТЧЕТ');
console.log('='.repeat(60) + '\n');

console.log(`✅ Проверено устройств: ${devices.length}`);
console.log(`❌ Критических ошибок: ${errors.length}`);
console.log(`⚠️  Предупреждений: ${warnings.length}\n`);

if (errors.length > 0) {
  console.log('❌ КРИТИЧЕСКИЕ ОШИБКИ:\n');
  errors.slice(0, 20).forEach((err, i) => {
    console.log(`${i + 1}. [${err.index}] ${err.device}`);
    console.log(`   └─ ${err.issue}\n`);
  });
  
  if (errors.length > 20) {
    console.log(`... и еще ${errors.length - 20} ошибок\n`);
  }
}

if (warnings.length > 0) {
  console.log('\n⚠️  ПРЕДУПРЕЖДЕНИЯ:\n');
  warnings.slice(0, 10).forEach((warn, i) => {
    console.log(`${i + 1}. [${warn.index}] ${warn.device}`);
    console.log(`   └─ ${warn.issue}\n`);
  });
  
  if (warnings.length > 10) {
    console.log(`... и еще ${warnings.length - 10} предупреждений\n`);
  }
}

// Сохраняем отчет
const report = {
  timestamp: new Date().toISOString(),
  totalDevices: devices.length,
  errors: errors,
  warnings: warnings,
  summary: {
    criticalErrors: errors.length,
    warnings: warnings.length,
    status: errors.length === 0 ? 'PASS' : 'FAIL'
  }
};

const reportPath = path.join(__dirname, '..', 'database-validation-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\n📄 Полный отчет сохранен: database-validation-report.json\n`);

if (errors.length === 0) {
  console.log('🎉 База данных корректна!\n');
  process.exit(0);
} else {
  console.log('❌ Найдены критические ошибки! Требуется исправление.\n');
  process.exit(1);
}
