import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const vehiclesApi = {
  getAll: (params) =>
    api.get(ENDPOINTS.VEHICLES.LIST, { params }).then((r) => r.data.data || r.data),

  exportCsv: (params) =>
    api.get(ENDPOINTS.VEHICLES.LIST, { params: { ...params, format: "csv" }, responseType: "blob" }).then((r) => r.data),

  getDispatchable: () =>
    api.get(ENDPOINTS.VEHICLES.LIST, { params: { status: 'Available' } }).then((r) => r.data.data || r.data),

  getById: (id) => api.get(ENDPOINTS.VEHICLES.DETAIL(id)).then((r) => r.data.data || r.data),

  create: (payload) =>
    api.post(ENDPOINTS.VEHICLES.CREATE, payload).then((r) => r.data.data || r.data),

  update: (id, payload) =>
    api.put(ENDPOINTS.VEHICLES.UPDATE(id), payload).then((r) => r.data.data || r.data),

  retire: (id) => api.patch(ENDPOINTS.VEHICLES.RETIRE(id)).then((r) => r.data.data || r.data),
};
