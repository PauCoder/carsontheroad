import type { VehicleData, RegistrationHistoryPoint } from './types.ts';

/**
 * Generates a 5-year quarterly registration history leading up to a final count and date.
 * Produces 20 data points.
 * @param finalCount The number of registered vehicles at the finalDate.
 * @param finalDateStr The final date string (e.g., "01.01.2024"), representing the last data point.
 * @returns Array of RegistrationHistoryPoint.
 */
const generateQuarterlyHistory = (finalCount: number, finalDateStr: string): RegistrationHistoryPoint[] => {
  const history: RegistrationHistoryPoint[] = [];
  const [day, month, year] = finalDateStr.split('.').map(Number);
  let currentDate = new Date(year, month - 1, day);

  history.unshift({ date: finalDateStr, count: finalCount });
  let previousCount = finalCount;

  for (let i = 0; i < 19; i++) {
    currentDate.setMonth(currentDate.getMonth() - 3);
    const pointYear = currentDate.getFullYear();
    const pointMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const pointDay = currentDate.getDate().toString().padStart(2, '0'); 
    const pointDateStr = `${pointDay}.${pointMonth}.${pointYear}`;

    const fluctuationPercentage = (Math.random() - 0.45) * 0.05;
    let currentQuarterCount = Math.round(previousCount * (1 - fluctuationPercentage));
    const overallTrendFactor = 1 - ((19 - i) / 19 * 0.3);
    const baseForThisQuarter = finalCount * overallTrendFactor;
    currentQuarterCount = Math.round((currentQuarterCount * 0.3) + (baseForThisQuarter * 0.7));
    currentQuarterCount = Math.max(100, currentQuarterCount);

    history.unshift({ date: pointDateStr, count: currentQuarterCount });
    previousCount = currentQuarterCount;
  }
  return history;
};

const baseVehicleData = [
  {
    hsn: "0005", tsn: "BJX", manufacturer: "BMW", modelSeries: "3er (G20/G21)", commercialName: "320d xDrive Touring", baseModelUrlName: "3er",
    powerKw: 140, engineCapacityCcm: 1995, fuelType: "Diesel", bodyStyle: "Kombi", numberOfDoors: 5, emissionClass: "EURO6D-TEMP",
    vehiclesRegistered: 15230, dataDate: "01.01.2024", imageUrl: "https://placehold.co/600x400/E2E8F0/4A5568?text=BMW+320d+Touring"
  },
  {
    hsn: "0603", tsn: "BQS", manufacturer: "VOLKSWAGEN", modelSeries: "Golf VIII", commercialName: "Golf 1.5 TSI OPF", baseModelUrlName: "Golf",
    powerKw: 110, engineCapacityCcm: 1498, fuelType: "Benzin", bodyStyle: "Schräghecklimousine", numberOfDoors: 5, emissionClass: "EURO6D",
    vehiclesRegistered: 22500, dataDate: "01.01.2024", imageUrl: "https://placehold.co/600x400/E2E8F0/4A5568?text=VW+Golf+1.5+TSI"
  },
  {
    hsn: "7107", tsn: "ABR", manufacturer: "MERCEDES-BENZ", modelSeries: "C-Klasse (W205)", commercialName: "C 220 d", baseModelUrlName: "C-Klasse",
    powerKw: 143, engineCapacityCcm: 2143, fuelType: "Diesel", bodyStyle: "Limousine", numberOfDoors: 4, emissionClass: "EURO6",
    vehiclesRegistered: 18345, dataDate: "01.01.2024", imageUrl: "https://placehold.co/600x400/E2E8F0/4A5568?text=Mercedes+C+220d"
  },
  {
    hsn: "0588", tsn: "BHF", manufacturer: "AUDI", modelSeries: "A4 Avant (B9)", commercialName: "A4 Avant 40 TDI quattro", baseModelUrlName: "A4",
    powerKw: 150, engineCapacityCcm: 1968, fuelType: "Diesel", bodyStyle: "Kombi", numberOfDoors: 5, emissionClass: "EURO6D-TEMP",
    vehiclesRegistered: 12880, dataDate: "01.01.2024", imageUrl: "https://placehold.co/600x400/E2E8F0/4A5568?text=Audi+A4+Avant"
  },
  {
    hsn: "1844", tsn: "AAS", manufacturer: "TESLA", modelSeries: "Model 3", commercialName: "Model 3 Long Range AWD", baseModelUrlName: "Model 3",
    powerKw: 340, engineCapacityCcm: 0, fuelType: "Elektro", bodyStyle: "Limousine", numberOfDoors: 4, emissionClass: " kỹ ", // Note: original data was ' kỹ '
    vehiclesRegistered: 35000, dataDate: "01.01.2024", imageUrl: "https://placehold.co/600x400/E2E8F0/4A5568?text=Tesla+Model+3"
  },
  {
    hsn: "0005", tsn: "XYZ", manufacturer: "BMW", modelSeries: "5er (G30/G31)", commercialName: "530e Plug-in-Hybrid", baseModelUrlName: "5er",
    powerKw: 135, engineCapacityCcm: 1998, fuelType: "Plug-in-Hybrid", bodyStyle: "Limousine", numberOfDoors: 4, emissionClass: "EURO6D",
    vehiclesRegistered: 9500, dataDate: "01.01.2024", imageUrl: "https://placehold.co/600x400/E2E8F0/4A5568?text=BMW+530e"
  },
  {
    hsn: "0603", tsn: "CDX", manufacturer: "VOLKSWAGEN", modelSeries: "Golf VIII", commercialName: "Golf 2.0 TDI", baseModelUrlName: "Golf",
    powerKw: 110, engineCapacityCcm: 1968, fuelType: "Diesel", bodyStyle: "Schräghecklimousine", numberOfDoors: 5, emissionClass: "EURO6D",
    vehiclesRegistered: 15000, dataDate: "01.01.2024", imageUrl: "https://placehold.co/600x400/E2E8F0/4A5568?text=VW+Golf+2.0+TDI"
  },
  {
    hsn: "0588", tsn: "BHG", manufacturer: "AUDI", modelSeries: "A4 Limousine (B9)", commercialName: "A4 Limousine 35 TFSI", baseModelUrlName: "A4",
    powerKw: 110, engineCapacityCcm: 1984, fuelType: "Benzin", bodyStyle: "Limousine", numberOfDoors: 4, emissionClass: "EURO6D-TEMP",
    vehiclesRegistered: 8500, dataDate: "01.01.2024", imageUrl: "https://placehold.co/600x400/E2E8F0/4A5568?text=Audi+A4+Limousine"
  }
];

