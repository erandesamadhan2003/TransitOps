import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const tripsApi = {
  getAll: (params) =>
    api.get(ENDPOINTS.TRIPS.LIST, { params }).then((r) => r.data.data || r.data),

  getById: (id) =>
    api.get(ENDPOINTS.TRIPS.DETAIL(id)).then((r) => r.data.data || r.data),

  create: (payload) =>
    api.post(ENDPOINTS.TRIPS.CREATE, payload).then((r) => r.data.data || r.data),

  dispatch: (id) =>
    api.patch(ENDPOINTS.TRIPS.DISPATCH(id)).then((r) => r.data.data || r.data),

  complete: (id, payload) =>
    api.patch(ENDPOINTS.TRIPS.COMPLETE(id), payload).then((r) => r.data.data || r.data),

  cancel: (id) =>
    api.patch(ENDPOINTS.TRIPS.CANCEL(id)).then((r) => r.data.data || r.data),
};
