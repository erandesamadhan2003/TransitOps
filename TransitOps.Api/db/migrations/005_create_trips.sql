CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    source VARCHAR(200) NOT NULL,
    destination VARCHAR(200) NOT NULL,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    driver_id INTEGER NOT NULL REFERENCES drivers(id),
    cargo_weight NUMERIC(10,2) NOT NULL CHECK (cargo_weight >= 0),
    planned_distance NUMERIC(10,2),
    actual_distance NUMERIC(10,2),
    fuel_consumed NUMERIC(10,2),
    status VARCHAR(20) NOT NULL DEFAULT 'Draft'
        CHECK (status IN ('Draft', 'Dispatched', 'Completed', 'Cancelled')),
    dispatched_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_vehicle ON trips(vehicle_id);
CREATE INDEX idx_trips_driver ON trips(driver_id);
