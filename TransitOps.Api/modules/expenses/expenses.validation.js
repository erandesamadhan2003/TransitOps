import { body, query } from 'express-validator';

export const listExpensesRules = [
    query('vehicleId').optional().isInt().withMessage('vehicleId must be an integer'),
    query('tripId').optional().isInt().withMessage('tripId must be an integer'),
    query('category').optional().isIn(['Fuel', 'Maintenance', 'Toll', 'Parking', 'Other']).withMessage('Invalid category'),
    query('dateFrom').optional().isISO8601().withMessage('dateFrom must be a valid ISO8601 date'),
    query('dateTo').optional().isISO8601().withMessage('dateTo must be a valid ISO8601 date'),
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('pageSize must be a positive integer')
];

export const createExpenseRules = [
    body('vehicleId').optional({ nullable: true }).isInt().withMessage('vehicleId must be a valid integer'),
    body('tripId').optional({ nullable: true }).isInt().withMessage('tripId must be a valid integer'),
    body('category').isIn(['Fuel', 'Maintenance', 'Toll', 'Parking', 'Other']).withMessage('Invalid category'),
    body('amount').isFloat({ min: 0 }).withMessage('amount must be a positive number'),
    body('description').optional().isString(),
    body('expenseDate').optional().isISO8601().withMessage('expenseDate must be a valid ISO8601 date')
];
