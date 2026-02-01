import React, { useState } from 'react';

const Appointment: React.FC = () => {
  const [form, setForm] = useState({ customerName: '', customerPhone: '', preferredDate: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  
  const t = (key: string) => window.i18n?.t(key) || key;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName?.trim() || !form.customerPhone?.trim()) {
      setErr(t('appointment.error'));
      return;
    }
    setLoading(true); setErr(null);
    try {
      const res = await fetch('/api/remonline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          formType: 'booking', 
          customerName: form.customerName.trim(), 
          customerPhone: form.customerPhone.replace(/\D/g, ''), 
          preferredDate: form.preferredDate || undefined, 
          comment: form.comment?.trim() || undefined 
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({ customerName: '', customerPhone: '', preferredDate: '', comment: '' });
      } else {
        setErr(data.message || data.error || t('appointment.error'));
      }
    } catch (e: any) {
      setErr(e.message || t('appointment.error'));
    }
    setLoading(false);
  };

  if (success) {
    return (
      <section id="appointment" className="py-16 md:py-24 px-4 bg-gray-900/80 overflow-x-hidden">
        <div className="max-w-2xl mx-auto text-center bg-gray-800 p-12 rounded-3xl border border-green-500/20 shadow-2xl animate-fade-in">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-check text-4xl text-green-500"></i>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('appointment.success')}</h2>
          <button 
            onClick={() => setSuccess(false)} 
            className="mt-6 px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
          >
            {t('booking.success.newRequest')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="appointment" className="py-16 md:py-24 px-4 bg-gray-900/80 overflow-x-hidden">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('appointment.title')}</h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {t('appointment.subtitle')}
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500">
                <i className="fas fa-clock"></i>
              </div>
              <div>
                <p className="text-white font-bold">{t('contact.hours')}</p>
                <p className="text-gray-500 text-sm">{t('hero.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-500">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <p className="text-white font-bold">Calea Șerban Vodă 47</p>
                <p className="text-gray-500 text-sm">Sector 4, București</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-gray-400 text-sm font-bold px-1">{t('appointment.form.name')}</label>
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-white outline-none focus:border-blue-500 transition-colors"
                  placeholder={t('booking.form.namePlaceholder')}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-gray-400 text-sm font-bold px-1">{t('appointment.form.phone')}</label>
              <div className="relative">
                <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => setForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-white outline-none focus:border-blue-500 transition-colors"
                  placeholder={t('booking.form.phonePlaceholder')}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-gray-400 text-sm font-bold px-1">{t('appointment.form.date')}</label>
              <div className="relative">
                <i className="fas fa-calendar-day absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                <input
                  type="date"
                  value={form.preferredDate}
                  onChange={(e) => setForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-gray-400 text-sm font-bold px-1">{t('appointment.form.comment')}</label>
              <div className="relative">
                <i className="fas fa-comment-alt absolute left-4 top-4 text-gray-500"></i>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm(prev => ({ ...prev, comment: e.target.value }))}
                  rows={3}
                  className="w-full pl-12 pr-4 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-white outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder={t('booking.form.problemPlaceholder')}
                />
              </div>
            </div>
            
            {err && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 font-medium">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {err}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl active:scale-95 mt-4"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-calendar-check"></i>
              )}
              {loading ? t('appointment.form.submitting') : t('appointment.form.submit')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Appointment;
