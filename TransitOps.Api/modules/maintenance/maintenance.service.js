import * as maintenanceModel from './maintenance.model.js';
import * as vehiclesModel from '../vehicles/vehicles.model.js';
import { withTransaction } from '../../config/db.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';

export const listMaintenanceRecords = async ({ vehicleId, status, dateFrom, dateTo, page = 1, pageSize = 20 }) => {
    const limit = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limit;

    const filters = { vehicleId, status, dateFrom, dateTo, limit, offset };
    const records = await maintenanceModel.findAll(filters);
    const total = await maintenanceModel.countAll(filters);

    return {
        records,
        pagination: {
            page: Math.max(parseInt(page, 10) || 1, 1),
            pageSize: limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getMaintenanceById = async (id) => {
    const record = await maintenanceModel.findById(id);
    if (!record) throw new NotFoundError('Maintenance record not found');
    return record;
};

export const createMaintenanceRecord = async (data) => {
    const vehicle = await vehiclesModel.findById(data.vehicleId);
    if (!vehicle) throw new NotFoundError('Vehicle not found');

    if (vehicle.status === 'On Trip') {
        throw new ConflictError('Cannot open a maintenance record for a vehicle currently on a trip');
    }
    if (vehicle.status === 'Retired') {
        throw new ConflictError('Cannot open a maintenance record for a retired vehicle');
    }

    const openRecord = await maintenanceModel.findOpenRecordForVehicle(data.vehicleId);
    if (openRecord) {
        throw new ConflictError('This vehicle already has an open maintenance record');
    }

    return await withTransaction(async (client) => {
        const record = await maintenanceModel.create(data, client);
        await vehiclesModel.updateStatus(data.vehicleId, 'In Shop', client);
        return await maintenanceModel.findById(record.id, client);
    });
};

export const closeMaintenanceRecord = async (id, data) => {
    const record = await maintenanceModel.findById(id);
    if (!record) throw new NotFoundError('Maintenance record not found');
    
    if (record.status !== 'Open') {
        throw new ConflictError('Maintenance record is already closed');
    }

    const vehicle = await vehiclesModel.findById(record.vehicleId);

    return await withTransaction(async (client) => {
        await maintenanceModel.close(id, data, client);
        
        if (vehicle.status !== 'Retired') {
            await vehiclesModel.updateStatus(record.vehicleId, 'Available', client);
        }
        
        return await maintenanceModel.findById(id, client);
    });
};
