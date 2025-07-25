import { MOCK_VEHICLE_DATA, POWER_KW_RANGES } from '../constants';
import type { VehicleData, SearchFilters } from '../types';

/**
 * Simuliert das Abrufen von Fahrzeugdaten basierend auf HSN und TSN.
 * Gibt ein Array mit dem gefundenen Fahrzeug oder ein leeres Array zurück.
 */
export const findVehicleByHsnTsn = async (hsn: string, tsn: string): Promise<VehicleData[]> => {
  const normalizedHsn = hsn.trim();
  const normalizedTsn = tsn.trim().toUpperCase();

  const vehicle = MOCK_VEHICLE_DATA.find(
    v => v.hsn === normalizedHsn && v.tsn.toUpperCase() === normalizedTsn
  );

  return vehicle ? [vehicle] : [];
};

/**
 * Simuliert das Abrufen von Fahrzeugdaten basierend auf Hersteller (Marke), 
 * Basismodell, Variante und optionalen Filtern.
 * Gibt ein Array der gefundenen Fahrzeuge oder ein leeres Array zurück.
 * Make, baseModel und variant werden exakt gematcht, wenn sie angegeben sind (nicht leerer String).
 */
export const findVehiclesByMakeModel = async (
  make: string,
  baseModel?: string, // Represents baseModelUrlName, e.g., "Golf", "A4"
  variant?: string,   // Represents commercialName, e.g., "1.5 TSI", "Avant 40 TDI"
  filters?: SearchFilters
): Promise<VehicleData[]> => {
  // make, baseModel, variant come directly from select, so no need to trim before comparison,
  // but we'll normalize data from MOCK_VEHICLE_DATA for robust comparison.
  // An empty string for make, baseModel or variant means "all" or "not specified" for that level.

  const vehicles = MOCK_VEHICLE_DATA.filter(v => {
    // Filter by Manufacturer (Make) - this is a mandatory field in the form for this search type
    if (make && v.manufacturer.toLowerCase() !== make.toLowerCase()) {
      return false;
    }

    // Filter by Base Model (e.g., "Golf", "A4") if provided
    // v.baseModelUrlName should exist and be compared
    if (baseModel && v.baseModelUrlName && v.baseModelUrlName.toLowerCase() !== baseModel.toLowerCase()) {
        return false;
    }
    
    // Filter by Variant (Commercial Name) if provided
    // This is only effective if a baseModel was also selected that matches, or if searching across all baseModels of a make.
    if (variant && v.commercialName.toLowerCase() !== variant.toLowerCase()) {
      return false;
    }
    
    if (filters?.fuelType && filters.fuelType !== "") {
      if (v.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) return false;
    }

    if (filters?.powerKwRange && filters.powerKwRange !== "") {
      const range = POWER_KW_RANGES.find(r => r.value === filters.powerKwRange);
      if (range && range.value !== "") { // ensure a specific range is selected
        if (v.powerKw < range.min || v.powerKw > range.max) return false;
      }
    }
    return true;
  });

  return vehicles;
};