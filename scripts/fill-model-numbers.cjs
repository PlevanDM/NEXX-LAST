#!/usr/bin/env node
/**
 * Fill MODEL field (A-number / model number) for all devices in master-db.json
 * Uses official Apple A-numbers and Samsung/other model number patterns.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'public', 'data', 'master-db.json');

// Apple: name (normalized) -> model number(s) — по отчёту Apple Models & Chips 2026
const APPLE_MODELS = {
  // iPhone 17 (2025) — официальные A-номера
  'iPhone 17 Pro Max': 'A3257/A3525/A3526/A3527',
  'iPhone 17 Pro': 'A3256/A3522/A3523/A3524',
  'iPhone 17': 'A3258/A3519/A3520/A3521',
  'iPhone Air': 'A3517/A3260/A3518/A3516',
  // iPhone 16 (2024)
  'iPhone 16 Pro Max': 'A3084/A3295/A3296/A3297',
  'iPhone 16 Pro': 'A3083/A3292/A3293/A3294',
  'iPhone 16 Plus': 'A3082/A3289/A3290/A3291',
  'iPhone 16': 'A3081/A3286/A3287/A3288',
  // iPhone 15 (2023)
  'iPhone 15 Pro Max': 'A2849/A3105/A3106/A3108',
  'iPhone 15 Pro': 'A2848/A3101/A3102/A3104',
  'iPhone 15 Plus': 'A2847/A3093/A3094/A3096',
  'iPhone 15': 'A2846/A3089/A3090/A3092',
  // iPhone 14
  'iPhone 14 Pro Max': 'A2651/A2893/A2894/A2895',
  'iPhone 14 Pro': 'A2650/A2889/A2890/A2891',
  'iPhone 14 Plus': 'A2632/A2885/A2886/A2887/A2888',
  'iPhone 14': 'A2649/A2881/A2882/A2883/A2884',
  // iPhone 13
  'iPhone 13 Pro Max': 'A2484/A2641/A2644/A2645',
  'iPhone 13 Pro': 'A2483/A2636/A2639/A2640',
  'iPhone 13 mini': 'A2481/A2626/A2629/A2630',
  'iPhone 13': 'A2482/A2631/A2634/A2635',
  // iPhone 12
  'iPhone 12 Pro Max': 'A2342/A2410/A2411/A2412',
  'iPhone 12 Pro': 'A2341/A2406/A2407/A2408',
  'iPhone 12 mini': 'A2176/A2398/A2399/A2400',
  'iPhone 12': 'A2172/A2402/A2403/A2404',
  // iPhone 11
  'iPhone 11 Pro Max': 'A2161/A2220/A2218',
  'iPhone 11 Pro': 'A2160/A2217/A2215',
  'iPhone 11': 'A2111/A2223/A2221',
  // iPhone XS/XR
  'iPhone XS Max': 'A1921/A2101/A2102/A2104',
  'iPhone XS': 'A1920/A2097/A2098/A2100',
  'iPhone XR': 'A1984/A2105/A2106/A2108',
  // iPhone X/8
  'iPhone X': 'A1865/A1901/A1902',
  'iPhone 8 Plus': 'A1864/A1897/A1898',
  'iPhone 8': 'A1863/A1905/A1906',
  // iPhone 7
  'iPhone 7 Plus': 'A1661/A1784/A1785',
  'iPhone 7': 'A1660/A1778/A1779',
  // iPhone 6s
  'iPhone 6s Plus': 'A1634/A1687/A1699',
  'iPhone 6s': 'A1633/A1688/A1700',
  // iPhone 6
  'iPhone 6 Plus': 'A1522/A1524/A1593',
  'iPhone 6': 'A1549/A1586/A1589',
  // iPhone SE
  'iPhone SE 3rd Gen': 'A2595/A2782/A2783/A2784/A2785',
  'iPhone SE (3rd generation)': 'A2595/A2782/A2783/A2784/A2785',
  'iPhone SE 2nd Gen': 'A2275/A2296/A2298',
  'iPhone SE (2nd generation)': 'A2275/A2296/A2298',
  'iPhone SE 1st Gen': 'A1662/A1723/A1724',
  'iPhone SE (1st generation)': 'A1662/A1723/A1724',
  'iPhone SE': 'A1662/A1723/A1724',
  // iPhone 5s
  'iPhone 5s': 'A1453/A1457/A1518/A1528/A1530/A1533',
  // iPad Pro 11"
  'iPad Pro 11" M4': 'A2836/A2837/A3006',
  'iPad Pro 11" 4th Gen M2': 'A2759/A2435/A2761/A2762',
  'iPad Pro 11" 3rd Gen M1': 'A2377/A2459/A2301/A2460',
  'iPad Pro 11" 2nd Gen': 'A2228/A2068/A2230/A2231',
  'iPad Pro 11" 1st Gen': 'A1980/A2013/A1934/A1979',
  // iPad Pro 12.9/13
  'iPad Pro 13" M4': 'A2925/A2926',
  'iPad Pro 12.9" 6th Gen M2': 'A2436/A2764/A2766/A2437',
  'iPad Pro 12.9" 5th Gen M1': 'A2378/A2461/A2379/A2462',
  'iPad Pro 12.9" 4th Gen': 'A2229/A2069/A2232/A2233',
  'iPad Pro 12.9" 3rd Gen': 'A1876/A2014/A1895/A1983',
  'iPad Pro 12.9" 2nd Gen': 'A1670/A1671/A1821',
  'iPad Pro 12.9" 1st Gen': 'A1584/A1652',
  // iPad Pro 10.5/9.7
  'iPad Pro 10.5"': 'A1701/A1709/A1852',
  'iPad Pro 9.7"': 'A1673/A1674/A1675',
  // iPad Air
  'iPad Air 6th Gen M2 13"': 'A2898/A2899/A2900',
  'iPad Air 6th Gen M2 11"': 'A2902/A2903/A2904',
  'iPad Air 5th Gen M1': 'A2588/A2589/A2591',
  'iPad Air 4th Gen': 'A2316/A2324/A2325/A2072',
  'iPad Air 3rd Gen': 'A2152/A2123/A2153/A2154',
  'iPad Air 2': 'A1566/A1567',
  // iPad
  'iPad 10th Gen': 'A2696/A2757/A2777',
  'iPad 9th Gen': 'A2602/A2603/A2604/A2605',
  'iPad 8th Gen': 'A2270/A2428/A2429/A2430',
  'iPad 7th Gen': 'A2197/A2198/A2200',
  'iPad 6th Gen': 'A1893/A1954',
  'iPad 5th Gen': 'A1822/A1823',
  // iPad mini
  'iPad mini 7th Gen': 'A2991/A3194/A3195/A3196',
  'iPad mini 6th Gen': 'A2567/A2568/A2569',
  'iPad mini 5th Gen': 'A2133/A2124/A2125/A2126',
  // MacBook Air
  'MacBook Air 15" M4': 'A3114',
  'MacBook Air 13" M4': 'A3113',
  'MacBook Air 15" M3': 'A3114',
  'MacBook Air 13" M3': 'A3113',
  'MacBook Air 15" M2': 'A2941',
  'MacBook Air 13" M2': 'A2681',
  'MacBook Air 13" M1': 'A2337',
  'MacBook Air 13" 2020 Intel': 'A2179',
  'MacBook Air 13" 2020': 'A2179',
  'MacBook Air 13" 2019 Retina': 'A2179',
  'MacBook Air 13" 2018 Retina': 'A1932',
  'MacBook Air 13" 2017': 'A1466',
  'MacBook Air 13" Early 2015': 'A1466',
  'MacBook Air 11" Early 2015': 'A1465',
  'MacBook Air 13" Early 2014': 'A1466',
  'MacBook Air 11" Early 2014': 'A1465',
  // MacBook Pro 13"
  'MacBook Pro 13" M2': 'A2338',
  'MacBook Pro 13" M1': 'A2338',
  'MacBook Pro 13" 2020 Four Thunderbolt 3': 'A2251',
  'MacBook Pro 13" 2020 Two Thunderbolt 3': 'A2289',
  'MacBook Pro 13" 2019 Four Thunderbolt 3': 'A2159',
  'MacBook Pro 13" 2019 Two Thunderbolt 3': 'A2159',
  'MacBook Pro 13" 2018 Four Thunderbolt 3': 'A1989',
  'MacBook Pro 13" 2017 Four Thunderbolt 3': 'A1706',
  'MacBook Pro 13" 2017 Two Thunderbolt 3': 'A1708',
  'MacBook Pro 13" 2016 Four Thunderbolt 3': 'A1706',
  'MacBook Pro 13" 2016 Two Thunderbolt 3': 'A1708',
  'MacBook Pro 13" Early 2015': 'A1502',
  'MacBook Pro 13" Mid 2014': 'A1502',
  'MacBook Pro 13" Late 2013': 'A1502',
  // MacBook Pro 14"
  'MacBook Pro 14" M4 Pro': 'A2992',
  'MacBook Pro 14" M4': 'A2918/A2991',
  'MacBook Pro 14" M3 Pro': 'A2779/A2918',
  'MacBook Pro 14" M3': 'A2779',
  'MacBook Pro 14" M2 Pro': 'A2779',
  'MacBook Pro 14" M1 Pro': 'A2442',
  // MacBook Pro 15"
  'MacBook Pro 15" 2019': 'A1990',
  'MacBook Pro 15" 2018': 'A1990',
  'MacBook Pro 15" 2017': 'A1707',
  'MacBook Pro 15" 2016': 'A1707',
  'MacBook Pro 15" Mid 2015': 'A1398',
  'MacBook Pro 15" Mid 2014': 'A1398',
  'MacBook Pro 15" Late 2013': 'A1398',
  // MacBook Pro 16"
  'MacBook Pro 16" M4 Pro': 'A3006/A3186',
  'MacBook Pro 16" M4': 'A3006',
  'MacBook Pro 16" M3 Pro': 'A2780/A2991',
  'MacBook Pro 16" M2 Pro': 'A2780',
  'MacBook Pro 16" M1 Pro': 'A2485',
  'MacBook Pro 16" 2019': 'A2141',
  // Apple Watch (audit 2026-01-31)
  'Apple Watch Series 11 46mm': 'A3452/A3453',
  'Apple Watch Series 11 45mm': 'A3452/A3453',
  'Apple Watch Series 11 42mm': 'A3452/A3453',
  'Apple Watch Series 11 41mm': 'A3452/A3453',
  'Apple Watch Series 10 46mm': 'A3000/A3003/A3206',
  'Apple Watch Series 10 42mm': 'A2999/A3001/A3002',
  'Apple Watch Series 9 45mm': 'A2982/A2984',
  'Apple Watch Series 9 41mm': 'A2982/A2984',
  'Apple Watch Series 8 45mm': 'A2771/A2774/A2775/A2858',
  'Apple Watch Series 8 41mm': 'A2770/A2772/A2773/A2857',
  'Apple Watch Series 7 45mm': 'A2475/A2476/A2477/A2478',
  'Apple Watch Series 7 41mm': 'A2475/A2476',
  'Apple Watch Series 6 44mm': 'A2291/A2292',
  'Apple Watch Ultra 3': 'A3281/A3282',
  'Apple Watch Ultra 2': 'A2986/A2987',
  'Apple Watch Ultra': 'A2684',
  'Apple Watch SE 2 44mm': 'A2722',
  'Apple Watch SE 2 40mm': 'A2723',
};

// Samsung: name contains -> model (pattern or exact)
const SAMSUNG_PATTERNS = [
  { match: /Galaxy S26 Ultra/i, model: 'SM-S936B' },
  { match: /Galaxy S26\+/i, model: 'SM-S934B' },
  { match: /Galaxy S26\s/i, model: 'SM-S931B' },
  { match: /Galaxy S26$/i, model: 'SM-S931B' },
  { match: /Galaxy S25 Ultra/i, model: 'SM-S931B' },
  { match: /Galaxy S25\+/i, model: 'SM-S926B' },
  { match: /Galaxy S25\s/i, model: 'SM-S921B' },
  { match: /Galaxy S25$/i, model: 'SM-S921B' },
  { match: /Galaxy S24 Ultra/i, model: 'SM-S928B' },
  { match: /Galaxy S24\+/i, model: 'SM-S926B' },
  { match: /Galaxy S24 FE/i, model: 'SM-S921B' },
  { match: /Galaxy S24\s/i, model: 'SM-S921B' },
  { match: /Galaxy S24$/i, model: 'SM-S921B' },
  { match: /Galaxy S23 Ultra/i, model: 'SM-S918B' },
  { match: /Galaxy S23\+/i, model: 'SM-S916B' },
  { match: /Galaxy S23\s/i, model: 'SM-S911B' },
  { match: /Galaxy S23$/i, model: 'SM-S911B' },
  { match: /Galaxy S22 Ultra/i, model: 'SM-S908B' },
  { match: /Galaxy S22\+/i, model: 'SM-S906B' },
  { match: /Galaxy S22\s/i, model: 'SM-S901B' },
  { match: /Galaxy S22$/i, model: 'SM-S901B' },
  { match: /Galaxy S21/i, model: 'SM-G991B' },
  { match: /Galaxy S20/i, model: 'SM-G981B' },
  { match: /Galaxy A56/i, model: 'SM-A566B' },
  { match: /Galaxy A55/i, model: 'SM-A556B' },
  { match: /Galaxy A54/i, model: 'SM-A546B' },
  { match: /Galaxy A36/i, model: 'SM-A366B' },
  { match: /Galaxy A35/i, model: 'SM-A356B' },
  { match: /Galaxy A34/i, model: 'SM-A346B' },
  { match: /Galaxy A25/i, model: 'SM-A256B' },
  { match: /Galaxy A15/i, model: 'SM-A156B' },
  { match: /Z Fold 7/i, model: 'SM-F957B' },
  { match: /Z Fold 6/i, model: 'SM-F956B' },
  { match: /Z Fold 5/i, model: 'SM-F946B' },
  { match: /Z Fold 4/i, model: 'SM-F936B' },
  { match: /Z Flip 7/i, model: 'SM-F741B' },
  { match: /Z Flip 6/i, model: 'SM-F741B' },
  { match: /Z Flip 5/i, model: 'SM-F731B' },
  { match: /Z Flip 4/i, model: 'SM-F721B' },
  { match: /Galaxy Watch 7/i, model: 'SM-R965' },
  { match: /Galaxy Watch 6/i, model: 'SM-R965' },
  { match: /Galaxy Watch Ultra/i, model: 'SM-L705' },
  { match: /Tab S10/i, model: 'SM-X820' },
  { match: /Tab S9/i, model: 'SM-X710' },
  { match: /Tab S8/i, model: 'SM-X700' },
  { match: /Galaxy Book4/i, model: 'NP9x0' },
];

function normalizeName(name) {
  if (!name || typeof name !== 'string') return '';
  return name.replace(/\s+/g, ' ').trim();
}

function findAppleModel(name) {
  const n = normalizeName(name);
  if (APPLE_MODELS[n]) return APPLE_MODELS[n];
  // Partial match (e.g. "iPad Pro 11-inch (4th gen)" -> "iPad Pro 11" 4th Gen M2")
  for (const [key, value] of Object.entries(APPLE_MODELS)) {
    if (n.includes(key) || key.includes(n)) return value;
  }
  return null;
}

function findSamsungModel(name) {
  for (const { match, model } of SAMSUNG_PATTERNS) {
    if (match.test(name)) return model;
  }
  return null;
}

function main() {
  const forceUpdateApple = process.argv.includes('--update-apple');
  if (forceUpdateApple) console.log('🔄 Mode: --update-apple (overwrite Apple model numbers from reference)\n');

  console.log('📦 Loading', DB_PATH);
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const devices = db.devices || [];
  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const dev of devices) {
    const current = dev.model;
    const empty = current == null || current === '' || String(current).trim() === 'N/A';
    const name = dev.name || '';
    const brand = (dev.brand || dev.category || '').toString();
    const isApple = brand === 'Apple' || name.includes('iPhone') || name.includes('iPad') || name.includes('MacBook') || name.includes('Apple Watch');

    if (!empty && !(forceUpdateApple && isApple)) {
      skipped++;
      continue;
    }

    let newModel = null;
    if (isApple) {
      newModel = findAppleModel(name);
      if (newModel && !empty && newModel === current && forceUpdateApple) {
        skipped++;
        continue;
      }
    } else if (brand === 'Samsung' || name.includes('Galaxy') || name.includes('Z Fold') || name.includes('Z Flip') || name.includes('Tab S')) {
      newModel = findSamsungModel(name);
    }

    if (newModel) {
      dev.model = newModel;
      updated++;
      if (updated <= 25) console.log('  ✓', name, '→', newModel);
    } else if (empty) {
      dev.model = '—';
      updated++;
      notFound++;
      if (notFound <= 5) console.log('  —', name, '→ —');
    }
  }

  console.log('\n📊 Result: updated', updated, '| skipped (had model)', skipped, '| not found', notFound);

  if (updated > 0) {
    db.lastUpdated = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    console.log('✅ Saved', DB_PATH);
  } else {
    console.log('⚠️ No changes to save.');
  }
}

main();
