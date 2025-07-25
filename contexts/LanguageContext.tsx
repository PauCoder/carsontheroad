import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

//Removed direct JSON imports:
// import deTranslations from '../locales/de.json';
// import enTranslations from '../locales/en.json';
// import esTranslations from '../locales/es.json';

export type Locale = 'de' | 'en' | 'es' | 'fr' | 'it';

export interface LanguageOption {
  code: Locale;
  name: string; // Full name of the language, e.g., "Deutsch", "English"
}

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
  isLoadingTranslations: boolean;
  availableLanguages: LanguageOption[];
  getCurrentLanguageName: () => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const ALL_LANGUAGES: LanguageOption[] = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
];


export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleInternal] = useState<Locale>('de'); // Default to German
  const [currentTranslations, setCurrentTranslations] = useState<Record<string, string> | null>(null);
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(true);

  useEffect(() => {
    let active = true; // To prevent state updates on unmounted component

    const loadTranslations = async (loc: Locale) => {
      setIsLoadingTranslations(true);
      try {
        // Paths are relative to the index.html file
        const response = await fetch(`./locales/${loc}.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${loc}.json. Status: ${response.status}`);
        }
        const data = await response.json();
        if (active) {
          setCurrentTranslations(data);
        }
      } catch (error) {
        console.error(`Error loading translations for ${loc}:`, error);
        if (active) {
          // Fallback or set an error state if preferred
          setCurrentTranslations({ "_error": `Failed to load ${loc} translations` });
        }
      } finally {
        if (active) {
          setIsLoadingTranslations(false);
        }
      }
    };

    loadTranslations(locale);

    return () => {
      active = false; // Cleanup on unmount or locale change before new load finishes
    };
  }, [locale]);
  
  const t = useCallback((key: string, values?: Record<string, string | number>): string => {
    if (!currentTranslations || isLoadingTranslations) {
      // Return key or a placeholder if translations are not loaded
      return key; 
    }
    let translation = currentTranslations[key] || key; // Fallback to key if not found
    
    if (values) {
      Object.keys(values).forEach(placeholder => {
        translation = translation.replace(new RegExp(`{${placeholder}}`, 'g'), String(values[placeholder]));
      });
    }
    return translation;
  }, [currentTranslations, isLoadingTranslations]);

  useEffect(() => {
    if (!isLoadingTranslations && currentTranslations) {
      document.documentElement.lang = locale;
      document.title = t('html.title') || 'carsontheroad.com'; // Use a default if key missing
    }
  }, [locale, isLoadingTranslations, currentTranslations, t]);

  const setLocale = (newLocale: Locale) => {
    setLocaleInternal(newLocale);
  };

  const getCurrentLanguageName = useCallback((): string => {
    return ALL_LANGUAGES.find(lang => lang.code === locale)?.name || locale;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ 
        locale, 
        setLocale, 
        t, 
        isLoadingTranslations,
        availableLanguages: ALL_LANGUAGES,
        getCurrentLanguageName
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
