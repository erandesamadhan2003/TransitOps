import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const driversApi = {
  getAll: (params) =>
    api.get(ENDPOINTS.DRIVERS.LIST, { params }).then((r) => r.data.data || r.data),

  exportCsv: (params) =>
    api.get(ENDPOINTS.DRIVERS.LIST, { params: { ...params, format: "csv" }, responseType: "blob" }).then((r) => r.data),

  getDispatchable: () =>
    api.get(ENDPOINTS.DRIVERS.LIST, { params: { status: 'Available' } }).then((r) => r.data.data || r.data),

  getById: (id) => api.get(ENDPOINTS.DRIVERS.DETAIL(id)).then((r) => r.data.data || r.data),

  create: (payload) =>
    api.post(ENDPOINTS.DRIVERS.CREATE, payload).then((r) => r.data.data || r.data),

  update: (id, payload) =>
    api.put(ENDPOINTS.DRIVERS.UPDATE(id), payload).then((r) => r.data.data || r.data),

  suspend: (id) =>
    api.patch(ENDPOINTS.DRIVERS.SUSPEND(id)).then((r) => r.data.data || r.data),

  reinstate: (id) =>
    api.patch(ENDPOINTS.DRIVERS.REINSTATE(id)).then((r) => r.data.data || r.data),

  setOffDuty: (id) =>
    api.patch(ENDPOINTS.DRIVERS.OFF_DUTY(id)).then((r) => r.data.data || r.data),

  wake: (id) =>
    api.patch(ENDPOINTS.DRIVERS.WAKE(id)).then((r) => r.data.data || r.data),
};
