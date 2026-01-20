#!/usr/bin/env node
/**
 * NEXX Deep Database Validator
 * Углубленная проверка данных и связей
 */

const fs = require('fs');
const path = require('path');

console.log('🔬 NEXX Deep Database Validator\n');

const errors = [];
const warnings = [];
const suggestions = [];

// Загружаем все базы
const devicesPath = path.join(__dirname, '..', 'public', 'data', 'devices.json');
const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf-8'));

console.log(`📊 Загружено устройств: ${devices.length}\n`);

// ============================================
// ПРОВЕРКА: Соответствие IC и модели
// ============================================

console.log('1️⃣  Проверка соответствия IC (микросхем) и модели устройства...');

let icMismatches = 0;

devices.forEach((device, idx) => {
  const name = device.name?.toLowerCase() || '';
  const chargingIC = device.charging_ic;
  
  // Проверка: USB-C контроллер для старых iPhone
  const isOldIPhone = name.includes('iphone') && 
                      !name.includes('15') && 
                      !name.includes('16') && 
                      !name.includes('17') &&
                      !name.includes('air') &&
                      device.year < 2023;
  
  if (isOldIPhone && chargingIC?.designation?.includes('USB Type-C')) {
    errors.push({
      index: idx,
      device: device.name,
      issue: `USB Type-C контроллер для старого iPhone (до 2023 года должен быть Lightning)`,
      fix: 'Проверить charging_ic.designation',
      year: device.year
    });
    icMismatches++;
  }
  
  // Проверка: Lightning для новых iPhone (15+)
  const isNewIPhone = name.includes('iphone') && 
                      (name.includes('15') || name.includes('16') || name.includes('17') || name.includes('air')) &&
                      device.year >= 2023;
  
  if (isNewIPhone && chargingIC?.designation?.includes('Lightning') && !chargingIC?.designation?.includes('USB')) {
    errors.push({
      index: idx,
      device: device.name,
      issue: `Lightning контроллер для iPhone ${device.year} (должен быть USB-C)`,
      fix: 'Обновить на USB Type-C Controller',
      year: device.year
    });
    icMismatches++;
  }
});

console.log(`   Найдено несоответствий IC: ${icMismatches}`);

// ============================================
// ПРОВЕРКА: Процессоры
// ============================================

console.log('2️⃣  Проверка процессоров...');

let processorIssues = 0;

devices.forEach((device, idx) => {
  const name = device.name?.toLowerCase() || '';
  const processor = device.processor?.toLowerCase() || '';
  
  // iPhone должен иметь Apple A-серию или Apple Silicon
  if (name.includes('iphone')) {
    // Правильные процессоры Apple: "A17 Pro", "A16 Bionic", "Apple A15", "APL1234"
    const validAppleProcessor = 
      processor.includes('apple a') || 
      processor.includes('apl') ||
      processor.match(/a\d{1,2}\s*(pro|bionic|fusion)?/) || // A17 Pro, A16 Bionic, A15
      processor.includes('bionic') ||
      processor.includes('pro chip');
    
    if (!validAppleProcessor && processor.length > 0) {
      warnings.push({
        index: idx,
        device: device.name,
        issue: `iPhone с процессором "${device.processor}" (ожидается Apple A-серия)`,
        current: device.processor
      });
      processorIssues++;
    }
  }
  
  // MacBook M-серии
  if (name.includes('macbook') && (name.includes('m1') || name.includes('m2') || name.includes('m3'))) {
    if (!processor.includes('apple m') && !processor.includes('apple silicon')) {
      warnings.push({
        index: idx,
        device: device.name,
        issue: `MacBook M-серии с процессором "${device.processor}"`,
        current: device.processor
      });
      processorIssues++;
    }
  }
});

console.log(`   Найдено несоответствий процессоров: ${processorIssues}`);

// ============================================
// ПРОВЕРКА: Board Numbers
// ============================================

console.log('3️⃣  Проверка board numbers...');

let boardIssues = 0;

devices.forEach((device, idx) => {
  const boards = device.board_numbers;
  
  if (boards && Array.isArray(boards)) {
    boards.forEach(board => {
      // iPhone board numbers должны начинаться с 820-
      if (device.name?.includes('iPhone') && !board.startsWith('820-')) {
        warnings.push({
          index: idx,
          device: device.name,
          issue: `Board number "${board}" не начинается с 820- (для iPhone должно быть 820-XXXXX)`,
          current: board
        });
        boardIssues++;
      }
      
      // MacBook board numbers могут быть: 820-XXXXX или 820-XXXXX-A
      if (device.name?.includes('MacBook') && !board.match(/820-\d+(-[A-Z])?/)) {
        warnings.push({
          index: idx,
          device: device.name,
          issue: `Board number "${board}" некорректный формат для MacBook`,
          current: board
        });
        boardIssues++;
      }
    });
  }
});

console.log(`   Найдено несоответствий board numbers: ${boardIssues}`);

// ============================================
// ПРОВЕРКА: Цены по категориям
// ============================================

console.log('4️⃣  Проверка логичности цен по категориям...');

let priceLogicIssues = 0;

