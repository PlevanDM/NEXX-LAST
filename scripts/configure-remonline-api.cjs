#!/usr/bin/env node
/**
 * Configure RemOnline via API
 * Fetches branches, order types, statuses, services and updates remonline.config.json
 * Usage: node scripts/configure-remonline-api.cjs [--api-key=xxx]
 * Or set REMONLINE_API_KEY in env / .dev.vars
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.REMONLINE_API_KEY || process.argv.find(a => a.startsWith('--api-key='))?.split('=')[1] || '';
const BASE = process.env.REMONLINE_BASE_URL || 'https://api.remonline.app';

if (!API_KEY) {
  console.error('❌ REMONLINE_API_KEY required. Set in .dev.vars or pass --api-key=xxx');
  process.exit(1);
}

async function getToken() {
  const res = await fetch(`${BASE}/token/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `api_key=${API_KEY}`
  });
  const json = await res.json();
  if (!json.success || !json.token) {
    throw new Error('Failed to get token: ' + JSON.stringify(json));
  }
  return json.token;
}

async function main() {
  console.log('🔌 RemOnline API configuration...\n');

  const token = await getToken();
  console.log('✅ Token OK');

  const [branchesRes, ordersRes, statusesRes, servicesRes] = await Promise.all([
    fetch(`${BASE}/branches/?token=${token}`),
    fetch(`${BASE}/order/?token=${token}&per_page=1`),
    fetch(`${BASE}/statuses/?token=${token}`),
    fetch(`${BASE}/services/?token=${token}`)
  ]);

  const branches = (await branchesRes.json()).data || [];
  const ordersData = await ordersRes.json();
  const order = ordersData.data?.[0];
  const statuses = (await statusesRes.json()).data || [];
  const services = (await servicesRes.json()).data || [];

  const branchId = order?.branch_id || (branches[0]?.id ?? 218970);
  const orderTypeId = order?.order_type?.id ?? 334611;
  const orderTypeName = order?.order_type?.name || 'Carry-in repair';

  const branch = branches.find(b => b.id === branchId) || branches[0];
  console.log('📍 Branches:', branches.map(b => `${b.id}: ${b.name}`).join(', '));
  console.log('   Using branch:', branchId, branch?.name || '');
  console.log('📋 Order type:', orderTypeId, orderTypeName);
  console.log('📊 Statuses:', statuses.length);
  console.log('🛠️ Services:', services.length);

  const configPath = path.join(__dirname, '..', 'remonline.config.json');
  const config = {
    baseUrl: BASE,
    branchId: String(branchId),
    orderType: String(orderTypeId),
    orderTypeName,
    testMode: false,
    note: 'REMONLINE_API_KEY in env (.dev.vars local, Cloudflare secrets prod). Auto-configured by scripts/configure-remonline-api.cjs',
    endpoints: {
      orders: '/order',
      inquiries: '/inquiries',
      services: '/services',
      people: '/people',
      branches: '/branches',
      statuses: '/statuses',
      clients: '/clients'
    },
    branches: branches.map(b => ({ id: b.id, name: b.name })),
    statuses: statuses.slice(0, 15).map(s => ({ id: s.id, name: s.name })),
    lastConfigured: new Date().toISOString()
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('\n✅ remonline.config.json updated');

  const devVarsPath = path.join(__dirname, '..', '.dev.vars');
  if (!fs.existsSync(devVarsPath)) {
    const devVars = `# RemOnline - local dev (gitignored)
REMONLINE_API_KEY=${API_KEY}
REMONLINE_BASE_URL=${BASE}
REMONLINE_BRANCH_ID=${branchId}
REMONLINE_ORDER_TYPE=${orderTypeId}
`;
    fs.writeFileSync(devVarsPath, devVars);
    console.log('✅ .dev.vars created');
  } else {
    const devVars = fs.readFileSync(devVarsPath, 'utf8');
    const updated = devVars
      .replace(/REMONLINE_BRANCH_ID=.*/m, `REMONLINE_BRANCH_ID=${branchId}`)
      .replace(/REMONLINE_ORDER_TYPE=.*/m, `REMONLINE_ORDER_TYPE=${orderTypeId}`);
    if (updated !== devVars) {
      fs.writeFileSync(devVarsPath, updated);
      console.log('✅ .dev.vars updated (branch, order_type)');
    }
  }

  console.log('\n📋 Production: set in Cloudflare Dashboard → Pages → nexx-gsm → Environment variables:');
  console.log('   REMONLINE_API_KEY, REMONLINE_BRANCH_ID, REMONLINE_ORDER_TYPE');
}

main().catch(e => {
  console.error('❌', e.message);
  process.exit(1);
});
