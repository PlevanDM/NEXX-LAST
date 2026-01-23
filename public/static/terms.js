// Terms of Service Page - NEXX v10.0
function TermsPage() {
  const t = (key) => window.i18n?.t(key) || key;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">{t('termsPage.title')}</h1>
        <p className="text-gray-600 mb-8">{t('termsPage.description')}</p>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-slate max-w-none">
          <h3>1. Acceptarea termenilor</h3>
          <p>Prin utilizarea serviciilor noastre, sunteți de acord cu acești termeni și condiții în totalitate.</p>

          <h3>2. Garanția reparațiilor</h3>
          <p>Oferim o garanție de 30 de zile pentru toate reparațiile efectuate, cu excepția cazurilor de daune mecanice sau contact cu lichide după reparație.</p>

          <h3>3. Responsabilitatea datelor</h3>
          <p>Clienții sunt responsabili pentru efectuarea unei copii de rezervă a datelor înainte de a preda dispozitivul în service.</p>

          <div className="mt-12 pt-8 border-t text-sm text-gray-500">
            {t('termsPage.lastUpdate')}
          </div>
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById('app');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(TermsPage));
}
