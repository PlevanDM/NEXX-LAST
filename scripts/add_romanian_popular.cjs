const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../public/data/master-db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const romaniaPopular = [
    // Allview (Local Romanian Brand)
    { brand: "Allview", name: "Allview Soul X8 Pro", category: "Smartphones", board_number: "ALV-X8P", processor: "Helio G90T" },
    { brand: "Allview", name: "Allview Soul X7 Pro", category: "Smartphones", board_number: "ALV-X7P", processor: "Helio P70" },
    { brand: "Allview", name: "Allview VIVA H1003", category: "Tablets", board_number: "ALV-H1003", processor: "Quad-Core" },
    { brand: "Allview", name: "Allview Viper V4", category: "Smartphones", board_number: "ALV-V4", processor: "Helio A22" },

    // Popular Huawei (legacy but still in repair)
    { brand: "Huawei", name: "Huawei P30 Lite", category: "Smartphones", board_number: "MAR-LX1A", processor: "Kirin 710", connector_type: "USB-C" },
    { brand: "Huawei", name: "Huawei P40 Lite", category: "Smartphones", board_number: "JNY-LX1", processor: "Kirin 810", connector_type: "USB-C" },
    { brand: "Huawei", name: "Huawei Nova 5T", category: "Smartphones", board_number: "YAL-L21", processor: "Kirin 980", connector_type: "USB-C" },
    { brand: "Huawei", name: "Huawei Mate 20 Lite", category: "Smartphones", board_number: "SNE-LX1", processor: "Kirin 710", connector_type: "USB-C" },

    // Popular Motorola
    { brand: "Motorola", name: "Motorola Moto G60", category: "Smartphones", board_number: "XT2135", processor: "Snapdragon 732G", connector_type: "USB-C" },
    { brand: "Motorola", name: "Motorola Moto G84", category: "Smartphones", board_number: "XT2347", processor: "Snapdragon 695", connector_type: "USB-C" },
    { brand: "Motorola", name: "Motorola Edge 40", category: "Smartphones", board_number: "XT2303", processor: "Dimensity 8020", connector_type: "USB-C" },

    // Common Samsung A-series (Workhorses of RO market)
    { brand: "Samsung", name: "Samsung Galaxy A12", category: "Smartphones", board_number: "SM-A125", processor: "Helio P35", connector_type: "USB-C" },
    { brand: "Samsung", name: "Samsung Galaxy A13", category: "Smartphones", board_number: "SM-A135", processor: "Exynos 850", connector_type: "USB-C" },
    { brand: "Samsung", name: "Samsung Galaxy A14", category: "Smartphones", board_number: "SM-A145", processor: "Helio G80", connector_type: "USB-C" },
    { brand: "Samsung", name: "Samsung Galaxy A15", category: "Smartphones", board_number: "SM-A155", processor: "Helio G99", connector_type: "USB-C" },
    { brand: "Samsung", name: "Samsung Galaxy A04s", category: "Smartphones", board_number: "SM-A047", processor: "Exynos 850", connector_type: "USB-C" }
];

romaniaPopular.forEach(dev => {
    // Check if exists
    const exists = db.devices.find(d => d.name === dev.name);
    if (!exists) {
        db.devices.push({
            ...dev,
            image: `https://source.unsplash.com/featured/?${dev.name.replace(/ /g, '+')},smartphone`,
            price_ron: 0,
            service_prices: {
                "Screen Replacement": 250,
                "Battery Replacement": 120,
                "Charging Port Repair": 80,
                "Back Glass Repair": 100
            }
        });
    }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`✅ Added ${romaniaPopular.length} popular Romanian market devices.`);
