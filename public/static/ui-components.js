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
    @keyframes logo-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.04); opacity: 0.95; }
    }
    .logo-container {
      position: relative;
      transition: opacity 0.2s ease;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
    }
    .logo-container:hover {
      opacity: 0.9;
    }
    .logo-pulse {
      animation: logo-pulse 2.5s ease-in-out infinite;
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
      primary: '#1f2937',        // Dark gray/black
      secondary: '#6b7280',      // Medium gray
      success: '#9ca3af',        // Light gray
      warning: '#4b5563',        // Darker gray
      danger: '#111827',         // Almost black
      neutral: '#d1d5db',        // Very light gray / silver accent
      accent: '#e5e7eb',         // Silver accent for rare highlights
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
      primary: 'bg-gray-900 hover:bg-black text-white shadow-lg hover:shadow-xl border border-gray-800',
      secondary: 'bg-gray-700 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl',
      success: 'bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl',
      danger: 'bg-gray-800 hover:bg-black text-white shadow-lg hover:shadow-xl',
      outline: 'border-2 border-gray-900 text-gray-900 hover:bg-gray-100 bg-white',
      ghost: 'text-gray-600 hover:bg-gray-200',
    };
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      base: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };
    
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transform hover:scale-105';
    
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
      className: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-fade-in',
      onClick: onClose
    },
      h('div', {
        className: `bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in`,
        onClick: (e) => e.stopPropagation()
      },
        // Header
        h('div', { className: 'flex items-center justify-between p-6 border-b border-gray-300 bg-gray-50' },
          h('h2', { className: 'text-2xl font-bold text-gray-900' }, title),
          h('button', {
            onClick: onClose,
            className: 'w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/80 transition-colors text-gray-500 hover:text-gray-700'
          }, h('i', { className: 'fas fa-xmark text-xl' }))
        ),
        
        // Body
        h('div', { className: 'flex-1 overflow-y-auto p-6' }, children),
        
        // Footer
        footer && h('div', { className: 'p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3' }, footer)
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
    const [lang, setLang] = React.useState(window.i18n?.getCurrentLanguage()?.code || 'ro');
    
    // Subscribe to language changes
    React.useEffect(() => {
      if (window.i18n?.subscribe) {
        return window.i18n.subscribe(() => {
          setLang(window.i18n.getCurrentLanguage()?.code || 'ro');
        });
      }
    }, []);
    
    React.useEffect(() => {
      // Throttle scroll handler for better performance
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            setIsScrolled(window.scrollY > 20);
            ticking = false;
          });
          ticking = true;
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Prevent body scroll when mobile menu is open
    React.useEffect(() => {
      if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [isMobileMenuOpen]);
    
    // Close mobile menu on outside click
    React.useEffect(() => {
      if (!isMobileMenuOpen) return;
      
      const handleClickOutside = (e) => {
        const target = e.target;
        if (!target.closest('header')) {
          setIsMobileMenuOpen(false);
        }
      };
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setIsMobileMenuOpen(false);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isMobileMenuOpen]);
    
    // Translation helper: never show raw key; use fallback if i18n returns key or not ready
    const t = (key) => {
      let v = key;
      if (window.i18n?.t) v = window.i18n.t(key);
      else if (typeof window.t === 'function') v = window.t(key);
      if (v && typeof v === 'string' && v !== key) return v;
      return NAV_FALLBACKS[key] || (key.split('.').pop() || key);
    };
    
    // Dynamic navigation with translations - reactive to language changes
    const navLinks = React.useMemo(() => {
      const client = [
        { id: 'home', label: t('nav.home'), href: '/', icon: 'fa-house' },
        { id: 'services', label: t('nav.services'), href: '/#services', icon: 'fa-screwdriver-wrench' },
        { id: 'calculator', label: t('nav.calculator'), href: '/#calculator', icon: 'fa-calculator' },
        { id: 'contacts', label: t('nav.contacts'), href: '/#contacts', icon: 'fa-phone' },
      ];
      const service = [
        { id: 'home', label: t('nav.home'), href: '/', icon: 'fa-house' },
        { id: 'services', label: t('nav.services'), href: '/#services', icon: 'fa-screwdriver-wrench' },
        { id: 'contacts', label: t('nav.contacts'), href: '/#contacts', icon: 'fa-phone' },
      ];
      return currentPage === 'database' ? service : client;
    }, [lang, currentPage]);
    
    const handleLogout = () => {
      setIsLogoutModalOpen(true);
    };
    
    const confirmLogout = () => {
      localStorage.removeItem('nexx_auth');
      window.location.href = '/nexx.html';
    };
    
    const isAuthenticated = localStorage.getItem('nexx_auth') === 'true';
    
    const headerBg = isScrolled ? 'bg-white shadow-lg border-b border-gray-200 transition-colors duration-300' : 'bg-gradient-to-b from-slate-900/70 to-transparent transition-colors duration-300';
    const textColor = isScrolled ? 'text-gray-900' : 'text-white';
    const iconColor = isScrolled ? 'text-gray-800' : 'text-white';
    
    return h(React.Fragment, null,
      h('header', { 
        className: `fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${headerBg} loaded`,
        style: { opacity: 1 }
      },
      h('div', { className: 'max-w-7xl mx-auto px-4 flex items-center', style: { height: '64px', minHeight: '64px', paddingLeft: 'max(1rem, env(safe-area-inset-left, 0))', paddingRight: 'max(1rem, env(safe-area-inset-right, 0))' } },
        h('div', { className: 'flex items-center justify-between gap-4 min-w-0 w-full' },
          // Логотип слева, крупный и читабельный (64px)
          h('a', {
            href: '/',
            className: 'logo-container flex items-center cursor-pointer flex-shrink-0',
            style: { background: 'transparent', border: 'none' },
            'aria-label': 'NEXX GSM Home',
            title: 'NEXX GSM - Acasă'
          },
            h('img', {
              src: '/static/nexx-logo.png?v=5',
              alt: 'NEXX GSM',
              className: 'object-contain block logo-pulse',
              style: { display: 'block', opacity: 0, height: '64px', width: 'auto', background: 'transparent' },
              onLoad: function(e) {
                e.target.style.opacity = '1';
              },
              onError: function(e) {
                e.target.style.opacity = '1';
              }
            })
          ),
          
          // Навигация справа от лого
          h('nav', { className: 'hidden md:flex items-center flex-1 justify-end gap-4 xl:gap-6' },
            ...navLinks.map(link => h('a', {
              key: link.id,
              href: link.href,
              className: `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${currentPage === link.id ? `font-bold ${isScrolled ? 'bg-gray-100 text-gray-900' : 'bg-transparent border border-white/20 text-white'}` : `${textColor} hover:text-gray-500`}`
            },
              h('i', { className: `fas ${link.icon} text-sm` }),
              link.label
            )),
            isAuthenticated && currentPage === 'database' && h('button', {
              onClick: handleLogout,
              className: `flex items-center gap-2 px-3 py-2 ${isScrolled ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-gray-500/20 hover:bg-gray-500/30 text-white'} rounded-lg transition-all duration-300 font-medium`,
              title: 'Ieșire з бази даних'
            },
              h('i', { className: 'fas fa-right-from-bracket' }),
              h('span', null, 'Ieșire')
            )
          ),
          
          // Service + язык + мобильное меню
          h('div', { className: 'flex items-center gap-3' },
            h('button', {
              onClick: () => window.openServiceModAuth && window.openServiceModAuth(),
              className: `hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 ${isScrolled ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800' : 'bg-transparent hover:bg-white/10 border border-white/20 text-white/70 hover:text-white'} rounded-md text-xs transition-all duration-200`,
              title: 'Service Mod (PIN)'
            },
              h('i', { className: 'fas fa-cog text-xs' }),
              h('span', null, 'Service')
            ),
            window.LanguageSwitcher && h(window.LanguageSwitcher, { isScrolled }),
            h('button', {
              onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
              className: `md:hidden w-11 h-11 flex items-center justify-center rounded-lg flex-shrink-0 min-h-[44px] ${isScrolled ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/10 hover:bg-white/20'} ${textColor} transition-all`,
              'aria-label': isMobileMenuOpen ? 'Close menu' : 'Open menu'
            }, h('i', { className: `fas ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl` }))
          )
        ),
        
        // Mobile Menu Dropdown (positioned below 64px header)
        isMobileMenuOpen && h('div', { 
          className: 'md:hidden absolute top-[64px] left-4 right-4 py-4 bg-white rounded-2xl shadow-2xl animate-slide-down border border-gray-200 z-50',
          style: { maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }
        },
          ...navLinks.map(link => h('a', {
            key: link.id,
            href: link.href,
            className: `flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition min-h-[48px] ${currentPage === link.id ? 'bg-blue-50 text-blue-700 font-semibold' : ''}`,
            onClick: () => setIsMobileMenuOpen(false),
            style: { touchAction: 'manipulation' }
          },
            h('i', { className: `fas ${link.icon} w-5 text-lg` }),
            h('span', { className: 'text-base' }, link.label)
          )),
          // Service Mod link in mobile menu (PIN protected) - Small, subtle
          h('button', {
            onClick: () => { setIsMobileMenuOpen(false); window.openServiceModAuth && window.openServiceModAuth(); },
            className: 'flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition text-xs border-t border-gray-100 mt-2 w-full text-left'
          },
            h('i', { className: 'fas fa-cog w-4 text-xs' }),
            h('span', null, 'Service')
          )
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
  
  // Fallbacks when i18n returns key or is not ready (RO default)
  const FOOTER_FALLBACKS = {
    'footer.tagline': 'Service profesional multibrand. Garanție inclusă. Diagnostic gratuit. București.',
    'footer.company': 'Companie',
    'footer.about': 'Despre noi',
    'footer.jobs': 'Joburi',
    'footer.services': 'Servicii',
    'footer.servicePhone': 'Reparații telefoane',
    'footer.serviceLaptop': 'Reparații laptopuri',
    'footer.info': 'Informații',
    'footer.faq': 'FAQ',
    'footer.privacy': 'Confidențialitate',
    'footer.terms': 'Termeni',
    'footer.copyright': 'NEXX Service Center. Toate drepturile rezervate.',
    'footer.security': 'Site Securizat • SSL Criptat',
    'nav.contacts': 'Contacte',
    'calculator.title': 'Calculator preț',
  };
  
  const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [lang, setLang] = React.useState(window.i18n?.getCurrentLanguage()?.code || 'ro');
    
    // Subscribe to language changes
    React.useEffect(() => {
      if (window.i18n?.subscribe) {
        return window.i18n.subscribe(() => {
          setLang(window.i18n.getCurrentLanguage()?.code || 'ro');
        });
      }
    }, []);
    
    // Translation helper: never show raw key; use fallback if i18n returns key or not ready
    const t = (key) => {
      let v = key;
      if (window.i18n?.t) v = window.i18n.t(key);
      else if (typeof window.t === 'function') v = window.t(key);
      if (v && typeof v === 'string' && v !== key) return v;
      return FOOTER_FALLBACKS[key] || NAV_FALLBACKS[key] || (key.split('.').pop() || key);
    };
    
    // Footer links - reactive to language changes
    const footerLinks = React.useMemo(() => [
      { title: t('footer.company'), links: [
        { label: t('footer.about'), href: '/about.html' },
        { label: t('nav.contacts'), href: '/#contacts' },
        { label: t('footer.jobs'), href: '#' },
      ]},
      { title: t('footer.services'), links: [
        { label: t('footer.servicePhone'), href: '/#services' },
        { label: t('footer.serviceLaptop'), href: '/#services' },
        { label: t('calculator.title'), href: '/#calculator' },
      ]},
      { title: t('footer.info'), links: [
        { label: t('footer.faq'), href: '/faq.html' },
        { label: t('footer.privacy'), href: '/privacy.html' },
        { label: t('footer.terms'), href: '/terms.html' },
      ]},
    ], [lang]);
    
    const socialLinks = [
      { icon: 'fa-instagram', href: 'https://instagram.com/nexx_gsm', label: 'Instagram' },
      { icon: 'fa-telegram', href: 'https://t.me/nexx_support', label: 'Telegram' },
      { icon: 'fa-facebook', href: 'https://facebook.com/nexxgsm', label: 'Facebook' },
      { icon: 'fa-tiktok', href: 'https://tiktok.com/@nexxgsm', label: 'TikTok' },
    ];
    
    return h('footer', { className: 'bg-gradient-to-br from-gray-900 to-black text-white' },
      h('div', { className: 'max-w-7xl mx-auto px-4 py-12' },
        // Main Footer
        h('div', { className: 'grid md:grid-cols-3 gap-8 mb-8' },
          // Brand
          h('div', null,
            h('div', { className: 'flex items-center gap-3 mb-4' },
              h('i', { className: 'fas fa-wrench text-3xl text-gray-400' }),
              h('span', { className: 'text-2xl font-bold text-white' }, 'NEXX')
            ),
            h('p', { className: 'text-gray-400 mb-4' }, t('footer.tagline')),
            h('div', { className: 'flex gap-3' },
              ...socialLinks.map(social => h('a', {
                key: social.icon,
                href: social.href,
                className: 'w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition',
                'aria-label': social.label
              }, h('i', { className: `fab ${social.icon}` })))
            )
          ),
          
          // Links
          ...footerLinks.map(section => h('div', { key: section.title },
            h('h3', { className: 'font-bold text-lg mb-4 text-white' }, section.title),
            h('ul', { className: 'space-y-2' },
              ...section.links.map(link => h('li', { key: link.label },
                link.disabled 
                  ? h('span', { className: 'text-gray-600 text-sm font-mono' }, link.label)
                  : h('a', {
                      href: link.href,
                      className: `${link.special ? 'text-gray-300 hover:text-white font-medium' : 'text-gray-400 hover:text-gray-200'} transition`
                    }, link.label)
              ))
            )
          ))
        ),
        
        // Bottom Bar
        h('div', { className: 'border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4' },
          h('p', { className: 'text-gray-400 text-sm' },
            `© ${currentYear} ` + t('footer.copyright')
          ),
          h('div', { className: 'flex items-center gap-4 text-sm text-gray-400' },
            h('span', { className: 'flex items-center gap-2' },
              h('i', { className: 'fas fa-shield-halved text-gray-500' }),
              t('footer.security').split(' • ')[0]
            ),
            h('span', { className: 'flex items-center gap-2' },
              h('i', { className: 'fas fa-lock text-gray-500' }),
              t('footer.security').split(' • ')[1]
            )
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
        className: `bg-gradient-to-r ${colors[type]} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 min-w-[280px] max-w-[90vw]`
      },
        h('i', { className: `fas ${icons[type]} text-lg` }),
        h('span', { className: 'flex-1 font-medium text-sm' }, message),
        onClose && h('button', {
          onClick: onClose,
          className: 'hover:bg-white/20 rounded-full p-1 transition flex-shrink-0',
          'aria-label': 'Close'
        }, h('i', { className: 'fas fa-xmark text-sm' }))
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
