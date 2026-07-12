import db from '../../config/db.js';

export const getSettings = async () => {
    const query = `
        SELECT depot_name as "depotName", currency, distance_unit as "distanceUnit", updated_at as "updatedAt"
        FROM depot_settings
        WHERE id = 1
    `;
    const { rows } = await db.query(query);
    return rows[0];
};

export const updateSettings = async (fields) => {
    const setClauses = [];
    const params = [];
    let paramIndex = 1;

    const fieldMapping = {
        depotName: 'depot_name',
        currency: 'currency',
        distanceUnit: 'distance_unit'
    };

    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && fieldMapping[key]) {
            setClauses.push(`${fieldMapping[key]} = $${paramIndex++}`);
            params.push(value);
        }
    }

    if (setClauses.length === 0) return getSettings();

    setClauses.push(`updated_at = now()`);
    
    const query = `
        UPDATE depot_settings
        SET ${setClauses.join(', ')}
        WHERE id = 1
        RETURNING depot_name as "depotName", currency, distance_unit as "distanceUnit", updated_at as "updatedAt"
    `;
    
    const { rows } = await db.query(query, params);
    return rows[0];
};
