/**
 * Expand IC Database with open-source data from 2024-2026
 * Sources: iFixit, repair.wiki, TechInsights, Rossmann Group
 */

const fs = require('fs');
const path = require('path');

const icCompatibilityPath = path.join(__dirname, '../public/data/ic_compatibility.json');

// Read existing data
const icData = JSON.parse(fs.readFileSync(icCompatibilityPath, 'utf8'));

// =====================
// NEW U2/Tristar ICs (from open-source repair data)
// =====================
const newChargingICs = [
  {
    name: "1616A0",
    designation: "U2 / Tristar",
    package: "BGA",
    compatible_devices: [
      "iPhone 13",
      "iPhone 13 mini",
      "iPhone 13 Pro",
      "iPhone 13 Pro Max"
    ],
    functions: [
      "USB enumeration",
      "Charging negotiation",
      "Data line control",
      "MFi authentication"
    ],
    symptoms_when_faulty: [
      "Not charging",
      "Accessory not supported",
      "iTunes not detecting device",
      "Fake charging"
    ],
    diagnostics: {
      diode_mode: {
        "D+": "0.450-0.620V",
        "D-": "0.450-0.620V"
      },
      current_draw: "Normal: 0.15-0.55A idle"
    },
    price_range: "$12-25",
    difficulty: "Expert"
  },
  {
    name: "1618A0",
    designation: "U2 / Tristar (USB-C transition)",
    package: "BGA",
    compatible_devices: [
      "iPhone 14 Pro",
      "iPhone 14 Pro Max"
    ],
    functions: [
      "USB enumeration",
      "USB-PD 3.0 support",
      "Fast charging up to 27W",
      "MFi authentication"
    ],
    symptoms_when_faulty: [
      "Not charging",
      "No fast charging",
      "USB-C not detected",
      "Accessory not supported"
    ],
    diagnostics: {
      diode_mode: {
        "CC1": "0.420-0.580V",
        "CC2": "0.420-0.580V"
      },
      current_draw: "Normal: 0.18-0.65A idle"
    },
    price_range: "$18-35",
    difficulty: "Expert"
  },
  {
    name: "SN2012027",
    designation: "USB Type-C Controller (iPad Pro M4)",
    package: "BGA",
    manufacturer: "Texas Instruments",
    compatible_devices: [
      "iPad Pro 11\" M4 (2024)",
      "iPad Pro 13\" M4 (2024)"
    ],
    functions: [
      "USB-C PD 3.1",
      "Thunderbolt 3 passthrough",
      "Fast charging up to 35W",
      "DisplayPort Alt Mode"
    ],
    symptoms_when_faulty: [
      "Not charging via USB-C",
      "No data transfer",
      "No video output",
      "Thunderbolt not working"
    ],
    price_range: "$20-40",
    difficulty: "Expert"
  },
  {
    name: "CP3200B1G0",
    designation: "Battery Charger (iPhone 16)",
    package: "BGA",
    manufacturer: "Texas Instruments",
    compatible_devices: [
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max"
    ],
    functions: [
      "Battery charging control",
      "Fast charging management",
      "Thermal protection",
      "Battery health monitoring"
    ],
    symptoms_when_faulty: [
      "Not charging",
      "Slow charging only",
      "Battery health issues",
      "Overheating while charging"
    ],
    price_range: "$15-30",
    difficulty: "Expert"
  }
];

