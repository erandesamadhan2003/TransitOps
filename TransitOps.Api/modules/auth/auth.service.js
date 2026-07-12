import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import * as authModel from './auth.model.js';
import { ConflictError, BadRequestError, UnauthorizedError, NotFoundError } from '../../utils/errors.js';

const signToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, roleId: user.role_id || user.roleId, roleName: user.roleName },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
    );
};

export const register = async ({ fullName, email, password, roleName }) => {
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
    
    // Add roleName to user object for consistency
    user.roleName = role.name;
    return user;
};

export const login = async ({ email, password }) => {
    const user = await authModel.findUserByEmail(email);
    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.is_active) {
        throw new UnauthorizedError('User account is deactivated');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new UnauthorizedError('Invalid email or password');
    }

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
