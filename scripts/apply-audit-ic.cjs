#!/usr/bin/env node
/**
 * Apply PMIC and Audio IC data from audit-ic-reference.json and ipad-ic-reference.json to master-db.json.
 * Fills power_ics and audio_ics only when missing or empty (use --overwrite to replace).
 * Source: AUDIT-REPORT-2026-01-31, iPad fill 2026
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'public', 'data', 'master-db.json');
const DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const REF_FILES = [
  'audit-ic-reference.json',
  'ipad-ic-reference.json',
  'macbook-ic-reference.json',
  'samsung-ic-reference.json',
  'apple-watch-ic-reference.json'
];

function main() {
  const overwrite = process.argv.includes('--overwrite');
  if (overwrite) console.log('🔄 Mode: --overwrite (replace existing power_ics/audio_ics)\n');

  console.log('📦 Loading', DB_PATH);
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  let byName = {};
  for (const file of REF_FILES) {
    const refPath = path.join(DATA_DIR, file);
    if (!fs.existsSync(refPath)) continue;
    console.log('📦 Loading', file);
    const ref = JSON.parse(fs.readFileSync(refPath, 'utf8'));
    byName = { ...byName, ...(ref.byName || {}) };
  }

  const devices = db.devices || [];
  let updated = 0;
  let skipped = 0;

  for (const dev of devices) {
    const name = (dev.name || '').trim();
    if (!name) continue;

    const data = byName[name];
    if (!data) continue;

    const hasPower = Array.isArray(dev.power_ics) && dev.power_ics.length > 0;
    const hasAudio = Array.isArray(dev.audio_ics) && dev.audio_ics.length > 0;
    const shouldSetPower = overwrite || !hasPower;
    const shouldSetAudio = overwrite || !hasAudio;

    if (!shouldSetPower && !shouldSetAudio) {
      skipped++;
      continue;
    }

    if (shouldSetPower && data.power_ics && data.power_ics.length) {
      dev.power_ics = data.power_ics;
    }
    if (shouldSetAudio) {
      if (data.audio_ics && data.audio_ics.length > 0) {
        dev.audio_ics = data.audio_ics;
      } else if (!hasAudio) {
        dev.audio_ics = [{ name: '—', function: 'Audio Codec' }];
      }
    }

    updated++;
    if (updated <= 15) console.log('  ✓', name);
  }

  console.log('\n📊 Result: updated', updated, '| skipped (had data)', skipped);

  if (updated > 0) {
    db.lastUpdated = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    console.log('✅ Saved', DB_PATH);
  } else {
    console.log('⚠️ No changes to save.');
  }
}

main();