// =====================
// NEW Audio ICs (from iFixit teardowns)
// =====================
const newAudioICs = [
  {
    name: "338S00967",
    designation: "Audio Codec (iPhone 16)",
    package: "BGA",
    manufacturer: "Cirrus Logic",
    compatible_devices: [
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max"
    ],
    functions: [
      "Audio codec",
      "Voice processing",
      "Spatial Audio support",
      "Advanced noise cancellation"
    ],
    symptoms_when_faulty: [
      "No audio output",
      "Microphone not working",
      "Spatial Audio issues",
      "Call audio problems",
      "Voice memos grayed out"
    ],
    diagnostics: {
      voltage: "PP1V8_AUDIO: 1.8V"
    },
    price_range: "$12-25",
    difficulty: "Expert"
  },
  {
    name: "338S01087",
    designation: "Audio Amplifier (iPhone 16 Pro)",
    package: "BGA",
    manufacturer: "Cirrus Logic",
    compatible_devices: [
      "iPhone 16 Pro",
      "iPhone 16 Pro Max"
    ],
    functions: [
      "Speaker amplification",
      "Stereo output",
      "High-fidelity audio"
    ],
    symptoms_when_faulty: [
      "No speaker sound",
      "Low volume",
      "Distorted audio",
      "One speaker not working"
    ],
    price_range: "$10-20",
    difficulty: "Advanced"
  },
  {
    name: "338S00509",
    designation: "Big Audio Codec",
    package: "BGA",
    manufacturer: "Cirrus Logic / CS42L77A1",
    compatible_devices: [
      "iPhone 11",
      "iPhone 11 Pro",
      "iPhone 11 Pro Max",
      "iPhone 12",
      "iPhone 12 mini",
      "iPhone 12 Pro",
      "iPhone 12 Pro Max"
    ],
    functions: [
      "Main audio codec",
      "Microphone processing",
      "Speaker amplification",
      "Siri audio"
    ],
    symptoms_when_faulty: [
      "No sound",
      "No microphone",
      "Voice memos grayed out",
      "Siri not working"
    ],
    price_range: "$8-18",
    difficulty: "Expert"
  },
  {
    name: "MAX98709B",
    designation: "Audio Amplifier (iPad Pro M4)",
    package: "BGA",
    manufacturer: "Analog Devices",
    compatible_devices: [
      "iPad Pro 11\" M4 (2024)",
      "iPad Pro 13\" M4 (2024)"
    ],
    functions: [
      "Speaker amplification",
      "Quad speaker control",
      "Spatial Audio support"
    ],
    symptoms_when_faulty: [
      "No speaker output",
      "Distorted audio",
      "Only some speakers working"
    ],
    price_range: "$15-30",
    difficulty: "Expert"
  }
];

// =====================
// NEW WiFi/BT ICs
// =====================
const newWifiBtICs = [
  {
    name: "339S01464",
    designation: "WiFi/BT Module (iPhone 16 Pro)",
    package: "BGA Module",
    manufacturer: "USI",
    compatible_devices: [
      "iPhone 16 Pro",
      "iPhone 16 Pro Max"
    ],
    functions: [
      "WiFi 7 (802.11be)",
      "Bluetooth 5.3",
      "Ultra Wideband 2 (U2)",
      "Thread support",
      "Precision Finding"
    ],
    symptoms_when_faulty: [
      "No WiFi",
      "WiFi greyed out",
      "No Bluetooth",
      "AirDrop not working",
      "Find My issues"
    ],
    diagnostics: {
      voltage: "PP1V8_WLAN: 1.8V, PP3V3_WLAN: 3.3V"
    },
    price_range: "$60-120",
    difficulty: "Expert",
    repair_tips: [
      "NAND unbind required for replacement",
      "Use JC WiFi programmer for activation"
    ]
  },
  {
    name: "339S01360",
    designation: "WiFi/BT Module (iPad Pro M4)",
    package: "BGA Module",
    manufacturer: "Apple",
    compatible_devices: [
      "iPad Pro 11\" M4 (2024)",
      "iPad Pro 13\" M4 (2024)"
    ],
    functions: [
      "WiFi 6E",
      "Bluetooth 5.3",
      "Ultra Wideband"
    ],
    symptoms_when_faulty: [
      "No WiFi",
      "WiFi greyed out",
      "No Bluetooth",
      "AirDrop not working"
    ],
    price_range: "$50-100",
    difficulty: "Expert"
  },
  {
    name: "USI 339M00326",
    designation: "UWB Module (iPhone 16 Pro)",
    package: "Module",
    manufacturer: "USI",
    compatible_devices: [
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max"
    ],
    functions: [
      "Ultra Wideband 2.0",
      "Precision Finding",
      "AirTag tracking",
      "Car key"
    ],
    symptoms_when_faulty: [
      "No Precision Finding",
      "AirTag issues",
      "Car key not working",
      "Find My accuracy issues"
    ],
    price_range: "$30-60",
    difficulty: "Expert"
  }
];

// =====================
// NEW NFC ICs
// =====================
const newNfcICs = [
  {
    name: "30V4E0",
    designation: "NFC Control IC",
    package: "BGA",
    manufacturer: "NXP",
    compatible_devices: [
      "iPhone 15",
      "iPhone 15 Plus",
      "iPhone 15 Pro",
      "iPhone 15 Pro Max",
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max"
    ],
    functions: [
      "NFC communication",
      "Apple Pay",
      "Transit cards",
      "Car keys"
    ],
    symptoms_when_faulty: [
      "Apple Pay not working",
      "NFC not detected",
      "Express Transit cards issues",
      "Car key not working"
    ],
    price_range: "$15-30",
    difficulty: "Advanced"
  }
];

