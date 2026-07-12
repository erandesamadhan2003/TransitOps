INSERT INTO users (full_name, email, password_hash, role_id) VALUES
('System Admin', 'admin@transitops.com', '$2b$10$7E0R6LtukM7CwtHDPHVFlOKp.VkyJc0Wjcz7jD9mxiPFSiHG/SYLy', (SELECT id FROM roles WHERE name = 'Admin')),
('Fleet Manager', 'fleet@transitops.com', '$2b$10$7E0R6LtukM7CwtHDPHVFlOKp.VkyJc0Wjcz7jD9mxiPFSiHG/SYLy', (SELECT id FROM roles WHERE name = 'Fleet Manager')),
('Dispatcher', 'dispatcher@transitops.com', '$2b$10$7E0R6LtukM7CwtHDPHVFlOKp.VkyJc0Wjcz7jD9mxiPFSiHG/SYLy', (SELECT id FROM roles WHERE name = 'Dispatcher')),
('Safety Officer', 'safety@transitops.com', '$2b$10$7E0R6LtukM7CwtHDPHVFlOKp.VkyJc0Wjcz7jD9mxiPFSiHG/SYLy', (SELECT id FROM roles WHERE name = 'Safety Officer')),
('Financial Analyst', 'finance@transitops.com', '$2b$10$7E0R6LtukM7CwtHDPHVFlOKp.VkyJc0Wjcz7jD9mxiPFSiHG/SYLy', (SELECT id FROM roles WHERE name = 'Financial Analyst'))
ON CONFLICT (email) DO NOTHING;