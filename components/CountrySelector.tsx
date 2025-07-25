import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPinIcon } from './icons/MapPinIcon'; 
import { ChevronDownIcon } from './icons/ChevronDownIcon'; // Assuming this exists or will be created
import { COUNTRY_OPTIONS, CountryOption } from '../constants';


interface CountrySelectorProps {
  selectedCountry: string; // e.g., "DE"
  onCountryChange: (countryCode: string) => void;
  // Add isDisabled prop if needed later
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCountry, onCountryChange }) => {
  const { t, isLoadingTranslations } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCountryOption = COUNTRY_OPTIONS.find(opt => opt.code === selectedCountry);
  const currentCountryName = currentCountryOption ? t(currentCountryOption.nameKey) : selectedCountry;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoadingTranslations && !currentCountryName) {
     return <div className="w-36 h-9 bg-gray-200 animate-pulse rounded-md flex items-center px-3"><div className="w-5 h-5 bg-gray-300 mr-2 rounded-full"></div><div className="w-20 h-4 bg-gray-300 rounded-sm"></div></div>;
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
          id="country-options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={t('country.selector.current', { country: currentCountryName })}
        >
          <MapPinIcon className="w-5 h-5 mr-2 text-gray-500" />
          {currentCountryName}
          <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1 text-gray-500" />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="country-options-menu"
        >
          <div className="py-1" role="none">
            {COUNTRY_OPTIONS.map((option) => (
              <button
                key={option.code}
                onClick={() => {
                  onCountryChange(option.code);
                  setIsOpen(false);
                }}
                disabled={selectedCountry === option.code || option.disabled} // Disable current and explicitly disabled options
                className={`w-full text-left flex items-center px-4 py-2 text-sm 
                  ${selectedCountry === option.code
                    ? 'bg-blue-100 text-blue-700 font-semibold cursor-default'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                  disabled:opacity-50 disabled:bg-transparent disabled:text-gray-400 disabled:font-normal
                `}
                role="menuitem"
                aria-label={t('country.selector.changeTo', { country: t(option.nameKey) })}
              >
                {/* Optional: Add country flags here if available as components */}
                {t(option.nameKey)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};