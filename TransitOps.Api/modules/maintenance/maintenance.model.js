import db from '../../config/db.js';

export const findAll = async ({ vehicleId, status, dateFrom, dateTo, limit, offset }) => {
    let query = `
        SELECT m.id, m.vehicle_id as "vehicleId", m.issue, m.description, 
               m.cost, m.start_date as "startDate", m.end_date as "endDate", 
               m.status, m.created_at as "createdAt", m.updated_at as "updatedAt",
               v.registration_number as "vehicleRegistration", v.vehicle_name as "vehicleName"
        FROM maintenance_logs m
        JOIN vehicles v ON m.vehicle_id = v.id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (vehicleId) {
        query += ` AND m.vehicle_id = $${paramIndex++}`;
        params.push(vehicleId);
    }
    
    if (status) {
        query += ` AND m.status = $${paramIndex++}`;
        params.push(status);
    }

    if (dateFrom) {
        query += ` AND m.start_date >= $${paramIndex++}`;
        params.push(dateFrom);
    }
    
    if (dateTo) {
        query += ` AND m.start_date <= $${paramIndex++}`;
        params.push(dateTo);
    }

    query += ` ORDER BY m.id DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const { rows } = await db.query(query, params);
    return rows;
};

export const countAll = async ({ vehicleId, status, dateFrom, dateTo }) => {
    let query = `SELECT COUNT(*) FROM maintenance_logs m WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (vehicleId) {
        query += ` AND m.vehicle_id = $${paramIndex++}`;
        params.push(vehicleId);
    }
    
    if (status) {
        query += ` AND m.status = $${paramIndex++}`;
        params.push(status);
    }

    if (dateFrom) {
        query += ` AND m.start_date >= $${paramIndex++}`;
        params.push(dateFrom);
    }
    
    if (dateTo) {
        query += ` AND m.start_date <= $${paramIndex++}`;
        params.push(dateTo);
    }

    const { rows } = await db.query(query, params);
    return parseInt(rows[0].count, 10);
};

export const findById = async (id, client = null) => {
    const query = `
        SELECT m.id, m.vehicle_id as "vehicleId", m.issue, m.description, 
               m.cost, m.start_date as "startDate", m.end_date as "endDate", 
               m.status, m.created_at as "createdAt", m.updated_at as "updatedAt",
               v.registration_number as "vehicleRegistration", v.vehicle_name as "vehicleName"
        FROM maintenance_logs m
        JOIN vehicles v ON m.vehicle_id = v.id
        WHERE m.id = $1
    `;
    const dbClient = client || db;
    const { rows } = await dbClient.query(query, [id]);
    return rows[0];
};

export const findOpenRecordForVehicle = async (vehicleId, client = null) => {
    const query = `SELECT id FROM maintenance_logs WHERE vehicle_id = $1 AND status = 'Open' LIMIT 1`;
    const dbClient = client || db;
    const { rows } = await dbClient.query(query, [vehicleId]);
    return rows[0];
};

export const create = async ({ vehicleId, issue, description, cost, startDate }, client) => {
    if (!client) throw new Error('create maintenance requires a transaction client');
    const query = `
        INSERT INTO maintenance_logs (vehicle_id, issue, description, cost, start_date, status)
        VALUES ($1, $2, $3, $4, $5, 'Open')
        RETURNING id, vehicle_id as "vehicleId", issue, description, cost, start_date as "startDate", status, created_at as "createdAt", updated_at as "updatedAt"
    `;
    const { rows } = await client.query(query, [vehicleId, issue, description, cost, startDate]);
    return rows[0];
};

export const close = async (id, { endDate, cost }, client) => {
    if (!client) throw new Error('close maintenance requires a transaction client');
    
    let query = `
        UPDATE maintenance_logs 
        SET status = 'Closed', end_date = $1, updated_at = now()
    `;
    const params = [endDate];
    let paramIndex = 2;

    if (cost !== undefined) {
        query += `, cost = $${paramIndex++}`;
        params.push(cost);
    }
    
    query += ` WHERE id = $${paramIndex} RETURNING *`;
    params.push(id);

    const { rows } = await client.query(query, params);
    return rows[0];
};

export const totalCostByMonth = async (monthsBack = 6) => {
    const query = `
        SELECT date_trunc('month', start_date) as month, COALESCE(SUM(cost), 0) as "totalCost"
        FROM maintenance_logs
        WHERE start_date >= date_trunc('month', CURRENT_DATE - interval '1 month' * $1)
        GROUP BY month
        ORDER BY month ASC
    `;
    const { rows } = await db.query(query, [monthsBack]);
    return rows;
};
