/**
 * EnrichmentEngine v2 — Real database enrichment
 * Scans D1 database for missing data, cross-references ICs, 
 * fills gaps, and reports database health.
 */

export interface EnrichmentChange {
  action: 'enrich' | 'discover' | 'ic_add' | 'error_code_add' | 'cross_ref';
  target: string;
  field: string;
  oldValue: string | null;
  newValue: string;
  source: string;
  timestamp: string;
}

export interface EnrichmentError {
  target: string;
  message: string;
  timestamp: string;
}

export interface EnrichmentStats {
  totalDevices: number;
  totalICs: number;
  totalErrors: number;
  totalBoards: number;
  missingChargingIC: number;
  missingPowerIC: number;
  missingAudioCodec: number;
  missingBoardNumber: number;
  missingCategory: number;
  missingBrand: number;
  missingYear: number;
  missingConnector: number;
  devicesWithNoICs: number;
  databaseHealth: number; // 0-100 percentage
  icCoverage: number; // 0-100 percentage
}

export interface EnrichmentRun {
  runId: string;
  startedAt: string;
  completedAt: string;
  dryRun: boolean;
  stats: EnrichmentStats;
  changes: EnrichmentChange[];
  errors: EnrichmentError[];
}

// Known IC cross-reference data for auto-enrichment
const IC_CROSS_REFERENCE: Record<string, { type: string; manufacturer: string; function: string; usedIn: string[] }> = {
  // Charging ICs
  'U2300': { type: 'Charging IC', manufacturer: 'Texas Instruments', function: 'USB Power Delivery / Charging', usedIn: ['iPhone 15', 'iPhone 15 Pro'] },
  'SN2611A0': { type: 'Charging IC', manufacturer: 'Texas Instruments', function: 'Battery Charger IC', usedIn: ['iPhone 12', 'iPhone 12 Pro', 'iPhone 13', 'iPhone 13 Pro'] },
  'SN2501': { type: 'Charging IC', manufacturer: 'Texas Instruments', function: 'Battery Charger IC', usedIn: ['iPhone X', 'iPhone XS', 'iPhone 11'] },
  'BQ51013B': { type: 'Charging IC', manufacturer: 'Texas Instruments', function: 'Wireless Charging Receiver', usedIn: ['iPhone 8', 'iPhone X'] },
  
  // PMIC
  '338S00770': { type: 'PMIC', manufacturer: 'Apple/Dialog', function: 'Power Management IC', usedIn: ['iPhone 15 Pro', 'iPhone 15 Pro Max'] },
  '338S00456': { type: 'PMIC', manufacturer: 'Apple/Dialog', function: 'Power Management IC', usedIn: ['iPhone 12', 'iPhone 12 Pro'] },
  '338S00383': { type: 'PMIC', manufacturer: 'Apple/Dialog', function: 'Power Management IC', usedIn: ['iPhone 11', 'iPhone 11 Pro'] },
  '338S00309': { type: 'PMIC', manufacturer: 'Apple/Dialog', function: 'Power Management IC', usedIn: ['iPhone X', 'iPhone XS'] },
  
  // Audio
  '338S00537': { type: 'Audio Codec', manufacturer: 'Cirrus Logic', function: 'Audio Codec IC', usedIn: ['iPhone 14', 'iPhone 14 Pro'] },
  '338S00411': { type: 'Audio Codec', manufacturer: 'Cirrus Logic', function: 'Audio Codec IC', usedIn: ['iPhone 12', 'iPhone 13'] },
  'CS42L83': { type: 'Audio Codec', manufacturer: 'Cirrus Logic', function: 'Audio Codec', usedIn: ['MacBook Pro 2021', 'MacBook Pro 2022'] },
  
  // Modem / Baseband
  'SDX75': { type: 'Modem', manufacturer: 'Qualcomm', function: '5G Modem-RF', usedIn: ['iPhone 16', 'iPhone 16 Pro'] },
  'SDX70': { type: 'Modem', manufacturer: 'Qualcomm', function: '5G Modem-RF', usedIn: ['iPhone 15', 'iPhone 15 Pro'] },
  'SDX65': { type: 'Modem', manufacturer: 'Qualcomm', function: '5G Modem-RF', usedIn: ['iPhone 14', 'iPhone 14 Pro'] },
  'SDX55': { type: 'Modem', manufacturer: 'Qualcomm', function: '5G Modem', usedIn: ['iPhone 12', 'iPhone 12 Pro', 'iPhone 13'] },
  
  // NFC
  'SN210': { type: 'NFC Controller', manufacturer: 'NXP', function: 'NFC / Secure Element', usedIn: ['iPhone 14', 'iPhone 15'] },
  'SN200': { type: 'NFC Controller', manufacturer: 'NXP', function: 'NFC Controller', usedIn: ['iPhone 12', 'iPhone 13'] },
  
  // WiFi / Bluetooth
  'BCM4389': { type: 'WiFi/BT', manufacturer: 'Broadcom', function: 'WiFi 6E + Bluetooth 5.3', usedIn: ['iPhone 15 Pro', 'iPhone 14 Pro'] },
  'BCM4387': { type: 'WiFi/BT', manufacturer: 'Broadcom', function: 'WiFi 6 + Bluetooth 5.0', usedIn: ['iPhone 13', 'iPhone 14'] },
  'BCM4378': { type: 'WiFi/BT', manufacturer: 'Broadcom', function: 'WiFi 6 + Bluetooth 5.0', usedIn: ['iPhone 12'] },
  
  // Display IC
  'STB601A05': { type: 'Display IC', manufacturer: 'ST Micro', function: 'OLED Display Driver', usedIn: ['iPhone 14 Pro', 'iPhone 15 Pro'] },
};

