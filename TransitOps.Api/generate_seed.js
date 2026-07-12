const fs = require('fs');
const hash = '$2b$10$7E0R6LtukM7CwtHDPHVFlOKp.VkyJc0Wjcz7jD9mxiPFSiHG/SYLy'; // 'password123'

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Rahul', 'Amit', 'Vikram', 'Ramesh', 'Suresh', 'Priya', 'Neha', 'Riya', 'Kavya', 'Sneha', 'Anjali', 'Meera', 'Pooja', 'Ananya', 'Kriti'];
const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Das', 'Joshi', 'Yadav', 'Gupta', 'Verma', 'Mishra', 'Chauhan', 'Nair', 'Reddy', 'Rao', 'Iyer', 'Menon', 'Bose', 'Chatterjee', 'Sengupta', 'Nath'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara'];

const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

let sql = '';

// 20 Users
sql += `-- Users\nINSERT INTO users (full_name, email, password_hash, role_id) VALUES\n`;
for(let i=1; i<=20; i++) {
    const fn = r(firstNames);
    const ln = r(lastNames);
    sql += `('${fn} ${ln}', 'user${i}@transitops.com', '${hash}', (SELECT id FROM roles ORDER BY random() LIMIT 1))`;
    sql += (i === 20) ? ' ON CONFLICT (email) DO NOTHING;\n\n' : ',\n';
}

// 20 Vehicles
sql += `-- Vehicles\nINSERT INTO vehicles (registration_number, vehicle_name, vehicle_type, max_capacity, odometer, purchase_cost, purchase_date, status, region) VALUES\n`;
const vNames = ['Tata Ace', 'Ashok Leyland Dost', 'Mahindra Bolero', 'Eicher Pro', 'Tata LPT', 'BharatBenz', 'Mahindra Furio'];
const vTypes = ['Van', 'Mini Truck', 'Heavy Truck', 'Trailer'];
const vStatuses = ['Available', 'On Trip', 'In Shop', 'Retired'];
for(let i=1; i<=20; i++) {
    const reg = `MH-${rNum(10, 50)}-AB-${rNum(1000, 9999)}`;
    const status = (i <= 5) ? 'On Trip' : (i <= 8 ? 'In Shop' : 'Available'); 
    sql += `('${reg}', '${r(vNames)}', '${r(vTypes)}', ${rNum(1000, 25000)}, ${rNum(500, 150000)}, ${rNum(500000, 3000000)}, '202${rNum(0,3)}-0${rNum(1,9)}-15', '${status}', '${r(cities)}')`;
    sql += (i === 20) ? ' ON CONFLICT (registration_number) DO NOTHING;\n\n' : ',\n';
}

// 20 Drivers
sql += `-- Drivers\nINSERT INTO drivers (name, license_number, license_category, license_expiry, contact_number, safety_score, status) VALUES\n`;
const dStatuses = ['Available', 'On Trip', 'Off Duty', 'Suspended'];
for(let i=1; i<=20; i++) {
    const fn = r(firstNames);
    const ln = r(lastNames);
    const lic = `MH${rNum(10,99)}${rNum(1000000000, 9999999999)}`;
    const status = (i <= 5) ? 'On Trip' : (i <= 8 ? 'Off Duty' : 'Available'); 
    sql += `('${fn} ${ln}', '${lic}', 'HMV', '202${rNum(6,9)}-0${rNum(1,9)}-15', '98${rNum(10000000,99999999)}', ${rNum(60, 100)}, '${status}')`;
    sql += (i === 20) ? ' ON CONFLICT (license_number) DO NOTHING;\n\n' : ',\n';
}

// 25 Trips
sql += `-- Trips\nINSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, actual_distance, fuel_consumed, status) VALUES\n`;
const tStatuses = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];
for(let i=1; i<=25; i++) {
    const status = r(tStatuses);
    const pd = rNum(50, 1000);
    const ad = status === 'Completed' ? pd + rNum(-10, 50) : null;
    const fc = status === 'Completed' ? ad / rNum(5, 15) : null;
    sql += `('${r(cities)}', '${r(cities)}', ${rNum(1,20)}, ${rNum(1,20)}, ${rNum(100, 15000)}, ${pd}, ${ad || 'NULL'}, ${fc ? fc.toFixed(2) : 'NULL'}, '${status}')`;
    sql += (i === 25) ? ';\n\n' : ',\n';
}

// 20 Maintenance Logs
sql += `-- Maintenance\nINSERT INTO maintenance_logs (vehicle_id, issue, description, cost, start_date, end_date, status) VALUES\n`;
const issues = ['Oil Change', 'Brake Pad Replacement', 'AC Repair', 'Engine Tuning', 'Tire Alignment', 'Battery Replacement'];
for(let i=1; i<=20; i++) {
    const status = i % 4 === 0 ? 'Open' : 'Closed';
    const ed = status === 'Closed' ? `'2023-11-${rNum(10, 28)}'` : 'NULL';
    sql += `(${rNum(1,20)}, '${r(issues)}', 'Routine maintenance check and repairs.', ${rNum(1500, 25000)}, '2023-11-01', ${ed}, '${status}')`;
    sql += (i === 20) ? ';\n\n' : ',\n';
}

// 25 Fuel Logs
sql += `-- Fuel Logs\nINSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, log_date) VALUES\n`;
for(let i=1; i<=25; i++) {
    const l = rNum(20, 200);
    const c = l * rNum(90, 105);
    sql += `(${rNum(1,20)}, ${rNum(1,25)}, ${l}, ${c}, '2023-12-${rNum(10, 28)}')`;
    sql += (i === 25) ? ';\n\n' : ',\n';
}

// 25 Expenses
sql += `-- Expenses\nINSERT INTO expenses (vehicle_id, trip_id, category, amount, description, expense_date) VALUES\n`;
const eCats = ['Toll', 'Parking', 'Other'];
for(let i=1; i<=25; i++) {
    sql += `(${rNum(1,20)}, ${rNum(1,25)}, '${r(eCats)}', ${rNum(50, 1500)}, 'On trip expenses.', '2023-12-${rNum(10, 28)}')`;
    sql += (i === 25) ? ';\n\n' : ',\n';
}

fs.writeFileSync('db/seeds/004_seed_large_dataset.sql', sql);
console.log('Seed SQL generated.');
