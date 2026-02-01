import React, { useState, useEffect } from 'react';
import { cn } from '@/utils';
import { Button } from './ui/Button';

interface HeaderProps {
  logo?: React.ReactNode;
  siteName?: string;
  navItems?: Array<{
    label: string;
    href: string;
    isActive?: boolean;
  }>;
  showMobileMenu?: boolean;
  onMobileMenuToggle?: () => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  transparent?: boolean;
  sticky?: boolean;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  siteName = 'NEXX',
  navItems = [],
  actionButton,
  transparent = false,
  sticky = true,
  className,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerBg = transparent && !scrolled
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100';

  return (
    <header
      className={cn(
        'w-full z-50 transition-all duration-300',
        sticky && 'sticky top-0',
        headerBg,
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {logo ? (
              logo
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg">
                N
              </div>
            )}
            <span className={cn(
              'font-bold text-xl tracking-tight transition-colors',
              transparent && !scrolled ? 'text-white' : 'text-slate-800'
            )}>
              {siteName}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  item.isActive
                    ? 'bg-blue-50 text-blue-700'
                    : transparent && !scrolled
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {actionButton && (
              <Button
                variant="primary"
                size="md"
                onClick={actionButton.onClick}
                className="hidden sm:inline-flex"
              >
                {actionButton.label}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors',
                transparent && !scrolled
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white animate-in slide-in-from-top duration-200">
            <nav className="py-4 space-y-1">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-base font-medium transition-colors',
                    item.isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {item.label}
                </a>
              ))}
              {actionButton && (
                <div className="px-4 pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={actionButton.onClick}
                  >
                    {actionButton.label}
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
