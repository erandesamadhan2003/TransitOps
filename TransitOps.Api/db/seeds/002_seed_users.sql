INSERT INTO users (full_name, email, password_hash, role_id) VALUES
('System Admin', 'admin@transitops.com', '$2b$10$ITJCIER9bwagMPs00u5Edey.9BwaEHU.zOmSrb30iFQADRnV4Zng2', (SELECT id FROM roles WHERE name = 'Admin')),
('Fleet Manager', 'fleet@transitops.com', '$2b$10$ITJCIER9bwagMPs00u5Edey.9BwaEHU.zOmSrb30iFQADRnV4Zng2', (SELECT id FROM roles WHERE name = 'Fleet Manager')),
('Dispatcher', 'dispatcher@transitops.com', '$2b$10$ITJCIER9bwagMPs00u5Edey.9BwaEHU.zOmSrb30iFQADRnV4Zng2', (SELECT id FROM roles WHERE name = 'Dispatcher')),
('Safety Officer', 'safety@transitops.com', '$2b$10$ITJCIER9bwagMPs00u5Edey.9BwaEHU.zOmSrb30iFQADRnV4Zng2', (SELECT id FROM roles WHERE name = 'Safety Officer')),
('Financial Analyst', 'finance@transitops.com', '$2b$10$ITJCIER9bwagMPs00u5Edey.9BwaEHU.zOmSrb30iFQADRnV4Zng2', (SELECT id FROM roles WHERE name = 'Financial Analyst'))
ON CONFLICT (email) DO NOTHING;
