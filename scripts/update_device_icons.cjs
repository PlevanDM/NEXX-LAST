#!/usr/bin/env node
/**
 * Скрипт для обновления иконок устройств из AppleDB CDN
 * URL формат: https://img.appledb.dev/device@256/{imageKey}/{Color}.png
 */

const fs = require('fs');
const path = require('path');

// Загрузка данных
const devicesPath = path.join(__dirname, '../public/data/devices_enhanced.json');
const appledbPath = path.join(__dirname, '../public/data/appledb_devices.json');

const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf8'));
const appledbDevices = JSON.parse(fs.readFileSync(appledbPath, 'utf8'));

// Создать индекс AppleDB устройств по имени
const appledbIndex = {};
appledbDevices.forEach(device => {
  if (device.name && device.imageKey) {
    appledbIndex[device.name.toLowerCase()] = device;
    
    // Также по номеру модели
    if (device.model && device.model.length > 0) {
      device.model.forEach(model => {
        appledbIndex[model.toLowerCase()] = device;
      });
    }
    
    // По identifier
    if (device.identifier && device.identifier.length > 0) {
      device.identifier.forEach(id => {
        appledbIndex[id.toLowerCase()] = device;
      });
    }
  }
});

console.log(`📦 Загружено ${devices.length} устройств из базы`);
console.log(`📦 Загружено ${appledbDevices.length} устройств из AppleDB`);
console.log(`🔍 Создан индекс из ${Object.keys(appledbIndex).length} записей\n`);

let updated = 0;
let notFound = 0;

// Обновить иконки
devices.forEach((device, index) => {
  // Попробовать найти в AppleDB
  let appledbDevice = null;
  
  // Поиск по имени
  if (device.name) {
    appledbDevice = appledbIndex[device.name.toLowerCase()];
  }
  
  // Поиск по model_number
  if (!appledbDevice && device.model_number) {
    appledbDevice = appledbIndex[device.model_number.toLowerCase()];
  }
  
  // Поиск по model
  if (!appledbDevice && device.model) {
    appledbDevice = appledbIndex[device.model.toLowerCase()];
  }
  
  if (appledbDevice && appledbDevice.imageKey) {
    // Определить цвет устройства
    let color = 'Silver'; // По умолчанию
    
    // Логика определения цвета из имени устройства
    const nameLower = device.name.toLowerCase();
    if (nameLower.includes('space gray') || nameLower.includes('space grey')) {
      color = 'Space Gray';
    } else if (nameLower.includes('gold')) {
      color = 'Gold';
    } else if (nameLower.includes('rose gold')) {
      color = 'Rose Gold';
    } else if (nameLower.includes('black') || nameLower.includes('midnight')) {
      color = 'Black';
    } else if (nameLower.includes('blue')) {
      color = 'Blue';
    } else if (nameLower.includes('pro max')) {
      color = 'Natural Titanium'; // Для Pro Max моделей
    }
    
    // Создать URL иконки
    const iconUrl = `https://img.appledb.dev/device@256/${appledbDevice.imageKey}/${color}.png`;
    
    // Обновить устройство
    if (!device.icon_url || device.icon_url !== iconUrl) {
      device.icon_url = iconUrl;
      updated++;
      console.log(`✅ [${index + 1}/${devices.length}] ${device.name} → ${appledbDevice.imageKey}`);
    }
  } else {
    notFound++;
    if (notFound <= 10) { // Показать первые 10 не найденных
      console.log(`❌ [${index + 1}/${devices.length}] ${device.name} - не найдено в AppleDB`);
    }
  }
});

// Сохранить обновленные данные
fs.writeFileSync(devicesPath, JSON.stringify(devices, null, 2));

console.log(`\n📊 Статистика:`);
console.log(`   ✅ Обновлено: ${updated}`);
console.log(`   ❌ Не найдено: ${notFound}`);
console.log(`   📁 Всего устройств: ${devices.length}`);
console.log(`\n✨ Готово! Файл сохранен: ${devicesPath}`);
