/**
 * NEXX Database Manager - Централизованная работа с данными
 * 
 * Использует единую базу данных для:
 * - Калькулятора цен
 * - Формы бронирования
 * - NEXX Database (nexx.html)
 * - Всех компонентов сайта
 */

(function() {
  'use strict';
  
  class NEXXDatabase {
    constructor() {
      this.masterDb = null;
      this.devices = null;
      this.prices = null;
      this.errorCodes = null;
      this.loaded = false;
      this.loading = false;
      this.listeners = [];
    }
    
    /**
     * Загрузка всех баз данных
     */
    async loadAll() {
      if (this.loaded || this.loading) return;
      
      this.loading = true;
      
      try {
        // Загружаем ЕДИНУЮ базу данных (с cache-busting через версию)
        // Використовуємо версію з бази для cache-busting, якщо вона є в localStorage
        const cachedVersion = localStorage.getItem('nexx_db_version') || '3.2.2';
        const masterResponse = await fetch(`/data/master-db.json?v=${cachedVersion}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (!masterResponse.ok) {
          throw new Error(`Failed to load database: ${masterResponse.status} ${masterResponse.statusText}`);
        }
        this.masterDb = await masterResponse.json();
        
        // Зберігаємо версію для наступного завантаження
        if (this.masterDb.version) {
          localStorage.setItem('nexx_db_version', this.masterDb.version);
        }
        
        // Основные данные
        this.devices = this.masterDb.devices || [];
        this.prices = this.masterDb.prices || {};
        this.brands = this.masterDb.brands || {};
        this.services = this.masterDb.services || {};
        this.contact = this.masterDb.contact || {};
        this.config = this.masterDb.config || {};
        
        // База знаний (внутри knowledge)
        const knowledge = this.masterDb.knowledge || {};
        this.errorCodes = knowledge.errorCodes || {};
        this.logicBoards = knowledge.logicBoards || {};
        this.icCompatibility = knowledge.icCompatibility || {};
        this.cameraCompatibility = knowledge.cameraCompatibility || {};
        this.measurements = knowledge.measurements || {};
        this.keyCombinations = knowledge.keyCombinations || {};
        this.regionalCodes = knowledge.regionalCodes || {};
        this.repairKnowledge = knowledge.repairKnowledge || {};
        this.articleSearchIndex = knowledge.articleSearchIndex || {};
        
        this.loaded = true;
        this.loading = false;
        
        // Notify listeners
        this.notifyListeners();
        
        console.log('✅ NEXX Database loaded:', {
          version: this.masterDb.version,
          devices: this.devices?.length || 0,
          prices: Object.keys(this.prices).length,
          knowledge: Object.keys(knowledge).length
        });
        
      } catch (error) {
        this.loading = false;
        console.error('❌ Failed to load database:', error);
        throw error;
      }
    }
    
    /**
     * Получить список брендов для категории
     */
    getBrands(category = 'phone') {
      if (!this.masterDb) return [];
      return this.masterDb.brands?.[category] || [];
    }
    
    /**
     * Получить устройства по бренду и категории
     */
    getDevicesByBrand(brand, category = null) {
      if (!this.devices) return [];
      
      const brandLower = brand.toLowerCase();
      const categoryLower = category ? category.toLowerCase() : null;
      
      return this.devices.filter(device => {
        const deviceName = (device.name || '').toLowerCase();
        const deviceCategory = (device.category || '').toLowerCase();
        
        // Проверка бренда
        let brandMatch = false;
        if (brandLower === 'iphone' || brandLower === 'apple') {
          brandMatch = deviceName.includes('iphone') || deviceName.includes('ipad') || 
                      deviceName.includes('macbook') || deviceName.includes('imac') ||
                      deviceCategory.includes('iphone') || deviceCategory.includes('ipad') ||
                      deviceCategory.includes('macbook');
        } else if (brandLower === 'samsung') {
          brandMatch = deviceName.includes('samsung') || deviceName.includes('galaxy') ||
                      deviceCategory.includes('samsung') || deviceCategory.includes('galaxy');
        } else if (brandLower === 'xiaomi') {
          brandMatch = deviceName.includes('xiaomi') || deviceName.includes('redmi') || 
                      deviceName.includes('poco') || deviceCategory.includes('xiaomi');
        } else if (brandLower === 'huawei') {
          brandMatch = deviceName.includes('huawei') || deviceName.includes('honor') ||
                      deviceCategory.includes('huawei') || deviceCategory.includes('honor');
        } else {
          brandMatch = deviceName.includes(brandLower) || deviceCategory.includes(brandLower);
        }
        
        if (!brandMatch) return false;
        
        // Проверка категории/типа устройства
        if (categoryLower) {
          if (categoryLower === 'iphone' || categoryLower === 'phone') {
            return deviceName.includes('iphone') && !deviceName.includes('ipad') && 
                   !deviceName.includes('macbook') && !deviceName.includes('watch');
          } else if (categoryLower === 'ipad' || categoryLower === 'tablet') {
            return deviceName.includes('ipad') || deviceName.includes('tablet') ||
                   deviceCategory.includes('ipad') || deviceCategory.includes('tablet');
          } else if (categoryLower === 'macbook' || categoryLower === 'laptop') {
            return deviceName.includes('macbook') || deviceName.includes('mac') ||
                   deviceCategory.includes('macbook') || deviceCategory.includes('laptop');
          } else if (categoryLower === 'watch') {
            return deviceName.includes('watch') || deviceCategory.includes('watch');
          }
        }
        
        return true;
      });
    }
    
    /**
     * Получить цену для услуги
     */
    getPrice(deviceBrand, serviceType) {
      if (!this.masterDb) return null;
      
      const priceData = this.masterDb.prices?.commonRepairs?.[serviceType]?.[deviceBrand];
      return priceData || null;
    }
    
    /**
     * Получить цену для конкретного устройства и проблемы (RON/lei).
     * Приоритет: service_prices_ron (ручные lei из Sheets) > official_service_prices (USD→RON) > prices.devices > commonRepairs.
     */
    getDevicePrice(deviceName, issueId) {
      if (!this.devices || !deviceName || !issueId) return null;
      const keyMap = { screen: 'display', charging: 'charging_port', camera: 'rear_camera', motherboard: 'logic_board' };
      const keys = [issueId, keyMap[issueId]].filter(Boolean);
      
      try {
        const device = this.devices.find(d => {
          const name = (d.name || '').toLowerCase();
          const searchName = (deviceName || '').toLowerCase();
          return name.includes(searchName) || searchName.includes(name);
        });
        if (!device) return null;
        
        // 1. service_prices_ron — цены в lei из Google Sheets (вкладки *_price)
        if (device.service_prices_ron && typeof device.service_prices_ron === 'object') {
          for (const k of keys) {
            const v = device.service_prices_ron[k];
            if (typeof v === 'number' && v > 0) return v;
          }
        }
        
        // 2. official_service_prices (USD → RON)
        if (device.official_service_prices && typeof device.official_service_prices === 'object') {
          const USD_TO_RON = 4.5;
          for (const k of keys) {
            const priceUSD = device.official_service_prices[k];
            if (typeof priceUSD === 'number' && priceUSD > 0) return Math.round(priceUSD * USD_TO_RON);
          }
        }
        
        // 3. prices.devices
        if (this.masterDb?.prices?.devices) {
          const devicePrices = this.masterDb.prices.devices[deviceName];
          if (devicePrices) {
            for (const k of keys) { if (devicePrices[k]) return devicePrices[k]; }
          }
        }
        
        // 4. commonRepairs по категории
        const category = (device.category || 'phone').toLowerCase();
        if (this.masterDb?.prices?.commonRepairs) {
          for (const k of keys) {
            const v = this.masterDb.prices.commonRepairs[k]?.[category];
            if (typeof v === 'number' && v > 0) return v;
          }
        }
        
        return null;
      } catch (error) {
        console.error('Error in getDevicePrice:', error);
        return null;
      }
    }
    
    /**
     * Получить информацию об услуге
     */
    getServiceInfo(serviceType) {
      if (!this.masterDb) return null;
      return this.masterDb.services?.[serviceType] || null;
    }
    
    /**
     * Поиск устройства по имени
     */
    searchDevice(query) {
      if (!this.devices || !query) return [];
      
      const lowerQuery = query.toLowerCase();
      return this.devices.filter(device => 
        device.name?.toLowerCase().includes(lowerQuery) ||
        device.model?.toLowerCase().includes(lowerQuery) ||
        device.category?.toLowerCase().includes(lowerQuery)
      ).slice(0, 20); // Limit to 20 results
    }
    
    /**
     * Получить популярные устройства
     */
    getPopularDevices(limit = 10) {
      if (!this.devices) return [];
      
      // Фильтруем новые и популярные модели
      return this.devices
        .filter(d => d.year >= 2020)
        .sort((a, b) => b.year - a.year)
        .slice(0, limit);
    }
    
    /**
     * Получить список всех доступных ремонтов
     */
    getAllRepairTypes() {
      if (!this.masterDb) return [];
      return Object.keys(this.masterDb.services || {});
    }
    
    /**
     * Subscribe to database load events
     */
    subscribe(listener) {
      this.listeners.push(listener);
      
      // If already loaded, notify immediately
      if (this.loaded) {
        listener(this);
      }
      
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }
    
    /**
     * Notify all listeners
     */
    notifyListeners() {
      this.listeners.forEach(listener => listener(this));
    }
    
    /**
     * Get contact information
     */
    getContact() {
      return this.masterDb?.contact || {};
    }
    
    /**
     * Get SEO data
     */
    getSEO() {
      return this.masterDb?.seo || {};
    }
    
    /**
     * Check if Remonline integration is enabled
     */
    isRemonlineEnabled() {
      return this.masterDb?.config?.remonlineEnabled || false;
    }
  }
  
  // ============================================
  // EXPORT TO GLOBAL
  // ============================================
  
  window.NEXXDatabase = new NEXXDatabase();
  
  // Auto-load on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.NEXXDatabase.loadAll();
    });
  } else {
    window.NEXXDatabase.loadAll();
  }
  
  console.log('✅ NEXX Database Manager initialized');
})();
