CREATE TABLE IF NOT EXISTS fuel_logs (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    trip_id INTEGER REFERENCES trips(id),
    liters NUMERIC(10,2) NOT NULL CHECK (liters > 0),
    cost NUMERIC(12,2) NOT NULL CHECK (cost >= 0),
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fuel_vehicle ON fuel_logs(vehicle_id);
