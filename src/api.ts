import { Device, PriceData } from './types';

import { Device, PriceData, ErrorDetail, ICComponent, OfficialServiceData, MacBoard, SchematicResource, RepairGuide, ConnectorPinout, LogicBoard, CompatibilityItem, BootSequence, DiodeMeasurement, ExchangePrice, ServicePrices } from './types';

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
  // Новые данные
  exchangePrices: Record<string, ExchangePrice>;
  servicePrices: ServicePrices;
  rates: {
    UAH_TO_USD: number;
    UAH_TO_EUR: number;
    USD_TO_UAH: number;
    EUR_TO_UAH: number;
  };
}

export const fetchAppData = async (): Promise<AppData> => {
  try {
    // Загружаем ВСЕ данные
    const [
      devicesRes, pricesRes, errorsRes, icsRes, officialRes, settingsRes,
      macRes, schemRes, guidesRes, pinRes, logicRes,
      camRes, dispRes, battRes, bootRes, measRes,
      exchangeRes, serviceRes
    ] = await Promise.all([
      fetch('/data/devices_enhanced.json'),
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
      // Новые
      fetch('/data/exchange_prices.json'),
      fetch('/data/service_prices_romania.json')
    ]);

    if (!devicesRes.ok) throw new Error('Critical data missing');

    const devices = await devicesRes.json();
    const prices = await pricesRes.json();
    const errors = await errorsRes.json();
    const ics = await icsRes.json();
    const officialPrices = await officialRes.json();
    const settings = await settingsRes.json();
    
    // ... (старый код обработки ошибок)
    const macBoards = macRes.ok ? await macRes.json() : [];
    const schematics = schemRes.ok ? await schemRes.json() : [];
    const guides = guidesRes.ok ? await guidesRes.json() : [];
    const pinouts = pinRes.ok ? await pinRes.json() : [];
    
    let logicBoards: LogicBoard[] = [];
    if (logicRes.ok) {
      const data = await logicRes.json();
      logicBoards = [
        ...(data.m_series_boards || []),
        ...(data.t2_boards || []),
        ...(data.intel_boards || [])
      ];
    }

    const compatibility = {
      cameras: camRes.ok ? await camRes.json() : [],
      displays: dispRes.ok ? await dispRes.json() : [],
      batteries: battRes.ok ? await battRes.json() : []
    };

    const bootSequences = bootRes.ok ? await bootRes.json() : {};
    const measurements = measRes.ok ? await measRes.json() : {};
    
    // Новые
    const exchangePrices = exchangeRes.ok ? await exchangeRes.json() : {};
    const servicePrices = serviceRes.ok ? await serviceRes.json() : {};

    return {
      devices,
      prices,
      errors,
      ics,
      officialPrices,
      macBoards: Object.values(macBoards),
      logicBoards,
      schematics,
      guides,
      pinouts,
      compatibility,
      bootSequences,
      measurements,
      exchangePrices,
      servicePrices,
      rates: settings.currency.rates
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
