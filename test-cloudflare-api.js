/**
 * NEXX WebApp - Cloudflare Global API Test (Node.js)
 * Тестує підключення до Cloudflare API
 */

const API_BASE = 'https://api.cloudflare.com/client/v4';
const TOKEN = process.env.CLOUDFLARE_API_TOKEN || '519bdfbd2efeaa9c3a418b905202058bac2fc';
const EMAIL = process.env.CLOUDFLARE_EMAIL || 'dmitro.plevan@gmail.com';
const GLOBAL_API_KEY = process.env.CLOUDFLARE_GLOBAL_API_KEY;

// Try both formats - API Token and Global API Key
// API Token: Authorization: Bearer <token>
// Global API Key: X-Auth-Key + X-Auth-Email

async function makeRequest(url, useApiToken = true) {
  const headers = useApiToken
    ? {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    : {
        'X-Auth-Key': TOKEN,
        'X-Auth-Email': EMAIL,
        'Content-Type': 'application/json'
      };
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers
    });
    
    const data = await response.json();
    return { success: data.success, data, error: data.errors?.[0], status: response.status };
  } catch (error) {
    return { success: false, error: { message: error.message }, status: 0 };
  }
}

async function testAPI() {
  console.log('🌐 Тестування Cloudflare Global API...\n');
  console.log(`📋 Конфігурація:`);
  console.log(`   Token: ${TOKEN.substring(0, 8)}...`);
  console.log(`   Email: ${EMAIL}`);
  console.log(`   API Base: ${API_BASE}\n`);

  // Test 1: Verify Token (try both formats)
  console.log('1️⃣  Тест: Перевірка токену (GET /user/tokens/verify)');
  let result = await makeRequest(`${API_BASE}/user/tokens/verify`, true);
  
  if (!result.success && result.status === 401) {
    console.log('   ⚠️  API Token не працює, спробую Global API Key...');
    result = await makeRequest(`${API_BASE}/user/tokens/verify`, false);
  }
  
  if (result.success) {
    console.log('   ✅ Токен валідний!');
    console.log(`   📧 Email: ${result.data.result.email}`);
    console.log(`   🆔 ID: ${result.data.result.id}`);
  } else {
    console.log(`   ❌ Помилка: ${result.error?.message || 'Unknown error'}`);
    console.log(`   📊 Status: ${result.status}`);
  }
  console.log('');

  // Test 2: Get User Details
  console.log('2️⃣  Тест: Отримання інформації про користувача (GET /user)');
  result = await makeRequest(`${API_BASE}/user`, true);
  
  if (!result.success && result.status === 401) {
    result = await makeRequest(`${API_BASE}/user`, false);
  }
  
  if (result.success) {
    console.log('   ✅ Дані отримано!');
    console.log(`   👤 Ім'я: ${result.data.result.first_name} ${result.data.result.last_name}`);
    console.log(`   📧 Email: ${result.data.result.email}`);
    console.log(`   🌍 Країна: ${result.data.result.country}`);
  } else {
    console.log(`   ❌ Помилка: ${result.error?.message || 'Unknown error'}`);
    console.log(`   📊 Status: ${result.status}`);
  }
  console.log('');

  // Test 3: List Zones
  console.log('3️⃣  Тест: Список зон (GET /zones)');
  result = await makeRequest(`${API_BASE}/zones`, true);
  
  if (!result.success && result.status === 401) {
    result = await makeRequest(`${API_BASE}/zones`, false);
  }
  
  if (result.success) {
    console.log(`   ✅ Знайдено зон: ${result.data.result.length}`);
    result.data.result.forEach(zone => {
      console.log(`   🌐 ${zone.name} (ID: ${zone.id})`);
    });
  } else {
    console.log(`   ❌ Помилка: ${result.error?.message || 'Unknown error'}`);
    console.log(`   📊 Status: ${result.status}`);
  }
  console.log('');

  // Test 4: List Accounts
  console.log('4️⃣  Тест: Список акаунтів (GET /accounts)');
  result = await makeRequest(`${API_BASE}/accounts`, true);
  
  if (!result.success && result.status === 401) {
    result = await makeRequest(`${API_BASE}/accounts`, false);
  }
  
  if (result.success) {
    console.log(`   ✅ Знайдено акаунтів: ${result.data.result.length}`);
    result.data.result.forEach(account => {
      console.log(`   🏢 ${account.name} (ID: ${account.id})`);
    });
  } else {
    console.log(`   ❌ Помилка: ${result.error?.message || 'Unknown error'}`);
    console.log(`   📊 Status: ${result.status}`);
  }
  console.log('');

  console.log('✅ Тестування завершено!\n');
  console.log('💡 Для використання токену в Wrangler:');
  console.log('   wrangler secret put CLOUDFLARE_API_TOKEN');
  console.log('   (введіть токен при запиті)\n');
}

// Run tests
testAPI().catch(console.error);