// =====================
// NEW Power Management ICs (from iPad Pro M4 teardown)
// =====================
const newPowerICs = [
  {
    name: "APL1066/343S00682",
    designation: "Power Management (iPad Pro M4)",
    package: "BGA",
    manufacturer: "Apple",
    compatible_devices: [
      "iPad Pro 11\" M4 (2024)",
      "iPad Pro 13\" M4 (2024)"
    ],
    functions: [
      "Main power management",
      "Voltage regulation",
      "M4 chip power supply"
    ],
    symptoms_when_faulty: [
      "No power",
      "Boot loop",
      "Random shutdowns"
    ],
    price_range: "$40-80",
    difficulty: "Expert"
  },
  {
    name: "APL1067/343S00683",
    designation: "Secondary PMIC (iPad Pro M4)",
    package: "BGA",
    manufacturer: "Apple",
    compatible_devices: [
      "iPad Pro 11\" M4 (2024)",
      "iPad Pro 13\" M4 (2024)"
    ],
    functions: [
      "Secondary power management",
      "Peripheral power",
      "Display power"
    ],
    symptoms_when_faulty: [
      "Display issues",
      "Peripheral failures",
      "Battery issues"
    ],
    price_range: "$35-70",
    difficulty: "Expert"
  },
  {
    name: "338S00990-A1",
    designation: "Power Management (iPad Pro M4)",
    package: "BGA",
    manufacturer: "Apple",
    compatible_devices: [
      "iPad Pro 11\" M4 (2024)",
      "iPad Pro 13\" M4 (2024)"
    ],
    functions: [
      "Power distribution",
      "Camera power",
      "Sensor power"
    ],
    symptoms_when_faulty: [
      "Camera not working",
      "Sensor issues"
    ],
    price_range: "$25-50",
    difficulty: "Expert"
  },
  {
    name: "APL109A/338S01119",
    designation: "Main PMIC (iPhone 16 Pro)",
    package: "PoP",
    manufacturer: "Apple",
    compatible_devices: [
      "iPhone 16 Pro",
      "iPhone 16 Pro Max"
    ],
    functions: [
      "Main power management",
      "A18 Pro power supply",
      "Voltage regulation"
    ],
    symptoms_when_faulty: [
      "No power",
      "Boot loop",
      "Battery drain",
      "Overheating"
    ],
    price_range: "$50-100",
    difficulty: "Expert (requires reballing)"
  },
  {
    name: "STPMIA3C",
    designation: "Secondary PMIC (iPhone 16 Pro)",
    package: "BGA",
    manufacturer: "STMicroelectronics",
    compatible_devices: [
      "iPhone 16 Pro",
      "iPhone 16 Pro Max"
    ],
    functions: [
      "Secondary power management",
      "Peripheral power",
      "Sensor power"
    ],
    symptoms_when_faulty: [
      "Camera issues",
      "Face ID issues",
      "Sensor failures"
    ],
    price_range: "$20-40",
    difficulty: "Expert"
  }
];

// =====================
// NEW Display ICs
// =====================
const newDisplayICs = [
  {
    name: "TPS65657B0",
    designation: "Display Power Supply (iPhone 16)",
    package: "BGA",
    manufacturer: "Texas Instruments",
    compatible_devices: [
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max"
    ],
    functions: [
      "Display power supply",
      "OLED panel power",
      "Backlight control"
    ],
    symptoms_when_faulty: [
      "No display",
      "Dim display",
      "Display flickering",
      "Green/purple lines"
    ],
    price_range: "$15-30",
    difficulty: "Expert"
  },
  {
    name: "338S00843",
    designation: "Display PMIC (iPhone 15/16)",
    package: "BGA",
    manufacturer: "Cirrus Logic",
    compatible_devices: [
      "iPhone 15",
      "iPhone 15 Plus",
      "iPhone 15 Pro",
      "iPhone 15 Pro Max",
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max"
    ],
    functions: [
      "Display power management",
      "ProMotion support",
      "Always-On display"
    ],
    symptoms_when_faulty: [
      "Display issues",
      "ProMotion not working",
      "Always-On issues"
    ],
    price_range: "$20-40",
    difficulty: "Expert"
  }
];

