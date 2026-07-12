CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id),
    trip_id INTEGER REFERENCES trips(id),
    category VARCHAR(20) NOT NULL
        CHECK (category IN ('Fuel', 'Maintenance', 'Toll', 'Parking', 'Other')),
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    description TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_expenses_vehicle ON expenses(vehicle_id);
CREATE INDEX idx_expenses_category ON expenses(category);
