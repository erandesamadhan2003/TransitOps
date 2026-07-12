import db from '../../config/db.js';

export const findAll = async ({ vehicleId, tripId, dateFrom, dateTo, limit, offset }) => {
    let query = `
        SELECT f.id, f.vehicle_id as "vehicleId", f.trip_id as "tripId", 
               f.liters, f.cost, f.log_date as "logDate", 
               f.created_at as "createdAt", f.updated_at as "updatedAt",
               v.registration_number as "vehicleRegistration"
        FROM fuel_logs f
        JOIN vehicles v ON f.vehicle_id = v.id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (vehicleId) {
        query += ` AND f.vehicle_id = $${paramIndex++}`;
        params.push(vehicleId);
    }
    
    if (tripId) {
        query += ` AND f.trip_id = $${paramIndex++}`;
        params.push(tripId);
    }

    if (dateFrom) {
        query += ` AND f.log_date >= $${paramIndex++}`;
        params.push(dateFrom);
    }
    
    if (dateTo) {
        query += ` AND f.log_date <= $${paramIndex++}`;
        params.push(dateTo);
    }

    query += ` ORDER BY f.id DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const { rows } = await db.query(query, params);
    return rows;
};

export const countAll = async ({ vehicleId, tripId, dateFrom, dateTo }) => {
    let query = `SELECT COUNT(*) FROM fuel_logs f WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (vehicleId) {
        query += ` AND f.vehicle_id = $${paramIndex++}`;
        params.push(vehicleId);
    }
    
    if (tripId) {
        query += ` AND f.trip_id = $${paramIndex++}`;
        params.push(tripId);
    }

    if (dateFrom) {
        query += ` AND f.log_date >= $${paramIndex++}`;
        params.push(dateFrom);
    }
    
    if (dateTo) {
        query += ` AND f.log_date <= $${paramIndex++}`;
        params.push(dateTo);
    }

    const { rows } = await db.query(query, params);
    return parseInt(rows[0].count, 10);
};

export const findById = async (id) => {
    const query = `
        SELECT f.id, f.vehicle_id as "vehicleId", f.trip_id as "tripId", 
               f.liters, f.cost, f.log_date as "logDate", 
               f.created_at as "createdAt", f.updated_at as "updatedAt",
               v.registration_number as "vehicleRegistration"
        FROM fuel_logs f
        JOIN vehicles v ON f.vehicle_id = v.id
        WHERE f.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

export const create = async ({ vehicleId, tripId, liters, cost, logDate }) => {
    let query, params;
    
    if (logDate) {
        query = `
            INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, log_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, vehicle_id as "vehicleId", trip_id as "tripId", liters, cost, log_date as "logDate", created_at as "createdAt"
        `;
        params = [vehicleId, tripId, liters, cost, logDate];
    } else {
        query = `
            INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost)
            VALUES ($1, $2, $3, $4)
            RETURNING id, vehicle_id as "vehicleId", trip_id as "tripId", liters, cost, log_date as "logDate", created_at as "createdAt"
        `;
        params = [vehicleId, tripId, liters, cost];
    }
    
    const { rows } = await db.query(query, params);
    return rows[0];
};

export const deleteById = async (id) => {
    const query = `DELETE FROM fuel_logs WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows.length > 0;
};

export const sumCostByVehicle = async (vehicleId, { dateFrom, dateTo }) => {
    let query = `SELECT COALESCE(SUM(cost), 0) as "totalCost", COALESCE(SUM(liters), 0) as "totalLiters" FROM fuel_logs WHERE vehicle_id = $1`;
    const params = [vehicleId];
    let paramIndex = 2;

    if (dateFrom) {
        query += ` AND log_date >= $${paramIndex++}`;
        params.push(dateFrom);
    }
    if (dateTo) {
        query += ` AND log_date <= $${paramIndex++}`;
        params.push(dateTo);
    }

    const { rows } = await db.query(query, params);
    return rows[0];
};

export const totalCostByMonth = async (monthsBack = 6) => {
    const query = `
        SELECT date_trunc('month', log_date) as month, COALESCE(SUM(cost), 0) as "totalCost"
        FROM fuel_logs
        WHERE log_date >= date_trunc('month', CURRENT_DATE - interval '1 month' * $1)
        GROUP BY month
        ORDER BY month ASC
    `;
    const { rows } = await db.query(query, [monthsBack]);
    return rows;
};
