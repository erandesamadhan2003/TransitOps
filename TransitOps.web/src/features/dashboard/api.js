import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const dashboardApi = {
  getKpis: (params) =>
    api.get(ENDPOINTS.DASHBOARD.KPIS, { params }).then((r) => r.data.data || r.data),

  getCharts: (params) =>
    api.get(ENDPOINTS.DASHBOARD.CHARTS, { params }).then((r) => r.data.data || r.data),
};
