import * as XLSX from 'xlsx';

export const generateCsv = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return '';
    }
    const sheet = XLSX.utils.json_to_sheet(data);
    return XLSX.utils.sheet_to_csv(sheet);
};
