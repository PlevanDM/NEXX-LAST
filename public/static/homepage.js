/**
 * NEXX Homepage v9.0
 * Main homepage with all React sections
 */

const { createElement: h } = React;

// Import shared components (simulated - actual components are defined below)
// In production, these would be separate modules

// ============================================
// SHARED COMPONENTS
// ============================================

// Button Component
const Button = ({ children, variant = 'primary', size = 'md', icon, iconPosition = 'left', onClick, disabled = false, className = '', fullWidth = false }) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`;
  
  return h('button', {
    type: 'button',
    onClick,
    disabled,
    className: styles,
  },
    icon && iconPosition === 'left' && h('i', { className: `fa ${icon}` }),
    children,
    icon && iconPosition === 'right' && h('i', { className: `fa ${icon}` })
  );
};

// ============================================
// HEADER COMPONENT
// ============================================

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mastersMenuOpen, setMastersMenuOpen] = React.useState(false);
  
  const navItems = [
    { label: 'Головна', href: '/' },
    { label: 'Послуги', href: '/#services' },
    { label: 'Калькулятор', href: '/calculator' },
    { label: 'Курси', href: '/#courses' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Контакти', href: '/#contact' },
  ];
  
  const mastersItems = [
    { label: 'NEXX Database', href: '/nexx', icon: 'fa-database', protected: true },
    { label: 'База знань', href: '/nexx#knowledge', icon: 'fa-book' },
    { label: 'Прайс-лист', href: '/nexx#prices', icon: 'fa-money-bill' },
    { label: 'Інструменти', href: '/nexx#tools', icon: 'fa-toolbox' },
  ];
  
  return h('header', { className: 'sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md' },
    h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      h('div', { className: 'flex items-center justify-between h-16' },
        // Logo
        h('div', { className: 'flex items-center' },
          h('a', { href: '/', className: 'flex items-center gap-3' },
            h('div', { className: 'w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center' },
              h('i', { className: 'fa fa-mobile-screen text-white text-xl' })
            ),
            h('div', { className: 'hidden sm:block' },
              h('div', { className: 'text-xl font-bold text-slate-900' }, 'NEXX'),
              h('div', { className: 'text-xs text-slate-600' }, 'Професійний ремонт Apple')
            )
          )
        ),
        
        // Desktop Navigation
        h('nav', { className: 'hidden lg:flex items-center gap-6' },
          ...navItems.map(item =>
            h('a', {
              key: item.href,
              href: item.href,
              className: 'text-sm font-medium transition-colors hover:text-blue-600 text-slate-700'
            }, item.label)
          ),
          
          // Для майстрів dropdown
          h('div', { className: 'relative' },
            h('button', {
              onClick: () => setMastersMenuOpen(!mastersMenuOpen),
              className: 'text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1'
            },
              'Для майстрів',
              h('i', { className: `fa fa-chevron-down text-xs transition-transform ${mastersMenuOpen ? 'rotate-180' : ''}` })
            ),
            
            mastersMenuOpen && h('div', { className: 'absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2' },
              ...mastersItems.map(item =>
                h('a', {
                  key: item.href,
                  href: item.href,
                  className: 'block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors',
                  onClick: () => setMastersMenuOpen(false)
                },
                  h('i', { className: `fa ${item.icon} w-5` }),
                  h('span', { className: 'ml-2' }, item.label),
                  item.protected && h('i', { className: 'fa fa-lock text-xs ml-2 text-slate-400' })
                )
              )
            )
          )
        ),
        
        // CTA Button
        h('div', { className: 'hidden lg:block' },
          h(Button, {
            variant: 'primary',
            icon: 'fa-phone',
            onClick: () => window.location.href = 'tel:+380123456789'
          }, 'Зателефонувати')
        ),
        
        // Mobile Menu Button
        h('button', {
          className: 'lg:hidden p-2 text-slate-700 hover:text-blue-600 transition-colors',
          onClick: () => setMobileMenuOpen(!mobileMenuOpen)
        },
          h('i', { className: `fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl` })
        )
      ),
      
      // Mobile Menu
      mobileMenuOpen && h('div', { className: 'lg:hidden border-t border-slate-200 py-4' },
        h('nav', { className: 'flex flex-col gap-2' },
          ...navItems.map(item =>
            h('a', {
              key: item.href,
              href: item.href,
              className: 'px-4 py-2 text-sm font-medium rounded-lg transition-colors text-slate-700 hover:bg-slate-50',
              onClick: () => setMobileMenuOpen(false)
            }, item.label)
          ),
          
          h('div', { className: 'border-t border-slate-200 my-2' }),
          h('div', { className: 'px-4 py-1 text-xs font-semibold text-slate-500 uppercase' }, 'Для майстрів'),
          
          ...mastersItems.map(item =>
            h('a', {
              key: item.href,
              href: item.href,
              className: 'px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors',
              onClick: () => setMobileMenuOpen(false)
            },
              h('i', { className: `fa ${item.icon} w-5` }),
              h('span', { className: 'ml-2' }, item.label),
              item.protected && h('i', { className: 'fa fa-lock text-xs ml-2 text-slate-400' })
            )
          ),
          
          h('div', { className: 'border-t border-slate-200 my-2' }),
          h('div', { className: 'px-4' },
            h(Button, {
              variant: 'primary',
              icon: 'fa-phone',
              onClick: () => window.location.href = 'tel:+380123456789',
              fullWidth: true
            }, 'Зателефонувати')
          )
        )
      )
    )
  );
};

// ============================================
// HOMEPAGE COMPONENT
// ============================================

const Homepage = () => {
  return h('div', { className: 'min-h-screen' },
    h(Header),
    
    // Main content placeholder
    h('div', { className: 'text-center py-20' },
      h('h1', { className: 'text-4xl font-bold mb-4' }, 'NEXX v9.0 Homepage'),
      h('p', { className: 'text-lg text-slate-600' }, 'React sections loading...')
    )
  );
};

// ============================================
// RENDER APP
// ============================================

ReactDOM.createRoot(document.getElementById('app')).render(h(Homepage));
