#!/usr/bin/env node
/**
 * Test: calculator brand grid is compact (grid-cols-5, aspect-square) in build output
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const calcPath = path.join(distDir, 'static', 'price-calculator.js');

let ok = 0;
let fail = 0;

function check(name, condition) {
  if (condition) {
    console.log('  ✅', name);
    ok++;
  } else {
    console.log('  ❌', name);
    fail++;
  }
}

console.log('Testing calculator (compact brands) in dist/...\n');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ not found. Run: npm run build');
  process.exit(1);
}

// index.html
if (fs.existsSync(indexPath)) {
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  check('index.html: script price-calculator.js present', indexHtml.includes('price-calculator.js'));
  check('index.html: version 3.6-brands-compact', indexHtml.includes('3.6-brands-compact'));
  check('index.html: #calculator section reference', indexHtml.includes('calculator'));
} else {
  console.log('  ❌ index.html not found');
  fail++;
}

// price-calculator.js
if (fs.existsSync(calcPath)) {
  const calcJs = fs.readFileSync(calcPath, 'utf8');
  check('price-calculator.js: grid-cols-5 (compact columns)', calcJs.includes('grid-cols-5'));
  check('price-calculator.js: aspect-square (square cells)', calcJs.includes('aspect-square'));
  check('price-calculator.js: max-w-[72px] (mobile cap)', calcJs.includes('max-w-[72px]'));
  check('price-calculator.js: lg:grid-cols-7', calcJs.includes('lg:grid-cols-7'));
} else {
  console.log('  ❌ dist/static/price-calculator.js not found');
  fail++;
}

console.log('\n' + (fail === 0 ? '✅ All checks passed.' : `⚠️ ${fail} check(s) failed.`));
process.exit(fail > 0 ? 1 : 0);
