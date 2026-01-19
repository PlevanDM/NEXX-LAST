/**
 * Update iPad devices with IC data from open-source teardowns
 * Sources: iFixit, TechInsights
 */

const fs = require('fs');
const path = require('path');

const devicesPath = path.join(__dirname, '../public/data/devices.json');
const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf8'));

// iPad Pro M4 (2024) data from iFixit teardown
const ipadProM4Data = {
  processor: "Apple M4",
  processor_details: "APL1206/339S01449 S - Deca-core (4P + 6E)",
  process_node: "3nm N3E",
  charging_ic: {
    main: "SN25A23",
    designation: "USB Type-C Controller",
    manufacturer: "Texas Instruments"
  },
  power_ics: [
    { name: "APL1066/343S00682", function: "Main PMIC" },
    { name: "APL1067/343S00683", function: "Secondary PMIC" },
    { name: "338S00990-A1", function: "Camera/Sensor PMIC" },
    { name: "343S00613-A0", function: "Power Management" },
    { name: "343S00377", function: "Power Distribution" }
  ],
  audio_ic: {
    name: "MAX98709B",
    designation: "Audio Amplifier",
    manufacturer: "Analog Devices"
  },
  wifi_bt_ic: {
    name: "339S01360",
    designation: "WiFi/BT Module",
    features: ["WiFi 6E", "Bluetooth 5.3", "Ultra Wideband"]
  },
  modem: {
    name: "SDX71M-000",
    designation: "Snapdragon X70 Modem (Cellular models)",
    manufacturer: "Qualcomm",
    features: ["5G Sub-6", "5G mmWave", "LTE-Advanced Pro"]
  },
  rf_transceiver: "SDR735-001 (Qualcomm)",
  touch_controllers: [
    { name: "BCM15900B0", function: "Main Touch Controller", manufacturer: "Broadcom" },
    { name: "BCM15957A0", function: "Apple Pencil/Hover Controller", manufacturer: "Broadcom" }
  ],
  thunderbolt: "Apple U0MAR9-Y7 (Thunderbolt 3)",
  flash_driver: "LM3567A1 (Texas Instruments)",
  sensors: [
    { name: "Bosch Sensortec", function: "Accelerometer & Gyroscope" },
    { name: "Bosch Sensortec", function: "Barometer/Pressure Sensor" }
  ],
  nfc: "NXP Semiconductors (Wireless Charging Controller)",
  memory: {
    ram: "Micron MT62F768M64D4AS-026 XT:B - 6/8 GB LPDDR5X",
    storage: "Kioxia K5A4RE0344CA12329 - 256GB/512GB/1TB/2TB NAND"
  },
  esim: "STMicroelectronics ST33J (Secure Element)"
};

