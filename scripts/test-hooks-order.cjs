#!/usr/bin/env node
/**
 * Verify: no early return before all hooks in App.tsx (avoids React #300)
 */
const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'src', 'App.tsx');
const content = fs.readFileSync(appPath, 'utf8');

// Find first "if (error)" return block and last hook before it
const ifErrorMatch = content.match(/\n\s+if \(error\)\s*\{/);
const priceListMemo = content.includes('const priceListArray = React.useMemo');
const bodyOverflowEffect = content.includes('document.body.style.overflow');
const globalSearchMemo = content.includes('const globalSearchResults = React.useMemo');
const countsMemo = content.includes('const counts = React.useMemo');

const ifErrorPos = ifErrorMatch ? content.indexOf(ifErrorMatch[0]) : -1;
const priceListPos = content.indexOf('const priceListArray = React.useMemo');
const countsPos = content.indexOf('const counts = React.useMemo');

let ok = true;
if (!priceListMemo || !bodyOverflowEffect || !globalSearchMemo || !countsMemo) {
  console.log('❌ Not all hooks found (priceListArray, useEffect, globalSearchResults, counts)');
  ok = false;
}
if (ifErrorPos < 0) {
  console.log('❌ if (error) block not found');
  ok = false;
}
// All hooks must appear before if (error)
if (priceListPos > ifErrorPos || countsPos > ifErrorPos) {
  console.log('❌ Hooks (priceListArray or counts) appear after if (error) - would cause React #300');
  ok = false;
}
if (ok) {
  console.log('✅ App.tsx: all hooks are before if (error) return (React #300 fix verified)');
}
process.exit(ok ? 0 : 1);
