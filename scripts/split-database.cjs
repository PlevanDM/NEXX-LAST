const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../public/data/master-db.json');
const outputDir = path.join(__dirname, '../public/data/chunks');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
    console.error('master-db.json not found!');
    process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Strip common_issues from devices (user requested removal - redundant everywhere)
const devices = (db.devices || []).map(d => {
  const { common_issues, ...rest } = d;
  return rest;
});

const chunks = {
    'config': db.config || {},
    'devices': devices,
    'prices': db.prices || {},
    'services': db.services || {},
    'knowledge': db.knowledge || {},
    'logic_boards': db.logic_boards || [],
    'mac_boards': db.mac_boards || [],
    'measurements': db.measurements || {},
    'pinouts': db.pinouts || [],
    'brands': db.brands || []
};

console.log('🚀 Splitting master-db.json into chunks...');

Object.entries(chunks).forEach(([name, data]) => {
    const filePath = path.join(outputDir, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Created ${name}.json (${(JSON.stringify(data).length / 1024).toFixed(2)} KB)`);
});

// Also create a version file
fs.writeFileSync(path.join(outputDir, 'version.json'), JSON.stringify({
    version: db.version,
    lastUpdated: db.lastUpdated
}, null, 2), 'utf8');

console.log('🎉 Database splitting complete!');
