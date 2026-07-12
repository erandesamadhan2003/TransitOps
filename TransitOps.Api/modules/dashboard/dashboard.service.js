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

    // driversOnDuty = Available + On Trip (active workforce)
    const driversOnDuty = parseInt(driversAvailable, 10) + parseInt(driversOnTrip, 10);

    return {
        activeVehicles,
        availableVehicles,
        vehiclesInShop,
        retiredVehicles,
        activeTrips,
        pendingTrips,
        driversAvailable,
        driversOnTrip,
        driversOnDuty,
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

export const getAnalytics = async () => {
    const [perVehicle, efficiency, revenueByMonth] = await Promise.all([
        tripsModel.analyticsPerVehicle(),
        tripsModel.fleetEfficiency(),
        tripsModel.revenueByMonth(6)
    ]);

    // Enrich each vehicle row with computed metrics
    const vehicles = perVehicle.map(v => {
        const totalCost = parseFloat(v.totalFuelCost) + parseFloat(v.totalMaintenanceCost);
        const totalRevenue = parseFloat(v.totalRevenue);
        const purchaseCost = parseFloat(v.purchaseCost) || 0;
        const roi = purchaseCost > 0
            ? Math.round(((totalRevenue - totalCost) / purchaseCost) * 10000) / 100
            : null;
        return {
            ...v,
            totalCost: Math.round(totalCost * 100) / 100,
            roi
        };
    });

    const totalDistance = parseFloat(efficiency.totalDistance) || 0;
    const totalFuel = parseFloat(efficiency.totalFuel) || 0;
    const fuelEfficiencyKmL = totalFuel > 0
        ? Math.round((totalDistance / totalFuel) * 100) / 100
        : null;

    return {
        vehicles,
        revenueByMonth,
        fuelEfficiencyKmL,
        totalRevenue: parseFloat(efficiency.totalRevenue) || 0
    };
};
