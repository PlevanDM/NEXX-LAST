const fs = require('fs');
const path = require('path');

// Паттерн для board numbers Apple: 820-XXXXX или 820-XXXXX-X
const boardNumberPattern = /^820-\d{5}(-[A-Z])?$/;

/**
 * Валидация board numbers на соответствие формату Apple
 */
function validateBoardNumbers() {
  console.log('🔍 Начало валидации board numbers...\n');
  
  const devicesPath = './public/data/devices_enhanced.json';
  
  if (!fs.existsSync(devicesPath)) {
    console.error('❌ Файл devices_enhanced.json не найден!');
    process.exit(1);
  }
  
  const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf-8'));
  
  const issues = [];
  const stats = {
    total_devices: devices.length,
    with_boards: 0,
    valid_boards: 0,
    invalid_boards: 0,
    tbd_boards: 0,
    missing_boards: 0
  };
  
  devices.forEach(device => {
    const deviceName = device.name || 'Unknown';
    let hasBoard = false;
    
    // Проверка board_number (единичное поле)
    if (device.board_number) {
      hasBoard = true;
      stats.with_boards++;
      
      if (device.board_number === 'TBD') {
        stats.tbd_boards++;
      } else if (boardNumberPattern.test(device.board_number)) {
        stats.valid_boards++;
      } else {
        stats.invalid_boards++;
        issues.push({
          device: deviceName,
          board: device.board_number,
          issue: 'Неправильный формат (должен быть 820-XXXXX или 820-XXXXX-X)'
        });
      }
    }
    
    // Проверка board_numbers (массив)
    if (device.board_numbers && Array.isArray(device.board_numbers)) {
      hasBoard = true;
      
      device.board_numbers.forEach(bn => {
        if (bn === 'TBD') {
          stats.tbd_boards++;
        } else if (boardNumberPattern.test(bn)) {
          stats.valid_boards++;
        } else {
          stats.invalid_boards++;
          issues.push({
            device: deviceName,
            board: bn,
            issue: 'Неправильный формат (должен быть 820-XXXXX или 820-XXXXX-X)'
          });
        }
      });
    }
    
    // Проверка board_numbers.main (вложенный массив)
    if (device.board_numbers && device.board_numbers.main && Array.isArray(device.board_numbers.main)) {
      hasBoard = true;
      
      device.board_numbers.main.forEach(bn => {
        if (bn === 'TBD') {
          stats.tbd_boards++;
        } else if (boardNumberPattern.test(bn)) {
          stats.valid_boards++;
        } else {
          stats.invalid_boards++;
          issues.push({
            device: deviceName,
            board: bn,
            issue: 'Неправильный формат (должен быть 820-XXXXX или 820-XXXXX-X)'
          });
        }
      });
    }
    
    if (!hasBoard) {
      stats.missing_boards++;
    }
  });
  
  // Вывод отчета
  console.log('='*60);
  console.log('📊 ОТЧЕТ ВАЛИДАЦИИ BOARD NUMBERS');
  console.log('='*60);
  console.log(`\n📈 СТАТИСТИКА:`);
  console.log(`  Всего устройств: ${stats.total_devices}`);
  console.log(`  С board numbers: ${stats.with_boards}`);
  console.log(`  Без board numbers: ${stats.missing_boards}`);
  console.log(`  Валидных board numbers: ${stats.valid_boards}`);
  console.log(`  Невалидных board numbers: ${stats.invalid_boards}`);
  console.log(`  TBD (To Be Determined): ${stats.tbd_boards}`);
  
  if (issues.length > 0) {
    console.log(`\n❌ НАЙДЕНО ПРОБЛЕМ: ${issues.length}`);
    console.log('\nСписок проблем:');
    issues.forEach((issue, idx) => {
      console.log(`  ${idx + 1}. ${issue.device}`);
      console.log(`     Board: ${issue.board}`);
      console.log(`     Issue: ${issue.issue}\n`);
    });
    
    // Предложение автоматического исправления
    console.log('💡 РЕКОМЕНДАЦИИ:');
    console.log('  1. Проверить board numbers в источниках (everymac.com, ifixit.com)');
    console.log('  2. Использовать формат 820-XXXXX или 820-XXXXX-X');
    console.log('  3. Для неизвестных плат использовать "TBD"');
  } else {
    console.log('\n✅ ВСЕ BOARD NUMBERS КОРРЕКТНЫ!');
  }
  
  console.log('='*60);
  
  // Возврат кода ошибки, если есть проблемы
  if (issues.length > 0) {
    process.exit(1);
  }
}

// Запуск
try {
  validateBoardNumbers();
  console.log('\n✅ Валидация board numbers завершена успешно!');
} catch (error) {
  console.error('❌ Ошибка при валидации board numbers:', error.message);
  process.exit(1);
}
