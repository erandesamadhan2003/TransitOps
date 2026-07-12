import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const settingsApi = {
  getGeneral: () =>
    api.get(ENDPOINTS.SETTINGS.GENERAL).then((res) => res.data.data),

  updateGeneral: (payload) =>
    api.put(ENDPOINTS.SETTINGS.GENERAL, payload).then((res) => res.data.data),
};
