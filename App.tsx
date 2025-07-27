import React, { useState, useCallback, useEffect } from 'react';
import { VehicleSearchForm, SearchCriteria } from './components/VehicleSearchForm.tsx';
import { VehicleInfoDisplay } from './components/VehicleInfoDisplay.tsx';
import { LoadingSpinner } from './components/LoadingSpinner.tsx';
import { FramedCarGraphIcon } from './components/icons/FramedCarGraphIcon.tsx'; 
import { CarIcon } from './components/icons/CarIcon.tsx'; 
import { RegistrationChart } from './components/RegistrationChart.tsx';
import { RegistrationTable } from './components/RegistrationTable.tsx';
import { VehicleResultListItem } from './components/VehicleResultListItem.tsx';
import { LanguageSelector } from './components/LanguageSelector.tsx';
import { CountrySelector } from './components/CountrySelector.tsx';
import { findVehicleByHsnTsn, findVehiclesByMakeModel } from './services/kbaDataService.ts';
import { createAggregatedVehicleData } from './services/aggregationService.ts';
import type { VehicleData } from './types.ts';
import { useLanguage } from './contexts/LanguageContext.tsx';

type SearchStatus = 'initial' | 'loading' | 'found' | 'notFound' | 'error';

const App: React.FC = () => {
  const { t, isLoadingTranslations } = useLanguage();
  const [searchResults, setSearchResults] = useState<VehicleData[] | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('initial');
  const [errorMessageKey, setErrorMessageKey] = useState<string | null>(null);
  const [errorMessageValues, setErrorMessageValues] = useState<Record<string, string | number> | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<string>('DE'); // Default to Germany


  const handleSearch = useCallback(async (criteria: SearchCriteria) => {
    setSearchStatus('loading');
    setSearchResults(null);
    setSelectedVehicle(null);
    setErrorMessageKey(null);
    setErrorMessageValues(undefined);

    // Here, selectedCountry could be passed to search functions if data becomes country-specific
    // For now, it's just a UI element.

    try {
      await new Promise(resolve => setTimeout(resolve, 750)); 
      let vehicles: VehicleData[] | null = null;

      if (criteria.type === 'hsnTsn') {
        if (!criteria.hsn || !criteria.tsn) {
          setErrorMessageKey("status.error.hsnTsnEmpty");
          setSearchStatus('error');
          return;
        }
        vehicles = await findVehicleByHsnTsn(criteria.hsn, criteria.tsn);
      } else if (criteria.type === 'makeModel') {
        if (!criteria.make) {
          setErrorMessageKey("status.error.makeEmpty");
          setSearchStatus('error');
          return;
        }
        vehicles = await findVehiclesByMakeModel(criteria.make, criteria.baseModel, criteria.variant, criteria.filters);
      }

      if (vehicles && vehicles.length > 0) {
        if (criteria.type === 'makeModel' && !criteria.variant && vehicles.length > 1) {
          const aggregatedVehicle = createAggregatedVehicleData(vehicles, criteria.make, criteria.baseModel);
          if (aggregatedVehicle) {
            const finalResults = [aggregatedVehicle, ...vehicles];
            setSearchResults(finalResults);
            setSelectedVehicle(aggregatedVehicle); 
          } else {
            setSearchResults(vehicles); 
            if (vehicles.length === 1) setSelectedVehicle(vehicles[0]);
          }
        } else if (vehicles.length === 1) {
          setSearchResults(vehicles);
          setSelectedVehicle(vehicles[0]);
        } else {
          setSearchResults(vehicles);
        }
        setSearchStatus('found');
      } else {
        setSearchResults(null);
        setSearchStatus('notFound');
      }
    } catch (error) {
      console.error("Fehler bei der Fahrzeugsuche:", error);
      setErrorMessageKey("status.error.general");
      setSearchStatus('error');
      setSearchResults(null);
    }
  }, [selectedCountry]); // Add selectedCountry to dependencies if it influences search
  
  const handleSelectVehicle = (vehicle: VehicleData) => {
    setSelectedVehicle(vehicle);
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    // Potentially reset search or refetch data for the new country in the future
    setSearchStatus('initial');
    setSearchResults(null);
    setSelectedVehicle(null);
  };

  const showResultsList = searchResults && searchResults.length > 1 && !selectedVehicle && searchStatus === 'found';
  const showSingleSelectedWithListAvailable = selectedVehicle && searchResults && searchResults.length > 1 && searchStatus === 'found';
  
  if (isLoadingTranslations) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col p-4 sm:p-6 transition-colors duration-300 ease-in-out">
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FramedCarGraphIcon 
              className="w-16 h-auto sm:w-20 mr-3" 
              aria-label={t('app.title') + " " + t('app.logoAltSuffix', {defaultValue: "Logo"})}
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
              {t('app.title')}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <CountrySelector selectedCountry={selectedCountry} onCountryChange={handleCountryChange} />
            <LanguageSelector />
          </div>
        </div>
        <p className="text-md sm:text-lg text-gray-600 max-w-3xl mx-auto text-center mt-2">
          {t('app.subtitle')}
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-grow">
        <main className="w-full lg:w-2/3 xl:w-3/4 space-y-6">
          <section className="bg-white shadow-xl rounded-xl p-6 sm:p-8">
            <VehicleSearchForm onSearch={handleSearch} isLoading={searchStatus === 'loading'} />
          </section>

          {searchStatus === 'loading' && <LoadingSpinner />}

          {searchStatus === 'error' && errorMessageKey && (
            <section aria-live="assertive" className="text-center p-6 bg-red-50 border border-red-300 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-red-700 mb-2">{t('status.error.title')}</h3>
              <p className="text-gray-600">{t(errorMessageKey, errorMessageValues)}</p>
            </section>
          )}

          {searchStatus === 'notFound' && (
            <section aria-live="polite" className="text-center p-6 bg-yellow-50 border border-yellow-300 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-yellow-700 mb-2">{t('status.notFound.title')}</h3>
              <p className="text-gray-600">{t('status.notFound.message')}</p>
            </section>
          )}

          {searchStatus === 'initial' && !selectedVehicle && (
            <section className="text-center p-6 text-gray-500 bg-white shadow-xl rounded-xl">
              <p>{t('status.initial.message')}</p>
            </section>
          )}
          
          {(showResultsList || showSingleSelectedWithListAvailable) && searchResults && (
            <section aria-live="polite" className="bg-white shadow-xl rounded-xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {showSingleSelectedWithListAvailable 
                  ? t('results.multipleFound.selectAlternative', { count: searchResults.length })
                  : t('results.multipleFound.title', { count: searchResults.length })
                }
              </h2>
              {selectedVehicle && searchResults.length > 1 && (
                 <button 
                    onClick={() => setSelectedVehicle(null)} 
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline mb-3"
                    aria-label={t('results.backToList', { count: searchResults.length })}
                 >
                    {t('results.backToList', { count: searchResults.length })}
                 </button>
              )}
              <ul className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.map((vehicle, index) => (
                  <VehicleResultListItem 
                    key={`${vehicle.hsn}-${vehicle.tsn}-${vehicle.commercialName}-${index}`} 
                    vehicle={vehicle} 
                    onSelect={() => handleSelectVehicle(vehicle)}
                    isSelected={selectedVehicle === vehicle}
                  />
                ))}
              </ul>
            </section>
          )}

          {selectedVehicle && searchStatus === 'found' && (
            <>
              <section aria-live="polite" className="bg-white shadow-xl rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('vehicleInfo.registrations')}</h2>
                <div className="h-72 sm:h-96">
                   <RegistrationChart history={selectedVehicle.registrationHistory} />
                </div>
              </section>
              <section className="bg-white shadow-xl rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('vehicleInfo.registrationData')}</h2>
                <RegistrationTable history={selectedVehicle.registrationHistory} />
              </section>
            </>
          )}
        </main>

        <aside className="w-full lg:w-1/3 xl:w-1/4">
          {selectedVehicle && searchStatus === 'found' ? (
            <div className="sticky top-6">
              <VehicleInfoDisplay vehicle={selectedVehicle} />
            </div>
          ) : searchStatus !== 'loading' && searchStatus !== 'initial' && (
            <div className="sticky top-6 bg-white shadow-xl rounded-xl p-6 text-center text-gray-500">
              <CarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              { searchResults && searchResults.length > 1 ? 
                <p>{t('vehicleInfo.sidebar.selectFromList')}</p> :
                <p>{t('vehicleInfo.sidebar.noSelection')}</p>
              }
            </div>
          )}
        </aside>
      </div>

      <footer className="mt-8 sm:mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <p>{t('footer.kbaDisclaimer')}</p>
      </footer>
    </div>
  );
};

export default App;
