import React from 'react';
import { cn } from '@/utils';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface BusinessService {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features?: string[];
}

interface BusinessServicesProps {
  title?: string;
  subtitle?: string;
  services?: BusinessService[];
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

// Default business services
const defaultBusinessServices: BusinessService[] = [
  {
    id: 'corporate',
    icon: '🏢',
    title: 'Корпоративне обслуговування',
    description: 'Комплексне обслуговування техніки для компаній будь-якого розміру.',
    features: [
      'Пріоритетний ремонт',
      'Персональний менеджер',
      'Знижки від 15%',
      'Виїзд на місце',
    ],
  },
  {
    id: 'b2b',
    icon: '🤝',
    title: 'B2B партнерство',
    description: 'Співпраця з іншими сервісними центрами та магазинами.',
    features: [
      'Оптові ціни',
      'Швидке виконання',
      'Технічна підтримка',
      'Навчання персоналу',
    ],
  },
  {
    id: 'education',
    icon: '🎓',
    title: 'Для навчальних закладів',
    description: 'Спеціальні умови для шкіл, університетів та курсів.',
    features: [
      'Знижка 20%',
      'Масовий ремонт',
      'Гнучкий графік',
      'Звітність',
    ],
  },
];

export const BusinessServices: React.FC<BusinessServicesProps> = ({
  title = 'Для бізнесу',
  subtitle = 'Спеціальні умови для корпоративних клієнтів та партнерів',
  services = defaultBusinessServices,
  ctaText = "Зв'язатися з нами",
  onCtaClick,
  className,
}) => {
  return (
    <section className={cn('py-12 sm:py-16 lg:py-20 bg-slate-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            B2B
          </span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {services.map((service) => (
            <Card
              key={service.id}
              variant="elevated"
              className="text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {service.description}
              </p>

              {/* Features */}
              {service.features && (
                <ul className="text-left space-y-2 mt-4 pt-4 border-t border-slate-100">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Потрібна індивідуальна пропозиція?
          </h3>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            Зв'яжіться з нами для отримання персональної комерційної пропозиції для вашої компанії.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              📞 +380 00 000 0000
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
