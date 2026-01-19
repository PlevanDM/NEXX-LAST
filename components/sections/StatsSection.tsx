import React from 'react';
import Card from '../shared/Card';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      id: 'repair-time',
      icon: 'fa-clock',
      value: '30-40 хв',
      label: 'Середній час ремонту',
      description: 'Більшість ремонтів виконуємо за годину',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'warranty',
      icon: 'fa-shield-halved',
      value: '30 днів',
      label: 'Гарантія на послуги',
      description: 'Повна гарантія на всі види робіт',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'documentation',
      icon: 'fa-camera',
      value: '100%',
      label: 'Фіксація стану',
      description: 'Фото/відео до та після ремонту',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'experience',
      icon: 'fa-award',
      value: '5+ років',
      label: 'Досвід роботи',
      description: '10+ сертифікованих майстрів',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Чому обирають нас
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Професійний підхід до кожного клієнта та прозорість на всіх етапах ремонту
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <Card
              key={stat.id}
              variant="elevated"
              hover
              className="text-center group"
            >
              {/* Icon */}
              <div className={`w-20 h-20 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`fa ${stat.icon} text-4xl ${stat.color}`}></i>
              </div>

              {/* Value */}
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-lg font-semibold text-slate-900 mb-2">
                {stat.label}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600">
                {stat.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
