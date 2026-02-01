import React from 'react';
import { cn } from '@/utils';
import { Card } from './ui/Card';

interface Advantage {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}

interface WhyIsmashProps {
  title?: string;
  subtitle?: string;
  advantages?: Advantage[];
  className?: string;
}

// Default advantages based on NEXX service center values
const defaultAdvantages: Advantage[] = [
  {
    id: 'experience',
    icon: '🏆',
    title: 'Досвід з 2015 року',
    description: 'Більше 8 років професійного ремонту Apple техніки. Тисячі задоволених клієнтів.',
    highlight: true,
  },
  {
    id: 'warranty',
    icon: '✅',
    title: 'Гарантія 30 днів',
    description: 'На всі виконані роботи та встановлені запчастини надаємо офіційну гарантію.',
  },
  {
    id: 'parts',
    icon: '🔧',
    title: 'Оригінальні запчастини',
    description: 'Використовуємо тільки якісні запчастини: оригінал та перевірений OEM.',
  },
  {
    id: 'speed',
    icon: '⚡',
    title: 'Швидкий ремонт',
    description: 'Більшість ремонтів виконуємо за 30-60 хвилин в присутності клієнта.',
  },
  {
    id: 'diagnostic',
    icon: '🔍',
    title: 'Безкоштовна діагностика',
    description: 'Проводимо повну діагностику безкоштовно. Ви платите тільки за ремонт.',
  },
  {
    id: 'price',
    icon: '💰',
    title: 'Чесні ціни',
    description: 'Фіксована вартість без прихованих платежів. Ціна не зміниться під час ремонту.',
  },
];

export const WhyIsmash: React.FC<WhyIsmashProps> = ({
  title = 'Чому обирають NEXX?',
  subtitle = 'Ми пишаємося якістю наших послуг та довірою клієнтів',
  advantages = defaultAdvantages,
  className,
}) => {
  return (
    <section className={cn('py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage) => (
            <div
              key={advantage.id}
              className={cn(
                'relative p-6 rounded-2xl transition-all duration-300 group',
                advantage.highlight
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50'
                  : 'bg-slate-800/50 hover:bg-slate-700/50 text-white border border-slate-700'
              )}
            >
              {/* Highlight Badge */}
              {advantage.highlight && (
                <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-400 text-slate-900 text-xs font-bold rounded-full">
                  Наша перевага
                </div>
              )}

              {/* Icon */}
              <div className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4',
                advantage.highlight
                  ? 'bg-white/20'
                  : 'bg-slate-700/50 group-hover:bg-blue-600/30'
              )}>
                {advantage.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold mb-2">
                {advantage.title}
              </h3>
              <p className={cn(
                'text-sm leading-relaxed',
                advantage.highlight ? 'text-blue-100' : 'text-slate-400'
              )}>
                {advantage.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-sm">Apple Certified</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-sm">ISO 9001</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-sm">Офіційна гарантія</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-sm">Безпечна оплата</span>
          </div>
        </div>
      </div>
    </section>
  );
};
