import * as authService from './auth.service.js';
import { success, created } from '../../utils/response.js';

export const register = async (req, res, next) => {
    try {
        const { fullName, email, password, roleName } = req.body;
        const user = await authService.register({ fullName, email, password, roleName });
        return created(res, { message: 'User registered successfully', data: user });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await authService.login({ email, password });
        return success(res, { message: 'Login successful', data });
    } catch (err) {
        next(err);
    }
};

export const me = async (req, res, next) => {
    try {
        const user = await authService.getCurrentUser(req.user.id);
        return success(res, { message: 'Profile retrieved successfully', data: user });
    } catch (err) {
        next(err);
    }
};
