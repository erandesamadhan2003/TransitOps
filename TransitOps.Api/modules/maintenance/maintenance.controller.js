import * as maintenanceService from './maintenance.service.js';
import { success, created } from '../../utils/response.js';

export const list = async (req, res, next) => {
    try {
        const { vehicleId, status, dateFrom, dateTo, page, pageSize } = req.query;
        const result = await maintenanceService.listMaintenanceRecords({ vehicleId, status, dateFrom, dateTo, page, pageSize });
        return success(res, { message: 'Maintenance records retrieved successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const record = await maintenanceService.getMaintenanceById(req.params.id);
        return success(res, { message: 'Maintenance record retrieved successfully', data: record });
    } catch (err) {
        next(err);
    }
};

export const create = async (req, res, next) => {
    try {
        const record = await maintenanceService.createMaintenanceRecord(req.body);
        return created(res, { message: 'Maintenance record created successfully', data: record });
    } catch (err) {
        next(err);
    }
};

export const close = async (req, res, next) => {
    try {
        const record = await maintenanceService.closeMaintenanceRecord(req.params.id, req.body);
        return success(res, { message: 'Maintenance record closed successfully', data: record });
    } catch (err) {
        next(err);
    }
};
