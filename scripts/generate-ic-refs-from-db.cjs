#!/usr/bin/env node
/**
 * Generate macbook-ic-reference.json, samsung-ic-reference.json, apple-watch-ic-reference.json
 * from master-db.json by category. Each device gets power_ics/audio_ics placeholder "—".
 * Run: node scripts/generate-ic-refs-from-db.cjs
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'public', 'data', 'master-db.json');
const OUT_DIR = path.join(__dirname, '..', 'public', 'data');

const PLACEHOLDER = {
  power_ics: [{ name: '—', function: 'Main PMIC' }],
  audio_ics: [{ name: '—', function: 'Audio Codec' }]
};

const CATEGORIES = {
  MacBook: { file: 'macbook-ic-reference.json', title: 'MacBook PMIC/Audio', match: (dev) => (dev.category || '') === 'MacBook' },
  Samsung: { file: 'samsung-ic-reference.json', title: 'Samsung/Galaxy PMIC/Audio', match: (dev) => (dev.category || '') === 'Samsung' || /Samsung|Galaxy/.test(dev.name || '') },
  'Apple Watch': { file: 'apple-watch-ic-reference.json', title: 'Apple Watch PMIC/Audio', match: (dev) => (dev.category || '') === 'Apple Watch' }
};

function main() {
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const devices = db.devices || [];

  for (const [cat, { file, title, match }] of Object.entries(CATEGORIES)) {
    const byName = {};
    for (const dev of devices) {
      if (!match(dev)) continue;
      const name = (dev.name || '').trim();
      if (!name) continue;
      byName[name] = { ...PLACEHOLDER };
    }
    const ref = {
      version: '1.0',
      source: 'NEXX IC refs from master-db 2026',
      description: `${title} reference. Fill power_ics/audio_ics via apply-audit-ic.`,
      byName
    };
    const outPath = path.join(OUT_DIR, file);
    fs.writeFileSync(outPath, JSON.stringify(ref, null, 2), 'utf8');
    console.log('✅', file, Object.keys(byName).length, 'devices');
  }
}

main();
