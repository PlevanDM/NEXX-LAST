/**
 * Update MacBook Icons Script
 * Updates device_icons.json and devices.json with proper MacBook images from iFixit
 */

const fs = require('fs');
const path = require('path');

// iFixit images for MacBook models - extracted from teardown pages
const macbookIcons = {
  // MacBook Air models
  "MacBook Air 11\" Early 2014": {
    // Based on MacBook Air 11" 2013/2014/2015 models (same design)
    icon_url: "https://guide-images.cdn.ifixit.com/igi/bZDAmTZvYoRXvALa.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/bZDAmTZvYoRXvALa.mini",
    ifixit_image: "bZDAmTZvYoRXvALa",
    source: "ifixit"
  },
  "MacBook Air 11\" Early 2015": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/bZDAmTZvYoRXvALa.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/bZDAmTZvYoRXvALa.mini",
    ifixit_image: "bZDAmTZvYoRXvALa",
    source: "ifixit"
  },
  "MacBook Air 13\" Early 2014": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/DOZsadVUcgjmCPRE.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/DOZsadVUcgjmCPRE.mini",
    ifixit_image: "DOZsadVUcgjmCPRE",
    source: "ifixit"
  },
  "MacBook Air 13\" Early 2015": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/DOZsadVUcgjmCPRE.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/DOZsadVUcgjmCPRE.mini",
    ifixit_image: "DOZsadVUcgjmCPRE",
    source: "ifixit"
  },
  "MacBook Air 13\" 2017": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/DOZsadVUcgjmCPRE.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/DOZsadVUcgjmCPRE.mini",
    ifixit_image: "DOZsadVUcgjmCPRE",
    source: "ifixit"
  },
  "MacBook Air 13\" 2018 Retina": {
    // From teardown page
    icon_url: "https://guide-images.cdn.ifixit.com/igi/4EWKwBOlLn6Kk4tf.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/4EWKwBOlLn6Kk4tf.mini",
    ifixit_image: "4EWKwBOlLn6Kk4tf",
    source: "ifixit"
  },
  "MacBook Air 13\" 2019 Retina": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/4EWKwBOlLn6Kk4tf.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/4EWKwBOlLn6Kk4tf.mini",
    ifixit_image: "4EWKwBOlLn6Kk4tf",
    source: "ifixit"
  },
  "MacBook Air 13\" 2020 Intel": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/4EWKwBOlLn6Kk4tf.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/4EWKwBOlLn6Kk4tf.mini",
    ifixit_image: "4EWKwBOlLn6Kk4tf",
    source: "ifixit"
  },
  
  // MacBook Pro 13" models
  "MacBook Pro 13\" Late 2013": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/QHTtNV6HsrUuPEgr.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/QHTtNV6HsrUuPEgr.mini",
    ifixit_image: "QHTtNV6HsrUuPEgr",
    source: "ifixit"
  },
  "MacBook Pro 13\" Mid 2014": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/QHTtNV6HsrUuPEgr.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/QHTtNV6HsrUuPEgr.mini",
    ifixit_image: "QHTtNV6HsrUuPEgr",
    source: "ifixit"
  },
  "MacBook Pro 13\" Early 2015": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/QHTtNV6HsrUuPEgr.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/QHTtNV6HsrUuPEgr.mini",
    ifixit_image: "QHTtNV6HsrUuPEgr",
    source: "ifixit"
  },
  "MacBook Pro 13\" 2016 Two Thunderbolt 3": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/MSGSZZPrMJQa1Fh5.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/MSGSZZPrMJQa1Fh5.mini",
    ifixit_image: "MSGSZZPrMJQa1Fh5",
    source: "ifixit"
  },
  "MacBook Pro 13\" 2016 Four Thunderbolt 3": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/2MQwwBpJRdGQ4LAV.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/2MQwwBpJRdGQ4LAV.mini",
    ifixit_image: "2MQwwBpJRdGQ4LAV",
    source: "ifixit"
  },
  "MacBook Pro 13\" 2017 Two Thunderbolt 3": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/MSGSZZPrMJQa1Fh5.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/MSGSZZPrMJQa1Fh5.mini",
    ifixit_image: "MSGSZZPrMJQa1Fh5",
    source: "ifixit"
  },
  "MacBook Pro 13\" 2017 Four Thunderbolt 3": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/2MQwwBpJRdGQ4LAV.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/2MQwwBpJRdGQ4LAV.mini",
    ifixit_image: "2MQwwBpJRdGQ4LAV",
    source: "ifixit"
  },
  "MacBook Pro 13\" 2018 Four Thunderbolt 3": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/2MQwwBpJRdGQ4LAV.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/2MQwwBpJRdGQ4LAV.mini",
    ifixit_image: "2MQwwBpJRdGQ4LAV",
    source: "ifixit"
  },
  "MacBook Pro 13\" 2019 Two Thunderbolt 3": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/LQvFJiXxgP23axvj.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/LQvFJiXxgP23axvj.mini",
    ifixit_image: "LQvFJiXxgP23axvj",
    source: "ifixit"
  },
  "MacBook Pro 13\" 2019 Four Thunderbolt 3": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/2MQwwBpJRdGQ4LAV.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/2MQwwBpJRdGQ4LAV.mini",
    ifixit_image: "2MQwwBpJRdGQ4LAV",
    source: "ifixit"
  },
  "MacBook Pro 13\" 2020 Two Thunderbolt 3": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/LQvFJiXxgP23axvj.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/LQvFJiXxgP23axvj.mini",
    ifixit_image: "LQvFJiXxgP23axvj",
    source: "ifixit"
  },
  "MacBook Pro 13\" 2020 Four Thunderbolt 3": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/2MQwwBpJRdGQ4LAV.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/2MQwwBpJRdGQ4LAV.mini",
    ifixit_image: "2MQwwBpJRdGQ4LAV",
    source: "ifixit"
  },
  
  // MacBook Pro 14" M2 Pro 2023
  "MacBook Pro 14\" M2 Pro 2023": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/LQmFBGBScQQYwJmm.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/LQmFBGBScQQYwJmm.mini",
    ifixit_image: "LQmFBGBScQQYwJmm",
    source: "ifixit"
  },
  
  // MacBook Pro 15" models
  "MacBook Pro 15\" Late 2013": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/2jMLH1Y2w4SXJYxo.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/2jMLH1Y2w4SXJYxo.mini",
    ifixit_image: "2jMLH1Y2w4SXJYxo",
    source: "ifixit"
  },
  "MacBook Pro 15\" Mid 2014": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/2jMLH1Y2w4SXJYxo.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/2jMLH1Y2w4SXJYxo.mini",
    ifixit_image: "2jMLH1Y2w4SXJYxo",
    source: "ifixit"
  },
  "MacBook Pro 15\" Mid 2015": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/2jMLH1Y2w4SXJYxo.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/2jMLH1Y2w4SXJYxo.mini",
    ifixit_image: "2jMLH1Y2w4SXJYxo",
    source: "ifixit"
  },
  "MacBook Pro 15\" 2016": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/LRx35uqNpNZH6w4E.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/LRx35uqNpNZH6w4E.mini",
    ifixit_image: "LRx35uqNpNZH6w4E",
    source: "ifixit"
  },
  "MacBook Pro 15\" 2017": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/LRx35uqNpNZH6w4E.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/LRx35uqNpNZH6w4E.mini",
    ifixit_image: "LRx35uqNpNZH6w4E",
    source: "ifixit"
  },
  "MacBook Pro 15\" 2018": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/LRx35uqNpNZH6w4E.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/LRx35uqNpNZH6w4E.mini",
    ifixit_image: "LRx35uqNpNZH6w4E",
    source: "ifixit"
  },
  "MacBook Pro 15\" 2019": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/LRx35uqNpNZH6w4E.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/LRx35uqNpNZH6w4E.mini",
    ifixit_image: "LRx35uqNpNZH6w4E",
    source: "ifixit"
  },
  
  // MacBook Pro 16" models
  "MacBook Pro 16\" 2019": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/fgqVMq2PSZJRbWai.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/fgqVMq2PSZJRbWai.mini",
    ifixit_image: "fgqVMq2PSZJRbWai",
    source: "ifixit"
  },
  "MacBook Pro 16\" M2 Pro 2023": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/LQmFBGBScQQYwJmm.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/LQmFBGBScQQYwJmm.mini",
    ifixit_image: "LQmFBGBScQQYwJmm",
    source: "ifixit"
  },
  
  // 2024 models - use latest design from iFixit
  "MacBook Pro 16\" M4 2024": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/cBXYN4cDDdMwWcFm.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/cBXYN4cDDdMwWcFm.mini",
    ifixit_image: "cBXYN4cDDdMwWcFm",
    source: "ifixit"
  },
  
  // M5 2025 models - use latest design from iFixit
  "MacBook Pro 14-inch M5 2025": {
    icon_url: "https://guide-images.cdn.ifixit.com/igi/cBXYN4cDDdMwWcFm.standard",
    icon_small: "https://guide-images.cdn.ifixit.com/igi/cBXYN4cDDdMwWcFm.mini",
    ifixit_image: "cBXYN4cDDdMwWcFm",
    source: "ifixit"
  }
};

