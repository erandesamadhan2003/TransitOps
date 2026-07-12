import * as driversService from './drivers.service.js';
import { generateCsv } from '../../utils/csv.js';
import { success, created } from '../../utils/response.js';
import { BadRequestError } from '../../utils/errors.js';

export const list = async (req, res, next) => {
    try {
        const { status, licenseCategory, search, expiringWithinDays, page, pageSize, format } = req.query;
        const limit = format === 'csv' ? 10000 : pageSize;
        const result = await driversService.listDrivers({ status, licenseCategory, search, expiringWithinDays, page, pageSize: limit });

        if (format === 'csv') {
            const csv = generateCsv(result.drivers);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="drivers.csv"');
            return res.send(csv);
        }

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

export const setOffDuty = async (req, res, next) => {
    try {
        const driver = await driversService.setOffDuty(req.params.id);
        return success(res, { message: 'Driver set to Off Duty', data: driver });
    } catch (err) {
        next(err);
    }
};

export const wakeDriver = async (req, res, next) => {
    try {
        const driver = await driversService.wakeDriver(req.params.id);
        return success(res, { message: 'Driver returned to Available', data: driver });
    } catch (err) {
        next(err);
    }
};

export const verify = async (req, res, next) => {
    try {
        const driver = await driversService.verifyDriver(req.params.id);
        return success(res, { message: 'Driver verified successfully', data: driver });
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

export const listDocuments = async (req, res, next) => {
    try {
        const docs = await driversService.getDriverDocuments(req.params.id);
        return success(res, { message: 'Documents retrieved successfully', data: docs });
    } catch (err) {
        next(err);
    }
};

export const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new BadRequestError('No document uploaded');
        }
        const { docType, expiryDate } = req.body;
        if (!docType) {
            throw new BadRequestError('docType is required');
        }
        const doc = await driversService.uploadDriverDocument(req.params.id, req.file, docType, expiryDate);
        return created(res, { message: 'Document uploaded successfully', data: doc });
    } catch (err) {
        next(err);
    }
};

export const deleteDocument = async (req, res, next) => {
    try {
        await driversService.deleteDriverDocument(req.params.id, req.params.docId);
        return success(res, { message: 'Document deleted successfully' });
    } catch (err) {
        next(err);
    }
};

export const verifyDocument = async (req, res, next) => {
    try {
        const { isVerified } = req.body;
        if (typeof isVerified !== 'boolean') {
            throw new BadRequestError('isVerified must be a boolean');
        }
        const doc = await driversService.verifyDocument(req.params.id, req.params.docId, isVerified);
        return success(res, { message: 'Document verification updated successfully', data: doc });
    } catch (err) {
        next(err);
    }
};

