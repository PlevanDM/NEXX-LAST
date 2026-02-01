/**
 * NEXX Design System 2026
 * Unified design tokens, components, and styles
 */

// ============================================
// COLORS - Brand Palette
// ============================================

export const colors = {
  // Primary - Blue
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',  // Main brand color
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Secondary - Purple/Indigo
  secondary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',  // Accent color
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  
  // Success - Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Success actions
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning - Orange
  warning: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  
  // Danger - Red
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Neutral - Slate
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  }
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", "Fira Code", "Consolas", monospace'
  },
  
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  }
} as const;

// ============================================
// SPACING
// ============================================

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const;

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  base: '0.25rem',   // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
} as const;

// ============================================
// TRANSITIONS
// ============================================

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================
// ICONS - Unified System
// ============================================

export const icons = {
  // Device Categories
  devices: {
    iphone: 'fa-mobile-screen-button',
    ipad: 'fa-tablet-screen-button',
    macbook: 'fa-laptop',
    mac: 'fa-desktop',
    watch: 'fa-clock',
    airpods: 'fa-headphones',
  },
  
  // Services
  services: {
    repair: 'fa-screwdriver-wrench',
    diagnostics: 'fa-microscope',
    cleaning: 'fa-broom',
    customization: 'fa-wand-magic-sparkles',
    tradeIn: 'fa-arrows-rotate',
    accessories: 'fa-bag-shopping',
  },
  
  // Actions
  actions: {
    search: 'fa-magnifying-glass',
    filter: 'fa-filter',
    sort: 'fa-arrow-down-wide-short',
    edit: 'fa-pen-to-square',
    delete: 'fa-trash',
    add: 'fa-plus',
    close: 'fa-xmark',
    check: 'fa-check',
    chevronDown: 'fa-chevron-down',
    chevronRight: 'fa-chevron-right',
    external: 'fa-arrow-up-right-from-square',
  },
  
  // Status
  status: {
    success: 'fa-circle-check',
    warning: 'fa-triangle-exclamation',
    error: 'fa-circle-xmark',
    info: 'fa-circle-info',
    loading: 'fa-spinner fa-spin',
  },
  
  // Navigation
  navigation: {
    home: 'fa-house',
    database: 'fa-database',
    calculator: 'fa-calculator',
    settings: 'fa-gear',
    user: 'fa-user',
    logout: 'fa-right-from-bracket',
    menu: 'fa-bars',
  },
  
  // Contact
  contact: {
    phone: 'fa-phone',
    email: 'fa-envelope',
    location: 'fa-location-dot',
    clock: 'fa-clock',
    whatsapp: 'fa-whatsapp',
    telegram: 'fa-telegram',
    instagram: 'fa-instagram',
    facebook: 'fa-facebook',
  },
  
  // Technical
  technical: {
    chip: 'fa-microchip',
    cpu: 'fa-microchip',
    battery: 'fa-battery-full',
    display: 'fa-display',
    camera: 'fa-camera',
    speaker: 'fa-volume-high',
    port: 'fa-plug',
    board: 'fa-memory',
  }
} as const;

// ============================================
// COMPONENT VARIANTS
// ============================================

export const buttonVariants = {
  // Sizes
  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    base: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  },
  
  // Variants
  variants: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    link: 'text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline',
  },
  
  // Base classes
  base: 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
} as const;

export const cardVariants = {
  base: 'bg-white rounded-xl shadow-md overflow-hidden',
  hover: 'hover:shadow-xl transition-shadow duration-300',
  clickable: 'cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300',
  bordered: 'border border-gray-200',
  elevated: 'shadow-lg',
} as const;

export const modalVariants = {
  overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4',
  container: 'bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col',
  header: 'flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50',
  body: 'flex-1 overflow-y-auto p-6',
  footer: 'p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3',
} as const;

export const badgeVariants = {
  variants: {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
  },
  base: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
} as const;

// ============================================
// GRADIENTS
// ============================================

export const gradients = {
  hero: 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800',
  card: 'bg-gradient-to-br from-blue-50 to-purple-50',
  button: 'bg-gradient-to-r from-blue-600 to-purple-600',
  text: 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
  overlay: 'bg-gradient-to-t from-black/50 to-transparent',
} as const;

// ============================================
// ANIMATIONS
// ============================================

export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  scaleIn: 'animate-scale-in',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
} as const;

// ============================================
// LAYOUT CONSTANTS
// ============================================

export const layout = {
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
  },
  
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-16 md:py-20 lg:py-24',
  
  header: {
    height: '64px',
    heightMobile: '56px',
  },
  
  sidebar: {
    width: '280px',
    widthCollapsed: '64px',
  },
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalOverlay: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  notification: 80,
  max: 9999,
} as const;

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const getButtonClasses = (
  variant: keyof typeof buttonVariants.variants = 'primary',
  size: keyof typeof buttonVariants.sizes = 'base',
  className?: string
) => {
  return cn(
    buttonVariants.base,
    buttonVariants.variants[variant],
    buttonVariants.sizes[size],
    className
  );
};

export const getCardClasses = (
  hover = false,
  clickable = false,
  bordered = false,
  className?: string
) => {
  return cn(
    cardVariants.base,
    hover && cardVariants.hover,
    clickable && cardVariants.clickable,
    bordered && cardVariants.bordered,
    className
  );
};

export const getBadgeClasses = (
  variant: keyof typeof badgeVariants.variants = 'default',
  className?: string
) => {
  return cn(
    badgeVariants.base,
    badgeVariants.variants[variant],
    className
  );
};

export const getIcon = (category: string, type: string): string => {
  const iconMap: any = icons;
  return iconMap[category]?.[type] || 'fa-circle-question';
};

// ============================================
// CUSTOM CSS ANIMATIONS
// ============================================

export const customAnimations = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-fade-in { animation: fadeIn 0.6s ease-out; }
.animate-slide-up { animation: slideUp 0.4s ease-out; }
.animate-slide-down { animation: slideDown 0.4s ease-out; }
.animate-scale-in { animation: scaleIn 0.3s ease-out; }
`;

// ============================================
// EXPORT COMPLETE DESIGN SYSTEM
// ============================================

export const designSystem = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  transitions,
  icons,
  buttonVariants,
  cardVariants,
  modalVariants,
  badgeVariants,
  gradients,
  animations,
  layout,
  zIndex,
  breakpoints,
  helpers: {
    cn,
    getButtonClasses,
    getCardClasses,
    getBadgeClasses,
    getIcon,
  },
  customAnimations,
} as const;

export default designSystem;
