import { body, query } from 'express-validator';

export const listDriversRules = [
    query('status').optional().isIn(['Available', 'On Trip', 'Suspended']).withMessage('Invalid status'),
    query('expiringWithinDays').optional().isInt({ gt: 0 }).withMessage('expiringWithinDays must be a positive integer'),
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('pageSize must be a positive integer')
];

export const createDriverRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('licenseNumber').trim().notEmpty().withMessage('License number is required'),
    body('licenseCategory').trim().notEmpty().withMessage('License category is required'),
    body('licenseExpiry').isISO8601().withMessage('License expiry must be a valid ISO8601 date'),
    body('contactNumber').trim().notEmpty().withMessage('Contact number is required'),
    body('safetyScore').optional().isInt({ min: 0, max: 100 }).withMessage('Safety score must be between 0 and 100')
];

export const updateDriverRules = [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('licenseNumber').optional().trim().notEmpty().withMessage('License number cannot be empty'),
    body('licenseCategory').optional().trim().notEmpty().withMessage('License category cannot be empty'),
    body('licenseExpiry').optional().isISO8601().withMessage('License expiry must be a valid ISO8601 date'),
    body('contactNumber').optional().trim().notEmpty().withMessage('Contact number cannot be empty'),
    body('status').custom((value) => {
        if (value !== undefined) {
            throw new Error('Status cannot be updated via this endpoint');
        }
        return true;
    }),
    body('safetyScore').custom((value) => {
        if (value !== undefined) {
            throw new Error('Safety score cannot be updated via this endpoint');
        }
        return true;
    })
];

export const updateSafetyScoreRules = [
    body('safetyScore').isInt({ min: 0, max: 100 }).withMessage('Safety score must be an integer between 0 and 100')
];
