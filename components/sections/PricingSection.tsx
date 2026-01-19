import React from 'react';
import { SITE_CONFIG } from '../../lib/site-config';
import Card from '../shared/Card';
import Badge from '../shared/Badge';
import Button from '../shared/Button';

export const PricingSection: React.FC = () => {
  const { basic, manager } = SITE_CONFIG.pricing;

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Тарифні плани
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Виберіть план, який підходить саме вам
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <Card variant="elevated" className="relative">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {basic.name}
              </h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-slate-900">
                  {basic.price}
                </span>
                <span className="text-2xl text-slate-600">{basic.currency}</span>
              </div>
              <p className="text-slate-600 mt-2">Для разових звернень</p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {basic.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <i className="fa fa-check-circle text-green-500 mt-1"></i>
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={scrollToContact}
            >
              Записатися
            </Button>
          </Card>

          {/* Manager Plan */}
          <Card variant="elevated" className="relative border-2 border-blue-600 shadow-2xl">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge variant="info" size="lg">
                <i className="fa fa-star mr-1"></i>
                Популярний
              </Badge>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {manager.name}
              </h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {manager.price}
                </span>
                <span className="text-2xl text-slate-600">
                  {manager.currency}/{manager.period}
                </span>
              </div>

              {/* Discount Info */}
              {manager.discount && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="text-slate-400 line-through">
                    {manager.discount.from} {manager.currency}
                  </span>
                  <Badge variant="warning" size="sm">
                    Економія {manager.discount.save}
                  </Badge>
                </div>
              )}
              <p className="text-slate-600 mt-2">Для постійних клієнтів</p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {manager.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <i className="fa fa-check-circle text-blue-600 mt-1"></i>
                  <span className="text-slate-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Fast-Track Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <i className="fa fa-bolt text-blue-600 text-xl mt-1"></i>
                <div>
                  <div className="font-semibold text-blue-900 mb-1">
                    Fast-Track сервіс
                  </div>
                  <p className="text-sm text-blue-700">
                    Ваш персональний менеджер бере весь процес на себе. 
                    Статуси в Telegram, без черг, пріоритетне обслуговування.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={scrollToContact}
              icon="fa-crown"
            >
              Підключити план
            </Button>
          </Card>
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-slate-600">
            Всі ціни вказані в гривнях (₴). Оплата можлива готівкою або карткою.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
