const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../public/data/master-db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('🧪 Enriching master-db.json with technical data...');

db.devices.forEach(d => {
    if (d.brand === 'Apple') {
        if (d.name.includes('iPhone 15') || d.name.includes('iPhone 16') || d.name.includes('iPhone 14') || d.name.includes('iPhone 13') || d.name.includes('iPhone 12') || d.name.includes('iPhone 11') || d.name.includes('iPhone X') || d.name.includes('iPhone 8')) {
            d.dfu_mode = "Volume Up, then Volume Down, then hold Side button until screen goes black, then hold Side + Volume Down for 5s, then release Side and keep holding Volume Down.";
            d.recovery_mode = "Volume Up, then Volume Down, then hold Side button until recovery screen appears.";
        } else if (d.name.includes('iPhone 7')) {
            d.dfu_mode = "Hold Power + Volume Down for 10s, release Power and keep holding Volume Down.";
            d.recovery_mode = "Hold Volume Down and connect to computer.";
        } else if (d.name.includes('iPhone 6') || d.name.includes('iPhone 5')) {
            d.dfu_mode = "Hold Power + Home for 10s, release Power and keep holding Home.";
            d.recovery_mode = "Hold Home and connect to computer.";
        }
    }
});

db.logic_boards = [
    { model: "820-02020", name: "MacBook Air (M1, 2020)", cpu: "Apple M1", ram: "8GB/16GB (Unified)", storage: "SSD (Soldered)" },
    { model: "820-02536", name: "MacBook Air (M2, 2022)", cpu: "Apple M2", ram: "8GB/16GB/24GB", storage: "SSD (Soldered)" },
    { model: "820-00165", name: "MacBook Air (13-inch, Early 2015-2017)", cpu: "Intel Core i5/i7", ram: "4GB/8GB", storage: "SSD (Removable)" }
];

db.measurements = {
    "iPhone 13": [
        { line: "PP_VCC_MAIN", value: "0.450V", pin: "C3000" },
        { line: "PP_BATT_VCC", value: "0.520V", pin: "J3200" }
    ],
    "MacBook Air M1": [
        { line: "PPBUS_G3H", value: "0.600V", pin: "F7000" },
        { line: "PP3V3_G3H", value: "0.480V", pin: "L7030" }
    ]
};

db.pinouts = [
    {
        name: "iPhone 13 Battery Connector",
        pins: [
            { pin: "1", signal: "PP_BATT_VCC", description: "Positive Terminal" },
            { pin: "2", signal: "BATT_CON_SWI", description: "Single Wire Interface" },
            { pin: "3", signal: "BATT_CON_NTC", description: "Temperature Sensor" },
            { pin: "4", signal: "GND", description: "Ground" }
        ]
    }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('✅ master-db.json technical data enriched!');