// Update iPad devices
devices.forEach((device, index) => {
  // iPad Pro 11" M4 (2024)
  if (device.name && device.name.includes("iPad Pro 11") && device.name.includes("M4")) {
    devices[index] = {
      ...device,
      processor: "Apple M4 (APL1206)",
      processor_details: "10-core CPU (4P + 6E), 10-core GPU, 16-core Neural Engine",
      process_node: "3nm N3E",
      charging_ic: ipadProM4Data.charging_ic,
      power_ics: ipadProM4Data.power_ics,
      audio_ic: ipadProM4Data.audio_ic,
      wifi_bt_ic: ipadProM4Data.wifi_bt_ic,
      touch_controllers: ipadProM4Data.touch_controllers,
      flash_driver: ipadProM4Data.flash_driver,
      connector_type: "USB-C / Thunderbolt 3",
      ram: "8GB LPDDR5X",
      fast_charging: "35W (USB-C PD)"
    };
    console.log(`✅ Updated: ${device.name}`);
  }
  
  // iPad Pro 13" M4 (2024)
  if (device.name && device.name.includes("iPad Pro 13") && device.name.includes("M4")) {
    devices[index] = {
      ...device,
      processor: "Apple M4 (APL1206)",
      processor_details: "10-core CPU (4P + 6E), 10-core GPU, 16-core Neural Engine",
      process_node: "3nm N3E",
      charging_ic: ipadProM4Data.charging_ic,
      power_ics: ipadProM4Data.power_ics,
      audio_ic: ipadProM4Data.audio_ic,
      wifi_bt_ic: ipadProM4Data.wifi_bt_ic,
      modem: ipadProM4Data.modem,
      rf_transceiver: ipadProM4Data.rf_transceiver,
      touch_controllers: ipadProM4Data.touch_controllers,
      flash_driver: ipadProM4Data.flash_driver,
      connector_type: "USB-C / Thunderbolt 3",
      ram: "8GB/16GB LPDDR5X",
      fast_charging: "35W (USB-C PD)"
    };
    console.log(`✅ Updated: ${device.name}`);
  }
  
  // iPad Pro 11" M2 (2022)
  if (device.name && device.name.includes("iPad Pro 11") && device.name.includes("M2")) {
    devices[index] = {
      ...device,
      processor: "Apple M2",
      charging_ic: {
        main: "SN2501",
        designation: "USB-C Controller"
      },
      connector_type: "USB-C / Thunderbolt",
      ram: "8GB LPDDR5"
    };
    console.log(`✅ Updated: ${device.name}`);
  }
  
  // iPad Pro 12.9" M2 (2022)
  if (device.name && (device.name.includes("iPad Pro 12.9") || device.name.includes("iPad Pro 13")) && device.name.includes("M2")) {
    devices[index] = {
      ...device,
      processor: "Apple M2",
      charging_ic: {
        main: "SN2501",
        designation: "USB-C Controller"
      },
      connector_type: "USB-C / Thunderbolt",
      ram: "8GB/16GB LPDDR5"
    };
    console.log(`✅ Updated: ${device.name}`);
  }
  
  // iPad Air M2 (2024)
  if (device.name && device.name.includes("iPad Air") && (device.name.includes("M2") || device.name.includes("2024"))) {
    devices[index] = {
      ...device,
      processor: "Apple M2",
      charging_ic: {
        main: "SN2501",
        designation: "USB-C Controller"
      },
      wifi_bt_ic: {
        name: "339S00833",
        features: ["WiFi 6E", "Bluetooth 5.3"]
      },
      connector_type: "USB-C",
      ram: "8GB LPDDR5"
    };
    console.log(`✅ Updated: ${device.name}`);
  }

  // iPad mini 7 (2024)
  if (device.name && device.name.includes("iPad mini") && (device.name.includes("7") || device.name.includes("2024"))) {
    devices[index] = {
      ...device,
      processor: "Apple A17 Pro",
      charging_ic: {
        main: "SN2800",
        designation: "USB-C Controller"
      },
      wifi_bt_ic: {
        name: "339S00883",
        features: ["WiFi 6E", "Bluetooth 5.3"]
      },
      connector_type: "USB-C",
      ram: "8GB LPDDR5X"
    };
    console.log(`✅ Updated: ${device.name}`);
  }
  
  // iPad 10th Gen (2022)
  if (device.name && device.name.includes("iPad") && device.name.includes("10th")) {
    devices[index] = {
      ...device,
      processor: "Apple A14 Bionic",
      charging_ic: {
        main: "SN2611A0",
        designation: "USB-C Controller"
      },
      connector_type: "USB-C",
      ram: "4GB LPDDR4X"
    };
    console.log(`✅ Updated: ${device.name}`);
  }
});

