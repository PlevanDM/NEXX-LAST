#!/usr/bin/env node
/**
 * Убирает белый фон с логотипа nexx-logo.png (делает прозрачным).
 * Запуск: node scripts/logo-remove-bg.cjs
 */

const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Установите sharp: npm install --save-dev sharp');
  process.exit(1);
}

const logoPath = path.join(__dirname, '..', 'public', 'static', 'nexx-logo.png');
const outPath = logoPath;

async function removeWhiteBackground() {
  if (!fs.existsSync(logoPath)) {
    console.error('❌ Файл не найден:', logoPath);
    process.exit(1);
  }

  const image = sharp(logoPath);
  const meta = await image.metadata();
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const threshold = 248; // пиксели ярче этого считаем белым фоном
  const fuzz = 12;      // допуск для почти белого (тень, антиалиас)

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3] ?? 255;
    const isWhite = r >= threshold - fuzz && g >= threshold - fuzz && b >= threshold - fuzz;
    if (isWhite) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outPath);

  console.log('✅ Фон логотипа убран (белый → прозрачный):', path.basename(outPath));
}

removeWhiteBackground().catch((err) => {
  console.error('❌ Ошибка:', err.message);
  process.exit(1);
});
