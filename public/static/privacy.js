// Privacy Policy Page - NEXX v9.0
const { useState } = React;

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <i className="fas fa-shield-alt"></i>
              <span>Confidențialitate</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Politica de <span className="text-blue-600">confidențialitate</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Apreciem încrederea dumneavoastră și garantăm confidențialitatea deplină a datelor dumneavoastră.
            </p>
            
            <div className="mt-6 text-sm text-gray-500">
              Ultima revizuire: <span className="font-semibold">22 ianuarie 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-12">
            
            {/* Section 1 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-info-circle text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">1. Dispoziții generale</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  Această Politică de confidențialitate reglementează modul de colectare, stocare, utilizare și protecție
                  a datelor cu caracter personal ale utilizatorilor serviciului NEXX (denumit în continuare „Serviciul”).
                </p>
                <p>
                  Prin utilizarea site-ului sau serviciilor noastre, sunteți de acord cu termenii acestei Politici
                  de confidențialitate și vă dați consimțământul pentru prelucrarea datelor dumneavoastră cu caracter personal.
                </p>
                <p>
                  <strong>NEXX</strong> se angajează să respecte legislația din România privind protecția
                  datelor cu caracter personal și să asigure confidențialitatea informațiilor utilizatorilor.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-database text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">2. Ce date colectăm</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>Putem colecta următoarele categorii de date cu caracter personal:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Informații de contact:</strong> nume, prenume, număr de telefon, adresă de email</li>
                  <li><strong>Informații despre dispozitiv:</strong> model, număr de serie, IMEI, starea dispozitivului</li>
                  <li><strong>Istoricul comenzilor:</strong> data solicitării, tipul reparației, costul, starea</li>
                  <li><strong>Date tehnice:</strong> adresa IP, tipul browserului, ora vizitei pe site</li>
                  <li><strong>Foto și video:</strong> înregistrarea stării dispozitivului înainte și după reparație</li>
                </ul>
                <p className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                  NU colectăm informații financiare (numere de card), parole de dispozitiv sau fișiere
                  personale de pe telefonul sau computerul dumneavoastră.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-bullseye text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">3. Scopul utilizării datelor</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>Datele dumneavoastră personale sunt utilizate exclusiv pentru:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Furnizarea serviciilor de reparație și întreținere a tehnicii</li>
                  <li>Contactarea dumneavoastră privind starea comenzii</li>
                  <li>Facturare și procesarea plăților</li>
                  <li>Îmbunătățirea calității serviciilor și personalizarea ofertelor</li>
                  <li>Îndeplinirea obligațiilor de garanție</li>
                  <li>Trimiterea de mesaje informative (cu acordul dumneavoastră)</li>
                  <li>Respectarea cerințelor legislației din România</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-lock text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">4. Protecția datelor</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>Luăm toate măsurile tehnice și organizatorice necesare pentru a vă proteja datele:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Criptarea datelor în timpul transmiterii (SSL/TLS)</li>
                  <li>Limitarea accesului angajaților la datele cu caracter personal</li>
                  <li>Copii de rezervă periodice ale bazei de date</li>
                  <li>Supraveghere video în incinta centrului de service</li>
                  <li>Stocarea securizată a documentelor pe suport de hârtie</li>
                  <li>Audituri regulate ale sistemelor de securitate</li>
                </ul>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-share-alt text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">5. Dezvăluirea datelor către terți</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  NU vindem, nu schimbăm și nu transferăm datele dumneavoastră personale către terți fără acordul dumneavoastră.
                </p>
                <p>Excepție fac cazurile în care dezvăluirea este necesară pentru:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Respectarea cerințelor legale ale autorităților publice</li>
                  <li>Protejarea drepturilor și intereselor noastre</li>
                  <li>Colaborarea cu furnizorii de piese (doar informații tehnice despre dispozitiv)</li>
                </ul>
                <p className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <i className="fas fa-check-circle text-green-600 mr-2"></i>
                  Toți partenerii noștri semnează acorduri de confidențialitate.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-user-check text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">6. Drepturile dumneavoastră</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>Conform legislației, aveți dreptul:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Să știți ce date despre dumneavoastră stocăm</li>
                  <li>Să solicitați corectarea datelor inexacte</li>
                  <li>Să solicitați ștergerea datelor dumneavoastră (cu excepția datelor necesare pentru garanție)</li>
                  <li>Să vă retrageți acordul pentru prelucrarea datelor cu caracter personal</li>
                  <li>Să depuneți o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal</li>
                </ul>
                <p>
                  Pentru a vă exercita drepturile, contactați-ne folosind datele de mai jos.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-clock text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">7. Perioada de păstrare a datelor</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Date de contact:</strong> se păstrează timp de 3 ani de la ultima interacțiune</li>
                  <li><strong>Istoricul reparațiilor:</strong> se păstrează 3 ani (pentru cazurile de garanție)</li>
                  <li><strong>Foto/video:</strong> se păstrează pe durata perioadei de garanție (30 zile) + 60 de zile</li>
                  <li><strong>Log-uri tehnice:</strong> se șterg automat după 6 luni</li>
                </ul>
                <p>
                  După expirarea perioadei de păstrare, datele sunt șterse sau anonimizate.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-edit text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">8. Modificări ale Politicii</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  Ne rezervăm dreptul de a aduce modificări acestei Politici de confidențialitate.
                  Toate modificările intră în vigoare din momentul publicării pe această pagină.
                </p>
                <p>
                  Vă recomandăm să consultați periodic această pagină pentru a fi la curent cu versiunea actuală a Politicii.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-envelope text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Contacte</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> <a href="mailto:info@nexx.ro" className="text-blue-600 hover:underline">info@nexx.ro</a></p>
                    <p><strong>Telefon:</strong> <a href="tel:+40721234567" className="text-blue-600 hover:underline">+40 721 234 567</a></p>
                    <p><strong>Adresa:</strong> București, Str. Victoriei 15</p>
                  </div>
                  <p className="text-gray-600 mt-4 text-sm">
                    Pentru întrebări legate de protecția datelor cu caracter personal, vă rugăm să ne contactați folosind datele de mai sus.
                  </p>
                </div>
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
root.render(React.createElement(PrivacyPage));