// =====================
// NEW Baseband/Modem ICs
// =====================
const newBasebandICs = [
  {
    name: "SDX71M-000",
    designation: "Snapdragon X70 Modem (iPad Pro M4)",
    package: "PoP",
    manufacturer: "Qualcomm",
    compatible_devices: [
      "iPad Pro 11\" M4 (2024) Cellular",
      "iPad Pro 13\" M4 (2024) Cellular"
    ],
    functions: [
      "5G NR (Sub-6 + mmWave)",
      "4G LTE-Advanced Pro",
      "Satellite connectivity support"
    ],
    symptoms_when_faulty: [
      "No cellular service",
      "No 5G",
      "Searching constantly",
      "No IMEI"
    ],
    price_range: "$80-150",
    difficulty: "Expert (reballing required)"
  },
  {
    name: "SDR735-001",
    designation: "RF Transceiver (iPhone 16/iPad Pro M4)",
    package: "BGA",
    manufacturer: "Qualcomm",
    compatible_devices: [
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max",
      "iPad Pro 11\" M4 (2024)",
      "iPad Pro 13\" M4 (2024)"
    ],
    functions: [
      "RF signal processing",
      "5G NR transceiver",
      "LTE transceiver"
    ],
    symptoms_when_faulty: [
      "Weak signal",
      "No cellular data",
      "Dropped calls",
      "No 5G"
    ],
    price_range: "$30-60",
    difficulty: "Expert"
  }
];

// =====================
// NEW Flash/Memory ICs
// =====================
const newFlashICs = [
  {
    name: "GD25Q80E",
    designation: "Serial NOR Flash (iPhone 16)",
    package: "SOIC-8",
    manufacturer: "GigaDevice",
    compatible_devices: [
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max"
    ],
    functions: [
      "Boot firmware storage",
      "Calibration data",
      "System configuration"
    ],
    symptoms_when_faulty: [
      "Boot loop",
      "No boot",
      "Calibration issues"
    ],
    price_range: "$2-5",
    difficulty: "Advanced"
  },
  {
    name: "K5A3RF9864",
    designation: "128GB NAND Flash (iPhone 16)",
    package: "PoP",
    manufacturer: "Kioxia",
    compatible_devices: [
      "iPhone 16 128GB",
      "iPhone 16 Plus 128GB"
    ],
    functions: [
      "Data storage",
      "iOS installation",
      "User data"
    ],
    symptoms_when_faulty: [
      "Error 4013/4014",
      "Storage full",
      "Boot loop",
      "Unable to restore"
    ],
    price_range: "$50-100",
    difficulty: "Specialist (NAND programming required)"
  }
];

// =====================
// Apple Watch ICs (from Series 10 teardown)
// =====================
const appleWatchICs = [
  {
    name: "S10 SiP",
    designation: "System in Package (Apple Watch Series 10)",
    package: "SiP",
    manufacturer: "Apple",
    compatible_devices: [
      "Apple Watch Series 10 (42mm)",
      "Apple Watch Series 10 (46mm)"
    ],
    functions: [
      "Main processor",
      "Neural Engine",
      "Power management",
      "Wireless connectivity"
    ],
    integrated_components: [
      "Apple S10 CPU",
      "4-core Neural Engine",
      "WiFi/BT module",
      "U1 Ultra Wideband",
      "W3 Wireless chip"
    ],
    symptoms_when_faulty: [
      "No power",
      "Boot loop",
      "No wireless connectivity",
      "Double tap not working"
    ],
    price_range: "N/A (not field serviceable)",
    difficulty: "Not repairable"
  },
  {
    name: "S9 SiP",
    designation: "System in Package (Apple Watch Series 9)",
    package: "SiP",
    manufacturer: "Apple",
    compatible_devices: [
      "Apple Watch Series 9 (41mm)",
      "Apple Watch Series 9 (45mm)",
      "Apple Watch Ultra 2"
    ],
    functions: [
      "Main processor",
      "Neural Engine",
      "Power management",
      "Wireless connectivity"
    ],
    symptoms_when_faulty: [
      "No power",
      "Boot loop",
      "No connectivity"
    ],
    price_range: "N/A (not field serviceable)",
    difficulty: "Not repairable"
  }
];

