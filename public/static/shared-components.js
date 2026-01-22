// Shared Components for NEXX v10.0
// Unified wrapper around NEXXDesign System

(function() {
  'use strict';

  if (typeof window !== 'undefined') {
    // If NEXXDesign is already loaded (from ui-components.js)
    if (window.NEXXDesign) {
      window.NEXXShared = {
        Header: window.NEXXDesign.Header,
        Footer: window.NEXXDesign.Footer
      };
    } else {
      // Fallback if ui-components.js is not loaded yet
      console.warn('⚠️ NEXXDesign not found. Shared components might be empty.');
      window.NEXXShared = {
        Header: () => React.createElement('div', null, 'Loading Header...'),
        Footer: () => React.createElement('div', null, 'Loading Footer...')
      };
    }
  }
})();
