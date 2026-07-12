import * as fuelModel from './fuel.model.js';
import * as vehiclesModel from '../vehicles/vehicles.model.js';
import * as tripsModel from '../trips/trips.model.js';
import { NotFoundError } from '../../utils/errors.js';

export const listFuelLogs = async ({ vehicleId, tripId, dateFrom, dateTo, page = 1, pageSize = 20 }) => {
    const limit = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limit;

    const filters = { vehicleId, tripId, dateFrom, dateTo, limit, offset };
    const logs = await fuelModel.findAll(filters);
    const total = await fuelModel.countAll(filters);

    return {
        logs,
        pagination: {
            page: Math.max(parseInt(page, 10) || 1, 1),
            pageSize: limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getFuelLogById = async (id) => {
    const log = await fuelModel.findById(id);
    if (!log) throw new NotFoundError('Fuel log not found');
    return log;
};

export const createFuelLog = async (data) => {
    const vehicle = await vehiclesModel.findById(data.vehicleId);
    if (!vehicle) throw new NotFoundError('Vehicle not found');

    if (data.tripId) {
        const trip = await tripsModel.findById(data.tripId);
        if (!trip) throw new NotFoundError('Trip not found');
    }

    return fuelModel.create(data);
};

export const deleteFuelLog = async (id) => {
    const log = await fuelModel.findById(id);
    if (!log) throw new NotFoundError('Fuel log not found');

    await fuelModel.deleteById(id);
    return true;
};
