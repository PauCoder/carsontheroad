import React, { useState, useEffect, useRef } from 'react';
import { useLanguage, Locale } from '../contexts/LanguageContext.tsx';
import { GermanFlagIcon } from './icons/GermanFlagIcon.tsx';
import { BritishFlagIcon } from './icons/BritishFlagIcon.tsx';
import { SpanishFlagIcon } from './icons/SpanishFlagIcon.tsx';
import { FrenchFlagIcon } from './icons/FrenchFlagIcon.tsx';
import { ItalianFlagIcon } from './icons/ItalianFlagIcon.tsx';
import { ChevronDownIcon } from './icons/ChevronDownIcon.tsx';

const getFlagForLocale = (locale: Locale): React.FC<React.SVGProps<SVGSVGElement>> => {
  switch (locale) {
    case 'de': return GermanFlagIcon;
    case 'en': return BritishFlagIcon;
    case 'es': return SpanishFlagIcon;
    case 'fr': return FrenchFlagIcon;
    case 'it': return ItalianFlagIcon;
    default: return () => null; // Fallback or a default icon
  }
};

export const LanguageSelector: React.FC = () => {
  const { locale, setLocale, t, availableLanguages, getCurrentLanguageName, isLoadingTranslations } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguageName = getCurrentLanguageName();
  const CurrentFlagIcon = getFlagForLocale(locale);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoadingTranslations && !currentLanguageName) {
    return <div className="w-32 h-9 bg-gray-200 animate-pulse rounded-md flex items-center px-3"><div className="w-5 h-3 bg-gray-300 mr-2 rounded-sm"></div><div className="w-16 h-4 bg-gray-300 rounded-sm"></div></div>;
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={t('language.selector.current', { language: currentLanguageName })}
        >
          <CurrentFlagIcon className="w-5 h-auto mr-2 border border-gray-200" style={{ aspectRatio: '5/3' }}/>
          {currentLanguageName}
          <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1 text-gray-500" />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {availableLanguages.map((lang) => {
              const FlagComponent = getFlagForLocale(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code);
                    setIsOpen(false);
                  }}
                  disabled={locale === lang.code}
                  className={`w-full text-left flex items-center px-4 py-2 text-sm 
                    ${locale === lang.code
                      ? 'bg-blue-100 text-blue-700 font-semibold cursor-default'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                    disabled:opacity-50 disabled:bg-transparent disabled:text-gray-400 disabled:font-normal
                  `}
                  role="menuitem"
                  aria-label={t('language.selector.changeTo', { language: lang.name })}
                >
                  <FlagComponent className="w-5 h-auto mr-3 border border-gray-200" style={{ aspectRatio: '5/3' }}/>
                  {lang.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};