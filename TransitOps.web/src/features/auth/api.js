import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const authApi = {
  login: (credentials) =>
    api.post(ENDPOINTS.AUTH.LOGIN, credentials).then((r) => r.data.data),

  me: () => api.get(ENDPOINTS.AUTH.ME).then((r) => r.data.data),

  logout: () => api.post(ENDPOINTS.AUTH.LOGOUT).then((r) => r.data),
};
