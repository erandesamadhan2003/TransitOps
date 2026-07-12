import bcrypt from 'bcrypt';
import * as usersModel from './users.model.js';
import * as authModel from '../auth/auth.model.js';
import { NotFoundError, BadRequestError, ForbiddenError, ConflictError, UnauthorizedError } from '../../utils/errors.js';
import { ROLES } from '../../utils/constants.js';

export const listUsers = async ({ roleName, isActive, search, page = 1, pageSize = 20 }) => {
    let roleId = null;
    if (roleName) {
        const role = await authModel.findRoleByName(roleName);
        if (!role) throw new BadRequestError('Invalid role filter');
        roleId = role.id;
    }

    const limit = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limit;
    
    let isActiveBool = undefined;
    if (isActive !== undefined && isActive !== '') {
        isActiveBool = isActive === 'true';
    }

    const filters = { roleId, isActive: isActiveBool, search, limit, offset };
    const users = await usersModel.findAll(filters);
    const total = await usersModel.countAll(filters);

    return {
        users,
        pagination: {
            page: Math.max(parseInt(page, 10) || 1, 1),
            pageSize: limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getUserById = async (id) => {
    const user = await usersModel.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
};

export const updateUser = async (id, { fullName, roleName, isActive }, requestingUser) => {
    const targetUser = await usersModel.findById(id);
    if (!targetUser) throw new NotFoundError('User not found');

    let roleId = undefined;
    if (roleName) {
        const role = await authModel.findRoleByName(roleName);
        if (!role) throw new BadRequestError('Invalid role specified');
        roleId = role.id;
    }

    // Self-demotion guard
    if (requestingUser.id === parseInt(id, 10) && isActive === false) {
        throw new ForbiddenError('You cannot deactivate your own account');
    }

    // Last-admin guard
    if (targetUser.roleName === ROLES.ADMIN) {
        const isRemovingAdmin = (roleName && roleName !== ROLES.ADMIN) || isActive === false;
        if (isRemovingAdmin) {
            const adminRole = await authModel.findRoleByName(ROLES.ADMIN);
            const activeAdminsCount = await usersModel.countActiveAdmins(adminRole.id);
            if (activeAdminsCount <= 1) {
                throw new ConflictError('Cannot remove or deactivate the last active Admin');
            }
        }
    }

    const updatedUser = await usersModel.updateProfile(id, { fullName, roleId, isActive });
    if (roleName) updatedUser.roleName = roleName;
    else updatedUser.roleName = targetUser.roleName;

    return updatedUser;
};

export const changePassword = async (targetId, { currentPassword, newPassword }, requestingUser) => {
    const targetUser = await usersModel.findByIdWithHash(targetId);
    if (!targetUser) throw new NotFoundError('User not found');

    const isSelfService = requestingUser.id === parseInt(targetId, 10);
    const isAdminReset = requestingUser.roleName === ROLES.ADMIN;

    if (!isSelfService && !isAdminReset) {
        throw new ForbiddenError("You do not have permission to change this user's password");
    }

    if (isSelfService) {
        if (!currentPassword) {
            throw new BadRequestError('Current password is required to change your own password');
        }
        const isMatch = await bcrypt.compare(currentPassword, targetUser.password_hash);
        if (!isMatch) {
            throw new UnauthorizedError('Current password is incorrect');
        }
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await usersModel.updatePasswordHash(targetId, passwordHash);
};

export const deactivateUser = async (id, requestingUser) => {
    return updateUser(id, { isActive: false }, requestingUser);
};

export const activateUser = async (id) => {
    return updateUser(id, { isActive: true }, { id: -1 }); 
};

export const createUserByAdmin = async ({ fullName, email, password, roleName }) => {
    const existingUser = await authModel.findUserByEmail(email);
    if (existingUser) {
        throw new ConflictError('Email already registered');
    }

    const role = await authModel.findRoleByName(roleName);
    if (!role) {
        throw new BadRequestError('Invalid role specified');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await authModel.createUser({ fullName, email, passwordHash, roleId: role.id });
    
    user.roleName = role.name;
    return user;
};

export const bulkImportUsers = async (rows) => {
    let created = 0;
    let updated = 0;
    const errors = [];
    const validRoles = Object.values(ROLES).map(r => r.toLowerCase());

    for (const row of rows) {
        try {
            const { rowNumber, fullName, email, password, roleName } = row;
            
            if (!fullName || !email || !roleName) {
                errors.push({ row: rowNumber, email, reason: 'Missing required fields (Full Name, Email, or Role)' });
                continue;
            }

            const lowerRoleName = roleName.toLowerCase();
            const matchedRole = Object.values(ROLES).find(r => r.toLowerCase() === lowerRoleName);
            
            if (!matchedRole) {
                errors.push({ row: rowNumber, email, reason: `Invalid role: ${roleName}` });
                continue;
            }

            const existingUser = await authModel.findUserByEmail(email);
            
            if (existingUser) {
                const roleObj = await authModel.findRoleByName(matchedRole);
                await usersModel.updateProfile(existingUser.id, { fullName, roleId: roleObj.id, isActive: true });
                updated++;
            } else {
                if (!password || password.length < 8) {
                    errors.push({ row: rowNumber, email, reason: 'Password is required and must be at least 8 characters long for new users' });
                    continue;
                }
                const roleObj = await authModel.findRoleByName(matchedRole);
                const passwordHash = await bcrypt.hash(password, 10);
                await authModel.createUser({ fullName, email, passwordHash, roleId: roleObj.id });
                created++;
            }
        } catch (err) {
            errors.push({ row: row?.rowNumber, email: row?.email, reason: err.message });
        }
    }

    return {
        totalRows: rows.length,
        created,
        updated,
        skipped: errors.length,
        errors
    };
};
