#!/usr/bin/env node
/**
 * Import Apple Exchange Price List (Ukraine) from Excel (.xlsx).
 * Output: public/data/apple-exchange-ua.json
 *
 * Usage:
 *   node scripts/import-exchange-ua-xlsx.cjs
 *   node scripts/import-exchange-ua-xlsx.cjs "path/to/Exchange_Price_List.xlsx"
 *
 * Default path: data/exchange-ua/*.xlsx (latest by mtime) or first .xlsx in that folder.
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const DEFAULT_DIR = path.join(__dirname, '..', 'data', 'exchange-ua');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'apple-exchange-ua.json');

// Header patterns (lowercase) → our key
const ARTICLE_KEYS = ['артикул', 'art', 'article', 'код', 'part'];
const DESC_KEYS = ['опис', 'description', 'описание', 'назва', 'наименование', 'name'];
const STOCK_KEYS = ['цена склада', 'price stock', 'ціна складу', 'склад', 'stock', 'закуп'];
const EXCHANGE_KEYS = ['цена обмена', 'price exchange', 'ціна обміну', 'обмін', 'exchange', 'обмен'];
const FULL_KEYS = ['полная', 'полная цена', 'розница', 'price full', 'ціна повна', 'retail'];

function findColumnIndex(headers, patterns) {
  const row = headers.map(h => String(h || '').toLowerCase().trim());
  for (let i = 0; i < row.length; i++) {
    const cell = row[i];
    for (const p of patterns) {
      if (cell.includes(p) || p.includes(cell)) return i;
    }
  }
  return -1;
}

function parseNumber(val) {
  if (val == null || val === '') return 0;
  if (typeof val === 'number' && !Number.isNaN(val)) return Math.round(val);
  const s = String(val).replace(/\s/g, '').replace(',', '.');
  const n = parseFloat(s);
  return Number.isNaN(n) ? 0 : Math.round(n);
}

function getInputPath() {
  const arg = process.argv[2];
  if (arg) {
    const resolved = path.resolve(arg);
    if (fs.existsSync(resolved)) return resolved;
    console.warn('⚠️ File not found:', resolved);
  }
  if (!fs.existsSync(DEFAULT_DIR)) {
    fs.mkdirSync(DEFAULT_DIR, { recursive: true });
    console.log('📁 Created', DEFAULT_DIR, '- put your .xlsx here and run again.\n');
    process.exit(1);
  }
  const files = fs.readdirSync(DEFAULT_DIR)
    .filter(f => /\.xlsx$/i.test(f))
    .map(f => ({ name: f, path: path.join(DEFAULT_DIR, f), mtime: fs.statSync(path.join(DEFAULT_DIR, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  if (files.length === 0) {
    console.log('📁 No .xlsx in', DEFAULT_DIR, '- add your Exchange_Price_List.xlsx and run again.\n');
    process.exit(1);
  }
  return files[0].path;
}

function main() {
  const inputPath = getInputPath();
  console.log('📂 Reading', inputPath);

  const workbook = XLSX.readFile(inputPath, { cellDates: false });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (!raw.length) {
    console.error('❌ Sheet is empty');
    process.exit(1);
  }

  const headers = raw[0];
  const colArt = findColumnIndex(headers, ARTICLE_KEYS);
  const colDesc = findColumnIndex(headers, DESC_KEYS);
  const colStock = findColumnIndex(headers, STOCK_KEYS);
  const colExchange = findColumnIndex(headers, EXCHANGE_KEYS);
  const colFull = findColumnIndex(headers, FULL_KEYS);

  if (colArt < 0) {
    console.warn('⚠️ No "Article" column found. Headers:', headers.join(' | '));
  }
  if (colDesc < 0 && colArt < 0) {
    console.error('❌ Need at least Article or Description column. Headers:', headers.join(' | '));
    process.exit(1);
  }

  const prices = {};
  for (let i = 1; i < raw.length; i++) {
    const row = raw[i];
    const art = (row[colArt] != null ? String(row[colArt]).trim() : '').replace(/\s+/g, ' ') || null;
    const desc = (row[colDesc] != null ? String(row[colDesc]).trim() : '') || '';
    const priceStock = colStock >= 0 ? parseNumber(row[colStock]) : 0;
    const priceExchange = colExchange >= 0 ? parseNumber(row[colExchange]) : priceStock || 0;
    const priceFull = colFull >= 0 ? parseNumber(row[colFull]) : 0;

    const key = art || `row-${i}`;
    if (!key || key.startsWith('row-')) continue;
    prices[key] = {
      description: desc || key,
      price_stock_uah: priceStock,
      price_exchange_uah: priceExchange,
      ...(priceFull > 0 && { price_full_uah: priceFull })
    };
  }

  const out = {
    lastUpdated: new Date().toISOString().slice(0, 10),
    source: path.basename(inputPath),
    description: 'Apple Official Ukraine Exchange Price List',
    prices
  };

  const outDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2), 'utf8');

  console.log('✅ Written', OUTPUT_PATH, '| rows:', Object.keys(prices).length);
}

main();
