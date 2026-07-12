import { validationResult } from 'express-validator';
import { ValidationError } from './errors.js';

export const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => ({ [err.path]: err.msg }));
        return next(new ValidationError('Validation failed', extractedErrors));
    }
    next();
};
