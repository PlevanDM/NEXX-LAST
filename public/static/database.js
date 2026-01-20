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
      
      return this.devices.filter(device => {
        const matchBrand = device.category?.toLowerCase().includes(brand.toLowerCase()) ||
                          device.name?.toLowerCase().includes(brand.toLowerCase());
        
        if (category) {
          return matchBrand && device.category === category;
        }
        
        return matchBrand;
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
