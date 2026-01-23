export interface PriceData {
  article: string;
  description: string;
  price_uah?: number;
  price_usd?: number;
  price_eur?: number;
  price_ron?: number;
  category?: string;
  model?: string;
  discount?: number;
}

export interface ServicePart {
  article: string;
  description: string;
  price_usd?: number;
}

export interface ChargingIC {
  main: string;
  designation?: string;
  note?: string;
}

export interface DeviceSpecs {
  cpu_ghz?: string;
  ram_gb?: string;
  storage_gb?: string;
}

export interface Device {
  name: string;
  brand?: string;
  category?: string;
  model?: string;
  model_number?: string;
  year?: number | string;
  processor?: string;
  
  // Board и EMC
  board_numbers?: string[];
  board_number?: string; // legacy support
  emc?: string;
  architecture?: string;
  
  // IC и компоненты
  charging_ic?: ChargingIC | string;
  power_ic?: { main: string };
  audio_codec?: { main: string };
  
  // Ремонт
  common_issues?: string[];
  repair_difficulty?: string;
  repair_time?: string;
  connector_type?: string;
  tools_needed?: string[];
  
  // Цены и запчасти
  service_parts?: Record<string, ServicePart>;
  official_service_prices?: Record<string, number>;
  price_ron?: number;
  price_eur?: number;
  
  // iFixit
  ifixit_url?: string;
  ifixit_image?: string;
  icon_url?: string;
  image?: string;
  repairability?: number | null;
  guides_count?: number;
  available_repairs?: string[];
  
  // DFU/Recovery (Enriched)
  dfu_mode?: string;
  recovery_mode?: string;

  // Устаревшие поля (для совместимости)
  description?: string;
  specs?: DeviceSpecs;
  price_uah?: number;
  price_usd?: number;
  article?: string;
}

export interface OfficialPart {
  part: string;
  article: string;
  price_eur?: number;
  price_usd?: number;
}

export interface OfficialModel {
  device: string;
  parts: OfficialPart[];
}

export interface MacBoard {
  board_number: string;
  model: string;
  year: string;
  emc: string;
  cpu_architecture: string;
  schematic_link?: string;
  boardview_link?: string;
}

export interface SchematicResource {
  model: string;
  board_number?: string;
  schematic_url?: string;
  boardview_url?: string;
  source?: string;
}

export interface RepairGuide {
  title: string;
  description: string;
  category: string;
  steps?: string[];
  image_url?: string;
}

export interface ConnectorPinout {
  name: string;
  device: string;
  pins: Record<string, string>;
  image_url?: string;
}

export interface LogicBoard {
  model: string;
  model_number?: string;
  emc?: string;
  board_number: string;
  year: number | string;
  architecture?: string;
}

export interface CompatibilityItem {
  part_type: string;
  models: string[];
  note?: string;
  cross_compatible?: string[];
}

export interface BootSequence {
  stage: string;
  current_consumption: string;
  description: string;
  components_involved: string[];
}

export interface DiodeMeasurement {
  line: string;
  value: string;
  pin?: string;
}

export interface ExchangePrice {
  description: string;
  price_stock_uah: number;
  price_exchange_uah: number;
}

export interface ServiceModel {
  model: string;
  services: Record<string, string>;
}

export interface ServicePrices {
  iPhone: ServiceModel[];
  iPad: ServiceModel[];
  MacBook: ServiceModel[];
  "Apple Watch": ServiceModel[];
}

export interface OfficialServiceData {
  updated_date: string;
  currency: string;
  conversion_rate: number;
  models: OfficialModel[];
}

export interface ICComponent {
  name: string;
  type?: string;
  description?: string;
  designation?: string;
  package?: string;
  price_range?: string;
  difficulty?: string;
  functions?: string[];
  diagnostics?: {
    diode_mode?: Record<string, string | number>;
    pp5v0_usb?: string | number;
    current_draw?: string | number;
    [key: string]: any;
  };
  symptoms_when_faulty?: string[];
  compatible_devices?: string[];
  datasheet_url?: string | null;
  voltage?: string | null;
  alternatives?: string[];
  [key: string]: any;
}

export interface ErrorDetail {
  code: string | number;
  description: string;
  cause?: string;
  solution?: string;
  hardware?: boolean;
  severity?: string;
  component?: string;
}
