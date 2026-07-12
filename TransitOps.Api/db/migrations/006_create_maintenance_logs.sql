CREATE TABLE IF NOT EXISTS maintenance_logs (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    issue VARCHAR(200) NOT NULL,
    description TEXT,
    cost NUMERIC(12,2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Open'
        CHECK (status IN ('Open', 'Closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle ON maintenance_logs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_logs(status);
