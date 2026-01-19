/**
 * Add Device Icons to devices.json
 * Скрипт для добавления иконок к устройствам
 * 
 * NEXX Database v6.9.2 - Icons Update
 */

const fs = require('fs');
const path = require('path');

const DEVICES_PATH = path.join(__dirname, '../public/data/devices.json');
const ICONS_PATH = path.join(__dirname, '../public/data/device_icons.json');

// Загрузка данных
const devices = JSON.parse(fs.readFileSync(DEVICES_PATH, 'utf8'));
const iconsData = JSON.parse(fs.readFileSync(ICONS_PATH, 'utf8'));

// Функция для получения иконки устройства
function getDeviceIcon(device) {
  const category = device.category;
  const name = device.name;
  
  // Пробуем найти точное совпадение
  if (iconsData.device_icons[category] && iconsData.device_icons[category][name]) {
    return iconsData.device_icons[category][name];
  }
  
  // Поиск по частичному совпадению
  if (iconsData.device_icons[category]) {
    const categoryIcons = iconsData.device_icons[category];
    for (const [iconName, iconData] of Object.entries(categoryIcons)) {
      // Проверяем частичное совпадение
      if (name.includes(iconName) || iconName.includes(name)) {
        return iconData;
      }
    }
  }
  
  // Возвращаем дефолтную иконку для категории
  if (iconsData.default_icons[category]) {
    return {
      icon_url: iconsData.default_icons[category],
      icon_small: iconsData.default_icons[category].replace('/480/', '/96/'),
      source: 'default'
    };
  }
  
  return null;
}

// Функция для поиска похожей иконки
function findSimilarIcon(device) {
  const category = device.category;
  const name = device.name.toLowerCase();
  
  // Паттерны для поиска
  const patterns = [
    { match: 'iphone 17', icon: 'iPhone 17' },
    { match: 'iphone 16', icon: 'iPhone 16' },
    { match: 'iphone 15', icon: 'iPhone 15' },
    { match: 'iphone 14', icon: 'iPhone 14' },
    { match: 'iphone 13', icon: 'iPhone 13' },
    { match: 'iphone 12', icon: 'iPhone 12' },
    { match: 'iphone 11', icon: 'iPhone 11' },
    { match: 'iphone x', icon: 'iPhone X' },
    { match: 'iphone se', icon: 'iPhone SE 2nd Gen' },
    { match: 'ipad pro 13', icon: 'iPad Pro 13" M4' },
    { match: 'ipad pro 12.9', icon: 'iPad Pro 12.9" 6th Gen M2' },
    { match: 'ipad pro 11', icon: 'iPad Pro 11" M4' },
    { match: 'ipad pro 10.5', icon: 'iPad Pro 10.5"' },
    { match: 'ipad pro 9.7', icon: 'iPad Pro 9.7"' },
    { match: 'ipad air', icon: 'iPad Air 5th Gen M1' },
    { match: 'ipad mini', icon: 'iPad mini 6th Gen' },
    { match: 'ipad', icon: 'iPad 10th Gen' },
    { match: 'macbook pro 16', icon: 'MacBook Pro 16" M5 Pro 2025' },
    { match: 'macbook pro 14', icon: 'MacBook Pro 14" M5 Pro 2025' },
    { match: 'macbook pro 13', icon: 'MacBook Pro 13" M2 2022' },
    { match: 'macbook air 15', icon: 'MacBook Air 15-inch M4 2025' },
    { match: 'macbook air 13', icon: 'MacBook Air 13-inch M4 2025' },
    { match: 'macbook air', icon: 'MacBook Air 13-inch M4 2025' },
    { match: 'macbook', icon: 'MacBook Pro 14" M5 Pro 2025' },
    { match: 'watch series 10', icon: 'Apple Watch Series 10' },
    { match: 'watch series 9', icon: 'Apple Watch Series 9' },
    { match: 'watch ultra 2', icon: 'Apple Watch Ultra 2' },
    { match: 'watch ultra', icon: 'Apple Watch Ultra' },
    { match: 'watch se', icon: 'Apple Watch SE 2nd Gen' },
    { match: 'watch', icon: 'Apple Watch Series 10' }
  ];
  
  for (const pattern of patterns) {
    if (name.includes(pattern.match)) {
      if (iconsData.device_icons[category] && iconsData.device_icons[category][pattern.icon]) {
        return iconsData.device_icons[category][pattern.icon];
      }
    }
  }
  
  return null;
}

// Обновляем устройства
let updatedCount = 0;
let notFoundCount = 0;
const notFoundDevices = [];

devices.forEach(device => {
  // Сначала пробуем точное совпадение
  let iconData = getDeviceIcon(device);
  
  // Если не найдено, ищем похожую иконку
  if (!iconData) {
    iconData = findSimilarIcon(device);
  }
  
  if (iconData) {
    device.device_icon = iconData.icon_url;
    device.device_icon_small = iconData.icon_small;
    device.icon_source = iconData.source;
    updatedCount++;
  } else {
    // Используем дефолтную иконку
    if (iconsData.default_icons[device.category]) {
      device.device_icon = iconsData.default_icons[device.category];
      device.device_icon_small = iconsData.default_icons[device.category].replace('/480/', '/96/');
      device.icon_source = 'default';
      updatedCount++;
    } else {
      notFoundCount++;
      notFoundDevices.push(`${device.category}: ${device.name}`);
    }
  }
});

// Сохраняем обновлённые данные
fs.writeFileSync(DEVICES_PATH, JSON.stringify(devices, null, 2));

console.log('✅ Device Icons Update Complete!');
console.log(`📊 Statistics:`);
console.log(`   - Devices updated with icons: ${updatedCount}`);
console.log(`   - Devices without icons: ${notFoundCount}`);
console.log(`   - Total devices: ${devices.length}`);

if (notFoundDevices.length > 0) {
  console.log('\n⚠️  Devices without icons:');
  notFoundDevices.forEach(d => console.log(`   - ${d}`));
}

// Выводим распределение по источникам
const sourceStats = {};
devices.forEach(d => {
  if (d.icon_source) {
    sourceStats[d.icon_source] = (sourceStats[d.icon_source] || 0) + 1;
  }
});

console.log('\n📈 Icons by source:');
Object.entries(sourceStats).forEach(([source, count]) => {
  console.log(`   - ${source}: ${count}`);
});
