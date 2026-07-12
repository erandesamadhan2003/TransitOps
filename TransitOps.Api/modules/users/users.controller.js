import * as usersService from './users.service.js';
import { success } from '../../utils/response.js';

export const list = async (req, res, next) => {
    try {
        const { roleName, isActive, search, page, pageSize } = req.query;
        const result = await usersService.listUsers({ roleName, isActive, search, page, pageSize });
        return success(res, { message: 'Users retrieved successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const user = await usersService.getUserById(req.params.id);
        return success(res, { message: 'User retrieved successfully', data: user });
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const { fullName, roleName, isActive } = req.body;
        const updatedUser = await usersService.updateUser(req.params.id, { fullName, roleName, isActive }, req.user);
        return success(res, { message: 'User updated successfully', data: updatedUser });
    } catch (err) {
        next(err);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await usersService.changePassword(req.params.id, { currentPassword, newPassword }, req.user);
        return success(res, { message: 'Password changed successfully' });
    } catch (err) {
        next(err);
    }
};

export const deactivate = async (req, res, next) => {
    try {
        const updatedUser = await usersService.deactivateUser(req.params.id, req.user);
        return success(res, { message: 'User deactivated successfully', data: updatedUser });
    } catch (err) {
        next(err);
    }
};

export const activate = async (req, res, next) => {
    try {
        const updatedUser = await usersService.activateUser(req.params.id);
        return success(res, { message: 'User activated successfully', data: updatedUser });
    } catch (err) {
        next(err);
    }
};
