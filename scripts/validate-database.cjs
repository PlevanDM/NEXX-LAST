#!/usr/bin/env node
/**
 * NEXX Database Validator
 * Checks the integrity and correctness of the database data
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 NEXX Database Validator\n');

const errors = [];
const warnings = [];

// Load devices.json
const devicesPath = path.join(__dirname, '..', 'public', 'data', 'devices.json');
if (!fs.existsSync(devicesPath)) {
  console.error('❌ Error: devices.json not found at ' + devicesPath);
  process.exit(1);
}

const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf-8'));

console.log(`📊 Devices loaded: ${devices.length}\n`);

// ============================================
// CHECK 1: Name and Category Consistency
// ============================================

console.log('1️⃣  Checking name and category consistency...');

devices.forEach((device, idx) => {
  const name = device.name?.toLowerCase() || '';
  const category = device.category?.toLowerCase() || '';
  
  // iPhone should be in iPhone category
  if (name.includes('iphone') && !category.includes('iphone')) {
    errors.push({
      index: idx,
      device: device.name,
      issue: `iPhone in category "${device.category}" (should be "iPhone")`
    });
  }
  
  // Samsung should be in Samsung/Galaxy category
  if (name.includes('samsung') && !(category.includes('samsung') || category.includes('galaxy'))) {
    errors.push({
      index: idx,
      device: device.name,
      issue: `Samsung in category "${device.category}" (should be "Samsung" or "Galaxy")`
    });
  }
  
  // MacBook should be in MacBook category
  if (name.includes('macbook') && !category.includes('macbook')) {
    errors.push({
      index: idx,
      device: device.name,
      issue: `MacBook in category "${device.category}" (should be "MacBook")`
    });
  }
  
  // iPad should be in iPad category
  if (name.includes('ipad') && !category.includes('ipad')) {
    errors.push({
      index: idx,
      device: device.name,
      issue: `iPad in category "${device.category}" (should be "iPad")`
    });
  }
});

console.log(`   Category errors found: ${errors.filter(e => e.issue.includes('category')).length}`);

// ============================================
// CHECK 2: Required Fields
// ============================================

console.log('2️⃣  Checking required fields...');

const requiredFields = ['name', 'category', 'brand', 'device_type'];

devices.forEach((device, idx) => {
  requiredFields.forEach(field => {
    if (!device[field] || device[field] === 'undefined') {
      errors.push({
        index: idx,
        device: device.name || `Device #${idx}`,
        issue: `Missing or invalid required field: ${field}`
      });
    }
  });
  
  // Check empty names
  if (device.name && device.name.trim() === '') {
    errors.push({
      index: idx,
      device: `Device #${idx}`,
      issue: 'Empty device name'
    });
  }
});

console.log(`   Field errors found: ${errors.filter(e => e.issue.includes('field') || e.issue.includes('name')).length}`);

// ============================================
// CHECK 3: Duplicates
// ============================================

console.log('3️⃣  Checking for duplicates...');

const nameMap = new Map();

devices.forEach((device, idx) => {
  const name = device.name;
  if (nameMap.has(name)) {
    warnings.push({
      index: idx,
      device: name,
      issue: `Duplicate device (first seen at index ${nameMap.get(name)})`
    });
  } else {
    nameMap.set(name, idx);
  }
});

console.log(`   Duplicates found: ${warnings.filter(w => w.issue.includes('Duplicate')).length}`);

// ============================================
// CHECK 4: Price Correctness
// ============================================

console.log('4️⃣  Checking prices...');

devices.forEach((device, idx) => {
  const prices = device.official_service_prices;
  
  if (prices) {
    // Check negative prices
    Object.entries(prices).forEach(([key, value]) => {
      if (typeof value === 'number' && value < 0) {
        errors.push({
          index: idx,
          device: device.name,
          issue: `Negative price for ${key}: ${value}`
        });
      }
      
      // Check suspiciously high prices
      if (typeof value === 'number' && value > 10000) {
        warnings.push({
          index: idx,
          device: device.name,
          issue: `Suspiciously high price for ${key}: ${value}`
        });
      }
    });
  }
});

console.log(`   Price errors found: ${errors.filter(e => e.issue.includes('price')).length}`);

// ============================================
// CHECK 5: Release Years
// ============================================

console.log('5️⃣  Checking release years...');

devices.forEach((device, idx) => {
  if (device.year) {
    // Check future year
    if (device.year > 2026) {
      errors.push({
        index: idx,
        device: device.name,
        issue: `Year in future: ${device.year}`
      });
    }
    
    // Check too old year
    if (device.year < 2000) {
      warnings.push({
        index: idx,
        device: device.name,
        issue: `Very old device: ${device.year}`
      });
    }
  }
});

console.log(`   Year errors found: ${errors.filter(e => e.issue.includes('Year')).length}`);

// ============================================
// FINAL REPORT
// ============================================

console.log('\n' + '='.repeat(60));
console.log('📋 FINAL VALIDATION REPORT');
console.log('='.repeat(60) + '\n');

console.log(`✅ Total devices checked: ${devices.length}`);
console.log(`❌ Critical errors: ${errors.length}`);
console.log(`⚠️  Warnings: ${warnings.length}\n`);

if (errors.length > 0) {
  console.log('❌ CRITICAL ERRORS:\n');
  errors.slice(0, 20).forEach((err, i) => {
    console.log(`${i + 1}. [${err.index}] ${err.device}`);
    console.log(`   └─ ${err.issue}\n`);
  });
  
  if (errors.length > 20) {
    console.log(`... and ${errors.length - 20} more errors\n`);
  }
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:\n');
  warnings.slice(0, 10).forEach((warn, i) => {
    console.log(`${i + 1}. [${warn.index}] ${warn.device}`);
    console.log(`   └─ ${warn.issue}\n`);
  });
  
  if (warnings.length > 10) {
    console.log(`... and ${warnings.length - 10} more warnings\n`);
  }
}

// Save report
const report = {
  timestamp: new Date().toISOString(),
  totalDevices: devices.length,
  errors: errors,
  warnings: warnings,
  summary: {
    criticalErrors: errors.length,
    warnings: warnings.length,
    status: errors.length === 0 ? 'PASS' : 'FAIL'
  }
};

const reportPath = path.join(__dirname, '..', 'database-validation-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\n📄 Full report saved to: database-validation-report.json\n`);

if (errors.length === 0) {
  console.log('🎉 Database is valid!\n');
  process.exit(0);
} else {
  console.log('❌ Critical errors found! Fix required.\n');
  process.exit(1);
}
