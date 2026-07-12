import { error } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
    if (err.isOperational) {
        return error(res, {
            message: err.message,
            statusCode: err.statusCode,
            errors: err.errors
        });
    }

    // Programming or other unknown error
    console.error('ERROR 💥', err);
    return error(res, {
        message: 'Internal Server Error',
        statusCode: 500
    });
};
