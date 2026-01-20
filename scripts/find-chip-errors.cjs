#!/usr/bin/env node
/**
 * NEXX Chip Validator - Поиск несоответствий чипов и устройств
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ПОИСК НЕСООТВЕТСТВИЙ ЧИПОВ\n');

const errors = [];

// Загружаем devices.json
const devicesPath = path.join(__dirname, '..', 'public', 'data', 'devices.json');
const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf-8'));

console.log(`📊 Проверяю ${devices.length} устройств...\n`);

// ============================================
// ПРОВЕРКА: Года чипов vs года устройств
// ============================================

console.log('1️⃣  Проверка годов чипов...');

devices.forEach((device, idx) => {
  const deviceYear = device.year;
  const processor = device.processor || '';
  
  // Извлекаем год из процессора если есть
  const processorYearMatch = processor.match(/\(.*(\d{4}).*\)/);
  if (processorYearMatch) {
    const chipYear = parseInt(processorYearMatch[1]);
    
    // Чип не может быть новее устройства более чем на 1 год
    if (chipYear > deviceYear + 1) {
      errors.push({
        index: idx,
        device: device.name,
        deviceYear: deviceYear,
        chipYear: chipYear,
        processor: processor,
        issue: `Чип ${chipYear} года для устройства ${deviceYear} года (анахронизм)`
      });
    }
    
    // Чип не может быть старее устройства более чем на 3 года
    if (chipYear < deviceYear - 3 && deviceYear > 2015) {
      errors.push({
        index: idx,
        device: device.name,
        deviceYear: deviceYear,
        chipYear: chipYear,
        processor: processor,
        issue: `Слишком старый чип (${chipYear}) для устройства ${deviceYear} года`
      });
    }
  }
});

console.log(`   Найдено анахронизмов чипов: ${errors.filter(e => e.issue.includes('анахронизм') || e.issue.includes('старый чип')).length}`);

// ============================================
// ПРОВЕРКА: Процессоры и модели
// ============================================

console.log('2️⃣  Проверка соответствия процессоров моделям...');

const knownProcessors = {
  // iPhone процессоры по годам
  'A18 Pro': { year: 2024, devices: ['iPhone 16 Pro', 'iPhone 16 Pro Max'] },
  'A18': { year: 2024, devices: ['iPhone 16', 'iPhone 16 Plus'] },
  'A17 Pro': { year: 2023, devices: ['iPhone 15 Pro', 'iPhone 15 Pro Max'] },
  'A16 Bionic': { year: 2022, devices: ['iPhone 14 Pro', 'iPhone 14 Pro Max', 'iPhone 15', 'iPhone 15 Plus'] },
  'A15 Bionic': { year: 2021, devices: ['iPhone 13', 'iPhone 14', 'iPhone SE 2022'] },
  'A14 Bionic': { year: 2020, devices: ['iPhone 12'] },
  'A13 Bionic': { year: 2019, devices: ['iPhone 11'] },
  'A12 Bionic': { year: 2018, devices: ['iPhone XS', 'iPhone XR'] },
  
  // MacBook
  'Apple M3': { year: 2023, devices: ['MacBook Pro 14', 'MacBook Pro 16', 'MacBook Air 13', 'MacBook Air 15'] },
  'Apple M2': { year: 2022, devices: ['MacBook Pro', 'MacBook Air'] },
  'Apple M1': { year: 2020, devices: ['MacBook Pro', 'MacBook Air'] }
};

devices.forEach((device, idx) => {
  const processor = device.processor || '';
  const name = device.name || '';
  
  Object.entries(knownProcessors).forEach(([chipName, chipInfo]) => {
    // Если процессор содержит известный чип
    if (processor.includes(chipName)) {
      // Проверяем соответствие устройству
      const matchesAnyDevice = chipInfo.devices.some(validDevice => 
        name.includes(validDevice)
      );
      
      if (!matchesAnyDevice) {
        errors.push({
          index: idx,
          device: name,
          processor: processor,
          expectedDevices: chipInfo.devices.join(', '),
          issue: `Процессор "${chipName}" обычно для: ${chipInfo.devices.join(', ')}, но найден в "${name}"`
        });
      }
    }
  });
});

console.log(`   Найдено несоответствий процессоров: ${errors.filter(e => e.expectedDevices).length}`);

// ============================================
// ПРОВЕРКА: Одинаковые charging IC для разных устройств
// ============================================

console.log('3️⃣  Проверка уникальности charging IC...');

const icMap = new Map();

devices.forEach((device, idx) => {
  const icMain = device.charging_ic?.main;
  if (icMain) {
    if (!icMap.has(icMain)) {
      icMap.set(icMain, []);
    }
    icMap.set(icMain, [...icMap.get(icMain), { index: idx, device: device.name, year: device.year }]);
  }
});

// Проверяем подозрительные дубликаты
icMap.forEach((deviceList, ic) => {
  if (deviceList.length > 10) {
    // Один IC для более чем 10 устройств - подозрительно
    const years = deviceList.map(d => d.year).filter(y => y);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    if (maxYear - minYear > 5) {
      errors.push({
        ic: ic,
        devices: deviceList.map(d => d.device).slice(0, 5).join(', ') + '...',
        deviceCount: deviceList.length,
        yearRange: `${minYear}-${maxYear}`,
        issue: `IC "${ic}" используется в ${deviceList.length} устройствах за ${maxYear - minYear} лет (${minYear}-${maxYear}) - подозрительно`
      });
    }
  }
});

console.log(`   Найдено подозрительных IC: ${errors.filter(e => e.ic).length}`);

// ============================================
// ИТОГОВЫЙ ОТЧЕТ
// ============================================

console.log('\n' + '='.repeat(80));
console.log('🔬 ОТЧЕТ: ПОИСК НЕСООТВЕТСТВИЙ ЧИПОВ');
console.log('='.repeat(80) + '\n');

console.log(`✅ Проверено устройств: ${devices.length}`);
console.log(`❌ Найдено несоответствий: ${errors.length}\n`);

if (errors.length > 0) {
  console.log('❌ НЕСООТВЕТСТВИЯ:\n');
  errors.slice(0, 30).forEach((err, i) => {
    console.log(`${i + 1}. ${err.device || err.ic}`);
    console.log(`   ${err.issue}`);
    if (err.processor) console.log(`   Процессор: ${err.processor}`);
    if (err.expectedDevices) console.log(`   Ожидается для: ${err.expectedDevices}`);
    if (err.yearRange) console.log(`   Диапазон: ${err.yearRange}`);
    console.log('');
  });
  
  if (errors.length > 30) {
    console.log(`... и еще ${errors.length - 30} несоответствий\n`);
  }
}

// Сохраняем отчет
const report = {
  timestamp: new Date().toISOString(),
  totalDevices: devices.length,
  errors: errors,
  summary: {
    totalIssues: errors.length,
    chipAnomалies: errors.filter(e => e.chipYear).length,
    processorMismatches: errors.filter(e => e.expectedDevices).length,
    suspiciousICs: errors.filter(e => e.ic).length,
    status: errors.length === 0 ? 'CLEAN' : 'ISSUES_FOUND'
  }
};

fs.writeFileSync(
  path.join(__dirname, '..', 'chip-validation-report.json'),
  JSON.stringify(report, null, 2)
);

console.log(`📄 Отчет сохранен: chip-validation-report.json\n`);

if (errors.length === 0) {
  console.log('🎉 Чипы соответствуют устройствам!\n');
  process.exit(0);
} else {
  console.log(`⚠️  Найдено ${errors.length} несоответствий - рекомендуется проверка!\n`);
  process.exit(0);
}
