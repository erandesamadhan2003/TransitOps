CREATE TABLE IF NOT EXISTS vehicle_documents (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL,
    file_path TEXT NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS driver_documents (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL,
    file_path TEXT NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vehicle_docs_vehicle ON vehicle_documents(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_driver_docs_driver ON driver_documents(driver_id);
