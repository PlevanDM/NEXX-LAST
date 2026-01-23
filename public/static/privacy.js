// Privacy Policy Page - NEXX v10.0
function PrivacyPage() {
  const t = (key) => window.i18n?.t(key) || key;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">{t('privacyPage.title')}</h1>
        <p className="text-gray-600 mb-8">{t('privacyPage.description')}</p>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-slate max-w-none">
          <h3>1. Introducere</h3>
          <p>Această Politică de Confidențialitate descrie modul în care colectăm, utilizăm și protejăm datele dumneavoastră personale atunci când utilizați serviciile NEXX.</p>

          <h3>2. Date colectate</h3>
          <p>Colectăm informații necesare pentru procesarea reparațiilor: nume, număr de telefon, adresa de email și detalii despre dispozitiv.</p>

          <h3>3. Protecția datelor</h3>
          <p>Datele dumneavoastră sunt stocate în siguranță și nu sunt partajate cu terțe părți în scopuri de marketing.</p>

          <div className="mt-12 pt-8 border-t text-sm text-gray-500">
            {t('privacyPage.lastUpdate')}
          </div>
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById('app');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(PrivacyPage));
}
