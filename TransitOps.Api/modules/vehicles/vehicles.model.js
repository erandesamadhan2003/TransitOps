import db from '../../config/db.js';

export const findAll = async ({ status, vehicleType, region, search, limit, offset }) => {
    let query = `
        SELECT id, registration_number as "registrationNumber", vehicle_name as "vehicleName", 
               vehicle_type as "vehicleType", max_capacity as "maxCapacity", odometer, 
               purchase_cost as "purchaseCost", purchase_date as "purchaseDate", status, 
               region, photo_path as "photoPath", created_at, updated_at
        FROM vehicles 
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (status) {
        query += ` AND status = $${paramIndex++}`;
        params.push(status);
    }
    
    if (vehicleType) {
        query += ` AND vehicle_type = $${paramIndex++}`;
        params.push(vehicleType);
    }

    if (region) {
        query += ` AND region = $${paramIndex++}`;
        params.push(region);
    }

    if (search) {
        query += ` AND (vehicle_name ILIKE $${paramIndex} OR registration_number ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    query += ` ORDER BY id ASC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const { rows } = await db.query(query, params);
    return rows;
};

export const countAll = async ({ status, vehicleType, region, search }) => {
    let query = `SELECT COUNT(*) FROM vehicles WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (status) {
        query += ` AND status = $${paramIndex++}`;
        params.push(status);
    }
    
    if (vehicleType) {
        query += ` AND vehicle_type = $${paramIndex++}`;
        params.push(vehicleType);
    }

    if (region) {
        query += ` AND region = $${paramIndex++}`;
        params.push(region);
    }

    if (search) {
        query += ` AND (vehicle_name ILIKE $${paramIndex} OR registration_number ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    const { rows } = await db.query(query, params);
    return parseInt(rows[0].count, 10);
};

export const findById = async (id) => {
    const query = `
        SELECT id, registration_number as "registrationNumber", vehicle_name as "vehicleName", 
               vehicle_type as "vehicleType", max_capacity as "maxCapacity", odometer, 
               purchase_cost as "purchaseCost", purchase_date as "purchaseDate", status, 
               region, photo_path as "photoPath", created_at, updated_at
        FROM vehicles WHERE id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

export const findByRegistrationNumber = async (regNumber) => {
    const query = `SELECT id FROM vehicles WHERE registration_number = $1`;
    const { rows } = await db.query(query, [regNumber]);
    return rows[0];
};

export const create = async ({ registrationNumber, vehicleName, vehicleType, maxCapacity, odometer, purchaseCost, purchaseDate, region }) => {
    const query = `
        INSERT INTO vehicles (registration_number, vehicle_name, vehicle_type, max_capacity, odometer, purchase_cost, purchase_date, region)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, registration_number as "registrationNumber", vehicle_name as "vehicleName", 
                  vehicle_type as "vehicleType", max_capacity as "maxCapacity", odometer, 
                  purchase_cost as "purchaseCost", purchase_date as "purchaseDate", status, 
                  region, photo_path as "photoPath", created_at, updated_at
    `;
    const { rows } = await db.query(query, [registrationNumber, vehicleName, vehicleType, maxCapacity, odometer, purchaseCost, purchaseDate, region]);
    return rows[0];
};

export const update = async (id, fields) => {
    const setClauses = [];
    const params = [];
    let paramIndex = 1;

    // Mapping camelCase to snake_case for DB
    const fieldMapping = {
        registrationNumber: 'registration_number',
        vehicleName: 'vehicle_name',
        vehicleType: 'vehicle_type',
        maxCapacity: 'max_capacity',
        odometer: 'odometer',
        purchaseCost: 'purchase_cost',
        purchaseDate: 'purchase_date',
        region: 'region'
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
        UPDATE vehicles
        SET ${setClauses.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, registration_number as "registrationNumber", vehicle_name as "vehicleName", 
                  vehicle_type as "vehicleType", max_capacity as "maxCapacity", odometer, 
                  purchase_cost as "purchaseCost", purchase_date as "purchaseDate", status, 
                  region, photo_path as "photoPath", created_at, updated_at
    `;
    
    const { rows } = await db.query(query, params);
    return rows[0];
};

export const updateStatus = async (id, status, client = null) => {
    const query = `UPDATE vehicles SET status = $1, updated_at = now() WHERE id = $2`;
    const dbClient = client || db;
    await dbClient.query(query, [status, id]);
};

export const updatePhotoPath = async (id, photoPath) => {
    const query = `UPDATE vehicles SET photo_path = $1, updated_at = now() WHERE id = $2`;
    await db.query(query, [photoPath, id]);
};

export const isReferencedByTrips = async (id) => {
    const query = `SELECT 1 FROM trips WHERE vehicle_id = $1 LIMIT 1`;
    const { rows } = await db.query(query, [id]);
    return rows.length > 0;
};
