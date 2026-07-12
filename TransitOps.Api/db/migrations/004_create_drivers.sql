CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_category VARCHAR(20) NOT NULL,
    license_expiry DATE NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    safety_score INTEGER NOT NULL DEFAULT 100 CHECK (safety_score BETWEEN 0 AND 100),
    status VARCHAR(20) NOT NULL DEFAULT 'Available'
        CHECK (status IN ('Available', 'On Trip', 'Off Duty', 'Suspended')),
    photo_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_license_expiry ON drivers(license_expiry);
