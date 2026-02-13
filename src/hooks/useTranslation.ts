import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for internationalization
 * Delegates to window.i18n which is loaded via public/static/i18n.js
 */
export function useTranslation() {
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined' && (window as any).i18n) {
      const lang = (window as any).i18n.getCurrentLanguage();
      return lang?.code || 'ro';
    }
    return 'ro';
  });

  // Force re-render counter to keep t() in sync after language change
  const [, setTick] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).i18n) {
      const i18n = (window as any).i18n;
      const currentLang = i18n.getCurrentLanguage();
      if (currentLang?.code) {
        setLanguage(currentLang.code);
      }

      // Subscribe to language changes
      const unsubscribe = i18n.subscribe((lang: any) => {
        setLanguage(lang?.code || 'ro');
        setTick((prev: number) => prev + 1);
      });

      return unsubscribe;
    }
  }, []);

  /**
   * Translate a key with fallback — delegates to window.i18n.t()
   */
  const t = useCallback((key: string, defaultValue: string = key): string => {
    if (typeof window !== 'undefined' && (window as any).i18n) {
      const result = (window as any).i18n.t(key);
      // i18n.t() returns the key itself if not found, so check against that
      return (result !== undefined && result !== null && result !== key) ? String(result) : defaultValue;
    }
    return defaultValue;
  }, [language]);

  /**
   * Change language
   */
  const changeLanguage = (lang: string) => {
    if (typeof window !== 'undefined' && (window as any).i18n) {
      (window as any).i18n.setLanguage(lang);
    }
  };

  /**
   * Get current language code
   */
  const getCurrentLanguage = (): string => language;

  /**
   * Get available languages
   */
  const getAvailableLanguages = (): Array<{ code: string; name: string; flag: string }> => {
    if (typeof window !== 'undefined' && (window as any).i18n) {
      return (window as any).i18n.getAvailableLanguages();
    }
    return [];
  };

  return {
    t,
    language,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
  };
}

export default useTranslation;
