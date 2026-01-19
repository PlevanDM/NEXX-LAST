import React, { useState } from 'react';
import { SITE_CONFIG, getWhatsAppUrl } from '../../lib/site-config';
import Button from './Button';

export interface HeaderProps {
  currentPath?: string;
}

export const Header: React.FC<HeaderProps> = ({ currentPath = '/' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mastersMenuOpen, setMastersMenuOpen] = useState(false);

  const navItems = [
    { label: 'Головна', href: '/', icon: 'fa-home' },
    { label: 'Послуги', href: '/#services', icon: 'fa-wrench' },
    { label: 'Калькулятор', href: '/calculator', icon: 'fa-calculator' },
    { label: 'Курси', href: '/#courses', icon: 'fa-graduation-cap' },
    { label: 'FAQ', href: '/faq', icon: 'fa-circle-question' },
    { label: 'Контакти', href: '/#contact', icon: 'fa-address-book' },
  ];

  const mastersItems = [
    { label: 'NEXX Database', href: '/nexx', icon: 'fa-database', protected: true },
    { label: 'База знань', href: '/nexx#knowledge', icon: 'fa-book' },
    { label: 'Прайс-лист', href: '/nexx#prices', icon: 'fa-money-bill' },
    { label: 'Інструменти', href: '/nexx#tools', icon: 'fa-toolbox' },
  ];

  const handleCallClick = () => {
    window.location.href = `tel:${SITE_CONFIG.contact.phoneE164}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fa fa-mobile-screen text-white text-xl"></i>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-slate-900">{SITE_CONFIG.name}</div>
                <div className="text-xs text-slate-600">{SITE_CONFIG.tagline}</div>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  currentPath === item.href ? 'text-blue-600' : 'text-slate-700'
                }`}
              >
                {item.label}
              </a>
            ))}

            {/* Для майстрів dropdown */}
            <div className="relative">
              <button
                onClick={() => setMastersMenuOpen(!mastersMenuOpen)}
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                Для майстрів
                <i className={`fa fa-chevron-down text-xs transition-transform ${mastersMenuOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {mastersMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2">
                  {mastersItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => setMastersMenuOpen(false)}
                    >
                      <i className={`fa ${item.icon} w-5`}></i>
                      <span className="ml-2">{item.label}</span>
                      {item.protected && (
                        <i className="fa fa-lock text-xs ml-2 text-slate-400"></i>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              variant="primary"
              icon="fa-phone"
              onClick={handleCallClick}
            >
              Зателефонувати
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-700 hover:text-blue-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPath === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className={`fa ${item.icon} w-5`}></i>
                  <span className="ml-2">{item.label}</span>
                </a>
              ))}

              <div className="border-t border-slate-200 my-2"></div>
              <div className="px-4 py-1 text-xs font-semibold text-slate-500 uppercase">
                Для майстрів
              </div>

              {mastersItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className={`fa ${item.icon} w-5`}></i>
                  <span className="ml-2">{item.label}</span>
                  {item.protected && (
                    <i className="fa fa-lock text-xs ml-2 text-slate-400"></i>
                  )}
                </a>
              ))}

              <div className="border-t border-slate-200 my-2"></div>
              <div className="px-4">
                <Button
                  variant="primary"
                  icon="fa-phone"
                  onClick={handleCallClick}
                  fullWidth
                >
                  Зателефонувати
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
