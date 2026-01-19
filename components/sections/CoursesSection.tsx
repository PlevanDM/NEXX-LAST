import React from 'react';
import Card from '../shared/Card';
import Badge from '../shared/Badge';

export const CoursesSection: React.FC = () => {
  return (
    <section id="courses" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="purple" size="lg" className="mb-4">
            <i className="fa fa-clock mr-2"></i>
            Скоро
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Дитячі курси
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Готуємо захоплюючі курси для дітей з Apple технологіями
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card variant="elevated" className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 relative">
                <img
                  src="/images/kids-training-1.png"
                  alt="Kids Training"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <i className="fa fa-graduation-cap text-6xl text-purple-600 mb-4"></i>
                    <div className="text-2xl font-bold text-purple-900">
                      Незабаром!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Info */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Що буде на курсах?
              </h3>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fa fa-palette text-purple-600"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Малювання на iPad</div>
                    <p className="text-sm text-slate-600">Творчість з Procreate, вік 6-10 років</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fa fa-camera text-blue-600"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Мобільна фотографія</div>
                    <p className="text-sm text-slate-600">Секрети крутих знімків, вік 10-14 років</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fa fa-code text-green-600"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Перше програмування</div>
                    <p className="text-sm text-slate-600">Swift Playgrounds, вік 8-12 років</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fa fa-video text-orange-600"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Створення відео</div>
                    <p className="text-sm text-slate-600">iMovie та Final Cut, вік 10-15 років</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fa fa-brain text-pink-600"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Вступ до AI & ML</div>
                    <p className="text-sm text-slate-600">Штучний інтелект для дітей, вік 12-16 років</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fa fa-gamepad text-indigo-600"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Дизайн ігор</div>
                    <p className="text-sm text-slate-600">Створюй свої ігри, вік 10-14 років</p>
                  </div>
                </li>
              </ul>

              {/* Notify Button */}
              <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-start gap-3">
                  <i className="fa fa-bell text-purple-600 text-xl mt-1"></i>
                  <div className="flex-1">
                    <div className="font-semibold text-purple-900 mb-1">
                      Отримайте сповіщення про запуск
                    </div>
                    <p className="text-sm text-purple-700 mb-3">
                      Залиште контакти і ми повідомимо про початок набору
                    </p>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm"
                    >
                      Записатися в список очікування
                      <i className="fa fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom Info */}
        <div className="mt-12 text-center">
          <p className="text-slate-600">
            Курси будуть доступні вже найближчим часом. Слідкуйте за оновленнями!
          </p>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
