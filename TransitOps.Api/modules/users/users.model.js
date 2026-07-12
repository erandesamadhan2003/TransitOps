import db from '../../config/db.js';

export const findAll = async ({ roleId, isActive, search, limit, offset }) => {
    let query = `
        SELECT u.id, u.full_name as "fullName", u.email, u.is_active, u.created_at, u.updated_at, r.name as "roleName", r.id as "roleId"
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (roleId) {
        query += ` AND u.role_id = $${paramIndex++}`;
        params.push(roleId);
    }
    
    if (isActive !== undefined) {
        query += ` AND u.is_active = $${paramIndex++}`;
        params.push(isActive);
    }

    if (search) {
        query += ` AND (u.full_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    query += ` ORDER BY u.id ASC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const { rows } = await db.query(query, params);
    return rows;
};

export const countAll = async ({ roleId, isActive, search }) => {
    let query = `
        SELECT COUNT(*)
        FROM users u
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (roleId) {
        query += ` AND u.role_id = $${paramIndex++}`;
        params.push(roleId);
    }
    
    if (isActive !== undefined) {
        query += ` AND u.is_active = $${paramIndex++}`;
        params.push(isActive);
    }

    if (search) {
        query += ` AND (u.full_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    const { rows } = await db.query(query, params);
    return parseInt(rows[0].count, 10);
};

export const findById = async (id) => {
    const query = `
        SELECT u.id, u.full_name as "fullName", u.email, u.is_active, u.created_at, u.updated_at, r.name as "roleName", r.id as "roleId"
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

export const findByIdWithHash = async (id) => {
    const query = `
        SELECT u.id, u.password_hash, u.is_active, r.name as "roleName"
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

export const emailTakenByOtherUser = async (email, excludeId) => {
    const query = `SELECT 1 FROM users WHERE email = $1 AND id != $2`;
    const { rows } = await db.query(query, [email, excludeId]);
    return rows.length > 0;
};

export const updateProfile = async (id, { fullName, roleId, isActive }) => {
    const query = `
        UPDATE users 
        SET full_name = COALESCE($1, full_name), 
            role_id = COALESCE($2, role_id), 
            is_active = COALESCE($3, is_active),
            updated_at = now()
        WHERE id = $4
        RETURNING id, full_name as "fullName", email, is_active, created_at, updated_at, role_id
    `;
    const { rows } = await db.query(query, [fullName, roleId, isActive, id]);
    return rows[0];
};

export const updatePasswordHash = async (id, passwordHash) => {
    const query = `
        UPDATE users 
        SET password_hash = $1, updated_at = now() 
        WHERE id = $2
    `;
    await db.query(query, [passwordHash, id]);
};

export const countActiveAdmins = async (adminRoleId) => {
    const query = `SELECT COUNT(*) FROM users WHERE role_id = $1 AND is_active = true`;
    const { rows } = await db.query(query, [adminRoleId]);
    return parseInt(rows[0].count, 10);
};
