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
        // Загружаем master database
        const masterResponse = await fetch('/data/master-db.json');
        this.masterDb = await masterResponse.json();
        
        // Загружаем devices database
        const devicesResponse = await fetch('/data/devices.json');
        this.devices = await devicesResponse.json();
        
        // Загружаем prices (optional)
        try {
          const pricesResponse = await fetch('/data/ukraine_prices.json');
          this.prices = await pricesResponse.json();
        } catch (e) {
          console.warn('Prices database not loaded:', e);
          this.prices = {};
        }
        
        // Загружаем error codes (optional)
        try {
          const errorCodesResponse = await fetch('/data/error_codes.json');
          this.errorCodes = await errorCodesResponse.json();
        } catch (e) {
          console.warn('Error codes not loaded:', e);
          this.errorCodes = {};
        }
        
        this.loaded = true;
        this.loading = false;
        
        // Notify listeners
        this.notifyListeners();
        
        console.log('✅ NEXX Database loaded:', {
          masterDb: !!this.masterDb,
          devices: this.devices?.length || 0,
          prices: Object.keys(this.prices).length,
          errorCodes: Object.keys(this.errorCodes).length
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
     * Получить цену для конкретного устройства и проблемы
     * Используется в калькуляторе цен
     */
    getDevicePrice(deviceName, issueId) {
      if (!this.devices || !deviceName || !issueId) return null;
      
      try {
        // Поиск устройства по имени
        const device = this.devices.find(d => {
          const name = (d.name || '').toLowerCase();
          const searchName = (deviceName || '').toLowerCase();
          return name.includes(searchName) || searchName.includes(name);
        });
        
        if (!device) return null;
        
        // Проверяем official_service_prices
        if (device.official_service_prices && typeof device.official_service_prices === 'object') {
          const price = device.official_service_prices[issueId];
          if (typeof price === 'number' && price > 0) {
            return price;
          }
        }
        
        // Проверяем masterDb цены
        if (this.masterDb?.prices?.devices) {
          const devicePrices = this.masterDb.prices.devices[deviceName];
          if (devicePrices && devicePrices[issueId]) {
            return devicePrices[issueId];
          }
        }
        
        // Проверяем общие цены по категории
        const category = device.category?.toLowerCase() || 'phone';
        if (this.masterDb?.prices?.commonRepairs?.[issueId]?.[category]) {
          return this.masterDb.prices.commonRepairs[issueId][category];
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
