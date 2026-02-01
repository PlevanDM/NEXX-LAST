import React from 'react';
import { cn } from '@/utils';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  logo?: React.ReactNode;
  siteName?: string;
  tagline?: string;
  columns?: FooterColumn[];
  socialLinks?: SocialLink[];
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  copyrightText?: string;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logo,
  siteName = 'NEXX',
  tagline = 'Професійний ремонт техніки',
  columns = [],
  socialLinks = [],
  contactInfo,
  copyrightText = `© ${new Date().getFullYear()} ${siteName}. Всі права захищені.`,
  className,
}) => {
  return (
    <footer className={cn('bg-slate-900 text-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {logo ? (
                logo
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white">
                  N
                </div>
              )}
              <span className="font-bold text-xl text-white">{siteName}</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">{tagline}</p>
            
            {/* Contact Info */}
            {contactInfo && (
              <div className="space-y-2 text-sm">
                {contactInfo.phone && (
                  <a 
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <span className="text-blue-400">📞</span>
                    {contactInfo.phone}
                  </a>
                )}
                {contactInfo.email && (
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <span className="text-blue-400">✉️</span>
                    {contactInfo.email}
                  </a>
                )}
                {contactInfo.address && (
                  <div className="flex items-start gap-2 text-slate-400">
                    <span className="text-blue-400">📍</span>
                    <span>{contactInfo.address}</span>
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link Columns */}
          {columns.map((column, index) => (
            <div key={index}>
              <h4 className="font-semibold text-white mb-4">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center sm:text-left">
            {copyrightText}
          </p>
          <div className="flex gap-6 text-sm">
            <a href="/privacy" className="text-slate-500 hover:text-white transition-colors">
              Конфіденційність
            </a>
            <a href="/terms" className="text-slate-500 hover:text-white transition-colors">
              Умови
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
