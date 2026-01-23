const fs = require('fs');
const path = require('path');

const DEVICES_PATH = path.join(__dirname, '../public/data/devices.json');
const OUTPUT_DIR = path.join(__dirname, '../public/data/devices');

function deassemble() {
    if (!fs.existsSync(DEVICES_PATH)) {
        console.error('❌ devices.json not found');
        return;
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const devices = JSON.parse(fs.readFileSync(DEVICES_PATH, 'utf8'));
    console.log(`📂 Deassembling ${devices.length} devices...`);

    const groups = {};
    devices.forEach(device => {
        const brand = (device.brand || 'Other').toLowerCase();
        if (!groups[brand]) groups[brand] = [];
        groups[brand].push(device);
    });

    Object.keys(groups).forEach(brand => {
        const filePath = path.join(OUTPUT_DIR, `${brand}.json`);
        fs.writeFileSync(filePath, JSON.stringify(groups[brand], null, 2));
    });

    console.log(`✅ Deassembled into ${Object.keys(groups).length} files in ${OUTPUT_DIR}`);
}

deassemble();
