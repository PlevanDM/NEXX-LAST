const fs = require('fs');
const path = require('path');

// iPhone 17 data from user
const iphone17Data = {
  "id": "iphone-17-2025",
  "model": "iPhone 17",
  "marketing_name": "iPhone 17",
  "year": 2025,
  "release_date": "2025-09-19",
  "announced_date": "2025-09-09",
  
  "processor": {
    "name": "Apple A19",
    "codename": "T8150a",
    "part_numbers": ["APL1V09", "339S01805"],
    "architecture": "ARMv9.2-A",
    "process_node": "3nm (TSMC N3P)",
    "transistor_count": null,
    "cpu": {
      "cores": 6,
      "performance_cores": {
        "count": 2,
        "frequency_max": "4.26 GHz"
      },
      "efficiency_cores": {
        "count": 4,
        "frequency_max": "2.60 GHz"
      }
    },
    "gpu": {
      "cores": 5,
      "architecture": "Apple10",
      "execution_units": 80,
      "alus": 640,
      "clock_speed": "1620 MHz",
      "performance_fp32": "2.074 TFLOPS",
      "features": ["Hardware Ray Tracing", "Mesh Shading"]
    },
    "neural_engine": {
      "cores": 16,
      "performance": "35 trillion operations/sec"
    }
  },
  
  "memory": {
    "ram": {
      "capacity": "8 GB",
      "type": "LPDDR5X-8533",
      "speed": "4266 MHz",
      "bus_width": "64-bit",
      "channels": 4
    },
    "storage_options": ["256 GB", "512 GB"]
  },
  
  "board_numbers": {
    "main": ["820-03152"],
    "variants": [],
    "source": "verified_2026_01"
  },
  
  "display": {
    "size": "6.3 inches",
    "resolution": "2868 x 1320",
    "technology": "Super Retina XDR OLED",
    "refresh_rate": "1-120 Hz",
    "promotion": true,
    "peak_brightness": "2000 nits",
    "hdr_peak": "2000 nits",
    "protection": "Ceramic Shield Gen 2"
  },
  
  "cameras": {
    "rear": {
      "main": {
        "megapixels": 48,
        "sensor_size": "1/1.3 inch",
        "pixel_size": "1.0 µm",
        "aperture": "f/1.6",
        "features": ["Sensor-shift OIS", "Focus Pixels", "Photonic Engine"]
      },
      "ultra_wide": {
        "megapixels": 48,
        "aperture": "f/2.2",
        "field_of_view": "120°"
      }
    },
    "front": {
      "megapixels": 18,
      "aperture": "f/1.9",
      "features": ["Center Stage", "Autofocus", "Photonic Engine"]
    }
  },
  
  "connectivity": {
    "cellular": {
      "5g": true,
      "6g": false,
      "modem": "Qualcomm Snapdragon 5G",
      "bands": ["mmWave", "Sub-6GHz"]
    },
    "wifi": {
      "standard": "Wi-Fi 7 (802.11be)",
      "chip": "Apple N1",
      "mimo": "4x4 MIMO"
    },
    "bluetooth": "6.0",
    "nfc": {
      "chip": "NXP SN300",
      "features": ["eSIM", "Secure Element"]
    },
    "uwb": {
      "chip": "Apple U2",
      "module": "USI 339M00386"
    },
    "port": "USB-C (USB 3.0)"
  },
  
  "power": {
    "battery_capacity": "3600 mAh",
    "charging_ic": {
      "primary": "CBTL1701B0",
      "manufacturer": "Cypress/Infineon",
      "type": "USB-C PD Controller"
    },
    "charging": {
      "wired_max": "35W USB-C PD",
      "magsafe": "25W MagSafe 3",
      "qi_wireless": "15W Qi2"
    },
    "battery_life": {
      "video_playback": "27 hours",
      "streaming": "20 hours",
      "audio": "85 hours"
    }
  },
  
  "critical_ics": {
    "pmu": {
      "name": "Power Management Unit",
      "part_number": "339S00980",
      "manufacturer": "Apple/Dialog"
    },
    "audio_codec": {
      "name": "Audio Codec",
      "part_number": "338S00411",
      "manufacturer": "Cirrus Logic"
    },
    "display_pmu": {
      "name": "Display Power Supply",
      "part_number": "TPS65658A0",
      "manufacturer": "Texas Instruments"
    },
    "envelope_tracker": {
      "name": "Wideband Envelope Tracker",
      "part_number": "QET7100A-002",
      "manufacturer": "Qualcomm"
    },
    "front_end_modules": [
      {
        "part_number": "AFEM-8267",
        "manufacturer": "Broadcom"
      },
      {
        "part_number": "QM76308",
        "manufacturer": "Qorvo"
      }
    ]
  },
  
  "common_issues": [
    {
      "id": "broken_display",
      "name": "Разбитый экран",
      "category": "display",
      "severity": "high",
      "symptoms": [
        "Трещины на экране",
        "Не реагирует на касания в зоне повреждения",
        "Пятна или полосы на дисплее"
      ],
      "diagnostics": [
        "Визуальный осмотр повреждений",
        "Тест Multi-Touch в Диагностике",
        "Проверка 3D Touch/Haptic Touch"
      ],
      "solutions": [
        {
          "method": "Замена дисплейного модуля в сборе",
          "difficulty": "medium",
          "time_estimate": "45-60 min",
          "parts_needed": ["Display Assembly"],
          "tools_needed": ["Pentalobe 0.8mm", "Y000 Tri-point", "Suction cup", "Heat gun"],
          "calibration_required": true,
          "repair_assistant_pairing": true
        }
      ],
      "prevention": [
        "Использование защитного стекла",
        "Чехол с поднятыми краями",
        "AppleCare+ покрытие"
      ]
    },
    {
      "id": "not_charging",
      "name": "Не заряжается",
      "category": "charging",
      "severity": "critical",
      "symptoms": [
        "Не реагирует на подключение зарядки",
        "Медленная зарядка (<5W)",
        "Перегрев в области USB-C порта",
        "Ошибка 'Accessory not supported'"
      ],
      "diagnostics": [
        "Проверка USB-C порта на загрязнения/повреждения",
        "Тест с другим кабелем USB-C (сертифицированным)",
        "Проверка напряжения на VBUS (должно быть 5V)",
        "Диодный режим на D+/D- линиях (0.45-0.65V)",
        "Проверка CBTL1701B0 IC на перегрев"
      ],
      "solutions": [
        {
          "method": "Чистка USB-C порта",
          "difficulty": "easy",
          "time_estimate": "5-10 min",
          "parts_needed": [],
          "tools_needed": ["Brush", "Isopropyl alcohol", "Compressed air"]
        },
        {
          "method": "Замена USB-C порта",
          "difficulty": "hard",
          "time_estimate": "60-90 min",
          "parts_needed": ["USB-C port flex cable"],
          "tools_needed": ["Soldering station", "Microscope", "Flux"]
        },
        {
          "method": "Замена CBTL1701B0 IC",
          "difficulty": "expert",
          "time_estimate": "90-120 min",
          "parts_needed": ["CBTL1701B0 chip"],
          "tools_needed": ["BGA rework station", "Preheater", "Microscope", "Stencils"]
        }
      ],
      "related_ics": ["CBTL1701B0", "339S00980 PMU"],
      "board_zones": ["Charging circuitry near J4700 connector"]
    },
    {
      "id": "battery_drain",
      "name": "Быстро разряжается батарея",
      "category": "battery",
      "severity": "medium",
      "symptoms": [
        "Заряд падает >30% за час при минимальном использовании",
        "Батарея нагревается в режиме ожидания",
        "Внезапные отключения при 20-40% заряда",
        "Battery Health <80% за короткий срок"
      ],
      "diagnostics": [
        "Проверка Battery Health в Settings > Battery",
        "Анализ Battery Usage по приложениям",
        "Измерение потребления в режиме ожидания (<50mA норма)",
        "Thermal imaging для поиска горячих зон на плате",
        "Проверка циклов зарядки (номинал 500-800 циклов)"
      ],
      "solutions": [
        {
          "method": "Калибровка батареи",
          "difficulty": "easy",
          "time_estimate": "4-6 hours",
          "steps": [
            "Разрядить до полного выключения",
            "Заряжать выключенным до 100%",
            "Держать на зарядке еще 2 часа",
            "Повторить цикл 2-3 раза"
          ]
        },
        {
          "method": "Замена батареи",
          "difficulty": "medium",
          "time_estimate": "30-45 min",
          "parts_needed": ["Battery 3600mAh"],
          "tools_needed": ["9V battery с зажимами для извлечения", "Adhesive strips"],
          "calibration_required": true,
          "apple_genuine_required": true,
          "notes": "Требуется Repair Assistant для калибровки Battery Health"
        },
        {
          "method": "Диагностика платы на короткие замыкания",
          "difficulty": "expert",
          "requires": "Multimeter, Thermal camera, Schematic knowledge"
        }
      ],
      "prevention": [
        "Избегать экстремальных температур (-10°C до 45°C)",
        "Оптимизированная зарядка (iOS feature)",
        "Не держать на 100% заряде постоянно"
      ]
    },
    {
      "id": "face_id_not_working",
      "name": "Не работает Face ID",
      "category": "biometrics",
      "severity": "high",
      "symptoms": [
        "Ошибка 'Face ID is not available'",
        "Не распознает лицо даже после reset",
        "Dot Projector не светит (проверка камерой)",
        "Flood Illuminator не работает"
      ],
      "diagnostics": [
        "Проверка Dot Projector через камеру другого телефона",
        "Settings > Face ID & Passcode > Reset Face ID",
        "Проверка шлейфа TrueDepth на повреждения",
        "Voltage test на Face ID connectors (3.3V должно быть)"
      ],
      "solutions": [
        {
          "method": "Переподключение Face ID модуля",
          "difficulty": "medium",
          "time_estimate": "20 min",
          "requires": "Разборка дисплея, чистка контактов"
        },
        {
          "method": "Замена Face ID модуля",
          "difficulty": "expert",
          "warning": "⚠️ Face ID модуль привязан к логик борду! После замены Face ID НЕ БУДЕТ работать даже с оригинальной запчастью от другого устройства. Только Apple может перепарить модуль.",
          "alternative": "Обращение в Apple Authorized Service Provider"
        }
      ],
      "important_notes": [
        "Face ID модуль криптографически привязан к Secure Enclave на A19 чипе",
        "Невозможно заменить сторонним сервисом с сохранением функции",
        "Требуется Apple System Configuration для переспаривания"
      ]
    }
  ]
};

