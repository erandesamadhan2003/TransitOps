import * as dashboardService from './dashboard.service.js';
import { generateCsv } from '../../utils/csv.js';
import { success } from '../../utils/response.js';

export const kpis = async (req, res, next) => {
    try {
        const { vehicleType, status, region } = req.query;
        const result = await dashboardService.getKPIs({ vehicleType, status, region });
        return success(res, { message: 'KPIs retrieved successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const charts = async (req, res, next) => {
    try {
        const monthsBack = parseInt(req.query.monthsBack, 10) || 6;
        const result = await dashboardService.getCharts(monthsBack);
        return success(res, { message: 'Charts retrieved successfully', data: result });
    } catch (err) {
        next(err);
    }
};
export const analytics = async (req, res, next) => {
    try {
        const isCsv = req.query.format === 'csv';
        // For CSV, fetch everything (no pagination)
        const page = isCsv ? null : req.query.page;
        const pageSize = isCsv ? null : req.query.pageSize;

        const result = await dashboardService.getAnalytics(page, pageSize);
        
        if (isCsv) {
            const csv = generateCsv(result.vehicles);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="analytics_summary.csv"');
            return res.send(csv);
        }

        return success(res, { message: 'Analytics retrieved successfully', data: result });
    } catch (err) {
        next(err);
    }
};
