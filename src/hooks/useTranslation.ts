import { useEffect, useState } from 'react';

/**
 * Custom hook for internationalization
 * Provides access to translations and current language
 */
export function useTranslation() {
  const [language, setLanguage] = useState<string>('uk');
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    // Initialize from window.i18n if available
    if (typeof window !== 'undefined' && (window as any).i18n) {
      const i18n = (window as any).i18n;
      const currentLang = i18n.getCurrentLanguage();
      setLanguage(currentLang.code);
      setTranslations(i18n.getCurrentTranslations());

      // Subscribe to language changes
      const unsubscribe = i18n.subscribe((lang: any) => {
        setLanguage(lang.code);
        setTranslations(i18n.getCurrentTranslations());
      });

      return unsubscribe;
    }
  }, []);

  /**
   * Translate a key with fallback
   */
  const t = (key: string, defaultValue: string = key): string => {
    if (!translations) return defaultValue;

    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return typeof value === 'string' ? value : defaultValue;
  };

  /**
   * Translate a nested object
   */
  const translateObject = (key: string): Record<string, any> => {
    if (!translations) return {};

    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = value[k];
      } else {
        return {};
      }
    }

    return typeof value === 'object' ? value : {};
  };

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
    translateObject,
  };
}

export default useTranslation;
