import db from '../../config/db.js';

export const findAll = async ({ status, licenseCategory, search, expiringBefore, limit, offset }) => {
    let query = `
        SELECT id, name, license_number as "licenseNumber", license_category as "licenseCategory",
               license_expiry as "licenseExpiry", contact_number as "contactNumber",
               safety_score as "safetyScore", status, photo_path as "photoPath",
               created_at, updated_at
        FROM drivers
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (status) {
        query += ` AND status = $${paramIndex++}`;
        params.push(status);
    }
    
    if (licenseCategory) {
        query += ` AND license_category = $${paramIndex++}`;
        params.push(licenseCategory);
    }

    if (search) {
        query += ` AND (name ILIKE $${paramIndex} OR license_number ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    if (expiringBefore) {
        query += ` AND license_expiry <= $${paramIndex++}`;
        params.push(expiringBefore);
    }

    query += ` ORDER BY id ASC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const { rows } = await db.query(query, params);
    return rows;
};

export const countAll = async ({ status, licenseCategory, search, expiringBefore }) => {
    let query = `SELECT COUNT(*) FROM drivers WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (status) {
        query += ` AND status = $${paramIndex++}`;
        params.push(status);
    }
    
    if (licenseCategory) {
        query += ` AND license_category = $${paramIndex++}`;
        params.push(licenseCategory);
    }

    if (search) {
        query += ` AND (name ILIKE $${paramIndex} OR license_number ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    if (expiringBefore) {
        query += ` AND license_expiry <= $${paramIndex++}`;
        params.push(expiringBefore);
    }

    const { rows } = await db.query(query, params);
    return parseInt(rows[0].count, 10);
};

export const findById = async (id) => {
    const query = `
        SELECT id, name, license_number as "licenseNumber", license_category as "licenseCategory",
               license_expiry as "licenseExpiry", contact_number as "contactNumber",
               safety_score as "safetyScore", status, photo_path as "photoPath",
               created_at, updated_at
        FROM drivers WHERE id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

export const findByLicenseNumber = async (licenseNumber) => {
    const query = `SELECT id FROM drivers WHERE license_number = $1`;
    const { rows } = await db.query(query, [licenseNumber]);
    return rows[0];
};

export const create = async ({ name, licenseNumber, licenseCategory, licenseExpiry, contactNumber, safetyScore, status }) => {
    const query = `
        INSERT INTO drivers (name, license_number, license_category, license_expiry, contact_number, safety_score, status)
        VALUES ($1, $2, $3, $4, $5, COALESCE($6, 100), COALESCE($7, 'Available'))
        RETURNING id, name, license_number as "licenseNumber", license_category as "licenseCategory",
                  license_expiry as "licenseExpiry", contact_number as "contactNumber",
                  safety_score as "safetyScore", status, photo_path as "photoPath",
                  created_at, updated_at
    `;
    const { rows } = await db.query(query, [name, licenseNumber, licenseCategory, licenseExpiry, contactNumber, safetyScore, status]);
    return rows[0];
};

export const update = async (id, fields) => {
    const setClauses = [];
    const params = [];
    let paramIndex = 1;

    const fieldMapping = {
        name: 'name',
        licenseNumber: 'license_number',
        licenseCategory: 'license_category',
        licenseExpiry: 'license_expiry',
        contactNumber: 'contact_number'
    };

    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && fieldMapping[key]) {
            setClauses.push(`${fieldMapping[key]} = $${paramIndex++}`);
            params.push(value);
        }
    }

    if (setClauses.length === 0) return findById(id);

    setClauses.push(`updated_at = now()`);
    params.push(id);
    
    const query = `
        UPDATE drivers
        SET ${setClauses.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, name, license_number as "licenseNumber", license_category as "licenseCategory",
                  license_expiry as "licenseExpiry", contact_number as "contactNumber",
                  safety_score as "safetyScore", status, photo_path as "photoPath",
                  created_at, updated_at
    `;
    
    const { rows } = await db.query(query, params);
    return rows[0];
};

export const updateStatus = async (id, status, client = null) => {
    const query = `UPDATE drivers SET status = $1, updated_at = now() WHERE id = $2`;
    const dbClient = client || db;
    await dbClient.query(query, [status, id]);
};

export const updateSafetyScore = async (id, safetyScore) => {
    const query = `
        UPDATE drivers SET safety_score = $1, updated_at = now() 
        WHERE id = $2
        RETURNING safety_score as "safetyScore"
    `;
    const { rows } = await db.query(query, [safetyScore, id]);
    return rows[0];
};

export const updatePhotoPath = async (id, photoPath) => {
    const query = `UPDATE drivers SET photo_path = $1, updated_at = now() WHERE id = $2`;
    await db.query(query, [photoPath, id]);
};
