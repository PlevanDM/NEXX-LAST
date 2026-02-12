import React, { useState, useEffect, useMemo } from 'react';

const Reviews: React.FC = () => {
  const [lang, setLang] = useState(window.i18n?.getCurrentLanguage?.()?.code || 'ro');
  
  const t = (key: string) => window.i18n?.t(key) || key;

  useEffect(() => {
    if (window.i18n?.subscribe) {
      return window.i18n.subscribe(() => {
        setLang(window.i18n?.getCurrentLanguage?.()?.code || 'ro');
      });
    }
  }, []);

  const reviews = useMemo(() => {
    const reviewsData: any = {
      ro: [
        { name: 'Alexandru M.', rating: 5, text: 'Serviciu excelent! Mi-au reparat iPhone-ul în mai puțin de o oră. Display nou OLED, calitate perfectă. Recomand!', device: 'iPhone 14 Pro', service: 'Înlocuire Display' },
        { name: 'Maria P.', rating: 5, text: 'Am adus MacBook-ul cu problemă la placă după contactul cu apa. L-au salvat! Funcționează ca nou. Echipă profesionistă.', device: 'MacBook Pro M1', service: 'Reparație Placă' },
        { name: 'Ion V.', rating: 5, text: 'Bateria Samsung-ului meu se descărca în 2 ore. Acum ține toată ziua! Preț corect și garanție 12 luni. Mulțumesc!', device: 'Samsung S23', service: 'Înlocuire Baterie' },
        { name: 'Elena D.', rating: 5, text: 'Portul de încărcare nu funcționa deloc. Reparat în 30 de minute! Foarte rapid și profesionist.', device: 'iPhone 13', service: 'Port Încărcare' },
        { name: 'Andrei C.', rating: 5, text: 'Camera iPhone-ului avea probleme de focus. Au schimbat modulul și acum face poze perfecte. Super!', device: 'iPhone 15', service: 'Cameră' },
        { name: 'Diana S.', rating: 5, text: 'Cel mai bun service din București! Personal amabil, prețuri corecte, muncă de calitate. Voi reveni!', device: 'iPad Pro', service: 'Display + Baterie' }
      ],
      en: [
        { name: 'Alexandru M.', rating: 5, text: 'Excellent service! They repaired my iPhone in less than an hour. New OLED display, perfect quality. Highly recommend!', device: 'iPhone 14 Pro', service: 'Display Replacement' },
        { name: 'Maria P.', rating: 5, text: 'Brought my MacBook with water damage issue. They saved it! Works like new. Professional team.', device: 'MacBook Pro M1', service: 'Board Repair' },
        { name: 'Ion V.', rating: 5, text: 'My Samsung battery was dying in 2 hours. Now it lasts all day! Fair price and 12-month warranty. Thanks!', device: 'Samsung S23', service: 'Battery Replacement' },
        { name: 'Elena D.', rating: 5, text: 'Charging port was completely dead. Fixed in 30 minutes! Very fast and professional.', device: 'iPhone 13', service: 'Charging Port' },
        { name: 'Andrei C.', rating: 5, text: 'iPhone camera had focus issues. They replaced the module and now it takes perfect photos. Amazing!', device: 'iPhone 15', service: 'Camera' },
        { name: 'Diana S.', rating: 5, text: 'Best service in Bucharest! Friendly staff, fair prices, quality work. Will return!', device: 'iPad Pro', service: 'Display + Battery' }
      ],
      ru: [
        { name: 'Александр М.', rating: 5, text: 'Отличный сервис! Отремонтировали iPhone меньше чем за час. Новый OLED дисплей, идеальное качество. Рекомендую!', device: 'iPhone 14 Pro', service: 'Замена дисплея' },
        { name: 'Мария П.', rating: 5, text: 'Принесла MacBook с повреждением от воды. Спасли! Работает как новый. Профессиональная команда.', device: 'MacBook Pro M1', service: 'Ремонт платы' },
        { name: 'Иван В.', rating: 5, text: 'Батарея Samsung садилась за 2 часа. Теперь держит весь день! Честная цена и гарантия 12 месяцев. Спасибо!', device: 'Samsung S23', service: 'Замена батареи' },
        { name: 'Елена Д.', rating: 5, text: 'Порт зарядки вообще не работал. Починили за 30 минут! Очень быстро и профессионально.', device: 'iPhone 13', service: 'Порт зарядки' },
        { name: 'Андрей С.', rating: 5, text: 'Камера iPhone не фокусировалась. Заменили модуль - теперь фото идеальные. Супер!', device: 'iPhone 15', service: 'Камера' },
        { name: 'Диана С.', rating: 5, text: 'Лучший сервис в Бухаресте! Приветливый персонал, честные цены, качественная работа. Вернусь!', device: 'iPad Pro', service: 'Дисплей + Батарея' }
      ],
      uk: [
        { name: 'Олександр М.', rating: 5, text: 'Чудовий сервіс! Відремонтували iPhone менше ніж за годину. Новий OLED дисплей, ідеальна якість. Рекомендую!', device: 'iPhone 14 Pro', service: 'Заміна дисплея' },
        { name: 'Марія П.', rating: 5, text: 'Принесла MacBook з пошкодженням від води. Врятували! Працює як новий. Професійна команда.', device: 'MacBook Pro M1', service: 'Ремонт плати' },
        { name: 'Іван В.', rating: 5, text: 'Батарея Samsung сідала за 2 години. Тепер тримає весь день! Чесна ціна і гарантія 12 місяців. Дякую!', device: 'Samsung S23', service: 'Заміна батареї' },
        { name: 'Олена Д.', rating: 5, text: 'Порт зарядки взагалі не працював. Полагодили за 30 хвилин! Дуже швидко і професійно.', device: 'iPhone 13', service: 'Порт зарядки' },
        { name: 'Андрій С.', rating: 5, text: 'Камера iPhone не фокусувалась. Замінили модуль - тепер фото ідеальні. Супер!', device: 'iPhone 15', service: 'Камера' },
        { name: 'Діана С.', rating: 5, text: 'Найкращий сервіс у Бухаресті! Привітний персонал, чесні ціни, якісна робота. Повернусь!', device: 'iPad Pro', service: 'Дісплей + Батарея' }
      ]
    };
    return reviewsData[lang] || reviewsData.ro;
  }, [lang]);

  return (
    <section id="reviews" className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-white">{t('reviews.title')}</h2>
          <p className="text-gray-400 text-sm sm:text-lg">{t('reviews.subtitle')}</p>
          {/* Rating summary */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            <div className="flex text-yellow-400 text-lg sm:text-2xl">
              {Array(5).fill(0).map((_, i) => <span key={i}>★</span>)}
            </div>
            <span className="text-white font-bold text-lg sm:text-2xl ml-1 sm:ml-2">5.0</span>
            <span className="text-gray-400 text-sm sm:text-lg">({reviews.length} {t('reviews.count')})</span>
          </div>
        </div>
        
        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {reviews.map((review: any, idx: number) => (
            <div
              key={idx}
              className="group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Quote icon */}
              <div className="absolute top-3 right-4 sm:top-4 sm:right-8 text-4xl sm:text-6xl text-blue-500/10 font-serif rotate-12">"</div>
              
              {/* Stars */}
              <div className="flex mb-4 text-yellow-400">
                {Array(review.rating).fill(0).map((_, i) => <span key={i}>★</span>)}
              </div>
              
              {/* Review text */}
              <p className="text-gray-300 mb-6 leading-relaxed italic">"{review.text}"</p>
              
              {/* Device & Service tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">{review.device}</span>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-semibold rounded-full border border-purple-500/20">{review.service}</span>
              </div>
              
              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-700/50 mt-auto">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg"> 
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-bold">{review.name}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1.5">
                    <i className="fas fa-check-circle text-blue-500"></i>
                    {t('reviews.verified')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
