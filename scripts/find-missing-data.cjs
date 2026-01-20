#!/usr/bin/env node
/**
 * Поиск пропущенных данных в базе
 */

const fs = require('fs');
const path = require('path');

const devicesPath = path.join(__dirname, '..', 'public', 'data', 'devices.json');
const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf-8'));

console.log('🔍 Поиск пропущенных данных\n');

const missing = {
  processor: [],
  charging_ic: [],
  board_numbers: [],
  prices: [],
  year: []
};

devices.forEach((device, idx) => {
  const isPopular = device.year >= 2020;
  
  // Процессор
  if (!device.processor && isPopular) {
    missing.processor.push({ idx, name: device.name, year: device.year });
  }
  
  // Charging IC
  if (!device.charging_ic && isPopular) {
    missing.charging_ic.push({ idx, name: device.name, year: device.year });
  }
  
  // Board numbers
  if (!device.board_numbers || device.board_numbers.length === 0) {
    if (isPopular) {
      missing.board_numbers.push({ idx, name: device.name, year: device.year });
    }
  }
  
  // Цены
  if (!device.official_service_prices || Object.keys(device.official_service_prices).length === 0) {
    if (isPopular) {
      missing.prices.push({ idx, name: device.name, year: device.year });
    }
  }
  
  // Год
  if (!device.year) {
    missing.year.push({ idx, name: device.name });
  }
});

console.log('📊 РЕЗУЛЬТАТЫ:\n');
console.log(`Процессор отсутствует: ${missing.processor.length}`);
console.log(`Charging IC отсутствует: ${missing.charging_ic.length}`);
console.log(`Board numbers отсутствуют: ${missing.board_numbers.length}`);
console.log(`Цены отсутствуют: ${missing.prices.length}`);
console.log(`Год отсутствует: ${missing.year.length}`);
console.log('');

// Показываем детали
if (missing.processor.length > 0) {
  console.log('\n❌ Устройства без процессора:\n');
  missing.processor.slice(0, 10).forEach(d => {
    console.log(`  [${d.idx}] ${d.name} (${d.year})`);
  });
  if (missing.processor.length > 10) {
    console.log(`  ... и еще ${missing.processor.length - 10}`);
  }
}

if (missing.prices.length > 0) {
  console.log('\n💰 Устройства без цен:\n');
  missing.prices.slice(0, 10).forEach(d => {
    console.log(`  [${d.idx}] ${d.name} (${d.year})`);
  });
  if (missing.prices.length > 10) {
    console.log(`  ... и еще ${missing.prices.length - 10}`);
  }
}

// Сохраняем отчет
fs.writeFileSync(
  path.join(__dirname, '..', 'missing-data-report.json'),
  JSON.stringify(missing, null, 2)
);

console.log('\n📄 Полный отчет: missing-data-report.json\n');
