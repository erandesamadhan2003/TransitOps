import { body, query } from 'express-validator';

export const listVehiclesRules = [
    query('status').optional().isIn(['Available', 'On Trip', 'In Shop', 'Retired']).withMessage('Invalid status'),
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('pageSize must be a positive integer')
];

export const createVehicleRules = [
    body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
    body('vehicleName').trim().notEmpty().withMessage('Vehicle name is required'),
    body('vehicleType').trim().notEmpty().withMessage('Vehicle type is required'),
    body('maxCapacity').isFloat({ gt: 0 }).withMessage('Max capacity must be greater than 0'),
    body('odometer').optional().isFloat({ min: 0 }).withMessage('Odometer must be non-negative'),
    body('purchaseCost').optional().isFloat({ min: 0 }).withMessage('Purchase cost must be non-negative'),
    body('purchaseDate').optional().isISO8601().withMessage('Purchase date must be a valid ISO8601 date'),
    body('region').optional().isString()
];

export const updateVehicleRules = [
    body('registrationNumber').optional().trim().notEmpty().withMessage('Registration number cannot be empty'),
    body('vehicleName').optional().trim().notEmpty().withMessage('Vehicle name cannot be empty'),
    body('vehicleType').optional().trim().notEmpty().withMessage('Vehicle type cannot be empty'),
    body('maxCapacity').optional().isFloat({ gt: 0 }).withMessage('Max capacity must be greater than 0'),
    body('odometer').optional().isFloat({ min: 0 }).withMessage('Odometer must be non-negative'),
    body('purchaseCost').optional().isFloat({ min: 0 }).withMessage('Purchase cost must be non-negative'),
    body('purchaseDate').optional().isISO8601().withMessage('Purchase date must be a valid ISO8601 date'),
    body('region').optional().isString(),
    body('status').custom((value) => {
        if (value !== undefined) {
            throw new Error('Status cannot be updated via this endpoint');
        }
        return true;
    })
];