// =====================
// Sensor/Touch ICs
// =====================
const newSensorICs = [
  {
    name: "BCM15900B0",
    designation: "Touchscreen Controller (iPad Pro M4)",
    package: "BGA",
    manufacturer: "Broadcom",
    compatible_devices: [
      "iPad Pro 11\" M4 (2024)",
      "iPad Pro 13\" M4 (2024)"
    ],
    functions: [
      "Touch detection",
      "Multi-touch processing",
      "Palm rejection"
    ],
    symptoms_when_faulty: [
      "Touch not working",
      "Ghost touches",
      "Unresponsive areas"
    ],
    price_range: "$20-40",
    difficulty: "Expert"
  },
  {
    name: "BCM15957A0",
    designation: "Secondary Touch Controller (iPad Pro M4)",
    package: "BGA",
    manufacturer: "Broadcom",
    compatible_devices: [
      "iPad Pro 11\" M4 (2024)",
      "iPad Pro 13\" M4 (2024)"
    ],
    functions: [
      "Apple Pencil input",
      "Hover detection",
      "Pressure sensing"
    ],
    symptoms_when_faulty: [
      "Apple Pencil not working",
      "Hover not working",
      "Pressure issues"
    ],
    price_range: "$20-40",
    difficulty: "Expert"
  },
  {
    name: "Bosch Sensortec BMI323",
    designation: "Accelerometer/Gyroscope (iPhone 16)",
    package: "LGA",
    manufacturer: "Bosch Sensortec",
    compatible_devices: [
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max"
    ],
    functions: [
      "Motion detection",
      "Gyroscope",
      "Auto-rotate",
      "Step counting"
    ],
    symptoms_when_faulty: [
      "No auto-rotate",
      "Compass not working",
      "Fitness tracking issues"
    ],
    price_range: "$5-15",
    difficulty: "Advanced"
  }
];

// =====================
// Wireless Charging ICs
// =====================
const newWirelessChargingICs = [
  {
    name: "BCM59367A1",
    designation: "Wireless Charging Controller (iPhone 16)",
    package: "BGA",
    manufacturer: "Broadcom",
    compatible_devices: [
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max"
    ],
    functions: [
      "MagSafe charging control",
      "Qi2 support",
      "Wireless power negotiation",
      "Foreign object detection"
    ],
    symptoms_when_faulty: [
      "No wireless charging",
      "MagSafe not working",
      "Slow wireless charging",
      "Overheating during charging"
    ],
    price_range: "$20-40",
    difficulty: "Expert"
  }
];

// =====================
// LED Flash Driver ICs
// =====================
const newFlashDriverICs = [
  {
    name: "LM3567A1",
    designation: "LED Flash Driver",
    package: "WLCSP",
    manufacturer: "Texas Instruments",
    compatible_devices: [
      "iPhone 15",
      "iPhone 15 Plus",
      "iPhone 15 Pro",
      "iPhone 15 Pro Max",
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max",
      "iPad Pro 11\" M4 (2024)",
      "iPad Pro 13\" M4 (2024)"
    ],
    functions: [
      "LED flash control",
      "True Tone flash",
      "Torch mode"
    ],
    symptoms_when_faulty: [
      "Flash not working",
      "Torch not working",
      "Dim flash"
    ],
    price_range: "$5-10",
    difficulty: "Advanced"
  }
];

// =====================
// Update the database
// =====================

// Add new charging ICs
newChargingICs.forEach(ic => {
  if (!icData.charging_ics.find(existing => existing.name === ic.name)) {
    icData.charging_ics.push(ic);
    console.log(`✅ Added charging IC: ${ic.name}`);
  }
});

// Add new audio ICs
newAudioICs.forEach(ic => {
  if (!icData.audio_ics.find(existing => existing.name === ic.name)) {
    icData.audio_ics.push(ic);
    console.log(`✅ Added audio IC: ${ic.name}`);
  }
});

// Add new WiFi/BT ICs
newWifiBtICs.forEach(ic => {
  if (!icData.wifi_bt_ics.find(existing => existing.name === ic.name)) {
    icData.wifi_bt_ics.push(ic);
    console.log(`✅ Added WiFi/BT IC: ${ic.name}`);
  }
});

// Add new Power ICs
newPowerICs.forEach(ic => {
  if (!icData.power_ics.find(existing => existing.name === ic.name)) {
    icData.power_ics.push(ic);
    console.log(`✅ Added Power IC: ${ic.name}`);
  }
});

