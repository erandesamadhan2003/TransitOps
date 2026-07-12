import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { maintenanceApi } from "./api";
import { useToast } from "@/hooks";
import { STALE_TIME } from "@/constants/app";

export function useMaintenance(params = {}) {
  return useQuery({
    queryKey: ["maintenance", params],
    queryFn: () => maintenanceApi.getAll(params),
    staleTime: STALE_TIME.DEFAULT,
  });
}

export function useCreateMaintenance() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: maintenanceApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
      toast.success("Maintenance record opened. Vehicle marked In Shop.");
    },
    onError: (err) =>
      toast.error(err.message || "Could not create maintenance record."),
  });
}

export function useCloseMaintenance() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, payload }) => maintenanceApi.close(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
      toast.success("Maintenance closed. Vehicle returned to Available.");
    },
    onError: (err) =>
      toast.error(err.message || "Could not close maintenance record."),
  });
}
