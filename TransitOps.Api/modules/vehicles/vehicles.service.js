import * as vehiclesModel from './vehicles.model.js';
import { ConflictError, NotFoundError, BadRequestError } from '../../utils/errors.js';
import path from 'path';

export const listVehicles = async ({ status, vehicleType, region, search, page = 1, pageSize = 20 }) => {
    const limit = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limit;

    const filters = { status, vehicleType, region, search, limit, offset };
    const vehicles = await vehiclesModel.findAll(filters);
    const total = await vehiclesModel.countAll(filters);

    return {
        vehicles,
        pagination: {
            page: Math.max(parseInt(page, 10) || 1, 1),
            pageSize: limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getVehicleById = async (id) => {
    const vehicle = await vehiclesModel.findById(id);
    if (!vehicle) throw new NotFoundError('Vehicle not found');
    return vehicle;
};

export const createVehicle = async (data) => {
    const existing = await vehiclesModel.findByRegistrationNumber(data.registrationNumber);
    if (existing) {
        throw new ConflictError('Vehicle with this registration number already exists');
    }
    
    // Constraints are handled by DB and express-validator, so we can just create
    return vehiclesModel.create(data);
};

export const updateVehicle = async (id, data) => {
    const vehicle = await vehiclesModel.findById(id);
    if (!vehicle) throw new NotFoundError('Vehicle not found');

    if (data.status !== undefined) {
        throw new BadRequestError('Use the dedicated status endpoints to change vehicle status');
    }

    if (data.registrationNumber && data.registrationNumber !== vehicle.registrationNumber) {
        const existing = await vehiclesModel.findByRegistrationNumber(data.registrationNumber);
        if (existing) {
            throw new ConflictError('Vehicle with this registration number already exists');
        }
    }

    return vehiclesModel.update(id, data);
};

export const retireVehicle = async (id) => {
    const vehicle = await vehiclesModel.findById(id);
    if (!vehicle) throw new NotFoundError('Vehicle not found');

    if (vehicle.status === 'On Trip') {
        throw new ConflictError('Cannot retire a vehicle that is currently on a trip');
    }

    await vehiclesModel.updateStatus(id, 'Retired');
    return { ...vehicle, status: 'Retired' };
};

export const uploadVehiclePhoto = async (id, file) => {
    const vehicle = await vehiclesModel.findById(id);
    if (!vehicle) throw new NotFoundError('Vehicle not found');
    
    // We store the relative path inside uploads/vehicles/
    const relativePath = path.join('vehicles', file.filename);
    await vehiclesModel.updatePhotoPath(id, relativePath);
    
    return { ...vehicle, photoPath: relativePath };
};

export const getVehicleDocuments = async (vehicleId) => {
    await getVehicleById(vehicleId);
    return await vehiclesModel.getDocuments(vehicleId);
};

export const uploadVehicleDocument = async (vehicleId, file, docType, expiryDate) => {
    await getVehicleById(vehicleId);
    const filePath = `/uploads/vehicles/${file.filename}`;
    return await vehiclesModel.addDocument(vehicleId, docType, filePath, expiryDate);
};

export const deleteVehicleDocument = async (vehicleId, docId) => {
    const deleted = await vehiclesModel.deleteDocument(vehicleId, docId);
    if (!deleted) throw new NotFoundError('Document not found for this vehicle');
    return deleted;
};
