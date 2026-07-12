-- Seed Vehicles
INSERT INTO vehicles (registration_number, vehicle_name, vehicle_type, max_capacity, odometer, status) VALUES
('VAN-05', 'Ford Transit 250', 'Van', 1500, 12500, 'Available'),
('TRUCK-11', 'Volvo VNL 860', 'Truck', 12000, 45000, 'Available'),
('MINI-03', 'Toyota Sienna', 'Minivan', 800, 3200, 'Available')
ON CONFLICT (registration_number) DO NOTHING;

-- Seed Drivers
INSERT INTO drivers (name, license_number, license_category, license_expiry, contact_number, status) VALUES
('Alex', 'DL-ALEX-1', 'Commercial', '2030-12-31', '555-0101', 'Available'),
('John', 'DL-JOHN-2', 'Heavy', '2029-05-20', '555-0102', 'Available'),
('Priya', 'DL-PRIYA-3', 'Commercial', '2031-01-15', '555-0103', 'Available'),
('Suresh', 'DL-SURESH-4', 'Heavy', '2028-11-11', '555-0104', 'Available')
ON CONFLICT (license_number) DO NOTHING;

-- Seed Trips
INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, actual_distance, fuel_consumed, status, dispatched_at, completed_at, created_by)
SELECT 
    'Warehouse A', 'Store B', 
    (SELECT id FROM vehicles WHERE registration_number = 'VAN-05'),
    (SELECT id FROM drivers WHERE license_number = 'DL-ALEX-1'),
    500, 120, 125, 12.5, 'Completed', now() - interval '2 days', now() - interval '1 days',
    (SELECT id FROM users WHERE email = 'dispatcher@transitops.com')
WHERE NOT EXISTS (SELECT 1 FROM trips WHERE source = 'Warehouse A' AND destination = 'Store B' AND status = 'Completed');

INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status, created_by)
SELECT 
    'Factory C', 'Port D', 
    (SELECT id FROM vehicles WHERE registration_number = 'TRUCK-11'),
    (SELECT id FROM drivers WHERE license_number = 'DL-JOHN-2'),
    8000, 450, 'Draft',
    (SELECT id FROM users WHERE email = 'dispatcher@transitops.com')
WHERE NOT EXISTS (SELECT 1 FROM trips WHERE source = 'Factory C' AND destination = 'Port D' AND status = 'Draft');
