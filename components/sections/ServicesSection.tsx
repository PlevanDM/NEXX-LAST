import React from 'react';
import { SITE_CONFIG } from '../../lib/site-config';
import Card from '../shared/Card';

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Наші послуги
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Повний спектр послуг з ремонту та обслуговування Apple техніки
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SITE_CONFIG.services.map((service) => (
            <Card
              key={service.id}
              variant="outlined"
              hover
              className="group cursor-pointer"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <i className={`fa ${service.icon} text-2xl text-white`}></i>
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {service.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {service.description}
              </p>

              {/* Arrow Icon */}
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Детальніше
                <i className="fa fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Не знайшли потрібну послугу?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg"
          >
            Зв'яжіться з нами
            <i className="fa fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
