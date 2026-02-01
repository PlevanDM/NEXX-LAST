#!/usr/bin/env node
/**
 * Import RON (lei) prices from Google Sheets *_price tabs.
 *
 * 1. Export each "…_price" sheet as CSV (File → Download → CSV).
 * 2. Put files in data/sheets-export/ (e.g. iPhone_price.csv, iPad_price.csv).
 * 3. Run: node scripts/import-sheets-prices-lei.cjs
 *
 * CSV format: first column = model name, rest = price columns (headers mapped below).
 * Column names (case-insensitive) map to keys: battery, display, charging_port, etc.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'public', 'data', 'master-db.json');
const EXPORT_DIR = path.join(__dirname, '..', 'data', 'sheets-export');

// Map CSV header (RO/EN) → our key
const COLUMN_TO_KEY = {
  battery: ['battery', 'baterie', 'baterii'],
  display: ['display', 'ecran', 'screen', 'ecrane', 'дисплей'],
  charging_port: ['charging_port', 'charging', 'incarcare', 'port', 'încărcare', 'port încărcare'],
  rear_camera: ['rear_camera', 'camera', 'cameră', 'camera spate', 'rear camera'],
  front_camera: ['front_camera', 'front camera', 'camera fata', 'față'],
  speaker: ['speaker', 'difuzor', 'speaker/mic'],
  taptic_engine: ['taptic_engine', 'taptic', 'motor vibrații'],
  logic_board: ['logic_board', 'motherboard', 'placă', 'placa', 'logic board', 'placa de baza'],
  keyboard: ['keyboard', 'tastatura', 'tastatură'],
};

function normalize(s) {
  return (s || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

function mapHeader(col) {
  const n = normalize(col);
  for (const [key, aliases] of Object.entries(COLUMN_TO_KEY)) {
    if (aliases.some((a) => n.includes(normalize(a)) || normalize(a).includes(n))) return key;
  }
  if (/^[a-z_]+$/.test(n) && COLUMN_TO_KEY[n]) return n;
  return null;
}

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return { headers: [], rows: [] };
  const sep = lines[0].includes(';') && !lines[0].includes('","') ? ';' : ',';
  const parseLine = (line) => {
    const out = [];
    let cur = '';
    let inq = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { inq = !inq; continue; }
      if (!inq && c === sep) { out.push(cur.trim().replace(/^"|"$/g, '')); cur = ''; continue; }
      cur += c;
    }
    out.push(cur.trim().replace(/^"|"$/g, ''));
    return out;
  };
  const raw = lines.map(parseLine);
  const headers = raw[0];
  const rows = raw.slice(1).map((r) => {
    const o = {};
    headers.forEach((h, i) => { o[h] = (r[i] != null ? r[i] : '').toString().trim(); });
    return o;
  });
  return { headers, rows };
}

function findDevice(devices, modelName) {
  const q = normalize(modelName);
  const byName = devices.find((d) => {
    const n = normalize(d.name);
    return n === q || n.includes(q) || q.includes(n);
  });
  if (byName) return byName;
  // Match "iPhone 16 Pro" → "iPhone 16 Pro Max" etc.
  const tokens = q.split(/\s+/).filter(Boolean);
  return devices.find((d) => {
    const n = normalize(d.name);
    return tokens.length && tokens.every((t) => n.includes(t));
  }) || null;
}

function run() {
  console.log('📥 Import Sheets prices (lei) → master-db.service_prices_ron\n');

  if (!fs.existsSync(EXPORT_DIR)) {
    console.log(`⚠️  Folder not found: ${EXPORT_DIR}`);
    console.log('   Create it and add CSV exports from Google Sheets *_price tabs.');
    console.log('   See data/sheets-export/README.md for format.\n');
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const devices = db.devices || [];
  const files = fs.readdirSync(EXPORT_DIR).filter((f) => /\.(csv|tsv)$/i.test(f));
  if (!files.length) {
    console.log(`⚠️  No CSV/TSV files in ${EXPORT_DIR}`);
    console.log('   Add exports from Sheets *_price tabs, then run again. See data/sheets-export/README.md\n');
    process.exit(0);
  }

  const MODEL_HEADERS = ['model', 'modelul', 'модель', 'model name', 'device', 'dispozitiv', 'nume'];

  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const fp = path.join(EXPORT_DIR, file);
    const content = fs.readFileSync(fp, 'utf8');
    const { headers, rows } = parseCSV(content);
    const modelCol = headers.find((h) => MODEL_HEADERS.some((m) => normalize(h).includes(m))) || headers[0] || 'Model';
    const keyByCol = {};
    headers.forEach((h) => {
      if (h === modelCol) return;
      const k = mapHeader(h);
      if (k) keyByCol[h] = k;
    });

    for (const row of rows) {
      const modelName = (row[modelCol] || row[headers[0]] || '').trim();
      if (!modelName) continue;
      const device = findDevice(devices, modelName);
      if (!device) {
        skipped++;
        continue;
      }
      const ron = {};
      for (const [col, key] of Object.entries(keyByCol)) {
        const v = row[col];
        if (v == null || v === '') continue;
        const num = parseInt(String(v).replace(/\D/g, ''), 10);
        if (!Number.isNaN(num) && num >= 0) ron[key] = num;
      }
      if (Object.keys(ron).length === 0) continue;
      device.service_prices_ron = { ...(device.service_prices_ron || {}), ...ron };
      updated++;
    }
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log(`✅ Updated ${updated} devices with service_prices_ron (lei).`);
  if (skipped) console.log(`   Skipped ${skipped} rows (no matching device).`);
  console.log('');
}

run();
