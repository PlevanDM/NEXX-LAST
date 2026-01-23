// FAQ Page - NEXX v10.0
const { useState, useEffect } = React;

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const t = (key) => window.i18n?.t(key) || key;

  // Since FAQ data is complex, we'll use a local object but it will be better localized if we had it in i18n.js
  // For now, I'll provide Romanian defaults that match the production goal.
  const currentLang = window.i18n?.getCurrentLanguage()?.code || 'ro';

  const faqContent = {
    ro: [
      {
        category: 'Întrebări generale',
        icon: 'fa-question-circle',
        color: 'blue',
        questions: [
          { q: 'Cât timp durează reparația?', a: 'Timpul mediu de reparație este de 30-40 de minute pentru lucrări standard (înlocuire ecran, baterie, etc.). Reparațiile mai complexe pot dura până la 2-3 ore.' },
          { q: 'Oferiți garanție pentru reparații?', a: 'Da! Oferim o garanție oficială de 30 de zile pentru toate tipurile de lucrări și piese instalate.' },
          { q: 'Ce metode de plată acceptați?', a: 'Acceptăm numerar, carduri bancare (Visa, Mastercard) și transfer bancar pentru persoane juridice.' },
          { q: 'Ce fac dacă telefonul nu pornește?', a: 'Aduceți dispozitivul la centrul nostru de service. Vom efectua o diagnosticare gratuită pentru a determina cauza defecțiunii.' }
        ]
      },
      {
        category: 'Prețuri și servicii',
        icon: 'fa-dollar-sign',
        color: 'green',
        questions: [
          { q: 'Cât costă diagnosticul?', a: 'Diagnosticul este gratuit dacă alegeți să reparați dispozitivul la noi!' },
          { q: 'Pot afla prețul reparației în avans?', a: 'Da! Folosiți calculatorul nostru online de pe site sau sunați-ne pentru o estimare.' }
        ]
      }
    ],
    uk: [
      {
        category: 'Загальні питання',
        icon: 'fa-question-circle',
        color: 'blue',
        questions: [
          { q: 'Скільки часу займає ремонт?', a: 'Середній час ремонту становить 30-40 хвилин для стандартних робіт. Складні ремонти можуть зайняти до 2-3 годин.' },
          { q: 'Чи надаєте ви гарантію на ремонт?', a: 'Так! Ми надаємо офіційну гарантію 30 днів на всі види робіт та встановлені запчастини.' }
        ]
      }
    ]
  };

  const faqData = faqContent[currentLang] || faqContent['ro'];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const globalIndex = categoryIndex * 1000 + questionIndex;
    setOpenIndex(openIndex === globalIndex ? -1 : globalIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <i className="fas fa-question-circle"></i>
              <span>{t('faqPage.subtitle')}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('faqPage.title').split(' ')[0]} <span className="text-blue-600">{t('faqPage.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('faqPage.description')}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br from-${category.color}-500 to-${category.color}-600 rounded-xl flex items-center justify-center`}>
                  <i className={`fas ${category.icon} text-white text-xl`}></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
              </div>

              <div className="space-y-4">
                {category.questions.map((item, qIndex) => {
                  const globalIndex = categoryIndex * 1000 + qIndex;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div key={qIndex} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300">
                      <button
                        onClick={() => toggleQuestion(categoryIndex, qIndex)}
                        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 text-lg flex-1">{item.q}</span>
                        <i className={`fas fa-chevron-down text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                        <div className="px-6 pb-5 pt-2 text-gray-600 border-t border-gray-50">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 shadow-2xl text-center text-white">
            <h2 className="text-3xl font-bold mb-4">{t('faqPage.contactTitle')}</h2>
            <p className="text-xl text-blue-100 mb-8">{t('faqPage.contactDesc')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+40721234567" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg">{t('buttons.call')}</a>
              <a href="https://t.me/nexx_support" className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl shadow-lg">Telegram</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Render
const container = document.getElementById('app');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(FAQPage));
}
