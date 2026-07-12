import * as usersService from './users.service.js';
import * as usersImport from './users.import.js';
import { success, created } from '../../utils/response.js';
import { BadRequestError } from '../../utils/errors.js';

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

export const create = async (req, res, next) => {
    try {
        const { fullName, email, password, roleName } = req.body;
        const user = await usersService.createUserByAdmin({ fullName, email, password, roleName });
        return created(res, { message: 'User created successfully', data: user });
    } catch (err) {
        next(err);
    }
};

export const remove = async (req, res, next) => {
    // Alias to deactivate to fulfill standard DELETE route structure
    return deactivate(req, res, next);
};

export const downloadTemplate = (req, res, next) => {
    try {
        const buffer = usersImport.generateImportTemplate();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="user_import_template.xlsx"');
        res.send(buffer);
    } catch (err) {
        next(err);
    }
};

export const bulkImport = async (req, res, next) => {
    try {
        if (!req.file || !req.file.buffer) {
            throw new BadRequestError('No file uploaded or file is invalid');
        }

        const rows = usersImport.parseImportFile(req.file.buffer);
        const result = await usersService.bulkImportUsers(rows);

        const msg = `Added ${result.created} users, updated ${result.updated}. ${result.skipped} rows skipped.`;
        return success(res, { message: msg, data: result });
    } catch (err) {
        next(err);
    }
};
