const fs = require('fs');
const path = require('path');

// Курс UAH/USD на 19.01.2026
const EXCHANGE_RATE = 41.5; // 1 USD = 41.5 UAH (актуальный курс)

/**
 * Нормализация цен - приведение к единой валюте (UAH)
 * с сохранением отображения в USD
 */
function normalizePrices() {
  console.log('💰 Начало нормализации цен...\n');
  
  // Проверяем наличие файлов с ценами
  const possiblePriceFiles = [
    './public/data/combined_prices.json',
    './public/data/ukraine_prices.json',
    './public/data/price_list.json'
  ];
  
  let processedFiles = 0;
  let totalConverted = 0;
  let totalItems = 0;
  
  possiblePriceFiles.forEach(pricesPath => {
    if (!fs.existsSync(pricesPath)) {
      console.log(`⏭️  Пропуск ${path.basename(pricesPath)} (файл не найден)`);
      return;
    }
    
    console.log(`📄 Обработка ${path.basename(pricesPath)}...`);
    
    const prices = JSON.parse(fs.readFileSync(pricesPath, 'utf-8'));
    let converted = 0;
    let skipped = 0;
    
    const normalized = prices.map(item => {
      totalItems++;
      
      // Проверяем наличие цены в USD и конвертируем в UAH
      if (item.price_usd && !item.price_uah) {
        item.price_uah = Math.round(item.price_usd * EXCHANGE_RATE);
        item.price_usd_original = item.price_usd;
        item.converted_at = new Date().toISOString();
        item.exchange_rate_used = EXCHANGE_RATE;
        delete item.price_usd;
        converted++;
        totalConverted++;
      } 
      // Если есть UAH, добавляем display в USD
      else if (item.price_uah && !item.price_usd_display) {
        item.price_usd_display = (item.price_uah / EXCHANGE_RATE).toFixed(2);
      }
      // Если нет ни UAH, ни USD
      else if (!item.price_uah && !item.price_usd) {
        skipped++;
      }
      
      return item;
    });
    
    // Сохраняем обновленный файл
    fs.writeFileSync(pricesPath, JSON.stringify(normalized, null, 2), 'utf-8');
    
    console.log(`  ✅ Конвертовано: ${converted} позиций`);
    console.log(`  ⏭️  Пропущено: ${skipped} позиций (нет цены)`);
    console.log(`  📊 Всего в файле: ${normalized.length} позиций\n`);
    
    processedFiles++;
  });
  
  // Итоговый отчет
  console.log('='*60);
  console.log('📊 ИТОГОВЫЙ ОТЧЕТ НОРМАЛИЗАЦИИ ЦЕН');
  console.log('='*60);
  console.log(`Обработано файлов: ${processedFiles}`);
  console.log(`Всего позиций: ${totalItems}`);
  console.log(`Конвертировано: ${totalConverted}`);
  console.log(`Курс использован: 1 USD = ${EXCHANGE_RATE} UAH`);
  console.log('='*60);
}

// Запуск
try {
  normalizePrices();
  console.log('\n✅ Нормализация цен завершена успешно!');
} catch (error) {
  console.error('❌ Ошибка при нормализации цен:', error.message);
  process.exit(1);
}
