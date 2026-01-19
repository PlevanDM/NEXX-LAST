import React from 'react';
import { SITE_CONFIG, getWhatsAppUrl, getTelegramUrl, getInstagramUrl, getDirectionsUrl } from '../../lib/site-config';
import BookingForm from '../shared/BookingForm';
import Card from '../shared/Card';

export const ContactSection: React.FC = () => {
  const handleBookingSuccess = () => {
    console.log('Booking successful!');
  };

  const handleBookingError = (error: string) => {
    console.error('Booking error:', error);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Зв'яжіться з нами
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Записатися на ремонт або задати питання - ми завжди на зв'язку
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left - Contact Info */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <Card variant="elevated">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fa fa-phone text-blue-600 text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">Телефон</h3>
                  <a
                    href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-lg"
                  >
                    {SITE_CONFIG.contact.phoneDisplay}
                  </a>
                  <p className="text-sm text-slate-600 mt-1">
                    Дзвоніть щодня з {SITE_CONFIG.hours.weekdays}
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="elevated">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fa fa-envelope text-green-600 text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                  <a
                    href={`mailto:${SITE_CONFIG.contact.email}`}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    {SITE_CONFIG.contact.email}
                  </a>
                  <p className="text-sm text-slate-600 mt-1">
                    Відповідаємо протягом години
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="elevated">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fa fa-location-dot text-purple-600 text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">Адреса</h3>
                  <p className="text-slate-700">
                    {SITE_CONFIG.contact.addressLine1}<br />
                    {SITE_CONFIG.contact.addressLine2}
                  </p>
                  <a
                    href={getDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm mt-2 inline-flex items-center gap-1"
                  >
                    Відкрити на карті
                    <i className="fa fa-arrow-up-right-from-square text-xs"></i>
                  </a>
                </div>
              </div>
            </Card>

            <Card variant="elevated">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fa fa-clock text-orange-600 text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">Графік роботи</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Понеділок - П'ятниця:</span>
                      <span className="text-slate-900 font-medium">{SITE_CONFIG.hours.weekdays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Субота:</span>
                      <span className="text-slate-900 font-medium">{SITE_CONFIG.hours.saturday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Неділя:</span>
                      <span className="text-red-600 font-medium">{SITE_CONFIG.hours.sunday}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Links */}
            <Card variant="elevated">
              <h3 className="font-semibold text-slate-900 mb-4">Ми в соцмережах</h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={getWhatsAppUrl('Хочу записатися на ремонт')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <i className="fab fa-whatsapp text-2xl text-green-600"></i>
                  <span className="font-medium text-slate-900">WhatsApp</span>
                </a>

                <a
                  href={getTelegramUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <i className="fab fa-telegram text-2xl text-blue-600"></i>
                  <span className="font-medium text-slate-900">Telegram</span>
                </a>

                <a
                  href={getInstagramUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
                >
                  <i className="fab fa-instagram text-2xl text-pink-600"></i>
                  <span className="font-medium text-slate-900">Instagram</span>
                </a>

                <a
                  href="#"
                  className="flex items-center gap-3 p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <i className="fab fa-facebook text-2xl text-indigo-600"></i>
                  <span className="font-medium text-slate-900">Facebook</span>
                </a>
              </div>
            </Card>
          </div>

          {/* Right - Booking Form */}
          <div>
            <BookingForm
              onSuccess={handleBookingSuccess}
              onError={handleBookingError}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
