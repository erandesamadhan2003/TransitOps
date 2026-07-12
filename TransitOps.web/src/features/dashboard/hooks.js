import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./api";
import { STALE_TIME } from "@/constants/app";

export function useDashboardKpis(filters = {}) {
  return useQuery({
    queryKey: ["dashboard-kpis", filters],
    queryFn: () => dashboardApi.getKpis(filters),
    staleTime: STALE_TIME.SHORT,
  });
}

export function useDashboardCharts(params = {}) {
  return useQuery({
    queryKey: ["dashboard-charts", params],
    queryFn: () => dashboardApi.getCharts(params),
    staleTime: STALE_TIME.DEFAULT,
  });
}
