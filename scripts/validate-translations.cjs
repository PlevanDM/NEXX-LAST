#!/usr/bin/env node
/**
 * Translation Keys Validator
 * Проверяет, что все ключи переводов присутствуют во всех языках
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Translation Keys Validator\n');

// Загружаем i18n.js
const i18nPath = path.join(__dirname, '..', 'public', 'static', 'i18n.js');
const i18nContent = fs.readFileSync(i18nPath, 'utf-8');

// Извлекаем объект translations из файла
// Простой парсинг - ищем const translations = { ... }
const translationsMatch = i18nContent.match(/const translations = \{([\s\S]*?)\n  \};/);
if (!translationsMatch) {
  console.error('❌ Не удалось найти translations в i18n.js');
  process.exit(1);
}

// Парсим JSON-подобную структуру (упрощенный подход)
// Используем eval в безопасном контексте или парсим вручную
let translations;
try {
  // Извлекаем только объект translations
  const startIdx = i18nContent.indexOf('const translations = {');
  const endIdx = i18nContent.indexOf('\n  };', startIdx) + 5;
  const translationsStr = i18nContent.substring(startIdx + 'const translations = '.length, endIdx);
  
  // Заменяем комментарии и упрощаем для парсинга
  const cleaned = translationsStr
    .replace(/\/\/.*$/gm, '') // Удаляем однострочные комментарии
    .replace(/\/\*[\s\S]*?\*\//g, ''); // Удаляем многострочные комментарии
  
  // Используем Function для безопасного выполнения
  translations = (new Function('return ' + cleaned))();
} catch (err) {
  console.error('❌ Ошибка парсинга translations:', err.message);
  process.exit(1);
}

const languages = Object.keys(translations);
console.log(`📊 Найдено языков: ${languages.join(', ')}\n`);

// Рекурсивная функция для получения всех ключей
function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    if (key === 'code' || key === 'name' || key === 'flag' || key === 'direction') {
      continue; // Пропускаем метаданные языка
    }
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Получаем все ключи из первого языка (uk) как эталон
const referenceLang = languages[0];
const allKeys = getAllKeys(translations[referenceLang]);
allKeys.sort();

console.log(`📋 Эталонный язык: ${referenceLang}`);
console.log(`📋 Всего ключей: ${allKeys.length}\n`);

const errors = [];
const warnings = [];

// Проверяем каждый язык
languages.forEach(lang => {
  const langKeys = getAllKeys(translations[lang]);
  const missingKeys = allKeys.filter(key => !langKeys.includes(key));
  const extraKeys = langKeys.filter(key => !allKeys.includes(key));
  
  if (missingKeys.length > 0) {
    errors.push({
      lang,
      type: 'missing',
      keys: missingKeys
    });
  }
  
  if (extraKeys.length > 0) {
    warnings.push({
      lang,
      type: 'extra',
      keys: extraKeys
    });
  }
});

// Выводим результаты
console.log('═'.repeat(60));
console.log('📊 РЕЗУЛЬТАТЫ ПРОВЕРКИ');
console.log('═'.repeat(60) + '\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ Все языки имеют одинаковые ключи!\n');
} else {
  if (errors.length > 0) {
    console.log('❌ ОТСУТСТВУЮЩИЕ КЛЮЧИ:\n');
    errors.forEach(({ lang, keys }) => {
      console.log(`   ${lang.toUpperCase()} (${keys.length} ключей):`);
      keys.slice(0, 10).forEach(key => {
        console.log(`      - ${key}`);
      });
      if (keys.length > 10) {
        console.log(`      ... и еще ${keys.length - 10} ключей`);
      }
      console.log('');
    });
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  ЛИШНИЕ КЛЮЧИ (есть в языке, но нет в эталоне):\n');
    warnings.forEach(({ lang, keys }) => {
      console.log(`   ${lang.toUpperCase()} (${keys.length} ключей):`);
      keys.slice(0, 10).forEach(key => {
        console.log(`      - ${key}`);
      });
      if (keys.length > 10) {
        console.log(`      ... и еще ${keys.length - 10} ключей`);
      }
      console.log('');
    });
  }
}

// Детальная статистика по языкам
console.log('═'.repeat(60));
console.log('📈 СТАТИСТИКА ПО ЯЗЫКАМ');
console.log('═'.repeat(60) + '\n');

languages.forEach(lang => {
  const langKeys = getAllKeys(translations[lang]);
  const missing = allKeys.filter(k => !langKeys.includes(k));
  const coverage = ((allKeys.length - missing.length) / allKeys.length * 100).toFixed(1);
  
  console.log(`${lang.toUpperCase()}:`);
  console.log(`   Всего ключей: ${langKeys.length}`);
  console.log(`   Покрытие: ${coverage}%`);
  if (missing.length > 0) {
    console.log(`   Отсутствует: ${missing.length}`);
  }
  console.log('');
});

// Сохраняем отчет
const report = {
  timestamp: new Date().toISOString(),
  languages,
  totalKeys: allKeys.length,
  errors: errors.map(e => ({ lang: e.lang, missingCount: e.keys.length, missingKeys: e.keys })),
  warnings: warnings.map(w => ({ lang: w.lang, extraCount: w.keys.length, extraKeys: w.keys })),
  statistics: languages.map(lang => {
    const langKeys = getAllKeys(translations[lang]);
    const missing = allKeys.filter(k => !langKeys.includes(k));
    return {
      lang,
      totalKeys: langKeys.length,
      missingCount: missing.length,
      coverage: ((allKeys.length - missing.length) / allKeys.length * 100).toFixed(1) + '%'
    };
  })
};

const reportPath = path.join(__dirname, '..', 'test-results', 'translation-keys-report.json');
const reportDir = path.dirname(reportPath);
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`📄 Отчет сохранен: ${reportPath}\n`);

if (errors.length > 0) {
  console.log('❌ Найдены отсутствующие ключи! Требуется исправление.\n');
  process.exit(1);
} else {
  console.log('✅ Все ключи присутствуют во всех языках!\n');
  process.exit(0);
}
