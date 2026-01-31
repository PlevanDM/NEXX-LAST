import {
  Device, PriceData, ErrorDetail, ICComponent, OfficialServiceData,
  MacBoard, SchematicResource, RepairGuide, ConnectorPinout,
  LogicBoard, BootSequence, DiodeMeasurement, ExchangePrice, ServicePrices
} from './types';

// Service type from master-db.json
interface ServiceItem {
  name: string;
  price?: number;
  free?: boolean;
  icon?: string;
}

// Logic Board specs type
interface LogicBoardSpec {
  description: string;
  model: string | null;
  specs: {
    cpu_ghz?: number;
    ram_gb?: number;
    storage_gb?: number;
    intel_cpu?: string;
  };
  price_uah: number;
  price_usd: number;
}

interface AppData {
  devices: Device[];
  prices: Record<string, PriceData>;
  errors: Record<string, ErrorDetail>;
  ics: Record<string, ICComponent>;
  officialPrices: OfficialServiceData | null;
  macBoards: MacBoard[];
  logicBoards: LogicBoard[];
  schematics: SchematicResource[];
  guides: RepairGuide[];
  pinouts: ConnectorPinout[];
  compatibility: Record<string, any>;
  bootSequences: Record<string, BootSequence[]>;
  measurements: Record<string, DiodeMeasurement[]>;
  exchangePrices: Record<string, ExchangePrice>;
  appleExchangeMeta?: { lastUpdated: string; source: string };
  servicePrices: ServicePrices | null;
  keyCombinations: any;
  services: Record<string, ServiceItem>;
  rates: {
    USD_TO_RON: number;
    USD_TO_EUR: number;
    RON_TO_USD: number;
    EUR_TO_USD: number;
  };
}