export const MOCK_VEHICLE_DATA: VehicleData[] = baseVehicleData.map(vehicle => ({
  ...vehicle,
  registrationHistory: generateQuarterlyHistory(vehicle.vehiclesRegistered, vehicle.dataDate),
}));


export const getUniqueMakes = (): string[] => {
  const makes = new Set<string>();
  MOCK_VEHICLE_DATA.forEach(vehicle => makes.add(vehicle.manufacturer));
  return Array.from(makes).sort((a,b) => a.localeCompare(b));
};

export const getUniqueBaseModelsForMake = (make: string): string[] => {
  if (!make) return [];
  const baseModels = new Set<string>();
  MOCK_VEHICLE_DATA.filter(vehicle => vehicle.manufacturer === make && vehicle.baseModelUrlName)
                   .forEach(vehicle => baseModels.add(vehicle.baseModelUrlName!));
  return Array.from(baseModels).sort((a,b) => a.localeCompare(b));
};

export const getUniqueCommercialNamesForMakeAndBaseModel = (make: string, baseModel: string): string[] => {
  if (!make || !baseModel) return [];
  const variants = new Set<string>();
  MOCK_VEHICLE_DATA.filter(vehicle => vehicle.manufacturer === make && vehicle.baseModelUrlName === baseModel)
                   .forEach(vehicle => variants.add(vehicle.commercialName));
  return Array.from(variants).sort((a,b) => a.localeCompare(b));
};


export const getUniqueFuelTypes = (): string[] => {
  const fuelTypes = new Set<string>();
  MOCK_VEHICLE_DATA.forEach(vehicle => {
    if(vehicle.fuelType) fuelTypes.add(vehicle.fuelType)
  });
  return Array.from(fuelTypes).sort();
};

export interface PowerKwRange {
  labelKey: string; 
  value: string;
  min: number;
  max: number;
}

export const POWER_KW_RANGES: PowerKwRange[] = [
  { labelKey: "searchform.powerKwRange.select", value: "", min: 0, max: Infinity },
  { labelKey: "searchform.powerKwRange.upto75", value: "0-75", min: 0, max: 75 },
  { labelKey: "searchform.powerKwRange.76to110", value: "76-110", min: 76, max: 110 },
  { labelKey: "searchform.powerKwRange.111to150", value: "111-150", min: 111, max: 150 },
  { labelKey: "searchform.powerKwRange.151to200", value: "151-200", min: 151, max: 200 },
  { labelKey: "searchform.powerKwRange.over200", value: "201+", min: 201, max: Infinity },
];

export const AGGREGATED_HSN = "AGG"; 
export const AGGREGATED_TSN = "GESAMT"; 

export const MIXED_DATA_KEY = "placeholders.mixedData";
export const NOT_APPLICABLE_KEY = "placeholders.notApplicable";


export interface CountryOption {
  code: string; // e.g., "DE", "US"
  nameKey: string; // Translation key for the country name, e.g., "country.DE"
  disabled?: boolean; // If the option should be disabled
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: 'DE', nameKey: 'country.DE' },
  // Add more countries here in the future
  // { code: 'FR', nameKey: 'country.FR', disabled: true }, 
  // { code: 'US', nameKey: 'country.US', disabled: true },
];
// Helper icon for dropdowns, if not already global
// Create this file if it doesn't exist components/icons/ChevronDownIcon.tsx
// export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
//   </svg>
// );
// Ensure this is created. For now, assuming it exists from previous steps.
// If not, LanguageSelector might break. Let's assume it's defined or copied to components/icons/
// If components/icons/ChevronDownIcon.tsx does not exist, it needs to be created:
// contents:
// import React from 'react';
// export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
//   </svg>
// );
//
// It appears ChevronDownIcon was implicitly created/used in LanguageSelector.tsx in an earlier step.
// I will add it explicitly if the user's file list implies it's missing.
// The prompt shows LanguageSelector.tsx already uses it. I will add it as a new file, to be safe.
// Adding ChevronDownIcon as a new file to ensure its availability.
