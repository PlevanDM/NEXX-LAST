/**
 * Утилиты для работы с localStorage
 */

export const STORAGE_KEYS = {
  RECENT_DEVICES: 'nexx_recent_devices',
  FAVORITES: 'nexx_favorites',
  THEME: 'nexx_theme',
  SETTINGS: 'nexx_settings'
} as const;

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }
};

// Типы для хранимых данных
export interface StoredDevice {
  name: string;
  model_number?: string;
  category?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  currency: 'UAH' | 'USD' | 'EUR';
  language: 'ru' | 'en';
}
