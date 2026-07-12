import { body, query } from 'express-validator';

export const listMaintenanceRules = [
    query('status').optional().isIn(['Open', 'Closed']).withMessage('Invalid status'),
    query('vehicleId').optional().isInt().withMessage('vehicleId must be an integer'),
    query('dateFrom').optional().isISO8601().withMessage('dateFrom must be a valid ISO8601 date'),
    query('dateTo').optional().isISO8601().withMessage('dateTo must be a valid ISO8601 date'),
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('pageSize must be a positive integer')
];

export const createMaintenanceRules = [
    body('vehicleId').isInt().withMessage('vehicleId must be a valid integer'),
    body('issue').trim().notEmpty().withMessage('Issue is required'),
    body('description').optional().isString(),
    body('cost').optional().isFloat({ min: 0 }).withMessage('cost must be a positive number'),
    body('startDate').isISO8601().withMessage('startDate must be a valid ISO8601 date')
];

export const closeMaintenanceRules = [
    body('endDate').isISO8601().withMessage('endDate must be a valid ISO8601 date'),
    body('cost').optional().isFloat({ min: 0 }).withMessage('cost must be a positive number')
];
