#!/usr/bin/env node
/**
 * Cloudflare Global API test (X-Auth-Key + X-Auth-Email)
 * Usage:
 *   CLOUDFLARE_GLOBAL_API_KEY=xxx CLOUDFLARE_EMAIL=yyy node test-cloudflare-api.js
 *   Or: npm run test:cf-api (set env in .env or shell)
 */

const GLOBAL_API_KEY = process.env.CLOUDFLARE_GLOBAL_API_KEY || process.env.X_AUTH_KEY;
const EMAIL = process.env.CLOUDFLARE_EMAIL || process.env.X_AUTH_EMAIL;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'ad170d773e79a037e28f4530fd5305a5';
const PROJECT_NAME = process.env.CLOUDFLARE_PAGES_PROJECT || 'nexx-gsm';

const BASE = 'https://api.cloudflare.com/client/v4';

async function cfFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'X-Auth-Key': GLOBAL_API_KEY,
      'X-Auth-Email': EMAIL,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!data.success) {
    const err = new Error(data.errors?.[0]?.message || JSON.stringify(data.errors));
    err.apiErrors = data.errors;
    throw err;
  }
  return data;
}

async function main() {
  console.log('Cloudflare Global API test\n');

  if (!GLOBAL_API_KEY || !EMAIL) {
    console.error('Set CLOUDFLARE_GLOBAL_API_KEY and CLOUDFLARE_EMAIL (or X_AUTH_KEY, X_AUTH_EMAIL)');
    console.error('Example: CLOUDFLARE_GLOBAL_API_KEY=xxx CLOUDFLARE_EMAIL=you@example.com node test-cloudflare-api.js');
    process.exit(1);
  }

  try {
    // 1. Verify credentials (user)
    console.log('1. Verifying credentials (user)...');
    const user = await cfFetch('/user');
    console.log('   OK User:', user.result.email);

    // 2. List Pages projects
    console.log('\n2. Listing Pages projects...');
    const projects = await cfFetch(`/accounts/${ACCOUNT_ID}/pages/projects`);
    const names = (projects.result || []).map((p) => p.name);
    console.log('   OK Projects:', names.length ? names.join(', ') : '(none)');

    // 3. Latest deployment for project
    if (PROJECT_NAME) {
      console.log(`\n3. Latest deployment for "${PROJECT_NAME}"...`);
      const deployments = await cfFetch(
        `/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments?per_page=1`
      );
      const list = deployments.result || [];
      if (list.length) {
        const d = list[0];
        console.log('   OK Latest:', d.id);
        console.log('      Status:', d.latest_stage?.name ?? d.deployment_trigger?.metadata?.commit_sha ?? '-');
        console.log('      Created:', d.created_on);
      } else {
        console.log('   (no deployments yet)');
      }
    }

    console.log('\nGlobal API test passed.');
  } catch (e) {
    console.error('\nFAILED:', e.message);
    if (e.apiErrors) console.error('API errors:', e.apiErrors);
    process.exit(1);
  }
}

main();
