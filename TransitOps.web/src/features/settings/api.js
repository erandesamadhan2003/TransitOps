import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const settingsApi = {
  getGeneral: () => api.get(ENDPOINTS.SETTINGS.GENERAL).then((r) => r.data),

  updateGeneral: (payload) =>
    api.patch(ENDPOINTS.SETTINGS.GENERAL, payload).then((r) => r.data),
};
