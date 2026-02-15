import React, { useState, useEffect } from 'react';

const Contact: React.FC = () => {
  const [lang, setLang] = useState(window.i18n?.getCurrentLanguage?.()?.code || 'ro');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  const t = (key: string) => window.i18n?.t(key) || key;

  useEffect(() => {
    if (window.i18n?.subscribe) {
      return window.i18n.subscribe(() => {
        setLang(window.i18n?.getCurrentLanguage?.()?.code || 'ro');
      });
    }
  }, []);

  const texts: any = {
    ro: {
      title: 'Contactați-ne',
      subtitle: 'Program: Luni-Vineri 10:00-19:00, Sâmbătă 10:00-16:00',
      callbackTitle: 'Vă sunăm în 30 de secunde!',
      callbackDesc: 'Lăsați numărul și vă contactăm imediat',
      phonePlaceholder: 'Telefonul dvs: 07XX XXX XXX',
      sendBtn: 'Sunați-mă acum!',
      sending: 'Se trimite...',
      sent: '✓ Vă sunăm imediat!',
      telegram: 'Telegram',
      email: 'Email',
      instagram: 'Instagram',
      directions: 'Cum ajungeți',
      address: 'Calea Șerban Vodă 47, Sector 4',
      phoneError: 'Introduceți un număr valid',
      errorGeneric: 'Eroare. Încercați din nou.',
      cabinetHint: 'Urmăriți comenzile în',
      cabinetLink: 'contul personal',
      sendAnother: 'Trimite alt număr',
    },
    en: {
      title: 'Contact Us',
      subtitle: 'Hours: Mon-Fri 10:00-19:00, Sat 10:00-16:00',
      callbackTitle: 'We call you in 30 seconds!',
      callbackDesc: 'Leave your number and we contact you immediately',
      phonePlaceholder: 'Your phone: 07XX XXX XXX',
      sendBtn: 'Call me now!',
      sending: 'Sending...',
      sent: '✓ Calling you now!',
      telegram: 'Telegram',
      email: 'Email',
      instagram: 'Instagram',
      directions: 'Directions',
      address: 'Calea Șerban Vodă 47, Sector 4',
      phoneError: 'Please enter a valid number',
      errorGeneric: 'Error. Please try again.',
      cabinetHint: 'Track your orders in',
      cabinetLink: 'your account',
      sendAnother: 'Send another number',
    },
    ru: {
      title: 'Свяжитесь с нами',
      subtitle: 'Часы работы: Пн-Пт 10:00-19:00, Сб 10:00-16:00',
      callbackTitle: 'Перезвоним за 30 секунд!',
      callbackDesc: 'Оставьте номер - мы сразу свяжемся',
      phonePlaceholder: 'Ваш телефон: 07XX XXX XXX',
      sendBtn: 'Позвоните мне!',
      sending: 'Отправка...',
      sent: '✓ Уже звоним!',
      telegram: 'Telegram',
      email: 'Эл. почта',
      instagram: 'Instagram',
      directions: 'Как добраться',
      address: 'Calea Șerban Vodă 47, Sector 4',
      phoneError: 'Введите корректный номер',
      errorGeneric: 'Ошибка. Попробуйте снова.',
      cabinetHint: 'Отслеживайте заказы в',
      cabinetLink: 'личном кабинете',
      sendAnother: 'Отправить другой номер',
    },
    uk: {
      title: 'Зв\'яжіться з нами',
      subtitle: 'Графік: Пн-Пт 10:00-19:00, Сб 10:00-16:00',
      callbackTitle: 'Передзвонимо за 30 секунд!',
      callbackDesc: 'Залиште номер - ми одразу зв\'яжемось',
      phonePlaceholder: 'Ваш телефон: 07XX XXX XXX',
      sendBtn: 'Зателефонуйте мені!',
      sending: 'Надсилання...',
      sent: '✓ Вже дзвонимо!',
      telegram: 'Telegram',
      email: 'Email',
      instagram: 'Instagram',
      directions: 'Як дістатися',
      address: 'Calea Șerban Vodă 47, Sector 4',
      phoneError: 'Введіть коректний номер',
      errorGeneric: 'Помилка. Спробуйте знову.',
      cabinetHint: 'Відстежуйте замовлення в',
      cabinetLink: 'особистому кабінеті',
      sendAnother: 'Надіслати інший номер',
    }
  };
  const txt = texts[lang] || texts.ro;

  const handleCallback = async () => {
    if (!phone || phone.replace(/\D/g, '').length < 9) {
      if ((window as any).showToast) (window as any).showToast(txt.phoneError, 'error');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name: 'Quick Callback', source: 'contact_section' })
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (data.success) {
        setSent(true);
        if ((window as any).showToast) (window as any).showToast(txt.sent, 'success');
      } else {
        const msg = data.code === 'SUBSCRIPTION_EXPIRED'
          ? 'Serviciu temporar indisponibil. Sunați-ne direct!'
          : (data.error || txt.errorGeneric);
        if ((window as any).showToast) (window as any).showToast(msg, 'error');
      }
    } catch (e) {
      if ((window as any).showToast) (window as any).showToast(txt.errorGeneric, 'error');
    }
    setSending(false);
  };

  return (
    <section id="contacts" className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">{txt.title}</h2>
          <p className="text-gray-400 text-sm sm:text-lg">{txt.subtitle}</p>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left: Quick Callback Form */}
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full -ml-16 -mb-16 blur-3xl"></div>
            
            <div className="text-center mb-6 sm:mb-10 relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-phone-alt text-white text-2xl sm:text-3xl animate-pulse"></i>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">{txt.callbackTitle}</h3>
              <p className="text-gray-300">{txt.callbackDesc}</p>
            </div>

            {!sent ? (
              <div className="space-y-4 relative z-10">
                <div className="relative">
                  <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={txt.phonePlaceholder}
                    className="w-full pl-12 pr-5 py-5 bg-gray-800/80 border-2 border-gray-700 focus:border-green-500 rounded-2xl text-white text-lg placeholder-gray-500 outline-none transition-all"
                  />
                </div>
                <button
                  onClick={handleCallback}
                  disabled={sending}
                  className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {sending ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-phone-alt"></i>}
                  {sending ? txt.sending : txt.sendBtn}
                </button>
              </div>
            ) : (
              <div className="text-center py-10 relative z-10 animate-fade-in">
                <div className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                  <i className="fas fa-check text-white text-4xl"></i>
                </div>
                <p className="text-green-400 text-2xl font-bold">{txt.sent}</p>
                <p className="text-gray-500 text-sm mt-4">
                  {txt.cabinetHint}{' '}
                  <a href="/cabinet" className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2">{txt.cabinetLink}</a>.
                </p>
                <button onClick={() => setSent(false)} className="mt-4 text-gray-400 hover:text-white transition-colors underline underline-offset-4">{txt.sendAnother}</button>
              </div>
            )}
          </div>
          
          {/* Right: Contact Info */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Telegram */}
            <a 
              href="https://t.me/nexx_support" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-800/40 border border-gray-700 hover:border-blue-500/50 rounded-2xl sm:rounded-3xl transition-all hover:bg-gray-800 group shadow-lg"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                <i className="fab fa-telegram text-white text-2xl sm:text-3xl"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base sm:text-xl mb-0.5 sm:mb-1">{txt.telegram}</p>
                <p className="text-gray-400 text-sm sm:text-base font-medium truncate">@nexx_support</p>
              </div>
              <i className="fas fa-arrow-right text-gray-600 group-hover:text-blue-400 group-hover:translate-x-2 transition-all flex-shrink-0"></i>
            </a>
            
            {/* Email */}
            <a 
              href="mailto:info@nexxgsm.ro"
              className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-800/40 border border-gray-700 hover:border-purple-500/50 rounded-2xl sm:rounded-3xl transition-all hover:bg-gray-800 group shadow-lg"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                <i className="fas fa-envelope text-white text-2xl sm:text-3xl"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base sm:text-xl mb-0.5 sm:mb-1">{txt.email}</p>
                <p className="text-gray-400 text-sm sm:text-base font-medium truncate">info@nexxgsm.ro</p>
              </div>
              <i className="fas fa-arrow-right text-gray-600 group-hover:text-purple-400 group-hover:translate-x-2 transition-all flex-shrink-0"></i>
            </a>
            
            {/* Address/Directions */}
            <a 
              href="/directions"
              className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-800/40 border border-gray-700 hover:border-green-500/50 rounded-2xl sm:rounded-3xl transition-all hover:bg-gray-800 group shadow-lg"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                <i className="fas fa-map-marker-alt text-white text-2xl sm:text-3xl"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base sm:text-xl mb-0.5 sm:mb-1">{txt.directions}</p>
                <p className="text-gray-400 text-sm sm:text-base font-medium leading-tight truncate">{txt.address}</p>
              </div>
              <i className="fas fa-arrow-right text-gray-600 group-hover:text-green-400 group-hover:translate-x-2 transition-all flex-shrink-0"></i>
            </a>
            
            {/* Instagram */}
            <a 
              href="https://instagram.com/nexx_gsm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-800/40 border border-gray-700 hover:border-pink-500/50 rounded-2xl sm:rounded-3xl transition-all hover:bg-gray-800 group shadow-lg"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                <i className="fab fa-instagram text-white text-2xl sm:text-3xl"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base sm:text-xl mb-0.5 sm:mb-1">{txt.instagram}</p>
                <p className="text-gray-400 text-sm sm:text-base font-medium truncate">@nexx_gsm</p>
              </div>
              <i className="fas fa-arrow-right text-gray-600 group-hover:text-pink-400 group-hover:translate-x-2 transition-all flex-shrink-0"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
