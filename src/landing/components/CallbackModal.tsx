import React, { useState, useEffect } from 'react';

const CallbackModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [device, setDevice] = useState('');
  const [problem, setProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState(window.i18n?.getCurrentLanguage?.()?.code || 'ro');
  
  const t = (key: string) => window.i18n?.t(key) || key;

  const resetForm = () => {
    setPhone('');
    setName('');
    setDevice('');
    setProblem('');
    setIsSuccess(false);
    setError('');
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
    setTimeout(resetForm, 300);
  };

  useEffect(() => {
    (window as any).openCallbackModal = () => setIsOpen(true);
    return () => { delete (window as any).openCallbackModal; };
  }, []);

  useEffect(() => {
    if (!window.i18n?.subscribe) return;
    const unsubscribe = window.i18n.subscribe((newLang?: string) => {
      setLang(newLang ?? window.i18n?.getCurrentLanguage?.()?.code ?? 'ro');
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, device, problem })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        (window as any).showToast && (window as any).showToast(t('callback.toastSuccess'), 'success');
      } else {
        throw new Error(data.error || 'Eroare la trimitere');
      }
    } catch (err: any) {
      setError(err.message);
      (window as any).showToast && (window as any).showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ paddingLeft: 'max(0.5rem, env(safe-area-inset-left))', paddingRight: 'max(0.5rem, env(safe-area-inset-right))', paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={closeModal}
      />
      <div 
        className="relative bg-gray-900 rounded-t-3xl sm:rounded-[2.5rem] w-full max-w-md shadow-2xl border border-gray-800 animate-scale-in flex flex-col max-h-[90dvh] sm:max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия всегда видна */}
        <div className="flex-shrink-0 flex justify-end p-4 pb-0 sm:absolute sm:top-6 sm:right-6 sm:p-0 z-10">
          <button
            onClick={closeModal}
            className="w-12 h-12 min-h-[44px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-300"
            aria-label={t('callback.close') || 'Закрити'}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-2 sm:p-8 sm:pt-10">
        {isSuccess ? (
          <div className="text-center py-10">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/10">
              <i className="fas fa-check text-5xl text-green-500"></i>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t('callback.thanks')}</h3>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              <p className="text-green-400 font-bold text-lg">{t('callback.callingNow')}</p>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">{t('callback.confirmDetails')}</p>
            <p className="text-gray-500 text-sm mb-6">
              Puteți urmări comenzile în{' '}
              <a href="/cabinet" className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2" onClick={closeModal}>cabinetul personal</a>.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-8">
              <p className="text-yellow-400 font-semibold">{t('callback.freeIncluded')}</p>
            </div>
            <button
              onClick={closeModal}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95"
            >
              {t('callback.close')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20 rotate-3">
                <i className="fas fa-phone-alt text-white text-3xl"></i>
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg shadow-lg border-4 border-gray-900">🎁</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('callback.title')}</h3>
              <p className="text-gray-400">{t('callback.aiCalls')}</p>
              <div className="mt-4 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl inline-block">
                <p className="text-yellow-400 text-sm font-bold">{t('callback.bonus')}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2 ml-1">{t('callback.phone')}</label>
                <div className="relative">
                  <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('booking.form.phonePlaceholder')}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2 ml-1">{t('callback.name')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ion"
                    className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2 ml-1">{t('callback.device')}</label>
                  <input
                    type="text"
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    placeholder="iPhone 15"
                    className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2 ml-1">{t('callback.problem')}</label>
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder={t('booking.form.problemPlaceholder')}
                  rows={2}
                  className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
            
            {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">{error}</div>}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-8 py-5 ${isLoading ? 'bg-gray-700' : 'bg-green-500 hover:bg-green-600 shadow-green-500/20'} text-white rounded-2xl font-bold text-xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95`}
            >
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-phone-alt"></i>}
              {isLoading ? t('callback.sending') : t('callback.submit')}
            </button>
            
            <div className="mt-6 text-center">
              <span className="text-gray-500 text-sm">{t('callback.orContact')}</span>
              <a
                href="https://t.me/nexx_support"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-bold ml-1 transition-colors"
              >
                Telegram
              </a>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default CallbackModal;
