import React, { useState, useEffect } from 'react';
import { SearchIcon } from './icons/SearchIcon.tsx';
import type { SearchFilters } from '../types.ts';
import { 
  getUniqueFuelTypes, 
  POWER_KW_RANGES, 
  getUniqueMakes, 
  getUniqueBaseModelsForMake,
  getUniqueCommercialNamesForMakeAndBaseModel
} from '../constants.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';


export type SearchType = 'hsnTsn' | 'makeModel';

export interface HsnTsnSearch {
  type: 'hsnTsn';
  hsn: string;
  tsn: string;
}

export interface MakeModelSearch {
  type: 'makeModel';
  make: string;
  baseModel: string; 
  variant: string;   
  filters?: SearchFilters;
}

export type SearchCriteria = HsnTsnSearch | MakeModelSearch;

interface VehicleSearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
  isLoading: boolean;
}

export const VehicleSearchForm: React.FC<VehicleSearchFormProps> = ({ onSearch, isLoading }) => {
  const { t } = useLanguage();
  const [searchType, setSearchType] = useState<SearchType>('makeModel');
  const [hsn, setHsn] = useState<string>("");
  const [tsn, setTsn] = useState<string>("");
  
  const [make, setMake] = useState<string>("");
  const [baseModel, setBaseModel] = useState<string>(""); 
  const [variant, setVariant] = useState<string>("");    
  
  const [fuelType, setFuelType] = useState<string>("");
  const [powerKwRange, setPowerKwRange] = useState<string>("");

  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableBaseModels, setAvailableBaseModels] = useState<string[]>([]);
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  const [availableFuelTypes, setAvailableFuelTypes] = useState<string[]>([]);

  useEffect(() => {
    setAvailableMakes(getUniqueMakes());
    setAvailableFuelTypes(getUniqueFuelTypes());
  }, []);

  useEffect(() => {
    if (make) {
      setAvailableBaseModels(getUniqueBaseModelsForMake(make));
    } else {
      setAvailableBaseModels([]);
    }
    setBaseModel(""); 
    setAvailableVariants([]); 
    setVariant("");     
  }, [make]);

  useEffect(() => {
    if (make && baseModel) {
      setAvailableVariants(getUniqueCommercialNamesForMakeAndBaseModel(make, baseModel));
    } else {
      setAvailableVariants([]);
    }
    setVariant(""); 
  }, [make, baseModel]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchType === 'hsnTsn') {
      onSearch({ type: 'hsnTsn', hsn, tsn });
    } else {
      onSearch({ type: 'makeModel', make, baseModel, variant, filters: { fuelType, powerKwRange } });
    }
  };

  const isSubmitDisabled = isLoading ||
    (searchType === 'hsnTsn' && (!hsn || !tsn)) ||
    (searchType === 'makeModel' && !make);


  const ToggleButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 transition-colors
        ${active ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      aria-pressed={active}
    >
      {children}
    </button>
  );

  const commonInputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed";
  const commonLabelClass = "block text-sm font-medium text-gray-700 mb-1";
  const commonDescriptionClass = "mt-1 text-xs text-gray-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg justify-center">
        <ToggleButton active={searchType === 'makeModel'} onClick={() => setSearchType('makeModel')}>
          {t('searchform.makeModelSearch')}
        </ToggleButton>
        <ToggleButton active={searchType === 'hsnTsn'} onClick={() => setSearchType('hsnTsn')}>
          {t('searchform.hsnTsnSearch')}
        </ToggleButton>
      </div>

      {searchType === 'makeModel' && (
        <>
          <div>
            <label htmlFor="make" className={commonLabelClass}>
              {t('searchform.manufacturer')} <span className="text-red-500">{t('searchform.manufacturerRequired')}</span>
            </label>
            <select
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className={commonInputClass}
              disabled={isLoading}
              required
              aria-describedby="make-description"
            >
              <option value="">{t('searchform.selectManufacturer')}</option>
              {availableMakes.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <p id="make-description" className={commonDescriptionClass}>{t('searchform.manufacturerDescription')}</p>
          </div>

          <div>
            <label htmlFor="baseModel" className={commonLabelClass}>
              {t('searchform.model')}
            </label>
            <select
              id="baseModel"
              value={baseModel}
              onChange={(e) => setBaseModel(e.target.value)}
              className={commonInputClass}
              disabled={isLoading || !make || availableBaseModels.length === 0}
              aria-describedby="baseModel-description"
            >
              <option value="">{t('searchform.allModels')}</option>
              {availableBaseModels.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
             <p id="baseModel-description" className={commonDescriptionClass}>
              {make ? t('searchform.modelDescription') : t('searchform.modelDescriptionNoMake')}
            </p>
          </div>
          
          <div>
            <label htmlFor="variant" className={commonLabelClass}>
              {t('searchform.variant')}
            </label>
            <select
              id="variant"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              className={commonInputClass}
              disabled={isLoading || !baseModel || availableVariants.length === 0}
              aria-describedby="variant-description"
            >
              <option value="">{t('searchform.allVariants')}</option>
              {availableVariants.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
             <p id="variant-description" className={commonDescriptionClass}>
              {baseModel ? t('searchform.variantDescription') : t('searchform.variantDescriptionNoModel')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fuelType" className={commonLabelClass}>
                {t('searchform.engineFuel')}
              </label>
              <select
                id="fuelType"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className={commonInputClass}
                disabled={isLoading}
              >
                <option value="">{t('searchform.allFuelTypes')}</option>
                {availableFuelTypes.map(type => (
                  <option key={type} value={type}>{type}</option> 
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="powerKwRange" className={commonLabelClass}>
                {t('searchform.powerKw')}
              </label>
              <select
                id="powerKwRange"
                value={powerKwRange}
                onChange={(e) => setPowerKwRange(e.target.value)}
                className={commonInputClass}
                disabled={isLoading}
              >
                {POWER_KW_RANGES.map(range => (
                  <option key={range.value} value={range.value}>{t(range.labelKey)}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {searchType === 'hsnTsn' && (
        <>
          <div>
            <label htmlFor="hsn" className={commonLabelClass}>
              {t('searchform.hsn')} <span className="text-red-500">{t('searchform.hsnRequired')}</span>
            </label>
            <input
              type="text"
              id="hsn"
              value={hsn}
              onChange={(e) => setHsn(e.target.value)}
              placeholder={t('searchform.hsnPlaceholder')}
              maxLength={4}
              className={commonInputClass}
              disabled={isLoading}
              required={searchType === 'hsnTsn'}
              aria-describedby="hsn-description"
            />
            <p id="hsn-description" className={commonDescriptionClass}>{t('searchform.hsnDescription')}</p>
          </div>

          <div>
            <label htmlFor="tsn" className={commonLabelClass}>
              {t('searchform.tsn')} <span className="text-red-500">{t('searchform.tsnRequired')}</span>
            </label>
            <input
              type="text"
              id="tsn"
              value={tsn}
              onChange={(e) => setTsn(e.target.value.toUpperCase())}
              placeholder={t('searchform.tsnPlaceholder')}
              className={commonInputClass}
              disabled={isLoading}
              required={searchType === 'hsnTsn'}
              aria-describedby="tsn-description"
            />
            <p id="tsn-description" className={commonDescriptionClass}>{t('searchform.tsnDescription')}</p>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
        aria-live="polite"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('searchform.loadingButton')}
          </>
        ) : (
          <>
            <SearchIcon className="w-5 h-5 mr-2" />
            {t('searchform.submitButton')}
          </>
        )}
      </button>
    </form>
  );
};