import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const vehiclesApi = {
  getAll: (params) =>
    api.get(ENDPOINTS.VEHICLES.LIST, { params }).then((r) => r.data.data || r.data),

  getDispatchable: () =>
    api.get(ENDPOINTS.VEHICLES.LIST, { params: { status: 'Available' } }).then((r) => r.data.data || r.data),

  getById: (id) => api.get(ENDPOINTS.VEHICLES.DETAIL(id)).then((r) => r.data.data || r.data),

  create: (payload) =>
    api.post(ENDPOINTS.VEHICLES.CREATE, payload).then((r) => r.data.data || r.data),

  update: (id, payload) =>
    api.put(ENDPOINTS.VEHICLES.UPDATE(id), payload).then((r) => r.data.data || r.data),

  retire: (id) => api.patch(ENDPOINTS.VEHICLES.RETIRE(id)).then((r) => r.data.data || r.data),
  verify: (id) => api.patch(`${ENDPOINTS.VEHICLES.LIST}/${id}/verify`).then((r) => r.data.data || r.data),
  getDocuments: (id) =>
    api.get(`${ENDPOINTS.VEHICLES.LIST}/${id}/documents`).then((r) => r.data.data),

  uploadDocument: ({ id, formData }) =>
    api.post(`${ENDPOINTS.VEHICLES.LIST}/${id}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data.data),

  deleteDocument: ({ id, docId }) =>
    api.delete(`${ENDPOINTS.VEHICLES.LIST}/${id}/documents/${docId}`).then((r) => r.data),
};
