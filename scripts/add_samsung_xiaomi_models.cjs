/**
 * Скрипт для добавления моделей Samsung и Xiaomi в базу данных
 */

const fs = require('fs');
const path = require('path');

const devicesPath = path.join(__dirname, '../public/data/devices.json');

// Читаем существующую базу
const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf8'));

// Новые модели Samsung
const samsungModels = [
  {
    name: "Samsung Galaxy S24 Ultra",
    category: "Samsung",
    model: "SM-S928B",
    year: 2024,
    official_service_prices: {
      battery: 89,
      display: 349,
      rear_camera: 199,
      front_camera: 129,
      charging_port: 79,
      logic_board: 499
    }
  },
  {
    name: "Samsung Galaxy S24+",
    category: "Samsung",
    model: "SM-S926B",
    year: 2024,
    official_service_prices: {
      battery: 79,
      display: 299,
      rear_camera: 179,
      front_camera: 119,
      charging_port: 69,
      logic_board: 449
    }
  },
  {
    name: "Samsung Galaxy S24",
    category: "Samsung",
    model: "SM-S921B",
    year: 2024,
    official_service_prices: {
      battery: 69,
      display: 249,
      rear_camera: 159,
      front_camera: 109,
      charging_port: 59,
      logic_board: 399
    }
  },
  {
    name: "Samsung Galaxy S23 Ultra",
    category: "Samsung",
    model: "SM-S918B",
    year: 2023,
    official_service_prices: {
      battery: 79,
      display: 329,
      rear_camera: 189,
      front_camera: 119,
      charging_port: 69,
      logic_board: 479
    }
  },
  {
    name: "Samsung Galaxy S23+",
    category: "Samsung",
    model: "SM-S916B",
    year: 2023,
    official_service_prices: {
      battery: 69,
      display: 279,
      rear_camera: 169,
      front_camera: 109,
      charging_port: 59,
      logic_board: 429
    }
  },
  {
    name: "Samsung Galaxy S23",
    category: "Samsung",
    model: "SM-S911B",
    year: 2023,
    official_service_prices: {
      battery: 59,
      display: 229,
      rear_camera: 149,
      front_camera: 99,
      charging_port: 49,
      logic_board: 379
    }
  },
  {
    name: "Samsung Galaxy S22 Ultra",
    category: "Samsung",
    model: "SM-S908B",
    year: 2022,
    official_service_prices: {
      battery: 69,
      display: 299,
      rear_camera: 179,
      front_camera: 109,
      charging_port: 59,
      logic_board: 449
    }
  },
  {
    name: "Samsung Galaxy S22+",
    category: "Samsung",
    model: "SM-S906B",
    year: 2022,
    official_service_prices: {
      battery: 59,
      display: 249,
      rear_camera: 159,
      front_camera: 99,
      charging_port: 49,
      logic_board: 399
    }
  },
  {
    name: "Samsung Galaxy S22",
    category: "Samsung",
    model: "SM-S901B",
    year: 2022,
    official_service_prices: {
      battery: 49,
      display: 199,
      rear_camera: 139,
      front_camera: 89,
      charging_port: 39,
      logic_board: 349
    }
  },
  {
    name: "Samsung Galaxy A54",
    category: "Samsung",
    model: "SM-A546B",
    year: 2023,
    official_service_prices: {
      battery: 49,
      display: 149,
      rear_camera: 99,
      front_camera: 69,
      charging_port: 39,
      logic_board: 249
    }
  },
  {
    name: "Samsung Galaxy A34",
    category: "Samsung",
    model: "SM-A346B",
    year: 2023,
    official_service_prices: {
      battery: 39,
      display: 129,
      rear_camera: 79,
      front_camera: 59,
      charging_port: 29,
      logic_board: 199
    }
  },
  {
    name: "Samsung Galaxy Z Fold 5",
    category: "Samsung",
    model: "SM-F946B",
    year: 2023,
    official_service_prices: {
      battery: 99,
      display: 599,
      rear_camera: 249,
      front_camera: 149,
      charging_port: 89,
      logic_board: 699
    }
  },
  {
    name: "Samsung Galaxy Z Flip 5",
    category: "Samsung",
    model: "SM-F731B",
    year: 2023,
    official_service_prices: {
      battery: 79,
      display: 399,
      rear_camera: 179,
      front_camera: 119,
      charging_port: 69,
      logic_board: 549
    }
  }
];

