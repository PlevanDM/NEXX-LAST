export {};

declare global {
  interface Window {
    i18n?: {
      t: (key: string, fallback?: string) => string;
      locale?: string;
      getCurrentLanguage?: () => { code?: string };
      subscribe?: (cb: (newLang?: string) => void) => () => void;
    };
  }
}
