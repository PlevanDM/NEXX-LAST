#!/usr/bin/env node
/**
 * Проверка базы знаний
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка базы знаний\n');

const dbPath = path.join(__dirname, '..', 'public', 'data', 'master-db.json');
const distPath = path.join(__dirname, '..', 'dist', 'data', 'master-db.json');

// Проверка исходного файла
if (!fs.existsSync(dbPath)) {
  console.error('❌ Файл master-db.json не найден:', dbPath);
  process.exit(1);
}

const stats = fs.statSync(dbPath);
const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
console.log(`📊 Размер файла: ${sizeMB} MB\n`);

// Загрузка и проверка JSON
let db;
try {
  const content = fs.readFileSync(dbPath, 'utf-8');
  db = JSON.parse(content);
  console.log('✅ JSON валиден\n');
} catch (err) {
  console.error('❌ Ошибка парсинга JSON:', err.message);
  process.exit(1);
}

// Проверка структуры
console.log('═'.repeat(60));
console.log('📋 СТРУКТУРА БАЗЫ ДАННЫХ');
console.log('═'.repeat(60));
console.log(`Version: ${db.version || 'N/A'}`);
console.log(`Devices: ${db.devices?.length || 0}`);
console.log(`Knowledge sections: ${Object.keys(db.knowledge || {}).length}\n`);

// Проверка базы знаний
const knowledge = db.knowledge || {};
const sections = [
  'errorCodes',
  'logicBoards',
  'icCompatibility',
  'cameraCompatibility',
  'measurements',
  'keyCombinations',
  'regionalCodes',
  'repairKnowledge',
  'articleSearchIndex'
];

console.log('═'.repeat(60));
console.log('📚 БАЗА ЗНАНИЙ');
console.log('═'.repeat(60));

let allOk = true;
sections.forEach(section => {
  const exists = !!knowledge[section];
  let info = '';
  
  if (exists) {
    const data = knowledge[section];
    if (Array.isArray(data)) {
      info = `${data.length} items`;
    } else if (typeof data === 'object' && data !== null) {
      const keys = Object.keys(data);
      if (keys.length > 0) {
        // Проверяем вложенные структуры
        if (data.itunes_restore_errors) {
          info = `${data.itunes_restore_errors.length} error codes`;
        } else if (data.specs) {
          info = `${Object.keys(data.specs).length} board specs`;
        } else if (data.basic) {
          info = `${Object.keys(data.basic).length} basic codes`;
        } else {
          info = `${keys.length} items`;
        }
      } else {
        info = 'empty';
      }
    } else {
      info = typeof data;
    }
  }
  
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${section}: ${exists ? info : 'MISSING'}`);
  
  if (!exists) {
    allOk = false;
  }
});

console.log('');

// Проверка dist версии
if (fs.existsSync(distPath)) {
  console.log('═'.repeat(60));
  console.log('📦 ПРОВЕРКА DIST ВЕРСИИ');
  console.log('═'.repeat(60));
  
  try {
    const distDb = JSON.parse(fs.readFileSync(distPath, 'utf-8'));
    const distKnowledge = distDb.knowledge || {};
    const distSections = Object.keys(distKnowledge).length;
    
    console.log(`✅ dist/master-db.json существует`);
    console.log(`Version: ${distDb.version || 'N/A'}`);
    console.log(`Knowledge sections: ${distSections}`);
    
    if (distSections === sections.length) {
      console.log('✅ Все секции базы знаний присутствуют в dist\n');
    } else {
      console.log(`⚠️  В dist только ${distSections} из ${sections.length} секций\n`);
    }
  } catch (err) {
    console.error(`❌ Ошибка чтения dist версии: ${err.message}\n`);
  }
} else {
  console.log('⚠️  dist/master-db.json не найден (нужно запустить build)\n');
}

// Итог
console.log('═'.repeat(60));
if (allOk) {
  console.log('✅ База знаний в порядке!');
  process.exit(0);
} else {
  console.log('❌ Обнаружены проблемы с базой знаний!');
  process.exit(1);
}
