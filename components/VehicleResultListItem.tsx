
import React from 'react';
import type { VehicleData } from '../types';
import { CarIcon } from './icons/CarIcon'; 
import { CollectionIcon } from './icons/CollectionIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { NOT_APPLICABLE_KEY, MIXED_DATA_KEY } from '../constants';


interface VehicleResultListItemProps {
  vehicle: VehicleData;
  onSelect: () => void;
  isSelected: boolean;
}

export const VehicleResultListItem: React.FC<VehicleResultListItemProps> = ({ vehicle, onSelect, isSelected }) => {
  const { t, locale } = useLanguage();
  const IconComponent = vehicle.isAggregated ? CollectionIcon : CarIcon;
  
  let title = "";
  let description = "";
  let subDescription = "";

  const formatDisplayValue = (value: string | number | null | undefined): string => {
    if (value === MIXED_DATA_KEY || value === NOT_APPLICABLE_KEY) {
      return t(value as string);
    }
    if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
      return t(NOT_APPLICABLE_KEY);
    }
    return String(value);
  };
  
  if (vehicle.isAggregated) {
    const modelPart = (vehicle.baseModelUrlName && vehicle.baseModelUrlName !== NOT_APPLICABLE_KEY) 
                      ? vehicle.baseModelUrlName 
                      : vehicle.manufacturer;
    title = `${t('placeholders.all')} ${modelPart} ${t('placeholders.aggregatedSuffix')}`;
    description = t('listItem.aggregated.description', {
      count: vehicle.aggregatedVehiclesCount || 0,
      manufacturer: vehicle.manufacturer,
      model: modelPart,
      total: vehicle.vehiclesRegistered.toLocaleString(locale)
    });
    subDescription = t('listItem.aggregated.dataDate', { date: formatDisplayValue(vehicle.dataDate) });

  } else {
    title = `${vehicle.manufacturer} ${vehicle.commercialName}`;
    const modelSeriesText = vehicle.modelSeries && vehicle.modelSeries !== NOT_APPLICABLE_KEY ? `${formatDisplayValue(vehicle.modelSeries)} | ` : '';
    description = t('listItem.individual.description', {
        modelSeries: modelSeriesText,
        hsn: vehicle.hsn,
        tsn: vehicle.tsn
    });
    const fuelTypeDisplay = vehicle.fuelType ? formatDisplayValue(vehicle.fuelType) : '';
    const powerKwDisplay = vehicle.powerKw !== null && vehicle.powerKw !== undefined ? formatDisplayValue(vehicle.powerKw) : '';
    subDescription = t('listItem.individual.subDescription', {
        fuelType: fuelTypeDisplay,
        powerKw: powerKwDisplay,
        vehiclesRegistered: vehicle.vehiclesRegistered.toLocaleString(locale)
    }).replace(" |  | ", " | ").replace(/^ \| | \| $/g, "").replace("  ", " "); // Clean up empty parts
  }


  return (
    <li className={`border rounded-lg transition-all duration-150 ease-in-out ${isSelected ? 'bg-blue-50 border-blue-400 shadow-md' : 'border-gray-200 hover:shadow-sm hover:border-gray-300'}`}>
      <button
        onClick={onSelect}
        className={`w-full flex items-center p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded-lg ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
        aria-label={t('listItem.showDetailsFor', { name: title })}
        aria-current={isSelected ? "page" : undefined}
      >
        <IconComponent className={`w-8 h-8 ${vehicle.isAggregated ? 'text-indigo-500' : 'text-blue-500'} mr-4 flex-shrink-0`} />
        <div className="flex-grow">
          <h3 className={`text-md font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
            {title}
          </h3>
          <p className={`text-sm ${isSelected ? 'text-gray-700' : 'text-gray-600'}`}>
            {description}
          </p>
          {subDescription && (
             <p className={`text-xs ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                {subDescription}
            </p>
          )}
        </div>
        {!isSelected && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        )}
         {isSelected && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-blue-600 ml-2 flex-shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.06 0l4.001-5.498Z" clipRule="evenodd" />
            </svg>
        )}
      </button>
    </li>
  );
};