// Update iPhone 16 series with detailed IC data
devices.forEach((device, index) => {
  if (device.name && device.name.includes("iPhone 16 Pro Max")) {
    devices[index] = {
      ...device,
      processor: "Apple A18 Pro (APL1V07/339S01527)",
      processor_details: "6-core CPU (2P + 4E), 6-core GPU, 16-core Neural Engine",
      process_node: "3nm N3E",
      charging_ic: {
        main: "SN2012027",
        designation: "USB Type-C Controller",
        secondary: "CP3200B1G0 (Battery Charger)"
      },
      power_ics: [
        { name: "APL109A/338S01119", function: "Main PMIC" },
        { name: "STPMIA3C", function: "Secondary PMIC" }
      ],
      audio_ics: [
        { name: "338S00967", function: "Audio Codec" },
        { name: "338S01087", function: "Audio Amplifier" }
      ],
      wifi_bt_ic: {
        name: "339S01464",
        features: ["WiFi 7", "Bluetooth 5.3", "UWB 2", "Thread"]
      },
      baseband: {
        modem: "Qualcomm SDX71M (X70)",
        pmic: "PMX75"
      },
      display_ic: {
        pmic: "TPS65657B0",
        controller: "338S00843"
      },
      wireless_charging_ic: "BCM59367A1",
      flash_driver: "LM3567A1",
      nfc_ic: "30V4E0",
      ram: "8GB LPDDR5X",
      nand: "256GB/512GB/1TB Kioxia"
    };
    console.log(`✅ Updated IC data: ${device.name}`);
  }
  
  if (device.name && device.name.includes("iPhone 16 Pro") && !device.name.includes("Max")) {
    devices[index] = {
      ...device,
      processor: "Apple A18 Pro",
      charging_ic: {
        main: "SN2012027",
        designation: "USB Type-C Controller",
        secondary: "CP3200B1G0"
      },
      power_ics: [
        { name: "APL109A/338S01119", function: "Main PMIC" },
        { name: "STPMIA3C", function: "Secondary PMIC" }
      ],
      audio_ics: [
        { name: "338S00967", function: "Audio Codec" },
        { name: "338S01087", function: "Audio Amplifier" }
      ],
      wifi_bt_ic: {
        name: "339S01464",
        features: ["WiFi 7", "Bluetooth 5.3", "UWB 2"]
      },
      baseband: {
        modem: "Qualcomm X70",
        pmic: "PMX75"
      },
      display_ic: "TPS65657B0",
      wireless_charging_ic: "BCM59367A1",
      nfc_ic: "30V4E0"
    };
    console.log(`✅ Updated IC data: ${device.name}`);
  }
  
  if (device.name && device.name.includes("iPhone 16 Plus")) {
    devices[index] = {
      ...device,
      processor: "Apple A18",
      charging_ic: {
        main: "SN2012027",
        designation: "USB Type-C Controller"
      },
      audio_ic: { name: "338S00967", function: "Audio Codec" },
      wifi_bt_ic: {
        name: "339S00912",
        features: ["WiFi 7", "Bluetooth 5.3", "UWB 2"]
      },
      baseband: {
        modem: "Qualcomm X70",
        pmic: "PMX75"
      },
      display_ic: "TPS65657B0",
      wireless_charging_ic: "BCM59367A1",
      nfc_ic: "30V4E0"
    };
    console.log(`✅ Updated IC data: ${device.name}`);
  }
  
  if (device.name && device.name === "iPhone 16") {
    devices[index] = {
      ...device,
      processor: "Apple A18",
      charging_ic: {
        main: "SN2012027",
        designation: "USB Type-C Controller"
      },
      audio_ic: { name: "338S00967", function: "Audio Codec" },
      wifi_bt_ic: {
        name: "339S00912",
        features: ["WiFi 7", "Bluetooth 5.3", "UWB 2"]
      },
      baseband: {
        modem: "Qualcomm X70",
        pmic: "PMX75"
      },
      display_ic: "TPS65657B0",
      wireless_charging_ic: "BCM59367A1",
      nfc_ic: "30V4E0"
    };
    console.log(`✅ Updated IC data: ${device.name}`);
  }
});

// Save updated devices
fs.writeFileSync(devicesPath, JSON.stringify(devices, null, 2), 'utf8');

console.log('\n📊 Devices Update Summary:');
console.log('============================');
console.log(`Total devices: ${devices.length}`);
console.log(`iPads: ${devices.filter(d => d.category === 'iPad').length}`);
console.log(`iPhones: ${devices.filter(d => d.category === 'iPhone').length}`);
console.log(`MacBooks: ${devices.filter(d => d.category === 'MacBook').length}`);
console.log('============================');
console.log(`✅ Devices saved to ${devicesPath}`);
