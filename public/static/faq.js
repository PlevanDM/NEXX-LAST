// FAQ Page - NEXX v9.0
const { useState } = React;

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqData = [
    {
      category: 'Загальні питання',
      icon: 'fa-question-circle',
      color: 'blue',
      questions: [
        {
          q: 'Скільки часу займає ремонт?',
          a: 'Середній час ремонту становить 30-40 хвилин для стандартних робіт (заміна екрану, батареї тощо). Складні ремонти можуть зайняти до 2-3 годин. Точний час ми повідомляємо після діагностики.'
        },
        {
          q: 'Чи надаєте ви гарантію на ремонт?',
          a: 'Так! Ми надаємо офіційну гарантію 30 днів на всі види робіт та встановлені запчастини. Гарантія покриває дефекти роботи та якості компонентів.'
        },
        {
          q: 'Які способи оплати ви приймаєте?',
          a: 'Ми приймаємо готівку, банківські картки (Visa, Mastercard), безготівковий розрахунок для юридичних осіб. Оплата здійснюється після завершення ремонту.'
        },
        {
          q: 'Що робити, якщо телефон не вмикається?',
          a: 'Принесіть пристрій до нашого сервісного центру. Ми проведемо безкоштовну діагностику та визначимо причину поломки. У 70% випадків проблема вирішується заміною батареї або роз\'єму заряджання.'
        }
      ]
    },
    {
      category: 'Ціни та послуги',
      icon: 'fa-dollar-sign',
      color: 'green',
      questions: [
        {
          q: 'Скільки коштує діагностика?',
          a: 'Діагностика безкоштовна! Ми перевіримо ваш пристрій, визначимо несправність та озвучимо вартість ремонту. Якщо ви погоджуєтесь на ремонт — діагностика безкоштовна. Якщо відмовляєтесь — 100 грн.'
        },
        {
          q: 'Чи можна дізнатися вартість ремонту заздалегідь?',
          a: 'Так! Скористайтеся нашим калькулятором на сайті або зателефонуйте нам. Ми озвучимо орієнтовну вартість. Точну ціну ми повідомимо після діагностики пристрою.'
        },
        {
          q: 'Чи є знижки для постійних клієнтів?',
          a: 'Так! Для постійних клієнтів діє накопичувальна система знижок до 15%. Також ми проводимо акції та спеціальні пропозиції — стежте за нашими соціальними мережами.'
        },
        {
          q: 'Що входить у вартість ремонту?',
          a: 'У вартість входить: робота майстра, встановлені запчастини, діагностика, тестування після ремонту, 30 днів гарантії. Ніяких прихованих платежів!'
        }
      ]
    },
    {
      category: 'Запчастини та якість',
      icon: 'fa-cog',
      color: 'purple',
      questions: [
        {
          q: 'Які запчастини ви використовуєте?',
          a: 'Ми використовуємо оригінальні запчастини Apple (коли це можливо) та сертифіковані аналоги преміум-якості. Завжди узгоджуємо з клієнтом тип запчастин перед ремонтом.'
        },
        {
          q: 'Чи можна принести свої запчастини?',
          a: 'Так, ви можете принести свої запчастини. Однак у цьому випадку ми надаємо гарантію тільки на роботу майстра (7 днів), а не на запчастини.'
        },
        {
          q: 'Чи втрачу я гарантію Apple після ремонту?',
          a: 'Якщо ваш пристрій на гарантії Apple — радимо звернутися в офіційний Apple Service. Ремонт у неавторизованому сервісі може призвести до втрати офіційної гарантії.'
        },
        {
          q: 'Як ви контролюєте якість ремонту?',
          a: 'Ми фіксуємо кожен етап ремонту на фото та відео, проводимо багаторівневе тестування після ремонту та надаємо гарантію 30 днів. Якщо виникне проблема — виправимо безкоштовно.'
        }
      ]
    },
    {
      category: 'Процес ремонту',
      icon: 'fa-tools',
      color: 'blue',
      questions: [
        {
          q: 'Як проходить процес ремонту?',
          a: '1) Ви приносите пристрій → 2) Безкоштовна діагностика (15-20 хв) → 3) Узгодження вартості → 4) Ремонт (30-120 хв) → 5) Тестування → 6) Видача з гарантією.'
        },
        {
          q: 'Чи можна залишити телефон і забрати пізніше?',
          a: 'Так, звичайно! Ви можете залишити пристрій у нас та забрати у зручний для вас час. Ми зателефонуємо або напишемо, коли ремонт буде готовий.'
        },
        {
          q: 'Чи можна чекати ремонту на місці?',
          a: 'Так! У нас є комфортна зона очікування з Wi-Fi та напоями. Для стандартних ремонтів (30-40 хв) більшість клієнтів чекають на місці.'
        },
        {
          q: 'Що робити, якщо я не можу приїхати до сервісу?',
          a: 'Ми можемо організувати кур\'єрську доставку (додатково 100-150 грн в межах міста). Кур\'єр забере ваш пристрій, ми відремонтуємо його та повернемо назад.'
        }
      ]
    },
    {
      category: 'Дані та конфіденційність',
      icon: 'fa-lock',
      color: 'green',
      questions: [
        {
          q: 'Чи безпечні мої дані під час ремонту?',
          a: 'Так! Ми не маємо доступу до ваших особистих даних. Радимо зробити резервну копію перед ремонтом. Всі пристрої зберігаються у захищеній зоні з відеоспостереженням.'
        },
        {
          q: 'Чи видаляються дані при ремонті?',
          a: 'Ні, дані залишаються на пристрої. Виняток — заміна материнської плати або внутрішньої пам\'яті. У таких випадках ми попереджаємо клієнта заздалегідь.'
        },
        {
          q: 'Що робити з паролем і Face ID?',
          a: 'Для деяких видів ремонту (наприклад, тестування екрану) нам потрібен доступ до пристрою. Ви можете встановити тимчасовий простий пароль або бути присутніми під час тестування.'
        }
      ]
    }
  ];

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
              <span>Часті питання</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Питання та <span className="text-blue-600">відповіді</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Зібрали найпопularніші питання про наші послуги, ціни та процес ремонту
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br from-${category.color}-500 to-${category.color}-600 rounded-xl flex items-center justify-center`}>
                  <i className={`fas ${category.icon} text-white text-xl`}></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {category.questions.map((item, qIndex) => {
                  const globalIndex = categoryIndex * 1000 + qIndex;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div 
                      key={qIndex}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
                    >
                      {/* Question */}
                      <button
                        onClick={() => toggleQuestion(categoryIndex, qIndex)}
                        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors duration-200"
                      >
                        <span className="font-semibold text-gray-900 text-lg flex-1">
                          {item.q}
                        </span>
                        <i className={`fas fa-chevron-down text-${category.color}-600 text-xl transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                      </button>

                      {/* Answer */}
                      <div 
                        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
                      >
                        <div className="px-6 pb-5 pt-2">
                          <div className={`h-1 w-20 bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 rounded-full mb-4`}></div>
                          <p className="text-gray-600 leading-relaxed">
                            {item.a}
                          </p>
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
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 shadow-2xl text-center">
            <div className="max-w-2xl mx-auto">
              <i className="fas fa-headset text-5xl text-white mb-6"></i>
              <h2 className="text-3xl font-bold text-white mb-4">
                Не знайшли відповідь?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Зателефонуйте нам або напишіть — ми з радістю відповімо на всі ваші питання!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+380000000000"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-phone"></i>
                  <span>Зателефонувати</span>
                </a>
                <a 
                  href="https://t.me/your_telegram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <i className="fab fa-telegram"></i>
                  <span>Написати в Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Render
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<FAQPage />);