// Convert to NEXX Database format
function convertToNEXXFormat(data) {
  return {
    name: data.marketing_name,
    category: "iPhone",
    model: data.id,
    model_number: data.id,
    year: data.year,
    released: data.release_date,
    announced: data.announced_date,
    
    // Board numbers
    board_numbers: data.board_numbers.main,
    board_number: data.board_numbers.main[0],
    
    // EMC & identifiers
    emc: null, // Not provided
    identifier: data.id,
    
    // Architecture & Processor
    architecture: data.processor.architecture,
    processor: `${data.processor.name} (${data.processor.codename})`,
    cpu: `${data.processor.cpu.performance_cores.count}P+${data.processor.cpu.efficiency_cores.count}E cores @ ${data.processor.cpu.performance_cores.frequency_max}`,
    gpu: `${data.processor.gpu.cores}-core GPU @ ${data.processor.gpu.clock_speed}`,
    neural_engine: `${data.processor.neural_engine.cores}-core Neural Engine`,
    
    // Memory
    ram: data.memory.ram.capacity,
    ram_type: data.memory.ram.type,
    storage: data.memory.storage_options.join(", "),
    
    // Display
    display_size: data.display.size,
    display_resolution: data.display.resolution,
    display_type: data.display.technology,
    refresh_rate: data.display.refresh_rate,
    promotion: data.display.promotion,
    
    // Critical ICs
    charging_ic: data.power.charging_ic.primary,
    power_ic: data.critical_ics.pmu.part_number,
    audio_codec: data.critical_ics.audio_codec.part_number,
    
    // Connectivity
    port: data.connectivity.port,
    wifi: data.connectivity.wifi.standard,
    bluetooth: data.connectivity.bluetooth,
    cellular: data.connectivity.cellular.modem,
    nfc_chip: data.connectivity.nfc.chip,
    uwb_chip: data.connectivity.uwb.chip,
    
    // Battery
    battery_capacity: data.power.battery_capacity,
    charging_wired: data.power.charging.wired_max,
    charging_wireless: data.power.charging.magsafe,
    
    // Camera
    camera_main: `${data.cameras.rear.main.megapixels}MP`,
    camera_front: `${data.cameras.front.megapixels}MP`,
    
    // Common issues (new detailed format)
    common_issues: data.common_issues.map(issue => ({
      ...issue,
      board_number: data.board_numbers.main[0]
    })),
    
    // Icons
    icon_url: null, // Will be updated by icon script
    ifixit_image: null,
    
    // Metadata
    source: "user_provided_2026_01_19",
    verified: true,
    detailed_specs: data
  };
}

