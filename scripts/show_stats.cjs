const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'public', 'data');

const devices = JSON.parse(fs.readFileSync(path.join(dataDir, 'devices.json'), 'utf8'));
const ics = JSON.parse(fs.readFileSync(path.join(dataDir, 'ic_compatibility.json'), 'utf8'));
const errors = JSON.parse(fs.readFileSync(path.join(dataDir, 'error_codes.json'), 'utf8'));
const knowledge = JSON.parse(fs.readFileSync(path.join(dataDir, 'repair_knowledge.json'), 'utf8'));
const measurements = JSON.parse(fs.readFileSync(path.join(dataDir, 'measurements.json'), 'utf8'));

console.log('\n📊 NEXX DATABASE 2026 - FINAL STATS\n');
console.log('═══════════════════════════════════════\n');

console.log('✅ Devices:', devices.length);
const devicesByCategory = {};
devices.forEach(d => {
  devicesByCategory[d.category] = (devicesByCategory[d.category] || 0) + 1;
});
Object.entries(devicesByCategory).forEach(([cat, count]) => {
  console.log(`   - ${cat}: ${count}`);
});

console.log('\n✅ IC Components:', Object.keys(ics).filter(k => !k.startsWith('_') && !['source','collected_at','stats'].includes(k)).length, 'categories');
const icCategories = Object.keys(ics).filter(k => !k.startsWith('_') && !['source','collected_at','stats'].includes(k));
icCategories.slice(0, 8).forEach(cat => {
  const count = Array.isArray(ics[cat]) ? ics[cat].length : 0;
  if (count > 0) console.log(`   - ${cat}: ${count}`);
});

console.log('\n✅ Error Codes:', (errors.itunes_restore_errors?.length || 0) + (errors.mac_diagnostics?.length || 0));
console.log(`   - iTunes Restore: ${errors.itunes_restore_errors?.length || 0}`);
console.log(`   - Mac Diagnostics: ${errors.mac_diagnostics?.length || 0}`);

console.log('\n✅ Knowledge Base:', Object.keys(knowledge).filter(k => !['generated_at','version','source'].includes(k)).length, 'sections');

console.log('\n✅ Measurement Profiles:', Object.keys(measurements).filter(k => !k.startsWith('_')).length);

const total = devices.length + 
              icCategories.length + 
              ((errors.itunes_restore_errors?.length || 0) + (errors.mac_diagnostics?.length || 0)) +
              Object.keys(knowledge).filter(k => !['generated_at','version','source'].includes(k)).length +
              Object.keys(measurements).filter(k => !k.startsWith('_')).length;

console.log('\n═══════════════════════════════════════');
console.log('🎯 Total Data Points:', total);
console.log('═══════════════════════════════════════\n');
