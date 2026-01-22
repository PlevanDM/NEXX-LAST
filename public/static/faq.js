// FAQ Page - NEXX v9.0
const { useState } = React;

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqData = [
    {
      category: 'Întrebări generale',
      icon: 'fa-question-circle',
      color: 'blue',
      questions: [
        {
          q: 'Cât timp durează reparația?',
          a: 'Timpul mediu de reparație este de 30-40 de minute pentru lucrările standard (înlocuire ecran, baterie etc.). Reparațiile complexe pot dura până la 2-3 ore. Timpul exact va fi comunicat după diagnostic.'
        },
        {
          q: 'Oferiți garanție pentru reparație?',
          a: 'Da! Oferim o garanție oficială de 30 de zile pentru toate tipurile de lucrări și piesele instalate. Garanția acoperă defectele de manoperă și calitatea componentelor.'
        },
        {
          q: 'Ce metode de plată acceptați?',
          a: 'Acceptăm numerar, carduri bancare (Visa, Mastercard) și transfer bancar pentru persoane juridice. Plata se face după finalizarea reparației.'
        },
        {
          q: 'Ce trebuie să fac dacă telefonul nu pornește?',
          a: 'Aduceți dispozitivul la centrul nostru de service. Vom efectua un diagnostic gratuit și vom determina cauza defecțiunii. În 70% din cazuri, problema se rezolvă prin înlocuirea bateriei sau a portului de încărcare.'
        }
      ]
    },
    {
      category: 'Prețuri și servicii',
      icon: 'fa-dollar-sign',
      color: 'green',
      questions: [
        {
          q: 'Cât costă diagnosticul?',
          a: 'Diagnosticul este gratuit! Vom verifica dispozitivul, vom identifica defecțiunea și vă vom comunica costul reparației. Dacă sunteți de acord cu reparația, diagnosticul este gratuit. Dacă refuzați, acesta costă 50 RON.'
        },
        {
          q: 'Pot afla costul reparației în avans?',
          a: 'Da! Utilizați calculatorul nostru de pe site sau sunați-ne. Vă vom oferi un cost aproximativ. Prețul exact va fi comunicat după diagnosticul dispozitivului.'
        },
        {
          q: 'Există reduceri pentru clienții fideli?',
          a: 'Da! Pentru clienții fideli avem un sistem de reduceri de până la 15%. De asemenea, desfășurăm promoții și oferte speciale — urmăriți-ne pe rețelele sociale.'
        },
        {
          q: 'Ce este inclus în costul reparației?',
          a: 'Costul include: manopera tehnicianului, piesele instalate, diagnosticul, testarea după reparație și 30 de zile de garanție. Fără costuri ascunse!'
        }
      ]
    },
    {
      category: 'Piese și calitate',
      icon: 'fa-cog',
      color: 'purple',
      questions: [
        {
          q: 'Ce piese folosiți?',
          a: 'Folosim piese originale Apple (când este posibil) și analogi certificați de calitate premium. Întotdeauna convenim cu clientul tipul de piese înainte de reparație.'
        },
        {
          q: 'Pot aduce piesele mele?',
          a: 'Da, puteți aduce piesele dumneavoastră. Totuși, în acest caz, oferim garanție doar pentru manoperă (7 zile), nu și pentru piese.'
        },
        {
          q: 'Voi pierde garanția Apple după reparație?',
          a: 'Dacă dispozitivul dumneavoastră este în garanție Apple, vă recomandăm să contactați un service oficial Apple. Reparația într-un service neautorizat poate duce la pierderea garanției oficiale.'
        },
        {
          q: 'Cum controlați calitatea reparației?',
          a: 'Înregistrăm fiecare etapă a reparației prin foto și video, efectuăm testări multi-nivel după reparație și oferim o garanție de 30 de zile. Dacă apare o problemă, o vom remedia gratuit.'
        }
      ]
    },
    {
      category: 'Procesul de reparație',
      icon: 'fa-tools',
      color: 'blue',
      questions: [
        {
          q: 'Cum decurge procesul de reparație?',
          a: '1) Aduceți dispozitivul → 2) Diagnostic gratuit (15-20 min) → 3) Acord asupra costului → 4) Reparație (30-120 min) → 5) Testare → 6) Ridicare cu garanție.'
        },
        {
          q: 'Pot lăsa telefonul și să-l ridic mai târziu?',
          a: 'Da, desigur! Puteți lăsa dispozitivul la noi și să-l ridicați la o oră convenabilă. Vă vom suna sau vă vom scrie când reparația este gata.'
        },
        {
          q: 'Pot aștepta reparația la fața locului?',
          a: 'Da! Avem o zonă de așteptare confortabilă cu Wi-Fi și băuturi. Pentru reparațiile standard (30-40 min), majoritatea clienților așteaptă la fața locului.'
        },
        {
          q: 'Ce fac dacă nu pot veni la service?',
          a: 'Putem organiza livrarea prin curier (cost suplimentar 20-30 RON în interiorul orașului). Curierul va ridica dispozitivul, îl vom repara și îl vom returna.'
        }
      ]
    },
    {
      category: 'Date și confidențialitate',
      icon: 'fa-lock',
      color: 'green',
      questions: [
        {
          q: 'Sunt datele mele în siguranță în timpul reparației?',
          a: 'Da! Nu avem acces la datele dumneavoastră personale. Vă recomandăm să faceți o copie de rezervă înainte de reparație. Toate dispozitivele sunt păstrate într-o zonă securizată cu supraveghere video.'
        },
        {
          q: 'Se șterg datele în timpul reparației?',
          a: 'Nu, datele rămân pe dispozitiv. Excepție face înlocuirea plăcii de bază sau a memoriei interne. În astfel de cazuri, informăm clientul în prealabil.'
        },
        {
          q: 'Cum rămâne cu parola și Face ID?',
          a: 'Pentru unele tipuri de reparații (de exemplu, testarea ecranului), avem nevoie de acces la dispozitiv. Puteți seta o parolă temporară simplă sau puteți fi prezent în timpul testării.'
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
              <span>Întrebări frecvente</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Întrebări și <span className="text-blue-600">răspunsuri</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Am adunat cele mai populare întrebări despre serviciile, prețurile și procesul nostru de reparație.
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
                Nu ați găsit răspunsul?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Sunați-ne sau scrieți-ne — vom fi bucuroși să vă răspundem la toate întrebările!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+40721234567"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-phone"></i>
                  <span>Sună acum</span>
                </a>
                <a 
                  href="https://t.me/nexx_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <i className="fab fa-telegram"></i>
                  <span>Scrie pe Telegram</span>
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
root.render(React.createElement(FAQPage));
