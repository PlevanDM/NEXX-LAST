#!/usr/bin/env node
/**
 * Автоматическое заполнение пропущенных цен
 */

const fs = require('fs');
const path = require('path');

const devicesPath = path.join(__dirname, '..', 'public', 'data', 'devices.json');
const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf-8'));

console.log('💰 Заполнение пропущенных цен\n');

// Типовые цены по категориям (в lei)
const typicalPrices = {
  'iPhone': {
    battery: 99,
    display: 299,
    rear_camera: 199,
    front_camera: 149,
    speaker: 69,
    taptic_engine: 59,
    logic_board: 499
  },
  'iPad': {
    battery: 89,
    display: 249,
    rear_camera: 149,
    front_camera: 99,
    speaker: 49,
    logic_board: 399
  },
  'MacBook': {
    battery: 149,
    display: 399,
    keyboard: 199,
    trackpad: 149,
    speaker: 89,
    logic_board: 699
  },
  'Samsung': {
    battery: 79,
    display: 249,
    rear_camera: 149,
    front_camera: 99,
    speaker: 49,
    logic_board: 349
  }
};

let filled = 0;

devices.forEach((device, idx) => {
  // Если нет цен и это устройство после 2020 года
  if ((!device.official_service_prices || Object.keys(device.official_service_prices).length === 0) && device.year >= 2020) {
    
    // Определяем категорию
    let category = 'iPhone'; // default
    if (device.name.includes('iPad')) category = 'iPad';
    else if (device.name.includes('MacBook')) category = 'MacBook';
    else if (device.name.includes('Samsung') || device.name.includes('Galaxy')) category = 'Samsung';
    else if (device.name.includes('iPhone')) category = 'iPhone';
    
    // Применяем типовые цены с небольшой коррекцией по году
    const yearMultiplier = device.year >= 2024 ? 1.2 : (device.year >= 2022 ? 1.1 : 1.0);
    
    const basePrices = typicalPrices[category];
    const adjustedPrices = {};
    
    Object.entries(basePrices).forEach(([key, value]) => {
      adjustedPrices[key] = Math.round(value * yearMultiplier);
    });
    
    // Заполняем
    device.official_service_prices = adjustedPrices;
    filled++;
    
    console.log(`✅ [${idx}] ${device.name} (${device.year}) - добавлены цены для ${category}`);
  }
});

console.log(`\n✅ Заполнено цен для ${filled} устройств\n`);

// Сохраняем обновленную базу
fs.writeFileSync(devicesPath, JSON.stringify(devices, null, 2));

console.log('💾 База данных обновлена: public/data/devices.json\n');
console.log('🎉 Готово!\n');
