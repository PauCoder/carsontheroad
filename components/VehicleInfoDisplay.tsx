
import React from 'react';
import type { VehicleData } from '../types';
import { MIXED_DATA_KEY, NOT_APPLICABLE_KEY } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
// import { WheelIcon } from './icons/WheelIcon'; // WheelIcon is no longer used


interface VehicleInfoDisplayProps {
  vehicle: VehicleData;
}

const AUTOSCOUT_AFFILIATE_CODE = "YOUR_AFFILIATE_CODE_HERE";
const AUTOSCOUT_AFFILIATE_PARAM = "partnerid"; 

const DataRow: React.FC<{ label: string; value?: string | number | null; isHighlighted?: boolean; unit?: string }> = ({ label, value, isHighlighted = false, unit = '' }) => {
  if (value === undefined || value === null || value === "") return null;
  
  if (typeof value === 'number' && isNaN(value)) return null;

  const displayValue = `${value}${unit}`;
  return (
    <div className={`py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${isHighlighted ? 'bg-blue-50' : ''}`}>
      <dt className={`text-sm font-medium ${isHighlighted ? 'text-blue-700' : 'text-gray-600'}`}>{label}</dt>
      <dd className={`mt-1 text-sm ${isHighlighted ? 'text-xl font-bold text-blue-600' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
        {displayValue}
      </dd>
    </div>
  );
};

const slugify = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

const mapModelForWheelSize = (model: string): string => {
  if (!model) return '';
  let mappedModel = model.toLowerCase();
  
  // Specific known mappings
  mappedModel = mappedModel.replace(/\b(\d+)er\b/g, '$1-series'); // e.g., 3er -> 3-series
  mappedModel = mappedModel.replace(/\b(c|e|s|g|a|b|v|x|m)-klasse\b/g, '$1-class'); // e.g., C-Klasse -> c-class
  
  // General slugification for the rest
  return slugify(mappedModel);
};


export const VehicleInfoDisplay: React.FC<VehicleInfoDisplayProps> = ({ vehicle }) => {
  const { t, locale } = useLanguage();

  const formatDisplayValue = (value: string | number | null | undefined, unit?: string): string | number | null => {
    if (value === MIXED_DATA_KEY || value === NOT_APPLICABLE_KEY) {
      return t(value as string); 
    }
    if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
      return t(NOT_APPLICABLE_KEY); 
    }
    return value;
  };


  const manufacturerEncoded = encodeURIComponent(vehicle.manufacturer);
  const modelForAutoScout = (vehicle.isAggregated && vehicle.baseModelUrlName === NOT_APPLICABLE_KEY) ? '' : vehicle.baseModelUrlName;
  const modelForAutoScoutEncoded = encodeURIComponent(modelForAutoScout);
  
  let autoScoutUrl = `https://www.autoscout24.de/lst/${manufacturerEncoded}`;
  if (modelForAutoScoutEncoded) {
    autoScoutUrl += `/${modelForAutoScoutEncoded}`;
  }
  
  if (AUTOSCOUT_AFFILIATE_CODE && AUTOSCOUT_AFFILIATE_CODE !== "YOUR_AFFILIATE_CODE_HERE") {
    autoScoutUrl += (autoScoutUrl.includes('?') ? '&' : '?') + `${AUTOSCOUT_AFFILIATE_PARAM}=${encodeURIComponent(AUTOSCOUT_AFFILIATE_CODE)}`;
  }
  
  let displayTitle = "";
  if (vehicle.isAggregated) {
      const modelPart = (vehicle.baseModelUrlName && vehicle.baseModelUrlName !== NOT_APPLICABLE_KEY) 
                        ? vehicle.baseModelUrlName 
                        : vehicle.manufacturer;
      displayTitle = `${t('placeholders.all')} ${modelPart} ${t('placeholders.aggregatedSuffix')}`;
  } else {
      displayTitle = `${vehicle.manufacturer} ${vehicle.commercialName}`;
  }

  // Wheel-Size URL
  const manufacturerForWheelSize = slugify(vehicle.manufacturer);
  let modelForWheelSize = "";
  if (vehicle.baseModelUrlName && vehicle.baseModelUrlName !== NOT_APPLICABLE_KEY) {
     modelForWheelSize = mapModelForWheelSize(vehicle.baseModelUrlName);
  } else if (vehicle.isAggregated && (!vehicle.baseModelUrlName || vehicle.baseModelUrlName === NOT_APPLICABLE_KEY)) {
    modelForWheelSize = ""; // For aggregated data without a specific base model, link to manufacturer only
  } else if (vehicle.commercialName && vehicle.commercialName !== NOT_APPLICABLE_KEY) {
    // Fallback for non-aggregated items if baseModelUrlName is missing but commercialName exists
    // This might be too broad, but it's a fallback
    modelForWheelSize = mapModelForWheelSize(vehicle.commercialName.split(' ')[0]); // Try using the first word of commercial name
  }


  let wheelSizeUrl = `https://www.wheel-size.com/size/${manufacturerForWheelSize}/`;
  if (modelForWheelSize) {
    wheelSizeUrl += `${modelForWheelSize}/`;
  }

  const wheelSizeAriaModel = modelForWheelSize || (vehicle.isAggregated && vehicle.baseModelUrlName !== NOT_APPLICABLE_KEY ? vehicle.baseModelUrlName : '');


  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 h-full flex flex-col">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-blue-700 leading-tight">{displayTitle}</h2>
        {vehicle.isAggregated && vehicle.aggregatedVehiclesCount && (
            <p className="mt-1 text-sm text-gray-600">{t('vehicleInfo.aggregatedFrom', { count: vehicle.aggregatedVehiclesCount })}</p>
        )}
        {!vehicle.isAggregated && vehicle.modelSeries && <p className="mt-1 text-sm text-gray-600">{formatDisplayValue(vehicle.modelSeries)}</p>}
      </div>

      {vehicle.imageUrl && !vehicle.isAggregated && (
        <div className="aspect-w-16 aspect-h-9 bg-gray-100">
          <img 
            src={vehicle.imageUrl} 
            alt={`${t('vehicleInfo.imageAlt', { manufacturer: vehicle.manufacturer, model: vehicle.commercialName })}`}
            className="w-full h-48 sm:h-56 object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex-grow overflow-y-auto">
        <dl className="divide-y divide-gray-200">
          <DataRow 
            label={t(vehicle.isAggregated ? 'vehicleInfo.registeredCountAggregated' : 'vehicleInfo.registeredCount')}
            value={vehicle.vehiclesRegistered.toLocaleString(locale)} 
            isHighlighted 
          />
          <DataRow label={t('vehicleInfo.dataDate')} value={formatDisplayValue(vehicle.dataDate) as string} isHighlighted />
          
          <DataRow label={t('vehicleInfo.hsn')} value={formatDisplayValue(vehicle.hsn) as string} />
          <DataRow label={t('vehicleInfo.tsn')} value={formatDisplayValue(vehicle.tsn) as string} />
          {!vehicle.isAggregated && <DataRow label={t('vehicleInfo.manufacturer')} value={vehicle.manufacturer} />}
          
          <DataRow label={t('vehicleInfo.powerKw')} value={formatDisplayValue(vehicle.powerKw) as string | number} unit=" kW"/>
          <DataRow label={t('vehicleInfo.engineCapacityCcm')} value={formatDisplayValue(vehicle.engineCapacityCcm) as string | number} unit=" ccm"/>
          <DataRow label={t('vehicleInfo.fuelType')} value={formatDisplayValue(vehicle.fuelType) as string} />
          <DataRow label={t('vehicleInfo.bodyStyle')} value={formatDisplayValue(vehicle.bodyStyle) as string} />
          <DataRow label={t('vehicleInfo.numberOfDoors')} value={formatDisplayValue(vehicle.numberOfDoors) as string | number} />
          <DataRow label={t('vehicleInfo.emissionClass')} value={formatDisplayValue(vehicle.emissionClass) as string} />
        </dl>
        
        <div className="px-4 py-4 sm:px-6 mt-2 space-y-3">
          <a
            href={autoScoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-4 py-3 text-center bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-150 ease-in-out no-underline shadow-md hover:shadow-lg flex items-center justify-center"
            aria-label={t('vehicleInfo.autoscoutAriaLabel', { manufacturer: vehicle.manufacturer, model: modelForAutoScout || '' })}
          >
            {/* Icon could be added here if desired for AutoScout link too */}
            <span dangerouslySetInnerHTML={{ __html: t('vehicleInfo.autoscoutLink') }}></span>
          </a>
           {(manufacturerForWheelSize) && (
            <a
              href={wheelSizeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 text-center bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-150 ease-in-out no-underline shadow-md hover:shadow-lg flex items-center justify-center"
              aria-label={t('vehicleInfo.wheelSizeAriaLabel', { manufacturer: vehicle.manufacturer, model: wheelSizeAriaModel })}
            >
              {/* <WheelIcon className="w-5 h-5 mr-2" /> Removed WheelIcon */}
              <span dangerouslySetInnerHTML={{ __html: t('vehicleInfo.wheelSizeLink') }}></span>
            </a>
          )}
        </div>
      </div>
       <div className="px-4 py-3 sm:px-6 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        {t(vehicle.isAggregated ? 'vehicleInfo.footerNoteAggregated' : 'vehicleInfo.footerNoteSelected')} {t('vehicleInfo.footerNoteSimulated')}
      </div>
    </div>
  );
};