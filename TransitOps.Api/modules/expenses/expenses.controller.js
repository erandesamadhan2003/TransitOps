import * as expensesService from './expenses.service.js';
import { success, created } from '../../utils/response.js';

export const list = async (req, res, next) => {
    try {
        const { vehicleId, tripId, category, dateFrom, dateTo, page, pageSize } = req.query;
        const result = await expensesService.listExpenses({ vehicleId, tripId, category, dateFrom, dateTo, page, pageSize });
        return success(res, { message: 'Expenses retrieved successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const expense = await expensesService.getExpenseById(req.params.id);
        return success(res, { message: 'Expense retrieved successfully', data: expense });
    } catch (err) {
        next(err);
    }
};

export const create = async (req, res, next) => {
    try {
        const expense = await expensesService.createExpense(req.body);
        return created(res, { message: 'Expense created successfully', data: expense });
    } catch (err) {
        next(err);
    }
};

export const remove = async (req, res, next) => {
    try {
        await expensesService.deleteExpense(req.params.id);
        return success(res, { message: 'Expense deleted successfully' });
    } catch (err) {
        next(err);
    }
};
