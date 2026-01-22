/**
 * NEXX UI Components Library 2026
 * Unified design system components
 */

(function() {
  'use strict';
  
  const { createElement: h } = React;
  
  // ============================================
  // ANIMATIONS
  // ============================================
  
  const animationStyles = document.createElement('style');
  animationStyles.innerHTML = `
    @keyframes logoFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .logo-float {
      animation: logoFloat 3s ease-in-out infinite;
    }
  `;
  if (document.head) {
    document.head.appendChild(animationStyles);
  }
  
  // ============================================
  // DESIGN TOKENS
  // ============================================
  
  const theme = {
    colors: {
      primary: '#0f172a',        // slate-900
      secondary: '#1e293b',      // slate-800
      accent: '#3b82f6',         // blue-500
      accentSecondary: '#8b5cf6', // violet-500
      success: '#10b981',        // emerald-500
      warning: '#f59e0b',        // amber-500
      danger: '#ef4444',         // red-500
      neutral: '#94a3b8',        // slate-400
    },
    gradients: {
      primary: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      accent: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      glow: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
    },
    transitions: {
      fast: '150ms ease',
      base: '200ms ease',
      slow: '300ms ease',
    }
  };
  
  // ============================================
  // BUTTON COMPONENT
  // ============================================
  
  const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'base', 
    icon, 
    iconPosition = 'left',
    className = '',
    ...props 
  }) => {
    const variantClasses = {
      primary: 'bg-slate-900 hover:bg-black text-white shadow-lg hover:shadow-blue-500/20 border border-slate-800',
      accent: 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/25',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
      success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      danger: 'bg-red-600 hover:bg-red-500 text-white',
      outline: 'border-2 border-slate-700 text-white hover:bg-slate-800',
      ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/50',
    };
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      base: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };
    
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-95';
    
    return h('button', {
      className: `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`,
      ...props
    },
      icon && iconPosition === 'left' && h('i', { className: `fas ${icon}` }),
      children,
      icon && iconPosition === 'right' && h('i', { className: `fas ${icon}` })
    );
  };
  
  // ============================================
  // MODAL COMPONENT
  // ============================================
  
  const Modal = ({ isOpen, onClose, title, children, footer, size = 'lg' }) => {
    if (!isOpen) return null;
    
    const sizeClasses = {
      sm: 'max-w-md',
      base: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      full: 'max-w-[95vw]',
    };
    
    React.useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose?.();
      };
      
      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }, [isOpen, onClose]);
    
    return h('div', {
      className: 'fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in',
      onClick: onClose
    },
      h('div', {
        className: `bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in`,
        onClick: (e) => e.stopPropagation()
      },
        // Header
        h('div', { className: 'flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50' },
          h('h2', { className: 'text-2xl font-bold text-white' }, title),
          h('button', {
            onClick: onClose,
            className: 'w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white'
          }, h('i', { className: 'fas fa-xmark text-xl' }))
        ),
        
        // Body
        h('div', { className: 'flex-1 overflow-y-auto p-6 custom-scrollbar' }, children),
        
        // Footer
        footer && h('div', { className: 'p-6 border-t border-slate-800 bg-slate-900/50 flex items-center justify-end gap-3' }, footer)
      )
    );
  };
  
  // ============================================
  // CARD COMPONENT
  // ============================================
  
  const Card = ({ children, hover = false, clickable = false, className = '', ...props }) => {
    const baseClasses = 'bg-white rounded-xl shadow-md overflow-hidden';
    const hoverClasses = hover ? 'hover:shadow-xl transition-shadow duration-300' : '';
    const clickableClasses = clickable ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300' : '';
    
    return h('div', {
      className: `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`,
      ...props
    }, children);
  };
  
  // ============================================
  // BADGE COMPONENT
  // ============================================
  
  const Badge = ({ children, variant = 'default', icon, className = '' }) => {
    const variantClasses = {
      default: 'bg-gray-200 text-gray-900',
      primary: 'bg-gray-300 text-gray-900',
      success: 'bg-gray-200 text-gray-900',
      warning: 'bg-gray-300 text-gray-900',
      danger: 'bg-gray-400 text-white',
      info: 'bg-gray-300 text-gray-900',
    };
    
    return h('span', {
      className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`
    },
      icon && h('i', { className: `fas ${icon}` }),
      children
    );
  };
  
  // ============================================
  // INPUT COMPONENT
  // ============================================
  
  const Input = ({ label, error, icon, className = '', containerClass = '', ...props }) => {
    return h('div', { className: `${containerClass}` },
      label && h('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, label),
      h('div', { className: 'relative' },
        icon && h('div', { className: 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' },
          h('i', { className: `fas ${icon}` })
        ),
        h('input', {
          className: `w-full px-4 py-2 ${icon ? 'pl-10' : ''} border-2 ${error ? 'border-gray-400' : 'border-gray-300 focus:border-gray-700'} rounded-lg focus:outline-none transition-colors ${className}`,
          ...props
        })
      ),
      error && h('p', { className: 'mt-1 text-sm text-gray-700 font-medium' }, error)
    );
  };
  
  // ============================================
  // HEADER COMPONENT (Unified)
  // ============================================
  
  const Header = ({ currentPage = 'home' }) => {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
    
    React.useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const t = (key) => {
      if (window.i18n && typeof window.i18n.t === 'function') {
        return window.i18n.t(key);
      }
      const fallback = {
        'nav.home': 'Acasă', 'nav.services': 'Servicii', 'nav.calculator': 'Calculator',
        'nav.contacts': 'Contacte', 'nav.database': 'Bază de date'
      };
      return fallback[key] || key;
    };
    
    const navLinks = [
      { id: 'home', label: t('nav.home'), href: '/', icon: 'fa-house' },
      { id: 'services', label: t('nav.services'), href: '/#services', icon: 'fa-screwdriver-wrench' },
      { id: 'calculator', label: t('nav.calculator'), href: '/#calculator', icon: 'fa-calculator' },
      { id: 'database', label: t('nav.database'), href: '/nexx.html', icon: 'fa-database' },
    ];
    
    const handleLogout = () => setIsLogoutModalOpen(true);
    const confirmLogout = () => {
      localStorage.removeItem('nexx_auth');
      window.location.href = '/nexx.html';
    };
    
    const isAuthenticated = localStorage.getItem('nexx_auth') === 'true';
    const headerBg = isScrolled ? 'bg-slate-950/80 backdrop-blur-md shadow-lg border-b border-slate-800' : 'bg-transparent';
    
    return h(React.Fragment, null,
      h('header', { className: `fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${headerBg}` },
        h('div', { className: 'max-w-7xl mx-auto px-4 py-4 flex items-center justify-between' },
          h('a', { href: '/', className: 'flex items-center gap-2 group transition-transform hover:scale-105' },
            h('img', {
              src: '/static/nexx-logo-white.svg',
              alt: 'NEXX',
              className: 'h-8 md:h-10 w-auto filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'
            })
          ),
          
          h('nav', { className: 'hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-2xl border border-slate-800' },
            ...navLinks.map(link => h('a', {
              key: link.id,
              href: link.href,
              className: `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                currentPage === link.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }, h('i', { className: `fas ${link.icon} text-xs` }), link.label))
          ),
          
          h('div', { className: 'flex items-center gap-3' },
            isAuthenticated && currentPage === 'database' && h('button', {
              onClick: handleLogout,
              className: 'px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-bold transition-all border border-red-500/20 flex items-center gap-2'
            }, h('i', { className: 'fas fa-right-from-bracket' }), 'Ieșire'),

            window.LanguageSwitcher && h(window.LanguageSwitcher, { isScrolled }),

            h('button', {
              onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
              className: 'md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-white'
            }, h('i', { className: `fas ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}` }))
          )
        ),
        
        isMobileMenuOpen && h('div', { className: 'md:hidden p-4 bg-slate-900 border-b border-slate-800 animate-slide-down' },
          h('div', { className: 'flex flex-col gap-2' },
            ...navLinks.map(link => h('a', {
              key: link.id,
              href: link.href,
              className: `flex items-center gap-3 p-4 rounded-xl ${currentPage === link.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`,
              onClick: () => setIsMobileMenuOpen(false)
            }, h('i', { className: `fas ${link.icon}` }), link.label))
          )
        )
      ),
    // Logout Confirmation Modal
    h(Modal, {
      isOpen: isLogoutModalOpen,
      onClose: () => setIsLogoutModalOpen(false),
      title: 'Ieșire з бази даних?',
      size: 'sm',
      footer: h('div', { className: 'flex gap-3 justify-end' },
        h('button', {
          onClick: () => setIsLogoutModalOpen(false),
          className: 'px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition'
        }, 'Скасувати'),
        h('button', {
          onClick: confirmLogout,
          className: 'px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition'
        }, 'Ieșire')
      )
    },
      h('p', { className: 'text-gray-700 text-center' }, 'Ви впевнені, що хочете вийти з бази даних?')
    )
  );
  };
  
  // ============================================
  // FOOTER COMPONENT (Unified)
  // ============================================
  
  const Footer = () => {
    const currentYear = new Date().getFullYear();
    const t = (key) => {
      if (window.i18n && typeof window.i18n.t === 'function') return window.i18n.t(key);
      return key.split('.').pop();
    };
    
    return h('footer', { className: 'bg-slate-950 border-t border-slate-800 pt-16 pb-8 text-slate-400' },
      h('div', { className: 'max-w-7xl mx-auto px-4' },
        h('div', { className: 'grid md:grid-cols-4 gap-12 mb-12' },
          h('div', { className: 'md:col-span-2' },
            h('img', { src: '/static/nexx-logo-white.svg', className: 'h-8 mb-6' }),
            h('p', { className: 'max-w-sm mb-6' }, t('footer.tagline')),
            h('div', { className: 'flex gap-4' },
              ['fa-instagram', 'fa-telegram', 'fa-facebook', 'fa-whatsapp'].map(icon => h('a', {
                key: icon, href: '#', className: 'w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 hover:text-white transition-all'
              }, h('i', { className: `fab ${icon}` })))
            )
          ),
          h('div', null,
            h('h4', { className: 'text-white font-bold mb-6' }, t('footer.services')),
            h('ul', { className: 'space-y-4 text-sm' },
              h('li', null, h('a', { href: '/#services', className: 'hover:text-white' }, t('footer.servicePhone'))),
              h('li', null, h('a', { href: '/#services', className: 'hover:text-white' }, t('footer.serviceLaptop'))),
              h('li', null, h('a', { href: '/#calculator', className: 'hover:text-white font-bold text-blue-400' }, t('calculator.title')))
            )
          ),
          h('div', null,
            h('h4', { className: 'text-white font-bold mb-6' }, t('footer.info')),
            h('ul', { className: 'space-y-4 text-sm' },
              h('li', null, h('a', { href: '/faq.html', className: 'hover:text-white' }, t('footer.faq'))),
              h('li', null, h('a', { href: '/privacy.html', className: 'hover:text-white' }, t('footer.privacy'))),
              h('li', null, h('a', { href: '/terms.html', className: 'hover:text-white' }, t('footer.terms')))
            )
          )
        ),
        h('div', { className: 'pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs' },
          h('p', null, `© ${currentYear} NEXX GSM. Toate drepturile rezervate.`),
          h('div', { className: 'flex items-center gap-6' },
            h('span', { className: 'flex items-center gap-1' }, h('i', { className: 'fas fa-shield-halved' }), 'Protejat GDPR'),
            h('span', { className: 'flex items-center gap-1' }, h('i', { className: 'fas fa-lock' }), 'Securizat SSL')
          )
        )
      )
    );
  };
  
  // ============================================
  // LOADING SPINNER
  // ============================================
  
  const Loader = ({ size = 'base', text }) => {
    const sizeClasses = {
      sm: 'w-6 h-6 border-2',
      base: 'w-12 h-12 border-4',
      lg: 'w-16 h-16 border-4',
      xl: 'w-24 h-24 border-6',
    };
    
    return h('div', { className: 'flex flex-col items-center justify-center gap-4' },
      h('div', { 
        className: `${sizeClasses[size]} border-gray-800 border-t-gray-400 rounded-full animate-spin` 
      }),
      text && h('p', { className: 'text-gray-700 font-medium' }, text)
    );
  };
  
  // ============================================
  // ERROR STATE
  // ============================================
  
  const ErrorState = ({ title = 'Щось пішло не так', message, onRetry }) => {
    return h('div', { className: 'flex flex-col items-center justify-center p-8 text-center' },
      h('div', { className: 'text-6xl mb-4' }, '⚠️'),
      h('h3', { className: 'text-2xl font-bold text-gray-900 mb-2' }, title),
      message && h('p', { className: 'text-gray-600 mb-6 max-w-md' }, message),
      onRetry && h(Button, {
        onClick: onRetry,
        icon: 'fa-rotate-right',
        variant: 'primary'
      }, 'Спробувати ще раз')
    );
  };
  
  // ============================================
  // EMPTY STATE
  // ============================================
  
  const EmptyState = ({ icon = 'fa-inbox', title = 'Немає даних', message, action }) => {
    return h('div', { className: 'flex flex-col items-center justify-center p-12 text-center' },
      h('i', { className: `fas ${icon} text-6xl text-gray-300 mb-4` }),
      h('h3', { className: 'text-xl font-bold text-gray-700 mb-2' }, title),
      message && h('p', { className: 'text-gray-500 mb-6 max-w-md' }, message),
      action
    );
  };
  
  // ============================================
  // SEARCH BAR
  // ============================================
  
  const SearchBar = ({ value, onChange, placeholder = 'Пошук...', className = '' }) => {
    return h('div', { className: `relative ${className}` },
      h('div', { className: 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' },
        h('i', { className: 'fas fa-magnifying-glass' })
      ),
      h('input', {
        type: 'text',
        value: value,
        onChange: (e) => onChange(e.target.value),
        placeholder: placeholder,
        className: 'w-full pl-10 pr-4 py-3 border-2 border-gray-300 focus:border-gray-700 rounded-lg focus:outline-none transition-colors'
      }),
      value && h('button', {
        onClick: () => onChange(''),
        className: 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
      }, h('i', { className: 'fas fa-xmark' }))
    );
  };
  
  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================
  
  const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const h = React.createElement;
    
    React.useEffect(() => {
      if (duration && onClose) {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);
    
    const icons = {
      success: 'fa-circle-check',
      error: 'fa-circle-xmark',
      warning: 'fa-triangle-exclamation',
      info: 'fa-circle-info'
    };
    
    const colors = {
      success: 'from-gray-600 to-gray-700',
      error: 'from-gray-700 to-gray-800',
      warning: 'from-gray-600 to-gray-700',
      info: 'from-gray-700 to-gray-800'
    };
    
    return h('div', { 
      className: 'fixed top-20 right-6 z-50 animate-slide-down'
    },
      h('div', { 
        className: `bg-gradient-to-r ${colors[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]`
      },
        h('i', { className: `fas ${icons[type]} text-2xl` }),
        h('span', { className: 'flex-1 font-medium' }, message),
        onClose && h('button', {
          onClick: onClose,
          className: 'hover:bg-white/20 rounded-full p-1 transition'
        }, h('i', { className: 'fas fa-xmark' }))
      )
    );
  };
  
  // Toast Container
  const ToastContainer = () => {
    const h = React.createElement;
    const [toasts, setToasts] = React.useState([]);
    
    React.useEffect(() => {
      // Инициализация глобальной функции showToast
      window.showToast = (message, type = 'success', duration = 3000) => {
        const id = Date.now() + Math.random(); // Уникальный ID
        setToasts(prev => [...prev, { id, message, type, duration }]);
        
        // Автоматическое удаление после duration
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
      };
      
      // Обработка отложенных toast'ов (если были вызваны до монтирования)
      if (window._pendingToasts && Array.isArray(window._pendingToasts)) {
        window._pendingToasts.forEach(toast => {
          window.showToast(toast.message, toast.type, toast.duration);
        });
        window._pendingToasts = [];
      }
      
      return () => {
        // Не удаляем showToast при размонтировании, так как он может использоваться другими компонентами
        // delete window.showToast;
      };
    }, []);
    
    const removeToast = (id) => {
      setToasts(prev => prev.filter(t => t.id !== id));
    };
    
    if (toasts.length === 0) return null;
    
    return h('div', { className: 'fixed top-20 right-6 z-50 flex flex-col gap-2' },
      ...toasts.map(toast => h(Toast, {
        key: toast.id,
        message: toast.message,
        type: toast.type,
        duration: toast.duration,
        onClose: () => removeToast(toast.id)
      }))
    );
  };
  
  // ============================================
  // LOADING SKELETON
  // ============================================
  
  const Skeleton = ({ width = '100%', height = '20px', className = '' }) => {
    const h = React.createElement;
    return h('div', {
      className: `bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded animate-pulse ${className}`,
      style: { width, height }
    });
  };
  
  // ============================================
  // EXPORT TO GLOBAL
  // ============================================
  
  window.NEXXDesign = {
    // Components
    Button,
    Modal,
    Card,
    Badge,
    Input,
    Header,
    Footer,
    Loader,
    ErrorState,
    EmptyState,
    SearchBar,
    Toast,
    ToastContainer,
    Skeleton,
    
    // Theme
    theme,
    
    // Utils
    createElement: h,
  };
  
  console.log('✅ NEXX Design System loaded');
})();
