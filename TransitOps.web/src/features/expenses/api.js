import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const expensesApi = {
  getFuelLogs: (params) =>
    api.get(ENDPOINTS.FUEL_LOGS.LIST, { params }).then((r) => r.data.data || r.data),

  createFuelLog: (payload) =>
    api.post(ENDPOINTS.FUEL_LOGS.CREATE, payload).then((r) => r.data.data || r.data),

  deleteFuelLog: (id) =>
    api.delete(ENDPOINTS.FUEL_LOGS.DELETE(id)).then((r) => r.data),

  getExpenses: (params) =>
    api.get(ENDPOINTS.EXPENSES.LIST, { params }).then((r) => r.data.data || r.data),

  createExpense: (payload) =>
    api.post(ENDPOINTS.EXPENSES.CREATE, payload).then((r) => r.data.data || r.data),

  deleteExpense: (id) =>
    api.delete(ENDPOINTS.EXPENSES.DELETE(id)).then((r) => r.data),
};
