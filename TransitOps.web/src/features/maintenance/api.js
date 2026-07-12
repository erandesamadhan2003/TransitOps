import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const maintenanceApi = {
  getAll: (params) =>
    api.get(ENDPOINTS.MAINTENANCE.LIST, { params }).then((r) => r.data.data || r.data),

  getById: (id) =>
    api.get(ENDPOINTS.MAINTENANCE.DETAIL(id)).then((r) => r.data.data || r.data),

  create: (payload) =>
    api.post(ENDPOINTS.MAINTENANCE.CREATE, payload).then((r) => r.data.data || r.data),

  close: (id, payload = {}) =>
    api.patch(ENDPOINTS.MAINTENANCE.CLOSE(id), payload).then((r) => r.data.data || r.data),
};
