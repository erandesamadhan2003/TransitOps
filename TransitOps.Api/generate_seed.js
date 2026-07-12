import fs from 'fs';

// We are not altering users in this file to preserve login credentials.
// The user generation from the original script is kept identical to not break anything.
const hash = '$2b$10$7E0R6LtukM7CwtHDPHVFlOKp.VkyJc0Wjcz7jD9mxiPFSiHG/SYLy'; // 'password123'

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Rahul', 'Amit', 'Vikram', 'Ramesh', 'Suresh', 'Priya', 'Neha', 'Riya', 'Kavya', 'Sneha', 'Anjali', 'Meera', 'Pooja', 'Ananya', 'Kriti'];
const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Das', 'Joshi', 'Yadav', 'Gupta', 'Verma', 'Mishra', 'Chauhan', 'Nair', 'Reddy', 'Rao', 'Iyer', 'Menon', 'Bose', 'Chatterjee', 'Sengupta', 'Nath'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara'];

const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const getRandomDate = (monthsBackMin = 0, monthsBackMax = 5) => {
    const d = new Date();
    d.setMonth(d.getMonth() - rNum(monthsBackMin, monthsBackMax));
    d.setDate(d.getDate() - rNum(0, 28));
    return d.toISOString().slice(0, 10);
};

let sql = '';

// 20 Users (Keeping this exactly as requested so logins aren't changed)
sql += `-- Users\nINSERT INTO users (full_name, email, password_hash, role_id) VALUES\n`;
for(let i=1; i<=20; i++) {
    const fn = r(firstNames);
    const ln = r(lastNames);
    sql += `('${fn} ${ln}', 'user${i}@transitops.com', '${hash}', (SELECT id FROM roles ORDER BY random() LIMIT 1))`;
    sql += (i === 20) ? ' ON CONFLICT (email) DO NOTHING;\n\n' : ',\n';
}

// 40 Vehicles
sql += `-- Vehicles\nINSERT INTO vehicles (registration_number, vehicle_name, vehicle_type, max_capacity, odometer, purchase_cost, purchase_date, status, region) VALUES\n`;
const vNames = ['Tata Ace', 'Ashok Leyland Dost', 'Mahindra Bolero', 'Eicher Pro', 'Tata LPT', 'BharatBenz 1014R', 'Mahindra Furio 7', 'Tata Signa 4825.TK', 'Volvo FM 400', 'Swaraj Mazda'];
const vTypes = ['Van', 'Mini Truck', 'Heavy Truck', 'Trailer'];
for(let i=1; i<=40; i++) {
    const reg = `MH-${rNum(10, 50)}-AB-${rNum(1000, 9999)}`;
    const status = (i <= 10) ? 'On Trip' : (i <= 15 ? 'In Shop' : (i <= 38 ? 'Available' : 'Retired')); 
    const capacity = rNum(1000, 40000); // 1 to 40 tons
    const cost = capacity * rNum(50, 100);
    const date = getRandomDate(12, 36); // purchased 1 to 3 years ago
    sql += `('${reg}', '${r(vNames)}', '${r(vTypes)}', ${capacity}, ${rNum(5000, 150000)}, ${cost}, '${date}', '${status}', '${r(cities)}')`;
    sql += (i === 40) ? ' ON CONFLICT (registration_number) DO NOTHING;\n\n' : ',\n';
}

// 40 Drivers
sql += `-- Drivers\nINSERT INTO drivers (name, license_number, license_category, license_expiry, contact_number, safety_score, status) VALUES\n`;
for(let i=1; i<=40; i++) {
    const fn = r(firstNames);
    const ln = r(lastNames);
    const lic = `MH${rNum(10,99)}${rNum(1000000000, 9999999999)}`;
    const status = (i <= 10) ? 'On Trip' : (i <= 15 ? 'Off Duty' : (i <= 38 ? 'Available' : 'Suspended')); 
    const expiryDate = new Date();
    // Mostly valid, some expiring soon, a couple expired
    expiryDate.setDate(expiryDate.getDate() + rNum(-10, 1000));
    const safety = rNum(55, 100);
    sql += `('${fn} ${ln}', '${lic}', '${r(['LMV', 'HMV'])}', '${expiryDate.toISOString().slice(0,10)}', '98${rNum(10000000,99999999)}', ${safety}, '${status}')`;
    sql += (i === 40) ? ' ON CONFLICT (license_number) DO NOTHING;\n\n' : ',\n';
}

