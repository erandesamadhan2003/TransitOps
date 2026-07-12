import * as driversModel from './drivers.model.js';
import { ConflictError, NotFoundError, BadRequestError } from '../../utils/errors.js';
import path from 'path';

export const listDrivers = async ({ status, licenseCategory, search, expiringWithinDays, page = 1, pageSize = 20 }) => {
    const limit = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limit;

    let expiringBefore = undefined;
    if (expiringWithinDays !== undefined && expiringWithinDays !== '') {
        const days = parseInt(expiringWithinDays, 10);
        if (!isNaN(days) && days > 0) {
            const date = new Date();
            date.setDate(date.getDate() + days);
            // Format as YYYY-MM-DD
            expiringBefore = date.toISOString().split('T')[0];
        }
    }

    const filters = { status, licenseCategory, search, expiringBefore, limit, offset };
    const drivers = await driversModel.findAll(filters);
    const total = await driversModel.countAll(filters);

    return {
        drivers,
        pagination: {
            page: Math.max(parseInt(page, 10) || 1, 1),
            pageSize: limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getDriverById = async (id) => {
    const driver = await driversModel.findById(id);
    if (!driver) throw new NotFoundError('Driver not found');
    return driver;
};

export const createDriver = async (data) => {
    const existing = await driversModel.findByLicenseNumber(data.licenseNumber);
    if (existing) {
        throw new ConflictError('Driver with this license number already exists');
    }
    
    const expiryDate = new Date(data.licenseExpiry);
    const now = new Date();
    // Compare just the dates
    expiryDate.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    
    if (expiryDate <= now) {
        throw new BadRequestError('License expiry must be a future date');
    }

    return driversModel.create(data);
};

export const updateDriver = async (id, data) => {
    const driver = await driversModel.findById(id);
    if (!driver) throw new NotFoundError('Driver not found');

    if (data.status !== undefined) {
        throw new BadRequestError('Use the dedicated status endpoints to change driver status');
    }

    if (data.safetyScore !== undefined) {
        throw new BadRequestError('Use the dedicated safety score endpoint to change safety score');
    }

    if (data.licenseNumber && data.licenseNumber !== driver.licenseNumber) {
        const existing = await driversModel.findByLicenseNumber(data.licenseNumber);
        if (existing) {
            throw new ConflictError('Driver with this license number already exists');
        }
    }

    return driversModel.update(id, data);
};

export const updateSafetyScore = async (id, safetyScore) => {
    const driver = await driversModel.findById(id);
    if (!driver) throw new NotFoundError('Driver not found');

    if (safetyScore < 0 || safetyScore > 100) {
        throw new BadRequestError('Safety score must be between 0 and 100');
    }

    await driversModel.updateSafetyScore(id, safetyScore);
    return { ...driver, safetyScore };
};

export const suspendDriver = async (id) => {
    const driver = await driversModel.findById(id);
    if (!driver) throw new NotFoundError('Driver not found');

    if (driver.status === 'On Trip') {
        throw new ConflictError('Cannot suspend a driver currently on a trip');
    }

    await driversModel.updateStatus(id, 'Suspended');
    return { ...driver, status: 'Suspended' };
};

export const reinstateDriver = async (id) => {
    const driver = await driversModel.findById(id);
    if (!driver) throw new NotFoundError('Driver not found');

    const expiryDate = new Date(driver.licenseExpiry);
    const now = new Date();
    expiryDate.setHours(0,0,0,0);
    now.setHours(0,0,0,0);

    if (expiryDate < now) {
        throw new ConflictError('Cannot reinstate a driver with an expired license; update license expiry first');
    }

    await driversModel.updateStatus(id, 'Available');
    return { ...driver, status: 'Available' };
};

export const uploadDriverPhoto = async (id, file) => {
    const driver = await driversModel.findById(id);
    if (!driver) throw new NotFoundError('Driver not found');
    
    const relativePath = path.join('drivers', file.filename);
    await driversModel.updatePhotoPath(id, relativePath);
    
    return { ...driver, photoPath: relativePath };
};

export const getDriverDocuments = async (driverId) => {
    await getDriverById(driverId);
    return await driversModel.getDocuments(driverId);
};

export const uploadDriverDocument = async (driverId, file, docType, expiryDate) => {
    await getDriverById(driverId);
    const filePath = `/uploads/drivers/${file.filename}`;
    return await driversModel.addDocument(driverId, docType, filePath, expiryDate);
};

export const deleteDriverDocument = async (driverId, docId) => {
    const deleted = await driversModel.deleteDocument(driverId, docId);
    if (!deleted) throw new NotFoundError('Document not found for this driver');
    return deleted;
};
