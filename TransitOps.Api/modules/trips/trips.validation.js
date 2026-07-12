import { body, query } from 'express-validator';

export const listTripsRules = [
    query('status').optional().isIn(['Draft', 'Dispatched', 'Completed', 'Cancelled']).withMessage('Invalid status'),
    query('vehicleId').optional().isInt().withMessage('vehicleId must be an integer'),
    query('driverId').optional().isInt().withMessage('driverId must be an integer'),
    query('dateFrom').optional().isISO8601().withMessage('dateFrom must be a valid ISO8601 date'),
    query('dateTo').optional().isISO8601().withMessage('dateTo must be a valid ISO8601 date'),
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('pageSize must be a positive integer')
];

export const createTripRules = [
    body('source').trim().notEmpty().withMessage('Source is required'),
    body('destination').trim().notEmpty().withMessage('Destination is required'),
    body('vehicleId').isInt().withMessage('vehicleId must be a valid integer'),
    body('driverId').isInt().withMessage('driverId must be a valid integer'),
    body('cargoWeight').isFloat({ min: 0 }).withMessage('cargoWeight must be a positive number'),
    body('plannedDistance').optional().isFloat({ min: 0 }).withMessage('plannedDistance must be a positive number')
];

export const completeTripRules = [
    body('finalOdometer').isFloat({ min: 0 }).withMessage('finalOdometer must be a positive number'),
    body('fuelConsumed').isFloat({ min: 0 }).withMessage('fuelConsumed must be a positive number'),
    body('revenue').optional().isFloat({ min: 0 }).withMessage('revenue must be a non-negative number')
];
