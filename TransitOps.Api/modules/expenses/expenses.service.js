import * as expensesModel from './expenses.model.js';
import * as vehiclesModel from '../vehicles/vehicles.model.js';
import * as tripsModel from '../trips/trips.model.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';

export const listExpenses = async ({ vehicleId, tripId, category, dateFrom, dateTo, page = 1, pageSize = 20 }) => {
    const limit = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limit;

    const filters = { vehicleId, tripId, category, dateFrom, dateTo, limit, offset };
    const expenses = await expensesModel.findAll(filters);
    const total = await expensesModel.countAll(filters);

    return {
        expenses,
        pagination: {
            page: Math.max(parseInt(page, 10) || 1, 1),
            pageSize: limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getExpenseById = async (id) => {
    const expense = await expensesModel.findById(id);
    if (!expense) throw new NotFoundError('Expense not found');
    return expense;
};

export const createExpense = async (data) => {
    if (data.category === 'Fuel') {
        throw new BadRequestError('Fuel purchases must be logged via /api/fuel-logs, not /api/expenses, to avoid double-counting in cost reports');
    }

    if (data.vehicleId) {
        const vehicle = await vehiclesModel.findById(data.vehicleId);
        if (!vehicle) throw new NotFoundError('Vehicle not found');
    }

    if (data.tripId) {
        const trip = await tripsModel.findById(data.tripId);
        if (!trip) throw new NotFoundError('Trip not found');
    }

    return expensesModel.create(data);
};

export const deleteExpense = async (id) => {
    const expense = await expensesModel.findById(id);
    if (!expense) throw new NotFoundError('Expense not found');

    await expensesModel.deleteById(id);
    return true;
};
