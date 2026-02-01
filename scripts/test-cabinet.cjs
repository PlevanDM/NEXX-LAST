#!/usr/bin/env node
/**
 * Test Cabinet API (login + orders)
 * Usage: node scripts/test-cabinet.cjs [BASE_URL]
 * BASE_URL default: http://127.0.0.1:8788 (run: npm run dev, then wrangler pages dev dist)
 * Or use deployed URL: node scripts/test-cabinet.cjs https://nexx.ro
 *
 * Requires REMONLINE_API_KEY in .dev.vars (for local) or use deployed site.
 * For login test you need a phone that exists as client in Remonline.
 */

const fs = require('fs');
const path = require('path');

function loadEnv(file) {
  const p = path.join(__dirname, '..', file);
  if (!fs.existsSync(p)) return {};
  const vars = {};
  fs.readFileSync(p, 'utf8').split('\n').forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
    if (m) vars[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  });
  return vars;
}

const env = { ...loadEnv('.dev.vars'), ...loadEnv('.env') };
const BASE = process.argv[2] || process.env.CABINET_TEST_BASE || 'http://127.0.0.1:8788';
const TEST_PHONE = process.env.CABINET_TEST_PHONE || ''; // e.g. +40721234567

async function main() {
  console.log('🔐 Cabinet API tests\n');
  console.log('Base URL:', BASE);
  console.log('');

  // 1. Health / remonline health
  try {
    const r = await fetch(`${BASE}/api/remonline?action=health`);
    const j = await r.json();
    if (j.success) {
      console.log('✅ GET /api/remonline?action=health — OK');
    } else {
      console.log('⚠️  GET /api/remonline?action=health —', j);
    }
  } catch (e) {
    console.log('❌ GET /api/remonline?action=health —', e.message);
  }

  // 2. Login without phone
  try {
    const r = await fetch(`${BASE}/api/cabinet/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const j = await r.json();
    if (r.status === 400 && !j.success) {
      console.log('✅ POST /api/cabinet/login (no phone) — 400 as expected');
    } else {
      console.log('⚠️  POST /api/cabinet/login (no phone) —', r.status, j);
    }
  } catch (e) {
    console.log('❌ POST /api/cabinet/login —', e.message);
  }

  // 3. Login with invalid phone
  try {
    const r = await fetch(`${BASE}/api/cabinet/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '1' })
    });
    const j = await r.json();
    if (r.status === 400 && !j.success) {
      console.log('✅ POST /api/cabinet/login (invalid phone) — 400 as expected');
    } else {
      console.log('⚠️  POST /api/cabinet/login (invalid phone) —', r.status, j);
    }
  } catch (e) {
    console.log('❌ POST /api/cabinet/login (invalid) —', e.message);
  }

  // 4. Login with real phone (optional)
  if (TEST_PHONE) {
    try {
      const r = await fetch(`${BASE}/api/cabinet/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: TEST_PHONE })
      });
      const j = await r.json();
      if (j.success && j.token) {
        console.log('✅ POST /api/cabinet/login (real phone) — token received');
        const r2 = await fetch(`${BASE}/api/cabinet/orders`, {
          headers: { Authorization: `Bearer ${j.token}` }
        });
        const j2 = await r2.json();
        if (j2.success && Array.isArray(j2.data)) {
          console.log('✅ GET /api/cabinet/orders —', j2.data.length, 'orders');
        } else {
          console.log('⚠️  GET /api/cabinet/orders —', j2.error || j2);
        }
      } else {
        console.log('⚠️  POST /api/cabinet/login (real phone) —', j.error || j.code || 'no token');
      }
    } catch (e) {
      console.log('❌ Cabinet login/orders (real phone) —', e.message);
    }
  } else {
    console.log('⏭️  POST /api/cabinet/login (real phone) — skip (set CABINET_TEST_PHONE to test)');
  }

  // 5. Orders without token
  try {
    const r = await fetch(`${BASE}/api/cabinet/orders`);
    const j = await r.json();
    if (r.status === 401 && !j.success) {
      console.log('✅ GET /api/cabinet/orders (no token) — 401 as expected');
    } else {
      console.log('⚠️  GET /api/cabinet/orders (no token) —', r.status, j);
    }
  } catch (e) {
    console.log('❌ GET /api/cabinet/orders —', e.message);
  }

  console.log('\n📋 Done. Set CABINET_TEST_PHONE=+40... to test real login.');
}

main().catch(console.error);
