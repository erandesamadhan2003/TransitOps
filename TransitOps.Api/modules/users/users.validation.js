import { body, query } from 'express-validator';
import { ROLES } from '../../utils/constants.js';

export const listUsersRules = [
    query('roleName').optional().isIn(Object.values(ROLES)).withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
    query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('pageSize must be a positive integer'),
];

export const updateUserRules = [
    body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty if provided'),
    body('roleName').optional().isIn(Object.values(ROLES)).withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

export const changePasswordRules = [
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
    body('currentPassword').optional().isString()
];