// Main execution
try {
  const devicesPath = path.join(__dirname, '../public/data/devices_enhanced.json');
  
  // Read existing devices
  const devicesRaw = fs.readFileSync(devicesPath, 'utf8');
  const devices = JSON.parse(devicesRaw);
  
  console.log(`📱 Current devices count: ${devices.length}`);
  
  // Check if iPhone 17 already exists
  const existingIndex = devices.findIndex(d => d.model === 'iphone-17-2025' || d.name === 'iPhone 17');
  
  const newDevice = convertToNEXXFormat(iphone17Data);
  
  if (existingIndex >= 0) {
    console.log(`⚠️  iPhone 17 already exists at index ${existingIndex}. Updating...`);
    devices[existingIndex] = newDevice;
  } else {
    console.log('✅ Adding new iPhone 17 to database...');
    // Add at the beginning (newest first)
    devices.unshift(newDevice);
  }
  
  // Save updated devices
  fs.writeFileSync(devicesPath, JSON.stringify(devices, null, 2));
  
  console.log(`✅ Successfully added/updated iPhone 17`);
  console.log(`📱 Total devices now: ${devices.length}`);
  console.log('\n📋 iPhone 17 Summary:');
  console.log(`   Name: ${newDevice.name}`);
  console.log(`   Board: ${newDevice.board_number}`);
  console.log(`   Processor: ${newDevice.processor}`);
  console.log(`   RAM: ${newDevice.ram}`);
  console.log(`   Display: ${newDevice.display_size} ${newDevice.display_type}`);
  console.log(`   Common Issues: ${newDevice.common_issues.length} detailed issues`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
