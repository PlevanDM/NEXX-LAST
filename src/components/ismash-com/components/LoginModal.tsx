import React, { useState } from 'react';
import { cn } from '@/utils';
import { Button } from './ui/Button';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (email: string, password: string) => void;
  onRegister?: (data: RegisterData) => void;
  onForgotPassword?: (email: string) => void;
  className?: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

type ModalView = 'login' | 'register' | 'forgot';

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onForgotPassword,
  className,
}) => {
  const [view, setView] = useState<ModalView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin?.(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Помилка входу');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onRegister?.({ name, email, phone, password });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Помилка реєстрації');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onForgotPassword?.(email);
      setView('login');
    } catch (err: any) {
      setError(err.message || 'Помилка відновлення');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div
        className={cn(
          'bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200',
          className
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                {view === 'login' && 'Вхід'}
                {view === 'register' && 'Реєстрація'}
                {view === 'forgot' && 'Відновлення паролю'}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {view === 'login' && 'Увійдіть до свого акаунту'}
                {view === 'register' && 'Створіть новий акаунт'}
                {view === 'forgot' && 'Введіть email для відновлення'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" fullWidth loading={loading}>
                Увійти
              </Button>
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Забули пароль?
                </button>
                <button
                  type="button"
                  onClick={() => setView('register')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Реєстрація
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ім'я</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Ваше ім'я"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Телефон</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="+380 00 000 0000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <Button type="submit" fullWidth loading={loading}>
                Зареєструватися
              </Button>
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Вже є акаунт? Увійти
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password Form */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <Button type="submit" fullWidth loading={loading}>
                Відновити пароль
              </Button>
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Повернутися до входу
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
