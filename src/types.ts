export interface PriceData {
  article: string;
  description: string;
  price_uah?: number;
  price_usd?: number;
  price_eur?: number;
  category?: string;
  model?: string;
}

export interface DeviceSpecs {
  cpu_ghz?: string;
  ram_gb?: string;
  storage_gb?: string;
}

export interface Device {
  name: string;
  model_number?: string;
  board_number?: string;
  year?: string;
  emc?: string;
  architecture?: string;
  description?: string;
  specs?: DeviceSpecs;
  price_uah?: number;
  price_usd?: number;
  article?: string;
  category?: string;
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
  designation?: string;
  package?: string;
  price_range?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  functions?: string[];
  diagnostics?: {
    diode_mode?: Record<string, string>;
    pp5v0_usb?: string;
    current_draw?: string;
  };
  symptoms_when_faulty?: string[];
  compatible_devices?: string[];
}
