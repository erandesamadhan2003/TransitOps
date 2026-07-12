import * as vehiclesService from './vehicles.service.js';
import { success, created } from '../../utils/response.js';
import { BadRequestError } from '../../utils/errors.js';

export const list = async (req, res, next) => {
    try {
        const { status, vehicleType, region, search, page, pageSize } = req.query;
        const result = await vehiclesService.listVehicles({ status, vehicleType, region, search, page, pageSize });
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
