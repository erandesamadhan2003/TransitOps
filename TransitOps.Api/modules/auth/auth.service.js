import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import * as authModel from './auth.model.js';
import * as usersModel from '../users/users.model.js';
import { ROLES } from '../../utils/constants.js';
import { ConflictError, BadRequestError, UnauthorizedError, NotFoundError, AccountLockedError, ForbiddenError } from '../../utils/errors.js';

const signToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, roleId: user.role_id || user.roleId, roleName: user.roleName },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
    );
};

export const register = async ({ fullName, email, password, roleName, user }) => {
    // 1. Check for Bootstrap vs standard Admin restriction
    if (roleName === ROLES.ADMIN) {
        const totalUsers = await usersModel.countTotalUsers();
        if (totalUsers > 0) {
            // Not bootstrapping, must be Admin
            if (!user || user.roleName !== ROLES.ADMIN) {
                throw new ForbiddenError('Only Admins can register new users.');
            }
        }
        // If totalUsers === 0, we allow it (bootstrap exception)
    } else {
        // Standard user creation requires Admin
        if (!user || user.roleName !== ROLES.ADMIN) {
            throw new ForbiddenError('Only Admins can register new users.');
        }
    }
    const existingUser = await authModel.findUserByEmail(email);
    if (existingUser) {
        throw new ConflictError('Email already registered');
    }

    const role = await authModel.findRoleByName(roleName);
    if (!role) {
        throw new BadRequestError('Invalid role specified');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await authModel.createUser({ fullName, email, passwordHash, roleId: role.id });
    
    // Add roleName to user object for consistency
    newUser.roleName = role.name;
    return newUser;
};

export const login = async ({ email, password }) => {
    const user = await authModel.findUserByEmail(email);
    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.is_active) {
        throw new UnauthorizedError('User account is deactivated');
    }

    // Check Lockout
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
        throw new AccountLockedError(`Account locked. Try again after ${new Date(user.locked_until).toLocaleTimeString()}`);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        const attempts = await authModel.incrementFailedLoginAttempts(user.id);
        if (attempts >= 5) {
            const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
            await authModel.lockAccount(user.id, lockUntil);
            throw new AccountLockedError('Invalid credentials. Account locked after 5 failed attempts.');
        }
        throw new UnauthorizedError('Invalid email or password');
    }

    // Reset failed login attempts on successful login
    await authModel.resetFailedLoginAttempts(user.id);

    const token = signToken(user);
    
    return {
        token,
        user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            roleName: user.roleName
        }
    };
};

export const getCurrentUser = async (userId) => {
    const user = await authModel.findUserById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};
