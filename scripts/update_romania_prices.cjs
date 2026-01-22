const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../public/data/master-db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const USD_TO_RON = 4.65;
const USD_TO_EUR = 0.92;

console.log('🇷🇴 Updating prices for Romanian market (RON)...');

db.devices.forEach(device => {
    if (device.service_prices) {
        const firstPrice = Object.values(device.service_prices)[0];
        if (firstPrice < 150) { // Likely USD
            const newPrices = {};
            for (const [key, value] of Object.entries(device.service_prices)) {
                newPrices[key] = Math.round(value * USD_TO_RON);
            }
            device.service_prices = newPrices;
        }
    } else {
        device.service_prices = {
            "Screen Replacement": 350,
            "Battery Replacement": 150,
            "Charging Port": 120,
            "Back Glass": 200
        };
    }

    if (!device.price_ron) {
        device.price_ron = Math.round(150 * USD_TO_RON);
    }
    if (!device.price_eur) {
        device.price_eur = Math.round(device.price_ron / (USD_TO_RON / USD_TO_EUR));
    }
});

if (!db.config) db.config = {};
db.config.currency = "RON";
db.config.exchange_rates = {
    "USD": 1,
    "RON": USD_TO_RON,
    "EUR": USD_TO_EUR
};

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('✅ Romanian prices updated in master-db.json');
