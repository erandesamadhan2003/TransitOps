ALTER TABLE vehicle_documents ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE driver_documents ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
