import { Device, PriceData, ErrorDetail, ICComponent, OfficialServiceData, MacBoard, SchematicResource, RepairGuide, ConnectorPinout, LogicBoard, BootSequence, DiodeMeasurement, ExchangePrice, ServicePrices } from './types';

interface AppData {
  devices: Device[];
  prices: Record<string, PriceData>;
  errors: Record<string, ErrorDetail>;
  ics: Record<string, ICComponent>;
  officialPrices: OfficialServiceData;
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
  rates: {
    UAH_TO_USD: number;
    UAH_TO_EUR: number;
    USD_TO_UAH: number;
    EUR_TO_UAH: number;
  };
}

// Helper: convert array of errors to Record<code, ErrorDetail>
const processErrors = (data: any): Record<string, ErrorDetail> => {
  const result: Record<string, ErrorDetail> = {};
  
  // iTunes restore errors
  if (data.itunes_restore_errors && Array.isArray(data.itunes_restore_errors)) {
    data.itunes_restore_errors.forEach((err: any) => {
      const code = String(err.code);
      result[code] = {
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
  if (data.mac_diagnostics && Array.isArray(data.mac_diagnostics)) {
    data.mac_diagnostics.forEach((err: any) => {
      const code = String(err.code);
      result[`mac_${code}`] = {
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
  
  return result;
};

// Helper: convert IC arrays to Record<name, ICComponent>
const processICs = (data: any): Record<string, ICComponent> => {
  const result: Record<string, ICComponent> = {};
  
  const categories = [
    'charging_ics', 'power_ics', 'audio_ics', 'baseband_ics', 
    'nand_ics', 'wifi_bt_ics', 'biometric_ics', 'display_ics',
    'touch_ics', 'sensor_ics'
  ];
  
  categories.forEach(cat => {
    if (data[cat] && Array.isArray(data[cat])) {
      data[cat].forEach((ic: any) => {
        result[ic.name] = {
          name: ic.name,
          designation: ic.designation,
          package: ic.package,
          price_range: ic.price_range,
          difficulty: ic.difficulty,
          functions: ic.functions,
          diagnostics: ic.diagnostics,
          symptoms_when_faulty: ic.symptoms_when_faulty,
          compatible_devices: ic.compatible_devices
        };
      });
    }
  });
  
  return result;
};

export const fetchAppData = async (): Promise<AppData> => {
  try {
    // Загружаем ВСЕ данные параллельно
    const [
      devicesRes, pricesRes, errorsRes, icsRes, officialRes, settingsRes,
      macRes, schemRes, guidesRes, pinRes, logicRes,
      camRes, dispRes, battRes, bootRes, measRes,
      exchangeRes, serviceRes
    ] = await Promise.all([
      fetch('/data/devices.json'),
      fetch('/data/ukraine_prices.json'),
      fetch('/data/error_codes.json'),
      fetch('/data/ic_compatibility.json'),
      fetch('/data/official_service_prices.json'),
      fetch('/api/settings'),
      fetch('/data/mac_board_reference.json'),
      fetch('/data/schematic_resources.json'),
      fetch('/data/repair_knowledge.json'),
      fetch('/data/connector_pinouts.json'),
      fetch('/data/logic_boards_comprehensive.json'),
      fetch('/data/camera_compatibility.json'),
      fetch('/data/display_compatibility.json'),
      fetch('/data/battery_controllers.json'),
      fetch('/data/boot_sequences.json'),
      fetch('/data/measurements.json'),
      fetch('/data/exchange_prices.json'),
      fetch('/data/service_prices_romania.json')
    ]);

    if (!devicesRes.ok) throw new Error('Critical data missing: devices.json');

    // Parse essential data
    const devices = await devicesRes.json();
    const pricesRaw = await pricesRes.json();
    const errorsRaw = await errorsRes.json();
    const icsRaw = await icsRes.json();
    const officialPrices = await officialRes.json();
    const settings = await settingsRes.json();
    
    // Process errors (convert arrays to Record)
    const errors = processErrors(errorsRaw);
    
    // Process ICs (convert arrays to Record)
    const ics = processICs(icsRaw);
    
    // Mac boards
    const macBoardsRaw = macRes.ok ? await macRes.json() : {};
    const macBoards: MacBoard[] = Array.isArray(macBoardsRaw) 
      ? macBoardsRaw 
      : Object.values(macBoardsRaw);
    
    // Schematics (can be array or object)
    let schematics: SchematicResource[] = [];
    if (schemRes.ok) {
      const schemData = await schemRes.json();
      schematics = schemData.resources || schemData || [];
    }
    
    // Guides (from repair_knowledge)
    let guides: RepairGuide[] = [];
    if (guidesRes.ok) {
      const guidesData = await guidesRes.json();
      // repair_knowledge.json has different structure
      if (guidesData.charging_issues) {
        guides.push({
          title: 'Диагностика зарядки',
          description: guidesData.charging_issues.description || 'Tristar/Hydra диагностика',
          category: 'Зарядка',
          steps: guidesData.charging_issues.diagnostic_steps || []
        });
      }
      if (guidesData.guides && Array.isArray(guidesData.guides)) {
        guides = [...guides, ...guidesData.guides];
      }
    }
    
    // Pinouts
    let pinouts: ConnectorPinout[] = [];
    if (pinRes.ok) {
      const pinData = await pinRes.json();
      pinouts = pinData.connectors || pinData || [];
    }
    
    // Logic boards
    let logicBoards: LogicBoard[] = [];
    if (logicRes.ok) {
      const data = await logicRes.json();
      logicBoards = [
        ...(data.m_series_boards || []),
        ...(data.t2_boards || []),
        ...(data.intel_boards || [])
      ];
    }

    // Compatibility data
    const compatibility = {
      cameras: camRes.ok ? (await camRes.json()).cameras || [] : [],
      displays: dispRes.ok ? (await dispRes.json()).displays || [] : [],
      batteries: battRes.ok ? (await battRes.json()).controllers || [] : []
    };

    // Boot sequences
    const bootSequences = bootRes.ok ? await bootRes.json() : {};
    
    // Measurements
    const measurements = measRes.ok ? await measRes.json() : {};
    
    // Exchange prices
    const exchangePrices = exchangeRes.ok ? await exchangeRes.json() : {};
    
    // Service prices
    const servicePrices = serviceRes.ok ? await serviceRes.json() : null;

    return {
      devices,
      prices: pricesRaw,
      errors,
      ics,
      officialPrices,
      macBoards,
      logicBoards,
      schematics,
      guides,
      pinouts,
      compatibility,
      bootSequences,
      measurements,
      exchangePrices,
      servicePrices,
      rates: settings.currency?.rates || {
        UAH_TO_USD: 0.024,
        UAH_TO_EUR: 0.022,
        USD_TO_UAH: 41.5,
        EUR_TO_UAH: 45.0
      }
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
