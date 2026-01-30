/**
 * NEXX Core v3.0 - "Венозная система" (интеграция всех компонентов)
 * 
 * Архитектура:
 * - Единая точка входа для всех данных
 * - Кэширование на уровне приложения (TTL 1 час)
 * - Ленивая загрузка данных по требованию
 * - Сохранение состояния при обновлении страницы
 * - Интеграция: Calculator → Booking → Remonline
 * - Оптимальные маршруты как муравьиные тропы
 */

(function() {
  'use strict';
  
  // =====================================================
  // UTILITY FUNCTIONS
  // =====================================================
  
  // Check if running in development environment
  const isDev = () => {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname.includes('127.0.0.1') || hostname.includes('192.168.');
  };
  
  // =====================================================
  // CORE STATE MANAGER - Централизованное управление состоянием
  // =====================================================
  
  const STORAGE_KEY = 'nexx_state';
  const CALCULATOR_STATE_KEY = 'nexx_calculator_state';
  const CACHE_TTL = 60 * 60 * 1000; // 1 час
  const VERSION = '3.0';
  
  class NEXXCore {
    constructor() {
      this.state = {};
      this.cache = new Map();
      this.listeners = new Map();
      this.routes = new Map();
      this.initialized = false;
      
      // Восстанавливаем состояние из localStorage
      this._restoreState();
    }
    
    // =====================================================
    // STATE MANAGEMENT
    // =====================================================
    
    _restoreState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Проверяем TTL
          if (parsed._timestamp && Date.now() - parsed._timestamp < CACHE_TTL) {
            this.state = parsed.state || {};
            // Only log in development
            if (isDev()) {
              console.log('📦 NEXX State restored from localStorage');
            }
          }
        }
      } catch (e) {
        if (isDev()) {
          console.warn('⚠️ Could not restore state:', e);
        }
      }
    }
    
    _saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          state: this.state,
          _timestamp: Date.now()
        }));
      } catch (e) {
        if (isDev()) {
          console.warn('⚠️ Could not save state:', e);
        }
      }
    }
    
    setState(key, value) {
      this.state[key] = value;
      this._saveState();
      this._notifyListeners(key, value);
    }
    
    getState(key, defaultValue = null) {
      return this.state[key] !== undefined ? this.state[key] : defaultValue;
    }
    
    // =====================================================
    // CACHE MANAGEMENT - "Муравьиные тропы" для данных
    // =====================================================
    
    async fetchWithCache(url, options = {}) {
      const cacheKey = url + JSON.stringify(options);
      
        // Проверяем кэш
        if (this.cache.has(cacheKey)) {
          const cached = this.cache.get(cacheKey);
          if (Date.now() - cached.timestamp < CACHE_TTL) {
            // Only log cache hits in development
            if (isDev()) {
              console.log(`🐜 Cache hit: ${url}`);
            }
            return cached.data;
          }
        }
      
      // Загружаем данные
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        // Сохраняем в кэш
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        // Only log fetches in development
        if (isDev()) {
          console.log(`🌐 Fetched: ${url}`);
        }
        return data;
      } catch (error) {
        // Don't log network errors for external resources or if it's a known issue
        const isNetworkError = error.message && (
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('network')
        );
        
        if (!isNetworkError && isDev()) {
          console.error(`❌ Fetch error: ${url}`, error);
        }
        
        // Return cached data if available, even if expired
        if (this.cache.has(cacheKey)) {
          const cached = this.cache.get(cacheKey);
          // Only log in development
          if (isDev()) {
            console.log(`🐜 Using stale cache: ${url}`);
          }
          return cached.data;
        }
        
        throw error;
      }
    }
    
    clearCache(pattern = null) {
      if (pattern) {
        for (const key of this.cache.keys()) {
          if (key.includes(pattern)) {
            this.cache.delete(key);
          }
        }
      } else {
        this.cache.clear();
      }
    }
    
    // =====================================================
    // EVENT SYSTEM
    // =====================================================
    
    subscribe(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event).add(callback);
      
      return () => this.listeners.get(event).delete(callback);
    }
    
    _notifyListeners(event, data) {
      if (this.listeners.has(event)) {
        this.listeners.get(event).forEach(cb => {
          try {
            cb(data);
          } catch (e) {
            if (isDev()) {
              console.error('Listener error:', e);
            }
          }
        });
      }
    }
    
    emit(event, data) {
      this._notifyListeners(event, data);
    }
    
    // =====================================================
    // ROUTING - "Римские дороги" между компонентами
    // =====================================================
    
    registerRoute(name, handler) {
      this.routes.set(name, handler);
    }
    
    async navigate(route, params = {}) {
      if (this.routes.has(route)) {
        try {
          await this.routes.get(route)(params);
          this.emit('navigation', { route, params });
        } catch (e) {
          // Only log in development
          if (isDev()) {
            if (isDev()) {
              console.error(`❌ Navigation error: ${route}`, e);
            }
          }
        }
      } else {
        // Only log in development
        if (isDev()) {
          if (isDev()) {
            console.warn(`⚠️ Unknown route: ${route}`);
          }
        }
      }
    }
    
    // =====================================================
    // DATA PRELOADING - Предзагрузка критических данных
    // =====================================================
    
    async preload(urls) {
      // Use Promise.allSettled to handle failures gracefully
      const promises = urls.map(url => 
        this.fetchWithCache(url).catch(err => {
          // Silently handle preload errors - they're not critical
          return null;
        })
      );
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled' && r.value !== null).length;
      // Only log in development or if there are failures
      if (successful < urls.length || isDev()) {
        console.log(`📥 Preloaded ${successful}/${urls.length} resources`);
      }
    }
    
    // =====================================================
    // INITIALIZATION
    // =====================================================
    
    async init() {
      if (this.initialized) return;
      
      // Only log in development
      if (isDev()) {
        console.log('🚀 NEXX Core initializing...');
      }
      
      // Предзагружаем единую базу данных (всё в одном файле)
      await this.preload([
        '/data/master-db.json'
      ]);
      
      // Регистрируем базовые маршруты
      this._registerDefaultRoutes();
      
      // Обработка истории браузера
      window.addEventListener('popstate', (e) => {
        if (e.state?.route) {
          this.navigate(e.state.route, e.state.params || {});
        }
      });
      
      this.initialized = true;
      this.emit('ready');
      if (isDev()) {
        console.log('✅ NEXX Core ready');
      }
    }
    
    _registerDefaultRoutes() {
      // Маршрут на калькулятор
      this.registerRoute('calculator', () => {
        const calcSection = document.getElementById('calculator');
        if (calcSection) {
          calcSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
      
      // Маршрут на NEXX Database
      this.registerRoute('database', () => {
        window.location.href = '/nexx.html';
      });
      
      // Маршрут на бронирование
      this.registerRoute('booking', () => {
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
      
      // Маршрут на контакты
      this.registerRoute('contact', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    
    // =====================================================
    // CALCULATOR STATE MANAGEMENT - Сохранение состояния калькулятора
    // =====================================================
    
    saveCalculatorState(data) {
      try {
        localStorage.setItem(CALCULATOR_STATE_KEY, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
        // Only log in development
        if (isDev()) {
          console.log('💾 Состояние калькулятора сохранено');
        }
      } catch (e) {
        if (isDev()) {
          console.warn('⚠️ Не удалось сохранить состояние калькулятора:', e);
        }
      }
    }
    
    loadCalculatorState() {
      try {
        const saved = localStorage.getItem(CALCULATOR_STATE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Сохраненное состояние действует 30 минут
          if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
            // Only log in development
            if (isDev()) {
              console.log('📂 Состояние калькулятора восстановлено');
            }
            return parsed.data;
          }
        }
      } catch (e) {
        if (isDev()) {
          console.warn('⚠️ Не удалось восстановить состояние калькулятора:', e);
        }
      }
      return null;
    }
    
    clearCalculatorState() {
      try {
        localStorage.removeItem(CALCULATOR_STATE_KEY);
        // Only log in development
        if (isDev()) {
          console.log('🗑️ Состояние калькулятора очищено');
        }
      } catch (e) {
        // ignore
      }
    }
  }
  
  // =====================================================
  // DATA SYNC - Синхронизация данных между компонентами
  // =====================================================
  
  class DataSync {
    constructor(core) {
      this.core = core;
      this.syncQueue = [];
      this.syncing = false;
    }
    
    // Синхронизация данных калькулятора с Remonline
    async syncCalculatorLead(leadData) {
      this.syncQueue.push({
        type: 'calculator_lead',
        data: leadData,
        timestamp: Date.now()
      });
      
      await this._processSyncQueue();
    }
    
    // Синхронизация бронирования
    async syncBooking(bookingData) {
      this.syncQueue.push({
        type: 'booking',
        data: bookingData,
        timestamp: Date.now()
      });
      
      await this._processSyncQueue();
    }
    
    async _processSyncQueue() {
      if (this.syncing || this.syncQueue.length === 0) return;
      
      this.syncing = true;
      
      while (this.syncQueue.length > 0) {
        const item = this.syncQueue.shift();
        
        try {
          switch (item.type) {
            case 'calculator_lead':
              await this._syncToRemonline(item.data);
              break;
            case 'booking':
              await this._syncBookingToRemonline(item.data);
              break;
          }
        } catch (e) {
          // Only log in development
          if (isDev()) {
            console.error('❌ Sync error:', e);
          }
          // Возвращаем в очередь при ошибке (с лимитом попыток)
          if (!item.retries || item.retries < 3) {
            item.retries = (item.retries || 0) + 1;
            this.syncQueue.push(item);
          }
        }
      }
      
      this.syncing = false;
    }
    
    async _syncToRemonline(data) {
      const response = await fetch('/api/remonline?action=create_inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return response.json();
    }
    
    async _syncBookingToRemonline(data) {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return response.json();
    }
  }
  
  // =====================================================
  // ERROR BOUNDARY - Обработка ошибок
  // =====================================================
  
  class ErrorBoundary {
    constructor(core) {
      this.core = core;
      this.errors = [];
      
      // Глобальный обработчик ошибок
      window.addEventListener('error', (e) => this.handleError(e.error));
      window.addEventListener('unhandledrejection', (e) => this.handleError(e.reason));
    }
    
    handleError(error) {
      const errorInfo = {
        message: error?.message || String(error),
        stack: error?.stack,
        timestamp: Date.now(),
        url: window.location.href
      };
      
      this.errors.push(errorInfo);
      
      // Ограничиваем количество сохраненных ошибок
      if (this.errors.length > 50) {
        this.errors = this.errors.slice(-50);
      }
      
      // Filter out benign Service Worker errors and common browser issues
      const errorMsg = String(errorInfo.message || '').toLowerCase();
      const isServiceWorkerError = errorMsg && (
        errorMsg.includes('serviceworker') ||
        errorMsg.includes('service worker') ||
        errorMsg.includes('invalid state') ||
        errorMsg.includes('not found') ||
        errorMsg.includes('failed to update') ||
        errorMsg.includes('failed to register') ||
        errorMsg.includes('the object is in an invalid state') ||
        (errorMsg.includes('script') && errorMsg.includes('unknown')) ||
        errorMsg.includes('chunkloaderror') ||
        errorMsg.includes('loading chunk') ||
        errorMsg.includes('network error')
      );
      
      // Only log non-critical errors
      if (!isServiceWorkerError) {
        // Only log in development for non-critical errors
        if (isDev()) {
          console.error('🔴 Error captured:', errorInfo.message);
        }
      }
      
      // Показываем пользователю уведомление только для критических ошибок
      // НЕ показываем toast для Service Worker ошибок или других benign ошибок
      // В production НЕ показываем toast вообще
      if (window.showToast && !isServiceWorkerError && errorInfo.message && 
          !errorInfo.message.toLowerCase().includes('chunk') &&
          !errorInfo.message.toLowerCase().includes('loading') &&
          !errorInfo.message.toLowerCase().includes('script') &&
          !errorInfo.message.toLowerCase().includes('network')) {
        // Только для реальных критических ошибок и только в development
        if (isDev()) {
          window.showToast('A apărut o eroare. Reîncărcați pagina.', 'error', 5000);
        }
        // В production НЕ показываем toast для ошибок
      }
    }
    
    getErrors() {
      return this.errors;
    }
    
    clearErrors() {
      this.errors = [];
    }
  }
  
  // =====================================================
  // LEAD PIPELINE - Управление потоком лидов
  // =====================================================
  
  class LeadPipeline {
    constructor(core) {
      this.core = core;
      this.queue = [];
      this.processing = false;
    }
    
    // Добавление лида в очередь
    async addLead(leadData) {
      const lead = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toISOString(),
        source: leadData.source || 'website',
        status: 'pending',
        ...leadData
      };
      
      this.queue.push(lead);
      this._saveQueue();
      
      // Процессируем очередь
      return this._processQueue();
    }
    
    // Обработка очереди
    async _processQueue() {
      if (this.processing || this.queue.length === 0) return;
      
      this.processing = true;
      
      while (this.queue.length > 0) {
        const lead = this.queue[0];
        
        try {
          // Отправляем в Remonline
          const result = await this._sendToRemonline(lead);
          
          if (result.success) {
            lead.status = 'sent';
            lead.remonline_id = result.lead_id;
            this.queue.shift();
            // Only log in development
            if (isDev()) {
              if (isDev()) {
                console.log(`✅ Лид ${lead.id} отправлен в Remonline`);
              }
            }
          } else {
            // При ошибке - перемещаем в конец очереди
            lead.retries = (lead.retries || 0) + 1;
            if (lead.retries >= 3) {
              lead.status = 'failed';
              this.queue.shift();
              // Only log in development
              if (isDev()) {
                if (isDev()) {
                  console.warn(`⚠️ Лид ${lead.id} не отправлен после 3 попыток`);
                }
              }
            } else {
              this.queue.shift();
              this.queue.push(lead);
              // Ждем перед следующей попыткой
              await new Promise(r => setTimeout(r, 2000));
            }
          }
        } catch (e) {
          // Only log in development
          if (isDev()) {
            console.error('❌ Ошибка обработки лида:', e);
          }
          lead.retries = (lead.retries || 0) + 1;
          if (lead.retries >= 3) {
            lead.status = 'failed';
            this.queue.shift();
          }
        }
        
        this._saveQueue();
      }
      
      this.processing = false;
    }
    
    // Отправка в Remonline
    async _sendToRemonline(lead) {
      try {
        const response = await fetch('/api/remonline?action=create_inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: lead.name || '',
            phone: lead.phone || '',
            device: lead.device,
            issue: lead.issue,
            estimated_price: lead.estimatedPrice,
            source: lead.source,
            timestamp: lead.timestamp
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
      } catch (e) {
        // Only log in development
        if (isDev()) {
          if (isDev()) {
            console.error('Ошибка Remonline API:', e);
          }
        }
        return { success: false, error: e.message };
      }
    }
    
    // Сохранение очереди
    _saveQueue() {
      try {
        localStorage.setItem('nexx_lead_queue', JSON.stringify(this.queue));
      } catch (e) {
        // ignore
      }
    }
    
    // Загрузка очереди
    _loadQueue() {
      try {
        const saved = localStorage.getItem('nexx_lead_queue');
        if (saved) {
          this.queue = JSON.parse(saved);
        }
      } catch (e) {
        this.queue = [];
      }
    }
    
    // Инициализация
    init() {
      this._loadQueue();
      // Процессируем очередь при загрузке
      if (this.queue.length > 0) {
        // Only log in development
        if (isDev()) {
          if (isDev()) {
            console.log(`📨 В очереди ${this.queue.length} неотправленных лидов`);
          }
        }
        this._processQueue();
      }
    }
  }
  
  // =====================================================
  // INITIALIZATION
  // =====================================================
  
  const core = new NEXXCore();
  const dataSync = new DataSync(core);
  const errorBoundary = new ErrorBoundary(core);
  const leadPipeline = new LeadPipeline(core);
  
  // Экспортируем глобально
  window.NEXXCore = core;
  window.NEXXDataSync = dataSync;
  window.NEXXErrorBoundary = errorBoundary;
  window.NEXXLeadPipeline = leadPipeline;
  
  // Автоинициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      core.init();
      leadPipeline.init();
    });
  } else {
    core.init();
    leadPipeline.init();
  }
  
  // Only log in development
  if (isDev()) {
    if (isDev()) {
      console.log(`🎯 NEXX Core v${VERSION} loaded - "Венозная система"`);
    }
  }
})();