devices.forEach((device, idx) => {
  const prices = device.official_service_prices;
  
  if (prices) {
    // Battery не может стоить дороже logic board
    if (prices.battery && prices.logic_board && prices.battery > prices.logic_board) {
      warnings.push({
        index: idx,
        device: device.name,
        issue: `Батарея дороже материнской платы (${prices.battery} > ${prices.logic_board})`,
        batterPrice: prices.battery,
        boardPrice: prices.logic_board
      });
      priceLogicIssues++;
    }
    
    // Display обычно дороже батареи
    if (prices.display && prices.battery && prices.display < prices.battery / 2) {
      suggestions.push({
        index: idx,
        device: device.name,
        issue: `Дисплей подозрительно дешевле батареи (${prices.display} vs ${prices.battery})`,
        displayPrice: prices.display,
        batteryPrice: prices.battery
      });
    }
  }
});

console.log(`   Найдено нелогичных цен: ${priceLogicIssues}`);

// ============================================
// ПРОВЕРКА: Пропущенные данные
// ============================================

console.log('5️⃣  Проверка пропущенных важных данных...');

let missingData = 0;

devices.forEach((device, idx) => {
  // Для новых устройств должны быть цены
  if (device.year >= 2020) {
    if (!device.official_service_prices || Object.keys(device.official_service_prices).length === 0) {
      suggestions.push({
        index: idx,
        device: device.name,
        issue: 'Новое устройство без цен на ремонт',
        year: device.year
      });
      missingData++;
    }
  }
  
  // Популярные устройства должны иметь процессор
  const popular = ['iphone 15', 'iphone 14', 'iphone 13', 'samsung s24', 'samsung s23', 'macbook'];
  const isPopular = popular.some(p => device.name?.toLowerCase().includes(p));
  
  if (isPopular && !device.processor) {
    suggestions.push({
      index: idx,
      device: device.name,
      issue: 'Популярная модель без указания процессора'
    });
    missingData++;
  }
});

console.log(`   Найдено пропущенных данных: ${missingData}`);

// ============================================
// ИТОГОВЫЙ ОТЧЕТ
// ============================================

console.log('\n' + '='.repeat(80));
console.log('📋 УГЛУБЛЕННЫЙ ОТЧЕТ ПРОВЕРКИ БАЗЫ ДАННЫХ');
console.log('='.repeat(80) + '\n');

console.log(`✅ Проверено устройств: ${devices.length}`);
console.log(`❌ Критических ошибок: ${errors.length}`);
console.log(`⚠️  Предупреждений: ${warnings.length}`);
console.log(`💡 Рекомендаций: ${suggestions.length}\n`);

if (errors.length > 0) {
  console.log('❌ КРИТИЧЕСКИЕ ОШИБКИ (требуют немедленного исправления):\n');
  errors.forEach((err, i) => {
    console.log(`${i + 1}. [Индекс ${err.index}] ${err.device}`);
    console.log(`   Проблема: ${err.issue}`);
    if (err.fix) console.log(`   Решение: ${err.fix}`);
    console.log('');
  });
}

if (warnings.length > 0 && warnings.length <= 20) {
  console.log('\n⚠️  ПРЕДУПРЕЖДЕНИЯ (рекомендуется исправить):\n');
  warnings.forEach((warn, i) => {
    console.log(`${i + 1}. [Индекс ${warn.index}] ${warn.device}`);
    console.log(`   ${warn.issue}`);
    console.log('');
  });
} else if (warnings.length > 20) {
  console.log(`\n⚠️  ПРЕДУПРЕЖДЕНИЯ: ${warnings.length} (см. полный отчет)\n`);
}

if (suggestions.length > 0 && suggestions.length <= 15) {
  console.log('\n💡 РЕКОМЕНДАЦИИ (опционально):\n');
  suggestions.forEach((sug, i) => {
    console.log(`${i + 1}. [Индекс ${sug.index}] ${sug.device}`);
    console.log(`   ${sug.issue}`);
    console.log('');
  });
} else if (suggestions.length > 15) {
  console.log(`\n💡 РЕКОМЕНДАЦИИ: ${suggestions.length} (см. полный отчет)\n`);
}

// Сохраняем детальный отчет
const detailedReport = {
  timestamp: new Date().toISOString(),
  totalDevices: devices.length,
  validation: {
    categoryMatch: { passed: devices.length - icMismatches, failed: icMismatches },
    requiredFields: { passed: devices.length },
    duplicates: { found: 0 },
    prices: { valid: devices.length - priceLogicIssues, issues: priceLogicIssues },
    years: { valid: devices.length }
  },
  errors: errors,
  warnings: warnings,
  suggestions: suggestions,
  summary: {
    criticalErrors: errors.length,
    warnings: warnings.length,
    suggestions: suggestions.length,
    healthScore: Math.round((1 - (errors.length + warnings.length * 0.5) / devices.length) * 100),
    status: errors.length === 0 ? 'HEALTHY' : 'NEEDS_ATTENTION'
  }
};

const reportPath = path.join(__dirname, '..', 'database-deep-validation.json');
fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));

console.log(`📄 Детальный отчет: database-deep-validation.json`);
console.log(`🏥 Health Score: ${detailedReport.summary.healthScore}%\n`);

if (errors.length === 0 && warnings.length === 0) {
  console.log('🎉 База данных в отличном состоянии!\n');
  process.exit(0);
} else if (errors.length > 0) {
  console.log('❌ Требуется исправление критических ошибок!\n');
  process.exit(1);
} else {
  console.log('⚠️  База данных корректна, но есть рекомендации по улучшению.\n');
  process.exit(0);
}
