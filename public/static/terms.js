// Terms and Conditions Page - NEXX v9.0
const { useState } = React;

function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <i className="fas fa-file-contract"></i>
              <span>Termeni și condiții</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Contract de <span className="text-blue-600">servicii</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Regulile de furnizare a serviciilor în centrul de service NEXX
            </p>
            
            <div className="mt-6 text-sm text-gray-500">
              Ultima actualizare: <span className="font-semibold">22 ianuarie 2026</span>
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
                  <strong className="text-gray-900">1.1.</strong> Acest Contract este o ofertă publică a centrului
                  de service NEXX (denumit în continuare „Prestator”) pentru furnizarea de servicii de reparație a tehnicii.
                </p>
                <p>
                  <strong className="text-gray-900">1.2.</strong> Transmiterea dispozitivului pentru reparație înseamnă
                  acceptarea deplină și necondiționată de către Client a termenilor acestui Contract.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-clipboard-check text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">2. Primirea dispozitivului</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  <strong className="text-gray-900">2.1.</strong> La primire, se efectuează o examinare vizuală a
                  dispozitivului și se înregistrează defectele vizibile.
                </p>
                <p>
                  <strong className="text-gray-900">2.2.</strong> Prestatorul nu este responsabil pentru defectele ascunse
                  care nu au putut fi detectate în timpul primirii fără demontarea dispozitivului.
                </p>
                <p>
                  <strong className="text-gray-900">2.3.</strong> Clientul este obligat să facă o copie de rezervă a
                  datelor înainte de a preda dispozitivul. Prestatorul nu este responsabil pentru pierderea datelor.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-microscope text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">3. Diagnostic și reparație</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  <strong className="text-gray-900">3.1.</strong> Diagnosticul se efectuează pentru a determina
                  cauza defecțiunii și costul reparației.
                </p>
                <p>
                  <strong className="text-gray-900">3.2.</strong> Reparația începe numai după acordul Clientului
                  asupra costului și termenelor de execuție.
                </p>
                <p>
                  <strong className="text-gray-900">3.3.</strong> În procesul de reparație pot fi descoperite defecte
                  suplimentare. În acest caz, costul final se renegociază cu Clientul.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-shield-alt text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">4. Garanție</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  <strong className="text-gray-900">4.1.</strong> Prestatorul oferă o garanție de 30 de zile pentru
                  serviciile prestate și piesele instalate.
                </p>
                <p>
                  <strong className="text-gray-900">4.2.</strong> Garanția NU se aplică în caz de:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Deteriorări mecanice (cădere, lovire, pătrundere de lichid)</li>
                  <li>Reparații proprii sau intervenția unor terți după reparația noastră</li>
                  <li>Încălcarea regulilor de utilizare a dispozitivului</li>
                  <li>Uzură normală a componentelor (baterie, porturi etc.)</li>
                  <li>Utilizarea de accesorii și încărcătoare neoriginale</li>
                </ul>
                <p>
                  <strong className="text-gray-900">4.3.</strong> Pentru a beneficia de garanție, este necesară
                  prezentarea chitanței de reparație.
                </p>
                <p className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                  Reparația în garanție se efectuează gratuit în termen de 1-3 zile lucrătoare.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-dollar-sign text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">5. Plată</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  <strong className="text-gray-900">5.1.</strong> Plata serviciilor se face după finalizarea
                  reparației și testarea dispozitivului.
                </p>
                <p>
                  <strong className="text-gray-900">5.2.</strong> Sunt acceptate următoarele metode de plată: numerar,
                  card bancar, transfer bancar (pentru persoane juridice).
                </p>
                <p>
                  <strong className="text-gray-900">5.3.</strong> Dacă Clientul refuză reparația după diagnostic,
                  se achită costul diagnosticului (50 RON).
                </p>
                <p>
                  <strong className="text-gray-900">5.4.</strong> În cazul încetării anticipate a reparației la
                  inițiativa Clientului, se achită manopera efectuată și piesele utilizate.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-clock text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">6. Termene și depozitare</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  <strong className="text-gray-900">6.1.</strong> Termenul estimat de reparație este de 30-120 minute
                  pentru lucrările standard. Termenul exact se comunică după diagnostic.
                </p>
                <p>
                  <strong className="text-gray-900">6.2.</strong> Reparațiile complexe pot dura între 1 și 14 zile lucrătoare
                  (în funcție de disponibilitatea pieselor și complexitatea lucrărilor).
                </p>
                <p>
                  <strong className="text-gray-900">6.3.</strong> Dispozitivul este depozitat gratuit timp de
                  30 de zile calendaristice după finalizarea reparației.
                </p>
                <p>
                  <strong className="text-gray-900">6.4.</strong> Dacă Clientul nu ridică dispozitivul în termen de
                  30 de zile, se percepe o taxă de depozitare de 10 RON/zi.
                </p>
                <p className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                  <i className="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                  <strong>Atenție:</strong> Dacă dispozitivul nu este ridicat în termen de 90 de zile, acesta poate fi
                  reciclat sau vândut pentru a acoperi costurile de depozitare.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-gavel text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">7. Soluționarea litigiilor</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 ml-16">
                <p>
                  <strong className="text-gray-900">7.1.</strong> Toate litigiile se soluționează prin negocieri între părți.
                </p>
                <p>
                  <strong className="text-gray-900">7.2.</strong> În cazul în care nu se ajunge la un acord, litigiul va fi
                  transmis instanțelor judecătorești competente din România.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-info-circle text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Date de contact</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Denumire:</strong> Centrul de Service NEXX</p>
                    <p><strong>Adresa:</strong> București, Str. Victoriei 15</p>
                    <p><strong>Telefon:</strong> <a href="tel:+40721234567" className="text-blue-600 hover:underline">+40 721 234 567</a></p>
                    <p><strong>Email:</strong> <a href="mailto:info@nexx.ro" className="text-blue-600 hover:underline">info@nexx.ro</a></p>
                  </div>
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
root.render(React.createElement(TermsPage));
