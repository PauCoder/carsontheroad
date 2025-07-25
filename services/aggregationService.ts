import type { VehicleData, RegistrationHistoryPoint } from '../types';
import { 
    AGGREGATED_HSN, 
    AGGREGATED_TSN,
    MIXED_DATA_KEY,
    NOT_APPLICABLE_KEY
} from '../constants';

function getConsolidatedValue<T>(values: (T | undefined | null)[], mixedKey: string, notApplicableKey: string): T | null | string {
    const validValues = values.filter(v => v !== undefined && v !== null && v !== '') as T[];
    if (validValues.length === 0) return notApplicableKey;
    
    const uniqueValues = new Set(validValues.map(v => typeof v === 'string' ? v.trim() : v));
    if (uniqueValues.size === 1) return uniqueValues.values().next().value;
    
    return mixedKey;
}

export const createAggregatedVehicleData = (
    vehicles: VehicleData[],
    manufacturer: string,
    baseModelName?: string // This is the baseModelUrlName
): VehicleData | null => {
    if (!vehicles || vehicles.length === 0) {
        return null;
    }

    const historyMap = new Map<string, number>();
    let latestDataDate = "";

    vehicles.forEach(vehicle => {
        vehicle.registrationHistory.forEach(point => {
            historyMap.set(point.date, (historyMap.get(point.date) || 0) + point.count);
        });
        if (vehicle.dataDate && (!latestDataDate || new Date(vehicle.dataDate.split('.').reverse().join('-')) > new Date(latestDataDate.split('.').reverse().join('-')))) {
            latestDataDate = vehicle.dataDate;
        }
    });

    const aggregatedHistory: RegistrationHistoryPoint[] = Array.from(historyMap, ([date, count]) => ({ date, count }))
        .sort((a, b) => {
            const dateA = new Date(a.date.split('.').reverse().join('-')).getTime();
            const dateB = new Date(b.date.split('.').reverse().join('-')).getTime();
            return dateA - dateB;
        });

    const totalVehiclesRegistered = vehicles.reduce((sum, v) => sum + v.vehiclesRegistered, 0);
    
    // For commercialName, we'll store the German default and reconstruct translation in components
    const aggCommercialName = `Alle ${baseModelName || manufacturer} (Aggregiert)`;


    return {
        hsn: AGGREGATED_HSN,
        tsn: AGGREGATED_TSN,
        manufacturer: manufacturer, 
        modelSeries: getConsolidatedValue(vehicles.map(v => v.modelSeries), MIXED_DATA_KEY, NOT_APPLICABLE_KEY) as string | undefined,
        commercialName: aggCommercialName, // Store a default name, components will handle i18n display
        baseModelUrlName: baseModelName || NOT_APPLICABLE_KEY, 
        powerKw: getConsolidatedValue(vehicles.map(v => v.powerKw), MIXED_DATA_KEY, NOT_APPLICABLE_KEY) as number | null,
        engineCapacityCcm: getConsolidatedValue(vehicles.map(v => v.engineCapacityCcm), MIXED_DATA_KEY, NOT_APPLICABLE_KEY) as number | null,
        fuelType: getConsolidatedValue(vehicles.map(v => v.fuelType), MIXED_DATA_KEY, NOT_APPLICABLE_KEY) as string | null,
        bodyStyle: getConsolidatedValue(vehicles.map(v => v.bodyStyle), MIXED_DATA_KEY, NOT_APPLICABLE_KEY) as string | undefined | null,
        numberOfDoors: getConsolidatedValue(vehicles.map(v => v.numberOfDoors), MIXED_DATA_KEY, NOT_APPLICABLE_KEY) as number | undefined | null,
        emissionClass: getConsolidatedValue(vehicles.map(v => v.emissionClass), MIXED_DATA_KEY, NOT_APPLICABLE_KEY) as string | undefined | null,
        vehiclesRegistered: totalVehiclesRegistered,
        dataDate: latestDataDate || NOT_APPLICABLE_KEY,
        registrationHistory: aggregatedHistory,
        imageUrl: null, 
        isAggregated: true,
        aggregatedVehiclesCount: vehicles.length,
    };
};
