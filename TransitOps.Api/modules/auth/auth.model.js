import db from '../../config/db.js';

export const findUserByEmail = async (email) => {
    const query = `
        SELECT u.*, r.name as "roleName" 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.email = $1
    `;
    const { rows } = await db.query(query, [email]);
    return rows[0];
};

export const findUserById = async (id) => {
    const query = `
        SELECT u.id, u.full_name, u.email, u.is_active, u.created_at, u.updated_at, r.name as "roleName", r.id as "roleId"
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

export const findRoleByName = async (roleName) => {
    const query = `SELECT * FROM roles WHERE name = $1`;
    const { rows } = await db.query(query, [roleName]);
    return rows[0];
};

export const createUser = async ({ fullName, email, passwordHash, roleId }) => {
    const query = `
        INSERT INTO users (full_name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, full_name as "fullName", email, is_active, created_at, updated_at, role_id
    `;
    const { rows } = await db.query(query, [fullName, email, passwordHash, roleId]);
    return rows[0];
};
