import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const usersApi = {
  getAll: (params) => api.get(ENDPOINTS.USERS.LIST, { params }).then((res) => res.data.data),

  getById: (id) => api.get(ENDPOINTS.USERS.DETAIL(id)).then((res) => res.data.data),

  create: (payload) => api.post(ENDPOINTS.USERS.CREATE, payload).then((res) => res.data.data),

  update: (id, payload) => api.put(ENDPOINTS.USERS.UPDATE(id), payload).then((res) => res.data.data),

  delete: (id) => api.delete(ENDPOINTS.USERS.DELETE(id)).then((res) => res.data.data),

  changePassword: (id, payload) =>
    api.patch(ENDPOINTS.USERS.CHANGE_PASSWORD(id), payload).then((res) => res.data.data),

  deactivate: (id) => api.patch(ENDPOINTS.USERS.DEACTIVATE(id)).then((res) => res.data.data),

  activate: (id) => api.patch(ENDPOINTS.USERS.ACTIVATE(id)).then((res) => res.data.data),

  importUsers: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(ENDPOINTS.USERS.IMPORT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => res.data.data);
  },

  downloadTemplate: () =>
    api
      .get(ENDPOINTS.USERS.IMPORT_TEMPLATE, { responseType: "blob" })
      .then((res) => res.data),
};
