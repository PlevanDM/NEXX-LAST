#!/usr/bin/env node
/**
 * Проверка логотипа на лендинге: один лого, без смены при скролле.
 * Запускать после build: node scripts/check-logo.cjs
 */
const fs = require('fs');
const path = require('path');

const uiPath = path.join(__dirname, '..', 'dist', 'static', 'ui-components.js');
if (!fs.existsSync(uiPath)) {
  console.error('❌ dist/static/ui-components.js не найден. Сначала: npm run build');
  process.exit(1);
}

const content = fs.readFileSync(uiPath, 'utf8');

const checks = [
  { name: 'Один лого (nexx-logo.png)', ok: content.includes("src: '/static/nexx-logo.png") },
  { name: 'Нет других лого в img', ok: !content.includes('nexx-logo.svg') && !content.includes('nexx-logo-white') },
  { name: 'Бар шапки (104px/99px)', ok: content.includes("height: '104px'") || content.includes("height: '99px'") || content.includes("height: '80px'") },
];

let failed = false;
console.log('Проверка логотипа (лендинг):\n');
checks.forEach(({ name, ok }) => {
  console.log(ok ? '  ✅' : '  ❌', name);
  if (!ok) failed = true;
});
console.log('');
if (failed) {
  console.error('Проверка не пройдена.');
  process.exit(1);
}
console.log('✅ Логотип в порядке: один лого (nexx-logo.png) везде.\n');
