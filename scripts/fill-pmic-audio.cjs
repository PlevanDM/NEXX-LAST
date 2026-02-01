#!/usr/bin/env node
/**
 * Fill power_ics (PMIC) and audio_ics (Audio Codec) for iPhone devices in master-db.json
 * Uses apple-pmic-reference.json. Other categories get placeholder "—" if missing.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'public', 'data', 'master-db.json');
const REF_PATH = path.join(__dirname, '..', 'public', 'data', 'apple-pmic-reference.json');

// Series order: longest match first (e.g. "iPhone 16 Pro Max" before "iPhone 16")
const IPHONE_SERIES_ORDER = [
  'iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17',
  'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
  'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
  'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
  'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13 mini', 'iPhone 13',
  'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12 mini', 'iPhone 12',
  'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
  'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X',
  'iPhone 8 Plus', 'iPhone 8', 'iPhone 7 Plus', 'iPhone 7',
  'iPhone 6s Plus', 'iPhone 6s', 'iPhone 6 Plus', 'iPhone 6',
  'iPhone SE 3rd Gen', 'iPhone SE 2nd Gen', 'iPhone SE 1st Gen', 'iPhone SE',
];

function findSeriesForName(name, pmicBySeries) {
  if (!name || typeof name !== 'string') return null;
  const n = name.trim();
  for (const series of IPHONE_SERIES_ORDER) {
    if (n.includes(series) && pmicBySeries[series]) return series;
  }
  // Fallback: "iPhone 16 Pro Max" -> try "iPhone 16"
  const match = n.match(/iPhone\s+(\d+)/);
  if (match) {
    const base = `iPhone ${match[1]}`;
    if (pmicBySeries[base]) return base;
  }
  if (n.includes('iPhone SE') && pmicBySeries['iPhone SE']) return 'iPhone SE';
  if (n.includes('iPhone X') && pmicBySeries['iPhone X']) return 'iPhone X';
  return null;
}

function main() {
  console.log('📦 Loading', DB_PATH);
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const ref = JSON.parse(fs.readFileSync(REF_PATH, 'utf8'));
  const pmicBySeries = ref.pmicBySeries || {};
  const audioByModel = ref.audioCodecByModel || {};
  const devices = db.devices || [];
  let pmicAdded = 0;
  let audioAdded = 0;

  for (const dev of devices) {
    const name = dev.name || '';
    const category = (dev.category || '').toString();
    const isIphone = category === 'iPhone' || name.includes('iPhone');

    if (isIphone) {
      const series = findSeriesForName(name, pmicBySeries);
      const pmicData = series ? pmicBySeries[series] : null;
      const audioCodec = audioByModel[name?.trim()] || (pmicData && pmicData.audioCodec) || (series && audioByModel[series]);

      if (!dev.power_ics || !Array.isArray(dev.power_ics) || dev.power_ics.length === 0) {
        const mainPmic = (pmicData && pmicData.main) || (pmicData && pmicData.secondary && pmicData.secondary[0]) || '—';
        dev.power_ics = [
          { name: typeof mainPmic === 'string' ? mainPmic : mainPmic, function: 'Main PMIC' },
        ];
        if (pmicData && pmicData.secondary && pmicData.secondary.length > 0) {
          pmicData.secondary.slice(0, 2).forEach(s => {
            if (s && s !== mainPmic) dev.power_ics.push({ name: s, function: 'Secondary PMIC' });
          });
        }
        pmicAdded++;
      }

      if (!dev.audio_ics || !Array.isArray(dev.audio_ics) || dev.audio_ics.length === 0) {
        const codec = audioCodec || '—';
        dev.audio_ics = [{ name: typeof codec === 'string' ? codec : String(codec), function: 'Audio Codec' }];
        audioAdded++;
      }
    } else {
      // Non-iPhone: ensure at least placeholder so UI doesn't show "Нет данных" if we later add normalization for iPad/Mac
      if (!dev.power_ics || !Array.isArray(dev.power_ics) || dev.power_ics.length === 0) {
        dev.power_ics = [{ name: '—', function: 'PMIC' }];
        pmicAdded++;
      }
      if (!dev.audio_ics || !Array.isArray(dev.audio_ics) || dev.audio_ics.length === 0) {
        dev.audio_ics = [{ name: '—', function: 'Audio Codec' }];
        audioAdded++;
      }
    }
  }

  console.log('\n📊 PMIC added/updated:', pmicAdded, '| Audio Codec added/updated:', audioAdded);

  if (pmicAdded > 0 || audioAdded > 0) {
    db.lastUpdated = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    console.log('✅ Saved', DB_PATH);
  } else {
    console.log('⚠️ No changes (all devices already had power_ics/audio_ics).');
  }
}

main();
