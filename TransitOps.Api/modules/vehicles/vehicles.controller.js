import * as vehiclesService from './vehicles.service.js';
import { generateCsv } from '../../utils/csv.js';
import { success, created } from '../../utils/response.js';
import { BadRequestError } from '../../utils/errors.js';

export const list = async (req, res, next) => {
    try {
        const { status, vehicleType, region, search, page, pageSize, format } = req.query;
        const limit = format === 'csv' ? 10000 : pageSize;
        const result = await vehiclesService.listVehicles({ status, vehicleType, region, search, page, pageSize: limit });
        
        if (format === 'csv') {
            const csv = generateCsv(result.vehicles);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="vehicles.csv"');
            return res.send(csv);
        }

        return success(res, { message: 'Vehicles retrieved successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const vehicle = await vehiclesService.getVehicleById(req.params.id);
        return success(res, { message: 'Vehicle retrieved successfully', data: vehicle });
    } catch (err) {
        next(err);
    }
};

export const create = async (req, res, next) => {
    try {
        const vehicle = await vehiclesService.createVehicle(req.body);
        return created(res, { message: 'Vehicle created successfully', data: vehicle });
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const vehicle = await vehiclesService.updateVehicle(req.params.id, req.body);
        return success(res, { message: 'Vehicle updated successfully', data: vehicle });
    } catch (err) {
        next(err);
    }
};

export const retire = async (req, res, next) => {
    try {
        const vehicle = await vehiclesService.retireVehicle(req.params.id);
        return success(res, { message: 'Vehicle retired successfully', data: vehicle });
    } catch (err) {
        next(err);
    }
};

export const uploadPhoto = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new BadRequestError('No photo uploaded');
        }
        const vehicle = await vehiclesService.uploadVehiclePhoto(req.params.id, req.file);
        return success(res, { message: 'Vehicle photo uploaded successfully', data: vehicle });
    } catch (err) {
        next(err);
    }
};

export const listDocuments = async (req, res, next) => {
    try {
        const docs = await vehiclesService.getVehicleDocuments(req.params.id);
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
        const doc = await vehiclesService.uploadVehicleDocument(req.params.id, req.file, docType, expiryDate);
        return created(res, { message: 'Document uploaded successfully', data: doc });
    } catch (err) {
        next(err);
    }
};

export const deleteDocument = async (req, res, next) => {
    try {
        await vehiclesService.deleteVehicleDocument(req.params.id, req.params.docId);
        return success(res, { message: 'Document deleted successfully' });
    } catch (err) {
        next(err);
    }
};

