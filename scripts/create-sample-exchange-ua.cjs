#!/usr/bin/env node
/**
 * Создаёт пример Excel для прайса Украина в data/exchange-ua/sample-exchange-ua.xlsx
 * После этого можно запустить: npm run import:exchange-ua
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const OUT_DIR = path.join(__dirname, '..', 'data', 'exchange-ua');
const OUT_FILE = path.join(OUT_DIR, 'sample-exchange-ua.xlsx');

const sampleRows = [
  ['артикул', 'опис', 'цена склада', 'цена обмена'],
  ['661-56049', 'Display iPhone 14 Pro', 8500, 12000],
  ['661-56050', 'Display iPhone 14 Pro Max', 9200, 13500],
  ['661-56051', 'Батарея iPhone 14', 1200, 2500],
  ['661-56052', 'Камера задняя iPhone 14 Pro', 4500, 7500],
  ['661-56053', 'Динамик iPhone 14', 400, 800],
];

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
  const ws = XLSX.utils.aoa_to_sheet(sampleRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Прайс');
  XLSX.writeFile(wb, OUT_FILE);
  console.log('✅ Создан пример:', OUT_FILE);
  console.log('   Запустите: npm run import:exchange-ua');
}

main();
