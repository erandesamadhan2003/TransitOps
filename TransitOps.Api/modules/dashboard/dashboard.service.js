import * as vehiclesModel from '../vehicles/vehicles.model.js';
import * as driversModel from '../drivers/drivers.model.js';
import * as tripsModel from '../trips/trips.model.js';
import * as fuelModel from '../fuel/fuel.model.js';
import * as maintenanceModel from '../maintenance/maintenance.model.js';

export const getKPIs = async (filters = {}) => {
    const [vehicleCounts, vehicleUtilization, driverCounts, tripCounts] = await Promise.all([
        vehiclesModel.countByStatus(filters),
        vehiclesModel.fleetUtilization(filters),
        driversModel.countByStatus(),
        tripsModel.countByStatus()
    ]);

    // Flatten vehicle counts
    const activeVehicles = vehicleCounts.find(v => v.status === 'On Trip')?.count || 0;
    const availableVehicles = vehicleCounts.find(v => v.status === 'Available')?.count || 0;
    const vehiclesInShop = vehicleCounts.find(v => v.status === 'In Shop')?.count || 0;
    const retiredVehicles = vehicleCounts.find(v => v.status === 'Retired')?.count || 0;

    // Flatten driver counts
    const driversAvailable = driverCounts.find(d => d.status === 'Available')?.count || 0;
    const driversOnTrip = driverCounts.find(d => d.status === 'On Trip')?.count || 0;

    // Flatten trip counts
    const activeTrips = tripCounts.find(t => t.status === 'Dispatched')?.count || 0;
    const pendingTrips = tripCounts.find(t => t.status === 'Draft')?.count || 0;

    // Compute utilization %
    let fleetUtilizationPercent = 0;
    if (vehicleUtilization.active_total > 0) {
        fleetUtilizationPercent = (vehicleUtilization.on_trip / vehicleUtilization.active_total) * 100;
        fleetUtilizationPercent = Math.round(fleetUtilizationPercent * 100) / 100; // round to 2 decimals
    }

    return {
        activeVehicles,
        availableVehicles,
        vehiclesInShop,
        retiredVehicles,
        activeTrips,
        pendingTrips,
        driversAvailable,
        driversOnTrip,
        fleetUtilizationPercent
    };
};

export const getCharts = async (monthsBack = 6) => {
    const [tripsPerMonth, fuelCostPerMonth, maintenanceCostPerMonth, vehicleUtilization] = await Promise.all([
        tripsModel.tripsPerMonth(monthsBack),
        fuelModel.totalCostByMonth(monthsBack),
        maintenanceModel.totalCostByMonth(monthsBack),
        vehiclesModel.utilizationPerVehicle()
    ]);

    return {
        tripsPerMonth,
        fuelCostPerMonth,
        maintenanceCostPerMonth,
        vehicleUtilization
    };
};
