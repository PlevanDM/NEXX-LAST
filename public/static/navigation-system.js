/**
 * NEXX Navigation System 2026
 * Unified routing, breadcrumbs, cross-links, state management
 */

(function() {
  'use strict';
  
  // ============================================
  // SITE MAP - Complete Navigation Structure
  // ============================================
  
  const SITE_MAP = {
    home: {
      id: 'home',
      path: '/',
      title: 'Acasă',
      icon: 'fa-house',
      description: 'Service profesional multibrand',
      children: ['services', 'calculator', 'database', 'about', 'faq']
    },
    services: {
      id: 'services',
      path: '/#services',
      title: 'Servicii',
      icon: 'fa-screwdriver-wrench',
      description: 'Servicii complete de reparație',
      children: ['calculator', 'database'],
      related: ['about', 'faq']
    },
    calculator: {
      id: 'calculator',
      path: '/calculator',
      title: 'Calculator',
      icon: 'fa-calculator',
      description: 'Calculează costul reparației',
      parent: 'services',
      children: ['database'],
      related: ['services', 'faq']
    },
    database: {
      id: 'database',
      path: '/nexx.html',
      title: 'Bază de date',
      icon: 'fa-database',
      description: 'Bază completă de reparații',
      parent: 'services',
      auth: true,
      children: ['devices', 'errors', 'ics', 'knowledge'],
      related: ['calculator', 'services']
    },
    about: {
      id: 'about',
      path: '/about',
      title: 'Despre noi',
      icon: 'fa-circle-info',
      description: 'Echipa și valori NEXX',
      related: ['home', 'faq', 'contacts']
    },
    faq: {
      id: 'faq',
      path: '/faq',
      title: 'FAQ',
      icon: 'fa-circle-question',
      description: '25+ întrebări frecvente',
      related: ['about', 'calculator', 'contacts']
    },
    privacy: {
      id: 'privacy',
      path: '/privacy',
      title: 'Confidențialitate',
      icon: 'fa-shield-halved',
      description: 'Politica de confidențialitate',
      related: ['terms']
    },
    terms: {
      id: 'terms',
      path: '/terms',
      title: 'Termeni',
      icon: 'fa-file-contract',
      description: 'Termeni și condiții',
      related: ['privacy']
    },
    contacts: {
      id: 'contacts',
      path: '/#contacts',
      title: 'Contacte',
      icon: 'fa-phone',
      description: 'Contactați-ne',
      related: ['about', 'faq']
    }
  };
  
  // ============================================
  // BREADCRUMBS COMPONENT
  // ============================================
  
  const Breadcrumbs = ({ currentPage }) => {
    const h = React.createElement;
    
    if (!currentPage || !SITE_MAP[currentPage]) return null;
    
    const buildPath = (pageId) => {
      const path = [];
      let current = SITE_MAP[pageId];
      
      while (current) {
        path.unshift(current);
        current = current.parent ? SITE_MAP[current.parent] : null;
      }
      
      // Always start with home
      if (path[0]?.id !== 'home') {
        path.unshift(SITE_MAP.home);
      }
      
      return path;
    };
    
    const breadcrumbPath = buildPath(currentPage);
    
    return h('nav', { 
      className: 'bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-16 z-40',
      'aria-label': 'Breadcrumb'
    },
      h('div', { className: 'max-w-7xl mx-auto px-4 py-3' },
        h('ol', { className: 'flex items-center gap-2 text-sm' },
          ...breadcrumbPath.map((page, idx) => {
            const isLast = idx === breadcrumbPath.length - 1;
            
            return h('li', { 
              key: page.id,
              className: 'flex items-center gap-2'
            },
              !isLast && idx > 0 && h('i', { className: 'fas fa-chevron-right text-gray-400 text-xs' }),
              isLast 
                ? h('span', { className: 'flex items-center gap-2 text-gray-900 font-semibold' },
                    h('i', { className: `fas ${page.icon} text-blue-600` }),
                    page.title
                  )
                : h('a', { 
                    href: page.path,
                    className: 'flex items-center gap-2 text-gray-600 hover:text-blue-600 transition'
                  },
                    h('i', { className: `fas ${page.icon}` }),
                    page.title
                  )
            );
          })
        )
      )
    );
  };
  
  // ============================================
  // RELATED PAGES COMPONENT
  // ============================================
  
  const RelatedPages = ({ currentPage }) => {
    const h = React.createElement;
    
    if (!currentPage || !SITE_MAP[currentPage]) return null;
    
    const page = SITE_MAP[currentPage];
    const relatedIds = page.related || [];
    
    if (relatedIds.length === 0) return null;
    
    return h('section', { className: 'py-12 px-4 bg-gradient-to-br from-blue-50 to-purple-50' },
      h('div', { className: 'max-w-7xl mx-auto' },
        h('h3', { className: 'text-2xl font-bold mb-6 flex items-center gap-2' },
          h('i', { className: 'fas fa-link text-blue-600' }),
          'Link-uri utile'
        ),
        h('div', { className: 'grid md:grid-cols-3 gap-4' },
          ...relatedIds.map(relatedId => {
            const related = SITE_MAP[relatedId];
            if (!related) return null;
            
            return h('a', {
              key: related.id,
              href: related.path,
              className: 'group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-l-4 border-gray-400'
            },
              h('div', { className: 'flex items-start gap-4' },
                h('div', { className: 'w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-700 text-xl group-hover:bg-gray-700 group-hover:text-white transition' },
                  h('i', { className: `fas ${related.icon}` })
                ),
                h('div', { className: 'flex-1' },
                  h('h4', { className: 'font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition' }, related.title),
                  h('p', { className: 'text-sm text-gray-600' }, related.description)
                )
              )
            );
          })
        )
      )
    );
  };
  
  // ============================================
  // QUICK ACTIONS WIDGET
  // ============================================
  
  const QuickActions = ({ currentPage }) => {
    const h = React.createElement;
    const [isExpanded, setIsExpanded] = React.useState(false);
    
    // Функция для получения перевода
    const t = (key) => {
      if (window.i18n && window.i18n.t) {
        return window.i18n.t(key);
      }
      // Fallback на румынский (основной язык)
      const fallbacks = {
        'quickActions.home': 'Acasă',
        'quickActions.calculator': 'Calculator',
        'quickActions.database': 'Bază de date',
        'quickActions.call': 'Apel',
        'quickActions.telegram': 'Telegram',
        'quickActions.close': 'Închide',
        'quickActions.quickMenu': 'Meniu rapid'
      };
      return fallbacks[key] || key;
    };
    
    const actions = [
      { id: 'home', labelKey: 'quickActions.home', icon: 'fa-house', gradient: 'from-gray-900 to-gray-800', path: '/' },
      { id: 'calculator', labelKey: 'quickActions.calculator', icon: 'fa-calculator', gradient: 'from-gray-800 to-gray-700', path: '/#calculator' },
      { id: 'database', labelKey: 'quickActions.database', icon: 'fa-database', gradient: 'from-gray-700 to-gray-600', path: '/nexx.html' },
      { id: 'phone', labelKey: 'quickActions.call', icon: 'fa-phone', gradient: 'from-gray-800 to-gray-900', path: 'tel:+40721234567' },
      { id: 'telegram', labelKey: 'quickActions.telegram', icon: 'fa-telegram', gradient: 'from-gray-700 to-gray-800', path: 'https://t.me/nexx_support' }
    ];
    
    const visibleActions = actions.filter(a => a.id !== currentPage);
    
    return null; // Quick menu disabled
    return h('div', { className: 'fixed bottom-6 right-6 z-50 hidden' },
      // Main Toggle Button
      h('div', { className: 'flex flex-col items-end gap-3' },
        // Action Buttons (show when expanded)
        isExpanded && visibleActions.map((action, idx) => 
          h('a', {
            key: action.id,
            href: action.path,
            className: `flex items-center gap-3 bg-gradient-to-r ${action.gradient} text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group animate-slide-down`,
            style: { animationDelay: `${idx * 50}ms` }
          },
            h('span', { className: 'font-medium text-sm' }, t(action.labelKey)),
            h('div', { className: 'w-10 h-10 bg-white/20 rounded-full flex items-center justify-center' },
              h('i', { className: `fas ${action.icon}` })
            )
          )
        ),
        
        // Toggle Button
        h('button', {
          onClick: () => setIsExpanded(!isExpanded),
          className: `w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform ${isExpanded ? 'rotate-45' : 'hover:scale-110'} flex items-center justify-center`,
          title: isExpanded ? t('quickActions.close') : t('quickActions.quickMenu')
        },
          h('i', { className: `fas ${isExpanded ? 'fa-xmark' : 'fa-bars'} text-2xl` })
        )
      )
    );
  };
  
  // ============================================
  // NAVIGATION STATE MANAGER
  // ============================================
  
  class NavigationManager {
    constructor() {
      this.history = [];
      this.currentPage = null;
      this.listeners = [];
    }
    
    navigate(pageId, pushState = true) {
      if (!SITE_MAP[pageId]) return;
      
      this.history.push({
        pageId,
        timestamp: new Date(),
        path: SITE_MAP[pageId].path
      });
      
      this.currentPage = pageId;
      this.notifyListeners();
      
      // Save to localStorage
      try {
        localStorage.setItem('nexx_nav_history', JSON.stringify(this.history.slice(-10)));
      } catch (e) {
        console.warn('Failed to save navigation history');
      }
    }
    
    goBack() {
      if (this.history.length > 1) {
        this.history.pop();
        const previous = this.history[this.history.length - 1];
        if (previous) {
          window.location.href = previous.path;
        }
      }
    }
    
    getHistory() {
      return this.history;
    }
    
    getCurrentPage() {
      return this.currentPage ? SITE_MAP[this.currentPage] : null;
    }
    
    getBreadcrumbs() {
      // Build breadcrumb trail
      const trail = [];
      let current = this.getCurrentPage();
      
      while (current) {
        trail.unshift(current);
        current = current.parent ? SITE_MAP[current.parent] : null;
      }
      
      return trail;
    }
    
    getRelatedPages() {
      const current = this.getCurrentPage();
      if (!current || !current.related) return [];
      
      return current.related.map(id => SITE_MAP[id]).filter(Boolean);
    }
    
    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }
    
    notifyListeners() {
      this.listeners.forEach(listener => listener(this.currentPage));
    }
    
    // Get page suggestions based on current page
    getSuggestions() {
      const current = this.getCurrentPage();
      if (!current) return [];
      
      const suggestions = [];
      
      // Add children
      if (current.children) {
        current.children.forEach(id => {
          const page = SITE_MAP[id];
          if (page) suggestions.push({ ...page, reason: 'Secțiune' });
        });
      }
      
      // Add related
      if (current.related) {
        current.related.forEach(id => {
          const page = SITE_MAP[id];
          if (page && !suggestions.find(s => s.id === id)) {
            suggestions.push({ ...page, reason: 'Similar' });
          }
        });
      }
      
      return suggestions.slice(0, 4);
    }
  }
  
  // ============================================
  // SEARCH WIDGET
  // ============================================
  
  const GlobalSearch = () => {
    const h = React.createElement;
    const [isOpen, setIsOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState([]);
    
    React.useEffect(() => {
      const handleKeyDown = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setIsOpen(true);
        }
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    
    React.useEffect(() => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      
      const searchResults = Object.values(SITE_MAP).filter(page => 
        page.title.toLowerCase().includes(query.toLowerCase()) ||
        page.description.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(searchResults.slice(0, 5));
    }, [query]);
    
    if (!isOpen) {
      return h('button', {
        onClick: () => setIsOpen(true),
        className: 'hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg text-white transition',
        title: 'Căutare (Ctrl+K)'
      },
        h('i', { className: 'fas fa-magnifying-glass' }),
        h('span', { className: 'text-sm' }, 'Căutare...'),
        h('kbd', { className: 'ml-2 px-2 py-0.5 bg-white/20 rounded text-xs' }, 'Ctrl+K')
      );
    }
    
    return h('div', { 
      className: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4',
      onClick: () => setIsOpen(false)
    },
      h('div', {
        className: 'bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-scale-in',
        onClick: (e) => e.stopPropagation()
      },
        // Search Input
        h('div', { className: 'p-4 border-b border-gray-200' },
          h('div', { className: 'relative' },
            h('i', { className: 'fas fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' }),
            h('input', {
              type: 'text',
              value: query,
              onChange: (e) => setQuery(e.target.value),
              placeholder: 'Căutați pagini, funcții...',
              className: 'w-full pl-12 pr-4 py-3 text-lg focus:outline-none',
              autoFocus: true
            })
          )
        ),
        
        // Results
        h('div', { className: 'max-h-96 overflow-y-auto p-2' },
          results.length === 0 && query.length >= 2
            ? h('div', { className: 'py-8 text-center text-gray-500' },
                h('i', { className: 'fas fa-magnifying-glass text-4xl mb-2 opacity-30' }),
                h('p', null, 'Nu s-a găsit nimic')
              )
            : results.map(page => h('a', {
                key: page.id,
                href: page.path,
                className: 'flex items-center gap-4 p-4 rounded-lg hover:bg-blue-50 transition',
                onClick: () => setIsOpen(false)
              },
                h('div', { className: 'w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600' },
                  h('i', { className: `fas ${page.icon}` })
                ),
                h('div', { className: 'flex-1' },
                  h('div', { className: 'font-semibold text-gray-900' }, page.title),
                  h('div', { className: 'text-sm text-gray-600' }, page.description)
                ),
                h('i', { className: 'fas fa-arrow-right text-gray-400' })
              ))
        ),
        
        // Footer
        h('div', { className: 'p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center justify-between' },
          h('span', null, 'Folosiți ↑↓ pentru navigare, Enter pentru selecție'),
          h('button', {
            onClick: () => setIsOpen(false),
            className: 'px-2 py-1 bg-gray-200 rounded'
          }, 'ESC')
        )
      )
    );
  };
  
  // ============================================
  // PAGE NAVIGATOR (Bottom Widget)
  // ============================================
  
  const PageNavigator = ({ currentPage }) => {
    const h = React.createElement;
    const navManager = new NavigationManager();
    navManager.currentPage = currentPage;
    
    const suggestions = navManager.getSuggestions();
    
    if (suggestions.length === 0) return null;
    
    return h('div', { className: 'py-16 px-4 bg-white' },
      h('div', { className: 'max-w-7xl mx-auto' },
        h('h3', { className: 'text-2xl font-bold mb-6 flex items-center gap-2' },
          h('i', { className: 'fas fa-compass text-blue-600' }),
          'Unde mergem?'
        ),
        h('div', { className: 'grid md:grid-cols-2 lg:grid-cols-4 gap-4' },
          ...suggestions.map(page => h('a', {
            key: page.id,
            href: page.path,
            className: 'group bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-blue-100'
          },
            h('div', { className: 'flex items-center gap-3 mb-3' },
              h('div', { className: 'w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition' },
                h('i', { className: `fas ${page.icon}` })
              ),
              h('span', { className: 'text-xs font-semibold text-blue-600 uppercase' }, page.reason)
            ),
            h('h4', { className: 'font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition' }, page.title),
            h('p', { className: 'text-sm text-gray-600' }, page.description)
          ))
        )
      )
    );
  };
  
  // ============================================
  // BACK BUTTON
  // ============================================
  
  const BackButton = ({ showAlways = false }) => {
    const h = React.createElement;
    const [canGoBack, setCanGoBack] = React.useState(false);
    
    React.useEffect(() => {
      setCanGoBack(window.history.length > 1);
    }, []);
    
    if (!canGoBack && !showAlways) return null;
    
    return h('button', {
      onClick: () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '/';
        }
      },
      className: 'fixed top-24 left-6 z-40 flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-gray-200',
      title: 'Назад'
    },
      h('i', { className: 'fas fa-arrow-left' }),
      h('span', { className: 'font-medium text-sm' }, 'Назад')
    );
  };
  
  // ============================================
  // EXPORT TO GLOBAL
  // ============================================
  
  window.NEXXNavigation = {
    SITE_MAP,
    Breadcrumbs,
    RelatedPages,
    QuickActions,
    GlobalSearch,
    BackButton,
    NavigationManager,
    
    // Utility functions
    getCurrentPage: () => {
      const path = window.location.pathname;
      return Object.values(SITE_MAP).find(p => p.path === path || p.path.startsWith(path))?.id || 'home';
    },
    
    trackPageView: (pageId) => {
      const manager = new NavigationManager();
      manager.navigate(pageId);
      
      // Analytics tracking (if needed)
      if (window.gtag) {
        window.gtag('event', 'page_view', { page_path: SITE_MAP[pageId]?.path });
      }
    }
  };
  
  console.log('✅ NEXX Navigation System loaded');
})();