// Device → IC mapping for cross-referencing
const DEVICE_IC_MAP: Record<string, { charging_ic?: string; power_ic?: string; audio_codec?: string; modem?: string }> = {
  'iPhone 15 Pro Max': { charging_ic: 'U2300', power_ic: '338S00770', modem: 'SDX70' },
  'iPhone 15 Pro': { charging_ic: 'U2300', power_ic: '338S00770', modem: 'SDX70' },
  'iPhone 15': { charging_ic: 'U2300', modem: 'SDX70' },
  'iPhone 14 Pro Max': { modem: 'SDX65', audio_codec: '338S00537' },
  'iPhone 14 Pro': { modem: 'SDX65', audio_codec: '338S00537' },
  'iPhone 14': { modem: 'SDX65', audio_codec: '338S00537' },
  'iPhone 13 Pro Max': { charging_ic: 'SN2611A0', power_ic: '338S00456', modem: 'SDX55' },
  'iPhone 13 Pro': { charging_ic: 'SN2611A0', power_ic: '338S00456', modem: 'SDX55' },
  'iPhone 13': { charging_ic: 'SN2611A0', modem: 'SDX55', audio_codec: '338S00411' },
  'iPhone 12 Pro Max': { charging_ic: 'SN2611A0', power_ic: '338S00456', modem: 'SDX55' },
  'iPhone 12 Pro': { charging_ic: 'SN2611A0', power_ic: '338S00456', modem: 'SDX55' },
  'iPhone 12': { charging_ic: 'SN2611A0', modem: 'SDX55', audio_codec: '338S00411' },
  'iPhone 11 Pro Max': { power_ic: '338S00383', charging_ic: 'SN2501' },
  'iPhone 11 Pro': { power_ic: '338S00383', charging_ic: 'SN2501' },
  'iPhone 11': { power_ic: '338S00383', charging_ic: 'SN2501' },
  'iPhone XS Max': { power_ic: '338S00309', charging_ic: 'SN2501' },
  'iPhone XS': { power_ic: '338S00309', charging_ic: 'SN2501' },
  'iPhone X': { power_ic: '338S00309', charging_ic: 'SN2501' },
  'iPhone 16 Pro Max': { modem: 'SDX75' },
  'iPhone 16 Pro': { modem: 'SDX75' },
  'iPhone 16': { modem: 'SDX75' },
};

