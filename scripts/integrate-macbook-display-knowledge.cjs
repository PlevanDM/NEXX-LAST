#!/usr/bin/env node

/**
 * Integrate MacBook Display Knowledge into master-db.json
 * Adds comprehensive display compatibility, part numbers, and diagnostic data
 * Source: All MacBook Displays 2017–2026 Tech.md
 */

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../public/data/master-db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('🖥️ Integrating MacBook Display Knowledge into master-db.json...\n');

let updated = 0;
const updates = [];

// MacBook Display data
const displayData = {
  'MacBook Pro 13"': {
    'models': {
      'A1708-2016': {
        board_number: '820-00840',
        display: {
          resolution: '2560×1600',
          type: 'IPS',
          connector: 'J8500 (516S00228)',
          pin_count: 42,
          backlight_ic: 'U8400 (TPS65640A)',
          flex_cables: ['821-00516-03', '821-00517-05']
        },
        critical_note: 'Flexgate! Короткие flex кабели',
        backlight_circuit: {
          path: 'PPBUS_G3H (12.6V) → FP800 (3A fuse) → U8400 → PPVOUT (~55V) → Pin 43',
          diagnostic_points: [
            { name: 'PPBIN_S0SW_LCDBKLT_F', expected: '~12.6V after fuse' },
            { name: 'Q8400 Gate (LCDBKLT_EN_L)', expected: '~5.2V' },
            { name: 'EDP_BKLT_EN (Pin 46)', expected: '3.3V when backlight on' },
            { name: 'PPVOUT_S0_LCDBKLT (Pin 43)', expected: '~55V with working LCD' }
          ]
        },
        compatible_donors: ['A1708-2017', 'A1706-2016', 'A1706-2017'],
        incompatible_donors: ['A2338-M1', 'A2338-M2']
      },
      'A1708-2017': {
        board_number: '820-00875',
        display: {
          resolution: '2560×1600',
          type: 'IPS',
          connector: 'J8500',
          pin_count: 42,
          backlight_ic: 'U8400 (TPS65640A)',
          flex_cables: ['821-00516-03', '821-00517-05']
        },
        compatible_donors: ['A1708-2016', 'A1706-2016', 'A1706-2017', 'A1989-2018', 'A2159-2019'],
        incompatible_donors: ['A2338-M1', 'A2338-M2']
      },
      'A1989-2018': {
        board_number: '820-00850',
        display: {
          resolution: '2560×1600',
          type: 'IPS, True Tone',
          connector: 'J8500',
          pin_count: 42,
          backlight_ic: 'U8400 (TPS65640A)',
          flex_cables: ['821-00602-03', '821-00603-03']
        },
        critical_note: 'Удлинённые flex кабели после Flexgate',
        compatible_donors: ['A1708-2016', 'A1708-2017', 'A1706-2016', 'A1706-2017', 'A1989-2018', 'A2159-2019', 'A2251-2020', 'A2289-2020'],
        incompatible_donors: ['A2338-M1', 'A2338-M2']
      },
      'A2159-2019': {
        board_number: '820-01598',
        display: {
          resolution: '2560×1600',
          type: 'IPS, True Tone',
          connector: 'J8500',
          pin_count: 42,
          backlight_ic: 'U8400 (TPS65640A)',
          flex_cables: ['821-00732-02-B', '821-00733-02-B']
        },
        compatible_donors: ['A1708-2016', 'A1708-2017', 'A1706-2016', 'A1706-2017', 'A1989-2018', 'A2159-2019', 'A2251-2020', 'A2289-2020'],
        incompatible_donors: ['A2338-M1', 'A2338-M2']
      },
      'A2251-2020': {
        board_number: '820-01949',
        display: {
          resolution: '2560×1600',
          type: 'IPS, True Tone',
          connector: 'J8500',
          pin_count: 42,
          backlight_ic: 'U8400 (TPS65640A)',
          flex_cables: ['821-01228-A', '821-01229-A']
        },
        compatible_donors: ['A1708-2016', 'A1708-2017', 'A1706-2016', 'A1706-2017', 'A1989-2018', 'A2159-2019', 'A2251-2020', 'A2289-2020'],
        incompatible_donors: ['A2338-M1', 'A2338-M2']
      },
      'A2338-M1': {
        board_number: '820-02020',
        display: {
          resolution: '2560×1600',
          type: 'IPS, True Tone, P3',
          connector: 'J8500',
          pin_count: 42,
          backlight_ic: 'UP800',
          flex_cables: ['821-02854-03/A']
        },
        critical_note: 'UP800 часто корродирует при залитии. Разные уровни логики I2C (1.8V vs 3.3V Intel)',
        backlight_circuit: {
          path: 'PPBUS_AON (12.6V) → FP800 → UP800 → PPVOUT (~49V)',
          lpt8_hack: 'Если U8100 мёртв: убрать RP842, jumper BKLT_EN_R → Pin 5 на UP900'
        },
        compatible_donors: ['A2338-M1'],
        incompatible_donors: ['A1708-2016', 'A1708-2017', 'A1706-2016', 'A1706-2017', 'A1989-2018', 'A2159-2019', 'A2251-2020', 'A2289-2020'],
        pin_differences: {
          note: 'I2C логика: 1.8V вместо 3.3V на пинах 4, 10, 14, 16, 46'
        }
      }
    }
  },
  'MacBook Pro 15"': {
    'A1707-2016': {
      board_number: '820-00281',
      display: {
        resolution: '2880×1800',
        type: 'IPS',
        connector: 'J8500 (42-pin)',
        backlight_ic: 'U8400 (TPS65640A)',
        flex_cables: ['821-00690-02', '821-00691-02']
      },
      critical_note: 'Flexgate! Pin 1 (AUX) рядом с Pin 43 (55V) - смерть CPU при КЗ',
      compatible_donors: ['A1707-2017', 'A1990-2018', 'A1990-2019'],
      incompatible_donors: ['A2141-2019']
    },
    'A1990-2019': {
      board_number: '820-01814',
      display: {
        resolution: '2880×1800',
        type: 'IPS, True Tone',
        connector: 'J8500 (42-pin)',
        backlight_ic: 'U8400 (TPS65640A)',
        flex_cables: ['821-01270-01', '821-01271-01']
      },
      compatible_donors: ['A1707-2016', 'A1707-2017', 'A1990-2018', 'A1990-2019'],
      incompatible_donors: ['A2141-2019']
    }
  },
  'MacBook Pro 16"': {
    'A2141-2019': {
      board_number: '820-01700',
      display: {
        resolution: '3072×1920',
        type: 'IPS, True Tone',
        connector: 'J8500 (42-pin, i2c control only)',
        backlight_ic: 'U8400 (TPS65640A, i2c-only)',
        flex_cables: ['821-02032-03', '821-02034-03']
      },
      critical_note: '⚠️ КРИТИЧНОЕ: НЕ используется PWM! Только i2c backlight control (пины 4/10) - несовместима с A1707/A1990 кабелями!',
      pmu_note: 'Пины 14 и 16 (PWM линии) не подключены на A2141',
      compatible_donors: ['A2141-2019'],
      incompatible_donors: ['A1707-2016', 'A1707-2017', 'A1990-2018', 'A1990-2019'],
      workaround: 'Экран A2141 на A1707 требует кабель от A1707 (с PWM линиями)'
    }
  },
  'MacBook Air 13"': {
    'A1932-2018': {
      board_number: '820-01521',
      display: {
        resolution: '2560×1600',
        type: 'IPS',
        connector: 'J8500',
        pin_count: 42,
        backlight_ic: 'U8400',
        flex_cables: ['Unknown']
      },
      compatible_donors: ['A1932-2019', 'A2179-2020 (⚠️ ALS может отличаться)'],
      incompatible_donors: ['A2337-M1', 'A2681-M2']
    },
    'A2179-2020': {
      board_number: '820-01958',
      display: {
        resolution: '2560×1600',
        type: 'IPS, True Tone',
        connector: 'J8500',
        pin_count: 42,
        backlight_ic: 'U8400',
        flex_cables: ['821-01552-A']
      },
      critical_note: '⚠️ 821-01552-A vs 821-02721-A: выглядят одинаково но РАЗНЫЕ!',
      compatible_donors: ['A1932-2018', 'A2179-2020'],
      incompatible_donors: ['A2337-M1', 'A2681-M2']
    },
    'A2337-M1': {
      board_number: '820-02016',
      display: {
        resolution: '2560×1600',
        type: 'IPS, True Tone, P3',
        connector: 'J8500',
        pin_count: 42,
        backlight_ic: 'UP800',
        flex_cables: ['821-02721-A']
      },
      critical_note: '821-02721-A выглядит как 821-01552-A но разная разводка - перепутать = экран не работает',
      cross_compatibility: 'LCD от Air M1 работает на Pro M1 (A2338) включая камеру!',
      compatible_donors: ['A2337-M1'],
      incompatible_donors: ['A1932-2018', 'A2179-2020', 'A2681-M2', 'A3113-M3']
    },
    'A2681-M2': {
      board_number: '820-02536',
      display: {
        resolution: '2560×1664',
        type: 'Liquid Retina',
        connector: 'LVDS (40-pin)',
        backlight_ic: 'Unknown',
        flex_cables: ['821-04129-02']
      },
      critical_note: 'Lid Angle Sensor - новый форм-фактор',
      compatible_donors: ['A2681-M2', 'A3113-M3', 'A3240-M4'],
      incompatible_donors: ['A1932-2018', 'A2179-2020', 'A2337-M1']
    }
  }
};

