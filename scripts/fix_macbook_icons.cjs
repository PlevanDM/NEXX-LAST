/**
 * Fix MacBook Icons - добавление правильных иконок для старых MacBook
 * NEXX Database v6.9.4
 */

const fs = require('fs');
const path = require('path');

const DEVICES_PATH = path.join(__dirname, '../public/data/devices.json');
const ICONS_PATH = path.join(__dirname, '../public/data/device_icons.json');

const devices = JSON.parse(fs.readFileSync(DEVICES_PATH, 'utf8'));
const iconsData = JSON.parse(fs.readFileSync(ICONS_PATH, 'utf8'));

// iFixit image IDs for MacBook models
const macbookIfixitImages = {
  // MacBook Air 11"
  "MacBook Air 11\" Early 2014": "oLsLIhG2UEdQWgYp",
  "MacBook Air 11\" Early 2015": "oLsLIhG2UEdQWgYp",
  "MacBook Air 11\" Mid 2013": "MHklQe2cZXMZGjJn",
  
  // MacBook Air 13" older
  "MacBook Air 13\" Early 2014": "6P6IEsKkEiWcFfOt",
  "MacBook Air 13\" Early 2015": "6P6IEsKkEiWcFfOt", 
  "MacBook Air 13\" 2017": "6P6IEsKkEiWcFfOt",
  "MacBook Air 13\" Mid 2013": "QnKMmNiVKK1RfVeB",
  "MacBook Air 13\" 2018 Retina": "P4MJwk2GImWCXFMj",
  "MacBook Air 13\" 2019 Retina": "P4MJwk2GImWCXFMj",
  "MacBook Air 13\" 2020 Intel": "Rns2KUYuqJTGfLkN",
  
  // MacBook Pro 13" older
  "MacBook Pro 13\" Late 2013": "2LJYNAHYccPuUQZN",
  "MacBook Pro 13\" Mid 2014": "2LJYNAHYccPuUQZN",
  "MacBook Pro 13\" Early 2015": "2LJYNAHYccPuUQZN",
  "MacBook Pro 13\" 2016 Touch Bar": "2CJqMcPPkLYqfA6b",
  "MacBook Pro 13\" 2016 Function Keys": "EIdXiRgQTUKLTffH",
  "MacBook Pro 13\" 2017 Touch Bar": "2CJqMcPPkLYqfA6b",
  "MacBook Pro 13\" 2017 Function Keys": "EIdXiRgQTUKLTffH",
  "MacBook Pro 13\" 2018 Touch Bar": "WJVYF5GIrWjbHlYJ",
  "MacBook Pro 13\" 2019 Touch Bar": "WJVYF5GIrWjbHlYJ",
  "MacBook Pro 13\" 2020 Touch Bar Intel": "WJVYF5GIrWjbHlYJ",
  
  // MacBook Pro 15"
  "MacBook Pro 15\" Late 2013": "TcZhfkCrYudpPXrn",
  "MacBook Pro 15\" Mid 2014": "TcZhfkCrYudpPXrn",
  "MacBook Pro 15\" Mid 2015": "TcZhfkCrYudpPXrn",
  "MacBook Pro 15\" 2016 Touch Bar": "GEtIYS3OVBmYBFYh",
  "MacBook Pro 15\" 2017 Touch Bar": "GEtIYS3OVBmYBFYh",
  "MacBook Pro 15\" 2018 Touch Bar": "l6qSNgqkWfxZeKFg",
  "MacBook Pro 15\" 2019 Touch Bar": "l6qSNgqkWfxZeKFg",
  
  // MacBook Pro 16"
  "MacBook Pro 16\" 2019": "GFPkKKnATQsYfXYA",
  "MacBook Pro 16\" 2021 M1 Pro": "cBXYN4cDDdMwWcFm",
  "MacBook Pro 16\" 2021 M1 Max": "cBXYN4cDDdMwWcFm",
  
  // MacBook 12"
  "MacBook 12\" Early 2015": "xHBDJR1Qw4W1uIZc",
  "MacBook 12\" Early 2016": "xHBDJR1Qw4W1uIZc",
  "MacBook 12\" Mid 2017": "xHBDJR1Qw4W1uIZc"
};

// pngimg fallbacks for MacBooks
const pngimgFallbacks = {
  "macbook_air": "https://pngimg.com/uploads/macbook/macbook_PNG101755.png",
  "macbook_air_small": "https://pngimg.com/uploads/macbook/small/macbook_PNG101755.png",
  "macbook_pro": "https://pngimg.com/uploads/macbook/macbook_PNG101761.png",
  "macbook_pro_small": "https://pngimg.com/uploads/macbook/small/macbook_PNG101761.png",
  "macbook_12": "https://pngimg.com/uploads/macbook/macbook_PNG101759.png",
  "macbook_12_small": "https://pngimg.com/uploads/macbook/small/macbook_PNG101759.png"
};

let updated = 0;

devices.forEach(device => {
  if (device.category !== 'MacBook') return;
  if (device.icon_source !== 'default') return; // Skip already good icons
  
  const name = device.name;
  
  // Try iFixit image first
  if (macbookIfixitImages[name]) {
    const imageId = macbookIfixitImages[name];
    device.device_icon = `https://guide-images.cdn.ifixit.com/igi/${imageId}.standard`;
    device.device_icon_small = `https://guide-images.cdn.ifixit.com/igi/${imageId}.mini`;
    device.icon_source = 'ifixit';
    updated++;
    console.log(`✅ iFixit: ${name}`);
    return;
  }
  
  // Fallback to pngimg based on model type
  if (name.includes('Air')) {
    device.device_icon = pngimgFallbacks.macbook_air;
    device.device_icon_small = pngimgFallbacks.macbook_air_small;
    device.icon_source = 'pngimg';
    updated++;
    console.log(`✅ pngimg Air: ${name}`);
  } else if (name.includes('12"') || name.includes('12 inch')) {
    device.device_icon = pngimgFallbacks.macbook_12;
    device.device_icon_small = pngimgFallbacks.macbook_12_small;
    device.icon_source = 'pngimg';
    updated++;
    console.log(`✅ pngimg 12": ${name}`);
  } else {
    device.device_icon = pngimgFallbacks.macbook_pro;
    device.device_icon_small = pngimgFallbacks.macbook_pro_small;
    device.icon_source = 'pngimg';
    updated++;
    console.log(`✅ pngimg Pro: ${name}`);
  }
});

// Save
fs.writeFileSync(DEVICES_PATH, JSON.stringify(devices, null, 2));

// Stats
const iconStats = {};
devices.forEach(d => {
  if (d.icon_source) {
    iconStats[d.icon_source] = (iconStats[d.icon_source] || 0) + 1;
  }
});

console.log(`\n✅ MacBook Icons Update Complete!`);
console.log(`📊 Updated: ${updated} devices`);
console.log(`\n📈 Icons by source:`);
Object.entries(iconStats).forEach(([source, count]) => {
  console.log(`   ${source}: ${count}`);
});
