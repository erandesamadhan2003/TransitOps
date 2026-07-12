import * as driversService from './drivers.service.js';
import { success, created } from '../../utils/response.js';
import { BadRequestError } from '../../utils/errors.js';

export const list = async (req, res, next) => {
    try {
        const { status, licenseCategory, search, expiringWithinDays, page, pageSize } = req.query;
        const result = await driversService.listDrivers({ status, licenseCategory, search, expiringWithinDays, page, pageSize });
        return success(res, { message: 'Drivers retrieved successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const driver = await driversService.getDriverById(req.params.id);
        return success(res, { message: 'Driver retrieved successfully', data: driver });
    } catch (err) {
        next(err);
    }
};

export const create = async (req, res, next) => {
    try {
        const driver = await driversService.createDriver(req.body);
        return created(res, { message: 'Driver created successfully', data: driver });
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const driver = await driversService.updateDriver(req.params.id, req.body);
        return success(res, { message: 'Driver updated successfully', data: driver });
    } catch (err) {
        next(err);
    }
};

export const updateSafetyScore = async (req, res, next) => {
    try {
        const driver = await driversService.updateSafetyScore(req.params.id, req.body.safetyScore);
        return success(res, { message: 'Safety score updated successfully', data: driver });
    } catch (err) {
        next(err);
    }
};

export const suspend = async (req, res, next) => {
    try {
        const driver = await driversService.suspendDriver(req.params.id);
        return success(res, { message: 'Driver suspended successfully', data: driver });
    } catch (err) {
        next(err);
    }
};

export const reinstate = async (req, res, next) => {
    try {
        const driver = await driversService.reinstateDriver(req.params.id);
        return success(res, { message: 'Driver reinstated successfully', data: driver });
    } catch (err) {
        next(err);
    }
};

export const uploadPhoto = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new BadRequestError('No photo uploaded');
        }
        const driver = await driversService.uploadDriverPhoto(req.params.id, req.file);
        return success(res, { message: 'Driver photo uploaded successfully', data: driver });
    } catch (err) {
        next(err);
    }
};
