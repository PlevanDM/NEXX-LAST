import React, { useState, useEffect } from 'react';

const ServiceModAuth: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const t = (key: string) => window.i18n?.t(key) || key;

  useEffect(() => {
    (window as any).openServiceModAuth = () => setIsOpen(true);
    return () => { delete (window as any).openServiceModAuth; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
        credentials: 'include'
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        localStorage.setItem('nexx_auth', 'true');
        localStorage.setItem('nexx_auth_time', Date.now().toString());
        localStorage.setItem('nexx_pin', pin);
        window.location.href = '/nexx';
      } else {
        setError(window.i18n?.getCurrentLanguage?.()?.code === 'ro' ? 'PIN incorect. Încercați din nou.' : 'Incorrect PIN. Try again.');
        setPin('');
      }
    } catch {
      setError('Eroare de conexiune. Încercați din nou.');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setPin(value);
    setError('');
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
    setPin('');
    setError('');
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={closeModal}
      />
      <div className="relative bg-gray-900 rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl border border-purple-500/20 animate-scale-in">
        <button
          onClick={closeModal}
          aria-label="Close"
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-300"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/20 rotate-3">
            <i className="fas fa-lock text-white text-4xl"></i>
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">{t('quickActions.serviceMod') || 'Service Mod'}</h3>
          <p className="text-gray-400">{t('serviceMod.enterPin') || 'Introduceți PIN-ul pentru acces'}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={handlePinChange}
              placeholder="• • • •"
              autoFocus
              className="w-full px-6 py-6 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white text-center text-4xl tracking-[0.5em] placeholder-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-mono"
            />
            {error && <p className="text-red-400 text-sm mt-4 text-center font-medium animate-shake">{error}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || pin.length < 4}
            className={`w-full py-5 ${isLoading || pin.length < 4 ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/20'} text-white rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95`}
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-unlock"></i>}
            {isLoading ? (t('serviceMod.checking') || 'Verificare...') : (t('serviceMod.access') || 'Accesează')}
          </button>
        </form>
        
        <p className="text-gray-500 text-xs text-center mt-8 leading-relaxed"> 
          {t('serviceMod.restricted') || '🔒 Acces restricționat pentru personal autorizat'}
        </p>
      </div>
    </div>
  );
};

export default ServiceModAuth;
