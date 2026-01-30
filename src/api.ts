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
    
    // Devices
    const devices = db.devices || [];
    
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
      compatibility: knowledge.cameraCompatibility || {},
      bootSequences: db.boot_sequences || {},
      measurements: measurementsData,
      exchangePrices: db.exchange_prices || {},
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
