import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "./api";
import { STALE_TIME } from "@/constants/app";

export function useChartsData(params = {}) {
  return useQuery({
    queryKey: ["dashboard-charts", params],
    queryFn: () => reportsApi.getCharts(params),
    staleTime: STALE_TIME.DEFAULT,
  });
}

export function useKpisData() {
  return useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: reportsApi.getKpis,
    staleTime: STALE_TIME.SHORT,
  });
}

export function useAnalyticsData() {
  return useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: reportsApi.getAnalytics,
    staleTime: STALE_TIME.DEFAULT,
  });
}
