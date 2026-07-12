import db from '../../config/db.js';

export const findAll = async ({ status, vehicleId, driverId, search, dateFrom, dateTo, vehicleType, region, limit, offset }) => {
    let query = `
        SELECT t.id, t.source, t.destination, t.vehicle_id as "vehicleId", t.driver_id as "driverId",
               t.cargo_weight as "cargoWeight", t.planned_distance as "plannedDistance",
               t.actual_distance as "actualDistance", t.fuel_consumed as "fuelConsumed",
               t.revenue, t.status, t.dispatched_at as "dispatchedAt", t.completed_at as "completedAt",
               t.cancelled_at as "cancelledAt", t.created_by as "createdBy",
               t.created_at as "createdAt", t.updated_at as "updatedAt",
               v.registration_number as "vehicleRegistration", v.vehicle_name as "vehicleName",
               d.name as "driverName", d.license_number as "driverLicense"
        FROM trips t
        LEFT JOIN vehicles v ON t.vehicle_id = v.id
        LEFT JOIN drivers d ON t.driver_id = d.id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (status) {
        query += ` AND t.status = $${paramIndex++}`;
        params.push(status);
    }
    
    if (vehicleId) {
        query += ` AND t.vehicle_id = $${paramIndex++}`;
        params.push(vehicleId);
    }
    
    if (driverId) {
        query += ` AND t.driver_id = $${paramIndex++}`;
        params.push(driverId);
    }

    if (search) {
        query += ` AND (t.source ILIKE $${paramIndex} OR t.destination ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    if (vehicleType) {
        query += ` AND v.vehicle_type = $${paramIndex++}`;
        params.push(vehicleType);
    }
    
    if (region) {
        query += ` AND v.region = $${paramIndex++}`;
        params.push(region);
    }

    if (dateFrom) {
        query += ` AND t.created_at >= $${paramIndex++}`;
        params.push(dateFrom);
    }
    
    if (dateTo) {
        query += ` AND t.created_at <= $${paramIndex++}`;
        params.push(dateTo);
    }

    query += ` ORDER BY t.id DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const { rows } = await db.query(query, params);
    return rows;
};

export const countAll = async ({ status, vehicleId, driverId, search, dateFrom, dateTo, vehicleType, region }) => {
    let query = `
        SELECT COUNT(*) FROM trips t 
        LEFT JOIN vehicles v ON t.vehicle_id = v.id 
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (status) {
        query += ` AND t.status = $${paramIndex++}`;
        params.push(status);
    }
    
    if (vehicleId) {
        query += ` AND t.vehicle_id = $${paramIndex++}`;
        params.push(vehicleId);
    }
    
    if (driverId) {
        query += ` AND t.driver_id = $${paramIndex++}`;
        params.push(driverId);
    }

    if (search) {
        query += ` AND (t.source ILIKE $${paramIndex} OR t.destination ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    if (vehicleType) {
        query += ` AND v.vehicle_type = $${paramIndex++}`;
        params.push(vehicleType);
    }
    
    if (region) {
        query += ` AND v.region = $${paramIndex++}`;
        params.push(region);
    }
    
    if (dateFrom) {
        query += ` AND t.created_at >= $${paramIndex++}`;
        params.push(dateFrom);
    }
    
    if (dateTo) {
        query += ` AND t.created_at <= $${paramIndex++}`;
        params.push(dateTo);
    }

    const { rows } = await db.query(query, params);
    return parseInt(rows[0].count, 10);
};

export const findById = async (id, client = null) => {
    const query = `
        SELECT t.id, t.source, t.destination, t.vehicle_id as "vehicleId", t.driver_id as "driverId",
               t.cargo_weight as "cargoWeight", t.planned_distance as "plannedDistance",
               t.actual_distance as "actualDistance", t.fuel_consumed as "fuelConsumed",
               t.revenue, t.status, t.dispatched_at as "dispatchedAt", t.completed_at as "completedAt",
               t.cancelled_at as "cancelledAt", t.created_by as "createdBy",
               t.created_at as "createdAt", t.updated_at as "updatedAt",
               v.registration_number as "vehicleRegistration", v.vehicle_name as "vehicleName",
               d.name as "driverName", d.license_number as "driverLicense"
        FROM trips t
        LEFT JOIN vehicles v ON t.vehicle_id = v.id
        LEFT JOIN drivers d ON t.driver_id = d.id
        WHERE t.id = $1
    `;
    const dbClient = client || db;
    const { rows } = await dbClient.query(query, [id]);
    return rows[0];
};

export const create = async ({ source, destination, vehicleId, driverId, cargoWeight, plannedDistance, createdBy }, client = null) => {
    const query = `
        INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, 'Draft', $7)
        RETURNING id, source, destination, vehicle_id as "vehicleId", driver_id as "driverId",
                  cargo_weight as "cargoWeight", planned_distance as "plannedDistance", status, created_by as "createdBy",
                  created_at as "createdAt", updated_at as "updatedAt"
    `;
    const dbClient = client || db;
    const { rows } = await dbClient.query(query, [source, destination, vehicleId, driverId, cargoWeight, plannedDistance, createdBy]);
    return rows[0];
};

export const updateStatus = async (id, status, timestampField, client) => {
    // client is deliberately NOT defaulted here to ensure it's passed from withTransaction
    if (!client) throw new Error('updateStatus requires a transaction client');
    
    // Whitelist timestampField to prevent SQL injection
    const allowedFields = ['dispatched_at', 'completed_at', 'cancelled_at'];
    let timestampUpdate = '';
    if (timestampField && allowedFields.includes(timestampField)) {
        timestampUpdate = `, ${timestampField} = now()`;
    }

    const query = `
        UPDATE trips 
        SET status = $1, updated_at = now()${timestampUpdate}
        WHERE id = $2
        RETURNING *
    `;
    const { rows } = await client.query(query, [status, id]);
    return rows[0];
};

export const updateCompletionDetails = async (id, { actualDistance, fuelConsumed, revenue }, client) => {
    if (!client) throw new Error('updateCompletionDetails requires a transaction client');
    
    const query = `
        UPDATE trips 
        SET actual_distance = $1, fuel_consumed = $2, revenue = $3, updated_at = now()
        WHERE id = $4
    `;
    await client.query(query, [actualDistance, fuelConsumed, revenue ?? 0, id]);
};

export const countActiveTripsForVehicle = async (vehicleId, client = null) => {
    const query = `SELECT COUNT(*) FROM trips WHERE vehicle_id = $1 AND status = 'Dispatched'`;
    const dbClient = client || db;
    const { rows } = await dbClient.query(query, [vehicleId]);
    return parseInt(rows[0].count, 10);
};

export const countActiveTripsForDriver = async (driverId, client = null) => {
    const query = `SELECT COUNT(*) FROM trips WHERE driver_id = $1 AND status = 'Dispatched'`;
    const dbClient = client || db;
    const { rows } = await dbClient.query(query, [driverId]);
    return parseInt(rows[0].count, 10);
};

export const countByStatus = async () => {
    const query = `SELECT status, COUNT(*)::int as count FROM trips GROUP BY status`;
    const { rows } = await db.query(query);
    return rows;
};

export const tripsPerMonth = async (monthsBack = 6) => {
    const query = `
        SELECT date_trunc('month', created_at) as month, COUNT(*)::int as count
        FROM trips
        WHERE created_at >= date_trunc('month', CURRENT_DATE - interval '1 month' * $1)
        GROUP BY month
        ORDER BY month ASC
    `;
    const { rows } = await db.query(query, [monthsBack]);
    return rows;
};

export const revenueByMonth = async (monthsBack = 6) => {
    const query = `
        SELECT
            EXTRACT(MONTH FROM completed_at)::int as month,
            COALESCE(SUM(revenue), 0) as revenue
        FROM trips
        WHERE status = 'Completed'
          AND completed_at >= date_trunc('month', CURRENT_DATE - interval '1 month' * $1)
        GROUP BY EXTRACT(MONTH FROM completed_at)
        ORDER BY month ASC
    `;
    const { rows } = await db.query(query, [monthsBack]);
    return rows;
};

export const analyticsPerVehicle = async () => {
    const query = `
        SELECT
            v.id as "vehicleId",
            v.vehicle_name as "vehicleName",
            v.registration_number as "registrationNumber",
            v.purchase_cost as "purchaseCost",
            COALESCE(SUM(t.revenue), 0) as "totalRevenue",
            COALESCE(SUM(t.fuel_consumed), 0) as "totalFuelLiters",
            COALESCE((SELECT SUM(f.cost) FROM fuel_logs f WHERE f.vehicle_id = v.id), 0) as "totalFuelCost",
            COALESCE((SELECT SUM(m.cost) FROM maintenance_logs m WHERE m.vehicle_id = v.id), 0) as "totalMaintenanceCost"
        FROM vehicles v
        LEFT JOIN trips t ON t.vehicle_id = v.id AND t.status = 'Completed'
        WHERE v.status != 'Retired'
        GROUP BY v.id, v.vehicle_name, v.registration_number, v.purchase_cost
        ORDER BY "totalRevenue" DESC
    `;
    const { rows } = await db.query(query);
    return rows;
};

export const fleetEfficiency = async () => {
    const query = `
        SELECT
            COALESCE(SUM(actual_distance), 0) as "totalDistance",
            COALESCE(SUM(fuel_consumed), 0) as "totalFuel",
            COALESCE(SUM(revenue), 0) as "totalRevenue"
        FROM trips
        WHERE status = 'Completed'
    `;
    const { rows } = await db.query(query);
    return rows[0];
};
