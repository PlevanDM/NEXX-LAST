#!/usr/bin/env node
/**
 * Fix Missing Data in NEXX Database
 */

const fs = require('fs');
const path = require('path');

const devicesPath = path.join(__dirname, '..', 'public', 'data', 'devices.json');
const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf8'));

console.log('🔧 Fixing missing charging IC data...\n');

const updates = {
  "iPad 11th Gen": {
    main: "Integrated PMU",
    designation: "USB Type-C Controller (integrated)",
    secondary: "Built-in battery charger"
  },
  "MacBook Air 13-inch M4": {
    main: "M4 integrated PMU",
    designation: "USB-C PD Controller (M4 SoC)",
    secondary: "100W USB-C charging"
  },
  "MacBook Air 15-inch M4": {
    main: "M4 integrated PMU",
    designation: "USB-C PD Controller (M4 SoC)",
    secondary: "100W USB-C charging"
  },
  "MacBook Pro 14-inch M5": {
    main: "M5 integrated PMU",
    designation: "USB-C PD 3.1 Controller (M5 SoC)",
    secondary: "140W USB-C charging"
  },
  "MacBook Pro 16-inch M5 Max": {
    main: "M5 integrated PMU",
    designation: "USB-C PD 3.1 Controller (M5 SoC)",
    secondary: "240W USB-C charging"
  },
  "iPad Pro 11-inch M4": {
    main: "M4 integrated PMU",
    designation: "Thunderbolt/USB-C Controller",
    secondary: "40W fast charging"
  },
  "iPad Pro 13-inch M4": {
    main: "M4 integrated PMU",
    designation: "Thunderbolt/USB-C Controller",
    secondary: "40W fast charging"
  },
  "iPad Air 11-inch M3": {
    main: "M3 integrated PMU",
    designation: "USB-C Controller",
    secondary: "30W charging"
  },
  "iPad Air 13-inch M3": {
    main: "M3 integrated PMU",
    designation: "USB-C Controller",
    secondary: "30W charging"
  }
};

let fixed = 0;
devices.forEach(device => {
  if (updates[device.name] && !device.charging_ic) {
    device.charging_ic = updates[device.name];
    console.log(`✅ Fixed: ${device.name}`);
    fixed++;
  }
});

fs.writeFileSync(devicesPath, JSON.stringify(devices, null, 2));
console.log(`\n🎉 Fixed ${fixed} devices!`);
