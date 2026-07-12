import * as tripsService from './trips.service.js';
import { generateCsv } from '../../utils/csv.js';
import { success, created } from '../../utils/response.js';

export const list = async (req, res, next) => {
    try {
        const { status, vehicleId, driverId, search, dateFrom, dateTo, page, pageSize, format } = req.query;
        const limit = format === 'csv' ? 10000 : pageSize;
        const result = await tripsService.listTrips({ status, vehicleId, driverId, search, dateFrom, dateTo, page, pageSize: limit });

        if (format === 'csv') {
            const csv = generateCsv(result.trips);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="trips.csv"');
            return res.send(csv);
        }

        return success(res, { message: 'Trips retrieved successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const trip = await tripsService.getTripById(req.params.id);
        return success(res, { message: 'Trip retrieved successfully', data: trip });
    } catch (err) {
        next(err);
    }
};

export const create = async (req, res, next) => {
    try {
        const trip = await tripsService.createTrip(req.body, req.user);
        return created(res, { message: 'Trip created successfully', data: trip });
    } catch (err) {
        next(err);
    }
};

export const dispatchTrip = async (req, res, next) => {
    try {
        const trip = await tripsService.dispatchTrip(req.params.id);
        return success(res, { message: 'Trip dispatched successfully', data: trip });
    } catch (err) {
        next(err);
    }
};

export const complete = async (req, res, next) => {
    try {
        const trip = await tripsService.completeTrip(req.params.id, req.body);
        return success(res, { message: 'Trip completed successfully', data: trip });
    } catch (err) {
        next(err);
    }
};

export const cancel = async (req, res, next) => {
    try {
        const trip = await tripsService.cancelTrip(req.params.id);
        return success(res, { message: 'Trip cancelled successfully', data: trip });
    } catch (err) {
        next(err);
    }
};
