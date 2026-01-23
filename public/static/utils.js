/**
 * NEXX Utilities
 * Helper functions для всього проекту
 */

(function() {
  'use strict';
  
  // ============================================
  // NETWORK STATUS
  // ============================================
  
  class NetworkStatus {
    constructor() {
      this.isOnline = navigator.onLine;
      this.listeners = [];
      this.init();
    }
    
    init() {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.notifyListeners('online');
        if (window.showToast) {
          window.showToast('✅ З\'єднання відновлено', 'success');
        }
      });
      
      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notifyListeners('offline');
        if (window.showToast) {
          window.showToast('⚠️ Немає з\'єднання', 'warning', 0);
        }
      });
    }
    
    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }
    
    notifyListeners(status) {
      this.listeners.forEach(l => l(status, this.isOnline));
    }
    
    checkConnection() {
      return this.isOnline;
    }
  }
  
  // ============================================
  // DEBOUNCE & THROTTLE - Performance helpers
  // ============================================
  
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // ============================================
  // PERFORMANCE MONITOR
  // ============================================
  
  class PerformanceMonitor {
    constructor() {
      this.metrics = {};
    }
    
    // Mark start of operation
    mark(label) {
      this.metrics[label] = { start: performance.now() };
    }
    
    // Mark end and calculate duration
    measure(label) {
      if (!this.metrics[label]) return null;
      
      const duration = performance.now() - this.metrics[label].start;
      this.metrics[label].duration = Math.round(duration);
      
      console.log(`⏱️ ${label}: ${this.metrics[label].duration}ms`);
      return this.metrics[label].duration;
    }
    
    // Get page load metrics
    getPageMetrics() {
      if (!window.performance || !window.performance.timing) {
        return null;
      }
      
      const timing = performance.timing;
      const navigation = performance.navigation;
      
      return {
        // Navigation timing
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        request: timing.responseStart - timing.requestStart,
        response: timing.responseEnd - timing.responseStart,
        domProcessing: timing.domComplete - timing.domLoading,
        
        // Load times
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
        windowLoad: timing.loadEventEnd - timing.navigationStart,
        
        // Total
        total: timing.loadEventEnd - timing.navigationStart,
        
        // Navigation type
        navigationType: navigation.type === 0 ? 'navigate' : 
                       navigation.type === 1 ? 'reload' : 
                       navigation.type === 2 ? 'back_forward' : 'unknown'
      };
    }
    
    // Log performance report (only in development)
    logReport() {
      const metrics = this.getPageMetrics();
      if (!metrics) return;
      
      // Only log in development
      const isDev = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
      if (!isDev) return;
      
      console.log('\n📊 Performance Report:');
      console.log('  DNS:', metrics.dns + 'ms');
      console.log('  TCP:', metrics.tcp + 'ms');
      console.log('  Response:', metrics.response + 'ms');
      console.log('  DOM Ready:', metrics.domReady + 'ms');
      console.log('  Total Load:', metrics.total + 'ms');
      console.log('  Type:', metrics.navigationType);
      console.log('');
    }
  }
  
  // ============================================
  // LOCAL STORAGE HELPER
  // ============================================
  
  const storage = {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        // Only log in development
        const isDev = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
        if (isDev) {
          console.warn('Storage get error:', e);
        }
        return defaultValue;
      }
    },
    
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        // Only log in development
        const isDev = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
        if (isDev) {
          console.warn('Storage set error:', e);
        }
        return false;
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        // Only log in development
        const isDev = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
        if (isDev) {
          console.warn('Storage remove error:', e);
        }
        return false;
      }
    },
    
    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (e) {
        // Only log in development
        const isDev = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
        if (isDev) {
          console.warn('Storage clear error:', e);
        }
        return false;
      }
    }
  };
  
  // ============================================
  // DEBOUNCE & THROTTLE
  // ============================================
  
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  // ============================================
  // EXPORT TO GLOBAL
  // ============================================
  
  window.NEXXUtils = {
    NetworkStatus: new NetworkStatus(),
    PerformanceMonitor: new PerformanceMonitor(),
    storage,
    debounce,
    throttle
  };
  
  // Auto log performance after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.NEXXUtils.PerformanceMonitor.logReport();
    }, 100);
  });
  
  console.log('✅ NEXX Utils loaded');
})();
