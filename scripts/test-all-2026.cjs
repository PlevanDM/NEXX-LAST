#!/usr/bin/env node
/**
 * Complete Testing Suite 2026
 * Based on Web Testing Best Practices 2026
 * 
 * Runs all tests: Functional, Compatibility, Performance (Lighthouse)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'test-results');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🧪 Complete Testing Suite 2026');
console.log('═'.repeat(60));
console.log('Based on Web Testing Best Practices 2026\n');

const tests = [
  {
    name: 'Functional Testing Checklist',
    script: 'test:functional',
    required: true
  },
  {
    name: 'Browser Compatibility',
    script: 'test:compatibility',
    required: true
  },
  {
    name: 'Lighthouse Performance',
    script: 'test:lighthouse',
    required: false,
    note: 'Requires Lighthouse CLI (npm install -g lighthouse)'
  },
  {
    name: 'Security Checklist',
    script: 'test:security',
    required: false,
    note: 'Security headers and best practices check'
  },
  {
    name: 'SEO Checklist',
    script: 'test:seo',
    required: false,
    note: 'SEO meta tags and structure check'
  }
];

const results = {
  passed: [],
  failed: [],
  skipped: []
};

async function runTests() {
  console.log('Starting test suite...\n');
  
  for (const test of tests) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`Running: ${test.name}`);
    console.log('═'.repeat(60));
    
    try {
      execSync(`npm run ${test.script}`, { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      results.passed.push(test.name);
      console.log(`\n✅ ${test.name} - PASSED`);
    } catch (error) {
      if (test.required) {
        results.failed.push(test.name);
        console.log(`\n❌ ${test.name} - FAILED`);
        if (error.message) {
          console.log(`   Error: ${error.message.substring(0, 100)}`);
        }
      } else {
        results.skipped.push(test.name);
        console.log(`\n⚠️  ${test.name} - SKIPPED${test.note ? ` (${test.note})` : ''}`);
      }
    }
  }
  
  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 Test Suite Summary');
  console.log('═'.repeat(60));
  console.log(`✅ Passed:  ${results.passed.length}`);
  results.passed.forEach(t => console.log(`   - ${t}`));
  
  if (results.failed.length > 0) {
    console.log(`\n❌ Failed:  ${results.failed.length}`);
    results.failed.forEach(t => console.log(`   - ${t}`));
  }
  
  if (results.skipped.length > 0) {
    console.log(`\n⚠️  Skipped: ${results.skipped.length}`);
    results.skipped.forEach(t => console.log(`   - ${t}`));
  }
  
  // Save summary
  const summary = {
    timestamp: new Date().toISOString(),
    results,
    total: tests.length,
    passed: results.passed.length,
    failed: results.failed.length,
    skipped: results.skipped.length
  };
  
  const summaryPath = path.join(OUTPUT_DIR, 'test-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n📄 Summary saved: ${summaryPath}`);
  
  // Exit code
  if (results.failed.length > 0) {
    console.log('\n❌ Some required tests failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All required tests passed!');
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
