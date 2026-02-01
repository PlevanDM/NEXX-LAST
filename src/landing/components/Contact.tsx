import React, { useState, useEffect } from 'react';

const Contact: React.FC = () => {
  const [lang, setLang] = useState(window.i18n?.getCurrentLanguage()?.code || 'ro');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  const t = (key: string) => window.i18n?.t(key) || key;

  useEffect(() => {
    if (window.i18n?.subscribe) {
      return window.i18n.subscribe(() => {
        setLang(window.i18n.getCurrentLanguage()?.code || 'ro');
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
      errorGeneric: 'Eroare. Încercați din nou.'
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
      errorGeneric: 'Error. Please try again.'
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
      errorGeneric: 'Ошибка. Попробуйте снова.'
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
      errorGeneric: 'Помилка. Спробуйте знову.'
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
      await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name: 'Quick Callback', source: 'contact_section' })
      });
      setSent(true);
      if ((window as any).showToast) (window as any).showToast(txt.sent, 'success');
    } catch (e) {
      if ((window as any).showToast) (window as any).showToast(txt.errorGeneric, 'error');
    }
    setSending(false);
  };

  return (
    <section id="contacts" className="section-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">
      <div className="content-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{txt.title}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{txt.subtitle}</p>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Quick Callback Form */}
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full -ml-16 -mb-16 blur-3xl"></div>
            
            <div className="text-center mb-10 relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-phone-alt text-white text-3xl animate-pulse"></i>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{txt.callbackTitle}</h3>
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
                <button onClick={() => setSent(false)} className="mt-6 text-gray-400 hover:text-white transition-colors underline underline-offset-4">Trimite alt număr</button>
              </div>
            )}
          </div>
          
          {/* Right: Contact Info */}
          <div className="flex flex-col gap-4">
            {/* Telegram */}
            <a 
              href="https://t.me/nexx_support" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-6 p-6 bg-gray-800/40 border border-gray-700 hover:border-blue-500/50 rounded-3xl transition-all hover:bg-gray-800 group shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <i className="fab fa-telegram text-white text-3xl"></i>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-xl mb-1">{txt.telegram}</p>
                <p className="text-gray-400 font-medium">@nexx_support</p>
              </div>
              <i className="fas fa-arrow-right text-gray-600 ml-auto group-hover:text-blue-400 group-hover:translate-x-2 transition-all"></i>
            </a>
            
            {/* Email */}
            <a 
              href="mailto:info@nexxgsm.ro"
              className="flex items-center gap-6 p-6 bg-gray-800/40 border border-gray-700 hover:border-purple-500/50 rounded-3xl transition-all hover:bg-gray-800 group shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <i className="fas fa-envelope text-white text-3xl"></i>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-xl mb-1">{txt.email}</p>
                <p className="text-gray-400 font-medium">info@nexxgsm.ro</p>
              </div>
              <i className="fas fa-arrow-right text-gray-600 ml-auto group-hover:text-purple-400 group-hover:translate-x-2 transition-all"></i>
            </a>
            
            {/* Address/Directions */}
            <a 
              href="/directions"
              className="flex items-center gap-6 p-6 bg-gray-800/40 border border-gray-700 hover:border-green-500/50 rounded-3xl transition-all hover:bg-gray-800 group shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <i className="fas fa-map-marker-alt text-white text-3xl"></i>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-xl mb-1">{txt.directions}</p>
                <p className="text-gray-400 font-medium leading-tight">{txt.address}</p>
              </div>
              <i className="fas fa-arrow-right text-gray-600 ml-auto group-hover:text-green-400 group-hover:translate-x-2 transition-all"></i>
            </a>
            
            {/* Instagram */}
            <a 
              href="https://instagram.com/nexx_gsm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-6 p-6 bg-gray-800/40 border border-gray-700 hover:border-pink-500/50 rounded-3xl transition-all hover:bg-gray-800 group shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <i className="fab fa-instagram text-white text-3xl"></i>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-xl mb-1">{txt.instagram}</p>
                <p className="text-gray-400 font-medium">@nexx_gsm</p>
              </div>
              <i className="fas fa-arrow-right text-gray-600 ml-auto group-hover:text-pink-400 group-hover:translate-x-2 transition-all"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
