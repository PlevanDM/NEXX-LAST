const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../public/data');
const DEVICES_DIR = path.join(DATA_DIR, 'devices');
const ICS_DIR = path.join(DATA_DIR, 'ics');
const OUTPUT_PATH = path.join(DATA_DIR, 'devices.json');
const MASTER_DB_PATH = path.join(DATA_DIR, 'master-db.json');

function assemble() {
    console.log('📦 Assembling database from modular files...');

    const devices = [];
    if (fs.existsSync(DEVICES_DIR)) {
        const files = fs.readdirSync(DEVICES_DIR).filter(f => f.endsWith('.json'));
        files.forEach(file => {
            const content = JSON.parse(fs.readFileSync(path.join(DEVICES_DIR, file), 'utf8'));
            if (Array.isArray(content)) {
                devices.push(...content);
            } else {
                devices.push(content);
            }
        });
    }

    const ics = [];
    if (fs.existsSync(ICS_DIR)) {
        const files = fs.readdirSync(ICS_DIR).filter(f => f.endsWith('.json'));
        files.forEach(file => {
            const content = JSON.parse(fs.readFileSync(path.join(ICS_DIR, file), 'utf8'));
            if (Array.isArray(content)) {
                ics.push(...content);
            } else {
                ics.push(content);
            }
        });
    }

    // Save to devices.json (legacy compatibility)
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(devices, null, 2));

    // Save to master-db.json (new unified format)
    const masterDb = {
        version: '10.0.0',
        last_updated: new Date().toISOString(),
        devices: devices,
        ics: ics
    };
    fs.writeFileSync(MASTER_DB_PATH, JSON.stringify(masterDb, null, 2));

    console.log(`✅ Assembled ${devices.length} devices and ${ics.length} ICs into master-db.json`);
}

assemble();
