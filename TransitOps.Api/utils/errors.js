export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}

export class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 422);
        this.errors = errors;
    }
}

export class AccountLockedError extends AppError {
    constructor(message, retryAfterSeconds) {
        super(message, 423);
        this.retryAfterSeconds = retryAfterSeconds;
    }
}
