CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_name VARCHAR(150) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    max_capacity NUMERIC(10,2) NOT NULL CHECK (max_capacity > 0),
    odometer NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (odometer >= 0),
    purchase_cost NUMERIC(12,2),
    purchase_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Available'
        CHECK (status IN ('Available', 'On Trip', 'In Shop', 'Retired')),
    region VARCHAR(100),
    photo_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