export const fetchAppData = async (): Promise<AppData> => {
  try {
    const response = await fetch('/data/master-db.json');
    if (!response.ok) {
      throw new Error('Failed to load master-db.json');
    }
    
    const db = await response.json();
    const knowledge = db.knowledge || {};
    
    // Devices: normalize for UI (model_number, power_ic, audio_codec, board_number)
    const rawDevices = db.devices || [];
    const devices: Device[] = rawDevices.map((d: any) => ({
      ...d,
      model_number: d.model_number ?? d.model ?? undefined,
      board_number: d.board_number ?? (Array.isArray(d.board_numbers) && d.board_numbers[0] ? d.board_numbers[0] : undefined),
      power_ic: d.power_ic ?? (Array.isArray(d.power_ics) && d.power_ics[0])
        ? { main: d.power_ics[0].name || d.power_ics[0].function || String(d.power_ics[0]) }
        : undefined,
      audio_codec: d.audio_codec ?? (Array.isArray(d.audio_ics) && d.audio_ics[0])
        ? { main: typeof d.audio_ics[0] === 'string' ? d.audio_ics[0] : (d.audio_ics[0].name || d.audio_ics[0].function) }
        : (d.audio_ic && ((d.audio_ic as any).name || (d.audio_ic as any).main)) ? { main: (d.audio_ic as any).name || (d.audio_ic as any).main } : undefined,
    }));

    // Prices (from services)
    const prices = db.prices || {};
    
    // Error Codes - from knowledge.errorCodes
    const errorCodes = knowledge.errorCodes || {};
    const errors: Record<string, ErrorDetail> = {};
    
    // iTunes restore errors
    if (errorCodes.itunes_restore_errors) {
      errorCodes.itunes_restore_errors.forEach((err: any) => {
        const code = String(err.code);
        errors[code] = {
          code: err.code,
          description: err.description,
          cause: err.cause,
          solution: err.solution,
          hardware: err.hardware,
          severity: err.severity,
          component: 'iTunes'
        };
      });
    }
    
    // Mac diagnostics
    if (errorCodes.mac_diagnostics) {
      errorCodes.mac_diagnostics.forEach((err: any) => {
        const code = String(err.code);
        errors[`mac_${code}`] = {
          code: err.code,
          description: err.description,
          cause: err.cause,
          solution: err.solution,
          hardware: err.hardware,
          severity: err.severity,
          component: 'Mac'
        };
      });
    }
    
    // IC Components - from knowledge.icCompatibility
    // Structure: { charging_ics: [...], power_ics: [...], audio_ics: [...], etc }
    const icCompatibility = knowledge.icCompatibility || {};
    const ics: Record<string, ICComponent> = {};
    
    // Extract ICs from all category arrays
    const icCategories = [
      'charging_ics', 'power_ics', 'audio_ics', 'display_ics', 
      'baseband_ics', 'biometric_ics', 'flash_driver_ics', 'nand_ics',
      'nfc_ics', 'processor_ics', 'rf_fe_modules', 'sensor_ics',
      'wifi_bt_ics', 'wireless_charging_ics', 'macbook_ics', 'apple_watch_ics'
    ];
    
    icCategories.forEach(category => {
      const icArray = icCompatibility[category] || [];
      if (Array.isArray(icArray)) {
        icArray.forEach((ic: any) => {
          const name = ic.name || ic.part_number;
          if (name) {
            ics[name] = {
              name: name,
              type: ic.type || category.replace('_ics', '').replace(/_/g, ' ') || 'Unknown',
              designation: ic.designation || '',
              description: ic.description || '',
              compatible_devices: ic.compatible_devices || ic.devices || [],
              datasheet_url: ic.datasheet_url || null,
              package: ic.package || null,
              voltage: ic.voltage || null,
              alternatives: ic.alternatives || [],
              functions: ic.functions || [],
              symptoms_when_faulty: ic.symptoms_when_faulty || [],
              diagnostics: ic.diagnostics || null,
              price_range: ic.price_range || null,
              difficulty: ic.difficulty || null
            };
          }
        });
      }
    });
    
    // Also check for device-specific ICs (iPhone X-11 Series, etc)
    Object.keys(icCompatibility).forEach(key => {
      if (!key.startsWith('_') && !icCategories.includes(key) && key !== 'source' && key !== 'collected_at' && key !== 'stats') {
        const deviceIcs = icCompatibility[key];
        if (deviceIcs && typeof deviceIcs === 'object') {
          // Could be device-specific ICs
          Object.entries(deviceIcs).forEach(([icName, icData]: [string, any]) => {
            if (typeof icData === 'object' && icData !== null) {
              ics[icName] = {
                name: icName,
                type: icData.type || key,
                designation: icData.designation || '',
                description: icData.description || icData.function || '',
                compatible_devices: icData.compatible_devices || [key],
                datasheet_url: icData.datasheet_url || null,
                package: icData.package || null,
                voltage: icData.voltage || null,
                alternatives: icData.alternatives || [],
                functions: icData.functions || [],
                price_range: icData.price_range || null,
                diagnostics: icData.diagnostics || null
              };
            }
          });
        }
      }
    });
    
    // Repair Knowledge / Guides
    const repairKnowledge = knowledge.repairKnowledge || [];
    const guides: RepairGuide[] = Array.isArray(repairKnowledge) 
      ? repairKnowledge.map((item: any) => ({
          title: item.title || item.name || 'Unknown',
          description: item.description || '',
          category: item.category || item.difficulty || 'General',
          steps: item.steps || item.diagnostic_steps || []
        }))
      : [];
    
    // Key Combinations (DFU/Recovery)
    const keyCombinations = knowledge.keyCombinations || {};
    
    // Measurements
    const measurementsData = knowledge.measurements || db.measurements || {};
    
    // Logic Boards from knowledge.logicBoards.specs.boards
    const logicBoardsSpecs = knowledge.logicBoards?.specs?.boards || {};
    const logicBoards: LogicBoard[] = Object.entries(logicBoardsSpecs).map(([article, data]: [string, any]) => ({
      board_number: article,
      model: data.model || data.description || 'Unknown',
      year: data.model?.match(/\d{4}/)?.pop() || 'N/A',
      emc: '',
      model_number: article,
      architecture: data.specs?.intel_cpu || (data.specs?.cpu_ghz ? `${data.specs.cpu_ghz} GHz` : ''),
      price_uah: data.price_uah,
      price_usd: data.price_usd
    }));
    
    // Config & Rates
    const config = db.config || {};
    const rates = {
      USD_TO_RON: config.exchange_rates?.RON || 4.65,
      USD_TO_EUR: config.exchange_rates?.EUR || 0.92,
      RON_TO_USD: 1 / (config.exchange_rates?.RON || 4.65),
      EUR_TO_USD: 1 / (config.exchange_rates?.EUR || 0.92)
    };
    
    // Services - это объект { diagnostic: {...}, screen: {...} }
    const services: Record<string, ServiceItem> = db.services || {};

    // Compatibility for DeviceDetailModal: cameras, displays, batteries
    const camCompat = knowledge.cameraCompatibility || {};
    const camerasList = (camCompat.rear_cameras && typeof camCompat.rear_cameras === 'object')
      ? Object.entries(camCompat.rear_cameras).map(([key, v]: [string, any]) => ({
          part_type: key.replace(/_/g, ' '),
          models: v?.compatible || [],
          cross_compatible: v?.compatible || [],
          note: v?.notes || v?.note,
        }))
      : [];
    const displaysList = (camCompat.display_compatibility && typeof camCompat.display_compatibility === 'object')
      ? Object.entries(camCompat.display_compatibility).map(([key, v]: [string, any]) => ({
          part_type: key.replace(/_/g, ' '),
          models: v?.compatible || [],
          cross_compatible: v?.compatible || [],
          note: v?.notes || v?.note,
        }))
      : [];
    const compatibility: Record<string, any> = {
      cameras: camerasList,
      displays: displaysList,
      batteries: (camCompat.batteries && Array.isArray(camCompat.batteries)) ? camCompat.batteries
        : (camCompat.battery_compatibility && typeof camCompat.battery_compatibility === 'object')
          ? Object.entries(camCompat.battery_compatibility).map(([key, v]: [string, any]) => ({
              part_type: key.replace(/_/g, ' '),
              models: (v as any)?.compatible || [],
              cross_compatible: (v as any)?.compatible || [],
            }))
          : [],
    };

    // Boot sequences for diagnostics tab (from knowledge.measurements.boot_sequence)
    const meas = knowledge.measurements || {};
    const bootSeqSteps = (meas.boot_sequence && meas.boot_sequence.steps) || [];
    const bootSequencesList: BootSequence[] = Array.isArray(bootSeqSteps)
      ? bootSeqSteps.map((s: any) => ({
          stage: s.name || s.stage || `Step ${s.step || ''}`,
          current_consumption: s.current_draw || s.current_consumption || '—',
          description: s.description || '',
          components_involved: s.rails_active || s.components_involved || [],
        }))
      : [];
    const bootSequences: Record<string, BootSequence[]> = bootSequencesList.length > 0
      ? { 'iPhone': bootSequencesList, 'iPad': bootSequencesList }
      : (db.boot_sequences || {});

    // Apple Official Ukraine Exchange — merge from separate JSON (updated via import-exchange-ua-xlsx.cjs)
    let exchangePrices: Record<string, ExchangePrice> = db.exchange_prices || {};
    let appleExchangeMeta: { lastUpdated: string; source: string } | undefined;
    try {
      const uaRes = await fetch('/data/apple-exchange-ua.json');
      if (uaRes.ok) {
        const uaData = await uaRes.json();
        if (uaData?.prices && typeof uaData.prices === 'object') {
          exchangePrices = { ...exchangePrices, ...uaData.prices };
        }
        if (uaData?.lastUpdated || uaData?.source) {
          appleExchangeMeta = { lastUpdated: uaData.lastUpdated || '', source: uaData.source || '' };
        }
      }
    } catch (_) {}

    return {
      devices,
      prices,
      errors,
      ics,
      officialPrices: null,
      macBoards: db.mac_boards || [],
      logicBoards: logicBoards,
      schematics: db.schematics || [],
      guides,
      pinouts: db.pinouts || [],
      compatibility,
      bootSequences,
      measurements: measurementsData,
      exchangePrices,
      appleExchangeMeta,
      servicePrices: null, // Используем services напрямую
      keyCombinations: keyCombinations,
      services: services, // Добавляем services
      rates: {
        ...rates,
        UAH_TO_USD: 0.024,
        UAH_TO_EUR: 0.022,
        USD_TO_UAH: 41.5,
        EUR_TO_UAH: 45.0
      } as any
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