// Read current files
const dataDir = path.join(__dirname, '..', 'public', 'data');
const devicesPath = path.join(dataDir, 'devices.json');
const iconsPath = path.join(dataDir, 'device_icons.json');

const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf8'));
const icons = JSON.parse(fs.readFileSync(iconsPath, 'utf8'));

let updatedCount = 0;

// Update devices.json
devices.forEach(device => {
  if (macbookIcons[device.name]) {
    const iconData = macbookIcons[device.name];
    device.device_icon = iconData.icon_url;
    device.device_icon_small = iconData.icon_small;
    device.icon_source = iconData.source;
    updatedCount++;
    console.log(`Updated: ${device.name}`);
  }
});

// Update device_icons.json
if (!icons.device_icons.MacBook) {
  icons.device_icons.MacBook = {};
}

Object.entries(macbookIcons).forEach(([name, data]) => {
  icons.device_icons.MacBook[name] = data;
});

// Update statistics
let totalIcons = 0;
let byCategory = {};
let bySource = { ifixit: 0, pngimg: 0, icons8: 0 };

Object.entries(icons.device_icons).forEach(([category, deviceList]) => {
  const count = Object.keys(deviceList).length;
  byCategory[category] = count;
  totalIcons += count;
  
  Object.values(deviceList).forEach(icon => {
    if (icon.source && bySource[icon.source] !== undefined) {
      bySource[icon.source]++;
    }
  });
});

icons.statistics = {
  total_icons: totalIcons,
  by_category: byCategory,
  by_source: bySource
};

icons._metadata.updated = new Date().toISOString().split('T')[0];

// Save updated files
fs.writeFileSync(devicesPath, JSON.stringify(devices, null, 2));
fs.writeFileSync(iconsPath, JSON.stringify(icons, null, 2));

console.log(`\n=== MacBook Icons Update Complete ===`);
console.log(`Updated ${updatedCount} MacBook devices with iFixit images`);
console.log(`Total icons: ${totalIcons}`);
console.log(`By category:`, byCategory);
console.log(`By source:`, bySource);
