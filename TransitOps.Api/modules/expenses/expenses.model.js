import db from '../../config/db.js';

export const findAll = async ({ vehicleId, tripId, category, dateFrom, dateTo, limit, offset }) => {
    let query = `
        SELECT e.id, e.vehicle_id as "vehicleId", e.trip_id as "tripId", 
               e.category, e.amount, e.description, e.expense_date as "expenseDate", 
               e.created_at as "createdAt", e.updated_at as "updatedAt",
               v.registration_number as "vehicleRegistration"
        FROM expenses e
        LEFT JOIN vehicles v ON e.vehicle_id = v.id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (vehicleId) {
        query += ` AND e.vehicle_id = $${paramIndex++}`;
        params.push(vehicleId);
    }
    
    if (tripId) {
        query += ` AND e.trip_id = $${paramIndex++}`;
        params.push(tripId);
    }

    if (category) {
        query += ` AND e.category = $${paramIndex++}`;
        params.push(category);
    }

    if (dateFrom) {
        query += ` AND e.expense_date >= $${paramIndex++}`;
        params.push(dateFrom);
    }
    
    if (dateTo) {
        query += ` AND e.expense_date <= $${paramIndex++}`;
        params.push(dateTo);
    }

    query += ` ORDER BY e.id DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const { rows } = await db.query(query, params);
    return rows;
};

export const countAll = async ({ vehicleId, tripId, category, dateFrom, dateTo }) => {
    let query = `SELECT COUNT(*) FROM expenses e WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (vehicleId) {
        query += ` AND e.vehicle_id = $${paramIndex++}`;
        params.push(vehicleId);
    }
    
    if (tripId) {
        query += ` AND e.trip_id = $${paramIndex++}`;
        params.push(tripId);
    }
    
    if (category) {
        query += ` AND e.category = $${paramIndex++}`;
        params.push(category);
    }

    if (dateFrom) {
        query += ` AND e.expense_date >= $${paramIndex++}`;
        params.push(dateFrom);
    }
    
    if (dateTo) {
        query += ` AND e.expense_date <= $${paramIndex++}`;
        params.push(dateTo);
    }

    const { rows } = await db.query(query, params);
    return parseInt(rows[0].count, 10);
};

export const findById = async (id) => {
    const query = `
        SELECT e.id, e.vehicle_id as "vehicleId", e.trip_id as "tripId", 
               e.category, e.amount, e.description, e.expense_date as "expenseDate", 
               e.created_at as "createdAt", e.updated_at as "updatedAt",
               v.registration_number as "vehicleRegistration"
        FROM expenses e
        LEFT JOIN vehicles v ON e.vehicle_id = v.id
        WHERE e.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

export const create = async ({ vehicleId, tripId, category, amount, description, expenseDate }) => {
    let query, params;
    
    if (expenseDate) {
        query = `
            INSERT INTO expenses (vehicle_id, trip_id, category, amount, description, expense_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, vehicle_id as "vehicleId", trip_id as "tripId", category, amount, description, expense_date as "expenseDate", created_at as "createdAt"
        `;
        params = [vehicleId, tripId, category, amount, description, expenseDate];
    } else {
        query = `
            INSERT INTO expenses (vehicle_id, trip_id, category, amount, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, vehicle_id as "vehicleId", trip_id as "tripId", category, amount, description, expense_date as "expenseDate", created_at as "createdAt"
        `;
        params = [vehicleId, tripId, category, amount, description];
    }
    
    const { rows } = await db.query(query, params);
    return rows[0];
};

export const deleteById = async (id) => {
    const query = `DELETE FROM expenses WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows.length > 0;
};

export const sumAmountByVehicle = async (vehicleId, { category, dateFrom, dateTo }) => {
    let query = `SELECT category, COALESCE(SUM(amount), 0) as "totalAmount" FROM expenses WHERE vehicle_id = $1`;
    const params = [vehicleId];
    let paramIndex = 2;

    if (category) {
        query += ` AND category = $${paramIndex++}`;
        params.push(category);
    }
    if (dateFrom) {
        query += ` AND expense_date >= $${paramIndex++}`;
        params.push(dateFrom);
    }
    if (dateTo) {
        query += ` AND expense_date <= $${paramIndex++}`;
        params.push(dateTo);
    }
    
    query += ` GROUP BY category`;

    const { rows } = await db.query(query, params);
    return rows;
};
