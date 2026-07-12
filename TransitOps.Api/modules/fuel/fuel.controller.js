import * as fuelService from './fuel.service.js';
import { success, created } from '../../utils/response.js';

export const list = async (req, res, next) => {
    try {
        const { vehicleId, tripId, dateFrom, dateTo, page, pageSize } = req.query;
        const result = await fuelService.listFuelLogs({ vehicleId, tripId, dateFrom, dateTo, page, pageSize });
        return success(res, { message: 'Fuel logs retrieved successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const log = await fuelService.getFuelLogById(req.params.id);
        return success(res, { message: 'Fuel log retrieved successfully', data: log });
    } catch (err) {
        next(err);
    }
};

export const create = async (req, res, next) => {
    try {
        const log = await fuelService.createFuelLog(req.body);
        return created(res, { message: 'Fuel log created successfully', data: log });
    } catch (err) {
        next(err);
    }
};

export const remove = async (req, res, next) => {
    try {
        await fuelService.deleteFuelLog(req.params.id);
        return success(res, { message: 'Fuel log deleted successfully' });
    } catch (err) {
        next(err);
    }
};
