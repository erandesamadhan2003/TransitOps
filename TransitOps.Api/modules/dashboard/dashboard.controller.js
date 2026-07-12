import * as dashboardService from './dashboard.service.js';
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
        const result = await dashboardService.getAnalytics();
        return success(res, { message: 'Analytics retrieved successfully', data: result });
    } catch (err) {
        next(err);
    }
};
