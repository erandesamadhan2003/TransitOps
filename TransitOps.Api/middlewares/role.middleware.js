import { ForbiddenError } from '../utils/errors.js';

export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ForbiddenError('Not authenticated'));
        }
        
        if (!allowedRoles.includes(req.user.roleName)) {
            return next(new ForbiddenError(`Requires one of the following roles: ${allowedRoles.join(', ')}`));
        }
        
        next();
    };
};