// 120 Trips (Over 6 months to give rich charts)
sql += `-- Trips\nINSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, actual_distance, fuel_consumed, revenue, status, created_at, dispatched_at, completed_at) VALUES\n`;
for(let i=1; i<=120; i++) {
    const status = (i <= 100) ? 'Completed' : (i <= 110 ? 'Dispatched' : (i <= 115 ? 'Draft' : 'Cancelled'));
    const pd = rNum(50, 1200);
    const ad = status === 'Completed' ? pd + rNum(-10, 50) : null;
    const fc = status === 'Completed' ? (ad / rNum(3, 10)).toFixed(2) : null;
    const rev = status === 'Completed' ? (ad * rNum(50, 120)).toFixed(2) : '0.00';
    const weight = rNum(100, 900); // Keep it low so we don't violate capacity blindly
    const createdDate = getRandomDate(0, 5);
    const dispatchedDate = status !== 'Draft' && status !== 'Cancelled' ? `'${createdDate}'` : 'NULL';
    const completedDate = status === 'Completed' ? `'${createdDate}'` : 'NULL';
    
    sql += `('${r(cities)}', '${r(cities)}', ${rNum(1,40)}, ${rNum(1,40)}, ${weight}, ${pd}, ${ad || 'NULL'}, ${fc || 'NULL'}, ${rev}, '${status}', '${createdDate}', ${dispatchedDate}, ${completedDate})`;
    sql += (i === 120) ? ';\n\n' : ',\n';
}

// 40 Maintenance Logs
sql += `-- Maintenance Logs\nINSERT INTO maintenance_logs (vehicle_id, issue, description, cost, start_date, end_date, status) VALUES\n`;
const issuesList = ['Oil Change', 'Brake Pad Replacement', 'AC Repair', 'Engine Tuning', 'Tire Alignment', 'Battery Replacement', 'Transmission Overhaul', 'Radiator Flush'];
for(let i=1; i<=40; i++) {
    const status = i % 5 === 0 ? 'Open' : 'Closed';
    const sDate = getRandomDate(0, 5);
    const eDate = status === 'Closed' ? `'${sDate}'` : 'NULL';
    sql += `(${rNum(1,40)}, '${r(issuesList)}', 'Routine industrial maintenance and repairs for optimal performance.', ${rNum(1500, 35000)}, '${sDate}', ${eDate}, '${status}')`;
    sql += (i === 40) ? ';\n\n' : ',\n';
}

// 80 Fuel Logs
sql += `-- Fuel Logs\nINSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, log_date) VALUES\n`;
for(let i=1; i<=80; i++) {
    const l = rNum(40, 300);
    const c = l * rNum(90, 105);
    sql += `(${rNum(1,40)}, ${rNum(1,100)}, ${l}, ${c}, '${getRandomDate(0, 5)}')`; // Bind to the first 100 trips which are completed
    sql += (i === 80) ? ';\n\n' : ',\n';
}

// 60 Expenses
sql += `-- Expenses\nINSERT INTO expenses (vehicle_id, trip_id, category, amount, description, expense_date) VALUES\n`;
const eCatsList = ['Toll', 'Parking', 'Other'];
for(let i=1; i<=60; i++) {
    sql += `(${rNum(1,40)}, ${rNum(1,100)}, '${r(eCatsList)}', ${rNum(100, 4500)}, 'Standard route transit expense.', '${getRandomDate(0, 5)}')`;
    sql += (i === 60) ? ';\n\n' : ',\n';
}

fs.writeFileSync('db/seeds/004_seed_large_dataset.sql', sql);
console.log('Seed SQL generated.');
