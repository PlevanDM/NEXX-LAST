#!/usr/bin/env node
/**
 * Apply NEXX GSM database corrections from official sources (Apple, iFixit, professional repair DBs)
 * Run: node scripts/apply-database-corrections.cjs
 */
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../public/data/master-db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let updated = 0;

const byModel = (modelStr) => (d) =>
  d.model && modelStr.split('/').some((m) => d.model.includes(m.trim()));

const byName = (name) => (d) => d.name === name;

const patch = (predicate, patchFn) => {
  const idx = db.devices.findIndex(predicate);
  if (idx >= 0) {
    patchFn(db.devices[idx]);
    updated++;
  }
};

// iPhone 16: audio 338S01087 (non-Pro uses different codec than Pro)
patch(
  (d) => d.name === 'iPhone 16' && byModel('A3081/A3286/A3287/A3288')(d),
  (d) => {
    if (d.audio_ic) d.audio_ic.name = '338S01087';
    if (d.audio_ics) {
      d.audio_ics = d.audio_ics.map((a) => ({ ...a, name: a.name === '338S00967' ? '338S01087' : a.name }));
    }
  }
);

// iPad 5th Gen: PMIC 338S00225, Audio 338S00248
patch(
  (d) => d.name === 'iPad 5th Gen' && byModel('A1822/A1823')(d),
  (d) => {
    if (d.power_ics?.[0]?.name === '—' || !d.power_ics?.[0]?.name)
      d.power_ics = [{ name: '338S00225', function: 'Main PMIC' }];
    if (d.audio_ics?.[0]?.name === '—' || !d.audio_ics?.[0]?.name)
      d.audio_ics = [{ name: '338S00248', function: 'Audio Codec (Cirrus Logic)' }];
  }
);

// Ensure iPhone 16 series has correct board IDs (already correct in our DB, but verify)
const iphone16Fixes = [
  { name: 'iPhone 16 Pro Max', model: 'A3084', board: '820-02850', emc: '4232' },
  { name: 'iPhone 16 Pro', model: 'A3083', board: '820-02849', emc: '4231' },
  { name: 'iPhone 16 Plus', model: 'A3082', board: '820-02848', emc: '4230' },
  { name: 'iPhone 16', model: 'A3081', board: '820-02847', emc: '4229' },
];
iphone16Fixes.forEach(({ name, board, emc }) => {
  patch(byName(name), (d) => {
    if (d.board_numbers?.[0] !== board) {
      d.board_numbers = [board];
      updated++;
    }
    if (d.emc !== emc) {
      d.emc = emc;
      updated++;
    }
  });
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`✅ Applied database corrections. Updated: ${updated} device(s)`);
process.exit(0);
