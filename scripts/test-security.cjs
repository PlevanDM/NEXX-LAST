#!/usr/bin/env node
/**
 * Security Testing Checklist 2026
 * Based on OWASP Web Security Testing Guide
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://nexxgsm.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'test-results');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🔒 Security Testing Checklist 2026');
console.log('═'.repeat(60));
console.log(`Site: ${SITE_URL}\n`);

// Check URL
function checkUrl(url) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname,
      method: 'HEAD',
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          ok: res.statusCode < 400,
          headers: res.headers,
          https: true
        });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, ok: false, error: err.message, https: false });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, ok: false, error: 'Request timeout', https: false });
    });

    req.end();
  });
}

// Security checklist
const securityChecks = {
  'HTTPS & SSL': [
    { check: 'Site uses HTTPS', critical: true },
    { check: 'Valid SSL certificate', critical: true },
    { check: 'No mixed content warnings', critical: true },
    { check: 'HSTS header present', critical: false },
    { check: 'Strong cipher suites', critical: false }
  ],
  'Headers & Security': [
    { check: 'Content-Security-Policy (CSP) header', critical: true },
    { check: 'X-Frame-Options header', critical: true },
    { check: 'X-Content-Type-Options: nosniff', critical: true },
    { check: 'Referrer-Policy header', critical: false },
    { check: 'Permissions-Policy header', critical: false }
  ],
  'Input Validation': [
    { check: 'Forms validate input on client-side', critical: true },
    { check: 'Forms validate input on server-side', critical: true },
    { check: 'No SQL injection vulnerabilities', critical: true },
    { check: 'No XSS vulnerabilities', critical: true },
    { check: 'CSRF protection implemented', critical: true }
  ],
  'Authentication & Session': [
    { check: 'No hardcoded credentials', critical: true },
    { check: 'Session tokens are secure', critical: true },
    { check: 'Password requirements enforced', critical: false },
    { check: 'Rate limiting on login attempts', critical: false }
  ],
  'Data Protection': [
    { check: 'Sensitive data encrypted', critical: true },
    { check: 'No sensitive data in URLs', critical: true },
    { check: 'No sensitive data in console logs', critical: true },
    { check: 'GDPR compliance (if applicable)', critical: false }
  ]
};

// Run security checks
async function runSecurityChecks() {
  console.log('Running security checks...\n');
  
  const siteCheck = await checkUrl(SITE_URL);
  
  if (!siteCheck.ok) {
    console.error(`❌ Site not accessible: ${siteCheck.error || 'HTTP ' + siteCheck.status}`);
    process.exit(1);
  }
  
  console.log('✅ Site is accessible');
  console.log(`   Status: ${siteCheck.status}`);
  console.log(`   HTTPS: ${siteCheck.https ? '✅' : '❌'}\n`);
  
  // Check security headers
  const headers = siteCheck.headers || {};
  const securityHeaders = {
    'strict-transport-security': headers['strict-transport-security'] ? '✅' : '❌',
    'content-security-policy': headers['content-security-policy'] ? '✅' : '❌',
    'x-frame-options': headers['x-frame-options'] ? '✅' : '❌',
    'x-content-type-options': headers['x-content-type-options'] ? '✅' : '❌',
    'referrer-policy': headers['referrer-policy'] ? '✅' : '⚠️',
    'permissions-policy': headers['permissions-policy'] ? '✅' : '⚠️'
  };
  
  console.log('📋 Security Checklist:');
  console.log('═'.repeat(60));
  
  for (const [category, checks] of Object.entries(securityChecks)) {
    console.log(`\n🔐 ${category}:`);
    console.log('─'.repeat(50));
    
    checks.forEach(item => {
      const status = '⏳'; // Manual testing required
      const critical = item.critical ? ' [CRITICAL]' : '';
      console.log(`${status} ${item.check}${critical}`);
    });
  }
  
  console.log('\n📊 Security Headers Status:');
  console.log('═'.repeat(60));
  console.log(`Strict-Transport-Security: ${securityHeaders['strict-transport-security']}`);
  console.log(`Content-Security-Policy:   ${securityHeaders['content-security-policy']}`);
  console.log(`X-Frame-Options:           ${securityHeaders['x-frame-options']}`);
  console.log(`X-Content-Type-Options:    ${securityHeaders['x-content-type-options']}`);
  console.log(`Referrer-Policy:           ${securityHeaders['referrer-policy']}`);
  console.log(`Permissions-Policy:        ${securityHeaders['permissions-policy']}`);
  
  console.log('\n💡 Security Recommendations:');
  console.log('═'.repeat(60));
  console.log('   1. Use HTTPS everywhere (✅ Already using)');
  console.log('   2. Implement Content Security Policy');
  console.log('   3. Add security headers (X-Frame-Options, etc.)');
  console.log('   4. Regular security audits');
  console.log('   5. Keep dependencies updated');
  console.log('   6. Use OWASP Top 10 as reference');
  console.log('   7. Implement rate limiting');
  console.log('   8. Regular penetration testing');
  
  // Save report
  const report = {
    site: SITE_URL,
    checked: new Date().toISOString(),
    https: siteCheck.https,
    status: siteCheck.status,
    headers: securityHeaders,
    checklist: securityChecks,
    recommendations: [
      'Implement CSP header',
      'Add X-Frame-Options header',
      'Enable HSTS',
      'Regular security audits',
      'Keep dependencies updated'
    ]
  };
  
  const reportPath = path.join(OUTPUT_DIR, 'security-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report saved: ${reportPath}`);
  
  console.log('\n✅ Security check complete!');
  console.log('   Please perform manual security testing.');
}

// Run if executed directly
if (require.main === module) {
  runSecurityChecks();
}

module.exports = { securityChecks, runSecurityChecks };
