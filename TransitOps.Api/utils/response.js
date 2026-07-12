export const success = (res, { message, data, statusCode = 200 }) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data
    });
};

export const created = (res, { message, data }) => {
    return success(res, { message, data, statusCode: 201 });
};

export const error = (res, { message, statusCode, errors, retryAfterSeconds }) => {
    const payload = {
        status: 'error',
        message
    };
    if (errors && errors.length > 0) {
        payload.errors = errors;
    }
    if (retryAfterSeconds !== undefined) {
        payload.retryAfterSeconds = retryAfterSeconds;
    }
    return res.status(statusCode || 500).json(payload);
};
