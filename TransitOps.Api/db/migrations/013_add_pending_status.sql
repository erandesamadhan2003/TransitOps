-- Drop and recreate constraint for vehicles
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_status_check;
ALTER TABLE vehicles ADD CONSTRAINT vehicles_status_check CHECK (status IN ('Pending', 'Available', 'On Trip', 'In Shop', 'Retired'));

-- Update default value for vehicles
ALTER TABLE vehicles ALTER COLUMN status SET DEFAULT 'Pending';

-- Drop and recreate constraint for drivers
ALTER TABLE drivers DROP CONSTRAINT IF EXISTS drivers_status_check;
ALTER TABLE drivers ADD CONSTRAINT drivers_status_check CHECK (status IN ('Pending', 'Available', 'On Trip', 'Off Duty', 'Suspended'));

-- Update default value for drivers
ALTER TABLE drivers ALTER COLUMN status SET DEFAULT 'Pending';
