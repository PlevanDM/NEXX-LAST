import React from 'react';
import { cn } from '@/utils';
import { Card } from './ui/Card';

interface ServiceOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  price?: string;
  duration?: string;
  popular?: boolean;
  href?: string;
}

interface ServiceOptionsProps {
  title?: string;
  subtitle?: string;
  services: ServiceOption[];
  columns?: 2 | 3 | 4;
  className?: string;
  onServiceClick?: (service: ServiceOption) => void;
}

export const ServiceOptions: React.FC<ServiceOptionsProps> = ({
  title = 'Наші послуги',
  subtitle = 'Обирайте професійний ремонт з гарантією',
  services,
  columns = 3,
  className,
  onServiceClick,
}) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className={cn('py-12 sm:py-16 lg:py-20 bg-slate-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Services Grid */}
        <div className={cn('grid grid-cols-1 gap-6', gridCols[columns])}>
          {services.map((service) => (
            <Card
              key={service.id}
              hover
              variant="elevated"
              className="relative"
              onClick={() => onServiceClick?.(service)}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                  Популярно
                </div>
              )}

              <div className="flex flex-col items-center text-center p-2">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {service.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-center gap-4 w-full border-t border-slate-100 pt-4">
                  {service.price && (
                    <div className="text-center">
                      <span className="text-xs text-slate-500 block">Від</span>
                      <span className="font-bold text-blue-600">{service.price}</span>
                    </div>
                  )}
                  {service.duration && (
                    <div className="text-center">
                      <span className="text-xs text-slate-500 block">Час</span>
                      <span className="font-bold text-slate-700">{service.duration}</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-4 w-full">
                  <span className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    Детальніше
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