// Add new Baseband ICs
newBasebandICs.forEach(ic => {
  if (!icData.baseband_ics.find(existing => existing.name === ic.name)) {
    icData.baseband_ics.push(ic);
    console.log(`✅ Added Baseband IC: ${ic.name}`);
  }
});

// Create new categories if they don't exist
if (!icData.display_ics) {
  icData.display_ics = [];
}
newDisplayICs.forEach(ic => {
  if (!icData.display_ics.find(existing => existing.name === ic.name)) {
    icData.display_ics.push(ic);
    console.log(`✅ Added Display IC: ${ic.name}`);
  }
});

if (!icData.nfc_ics) {
  icData.nfc_ics = [];
}
newNfcICs.forEach(ic => {
  if (!icData.nfc_ics.find(existing => existing.name === ic.name)) {
    icData.nfc_ics.push(ic);
    console.log(`✅ Added NFC IC: ${ic.name}`);
  }
});

if (!icData.sensor_ics) {
  icData.sensor_ics = [];
}
newSensorICs.forEach(ic => {
  if (!icData.sensor_ics.find(existing => existing.name === ic.name)) {
    icData.sensor_ics.push(ic);
    console.log(`✅ Added Sensor IC: ${ic.name}`);
  }
});

if (!icData.wireless_charging_ics) {
  icData.wireless_charging_ics = [];
}
newWirelessChargingICs.forEach(ic => {
  if (!icData.wireless_charging_ics.find(existing => existing.name === ic.name)) {
    icData.wireless_charging_ics.push(ic);
    console.log(`✅ Added Wireless Charging IC: ${ic.name}`);
  }
});

if (!icData.flash_driver_ics) {
  icData.flash_driver_ics = [];
}
newFlashDriverICs.forEach(ic => {
  if (!icData.flash_driver_ics.find(existing => existing.name === ic.name)) {
    icData.flash_driver_ics.push(ic);
    console.log(`✅ Added Flash Driver IC: ${ic.name}`);
  }
});

if (!icData.apple_watch_ics) {
  icData.apple_watch_ics = [];
}
appleWatchICs.forEach(ic => {
  if (!icData.apple_watch_ics.find(existing => existing.name === ic.name)) {
    icData.apple_watch_ics.push(ic);
    console.log(`✅ Added Apple Watch IC: ${ic.name}`);
  }
});

// Update stats
icData.stats = {
  charging_ics: icData.charging_ics.length,
  power_ics: icData.power_ics.length,
  audio_ics: icData.audio_ics.length,
  baseband_ics: icData.baseband_ics.length,
  wifi_bt_ics: icData.wifi_bt_ics.length,
  nand_ics: icData.nand_ics.length,
  biometric_ics: icData.biometric_ics.length,
  macbook_ics: icData.macbook_ics ? icData.macbook_ics.length : 0,
  display_ics: icData.display_ics.length,
  nfc_ics: icData.nfc_ics.length,
  sensor_ics: icData.sensor_ics.length,
  wireless_charging_ics: icData.wireless_charging_ics.length,
  flash_driver_ics: icData.flash_driver_ics.length,
  apple_watch_ics: icData.apple_watch_ics.length,
  total: 0
};

// Calculate total
icData.stats.total = Object.entries(icData.stats)
  .filter(([key]) => key !== 'total')
  .reduce((sum, [, value]) => sum + value, 0);

// Update metadata
icData.collected_at = new Date().toISOString().replace('T', ' ').slice(0, 19);
icData._metadata = {
  ...icData._metadata,
  last_updated: new Date().toISOString().slice(0, 10),
  version: "3.0",
  total_ics: icData.stats.total,
  coverage: "iPhone 5s-17, iPad Pro M4, MacBook M1-M5, Apple Watch S9-S10",
  new_categories: [
    "display_ics",
    "nfc_ics", 
    "sensor_ics",
    "wireless_charging_ics",
    "flash_driver_ics",
    "apple_watch_ics"
  ]
};

// Save updated data
fs.writeFileSync(icCompatibilityPath, JSON.stringify(icData, null, 2), 'utf8');

console.log('\n📊 IC Database Statistics:');
console.log('============================');
Object.entries(icData.stats).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});
console.log('============================');
console.log(`\n✅ Database saved to ${icCompatibilityPath}`);
console.log(`📅 Updated: ${icData.collected_at}`);
