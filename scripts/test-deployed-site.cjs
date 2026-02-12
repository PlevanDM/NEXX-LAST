#!/usr/bin/env node
/**
 * Test deployed site - all API endpoints and pages
 * Usage: node scripts/test-deployed-site.cjs [url]
 * Default: https://nexxgsm.com
 */

const SITE_URL = process.env.SITE_URL || process.argv[2] || 'https://nexxgsm.com';

const tests = [];

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  return { status: res.status, ok: res.ok, json, text };
}

async function runTests() {
  console.log('🧪 Testing deployed site:', SITE_URL);
  console.log('═'.repeat(50));

  // 1. Main page
  try {
    const r = await fetch(SITE_URL);
    const ok = r.ok;
    tests.push({ name: 'GET /', ok, status: r.status });
    console.log(ok ? '✅' : '❌', 'GET /', r.status);
  } catch (e) {
    tests.push({ name: 'GET /', ok: false });
    console.log('❌ GET /', e.message);
  }

  // 1b. Main page with mobile User-Agent (simulate phone)
  try {
    const r = await fetch(SITE_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' }
    });
    const text = await r.text();
    const hasViewport = text.includes('viewport') && text.includes('device-width');
    const hasApp = text.includes('id="app"') || text.includes('id=\'app\'');
    const ok = r.ok && hasViewport && hasApp;
    tests.push({ name: 'GET / (mobile UA)', ok, status: r.status });
    console.log(ok ? '✅' : '⚠️', 'GET / (mobile UA)', r.status, hasViewport && hasApp ? '(viewport+app)' : '');
  } catch (e) {
    tests.push({ name: 'GET / (mobile UA)', ok: false });
    console.log('❌ GET / (mobile UA)', e.message);
  }

  // 2. NEXX page (may redirect; accept 200 or 404 if route differs)
  try {
    const r = await fetch(SITE_URL + '/nexx', { redirect: 'follow' });
    const text = await r.text();
    const hasPin = text.includes('pin') || text.includes('пін') || text.includes('PIN') || text.includes('Introduceți');
    const ok = r.ok && (hasPin || text.length > 500);
    tests.push({ name: 'GET /nexx', ok, status: r.status });
    console.log(ok ? '✅' : '⚠️', 'GET /nexx', r.status, hasPin ? '(PIN screen)' : r.ok ? '(HTML)' : '');
  } catch (e) {
    tests.push({ name: 'GET /nexx', ok: false });
    console.log('⚠️ GET /nexx fetch failed (network/env):', e.message);
  }

  // 3. API RemOnline health
  try {
    const { status, json } = await fetchJson(SITE_URL + '/api/remonline?action=health');
    const ok = status === 200 && json?.success;
    tests.push({ name: 'GET /api/remonline?action=health', ok, status });
    console.log(ok ? '✅' : '❌', 'GET /api/remonline?action=health', status);
  } catch (e) {
    tests.push({ name: 'GET /api/remonline?action=health', ok: false });
    console.log('❌ GET /api/remonline?action=health', e.message);
  }

  // 4. API Callback (POST - creates order in RemOnline)
  try {
    const { status, json } = await fetchJson(SITE_URL + '/api/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+40700111222',
        name: 'Test Deploy',
        device: 'iPhone 15 Pro',
        problem: 'Test deploy verification'
      })
    });
    const ok = status === 200 && json?.success;
    tests.push({ name: 'POST /api/callback', ok, status });
    console.log(ok ? '✅' : '⚠️', 'POST /api/callback', status, json?.message || '');
  } catch (e) {
    tests.push({ name: 'POST /api/callback', ok: false });
    console.log('❌ POST /api/callback', e.message);
  }

  // 5. API Booking (POST)
  try {
    const { status, json } = await fetchJson(SITE_URL + '/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Booking',
        phone: '+40700111222',
        device: 'iPhone 14',
        problem: 'Display broken'
      })
    });
    const ok = status === 200 && json?.success;
    tests.push({ name: 'POST /api/booking', ok, status });
    console.log(ok ? '✅' : '⚠️', 'POST /api/booking', status, json?.message || '');
  } catch (e) {
    tests.push({ name: 'POST /api/booking', ok: false });
    console.log('❌ POST /api/booking', e.message);
  }

  // 6. API RemOnline POST (formType: booking)
  try {
    const { status, json } = await fetchJson(SITE_URL + '/api/remonline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'booking',
        customerName: 'Test Appt',
        customerPhone: '+40700111222',
        preferredDate: '2026-02-05',
        comment: 'Test deploy'
      })
    });
    const ok = status === 200 && json?.success;
    tests.push({ name: 'POST /api/remonline (booking)', ok, status });
    console.log(ok ? '✅' : '⚠️', 'POST /api/remonline (booking)', status);
  } catch (e) {
    tests.push({ name: 'POST /api/remonline (booking)', ok: false });
    console.log('❌ POST /api/remonline (booking)', e.message);
  }

  // 7. Static assets
  try {
    const r = await fetch(SITE_URL + '/static/nexx-logo.png');
    tests.push({ name: 'GET /static/nexx-logo.png', ok: r.ok, status: r.status });
    console.log(r.ok ? '✅' : '❌', 'GET /static/nexx-logo.png', r.status);
  } catch (e) {
    tests.push({ name: 'GET /static/nexx-logo.png', ok: false });
    console.log('❌ /static/nexx-logo.png', e.message);
  }

  // 8. Data chunks (requires auth - expect 401 without PIN)
  try {
    const r = await fetch(SITE_URL + '/data/chunks/config.json');
    tests.push({ name: 'GET /data/chunks/config.json', ok: r.status === 200 || r.status === 401, status: r.status });
    console.log(r.status === 200 ? '✅' : (r.status === 401 ? '🔒' : '❌'), 'GET /data/chunks/config.json', r.status, r.status === 401 ? '(auth required)' : '');
  } catch (e) {
    tests.push({ name: 'GET /data/chunks/config.json', ok: false });
    console.log('❌ /data/chunks/config.json', e.message);
  }

  // 9. GET RemOnline services (needs token)
  try {
    const { status } = await fetchJson(SITE_URL + '/api/remonline?action=get_services');
    const ok = status === 200;
    tests.push({ name: 'GET /api/remonline?action=get_services', ok, status });
    console.log(ok ? '✅' : '⚠️', 'GET /api/remonline?action=get_services', status);
  } catch (e) {
    tests.push({ name: 'GET /api/remonline?action=get_services', ok: false });
    console.log('❌ GET /api/remonline?action=get_services', e.message);
  }

  console.log('');
  const passed = tests.filter(t => t.ok).length;
  const total = tests.length;
  console.log(`Result: ${passed}/${total} passed`);
  process.exit(passed === total ? 0 : 1);
}

runTests().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
