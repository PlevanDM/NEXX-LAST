import {
  Device, PriceData, ErrorDetail, ICComponent, OfficialServiceData,
  MacBoard, SchematicResource, RepairGuide, ConnectorPinout,
  LogicBoard, BootSequence, DiodeMeasurement, ExchangePrice, ServicePrices
} from './types';

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
    
    const devices = db.devices || [];
    const prices = db.prices || {};
    const errors = db.errors || {};
    const ics = db.ics || {};
    const knowledge_base = db.knowledge_base || {};
    
    const guides: RepairGuide[] = Object.entries(knowledge_base).map(([key, value]: [string, any]) => ({
      title: value.title || key,
      description: value.description || '',
      category: value.difficulty || 'General',
      steps: value.steps || value.diagnostic_steps || []
    }));

    const measurements = db.measurements || {};
    const config = db.config || {};
    const rates = {
      USD_TO_RON: config.exchange_rates?.RON || 4.65,
      USD_TO_EUR: config.exchange_rates?.EUR || 0.92,
      RON_TO_USD: 1 / (config.exchange_rates?.RON || 4.65),
      EUR_TO_USD: 1 / (config.exchange_rates?.EUR || 0.92)
    };

    return {
      devices,
      prices,
      errors,
      ics,
      officialPrices: null,
      macBoards: db.mac_boards || [],
      logicBoards: db.logic_boards || [],
      schematics: db.schematics || [],
      guides,
      pinouts: db.pinouts || [],
      compatibility: db.compatibility || {},
      bootSequences: db.boot_sequences || {},
      measurements,
      exchangePrices: db.exchange_prices || {},
      servicePrices: null,
      keyCombinations: db.key_combinations || null,
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
