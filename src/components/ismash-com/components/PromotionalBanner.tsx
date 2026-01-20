import React from 'react';
import { cn } from '@/utils';
import { Button } from './ui/Button';

interface PromotionalBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  backgroundImage?: string;
  backgroundColor?: string;
  variant?: 'default' | 'gradient' | 'image';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  title,
  subtitle,
  description,
  ctaText = 'Дізнатися більше',
  ctaLink,
  onCtaClick,
  backgroundImage,
  backgroundColor,
  variant = 'gradient',
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'py-8 sm:py-10',
    md: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-24',
  };

  const backgrounds = {
    default: 'bg-blue-600',
    gradient: 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700',
    image: '',
  };

  const handleClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (ctaLink) {
      window.location.href = ctaLink;
    }
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        sizes[size],
        variant !== 'image' && backgrounds[variant],
        backgroundColor,
        className
      )}
      style={variant === 'image' && backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      {/* Overlay for image variant */}
      {variant === 'image' && (
        <div className="absolute inset-0 bg-slate-900/70" />
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Content */}
          <div className="text-center md:text-left max-w-2xl">
            {subtitle && (
              <span className="inline-block px-4 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-4">
                {subtitle}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              {title}
            </h2>
            {description && (
              <p className="text-blue-100 text-lg max-w-xl">
                {description}
              </p>
            )}
          </div>

          {/* CTA */}
          {ctaText && (
            <div className="flex-shrink-0">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleClick}
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl"
              >
                {ctaText}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Special discount banner variant
interface DiscountBannerProps {
  discount: string;
  title: string;
  description?: string;
  validUntil?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const DiscountBanner: React.FC<DiscountBannerProps> = ({
  discount,
  title,
  description,
  validUntil,
  ctaText = 'Отримати знижку',
  onCtaClick,
  className,
}) => {
  return (
    <section className={cn(
      'py-10 sm:py-12 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Discount Badge */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-2xl sm:text-3xl font-black text-orange-600">{discount}</span>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
              {description && (
                <p className="text-orange-100 text-sm sm:text-base">{description}</p>
              )}
              {validUntil && (
                <p className="text-white/80 text-xs mt-1">
                  Діє до: <span className="font-semibold">{validUntil}</span>
                </p>
              )}
            </div>
          </div>

          {/* CTA */}
          <Button
            variant="secondary"
            size="lg"
            onClick={onCtaClick}
            className="bg-white text-orange-600 hover:bg-orange-50 shadow-xl"
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
};
