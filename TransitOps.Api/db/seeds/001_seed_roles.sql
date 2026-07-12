INSERT INTO roles (name) VALUES
('Admin'),
('Fleet Manager'),
('Dispatcher'),
('Safety Officer'),
('Financial Analyst')
ON CONFLICT (name) DO NOTHING;
