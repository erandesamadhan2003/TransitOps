import * as XLSX from 'xlsx';
import { ROLES } from '../../utils/constants.js';

export const generateImportTemplate = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Users Template
    const templateData = [
        ['Full Name', 'Email', 'Password', 'Role'],
        ['Jane Doe', 'jane@example.com', 'TempPass123', 'Dispatcher']
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Users');

    // Sheet 2: Valid Roles
    const rolesData = [
        ['Valid Roles'],
        ...Object.values(ROLES).map(role => [role])
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(rolesData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Valid Roles');

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

export const parseImportFile = (buffer) => {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]]; // Assuming data is in the first sheet
    
    // Parse to JSON array
    const rawData = XLSX.utils.sheet_to_json(ws, { defval: '' });
    
    // Normalize keys
    return rawData.map((row, index) => {
        return {
            rowNumber: index + 2, // 1 for header + 1 for 0-index offset
            fullName: row['Full Name']?.toString().trim() || '',
            email: row['Email']?.toString().trim() || '',
            password: row['Password']?.toString().trim() || '',
            roleName: row['Role']?.toString().trim() || ''
        };
    });
};
