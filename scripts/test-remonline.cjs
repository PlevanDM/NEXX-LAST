#!/usr/bin/env node
/**
 * Тест подключения к Remonline API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'remonline.config.json'), 'utf-8')
);

console.log('🔗 Тестирование Remonline API\n');
console.log(`Base URL: ${config.baseUrl}`);
console.log(`API Key: ${config.apiKey.substring(0, 8)}...`);
console.log('');

// Тест 1: Получить настройки компании
async function testGetSettings() {
  console.log('1️⃣  Тест: GET /api/settings/company');
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.remonline.app',
      path: '/api/settings/company',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ SUCCESS - Подключение работает!');
          try {
            const result = JSON.parse(data);
            console.log(`   Компания: ${result.name || 'N/A'}`);
          } catch (e) {
            console.log('   Response:', data.substring(0, 100));
          }
        } else {
          console.log(`   ❌ FAILED - Status: ${res.statusCode}`);
          console.log(`   Response: ${data.substring(0, 200)}`);
        }
        console.log('');
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ ERROR: ${error.message}\n`);
      resolve();
    });
    
    req.end();
  });
}

// Тест 2: Создать тестовый Inquiry (лид)
async function testCreateInquiry() {
  console.log('2️⃣  Тест: POST /api/inquiries (создание лида)');
  
  const inquiryData = JSON.stringify({
    type_id: 1,
    description: 'TEST: Калькулятор цен - iPhone 15 Pro, замена батареи',
    source: 'website_test',
    contact: {
      phone: '+40721234567',
      name: 'Test Client'
    }
  });
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.remonline.app',
      path: '/api/inquiries',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': inquiryData.length
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('   ✅ SUCCESS - Лид создан!');
          try {
            const result = JSON.parse(data);
            console.log(`   ID лида: ${result.id || 'N/A'}`);
          } catch (e) {
            console.log('   Response:', data.substring(0, 100));
          }
        } else {
          console.log(`   ❌ FAILED - Status: ${res.statusCode}`);
          console.log(`   Response: ${data.substring(0, 200)}`);
        }
        console.log('');
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ ERROR: ${error.message}\n`);
      resolve();
    });
    
    req.write(inquiryData);
    req.end();
  });
}

// Запуск тестов
(async () => {
  console.log('═'.repeat(60));
  console.log('ТЕСТИРОВАНИЕ REMONLINE API');
  console.log('═'.repeat(60) + '\n');
  
  await testGetSettings();
  await testCreateInquiry();
  
  console.log('═'.repeat(60));
  console.log('ТЕСТИРОВАНИЕ ЗАВЕРШЕНО');
  console.log('═'.repeat(60) + '\n');
  
  console.log('Следующие шаги:');
  console.log('1. Если тесты успешны - добавьте API ключ в Cloudflare');
  console.log('2. Задеплойте сайт: .\\deploy.ps1');
  console.log('3. Проверьте создание лидов на реальном сайте\n');
})();
