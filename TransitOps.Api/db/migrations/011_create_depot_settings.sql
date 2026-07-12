CREATE TABLE IF NOT EXISTS depot_settings (
    id SERIAL PRIMARY KEY,
    depot_name VARCHAR(255) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    distance_unit VARCHAR(10) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO depot_settings (id, depot_name, currency, distance_unit) 
VALUES (1, 'Main Depot', 'USD', 'km') 
ON CONFLICT (id) DO NOTHING;