export class EnrichmentEngine {
  private env: { DB: D1Database; CACHE: KVNamespace };
  private options: { dryRun?: boolean; maxChangesPerRun?: number };
  private changes: EnrichmentChange[] = [];
  private errors: EnrichmentError[] = [];

  constructor(env: { DB: D1Database; CACHE: KVNamespace }, options: { dryRun?: boolean; maxChangesPerRun?: number } = {}) {
    this.env = env;
    this.options = { dryRun: true, maxChangesPerRun: 25, ...options };
  }

  async run(): Promise<EnrichmentRun> {
    const runId = `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const startedAt = new Date().toISOString();
    
    try {
      // 1. Collect database stats
      const stats = await this.collectStats();
      
      // 2. Cross-reference ICs with devices
      await this.crossReferenceICs();
      
      // 3. Fill missing device IC data from known mapping
      await this.fillMissingDeviceICs();
      
      // 4. Discover missing ICs in ic_reference table
      await this.discoverMissingICs();
      
      // 5. Validate and fix data quality
      await this.validateDataQuality();
      
      const completedAt = new Date().toISOString();
      
      const result: EnrichmentRun = {
        runId,
        startedAt,
        completedAt,
        dryRun: this.options.dryRun ?? true,
        stats,
        changes: this.changes.slice(0, this.options.maxChangesPerRun),
        errors: this.errors,
      };
      
      // Store result
      await this.env.CACHE.put('enrichment:lastRun', JSON.stringify(result), { expirationTtl: 86400 * 7 });
      
      // Store audit trail for revert
      if (!this.options.dryRun && this.changes.length > 0) {
        await this.env.CACHE.put(`enrichment_audit:${runId}`, JSON.stringify(this.changes), { expirationTtl: 86400 * 30 });
        
        // Log to D1
        try {
          for (const change of this.changes.slice(0, 50)) {
            await this.env.DB.prepare(`
              INSERT INTO enrichment_log (run_id, action, target, field, old_value, new_value, source, created_at, reverted)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
            `).bind(runId, change.action, change.target, change.field, change.oldValue, change.newValue, change.source, change.timestamp).run();
          }
        } catch {
          // enrichment_log table might not exist — that's OK
        }
      }
      
      // Clear feed cache to refresh ticker
      await this.env.CACHE.delete('enrichment_feed');
      
      return result;
    } catch (err: any) {
      const completedAt = new Date().toISOString();
      this.errors.push({ target: 'engine', message: err.message || 'Unknown error', timestamp: completedAt });
      
      const result: EnrichmentRun = {
        runId,
        startedAt,
        completedAt,
        dryRun: this.options.dryRun ?? true,
        stats: await this.collectStats().catch(() => ({
          totalDevices: 0, totalICs: 0, totalErrors: 0, totalBoards: 0,
          missingChargingIC: 0, missingPowerIC: 0, missingAudioCodec: 0,
          missingBoardNumber: 0, missingCategory: 0, missingBrand: 0,
          missingYear: 0, missingConnector: 0, devicesWithNoICs: 0,
          databaseHealth: 0, icCoverage: 0,
        })),
        changes: this.changes,
        errors: this.errors,
      };
      
      await this.env.CACHE.put('enrichment:lastRun', JSON.stringify(result), { expirationTtl: 86400 * 7 });
      return result;
    }
  }

  private async collectStats(): Promise<EnrichmentStats> {
    const [
      totalDevices,
      totalICs,
      totalErrors,
      totalBoards,
      missingChargingIC,
      missingPowerIC,
      missingAudioCodec,
      missingBoardNumber,
      missingCategory,
      missingBrand,
      missingYear,
      missingConnector,
      devicesWithNoICs,
    ] = await Promise.all([
      this.env.DB.prepare('SELECT count(*) as cnt FROM devices').first<{ cnt: number }>().then(r => r?.cnt || 0),
      this.env.DB.prepare('SELECT count(*) as cnt FROM ic_reference').first<{ cnt: number }>().then(r => r?.cnt || 0),
      this.env.DB.prepare('SELECT count(*) as cnt FROM error_codes').first<{ cnt: number }>().then(r => r?.cnt || 0),
      this.env.DB.prepare('SELECT count(*) as cnt FROM logic_boards').first<{ cnt: number }>().then(r => r?.cnt || 0),
      this.env.DB.prepare("SELECT count(*) as cnt FROM devices WHERE charging_ic IS NULL OR charging_ic = '' OR charging_ic = '[]'").first<{ cnt: number }>().then(r => r?.cnt || 0),
      this.env.DB.prepare("SELECT count(*) as cnt FROM devices WHERE power_ics IS NULL OR power_ics = '' OR power_ics = '[]'").first<{ cnt: number }>().then(r => r?.cnt || 0),
      this.env.DB.prepare("SELECT count(*) as cnt FROM devices WHERE audio_ics IS NULL OR audio_ics = '' OR audio_ics = '[]'").first<{ cnt: number }>().then(r => r?.cnt || 0),
      this.env.DB.prepare("SELECT count(*) as cnt FROM devices WHERE board_numbers IS NULL OR board_numbers = '' OR board_numbers = '[]'").first<{ cnt: number }>().then(r => r?.cnt || 0),
      this.env.DB.prepare("SELECT count(*) as cnt FROM devices WHERE category IS NULL OR category = ''").first<{ cnt: number }>().then(r => r?.cnt || 0),
      this.env.DB.prepare("SELECT count(*) as cnt FROM devices WHERE brand IS NULL OR brand = ''").first<{ cnt: number }>().then(r => r?.cnt || 0),
      this.env.DB.prepare("SELECT count(*) as cnt FROM devices WHERE year IS NULL OR year = 0").first<{ cnt: number }>().then(r => r?.cnt || 0),
      this.env.DB.prepare("SELECT count(*) as cnt FROM devices WHERE connector_type IS NULL OR connector_type = ''").first<{ cnt: number }>().then(r => r?.cnt || 0),
      this.env.DB.prepare("SELECT count(*) as cnt FROM devices WHERE (charging_ic IS NULL OR charging_ic = '' OR charging_ic = '[]') AND (power_ics IS NULL OR power_ics = '' OR power_ics = '[]') AND (audio_ics IS NULL OR audio_ics = '' OR audio_ics = '[]')").first<{ cnt: number }>().then(r => r?.cnt || 0),
    ]);
    
    // Calculate health: % of fields filled across all devices
    const totalFields = totalDevices * 7; // 7 key fields
    const missingFields = missingChargingIC + missingPowerIC + missingAudioCodec + missingBoardNumber + missingCategory + missingBrand + missingYear;
    const databaseHealth = totalFields > 0 ? Math.round(((totalFields - missingFields) / totalFields) * 100) : 0;
    
    // IC coverage: % of devices that have at least one IC reference
    const icCoverage = totalDevices > 0 ? Math.round(((totalDevices - devicesWithNoICs) / totalDevices) * 100) : 0;
    
    return {
      totalDevices, totalICs, totalErrors, totalBoards,
      missingChargingIC, missingPowerIC, missingAudioCodec,
      missingBoardNumber, missingCategory, missingBrand,
      missingYear, missingConnector, devicesWithNoICs,
      databaseHealth, icCoverage,
    };
  }

  private reachedLimit(): boolean {
    return this.changes.length >= (this.options.maxChangesPerRun || 25);
  }

  private async crossReferenceICs(): Promise<void> {
    if (this.reachedLimit()) return;
    
    // Find devices that have IC names mentioned but not in ic_reference
    try {
      const devices = await this.env.DB.prepare(
        "SELECT name, charging_ic, power_ics, audio_ics FROM devices WHERE charging_ic IS NOT NULL AND charging_ic != '' AND charging_ic != '[]' LIMIT 100"
      ).all();
      
      for (const device of (devices.results || [])) {
        if (this.reachedLimit()) break;
        
        const icFields = [
          { field: 'charging_ic', value: device.charging_ic as string },
          { field: 'power_ics', value: device.power_ics as string },
          { field: 'audio_ics', value: device.audio_ics as string },
        ];
        
        for (const { field, value } of icFields) {
          if (!value || value === '[]') continue;
          
          // Extract IC numbers from the field (could be JSON array or plain string)
          const icNumbers = this.extractICNumbers(value);
          
          for (const icNum of icNumbers) {
            if (this.reachedLimit()) break;
            
            // Check if this IC exists in ic_reference
            const exists = await this.env.DB.prepare(
              'SELECT ic_number FROM ic_reference WHERE ic_number = ?'
            ).bind(icNum).first();
            
            if (!exists && IC_CROSS_REFERENCE[icNum]) {
              const ref = IC_CROSS_REFERENCE[icNum];
              const change: EnrichmentChange = {
                action: 'ic_add',
                target: icNum,
                field: 'ic_reference',
                oldValue: null,
                newValue: `${ref.type}: ${ref.function}`,
                source: `cross-ref:${device.name}`,
                timestamp: new Date().toISOString(),
              };
              
              if (!this.options.dryRun) {
                await this.env.DB.prepare(`
                  INSERT OR IGNORE INTO ic_reference (ic_number, ic_type, manufacturer, function, used_in)
                  VALUES (?, ?, ?, ?, ?)
                `).bind(icNum, ref.type, ref.manufacturer, ref.function, JSON.stringify(ref.usedIn)).run();
              }
              
              this.changes.push(change);
            }
          }
        }
      }
    } catch (err: any) {
      this.errors.push({ target: 'cross-reference', message: err.message, timestamp: new Date().toISOString() });
    }
  }

  private async fillMissingDeviceICs(): Promise<void> {
    if (this.reachedLimit()) return;
    
    try {
      // Get devices with missing IC data
      const devices = await this.env.DB.prepare(
        "SELECT name, charging_ic, power_ics, audio_ics FROM devices WHERE (charging_ic IS NULL OR charging_ic = '' OR charging_ic = '[]') OR (power_ics IS NULL OR power_ics = '' OR power_ics = '[]') LIMIT 50"
      ).all();
      
      for (const device of (devices.results || [])) {
        if (this.reachedLimit()) break;
        
        const deviceName = device.name as string;
        const mapping = this.findBestICMapping(deviceName);
        if (!mapping) continue;
        
        // Fill charging IC
        if (mapping.charging_ic && (!device.charging_ic || device.charging_ic === '' || device.charging_ic === '[]')) {
          const change: EnrichmentChange = {
            action: 'enrich',
            target: deviceName,
            field: 'charging_ic',
            oldValue: null,
            newValue: mapping.charging_ic,
            source: 'ic-mapping',
            timestamp: new Date().toISOString(),
          };
          
          if (!this.options.dryRun) {
            await this.env.DB.prepare(
              'UPDATE devices SET charging_ic = ? WHERE name = ?'
            ).bind(mapping.charging_ic, deviceName).run();
          }
          
          this.changes.push(change);
        }
        
        // Fill power IC
        if (mapping.power_ic && (!device.power_ics || device.power_ics === '' || device.power_ics === '[]')) {
          const change: EnrichmentChange = {
            action: 'enrich',
            target: deviceName,
            field: 'power_ics',
            oldValue: null,
            newValue: mapping.power_ic,
            source: 'ic-mapping',
            timestamp: new Date().toISOString(),
          };
          
          if (!this.options.dryRun) {
            await this.env.DB.prepare(
              'UPDATE devices SET power_ics = ? WHERE name = ?'
            ).bind(JSON.stringify([mapping.power_ic]), deviceName).run();
          }
          
          this.changes.push(change);
        }
        
        // Fill audio codec
        if (mapping.audio_codec && (!device.audio_ics || device.audio_ics === '' || device.audio_ics === '[]')) {
          const change: EnrichmentChange = {
            action: 'enrich',
            target: deviceName,
            field: 'audio_ics',
            oldValue: null,
            newValue: mapping.audio_codec,
            source: 'ic-mapping',
            timestamp: new Date().toISOString(),
          };
          
          if (!this.options.dryRun) {
            await this.env.DB.prepare(
              'UPDATE devices SET audio_ics = ? WHERE name = ?'
            ).bind(JSON.stringify([mapping.audio_codec]), deviceName).run();
          }
          
          this.changes.push(change);
        }
      }
    } catch (err: any) {
      this.errors.push({ target: 'fill-ics', message: err.message, timestamp: new Date().toISOString() });
    }
  }

  private async discoverMissingICs(): Promise<void> {
    if (this.reachedLimit()) return;
    
    try {
      // Add known ICs that are not in the database
      for (const [icNum, ref] of Object.entries(IC_CROSS_REFERENCE)) {
        if (this.reachedLimit()) break;
        
        const exists = await this.env.DB.prepare(
          'SELECT ic_number FROM ic_reference WHERE ic_number = ?'
        ).bind(icNum).first();
        
        if (!exists) {
          const change: EnrichmentChange = {
            action: 'ic_add',
            target: icNum,
            field: 'ic_reference',
            oldValue: null,
            newValue: `${ref.type}: ${ref.function} (${ref.manufacturer})`,
            source: 'known-ics',
            timestamp: new Date().toISOString(),
          };
          
          if (!this.options.dryRun) {
            await this.env.DB.prepare(`
              INSERT OR IGNORE INTO ic_reference (ic_number, ic_type, manufacturer, function, used_in)
              VALUES (?, ?, ?, ?, ?)
            `).bind(icNum, ref.type, ref.manufacturer, ref.function, JSON.stringify(ref.usedIn)).run();
          }
          
          this.changes.push(change);
        }
      }
    } catch (err: any) {
      this.errors.push({ target: 'discover-ics', message: err.message, timestamp: new Date().toISOString() });
    }
  }

  private async validateDataQuality(): Promise<void> {
    if (this.reachedLimit()) return;
    
    try {
      // Find devices with invalid/empty brands that can be inferred from name
      const devicesMissingBrand = await this.env.DB.prepare(
        "SELECT name FROM devices WHERE brand IS NULL OR brand = '' LIMIT 20"
      ).all();
      
      for (const device of (devicesMissingBrand.results || [])) {
        if (this.reachedLimit()) break;
        
        const name = device.name as string;
        const brand = this.inferBrand(name);
        
        if (brand) {
          const change: EnrichmentChange = {
            action: 'enrich',
            target: name,
            field: 'brand',
            oldValue: null,
            newValue: brand,
            source: 'name-inference',
            timestamp: new Date().toISOString(),
          };
          
          if (!this.options.dryRun) {
            await this.env.DB.prepare('UPDATE devices SET brand = ? WHERE name = ?').bind(brand, name).run();
          }
          
          this.changes.push(change);
        }
      }
      
      // Find devices with invalid/empty category that can be inferred
      const devicesMissingCategory = await this.env.DB.prepare(
        "SELECT name FROM devices WHERE category IS NULL OR category = '' LIMIT 20"
      ).all();
      
      for (const device of (devicesMissingCategory.results || [])) {
        if (this.reachedLimit()) break;
        
        const name = device.name as string;
        const category = this.inferCategory(name);
        
        if (category) {
          const change: EnrichmentChange = {
            action: 'enrich',
            target: name,
            field: 'category',
            oldValue: null,
            newValue: category,
            source: 'name-inference',
            timestamp: new Date().toISOString(),
          };
          
          if (!this.options.dryRun) {
            await this.env.DB.prepare('UPDATE devices SET category = ? WHERE name = ?').bind(category, name).run();
          }
          
          this.changes.push(change);
        }
      }
    } catch (err: any) {
      this.errors.push({ target: 'validate-quality', message: err.message, timestamp: new Date().toISOString() });
    }
  }

  // ── Helpers ──

  private extractICNumbers(value: string): string[] {
    if (!value) return [];
    try {
      const arr = JSON.parse(value);
      if (Array.isArray(arr)) return arr.map(String).filter(Boolean);
    } catch {
      // Not JSON — parse as comma-separated or single value
    }
    // Try to extract known IC patterns
    return value.split(/[,;|\s]+/).map(s => s.trim()).filter(s => s.length > 2);
  }

  private findBestICMapping(deviceName: string): typeof DEVICE_IC_MAP[string] | null {
    // Exact match
    if (DEVICE_IC_MAP[deviceName]) return DEVICE_IC_MAP[deviceName];
    
    // Partial match
    for (const [key, mapping] of Object.entries(DEVICE_IC_MAP)) {
      if (deviceName.includes(key) || key.includes(deviceName)) return mapping;
    }
    
    return null;
  }

  private inferBrand(name: string): string | null {
    const lower = name.toLowerCase();
    if (lower.includes('iphone') || lower.includes('ipad') || lower.includes('macbook') || lower.includes('imac') || lower.includes('apple watch') || lower.includes('airpods')) return 'Apple';
    if (lower.includes('samsung') || lower.includes('galaxy')) return 'Samsung';
    if (lower.includes('xiaomi') || lower.includes('redmi') || lower.includes('poco')) return 'Xiaomi';
    if (lower.includes('huawei') || lower.includes('honor')) return 'Huawei';
    if (lower.includes('google pixel') || lower.includes('pixel')) return 'Google';
    if (lower.includes('oneplus')) return 'OnePlus';
    if (lower.includes('oppo')) return 'OPPO';
    if (lower.includes('sony') || lower.includes('xperia')) return 'Sony';
    if (lower.includes('nokia')) return 'Nokia';
    if (lower.includes('lg')) return 'LG';
    return null;
  }

  private inferCategory(name: string): string | null {
    const lower = name.toLowerCase();
    if (lower.includes('iphone') || lower.includes('galaxy s') || lower.includes('pixel') || lower.includes('redmi note') || lower.includes('poco')) return 'smartphone';
    if (lower.includes('ipad') || lower.includes('galaxy tab')) return 'tablet';
    if (lower.includes('macbook') || lower.includes('thinkpad')) return 'laptop';
    if (lower.includes('imac') || lower.includes('mac mini') || lower.includes('mac pro') || lower.includes('mac studio')) return 'desktop';
    if (lower.includes('apple watch')) return 'watch';
    if (lower.includes('airpods')) return 'audio';
    return null;
  }

  // ── Static methods ──

  static async getLastRun(cache: KVNamespace): Promise<EnrichmentRun | null> {
    const raw = await cache.get('enrichment:lastRun');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  static async isPaused(cache: KVNamespace): Promise<boolean> {
    const val = await cache.get('enrichment:paused');
    return val === 'true';
  }

  static async pause(cache: KVNamespace): Promise<void> {
    await cache.put('enrichment:paused', 'true');
  }

  static async resume(cache: KVNamespace): Promise<void> {
    await cache.delete('enrichment:paused');
  }
}