// Новые модели Xiaomi
const xiaomiModels = [
  {
    name: "Xiaomi 14 Pro",
    category: "Xiaomi",
    model: "24030PN60G",
    year: 2024,
    official_service_prices: {
      battery: 69,
      display: 249,
      rear_camera: 149,
      front_camera: 99,
      charging_port: 49,
      logic_board: 399
    }
  },
  {
    name: "Xiaomi 14",
    category: "Xiaomi",
    model: "24028PN60G",
    year: 2024,
    official_service_prices: {
      battery: 59,
      display: 199,
      rear_camera: 129,
      front_camera: 89,
      charging_port: 39,
      logic_board: 349
    }
  },
  {
    name: "Xiaomi 13 Pro",
    category: "Xiaomi",
    model: "2210132G",
    year: 2023,
    official_service_prices: {
      battery: 59,
      display: 229,
      rear_camera: 139,
      front_camera: 89,
      charging_port: 39,
      logic_board: 379
    }
  },
  {
    name: "Xiaomi 13",
    category: "Xiaomi",
    model: "2211133G",
    year: 2023,
    official_service_prices: {
      battery: 49,
      display: 179,
      rear_camera: 119,
      front_camera: 79,
      charging_port: 29,
      logic_board: 329
    }
  },
  {
    name: "Xiaomi 12 Pro",
    category: "Xiaomi",
    model: "2201122G",
    year: 2022,
    official_service_prices: {
      battery: 49,
      display: 199,
      rear_camera: 129,
      front_camera: 79,
      charging_port: 29,
      logic_board: 299
    }
  },
  {
    name: "Xiaomi 12",
    category: "Xiaomi",
    model: "2201123G",
    year: 2022,
    official_service_prices: {
      battery: 39,
      display: 149,
      rear_camera: 109,
      front_camera: 69,
      charging_port: 29,
      logic_board: 249
    }
  },
  {
    name: "Redmi Note 13 Pro",
    category: "Xiaomi",
    model: "2312DRA50G",
    year: 2024,
    official_service_prices: {
      battery: 39,
      display: 119,
      rear_camera: 79,
      front_camera: 59,
      charging_port: 29,
      logic_board: 199
    }
  },
  {
    name: "Redmi Note 12",
    category: "Xiaomi",
    model: "22101316G",
    year: 2023,
    official_service_prices: {
      battery: 29,
      display: 99,
      rear_camera: 69,
      front_camera: 49,
      charging_port: 19,
      logic_board: 149
    }
  },
  {
    name: "Redmi Note 11",
    category: "Xiaomi",
    model: "2201117TG",
    year: 2022,
    official_service_prices: {
      battery: 29,
      display: 89,
      rear_camera: 59,
      front_camera: 39,
      charging_port: 19,
      logic_board: 129
    }
  },
  {
    name: "POCO X6 Pro",
    category: "Xiaomi",
    model: "23122PCD1G",
    year: 2024,
    official_service_prices: {
      battery: 39,
      display: 129,
      rear_camera: 89,
      front_camera: 59,
      charging_port: 29,
      logic_board: 179
    }
  },
  {
    name: "POCO F5",
    category: "Xiaomi",
    model: "23013PC75G",
    year: 2023,
    official_service_prices: {
      battery: 39,
      display: 119,
      rear_camera: 79,
      front_camera: 49,
      charging_port: 29,
      logic_board: 169
    }
  }
];

// Проверяем, какие модели уже есть
const existingNames = new Set(devices.map(d => d.name?.toLowerCase()));

// Добавляем только новые модели
const newSamsung = samsungModels.filter(m => !existingNames.has(m.name.toLowerCase()));
const newXiaomi = xiaomiModels.filter(m => !existingNames.has(m.name.toLowerCase()));

// Добавляем в базу
devices.push(...newSamsung, ...newXiaomi);

// Сохраняем
fs.writeFileSync(devicesPath, JSON.stringify(devices, null, 2), 'utf8');

console.log(`✅ Добавлено моделей Samsung: ${newSamsung.length}`);
console.log(`✅ Добавлено моделей Xiaomi: ${newXiaomi.length}`);
console.log(`📊 Всего моделей в базе: ${devices.length}`);
