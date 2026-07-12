import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const driversApi = {
  getAll: (params) =>
    api.get(ENDPOINTS.DRIVERS.LIST, { params }).then((r) => r.data.data || r.data),

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

  verify: (id) =>
    api.patch(`${ENDPOINTS.DRIVERS.LIST}/${id}/verify`).then((r) => r.data.data || r.data),

  getDocuments: (id) =>
    api.get(`${ENDPOINTS.DRIVERS.LIST}/${id}/documents`).then((r) => r.data.data),

  uploadDocument: ({ id, formData }) =>
    api.post(`${ENDPOINTS.DRIVERS.LIST}/${id}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data.data),

  deleteDocument: ({ id, docId }) =>
    api.delete(`${ENDPOINTS.DRIVERS.LIST}/${id}/documents/${docId}`).then((r) => r.data),
};
