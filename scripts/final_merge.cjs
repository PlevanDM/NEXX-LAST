const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../public/data/master-db.json');
const icsPath = path.join(__dirname, '../public/data/ic_comprehensive.json');
const errorsPath = path.join(__dirname, '../public/data/error_codes_comprehensive.json');
const knowledgePath = path.join(__dirname, '../public/data/knowledge_base.json');

if (!fs.existsSync(dbPath)) {
    console.error('master-db.json not found!');
    process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('🚀 Merging ICs, Errors and Knowledge Base into master-db.json...');

// Merge ICs
if (fs.existsSync(icsPath)) {
    const icsData = JSON.parse(fs.readFileSync(icsPath, 'utf8'));
    db.ics = {};
    const categories = ['charging_ics', 'power_ics', 'audio_ics', 'baseband_ics', 'nand_ics', 'wifi_bt_ics', 'biometric_ics'];
    categories.forEach(cat => {
        if (icsData[cat]) {
            icsData[cat].forEach(ic => {
                db.ics[ic.name] = {
                    ...ic,
                    category: cat
                };
            });
        }
    });
    console.log(`✅ Merged ${Object.keys(db.ics).length} ICs`);
}

// Merge Errors
if (fs.existsSync(errorsPath)) {
    const errorsData = JSON.parse(fs.readFileSync(errorsPath, 'utf8'));
    db.errors = {};
    if (errorsData.itunes_restore_errors) {
        errorsData.itunes_restore_errors.forEach(err => {
            db.errors[String(err.code)] = err;
        });
    }
    if (errorsData.mac_diagnostics) {
        errorsData.mac_diagnostics.forEach(err => {
            db.errors[err.code] = err;
        });
    }
    console.log(`✅ Merged ${Object.keys(db.errors).length} error codes`);
}

// Merge Knowledge Base
if (fs.existsSync(knowledgePath)) {
    db.knowledge_base = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
    console.log(`✅ Merged Knowledge Base`);
}

// Merge Key Combinations
const keyComboPath = path.join(__dirname, '../public/data/key_combinations.json');
if (fs.existsSync(keyComboPath)) {
    db.key_combinations = JSON.parse(fs.readFileSync(keyComboPath, 'utf8'));
    console.log(`✅ Merged Key Combinations`);
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('🎉 master-db.json update complete!');
