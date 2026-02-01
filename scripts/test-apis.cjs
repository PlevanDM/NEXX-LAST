#!/usr/bin/env node
/**
 * Test RemOnline & Cloudflare APIs
 * Usage: node scripts/test-apis.cjs
 * Reads from .env or .dev.vars
 */

const fs = require('fs');
const path = require('path');

function loadEnv(file) {
  const p = path.join(__dirname, '..', file);
  if (!fs.existsSync(p)) return {};
  const vars = {};
  fs.readFileSync(p, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
    if (m) vars[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  });
  return vars;
}

const env = { ...loadEnv('.dev.vars'), ...loadEnv('.env') };
const REMONLINE_KEY = env.REMONLINE_API_KEY;
const CF_KEY = env.CLOUDFLARE_API_KEY || env.CLOUDFLARE_GLOBAL_API_KEY;
const CF_EMAIL = env.CLOUDFLARE_EMAIL;
const CF_ZONE_ID = env.CLOUDFLARE_ZONE_ID;
const CF_ZONE_NAME = env.CLOUDFLARE_ZONE_NAME || 'nexxgsm.com';

async function testRemOnline() {
  if (!REMONLINE_KEY) {
    console.log('⏭️  RemOnline: no API key (set in .env)');
    return;
  }
  try {
    const tokenRes = await fetch('https://api.remonline.app/token/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `api_key=${REMONLINE_KEY}`
    });
    const tokenJson = await tokenRes.json();
    if (!tokenJson.success || !tokenJson.token) {
      console.log('❌ RemOnline token:', tokenJson.message || 'failed');
      return;
    }
    const branchesRes = await fetch(`https://api.remonline.app/branches/?token=${tokenJson.token}`);
    const branches = (await branchesRes.json()).data || [];
    console.log('✅ RemOnline: OK', `(${branches.length} branches)`);
  } catch (e) {
    console.log('❌ RemOnline:', e.message);
  }
}

async function testCloudflare() {
  if (!CF_KEY || !CF_EMAIL) {
    console.log('⏭️  Cloudflare: no API key/email (set in .env)');
    return;
  }
  try {
    let url;
    if (CF_ZONE_ID) {
      url = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}`;
    } else {
      url = `https://api.cloudflare.com/client/v4/zones?name=${encodeURIComponent(CF_ZONE_NAME)}`;
    }
    const res = await fetch(url, {
      headers: { 'X-Auth-Key': CF_KEY, 'X-Auth-Email': CF_EMAIL }
    });
    const json = await res.json();
    if (!json.success) {
      const err = json.errors?.[0];
      if (err?.code === 6003) {
        console.log('⚠️  Cloudflare: Global API Key invalid (use API Token)');
      } else {
        console.log('❌ Cloudflare:', err?.message || 'auth failed');
      }
      return;
    }
    const zone = json.result?.[0] || json.result;
    if (zone) {
      console.log('✅ Cloudflare: OK', `(zone ${zone.name || CF_ZONE_NAME})`);
    } else {
      console.log('⚠️  Cloudflare: auth OK, zone not found');
    }
  } catch (e) {
    console.log('❌ Cloudflare:', e.message);
  }
}

async function main() {
  console.log('🔌 Testing APIs...\n');
  await testRemOnline();
  await testCloudflare();
  console.log('\n📋 Config: .env, .dev.vars');
}

main().catch(console.error);
