/**
 * NEXX Analytics Helper
 * Unified tracking system (готовий для GA4, Cloudflare Analytics, etc.)
 */

(function() {
  'use strict';
  
  class Analytics {
    constructor() {
      this.events = [];
      this.sessionId = this.generateSessionId();
      this.startTime = Date.now();
    }
    
    generateSessionId() {
      return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Track page view
    trackPageView(pageName, pageUrl) {
      const event = {
        type: 'pageview',
        page: pageName,
        url: pageUrl || window.location.href,
        timestamp: Date.now(),
        sessionId: this.sessionId
      };
      
      this.events.push(event);
      console.log('📊 Page view:', pageName);
      
      // Send to GA4 if available
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: pageName,
          page_location: event.url
        });
      }
      
      // Send to Cloudflare Web Analytics if available
      if (window.__cfBeacon) {
        // Cloudflare beacon auto-tracks
      }
    }
    
    // Track button/link clicks
    trackClick(elementName, elementType = 'button', category = 'engagement') {
      const event = {
        type: 'click',
        element: elementName,
        elementType,
        category,
        timestamp: Date.now(),
        sessionId: this.sessionId
      };
      
      this.events.push(event);
      console.log('🖱️ Click:', elementName);
      
      if (window.gtag) {
        window.gtag('event', 'click', {
          event_category: category,
          event_label: elementName,
          value: 1
        });
      }
    }
    
    // Track form submissions
    trackFormSubmit(formName, success = true) {
      const event = {
        type: 'form_submit',
        form: formName,
        success,
        timestamp: Date.now(),
        sessionId: this.sessionId
      };
      
      this.events.push(event);
      console.log('📝 Form submit:', formName, success ? '✅' : '❌');
      
      if (window.gtag) {
        window.gtag('event', success ? 'generate_lead' : 'form_error', {
          event_category: 'forms',
          event_label: formName
        });
      }
    }
    
    // Track errors
    trackError(errorMessage, errorType = 'javascript') {
      const event = {
        type: 'error',
        message: errorMessage,
        errorType,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        url: window.location.href
      };
      
      this.events.push(event);
      console.error('❌ Error tracked:', errorMessage);
      
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: errorMessage,
          fatal: false
        });
      }
    }
    
    // Track search
    trackSearch(query, resultsCount) {
      const event = {
        type: 'search',
        query,
        resultsCount,
        timestamp: Date.now(),
        sessionId: this.sessionId
      };
      
      this.events.push(event);
      console.log('🔍 Search:', query, '→', resultsCount, 'results');
      
      if (window.gtag) {
        window.gtag('event', 'search', {
          search_term: query,
          results_count: resultsCount
        });
      }
    }
    
    // Track time on page
    trackTimeOnPage(pageName) {
      const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
      
      console.log('⏱️ Time on', pageName, ':', timeSpent, 'sec');
      
      if (window.gtag && timeSpent > 5) {
        window.gtag('event', 'timing_complete', {
          name: 'page_time',
          value: timeSpent,
          event_category: 'engagement'
        });
      }
    }
    
    // Get session report
    getSessionReport() {
      return {
        sessionId: this.sessionId,
        duration: Math.round((Date.now() - this.startTime) / 1000),
        eventsCount: this.events.length,
        events: this.events
      };
    }
  }
  
  // Global instance
  window.NEXXAnalytics = new Analytics();
  
  // Auto-track page unload
  window.addEventListener('beforeunload', () => {
    const report = window.NEXXAnalytics.getSessionReport();
    console.log('📊 Session report:', report);
    
    // Send to server if needed
    if (navigator.sendBeacon) {
      // navigator.sendBeacon('/api/analytics', JSON.stringify(report));
    }
  });
  
  // Auto-track errors
  window.addEventListener('error', (e) => {
    window.NEXXAnalytics.trackError(e.message, 'uncaught');
  });
  
  console.log('✅ NEXX Analytics ready');
})();
