
export interface RegistrationHistoryPoint {
  date: string; // e.g., "01.01.2022", "01.07.2022", "01.01.2023"
  count: number;
}

export interface VehicleData {
  hsn: string;
  tsn: string;
  manufacturer: string; // Hersteller
  modelSeries?: string; // z.B. "3er Reihe"
  commercialName: string; // z.B. "320d Touring" or "Alle A4 Varianten (Aggregiert)"
  baseModelUrlName: string; // Simplified model name for URL, e.g., "Golf", "3er"
  powerKw: number | null; // Leistung in kW, null if aggregated and mixed
  engineCapacityCcm: number | null; // Hubraum in ccm, null if aggregated and mixed
  fuelType: string | null; // Kraftstoffart, null if aggregated and mixed
  bodyStyle?: string | null; // z.B. "Kombi", null if aggregated and mixed
  numberOfDoors?: number | null;
  emissionClass?: string | null; // z.B. "EURO6", null if aggregated and mixed
  vehiclesRegistered: number; // Aktuelle Anzahl zugelassener Fahrzeuge (letzter Datenpunkt or sum if aggregated)
  dataDate: string; // Datenstand des letzten Datenpunkts (z.B. "01.01.2023")
  registrationHistory: RegistrationHistoryPoint[]; // Timeline data
  imageUrl?: string | null; // URL for the vehicle's image, null if aggregated

  isAggregated?: boolean; // True if this is an aggregated representation of multiple vehicles
  aggregatedVehiclesCount?: number; // Number of vehicles that were aggregated
}

// For search criteria, to be used in VehicleSearchForm and App
export interface SearchFilters {
  fuelType?: string;
  powerKwRange?: string; // e.g. "0-75", "76-150", "151+"
}