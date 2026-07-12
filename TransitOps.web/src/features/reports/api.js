import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const reportsApi = {
  getCharts: (params) =>
    api.get(ENDPOINTS.DASHBOARD.CHARTS, { params }).then((r) => r.data.data || r.data),

  getKpis: () =>
    api.get(ENDPOINTS.DASHBOARD.KPIS).then((r) => r.data.data || r.data),
};
