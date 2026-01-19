import React from 'react';
import { SITE_CONFIG, getWhatsAppUrl, getTelegramUrl, getInstagramUrl, getFacebookUrl } from '../../lib/site-config';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const aboutLinks = [
    { label: 'Про нас', href: '/about' },
    { label: 'Наша команда', href: '/about#team' },
    { label: 'Вакансії', href: '/about#careers' },
    { label: 'FAQ', href: '/faq' },
  ];

  const servicesLinks = [
    { label: 'Ремонт iPhone', href: '/#services' },
    { label: 'Ремонт MacBook', href: '/#services' },
    { label: 'Курси для дітей', href: '/#courses' },
    { label: 'Калькулятор цін', href: '/calculator' },
  ];

  const socialLinks = [
    { label: 'WhatsApp', icon: 'fa-whatsapp', href: getWhatsAppUrl(), color: 'text-green-500' },
    { label: 'Telegram', icon: 'fa-telegram', href: getTelegramUrl(), color: 'text-blue-500' },
    { label: 'Instagram', icon: 'fa-instagram', href: getInstagramUrl(), color: 'text-pink-500' },
    { label: 'Facebook', icon: 'fa-facebook', href: getFacebookUrl(), color: 'text-blue-600' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fa fa-mobile-screen text-white text-xl"></i>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{SITE_CONFIG.name}</div>
                <div className="text-xs text-slate-400">{SITE_CONFIG.tagline}</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Про нас</h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Послуги</h3>
            <ul className="space-y-2">
              {servicesLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакти</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <i className="fa fa-phone text-blue-400 mt-1"></i>
                <a
                  href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {SITE_CONFIG.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa fa-envelope text-blue-400 mt-1"></i>
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa fa-location-dot text-blue-400 mt-1"></i>
                <div className="text-slate-400">
                  {SITE_CONFIG.contact.addressLine1}<br />
                  {SITE_CONFIG.contact.addressLine2}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa fa-clock text-blue-400 mt-1"></i>
                <div className="text-slate-400">
                  <div>Пн-Пт: {SITE_CONFIG.hours.weekdays}</div>
                  <div>Сб: {SITE_CONFIG.hours.saturday}</div>
                  <div>Нд: {SITE_CONFIG.hours.sunday}</div>
                </div>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3 text-sm">Ми в соцмережах</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors ${social.color}`}
                    title={social.label}
                  >
                    <i className={`fab ${social.icon} text-lg`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <div>
              © {currentYear} {SITE_CONFIG.fullName}. Всі права захищені.
            </div>
            <div className="flex gap-6">
              <a href="/privacy" className="hover:text-white transition-colors">
                Політика конфіденційності
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Умови використання
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