// Process devices
db.devices.forEach((device, idx) => {
  // Match MacBook models
  if (device.category === 'MacBook' || device.category === 'MacBook Pro' || device.category === 'MacBook Air') {
    const aNum = device.model || device.a_number;
    
    // Find matching display data
    let displayInfo = null;
    let modelKey = null;

    for (const category in displayData) {
      const categoryData = displayData[category];
      for (const key in categoryData) {
        if (aNum && aNum.includes(key.split('-')[0])) {
          displayInfo = categoryData[key];
          modelKey = key;
          break;
        }
      }
      if (displayInfo) break;
    }

    if (displayInfo) {
      if (!device.display_repair) device.display_repair = {};
      
      device.display_repair = {
        ...displayInfo,
        knowledge_base: 'MACBOOK-DISPLAY-REPAIR-KNOWLEDGE-BASE.md',
        tool: 'MacBookDisplayRepairTool',
        last_updated: '2026-02-12'
      };

      updated++;
      updates.push(`✅ ${device.name} (${aNum}): Added display repair knowledge`);
    }
  }
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log('\n📊 Integration Results:\n');
updates.slice(0, 20).forEach(u => console.log(u));
if (updates.length > 20) console.log(`\n... and ${updates.length - 20} more updates\n`);

console.log(`\n✅ Total updated: ${updated} MacBook models`);
console.log(`📁 Database: ${dbPath}`);
console.log('\n💡 Next steps:');
console.log('   1. Add MacBookDisplayRepairTool to components registry');
console.log('   2. Import component in App.tsx');
console.log('   3. Add route for /macbook/display-repair-tool');
console.log('   4. Run: npm run split-db');
console.log('   5. Build production: npm run build\n');

process.exit(0);
