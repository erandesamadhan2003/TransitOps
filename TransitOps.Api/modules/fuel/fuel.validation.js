import { body, query } from 'express-validator';

export const listFuelLogsRules = [
    query('vehicleId').optional().isInt().withMessage('vehicleId must be an integer'),
    query('tripId').optional().isInt().withMessage('tripId must be an integer'),
    query('dateFrom').optional().isISO8601().withMessage('dateFrom must be a valid ISO8601 date'),
    query('dateTo').optional().isISO8601().withMessage('dateTo must be a valid ISO8601 date'),
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('pageSize must be a positive integer')
];

export const createFuelLogRules = [
    body('vehicleId').isInt().withMessage('vehicleId must be a valid integer'),
    body('tripId').optional({ nullable: true }).isInt().withMessage('tripId must be a valid integer'),
    body('liters').isFloat({ gt: 0 }).withMessage('liters must be greater than 0'),
    body('cost').isFloat({ min: 0 }).withMessage('cost must be a positive number'),
    body('logDate').optional().isISO8601().withMessage('logDate must be a valid ISO8601 date')
];
